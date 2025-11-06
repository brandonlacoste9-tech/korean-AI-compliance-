"""
Tests for core compliance functionality.
"""

import pytest
from datetime import datetime

from korean_ai_compliance.core import (
    ComplianceStatus,
    ComplianceCategory,
    ComplianceRequirement,
    ComplianceAssessment,
    ComplianceChecker,
)


class TestComplianceRequirement:
    """Tests for ComplianceRequirement class."""
    
    def test_create_requirement(self):
        """Test creating a compliance requirement."""
        req = ComplianceRequirement(
            id="TEST-001",
            category=ComplianceCategory.TRANSPARENCY,
            title="Test Requirement",
            description="A test requirement",
            mandatory=True
        )
        
        assert req.id == "TEST-001"
        assert req.category == ComplianceCategory.TRANSPARENCY
        assert req.title == "Test Requirement"
        assert req.mandatory is True
        assert req.status == ComplianceStatus.NOT_ASSESSED
    
    def test_requirement_with_evidence(self):
        """Test requirement with evidence."""
        req = ComplianceRequirement(
            id="TEST-002",
            category=ComplianceCategory.SAFETY,
            title="Test with Evidence",
            description="A test requirement with evidence",
            evidence=["doc1.pdf", "doc2.pdf"]
        )
        
        assert len(req.evidence) == 2
        assert "doc1.pdf" in req.evidence


class TestComplianceAssessment:
    """Tests for ComplianceAssessment class."""
    
    def test_create_assessment(self):
        """Test creating a compliance assessment."""
        assessment = ComplianceAssessment(
            ai_system_name="Test AI System",
            ai_system_description="A test AI system",
            assessment_date=datetime.now()
        )
        
        assert assessment.ai_system_name == "Test AI System"
        assert assessment.overall_status == ComplianceStatus.NOT_ASSESSED
        assert len(assessment.requirements) == 0
    
    def test_add_requirement(self):
        """Test adding requirements to assessment."""
        assessment = ComplianceAssessment(
            ai_system_name="Test AI System",
            ai_system_description="A test AI system",
            assessment_date=datetime.now()
        )
        
        req = ComplianceRequirement(
            id="TEST-001",
            category=ComplianceCategory.TRANSPARENCY,
            title="Test Requirement",
            description="A test requirement"
        )
        
        assessment.add_requirement(req)
        assert len(assessment.requirements) == 1
    
    def test_calculate_overall_status_all_compliant(self):
        """Test overall status when all requirements are compliant."""
        assessment = ComplianceAssessment(
            ai_system_name="Test AI System",
            ai_system_description="A test AI system",
            assessment_date=datetime.now()
        )
        
        # Add compliant requirements
        for i in range(3):
            req = ComplianceRequirement(
                id=f"TEST-{i:03d}",
                category=ComplianceCategory.TRANSPARENCY,
                title=f"Test {i}",
                description=f"Test requirement {i}",
                status=ComplianceStatus.COMPLIANT
            )
            assessment.add_requirement(req)
        
        status = assessment.calculate_overall_status()
        assert status == ComplianceStatus.COMPLIANT
        # Verify that the instance variable is also updated
        assert assessment.overall_status == ComplianceStatus.COMPLIANT
    
    def test_calculate_overall_status_mandatory_non_compliant(self):
        """Test overall status when mandatory requirement is non-compliant."""
        assessment = ComplianceAssessment(
            ai_system_name="Test AI System",
            ai_system_description="A test AI system",
            assessment_date=datetime.now()
        )
        
        # Add compliant requirement
        req1 = ComplianceRequirement(
            id="TEST-001",
            category=ComplianceCategory.TRANSPARENCY,
            title="Test 1",
            description="Test requirement 1",
            status=ComplianceStatus.COMPLIANT,
            mandatory=True
        )
        assessment.add_requirement(req1)
        
        # Add non-compliant mandatory requirement
        req2 = ComplianceRequirement(
            id="TEST-002",
            category=ComplianceCategory.SAFETY,
            title="Test 2",
            description="Test requirement 2",
            status=ComplianceStatus.NON_COMPLIANT,
            mandatory=True
        )
        assessment.add_requirement(req2)
        
        status = assessment.calculate_overall_status()
        assert status == ComplianceStatus.NON_COMPLIANT
    
    def test_get_summary(self):
        """Test getting summary of requirement statuses."""
        assessment = ComplianceAssessment(
            ai_system_name="Test AI System",
            ai_system_description="A test AI system",
            assessment_date=datetime.now()
        )
        
        # Add various status requirements
        assessment.add_requirement(ComplianceRequirement(
            id="TEST-001",
            category=ComplianceCategory.TRANSPARENCY,
            title="Test 1",
            description="Test",
            status=ComplianceStatus.COMPLIANT
        ))
        assessment.add_requirement(ComplianceRequirement(
            id="TEST-002",
            category=ComplianceCategory.SAFETY,
            title="Test 2",
            description="Test",
            status=ComplianceStatus.NON_COMPLIANT
        ))
        assessment.add_requirement(ComplianceRequirement(
            id="TEST-003",
            category=ComplianceCategory.PRIVACY,
            title="Test 3",
            description="Test",
            status=ComplianceStatus.NOT_ASSESSED
        ))
        
        summary = assessment.get_summary()
        assert summary[ComplianceStatus.COMPLIANT.value] == 1
        assert summary[ComplianceStatus.NON_COMPLIANT.value] == 1
        assert summary[ComplianceStatus.NOT_ASSESSED.value] == 1


class TestComplianceChecker:
    """Tests for ComplianceChecker class."""
    
    def test_create_checker(self):
        """Test creating a compliance checker."""
        checker = ComplianceChecker()
        assert len(checker.default_requirements) > 0
    
    def test_default_requirements_coverage(self):
        """Test that default requirements cover all categories."""
        checker = ComplianceChecker()
        
        categories_covered = set()
        for req in checker.default_requirements:
            categories_covered.add(req.category)
        
        # Should have requirements for all categories
        assert len(categories_covered) == len(ComplianceCategory)
    
    def test_create_assessment(self):
        """Test creating an assessment from checker."""
        checker = ComplianceChecker()
        assessment = checker.create_assessment(
            "Test AI System",
            "A test AI system for testing compliance"
        )
        
        assert assessment.ai_system_name == "Test AI System"
        assert len(assessment.requirements) > 0
        assert assessment.requirements == checker.default_requirements
    
    def test_validate_assessment_empty(self):
        """Test validating an empty assessment."""
        assessment = ComplianceAssessment(
            ai_system_name="Test AI System",
            ai_system_description="A test AI system",
            assessment_date=datetime.now()
        )
        
        checker = ComplianceChecker()
        assert not checker.validate_assessment(assessment)
    
    def test_validate_assessment_complete(self):
        """Test validating a complete assessment."""
        checker = ComplianceChecker()
        assessment = checker.create_assessment(
            "Test AI System",
            "A test AI system"
        )
        
        # Mark all mandatory requirements as assessed
        for req in assessment.requirements:
            if req.mandatory:
                req.status = ComplianceStatus.COMPLIANT
        
        assert checker.validate_assessment(assessment)
    
    def test_validate_assessment_incomplete(self):
        """Test validating an incomplete assessment."""
        checker = ComplianceChecker()
        assessment = checker.create_assessment(
            "Test AI System",
            "A test AI system"
        )
        
        # Only mark half of mandatory requirements as assessed
        mandatory_reqs = [req for req in assessment.requirements if req.mandatory]
        for i, req in enumerate(mandatory_reqs):
            if i < len(mandatory_reqs) // 2:
                req.status = ComplianceStatus.COMPLIANT
        
        assert not checker.validate_assessment(assessment)
