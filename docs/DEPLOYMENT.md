# Deployment Guide (Vercel, Railway, Supabase Seoul, Stripe KRW)

## Backend (FastAPI, Railway)
1. Set up Railway project (Python 3.11, FastAPI, Supabase dependency)
2. .env:
   - SUPABASE_URL (Seoul region)
   - SUPABASE_KEY
   - STRIPE_SECRET_KEY (KRW)
   - EMAIL_API_KEY (Resend)
3. Deploy to Railway, enable auto-deploy on main push
4. PIPC audit: logs to local file (Seoul residency, immutable)

## Frontend (Next.js, Vercel)
1. Fork frontend, connect Vercel, configure next-i18next (ko/en)
2. Add Obangsaek CSS variables, glassmorphism effect
3. Add MSIT, PIPC, Stripe badges, deadline counter
4. Deploy on Vercel on push to main, production domain

## Stripe, Email, Supabase
- Enable Stripe for KRW
- Use Resend for formal email templates (존댓말)
- Ensure Supabase is set to Seoul region for storage, logging

## CI/CD (GitHub Actions)
- `.github/workflows/deploy.yml`
    - Test backend (`pytest`)
    - Test frontend (`npm test`)
    - Deploy Vercel and Railway on `main`
    - Secret scanning enabled (Enterprise)
    - Branch protection (require review)

## Access & Compliance
- All endpoints/environments must follow 준수 (compliance) and formal Korean wording
- Audit logs, endpoints, and DB must prove PIPC compliance for MSIT audits

---