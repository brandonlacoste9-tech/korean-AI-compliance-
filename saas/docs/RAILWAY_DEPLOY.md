# Railway Deployment Guide - Korean AI Compliance SaaS Backend

**목표 (Goal)**: Deploy FastAPI backend to Railway in under 10 minutes
**대상 (Target)**: Backend API (FastAPI + PostgreSQL)
**예상 시간 (Estimated Time)**: 5-10 minutes

---

## Prerequisites (사전 준비사항)

- ✅ GitHub account with repository access
- ✅ Railway account (create at https://railway.app)
- ✅ Stripe API keys (test or live)
- ✅ Resend API key
- ⏱️ Time until AI Basic Act enforcement: **77 days** (January 22, 2026)

---

## Step 1: Create Railway Account (Railway 계정 생성)

1. **Go to Railway**: https://railway.app
2. **Click "Start a New Project"**
3. **Login with GitHub** (recommended for auto-deploy)
4. **Verify email** if prompted

⏱️ **Time**: 1-2 minutes

---

## Step 2: Deploy from GitHub Repository (GitHub에서 배포)

### 2.1 Connect Repository

1. **Click "New Project"** in Railway dashboard
2. **Select "Deploy from GitHub repo"**
3. **Authorize Railway** to access your GitHub repositories
4. **Select repository**: `korean-AI-compliance-`
5. **Select branch**: `saas-bootstrap` (or `main` if merged)

### 2.2 Configure Root Directory

⚠️ **IMPORTANT**: Railway needs to know where your backend code is.

1. **After selecting repo**, Railway will show project settings
2. **Go to Settings** → **Source**
3. **Set Root Directory**: `saas` (or leave blank if deploying whole repo)
   - Railway will automatically detect `nixpacks.toml` in the saas directory

### 2.3 Verify nixpacks.toml Detection

Railway should display:
```
✅ Detected nixpacks.toml
✅ Using Python 3.11
✅ Build provider: Nixpacks
```

If not detected:
- Check that `nixpacks.toml` is in the root of your deploy directory
- Verify file contents match:
  ```toml
  [phases.setup]
  nixPkgs = ["python311"]

  [phases.install]
  cmds = ["cd backend && pip install ."]

  [start]
  cmd = "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  ```

⏱️ **Time**: 2-3 minutes

---

## Step 3: Add PostgreSQL Database (PostgreSQL 데이터베이스 추가)

### 3.1 Add Database Service

1. **In your Railway project**, click **"+ New"**
2. **Select "Database"**
3. **Choose "PostgreSQL"**
4. **Select region**:
   - **Recommended for Korea**: `asia-northeast1` (Tokyo, Japan - closest to Seoul)
   - Alternative: `asia-southeast1` (Singapore)
   - Note: Railway may auto-select based on your location

### 3.2 Database Configuration

Railway will automatically:
- ✅ Create PostgreSQL 15 instance
- ✅ Generate `DATABASE_URL` environment variable
- ✅ Inject `DATABASE_URL` into backend service
- ✅ Set up connection pooling

**No manual configuration needed!**

### 3.3 Verify Database Connection

After database is created:
1. **Go to PostgreSQL service** → **Data** tab
2. **Click "Connect"** to see connection details:
   ```
   Host: containers-us-west-xxx.railway.app
   Port: 5432
   Database: railway
   Username: postgres
   Password: [auto-generated]
   ```

3. **DATABASE_URL format**:
   ```
   postgresql://postgres:[password]@[host]:5432/railway
   ```

⏱️ **Time**: 2 minutes

---

## Step 4: Add Environment Variables (환경 변수 설정)

### 4.1 Navigate to Backend Service

1. **Click on your backend service** (should show "Python" icon)
2. **Go to "Variables" tab**

### 4.2 Add Required Variables

Click **"+ New Variable"** and add each of the following:

#### Core Variables (필수)

```env
# Stripe (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET

# Resend (from https://resend.com/api-keys)
RESEND_API_KEY=re_REPLACE_WITH_YOUR_RESEND_API_KEY

# Security
JWT_SECRET=your_random_secret_key_here

# CORS (use your frontend URL after deploying to Vercel)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://aicomplianceguardian.com
```

#### Optional Variables (선택사항)

```env
# Feature Flags
ENABLE_STRIPE_LIVE=false
SEND_EMAIL_NOTIFICATIONS=true
ENABLE_AI_CHAT=true

# Compliance
PIPC_COMPLIANCE_MODE=strict
AI_SYSTEM_REGISTRATION_REQUIRED=true

# Korean Market
DEFAULT_CURRENCY=KRW
DEFAULT_LANGUAGE=ko
TZ=Asia/Seoul

# Logging
LOG_LEVEL=INFO
```

### 4.3 Important Notes

- ⚠️ **DATABASE_URL** is auto-injected by Railway - **DO NOT manually add it**
- ⚠️ **PORT** is auto-injected by Railway - **DO NOT manually add it**
- 🔒 All variables are encrypted at rest
- 🔒 Mark sensitive values as "Secret" (click eye icon to hide)

⏱️ **Time**: 3-5 minutes

---

## Step 5: Deploy! (배포!)

### 5.1 Trigger Deployment

Railway should automatically deploy when you:
- ✅ Connected GitHub repository
- ✅ Added PostgreSQL database
- ✅ Added environment variables

If not deploying automatically:
1. **Go to Deployments tab**
2. **Click "Deploy"** or **"Redeploy"**

### 5.2 Monitor Deployment

Watch the build logs in real-time:

1. **Click on the active deployment**
2. **View logs**:

Expected output:
```bash
✅ Cloning repository...
✅ Detected nixpacks.toml
✅ Installing Python 3.11...
✅ Running: cd backend && pip install .
✅ Installing dependencies:
   - fastapi
   - uvicorn
   - sqlmodel
   - requests
   - python-dotenv
✅ Build complete!
✅ Starting: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
✅ INFO: Uvicorn running on http://0.0.0.0:8000
✅ INFO: Application startup complete.
✅ Deployment successful!
```

### 5.3 Deployment Time

- **First deploy**: 3-5 minutes
- **Subsequent deploys**: 1-2 minutes (with caching)

⏱️ **Time**: 3-5 minutes

---

## Step 6: Verify Deployment Success (배포 확인)

### 6.1 Get Your Public URL

1. **Go to Settings** → **Networking**
2. **Copy the public URL**:
   ```
   https://your-backend-name.railway.app
   ```

### 6.2 Test Health Endpoint

Open in browser or use curl:
```bash
curl https://your-backend-name.railway.app/healthz
```

**Expected response**:
```json
{
  "status": "healthy"
}
```

✅ If you see this, **your backend is live!**

### 6.3 Test API Documentation

Visit FastAPI auto-generated docs:
```
https://your-backend-name.railway.app/docs
```

You should see:
- ✅ Interactive API documentation (Swagger UI)
- ✅ All endpoints listed:
  - `GET /healthz`
  - `POST /v1/systems`
  - `POST /v1/systems/{id}/score`
  - `GET /v1/regulations/latest`
  - `POST /v1/email/send-welcome`
  - ... and more

### 6.4 Test Email Campaign Endpoint

From `/docs`, try:
1. **Expand `POST /v1/email/health`**
2. **Click "Try it out"**
3. **Click "Execute"**

**Expected response**:
```json
{
  "status": "healthy",
  "service": "email_campaign",
  "resend_configured": true
}
```

⏱️ **Time**: 2 minutes

---

## Step 7: Database Migration (데이터베이스 마이그레이션)

### 7.1 Run Initial Migration

Railway doesn't automatically run migrations. You need to run them manually:

**Option 1: Using Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run python -c "from backend.app.main import engine; from sqlmodel import SQLModel; SQLModel.metadata.create_all(engine)"
```

**Option 2: Add Migration to Build Process**

Update `nixpacks.toml`:
```toml
[phases.setup]
nixPkgs = ["python311"]

[phases.install]
cmds = ["cd backend && pip install ."]

[phases.migrate]
cmds = ["cd backend && python -c \"from app.main import engine; from sqlmodel import SQLModel; SQLModel.metadata.create_all(engine)\""]

[start]
cmd = "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

Then redeploy.

⏱️ **Time**: 2 minutes

---

## Step 8: Enable Custom Domain (Optional) (사용자 정의 도메인)

### 8.1 Add Custom Domain

1. **Go to Settings** → **Networking** → **Custom Domains**
2. **Click "Add Domain"**
3. **Enter**: `api.aicomplianceguardian.com`

### 8.2 Update DNS

Go to your domain registrar and add:

```
Type: CNAME
Name: api
Value: your-backend-name.railway.app
TTL: 3600
```

### 8.3 SSL Certificate

Railway automatically provisions Let's Encrypt SSL certificate:
- ✅ HTTPS enabled automatically
- ✅ Auto-renewal every 90 days
- ✅ No configuration needed

⏱️ **Time**: 5 minutes (+ DNS propagation time: 5-60 minutes)

---

## Step 9: Configure Stripe Webhooks (Stripe 웹훅 설정)

### 9.1 Create Webhook Endpoint

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Enter URL**: `https://your-backend-name.railway.app/webhook/stripe`
4. **Select events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 9.2 Get Webhook Secret

After creating webhook:
1. **Click on the webhook** you just created
2. **Copy "Signing secret"**: `whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET`
3. **Add to Railway**:
   - Go to Variables tab
   - Add: `STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET`

### 9.3 Test Webhook

1. **In Stripe dashboard**, click **"Send test webhook"**
2. **Select event**: `checkout.session.completed`
3. **Click "Send test event"**
4. **Check Railway logs** to verify webhook received

⏱️ **Time**: 3 minutes

---

## Step 10: Enable Auto-Deploy (자동 배포)

### 10.1 Configure Auto-Deploy

Railway automatically deploys when you push to GitHub:

1. **Go to Settings** → **Service**
2. **Verify "Auto-Deploy" is enabled** ✅
3. **Set branch**: `main` or `saas-bootstrap`

### 10.2 Test Auto-Deploy

```bash
# Make a small change
echo "# Test" >> backend/README.md

# Commit and push
git add .
git commit -m "test: verify auto-deploy"
git push origin main

# Watch deployment in Railway dashboard
```

Railway will automatically:
- ✅ Detect new commit
- ✅ Pull latest code
- ✅ Rebuild application
- ✅ Deploy with zero downtime

⏱️ **Time**: 2 minutes

---

## Post-Deployment Checklist (배포 후 체크리스트)

### Functionality Tests (기능 테스트)

- [ ] Health endpoint works: `/healthz`
- [ ] API docs accessible: `/docs`
- [ ] Database connected (check logs for SQLAlchemy connection)
- [ ] Email health check passes: `/v1/email/health`
- [ ] Stripe webhook receives test events
- [ ] CORS configured for frontend domain
- [ ] All environment variables set

### Security Checks (보안 점검)

- [ ] HTTPS enabled (should be automatic)
- [ ] Environment variables marked as secrets
- [ ] JWT_SECRET is strong and unique
- [ ] ALLOWED_ORIGINS restricted to your domains
- [ ] DATABASE_URL not exposed in logs
- [ ] Stripe keys are test keys (for staging) or live keys (for production)

### Korean AI Basic Act Compliance (한국 AI 기본법 준수)

- [ ] Database schema includes compliance fields
- [ ] Risk assessment endpoint functional
- [ ] Registration system ready (Article 31)
- [ ] Email notifications working (deadline reminders)
- [ ] Privacy policy accessible (PIPC requirement)

### Performance & Monitoring (성능 및 모니터링)

- [ ] Response time < 500ms for most endpoints
- [ ] Database queries optimized
- [ ] Logs visible in Railway dashboard
- [ ] Error tracking configured (Sentry optional)

---

## Troubleshooting (문제 해결)

### Build Fails: "pip install . failed"

**Problem**: Can't find `setup.py`

**Solution**:
```bash
# Verify setup.py exists
ls backend/setup.py

# If missing, create it (see DEPLOYMENT.md)
```

### Runtime Error: "DATABASE_URL not found"

**Problem**: PostgreSQL not connected

**Solution**:
1. Verify PostgreSQL service is running in Railway
2. Check that services are in the same project
3. Railway auto-injects DATABASE_URL between services

### Error: "ModuleNotFoundError"

**Problem**: Missing dependency

**Solution**:
```bash
# Add to backend/setup.py
install_requires=[
    "your-missing-package>=1.0.0",
    # ...
]

# Commit and push to trigger redeploy
```

### Webhook Not Receiving Events

**Problem**: Stripe can't reach webhook endpoint

**Solution**:
1. Verify URL is correct: `https://your-app.railway.app/webhook/stripe`
2. Check endpoint exists in your FastAPI app
3. Verify STRIPE_WEBHOOK_SECRET is set
4. Check Railway logs for incoming requests

### Database Connection Timeout

**Problem**: Can't connect to PostgreSQL

**Solution**:
1. Check PostgreSQL service is running
2. Verify DATABASE_URL is injected (Railway logs)
3. Check region match (database and backend should be in same region)
4. Restart backend service

---

## Scaling & Performance (확장 및 성능)

### Vertical Scaling (수직 확장)

Upgrade to more powerful instance:

1. **Go to Settings** → **Resources**
2. **Select plan**:
   - **Hobby**: $5/month (512MB RAM, shared CPU)
   - **Pro**: $20/month (8GB RAM, 8 vCPUs)

### Horizontal Scaling (수평 확장)

Add more instances (coming soon to Railway):
- Currently not supported
- Use load balancer with multiple Railway projects as workaround

### Database Scaling

1. **Go to PostgreSQL service** → **Settings** → **Resources**
2. **Upgrade plan**:
   - **Hobby**: $5/month (1GB storage)
   - **Pro**: $10+/month (more storage, better performance)

### Caching (캐싱)

Add Redis for performance:
1. **Click "+ New"** → **Database** → **Redis**
2. **Connect to backend** (Railway auto-injects REDIS_URL)
3. **Use in your app**:
   ```python
   import redis
   redis_client = redis.from_url(os.getenv("REDIS_URL"))
   ```

---

## Cost Estimates (비용 예상)

### Development/Testing

- **Backend (Hobby)**: $5/month
- **PostgreSQL (Hobby)**: $5/month
- **Total**: **$10/month**

Includes:
- 500 GB network egress
- Always on
- Auto-deploy
- Custom domain

### Production (Low Traffic)

- **Backend (Pro)**: $20/month
- **PostgreSQL (Pro)**: $10/month
- **Redis (optional)**: $5/month
- **Total**: **$30-35/month**

### Production (High Traffic)

- **Backend (Pro)**: $20-50/month
- **PostgreSQL (Pro)**: $25/month
- **Redis**: $10/month
- **Total**: **$55-85/month**

---

## Next Steps (다음 단계)

After backend is deployed:

1. ✅ **Copy Railway URL**: Save for frontend configuration
2. ✅ **Deploy Frontend**: See `VERCEL_DEPLOY.md`
3. ✅ **Configure CORS**: Update `ALLOWED_ORIGINS` with Vercel URL
4. ✅ **Test Full Stack**: Frontend → Backend → Database → Email
5. ✅ **Launch**: 77 days until Korean AI Basic Act enforcement!

---

## Resources (참고 자료)

- **Railway Docs**: https://docs.railway.app
- **Railway Status**: https://status.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway CLI**: https://docs.railway.app/develop/cli
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**Deployment Complete!** 🎉

Your Korean AI Compliance SaaS backend is now live on Railway!

**Backend URL**: `https://your-backend-name.railway.app`

**Total Time**: 15-20 minutes ⏱️

**Next**: Deploy frontend to Vercel (see `VERCEL_DEPLOY.md`)

---

**Questions or issues?** Check Railway docs or GitHub issues.

**화이팅! 🇰🇷** Good luck with your Korean AI compliance SaaS!
