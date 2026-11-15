"""Hand Landmark Normalizer and Geometric Feature Extractor for ISL."""

import math
from typing import Any, Dict, List, Optional, Tuple
import numpy as np


class HandLandmarkNormalizer:
    """
    Transforms raw MediaPipe 21-point hand landmarks into translation-,
    scale-, and rotation-invariant feature vectors for ISL recognition.
    """

    FEATURE_DIM = 140  # 63 (hand 1 coords) + 63 (hand 2 coords) + 14 (geometric interactions)

    # 21 MediaPipe landmark indices
    WRIST = 0
    THUMB_CMC, THUMB_MCP, THUMB_IP, THUMB_TIP = 1, 2, 3, 4
    INDEX_MCP, INDEX_PIP, INDEX_DIP, INDEX_TIP = 5, 6, 7, 8
    MIDDLE_MCP, MIDDLE_PIP, MIDDLE_DIP, MIDDLE_TIP = 9, 10, 11, 12
    RING_MCP, RING_PIP, RING_DIP, RING_TIP = 13, 14, 15, 16
    PINKY_MCP, PINKY_PIP, PINKY_DIP, PINKY_TIP = 17, 18, 19, 20

    FINGER_TIPS = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP]
    FINGER_MCPS = [THUMB_CMC, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP]
    FINGER_NAMES = ["Thumb", "Index", "Middle", "Ring", "Pinky"]

    @classmethod
    def normalize_single_hand(cls, points: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Normalize 21x3 hand points:
        - Translate wrist (index 0) to origin (0, 0, 0).
        - Scale by distance between wrist and middle finger MCP (index 9).
        """
        if points.shape != (21, 3):
            raise ValueError(f"Expected points shape (21, 3), got {points.shape}")

        wrist = points[cls.WRIST].copy()
        translated = points - wrist

        # Hand scale: distance between wrist and middle MCP
        scale = np.linalg.norm(translated[cls.MIDDLE_MCP])
        if scale < 1e-4:
            scale = 1.0

        normalized = translated / scale
        return normalized, float(scale)

    @classmethod
    def calculate_angle(cls, a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
        """Calculate interior angle ABC in degrees."""
        ba = a - b
        bc = c - b
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-7)
        cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
        return float(np.degrees(np.arccos(cosine_angle)))

    @classmethod
    def calculate_finger_extensions(cls, normalized_points: np.ndarray) -> Dict[str, Dict[str, Any]]:
        """
        Calculates extension state and curl metrics for each finger.
        Returns whether each finger is 'Extended', 'Curled', or 'Neutral'.
        """
        results = {}

        # 1. Thumb: Check angle between CMC, MCP, TIP and distance to Pinky MCP
        thumb_angle = cls.calculate_angle(
            normalized_points[cls.THUMB_CMC],
            normalized_points[cls.THUMB_MCP],
            normalized_points[cls.THUMB_TIP]
        )
        thumb_dist = np.linalg.norm(normalized_points[cls.THUMB_TIP] - normalized_points[cls.INDEX_MCP])
        is_thumb_extended = thumb_angle > 140.0 and thumb_dist > 0.4
        results["Thumb"] = {
            "extended": bool(is_thumb_extended),
            "angle": round(thumb_angle, 1),
            "state": "Extended" if is_thumb_extended else "Curled"
        }

        # 2. Fingers (Index, Middle, Ring, Pinky)
        finger_indices = [
            ("Index", cls.INDEX_MCP, cls.INDEX_PIP, cls.INDEX_TIP),
            ("Middle", cls.MIDDLE_MCP, cls.MIDDLE_PIP, cls.MIDDLE_TIP),
            ("Ring", cls.RING_MCP, cls.RING_PIP, cls.RING_TIP),
            ("Pinky", cls.PINKY_MCP, cls.PINKY_PIP, cls.PINKY_TIP),
        ]

        for name, mcp_idx, pip_idx, tip_idx in finger_indices:
            tip_dist = np.linalg.norm(normalized_points[tip_idx])
            mcp_dist = np.linalg.norm(normalized_points[mcp_idx])
            angle = cls.calculate_angle(
                normalized_points[mcp_idx],
                normalized_points[pip_idx],
                normalized_points[tip_idx]
            )
            # A finger is extended when tip distance is notably greater than MCP and joint angle > 130
            is_extended = (tip_dist > mcp_dist * 1.25) and (angle > 125.0)
            is_curled = (tip_dist < mcp_dist * 1.1) or (angle < 95.0)

            state = "Extended" if is_extended else ("Curled" if is_curled else "Neutral")
            results[name] = {
                "extended": bool(is_extended),
                "angle": round(angle, 1),
                "state": state
            }

        return results

    @classmethod
    def calculate_palm_normal(cls, normalized_points: np.ndarray) -> np.ndarray:
        """Calculate palm normal vector using wrist, index MCP, and pinky MCP."""
        v1 = normalized_points[cls.INDEX_MCP] - normalized_points[cls.WRIST]
        v2 = normalized_points[cls.PINKY_MCP] - normalized_points[cls.WRIST]
        normal = np.cross(v1, v2)
        norm = np.linalg.norm(normal)
        if norm > 1e-6:
            normal = normal / norm
        return normal

    @classmethod
    def get_palm_orientation_text(cls, normal: np.ndarray) -> str:
        """Convert normal vector into human-friendly orientation text."""
        # normal: [x, y, z] (camera coordinate system: z is outward/depth)
        nx, ny, nz = normal[0], normal[1], normal[2]
        if nz < -0.5:
            return "Facing Forward (towards camera)"
        elif nz > 0.5:
            return "Facing Inward (towards user)"
        elif ny < -0.5:
            return "Facing Upward"
        elif ny > 0.5:
            return "Facing Downward"
        elif nx > 0.5:
            return "Facing Right"
        else:
            return "Facing Left"

    @classmethod
    def extract_features(cls, hands_data: List[Dict[str, Any]]) -> np.ndarray:
        """
        Extracts a normalized 140-dimensional feature vector from 1 or 2 hands.
        - Hand 1 (Dominant / Right): 63 normalized landmark coords
        - Hand 2 (Secondary / Left): 63 normalized landmark coords (or zero-padded)
        - 14 interaction features:
          [0-4]: Hand 1 finger extension flags (1.0 or 0.0)
          [5-9]: Hand 2 finger extension flags (1.0 or 0.0)
          [10]: Inter-wrist distance
          [11]: Inter-index-tip distance
          [12]: Palm normal alignment dot product
          [13]: Hand count (0.5 for 1 hand, 1.0 for 2 hands)
        """
        features = np.zeros(cls.FEATURE_DIM, dtype=np.float32)

        if not hands_data:
            return features

        # Sort hands so Right/Dominant is hand 1, Left is hand 2 if possible
        sorted_hands = sorted(
            hands_data,
            key=lambda h: 0 if str(h.get("handedness", "Right")).lower() in ["right", "dominant"] else 1
        )

        # Hand 1
        h1 = sorted_hands[0]
        h1_raw = np.array([[pt["x"], pt["y"], pt.get("z", 0.0)] for pt in h1["landmarks"]], dtype=np.float32)
        h1_norm, _ = cls.normalize_single_hand(h1_raw)
        features[0:63] = h1_norm.flatten()

        h1_fingers = cls.calculate_finger_extensions(h1_norm)
        for i, fname in enumerate(cls.FINGER_NAMES):
            features[126 + i] = 1.0 if h1_fingers[fname]["extended"] else 0.0

        h1_normal = cls.calculate_palm_normal(h1_norm)

        # Hand 2 (if present)
        if len(sorted_hands) > 1:
            h2 = sorted_hands[1]
            h2_raw = np.array([[pt["x"], pt["y"], pt.get("z", 0.0)] for pt in h2["landmarks"]], dtype=np.float32)
            h2_norm, _ = cls.normalize_single_hand(h2_raw)
            features[63:126] = h2_norm.flatten()

            h2_fingers = cls.calculate_finger_extensions(h2_norm)
            for i, fname in enumerate(cls.FINGER_NAMES):
                features[131 + i] = 1.0 if h2_fingers[fname]["extended"] else 0.0

            # Inter-hand interactions
            h2_normal = cls.calculate_palm_normal(h2_norm)
            inter_wrist_dist = float(np.linalg.norm(h1_raw[cls.WRIST] - h2_raw[cls.WRIST]))
            inter_index_dist = float(np.linalg.norm(h1_raw[cls.INDEX_TIP] - h2_raw[cls.INDEX_TIP]))
            normal_dot = float(np.dot(h1_normal, h2_normal))

            features[136] = min(inter_wrist_dist, 5.0)
            features[137] = min(inter_index_dist, 5.0)
            features[138] = normal_dot
            features[139] = 1.0  # Two hands present
        else:
            features[139] = 0.5  # One hand present

        return features

