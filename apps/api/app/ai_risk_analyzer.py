"""
AI Risk Analyzer for Korean AI Basic Act
AI 기본법 위험 분석 엔진

This module analyzes AI systems for risk levels according to Korean AI Basic Act.
"""

from typing import Dict, List, Any
from datetime import datetime
from enum import Enum


class AIRiskLevel(Enum):
    """AI Risk Levels according to Korean AI Basic Act"""
    HIGH = "high"  # 고위험
    MEDIUM = "medium"  # 중위험
    LOW = "low"  # 저위험


class AISystemType(Enum):
    """AI System Types"""
    GENERATIVE = "generative"  # 생성형 AI
    DECISION_MAKING = "decision_making"  # 의사결정 지원
    BIOMETRIC = "biometric"  # 생체인식
    RECOMMENDATION = "recommendation"  # 추천 시스템
    CHATBOT = "chatbot"  # 챗봇
    ANALYSIS = "analysis"  # 분석 시스템


class AIRiskAnalyzer:
    """Korean AI Basic Act risk analyzer"""
    
    def __init__(self):
        self.risk_factors = self._initialize_risk_factors()
        self.high_risk_categories = self._initialize_high_risk_categories()
    
    def _initialize_risk_factors(self) -> Dict[str, Dict[str, Any]]:
        """Initialize AI risk assessment factors"""
        return {
            "personal_data_usage": {
                "name": "개인정보 활용",
                "name_en": "Personal Data Usage",
                "weight": 20,
                "description": "AI가 개인정보를 처리하는지 여부",
                "description_en": "Whether AI processes personal data"
            },
            "decision_impact": {
                "name": "의사결정 영향력",
                "name_en": "Decision Impact",
                "weight": 25,
                "description": "AI 결정이 개인의 권리에 미치는 영향",
                "description_en": "Impact of AI decisions on individual rights"
            },
            "transparency": {
                "name": "투명성",
                "name_en": "Transparency",
                "weight": 15,
                "description": "AI 작동 원리의 설명 가능성",
                "description_en": "Explainability of AI operations"
            },
            "user_count": {
                "name": "사용자 규모",
                "name_en": "User Scale",
                "weight": 10,
                "description": "AI 시스템 사용자 수",
                "description_en": "Number of AI system users"
            },
            "automated_decision": {
                "name": "자동화 수준",
                "name_en": "Automation Level",
                "weight": 20,
                "description": "사람 개입 없는 자동 의사결정 여부",
                "description_en": "Automated decision-making without human intervention"
            },
            "biometric_data": {
                "name": "생체정보 처리",
                "name_en": "Biometric Data Processing",
                "weight": 10,
                "description": "생체인식 정보 활용 여부",
                "description_en": "Use of biometric data"
            }
        }
    
    def _initialize_high_risk_categories(self) -> List[Dict[str, str]]:
        """Initialize high-risk AI categories per Korean AI Basic Act"""
        return [
            {
                "category": "employment",
                "name": "고용 및 인사",
                "name_en": "Employment and HR",
                "description": "채용, 승진, 해고 등 고용 관련 의사결정",
                "description_en": "Hiring, promotion, termination decisions"
            },
            {
                "category": "credit_scoring",
                "name": "신용평가",
                "name_en": "Credit Scoring",
                "description": "금융 신용도 평가 및 대출 심사",
                "description_en": "Credit assessment and loan evaluation"
            },
            {
                "category": "healthcare",
                "name": "의료 진단",
                "name_en": "Healthcare Diagnosis",
                "description": "질병 진단, 치료 결정 지원",
                "description_en": "Disease diagnosis, treatment decisions"
            },
            {
                "category": "education",
                "name": "교육 평가",
                "name_en": "Educational Assessment",
                "description": "학생 평가, 입학 전형",
                "description_en": "Student assessment, admissions"
            },
            {
                "category": "law_enforcement",
                "name": "법집행",
                "name_en": "Law Enforcement",
                "description": "범죄 예측, 용의자 식별",
                "description_en": "Crime prediction, suspect identification"
            },
            {
                "category": "public_services",
                "name": "공공 서비스",
                "name_en": "Public Services",
                "description": "복지 혜택 결정, 공공 자원 배분",
                "description_en": "Welfare decisions, public resource allocation"
            }
        ]
    
    def analyze_risk(self, system_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze AI system risk level
        
        Args:
            system_data: Dictionary containing AI system information
                - system_type: str (type of AI system)
                - uses_personal_data: bool
                - decision_impact_level: str ("high", "medium", "low")
                - has_transparency: bool
                - user_count: int
                - is_automated: bool
                - uses_biometric_data: bool
                - application_domain: str (optional)
        
        Returns:
            Risk analysis results with risk level and recommendations
        """
        risk_score = 0
        risk_details = []
        
        # Analyze each risk factor
        if system_data.get("uses_personal_data", False):
            factor = self.risk_factors["personal_data_usage"]
            risk_score += factor["weight"]
            risk_details.append({
                "factor": factor["name"],
                "factor_en": factor["name_en"],
                "risk_added": factor["weight"],
                "status": "위험 요소 확인 (Risk Identified)"
            })
        
        # Decision impact
        impact_level = system_data.get("decision_impact_level", "low")
        if impact_level in ["high", "medium"]:
            factor = self.risk_factors["decision_impact"]
            impact_weight = factor["weight"] if impact_level == "high" else factor["weight"] * 0.6
            risk_score += impact_weight
            risk_details.append({
                "factor": factor["name"],
                "factor_en": factor["name_en"],
                "risk_added": impact_weight,
                "status": f"{impact_level.upper()} 영향 ({impact_level.upper()} impact)"
            })
        
        # Transparency
        if not system_data.get("has_transparency", True):
            factor = self.risk_factors["transparency"]
            risk_score += factor["weight"]
            risk_details.append({
                "factor": factor["name"],
                "factor_en": factor["name_en"],
                "risk_added": factor["weight"],
                "status": "투명성 부족 (Lack of transparency)"
            })
        
        # User count
        user_count = system_data.get("user_count", 0)
        if user_count > 10000:
            factor = self.risk_factors["user_count"]
            risk_score += factor["weight"]
            risk_details.append({
                "factor": factor["name"],
                "factor_en": factor["name_en"],
                "risk_added": factor["weight"],
                "status": f"대규모 사용자 ({user_count:,}명)"
            })
        
        # Automation
        if system_data.get("is_automated", False):
            factor = self.risk_factors["automated_decision"]
            risk_score += factor["weight"]
            risk_details.append({
                "factor": factor["name"],
                "factor_en": factor["name_en"],
                "risk_added": factor["weight"],
                "status": "완전 자동화 (Fully automated)"
            })
        
        # Biometric data
        if system_data.get("uses_biometric_data", False):
            factor = self.risk_factors["biometric_data"]
            risk_score += factor["weight"]
            risk_details.append({
                "factor": factor["name"],
                "factor_en": factor["name_en"],
                "risk_added": factor["weight"],
                "status": "생체정보 활용 (Biometric data used)"
            })
        
        # Check high-risk categories
        domain = system_data.get("application_domain", "")
        is_high_risk_domain = self._check_high_risk_domain(domain)
        
        if is_high_risk_domain:
            risk_score += 15
            risk_details.append({
                "factor": "고위험 분야",
                "factor_en": "High-Risk Domain",
                "risk_added": 15,
                "status": f"고위험 분야: {domain}"
            })
        
        # Determine risk level
        risk_level = self._determine_risk_level(risk_score)
        
        # Get recommendations
        recommendations = self._get_recommendations(risk_level, system_data)
        
        # Check if MSIT approval required
        msit_approval_required = risk_level == AIRiskLevel.HIGH.value
        
        return {
            "risk_score": round(risk_score, 2),
            "risk_level": risk_level,
            "risk_level_ko": self._get_risk_level_ko(risk_level),
            "msit_approval_required": msit_approval_required,
            "system_type": system_data.get("system_type", "unknown"),
            "risk_details": risk_details,
            "high_risk_domain": is_high_risk_domain,
            "domain": domain,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat(),
            "regulation": "AI 기본법 (Korean AI Basic Act)"
        }
    
    def _check_high_risk_domain(self, domain: str) -> bool:
        """Check if domain is in high-risk categories"""
        high_risk_domains = [cat["category"] for cat in self.high_risk_categories]
        return domain.lower() in high_risk_domains
    
    def _determine_risk_level(self, risk_score: float) -> str:
        """Determine risk level based on score"""
        if risk_score >= 60:
            return AIRiskLevel.HIGH.value
        elif risk_score >= 30:
            return AIRiskLevel.MEDIUM.value
        else:
            return AIRiskLevel.LOW.value
    
    def _get_risk_level_ko(self, risk_level: str) -> str:
        """Get Korean translation of risk level"""
        translations = {
            "high": "고위험",
            "medium": "중위험",
            "low": "저위험"
        }
        return translations.get(risk_level, risk_level)
    
    def _get_recommendations(self, risk_level: str, system_data: Dict[str, Any]) -> List[Dict[str, str]]:
        """Get recommendations based on risk level"""
        recommendations = []
        
        if risk_level == AIRiskLevel.HIGH.value:
            recommendations.append({
                "priority": "critical",
                "title_ko": "MSIT 사전 승인 필요",
                "title_en": "MSIT Pre-approval Required",
                "action_ko": "과학기술정보통신부에 AI 시스템 등록 및 승인 신청이 필요합니다",
                "action_en": "Registration and approval application to Ministry of Science and ICT required",
                "deadline": "시스템 운영 전 (Before system operation)"
            })
            recommendations.append({
                "priority": "critical",
                "title_ko": "정기 감사 준비",
                "title_en": "Prepare for Regular Audits",
                "action_ko": "분기별 준법 감사를 위한 문서화 및 로깅 시스템 구축",
                "action_en": "Establish documentation and logging system for quarterly compliance audits",
                "deadline": "즉시 (Immediate)"
            })
        
        if risk_level in [AIRiskLevel.HIGH.value, AIRiskLevel.MEDIUM.value]:
            recommendations.append({
                "priority": "high",
                "title_ko": "투명성 보고서 작성",
                "title_en": "Create Transparency Report",
                "action_ko": "AI 작동 원리, 데이터 사용, 의사결정 과정을 문서화하세요",
                "action_en": "Document AI operations, data usage, and decision-making process",
                "deadline": "30일 이내 (Within 30 days)"
            })
            recommendations.append({
                "priority": "high",
                "title_ko": "사용자 고지 의무",
                "title_en": "User Notification Obligation",
                "action_ko": "사용자에게 AI 사용 사실을 명확히 고지하세요",
                "action_en": "Clearly inform users about AI usage",
                "deadline": "즉시 (Immediate)"
            })
        
        if system_data.get("uses_personal_data", False):
            recommendations.append({
                "priority": "high",
                "title_ko": "PIPA 준수 확인",
                "title_en": "Verify PIPA Compliance",
                "action_ko": "개인정보 보호법 준수 여부를 확인하세요",
                "action_en": "Verify compliance with Personal Information Protection Act",
                "deadline": "즉시 (Immediate)"
            })
        
        if not system_data.get("has_transparency", True):
            recommendations.append({
                "priority": "medium",
                "title_ko": "설명 가능성 개선",
                "title_en": "Improve Explainability",
                "action_ko": "AI 결정에 대한 설명 기능을 추가하세요",
                "action_en": "Add explanation features for AI decisions",
                "deadline": "60일 이내 (Within 60 days)"
            })
        
        return recommendations
    
    def get_high_risk_categories(self, lang: str = "ko") -> List[Dict[str, str]]:
        """Get list of high-risk AI categories"""
        if lang == "ko":
            return [{
                "category": cat["category"],
                "name": cat["name"],
                "description": cat["description"]
            } for cat in self.high_risk_categories]
        else:
            return [{
                "category": cat["category"],
                "name": cat["name_en"],
                "description": cat["description_en"]
            } for cat in self.high_risk_categories]
