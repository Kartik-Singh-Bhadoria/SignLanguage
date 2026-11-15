"""Tests for ISL Recognition API handlers."""

from backend.app.api.v1.recognition import recognize_landmarks
from backend.app.schemas.recognition import LandmarkFrame
from backend.app.services.ai.isl_dataset import generate_sign_landmarks


def test_predict_empty_frame():
    frame = LandmarkFrame(hands=[])
    res = recognize_landmarks(frame=frame)

    assert res.is_detected is False
    assert res.predicted_sign is None
    assert res.confidence == 0.0


def test_predict_valid_landmarks():
    hands = generate_sign_landmarks("NAMASTE", jitter=0.0)
    frame = LandmarkFrame(hands=hands)
    res = recognize_landmarks(frame=frame)

    assert res.is_detected is True
    assert res.predicted_sign is not None
    assert res.confidence > 0.0
    assert len(res.top_predictions) == 5
    assert res.posture_feedback is not None
    assert res.inference_time_ms > 0.0
