import json
import logging
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, firestore

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_firestore_client: firestore.Client | None = None

COLLECTION_TRAVEL_JOBS = "travel_jobs"


def get_firestore_client() -> firestore.Client:
    """Return a cached Firestore client, initializing Firebase on first call."""
    global _firestore_client

    if _firestore_client is not None:
        return _firestore_client

    settings = get_settings()

    if not firebase_admin._apps:
        if settings.FIREBASE_SERVICE_ACCOUNT_JSON:
            cred = credentials.Certificate(json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON))
        else:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, {"projectId": settings.FIREBASE_PROJECT_ID})
        logger.info("Firebase Admin initialized (project: %s)", settings.FIREBASE_PROJECT_ID)

    _firestore_client = firestore.client()
    return _firestore_client


async def create_job(job_id: str, tiktok_url: str) -> dict:
    """Create a new travel analysis job document in Firestore."""
    db = get_firestore_client()
    now = datetime.now(timezone.utc)

    doc_data = {
        "tiktok_url": tiktok_url,
        "status": "downloading",
        "title": "",
        "notion_url": None,
        "error": None,
        "video_filename": None,
        "created_at": now,
        "updated_at": now,
    }

    db.collection(COLLECTION_TRAVEL_JOBS).document(job_id).set(doc_data)
    logger.info("Created job %s for %s", job_id, tiktok_url)

    return {"id": job_id, **doc_data}


async def update_job(job_id: str, **fields) -> None:
    """Update specific fields on a travel job document."""
    db = get_firestore_client()
    fields["updated_at"] = datetime.now(timezone.utc)

    db.collection(COLLECTION_TRAVEL_JOBS).document(job_id).update(fields)
    logger.info("Updated job %s: %s", job_id, list(fields.keys()))
