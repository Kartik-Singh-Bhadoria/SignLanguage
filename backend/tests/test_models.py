"""Test SQLAlchemy models, relationships, and queries."""

from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.models.sign import ISLSign
from backend.app.models.session import PracticeSession
from backend.app.models.translation import TranslationLog
from backend.app.models.room import VideoRoom


def test_user_creation_and_defaults(db_session):
    user = User(
        email="aarav@signconnect.ai",
        hashed_password=get_password_hash("Secret123"),
        full_name="Aarav Sharma",
        preferred_language="hi"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.email == "aarav@signconnect.ai"
    assert user.is_active is True
    assert user.accessibility_settings["high_contrast"] is False
    assert user.accessibility_settings["font_scale"] == 1.0


def test_isl_sign_creation_and_query(db_session):
    sign = ISLSign(
        sign_key="NAMASTE",
        english_label="Namaste / Hello",
        hindi_label="नमस्ते / नमस्कार",
        category="greeting",
        description="Palms joined together near the chest in traditional Indian greeting.",
        hand_type="two_hands",
        dominant_hand="both",
        difficulty_level="easy",
        tags="greeting,hello,namaste,welcome"
    )
    db_session.add(sign)
    db_session.commit()
    db_session.refresh(sign)

    assert sign.id is not None
    assert sign.sign_key == "NAMASTE"
    assert sign.hand_type == "two_hands"

    found = db_session.query(ISLSign).filter_by(sign_key="NAMASTE").first()
    assert found is not None
    assert found.hindi_label == "नमस्ते / नमस्कार"


def test_practice_session_relationship(db_session):
    user = User(
        email="priya@signconnect.ai",
        hashed_password=get_password_hash("PriyaPass"),
        full_name="Priya Patel"
    )
    sign = ISLSign(
        sign_key="A",
        english_label="Letter A",
        hindi_label="अक्षर A",
        category="alphabet",
        description="Fist closed with thumb upright resting alongside index finger.",
        hand_type="one_hand"
    )
    db_session.add_all([user, sign])
    db_session.commit()

    practice = PracticeSession(
        user_id=user.id,
        sign_id=sign.id,
        accuracy_score=94.5,
        attempts_count=2,
        feedback_notes="Excellent hand posture with thumb firmly aligned.",
        posture_metrics={"wrist_alignment": 0.98, "thumb_curl": 0.05}
    )
    db_session.add(practice)
    db_session.commit()
    db_session.refresh(practice)

    assert practice.id is not None
    assert practice.user.email == "priya@signconnect.ai"
    assert practice.sign.sign_key == "A"
    assert practice.accuracy_score == 94.5


def test_translation_log_creation(db_session):
    trans_log = TranslationLog(
        source_mode="sign_to_text",
        input_content="[NAMASTE, HELP]",
        output_content="Namaste, please help me.",
        confidence_score=0.92,
        latency_ms=145.2
    )
    db_session.add(trans_log)
    db_session.commit()
    db_session.refresh(trans_log)

    assert trans_log.id is not None
    assert trans_log.source_mode == "sign_to_text"
    assert trans_log.confidence_score == 0.92


def test_video_room_creation(db_session):
    room = VideoRoom(
        room_code="SIGN-CON-4029",
        title="ISL Inclusive Classroom",
        max_participants=8,
        isl_captioning_enabled=True
    )
    db_session.add(room)
    db_session.commit()
    db_session.refresh(room)

    assert room.id is not None
    assert room.room_code == "SIGN-CON-4029"
    assert room.is_active is True

