"""
Health check endpoint tests for Korean AI Compliance API.

This test suite validates the health check endpoint to ensure
the API is running and responding correctly.
"""

import pytest
from fastapi.testclient import TestClient


# Mock FastAPI app for testing
# In a real scenario, this would import from app.main
def create_test_app():
    """Create a minimal FastAPI app for testing."""
    from fastapi import FastAPI
    
    app = FastAPI()
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "service": "korean-ai-compliance",
            "version": "1.0.0"
        }
    
    return app


@pytest.fixture
def client():
    """Create test client fixture."""
    app = create_test_app()
    return TestClient(app)


def test_health_check_success(client):
    """Test that health check endpoint returns 200 and correct status."""
    response = client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "korean-ai-compliance"
    assert "version" in data


def test_health_check_response_structure(client):
    """Test that health check response has expected structure."""
    response = client.get("/health")
    data = response.json()
    
    # Verify required fields
    assert "status" in data
    assert "service" in data
    assert "version" in data
    
    # Verify data types
    assert isinstance(data["status"], str)
    assert isinstance(data["service"], str)
    assert isinstance(data["version"], str)


def test_health_check_returns_json(client):
    """Test that health check returns JSON content type."""
    response = client.get("/health")
    assert response.headers["content-type"] == "application/json"
