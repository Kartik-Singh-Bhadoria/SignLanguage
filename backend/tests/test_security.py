"""Test password hashing, verification, and JWT creation/decoding."""

import time
from backend.app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)


def test_password_hash_and_verification():
    raw_password = "SecurePassword@123"
    hashed = get_password_hash(raw_password)

    assert hashed.startswith("pbkdf2_sha256$100000$")
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False
    assert verify_password("", hashed) is False
    assert verify_password(raw_password, "invalid_hash_string") is False


def test_jwt_token_lifecycle():
    payload = {"sub": "user@example.com", "user_id": 42}
    token = create_access_token(payload, expires_delta_seconds=300)

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user@example.com"
    assert decoded["user_id"] == 42
    assert "exp" in decoded
    assert "iat" in decoded


def test_jwt_token_tampering():
    payload = {"sub": "user@example.com", "user_id": 42}
    token = create_access_token(payload, expires_delta_seconds=300)

    # Tamper with the token payload part
    parts = token.split(".")
    tampered_token = f"{parts[0]}.eyJob3N0aWxlIjogdHJ1ZX0.{parts[2]}"
    assert decode_access_token(tampered_token) is None


def test_jwt_token_expiration():
    payload = {"sub": "user@example.com", "user_id": 42}
    # Create token that expired 10 seconds ago
    token = create_access_token(payload, expires_delta_seconds=-10)

    decoded = decode_access_token(token)
    assert decoded is None

