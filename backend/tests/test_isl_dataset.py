"""Tests for ISL Dataset, Class Metadata, and Landmark Generator."""

from backend.app.services.ai.isl_dataset import (
    ISL_CLASSES,
    SIGN_METADATA,
    generate_isl_dataset,
    generate_sign_landmarks,
    get_isl_class_metadata,
)


def test_isl_classes_count_and_uniqueness():
    assert len(ISL_CLASSES) == 60
    assert len(set(ISL_CLASSES)) == 60
    assert "NAMASTE" in ISL_CLASSES
    assert "WATER" in ISL_CLASSES
    assert "HELP" in ISL_CLASSES
    assert "A" in ISL_CLASSES
    assert "Z" in ISL_CLASSES
    assert "0" in ISL_CLASSES
    assert "9" in ISL_CLASSES


def test_sign_metadata_completeness():
    for sign_key in ISL_CLASSES:
        meta = get_isl_class_metadata(sign_key)
        assert meta["sign_key"] == sign_key
        assert "en" in meta
        assert "hi" in meta
        assert "category" in meta
        assert "hands" in meta
        assert meta["hands"] in ["one_hand", "two_hands"]


def test_generate_sign_landmarks():
    # One-handed sign
    hands_l = generate_sign_landmarks("L")
    assert len(hands_l) == 1
    assert len(hands_l[0]["landmarks"]) == 21

    # Two-handed sign
    hands_namaste = generate_sign_landmarks("NAMASTE")
    assert len(hands_namaste) == 2
    assert len(hands_namaste[0]["landmarks"]) == 21
    assert len(hands_namaste[1]["landmarks"]) == 21


def test_generate_isl_dataset_shape():
    X, y = generate_isl_dataset(samples_per_class=2)
    assert X.shape == (60 * 2, 140)
    assert y.shape == (60 * 2,)
    assert y.min() == 0
    assert y.max() == 59

