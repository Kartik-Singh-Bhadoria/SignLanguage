"""Aggregated API router for v1 endpoints."""

from fastapi import APIRouter
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.practice import router as practice_router
from backend.app.api.v1.recognition import router as recognition_router
from backend.app.api.v1.signs import router as signs_router
from backend.app.api.v1.translation import router as translation_router
from backend.app.api.v1.video import router as video_router
from backend.app.api.v1.ws_stream import router as ws_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(signs_router)
api_router.include_router(recognition_router)
api_router.include_router(translation_router)
api_router.include_router(practice_router)
api_router.include_router(video_router)
api_router.include_router(ws_router)

