"""End-to-End Comprehensive Integration Test for SignConnect AI Platform.

Simulates the complete user and accessibility workflow:
1. User registration, authentication, and JWT token issuance.
2. Accessibility preferences customization (high contrast, font scale, speed).
3. ISL dictionary query for authentic sign metadata.
4. Computer vision landmark ingestion and real-time AI recognition.
5. Two-way translation: English text -> authentic ISL SOV gloss sequence.
6. Reverse translation: ISL sign stream -> synthesized natural language sentence.
7. Interactive practice session attempt, posture evaluation, and scoring.
8. WebRTC meeting room provisioning, signaling registration, and caption broadcast.
"""

from backend.app.api.v1.auth import login_user, register_user, update_accessibility_settings
from backend.app.api.v1.health import check_health
from backend.app.api.v1.practice import evaluate_practice_attempt, get_practice_history
from backend.app.api.v1.recognition import recognize_landmarks
from backend.app.api.v1.signs import get_sign_detail, list_signs
from backend.app.api.v1.translation import translate_sign_to_text, translate_text_to_sign
from backend.app.api.v1.video import create_room, get_room_details
from backend.app.core.security import decode_access_token
from backend.app.db_seeder import seed_isl_dictionary
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest
from backend.app.schemas.practice import PracticeSubmission
from backend.app.schemas.recognition import LandmarkFrame
from backend.app.schemas.room import RoomCreate
from backend.app.schemas.translation import SignToTextRequest, TextToSignRequest
from backend.app.schemas.user import AccessibilitySettings, UserCreate
from backend.app.services.webrtc.signaling import WebRTCSignalingManager


def test_signconnect_ai_end_to_end_pipeline(db_session):
    # Step 1: Health check & DB seed
    seed_isl_dictionary(db_session)
    health = check_health(db=db_session)
    assert health["status"] == "healthy"
    assert health["ai_classifier"]["classes_count"] == 60

    # Step 2: User Registration & Authentication
    reg_payload = UserCreate(
        email="riya.deafadvocate@signconnect.ai",
        password="RiyaSecurePassword@2026",
        full_name="Riya Sengupta",
        preferred_language="en"
    )
    auth_token = register_user(payload=reg_payload, db=db_session)
    assert auth_token.access_token is not None
    user_id = auth_token.user_id

    # Verify JWT payload
    jwt_claims = decode_access_token(auth_token.access_token)
    assert jwt_claims is not None
    assert jwt_claims["sub"] == "riya.deafadvocate@signconnect.ai"
    assert jwt_claims["user_id"] == user_id

    # Step 3: Accessibility Customization
    user = db_session.query(User).filter(User.id == user_id).first()
    acc_settings = AccessibilitySettings(
        high_contrast=True,
        font_scale=1.25,
        sign_playback_speed=0.75,
        caption_size="large",
        reduce_motion=True,
        color_blind_mode="none",
        screen_reader_hints=True
    )
    updated_user = update_accessibility_settings(
        settings_update=acc_settings,
        current_user=user,
        db=db_session
    )
    assert updated_user.accessibility_settings["high_contrast"] is True
    assert updated_user.accessibility_settings["font_scale"] == 1.25

    # Step 4: Dictionary Lookup for 'NAMASTE'
    sign_namaste = get_sign_detail(sign_key="NAMASTE", db=db_session)
    assert sign_namaste.sign_key == "NAMASTE"
    assert sign_namaste.hand_type == "two_hands"
    assert sign_namaste.landmark_template is not None
    assert len(sign_namaste.landmark_template["hands"]) == 2

    # Step 5: Real-time Landmark Recognition
    frame = LandmarkFrame(hands=sign_namaste.landmark_template["hands"])
    rec_result = recognize_landmarks(frame=frame)
    assert rec_result.is_detected is True
    assert rec_result.confidence > 0.0
    assert rec_result.posture_feedback is not None
    assert rec_result.inference_time_ms > 0.0

    # Step 6: Text-to-Sign Translation with ISL SOV Grammar & Question Reordering
    t2s_payload = TextToSignRequest(
        text="Where is the doctor?",
        source_language="en",
        simplify_grammar=True
    )
    t2s_res = translate_text_to_sign(payload=t2s_payload, current_user=user, db=db_session)
    # Authentic ISL places question words at the end and drops 'the', 'is'
    assert t2s_res.isl_gloss_sequence == ["DOCTOR", "WHERE"]
    assert len(t2s_res.sequence) >= 2
    assert t2s_res.total_duration_seconds > 0.0

    # Step 7: Sign-to-Text Translation
    s2t_payload = SignToTextRequest(
        sign_keys=["NAMASTE", "WATER", "HELP"],
        target_language="en"
    )
    s2t_res = translate_sign_to_text(payload=s2t_payload, current_user=user, db=db_session)
    assert "Namaste" in s2t_res.generated_text
    assert "Water" in s2t_res.generated_text
    assert "Help" in s2t_res.generated_text

    # Step 8: Interactive Practice & Posture Evaluation
    practice_payload = PracticeSubmission(
        sign_id=sign_namaste.id,
        frame=frame
    )
    eval_res = evaluate_practice_attempt(payload=practice_payload, current_user=user, db=db_session)
    assert eval_res.sign_id == sign_namaste.id
    assert eval_res.sign_key == "NAMASTE"
    assert eval_res.accuracy_score >= 80.0
    assert eval_res.is_passed is True

    # Check practice history
    history = get_practice_history(limit=5, current_user=user, db=db_session)
    assert len(history) >= 1
    assert history[0]["sign_key"] == "NAMASTE"

    # Step 9: WebRTC Meeting Room & Signaling
    room_payload = RoomCreate(
        title="ISL Inclusive Classroom",
        isl_captioning_enabled=True,
        max_participants=10
    )
    room = create_room(payload=room_payload, current_user=user, db=db_session)
    assert room.room_code.startswith("SIGN-")

    room_details = get_room_details(room_code=room.room_code, db=db_session)
    assert room_details.id == room.id
    assert room_details.isl_captioning_enabled is True

    # Test Signaling Manager
    manager = WebRTCSignalingManager()
    manager.register_peer(room.room_code, "peer_riya", None)
    manager.register_peer(room.room_code, "peer_doctor", None)
    assert len(manager.get_room_peers(room.room_code)) == 2
    manager.unregister_peer(room.room_code, "peer_riya")
    assert manager.get_room_peers(room.room_code) == ["peer_doctor"]

