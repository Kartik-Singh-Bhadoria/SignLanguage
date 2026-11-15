"""User management and accessibility settings schemas."""

import re
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"


class AccessibilitySettings(BaseModel):
    high_contrast: bool = False
    font_scale: float = Field(default=1.0, ge=0.8, le=2.0)
    sign_playback_speed: float = Field(default=1.0, ge=0.5, le=2.0)
    caption_size: str = Field(default="medium")  # small, medium, large, extra_large
    reduce_motion: bool = False
    color_blind_mode: str = Field(default="none")  # none, protanopia, deuteranopia, tritanopia
    screen_reader_hints: bool = True


class UserBase(BaseModel):
    email: str
    full_name: str
    preferred_language: str = "en"

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_language: Optional[str] = None
    accessibility_settings: Optional[AccessibilitySettings] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    accessibility_settings: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
