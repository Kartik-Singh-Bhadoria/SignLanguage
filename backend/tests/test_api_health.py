"""Tests for API health check endpoint."""

from backend.app.api.v1.health import check_health


def test_health_check(db_session):
    data = check_health(db=db_session)
    assert data["status"] in ["healthy", "degraded"]
    assert data["database"] == "connected"
    assert data["ai_classifier"]["classes_count"] == 60
