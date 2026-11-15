"""Tests for Hand Landmark Normalization and Feature Extraction."""

import numpy as np
from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer
from backend.app.services.ai.isl_dataset import generate_sign_landmarks


def test_normalize_single_hand_invariance():
    # Construct synthetic 21 points
    points = np.zeros((21, 3), dtype=np.float32)
    # Give wrist a random offset
    points[:, 0] += 5.0
    points[:, 1] += 10.0
    # Middle MCP has distance
    points[HandLandmarkNormalizer.MIDDLE_MCP] = [5.0, 12.0, 0.0]

    normalized, scale = HandLandmarkNormalizer.normalize_single_hand(points)

    assert normalized.shape == (21, 3)
    # Wrist should be at origin
    np.testing.assert_allclose(normalized[HandLandmarkNormalizer.WRIST], [0.0, 0.0, 0.0], atol=1e-5)
    # Middle MCP should have unit distance from origin
    dist = np.linalg.norm(normalized[HandLandmarkNormalizer.MIDDLE_MCP])
    assert abs(dist - 1.0) < 1e-4


def test_finger_extension_detection():
    # Test 'A' sign (closed fist: all fingers curled)
    hands_a = generate_sign_landmarks("A", jitter=0.0)
    raw_pts = np.array([[p["x"], p["y"], p["z"]] for p in hands_a[0]["landmarks"]], dtype=np.float32)
    norm_pts, _ = HandLandmarkNormalizer.normalize_single_hand(raw_pts)
    fingers = HandLandmarkNormalizer.calculate_finger_extensions(norm_pts)

    assert fingers["Index"]["state"] == "Curled"
    assert fingers["Middle"]["state"] == "Curled"
    assert fingers["Pinky"]["state"] == "Curled"

    # Test 'B' sign (open four fingers)
    hands_b = generate_sign_landmarks("B", jitter=0.0)
    raw_b = np.array([[p["x"], p["y"], p["z"]] for p in hands_b[0]["landmarks"]], dtype=np.float32)
    norm_b, _ = HandLandmarkNormalizer.normalize_single_hand(raw_b)
    fingers_b = HandLandmarkNormalizer.calculate_finger_extensions(norm_b)

    assert fingers_b["Index"]["state"] == "Extended"
    assert fingers_b["Middle"]["state"] == "Extended"
    assert fingers_b["Ring"]["state"] == "Extended"
    assert fingers_b["Pinky"]["state"] == "Extended"


def test_feature_extractor_dimensionality():
    # One-handed sign
    hands_one = generate_sign_landmarks("L", jitter=0.0)
    feat_one = HandLandmarkNormalizer.extract_features(hands_one)
    assert feat_one.shape == (140,)
    assert feat_one[139] == 0.5  # Hand count indicator

    # Two-handed sign
    hands_two = generate_sign_landmarks("NAMASTE", jitter=0.0)
    feat_two = HandLandmarkNormalizer.extract_features(hands_two)
    assert feat_two.shape == (140,)
    assert feat_two[139] == 1.0  # Two hands indicator

