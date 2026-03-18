import asyncio
import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile
from pydantic import BaseModel

from app.core.config import get_settings
from app.services.claude_service import analyze_video
from app.services.notion_service import create_analysis_page

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/video", tags=["Analyzer"])

ALLOWED_MIME_TYPES = {"video/mp4", "video/quicktime", "video/x-msvideo"}
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi"}


class AnalyzerResult(BaseModel):
    title: str
    summary: str
    key_insights: list[str]
    content_ideas: list[str]
    captions: list[str]
    hashtags: list[str]


class UploadResponse(BaseModel):
    analysis: AnalyzerResult
    notion_page_url: str


async def _save_upload(file: UploadFile, upload_dir: Path) -> Path:
    """Stream an UploadFile to disk, enforcing max size."""
    settings = get_settings()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    suffix = Path(file.filename or "video.mp4").suffix.lower() or ".mp4"
    dest = upload_dir / f"{uuid.uuid4()}{suffix}"

    total_written = 0
    with dest.open("wb") as f:
        while True:
            chunk = await file.read(1024 * 1024)  # 1 MB chunks
            if not chunk:
                break
            total_written += len(chunk)
            if total_written > max_bytes:
                dest.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB",
                )
            f.write(chunk)

    return dest


async def _extract_audio(video_path: Path, upload_dir: Path) -> Path:
    """
    Extract audio from a video file using ffmpeg.

    Returns the path to the extracted .mp3 file.
    Raises HTTPException(422) if ffmpeg is not available or extraction fails.
    """
    audio_path = upload_dir / f"{video_path.stem}_audio.mp3"

    cmd = [
        "ffmpeg",
        "-y",                  # overwrite if exists
        "-i", str(video_path),
        "-vn",                 # drop video stream
        "-acodec", "libmp3lame",
        "-q:a", "4",           # VBR quality (lower = better; 4 ≈ ~165 kbps)
        str(audio_path),
    ]

    logger.info("Extracting audio: %s -> %s", video_path.name, audio_path.name)

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr_bytes = await proc.communicate()

    if proc.returncode != 0:
        stderr_text = stderr_bytes.decode("utf-8", errors="replace").strip()
        logger.error("ffmpeg failed (exit %d): %s", proc.returncode, stderr_text[:400])
        raise HTTPException(
            status_code=422,
            detail=f"Audio extraction failed: {stderr_text[:200]}",
        )

    if not audio_path.exists():
        raise HTTPException(status_code=500, detail="ffmpeg succeeded but audio file not found")

    return audio_path


@router.post("/upload", response_model=UploadResponse)
async def upload_and_analyze(file: UploadFile) -> UploadResponse:
    """
    Accept an MP4 upload, analyze it with Claude, and create a Notion page.

    Steps:
    1. Validate file type and size (max 100 MB)
    2. Save to uploads directory
    3. Extract audio via ffmpeg
    4. Send audio to Claude for structured analysis
    5. Create Notion page with the analysis
    6. Return the structured analysis + Notion page URL
    """
    settings = get_settings()
    upload_dir = Path(settings.UPLOAD_DIR).resolve()

    # --- Validate content type ---
    content_type = file.content_type or ""
    filename = file.filename or ""
    file_ext = Path(filename).suffix.lower()

    if content_type not in ALLOWED_MIME_TYPES and file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail="Only MP4, MOV, and AVI video files are accepted",
        )

    video_path: Path | None = None
    audio_path: Path | None = None

    try:
        # 1. Save upload
        video_path = await _save_upload(file, upload_dir)
        logger.info("Saved upload: %s (%d bytes)", video_path.name, video_path.stat().st_size)

        # 2. Extract audio (smaller payload for Claude)
        audio_path = await _extract_audio(video_path, upload_dir)

        # 3. Analyze with Claude
        try:
            analysis_data = await analyze_video(str(audio_path))
        except FileNotFoundError as exc:
            raise HTTPException(status_code=500, detail="Analysis file missing") from exc
        except Exception as exc:
            logger.exception("Claude analysis failed")
            raise HTTPException(
                status_code=502,
                detail=f"Video analysis failed: {exc}",
            ) from exc

        # 4. Create Notion page
        try:
            notion_url = await create_analysis_page(analysis_data)
        except Exception as exc:
            logger.exception("Notion page creation failed")
            raise HTTPException(
                status_code=502,
                detail=f"Notion page creation failed: {exc}",
            ) from exc

        return UploadResponse(
            analysis=AnalyzerResult(
                title=analysis_data.get("title", ""),
                summary=analysis_data.get("summary", ""),
                key_insights=analysis_data.get("key_insights", []),
                content_ideas=analysis_data.get("content_ideas", []),
                captions=analysis_data.get("captions", []),
                hashtags=analysis_data.get("hashtags", []),
            ),
            notion_page_url=notion_url,
        )

    finally:
        # Always clean up temp files, even on error
        for path in [video_path, audio_path]:
            if path and path.exists():
                try:
                    path.unlink()
                except OSError as exc:
                    logger.warning("Could not delete temp file %s: %s", path, exc)
