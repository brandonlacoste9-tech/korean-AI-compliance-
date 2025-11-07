from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, create_engine, Session, select
from dotenv import load_dotenv
import os
from datetime import datetime
from api.email_campaign import router as email_router

load_dotenv()

app = FastAPI(title="AI Compliance Guardian SaaS", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include email campaign router
app.include_router(email_router, prefix="/v1/email", tags=["Email Campaigns"])

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./compliance.db")
engine = create_engine(DATABASE_URL, echo=True)

class Regulation(BaseModel):
    source: str
    text: str
    last_update: str = datetime.now().isoformat()
    changes: list = []

class System(BaseModel):
    name: str
    industry: str = "manufacturing"
    use_case: str
    risk_score: int = 0

class RiskAssessment(BaseModel):
    system_id: int
    score: int
    gaps: list
    action_items: list

class ComplianceSystem(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    industry: str
    use_case: str
    risk_score: int = 0
    created_at: datetime = Field(default_factory=datetime.now)

SQLModel.metadata.create_all(engine)

@app.get("/healthz")
def health():
    return {"status": "healthy"}

@app.post("/v1/systems", response_model=System)
def create_system(system: System):
    return System(**system.dict(), risk_score=0)  # Add to DB in production

@app.post("/v1/systems/{system_id}/score", response_model=RiskAssessment)
def score_system(system_id: int, assessment: dict):
    # Risk scoring based on AI Basic Act (high-impact triggers)
    high_risk_factors = sum(1 for k, v in assessment.items() if v.get('high_risk'))
    score = min(100, high_risk_factors * 25)
    gaps = ["Article 32: Risk management missing"] if score > 50 else []
    action_items = ["Implement oversight", "Update docs"] if gaps else ["Annual review"]
    return RiskAssessment(system_id=system_id, score=score, gaps=gaps, action_items=action_items)

@app.get("/v1/regulations/latest", response_model=list[Regulation])
def get_latest_regulations():
    # Mock for MSIT/PIPC/law.go.kr - add real scrapers later
    return [
        Regulation(source="MSIT", text="AI Basic Act decree finalized Jan 22, 2026", changes=["New high-impact thresholds"]),
        Regulation(source="PIPC", text="Generative AI privacy guidelines", changes=["Proportionality checks required"])
    ]

@app.post("/v1/evidence/snapshot")
def snapshot_evidence(evidence: dict):
    evidence['timestamp'] = datetime.now().isoformat()
    return {"id": len(evidence), "status": "stored"}  # Store in Supabase

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)