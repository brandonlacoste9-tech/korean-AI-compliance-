"""
Pydantic schemas for audit logging and consent tracking APIs.

These schemas validate request/response data for PIPC compliance endpoints.
"""
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict, field_validator
import re


class ConsentLogCreate(BaseModel):
    """Request schema for creating a consent log entry."""
    
    model_config = ConfigDict(populate_by_name=True)
    
    user_identifier: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="사용자 식별자 (User identifier: email, user_id, or anonymous ID)",
        alias="userIdentifier"
    )
    ip_address: str = Field(
        ...,
        description="IP 주소 (IP address for audit trail)",
        alias="ipAddress"
    )
    consent_type: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="동의 유형 (Consent type: e.g., personal_data_processing, ai_assessment)",
        alias="consentType"
    )
    consent_text: str = Field(
        ...,
        min_length=10,
        description="동의 텍스트 (Full consent text shown to user)",
        alias="consentText"
    )
    consent_method: str = Field(
        ...,
        description="동의 방법 (Consent method: checkbox, button_click, etc.)",
        alias="consentMethod"
    )
    consent_given: bool = Field(
        ...,
        description="동의 여부 (Whether consent was given)",
        alias="consentGiven"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="추가 메타데이터 (Additional metadata: user_agent, locale, etc.)"
    )
    
    @field_validator("ip_address")
    @classmethod
    def validate_ip_address(cls, v: str) -> str:
        """Validate IP address format (IPv4 or IPv6)."""
        # Simple validation - could be enhanced with ipaddress module
        if not v or len(v) < 7:
            raise ValueError("유효하지 않은 IP 주소입니다 (Invalid IP address)")
        return v


class ConsentLogResponse(BaseModel):
    """Response schema for consent log entries."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_identifier: str
    ip_address: str
    consent_type: str
    consent_text: str
    consent_method: str
    consent_given: bool
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None


class AuditLogCreate(BaseModel):
    """Request schema for creating an audit log entry."""
    
    model_config = ConfigDict(populate_by_name=True)
    
    action: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="작업 유형 (Action performed)",
        alias="action"
    )
    actor: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="작업자 (Actor who performed the action)",
        alias="actor"
    )
    resource_type: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="리소스 유형 (Resource type)",
        alias="resourceType"
    )
    resource_id: Optional[str] = Field(
        default=None,
        max_length=255,
        description="리소스 ID (Resource ID if applicable)",
        alias="resourceId"
    )
    ip_address: str = Field(
        ...,
        description="IP 주소 (IP address)",
        alias="ipAddress"
    )
    purpose: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="목적 (Purpose of access)",
        alias="purpose"
    )
    result: str = Field(
        ...,
        description="결과 (Result: success, failure, etc.)",
        alias="result"
    )
    error_message: Optional[str] = Field(
        default=None,
        description="오류 메시지 (Error message if failed)",
        alias="errorMessage"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="추가 메타데이터 (Additional metadata)"
    )


class AuditLogResponse(BaseModel):
    """Response schema for audit log entries."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    action: str
    actor: str
    resource_type: str
    resource_id: Optional[str]
    ip_address: str
    purpose: str
    result: str
    error_message: Optional[str]
    timestamp: datetime
    metadata: Optional[Dict[str, Any]]


class AIProcessingLogCreate(BaseModel):
    """Request schema for creating AI processing log entry."""
    
    model_config = ConfigDict(populate_by_name=True)
    
    user_identifier: str = Field(..., alias="userIdentifier")
    model_name: str = Field(..., alias="modelName")
    model_version: str = Field(..., alias="modelVersion")
    input_summary: Optional[str] = Field(default=None, alias="inputSummary")
    output_decision: str = Field(..., alias="outputDecision")
    confidence_score: Optional[float] = Field(default=None, ge=0.0, le=1.0, alias="confidenceScore")
    reasoning: Optional[str] = None
    key_factors: Optional[Dict[str, Any]] = Field(default=None, alias="keyFactors")
    ip_address: str = Field(..., alias="ipAddress")
    metadata: Optional[Dict[str, Any]] = None


class AIProcessingLogResponse(BaseModel):
    """Response schema for AI processing log entries."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_identifier: str
    model_name: str
    model_version: str
    input_summary: Optional[str]
    output_decision: str
    confidence_score: Optional[float]
    reasoning: Optional[str]
    key_factors: Optional[Dict[str, Any]]
    human_reviewed: bool
    human_override: Optional[str]
    timestamp: datetime
    ip_address: str
    metadata: Optional[Dict[str, Any]]


class AuditLogFilter(BaseModel):
    """Query parameters for filtering audit logs."""
    
    action: Optional[str] = None
    actor: Optional[str] = None
    resource_type: Optional[str] = None
    result: Optional[str] = None
    start_date: Optional[datetime] = Field(default=None, alias="startDate")
    end_date: Optional[datetime] = Field(default=None, alias="endDate")
    limit: int = Field(default=100, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)


class ConsentLogFilter(BaseModel):
    """Query parameters for filtering consent logs."""
    
    user_identifier: Optional[str] = Field(default=None, alias="userIdentifier")
    consent_type: Optional[str] = Field(default=None, alias="consentType")
    consent_given: Optional[bool] = Field(default=None, alias="consentGiven")
    start_date: Optional[datetime] = Field(default=None, alias="startDate")
    end_date: Optional[datetime] = Field(default=None, alias="endDate")
    limit: int = Field(default=100, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)


class ExportResponse(BaseModel):
    """Response for export operations."""
    
    success: bool
    message: str
    record_count: int = Field(..., alias="recordCount")
    export_format: str = Field(..., alias="exportFormat")
    download_url: Optional[str] = Field(default=None, alias="downloadUrl")
