"""
Privacy Scanner for Korean Compliance
개인정보 스캐너

This module scans systems and code for privacy compliance issues.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import re


class PrivacyScanner:
    """Privacy compliance scanner"""
    
    def __init__(self):
        self.patterns = self._initialize_patterns()
        self.sensitive_data_types = self._initialize_sensitive_data_types()
    
    def _initialize_patterns(self) -> Dict[str, str]:
        """Initialize regex patterns for detecting sensitive data"""
        return {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "phone_kr": r'\b01[0-9]-?\d{3,4}-?\d{4}\b',
            "rrn": r'\b\d{6}-?[1-4]\d{6}\b',  # 주민등록번호
            "credit_card": r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
            "ip_address": r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
            "korean_name": r'[가-힣]{2,4}',
            "address": r'(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)[시도군구]',
        }
    
    def _initialize_sensitive_data_types(self) -> Dict[str, Dict[str, str]]:
        """Initialize sensitive data type definitions"""
        return {
            "email": {
                "name_ko": "이메일 주소",
                "name_en": "Email Address",
                "sensitivity": "medium",
                "regulation": "PIPA"
            },
            "phone_kr": {
                "name_ko": "전화번호",
                "name_en": "Phone Number",
                "sensitivity": "medium",
                "regulation": "PIPA"
            },
            "rrn": {
                "name_ko": "주민등록번호",
                "name_en": "Resident Registration Number",
                "sensitivity": "critical",
                "regulation": "PIPA + 주민등록법"
            },
            "credit_card": {
                "name_ko": "신용카드 번호",
                "name_en": "Credit Card Number",
                "sensitivity": "critical",
                "regulation": "PIPA + 여신전문금융업법"
            },
            "ip_address": {
                "name_ko": "IP 주소",
                "name_en": "IP Address",
                "sensitivity": "low",
                "regulation": "PIPA"
            },
            "korean_name": {
                "name_ko": "한국 이름",
                "name_en": "Korean Name",
                "sensitivity": "medium",
                "regulation": "PIPA"
            },
            "address": {
                "name_ko": "주소",
                "name_en": "Address",
                "sensitivity": "medium",
                "regulation": "PIPA"
            }
        }
    
    def scan_text(self, text: str, context: str = "") -> Dict[str, Any]:
        """
        Scan text for sensitive personal information
        
        Args:
            text: Text to scan
            context: Context information (e.g., "database", "log_file", "api_response")
        
        Returns:
            Scan results with detected sensitive data
        """
        findings = []
        risk_score = 0
        
        for data_type, pattern in self.patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                data_info = self.sensitive_data_types[data_type]
                finding = {
                    "data_type": data_type,
                    "name_ko": data_info["name_ko"],
                    "name_en": data_info["name_en"],
                    "sensitivity": data_info["sensitivity"],
                    "regulation": data_info["regulation"],
                    "count": len(matches),
                    "sample": matches[0] if matches else None,
                    "context": context
                }
                findings.append(finding)
                
                # Add to risk score based on sensitivity
                risk_score += self._get_sensitivity_score(data_info["sensitivity"]) * len(matches)
        
        # Determine overall risk level
        risk_level = self._determine_risk_level(risk_score)
        
        return {
            "scan_timestamp": datetime.now().isoformat(),
            "context": context,
            "findings_count": len(findings),
            "sensitive_data_detected": len(findings) > 0,
            "risk_score": min(risk_score, 100),
            "risk_level": risk_level,
            "risk_level_ko": self._get_risk_level_ko(risk_level),
            "findings": findings,
            "recommendations": self._get_scan_recommendations(findings)
        }
    
    def scan_system(self, system_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scan system configuration for privacy compliance
        
        Args:
            system_config: Dictionary containing system configuration
                - database_location: str
                - logging_enabled: bool
                - encryption_enabled: bool
                - access_control: bool
                - data_retention_days: int
                - consent_mechanism: bool
                - pipc_compliant: bool
        
        Returns:
            System compliance scan results
        """
        issues = []
        compliant_checks = []
        risk_score = 0
        
        # Check database location
        db_location = system_config.get("database_location", "").lower()
        if "seoul" not in db_location and "korea" not in db_location:
            issues.append({
                "issue_type": "data_residency",
                "severity": "critical",
                "title_ko": "데이터 국내 보관 미준수",
                "title_en": "Data Residency Non-Compliance",
                "description_ko": "개인정보가 국내(서울)에 보관되어야 합니다",
                "description_en": "Personal data must be stored domestically (Seoul)",
                "regulation": "PIPA Article 28-3"
            })
            risk_score += 25
        else:
            compliant_checks.append("data_residency")
        
        # Check encryption
        if not system_config.get("encryption_enabled", False):
            issues.append({
                "issue_type": "security",
                "severity": "critical",
                "title_ko": "암호화 미적용",
                "title_en": "Encryption Not Enabled",
                "description_ko": "개인정보는 암호화되어 저장되어야 합니다",
                "description_en": "Personal data must be encrypted",
                "regulation": "PIPA Article 29"
            })
            risk_score += 20
        else:
            compliant_checks.append("encryption")
        
        # Check access control
        if not system_config.get("access_control", False):
            issues.append({
                "issue_type": "security",
                "severity": "high",
                "title_ko": "접근 통제 부재",
                "title_en": "No Access Control",
                "description_ko": "개인정보 접근 권한 관리가 필요합니다",
                "description_en": "Access control for personal data required",
                "regulation": "PIPA Article 29"
            })
            risk_score += 15
        else:
            compliant_checks.append("access_control")
        
        # Check logging
        if not system_config.get("logging_enabled", False):
            issues.append({
                "issue_type": "audit",
                "severity": "high",
                "title_ko": "감사 로그 미활성화",
                "title_en": "Audit Logging Disabled",
                "description_ko": "개인정보 처리 기록이 필요합니다 (3년 보관)",
                "description_en": "Personal data processing logs required (3-year retention)",
                "regulation": "PIPA Article 30"
            })
            risk_score += 15
        else:
            compliant_checks.append("logging")
        
        # Check data retention
        retention_days = system_config.get("data_retention_days", 0)
        if retention_days > 1095:  # 3 years
            issues.append({
                "issue_type": "retention",
                "severity": "medium",
                "title_ko": "과도한 보유 기간",
                "title_en": "Excessive Retention Period",
                "description_ko": f"보유 기간이 법정 기간을 초과합니다 ({retention_days}일)",
                "description_en": f"Retention period exceeds legal limit ({retention_days} days)",
                "regulation": "PIPA Article 21"
            })
            risk_score += 10
        else:
            compliant_checks.append("retention")
        
        # Check consent mechanism
        if not system_config.get("consent_mechanism", False):
            issues.append({
                "issue_type": "consent",
                "severity": "critical",
                "title_ko": "동의 절차 부재",
                "title_en": "No Consent Mechanism",
                "description_ko": "개인정보 수집 시 명시적 동의가 필요합니다",
                "description_en": "Explicit consent required for personal data collection",
                "regulation": "PIPA Article 15"
            })
            risk_score += 25
        else:
            compliant_checks.append("consent")
        
        # Determine risk level
        risk_level = self._determine_risk_level(risk_score)
        
        # Calculate compliance percentage
        total_checks = 6
        compliance_percentage = (len(compliant_checks) / total_checks) * 100
        
        return {
            "scan_timestamp": datetime.now().isoformat(),
            "scan_type": "system_configuration",
            "compliance_percentage": round(compliance_percentage, 2),
            "risk_score": min(risk_score, 100),
            "risk_level": risk_level,
            "risk_level_ko": self._get_risk_level_ko(risk_level),
            "total_checks": total_checks,
            "compliant_checks": len(compliant_checks),
            "issues_found": len(issues),
            "issues": issues,
            "compliant_items": compliant_checks,
            "recommendations": self._get_system_recommendations(issues)
        }
    
    def _get_sensitivity_score(self, sensitivity: str) -> int:
        """Get risk score based on sensitivity level"""
        scores = {
            "critical": 10,
            "high": 7,
            "medium": 4,
            "low": 2
        }
        return scores.get(sensitivity, 5)
    
    def _determine_risk_level(self, risk_score: int) -> str:
        """Determine risk level from score"""
        if risk_score >= 50:
            return "high"
        elif risk_score >= 25:
            return "medium"
        else:
            return "low"
    
    def _get_risk_level_ko(self, risk_level: str) -> str:
        """Get Korean translation of risk level"""
        translations = {
            "high": "고위험",
            "medium": "중위험",
            "low": "저위험"
        }
        return translations.get(risk_level, risk_level)
    
    def _get_scan_recommendations(self, findings: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Get recommendations based on scan findings"""
        recommendations = []
        
        if any(f["sensitivity"] == "critical" for f in findings):
            recommendations.append({
                "priority": "critical",
                "title_ko": "즉시 조치 필요",
                "title_en": "Immediate Action Required",
                "action_ko": "중요 개인정보가 감지되었습니다. 즉시 암호화 및 접근 제한을 적용하세요",
                "action_en": "Critical personal data detected. Apply encryption and access restrictions immediately"
            })
        
        if findings:
            recommendations.append({
                "priority": "high",
                "title_ko": "개인정보 최소화",
                "title_en": "Minimize Personal Data",
                "action_ko": "불필요한 개인정보 수집을 중단하고 기존 데이터를 검토하세요",
                "action_en": "Stop collecting unnecessary personal data and review existing data"
            })
            recommendations.append({
                "priority": "high",
                "title_ko": "감사 로그 활성화",
                "title_en": "Enable Audit Logging",
                "action_ko": "모든 개인정보 접근 및 처리 내역을 로깅하세요",
                "action_en": "Log all personal data access and processing activities"
            })
        
        return recommendations
    
    def _get_system_recommendations(self, issues: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Get recommendations based on system issues"""
        recommendations = []
        
        critical_issues = [i for i in issues if i["severity"] == "critical"]
        if critical_issues:
            recommendations.append({
                "priority": "critical",
                "title_ko": "치명적 문제 해결",
                "title_en": "Resolve Critical Issues",
                "action_ko": f"{len(critical_issues)}개의 치명적 문제를 즉시 해결하세요",
                "action_en": f"Immediately resolve {len(critical_issues)} critical issues"
            })
        
        if any(i["issue_type"] == "data_residency" for i in issues):
            recommendations.append({
                "priority": "critical",
                "title_ko": "서울 리전 이전",
                "title_en": "Migrate to Seoul Region",
                "action_ko": "Supabase Seoul 리전 (ap-northeast-2) 또는 국내 데이터센터로 이전하세요",
                "action_en": "Migrate to Supabase Seoul region (ap-northeast-2) or domestic data center"
            })
        
        if any(i["issue_type"] == "security" for i in issues):
            recommendations.append({
                "priority": "high",
                "title_ko": "보안 강화",
                "title_en": "Strengthen Security",
                "action_ko": "암호화, 접근 통제, 2단계 인증을 구현하세요",
                "action_en": "Implement encryption, access control, and 2FA"
            })
        
        return recommendations
