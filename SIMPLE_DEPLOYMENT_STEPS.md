# 🚀 Simple Deployment Steps

## Step 1: Vercel (5 minutes)

1. Open browser → https://vercel.com/dashboard
2. Find your project called `frontend`
3. Click on it
4. Click "Settings" (top navigation)
5. Click "Environment Variables" (left sidebar)
6. Click "Add New" button
7. Add these TWO variables:

**Variable 1:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://korean-ai-compliance.onrender.com
```
Click "Add"

**Variable 2:**
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: [Get from https://dashboard.stripe.com/test/apikeys]
```
Click "Add"

8. Vercel will automatically redeploy (wait 2 minutes)

---

## Step 2: Render (3 minutes)

1. Open browser → https://dashboard.render.com
2. Find your service called `korean-ai-compliance`
3. Click on it
4. Click "Environment" (left sidebar)
5. Click "Add Environment Variable"
6. Add this ONE variable:

```
Name: FRONTEND_URL
Value: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app
```

7. Click "Save Changes"

---

## Step 3: Test (5 minutes)

1. Wait for Vercel deployment to finish
2. Visit: https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app
3. Check for:
   - ✅ Social proof badges at top
   - ✅ Countdown timer ticking
   - ✅ Testimonials at bottom
   - ✅ No errors in browser console (F12)

4. Test the risk assessment form:
   - Fill it out
   - Submit
   - Should show success message

5. Test Stripe:
   - Go to /pricing
   - Click "Start Free Trial"
   - Should redirect to Stripe showing ₩390,000

---

## ✅ Done!

Your Korean AI Compliance SaaS is now LIVE! 🎉
