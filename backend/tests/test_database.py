"""Test database initialization and session management."""

from sqlalchemy import text
from backend.app.core.database import SessionLocal, init_db


def test_init_db_creates_tables(engine):
    # Call init_db to ensure schema creates without error
    init_db()
    with engine.connect() as conn:
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = [row[0] for row in result.fetchall()]
        assert "users" in tables
        assert "isl_signs" in tables
        assert "practice_sessions" in tables
        assert "translation_logs" in tables
        assert "video_rooms" in tables

