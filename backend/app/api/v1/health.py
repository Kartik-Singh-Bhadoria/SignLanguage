"""Health check and platform status endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db
from backend.app.core.config import settings
from backend.app.services.ai.isl_dataset import ISL_CLASSES
from backend.app.services.ai.isl_model import get_isl_classifier

router = APIRouter(tags=["Health"])


@router.get("/health")
def check_health(db: Session = Depends(get_db)):
    """System health check and component diagnostics."""
    # Check DB
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    # Check AI Model
    model_status = "loaded"
    try:
        classifier = get_isl_classifier()
        model_loaded = classifier._is_loaded
    except Exception as e:
        model_status = f"error: {str(e)}"
        model_loaded = False

    return {
        "status": "healthy" if db_status == "connected" and model_loaded else "degraded",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "ai_classifier": {
            "status": model_status,
            "classes_count": len(ISL_CLASSES),
            "device": "cpu"
        }
    }

