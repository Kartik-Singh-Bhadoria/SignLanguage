"""ISL Sign Dictionary schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ISLSignBase(BaseModel):
    sign_key: str
    english_label: str
    hindi_label: str
    category: str
    description: str
    hand_type: str = "one_hand"
    dominant_hand: str = "right"
    difficulty_level: str = "easy"
    video_url: Optional[str] = None
    animation_code: Optional[str] = None
    tags: str = ""
    landmark_template: Optional[Dict[str, Any]] = None


class ISLSignCreate(ISLSignBase):
    pass


class ISLSignUpdate(BaseModel):
    english_label: Optional[str] = None
    hindi_label: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    hand_type: Optional[str] = None
    difficulty_level: Optional[str] = None
    video_url: Optional[str] = None
    animation_code: Optional[str] = None
    tags: Optional[str] = None
    landmark_template: Optional[Dict[str, Any]] = None


class ISLSignResponse(ISLSignBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ISLSignListResponse(BaseModel):
    total: int
    items: List[ISLSignResponse]

