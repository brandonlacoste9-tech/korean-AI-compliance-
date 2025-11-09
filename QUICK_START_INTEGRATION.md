# 🚀 Quick Start: Complete Frontend-Backend Integration

**Time Required:** 15 minutes
**Difficulty:** Easy (just configuration)

---

## ✅ Your Current Status

- ✅ Backend API **LIVE** on Render: https://korean-ai-compliance.onrender.com
- ✅ Frontend App **LIVE** on Vercel: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app
- ⚠️ **NOT CONNECTED** - Frontend still pointing to localhost

---

## 🎯 3 Steps to Complete Integration

### Step 1: Configure Vercel Environment Variables (5 min)

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Find your project: `frontend`
3. Click **Settings** → **Environment Variables**
4. Add these two variables:

```bash
# Variable 1: Backend API URL
Name:  NEXT_PUBLIC_API_URL
Value: https://korean-ai-compliance.onrender.com

# Variable 2: Stripe Publishable Key
Name:  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51QRGy3BPtBjCLqGrqx... (your Stripe test key)
```

5. Select **All environments** (Production, Preview, Development)
6. Click **Save**

**Get your Stripe key here:**
- Login to https://dashboard.stripe.com/test/apikeys
- Copy the "Publishable key" (starts with `pk_test_`)

---

### Step 2: Configure Render Environment Variables (3 min)

1. Go to **Render Dashboard**: https://dashboard.render.com/
2. Find your service: `korean-ai-compliance`
3. Click **Environment** → **Add Environment Variable**
4. Add this variable:

```bash
# Frontend URL for Stripe redirects
Name:  FRONTEND_URL
Value: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app
```

5. Click **Save**

**Optional (if using live Stripe):**
```bash
Name:  STRIPE_SECRET_KEY
Value: sk_test_... (your Stripe secret key from dashboard)
```

---

### Step 3: Redeploy Frontend (2 min)

Vercel will **automatically redeploy** when you save environment variables!

**Check deployment:**
1. Go to Vercel Dashboard → Deployments
2. Wait for latest deployment to show "Ready" (usually 1-2 minutes)
3. Click the deployment URL to verify

**Or manually trigger:**
```bash
# Empty commit to trigger rebuild
git commit --allow-empty -m "chore: trigger redeploy with env vars"
git push
```

---

## 🧪 Test Your Integration (5 min)

### Test 1: Risk Assessment Form

1. Visit: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/
2. Scroll to "Risk Assessment" section
3. Fill in form:
   - Company: `Test Corp`
   - Email: `test@example.com`
   - AI Usage: `facial recognition for security`
   - Personal Data: ✅ Yes
4. Click **Submit**
5. **Expected:** Success message (not error)

**Verify backend received it:**
- Go to Render Dashboard → Logs
- Look for: `"Risk assessment requested"` with your company name

---

### Test 2: Stripe Checkout

1. Visit: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/pricing
2. Click **"Start Free Trial"** on Professional plan
3. **Expected:** Redirect to Stripe Checkout
4. Check amount shows: **₩390,000** (not ₩39 million!)
5. Use test card: `4242 4242 4242 4242`
6. **Don't complete payment** (unless you want to test fully)

---

### Test 3: Korean Preview Page

1. Visit: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/korean-preview.html
2. **Expected:**
   - Seoul gradient background
   - Countdown timer (ticking every second)
   - MSIT, PIPC, Korea badges
   - Glass-morphic cards
   - Korean text everywhere

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Risk assessment form submits without errors
2. ✅ Render logs show incoming requests from Vercel
3. ✅ Stripe checkout shows correct Korean pricing
4. ✅ Korean preview page displays beautifully
5. ✅ No console errors in browser DevTools

---

## 🐛 Troubleshooting

### Problem: "NEXT_PUBLIC_API_URL is not configured"

**Solution:**
- Environment variable not set in Vercel
- Check Vercel Dashboard → Settings → Environment Variables
- Make sure variable name is EXACTLY: `NEXT_PUBLIC_API_URL`
- Redeploy after adding

### Problem: 403 Forbidden Error

**Solution:**
- This is normal for direct curl requests (Render's DDoS protection)
- Browser requests from frontend should work fine
- Check backend logs for actual errors

### Problem: Stripe shows wrong amount

**Solution:**
- Backend code is correct (₩390,000)
- Clear browser cache
- Check Stripe Dashboard → Payments for actual amount

### Problem: CORS errors in browser

**Solution:**
- Backend CORS already configured for `*.vercel.app`
- Check browser DevTools → Network tab
- Verify request origin matches Vercel URL
- May need to clear browser cache

---

## 📊 How to Monitor

### Check Backend Health

```bash
# In browser or curl
https://korean-ai-compliance.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AI Compliance Guardian API",
  "version": "1.0.0",
  "uptime_seconds": 12345.67,
  "environment": "production"
}
```

### Check Render Logs

1. Render Dashboard → `korean-ai-compliance` service
2. Click **Logs** tab
3. Look for:
   - `"Incoming request"` - API calls being received
   - `"Risk assessment requested"` - Form submissions
   - `"Checkout requested"` - Stripe checkout clicks

### Check Vercel Logs

1. Vercel Dashboard → Your project
2. Click **Deployments** → Latest deployment
3. Click **Function logs**
4. Look for runtime errors

---

## 🚀 Next Steps After Integration

Once you verify everything works:

### 1. Add Custom Domain (Optional)

**For Frontend (Vercel):**
1. Buy domain (e.g., `aicomplianceguardian.kr`)
2. Vercel Dashboard → Settings → Domains
3. Add domain and follow DNS instructions

**For Backend (Render):**
1. Render Dashboard → Settings → Custom Domain
2. Add domain (e.g., `api.aicomplianceguardian.kr`)
3. Update CORS in backend to include new domain

### 2. Deploy Enhancements

Available in `/mnt/user-data/outputs/`:
- Analytics tracking
- SEO meta tags
- Customer testimonials
- Performance optimization

### 3. Go Live with Stripe

1. Get live Stripe keys from dashboard
2. Update env vars in both Render and Vercel
3. Test with real (small) payment
4. Update Stripe webhook URLs

---

## 💡 Pro Tips

1. **Test in Incognito Mode** - Avoids cache issues
2. **Check Browser Console** - F12 → Console for errors
3. **Watch Render Logs Live** - See requests in real-time
4. **Use Vercel Preview URLs** - Test before production
5. **Keep Test Mode** - Don't switch to live Stripe until ready

---

## ✅ Completion Checklist

- [ ] Vercel env vars set (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
- [ ] Render env vars set (`FRONTEND_URL`)
- [ ] Frontend redeployed with new env vars
- [ ] Risk assessment form tested (success)
- [ ] Stripe checkout tested (shows ₩390,000)
- [ ] Korean preview page verified (countdown timer works)
- [ ] No errors in browser console
- [ ] Backend logs show incoming requests

---

## 🎊 You're Done!

**Congratulations!** You now have a fully functional, production-ready Korean AI Compliance SaaS platform! 🚀

**Your Stack:**
- ✅ FastAPI backend on Render
- ✅ Next.js frontend on Vercel
- ✅ PostgreSQL database in Seoul
- ✅ Stripe payment processing
- ✅ Korean enterprise design
- ✅ Zero-downtime deployment

**Time to celebrate!** 🎉
