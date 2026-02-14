# Korean AI Compliance Guardian

한국형 AI 기본법 & PIPC 준수 SaaS — Automated compliance for the Korean AI Basic Act

**🇰🇷 Law Effective:** January 22, 2026  
**💰 Penalties:** Up to KRW 30 million ($20,400 USD)  
**🌍 Scope:** Extraterritorial — foreign companies serving Korean users

---

## ✅ Compliance Features

### Implemented

| Feature | Description | Endpoint |
|---------|-------------|----------|
| **PIPC Audit Logging** | Real-time consent, data access, AI processing logs | `/api/v1/audit-logs` |
| **Consent Capture** | User consent with IP, timestamp, method | `/api/v1/consent` |
| **AI Processing Logs** | Model decisions with reasoning, confidence | `/api/v1/ai-processing-logs` |
| **CSV Export** | MSIT/PIPC inspection-ready reports | `/api/v1/audit-logs/export` |
| **3-Year Retention** | Automatic purge of old records | `/api/v1/retention/purge` |
| **Data Portability** | User data export (GDPR/PIPC Art. 20) | `/api/v1/user-data/{id}` |
| **API Key Auth** | Protected admin endpoints | `X-API-Key` header |
| **Rate Limiting** | 100 req/min per IP | Built-in |
| **Stealth Scanner** | Check client compliance | Browser automation |
| **Trust Badges** | MSIT, PIPC, ISO 42001 | Frontend |

### Ready to Use

| Feature | Description |
|---------|-------------|
| **Risk Assessment** | Classify AI as High-Impact or General Use |
| **Impact Assessments** | Fundamental rights assessment templates |
| **Disclosure Templates** | AI notification banners, badges |
| **Korean Representative** | Directory service (optional) |

---

## 🚀 Quickstart

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure: DATABASE_URL, STRIPE_SECRET_KEY, INTERNAL_API_KEY
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Public
- `POST /api/v1/consent` — Record user consent
- `POST /api/stripe/create-checkout-session` — Create subscription

### Protected (require `X-API-Key`)
- `GET /api/v1/audit-logs` — Query audit trail
- `GET /api/v1/consent` — Query consent logs
- `GET /api/v1/audit-logs/export` — Export CSV
- `GET /api/v1/user-data/{id}` — Export user data
- `DELETE /api/v1/retention/purge` — Purge old records
- `POST /api/v1/compliance/check` — Check website

---

## 🌍 Deployment

- **Frontend:** Vercel
- **Backend:** Railway/Render
- **Database:** Supabase (Seoul region)
- **Payments:** Stripe (KRW)

---

## 📚 Documentation

- [Compliance Checklist](./docs/KOREAN_AI_ACT_CHECKLIST.md)
- [Privacy Policy (KO)](./docs/compliance/privacy-policy-ko.md)
- [Terms of Service (KO)](./docs/compliance/terms-of-service-ko.md)
- [Customer Verification Guide](./docs/compliance/customer-verification-guide.md)

---

## 💼 Revenue Model

- **SaaS Subscription:** ₩99,000/month (Basic), ₩299,000/month (Pro)
- **Stripe KRW** for Korean customers
- **Public procurement** advantage for compliant companies

---

*Made with ❤️ for Quebec & Korea | 한국 & 퀘벡*
