"""
Tests for PIPC-compliant audit logging endpoints.

Tests cover:
- Consent log creation and retrieval
- Audit log creation and retrieval
- AI processing log creation
- CSV export functionality
- Data validation and error handling
"""
import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Import models first to register them with Base
from app.audit_models import ConsentLog, AuditLog, AIProcessingLog
from app.database import Base

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables (models are already registered)
Base.metadata.create_all(bind=engine)

# Now import app and set up override
from app.database import get_db
from app.main import app


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Override the dependency
app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Clear data between tests but keep tables."""
    yield
    # Clear all data after each test
    db = TestingSessionLocal()
    try:
        db.query(ConsentLog).delete()
        db.query(AuditLog).delete()
        db.query(AIProcessingLog).delete()
        db.commit()
    finally:
        db.close()


class TestConsentLogEndpoints:
    """Test suite for consent logging endpoints."""
    
    def test_create_consent_log_success(self):
        """Test successful consent log creation."""
        payload = {
            "userIdentifier": "test@example.com",
            "ipAddress": "192.168.1.1",
            "consentType": "personal_data_processing",
            "consentText": "I consent to personal data processing for AI risk assessment (개인정보 처리에 동의합니다)",
            "consentMethod": "checkbox",
            "consentGiven": True,
            "metadata": {
                "user_agent": "Mozilla/5.0",
                "locale": "ko"
            }
        }
        
        response = client.post("/api/v1/consent", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["user_identifier"] == "test@example.com"
        assert data["consent_type"] == "personal_data_processing"
        assert data["consent_given"] is True
        assert data["ip_address"] == "192.168.1.1"
        assert "timestamp" in data
        assert data["id"] > 0
    
    def test_create_consent_log_minimal(self):
        """Test consent log creation with minimal required fields."""
        payload = {
            "userIdentifier": "user123",
            "ipAddress": "10.0.0.1",
            "consentType": "marketing",
            "consentText": "I consent to marketing communications",
            "consentMethod": "button_click",
            "consentGiven": False
        }
        
        response = client.post("/api/v1/consent", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["consent_given"] is False
        assert data["metadata"] is None
    
    def test_get_consent_logs_all(self):
        """Test retrieving all consent logs."""
        # Create multiple consent logs
        for i in range(3):
            payload = {
                "userIdentifier": f"user{i}@example.com",
                "ipAddress": f"192.168.1.{i}",
                "consentType": "ai_assessment",
                "consentText": "AI assessment consent",
                "consentMethod": "api_call",
                "consentGiven": True
            }
            client.post("/api/v1/consent", json=payload)
        
        response = client.get("/api/v1/consent")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        assert all(log["consent_type"] == "ai_assessment" for log in data)
    
    def test_get_consent_logs_filtered_by_user(self):
        """Test filtering consent logs by user identifier."""
        # Create logs for different users
        users = ["alice@example.com", "bob@example.com", "alice@example.com"]
        for user in users:
            payload = {
                "userIdentifier": user,
                "ipAddress": "192.168.1.1",
                "consentType": "test",
                "consentText": "test consent",
                "consentMethod": "test",
                "consentGiven": True
            }
            client.post("/api/v1/consent", json=payload)
        
        response = client.get("/api/v1/consent", params={"user_identifier": "alice@example.com"})
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(log["user_identifier"] == "alice@example.com" for log in data)
    
    def test_get_consent_logs_filtered_by_type(self):
        """Test filtering consent logs by consent type."""
        types = ["marketing", "ai_assessment", "marketing"]
        for consent_type in types:
            payload = {
                "userIdentifier": "user@example.com",
                "ipAddress": "192.168.1.1",
                "consentType": consent_type,
                "consentText": f"{consent_type} consent",
                "consentMethod": "checkbox",
                "consentGiven": True
            }
            client.post("/api/v1/consent", json=payload)
        
        response = client.get("/api/v1/consent", params={"consent_type": "marketing"})
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(log["consent_type"] == "marketing" for log in data)


class TestAuditLogEndpoints:
    """Test suite for audit log endpoints."""
    
    def test_create_audit_log_success(self):
        """Test successful audit log creation."""
        payload = {
            "action": "data_access",
            "actor": "admin@example.com",
            "resourceType": "user_data",
            "resourceId": "user123",
            "ipAddress": "192.168.1.1",
            "purpose": "compliance_review",
            "result": "success",
            "metadata": {
                "records_accessed": 10,
                "duration_ms": 150
            }
        }
        
        response = client.post("/api/v1/audit-logs", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["action"] == "data_access"
        assert data["actor"] == "admin@example.com"
        assert data["result"] == "success"
        assert data["id"] > 0
    
    def test_create_audit_log_with_error(self):
        """Test audit log creation with error message."""
        payload = {
            "action": "export_data",
            "actor": "user@example.com",
            "resourceType": "audit_logs",
            "ipAddress": "10.0.0.1",
            "purpose": "compliance_audit",
            "result": "failure",
            "errorMessage": "Insufficient permissions"
        }
        
        response = client.post("/api/v1/audit-logs", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["result"] == "failure"
        assert data["error_message"] == "Insufficient permissions"
    
    def test_get_audit_logs_all(self):
        """Test retrieving all audit logs."""
        for i in range(5):
            payload = {
                "action": f"action_{i}",
                "actor": f"user{i}@example.com",
                "resourceType": "test_resource",
                "ipAddress": "192.168.1.1",
                "purpose": "testing",
                "result": "success"
            }
            client.post("/api/v1/audit-logs", json=payload)
        
        response = client.get("/api/v1/audit-logs")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5
    
    def test_get_audit_logs_filtered_by_action(self):
        """Test filtering audit logs by action."""
        actions = ["login", "data_access", "login", "export"]
        for action in actions:
            payload = {
                "action": action,
                "actor": "user@example.com",
                "resourceType": "system",
                "ipAddress": "192.168.1.1",
                "purpose": "test",
                "result": "success"
            }
            client.post("/api/v1/audit-logs", json=payload)
        
        response = client.get("/api/v1/audit-logs", params={"action": "login"})
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(log["action"] == "login" for log in data)
    
    def test_get_audit_logs_pagination(self):
        """Test audit log pagination."""
        for i in range(10):
            payload = {
                "action": "test_action",
                "actor": f"user{i}@example.com",
                "resourceType": "test",
                "ipAddress": "192.168.1.1",
                "purpose": "test",
                "result": "success"
            }
            client.post("/api/v1/audit-logs", json=payload)
        
        # Get first page
        response = client.get("/api/v1/audit-logs", params={"limit": 5, "offset": 0})
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5
        
        # Get second page
        response = client.get("/api/v1/audit-logs", params={"limit": 5, "offset": 5})
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5


class TestAIProcessingLogEndpoints:
    """Test suite for AI processing log endpoints."""
    
    def test_create_ai_processing_log_success(self):
        """Test successful AI processing log creation."""
        payload = {
            "userIdentifier": "user@example.com",
            "modelName": "risk_assessment_model",
            "modelVersion": "1.0.0",
            "inputSummary": "Company: TechCorp, Industry: Healthcare",
            "outputDecision": "High risk - requires MSIT approval",
            "confidenceScore": 0.92,
            "reasoning": "Healthcare industry + personal data processing detected",
            "keyFactors": {
                "industry": "healthcare",
                "personal_data": True,
                "risk_multiplier": 1.5
            },
            "ipAddress": "192.168.1.1",
            "metadata": {
                "processing_time_ms": 250
            }
        }
        
        response = client.post("/api/v1/ai-processing-logs", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["model_name"] == "risk_assessment_model"
        assert data["confidence_score"] == 0.92
        assert data["human_reviewed"] is False
        assert data["id"] > 0
    
    def test_create_ai_processing_log_minimal(self):
        """Test AI processing log with minimal fields."""
        payload = {
            "userIdentifier": "user123",
            "modelName": "simple_model",
            "modelVersion": "1.0",
            "outputDecision": "Low risk",
            "ipAddress": "10.0.0.1"
        }
        
        response = client.post("/api/v1/ai-processing-logs", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["model_name"] == "simple_model"
        assert data["confidence_score"] is None
        assert data["reasoning"] is None


class TestAuditLogExport:
    """Test suite for CSV export functionality."""
    
    def test_export_consent_logs_csv(self):
        """Test exporting consent logs to CSV."""
        # Create some consent logs
        for i in range(3):
            payload = {
                "userIdentifier": f"user{i}@example.com",
                "ipAddress": f"192.168.1.{i}",
                "consentType": "test_consent",
                "consentText": "Test consent text",
                "consentMethod": "checkbox",
                "consentGiven": True
            }
            client.post("/api/v1/consent", json=payload)
        
        response = client.get("/api/v1/audit-logs/export", params={"log_type": "consent"})
        
        assert response.status_code == 200
        assert "text/csv" in response.headers["content-type"]
        assert "attachment" in response.headers["content-disposition"]
        
        # Verify CSV content
        csv_content = response.content.decode("utf-8-sig")
        lines = csv_content.strip().split("\n")
        assert len(lines) == 4  # Header + 3 data rows
        assert "사용자 식별자" in lines[0]  # Korean header
        assert "user0@example.com" in csv_content
    
    def test_export_audit_logs_csv(self):
        """Test exporting audit logs to CSV."""
        for i in range(2):
            payload = {
                "action": "test_action",
                "actor": f"user{i}@example.com",
                "resourceType": "test_resource",
                "ipAddress": "192.168.1.1",
                "purpose": "testing",
                "result": "success"
            }
            client.post("/api/v1/audit-logs", json=payload)
        
        response = client.get("/api/v1/audit-logs/export", params={"log_type": "audit"})
        
        assert response.status_code == 200
        csv_content = response.content.decode("utf-8-sig")
        lines = csv_content.strip().split("\n")
        assert len(lines) == 3  # Header + 2 data rows
        assert "작업" in lines[0]  # Korean for "Action"
    
    def test_export_ai_processing_logs_csv(self):
        """Test exporting AI processing logs to CSV."""
        payload = {
            "userIdentifier": "user@example.com",
            "modelName": "test_model",
            "modelVersion": "1.0",
            "outputDecision": "Test decision",
            "confidenceScore": 0.85,
            "ipAddress": "192.168.1.1"
        }
        client.post("/api/v1/ai-processing-logs", json=payload)
        
        response = client.get("/api/v1/audit-logs/export", params={"log_type": "ai_processing"})
        
        assert response.status_code == 200
        csv_content = response.content.decode("utf-8-sig")
        lines = csv_content.strip().split("\n")
        assert len(lines) == 2  # Header + 1 data row
        assert "모델명" in lines[0]  # Korean for "Model"
        assert "85.00%" in csv_content  # Confidence score formatted as percentage
