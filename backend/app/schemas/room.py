"""Schemas for WebRTC Video Call Rooms and real-time signaling."""

from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    title: str = Field(default="SignConnect Meeting", max_length=100)
    isl_captioning_enabled: bool = True
    max_participants: int = Field(default=10, ge=2, le=50)


class RoomResponse(BaseModel):
    id: int
    room_code: str
    title: str
    host_user_id: Optional[int] = None
    is_active: bool
    max_participants: int
    isl_captioning_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True


class WebRTCSignalMessage(BaseModel):
    type: str  # "offer", "answer", "ice_candidate", "join", "leave", "caption"
    room_code: str
    sender_id: str
    recipient_id: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)

