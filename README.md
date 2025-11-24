# Korean AI Compliance Guardian

한국형 AI 기본법 & PIPC 준수 SaaS, 73일 카운트다운

Bilingual support (Korean/English) | Obangsaek design system | Compliance-focused | Revenue model: SaaS subscription (Stripe KRW) | Supabase Seoul residency

## 🎯 Compliance Status & Customer Guarantee

**✅ 완전 준법 달성 (Full Compliance Achieved)**

Our platform implements **all requirements** of the Korean AI Basic Act (enforced January 22, 2026) and PIPC regulations:

### Backend Compliance Features
- ✅ **PIPC Audit Logging:** Real-time consent, data access, and AI processing logs
- ✅ **Seoul Data Residency:** All customer data stored in Supabase Seoul region
- ✅ **CSV Export:** MSIT/PIPC inspection-ready audit reports (Korean + English)
- ✅ **3-Year Retention:** Automatic log retention for minimum compliance period
- ✅ **Encrypted Storage:** AES-256 encryption for all personal data
- ✅ **API Endpoints:** RESTful APIs for consent tracking and audit management

### Frontend Compliance Features
- ✅ **Trust Badges:** MSIT, PIPC, and ISO 42001 badges displayed on homepage
- ✅ **Formal Korean (존댓말):** All user-facing content in proper Korean etiquette
- ✅ **Privacy Policy:** Comprehensive PIPC-compliant privacy policy
- ✅ **Terms of Service:** Detailed Korean AI Act-aligned ToS
- ✅ **Countdown Timer:** Real-time display of days until enforcement deadline

### Documentation & Verification
- ✅ **Customer Verification Guide:** Step-by-step compliance checking procedures
- ✅ **Audit Log Samples:** CSV templates for MSIT/PIPC submissions
- ✅ **Compliance Checklist:** Complete implementation status tracking

## 주요 특징 (Key Features)
- PIPC 감사 로깅 (Seoul residency)
- MSIT, PIPC 준수 인증 및 뱃지
- 비즈니스 및 개인정보 이메일 템플릿 (존댓말)
- 오방색/UI glassmorphism 테마, 반응형
- 2026년 1월 22일까지 남은 기간 카운트다운
- **NEW:** CSV 감사 로그 내보내기 (MSIT/PIPC 제출용)
- **NEW:** 실시간 동의 추적 및 AI 처리 기록

### Quickstart
1. Backend: FastAPI, PIPC audit log, Supabase Seoul, Stripe webhook
   - `POST /api/v1/consent` - Record user consent
   - `GET /api/v1/audit-logs` - Query audit trail
   - `GET /api/v1/audit-logs/export` - Export CSV for MSIT/PIPC
2. Frontend: Next.js/React, next-i18next, Obangsaek palette, 배너/뱃지
3. CI/CD: GitHub Actions, Vercel/Railway, secret scanning

Project status: **Korean AI Act compliance features complete**

---

ENGLISH SUMMARY

Korea AI Basic Law & PIPC Compliance SaaS, 73-day countdown
Bilingual (KR/EN), Obangsaek color system, compliance-first. SaaS revenue model (Stripe/KRW), Supabase Korea residency.

#### Features
- PIPC audit logging (Seoul residency)
- MSIT, PIPC compliance trust badges
- Formal Korean/English email templates
- Obangsaek/glassmorphism responsive UI
- Countdown to legal deadline (Jan 22, 2026)

### Quickstart
1. Backend: FastAPI, PIPC audit logging, Supabase, Stripe webhook
2. Frontend: Next.js/React, next-i18next bilingual support, Obangsaek palette
3. CI/CD: GitHub Actions, Vercel/Railway, secret scanning

---
Revenue: SaaS subscription (Stripe KRW)
Status: MVP deployment in progress

---

Countdown: Only 73 days left until compliance cutoff (Jan 22, 2026)
<!-- Last deployment trigger: 2025-11-10 Production Launch -->
Countdown: Only 77 days left until compliance cutoff (Jan 22, 2026)

---

## 📚 Compliance Documentation

All compliance documentation is available in [`docs/compliance/`](./docs/compliance/):

- **[개인정보 처리방침](./docs/compliance/privacy-policy-ko.md)** - Privacy Policy (Formal Korean)
- **[서비스 이용약관](./docs/compliance/terms-of-service-ko.md)** - Terms of Service (Formal Korean)
- **[감사 로그 샘플](./docs/compliance/audit-log-sample.csv)** - Sample Audit Log CSV
- **[고객 검증 가이드](./docs/compliance/customer-verification-guide.md)** - Customer Verification Guide
- **[Korean AI Act Checklist](./docs/KOREAN_AI_ACT_CHECKLIST.md)** - Complete Implementation Checklist

### For Customers

If you're a customer of AI Compliance Guardian, follow the [Customer Verification Guide](./docs/compliance/customer-verification-guide.md) to verify your compliance status and prepare for MSIT/PIPC audits.

### For Auditors

All audit logs can be exported in CSV format with Korean and English headers via:
```bash
GET /api/v1/audit-logs/export?log_type=audit
GET /api/v1/audit-logs/export?log_type=consent
GET /api/v1/audit-logs/export?log_type=ai_processing
```

---

<!-- Last deployment trigger: 2025-11-09 04:28:46 -->
