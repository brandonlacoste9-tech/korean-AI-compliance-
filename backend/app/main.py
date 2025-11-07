from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

# Initialize FastAPI app
app = FastAPI(title="AI Compliance Guardian API")

# CORS - allow your Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://korean-ai-compliance.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class AssessmentRequest(BaseModel):
    company_name: str
    email: str
    ai_usage: str
    processes_personal_data: bool

class CheckoutRequest(BaseModel):
    plan: str
    currency: str = "krw"

# Health check endpoint
@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Compliance Guardian API"}

# Risk assessment endpoint
@app.post("/api/risk-assessment")
async def create_risk_assessment(request: AssessmentRequest):
    # Calculate risk score
    risk_score = 0
    
    if "facial recognition" in request.ai_usage.lower():
        risk_score += 40
    if "surveillance" in request.ai_usage.lower():
        risk_score += 30
    if request.processes_personal_data:
        risk_score += 30
    
    return {
        "risk_score": risk_score,
        "recommendation": "professional" if risk_score >= 50 else "starter",
        "company_name": request.company_name
    }

# Stripe checkout endpoint (simplified for now)
@app.post("/api/stripe/create-checkout")
async def create_checkout(request: CheckoutRequest):
    prices = {
        "starter": {"krw": 0},
        "professional": {"krw": 39000000}
    }
    
    amount = prices[request.plan][request.currency]
    
    if amount == 0:
        return {"message": "Free plan - no payment required"}
    
    return {"message": "Checkout endpoint - Stripe integration coming soon"}
