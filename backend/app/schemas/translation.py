"""Schemas for Text-to-Sign and Sign-to-Text translation pipelines."""

from typing import List, Optional
from pydantic import BaseModel, Field


class TextToSignRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    source_language: str = "en"  # "en" or "hi"
    simplify_grammar: bool = True  # Transform English SVO to ISL SOV grammar


class SignSequenceItem(BaseModel):
    token: str
    sign_key: str
    english_label: str
    hindi_label: str
    category: str
    is_fingerspelled: bool = False
    duration_seconds: float = 1.2
    description: Optional[str] = None
    hand_type: str = "one_hand"


class TextToSignResponse(BaseModel):
    original_text: str
    source_language: str
    isl_gloss_sequence: List[str]
    sequence: List[SignSequenceItem]
    total_duration_seconds: float
    grammar_notes: str


class SignToTextRequest(BaseModel):
    sign_keys: List[str] = Field(..., min_length=1)
    target_language: str = "en"


class SignToTextResponse(BaseModel):
    generated_text: str
    target_language: str
    detected_signs: List[str]
    confidence_average: float

