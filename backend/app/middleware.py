"""Middleware for logging, monitoring, and error handling."""

import time
import traceback
from typing import Callable

from app.logging_config import get_logger
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = get_logger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all incoming requests and outgoing responses."""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Log request and response details."""
        # Generate request ID
        request_id = f"{int(time.time() * 1000)}"

        # Log incoming request
        logger.info(
            "Incoming request",
            extra={
                "extra_fields": {
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "query_params": str(request.query_params),
                    "client_host": request.client.host if request.client else None,
                    "user_agent": request.headers.get("user-agent"),
                }
            },
        )

        # Process request and measure duration
        start_time = time.time()
        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000

            # Log response
            logger.info(
                "Request completed",
                extra={
                    "extra_fields": {
                        "request_id": request_id,
                        "method": request.method,
                        "path": request.url.path,
                        "status_code": response.status_code,
                        "duration_ms": round(duration_ms, 2),
                    }
                },
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            return response

        except Exception as exc:
            duration_ms = (time.time() - start_time) * 1000

            logger.error(
                f"Request failed: {str(exc)}",
                extra={
                    "extra_fields": {
                        "request_id": request_id,
                        "method": request.method,
                        "path": request.url.path,
                        "duration_ms": round(duration_ms, 2),
                        "error": str(exc),
                        "traceback": traceback.format_exc(),
                    }
                },
            )
            raise


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware to catch and log unhandled exceptions."""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Handle errors gracefully."""
        try:
            return await call_next(request)
        except Exception as exc:
            logger.exception(
                f"Unhandled exception: {str(exc)}",
                extra={
                    "extra_fields": {
                        "method": request.method,
                        "path": request.url.path,
                        "client_host": request.client.host if request.client else None,
                        "error_type": type(exc).__name__,
                    }
                },
            )

            # Return error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "message": "An unexpected error occurred. Please try again later.",
                    "type": type(exc).__name__,
                },
            )
