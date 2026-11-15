"""User database model with accessibility preferences."""

from sqlalchemy import Boolean, Column, Integer, JSON, String
from sqlalchemy.orm import relationship
from backend.app.core.database import Base
from backend.app.models.base import TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    preferred_language = Column(String(10), default="en", nullable=False)

    # Accessibility preferences (high contrast, font scale, speed, captions, color modes)
    accessibility_settings = Column(
        JSON,
        default=lambda: {
            "high_contrast": False,
            "font_scale": 1.0,
            "sign_playback_speed": 1.0,
            "caption_size": "medium",
            "reduce_motion": False,
            "color_blind_mode": "none",
            "screen_reader_hints": True
        },
        nullable=False
    )

    # Relationships
    practice_sessions = relationship("PracticeSession", back_populates="user", cascade="all, delete-orphan")
    translations = relationship("TranslationLog", back_populates="user")

