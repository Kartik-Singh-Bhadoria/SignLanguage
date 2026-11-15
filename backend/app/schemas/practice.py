"""Schemas for interactive ISL practice and posture scoring."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.recognition import LandmarkFrame


class PracticeSubmission(BaseModel):
    sign_id: int
    frame: LandmarkFrame


class PracticeEvaluationResponse(BaseModel):
    sign_id: int
    sign_key: str
    english_label: str
    hindi_label: str
    accuracy_score: float = Field(..., ge=0.0, le=100.0)
    is_passed: bool
    status: str  # "Excellent", "Good", "Needs Improvement", "Incorrect Pose"
    posture_tips: List[str]
    finger_evaluation: Dict[str, str]  # e.g., {"Thumb": "Correct", "Index": "Extend more"}

