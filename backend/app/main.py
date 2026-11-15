"""Main FastAPI application for SignConnect AI."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1.router import api_router
from backend.app.core.config import settings
from backend.app.core.database import SessionLocal, init_db
from backend.app.db_seeder import seed_isl_dictionary
from backend.app.services.ai.isl_model import get_isl_classifier


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifespan manager."""
    # 1. Initialize DB tables
    init_db()

    # 2. Seed initial ISL signs dictionary
    db = SessionLocal()
    try:
        seed_isl_dictionary(db)
    finally:
        db.close()

    # 3. Ensure ISL AI classifier is initialized and weights are ready
    get_isl_classifier()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Next.js frontend and cross-origin access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Next.js client
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    """SignConnect AI Root Service Info."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR,
        "features": [
            "Real-time ISL Sign Recognition",
            "Text & Speech to ISL Sign Translation (SOV Grammar)",
            "Sign to Text Translation",
            "Interactive Practice Studio with Granular Posture Feedback",
            "WebRTC Room Signaling with Live ISL Subtitles"
        ]
    }

