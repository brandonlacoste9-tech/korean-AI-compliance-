from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import os
from datetime import datetime
from dotenv import load_dotenv

# Import compliance modules
from app.pipa_rules_kr import PIPARulesKR
from app.ai_risk_analyzer import AIRiskAnalyzer
from app.privacy_scanner import PrivacyScanner
from app.report_generator import ReportGenerator

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Compliance Guardian API",
    version="1.0.0",
    description="Korean AI Basic Act & PIPC Compliance API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    
    # Process request
    response = await call_next(request)
    
    # Log request details (PIPC audit requirement)
    process_time = (datetime.now() - start_time).total_seconds()
    print(f"[{datetime.now().isoformat()}] {request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    Required for production deployment
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "compliance": {
            "msit": True,
            "pipc": True,
            "data_residency": "Seoul",
        },
    }

# Root endpoint
@app.get("/")
async def root():
    """
    API root endpoint with compliance information
    """
    return {
        "message": "AI Compliance Guardian API",
        "version": "1.0.0",
        "compliance": "Korean AI Basic Act & PIPC",
        "data_residency": "Seoul, Republic of Korea",
        "docs": "/docs",
        "health": "/health",
    }

# Risk assessment placeholder
class RiskAssessmentRequest(BaseModel):
    user_id: str
    organization_id: str
    ai_system_name: str
    ai_system_type: str
    data_types: list[str]
    user_count: Optional[int] = None

@app.post("/api/risk/assess")
async def assess_risk(request: RiskAssessmentRequest):
    """
    AI risk assessment endpoint
    MSIT requirement for high-risk AI systems
    """
    # TODO: Implement actual risk assessment logic
    # This is a placeholder for Task #5: API Glue PR
    
    return {
        "assessment_id": f"ASSESS-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        "risk_level": "medium",
        "compliance_score": 75,
        "recommendations": [
            "Implement user consent mechanism",
            "Enable audit logging",
            "Review data retention policy",
        ],
        "msit_approval_required": False,
        "pipc_compliant": True,
        "timestamp": datetime.now().isoformat(),
    }

# Badge verification placeholder
@app.get("/api/badge/verify/{badge_id}")
async def verify_badge(badge_id: str):
    """
    Verify compliance badge
    Public endpoint for badge verification
    """
    # TODO: Implement actual badge verification from database
    
    return {
        "badge_id": badge_id,
        "verified": True,
        "organization": "Sample Organization",
        "badge_type": "msit",
        "issued_date": "2024-11-01",
        "expiry_date": "2025-11-01",
        "verification_url": f"https://msit.go.kr/verify/{badge_id}",
    }

# Contact form endpoint
class ContactRequest(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    subject: str
    message: str
    consent: bool

@app.post("/api/contact")
async def submit_contact(request: ContactRequest):
    """
    Contact form submission
    Requires PIPC consent
    """
    if not request.consent:
        raise HTTPException(
            status_code=400,
            detail="PIPC consent is required to process personal information"
        )
    
    # TODO: Implement email sending and database storage
    # This is a placeholder for Task #6: Compliance Guardrails PR
    
    return {
        "status": "success",
        "message": "Your inquiry has been received. We will respond within 24 hours.",
        "message_ko": "문의가 접수되었습니다. 24시간 이내에 답변드리겠습니다.",
        "ticket_id": f"TICKET-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        "timestamp": datetime.now().isoformat(),
    }

# Compliance status endpoint
@app.get("/api/compliance/status/{organization_id}")
async def get_compliance_status(organization_id: str):
    """
    Get organization compliance status
    Requires authentication
    """
    # TODO: Implement actual compliance status retrieval
    
    return {
        "organization_id": organization_id,
        "overall_status": "compliant",
        "last_audit": "2024-11-01",
        "next_audit": "2025-02-01",
        "msit_approval": True,
        "pipc_compliant": True,
        "audit_logs_retained": "3 years",
        "data_residency": "Seoul",
        "timestamp": datetime.now().isoformat(),
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested resource was not found",
            "message_ko": "요청하신 리소스를 찾을 수 없습니다",
        },
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "message_ko": "예기치 않은 오류가 발생했습니다",
        },
    )

# ===========================================================
# Task #2: Compliance Rule Engine API Endpoints
# ===========================================================

# Initialize compliance modules
pipa_checker = PIPARulesKR()
ai_risk_analyzer = AIRiskAnalyzer()
privacy_scanner = PrivacyScanner()
report_generator = ReportGenerator()

# Request Models
class ScanRequest(BaseModel):
    """Privacy scan request model"""
    text: Optional[str] = None
    context: str = ""
    system_config: Optional[Dict[str, Any]] = None

class AnalyzeRequest(BaseModel):
    """AI risk analysis request model"""
    system_type: str
    uses_personal_data: bool = False
    decision_impact_level: str = "low"
    has_transparency: bool = True
    user_count: int = 0
    is_automated: bool = False
    uses_biometric_data: bool = False
    application_domain: str = ""

class ReportRequest(BaseModel):
    """Report generation request model"""
    pipa_results: Optional[Dict[str, Any]] = None
    ai_risk_results: Optional[Dict[str, Any]] = None
    privacy_scan_results: Optional[Dict[str, Any]] = None
    report_type: str = "full"
    lang: str = "ko"

class RiskScoreRequest(BaseModel):
    """PIPA compliance check request model"""
    has_consent: bool = False
    purpose_defined: bool = False
    data_minimized: bool = False
    retention_compliant: bool = False
    security_measures: bool = False
    data_in_seoul: bool = False
    audit_enabled: bool = False
    user_rights_enabled: bool = False

@app.post("/api/scan")
async def scan_privacy(request: ScanRequest):
    """
    Privacy scan endpoint
    개인정보 보호 스캔 엔드포인트
    
    Scans text or system configuration for privacy compliance issues.
    """
    try:
        if request.text:
            # Scan text for sensitive data
            results = privacy_scanner.scan_text(request.text, request.context)
        elif request.system_config:
            # Scan system configuration
            results = privacy_scanner.scan_system(request.system_config)
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Bad Request",
                    "message": "Either text or system_config must be provided",
                    "message_ko": "text 또는 system_config 중 하나를 제공해야 합니다"
                }
            )
        
        return {
            "success": True,
            "data": results,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Scan Failed",
                "message": str(e),
                "message_ko": "스캔 실패"
            }
        )

@app.post("/api/analyze")
async def analyze_ai_risk(request: AnalyzeRequest):
    """
    AI risk analysis endpoint
    AI 위험 분석 엔드포인트
    
    Analyzes AI system for risk level according to Korean AI Basic Act.
    """
    try:
        system_data = request.dict()
        results = ai_risk_analyzer.analyze_risk(system_data)
        
        return {
            "success": True,
            "data": results,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Analysis Failed",
                "message": str(e),
                "message_ko": "분석 실패"
            }
        )

@app.post("/api/report")
async def generate_compliance_report(request: ReportRequest):
    """
    Compliance report generation endpoint
    준법 보고서 생성 엔드포인트
    
    Generates comprehensive compliance report in Korean or English.
    """
    try:
        report = report_generator.generate_report(
            pipa_results=request.pipa_results,
            ai_risk_results=request.ai_risk_results,
            privacy_scan_results=request.privacy_scan_results,
            report_type=request.report_type,
            lang=request.lang
        )
        
        return {
            "success": True,
            "data": report,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Report Generation Failed",
                "message": str(e),
                "message_ko": "보고서 생성 실패"
            }
        )

@app.post("/api/risk-score")
async def calculate_pipa_risk_score(request: RiskScoreRequest):
    """
    PIPA risk score calculation endpoint
    PIPA 위험 점수 계산 엔드포인트
    
    Calculates PIPA compliance risk score based on system configuration.
    """
    try:
        data = request.dict()
        results = pipa_checker.check_compliance(data)
        
        # Get recommendations
        if results.get("violation_details"):
            recommendations = pipa_checker.get_recommendations(
                results["violation_details"],
                lang="ko"
            )
            results["recommendations"] = recommendations
        
        return {
            "success": True,
            "data": results,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Risk Score Calculation Failed",
                "message": str(e),
                "message_ko": "위험 점수 계산 실패"
            }
        )

# High-risk categories endpoint
@app.get("/api/high-risk-categories")
async def get_high_risk_categories(lang: str = "ko"):
    """
    Get list of high-risk AI categories per Korean AI Basic Act
    한국 AI 기본법 고위험 AI 분야 목록
    """
    try:
        categories = ai_risk_analyzer.get_high_risk_categories(lang)
        
        return {
            "success": True,
            "data": categories,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to retrieve categories",
                "message": str(e),
                "message_ko": "카테고리 조회 실패"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
