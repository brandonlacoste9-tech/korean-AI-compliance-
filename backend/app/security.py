"""
Security middleware for API key authentication.
"""
import os
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from app.logging_config import get_logger

logger = get_logger(__name__)

# API key from environment - should be set in production
API_KEY = os.getenv("INTERNAL_API_KEY", "dev-key-change-in-production")
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(api_key: str = Security(API_KEY_HEADER)) -> str:
    """
    Verify the API key for protected endpoints.
    
    Use @router.get(..., dependencies=[Depends(verify_api_key)]) to protect endpoints.
    """
    if not api_key:
        logger.warning("API key missing from request")
        raise HTTPException(status_code=401, detail="API key required")
    
    if api_key != API_KEY:
        logger.warning(f"Invalid API key attempt: {api_key[:8]}...")
        raise HTTPException(status_code=403, detail="Invalid API key")
    
    return api_key


# Public endpoints that don't require auth
PUBLIC_ENDPOINTS = [
    "/api/v1/consent",  # Consent can be created without auth (logged separately)
    "/health",
    "/",
]

# Admin-only endpoints
ADMIN_ENDPOINTS = [
    "/api/v1/audit-logs",      # Read audit logs
    "/api/v1/audit-logs/export",  # Export CSV
    "/api/v1/consent",         # Read consent logs
    "/api/v1/ai-processing-logs",  # Read AI logs
]
