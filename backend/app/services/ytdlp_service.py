import asyncio
import json
import logging
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)


class YtdlpError(Exception):
    """Raised when yt-dlp fails to download or parse output."""


async def download_tiktok(url: str, download_dir: str) -> dict:
    """
    Download a TikTok video using yt-dlp as an async subprocess.

    Returns a dict with keys:
        filename (str): UUID-based .mp4 filename
        file_path (str): absolute path on disk
        title (str): video title from metadata
        duration (float | None): duration in seconds
    """
    output_filename = f"{uuid.uuid4()}.mp4"
    output_path = Path(download_dir) / output_filename

    cmd = [
        "yt-dlp",
        "--format", "mp4",
        "--output", str(output_path),
        "--print-json",
        "--no-playlist",
        "--no-warnings",
        # Avoid rate-limit / bot-check issues on TikTok
        "--add-header", "User-Agent:Mozilla/5.0",
        url,
    ]

    logger.info("Starting yt-dlp download: %s -> %s", url, output_path)

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    stdout_bytes, stderr_bytes = await proc.communicate()

    if proc.returncode != 0:
        stderr_text = stderr_bytes.decode("utf-8", errors="replace").strip()
        logger.error("yt-dlp exited with code %d: %s", proc.returncode, stderr_text)
        raise YtdlpError(f"yt-dlp failed (exit {proc.returncode}): {stderr_text[:400]}")

    # yt-dlp --print-json may emit multiple JSON lines for playlists; take the last valid one
    metadata: dict = {}
    for line in stdout_bytes.decode("utf-8", errors="replace").splitlines():
        line = line.strip()
        if line.startswith("{"):
            try:
                metadata = json.loads(line)
            except json.JSONDecodeError:
                pass  # keep trying subsequent lines

    if not output_path.exists():
        raise YtdlpError("yt-dlp reported success but output file not found on disk")

    title: str = metadata.get("title") or metadata.get("fulltitle") or "TikTok Video"
    duration: float | None = metadata.get("duration")  # seconds, may be None

    logger.info("Download complete: %s (title=%r, duration=%s)", output_filename, title, duration)

    return {
        "filename": output_filename,
        "file_path": str(output_path.resolve()),
        "title": title,
        "duration": duration,
    }
