"""Tests for Text-to-ISL Grammar Translator and Sequencer."""

from backend.app.services.ai.text_to_sign import ISLGrammarTranslator


def test_isl_grammar_question_reordering():
    text = "Where is the hospital?"
    gloss, note = ISLGrammarTranslator.translate_to_isl_gloss(text)

    # In ISL, 'WHERE' must be at the end, and 'the', 'is' must be dropped
    assert gloss == ["HOSPITAL", "WHERE"]
    assert "ISL syntax" in note


def test_isl_grammar_time_marker_at_front():
    text = "I need water today"
    gloss, _ = ISLGrammarTranslator.translate_to_isl_gloss(text)

    assert gloss[0] == "TODAY"
    assert "WATER" in gloss


def test_hindi_to_isl_translation():
    text = "नमस्ते मुझे पानी चाहिए"
    gloss, _ = ISLGrammarTranslator.translate_to_isl_gloss(text)

    assert "NAMASTE" in gloss
    assert "WATER" in gloss


def test_generate_sign_sequence_with_fingerspelling():
    text = "Doctor Aarav"
    result = ISLGrammarTranslator.generate_sign_sequence(text)

    assert result["original_text"] == text
    assert len(result["sequence"]) >= 2

    # "Doctor" should be recognized as dictionary sign
    doc_sign = next((item for item in result["sequence"] if item["token"] == "DOCTOR"), None)
    assert doc_sign is not None
    assert doc_sign["is_fingerspelled"] is False

    # "Aarav" should be fingerspelled letter-by-letter
    letters = [item["token"] for item in result["sequence"] if item["is_fingerspelled"]]
    assert "A" in letters
    assert "R" in letters
    assert "V" in letters
    assert result["total_duration_seconds"] > 0

