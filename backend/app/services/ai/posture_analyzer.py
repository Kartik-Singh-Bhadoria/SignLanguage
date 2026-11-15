"""Real-time Posture Evaluation and Actionable Guidance Engine for ISL."""

from typing import Any, Dict, List, Optional, Tuple
import numpy as np
from backend.app.services.ai.isl_dataset import (
    ISL_CLASSES,
    SIGN_METADATA,
    generate_sign_landmarks,
    get_isl_class_metadata,
)
from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer


class PostureAnalyzer:
    """
    Performs granular posture comparison between user hand landmarks
    and reference ISL anatomical templates to generate real-time coaching tips.
    """

    @classmethod
    def evaluate_sign_attempt(
        cls,
        target_sign_key: str,
        user_hands: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Compares user's observed hand pose against the reference template of the target sign.
        Returns accuracy score (0-100), passing status, and actionable posture tips.
        """
        metadata = get_isl_class_metadata(target_sign_key)
        target_hands_req = metadata.get("hands", "one_hand")

        if not user_hands:
            return {
                "accuracy_score": 0.0,
                "is_passed": False,
                "status": "No Hand Detected",
                "posture_tips": ["Please bring your hand clearly into the camera frame."],
                "finger_evaluation": {f: "Not visible" for f in HandLandmarkNormalizer.FINGER_NAMES}
            }

        # Check required hands count
        is_two_handed = target_hands_req == "two_hands"
        actual_hand_count = len(user_hands)

        hand_penalty = 0.0
        tips: List[str] = []

        if is_two_handed and actual_hand_count < 2:
            hand_penalty += 35.0
            tips.append(f"'{metadata['en']}' requires both hands. Please place your second hand in view.")
        elif not is_two_handed and actual_hand_count > 1:
            tips.append(f"'{metadata['en']}' is typically performed using your dominant hand.")

        # Reference template for target sign
        ref_hands = generate_sign_landmarks(target_sign_key, jitter=0.0)
        ref_features = HandLandmarkNormalizer.extract_features(ref_hands)
        user_features = HandLandmarkNormalizer.extract_features(user_hands)

        # 1. Coordinate Cosine & Euclidean Similarity
        # Hand 1 coordinates comparison (indices 0:63)
        h1_ref = ref_features[0:63]
        h1_user = user_features[0:63]

        norm_ref = np.linalg.norm(h1_ref) + 1e-6
        norm_user = np.linalg.norm(h1_user) + 1e-6
        cosine_sim = float(np.dot(h1_ref, h1_user) / (norm_ref * norm_user))
        coord_score = max(0.0, min(100.0, (cosine_sim + 1.0) * 50.0))

        # 2. Finger-by-finger granular evaluation
        h1_user_dict = sorted(
            user_hands,
            key=lambda h: 0 if str(h.get("handedness", "Right")).lower() in ["right", "dominant"] else 1
        )[0]
        h1_raw = np.array([[pt["x"], pt["y"], pt.get("z", 0.0)] for pt in h1_user_dict["landmarks"]], dtype=np.float32)
        h1_norm, _ = HandLandmarkNormalizer.normalize_single_hand(h1_raw)
        user_fingers = HandLandmarkNormalizer.calculate_finger_extensions(h1_norm)

        ref_dict = sorted(ref_hands, key=lambda h: 0 if h.get("handedness") == "Right" else 1)[0]
        ref_raw = np.array([[pt["x"], pt["y"], pt.get("z", 0.0)] for pt in ref_dict["landmarks"]], dtype=np.float32)
        ref_norm, _ = HandLandmarkNormalizer.normalize_single_hand(ref_raw)
        ref_fingers = HandLandmarkNormalizer.calculate_finger_extensions(ref_norm)

        finger_eval: Dict[str, str] = {}
        finger_match_count = 0

        for fname in HandLandmarkNormalizer.FINGER_NAMES:
            u_ext = user_fingers[fname]["extended"]
            r_ext = ref_fingers[fname]["extended"]

            if u_ext == r_ext:
                finger_eval[fname] = "Correct"
                finger_match_count += 1
            elif r_ext and not u_ext:
                finger_eval[fname] = "Extend finger"
                tips.append(f"Extend your {fname} finger fully.")
            else:
                finger_eval[fname] = "Curl finger"
                tips.append(f"Curl/tuck your {fname} finger into palm.")

        finger_score = (finger_match_count / 5.0) * 100.0

        # 3. Palm orientation check
        user_normal = HandLandmarkNormalizer.calculate_palm_normal(h1_norm)
        user_orientation = HandLandmarkNormalizer.get_palm_orientation_text(user_normal)
        ref_normal = HandLandmarkNormalizer.calculate_palm_normal(ref_norm)
        orientation_dot = float(np.dot(user_normal, ref_normal))

        if orientation_dot < 0.2:
            tips.append(f"Adjust palm direction. Currently: {user_orientation}.")

        # Composite Accuracy Score (Weighted)
        raw_score = (coord_score * 0.45) + (finger_score * 0.55) - hand_penalty
        accuracy_score = round(max(0.0, min(100.0, raw_score)), 1)

        # Status categorization
        if accuracy_score >= 85.0:
            status = "Excellent"
            is_passed = True
            if not tips:
                tips.append("Perfect hand posture! Maintain this form.")
        elif accuracy_score >= 70.0:
            status = "Good"
            is_passed = True
            if not tips:
                tips.append("Good form! Fine-tune finger alignment for higher precision.")
        elif accuracy_score >= 50.0:
            status = "Needs Improvement"
            is_passed = False
        else:
            status = "Incorrect Pose"
            is_passed = False

        return {
            "accuracy_score": accuracy_score,
            "is_passed": is_passed,
            "status": status,
            "posture_tips": tips[:3],  # Return up to 3 clearest actionable tips
            "finger_evaluation": finger_eval
        }

