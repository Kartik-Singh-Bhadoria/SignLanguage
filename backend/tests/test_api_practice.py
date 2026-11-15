"""Tests for Practice Evaluation and Scoring API handlers."""

import pytest
from fastapi import HTTPException
from backend.app.api.v1.practice import evaluate_practice_attempt, get_practice_history
from backend.app.db_seeder import seed_isl_dictionary
from backend.app.models.sign import ISLSign
from backend.app.schemas.practice import PracticeSubmission
from backend.app.schemas.recognition import LandmarkFrame
from backend.app.services.ai.isl_dataset import generate_sign_landmarks


def test_evaluate_practice_attempt(db_session):
    seed_isl_dictionary(db_session)
    sign_a = db_session.query(ISLSign).filter_by(sign_key="A").first()
    assert sign_a is not None

    hands = generate_sign_landmarks("A", jitter=0.0)
    submission = PracticeSubmission(
        sign_id=sign_a.id,
        frame=LandmarkFrame(hands=hands)
    )

    evaluation = evaluate_practice_attempt(payload=submission, current_user=None, db=db_session)
    assert evaluation.sign_id == sign_a.id
    assert evaluation.sign_key == "A"
    assert evaluation.accuracy_score >= 80.0
    assert evaluation.is_passed is True
    assert "finger_evaluation" in evaluation.model_dump()


def test_evaluate_invalid_sign_id(db_session):
    submission = PracticeSubmission(
        sign_id=99999,
        frame=LandmarkFrame(hands=[])
    )
    with pytest.raises(HTTPException) as exc_info:
        evaluate_practice_attempt(payload=submission, current_user=None, db=db_session)
    assert exc_info.value.status_code == 404


def test_practice_history(db_session):
    history = get_practice_history(limit=5, current_user=None, db=db_session)
    assert isinstance(history, list)
