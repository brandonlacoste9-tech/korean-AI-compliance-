import os
import sys
from datetime import datetime
from typing import Any, Dict, Optional

import stripe
from app.logging_config import get_logger, setup_logging
from app.middleware import ErrorHandlingMiddleware, RequestLoggingMiddleware

# Load environment variables
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

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
    description="Korean AI Compliance Risk Assessment API",
    redirect_slashes=False,  # Prevent POST → GET conversion on trailing slash redirects
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
        "endpoints": {"risk_assessment": "/v1/assessments", "health": "/health", "docs": "/docs"},
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
        "build_time": startup_time.isoformat() + "Z",
    }


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
            logger.debug(
                "Facial recognition detected",
                extra={"extra_fields": {"company": request.company_name}},
            )

        if "surveillance" in request.ai_usage.lower():
            risk_score += 30
            logger.debug(
                "Surveillance detected", extra={"extra_fields": {"company": request.company_name}}
            )

        if request.processes_personal_data:
            risk_score += 30
            logger.debug(
                "Personal data processing detected",
                extra={"extra_fields": {"company": request.company_name}},
            )

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
        "professional": {"krw": 390000, "usd": 29900},  # $299 or ₩390,000
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
            success_url=os.getenv("FRONTEND_URL", "http://localhost:3000")
            + "/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/cancel",
            metadata={
                "plan": request.plan,
                "currency": request.currency,
            },
        )

        logger.info(
            "Stripe checkout session created",
            extra={
                "extra_fields": {
                    "plan": request.plan,
                    "amount": amount,
                    "currency": request.currency,
                    "session_id": checkout_session.id,
                }
            },
        )

        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id,
            "success": True,
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
    logger.info(
        "Stripe webhook received", extra={"extra_fields": {"has_signature": bool(sig_header)}}
    )

    try:
        # Verify webhook signature if secret is configured
        if webhook_secret and sig_header:
            try:
                event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
            except stripe.error.SignatureVerificationError as e:
                logger.error(
                    f"Webhook signature verification failed: {str(e)}",
                    extra={"extra_fields": {"error": str(e)}},
                )
                raise HTTPException(status_code=400, detail="Invalid signature")
        else:
            # Development mode - no signature verification
            import json

            event = json.loads(payload)
            logger.warning("Webhook processed without signature verification (dev mode)")

        # Handle the event
        event_type = event.get("type")
        event_data = event.get("data", {}).get("object", {})

        logger.info(
            f"Processing Stripe event: {event_type}",
            extra={"extra_fields": {"event_type": event_type, "event_id": event.get("id")}},
        )

        # Handle checkout session completed
        if event_type == "checkout.session.completed":
            session_id = event_data.get("id")
            customer_email = event_data.get("customer_email")
            amount_total = event_data.get("amount_total", 0) / 100  # Convert cents to currency
            metadata = event_data.get("metadata", {})
            plan = metadata.get("plan", "unknown")

            logger.info(
                "Checkout completed successfully",
                extra={
                    "extra_fields": {
                        "session_id": session_id,
                        "customer_email": customer_email,
                        "amount": amount_total,
                        "plan": plan,
                    }
                },
            )

            # TODO: Save to database
            # - Create/update user account
            # - Activate subscription
            # - Send confirmation email

        # Handle payment intent succeeded
        elif event_type == "payment_intent.succeeded":
            payment_intent_id = event_data.get("id")
            amount = event_data.get("amount", 0) / 100

            logger.info(
                "Payment confirmed",
                extra={"extra_fields": {"payment_intent_id": payment_intent_id, "amount": amount}},
            )

        # Handle subscription events
        elif event_type in ["customer.subscription.created", "customer.subscription.updated"]:
            subscription_id = event_data.get("id")
            status = event_data.get("status")

            logger.info(
                f"Subscription {event_type.split('.')[-1]}",
                extra={"extra_fields": {"subscription_id": subscription_id, "status": status}},
            )

        # Handle failed payments
        elif event_type == "payment_intent.payment_failed":
            payment_intent_id = event_data.get("id")
            error_message = event_data.get("last_payment_error", {}).get("message", "Unknown error")

            logger.error(
                "Payment failed",
                extra={
                    "extra_fields": {"payment_intent_id": payment_intent_id, "error": error_message}
                },
            )

            # TODO: Send payment failed email to customer

        else:
            logger.debug(f"Unhandled event type: {event_type}")

        return {"status": "success", "event_type": event_type}

    except Exception as e:
        logger.error(
            f"Webhook processing error: {str(e)}", extra={"extra_fields": {"error": str(e)}}
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
            extra={"extra_fields": {"email": email, "company": company_name}},
        )

        # Import email automation
        from app.email_automation import EmailAutomation

        automation = EmailAutomation()
        result = automation.send_welcome_email(
            to_email=email,
            first_name=company_name.split()[0] if company_name else "User",
            company_name=company_name,
            language=language,
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

        return {"success": True, "message": "Weekly reminders sent", "count": 0}

    except Exception as e:
        logger.error(f"Weekly reminder error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
