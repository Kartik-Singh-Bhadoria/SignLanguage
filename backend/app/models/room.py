"""WebRTC Video Call Room model with live ISL captioning support."""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from backend.app.core.database import Base


class VideoRoom(Base):
    __tablename__ = "video_rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(100), default="SignConnect Meeting", nullable=False)
    host_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    max_participants = Column(Integer, default=10, nullable=False)
    isl_captioning_enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    ended_at = Column(DateTime, nullable=True)

