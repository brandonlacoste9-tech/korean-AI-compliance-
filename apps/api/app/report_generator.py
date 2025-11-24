"""
Compliance Report Generator
준법 보고서 생성기

This module generates comprehensive compliance reports in Korean and English.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json


class ReportGenerator:
    """Compliance report generator"""
    
    def __init__(self):
        self.report_types = ["full", "summary", "executive", "technical"]
    
    def generate_report(
        self,
        pipa_results: Optional[Dict[str, Any]] = None,
        ai_risk_results: Optional[Dict[str, Any]] = None,
        privacy_scan_results: Optional[Dict[str, Any]] = None,
        report_type: str = "full",
        lang: str = "ko"
    ) -> Dict[str, Any]:
        """
        Generate comprehensive compliance report
        
        Args:
            pipa_results: PIPA compliance check results
            ai_risk_results: AI risk analysis results
            privacy_scan_results: Privacy scan results
            report_type: Type of report ("full", "summary", "executive", "technical")
            lang: Language ("ko" or "en")
        
        Returns:
            Generated report dictionary
        """
        is_korean = lang == "ko"
        
        # Report header
        report = {
            "report_id": self._generate_report_id(),
            "report_type": report_type,
            "language": lang,
            "generated_at": datetime.now().isoformat(),
            "title": "준법 준수 평가 보고서" if is_korean else "Compliance Assessment Report",
            "organization": "AI Compliance Guardian",
        }
        
        # Executive summary
        report["executive_summary"] = self._generate_executive_summary(
            pipa_results, ai_risk_results, privacy_scan_results, is_korean
        )
        
        # Overall compliance score
        report["overall_score"] = self._calculate_overall_score(
            pipa_results, ai_risk_results, privacy_scan_results
        )
        
        # Detailed sections
        if report_type in ["full", "technical"]:
            if pipa_results:
                report["pipa_compliance"] = self._format_pipa_section(pipa_results, is_korean)
            
            if ai_risk_results:
                report["ai_risk_assessment"] = self._format_ai_risk_section(ai_risk_results, is_korean)
            
            if privacy_scan_results:
                report["privacy_scan"] = self._format_privacy_scan_section(privacy_scan_results, is_korean)
        
        # Recommendations
        report["recommendations"] = self._generate_recommendations(
            pipa_results, ai_risk_results, privacy_scan_results, is_korean
        )
        
        # Action plan
        if report_type in ["full", "executive"]:
            report["action_plan"] = self._generate_action_plan(
                pipa_results, ai_risk_results, privacy_scan_results, is_korean
            )
        
        # Compliance badge
        report["compliance_badge"] = self._determine_compliance_badge(
            report["overall_score"]
        )
        
        return report
    
    def _generate_report_id(self) -> str:
        """Generate unique report ID"""
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        return f"CR-{timestamp}"
    
    def _generate_executive_summary(
        self,
        pipa_results: Optional[Dict[str, Any]],
        ai_risk_results: Optional[Dict[str, Any]],
        privacy_scan_results: Optional[Dict[str, Any]],
        is_korean: bool
    ) -> Dict[str, Any]:
        """Generate executive summary"""
        summary = {}
        
        if is_korean:
            summary["title"] = "경영진 요약"
            summary["introduction"] = "본 보고서는 한국 AI 기본법 및 개인정보 보호법(PIPA) 준수 여부를 평가합니다."
        else:
            summary["title"] = "Executive Summary"
            summary["introduction"] = "This report assesses compliance with Korean AI Basic Act and PIPA regulations."
        
        # Key findings
        findings = []
        
        if pipa_results:
            compliance_pct = pipa_results.get("compliance_percentage", 0)
            if is_korean:
                findings.append(f"PIPA 준수율: {compliance_pct}% ({pipa_results.get('compliant_rules', 0)}/{pipa_results.get('total_rules', 0)} 규칙)")
            else:
                findings.append(f"PIPA Compliance: {compliance_pct}% ({pipa_results.get('compliant_rules', 0)}/{pipa_results.get('total_rules', 0)} rules)")
        
        if ai_risk_results:
            risk_level = ai_risk_results.get("risk_level_ko" if is_korean else "risk_level", "")
            if is_korean:
                findings.append(f"AI 위험 수준: {risk_level}")
            else:
                findings.append(f"AI Risk Level: {risk_level}")
            
            if ai_risk_results.get("msit_approval_required", False):
                findings.append("MSIT 사전 승인 필요" if is_korean else "MSIT pre-approval required")
        
        if privacy_scan_results:
            issues_found = privacy_scan_results.get("issues_found", 0)
            if issues_found > 0:
                if is_korean:
                    findings.append(f"개인정보 보호 문제 {issues_found}건 발견")
                else:
                    findings.append(f"{issues_found} privacy issues found")
        
        summary["key_findings"] = findings
        
        return summary
    
    def _calculate_overall_score(
        self,
        pipa_results: Optional[Dict[str, Any]],
        ai_risk_results: Optional[Dict[str, Any]],
        privacy_scan_results: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate overall compliance score"""
        scores = []
        
        if pipa_results:
            pipa_score = pipa_results.get("compliance_percentage", 0)
            scores.append(pipa_score)
        
        if ai_risk_results:
            # Invert risk score to compliance score
            risk_score = ai_risk_results.get("risk_score", 0)
            ai_compliance_score = max(0, 100 - risk_score)
            scores.append(ai_compliance_score)
        
        if privacy_scan_results:
            privacy_compliance = privacy_scan_results.get("compliance_percentage", 0)
            scores.append(privacy_compliance)
        
        overall_score = sum(scores) / len(scores) if scores else 0
        
        return {
            "score": round(overall_score, 2),
            "grade": self._get_grade(overall_score),
            "status": self._get_status(overall_score),
            "status_ko": self._get_status_ko(overall_score)
        }
    
    def _get_grade(self, score: float) -> str:
        """Get letter grade from score"""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def _get_status(self, score: float) -> str:
        """Get compliance status"""
        if score >= 90:
            return "Fully Compliant"
        elif score >= 70:
            return "Partially Compliant"
        else:
            return "Non-Compliant"
    
    def _get_status_ko(self, score: float) -> str:
        """Get Korean compliance status"""
        if score >= 90:
            return "완전 준수"
        elif score >= 70:
            return "부분 준수"
        else:
            return "미준수"
    
    def _format_pipa_section(self, results: Dict[str, Any], is_korean: bool) -> Dict[str, Any]:
        """Format PIPA compliance section"""
        return {
            "title": "PIPA 준수 평가" if is_korean else "PIPA Compliance Assessment",
            "compliance_percentage": results.get("compliance_percentage", 0),
            "risk_score": results.get("risk_score", 0),
            "risk_level": results.get("risk_level", ""),
            "total_rules": results.get("total_rules", 0),
            "compliant_rules": results.get("compliant_rules", 0),
            "violations": results.get("violations", 0),
            "violation_details": results.get("violation_details", []),
            "timestamp": results.get("timestamp", "")
        }
    
    def _format_ai_risk_section(self, results: Dict[str, Any], is_korean: bool) -> Dict[str, Any]:
        """Format AI risk assessment section"""
        return {
            "title": "AI 위험 평가" if is_korean else "AI Risk Assessment",
            "risk_score": results.get("risk_score", 0),
            "risk_level": results.get("risk_level_ko" if is_korean else "risk_level", ""),
            "msit_approval_required": results.get("msit_approval_required", False),
            "system_type": results.get("system_type", ""),
            "high_risk_domain": results.get("high_risk_domain", False),
            "domain": results.get("domain", ""),
            "risk_details": results.get("risk_details", []),
            "timestamp": results.get("timestamp", "")
        }
    
    def _format_privacy_scan_section(self, results: Dict[str, Any], is_korean: bool) -> Dict[str, Any]:
        """Format privacy scan section"""
        return {
            "title": "개인정보 보호 스캔" if is_korean else "Privacy Scan",
            "compliance_percentage": results.get("compliance_percentage", 0),
            "risk_score": results.get("risk_score", 0),
            "risk_level": results.get("risk_level_ko" if is_korean else "risk_level", ""),
            "issues_found": results.get("issues_found", 0),
            "issues": results.get("issues", []),
            "compliant_items": results.get("compliant_items", []),
            "timestamp": results.get("timestamp", "")
        }
    
    def _generate_recommendations(
        self,
        pipa_results: Optional[Dict[str, Any]],
        ai_risk_results: Optional[Dict[str, Any]],
        privacy_scan_results: Optional[Dict[str, Any]],
        is_korean: bool
    ) -> List[Dict[str, Any]]:
        """Generate prioritized recommendations"""
        all_recommendations = []
        
        # Collect recommendations from each module
        if ai_risk_results and "recommendations" in ai_risk_results:
            all_recommendations.extend(ai_risk_results["recommendations"])
        
        if privacy_scan_results and "recommendations" in privacy_scan_results:
            all_recommendations.extend(privacy_scan_results["recommendations"])
        
        # Sort by priority
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        all_recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "low"), 3))
        
        return all_recommendations
    
    def _generate_action_plan(
        self,
        pipa_results: Optional[Dict[str, Any]],
        ai_risk_results: Optional[Dict[str, Any]],
        privacy_scan_results: Optional[Dict[str, Any]],
        is_korean: bool
    ) -> Dict[str, Any]:
        """Generate action plan with timeline"""
        action_plan = {
            "title": "실행 계획" if is_korean else "Action Plan",
            "phases": []
        }
        
        # Phase 1: Immediate actions (0-7 days)
        immediate_actions = []
        
        if ai_risk_results and ai_risk_results.get("msit_approval_required", False):
            immediate_actions.append({
                "action": "MSIT 승인 신청 준비" if is_korean else "Prepare MSIT approval application",
                "deadline": "7일 이내" if is_korean else "Within 7 days",
                "priority": "critical"
            })
        
        if pipa_results and pipa_results.get("violations", 0) > 0:
            immediate_actions.append({
                "action": "PIPA 위반 사항 파악 및 긴급 조치" if is_korean else "Identify PIPA violations and take emergency measures",
                "deadline": "즉시" if is_korean else "Immediate",
                "priority": "critical"
            })
        
        if immediate_actions:
            action_plan["phases"].append({
                "phase": 1,
                "name": "즉시 조치 (0-7일)" if is_korean else "Immediate Actions (0-7 days)",
                "actions": immediate_actions
            })
        
        # Phase 2: Short-term actions (1-30 days)
        short_term_actions = []
        
        if privacy_scan_results and privacy_scan_results.get("issues_found", 0) > 0:
            short_term_actions.append({
                "action": "개인정보 보호 문제 해결" if is_korean else "Resolve privacy issues",
                "deadline": "30일 이내" if is_korean else "Within 30 days",
                "priority": "high"
            })
        
        short_term_actions.append({
            "action": "투명성 보고서 작성" if is_korean else "Create transparency report",
            "deadline": "30일 이내" if is_korean else "Within 30 days",
            "priority": "high"
        })
        
        if short_term_actions:
            action_plan["phases"].append({
                "phase": 2,
                "name": "단기 조치 (1-30일)" if is_korean else "Short-term Actions (1-30 days)",
                "actions": short_term_actions
            })
        
        # Phase 3: Medium-term actions (1-3 months)
        medium_term_actions = [{
            "action": "정기 감사 체계 구축" if is_korean else "Establish regular audit system",
            "deadline": "3개월 이내" if is_korean else "Within 3 months",
            "priority": "medium"
        }]
        
        action_plan["phases"].append({
            "phase": 3,
            "name": "중기 조치 (1-3개월)" if is_korean else "Medium-term Actions (1-3 months)",
            "actions": medium_term_actions
        })
        
        return action_plan
    
    def _determine_compliance_badge(self, overall_score: Dict[str, Any]) -> Dict[str, Any]:
        """Determine compliance badge level"""
        score = overall_score.get("score", 0)
        
        if score >= 90:
            level = "A"
            level_ko = "완전 준수"
            color = "#10B981"  # Green
        elif score >= 70:
            level = "B"
            level_ko = "부분 준수"
            color = "#F59E0B"  # Yellow
        else:
            level = "C"
            level_ko = "위험"
            color = "#EF4444"  # Red
        
        return {
            "level": level,
            "level_ko": level_ko,
            "score": score,
            "color": color,
            "badge_url": f"/badge/{level}"
        }
    
    def export_report(self, report: Dict[str, Any], format: str = "json") -> str:
        """
        Export report in specified format
        
        Args:
            report: Report dictionary
            format: Export format ("json", "text")
        
        Returns:
            Formatted report string
        """
        if format == "json":
            return json.dumps(report, ensure_ascii=False, indent=2)
        elif format == "text":
            return self._format_text_report(report)
        else:
            return json.dumps(report, ensure_ascii=False, indent=2)
    
    def _format_text_report(self, report: Dict[str, Any]) -> str:
        """Format report as plain text"""
        lines = []
        lines.append("=" * 80)
        lines.append(report.get("title", "Compliance Report").center(80))
        lines.append("=" * 80)
        lines.append(f"Report ID: {report.get('report_id', 'N/A')}")
        lines.append(f"Generated: {report.get('generated_at', 'N/A')}")
        lines.append("")
        
        # Overall score
        overall = report.get("overall_score", {})
        lines.append(f"Overall Score: {overall.get('score', 0):.2f}%")
        lines.append(f"Grade: {overall.get('grade', 'N/A')}")
        lines.append(f"Status: {overall.get('status', 'N/A')}")
        lines.append("")
        
        # Executive summary
        exec_summary = report.get("executive_summary", {})
        lines.append("Executive Summary")
        lines.append("-" * 80)
        for finding in exec_summary.get("key_findings", []):
            lines.append(f"• {finding}")
        lines.append("")
        
        # Recommendations
        recommendations = report.get("recommendations", [])
        if recommendations:
            lines.append("Recommendations")
            lines.append("-" * 80)
            for i, rec in enumerate(recommendations[:5], 1):
                priority = rec.get("priority", "medium").upper()
                title = rec.get("title_ko" if report.get("language") == "ko" else "title_en", "")
                lines.append(f"{i}. [{priority}] {title}")
            lines.append("")
        
        lines.append("=" * 80)
        
        return "\n".join(lines)
