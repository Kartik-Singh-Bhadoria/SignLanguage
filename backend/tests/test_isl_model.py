"""Tests for PyTorch ISL Neural Network and Recognition Engine."""

import torch
import numpy as np
from backend.app.services.ai.isl_dataset import generate_sign_landmarks
from backend.app.services.ai.isl_model import ISLClassifierNet, get_isl_classifier
from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer


def test_isl_classifier_net_forward():
    net = ISLClassifierNet(input_dim=140, num_classes=60)
    net.eval()

    # Single vector input
    x_single = torch.randn(140)
    out_single = net(x_single)
    assert out_single.shape == (1, 60)

    # Batch input
    x_batch = torch.randn(8, 140)
    out_batch = net(x_batch)
    assert out_batch.shape == (8, 60)


def test_recognition_engine_prediction():
    engine = get_isl_classifier()

    # Predict with 'L' sign
    hands_l = generate_sign_landmarks("L", jitter=0.0)
    features_l = HandLandmarkNormalizer.extract_features(hands_l)

    predictions = engine.predict(features_l, top_k=5)
    assert len(predictions) == 5
    top_sign, top_confidence = predictions[0]

    assert isinstance(top_sign, str)
    assert 0.0 <= top_confidence <= 1.0
    # Top prediction probabilities should sum to <= 1.0
    assert sum(p[1] for p in predictions) <= 1.0001

