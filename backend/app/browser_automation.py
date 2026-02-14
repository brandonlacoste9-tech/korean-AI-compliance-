"""
Browser automation for compliance checking using browser-use AI agent.
Tests client websites for Korean AI Act compliance.
"""
import os
import asyncio
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from app.security import verify_api_key
from app.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/v1", tags=["Browser Automation"])


class ComplianceCheckRequest(BaseModel):
    url: str
    check_ai_disclosure: bool = True
    check_contact_info: bool = True
    check_privacy_policy: bool = True
    take_screenshot: bool = True


class ComplianceCheckResult(BaseModel):
    url: str
    timestamp: str
    checks: Dict[str, Any]
    screenshot_path: Optional[str] = None
    agent_actions: List[str] = []
    errors: List[str] = []


# Compliance checks that the AI agent will perform
COMPLIANCE_TASK = """
You are a Korean AI Act compliance auditor. Please check the website for:

1. AI Disclosure: Look for any mentions of AI, artificial intelligence, machine learning, "AI-generated", "AI가 생성", etc. Check headers, footers, and content.

2. Contact Information: Look for email, phone number, or contact form. Check for "문의", "Contact", "이메일", "전화".

3. Privacy Policy: Look for privacy policy link. Check for "privacy", "개인정보", "개인정보 처리방침".

4. Korean Language: Check if the site has Korean language option or Korean content.

Report your findings in JSON format:
{
    "ai_disclosure": {"found": true/false, "details": "what you found"},
    "contact_info": {"found": true/false, "details": "what you found"},
    "privacy_policy": {"found": true/false, "details": "what you found"},
    "korean_content": {"found": true/false, "details": "what you found"}
}
"""


async def run_browser_use_agent(url: str, task: str) -> Dict[str, Any]:
    """Run browser-use agent to check compliance."""
    try:
        from browser_use import Agent
        from langchain_openai import ChatOpenAI
        
        # Initialize the agent with OpenAI
        llm = ChatOpenAI(model="gpt-4o")
        
        agent = Agent(
            task=task,
            llm=llm,
        )
        
        # Run the agent
        result = await agent.run()
        
        return {
            "success": True,
            "result": result,
            "actions": agent.history if hasattr(agent, 'history') else []
        }
        
    except Exception as e:
        logger.error(f"browser-use agent error: {e}")
        return {
            "success": False,
            "error": str(e),
            "actions": []
        }


@router.post("/compliance/check", response_model=ComplianceCheckResult)
async def check_website_compliance(
    request: ComplianceCheckRequest,
    api_key: str = Depends(verify_api_key)
) -> ComplianceCheckResult:
    """
    웹사이트 준수 검사 (Website compliance check).
    
    Uses AI agent (browser-use) to audit website for Korean AI Act compliance:
    - AI disclosure presence
    - Contact information  
    - Privacy policy
    - Korean language support
    """
    try:
        # Build the task for the agent
        task = f"""{COMPLIANCE_TASK}

Please visit {request.url} and check for these compliance requirements.
Take a screenshot if possible.
"""
        
        logger.info(f"Starting browser-use compliance check for: {request.url}")
        
        # Run the agent
        result = await run_browser_use_agent(request.url, task)
        
        if result["success"]:
            return ComplianceCheckResult(
                url=request.url,
                timestamp=datetime.now().isoformat(),
                checks=result.get("result", {}),
                agent_actions=result.get("actions", []),
                errors=[]
            )
        else:
            return ComplianceCheckResult(
                url=request.url,
                timestamp=datetime.now().isoformat(),
                checks={},
                agent_actions=result.get("actions", []),
                errors=[result.get("error", "Unknown error")]
            )
        
    except ImportError as e:
        raise HTTPException(
            status_code=500,
            detail=f"browser-use not installed: {str(e)}. Run: uv add browser-use"
        )
    except Exception as e:
        logger.error(f"Compliance check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compliance/check-simple")
async def check_website_simple(
    url: str,
    api_key: str = Depends(verify_api_key)
) -> Dict[str, Any]:
    """
    Simple compliance check using direct browser access.
    
    Faster than AI agent but less thorough.
    """
    try:
        from playwright.sync_api import sync_playwright
        
        results = {
            "ai_disclosure": {"found": False},
            "contact_info": {"found": False},
            "privacy_policy": {"found": False}
        }
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, timeout=30000)
            
            text = page.content().lower()
            
            # Check AI keywords
            ai_keywords = ["ai", "artificial intelligence", "machine learning", "ai-generated"]
            results["ai_disclosure"]["found"] = any(k in text for k in ai_keywords)
            
            # Check contact
            contact_keywords = ["contact", "email", "phone", "문의", "이메일"]
            results["contact_info"]["found"] = any(k in text for k in contact_keywords)
            
            # Check privacy
            privacy_keywords = ["privacy", "개인정보", "개인정보 처리방침"]
            results["privacy_policy"]["found"] = any(k in text for k in privacy_keywords)
            
            browser.close()
        
        return {
            "url": url,
            "timestamp": datetime.now().isoformat(),
            "results": results
        }
        
    except Exception as e:
        return {
            "url": url,
            "error": str(e),
            "results": None
        }


@router.get("/compliance/templates")
async def get_compliance_templates() -> Dict[str, Any]:
    """
    Get compliance disclosure templates.
    """
    return {
        "ai_disclosure_banner": {
            "html": """<div class="ai-disclosure" style="background:#f5f5f5;padding:10px;text-align:center;">
                이 사이트는 AI를 사용하여 콘텐츠를 생성합니다. / This site uses AI to generate content.
            </div>""",
            "description": "AI disclosure banner"
        },
        "ai_badge": {
            "html": """<span class="ai-badge">🤖 AI-Powered</span>""",
            "description": "AI badge"
        },
        "privacy_link": {
            "html": """<a href="/privacy">개인정보 처리방침 / Privacy Policy</a>""",
            "description": "Privacy policy link"
        }
    }
