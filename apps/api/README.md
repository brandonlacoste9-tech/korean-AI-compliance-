# AI Compliance Guardian - API

Korean AI Basic Act & PIPC Compliance SaaS - FastAPI Backend

## 🇰🇷 Overview

FastAPI-based backend API for Korean AI compliance management, with MSIT/PIPC compliance requirements built-in.

## 📋 Features

- **Health Check**: `/health` endpoint for monitoring
- **Risk Assessment**: AI system risk evaluation
- **Badge Verification**: Public compliance badge verification
- **Contact Form**: PIPC-compliant contact handling
- **Audit Logging**: All requests logged for PIPC compliance
- **Seoul Data Residency**: Supabase Seoul region

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- pip or poetry

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

```env
# Environment
ENVIRONMENT=development
LOG_LEVEL=INFO

# Supabase (Seoul Region)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Stripe (KRW only)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

## 📡 API Endpoints

### Core Endpoints

#### Health Check
```
GET /health
```
Returns API health status and compliance information.

#### Root
```
GET /
```
API information and documentation links.

### Risk Assessment

#### Create Risk Assessment
```
POST /api/risk/assess
Content-Type: application/json

{
  "user_id": "user123",
  "organization_id": "org123",
  "ai_system_name": "AI Chatbot",
  "ai_system_type": "conversational",
  "data_types": ["personal", "behavioral"],
  "user_count": 1000
}
```

### Badge Verification

#### Verify Badge
```
GET /api/badge/verify/{badge_id}
```
Public endpoint for verifying compliance badges.

### Contact

#### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "phone": "+82-10-1234-5678",
  "subject": "compliance",
  "message": "I need help with compliance",
  "consent": true
}
```
**Note**: `consent: true` is required (PIPC compliance).

### Compliance Status

#### Get Compliance Status
```
GET /api/compliance/status/{organization_id}
```
Returns current compliance status for an organization.

## 🛡️ Compliance Features

### PIPC Requirements
- ✓ Audit logging for all requests
- ✓ Explicit user consent validation
- ✓ Data residency enforcement (Seoul)
- ✓ Formal Korean language responses
- ✓ 3-year log retention

### MSIT Requirements
- ✓ Risk assessment endpoints
- ✓ AI system classification
- ✓ Transparency reporting
- ✓ Health check monitoring

## 🧪 Development

```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run tests (when implemented)
pytest

# Format code
black app/

# Lint
flake8 app/
```

## 📦 Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Database**: Supabase (PostgreSQL, Seoul)
- **Payments**: Stripe (KRW)
- **Validation**: Pydantic
- **Server**: Uvicorn

## 🔐 Security

- CORS configured for allowed origins only
- Request logging for audit trail
- PIPC consent validation
- Seoul data residency enforcement

## 📄 License

Proprietary - Korean AI Compliance Guardian

---

**Data Residency**: 🇰🇷 Seoul, Republic of Korea  
**Compliance**: MSIT · PIPC · Korean AI Basic Act  
**Languages**: 한국어 (Korean) · English
