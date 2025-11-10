"""
Email Automation System for Korean AI Compliance
Handles welcome sequences, drip campaigns, and PDF delivery
"""

import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import resend
from jinja2 import Environment, FileSystemLoader, select_autoescape
import logging

# Configure Resend
resend.api_key = os.getenv("RESEND_API_KEY", "")

# Configure Jinja2 for email templates
template_env = Environment(
    loader=FileSystemLoader("app/email_templates"),
    autoescape=select_autoescape(['html', 'xml'])
)

logger = logging.getLogger(__name__)


class EmailAutomation:
    """Handle automated email sequences and campaigns"""
    
    def __init__(self):
        self.from_email = "AI Compliance Guardian <hello@aicomplianceguardian.kr>"
        self.reply_to = "support@aicomplianceguardian.kr"
    
    
    def send_checklist_pdf(
        self,
        to_email: str,
        first_name: str,
        language: str = "ko",
        pdf_path: Optional[str] = None
    ) -> Dict:
        """
        Send checklist PDF immediately after download request
        
        Args:
            to_email: Recipient email
            first_name: User's first name for personalization
            language: 'ko' or 'en'
            pdf_path: Path to PDF file (optional, can be S3 URL)
        
        Returns:
            Dict with send status
        """
        try:
            # Load template
            template = template_env.get_template("checklist_pdf_delivery.html")
            
            # Render with personalization
            html_content = template.render(
                first_name=first_name,
                language=language,
                year=datetime.now().year,
                days_until_enforcement=self._days_until_enforcement()
            )
            
            # Subject lines
            subjects = {
                "ko": f"{first_name}님, AI 컴플라이언스 체크리스트를 보내드립니다 📋",
                "en": f"{first_name}, Your Korean AI Compliance Checklist 📋"
            }
            
            # Attachments (if PDF provided)
            attachments = []
            if pdf_path:
                attachments.append({
                    "filename": "Korean_AI_Compliance_Checklist.pdf",
                    "path": pdf_path
                })
            
            # Send email
            response = resend.Emails.send({
                "from": self.from_email,
                "to": to_email,
                "reply_to": self.reply_to,
                "subject": subjects.get(language, subjects["en"]),
                "html": html_content,
                "attachments": attachments,
                "tags": [
                    {"name": "campaign", "value": "checklist-pdf-delivery"},
                    {"name": "language", "value": language},
                    {"name": "sequence", "value": "email-1"}
                ]
            })
            
            logger.info(f"Checklist PDF sent to {to_email}: {response}")
            
            # Schedule follow-up emails
            self._schedule_drip_campaign(
                to_email=to_email,
                first_name=first_name,
                language=language,
                sequence="90-day-compliance"
            )
            
            return {
                "success": True,
                "message": "Checklist PDF sent successfully",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send checklist PDF to {to_email}: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    
    def send_email_sequence(
        self,
        to_email: str,
        first_name: str,
        sequence_name: str,
        email_number: int,
        language: str = "ko"
    ) -> Dict:
        """
        Send specific email from a sequence
        
        Sequences:
        - "90-day-compliance": 8-email onboarding sequence
        - "trial-nurture": Trial user engagement
        - "churned-reactivation": Win-back campaign
        
        Args:
            to_email: Recipient email
            first_name: User's first name
            sequence_name: Name of email sequence
            email_number: Which email in sequence (1-8)
            language: 'ko' or 'en'
        """
        try:
            # Email sequence configurations
            sequences = {
                "90-day-compliance": {
                    1: {
                        "template": "sequence_90day_email1.html",
                        "subject_ko": f"{first_name}님, 체크리스트 다운로드 감사합니다 📋",
                        "subject_en": f"{first_name}, Your Checklist - Let's Get Started 📋",
                        "delay_days": 0
                    },
                    2: {
                        "template": "sequence_90day_email2.html",
                        "subject_ko": "Step 1-2: AI 시스템 적용 대상 확인",
                        "subject_en": "Step 1-2: Is Your AI System Subject to the Law?",
                        "delay_days": 3
                    },
                    3: {
                        "template": "sequence_90day_email3.html",
                        "subject_ko": "⚠️ ₩30M 벌금 주의: 국내 대리인이 있으신가요?",
                        "subject_en": "⚠️ ₩30M Fine Alert: Do You Have a Local Rep?",
                        "delay_days": 7
                    },
                    4: {
                        "template": "sequence_90day_email4.html",
                        "subject_ko": "Step 5-6: 감사 로깅 & 보안 요구사항",
                        "subject_en": "Step 5-6: Audit Logging & Security Requirements",
                        "delay_days": 14
                    },
                    5: {
                        "template": "sequence_90day_email5.html",
                        "subject_ko": "Step 7-8: 소통 & 벌칙 인식",
                        "subject_en": "Step 7-8: Communication & Penalty Awareness",
                        "delay_days": 21
                    },
                    6: {
                        "template": "sequence_90day_email6.html",
                        "subject_ko": f"⏰ {self._days_until_enforcement()}일 남음 - 진행 상황은?",
                        "subject_en": f"⏰ {self._days_until_enforcement()} Days Left - Your Progress?",
                        "delay_days": 28
                    },
                    7: {
                        "template": "sequence_90day_email7.html",
                        "subject_ko": "사례 연구: 60일만에 완벽 준수 달성한 방법",
                        "subject_en": "Case Study: Full Compliance in 60 Days",
                        "delay_days": 35
                    },
                    8: {
                        "template": "sequence_90day_email8.html",
                        "subject_ko": "마지막 기회: 14일 무료 체험 종료 임박",
                        "subject_en": "Last Chance: 14-Day Free Trial Ending Soon",
                        "delay_days": 45
                    }
                }
            }
            
            # Get email config
            email_config = sequences.get(sequence_name, {}).get(email_number)
            if not email_config:
                raise ValueError(f"Email {email_number} not found in sequence {sequence_name}")
            
            # Load and render template
            template = template_env.get_template(email_config["template"])
            html_content = template.render(
                first_name=first_name,
                language=language,
                year=datetime.now().year,
                days_until_enforcement=self._days_until_enforcement(),
                email_number=email_number
            )
            
            # Send email
            response = resend.Emails.send({
                "from": self.from_email,
                "to": to_email,
                "reply_to": self.reply_to,
                "subject": email_config.get(f"subject_{language}", email_config["subject_en"]),
                "html": html_content,
                "tags": [
                    {"name": "campaign", "value": sequence_name},
                    {"name": "language", "value": language},
                    {"name": "sequence", "value": f"email-{email_number}"}
                ]
            })
            
            logger.info(f"Sequence email {email_number} sent to {to_email}: {response}")
            
            return {
                "success": True,
                "message": f"Email {email_number} of {sequence_name} sent",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send sequence email: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    
    def _schedule_drip_campaign(
        self,
        to_email: str,
        first_name: str,
        language: str,
        sequence: str
    ) -> None:
        """
        Schedule follow-up emails in a drip campaign
        
        In production, use:
        - Celery + Redis for job queue
        - AWS SES Scheduled Sends
        - Resend's scheduling API (if available)
        
        For now, this creates database entries that a cron job will process
        """
        try:
            from app.models import ScheduledEmail
            from app.database import SessionLocal
            
            db = SessionLocal()
            
            # Email schedule (days from now)
            schedule = [
                {"email_number": 2, "delay_days": 3},
                {"email_number": 3, "delay_days": 7},
                {"email_number": 4, "delay_days": 14},
                {"email_number": 5, "delay_days": 21},
                {"email_number": 6, "delay_days": 28},
                {"email_number": 7, "delay_days": 35},
                {"email_number": 8, "delay_days": 45},
            ]
            
            for item in schedule:
                scheduled_email = ScheduledEmail(
                    to_email=to_email,
                    first_name=first_name,
                    language=language,
                    sequence_name=sequence,
                    email_number=item["email_number"],
                    send_at=datetime.now() + timedelta(days=item["delay_days"]),
                    status="pending"
                )
                db.add(scheduled_email)
            
            db.commit()
            logger.info(f"Scheduled {len(schedule)} follow-up emails for {to_email}")
            
        except Exception as e:
            logger.error(f"Failed to schedule drip campaign: {str(e)}")
    
    
    def _days_until_enforcement(self) -> int:
        """Calculate days until Korean AI Act enforcement (Jan 22, 2026)"""
        enforcement_date = datetime(2026, 1, 22)
        today = datetime.now()
        delta = enforcement_date - today
        return max(0, delta.days)
    
    
    def send_welcome_email(
        self,
        to_email: str,
        first_name: str,
        company_name: str,
        language: str = "ko"
    ) -> Dict:
        """Send welcome email after user registration"""
        try:
            template = template_env.get_template("welcome.html")
            html_content = template.render(
                first_name=first_name,
                company_name=company_name,
                language=language,
                year=datetime.now().year
            )
            
            subjects = {
                "ko": f"{first_name}님, AI Compliance Guardian에 오신 것을 환영합니다! 🎉",
                "en": f"Welcome to AI Compliance Guardian, {first_name}! 🎉"
            }
            
            response = resend.Emails.send({
                "from": self.from_email,
                "to": to_email,
                "reply_to": self.reply_to,
                "subject": subjects.get(language, subjects["en"]),
                "html": html_content,
                "tags": [
                    {"name": "campaign", "value": "welcome"},
                    {"name": "language", "value": language}
                ]
            })
            
            logger.info(f"Welcome email sent to {to_email}")
            
            return {
                "success": True,
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    
    def send_trial_started(
        self,
        to_email: str,
        first_name: str,
        trial_end_date: str,
        language: str = "ko"
    ) -> Dict:
        """Send email when user starts free trial"""
        try:
            template = template_env.get_template("trial_started.html")
            html_content = template.render(
                first_name=first_name,
                trial_end_date=trial_end_date,
                language=language,
                year=datetime.now().year
            )
            
            subjects = {
                "ko": f"{first_name}님, 14일 무료 체험이 시작되었습니다! 🚀",
                "en": f"{first_name}, Your 14-Day Free Trial Has Started! 🚀"
            }
            
            response = resend.Emails.send({
                "from": self.from_email,
                "to": to_email,
                "reply_to": self.reply_to,
                "subject": subjects.get(language, subjects["en"]),
                "html": html_content,
                "tags": [
                    {"name": "campaign", "value": "trial-started"},
                    {"name": "language", "value": language}
                ]
            })
            
            return {
                "success": True,
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send trial started email: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    
    def send_assessment_completed(
        self,
        to_email: str,
        first_name: str,
        risk_score: int,
        language: str = "ko"
    ) -> Dict:
        """Send email with assessment results"""
        try:
            template = template_env.get_template("assessment_completed.html")
            html_content = template.render(
                first_name=first_name,
                risk_score=risk_score,
                language=language,
                year=datetime.now().year
            )
            
            subjects = {
                "ko": f"{first_name}님, AI 위험도 평가 결과가 나왔습니다",
                "en": f"{first_name}, Your AI Risk Assessment Results Are Ready"
            }
            
            response = resend.Emails.send({
                "from": self.from_email,
                "to": to_email,
                "reply_to": self.reply_to,
                "subject": subjects.get(language, subjects["en"]),
                "html": html_content,
                "tags": [
                    {"name": "campaign", "value": "assessment-completed"},
                    {"name": "language", "value": language},
                    {"name": "risk_score", "value": str(risk_score)}
                ]
            })
            
            return {
                "success": True,
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send assessment completed email: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


# Helper functions for API endpoints

def send_checklist_pdf_email(
    to_email: str,
    first_name: str,
    language: str = "ko",
    pdf_url: Optional[str] = None
) -> Dict:
    """
    Public function to send checklist PDF
    Call this from your API endpoint
    """
    automation = EmailAutomation()
    return automation.send_checklist_pdf(to_email, first_name, language, pdf_url)


def trigger_email_sequence(
    to_email: str,
    first_name: str,
    sequence: str,
    language: str = "ko"
) -> Dict:
    """
    Public function to trigger an email sequence
    """
    automation = EmailAutomation()
    return automation.send_email_sequence(to_email, first_name, sequence, 1, language)
