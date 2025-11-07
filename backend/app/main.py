"""FastAPI application for Korean AI compliance risk assessments."""
from __future__ import annotations

from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request

from .models import (
    RiskAssessmentRequest,
    RiskAssessmentResponse,
    calculate_enhanced_risk_score,
    record_audit_event,
)

app = FastAPI(
    title="Korean AI Compliance Guardian",
    description="Risk assessment utilities aligned with the Korean AI Basic Act.",
    version="0.1.0",
)


RECOMMENDATIONS_EN: Dict[str, str] = {
    "high": (
        "The system is classified as high-risk. Obtain MSIT pre-approval before deployment "
        "(AI Basic Act Article 32)."
    ),
    "medium": (
        "The system is medium-risk. Implement transparency controls (Article 31) and "
        "comprehensive audit logging."
    ),
    "low": (
        "The system is low-risk. Maintain baseline transparency and documentation obligations."
    ),
}

RECOMMENDATIONS_KO: Dict[str, str] = {
    "high": (
        "고위험 AI 시스템으로 분류되었습니다. 배포 전 과학기술정보통신부(MSIT) 사전 승인이 필요합니다 "
        "(AI 기본법 제32조)."
    ),
    "medium": (
        "중위험 AI 시스템입니다. 투명성 조치(제31조) 및 감사 로깅을 실시하십시오."
    ),
    "low": (
        "저위험 AI 시스템입니다. 기본 투명성 및 문서화 요구사항을 준수하십시오."
    ),
}


@app.post("/api/risk/assess")
async def assess_risk(request: Request, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Assess AI system risk and provide bilingual recommendations."""

    client_ip = request.client.host if request.client else "unknown"
    payload.setdefault("user_ip", client_ip)
    if "consent_obtained" not in payload:
        raise HTTPException(status_code=422, detail="consent_obtained field is required")

    try:
        assessment_request = RiskAssessmentRequest(
            base_score=int(payload.get("base_score", 0)),
            industry_category=str(payload.get("industry_category", "")),
            personal_data_used=bool(payload.get("personal_data_used", False)),
            safety_impact=bool(payload.get("safety_impact", False)),
            user_ip=str(payload.get("user_ip", client_ip)),
            consent_obtained=bool(payload.get("consent_obtained")),
        )
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    score_details = calculate_enhanced_risk_score(
        base_score=assessment_request.base_score,
        industry_category=assessment_request.industry_category,
        personal_data_used=assessment_request.personal_data_used,
        safety_impact=assessment_request.safety_impact,
    )

    recommendation_en = RECOMMENDATIONS_EN[score_details["risk_level"]]
    recommendation_ko = RECOMMENDATIONS_KO[score_details["risk_level"]]

    response = RiskAssessmentResponse(
        enhanced_score=score_details["enhanced_score"],
        risk_level=score_details["risk_level"],
        risk_level_ko=score_details["risk_level_ko"],
        industry_category=score_details["industry_category"],
        requires_msit_approval=score_details["requires_msit_approval"],
        legal_articles=score_details["legal_articles"],
        compliance_deadline_days=score_details["compliance_deadline_days"],
        recommendation_en=recommendation_en,
        recommendation_ko=recommendation_ko,
    )

    record_audit_event(
        "risk_assessment",
        user_ip=assessment_request.user_ip,
        consent_obtained=assessment_request.consent_obtained,
        metadata={
            "industry_category": assessment_request.industry_category,
            "risk_level": response.risk_level,
            "requires_msit_approval": response.requires_msit_approval,
            "timestamp": assessment_request.timestamp.isoformat(),
        },
    )

    return {
        "enhanced_score": response.enhanced_score,
        "risk_level": response.risk_level,
        "risk_level_ko": response.risk_level_ko,
        "industry_category": response.industry_category,
        "requires_msit_approval": response.requires_msit_approval,
        "legal_articles": response.legal_articles,
        "compliance_deadline_days": response.compliance_deadline_days,
        "recommendation_en": response.recommendation_en,
        "recommendation_ko": response.recommendation_ko,
    }
