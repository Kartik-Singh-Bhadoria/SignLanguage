"""Tests for Authentication and User Profile API handlers."""

import pytest
from fastapi import HTTPException
from backend.app.api.v1.auth import (
    get_current_user_profile,
    login_user,
    register_user,
    update_accessibility_settings,
)
from backend.app.schemas.auth import LoginRequest
from backend.app.schemas.user import AccessibilitySettings, UserCreate


def test_register_and_login_flow(db_session):
    email = "vikram@signconnect.ai"
    password = "StrongPassword@2026"

    # Register
    reg_payload = UserCreate(
        email=email,
        password=password,
        full_name="Vikram Malhotra",
        preferred_language="en"
    )
    token_res = register_user(payload=reg_payload, db=db_session)
    assert token_res.access_token is not None
    assert token_res.email == email
    assert token_res.full_name == "Vikram Malhotra"

    # Duplicate registration should fail with 400
    with pytest.raises(HTTPException) as exc_info:
        register_user(payload=reg_payload, db=db_session)
    assert exc_info.value.status_code == 400

    # Login with valid credentials
    login_payload = LoginRequest(email=email, password=password)
    login_res = login_user(payload=login_payload, db=db_session)
    assert login_res.access_token is not None
    assert login_res.user_id == token_res.user_id

    # Login with bad password should fail with 401
    bad_login = LoginRequest(email=email, password="WrongPassword123")
    with pytest.raises(HTTPException) as exc_401:
        login_user(payload=bad_login, db=db_session)
    assert exc_401.value.status_code == 401


def test_update_accessibility_settings(db_session):
    # Register user
    reg = register_user(
        payload=UserCreate(
            email="ananya@signconnect.ai",
            password="AnanyaPassword@2026",
            full_name="Ananya Roy"
        ),
        db=db_session
    )
    from backend.app.models.user import User
    user = db_session.query(User).filter(User.id == reg.user_id).first()

    settings_payload = AccessibilitySettings(
        high_contrast=True,
        font_scale=1.2,
        sign_playback_speed=0.75,
        caption_size="large",
        reduce_motion=True,
        color_blind_mode="deuteranopia",
        screen_reader_hints=True
    )

    updated_user = update_accessibility_settings(
        settings_update=settings_payload,
        current_user=user,
        db=db_session
    )

    assert updated_user.accessibility_settings["high_contrast"] is True
    assert updated_user.accessibility_settings["font_scale"] == 1.2
    assert updated_user.accessibility_settings["sign_playback_speed"] == 0.75
    assert updated_user.accessibility_settings["color_blind_mode"] == "deuteranopia"
