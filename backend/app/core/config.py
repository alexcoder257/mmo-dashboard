from functools import lru_cache
from typing import Annotated

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Required secrets — must be set via .env or environment variables
    ANTHROPIC_API_KEY: str
    NOTION_API_KEY: str

    # Notion config
    NOTION_DATABASE_ID: str = "31929321-fe1b-814c-a535-e29d3e7778dd"

    # Firebase
    FIREBASE_SERVICE_ACCOUNT_PATH: str = "./firebase-service-account.json"
    FIREBASE_SERVICE_ACCOUNT_JSON: str = ""  # JSON string alternative (for cloud deployment)
    FIREBASE_PROJECT_ID: str = "mmo-dashboard-89780"

    # File storage
    UPLOAD_DIR: str = "./uploads"
    DOWNLOAD_DIR: str = "./downloads"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Claude model
    CLAUDE_MODEL: str = "claude-opus-4-5"

    # File limits
    MAX_UPLOAD_SIZE_MB: int = 100


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance. Cached to avoid re-parsing on every request."""
    return Settings()
