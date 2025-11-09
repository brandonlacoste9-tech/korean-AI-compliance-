# 🏥 Health Check Guide

## ✅ Backend Health Endpoints Added

The following endpoints are now live on your Render backend:

### Available Endpoints:

1. **`GET /healthz`** - Kubernetes-style health check
   ```bash
   curl https://korean-ai-compliance.onrender.com/healthz
   ```

2. **`GET /readiness`** - Readiness probe (returns 200 when ready)
   ```bash
   curl https://korean-ai-compliance.onrender.com/readiness
   ```

3. **`GET /version`** - Version and build information
   ```bash
   curl https://korean-ai-compliance.onrender.com/version
   ```

4. **`GET /health`** - Detailed health metrics (original endpoint)
   ```bash
   curl https://korean-ai-compliance.onrender.com/health
   ```

---

## 🔐 Frontend Vercel Protection Issue

Your Vercel deployment has **authentication protection enabled**. This is why health checks return 401.

### Option 1: Disable Protection (Recommended for Testing)

1. Go to: https://vercel.com/brandons-projects-7c6e25ca/frontend-azexz908h
2. Click **Settings** → **Deployment Protection**
3. Disable protection for preview deployments
4. Save changes

### Option 2: Use Bypass Token

1. Get your bypass token from Vercel:
   - Go to your deployment settings
   - Copy the **Vercel Protection Bypass** token

2. Use it in health checks:
   ```powershell
   $token = "your-bypass-token-here"
   Invoke-WebRequest -Uri "https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$token"
   ```

---

## 🚀 Wait for Render Redeploy

After the commit, Render will automatically redeploy (takes ~2-3 minutes).

### Check Deploy Status:

1. **Render Dashboard**: https://dashboard.render.com
2. Look for your `korean-ai-compliance` service
3. Watch the deployment log
4. Once "Live", test the endpoints

---

## 🧪 Re-run Health Checks (After Redeploy)

```powershell
# Backend health (should work now after redeploy)
Invoke-RestMethod -Uri "https://korean-ai-compliance.onrender.com/healthz"
Invoke-RestMethod -Uri "https://korean-ai-compliance.onrender.com/readiness"
Invoke-RestMethod -Uri "https://korean-ai-compliance.onrender.com/version"

# Frontend (after disabling protection)
Invoke-WebRequest -Uri "https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/" -UseBasicParsing
```

---

## 📊 Expected Results (After Fixes)

### Backend `/healthz`:
```json
{
  "status": "healthy",
  "service": "AI Compliance Guardian API",
  "version": "1.0.0",
  "timestamp": "2025-11-09T07:45:00.000Z",
  "uptime_seconds": 123.45,
  "environment": "production",
  "python_version": "3.13.4",
  "endpoints": {
    "risk_assessment": "/v1/assessments",
    "health": "/health",
    "docs": "/docs"
  }
}
```

### Backend `/readiness`:
```json
{
  "status": "ready"
}
```

### Frontend (200 OK):
Should return HTML with Korean content and Obangsaek design.

---

## ⚠️ Security Warning

**For production**, keep Vercel protection enabled and use bypass tokens only for automated monitoring/CI.

For now (testing phase), disabling protection is fine.
