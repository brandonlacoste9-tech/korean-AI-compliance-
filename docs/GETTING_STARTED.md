# Getting Started with Korean AI Compliance Framework

This guide will help you get started with the Korean AI Compliance Framework for assessing your AI systems against the Korean AI Basic Act requirements.

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/brandonlacoste9-tech/korean-AI-compliance-.git
cd korean-AI-compliance-

# Install the package
pip install -e .
```

### Requirements

- Python 3.8 or higher
- No additional runtime dependencies required (uses only Python standard library)

## Quick Start

### 1. Using the Python API

```python
from korean_ai_compliance import ComplianceChecker
from korean_ai_compliance.core import ComplianceStatus

# Create a compliance checker
checker = ComplianceChecker()

# Create an assessment for your AI system
assessment = checker.create_assessment(
    ai_system_name="My AI System",
    ai_system_description="Description of what the AI system does"
)

# Review requirements
print(f"Total requirements: {len(assessment.requirements)}")

# Mark requirements as you assess them
for req in assessment.requirements:
    # Review each requirement and set status
    if req.id == "TRANS-001":  # Example
        req.status = ComplianceStatus.COMPLIANT
        req.notes = "AI clearly identifies itself in the UI"
        req.evidence = ["screenshot_ui.png", "user_testing_report.pdf"]

# Calculate overall compliance
overall = assessment.calculate_overall_status()
print(f"Overall status: {overall.value}")

# Get summary
summary = assessment.get_summary()
for status, count in summary.items():
    print(f"{status}: {count}")

# Validate that assessment is complete
is_complete = checker.validate_assessment(assessment)
print(f"Assessment complete: {is_complete}")
```

### 2. Using the CLI

```bash
# Check version
korean-ai-compliance version

# Get help
korean-ai-compliance help

# Create assessment (basic - under development)
korean-ai-compliance assess --name "My AI System"
```

### 3. Running the Example

```bash
python examples/basic_assessment.py
```

## Understanding the Requirements

The framework includes 12 default requirements across 6 categories:

### 1. Transparency (TRANS)
- **TRANS-001**: AI System Disclosure - AI must identify itself to users
- **TRANS-002**: Decision Process Transparency - Explainable AI decisions

### 2. Accountability (ACCT)
- **ACCT-001**: Responsible Party Designation - Clear ownership
- **ACCT-002**: Audit Trail - Comprehensive logging

### 3. Safety (SAFE)
- **SAFE-001**: Risk Assessment - Document all risks
- **SAFE-002**: Safety Mechanisms - Fail-safes and controls

### 4. Privacy (PRIV)
- **PRIV-001**: Personal Data Protection - PIPA compliance
- **PRIV-002**: Data Minimization - Only collect necessary data

### 5. Fairness (FAIR)
- **FAIR-001**: Bias Testing - Test for discrimination
- **FAIR-002**: Fair Treatment - No discriminatory outcomes

### 6. Human Rights (HUMAN)
- **HUMAN-001**: Human Dignity - Respect autonomy
- **HUMAN-002**: Human Oversight - Human review capability

## Compliance Assessment Process

### Step 1: Create Assessment
Create a new assessment for your AI system:

```python
assessment = checker.create_assessment(
    ai_system_name="Customer Service Bot",
    ai_system_description="AI chatbot for customer support"
)
```

### Step 2: Review Each Requirement
For each requirement in the assessment:

1. **Understand the requirement** - Read the title and description
2. **Gather evidence** - Collect documentation, test results, etc.
3. **Assess compliance** - Determine if you meet the requirement
4. **Document findings** - Add notes and evidence references

```python
req = assessment.requirements[0]
print(f"{req.id}: {req.title}")
print(f"Description: {req.description}")
print(f"Mandatory: {req.mandatory}")

# Assess it
req.status = ComplianceStatus.COMPLIANT  # or NON_COMPLIANT, PARTIAL
req.notes = "Verified through user testing"
req.evidence = ["test_report.pdf"]
req.assessed_date = datetime.now()
```

### Step 3: Calculate Overall Status
Once all mandatory requirements are assessed:

```python
overall_status = assessment.calculate_overall_status()
print(f"Overall: {overall_status.value}")
```

Status values:
- **COMPLIANT**: All mandatory requirements met
- **NON_COMPLIANT**: One or more mandatory requirements not met
- **PARTIAL**: Some requirements assessed, more work needed
- **NOT_ASSESSED**: No assessment conducted yet

### Step 4: Create Action Plan
For any non-compliant areas:

1. Identify the gap
2. Document required changes
3. Assign responsibility
4. Set timeline
5. Schedule reassessment

## Using the Compliance Checklist

For a detailed checklist format, see `docs/compliance/checklist.md`. This provides:

- Detailed requirements breakdown
- Evidence requirements for each item
- Checkbox format for tracking
- Assessment summary section

## Best Practices

### 1. Regular Assessments
- Conduct initial assessment before deployment
- Reassess after major changes
- Schedule periodic reviews (quarterly/annually)

### 2. Documentation
- Keep evidence organized and accessible
- Document rationale for all assessments
- Maintain version history of assessments

### 3. Collaboration
- Involve legal, technical, and business teams
- Get stakeholder sign-off on assessments
- Share results with relevant parties

### 4. Continuous Improvement
- Track changes over time
- Address non-compliant areas promptly
- Update assessments as regulations evolve

## Advanced Usage

### Custom Requirements

You can add custom requirements beyond the defaults:

```python
from korean_ai_compliance.core import ComplianceRequirement, ComplianceCategory

custom_req = ComplianceRequirement(
    id="CUSTOM-001",
    category=ComplianceCategory.TRANSPARENCY,
    title="Custom Requirement",
    description="Organization-specific requirement",
    mandatory=False
)

assessment.add_requirement(custom_req)
```

### Filtering Requirements

```python
# Get only transparency requirements
transparency_reqs = [
    req for req in assessment.requirements
    if req.category == ComplianceCategory.TRANSPARENCY
]

# Get only mandatory requirements
mandatory_reqs = [
    req for req in assessment.requirements
    if req.mandatory
]

# Get non-compliant requirements
non_compliant = [
    req for req in assessment.requirements
    if req.status == ComplianceStatus.NON_COMPLIANT
]
```

## Getting Help

- **Documentation**: See the `docs/` directory
- **Examples**: Check `examples/` for working code
- **Issues**: Report bugs or request features on GitHub
- **Contributing**: See `CONTRIBUTING.md` for guidelines

## Next Steps

1. Run the example: `python examples/basic_assessment.py`
2. Review the compliance checklist: `docs/compliance/checklist.md`
3. Create your first assessment
4. Explore the API documentation in the source code

## Resources

- [Korean AI Basic Act Information](https://www.law.go.kr/)
- [Ministry of Science and ICT](https://www.msit.go.kr/)
- [KISA - AI Security Guidelines](https://www.kisa.or.kr/)

## Disclaimer

This framework provides guidance and tools but does not constitute legal advice. Consult with legal professionals familiar with Korean AI regulations for your specific compliance needs.
