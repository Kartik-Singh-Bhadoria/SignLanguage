"""Indian Sign Language (ISL) Sign Registry, Metadata, and Dataset Generator."""

import math
from typing import Any, Dict, List, Optional, Tuple
import numpy as np

# 60 Core ISL Classes: 26 Alphabets, 10 Digits, 24 Essential Communication Signs
ISL_ALPHABETS = [chr(c) for c in range(ord('A'), ord('Z') + 1)]
ISL_DIGITS = [str(i) for i in range(10)]
ISL_WORDS = [
    "NAMASTE", "THANK_YOU", "PLEASE", "SORRY", "YES", "NO", "WELCOME",
    "WATER", "FOOD", "MOTHER", "FATHER", "FRIEND", "HOME", "SCHOOL",
    "HELP", "DOCTOR", "MEDICINE", "HOSPITAL", "EMERGENCY", "POLICE",
    "WHAT", "WHERE", "HOW", "WHY"
]

ISL_CLASSES = ISL_ALPHABETS + ISL_DIGITS + ISL_WORDS

# Metadata directory for all ISL signs
SIGN_METADATA: Dict[str, Dict[str, Any]] = {
    # Alphabets
    "A": {"en": "Letter A", "hi": "अक्षर A", "category": "alphabet", "hands": "one_hand", "desc": "Closed fist with thumb extended upright along index finger."},
    "B": {"en": "Letter B", "hi": "अक्षर B", "category": "alphabet", "hands": "one_hand", "desc": "Four fingers extended straight up, thumb tucked across palm."},
    "C": {"en": "Letter C", "hi": "अक्षर C", "category": "alphabet", "hands": "one_hand", "desc": "Hand curved in semi-circular C shape."},
    "D": {"en": "Letter D", "hi": "अक्षर D", "category": "alphabet", "hands": "one_hand", "desc": "Index finger pointing up, thumb and other fingers forming a circle."},
    "E": {"en": "Letter E", "hi": "अक्षर E", "category": "alphabet", "hands": "one_hand", "desc": "All fingers curled into palm with thumb resting underneath fingertips."},
    "F": {"en": "Letter F", "hi": "अक्षर F", "category": "alphabet", "hands": "one_hand", "desc": "Thumb and index tips touching in a circle, middle, ring, pinky extended."},
    "G": {"en": "Letter G", "hi": "अक्षर G", "category": "alphabet", "hands": "one_hand", "desc": "Index and thumb extended horizontally parallel to each other."},
    "H": {"en": "Letter H", "hi": "अक्षर H", "category": "alphabet", "hands": "one_hand", "desc": "Index and middle fingers extended horizontally together."},
    "I": {"en": "Letter I", "hi": "अक्षर I", "category": "alphabet", "hands": "one_hand", "desc": "Pinky finger extended upright, other fingers curled with thumb over them."},
    "J": {"en": "Letter J", "hi": "अक्षर J", "category": "alphabet", "hands": "one_hand", "desc": "Pinky extended, drawing a 'J' curve in the air."},
    "K": {"en": "Letter K", "hi": "अक्षर K", "category": "alphabet", "hands": "one_hand", "desc": "Index up, middle forward at angle, thumb resting between them."},
    "L": {"en": "Letter L", "hi": "अक्षर L", "category": "alphabet", "hands": "one_hand", "desc": "Thumb and index finger extended at 90-degree angle forming 'L'."},
    "M": {"en": "Letter M", "hi": "अक्षर M", "category": "alphabet", "hands": "one_hand", "desc": "Thumb tucked under first three curled fingers."},
    "N": {"en": "Letter N", "hi": "अक्षर N", "category": "alphabet", "hands": "one_hand", "desc": "Thumb tucked under first two curled fingers."},
    "O": {"en": "Letter O", "hi": "अक्षर O", "category": "alphabet", "hands": "one_hand", "desc": "All fingertips touching thumb tip forming an 'O'."},
    "P": {"en": "Letter P", "hi": "अक्षर P", "category": "alphabet", "hands": "one_hand", "desc": "K handshape pointed downwards."},
    "Q": {"en": "Letter Q", "hi": "अक्षर Q", "category": "alphabet", "hands": "one_hand", "desc": "G handshape pointed downwards."},
    "R": {"en": "Letter R", "hi": "अक्षर R", "category": "alphabet", "hands": "one_hand", "desc": "Index and middle fingers crossed over each other."},
    "S": {"en": "Letter S", "hi": "अक्षर S", "category": "alphabet", "hands": "one_hand", "desc": "Tight fist with thumb tucked over the front of the curled fingers."},
    "T": {"en": "Letter T", "hi": "अक्षर T", "category": "alphabet", "hands": "one_hand", "desc": "Thumb tucked between index and middle fingers in a fist."},
    "U": {"en": "Letter U", "hi": "अक्षर U", "category": "alphabet", "hands": "one_hand", "desc": "Index and middle fingers extended upright together."},
    "V": {"en": "Letter V", "hi": "अक्षर V", "category": "alphabet", "hands": "one_hand", "desc": "Index and middle fingers extended upright in a 'V' shape."},
    "W": {"en": "Letter W", "hi": "अक्षर W", "category": "alphabet", "hands": "one_hand", "desc": "Index, middle, and ring fingers extended upright in a 'W' shape."},
    "X": {"en": "Letter X", "hi": "अक्षर X", "category": "alphabet", "hands": "one_hand", "desc": "Index finger hooked/crooked, other fingers curled."},
    "Y": {"en": "Letter Y", "hi": "अक्षर Y", "category": "alphabet", "hands": "one_hand", "desc": "Thumb and pinky extended outwards, middle three curled (shaka/phone)."},
    "Z": {"en": "Letter Z", "hi": "अक्षर Z", "category": "alphabet", "hands": "one_hand", "desc": "Index finger tracing a 'Z' path in the air."},

    # Digits
    "0": {"en": "Number 0", "hi": "संख्या 0", "category": "number", "hands": "one_hand", "desc": "Fingers forming an oval 0 shape."},
    "1": {"en": "Number 1", "hi": "संख्या 1", "category": "number", "hands": "one_hand", "desc": "Index finger pointed upright."},
    "2": {"en": "Number 2", "hi": "संख्या 2", "category": "number", "hands": "one_hand", "desc": "Index and middle fingers upright."},
    "3": {"en": "Number 3", "hi": "संख्या 3", "category": "number", "hands": "one_hand", "desc": "Thumb, index, and middle fingers extended."},
    "4": {"en": "Number 4", "hi": "संख्या 4", "category": "number", "hands": "one_hand", "desc": "Four fingers upright with thumb folded across palm."},
    "5": {"en": "Number 5", "hi": "संख्या 5", "category": "number", "hands": "one_hand", "desc": "Open hand with all five fingers spread wide."},
    "6": {"en": "Number 6", "hi": "संख्या 6", "category": "number", "hands": "one_hand", "desc": "Thumb and pinky tips touching, other 3 extended."},
    "7": {"en": "Number 7", "hi": "संख्या 7", "category": "number", "hands": "one_hand", "desc": "Thumb and ring finger tips touching, other 3 extended."},
    "8": {"en": "Number 8", "hi": "संख्या 8", "category": "number", "hands": "one_hand", "desc": "Thumb and middle finger tips touching, other 3 extended."},
    "9": {"en": "Number 9", "hi": "संख्या 9", "category": "number", "hands": "one_hand", "desc": "Thumb and index tips touching, other 3 extended."},

    # Essential Words / Phrases
    "NAMASTE": {"en": "Namaste / Hello", "hi": "नमस्ते / नमस्कार", "category": "greeting", "hands": "two_hands", "desc": "Both flat hands joined palm-to-palm at chest level."},
    "THANK_YOU": {"en": "Thank You", "hi": "धन्यवाद / शुक्रिया", "category": "greeting", "hands": "one_hand", "desc": "Flat hand moving from chin forward towards recipient."},
    "PLEASE": {"en": "Please", "hi": "कृपया", "category": "greeting", "hands": "one_hand", "desc": "Flat open hand rubbing chest in circular motion."},
    "SORRY": {"en": "Sorry", "hi": "माफ़ कीजिए", "category": "greeting", "hands": "one_hand", "desc": "A-hand/fist rubbing chest in circular motion."},
    "YES": {"en": "Yes", "hi": "हाँ", "category": "greeting", "hands": "one_hand", "desc": "S-hand fist nodding up and down like a head nod."},
    "NO": {"en": "No", "hi": "नहीं", "category": "greeting", "hands": "one_hand", "desc": "Index and middle fingers snap together against thumb."},
    "WELCOME": {"en": "Welcome", "hi": "स्वागत है", "category": "greeting", "hands": "two_hands", "desc": "Both open palms sweeping gracefully inward towards body."},
    "WATER": {"en": "Water", "hi": "पानी / जल", "category": "daily", "hands": "one_hand", "desc": "W-handshape index tap near chin/lips twice."},
    "FOOD": {"en": "Food / Eat", "hi": "खाना / भोजन", "category": "daily", "hands": "one_hand", "desc": "Squashed-O hand brought to mouth repeatedly."},
    "MOTHER": {"en": "Mother", "hi": "माँ / माता जी", "category": "daily", "hands": "one_hand", "desc": "Open 5-hand thumb tapping chin twice."},
    "FATHER": {"en": "Father", "hi": "पिता जी", "category": "daily", "hands": "one_hand", "desc": "Open 5-hand thumb tapping forehead twice."},
    "FRIEND": {"en": "Friend", "hi": "दोस्त / मित्र", "category": "daily", "hands": "two_hands", "desc": "Hooked index fingers interlocking first one way then the other."},
    "HOME": {"en": "Home / House", "hi": "घर", "category": "daily", "hands": "two_hands", "desc": "Fingertips touching at an angle forming a roof shape."},
    "SCHOOL": {"en": "School", "hi": "स्कूल / विद्यालय", "category": "daily", "hands": "two_hands", "desc": "Dominant flat hand clapping twice down onto non-dominant palm."},
    "HELP": {"en": "Help / Assist", "hi": "मदद / सहायता", "category": "emergency", "hands": "two_hands", "desc": "A-hand fist on flat palm lifted upward together."},
    "DOCTOR": {"en": "Doctor", "hi": "डॉक्टर / चिकित्सक", "category": "emergency", "hands": "two_hands", "desc": "Bent fingertips tapping wrist where pulse is measured."},
    "MEDICINE": {"en": "Medicine", "hi": "दवा / औषधि", "category": "emergency", "hands": "one_hand", "desc": "Middle finger rocking on open palm as if grinding pill."},
    "HOSPITAL": {"en": "Hospital", "hi": "अस्पताल", "category": "emergency", "hands": "one_hand", "desc": "H or index finger drawing a cross '+' on upper shoulder/arm."},
    "EMERGENCY": {"en": "Emergency", "hi": "आपातकाल", "category": "emergency", "hands": "one_hand", "desc": "E-hand waving rapidly back and forth with urgency."},
    "POLICE": {"en": "Police", "hi": "पुलिस", "category": "emergency", "hands": "one_hand", "desc": "C-handshape tapped against upper chest (badge location)."},
    "WHAT": {"en": "What?", "hi": "क्या?", "category": "question", "hands": "two_hands", "desc": "Both open palms up, sweeping side to side inquisitively."},
    "WHERE": {"en": "Where?", "hi": "कहाँ?", "category": "question", "hands": "one_hand", "desc": "Index finger extended, wagging side to side."},
    "HOW": {"en": "How?", "hi": "कैसे?", "category": "question", "hands": "two_hands", "desc": "Curved hands back-to-back rotating outwards to open palms up."},
    "WHY": {"en": "Why?", "hi": "क्यों?", "category": "question", "hands": "one_hand", "desc": "Fingers near forehead curling down into a Y-handshape."}
}


def get_isl_class_metadata(sign_key: str) -> Dict[str, Any]:
    """Retrieve full metadata for an ISL sign."""
    if sign_key in SIGN_METADATA:
        data = SIGN_METADATA[sign_key].copy()
        data["sign_key"] = sign_key
        return data

    return {
        "sign_key": sign_key,
        "en": sign_key,
        "hi": sign_key,
        "category": "custom",
        "hands": "one_hand",
        "desc": f"ISL sign for {sign_key}"
    }


def create_base_hand_pose(
    thumb_ext: bool,
    index_ext: bool,
    middle_ext: bool,
    ring_ext: bool,
    pinky_ext: bool,
    palm_angle: float = 0.0,
    wrist_pos: Tuple[float, float, float] = (0.5, 0.7, 0.0)
) -> List[Dict[str, float]]:
    """
    Constructs an anatomically grounded 21-point hand landmark model.
    Points follow standard MediaPipe hand landmark topology.
    """
    wx, wy, wz = wrist_pos
    landmarks = [{"x": wx, "y": wy, "z": wz}]  # 0: Wrist

    # Base bone lengths
    mcp_len = 0.12
    pip_len = 0.08
    dip_len = 0.06
    tip_len = 0.05

    # Finger definitions with spread angles (radians)
    finger_specs = [
        # (name, extended, angle_deg, length_mult)
        ("thumb", thumb_ext, -45.0, 0.85),
        ("index", index_ext, -12.0, 1.0),
        ("middle", middle_ext, 0.0, 1.08),
        ("ring", ring_ext, 12.0, 0.98),
        ("pinky", pinky_ext, 25.0, 0.82),
    ]

    for name, is_ext, spread_deg, mult in finger_specs:
        angle_rad = math.radians(spread_deg + palm_angle)
        dir_x = math.sin(angle_rad)
        dir_y = -math.cos(angle_rad)

        if name == "thumb":
            # Thumb joints
            mcp = {"x": wx + dir_x * 0.06, "y": wy + dir_y * 0.04, "z": wz}
            if is_ext:
                ip = {"x": mcp["x"] + dir_x * 0.05, "y": mcp["y"] + dir_y * 0.04, "z": wz}
                tip = {"x": ip["x"] + dir_x * 0.04, "y": ip["y"] + dir_y * 0.03, "z": wz}
            else:
                # Folded thumb towards palm
                ip = {"x": mcp["x"] + 0.03, "y": mcp["y"] - 0.02, "z": wz - 0.02}
                tip = {"x": ip["x"] + 0.02, "y": ip["y"] - 0.01, "z": wz - 0.03}
            landmarks.extend([
                {"x": wx + dir_x * 0.03, "y": wy + dir_y * 0.02, "z": wz}, # CMC
                mcp,
                ip,
                tip
            ])
        else:
            # MCP
            mcp_x = wx + dir_x * (mcp_len * mult)
            mcp_y = wy + dir_y * (mcp_len * mult)
            mcp = {"x": mcp_x, "y": mcp_y, "z": wz}

            if is_ext:
                pip = {"x": mcp_x + dir_x * (pip_len * mult), "y": mcp_y + dir_y * (pip_len * mult), "z": wz}
                dip = {"x": pip["x"] + dir_x * (dip_len * mult), "y": pip["y"] + dir_y * (dip_len * mult), "z": wz}
                tip = {"x": dip["x"] + dir_x * (tip_len * mult), "y": dip["y"] + dir_y * (tip_len * mult), "z": wz}
            else:
                # Curled into palm
                pip = {"x": mcp_x + dir_x * 0.02, "y": mcp_y + 0.01, "z": wz - 0.03}
                dip = {"x": pip["x"], "y": pip["y"] + 0.03, "z": wz - 0.02}
                tip = {"x": dip["x"], "y": dip["y"] + 0.02, "z": wz - 0.01}

            landmarks.extend([mcp, pip, dip, tip])

    return landmarks


def generate_sign_landmarks(sign_key: str, jitter: float = 0.0) -> List[Dict[str, Any]]:
    """
    Produces anatomical 3D hand landmarks for any ISL sign,
    with optional noise/jitter for robust dataset augmentation.
    """
    rng = np.random.default_rng() if jitter > 0 else None

    def add_noise(pts: List[Dict[str, float]]) -> List[Dict[str, float]]:
        if jitter <= 0.0 or rng is None:
            return pts
        noisy = []
        for p in pts:
            noisy.append({
                "x": float(p["x"] + rng.normal(0, jitter)),
                "y": float(p["y"] + rng.normal(0, jitter)),
                "z": float(p["z"] + rng.normal(0, jitter * 0.5)),
            })
        return noisy

    meta = SIGN_METADATA.get(sign_key, {})
    is_two_handed = meta.get("hands") == "two_hands"

    # Define characteristic finger extensions for every sign
    pose_map = {
        # Alphabets
        "A": (True, False, False, False, False),
        "B": (False, True, True, True, True),
        "C": (True, True, True, True, True),
        "D": (False, True, False, False, False),
        "E": (False, False, False, False, False),
        "F": (False, False, True, True, True),
        "G": (True, True, False, False, False),
        "H": (False, True, True, False, False),
        "I": (False, False, False, False, True),
        "J": (False, False, False, False, True),
        "K": (True, True, True, False, False),
        "L": (True, True, False, False, False),
        "M": (False, False, False, False, False),
        "N": (False, False, False, False, False),
        "O": (True, True, True, True, True),
        "P": (True, True, True, False, False),
        "Q": (True, True, False, False, False),
        "R": (False, True, True, False, False),
        "S": (False, False, False, False, False),
        "T": (False, False, False, False, False),
        "U": (False, True, True, False, False),
        "V": (False, True, True, False, False),
        "W": (False, True, True, True, False),
        "X": (False, False, False, False, False),
        "Y": (True, False, False, False, True),
        "Z": (False, True, False, False, False),

        # Digits
        "0": (True, True, True, True, True),
        "1": (False, True, False, False, False),
        "2": (False, True, True, False, False),
        "3": (True, True, True, False, False),
        "4": (False, True, True, True, True),
        "5": (True, True, True, True, True),
        "6": (False, True, True, True, False),
        "7": (False, True, True, False, True),
        "8": (False, True, False, True, True),
        "9": (False, False, True, True, True),

        # Signs
        "NAMASTE": (True, True, True, True, True),
        "THANK_YOU": (True, True, True, True, True),
        "PLEASE": (True, True, True, True, True),
        "SORRY": (True, False, False, False, False),
        "YES": (True, False, False, False, False),
        "NO": (True, True, True, False, False),
        "WELCOME": (True, True, True, True, True),
        "WATER": (False, True, True, True, False),
        "FOOD": (True, True, True, True, True),
        "MOTHER": (True, True, True, True, True),
        "FATHER": (True, True, True, True, True),
        "FRIEND": (False, True, False, False, False),
        "HOME": (True, True, True, True, True),
        "SCHOOL": (True, True, True, True, True),
        "HELP": (True, False, False, False, False),
        "DOCTOR": (False, True, True, False, False),
        "MEDICINE": (False, False, True, False, False),
        "HOSPITAL": (False, True, False, False, False),
        "EMERGENCY": (False, False, False, False, False),
        "POLICE": (True, True, True, False, False),
        "WHAT": (True, True, True, True, True),
        "WHERE": (False, True, False, False, False),
        "HOW": (True, True, True, True, True),
        "WHY": (True, False, False, False, True),
    }

    t, i, m, r, p = pose_map.get(sign_key, (True, True, True, True, True))

    # Hand 1 (Right)
    h1_wrist = (0.55, 0.65, 0.0) if is_two_handed else (0.5, 0.65, 0.0)
    h1_points = create_base_hand_pose(t, i, m, r, p, palm_angle=0.0, wrist_pos=h1_wrist)
    h1_points = add_noise(h1_points)

    hands = [{"handedness": "Right", "landmarks": h1_points}]

    if is_two_handed:
        # Hand 2 (Left)
        h2_wrist = (0.45, 0.65, 0.0)
        h2_points = create_base_hand_pose(t, i, m, r, p, palm_angle=180.0, wrist_pos=h2_wrist)
        h2_points = add_noise(h2_points)
        hands.append({"handedness": "Left", "landmarks": h2_points})

    return hands


def generate_isl_dataset(samples_per_class: int = 15) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generates a calibrated feature training dataset for all 60 ISL classes
    with realistic variations for PyTorch training and inference.
    """
    from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer

    X_list = []
    y_list = []

    for class_idx, sign_key in enumerate(ISL_CLASSES):
        for s in range(samples_per_class):
            jitter = 0.0 if s == 0 else (0.015 + 0.01 * (s % 3))
            hands = generate_sign_landmarks(sign_key, jitter=jitter)
            feat = HandLandmarkNormalizer.extract_features(hands)
            X_list.append(feat)
            y_list.append(class_idx)

    X = np.array(X_list, dtype=np.float32)
    y = np.array(y_list, dtype=np.int64)
    return X, y

