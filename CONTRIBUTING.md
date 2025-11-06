# Contributing to Korean AI Compliance Framework

Thank you for your interest in contributing to the Korean AI Compliance Framework! This project aims to help organizations worldwide comply with Korean AI regulations.

## How to Contribute

### Reporting Issues

- Use the GitHub issue tracker to report bugs or suggest features
- Before creating an issue, please check if a similar issue already exists
- Provide as much detail as possible, including:
  - Steps to reproduce (for bugs)
  - Expected vs actual behavior
  - Your environment (OS, Python version, etc.)

### Pull Requests

1. **Fork the repository** and create a new branch from `main`
2. **Make your changes** following our coding standards
3. **Write or update tests** for your changes
4. **Update documentation** as needed
5. **Run tests** to ensure everything works
6. **Submit a pull request** with a clear description of your changes

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/korean-AI-compliance-.git
cd korean-AI-compliance-

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run linters
black src/ tests/
flake8 src/ tests/
mypy src/
```

## Coding Standards

### Python Code Style

- Follow PEP 8 style guide
- Use Black for code formatting (line length: 100)
- Use type hints for function signatures
- Write docstrings for all public modules, classes, and functions
- Keep functions focused and small

### Testing

- Write tests for all new features and bug fixes
- Aim for high test coverage (>80%)
- Use pytest for testing
- Follow the Arrange-Act-Assert pattern

### Documentation

- Update README.md for user-facing changes
- Add docstrings to all public APIs
- Update relevant documentation in the `docs/` directory
- Include examples for new features

## Code Review Process

1. All submissions require review before merging
2. Reviewers will check:
   - Code quality and style
   - Test coverage
   - Documentation completeness
   - Compliance with project goals

## Translation Contributions

We welcome translations of documentation and compliance materials:

- Korean (한국어) translations are especially valuable
- Submit translations as pull requests
- Place translations in `docs/translations/`
- Maintain the same structure as English documentation

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Reach out to maintainers

## Code of Conduct

Please note that this project follows a Code of Conduct. By participating, you agree to uphold this code. Please report unacceptable behavior to the project maintainers.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
