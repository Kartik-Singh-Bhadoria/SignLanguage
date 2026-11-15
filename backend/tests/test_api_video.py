"""Tests for WebRTC Video Room Management API handlers."""

import pytest
from fastapi import HTTPException
from backend.app.api.v1.video import create_room, get_ice_servers, get_room_details
from backend.app.schemas.room import RoomCreate


def test_create_and_get_room(db_session):
    payload = RoomCreate(
        title="Inclusive Classroom",
        isl_captioning_enabled=True,
        max_participants=8
    )
    room = create_room(payload=payload, current_user=None, db=db_session)
    assert room.room_code.startswith("SIGN-")
    assert room.title == "Inclusive Classroom"
    assert room.isl_captioning_enabled is True

    details = get_room_details(room_code=room.room_code, db=db_session)
    assert details.id == room.id
    assert details.room_code == room.room_code


def test_get_nonexistent_room(db_session):
    with pytest.raises(HTTPException) as exc_info:
        get_room_details(room_code="SIGN-NOTREAL", db=db_session)
    assert exc_info.value.status_code == 404


def test_get_ice_servers():
    res = get_ice_servers()
    assert "ice_servers" in res
    assert len(res["ice_servers"]) >= 1
