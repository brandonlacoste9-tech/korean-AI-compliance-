"""
PIPC-compliant audit logging and consent tracking endpoints.

These endpoints implement Korean AI Basic Act requirements for:
- Consent log capture and retrieval
- Audit trail management
- CSV export for MSIT/PIPC inspections
- Data retention and Seoul residency compliance
"""
from typing import List, Optional
from datetime import datetime, timezone
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.database import get_db
from app.audit_models import ConsentLog, AuditLog, AIProcessingLog
from app.audit_schemas import (
    ConsentLogCreate, ConsentLogResponse,
    AuditLogCreate, AuditLogResponse,
    AIProcessingLogCreate, AIProcessingLogResponse,
    AuditLogFilter, ConsentLogFilter,
    ExportResponse
)
from app.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/v1", tags=["PIPC Compliance"])


@router.post("/consent", response_model=ConsentLogResponse, status_code=201)
async def create_consent_log(
    consent: ConsentLogCreate,
    request: Request,
    db: Session = Depends(get_db)
) -> ConsentLog:
    """
    동의 기록 생성 (Create consent log entry).
    
    Records user consent for PIPC compliance. All consent events must be logged
    with user identifier, timestamp, IP address, consent type/text, and method.
    
    **Required for:** Korean AI Basic Act Article 31-33, PIPC regulations.
    
    **Data Retention:** Records retained for minimum 3 years.
    """
    try:
        # Get IP from request if not provided or validate
        request_ip = request.client.host if request.client else "unknown"
        
        # Create consent log entry
        consent_log = ConsentLog(
            user_identifier=consent.user_identifier,
            ip_address=consent.ip_address or request_ip,
            consent_type=consent.consent_type,
            consent_text=consent.consent_text,
            consent_method=consent.consent_method,
            consent_given=consent.consent_given,
            extra_metadata=consent.metadata,
            timestamp=datetime.now(timezone.utc)
        )
        
        db.add(consent_log)
        db.commit()
        db.refresh(consent_log)
        
        logger.info(
            "동의 기록 생성됨 (Consent log created)",
            extra={
                "extra_fields": {
                    "consent_id": consent_log.id,
                    "user": consent.user_identifier,
                    "type": consent.consent_type,
                    "given": consent.consent_given,
                    "ip": consent_log.ip_address
                }
            }
        )
        
        return consent_log
        
    except Exception as e:
        logger.error(f"동의 기록 생성 실패 (Consent log creation failed): {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="동의 기록 생성에 실패했습니다 (Failed to create consent log)"
        )


@router.get("/consent", response_model=List[ConsentLogResponse])
async def get_consent_logs(
    user_identifier: Optional[str] = None,
    consent_type: Optional[str] = None,
    consent_given: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
) -> List[ConsentLog]:
    """
    동의 기록 조회 (Retrieve consent logs).
    
    Query consent logs with filtering options for PIPC audits.
    
    **Access Control:** Should be restricted to authorized personnel only.
    """
    try:
        query = db.query(ConsentLog)
        
        # Apply filters
        filters = []
        if user_identifier:
            filters.append(ConsentLog.user_identifier == user_identifier)
        if consent_type:
            filters.append(ConsentLog.consent_type == consent_type)
        if consent_given is not None:
            filters.append(ConsentLog.consent_given == consent_given)
        if start_date:
            filters.append(ConsentLog.timestamp >= start_date)
        if end_date:
            filters.append(ConsentLog.timestamp <= end_date)
        
        if filters:
            query = query.filter(and_(*filters))
        
        # Order by timestamp descending (most recent first)
        query = query.order_by(ConsentLog.timestamp.desc())
        
        # Apply pagination
        logs = query.limit(limit).offset(offset).all()
        
        logger.info(
            f"동의 기록 조회됨 (Consent logs retrieved): {len(logs)} records",
            extra={"extra_fields": {"count": len(logs), "filters": str(filters)}}
        )
        
        return logs
        
    except Exception as e:
        logger.error(f"동의 기록 조회 실패 (Consent log retrieval failed): {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="동의 기록 조회에 실패했습니다 (Failed to retrieve consent logs)"
        )


@router.post("/audit-logs", response_model=AuditLogResponse, status_code=201)
async def create_audit_log(
    audit: AuditLogCreate,
    request: Request,
    db: Session = Depends(get_db)
) -> AuditLog:
    """
    감사 로그 생성 (Create audit log entry).
    
    Records data access and processing events for PIPC compliance.
    
    **Required for:** Korean AI Basic Act transparency and audit requirements.
    """
    try:
        request_ip = request.client.host if request.client else "unknown"
        
        audit_log = AuditLog(
            action=audit.action,
            actor=audit.actor,
            resource_type=audit.resource_type,
            resource_id=audit.resource_id,
            ip_address=audit.ip_address or request_ip,
            purpose=audit.purpose,
            result=audit.result,
            error_message=audit.error_message,
            extra_metadata=audit.metadata,
            timestamp=datetime.now(timezone.utc)
        )
        
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        
        logger.info(
            "감사 로그 생성됨 (Audit log created)",
            extra={
                "extra_fields": {
                    "audit_id": audit_log.id,
                    "action": audit.action,
                    "actor": audit.actor,
                    "result": audit.result
                }
            }
        )
        
        return audit_log
        
    except Exception as e:
        logger.error(f"감사 로그 생성 실패 (Audit log creation failed): {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="감사 로그 생성에 실패했습니다 (Failed to create audit log)"
        )


@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    action: Optional[str] = None,
    actor: Optional[str] = None,
    resource_type: Optional[str] = None,
    result: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
) -> List[AuditLog]:
    """
    감사 로그 조회 (Retrieve audit logs).
    
    Query audit trail for compliance reporting and PIPC inspections.
    
    **Access Control:** Restricted to authorized compliance personnel.
    """
    try:
        query = db.query(AuditLog)
        
        # Apply filters
        filters = []
        if action:
            filters.append(AuditLog.action == action)
        if actor:
            filters.append(AuditLog.actor == actor)
        if resource_type:
            filters.append(AuditLog.resource_type == resource_type)
        if result:
            filters.append(AuditLog.result == result)
        if start_date:
            filters.append(AuditLog.timestamp >= start_date)
        if end_date:
            filters.append(AuditLog.timestamp <= end_date)
        
        if filters:
            query = query.filter(and_(*filters))
        
        query = query.order_by(AuditLog.timestamp.desc())
        logs = query.limit(limit).offset(offset).all()
        
        logger.info(
            f"감사 로그 조회됨 (Audit logs retrieved): {len(logs)} records",
            extra={"extra_fields": {"count": len(logs)}}
        )
        
        return logs
        
    except Exception as e:
        logger.error(f"감사 로그 조회 실패 (Audit log retrieval failed): {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="감사 로그 조회에 실패했습니다 (Failed to retrieve audit logs)"
        )


@router.post("/ai-processing-logs", response_model=AIProcessingLogResponse, status_code=201)
async def create_ai_processing_log(
    log: AIProcessingLogCreate,
    request: Request,
    db: Session = Depends(get_db)
) -> AIProcessingLog:
    """
    AI 처리 기록 생성 (Create AI processing log entry).
    
    Records AI model decisions for transparency and explainability requirements.
    
    **Required for:** Korean AI Basic Act Articles 31-33 (transparency, explainability).
    """
    try:
        request_ip = request.client.host if request.client else "unknown"
        
        processing_log = AIProcessingLog(
            user_identifier=log.user_identifier,
            model_name=log.model_name,
            model_version=log.model_version,
            input_summary=log.input_summary,
            output_decision=log.output_decision,
            confidence_score=log.confidence_score,
            reasoning=log.reasoning,
            key_factors=log.key_factors,
            ip_address=log.ip_address or request_ip,
            extra_metadata=log.metadata,
            timestamp=datetime.now(timezone.utc)
        )
        
        db.add(processing_log)
        db.commit()
        db.refresh(processing_log)
        
        logger.info(
            "AI 처리 기록 생성됨 (AI processing log created)",
            extra={
                "extra_fields": {
                    "log_id": processing_log.id,
                    "model": log.model_name,
                    "user": log.user_identifier
                }
            }
        )
        
        return processing_log
        
    except Exception as e:
        logger.error(f"AI 처리 기록 생성 실패 (AI processing log creation failed): {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="AI 처리 기록 생성에 실패했습니다 (Failed to create AI processing log)"
        )


@router.get("/audit-logs/export")
async def export_audit_logs_csv(
    log_type: str = "audit",  # "audit", "consent", or "ai_processing"
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
) -> Response:
    """
    감사 로그 CSV 내보내기 (Export audit logs to CSV).
    
    Exports audit logs in CSV format for MSIT/PIPC inspection readiness.
    
    **Formats:**
    - `log_type=audit`: Data access and processing audit trail
    - `log_type=consent`: User consent records
    - `log_type=ai_processing`: AI model decision history
    
    **Use Case:** Submit to MSIT/PIPC during compliance audits.
    """
    try:
        # Create CSV in memory
        output = io.StringIO()
        
        if log_type == "consent":
            query = db.query(ConsentLog)
            if start_date:
                query = query.filter(ConsentLog.timestamp >= start_date)
            if end_date:
                query = query.filter(ConsentLog.timestamp <= end_date)
            
            logs = query.order_by(ConsentLog.timestamp.desc()).all()
            
            writer = csv.writer(output)
            writer.writerow([
                "ID", "사용자 식별자 (User ID)", "IP 주소 (IP Address)",
                "동의 유형 (Consent Type)", "동의 방법 (Method)",
                "동의 여부 (Given)", "타임스탬프 (Timestamp KST)"
            ])
            
            for log in logs:
                # Convert UTC to KST (+9 hours) for PIPC compliance
                from datetime import timedelta
                kst_tz = timezone(timedelta(hours=9))
                kst_time = log.timestamp.replace(tzinfo=timezone.utc).astimezone(kst_tz).strftime("%Y-%m-%d %H:%M:%S KST")
                
                writer.writerow([
                    log.id,
                    log.user_identifier,
                    log.ip_address,
                    log.consent_type,
                    log.consent_method,
                    "동의함 (Yes)" if log.consent_given else "거부함 (No)",
                    kst_time
                ])
        
        elif log_type == "ai_processing":
            query = db.query(AIProcessingLog)
            if start_date:
                query = query.filter(AIProcessingLog.timestamp >= start_date)
            if end_date:
                query = query.filter(AIProcessingLog.timestamp <= end_date)
            
            logs = query.order_by(AIProcessingLog.timestamp.desc()).all()
            
            writer = csv.writer(output)
            writer.writerow([
                "ID", "사용자 (User)", "모델명 (Model)", "모델 버전 (Version)",
                "결과 (Decision)", "신뢰도 (Confidence)", "인간 검토 (Human Reviewed)",
                "타임스탬프 (Timestamp KST)"
            ])
            
            from datetime import timedelta
            kst_tz = timezone(timedelta(hours=9))
            
            for log in logs:
                kst_time = log.timestamp.replace(tzinfo=timezone.utc).astimezone(kst_tz).strftime("%Y-%m-%d %H:%M:%S KST")
                
                writer.writerow([
                    log.id,
                    log.user_identifier,
                    log.model_name,
                    log.model_version,
                    log.output_decision,
                    f"{log.confidence_score:.2%}" if log.confidence_score else "N/A",
                    "예 (Yes)" if log.human_reviewed else "아니오 (No)",
                    kst_time
                ])
        
        else:  # Default: audit logs
            query = db.query(AuditLog)
            if start_date:
                query = query.filter(AuditLog.timestamp >= start_date)
            if end_date:
                query = query.filter(AuditLog.timestamp <= end_date)
            
            logs = query.order_by(AuditLog.timestamp.desc()).all()
            
            writer = csv.writer(output)
            writer.writerow([
                "ID", "작업 (Action)", "작업자 (Actor)", "리소스 유형 (Resource Type)",
                "리소스 ID (Resource ID)", "IP 주소 (IP Address)", "목적 (Purpose)",
                "결과 (Result)", "타임스탬프 (Timestamp KST)"
            ])
            
            from datetime import timedelta
            kst_tz = timezone(timedelta(hours=9))
            
            for log in logs:
                kst_time = log.timestamp.replace(tzinfo=timezone.utc).astimezone(kst_tz).strftime("%Y-%m-%d %H:%M:%S KST")
                
                writer.writerow([
                    log.id,
                    log.action,
                    log.actor,
                    log.resource_type,
                    log.resource_id or "N/A",
                    log.ip_address,
                    log.purpose,
                    log.result,
                    kst_time
                ])
        
        # Get CSV content
        csv_content = output.getvalue()
        output.close()
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{log_type}_logs_export_{timestamp}.csv"
        
        logger.info(
            f"감사 로그 내보내기 완료 (Audit logs exported): {len(logs)} records",
            extra={"extra_fields": {"log_type": log_type, "count": len(logs)}}
        )
        
        # Return CSV file
        return Response(
            content=csv_content.encode("utf-8-sig"),  # UTF-8 with BOM for Excel compatibility
            media_type="text/csv; charset=utf-8",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "text/csv; charset=utf-8"
            }
        )
        
    except Exception as e:
        logger.error(f"감사 로그 내보내기 실패 (Audit log export failed): {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="감사 로그 내보내기에 실패했습니다 (Failed to export audit logs)"
        )
