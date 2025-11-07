"""
Basic example of using the Korean AI Compliance Framework.

This example demonstrates how to create a compliance assessment
and evaluate an AI system against Korean AI Basic Act requirements.
"""

from korean_ai_compliance import ComplianceChecker, ComplianceAssessment
from korean_ai_compliance.core import ComplianceStatus


def main():
    """Run a basic compliance assessment example."""
    
    # Create a compliance checker
    checker = ComplianceChecker()
    
    # Create an assessment for your AI system
    assessment = checker.create_assessment(
        ai_system_name="Customer Service Chatbot",
        ai_system_description="An AI-powered chatbot that helps customers with product inquiries"
    )
    
    print("=" * 60)
    print("Korean AI Compliance Assessment")
    print("=" * 60)
    print(f"\nAI System: {assessment.ai_system_name}")
    print(f"Description: {assessment.ai_system_description}")
    print(f"Assessment Date: {assessment.assessment_date.strftime('%Y-%m-%d')}")
    print(f"\nTotal Requirements: {len(assessment.requirements)}")
    
    # Display requirements by category
    print("\n" + "=" * 60)
    print("Requirements Overview")
    print("=" * 60)
    
    from korean_ai_compliance.core import ComplianceCategory
    
    for category in ComplianceCategory:
        category_reqs = [
            req for req in assessment.requirements 
            if req.category == category
        ]
        print(f"\n{category.value.upper().replace('_', ' ')}:")
        for req in category_reqs:
            print(f"  [{req.id}] {req.title}")
            print(f"      {req.description}")
            print(f"      Mandatory: {'Yes' if req.mandatory else 'No'}")
    
    # Example: Mark some requirements as compliant
    # In a real scenario, you would assess each requirement based on actual evidence
    print("\n" + "=" * 60)
    print("Example: Marking Requirements (for demonstration)")
    print("=" * 60)
    
    # Let's mark the first few as compliant for demonstration
    for i, req in enumerate(assessment.requirements[:3]):
        req.status = ComplianceStatus.COMPLIANT
        req.notes = "Verified through documentation and testing"
        print(f"  Marked {req.id} as COMPLIANT")
    
    # Mark one as non-compliant
    if len(assessment.requirements) > 3:
        assessment.requirements[3].status = ComplianceStatus.NON_COMPLIANT
        assessment.requirements[3].notes = "Needs improvement in audit logging"
        print(f"  Marked {assessment.requirements[3].id} as NON_COMPLIANT")
    
    # Get summary
    print("\n" + "=" * 60)
    print("Assessment Summary")
    print("=" * 60)
    
    summary = assessment.get_summary()
    for status, count in summary.items():
        print(f"  {status.replace('_', ' ').title()}: {count}")
    
    # Calculate overall status
    overall_status = assessment.calculate_overall_status()
    print(f"\nOverall Status: {overall_status.value.upper().replace('_', ' ')}")
    
    # Validate assessment
    is_valid = checker.validate_assessment(assessment)
    print(f"Assessment Complete: {'Yes' if is_valid else 'No (more requirements need assessment)'}")
    
    print("\n" + "=" * 60)
    print("Next Steps")
    print("=" * 60)
    print("""
To complete your compliance assessment:

1. Review each requirement in detail
2. Gather evidence for each requirement
3. Mark each requirement as compliant, non-compliant, or partial
4. Document notes and evidence for each assessment
5. Calculate overall compliance status
6. Create action plan for non-compliant areas
7. Schedule regular reassessments

For more information, see:
  - docs/compliance/checklist.md
  - https://github.com/brandonlacoste9-tech/korean-AI-compliance-
""")


if __name__ == "__main__":
    main()
