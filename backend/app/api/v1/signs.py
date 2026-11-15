"""ISL Sign Dictionary endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db
from backend.app.models.sign import ISLSign
from backend.app.schemas.sign import ISLSignListResponse, ISLSignResponse

router = APIRouter(prefix="/signs", tags=["ISL Dictionary"])


@router.get("", response_model=ISLSignListResponse)
def list_signs(
    category: Optional[str] = Query(None, description="Filter by category (alphabet, number, greeting, etc.)"),
    search: Optional[str] = Query(None, description="Search by sign key, English or Hindi label"),
    hand_type: Optional[str] = Query(None, description="Filter by hand type (one_hand, two_hands)"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty (easy, medium, hard)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(60, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List signs from the Indian Sign Language dictionary with flexible filtering."""
    query = db.query(ISLSign)

    if category:
        query = query.filter(ISLSign.category == category.lower())
    if hand_type:
        query = query.filter(ISLSign.hand_type == hand_type)
    if difficulty:
        query = query.filter(ISLSign.difficulty_level == difficulty.lower())
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (ISLSign.sign_key.ilike(search_term)) |
            (ISLSign.english_label.ilike(search_term)) |
            (ISLSign.hindi_label.ilike(search_term)) |
            (ISLSign.tags.ilike(search_term))
        )

    total = query.count()
    items = query.order_by(ISLSign.id.asc()).offset(skip).limit(limit).all()

    return ISLSignListResponse(total=total, items=items)


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Retrieve all available categories and count of signs per category."""
    counts = (
        db.query(ISLSign.category, func.count(ISLSign.id))
        .group_by(ISLSign.category)
        .all()
    )
    return [{"category": c[0], "count": c[1]} for c in counts]


@router.get("/{sign_key}", response_model=ISLSignResponse)
def get_sign_detail(sign_key: str, db: Session = Depends(get_db)):
    """Retrieve detailed metadata, instructions, and reference landmarks for a specific sign."""
    sign = db.query(ISLSign).filter(ISLSign.sign_key == sign_key.upper()).first()
    if not sign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ISL sign with key '{sign_key}' not found in dictionary."
        )
    return sign

