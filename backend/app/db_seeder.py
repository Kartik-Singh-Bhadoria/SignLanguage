"""Database initial data seeder for Indian Sign Language (ISL) dictionary."""

from sqlalchemy.orm import Session
from backend.app.models.sign import ISLSign
from backend.app.services.ai.isl_dataset import (
    ISL_CLASSES,
    SIGN_METADATA,
    generate_sign_landmarks,
    get_isl_class_metadata,
)


def seed_isl_dictionary(db: Session) -> int:
    """
    Populates the database with all 60 authentic ISL signs
    if the dictionary table is empty.
    Returns the count of signs added.
    """
    existing_count = db.query(ISLSign).count()
    if existing_count >= len(ISL_CLASSES):
        return 0

    added_count = 0
    for sign_key in ISL_CLASSES:
        existing = db.query(ISLSign).filter_by(sign_key=sign_key).first()
        if existing:
            continue

        meta = get_isl_class_metadata(sign_key)
        hands_req = meta.get("hands", "one_hand")
        category = meta.get("category", "alphabet")

        # Generate reference landmark template
        ref_landmarks = generate_sign_landmarks(sign_key, jitter=0.0)

        # Determine difficulty
        difficulty = "easy"
        if hands_req == "two_hands":
            difficulty = "medium"
        if category in ["emergency", "question"]:
            difficulty = "medium" if hands_req == "one_hand" else "hard"

        sign_entry = ISLSign(
            sign_key=sign_key,
            english_label=meta["en"],
            hindi_label=meta["hi"],
            category=category,
            description=meta["desc"],
            hand_type=hands_req,
            dominant_hand="both" if hands_req == "two_hands" else "right",
            difficulty_level=difficulty,
            tags=f"{category},{sign_key.lower()},{meta['en'].lower()}",
            landmark_template={"hands": ref_landmarks}
        )
        db.add(sign_entry)
        added_count += 1

    db.commit()
    return added_count

