"""Application configuration settings for SignConnect AI."""

from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SignConnect AI"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-Powered Indian Sign Language (ISL) Accessibility & Real-Time Communication Platform"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "signconnect-ai-super-secret-production-key-2026-isl-platform"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = "sqlite:///./signconnect.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    # AI Model & Data Paths
    MODEL_WEIGHTS_PATH: str = "backend/app/services/ai/models/isl_classifier.pt"
    ISL_DATASET_DIR: str = "backend/app/services/ai/data"
    RECOGNITION_CONFIDENCE_THRESHOLD: float = 0.65

    # WebRTC / Realtime
    MAX_ROOM_PARTICIPANTS: int = 10
    ICE_SERVERS: List[dict] = [
        {"urls": ["stun:stun.l.google.com:19302"]},
        {"urls": ["stun:stun1.l.google.com:19302"]}
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

