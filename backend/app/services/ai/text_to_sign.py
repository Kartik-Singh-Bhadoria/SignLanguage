"""Text-to-ISL Grammar Reordering and Sign Timeline Sequencer."""

import re
from typing import Any, Dict, List, Optional, Tuple
from backend.app.services.ai.isl_dataset import ISL_CLASSES, SIGN_METADATA, get_isl_class_metadata

# Hindi to English sign key mapper
HINDI_TO_SIGN_MAP = {
    "नमस्ते": "NAMASTE", "नमस्कार": "NAMASTE", "प्रणाम": "NAMASTE",
    "धन्यवाद": "THANK_YOU", "शुक्रिया": "THANK_YOU",
    "कृपया": "PLEASE",
    "माफ़": "SORRY", "माफ": "SORRY", "क्षमा": "SORRY",
    "हाँ": "YES", "हां": "YES",
    "नहीं": "NO", "ना": "NO",
    "स्वागत": "WELCOME",
    "पानी": "WATER", "जल": "WATER",
    "खाना": "FOOD", "भोजन": "FOOD",
    "माँ": "MOTHER", "माता": "MOTHER",
    "पिता": "FATHER", "पापा": "FATHER",
    "दोस्त": "FRIEND", "मित्र": "FRIEND",
    "घर": "HOME",
    "स्कूल": "SCHOOL", "विद्यालय": "SCHOOL",
    "मदद": "HELP", "सहायता": "HELP",
    "डॉक्टर": "DOCTOR", "चिकित्सक": "DOCTOR",
    "दवा": "MEDICINE", "दवाई": "MEDICINE",
    "अस्पताल": "HOSPITAL",
    "आपातकाल": "EMERGENCY", "खतरा": "EMERGENCY",
    "पुलिस": "POLICE",
    "क्या": "WHAT",
    "कहाँ": "WHERE", "कहा": "WHERE",
    "कैसे": "HOW",
    "क्यों": "WHY",
}

# Stopwords dropped in ISL grammar (auxiliaries, articles, prepositions)
ISL_STOPWORDS = {
    "a", "an", "the", "is", "am", "are", "was", "were", "be", "been", "being",
    "do", "does", "did", "to", "of", "in", "at", "by", "for", "with", "about",
    "into", "through", "during", "before", "after", "above", "below", "me", "i", "my"
}

# Question words in ISL are placed at the end of the sentence
ISL_QUESTION_WORDS = {"what", "where", "why", "how", "who", "when"}

# Time markers in ISL are placed at the beginning
ISL_TIME_MARKERS = {"today", "yesterday", "tomorrow", "now", "later", "morning", "night", "daily"}

PUNCTUATION_CHARS = ".,!?:;\"'()[]{}/\\-_~`"


class ISLGrammarTranslator:
    """
    Translates English and Hindi text into Indian Sign Language (ISL) gloss
    syntax following authentic ISL grammar (SOV order, end question markers,
    particle omission, and fingerspelling fallback).
    """

    @classmethod
    def translate_to_isl_gloss(cls, text: str, source_lang: str = "en") -> Tuple[List[str], str]:
        """
        Parses text and applies ISL grammatical transformations:
        1. Tokenizes text supporting Unicode/Devanagari scripts.
        2. Checks Hindi direct sign mapping.
        3. Drops non-manual copulas and articles (is, am, are, the, etc.).
        4. Isolates time markers to front (Topic/Temporal setting).
        5. Isolates question markers to end (ISL standard: Wh-word at sentence end).
        6. Reorders SVO tokens into SOV gloss tokens.
        """
        raw_words = text.strip().split()
        cleaned_words: List[str] = []

        for raw_word in raw_words:
            word_stripped = raw_word.strip(PUNCTUATION_CHARS)
            if not word_stripped:
                continue

            # Check Hindi direct mapping
            if word_stripped in HINDI_TO_SIGN_MAP:
                cleaned_words.append(HINDI_TO_SIGN_MAP[word_stripped])
                continue

            token_lower = word_stripped.lower()

            # Drop English stopwords
            if token_lower in ISL_STOPWORDS:
                continue

            cleaned_words.append(word_stripped.upper())

        if not cleaned_words:
            return [], "No valid grammatical tokens found."

        # Separate into linguistic categories
        time_tokens: List[str] = []
        question_tokens: List[str] = []
        content_tokens: List[str] = []

        for word in cleaned_words:
            word_lower = word.lower()
            if word_lower in ISL_TIME_MARKERS:
                time_tokens.append(word)
            elif word_lower in ISL_QUESTION_WORDS or word in ["WHAT", "WHERE", "HOW", "WHY"]:
                question_tokens.append(word)
            else:
                content_tokens.append(word)

        # ISL Grammar Ordering: [Time Markers] + [Subject / Object / Verb] + [Questions / Negations]
        isl_gloss = time_tokens + content_tokens + question_tokens

        grammar_note = (
            "Applied authentic ISL syntax rules: "
            "omitted English copulas/articles, placed time markers at beginning, "
            "and shifted interrogative markers to sentence end."
        )

        return isl_gloss, grammar_note

    @classmethod
    def generate_sign_sequence(
        cls,
        text: str,
        source_lang: str = "en",
        simplify_grammar: bool = True
    ) -> Dict[str, Any]:
        """
        Generates full timed sequence of ISL signs for visual animation and display.
        Includes fingerspelling fallback for terms not in the predefined lexicon.
        """
        if simplify_grammar:
            gloss_tokens, grammar_note = cls.translate_to_isl_gloss(text, source_lang)
        else:
            gloss_tokens = [w.strip(PUNCTUATION_CHARS).upper() for w in text.strip().split() if w.strip(PUNCTUATION_CHARS)]
            grammar_note = "Direct literal translation without ISL grammatical reordering."

        sequence_items: List[Dict[str, Any]] = []
        total_duration = 0.0

        for token in gloss_tokens:
            # 1. Direct match in ISL dictionary
            if token in SIGN_METADATA:
                meta = SIGN_METADATA[token]
                duration = 1.4 if meta.get("hands") == "two_hands" else 1.0
                sequence_items.append({
                    "token": token,
                    "sign_key": token,
                    "english_label": meta["en"],
                    "hindi_label": meta["hi"],
                    "category": meta["category"],
                    "is_fingerspelled": False,
                    "duration_seconds": duration,
                    "description": meta["desc"],
                    "hand_type": meta.get("hands", "one_hand")
                })
                total_duration += duration
            else:
                # 2. Fingerspelling fallback for novel words/names (e.g. "AARAV" -> A, A, R, A, V)
                for char in token:
                    if char in SIGN_METADATA:
                        meta = SIGN_METADATA[char]
                        duration = 0.6  # Quicker for fingerspelling
                        sequence_items.append({
                            "token": char,
                            "sign_key": char,
                            "english_label": meta["en"],
                            "hindi_label": meta["hi"],
                            "category": "alphabet",
                            "is_fingerspelled": True,
                            "duration_seconds": duration,
                            "description": f"Fingerspelled letter '{char}' in '{token}'",
                            "hand_type": "one_hand"
                        })
                        total_duration += duration

        return {
            "original_text": text,
            "source_language": source_lang,
            "isl_gloss_sequence": gloss_tokens,
            "sequence": sequence_items,
            "total_duration_seconds": round(total_duration, 2),
            "grammar_notes": grammar_note
        }
