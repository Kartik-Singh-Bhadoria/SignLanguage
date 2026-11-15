"""Schemas for Hand Landmark input and AI Sign Recognition results."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: float = 0.0
    visibility: Optional[float] = 1.0


class HandData(BaseModel):
    handedness: str = "Right"  # "Right" or "Left"
    landmarks: List[LandmarkPoint] = Field(..., min_length=21, max_length=21)


class LandmarkFrame(BaseModel):
    timestamp_ms: Optional[float] = None
    hands: List[HandData] = Field(default_factory=list)
    image_base64: Optional[str] = None  # Optional raw frame fallback


class TopPrediction(BaseModel):
    sign_key: str
    english_label: str
    hindi_label: str
    confidence: float
    category: str


class PostureFeedback(BaseModel):
    dominant_hand: str
    palm_orientation: str  # e.g., "Facing Forward", "Facing Inward", "Facing Up"
    extended_fingers: List[str]  # e.g., ["Thumb", "Index"]
    curled_fingers: List[str]    # e.g., ["Middle", "Ring", "Pinky"]
    guidance: Optional[str] = None


class RecognitionResponse(BaseModel):
    is_detected: bool
    predicted_sign: Optional[str] = None
    english_label: Optional[str] = None
    hindi_label: Optional[str] = None
    confidence: float = 0.0
    top_predictions: List[TopPrediction] = Field(default_factory=list)
    posture_feedback: Optional[PostureFeedback] = None
    inference_time_ms: float = 0.0

