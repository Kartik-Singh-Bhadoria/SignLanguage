"""Tests for ISL Dictionary REST API handlers."""

import pytest
from fastapi import HTTPException
from backend.app.api.v1.signs import get_categories, get_sign_detail, list_signs
from backend.app.db_seeder import seed_isl_dictionary


def test_list_signs_default(db_session):
    seed_isl_dictionary(db_session)

    res = list_signs(
        category=None,
        search=None,
        hand_type=None,
        difficulty=None,
        skip=0,
        limit=60,
        db=db_session
    )
    assert res.total >= 60
    assert len(res.items) > 0


def test_filter_signs_by_category(db_session):
    seed_isl_dictionary(db_session)

    res = list_signs(
        category="alphabet",
        search=None,
        hand_type=None,
        difficulty=None,
        skip=0,
        limit=60,
        db=db_session
    )
    assert res.total == 26
    for sign in res.items:
        assert sign.category == "alphabet"


def test_filter_signs_by_search(db_session):
    seed_isl_dictionary(db_session)

    res = list_signs(
        category=None,
        search="Namaste",
        hand_type=None,
        difficulty=None,
        skip=0,
        limit=60,
        db=db_session
    )
    assert res.total >= 1
    assert any("namaste" in s.sign_key.lower() for s in res.items)


def test_get_categories(db_session):
    seed_isl_dictionary(db_session)

    cats = get_categories(db=db_session)
    cat_names = [c["category"] for c in cats]
    assert "alphabet" in cat_names
    assert "greeting" in cat_names
    assert "emergency" in cat_names


def test_get_sign_detail_and_404(db_session):
    seed_isl_dictionary(db_session)

    water_sign = get_sign_detail(sign_key="WATER", db=db_session)
    assert water_sign.sign_key == "WATER"
    assert "water" in water_sign.english_label.lower()
    assert "पानी" in water_sign.hindi_label

    with pytest.raises(HTTPException) as exc_info:
        get_sign_detail(sign_key="NONEXISTENT_XYZ", db=db_session)
    assert exc_info.value.status_code == 404
