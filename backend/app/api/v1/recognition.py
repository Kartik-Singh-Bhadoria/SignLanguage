"""AI Indian Sign Language (ISL) Recognition Endpoints."""

import time
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, status
import numpy as np
from backend.app.schemas.recognition import (
    HandData,
    LandmarkFrame,
    PostureFeedback,
    RecognitionResponse,
    TopPrediction,
)
from backend.app.services.ai.isl_dataset import get_isl_class_metadata
from backend.app.services.ai.isl_model import get_isl_classifier
from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer

router = APIRouter(prefix="/recognition", tags=["AI Recognition"])


@router.post("/predict", response_model=RecognitionResponse)
def recognize_landmarks(frame: LandmarkFrame):
    """
    Accepts 21-point hand landmarks for 1 or 2 hands,
    performs geometric normalization, and predicts the corresponding ISL sign.
    """
    start_time = time.perf_counter()

    if not frame.hands:
        return RecognitionResponse(
            is_detected=False,
            predicted_sign=None,
            english_label=None,
            hindi_label=None,
            confidence=0.0,
            top_predictions=[],
            posture_feedback=None,
            inference_time_ms=0.0
        )

    # Convert HandData models to dictionaries for the normalizer
    hands_dicts = [h.model_dump() for h in frame.hands]

    # Extract 140-d normalized feature vector
    features = HandLandmarkNormalizer.extract_features(hands_dicts)

    # Classify with PyTorch model
    classifier = get_isl_classifier()
    predictions = classifier.predict(features, top_k=5)

    if not predictions:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model failed to produce predictions."
        )

    top_sign_key, top_conf = predictions[0]
    top_meta = get_isl_class_metadata(top_sign_key)

    # Build top 5 predictions list with metadata
    top_list: List[TopPrediction] = []
    for sign_key, conf in predictions:
        m = get_isl_class_metadata(sign_key)
        top_list.append(TopPrediction(
            sign_key=sign_key,
            english_label=m["en"],
            hindi_label=m["hi"],
            confidence=round(conf, 4),
            category=m.get("category", "alphabet")
        ))

    # Calculate posture diagnostics on the primary hand
    primary_hand = hands_dicts[0]
    raw_pts = np.array([[p["x"], p["y"], p.get("z", 0.0)] for p in primary_hand["landmarks"]], dtype=np.float32)
    norm_pts, _ = HandLandmarkNormalizer.normalize_single_hand(raw_pts)
    fingers = HandLandmarkNormalizer.calculate_finger_extensions(norm_pts)
    palm_norm = HandLandmarkNormalizer.calculate_palm_normal(norm_pts)
    palm_text = HandLandmarkNormalizer.get_palm_orientation_text(palm_norm)

    extended = [fname for fname, info in fingers.items() if info["extended"]]
    curled = [fname for fname, info in fingers.items() if not info["extended"]]

    posture_feedback = PostureFeedback(
        dominant_hand=primary_hand.get("handedness", "Right"),
        palm_orientation=palm_text,
        extended_fingers=extended,
        curled_fingers=curled,
        guidance=f"Detected {len(extended)} extended finger(s): {', '.join(extended) if extended else 'None'}."
    )

    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

    return RecognitionResponse(
        is_detected=True,
        predicted_sign=top_sign_key,
        english_label=top_meta["en"],
        hindi_label=top_meta["hi"],
        confidence=round(top_conf, 4),
        top_predictions=top_list,
        posture_feedback=posture_feedback,
        inference_time_ms=elapsed_ms
    )

