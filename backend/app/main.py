import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.routers import analyzer, tiktok, travel

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Create required directories at startup."""
    settings = get_settings()

    for dir_path in (settings.UPLOAD_DIR, settings.DOWNLOAD_DIR):
        path = Path(dir_path)
        path.mkdir(parents=True, exist_ok=True)
        logger.info("Ensured directory exists: %s", path.resolve())

    yield
    # Shutdown: nothing to clean up — yt-dlp and ffmpeg are subprocess-based


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="MMO Dashboard API",
        description="Backend for TikTok Downloader and Video Analyzer features",
        version="1.0.0",
        lifespan=lifespan,
    )

    # --- CORS ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Routers ---
    app.include_router(tiktok.router, prefix="/api")
    app.include_router(analyzer.router, prefix="/api")
    app.include_router(travel.router, prefix="/api")

    # --- Static file serving for downloaded videos ---
    # Must be mounted AFTER routers so the /api/tiktok/files/{filename} route
    # in the router takes precedence over static mount for the FileResponse path.
    downloads_path = Path(settings.DOWNLOAD_DIR)
    downloads_path.mkdir(parents=True, exist_ok=True)
    app.mount(
        "/api/tiktok/files",
        StaticFiles(directory=str(downloads_path)),
        name="downloads",
    )

    @app.get("/health", tags=["Health"])
    async def health_check() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
