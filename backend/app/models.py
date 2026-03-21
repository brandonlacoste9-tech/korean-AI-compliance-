"""Data models and risk categorisation utilities for the compliance API."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Literal, Mapping

RiskLevel = Literal["high", "medium", "low"]


HIGH_RISK_CATEGORIES: Dict[str, Dict[str, object]] = {
    "medical": {
        "ko": "의료",
        "en": "Medical",
        "risk_multiplier": 1.5,
        "requires_msit_approval": True,
        "legal_articles": ["제32조", "제33조", "제34조"],
        "deadline_days": 45,
        "description_ko": "생명과 건강에 직접적 영향을 미치는 고위험 AI",
        "description_en": "High-risk AI with direct impact on life and health",
    },
    "energy": {
        "ko": "에너지",
        "en": "Energy",
        "risk_multiplier": 1.4,
        "requires_msit_approval": True,
        "legal_articles": ["제32조", "제34조"],
        "deadline_days": 60,
        "description_ko": "에너지 인프라 및 공급망 관리 AI",
        "description_en": "AI for energy infrastructure and supply chain",
    },
    "transportation": {
        "ko": "교통",
        "en": "Transportation",
        "risk_multiplier": 1.4,
        "requires_msit_approval": True,
        "legal_articles": ["제32조", "제34조"],
        "deadline_days": 60,
        "description_ko": "자율주행 및 교통 시스템 제어 AI",
        "description_en": "AI for autonomous driving and traffic control",
    },
    "public_services": {
        "ko": "공공 서비스",
        "en": "Public Services",
        "risk_multiplier": 1.3,
        "requires_msit_approval": True,
        "legal_articles": ["제32조", "제35조"],
        "deadline_days": 75,
        "description_ko": "정부 및 공공기관 의사결정 지원 AI",
        "description_en": "AI for government and public agency decisions",
    },
    "finance": {
        "ko": "금융",
        "en": "Finance",
        "risk_multiplier": 1.3,
        "requires_msit_approval": True,
        "legal_articles": ["제32조", "제36조"],
        "deadline_days": 75,
        "description_ko": "금융 리스크 평가 및 신용 결정 AI",
        "description_en": "AI for financial risk and credit decisions",
    },
    "manufacturing": {
        "ko": "제조",
        "en": "Manufacturing",
        "risk_multiplier": 1.2,
        "requires_msit_approval": False,
        "legal_articles": ["제31조"],
        "deadline_days": 90,
        "description_ko": "제조 공정 최적화 및 품질 관리 AI",
        "description_en": "AI for manufacturing optimization",
    },
    "education": {
        "ko": "교육",
        "en": "Education",
        "risk_multiplier": 1.2,
        "requires_msit_approval": False,
        "legal_articles": ["제31조"],
        "deadline_days": 90,
        "description_ko": "교육 콘텐츠 추천 및 학습 평가 AI",
        "description_en": "AI for educational content and assessment",
    },
    "marketing": {
        "ko": "마케팅",
        "en": "Marketing",
        "risk_multiplier": 1.1,
        "requires_msit_approval": False,
        "legal_articles": ["제31조"],
        "deadline_days": 90,
        "description_ko": "고객 타겟팅 및 광고 최적화 AI",
        "description_en": "AI for customer targeting and ads",
    },
}


@dataclass(frozen=True)
class IndustryCategory:
    """Structured representation of an industry category."""

    key: str
    metadata: Mapping[str, object]

    @property
    def requires_msit_approval(self) -> bool:
        return bool(self.metadata.get("requires_msit_approval", False))

    @property
    def legal_articles(self) -> List[str]:
        return list(self.metadata.get("legal_articles", []))

    @property
    def deadline_days(self) -> int:
        return int(self.metadata.get("deadline_days", 90))


@dataclass
class RiskAssessmentRequest:
    """Incoming request payload for the risk assessment endpoint."""

    base_score: int
    industry_category: str
    personal_data_used: bool
    safety_impact: bool
    user_ip: str
    consent_obtained: bool
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def __post_init__(self) -> None:
        if not 0 <= self.base_score <= 100:
            raise ValueError("base_score must be between 0 and 100")
        if self.industry_category not in HIGH_RISK_CATEGORIES:
            raise ValueError("Invalid industry_category provided")
        if not self.user_ip:
            raise ValueError("user_ip is required for audit logging")
        if not isinstance(self.consent_obtained, bool):
            raise ValueError("consent_obtained must be a boolean value")


@dataclass
class RiskAssessmentResponse:
    """Outbound response model for the risk assessment endpoint."""

    enhanced_score: float
    risk_level: RiskLevel
    risk_level_ko: str
    industry_category: Dict[str, object]
    requires_msit_approval: bool
    legal_articles: List[str]
    compliance_deadline_days: int
    recommendation_en: str
    recommendation_ko: str


@dataclass
class AuditLogEntry:
    """Audit trail entry capturing personal data processing events."""

    action: str
    user_ip: str
    consent_obtained: bool
    metadata: Dict[str, object]
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


AUDIT_LOG: List[AuditLogEntry] = []


def get_industry_category(industry_category: str) -> IndustryCategory:
    """Retrieve the structured industry category details."""

    if industry_category not in HIGH_RISK_CATEGORIES:
        raise ValueError("Unknown industry category")
    return IndustryCategory(key=industry_category, metadata=HIGH_RISK_CATEGORIES[industry_category])


def calculate_enhanced_risk_score(
    *,
    base_score: int,
    industry_category: str,
    personal_data_used: bool,
    safety_impact: bool,
) -> Dict[str, object]:
    """Calculate the enhanced risk score with legal and compliance context."""

    if not 0 <= base_score <= 100:
        raise ValueError("base_score must be between 0 and 100")

    category = get_industry_category(industry_category)
    metadata = dict(category.metadata)
    risk_multiplier = float(metadata.get("risk_multiplier", 1.0))

    adjusted_score = base_score * risk_multiplier
    if personal_data_used:
        adjusted_score += 10
    if safety_impact:
        adjusted_score += 15
    enhanced_score = min(100.0, round(adjusted_score, 2))

    if enhanced_score >= 75:
        risk_level: RiskLevel = "high"
        risk_level_ko = "고위험"
    elif enhanced_score >= 50:
        risk_level = "medium"
        risk_level_ko = "중위험"
    else:
        risk_level = "low"
        risk_level_ko = "저위험"

    return {
        "enhanced_score": enhanced_score,
        "risk_level": risk_level,
        "risk_level_ko": risk_level_ko,
        "industry_category": metadata,
        "requires_msit_approval": category.requires_msit_approval,
        "legal_articles": category.legal_articles,
        "compliance_deadline_days": category.deadline_days,
    }


def record_audit_event(
    action: str, *, user_ip: str, consent_obtained: bool, metadata: Mapping[str, object]
) -> None:
    """Persist an audit event for PIPC compliance requirements."""

    AUDIT_LOG.append(
        AuditLogEntry(
            action=action,
            user_ip=user_ip,
            consent_obtained=consent_obtained,
            metadata=dict(metadata),
        )
    )
