"""Practice and learning session metrics database model."""

from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    sign_id = Column(Integer, ForeignKey("isl_signs.id", ondelete="CASCADE"), nullable=False, index=True)
    accuracy_score = Column(Float, nullable=False)  # 0.0 to 100.0
    attempts_count = Column(Integer, default=1, nullable=False)
    feedback_notes = Column(Text, nullable=True)
    posture_metrics = Column(JSON, nullable=True)  # {finger_curls: {}, wrist_tilt: float, match_level: str}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="practice_sessions")
    sign = relationship("ISLSign", back_populates="practice_sessions")

