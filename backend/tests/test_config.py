"""Test application settings and configuration."""

from backend.app.core.config import Settings, settings


def test_settings_defaults():
    assert settings.PROJECT_NAME == "SignConnect AI"
    assert settings.VERSION == "1.0.0"
    assert settings.API_V1_STR == "/api/v1"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES > 0
    assert len(settings.BACKEND_CORS_ORIGINS) > 0
    assert settings.RECOGNITION_CONFIDENCE_THRESHOLD == 0.65
    assert len(settings.ICE_SERVERS) >= 1


def test_settings_custom_instance():
    custom = Settings(PROJECT_NAME="CustomSign", ACCESS_TOKEN_EXPIRE_MINUTES=120)
    assert custom.PROJECT_NAME == "CustomSign"
    assert custom.ACCESS_TOKEN_EXPIRE_MINUTES == 120

