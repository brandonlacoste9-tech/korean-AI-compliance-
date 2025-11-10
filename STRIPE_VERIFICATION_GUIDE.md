# Stripe Payment Integration - Verification & Setup Guide

## ✅ What's Been Fixed

### 1. Stripe Endpoint Correction
- **Fixed**: `/api/stripe/create-checkout` → `/api/stripe/create-checkout-session`
- **Location**: `backend/app/main.py` line 202
- **Status**: ✅ Committed and pushed to main branch
- **Git commit**: `afce7a4 - fix: Correct Stripe endpoint and add webhook handler`

### 2. Webhook Handler Added
- **Endpoint**: `/webhook/stripe`
- **Location**: `backend/app/main.py` lines 292-494
- **Features**:
  - Signature verification (production mode)
  - Development mode fallback (no signature required)
  - Comprehensive event handling
  - Detailed logging for all events
- **Status**: ✅ Committed and pushed to main branch

### 3. Supported Webhook Events
- `checkout.session.completed` - Payment succeeded
- `payment_intent.succeeded` - Payment confirmed
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Subscription cancelled
- `payment_intent.payment_failed` - Payment failures

---

## 🔄 Deployment Status

### Backend (Render)
- **URL**: https://korean-ai-compliance.onrender.com
- **Auto-deploy**: Enabled from `main` branch
- **Last deployment**: Should include commit `c6f5458` with Stripe fixes
- **Status**: ✅ Should be live with corrected endpoints

### Frontend (Vercel)
- **URL**: https://korean-ai-compliance.vercel.app
- **Status**: ✅ Deployed with Stripe checkout integration
- **Missing**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in production

---

## 📋 Remaining Setup Steps

### Step 1: Verify Backend Endpoints (5 minutes)

Test that the Stripe endpoints are working:

```bash
# Test checkout endpoint (should return 422 "Validation Error")
curl -X POST https://korean-ai-compliance.onrender.com/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"plan": "professional", "currency": "krw"}'

# Expected response: 422 with validation errors (this is GOOD - means endpoint exists)
# Bad response: 404 Not Found (would mean endpoint doesn't exist)

# Test webhook endpoint (should return 400 or 422)
curl -X POST https://korean-ai-compliance.onrender.com/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected response: 400 Bad Request (invalid payload - this is GOOD)
# Bad response: 404 Not Found (would mean endpoint doesn't exist)
```

### Step 2: Add Stripe Publishable Key to Vercel (3 minutes)

```bash
# Navigate to frontend directory
cd ~/korean-AI-compliance-/frontend

# Add the environment variable
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# When prompted, enter your Stripe TEST publishable key
# Get it from: https://dashboard.stripe.com/test/apikeys
# Format: pk_test_51...

# Trigger a redeployment
vercel --prod
```

**Alternative (via Vercel Dashboard)**:
1. Go to https://vercel.com/dashboard
2. Select your project: `korean-ai-compliance`
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Value**: `pk_test_51...` (from Stripe dashboard)
   - **Environment**: Production
5. Redeploy the project

### Step 3: Configure Stripe Webhook (5 minutes)

1. **Go to Stripe Dashboard**:
   - Visit: https://dashboard.stripe.com/test/webhooks

2. **Add Endpoint**:
   - Click "Add endpoint"
   - **URL**: `https://korean-ai-compliance.onrender.com/webhook/stripe`
   - **Description**: "Korean AI Compliance Production Webhook"

3. **Select Events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.payment_failed`

4. **Get Webhook Secret**:
   - After creating, click on the webhook
   - Copy the "Signing secret" (starts with `whsec_...`)

5. **Add Secret to Render**:
   ```bash
   # Go to Render dashboard: https://dashboard.render.com
   # Select your service: korean-ai-compliance
   # Go to Environment → Add Environment Variable
   # Name: STRIPE_WEBHOOK_SECRET
   # Value: whsec_... (from step 4)
   # Save and wait for auto-redeploy
   ```

### Step 4: Test Complete Payment Flow (10 minutes)

1. **Visit Frontend**:
   ```
   https://korean-ai-compliance.vercel.app
   ```

2. **Start Checkout**:
   - Scroll to pricing section
   - Click "Get Started" on Professional plan (₩390,000/month)

3. **Complete Test Payment**:
   - Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - Postal code: Any 5 digits (e.g., 12345)

4. **Verify Payment**:
   - Check Stripe Dashboard → Payments
   - Check Render logs for webhook events:
     ```
     "Stripe webhook received"
     "Checkout completed successfully"
     ```

5. **Check Logs**:
   ```bash
   # View Render logs
   # Go to: https://dashboard.render.com
   # Select service → Logs tab
   # Look for:
   # - "Stripe webhook received"
   # - "Processing Stripe event: checkout.session.completed"
   # - "Checkout completed successfully"
   ```

---

## 🐛 Troubleshooting

### Issue: Endpoint returns 404

**Cause**: Backend not deployed with latest changes
**Solution**:
```bash
# Check Render deployment status
# Go to: https://dashboard.render.com
# Verify the latest commit includes: afce7a4 or c6f5458
# If not, manually trigger deployment
```

### Issue: Webhook signature verification failed

**Cause**: Wrong webhook secret or not configured
**Solution**:
1. Verify `STRIPE_WEBHOOK_SECRET` in Render environment
2. Ensure it matches the secret in Stripe Dashboard
3. For testing, webhook will work without secret (dev mode)

### Issue: Payment button doesn't work

**Cause**: Missing Stripe publishable key on Vercel
**Solution**: Complete Step 2 above to add the key

### Issue: Checkout session creation fails

**Check**: Backend logs for error details
```bash
# Common issues:
# - Invalid Stripe API key
# - Incorrect price amount
# - CORS errors (if calling from wrong domain)
```

---

## 📊 Current Environment Variables

### Backend (Render)
✅ `ENVIRONMENT` = production
✅ `FRONTEND_URL` = https://korean-ai-compliance.vercel.app
✅ `JWT_SECRET` = (set)
✅ `RESEND_API_KEY` = (set)
✅ `STRIPE_SECRET_KEY` = (set)
❌ `STRIPE_WEBHOOK_SECRET` = **NEEDS TO BE ADDED** (Step 3)

### Frontend (Vercel)
✅ `NEXT_PUBLIC_API_URL` = https://korean-ai-compliance.onrender.com
❌ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = **NEEDS TO BE ADDED** (Step 2)

---

## 🎯 Success Criteria

Your Stripe integration is fully working when:

1. ✅ Backend endpoint returns 422 (not 404) for `/api/stripe/create-checkout-session`
2. ✅ Webhook endpoint returns 400/422 (not 404) for `/webhook/stripe`
3. ✅ Clicking "Get Started" opens Stripe Checkout modal
4. ✅ Test payment completes successfully
5. ✅ Webhook events appear in Render logs
6. ✅ Payment appears in Stripe Dashboard

---

## 🔗 Quick Links

- **Stripe Dashboard**: https://dashboard.stripe.com/test
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Backend URL**: https://korean-ai-compliance.onrender.com
- **Frontend URL**: https://korean-ai-compliance.vercel.app
- **Backend Logs**: https://dashboard.render.com/web/[your-service]/logs
- **Test Cards**: https://stripe.com/docs/testing#cards

---

## 📝 Notes

- All fixes have been committed to the `main` branch
- Render should auto-deploy from `main` branch
- The webhook handler includes development mode (no signature verification) for easy testing
- Production mode requires `STRIPE_WEBHOOK_SECRET` for security
- Using KRW (₩390,000 = ~$320 USD) for Korean market
- Frontend includes countdown timer to Korean AI Act deadline: January 22, 2026

---

## 🚀 Next Steps After Setup

Once Stripe is fully working:

1. **Connect Supabase Database**:
   - Store user accounts and subscriptions
   - Link payments to user records
   - Enable data persistence

2. **Implement Email Notifications**:
   - Welcome email after signup
   - Payment confirmation emails
   - Subscription renewal reminders

3. **Add User Dashboard**:
   - View subscription status
   - Manage payment methods
   - Download invoices

4. **Enable Production Mode**:
   - Replace test Stripe keys with live keys
   - Update webhook to use production endpoint
   - Test with real payment methods

---

*Last updated: 2025-11-10*
*Git commit: c6f5458 (main branch)*
