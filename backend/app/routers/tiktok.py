import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator

from app.core.config import get_settings
from app.services.ytdlp_service import YtdlpError, download_tiktok

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tiktok", tags=["TikTok"])


class DownloadRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def must_be_tiktok_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL must not be empty")
        # Accept both tiktok.com and vm.tiktok.com (short links)
        if "tiktok.com" not in v.lower():
            raise ValueError("URL must be a TikTok link (must contain tiktok.com)")
        return v


class DownloadResponse(BaseModel):
    filename: str
    download_url: str
    title: str
    duration: float | None


@router.post("/download", response_model=DownloadResponse)
async def download_video(body: DownloadRequest, request: Request) -> DownloadResponse:
    """
    Download a TikTok video by URL.

    Runs yt-dlp as an async subprocess and returns metadata plus a
    server-relative download URL for the saved MP4.
    """
    settings = get_settings()

    try:
        result = await download_tiktok(body.url, settings.DOWNLOAD_DIR)
    except YtdlpError as exc:
        logger.error("yt-dlp failed for %s: %s", body.url, exc)
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error during TikTok download")
        raise HTTPException(status_code=500, detail="Download failed unexpectedly") from exc

    # Build an absolute download URL using the incoming request's base URL
    base_url = str(request.base_url).rstrip("/")
    download_url = f"{base_url}/api/tiktok/files/{result['filename']}"

    return DownloadResponse(
        filename=result["filename"],
        download_url=download_url,
        title=result["title"],
        duration=result["duration"],
    )


@router.get("/files/{filename}")
async def serve_file(filename: str) -> FileResponse:
    """
    Serve a previously downloaded MP4 file as an attachment.

    Path traversal is prevented by resolving against the download dir
    and verifying the resolved path stays within it.
    """
    settings = get_settings()
    download_dir = Path(settings.DOWNLOAD_DIR).resolve()
    file_path = (download_dir / filename).resolve()

    # Security: ensure resolved path is inside the download directory
    if not str(file_path).startswith(str(download_dir)):
        raise HTTPException(status_code=400, detail="Invalid filename")

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=str(file_path),
        media_type="video/mp4",
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
