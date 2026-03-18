"""
travel.py — FastAPI router for the Travel Analysis feature.

Endpoints:
    POST /travel/analyze   — Download TikTok video + run analysis pipeline (background)
    GET  /travel/jobs      — List all travel jobs from Firestore, newest first
    DELETE /travel/jobs/{job_id} — Delete a job document from Firestore
"""

import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, field_validator

from app.core.config import get_settings
from app.services.firebase_service import (
    COLLECTION_TRAVEL_JOBS,
    create_job,
    get_firestore_client,
    update_job,
)
from app.services.travel_service import run_travel_pipeline
from app.services.ytdlp_service import YtdlpError, download_tiktok

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/travel", tags=["Travel"])


# ── Request / Response models ──────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    tiktok_url: str

    @field_validator("tiktok_url")
    @classmethod
    def must_be_tiktok_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("tiktok_url must not be empty")
        if "tiktok.com" not in v.lower():
            raise ValueError("tiktok_url must be a TikTok link (must contain tiktok.com)")
        return v


class AnalyzeResponse(BaseModel):
    job_id: str


class JobResponse(BaseModel):
    id: str
    tiktok_url: str
    status: str
    title: str | None
    notion_url: str | None
    error: str | None
    video_filename: str | None
    created_at: str | None
    updated_at: str | None


# ── Background task ────────────────────────────────────────────────────────────

async def _run_pipeline(job_id: str, tiktok_url: str) -> None:
    """
    Background task: download the TikTok video then execute the travel pipeline.

    Firestore job statuses (in order):
        downloading → extracting_frames → analysing → creating_notion_page
        → uploading_images → completed
        (or "failed" on any unrecoverable error)
    """
    settings = get_settings()
    video_path: str | None = None

    try:
        # ── Download video ─────────────────────────────────────────────────────
        logger.info("[job %s] Downloading TikTok video: %s", job_id, tiktok_url)
        result = await download_tiktok(tiktok_url, settings.DOWNLOAD_DIR)
        video_path = result["file_path"]

        await update_job(
            job_id,
            status="extracting_frames",
            video_filename=result["filename"],
            title=result["title"],
        )

        # ── Run analysis pipeline ──────────────────────────────────────────────
        await run_travel_pipeline(job_id, video_path)

    except YtdlpError as exc:
        logger.error("[job %s] TikTok download failed: %s", job_id, exc)
        await update_job(job_id, status="failed", error=f"Download failed: {exc}")

    except Exception as exc:
        logger.exception("[job %s] Unexpected error in background pipeline", job_id)
        # run_travel_pipeline already updates status to "failed" for its own errors;
        # this catch covers the download phase and any other unexpected failures.
        await update_job(job_id, status="failed", error=str(exc))

    finally:
        # Clean up downloaded video file after the pipeline completes (success or fail)
        if video_path:
            try:
                p = Path(video_path)
                if p.exists():
                    p.unlink()
                    logger.info("[job %s] Deleted video file: %s", job_id, video_path)
            except OSError as exc:
                logger.warning("[job %s] Could not delete video file %s: %s", job_id, video_path, exc)


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/analyze", response_model=AnalyzeResponse, status_code=202)
async def analyze_travel_video(
    body: AnalyzeRequest,
    background_tasks: BackgroundTasks,
) -> AnalyzeResponse:
    """
    Accept a TikTok URL, create a Firestore job, and kick off the analysis
    pipeline as a background task.

    Returns a job_id immediately (HTTP 202 Accepted). Clients can poll
    GET /travel/jobs to track progress via the job's `status` field.
    """
    job_id = str(uuid.uuid4())

    await create_job(job_id, body.tiktok_url)
    logger.info("Created travel job %s for %s", job_id, body.tiktok_url)

    background_tasks.add_task(_run_pipeline, job_id, body.tiktok_url)

    return AnalyzeResponse(job_id=job_id)


@router.get("/jobs", response_model=list[JobResponse])
async def list_jobs() -> list[JobResponse]:
    """
    Return all travel analysis jobs ordered by created_at descending.
    """
    db = get_firestore_client()

    try:
        docs = (
            db.collection(COLLECTION_TRAVEL_JOBS)
            .order_by("created_at", direction="DESCENDING")
            .stream()
        )
    except Exception as exc:
        logger.exception("Failed to fetch travel jobs from Firestore")
        raise HTTPException(status_code=500, detail=f"Could not fetch jobs: {exc}") from exc

    jobs: list[JobResponse] = []
    for doc in docs:
        data = doc.to_dict() or {}
        jobs.append(
            JobResponse(
                id=doc.id,
                tiktok_url=data.get("tiktok_url", ""),
                status=data.get("status", "unknown"),
                title=data.get("title") or None,
                notion_url=data.get("notion_url") or None,
                error=data.get("error") or None,
                video_filename=data.get("video_filename") or None,
                # Firestore Timestamps → ISO-8601 string for JSON serialisation
                created_at=data["created_at"].isoformat() if data.get("created_at") else None,
                updated_at=data["updated_at"].isoformat() if data.get("updated_at") else None,
            )
        )

    return jobs


@router.delete("/jobs/{job_id}", status_code=204)
async def delete_job(job_id: str) -> None:
    """
    Delete a travel analysis job document from Firestore.

    Returns 404 if the document does not exist.
    """
    db = get_firestore_client()
    doc_ref = db.collection(COLLECTION_TRAVEL_JOBS).document(job_id)

    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

    try:
        doc_ref.delete()
        logger.info("Deleted travel job %s", job_id)
    except Exception as exc:
        logger.exception("Failed to delete job %s", job_id)
        raise HTTPException(status_code=500, detail=f"Could not delete job: {exc}") from exc
