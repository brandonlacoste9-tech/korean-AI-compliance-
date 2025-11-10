"""Tests for the high-risk industry categorisation logic."""

from __future__ import annotations

import pytest

from ..app.models import (
    AUDIT_LOG,
    RiskAssessmentRequest,
    calculate_enhanced_risk_score,
)


@pytest.fixture(autouse=True)
def clear_audit_log() -> None:
    """Ensure audit log isolation between tests."""

    AUDIT_LOG.clear()


def test_medical_high_risk_multiplier() -> None:
    result = calculate_enhanced_risk_score(
        base_score=60,
        industry_category="medical",
        personal_data_used=True,
        safety_impact=True,
    )

    assert pytest.approx(result["enhanced_score"], rel=1e-3) == 100.0
    assert result["requires_msit_approval"] is True
    assert result["industry_category"]["risk_multiplier"] == 1.5


def test_energy_requires_msit_approval() -> None:
    result = calculate_enhanced_risk_score(
        base_score=50,
        industry_category="energy",
        personal_data_used=False,
        safety_impact=True,
    )

    assert result["requires_msit_approval"] is True
    assert result["compliance_deadline_days"] == 60
    assert "제34조" in result["legal_articles"]


def test_marketing_lower_risk() -> None:
    result = calculate_enhanced_risk_score(
        base_score=40,
        industry_category="marketing",
        personal_data_used=False,
        safety_impact=False,
    )

    assert result["industry_category"]["risk_multiplier"] == 1.1
    assert result["requires_msit_approval"] is False
    assert result["risk_level"] == "low"


def test_manufacturing_medium_risk() -> None:
    result = calculate_enhanced_risk_score(
        base_score=45,
        industry_category="manufacturing",
        personal_data_used=False,
        safety_impact=False,
    )

    assert result["risk_level"] == "medium"
    assert result["compliance_deadline_days"] == 90


def test_invalid_industry_category() -> None:
    with pytest.raises(ValueError):
        RiskAssessmentRequest(
            base_score=50,
            industry_category="unknown",
            personal_data_used=False,
            safety_impact=False,
            user_ip="127.0.0.1",
            consent_obtained=True,
        )


def test_personal_data_bonus() -> None:
    base = calculate_enhanced_risk_score(
        base_score=40,
        industry_category="education",
        personal_data_used=False,
        safety_impact=False,
    )
    bonus = calculate_enhanced_risk_score(
        base_score=40,
        industry_category="education",
        personal_data_used=True,
        safety_impact=False,
    )

    assert bonus["enhanced_score"] == pytest.approx(base["enhanced_score"] + 10, rel=1e-3)


def test_safety_impact_bonus() -> None:
    base = calculate_enhanced_risk_score(
        base_score=40,
        industry_category="public_services",
        personal_data_used=False,
        safety_impact=False,
    )
    bonus = calculate_enhanced_risk_score(
        base_score=40,
        industry_category="public_services",
        personal_data_used=False,
        safety_impact=True,
    )

    assert bonus["enhanced_score"] == pytest.approx(base["enhanced_score"] + 15, rel=1e-3)


def test_score_capping() -> None:
    result = calculate_enhanced_risk_score(
        base_score=95,
        industry_category="medical",
        personal_data_used=True,
        safety_impact=True,
    )

    assert result["enhanced_score"] == 100.0
    assert result["risk_level"] == "high"


def test_invalid_base_score_range() -> None:
    with pytest.raises(ValueError):
        calculate_enhanced_risk_score(
            base_score=150,
            industry_category="medical",
            personal_data_used=False,
            safety_impact=False,
        )
