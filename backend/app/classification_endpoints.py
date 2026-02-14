"""
Classification API endpoints for Korean AI Basic Act compliance.
"""
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.classification import classify_ai_system, generate_notification_template, RiskLevel
from app.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/v1/classification", tags=["Classification"])


class ClassificationRequest(BaseModel):
    description: str
    api_endpoints: Optional[List[str]] = None


class ClassificationResponse(BaseModel):
    classification: str
    confidence: float
    requirements: List[str]
    triggers_found: dict
    next_steps: List[str]
    deadline: str


class TemplateRequest(BaseModel):
    classification: str
    language: str = "both"  # "korean", "english", or "both"


@router.post("/classify", response_model=ClassificationResponse)
async def classify(request: ClassificationRequest):
    """
    Classify AI system under Korean AI Basic Act.
    
    Input product description or use case, get:
    - Risk classification (High-Impact / Generative / Low-Risk)
    - Confidence score
    - Required compliance items
    - Next steps
    """
    try:
        result = classify_ai_system(
            description=request.description,
            api_endpoints=request.api_endpoints
        )
        
        logger.info(
            f"Classification completed: {result['classification']}",
            extra={"extra_fields": {"classification": result['classification']}}
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/{classification}")
async def get_template(classification: str, language: str = "both"):
    """
    Get notification template for classification.
    
    Returns Korean/English notification template for user disclosure.
    """
    try:
        # Validate classification
        valid_classifications = ["high_impact", "generative", "low_risk"]
        if classification not in valid_classifications:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid classification. Use: {valid_classifications}"
            )
        
        # Map string to enum
        risk_level = RiskLevel(classification)
        
        template = generate_notification_template(risk_level, language)
        
        return {
            "classification": classification,
            "template": template
        }
        
    except Exception as e:
        logger.error(f"Template error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/requirements/{classification}")
async def get_requirements(classification: str):
    """
    Get compliance requirements for classification.
    """
    valid = {
        "high_impact": [
            "User notification (AI disclosure)",
            "Human oversight mechanism",
            "Risk management plan",
            "Fundamental rights impact assessment",
            "Documentation & explainability",
            "Domestic representative (if foreign)",
            "PIPC audit logging",
        ],
        "generative": [
            "User notification (AI disclosure)",
            "AI-generated content labeling",
            "Watermarking (recommended)",
            "Training data disclosure (recommended)",
            "User protection measures",
        ],
        "low_risk": [
            "Basic user notification (recommended)",
        ],
    }
    
    if classification not in valid:
        raise HTTPException(status_code=400, detail="Invalid classification")
    
    return {
        "classification": classification,
        "requirements": valid[classification]
    }
