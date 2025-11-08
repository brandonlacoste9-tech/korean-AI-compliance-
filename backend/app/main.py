from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
import os
import sys
from datetime import datetime
import stripe
from app.logging_config import setup_logging, get_logger
from app.middleware import RequestLoggingMiddleware, ErrorHandlingMiddleware

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Setup logging (JSON format in production, readable format in development)
is_production = os.getenv("ENVIRONMENT", "development") == "production"
log_level = os.getenv("LOG_LEVEL", "INFO")
setup_logging(log_level=log_level, json_logs=is_production)

# Get logger for this module
logger = get_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Compliance Guardian API",
    version="1.0.0",
    description="Korean AI Compliance Risk Assessment API"
)

# Add middleware (order matters - they execute in reverse order of addition)
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(RequestLoggingMiddleware)

logger.info(f"Starting AI Compliance Guardian API (Python {sys.version})")

# CORS - allow your Vercel frontend (production + all preview deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class AssessmentRequest(BaseModel):
    """Risk assessment request with field aliases for frontend compatibility."""

    model_config = ConfigDict(populate_by_name=True)

    company_name: str = Field(..., alias="companyName")
    email: str
    ai_usage: str = Field(..., alias="aiUsage")
    processes_personal_data: bool = Field(..., alias="processesPersonalData")
    timestamp: Optional[str] = None
    consent_given: Optional[bool] = Field(default=None, alias="consentGiven")
    locale: Optional[str] = None

class CheckoutRequest(BaseModel):
    plan: str
    currency: str = "krw"

# Startup time for uptime calculation
startup_time = datetime.utcnow()

# Health check endpoint with detailed metrics
@app.get("/")
@app.get("/health")
async def health_check(request: Request) -> Dict[str, Any]:
    """
    Health check endpoint with system metrics.

    Returns service status, version, uptime, and system information.
    """
    uptime_seconds = (datetime.utcnow() - startup_time).total_seconds()

    health_data = {
        "status": "healthy",
        "service": "AI Compliance Guardian API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "uptime_seconds": round(uptime_seconds, 2),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "python_version": sys.version.split()[0],
        "endpoints": {
            "risk_assessment": "/v1/assessments",
            "health": "/health",
            "docs": "/docs"
        }
    }

    logger.debug("Health check requested", extra={"extra_fields": {"uptime": uptime_seconds}})

    return health_data

# Risk assessment endpoint
@app.post("/v1/assessments")
@app.post("/api/risk-assessment")
async def create_risk_assessment(request: AssessmentRequest, req: Request):
    """
    Assess AI compliance risk based on usage and data processing.

    Calculates risk score and provides compliance recommendations.
    """
    logger.info(
        "Risk assessment requested",
        extra={
            "extra_fields": {
                "company": request.company_name,
                "ai_usage": request.ai_usage[:50],  # Truncate for logging
                "processes_personal_data": request.processes_personal_data,
                "client_ip": req.client.host if req.client else None,
            }
        },
    )

    try:
        # Calculate risk score
        risk_score = 0

        if "facial recognition" in request.ai_usage.lower():
            risk_score += 40
            logger.debug("Facial recognition detected", extra={"extra_fields": {"company": request.company_name}})

        if "surveillance" in request.ai_usage.lower():
            risk_score += 30
            logger.debug("Surveillance detected", extra={"extra_fields": {"company": request.company_name}})

        if request.processes_personal_data:
            risk_score += 30
            logger.debug("Personal data processing detected", extra={"extra_fields": {"company": request.company_name}})

        recommendation = "professional" if risk_score >= 50 else "starter"

        result = {
            "risk_score": risk_score,
            "recommendation": recommendation,
            "company_name": request.company_name,
        }

        logger.info(
            "Risk assessment completed",
            extra={
                "extra_fields": {
                    "company": request.company_name,
                    "risk_score": risk_score,
                    "recommendation": recommendation,
                }
            },
        )

        return result

    except Exception as e:
        logger.error(
            f"Risk assessment failed: {str(e)}",
            extra={
                "extra_fields": {
                    "company": request.company_name,
                    "error": str(e),
                }
            },
        )
        raise HTTPException(status_code=500, detail="Risk assessment failed")

# Stripe checkout endpoint
@app.post("/api/stripe/create-checkout")
async def create_checkout(request: CheckoutRequest, req: Request):
    """
    Create Stripe checkout session for paid plans.
    """
    logger.info(
        "Checkout requested",
        extra={
            "extra_fields": {
                "plan": request.plan,
                "currency": request.currency,
                "client_ip": req.client.host if req.client else None,
            }
        },
    )

    # Price mapping (in KRW cents for Stripe)
    prices = {
        "starter": {"krw": 12900000, "usd": 9900},  # $99 or ₩129,000
        "professional": {"krw": 39000000, "usd": 29900}  # $299 or ₩390,000
    }

    plan_data = prices.get(request.plan)
    if not plan_data:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    amount = plan_data.get(request.currency, 0)

    # Free plan or starter trial
    if amount == 0 or request.plan == "starter_trial":
        logger.info("Free plan selected", extra={"extra_fields": {"plan": request.plan}})
        return {"message": "Free plan - no payment required", "success": True}

    try:
        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": request.currency,
                        "unit_amount": amount,
                        "recurring": {"interval": "month"},
                        "product_data": {
                            "name": f"AI Compliance Guardian - {request.plan.capitalize()} Plan",
                            "description": f"Korean AI Act compliance for {request.plan} tier",
                        },
                    },
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/cancel",
            metadata={
                "plan": request.plan,
                "currency": request.currency,
            },
        )

        logger.info(
            "Stripe checkout session created",
            extra={"extra_fields": {
                "plan": request.plan,
                "amount": amount,
                "currency": request.currency,
                "session_id": checkout_session.id
            }},
        )

        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id,
            "success": True
        }

    except stripe.error.StripeError as e:
        logger.error(
            f"Stripe error: {str(e)}",
            extra={"extra_fields": {"plan": request.plan, "error": str(e)}},
        )
        raise HTTPException(status_code=500, detail=f"Payment processing error: {str(e)}")
    except Exception as e:
        logger.error(
            f"Checkout error: {str(e)}",
            extra={"extra_fields": {"plan": request.plan, "error": str(e)}},
        )
        raise HTTPException(status_code=500, detail="Failed to create checkout session")
