"""Tests for Translation API handlers."""

from backend.app.api.v1.translation import (
    get_translation_history,
    translate_sign_to_text,
    translate_text_to_sign,
)
from backend.app.schemas.translation import SignToTextRequest, TextToSignRequest


def test_text_to_sign_api(db_session):
    payload = TextToSignRequest(
        text="Where is the doctor?",
        source_language="en",
        simplify_grammar=True
    )
    res = translate_text_to_sign(payload=payload, current_user=None, db=db_session)

    assert res.original_text == "Where is the doctor?"
    assert res.isl_gloss_sequence == ["DOCTOR", "WHERE"]
    assert len(res.sequence) >= 2
    assert res.total_duration_seconds > 0.0


def test_sign_to_text_api(db_session):
    payload = SignToTextRequest(
        sign_keys=["NAMASTE", "HELP"],
        target_language="en"
    )
    res = translate_sign_to_text(payload=payload, current_user=None, db=db_session)

    assert "Namaste" in res.generated_text
    assert "Help" in res.generated_text
    assert res.target_language == "en"


def test_translation_history(db_session):
    history = get_translation_history(limit=5, current_user=None, db=db_session)
    assert isinstance(history, list)
