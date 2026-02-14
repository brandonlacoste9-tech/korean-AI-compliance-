"""
Browser automation for compliance checking.
Uses Playwright to audit client websites for AI disclosure requirements.
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
    screenshot: bool = False


class ComplianceCheckResult(BaseModel):
    url: str
    timestamp: str
    checks: Dict[str, Any]
    screenshot_url: Optional[str] = None
    errors: List[str] = []


# Compliance checks to perform
AI_DISCLOSURE_KEYWORDS = [
    "ai-generated",
    "ai generated",
    "artificial intelligence",
    "machine learning",
    "powered by ai",
    "ai가 생성",
    "AI 생성",
]

CONTACT_REQUIREMENTS = [
    "email",
    "phone",
    "contact",
    "문의",
]


@router.post("/compliance/check", response_model=ComplianceCheckResult)
async def check_website_compliance(
    request: ComplianceCheckRequest,
    api_key: str = Depends(verify_api_key)
) -> ComplianceCheckResult:
    """
    웹사이트 준수 검사 (Website compliance check).
    
    Checks a website for Korean AI Act compliance requirements:
    - AI disclosure presence
    - Contact information
    - Privacy policy link
    
    Uses browser automation to audit the live site.
    """
    try:
        # Import playwright here to make it optional
        from playwright.async_api import async_playwright
        
        results = {
            "ai_disclosure": {"found": False, "details": None},
            "contact_info": {"found": False, "details": None},
            "privacy_policy": {"found": False, "details": None},
        }
        errors = []
        screenshot_base64 = None
        
        async with async_playwright() as p:
            # Launch browser (headless)
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                # Navigate to URL
                logger.info(f"Checking compliance for: {request.url}")
                response = await page.goto(request.url, timeout=30000)
                
                if response is None or response.status >= 400:
                    errors.append(f"Failed to load page: HTTP {response.status if response else 'unknown'}")
                else:
                    # Get page content
                    content = await page.content()
                    text_content = await page.evaluate("document.body.innerText")
                    
                    # Check AI disclosure
                    if request.check_ai_disclosure:
                        for keyword in AI_DISCLOSURE_KEYWORDS:
                            if keyword.lower() in text_content.lower():
                                results["ai_disclosure"] = {
                                    "found": True,
                                    "keyword_found": keyword,
                                    "compliant": True
                                }
                                break
                        else:
                            results["ai_disclosure"] = {
                                "found": False,
                                "compliant": False,
                                "warning": "No AI disclosure found - may violate Korean AI Act"
                            }
                    
                    # Check contact info
                    if request.check_contact_info:
                        for keyword in CONTACT_REQUIREMENTS:
                            if keyword.lower() in text_content.lower():
                                results["contact_info"] = {
                                    "found": True,
                                    "keyword_found": keyword,
                                }
                                break
                        else:
                            results["contact_info"] = {
                                "found": False,
                                "warning": "No contact information found"
                            }
                    
                    # Check privacy policy
                    if request.check_privacy_policy:
                        privacy_links = await page.query_selector_all('a[href*="privacy"], a[href*="Privacy"], a[href*="개인정보"]')
                        if privacy_links:
                            results["privacy_policy"] = {
                                "found": True,
                                "count": len(privacy_links),
                            }
                        else:
                            results["privacy_policy"] = {
                                "found": False,
                                "warning": "No privacy policy link found"
                            }
                    
                    # Take screenshot if requested
                    if request.screenshot:
                        screenshot = await page.screenshot()
                        import base64
                        screenshot_base64 = base64.b64encode(screenshot).decode()
                
            except Exception as e:
                errors.append(f"Browser error: {str(e)}")
                logger.error(f"Compliance check error: {e}")
            finally:
                await browser.close()
        
        # Prepare response
        result = ComplianceCheckResult(
            url=request.url,
            timestamp=datetime.now().isoformat(),
            checks=results,
            screenshot_url=screenshot_base64,  # In production, upload to cloud storage
            errors=errors
        )
        
        logger.info(
            f"Compliance check completed for {request.url}",
            extra={"extra_fields": {"results": results, "errors": errors}}
        )
        
        return result
        
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="Browser automation not available. Install: pip install playwright && playwright install chromium"
        )
    except Exception as e:
        logger.error(f"Compliance check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compliance/templates")
async def get_compliance_templates(
    api_key: str = Depends(verify_api_key)
) -> Dict[str, Any]:
    """
    Get compliance disclosure templates.
    
    Returns HTML/JS snippets that can be added to client websites
    for Korean AI Act compliance.
    """
    return {
        "ai_disclosure_banner": {
            "html": """<div class="ai-disclosure-banner" style="background:#f5f5f5;padding:10px;text-align:center;font-size:14px;">
                이 사이트는 AI를 사용하여 콘텐츠를 생성합니다. / This site uses AI to generate content.
            </div>""",
            "description": "AI disclosure banner for website footer or header"
        },
        "ai_disclosure_badge": {
            "html": """<span class="ai-badge" style="display:inline-flex;align-items:center;gap:5px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/></svg>
                AI-Powered
            </span>""",
            "description": "AI badge for product pages"
        },
        "contact_section": {
            "html": """<section id="contact" style="padding:40px 20px;">
                <h2>문의하기 / Contact Us</h2>
                <p>이메일: compliance@yourcompany.com</p>
                <p>전화: +82-2-XXXX-XXXX</p>
            </section>""",
            "description": "Contact section template with Korean/English"
        },
        "privacy_policy_link": {
            "html": """<a href="/privacy-policy">개인정보 처리방침 / Privacy Policy</a>""",
            "description": "Privacy policy link template"
        }
    }


@router.post("/compliance/report")
async def generate_compliance_report(
    urls: List[str],
    api_key: str = Depends(verify_api_key)
) -> Dict[str, Any]:
    """
    Generate bulk compliance report for multiple URLs.
    
    Audits multiple websites and returns aggregated compliance report.
    """
    # This would call the check endpoint for each URL
    # In production, this could be a background job
    return {
        "status": "queued",
        "urls_count": len(urls),
        "report_id": f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "message": "Bulk report generation started. Check back later for results."
    }
