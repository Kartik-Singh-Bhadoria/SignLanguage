"""Base mixins and database utilities for SQLAlchemy models."""

from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer


class TimestampMixin:
    """Provides created_at and updated_at timestamps automatically in UTC."""
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

