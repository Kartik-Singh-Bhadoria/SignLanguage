"""Translation endpoints for Text-to-Sign and Sign-to-Text pipelines."""

import time
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_optional_user
from backend.app.models.translation import TranslationLog
from backend.app.models.user import User
from backend.app.schemas.translation import (
    SignSequenceItem,
    SignToTextRequest,
    SignToTextResponse,
    TextToSignRequest,
    TextToSignResponse,
)
from backend.app.services.ai.isl_dataset import get_isl_class_metadata
from backend.app.services.ai.text_to_sign import ISLGrammarTranslator

router = APIRouter(prefix="/translation", tags=["Translation"])


@router.post("/text-to-sign", response_model=TextToSignResponse)
def translate_text_to_sign(
    payload: TextToSignRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Translates English or Hindi text into an authentic ISL visual sign sequence,
    applying ISL SOV grammar rules and fingerspelling fallback.
    """
    start_time = time.perf_counter()

    result = ISLGrammarTranslator.generate_sign_sequence(
        text=payload.text,
        source_lang=payload.source_language,
        simplify_grammar=payload.simplify_grammar
    )

    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

    # Log translation history
    log = TranslationLog(
        user_id=current_user.id if current_user else None,
        source_mode="text_to_sign",
        input_content=payload.text,
        output_content=" ".join(result["isl_gloss_sequence"]),
        confidence_score=1.0,
        latency_ms=elapsed_ms
    )
    db.add(log)
    db.commit()

    return TextToSignResponse(
        original_text=result["original_text"],
        source_language=result["source_language"],
        isl_gloss_sequence=result["isl_gloss_sequence"],
        sequence=[SignSequenceItem(**item) for item in result["sequence"]],
        total_duration_seconds=result["total_duration_seconds"],
        grammar_notes=result["grammar_notes"]
    )


@router.post("/sign-to-text", response_model=SignToTextResponse)
def translate_sign_to_text(
    payload: SignToTextRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Synthesizes a continuous natural language sentence from a stream of ISL signs.
    """
    start_time = time.perf_counter()

    labels = []
    for key in payload.sign_keys:
        meta = get_isl_class_metadata(key.upper())
        labels.append(meta["en"] if payload.target_language == "en" else meta["hi"])

    # Natural language smoothing: join cleanly
    if payload.target_language == "hi":
        sentence = " ".join(labels) + "।"
    else:
        sentence = " ".join(labels) + "."

    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

    # Log translation history
    log = TranslationLog(
        user_id=current_user.id if current_user else None,
        source_mode="sign_to_text",
        input_content=" ".join(payload.sign_keys),
        output_content=sentence,
        confidence_score=0.95,
        latency_ms=elapsed_ms
    )
    db.add(log)
    db.commit()

    return SignToTextResponse(
        generated_text=sentence,
        target_language=payload.target_language,
        detected_signs=payload.sign_keys,
        confidence_average=0.95
    )


@router.get("/history")
def get_translation_history(
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Retrieve recent translation audit logs."""
    query = db.query(TranslationLog)
    if current_user:
        query = query.filter(TranslationLog.user_id == current_user.id)
    logs = query.order_by(TranslationLog.id.desc()).limit(limit).all()

    return [
        {
            "id": log.id,
            "mode": log.source_mode,
            "input": log.input_content,
            "output": log.output_content,
            "confidence": log.confidence_score,
            "latency_ms": log.latency_ms,
            "created_at": log.created_at
        }
        for log in logs
    ]
