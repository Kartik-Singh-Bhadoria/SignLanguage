"""Indian Sign Language (ISL) dictionary sign model."""

from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class ISLSign(Base):
    __tablename__ = "isl_signs"

    id = Column(Integer, primary_key=True, index=True)
    sign_key = Column(String(50), unique=True, index=True, nullable=False)
    english_label = Column(String(100), nullable=False, index=True)
    hindi_label = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # alphabet, number, greeting, emergency, daily, question
    description = Column(Text, nullable=False)
    hand_type = Column(String(20), default="one_hand", nullable=False)  # one_hand, two_hands
    dominant_hand = Column(String(20), default="right", nullable=False)  # right, left, both
    difficulty_level = Column(String(20), default="easy", nullable=False)  # easy, medium, hard
    video_url = Column(String(500), nullable=True)
    animation_code = Column(String(100), nullable=True)
    tags = Column(String(255), default="", nullable=False)

    # Reference landmark configuration for validation and practice scoring
    landmark_template = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    practice_sessions = relationship("PracticeSession", back_populates="sign", cascade="all, delete-orphan")

