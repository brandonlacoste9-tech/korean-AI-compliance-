"""
Email Campaign API for Korean AI Compliance SaaS
Handles automated email campaigns for user engagement, compliance notifications, and marketing.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import os
import requests

router = APIRouter()

# Resend API configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_URL = "https://api.resend.com/emails"
FROM_EMAIL = "AI Compliance Guardian <noreply@aicomplianceguardian.com>"


# Email Templates
EMAIL_TEMPLATES = {
    "welcome_ko": {
        "subject": "AI 규정 준수 가디언에 오신 것을 환영합니다!",
        "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">환영합니다! 🎉</h1>
            <p>한국 AI 기본법 규정 준수 플랫폼에 가입해 주셔서 감사합니다.</p>

            <h2>다음 단계:</h2>
            <ol>
                <li>대시보드에 로그인하세요</li>
                <li>첫 번째 AI 시스템을 등록하세요</li>
                <li>위험 평가를 시작하세요</li>
                <li>규정 준수 보고서를 생성하세요</li>
            </ol>

            <p><a href="https://app.aicomplianceguardian.com/dashboard"
                  style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                대시보드로 이동
            </a></p>

            <p style="color: #666; font-size: 14px; margin-top: 40px;">
                도움이 필요하신가요? <a href="mailto:support@aicomplianceguardian.com">support@aicomplianceguardian.com</a>으로 연락주세요.
            </p>
        </div>
        """
    },

    "welcome_en": {
        "subject": "Welcome to AI Compliance Guardian!",
        "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome! 🎉</h1>
            <p>Thank you for signing up for the Korean AI Basic Act Compliance Platform.</p>

            <h2>Next Steps:</h2>
            <ol>
                <li>Log in to your dashboard</li>
                <li>Register your first AI system</li>
                <li>Start your risk assessment</li>
                <li>Generate compliance reports</li>
            </ol>

            <p><a href="https://app.aicomplianceguardian.com/dashboard"
                  style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Go to Dashboard
            </a></p>

            <p style="color: #666; font-size: 14px; margin-top: 40px;">
                Need help? Contact us at <a href="mailto:support@aicomplianceguardian.com">support@aicomplianceguardian.com</a>
            </p>
        </div>
        """
    },

    "risk_assessment_ko": {
        "subject": "위험 평가 결과: {risk_score}/100",
        "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">위험 평가 완료</h1>
            <p>귀하의 AI 시스템 위험 평가가 완료되었습니다.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin: 0;">위험 점수: <span style="color: {risk_color};">{risk_score}/100</span></h2>
                <p style="margin: 10px 0 0;">{risk_level_text}</p>
            </div>

            <h3>필요한 조치:</h3>
            <ul>
                {action_items}
            </ul>

            <p><a href="https://app.aicomplianceguardian.com/dashboard"
                  style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                상세 보고서 보기
            </a></p>
        </div>
        """
    },

    "compliance_deadline_ko": {
        "subject": "⚠️ 규정 준수 마감일 알림 - {days_remaining}일 남음",
        "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">⚠️ 긴급: 규정 준수 마감일 임박</h1>
            <p>한국 AI 기본법 완전 시행까지 <strong>{days_remaining}일</strong> 남았습니다.</p>

            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
                <h3 style="margin: 0; color: #dc2626;">2026년 1월: 전면 시행</h3>
                <p style="margin: 10px 0 0;">준수하지 않을 경우 최대 3천만원의 벌금이 부과될 수 있습니다.</p>
            </div>

            <h3>지금 해야 할 일:</h3>
            <ol>
                <li>위험 관리 계획 완료</li>
                <li>배포 전 검토 수행</li>
                <li>정부 등록 완료</li>
                <li>문서 준비</li>
            </ol>

            <p><a href="https://app.aicomplianceguardian.com/dashboard"
                  style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                지금 시작하기
            </a></p>
        </div>
        """
    },

    "document_ready_ko": {
        "subject": "📄 규정 준수 문서가 준비되었습니다",
        "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">📄 문서 생성 완료</h1>
            <p>요청하신 규정 준수 문서가 준비되었습니다.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0;">생성된 문서:</h3>
                <ul>
                    {document_list}
                </ul>
            </div>

            <p><a href="https://app.aicomplianceguardian.com/documents"
                  style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                문서 다운로드
            </a></p>

            <p style="color: #666; font-size: 14px; margin-top: 40px;">
                이 문서들은 30일 동안 다운로드 가능합니다.
            </p>
        </div>
        """
    },

    "payment_success_ko": {
        "subject": "✅ 결제 완료 - AI Compliance Guardian",
        "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10b981;">✅ 결제가 완료되었습니다!</h1>
            <p>AI Compliance Guardian {plan_name} 플랜을 구독해 주셔서 감사합니다.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0;">결제 정보:</h3>
                <p style="margin: 10px 0;"><strong>플랜:</strong> {plan_name}</p>
                <p style="margin: 10px 0;"><strong>금액:</strong> {amount}</p>
                <p style="margin: 10px 0;"><strong>결제 방법:</strong> {payment_method}</p>
                <p style="margin: 10px 0;"><strong>다음 결제일:</strong> {next_billing_date}</p>
            </div>

            <p><a href="https://app.aicomplianceguardian.com/dashboard"
                  style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                시작하기
            </a></p>

            <p style="color: #666; font-size: 14px; margin-top: 40px;">
                영수증이 첨부되어 있습니다. 궁금한 점이 있으시면 support@aicomplianceguardian.com으로 연락주세요.
            </p>
        </div>
        """
    }
}


# Pydantic Models
class EmailRecipient(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    language: str = "ko"  # 'ko' or 'en'


class WelcomeEmailRequest(BaseModel):
    recipient: EmailRecipient


class RiskAssessmentEmailRequest(BaseModel):
    recipient: EmailRecipient
    risk_score: int
    system_name: str


class ComplianceDeadlineEmailRequest(BaseModel):
    recipients: List[EmailRecipient]
    days_remaining: int


class DocumentReadyEmailRequest(BaseModel):
    recipient: EmailRecipient
    documents: List[str]


class PaymentSuccessEmailRequest(BaseModel):
    recipient: EmailRecipient
    plan_name: str
    amount: str
    payment_method: str
    next_billing_date: str


# Helper Functions
def send_email_via_resend(to_email: str, subject: str, html: str) -> dict:
    """Send email using Resend API"""

    if not RESEND_API_KEY:
        raise HTTPException(status_code=500, detail="Resend API key not configured")

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "from": FROM_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html
    }

    response = requests.post(RESEND_API_URL, json=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Failed to send email: {response.text}"
        )

    return response.json()


# API Endpoints

@router.post("/send-welcome")
async def send_welcome_email(request: WelcomeEmailRequest):
    """Send welcome email to new user"""

    template_key = f"welcome_{request.recipient.language}"
    template = EMAIL_TEMPLATES.get(template_key, EMAIL_TEMPLATES["welcome_en"])

    result = send_email_via_resend(
        to_email=request.recipient.email,
        subject=template["subject"],
        html=template["html"]
    )

    return {
        "success": True,
        "message": "Welcome email sent",
        "email_id": result.get("id"),
        "timestamp": datetime.now().isoformat()
    }


@router.post("/send-risk-assessment")
async def send_risk_assessment_email(request: RiskAssessmentEmailRequest):
    """Send risk assessment results email"""

    # Determine risk level and color
    risk_color = "#dc2626" if request.risk_score > 50 else "#10b981"
    risk_level_text = "⚠️ 고위험 - 즉시 조치 필요" if request.risk_score > 50 else "✅ 저위험 - 정기 모니터링 권장"

    # Generate action items
    if request.risk_score > 50:
        action_items = """
        <li>제32조: 위험 관리 계획 수립</li>
        <li>제33조: 배포 전 검토 수행</li>
        <li>제31조: AI 시스템 정부 등록</li>
        <li>제36조: 사고 대응 절차 마련</li>
        """
    else:
        action_items = """
        <li>제31조: AI 시스템 등록</li>
        <li>정기 모니터링 실시</li>
        <li>연간 준수 보고서 제출</li>
        """

    template = EMAIL_TEMPLATES["risk_assessment_ko"]
    subject = template["subject"].format(risk_score=request.risk_score)
    html = template["html"].format(
        risk_score=request.risk_score,
        risk_color=risk_color,
        risk_level_text=risk_level_text,
        action_items=action_items
    )

    result = send_email_via_resend(
        to_email=request.recipient.email,
        subject=subject,
        html=html
    )

    return {
        "success": True,
        "message": "Risk assessment email sent",
        "email_id": result.get("id")
    }


@router.post("/send-compliance-deadline")
async def send_compliance_deadline_email(request: ComplianceDeadlineEmailRequest):
    """Send compliance deadline reminder to multiple recipients"""

    template = EMAIL_TEMPLATES["compliance_deadline_ko"]
    subject = template["subject"].format(days_remaining=request.days_remaining)
    html = template["html"].format(days_remaining=request.days_remaining)

    results = []
    for recipient in request.recipients:
        try:
            result = send_email_via_resend(
                to_email=recipient.email,
                subject=subject,
                html=html
            )
            results.append({
                "email": recipient.email,
                "success": True,
                "email_id": result.get("id")
            })
        except Exception as e:
            results.append({
                "email": recipient.email,
                "success": False,
                "error": str(e)
            })

    return {
        "success": True,
        "message": f"Sent {len(results)} emails",
        "results": results
    }


@router.post("/send-document-ready")
async def send_document_ready_email(request: DocumentReadyEmailRequest):
    """Send email when compliance documents are ready"""

    document_list = "".join([f"<li>{doc}</li>" for doc in request.documents])

    template = EMAIL_TEMPLATES["document_ready_ko"]
    html = template["html"].format(document_list=document_list)

    result = send_email_via_resend(
        to_email=request.recipient.email,
        subject=template["subject"],
        html=html
    )

    return {
        "success": True,
        "message": "Document ready email sent",
        "email_id": result.get("id")
    }


@router.post("/send-payment-success")
async def send_payment_success_email(request: PaymentSuccessEmailRequest):
    """Send payment confirmation email"""

    template = EMAIL_TEMPLATES["payment_success_ko"]
    html = template["html"].format(
        plan_name=request.plan_name,
        amount=request.amount,
        payment_method=request.payment_method,
        next_billing_date=request.next_billing_date
    )

    result = send_email_via_resend(
        to_email=request.recipient.email,
        subject=template["subject"],
        html=html
    )

    return {
        "success": True,
        "message": "Payment success email sent",
        "email_id": result.get("id")
    }


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "email_campaign",
        "resend_configured": bool(RESEND_API_KEY)
    }
