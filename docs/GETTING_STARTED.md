# Getting Started with Korean AI Compliance Guardian

This guide will help you get started with the Korean AI Compliance Guardian SaaS platform for assessing your AI systems against the Korean AI Basic Act requirements.

## Overview

Korean AI Compliance Guardian is a production-ready SaaS platform designed to help organizations comply with:
- Korean AI Basic Act (인공지능 기본법)
- PIPC (Personal Information Protection Commission) requirements
- MSIT (Ministry of Science and ICT) guidelines

**Compliance Deadline: January 22, 2026** (77 days remaining)

## Repository Structure

```
korean-AI-compliance-/
├── backend/              # FastAPI backend with PIPC audit logging
│   └── .env.example     # Environment configuration template
├── docs/                # Documentation
│   ├── compliance/      # Compliance references and checklists
│   ├── DEPLOYMENT.md    # Deployment guide
│   └── GETTING_STARTED.md
├── .github/             # GitHub configuration
└── pyproject.toml       # Project metadata
```

## Setup

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/brandonlacoste9-tech/korean-AI-compliance-.git
cd korean-AI-compliance-

# Set up backend
cd backend
cp .env.example .env
# Edit .env and configure your environment variables

# Install dependencies (when requirements.txt is added)
# pip install -r requirements.txt

# Run the backend (instructions to be added)
# uvicorn main:app --reload
```

### Requirements

- Python 3.8 or higher
- FastAPI for backend
- Supabase (Seoul region for PIPC compliance)
- Stripe for payment processing (KRW)

## Key Features

### 1. PIPC Audit Logging
All risk assessments and user actions are logged with:
- IP address tracking
- Timestamp recording
- Consent management
- Seoul residency compliance

### 2. Compliance Badges
Display MSIT and PIPC trust badges on:
- Landing pages
- Risk assessment forms
- Email templates

### 3. Bilingual Support
- Korean (한국어) - Formal language (존댓말)
- English
- Powered by next-i18next

### 4. Obangsaek Design System
Traditional Korean color palette:
- 백 (White)
- 청 (Blue)
- 적 (Red)
- 흑 (Black)
- 황 (Yellow)

With glassmorphism UI effects for modern appearance.

## Compliance Features

### Article 31 AI Disclosure Template
Reference template for AI system transparency requirements:
- See `docs/compliance/article-31-reference.md`
- System type classification (High/Medium/Low risk)
- Decision process explanation
- Human oversight details
- Contact information

### Compliance Checklist
Detailed requirements breakdown:
- See `docs/compliance/checklist.md`
- Evidence requirements for each item
- Checkbox format for tracking progress
- Assessment summary section

## Development Workflow

### 1. Backend Development
```bash
cd backend
# Add your FastAPI routes
# Implement PIPC audit logging
# Configure Supabase connection
# Set up Stripe webhooks
```

### 2. Testing
```bash
# Backend tests (to be added)
# pytest tests/

# Security scanning
# Run secret scanning in CI/CD
```

### 3. Deployment
See `docs/DEPLOYMENT.md` for detailed deployment instructions including:
- Vercel/Railway deployment
- Environment variable configuration
- Supabase setup (Seoul region)
- Stripe integration

## Best Practices

### 1. PIPC Compliance
- Always log consent with IP and timestamp
- Use Supabase Seoul region for data residency
- Implement proper audit trails
- Use formal Korean (존댓말) in all user-facing text

### 2. Security
- Never expose secrets in code
- Use environment variables for sensitive data
- Enable secret scanning in GitHub Actions
- Follow branch protection rules (require 1+ review)

### 3. UI/UX
- Follow Obangsaek color palette
- Implement glassmorphism on modals, headers, buttons
- Display countdown prominently (days until Jan 22, 2026)
- Ensure mobile-first design (95% of users are mobile)
- Show MSIT and PIPC trust badges

## Getting Help

- **Documentation**: See the `docs/` directory
- **Compliance**: Check `docs/compliance/` for reference materials
- **Issues**: Report bugs or request features on GitHub
- **Contributing**: See `CONTRIBUTING.md` for guidelines

## Next Steps

1. Review the compliance checklist: `docs/compliance/checklist.md`
2. Set up backend environment: `backend/.env`
3. Review deployment guide: `docs/DEPLOYMENT.md`
4. Check Article 31 reference: `docs/compliance/article-31-reference.md`

## Resources

- [Korean AI Basic Act Information](https://www.law.go.kr/)
- [Ministry of Science and ICT](https://www.msit.go.kr/)
- [KISA - AI Security Guidelines](https://www.kisa.or.kr/)

## Disclaimer

This framework provides guidance and tools but does not constitute legal advice. Consult with legal professionals familiar with Korean AI regulations for your specific compliance needs.
