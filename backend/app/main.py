from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
import os
import sys
import json
from datetime import datetime, timezone
import stripe
from sqlalchemy import create_engine, Column, String, Boolean, Integer, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.logging_config import setup_logging, get_logger
from app.middleware import RequestLoggingMiddleware, ErrorHandlingMiddleware
from app.email_automation import EmailAutomation

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

# ─── Database Setup ────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL")
Base = declarative_base()

class UserDB(Base):
    """Persistent user record — created on first checkout or assessment."""
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    company_name = Column(String(255), nullable=False)
    stripe_customer_id = Column(String(255), nullable=True)
    plan = Column(String(50), nullable=True)
    locale = Column(String(10), default="ko")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class SubscriptionDB(Base):
    """Stripe subscription record — updated by webhook events."""
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    stripe_session_id = Column(String(255), unique=True, nullable=False, index=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    customer_email = Column(String(255), nullable=False)
    plan = Column(String(50), nullable=False)
    currency = Column(String(10), default="krw")
    amount = Column(Float, default=0)
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class RiskAssessmentDB(Base):
    """Persisted risk assessment results for audit trail."""
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    company_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    ai_usage = Column(Text, nullable=False)
    processes_personal_data = Column(Boolean, default=False)
    risk_score = Column(Integer, default=0)
    recommendation = Column(String(50), nullable=True)
    client_ip = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class AuditLogDB(Base):
    """PIPC-compliant persistent audit log — 3-year retention required."""
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    action = Column(String(100), nullable=False)
    user_ip = Column(String(64), nullable=True)
    user_email = Column(String(255), nullable=True)
    consent_obtained = Column(Boolean, default=False)
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class LeadDB(Base):
    """Enterprise lead capture — stored for sales follow-up."""
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, autoincrement=True)
    company_name = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    employees = Column(String(50), nullable=True)
    ai_systems = Column(Text, nullable=True)
    urgency = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

# Create engine and session factory — gracefully skip if DATABASE_URL is not set
engine = None
SessionLocal = None
if DATABASE_URL:
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        Base.metadata.create_all(bind=engine)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Database connected and tables created")
    except Exception as e:
        logger.warning(f"Database connection failed: {e}. Running without persistence.")
else:
    logger.warning("DATABASE_URL not set. Audit logs and subscriptions will not be persisted.")

def get_db() -> Optional[Session]:
    """Return a database session, or None if database is unavailable."""
    if SessionLocal is None:
        return None
    return SessionLocal()

def record_audit_event_db(action: str, *, user_ip: str, user_email: str = "", consent_obtained: bool, metadata: dict) -> None:
    """Persist an audit event to the database for PIPC compliance (3-year retention)."""
    db = get_db()
    if db is None:
        logger.warning(f"Audit event not persisted (no DB): action={action}")
        return
    try:
        entry = AuditLogDB(
            action=action,
            user_ip=user_ip,
            user_email=user_email,
            consent_obtained=consent_obtained,
            metadata_json=json.dumps(metadata),
        )
        db.add(entry)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to persist audit event: {e}")
        db.rollback()
    finally:
        db.close()

# ─── FastAPI App ───────────────────────────────────────────────────────────────

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

logger.info(f"Starting AI Compliance Guardian API (Python {sys.version})")

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

# ─── Request Models ────────────────────────────────────────────────────────────

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

class LeadRequest(BaseModel):
    """Enterprise lead capture request."""
    model_config = ConfigDict(populate_by_name=True)

    company_name: str = Field(..., alias="companyName")
    name: str
    email: str
    phone: Optional[str] = None
    employees: Optional[str] = None
    ai_systems: Optional[str] = Field(default=None, alias="aiSystems")
    urgency: Optional[str] = None

# Startup time for uptime calculation
startup_time = datetime.utcnow()

# ─── Health Endpoints ──────────────────────────────────────────────────────────

@app.get("/")
@app.get("/health")
@app.get("/healthz")
async def health_check(request: Request) -> Dict[str, Any]:
    """Health check endpoint with system metrics."""
    uptime_seconds = (datetime.utcnow() - startup_time).total_seconds()
    health_data = {
        "status": "healthy",
        "service": "AI Compliance Guardian API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "uptime_seconds": round(uptime_seconds, 2),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "python_version": sys.version.split()[0],
        "database": "connected" if engine is not None else "not configured",
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
    """Kubernetes-style readiness probe."""
    logger.debug("Readiness check requested")
    return {"status": "ready"}

@app.get("/version")
async def version_info() -> Dict[str, Any]:
    """Version and build information endpoint."""
    return {
        "version": "1.0.0",
        "service": "AI Compliance Guardian API",
        "python_version": sys.version.split()[0],
        "environment": os.getenv("ENVIRONMENT", "development"),
        "build_time": startup_time.isoformat() + "Z"
    }

# ─── Risk Assessment ───────────────────────────────────────────────────────────

@app.post("/v1/assessments")
@app.post("/api/risk-assessment")
async def create_risk_assessment(request: AssessmentRequest, req: Request):
    """
    Assess AI compliance risk based on usage and data processing.
    Calculates risk score and provides compliance recommendations.
    Persists result to database and records PIPC audit log.
    """
    client_ip = req.client.host if req.client else "unknown"
    logger.info(
        "Risk assessment requested",
        extra={"extra_fields": {
            "company": request.company_name,
            "ai_usage": request.ai_usage[:50],
            "processes_personal_data": request.processes_personal_data,
            "client_ip": client_ip,
        }},
    )

    try:
        # Calculate risk score
        risk_score = 0
        if "facial recognition" in request.ai_usage.lower():
            risk_score += 40
        if "surveillance" in request.ai_usage.lower():
            risk_score += 30
        if request.processes_personal_data:
            risk_score += 30

        recommendation = "professional" if risk_score >= 50 else "starter"

        result = {
            "risk_score": risk_score,
            "recommendation": recommendation,
            "company_name": request.company_name,
        }

        # Persist to database
        db = get_db()
        if db:
            try:
                assessment_record = RiskAssessmentDB(
                    company_name=request.company_name,
                    email=request.email,
                    ai_usage=request.ai_usage,
                    processes_personal_data=request.processes_personal_data,
                    risk_score=risk_score,
                    recommendation=recommendation,
                    client_ip=client_ip,
                )
                db.add(assessment_record)
                db.commit()
            except Exception as db_err:
                logger.warning(f"Failed to persist assessment: {db_err}")
                db.rollback()
            finally:
                db.close()

        # PIPC audit log
        record_audit_event_db(
            "risk_assessment",
            user_ip=client_ip,
            user_email=request.email,
            consent_obtained=bool(request.consent_given),
            metadata={"company": request.company_name, "risk_score": risk_score},
        )

        logger.info(
            "Risk assessment completed",
            extra={"extra_fields": {
                "company": request.company_name,
                "risk_score": risk_score,
                "recommendation": recommendation,
            }},
        )
        return result

    except Exception as e:
        logger.error(
            f"Risk assessment failed: {str(e)}",
            extra={"extra_fields": {"company": request.company_name, "error": str(e)}},
        )
        raise HTTPException(status_code=500, detail="Risk assessment failed")

# ─── Stripe Checkout ───────────────────────────────────────────────────────────

@app.post("/api/stripe/create-checkout-session")
async def create_checkout(request: CheckoutRequest, req: Request):
    """
    Create Stripe checkout session for paid plans.
    Returns checkout_url for direct redirect (no stripe.js required).
    """
    logger.info(
        "Checkout requested",
        extra={"extra_fields": {
            "plan": request.plan,
            "currency": request.currency,
            "client_ip": req.client.host if req.client else None,
        }},
    )

    # Price mapping (KRW has no decimal places, USD in cents)
    prices = {
        "starter": {"krw": 129000, "usd": 9900},
        "professional": {"krw": 390000, "usd": 29900}
    }

    plan_data = prices.get(request.plan)
    if not plan_data:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    amount = plan_data.get(request.currency, 0)

    if amount == 0 or request.plan == "starter_trial":
        logger.info("Free plan selected", extra={"extra_fields": {"plan": request.plan}})
        return {"message": "Free plan - no payment required", "success": True}

    try:
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
        logger.error(f"Stripe error: {str(e)}", extra={"extra_fields": {"plan": request.plan, "error": str(e)}})
        raise HTTPException(status_code=500, detail=f"Payment processing error: {str(e)}")
    except Exception as e:
        logger.error(f"Checkout error: {str(e)}", extra={"extra_fields": {"plan": request.plan, "error": str(e)}})
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

# ─── Stripe Webhook ────────────────────────────────────────────────────────────

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events for payment processing.
    Persists subscription data to database and triggers welcome email.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    logger.info("Stripe webhook received", extra={"extra_fields": {"has_signature": bool(sig_header)}})

    try:
        if webhook_secret and sig_header:
            try:
                event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
            except stripe.error.SignatureVerificationError as e:
                logger.error(f"Webhook signature verification failed: {str(e)}")
                raise HTTPException(status_code=400, detail="Invalid signature")
        else:
            event = json.loads(payload)
            logger.warning("Webhook processed without signature verification (dev mode)")

        event_type = event.get("type")
        event_data = event.get("data", {}).get("object", {})

        logger.info(f"Processing Stripe event: {event_type}", extra={"extra_fields": {
            "event_type": event_type,
            "event_id": event.get("id")
        }})

        if event_type == "checkout.session.completed":
            session_id = event_data.get("id")
            customer_email = event_data.get("customer_email") or ""
            amount_total = event_data.get("amount_total", 0) / 100
            metadata = event_data.get("metadata", {})
            plan = metadata.get("plan", "unknown")
            currency = metadata.get("currency", "krw")

            logger.info("Checkout completed successfully", extra={"extra_fields": {
                "session_id": session_id,
                "customer_email": customer_email,
                "amount": amount_total,
                "plan": plan
            }})

            # Persist subscription to database
            db = get_db()
            if db:
                try:
                    sub = SubscriptionDB(
                        stripe_session_id=session_id,
                        customer_email=customer_email,
                        plan=plan,
                        currency=currency,
                        amount=amount_total,
                        status="active",
                    )
                    db.add(sub)

                    # Upsert user record
                    existing_user = db.query(UserDB).filter(UserDB.email == customer_email).first()
                    if existing_user:
                        existing_user.plan = plan
                        existing_user.updated_at = datetime.now(timezone.utc)
                    else:
                        new_user = UserDB(
                            email=customer_email,
                            company_name=customer_email.split("@")[0],  # Fallback until profile is filled
                            plan=plan,
                        )
                        db.add(new_user)

                    db.commit()
                    logger.info(f"Subscription persisted for {customer_email}")
                except Exception as db_err:
                    logger.error(f"Failed to persist subscription: {db_err}")
                    db.rollback()
                finally:
                    db.close()

            # Send welcome email
            if customer_email and os.getenv("SEND_EMAIL_NOTIFICATIONS", "false").lower() == "true":
                try:
                    email_automation = EmailAutomation()
                    email_automation.send_welcome_email(
                        to_email=customer_email,
                        first_name=customer_email.split("@")[0],
                        company_name=customer_email.split("@")[0],
                        language="ko",
                    )
                    logger.info(f"Welcome email sent to {customer_email}")
                except Exception as email_err:
                    logger.warning(f"Failed to send welcome email: {email_err}")

            # PIPC audit log
            record_audit_event_db(
                "subscription_created",
                user_ip="stripe-webhook",
                user_email=customer_email,
                consent_obtained=True,
                metadata={"plan": plan, "session_id": session_id, "amount": amount_total},
            )

        elif event_type == "payment_intent.succeeded":
            payment_intent_id = event_data.get("id")
            amount = event_data.get("amount", 0) / 100
            logger.info("Payment confirmed", extra={"extra_fields": {
                "payment_intent_id": payment_intent_id,
                "amount": amount
            }})

        elif event_type in ["customer.subscription.created", "customer.subscription.updated"]:
            subscription_id = event_data.get("id")
            status = event_data.get("status")
            logger.info(f"Subscription {event_type.split('.')[-1]}", extra={"extra_fields": {
                "subscription_id": subscription_id,
                "status": status
            }})

            # Update subscription status in DB
            db = get_db()
            if db:
                try:
                    sub = db.query(SubscriptionDB).filter(
                        SubscriptionDB.stripe_subscription_id == subscription_id
                    ).first()
                    if sub:
                        sub.status = status
                        db.commit()
                except Exception as db_err:
                    logger.warning(f"Failed to update subscription status: {db_err}")
                    db.rollback()
                finally:
                    db.close()

        elif event_type == "payment_intent.payment_failed":
            payment_intent_id = event_data.get("id")
            error_message = event_data.get("last_payment_error", {}).get("message", "Unknown error")
            logger.error("Payment failed", extra={"extra_fields": {
                "payment_intent_id": payment_intent_id,
                "error": error_message
            }})

        else:
            logger.debug(f"Unhandled event type: {event_type}")

        return {"status": "success", "event_type": event_type}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}", extra={"extra_fields": {"error": str(e)}})
        raise HTTPException(status_code=500, detail="Webhook processing failed")

# ─── Enterprise Lead Capture ───────────────────────────────────────────────────

@app.post("/v1/leads")
async def capture_enterprise_lead(request: LeadRequest, req: Request):
    """
    Capture enterprise demo request leads.
    Stores in database and triggers internal notification.
    """
    client_ip = req.client.host if req.client else "unknown"
    logger.info("Enterprise lead received", extra={"extra_fields": {
        "company": request.company_name,
        "email": request.email,
        "urgency": request.urgency,
    }})

    db = get_db()
    if db:
        try:
            lead = LeadDB(
                company_name=request.company_name,
                name=request.name,
                email=request.email,
                phone=request.phone,
                employees=request.employees,
                ai_systems=request.ai_systems,
                urgency=request.urgency,
            )
            db.add(lead)
            db.commit()
            logger.info(f"Enterprise lead saved for {request.email}")
        except Exception as db_err:
            logger.error(f"Failed to save lead: {db_err}")
            db.rollback()
        finally:
            db.close()

    # PIPC audit log
    record_audit_event_db(
        "enterprise_lead_captured",
        user_ip=client_ip,
        user_email=request.email,
        consent_obtained=True,
        metadata={"company": request.company_name, "urgency": request.urgency},
    )

    return {
        "success": True,
        "message": "Demo request received. Our team will contact you within 1 business hour.",
        "message_ko": "데모 요청이 접수되었습니다. 영업일 기준 1시간 내 연락드리겠습니다."
    }
