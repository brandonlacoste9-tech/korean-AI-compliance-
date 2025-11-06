"""
Core compliance checking functionality for Korean AI Basic Act.
"""

from enum import Enum
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


class ComplianceStatus(Enum):
    """Compliance status levels."""
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    PARTIAL = "partial"
    NOT_ASSESSED = "not_assessed"


class ComplianceCategory(Enum):
    """Korean AI Basic Act compliance categories."""
    TRANSPARENCY = "transparency"
    ACCOUNTABILITY = "accountability"
    SAFETY = "safety"
    PRIVACY = "privacy"
    FAIRNESS = "fairness"
    HUMAN_RIGHTS = "human_rights"


@dataclass
class ComplianceRequirement:
    """Represents a single compliance requirement."""
    id: str
    category: ComplianceCategory
    title: str
    description: str
    mandatory: bool = True
    status: ComplianceStatus = ComplianceStatus.NOT_ASSESSED
    notes: str = ""
    assessed_date: Optional[datetime] = None
    evidence: List[str] = field(default_factory=list)


@dataclass
class ComplianceAssessment:
    """Represents a complete compliance assessment."""
    ai_system_name: str
    ai_system_description: str
    assessment_date: datetime
    requirements: List[ComplianceRequirement] = field(default_factory=list)
    overall_status: ComplianceStatus = ComplianceStatus.NOT_ASSESSED
    
    def add_requirement(self, requirement: ComplianceRequirement) -> None:
        """Add a compliance requirement to the assessment."""
        self.requirements.append(requirement)
    
    def calculate_overall_status(self) -> ComplianceStatus:
        """Calculate overall compliance status based on individual requirements."""
        if not self.requirements:
            return ComplianceStatus.NOT_ASSESSED
        
        statuses = [req.status for req in self.requirements]
        
        # If any mandatory requirement is non-compliant, overall is non-compliant
        mandatory_non_compliant = any(
            req.mandatory and req.status == ComplianceStatus.NON_COMPLIANT 
            for req in self.requirements
        )
        if mandatory_non_compliant:
            return ComplianceStatus.NON_COMPLIANT
        
        # If all assessed requirements are compliant
        if all(s == ComplianceStatus.COMPLIANT for s in statuses):
            return ComplianceStatus.COMPLIANT
        
        # If any are not assessed
        if any(s == ComplianceStatus.NOT_ASSESSED for s in statuses):
            return ComplianceStatus.PARTIAL
        
        # Otherwise partial compliance
        return ComplianceStatus.PARTIAL
    
    def get_summary(self) -> Dict[str, int]:
        """Get a summary count of requirements by status."""
        summary = {status.value: 0 for status in ComplianceStatus}
        for req in self.requirements:
            summary[req.status.value] += 1
        return summary


class ComplianceChecker:
    """Main compliance checker for Korean AI Basic Act."""
    
    def __init__(self):
        """Initialize the compliance checker with default requirements."""
        self.default_requirements = self._load_default_requirements()
    
    def _load_default_requirements(self) -> List[ComplianceRequirement]:
        """Load default Korean AI Basic Act requirements."""
        requirements = [
            # Transparency requirements
            ComplianceRequirement(
                id="TRANS-001",
                category=ComplianceCategory.TRANSPARENCY,
                title="AI System Disclosure",
                description="AI system must clearly disclose that it is an AI system to users",
                mandatory=True
            ),
            ComplianceRequirement(
                id="TRANS-002",
                category=ComplianceCategory.TRANSPARENCY,
                title="Decision Process Transparency",
                description="AI decision-making processes must be explainable and transparent",
                mandatory=True
            ),
            
            # Accountability requirements
            ComplianceRequirement(
                id="ACCT-001",
                category=ComplianceCategory.ACCOUNTABILITY,
                title="Responsible Party Designation",
                description="Clear designation of parties responsible for AI system operation",
                mandatory=True
            ),
            ComplianceRequirement(
                id="ACCT-002",
                category=ComplianceCategory.ACCOUNTABILITY,
                title="Audit Trail",
                description="Maintain comprehensive logs and audit trails for AI decisions",
                mandatory=True
            ),
            
            # Safety requirements
            ComplianceRequirement(
                id="SAFE-001",
                category=ComplianceCategory.SAFETY,
                title="Risk Assessment",
                description="Conduct and document comprehensive risk assessment",
                mandatory=True
            ),
            ComplianceRequirement(
                id="SAFE-002",
                category=ComplianceCategory.SAFETY,
                title="Safety Mechanisms",
                description="Implement appropriate safety mechanisms and fail-safes",
                mandatory=True
            ),
            
            # Privacy requirements
            ComplianceRequirement(
                id="PRIV-001",
                category=ComplianceCategory.PRIVACY,
                title="Personal Data Protection",
                description="Comply with Korean Personal Information Protection Act (PIPA)",
                mandatory=True
            ),
            ComplianceRequirement(
                id="PRIV-002",
                category=ComplianceCategory.PRIVACY,
                title="Data Minimization",
                description="Collect and process only necessary personal data",
                mandatory=True
            ),
            
            # Fairness requirements
            ComplianceRequirement(
                id="FAIR-001",
                category=ComplianceCategory.FAIRNESS,
                title="Bias Testing",
                description="Test AI system for discriminatory bias",
                mandatory=True
            ),
            ComplianceRequirement(
                id="FAIR-002",
                category=ComplianceCategory.FAIRNESS,
                title="Fair Treatment",
                description="Ensure AI does not discriminate based on protected characteristics",
                mandatory=True
            ),
            
            # Human Rights requirements
            ComplianceRequirement(
                id="HUMAN-001",
                category=ComplianceCategory.HUMAN_RIGHTS,
                title="Human Dignity",
                description="AI system must respect human dignity and autonomy",
                mandatory=True
            ),
            ComplianceRequirement(
                id="HUMAN-002",
                category=ComplianceCategory.HUMAN_RIGHTS,
                title="Human Oversight",
                description="Provide for meaningful human oversight of AI decisions",
                mandatory=True
            ),
        ]
        return requirements
    
    def create_assessment(
        self, 
        ai_system_name: str, 
        ai_system_description: str
    ) -> ComplianceAssessment:
        """Create a new compliance assessment with default requirements."""
        assessment = ComplianceAssessment(
            ai_system_name=ai_system_name,
            ai_system_description=ai_system_description,
            assessment_date=datetime.now(),
            requirements=self.default_requirements.copy()
        )
        return assessment
    
    def validate_assessment(self, assessment: ComplianceAssessment) -> bool:
        """Validate that an assessment is complete and properly filled out."""
        if not assessment.requirements:
            return False
        
        # Check that all mandatory requirements are assessed
        mandatory_reqs = [req for req in assessment.requirements if req.mandatory]
        assessed_mandatory = [
            req for req in mandatory_reqs 
            if req.status != ComplianceStatus.NOT_ASSESSED
        ]
        
        return len(assessed_mandatory) == len(mandatory_reqs)
