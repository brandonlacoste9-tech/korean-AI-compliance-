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
from app.rate_limit import RateLimitMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.email_automation import EmailAutomation
from app.database import init_db, SessionLocal
from app.audit_endpoints import router as audit_router
from app.browser_automation import router as browser_router
from app.classification_endpoints import router as classification_router
from app.audit_models import ConsentLog

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL:
    # Fix for Supabase connection pooling
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

    # Database models
    class RiskAssessmentDB(Base):
        __tablename__ = "risk_assessments"

        id = Column(Integer, primary_key=True, index=True)
        company_name = Column(String, nullable=False)
        email = Column(String, nullable=False)
        ai_usage = Column(Text, nullable=False)
        processes_personal_data = Column(Boolean, default=False)
        risk_score = Column(Integer, default=0)
        recommendation = Column(String, nullable=True)
        timestamp = Column(DateTime, default=datetime.utcnow)
        locale = Column(String, nullable=True)

    class SubscriptionDB(Base):
        __tablename__ = "subscriptions"

        id = Column(Integer, primary_key=True, index=True)
        email = Column(String, nullable=False)
        stripe_customer_id = Column(String, nullable=True)
        stripe_subscription_id = Column(String, nullable=True)
        plan = Column(String, nullable=False)
        status = Column(String, default="active")
        created_at = Column(DateTime, default=datetime.utcnow)

    # Create tables
    Base.metadata.create_all(bind=engine)
    db_enabled = True
else:
    db_enabled = False
    logger = get_logger(__name__)
    logger.warning("DATABASE_URL not set - running without database persistence")

# Initialize email automation
email_automation = EmailAutomation()

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
    description="Korean AI Compliance Risk Assessment API",
    redirect_slashes=False  # Prevent POST → GET conversion on trailing slash redirects
)

# Add middleware (order matters - they execute in reverse order of addition)
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=100)

# Include audit logging router for PIPC compliance
app.include_router(audit_router)
app.include_router(browser_router)
app.include_router(classification_router)

logger.info(f"Starting AI Compliance Guardian API (Python {sys.version})")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup."""
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")

# CORS - allow your Vercel frontend (production + all preview deployments) and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
    ],
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
@app.get("/healthz")
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

@app.get("/readiness")
async def readiness_check() -> Dict[str, str]:
    """
    Kubernetes-style readiness probe.
    
    Returns 200 OK if service is ready to accept traffic.
    """
    logger.debug("Readiness check requested")
    return {"status": "ready"}

@app.get("/version")
async def version_info() -> Dict[str, Any]:
    """
    Version and build information endpoint.
    """
    return {
        "version": "1.0.0",
        "service": "AI Compliance Guardian API",
        "python_version": sys.version.split()[0],
        "environment": os.getenv("ENVIRONMENT", "development"),
        "build_time": startup_time.isoformat() + "Z"
    }

# Risk assessment endpoint
@app.post("/v1/assessments")
@app.post("/api/risk-assessment")
async def create_risk_assessment(request: AssessmentRequest, req: Request):
    """
    Assess AI compliance risk based on usage and data processing.

    Calculates risk score and provides compliance recommendations.
    
    **PIPC Compliance:** This endpoint automatically logs consent and AI processing
    for Korean AI Basic Act transparency requirements.
    """
    client_ip = req.client.host if req.client else "unknown"
    
    logger.info(
        "Risk assessment requested",
        extra={
            "extra_fields": {
                "company": request.company_name,
                "ai_usage": request.ai_usage[:50],  # Truncate for logging
                "processes_personal_data": request.processes_personal_data,
                "client_ip": client_ip,
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

        # Save to database
        if db_enabled:
            try:
                db = SessionLocal()
                assessment = RiskAssessmentDB(
                    company_name=request.company_name,
                    email=request.email,
                    ai_usage=request.ai_usage,
                    processes_personal_data=request.processes_personal_data,
                    risk_score=risk_score,
                    recommendation=recommendation,
                    locale=request.locale
                )
                db.add(assessment)
                db.commit()
                db.refresh(assessment)
                db.close()
                logger.info(f"Assessment saved to database: ID {assessment.id}")
            except Exception as db_error:
                logger.error(f"Database save failed: {str(db_error)}")

        # Send welcome email
        try:
            first_name = request.company_name.split()[0]  # Extract first word as name
            language = "ko" if request.locale and request.locale.startswith("ko") else "en"

            email_result = email_automation.send_welcome_email(
                to_email=request.email,
                first_name=first_name,
                company_name=request.company_name,
                language=language
            )
            logger.info(f"Welcome email sent: {email_result}")
        except Exception as email_error:
            logger.error(f"Email send failed: {str(email_error)}")

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
        
        # PIPC Compliance: Log consent if provided
        if request.consent_given is not None:
            db = SessionLocal()
            try:
                consent_log = ConsentLog(
                    user_identifier=request.email,
                    ip_address=client_ip,
                    consent_type="risk_assessment",
                    consent_text="I consent to AI risk assessment processing (AI 위험 평가 처리에 동의합니다)",
                    consent_method="api_submission",
                    consent_given=request.consent_given,
                    extra_metadata={
                        "company_name": request.company_name,
                        "locale": request.locale or "ko"
                    },
                    timestamp=datetime.utcnow()
                )
                db.add(consent_log)
                db.commit()
                logger.debug(f"Consent logged for {request.email}")
            except Exception as log_error:
                logger.warning(f"Failed to log consent: {str(log_error)}")
                db.rollback()
            finally:
                db.close()

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
@app.post("/api/stripe/create-checkout-session")
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

    # Price mapping (KRW has no decimal places, USD in cents)
    prices = {
        "starter": {"krw": 129000, "usd": 9900},  # $99 or ₩129,000
        "professional": {"krw": 390000, "usd": 29900}  # $299 or ₩390,000
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

# Stripe webhook endpoint
@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events for payment processing.

    Processes events like:
    - checkout.session.completed: Payment succeeded
    - payment_intent.succeeded: Payment confirmed
    - customer.subscription.created: New subscription
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    # Log webhook received
    logger.info("Stripe webhook received", extra={"extra_fields": {"has_signature": bool(sig_header)}})

    try:
        # Verify webhook signature (required in production)
        if not webhook_secret:
            if is_production:
                logger.error("STRIPE_WEBHOOK_SECRET not configured in production!")
                raise HTTPException(status_code=500, detail="Webhook secret not configured")
            else:
                logger.warning("STRIPE_WEBHOOK_SECRET not set - development mode")

        if webhook_secret and sig_header:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
                logger.info("Webhook signature verified successfully")
            except stripe.error.SignatureVerificationError as e:
                logger.error(
                    f"Webhook signature verification failed: {str(e)}",
                    extra={"extra_fields": {"error": str(e)}}
                )
                raise HTTPException(status_code=400, detail="Invalid signature")
        elif not is_production:
            # Development mode only - allow testing without signature
            import json
            event = json.loads(payload)
            logger.warning("⚠️ Webhook processed without signature verification (dev mode only)")
        else:
            logger.error("Missing webhook signature in production")
            raise HTTPException(status_code=400, detail="Missing signature")

        # Handle the event
        event_type = event.get("type")
        event_data = event.get("data", {}).get("object", {})

        logger.info(
            f"Processing Stripe event: {event_type}",
            extra={"extra_fields": {
                "event_type": event_type,
                "event_id": event.get("id")
            }}
        )

        # Handle checkout session completed
        if event_type == "checkout.session.completed":
            session_id = event_data.get("id")
            customer_email = event_data.get("customer_email")
            amount_total = event_data.get("amount_total", 0) / 100  # Convert cents to currency
            metadata = event_data.get("metadata", {})
            plan = metadata.get("plan", "unknown")
            stripe_customer_id = event_data.get("customer")
            stripe_subscription_id = event_data.get("subscription")

            logger.info(
                "Checkout completed successfully",
                extra={"extra_fields": {
                    "session_id": session_id,
                    "customer_email": customer_email,
                    "amount": amount_total,
                    "plan": plan
                }}
            )

            # Save subscription to database
            if db_enabled and customer_email:
                try:
                    db = SessionLocal()
                    subscription = SubscriptionDB(
                        email=customer_email,
                        stripe_customer_id=stripe_customer_id,
                        stripe_subscription_id=stripe_subscription_id,
                        plan=plan,
                        status="active"
                    )
                    db.add(subscription)
                    db.commit()
                    db.close()
                    logger.info(f"Subscription saved to database for {customer_email}")
                except Exception as db_error:
                    logger.error(f"Failed to save subscription: {str(db_error)}")

            # Send confirmation email
            if customer_email:
                try:
                    first_name = customer_email.split("@")[0]
                    email_automation.send_payment_confirmation(
                        to_email=customer_email,
                        first_name=first_name,
                        plan=plan,
                        amount=amount_total,
                        language="ko"
                    )
                    logger.info(f"Payment confirmation email sent to {customer_email}")
                except Exception as email_error:
                    logger.error(f"Failed to send confirmation email: {str(email_error)}")

        # Handle payment intent succeeded
        elif event_type == "payment_intent.succeeded":
            payment_intent_id = event_data.get("id")
            amount = event_data.get("amount", 0) / 100

            logger.info(
                "Payment confirmed",
                extra={"extra_fields": {
                    "payment_intent_id": payment_intent_id,
                    "amount": amount
                }}
            )

        # Handle subscription events
        elif event_type in ["customer.subscription.created", "customer.subscription.updated"]:
            subscription_id = event_data.get("id")
            status = event_data.get("status")

            logger.info(
                f"Subscription {event_type.split('.')[-1]}",
                extra={"extra_fields": {
                    "subscription_id": subscription_id,
                    "status": status
                }}
            )

        # Handle failed payments
        elif event_type == "payment_intent.payment_failed":
            payment_intent_id = event_data.get("id")
            error_message = event_data.get("last_payment_error", {}).get("message", "Unknown error")

            logger.error(
                "Payment failed",
                extra={"extra_fields": {
                    "payment_intent_id": payment_intent_id,
                    "error": error_message
                }}
            )

            # TODO: Send payment failed email to customer

        else:
            logger.debug(f"Unhandled event type: {event_type}")

        return {"status": "success", "event_type": event_type}

    except Exception as e:
        logger.error(
            f"Webhook processing error: {str(e)}",
            extra={"extra_fields": {"error": str(e)}}
        )
        raise HTTPException(status_code=500, detail="Webhook processing failed")

# Welcome email endpoint
@app.post("/api/send-welcome-email")
async def send_welcome_email(request: Request):
    """
    Send welcome email to new users.
    
    Expected payload:
    {
        "email": "user@example.com",
        "company_name": "Company Name",
        "language": "ko"
    }
    """
    try:
        payload = await request.json()
        email = payload.get("email")
        company_name = payload.get("company_name", "")
        language = payload.get("language", "ko")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        logger.info(
            "Sending welcome email",
            extra={"extra_fields": {"email": email, "company": company_name}}
        )
        
        # Import email automation
        from app.email_automation import EmailAutomation
        
        automation = EmailAutomation()
        result = automation.send_welcome_email(
            to_email=email,
            first_name=company_name.split()[0] if company_name else "User",
            company_name=company_name,
            language=language
        )
        
        if result.get("success"):
            logger.info(f"Welcome email sent successfully to {email}")
            return {"success": True, "message": "Welcome email sent"}
        else:
            logger.error(f"Failed to send welcome email: {result.get('error')}")
            return {"success": False, "error": result.get("error")}
            
    except Exception as e:
        logger.error(f"Welcome email error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Weekly reminder endpoint (to be called by a cron job)
@app.post("/api/send-weekly-reminders")
async def send_weekly_reminders(request: Request):
    """
    Send weekly progress reminders to active users.
    Should be called by a cron job or scheduled task.
    """
    try:
        logger.info("Starting weekly reminder batch")
        
        # TODO: Query database for active users who need reminders
        # For now, return success
        
        return {
            "success": True,
            "message": "Weekly reminders sent",
            "count": 0
        }
        
    except Exception as e:
        logger.error(f"Weekly reminder error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
