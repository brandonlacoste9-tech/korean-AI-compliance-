"""
Audit logging and consent tracking models for PIPC compliance.

These models implement Korean AI Basic Act requirements for:
- Consent logging (user, timestamp, IP, consent type/text, method)
- Data access audit trails
- AI processing history
- Minimum 3-year data retention

All models comply with PIPC (Personal Information Protection Commission) standards.
"""
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class ConsentLog(Base):
    """
    PIPC-compliant consent logging table.
    
    Records user consent for data processing as required by Korean AI Basic Act.
    All fields use formal Korean (존댓말) in descriptions for regulatory compliance.
    """
    __tablename__ = "consent_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # User identification (may be email, user_id, or anonymous identifier)
    user_identifier: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    
    # IP address for audit trail (required by PIPC)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)  # IPv6 compatible
    
    # Consent details
    consent_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    # Examples: "personal_data_processing", "ai_assessment", "marketing", "data_retention"
    
    consent_text: Mapped[str] = mapped_column(Text, nullable=False)
    # Full text of consent shown to user (Korean + English)
    
    consent_method: Mapped[str] = mapped_column(String(50), nullable=False)
    # Examples: "checkbox", "button_click", "api_call", "email_confirmation"
    
    consent_given: Mapped[bool] = mapped_column(Boolean, nullable=False)
    # True if user consented, False if user declined
    
    # Timestamp in UTC (will be converted to KST for MSIT/PIPC reports)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True
    )
    
    # Additional metadata (optional, stores JSON)
    # Using 'extra_metadata' to avoid SQLAlchemy reserved name 'metadata'
    extra_metadata: Mapped[Optional[dict]] = mapped_column("metadata", JSON, nullable=True)
    # Can store: user_agent, locale, session_id, referring_page, etc.
    
    # Retention: Records must be kept for minimum 3 years per PIPC
    # Database policies should enforce automatic deletion after required period
    
    def __repr__(self) -> str:
        return f"<ConsentLog(id={self.id}, user={self.user_identifier}, type={self.consent_type}, timestamp={self.timestamp})>"


class AuditLog(Base):
    """
    Audit trail for data access and AI processing history.
    
    Implements PIPC requirements for tracking:
    - Who accessed data (user/system)
    - What data was accessed
    - When access occurred (KST timezone)
    - Why data was accessed (purpose)
    - Result of access (success/failure)
    """
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Action performed
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    # Examples: "risk_assessment", "data_access", "ai_processing", "export_data"
    
    # Actor (who performed the action)
    actor: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    # User email, user_id, or system identifier
    
    # Target resource
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False)
    # Examples: "user_data", "ai_model", "assessment_report"
    
    resource_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    # ID of the accessed resource (if applicable)
    
    # IP address of requester
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    
    # Purpose of access (required by PIPC)
    purpose: Mapped[str] = mapped_column(String(255), nullable=False)
    # Examples: "compliance_assessment", "user_request", "automated_processing"
    
    # Result of action
    result: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    # Examples: "success", "failure", "partial", "denied"
    
    # Error message (if result was failure)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamp in UTC
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True
    )
    
    # Additional context (JSON)
    # Using 'extra_metadata' to avoid SQLAlchemy reserved name 'metadata'
    extra_metadata: Mapped[Optional[dict]] = mapped_column("metadata", JSON, nullable=True)
    # Can store: request_params, processing_time, ai_model_version, etc.
    
    def __repr__(self) -> str:
        return f"<AuditLog(id={self.id}, action={self.action}, actor={self.actor}, result={self.result}, timestamp={self.timestamp})>"


class AIProcessingLog(Base):
    """
    AI processing history for transparency and explainability requirements.
    
    Tracks AI model decisions for Korean AI Basic Act Article 31-33 compliance.
    """
    __tablename__ = "ai_processing_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # User/session that triggered AI processing
    user_identifier: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    
    # AI model information
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # Example: "risk_assessment_model_v1"
    
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    # Example: "1.0.0", "2024-11-01"
    
    # Input data (hash or summary, not raw PII)
    input_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    # SHA-256 hash of input for audit trail without storing sensitive data
    
    input_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Non-sensitive summary of input
    
    # AI decision/output
    output_decision: Mapped[str] = mapped_column(Text, nullable=False)
    # The AI's decision or output
    
    confidence_score: Mapped[Optional[float]] = mapped_column(nullable=True)
    # Model confidence (0.0 to 1.0)
    
    # Explainability data
    reasoning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Explanation of how AI reached the decision
    
    key_factors: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    # Important features that influenced the decision
    
    # Human oversight
    human_reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    human_override: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # If human changed AI decision, record the override
    
    # Timestamp
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True
    )
    
    # IP address for audit
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    
    # Additional metadata
    # Using 'extra_metadata' to avoid SQLAlchemy reserved name 'metadata'
    extra_metadata: Mapped[Optional[dict]] = mapped_column("metadata", JSON, nullable=True)
    
    def __repr__(self) -> str:
        return f"<AIProcessingLog(id={self.id}, model={self.model_name}, user={self.user_identifier}, timestamp={self.timestamp})>"
