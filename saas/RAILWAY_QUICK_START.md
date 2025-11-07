# Railway Deployment - Quick Reference Card

**🚀 Deploy Time**: 15-20 minutes
**📅 Current Time**: 6:35 AM EST
**🎯 Goal**: Backend live by 6:50 AM EST

---

## ✅ DEPLOYMENT CHECKLIST

### Step 1: Open Railway (1 min)
```
https://railway.app/new
```

- [ ] Click "Deploy from GitHub repo"
- [ ] Authorize Railway to access GitHub
- [ ] Select repository: `korean-AI-compliance-`
- [ ] Select branch: `saas-bootstrap`

### Step 2: Configure Project (2 min)

- [ ] **Root Directory**: `saas` (IMPORTANT!)
- [ ] Railway auto-detects `nixpacks.toml` ✅
- [ ] Build provider shows: "Nixpacks" ✅
- [ ] Python version shows: "3.11" ✅

### Step 3: Add PostgreSQL Database (2 min)

- [ ] Click "+ New" → "Database" → "PostgreSQL"
- [ ] **Region**: Select `asia-northeast1` (Tokyo - closest to Korea)
- [ ] Railway auto-generates `DATABASE_URL` ✅
- [ ] Database connects to backend automatically ✅

### Step 4: Add Environment Variables (5-7 min)

**Copy these values** (have them ready):

#### 🔑 Required Variables

```env
# === STRIPE (Get from: https://dashboard.stripe.com/test/apikeys) ===
STRIPE_SECRET_KEY=<YOUR_ACTUAL_STRIPE_SECRET_KEY_HERE>
STRIPE_WEBHOOK_SECRET=<GET_AFTER_CREATING_WEBHOOK>

# === RESEND (Get from: https://resend.com/api-keys) ===
RESEND_API_KEY=<YOUR_ACTUAL_RESEND_API_KEY_HERE>

# === SECURITY ===
JWT_SECRET=<GENERATE_RANDOM_STRING>

# === CORS (Update after deploying frontend to Vercel) ===
ALLOWED_ORIGINS=*
```

#### 🔧 Optional Variables (Good for Production)

```env
ENABLE_STRIPE_LIVE=false
SEND_EMAIL_NOTIFICATIONS=true
PIPC_COMPLIANCE_MODE=strict
DEFAULT_CURRENCY=KRW
DEFAULT_LANGUAGE=ko
TZ=Asia/Seoul
LOG_LEVEL=INFO
```

**⚠️ DO NOT ADD**: Railway auto-injects these:
- `DATABASE_URL` (from PostgreSQL)
- `PORT` (Railway sets automatically)

### Step 5: Deploy! (3-5 min)

- [ ] Railway starts building automatically
- [ ] Watch build logs for:
  ```
  ✅ Detected nixpacks.toml
  ✅ Installing Python 3.11
  ✅ Running: cd backend && pip install .
  ✅ Installing dependencies...
  ✅ Build complete!
  ✅ Starting uvicorn...
  ✅ Deployment successful!
  ```

### Step 6: Verify Deployment (2 min)

After successful deployment:

1. **Get your Railway URL**:
   - Settings → Networking → Copy public URL
   - Example: `https://korean-ai-compliance-production.up.railway.app`

2. **Test health endpoint**:
   ```bash
   curl https://YOUR-BACKEND.railway.app/healthz
   ```
   Expected: `{"status":"healthy"}`

3. **Test API docs**:
   ```
   https://YOUR-BACKEND.railway.app/docs
   ```
   Should show Swagger UI ✅

4. **Test email health**:
   ```bash
   curl https://YOUR-BACKEND.railway.app/v1/email/health
   ```
   Expected: `{"status":"healthy","service":"email_campaign","resend_configured":true}`

---

## 🔐 GET YOUR API KEYS NOW

### Stripe Keys (2 min)

1. Open: https://dashboard.stripe.com/test/apikeys
2. Copy:
   - **Publishable key**: `pk_test_51...` (for frontend later)
   - **Secret key**: `sk_test_51...` (for Railway NOW)

### Resend API Key (2 min)

1. Open: https://resend.com/api-keys
2. Click "Create API Key"
3. Name: "Korean AI Compliance Production"
4. Copy: `re_...`

### Generate JWT Secret (30 sec)

```bash
# Run this in terminal:
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use:
openssl rand -base64 32
```

---

## 📋 ENVIRONMENT VARIABLES - COPY/PASTE READY

**Replace the values** with your actual keys:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
RESEND_API_KEY=re_YOUR_ACTUAL_KEY_HERE
JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
ALLOWED_ORIGINS=*
ENABLE_STRIPE_LIVE=false
SEND_EMAIL_NOTIFICATIONS=true
PIPC_COMPLIANCE_MODE=strict
DEFAULT_CURRENCY=KRW
DEFAULT_LANGUAGE=ko
TZ=Asia/Seoul
LOG_LEVEL=INFO
```

**How to add in Railway**:
1. Click on your backend service
2. Go to "Variables" tab
3. Click "+ New Variable"
4. Add each variable one by one
5. Railway auto-deploys after you add variables

---

## 🚨 TROUBLESHOOTING

### Build Fails: "setup.py not found"

**Fix**:
- Check "Root Directory" is set to `saas`
- Verify `backend/setup.py` exists in GitHub

### Runtime Error: "DATABASE_URL not set"

**Fix**:
- Ensure PostgreSQL service is created
- Both services should be in same Railway project
- Railway auto-injects `DATABASE_URL` between services

### "Module not found" Error

**Fix**:
- Check `backend/setup.py` has all dependencies
- Common missing: `requests`, `python-dotenv`, `fastapi`

### Email Health Check Fails

**Fix**:
- Verify `RESEND_API_KEY` is set in Railway variables
- Check Resend dashboard for API key validity
- Redeploy after adding the key

---

## ⏱️ DEPLOYMENT TIMELINE

- **6:35 AM**: Start Railway setup ✅
- **6:37 AM**: PostgreSQL added
- **6:42 AM**: Environment variables added
- **6:45 AM**: Build starts
- **6:48 AM**: Build completes
- **6:50 AM**: **BACKEND LIVE!** 🎉

---

## 🎯 SUCCESS CRITERIA

Your backend is live when:
- ✅ Railway deployment shows "Success"
- ✅ `/healthz` returns `{"status":"healthy"}`
- ✅ `/docs` shows Swagger UI
- ✅ `/v1/email/health` returns `resend_configured: true`
- ✅ Railway logs show: "Uvicorn running on http://0.0.0.0:8000"

---

## 📝 SAVE YOUR RAILWAY URL

After deployment, **copy and save** your Railway URL:

```
Backend URL: https://________________.railway.app
```

**You'll need this for**:
- Vercel frontend deployment (NEXT_PUBLIC_API_URL)
- Stripe webhook configuration
- Testing the full stack
- Frontend CORS settings

---

## ▶️ NEXT STEPS AFTER RAILWAY

1. ✅ **Copy Railway URL** (from Settings → Networking)
2. ✅ **Update CORS**: Add frontend URL after Vercel deployment
3. ✅ **Configure Stripe Webhooks** (see main deployment guide)
4. ✅ **Deploy Frontend to Vercel** (see VERCEL_DEPLOY.md)

---

## 🇰🇷 COMPLIANCE REMINDER

**77 days until Korean AI Basic Act enforcement** (January 22, 2026)

Your backend will help Korean companies comply with:
- Article 31: AI system registration
- Article 32: Risk management
- Article 33: Pre-deployment review
- PIPC: Privacy protection

---

**Ready?** Open https://railway.app/new and let's go! 🚀

**Questions?** Check the full guide: `docs/RAILWAY_DEPLOY.md`

**화이팅!** (FIGHTING!)
