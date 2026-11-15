"""Pydantic schemas for SignConnect AI."""

from backend.app.schemas.auth import Token, TokenPayload, LoginRequest
from backend.app.schemas.user import (
    AccessibilitySettings,
    UserCreate,
    UserUpdate,
    UserResponse,
)
from backend.app.schemas.sign import (
    ISLSignBase,
    ISLSignCreate,
    ISLSignUpdate,
    ISLSignResponse,
    ISLSignListResponse,
)
from backend.app.schemas.recognition import (
    LandmarkPoint,
    HandData,
    LandmarkFrame,
    TopPrediction,
    PostureFeedback,
    RecognitionResponse,
)
from backend.app.schemas.translation import (
    TextToSignRequest,
    SignSequenceItem,
    TextToSignResponse,
    SignToTextRequest,
    SignToTextResponse,
)
from backend.app.schemas.practice import (
    PracticeSubmission,
    PracticeEvaluationResponse,
)
from backend.app.schemas.room import (
    RoomCreate,
    RoomResponse,
    WebRTCSignalMessage,
)

__all__ = [
    "Token",
    "TokenPayload",
    "LoginRequest",
    "AccessibilitySettings",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "ISLSignBase",
    "ISLSignCreate",
    "ISLSignUpdate",
    "ISLSignResponse",
    "ISLSignListResponse",
    "LandmarkPoint",
    "HandData",
    "LandmarkFrame",
    "TopPrediction",
    "PostureFeedback",
    "RecognitionResponse",
    "TextToSignRequest",
    "SignSequenceItem",
    "TextToSignResponse",
    "SignToTextRequest",
    "SignToTextResponse",
    "PracticeSubmission",
    "PracticeEvaluationResponse",
    "RoomCreate",
    "RoomResponse",
    "WebRTCSignalMessage",
]

