"""Tests for Real-time Posture Evaluation and Guidance."""

from backend.app.services.ai.isl_dataset import generate_sign_landmarks
from backend.app.services.ai.posture_analyzer import PostureAnalyzer


def test_posture_analyzer_perfect_match():
    # Evaluate identical landmark pose
    hands = generate_sign_landmarks("A", jitter=0.0)
    result = PostureAnalyzer.evaluate_sign_attempt("A", hands)

    assert result["is_passed"] is True
    assert result["accuracy_score"] >= 85.0
    assert result["status"] == "Excellent"
    assert "finger_evaluation" in result
    assert result["finger_evaluation"]["Index"] == "Correct"


def test_posture_analyzer_missing_hand_penalty():
    # NAMASTE requires two hands; provide only one hand
    hands_namaste = generate_sign_landmarks("NAMASTE", jitter=0.0)
    one_hand_only = [hands_namaste[0]]

    result = PostureAnalyzer.evaluate_sign_attempt("NAMASTE", one_hand_only)

    assert result["is_passed"] is False
    assert any("requires both hands" in tip for tip in result["posture_tips"])


def test_posture_analyzer_no_hand():
    result = PostureAnalyzer.evaluate_sign_attempt("B", [])
    assert result["accuracy_score"] == 0.0
    assert result["is_passed"] is False
    assert result["status"] == "No Hand Detected"

