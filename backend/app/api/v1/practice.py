"""Interactive Practice and Posture Scoring Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_optional_user
from backend.app.models.session import PracticeSession
from backend.app.models.sign import ISLSign
from backend.app.models.user import User
from backend.app.schemas.practice import PracticeEvaluationResponse, PracticeSubmission
from backend.app.services.ai.posture_analyzer import PostureAnalyzer

router = APIRouter(prefix="/practice", tags=["Practice & Learning"])


@router.post("/evaluate", response_model=PracticeEvaluationResponse)
def evaluate_practice_attempt(
    payload: PracticeSubmission,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates a user's sign attempt in real-time against the target sign's template,
    computing posture accuracy score and actionable coaching tips.
    """
    sign = db.query(ISLSign).filter(ISLSign.id == payload.sign_id).first()
    if not sign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ISL sign with ID {payload.sign_id} not found."
        )

    # Convert HandData models to dictionaries
    hands_dicts = [h.model_dump() for h in payload.frame.hands]

    # Evaluate with PostureAnalyzer
    evaluation = PostureAnalyzer.evaluate_sign_attempt(
        target_sign_key=sign.sign_key,
        user_hands=hands_dicts
    )

    # Record practice session
    session = PracticeSession(
        user_id=current_user.id if current_user else None,
        sign_id=sign.id,
        accuracy_score=evaluation["accuracy_score"],
        attempts_count=1,
        feedback_notes=" | ".join(evaluation["posture_tips"]),
        posture_metrics=evaluation["finger_evaluation"]
    )
    db.add(session)
    db.commit()

    return PracticeEvaluationResponse(
        sign_id=sign.id,
        sign_key=sign.sign_key,
        english_label=sign.english_label,
        hindi_label=sign.hindi_label,
        accuracy_score=evaluation["accuracy_score"],
        is_passed=evaluation["is_passed"],
        status=evaluation["status"],
        posture_tips=evaluation["posture_tips"],
        finger_evaluation=evaluation["finger_evaluation"]
    )


@router.get("/history")
def get_practice_history(
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Retrieve user's learning progress and practice attempt history."""
    query = db.query(PracticeSession)
    if current_user:
        query = query.filter(PracticeSession.user_id == current_user.id)

    sessions = query.order_by(PracticeSession.id.desc()).limit(limit).all()

    return [
        {
            "id": s.id,
            "sign_id": s.sign_id,
            "sign_key": s.sign.sign_key if s.sign else "UNKNOWN",
            "english_label": s.sign.english_label if s.sign else "Unknown",
            "accuracy_score": s.accuracy_score,
            "feedback_notes": s.feedback_notes,
            "created_at": s.created_at
        }
        for s in sessions
    ]

