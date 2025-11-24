"""
PIPA (Personal Information Protection Act) Rules for Korea
개인정보 보호법 규칙 엔진

This module implements compliance rules for Korean PIPA regulations.
"""

from typing import Dict, List, Any
from datetime import datetime


class PIPARulesKR:
    """Korean PIPA compliance rules engine"""
    
    def __init__(self):
        self.rules = self._initialize_rules()
    
    def _initialize_rules(self) -> Dict[str, Dict[str, Any]]:
        """Initialize PIPA compliance rules"""
        return {
            "consent": {
                "id": "PIPA-001",
                "name": "명시적 동의 (Explicit Consent)",
                "name_en": "Explicit Consent Required",
                "description": "개인정보 수집 시 명시적 동의 필수",
                "description_en": "Explicit consent required for personal data collection",
                "severity": "critical",
                "category": "consent"
            },
            "purpose_limitation": {
                "id": "PIPA-002",
                "name": "목적 제한 (Purpose Limitation)",
                "name_en": "Purpose Limitation",
                "description": "수집 목적 범위 내에서만 개인정보 사용",
                "description_en": "Personal data used only within stated purpose",
                "severity": "high",
                "category": "usage"
            },
            "data_minimization": {
                "id": "PIPA-003",
                "name": "최소 수집 (Data Minimization)",
                "name_en": "Data Minimization",
                "description": "필요 최소한의 개인정보만 수집",
                "description_en": "Collect only minimum necessary personal data",
                "severity": "high",
                "category": "collection"
            },
            "retention_period": {
                "id": "PIPA-004",
                "name": "보유 기간 준수 (Retention Period)",
                "name_en": "Retention Period Compliance",
                "description": "법정 보유 기간 준수 및 파기",
                "description_en": "Comply with retention periods and data destruction",
                "severity": "medium",
                "category": "retention"
            },
            "data_security": {
                "id": "PIPA-005",
                "name": "안전성 확보 (Data Security)",
                "name_en": "Data Security Measures",
                "description": "개인정보 암호화 및 접근 통제",
                "description_en": "Encryption and access control for personal data",
                "severity": "critical",
                "category": "security"
            },
            "data_residency": {
                "id": "PIPA-006",
                "name": "국내 보관 (Data Residency)",
                "name_en": "Data Residency (Seoul)",
                "description": "개인정보 국내(서울) 보관 의무",
                "description_en": "Personal data must be stored in Korea (Seoul)",
                "severity": "critical",
                "category": "residency"
            },
            "audit_logging": {
                "id": "PIPA-007",
                "name": "감사 로그 (Audit Logging)",
                "name_en": "Audit Logging (3 years)",
                "description": "개인정보 처리 기록 3년 보관",
                "description_en": "Personal data processing logs retained for 3 years",
                "severity": "high",
                "category": "logging"
            },
            "user_rights": {
                "id": "PIPA-008",
                "name": "정보주체 권리 (User Rights)",
                "name_en": "Data Subject Rights",
                "description": "열람, 정정, 삭제 요구권 보장",
                "description_en": "Guarantee rights to access, correct, and delete",
                "severity": "high",
                "category": "rights"
            }
        }
    
    def check_compliance(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Check PIPA compliance for given data
        
        Args:
            data: Dictionary containing compliance check data
                - has_consent: bool
                - purpose_defined: bool
                - data_minimized: bool
                - retention_compliant: bool
                - security_measures: bool
                - data_in_seoul: bool
                - audit_enabled: bool
                - user_rights_enabled: bool
        
        Returns:
            Compliance check results with risk score
        """
        results = []
        violations = []
        risk_score = 0
        
        # Check each rule
        for rule_key, rule in self.rules.items():
            check_key = self._get_check_key(rule_key)
            is_compliant = data.get(check_key, False)
            
            result = {
                "rule_id": rule["id"],
                "rule_name": rule["name"],
                "rule_name_en": rule["name_en"],
                "compliant": is_compliant,
                "severity": rule["severity"],
                "category": rule["category"]
            }
            
            results.append(result)
            
            if not is_compliant:
                violations.append(result)
                risk_score += self._get_risk_weight(rule["severity"])
        
        # Calculate compliance percentage
        total_rules = len(self.rules)
        compliant_rules = total_rules - len(violations)
        compliance_percentage = (compliant_rules / total_rules) * 100
        
        return {
            "compliance_percentage": round(compliance_percentage, 2),
            "risk_score": min(risk_score, 100),
            "risk_level": self._get_risk_level(risk_score),
            "total_rules": total_rules,
            "compliant_rules": compliant_rules,
            "violations": len(violations),
            "results": results,
            "violation_details": violations,
            "timestamp": datetime.now().isoformat(),
            "regulation": "PIPA (개인정보 보호법)"
        }
    
    def _get_check_key(self, rule_key: str) -> str:
        """Map rule key to data check key"""
        mapping = {
            "consent": "has_consent",
            "purpose_limitation": "purpose_defined",
            "data_minimization": "data_minimized",
            "retention_period": "retention_compliant",
            "data_security": "security_measures",
            "data_residency": "data_in_seoul",
            "audit_logging": "audit_enabled",
            "user_rights": "user_rights_enabled"
        }
        return mapping.get(rule_key, rule_key)
    
    def _get_risk_weight(self, severity: str) -> int:
        """Get risk score weight based on severity"""
        weights = {
            "critical": 25,
            "high": 15,
            "medium": 10,
            "low": 5
        }
        return weights.get(severity, 10)
    
    def _get_risk_level(self, risk_score: int) -> str:
        """Determine risk level based on score"""
        if risk_score >= 50:
            return "high"
        elif risk_score >= 25:
            return "medium"
        else:
            return "low"
    
    def get_recommendations(self, violations: List[Dict[str, Any]], lang: str = "ko") -> List[Dict[str, str]]:
        """
        Get recommendations for addressing violations
        
        Args:
            violations: List of violation details
            lang: Language code ("ko" or "en")
        
        Returns:
            List of recommendations
        """
        recommendations = []
        
        for violation in violations:
            rule_id = violation["rule_id"]
            rec = self._get_recommendation(rule_id, lang)
            if rec:
                recommendations.append(rec)
        
        return recommendations
    
    def _get_recommendation(self, rule_id: str, lang: str) -> Dict[str, str]:
        """Get specific recommendation for a rule violation"""
        recommendations_ko = {
            "PIPA-001": {
                "title": "명시적 동의 획득",
                "action": "개인정보 수집 시 명확한 동의 절차를 구현하세요",
                "example": "예시: '본 서비스는 귀하의 이메일 주소를 수집합니다. 동의하십니까? [예] [아니오]'"
            },
            "PIPA-002": {
                "title": "수집 목적 명시",
                "action": "개인정보 수집 및 이용 목적을 명확히 정의하세요",
                "example": "예시: '회원가입 및 서비스 제공 목적으로만 사용됩니다'"
            },
            "PIPA-003": {
                "title": "최소 정보 수집",
                "action": "서비스 제공에 필수적인 정보만 수집하세요",
                "example": "예시: 선택 항목과 필수 항목을 명확히 구분"
            },
            "PIPA-004": {
                "title": "보유 기간 설정",
                "action": "법정 보유 기간을 설정하고 기간 경과 후 자동 삭제 구현",
                "example": "예시: '회원 탈퇴 후 3개월 이내 모든 정보 삭제'"
            },
            "PIPA-005": {
                "title": "보안 조치 강화",
                "action": "개인정보 암호화 및 접근 권한 관리 시스템 구축",
                "example": "예시: AES-256 암호화, 2단계 인증 적용"
            },
            "PIPA-006": {
                "title": "서울 리전 보관",
                "action": "Supabase Seoul 리전 사용 또는 국내 데이터센터 이용",
                "example": "예시: ap-northeast-2 (Seoul) 리전 설정"
            },
            "PIPA-007": {
                "title": "감사 로그 활성화",
                "action": "모든 개인정보 처리 활동을 로깅하고 3년간 보관",
                "example": "예시: 접속 기록, 정보 조회/수정/삭제 이력 저장"
            },
            "PIPA-008": {
                "title": "정보주체 권리 보장",
                "action": "개인정보 열람, 정정, 삭제 기능 제공",
                "example": "예시: 마이페이지에서 '내 정보 관리' 메뉴 제공"
            }
        }
        
        recommendations_en = {
            "PIPA-001": {
                "title": "Implement Explicit Consent",
                "action": "Implement clear consent procedures for personal data collection",
                "example": "Example: 'This service collects your email address. Do you consent? [Yes] [No]'"
            },
            "PIPA-002": {
                "title": "Define Collection Purpose",
                "action": "Clearly define the purpose of personal data collection and use",
                "example": "Example: 'Used only for membership registration and service provision'"
            },
            "PIPA-003": {
                "title": "Minimize Data Collection",
                "action": "Collect only information essential for service provision",
                "example": "Example: Clearly distinguish between required and optional fields"
            },
            "PIPA-004": {
                "title": "Set Retention Period",
                "action": "Set legal retention periods and implement automatic deletion",
                "example": "Example: 'All information deleted within 3 months of membership withdrawal'"
            },
            "PIPA-005": {
                "title": "Strengthen Security",
                "action": "Implement encryption and access control systems",
                "example": "Example: Apply AES-256 encryption, 2-factor authentication"
            },
            "PIPA-006": {
                "title": "Seoul Region Storage",
                "action": "Use Supabase Seoul region or domestic data centers",
                "example": "Example: Configure ap-northeast-2 (Seoul) region"
            },
            "PIPA-007": {
                "title": "Enable Audit Logging",
                "action": "Log all personal data processing activities and retain for 3 years",
                "example": "Example: Store access logs, view/modify/delete history"
            },
            "PIPA-008": {
                "title": "Guarantee User Rights",
                "action": "Provide access, correction, and deletion functions",
                "example": "Example: Provide 'My Information Management' menu in My Page"
            }
        }
        
        recs = recommendations_ko if lang == "ko" else recommendations_en
        return recs.get(rule_id, {})
