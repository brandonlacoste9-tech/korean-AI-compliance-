"""
Command-line interface for Korean AI Compliance Framework.
"""

import sys
from typing import Optional


def main(args: Optional[list] = None) -> int:
    """Main entry point for the CLI."""
    if args is None:
        args = sys.argv[1:]
    
    if not args or args[0] in ['-h', '--help', 'help']:
        print_help()
        return 0
    
    command = args[0]
    
    if command == 'version':
        from korean_ai_compliance import __version__
        print(f"Korean AI Compliance Framework v{__version__}")
        return 0
    
    elif command == 'assess':
        return run_assessment(args[1:])
    
    elif command == 'check':
        return run_check(args[1:])
    
    else:
        print(f"Unknown command: {command}")
        print_help()
        return 1


def print_help() -> None:
    """Print help message."""
    help_text = """
Korean AI Compliance Framework - CLI

Usage:
    korean-ai-compliance <command> [options]

Commands:
    assess      Create a new compliance assessment
    check       Check compliance status of an AI system
    version     Show version information
    help        Show this help message

Examples:
    korean-ai-compliance assess --name "My AI System"
    korean-ai-compliance check --config compliance.yaml
    korean-ai-compliance version

For more information, visit:
https://github.com/brandonlacoste9-tech/korean-AI-compliance-
"""
    print(help_text)


def run_assessment(args: list) -> int:
    """Run compliance assessment."""
    from korean_ai_compliance.core import ComplianceChecker
    
    # Simple implementation for now
    print("Creating new compliance assessment...")
    print("This feature is under development.")
    print("\nYou can use the Python API:")
    print("  from korean_ai_compliance import ComplianceChecker")
    print("  checker = ComplianceChecker()")
    print("  assessment = checker.create_assessment('AI System', 'Description')")
    
    return 0


def run_check(args: list) -> int:
    """Run compliance check."""
    print("Running compliance check...")
    print("This feature is under development.")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
