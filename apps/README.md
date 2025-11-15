# AI Compliance Guardian - Applications

Monorepo structure for Korean AI Basic Act & PIPC Compliance SaaS

## 📁 Structure

```
apps/
├── web/          # Next.js frontend application
└── api/          # FastAPI backend application
```

## 🇰🇷 Korean AI Compliance SaaS

Production-ready applications for complete Korean AI Basic Act and PIPC compliance.

### Web Application (`apps/web/`)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Obangsaek design system
- **i18n**: Korean (KR) first, English (EN) parity
- **Features**: Countdown timer, compliance guides, pricing, dashboard
- **Compliance**: MSIT/PIPC badges, Seoul data residency

### API Application (`apps/api/`)
- **Framework**: FastAPI with Python 3.10+
- **Features**: Risk assessment, badge verification, audit logging
- **Database**: Supabase (Seoul region)
- **Payments**: Stripe (KRW only)
- **Compliance**: PIPC audit logs, MSIT endpoints

## 🚀 Quick Start

### Web Application

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Visit: http://localhost:3000

### API Application

```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs

## 🛡️ Compliance Requirements

### Korean AI Basic Act (2026-01-22)
- ✓ AI system registration and classification
- ✓ Risk assessment and management
- ✓ Transparency and explainability
- ✓ User rights protection
- ✓ Incident reporting

### PIPC (Personal Information Protection Commission)
- ✓ Explicit user consent
- ✓ Data residency (Seoul)
- ✓ Audit logging (3-year retention)
- ✓ Data encryption and security
- ✓ Formal Korean language (존댓말)

### MSIT (Ministry of Science and ICT)
- ✓ High-risk AI system approval
- ✓ Regular compliance audits
- ✓ Standards and guidelines
- ✓ Compliance monitoring

## 🎨 Design System

### Obangsaek (오방색) - Traditional Korean Five Colors
- **백 (Baek/White)**: `#F8F9FA` - Purity, righteousness
- **청 (Cheong/Blue)**: `#003D82` - Spring, growth (MSIT)
- **적 (Jeok/Red)**: `#CD2E3A` - Summer, passion (PIPC)
- **흑 (Heuk/Black)**: `#1A1A1A` - Winter, wisdom
- **황 (Hwang/Yellow)**: `#F7B500` - Earth, balance

### Glassmorphism
Modern UI with frosted glass effects, transparency, and backdrop blur.

## 📋 Atomic PR Workflow

This is **Task #1: Pages Scaffold PR** - Core pages with monorepo structure.

### Remaining Tasks:
1. ✓ **Pages Scaffold** (Current)
2. ⏳ i18n and SEO
3. ⏳ Auth and Data
4. ⏳ Payments
5. ⏳ API Glue
6. ⏳ Compliance Guardrails
7. ⏳ CI/CD
8. ⏳ Documentation

## 🔧 Development

### Prerequisites
- Node.js 20+
- Python 3.10+
- npm/yarn
- pip/poetry

### Environment Setup

Both applications require environment variables. See individual `.env.example` files in each directory.

### Running Tests

```bash
# Web
cd apps/web
npm run test

# API
cd apps/api
pytest
```

## 📦 Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- next-i18next
- Supabase Auth
- Stripe Checkout

### Backend
- FastAPI
- Python 3.10+
- Pydantic
- Supabase
- Stripe

## 📄 License

Proprietary - Korean AI Compliance Guardian

---

**🇰🇷 Data Residency**: Seoul, Republic of Korea  
**Compliance**: MSIT · PIPC · Korean AI Basic Act  
**Deadline**: January 22, 2026  
**Languages**: 한국어 (Korean) · English
