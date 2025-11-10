# Deployment Guide - Korean AI Compliance SaaS

This guide covers deploying your FastAPI backend to Render or other Nixpacks-based platforms.

## Architecture

This deployment uses a **monorepo structure**:
- Frontend: Next.js (separate deployment recommended)
- Backend: FastAPI (deployed via nixpacks.toml)

## Backend Deployment (FastAPI)

### Render Deployment (Recommended)

#### Steps

1. **Create Render Account**: https://render.com

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select `saas` directory as root

3. **Configure Service**:
   ```
   Name: korean-ai-compliance-backend
   Environment: Python 3
   Build Command: cd backend && pip install .
   Start Command: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables**:
   ```env
   DATABASE_URL=postgresql://...
   RESEND_API_KEY=re_...
   STRIPE_SECRET_KEY=sk_live_...
   PYTHON_VERSION=3.11
   ```

5. **Deploy**:
   - Render will build and deploy automatically
   - Free tier available (with limitations)

---

### Option 3: Fly.io

#### Steps

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Initialize Fly App**:
   ```bash
   cd ~/korean-AI-compliance-/saas
   fly launch --no-deploy
   ```

4. **Create fly.toml**:
   ```toml
   app = "korean-ai-compliance"
   primary_region = "nrt"  # Tokyo (closest to Korea)

   [build]
     builder = "paketobuildpacks/builder:base"
     buildpacks = ["gcr.io/paketo-buildpacks/python"]

   [env]
     PORT = "8000"

   [[services]]
     internal_port = 8000
     protocol = "tcp"

     [[services.ports]]
       handlers = ["http"]
       port = 80

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

---

## Frontend Deployment (Next.js)

### Option 1: Vercel (Recommended for Next.js)

1. **Connect GitHub**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select `saas` as root directory

2. **Configure Build**:
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm ci
   Root Directory: saas
   ```

3. **Set Environment Variables**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   RESEND_API_KEY=re_...
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

4. **Deploy**:
   - Vercel will auto-deploy on every git push to main
   - Custom domain supported

### Option 2: Vercel with Render Backend

Deploy frontend on Vercel and backend on Render:

1. **Frontend Service** (Vercel):
   ```
   Build Command: npm run build
   Start Command: npm start
   Root Directory: saas
   ```

2. **Backend Service** (Render):
   Uses existing nixpacks.toml configuration

3. **Link Services**:
   - Set `NEXT_PUBLIC_API_URL` to backend Render URL

---

## Database Setup

### PostgreSQL on Render

1. **Create PostgreSQL Database**:
   - In Render dashboard: "New" → "PostgreSQL"
   - Render auto-generates `DATABASE_URL`

2. **Connect to Backend**:
   - Render automatically injects `DATABASE_URL` env var
   - No additional configuration needed

3. **Run Migrations**:
   ```bash
   # Run migrations after deployment
   python -c "from app.main import engine; from sqlmodel import SQLModel; SQLModel.metadata.create_all(engine)"
   ```

### Supabase (Alternative)

1. **Create Project**: https://supabase.com
2. **Get Connection String**:
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
3. **Set in Environment Variables**

---

## Post-Deployment Checklist

### Backend

- [ ] API health check works: `https://your-api.com/healthz`
- [ ] Database connected successfully
- [ ] Email campaign endpoints working
- [ ] Stripe webhooks configured
- [ ] CORS configured for frontend domain
- [ ] Environment variables set correctly

### Frontend

- [ ] Website loads: `https://your-app.com`
- [ ] Stripe checkout works
- [ ] Risk assessment form works
- [ ] Chat widget functional
- [ ] Both USD and KRW pricing display correctly
- [ ] Korean payment methods available

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Enable Render logs
- [ ] Set up email delivery monitoring (Resend dashboard)

---

## Production Environment Variables

### Backend (.env or Render dashboard)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Email
RESEND_API_KEY=re_your_live_api_key

# Payments
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
PORT=8000
PYTHON_ENV=production
```

### Frontend (Vercel dashboard)

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key

# API
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# Email
RESEND_API_KEY=re_your_live_api_key

# Database (if needed)
DATABASE_URL=postgresql://...
```

---

## Stripe Webhooks Setup

After deployment, configure Stripe webhooks:

1. **Go to Stripe Dashboard**:
   - https://dashboard.stripe.com/webhooks

2. **Add Endpoint**:
   ```
   Endpoint URL: https://your-api.com/webhook/stripe
   Events: checkout.session.completed, payment_intent.succeeded
   ```

3. **Get Webhook Secret**:
   - Copy `whsec_...` signing secret
   - Add to environment variables as `STRIPE_WEBHOOK_SECRET`

4. **Test Webhook**:
   - Stripe provides test events
   - Verify your endpoint receives events

---

## Domain Configuration

### Custom Domain (Render)

1. **Add Custom Domain**:
   - Render dashboard → Settings → Custom Domains
   - Add: `api.aicomplianceguardian.com`

2. **Update DNS**:
   ```
   CNAME api.aicomplianceguardian.com → your-app.onrender.com
   ```

3. **SSL Certificate**:
   - Render auto-generates Let's Encrypt SSL
   - No additional configuration needed

### Custom Domain (Vercel)

1. **Add Domain**:
   - Vercel dashboard → Settings → Domains
   - Add: `aicomplianceguardian.com`

2. **Update DNS** (at your domain registrar):
   ```
   A    @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```

---

## Scaling & Performance

### Render Scaling

- **Vertical Scaling**: Upgrade instance type as needed
- **Horizontal Scaling**: Add more instances with load balancing
- **Database**: Upgrade PostgreSQL plan as needed

### Caching

Add Redis for session/cache:

```python
# In app/main.py
import redis

redis_client = redis.from_url(os.getenv("REDIS_URL"))
```

Render provides Redis addon.

---

## Rollback Strategy

### Render

1. **View Deployments**:
   - Dashboard → Deploys tab

2. **Rollback**:
   - Click previous successful deployment
   - Click "Redeploy"

### Git-Based Rollback

```bash
git revert HEAD
git push origin main
# Auto-deploys previous version
```

---

## Monitoring & Logs

### Render Logs

- Dashboard → Logs tab
- Real-time log streaming
- Download logs for analysis

### Error Tracking (Sentry)

```bash
pip install sentry-sdk[fastapi]
```

```python
# app/main.py
import sentry_sdk

sentry_sdk.init(
    dsn="https://your-dsn@sentry.io/project-id",
    traces_sample_rate=1.0,
)
```

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enabled (Render/Vercel handle automatically)
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled (add middleware)
- [ ] SQL injection prevention (SQLModel handles this)
- [ ] XSS prevention (Next.js handles this)
- [ ] API key rotation strategy
- [ ] Regular dependency updates (`npm audit`, `pip-audit`)

---

## Cost Estimates

### Free Tier (Development)

- **Render**: Free tier (with limitations)
- **Vercel**: Unlimited frontend deployments
- **Supabase**: 500MB database, 2GB bandwidth
- **Resend**: 100 emails/day
- **Stripe**: Free (pay per transaction)

**Total**: ~$0/month for development

### Production (Low Traffic)

- **Render Starter**: $7/month per service
- **Vercel Pro**: $20/month (custom domain + analytics)
- **Resend**: $20/month (50,000 emails)
- **Stripe**: 3.4% + ₩40 per transaction

**Total**: ~$47/month + transaction fees

### Production (Medium Traffic)

- **Render**: $25-85/month (depending on instance type)
- **Vercel**: $20/month
- **Supabase Pro**: $25/month
- **Resend**: $20-80/month
- **CDN**: $10-20/month (Cloudflare)

**Total**: ~$100-230/month

---

## Troubleshooting

### Build Fails

**Error**: `pip install .` fails
- **Fix**: Verify `setup.py` exists in `backend/`
- **Fix**: Check Python version matches `nixpacks.toml`

**Error**: Module not found
- **Fix**: Add missing dependency to `setup.py`

### Runtime Errors

**Error**: Database connection failed
- **Fix**: Verify `DATABASE_URL` environment variable
- **Fix**: Check database is running and accessible

**Error**: Port binding failed
- **Fix**: Use `$PORT` environment variable
- **Fix**: Ensure `--host 0.0.0.0` in start command

### Performance Issues

**Slow API responses**:
- Enable database connection pooling
- Add Redis caching
- Optimize SQL queries
- Use CDN for static assets

---

## Next Steps

1. **Deploy Backend** to Render
2. **Deploy Frontend** to Vercel
3. **Configure Custom Domain**
4. **Set Up Stripe Webhooks**
5. **Enable Monitoring** (Sentry, logs)
6. **Test End-to-End** (signup → payment → email)
7. **Launch** to Korean market! 🚀

---

**Questions?**

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

Good luck with your deployment! 화이팅! 🇰🇷
