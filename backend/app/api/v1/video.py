"""WebRTC Video Call Rooms and Meeting Management."""

import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_optional_user
from backend.app.core.config import settings
from backend.app.models.room import VideoRoom
from backend.app.models.user import User
from backend.app.schemas.room import RoomCreate, RoomResponse

router = APIRouter(prefix="/video", tags=["Video Call & WebRTC"])


@router.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
def create_room(
    payload: RoomCreate,
    current_user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Create a new WebRTC room for inclusive video meetings with live ISL captioning."""
    room_code = f"SIGN-{secrets.token_hex(3).upper()}"

    room = VideoRoom(
        room_code=room_code,
        title=payload.title,
        host_user_id=current_user.id if current_user else None,
        max_participants=payload.max_participants,
        isl_captioning_enabled=payload.isl_captioning_enabled
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.get("/rooms/{room_code}", response_model=RoomResponse)
def get_room_details(room_code: str, db: Session = Depends(get_db)):
    """Retrieve details and active status of a video call room."""
    room = db.query(VideoRoom).filter(VideoRoom.room_code == room_code.upper()).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Video room '{room_code}' not found."
        )
    return room


@router.get("/ice-servers")
def get_ice_servers():
    """Retrieve STUN/TURN ICE server configuration for WebRTC peer connections."""
    return {"ice_servers": settings.ICE_SERVERS}

