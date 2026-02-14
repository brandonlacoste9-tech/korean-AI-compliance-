"""
Korean AI Basic Act Risk Classification Engine
Determines if AI system is High-Impact, Generative, or Low-Risk.
"""
from typing import Dict, Any, List
from enum import Enum
import json


class RiskLevel(str, Enum):
    HIGH_IMPACT = "high_impact"
    GENERATIVE = "generative"
    LOW_RISK = "low_risk"


# High-impact triggers (Korean AI Basic Act)
HIGH_IMPACT_TRIGGERS = [
    # Healthcare
    "medical", "healthcare", "diagnosis", "treatment", "patient",
    # Finance
    "credit", "loan", "financial", "banking", "insurance", "investment",
    # Employment
    "hiring", "recruitment", "employment", "resume", "candidate",
    # Legal
    "legal", "court", "judge", "law", "case",
    # Education
    "education", "grade", "admission", "academic", "student",
    # Safety
    "autonomous", "vehicle", "driving", "safety", "critical",
    # Biometric
    "facial", "biometric", "fingerprint", "iris", "voice identification",
    # Public
    "government", "public", "citizen", "social welfare",
]

# Generative AI triggers
GENERATIVE_TRIGGERS = [
    "chatbot", "chat bot", "conversation", "gpt", "llm", "language model",
    "image generation", "text generation", "content generation", "ai生成",
    "generative", "gpt-", "claude", "gemini", "midjourney", "stable diffusion",
    "text-to-image", "text-to-speech", "speech-to-text", "translation",
    "writing assistant", "code generation", "copilot", "ai writer",
    "content creation", "creative", "art generation", "music generation",
    "video generation", "deepfake", "watermark",
]

# Compliance requirements by risk level
REQUIREMENTS = {
    RiskLevel.HIGH_IMPACT: [
        "User notification (AI disclosure)",
        "Human oversight mechanism",
        "Risk management plan",
        "Fundamental rights impact assessment",
        "Documentation & explainability",
        "Domestic representative (if foreign)",
        "PIPC audit logging",
    ],
    RiskLevel.GENERATIVE: [
        "User notification (AI disclosure)",
        "AI-generated content labeling",
        "Watermarking (recommended)",
        "Training data disclosure (recommended)",
        "User protection measures",
    ],
    RiskLevel.LOW_RISK: [
        "Basic user notification (recommended)",
    ],
}


def classify_ai_system(description: str, api_endpoints: List[str] = None) -> Dict[str, Any]:
    """
    Classify an AI system under Korean AI Basic Act.
    
    Args:
        description: Product description or use case
        api_endpoints: Optional list of API endpoints
    
    Returns:
        Classification result with requirements
    """
    desc_lower = description.lower()
    
    # Check for high-impact triggers first (most restrictive)
    high_impact_score = sum(1 for trigger in HIGH_IMPACT_TRIGGERS if trigger in desc_lower)
    
    # Check for generative AI triggers
    generative_score = sum(1 for trigger in GENERATIVE_TRIGGERS if trigger in desc_lower)
    
    # Determine classification
    if high_impact_score >= 2:
        risk_level = RiskLevel.HIGH_IMPACT
        confidence = min(0.95, 0.6 + (high_impact_score * 0.1))
    elif generative_score >= 1:
        risk_level = RiskLevel.GENERATIVE
        confidence = min(0.90, 0.5 + (generative_score * 0.15))
    else:
        risk_level = RiskLevel.LOW_RISK
        confidence = 0.7
    
    # Get requirements
    requirements = REQUIREMENTS[risk_level]
    
    # Build response
    result = {
        "classification": risk_level.value,
        "confidence": round(confidence, 2),
        "requirements": requirements,
        "triggers_found": {
            "high_impact_indicators": high_impact_score,
            "generative_indicators": generative_score,
        },
        "next_steps": _get_next_steps(risk_level),
        "deadline": "January 22, 2026 (enforced)",
    }
    
    return result


def _get_next_steps(risk_level: RiskLevel) -> List[str]:
    """Get recommended next steps based on classification."""
    
    steps = {
        RiskLevel.HIGH_IMPACT: [
            "1. Conduct Fundamental Rights Impact Assessment",
            "2. Implement human oversight mechanism",
            "3. Create risk management plan",
            "4. Set up PIPC audit logging",
            "5. Appoint domestic representative (if foreign)",
            "6. Notify users of AI usage",
        ],
        RiskLevel.GENERATIVE: [
            "1. Add AI disclosure to user interface",
            "2. Implement content labeling/watermarking",
            "3. Create user protection plan",
            "4. Document training data sources",
            "5. Set up consent capture",
        ],
        RiskLevel.LOW_RISK: [
            "1. Add basic AI disclosure (recommended)",
            "2. Document AI usage for future reference",
        ],
    }
    
    return steps[risk_level]


def generate_notification_template(risk_level: RiskLevel, language: str = "both") -> Dict[str, str]:
    """
    Generate user notification template.
    
    Args:
        risk_level: Classification result
        language: 'korean', 'english', or 'both'
    
    Returns:
        Template text in Korean, English, or both
    """
    
    templates = {
        RiskLevel.HIGH_IMPACT: {
            "korean": """이 서비스는 인공지능(AI) 시스템을 활용합니다.
            
이 결정은 자동화된 프로세스에 의해 지원되며, 필요시 인간 검토를 요청하실 수 있습니다.
문의하기: [연락처]""",
            "english": """This service uses artificial intelligence (AI) systems.

This decision is supported by automated processes. You may request human review.
Contact: [contact]""",
        },
        RiskLevel.GENERATIVE: {
            "korean": """이 콘텐츠는 AI에 의해 생성되었습니다.
            
생성형 AI가 생성한 콘텐츠입니다.
문의하기: [연락처]""",
            "english": """This content was generated by AI.

This content was created by generative AI.
Contact: [contact]""",
        },
        RiskLevel.LOW_RISK: {
            "korean": """이 서비스는 AI 기술을 활용합니다.""",
            "english": """This service uses AI technology.""",
        },
    }
    
    template = templates[risk_level]
    
    if language == "korean":
        return {"text": template["korean"]}
    elif language == "english":
        return {"text": template["english"]}
    else:
        return {
            "korean": template["korean"],
            "english": template["english"],
        }


# Example usage
if __name__ == "__main__":
    # Test examples
    examples = [
        "AI chatbot for customer service that answers questions",
        "Medical diagnosis system that helps doctors identify diseases",
        "Image generator that creates art from text descriptions",
        "Recommendation system for e-commerce products",
        "Automated hiring tool that screens resumes",
    ]
    
    print("=" * 60)
    print("Korean AI Basic Act - Risk Classification Demo")
    print("=" * 60)
    
    for desc in examples:
        result = classify_ai_system(desc)
        print(f"\n📝 Input: {desc}")
        print(f"📊 Classification: {result['classification']}")
        print(f"   Confidence: {result['confidence']}")
        print(f"   Requirements: {len(result['requirements'])} items")
