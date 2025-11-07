# Vercel Deployment Guide - Korean AI Compliance SaaS Frontend

**목표 (Goal)**: Deploy Next.js frontend to Vercel in under 10 minutes
**대상 (Target)**: Frontend (Next.js 14 + React 18 + TypeScript)
**예상 시간 (Estimated Time)**: 5-10 minutes

---

## Prerequisites (사전 준비사항)

- ✅ Backend deployed to Railway (see `RAILWAY_DEPLOY.md`)
- ✅ Backend URL from Railway (e.g., `https://your-backend.railway.app`)
- ✅ Vercel account (create at https://vercel.com)
- ✅ Stripe API keys
- ⏱️ Time until AI Basic Act enforcement: **77 days** (January 22, 2026)

---

## Step 1: Create Vercel Account (Vercel 계정 생성)

1. **Go to Vercel**: https://vercel.com
2. **Click "Sign Up"**
3. **Login with GitHub** (recommended for auto-deploy)
4. **Authorize Vercel** to access your repositories

⏱️ **Time**: 1-2 minutes

---

## Step 2: Import Project from GitHub (GitHub에서 프로젝트 가져오기)

### 2.1 Create New Project

1. **Click "Add New..."** → **"Project"**
2. **Select "Import Git Repository"**
3. **Find your repository**: `korean-AI-compliance-`
4. **Click "Import"**

### 2.2 Configure Project Settings

Vercel will auto-detect Next.js, but you need to configure the root directory:

**Important Settings**:

```
Framework Preset: Next.js
Root Directory: saas (or wherever your package.json is)
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm ci (auto-detected)
Node.js Version: 20.x (recommended)
```

### 2.3 Set Root Directory

⚠️ **CRITICAL**: Your Next.js app is in the `saas` subdirectory, not repo root.

1. **Click "Edit" next to "Root Directory"**
2. **Select `saas`** (or type manually)
3. **Vercel will scan and find**:
   - ✅ `package.json`
   - ✅ `next.config.js` (if exists)
   - ✅ `app/` directory
   - ✅ `components/` directory

⏱️ **Time**: 2-3 minutes

---

## Step 3: Add Environment Variables (환경 변수 설정)

### 3.1 Navigate to Environment Variables

Before deploying:
1. **Scroll down to "Environment Variables"** section
2. **DO NOT deploy yet** - add variables first!

### 3.2 Add Required Variables

Click **"Add"** for each variable below:

#### Backend API Configuration

```env
Name: NEXT_PUBLIC_API_URL
Value: https://your-backend-name.railway.app
Environment: Production, Preview, Development (check all 3)
```

**Replace** `your-backend-name.railway.app` with your actual Railway URL.

#### Stripe Configuration

```env
# Publishable key (safe to expose)
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY
Environment: Production, Preview, Development

# Secret key (server-side only)
Name: STRIPE_SECRET_KEY
Value: sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY
Environment: Production, Preview, Development
```

**For Production**:
- Use `pk_live_...` for publishable key
- Use `sk_live_...` for secret key

#### Stripe Price IDs

```env
# Starter Plan - KRW
Name: NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER_KRW
Value: price_REPLACE_WITH_STARTER_KRW_PRICE_ID

# Starter Plan - USD
Name: NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER_USD
Value: price_REPLACE_WITH_STARTER_USD_PRICE_ID

# Professional Plan - KRW
Name: NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_KRW
Value: price_REPLACE_WITH_PROFESSIONAL_KRW_PRICE_ID

# Professional Plan - USD
Name: NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_USD
Value: price_REPLACE_WITH_PROFESSIONAL_USD_PRICE_ID
```

**Get Price IDs**:
1. Go to https://dashboard.stripe.com/products
2. Create products for each plan
3. Copy the `price_` ID for each (e.g., price_1ABC2DEF3GHI4JKL)

#### Email Service (Optional)

```env
Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxx
Environment: Production, Preview, Development
```

#### Feature Flags

```env
# Enable Korean payment methods
Name: NEXT_PUBLIC_ENABLE_KOREAN_PAYMENTS
Value: true

# Enable installments
Name: NEXT_PUBLIC_ENABLE_INSTALLMENTS
Value: true

# Enable chat widget
Name: NEXT_PUBLIC_ENABLE_CHAT_WIDGET
Value: true

# Default currency
Name: NEXT_PUBLIC_DEFAULT_CURRENCY
Value: KRW

# Default language
Name: NEXT_PUBLIC_DEFAULT_LANGUAGE
Value: ko

# Compliance deadline
Name: NEXT_PUBLIC_COMPLIANCE_DEADLINE
Value: 2026-01-22

# Site URL
Name: NEXT_PUBLIC_SITE_URL
Value: https://aicomplianceguardian.com
```

### 3.3 Environment Variable Best Practices

- ✅ Use `NEXT_PUBLIC_*` for client-side variables
- ✅ Use plain names (no prefix) for server-side secrets
- ✅ Check "Production" for live environment
- ✅ Check "Preview" for PR previews
- ✅ Check "Development" for local dev with `vercel dev`

⏱️ **Time**: 5-7 minutes

---

## Step 4: Deploy! (배포!)

### 4.1 Start Deployment

After adding all environment variables:

1. **Click "Deploy"** button
2. **Vercel will**:
   - ✅ Clone your repository
   - ✅ Install dependencies (`npm ci`)
   - ✅ Run build (`npm run build`)
   - ✅ Deploy to CDN
   - ✅ Generate preview URL

### 4.2 Monitor Build

Watch the build logs:

**Expected output**:
```bash
✅ Cloning repository...
✅ Installing dependencies...
   npm ci --prefer-offline --no-audit
✅ Building application...
   > next build
   ✓ Creating an optimized production build
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages (10/10)
   ✓ Finalizing page optimization
✅ Deployment successful!
```

### 4.3 Build Time

- **First deploy**: 2-4 minutes
- **Subsequent deploys**: 1-2 minutes (with caching)

⏱️ **Time**: 2-4 minutes

---

## Step 5: Verify Deployment (배포 확인)

### 5.1 Get Your URL

After successful deployment:

1. **Vercel provides**:
   - **Production URL**: `https://your-project.vercel.app`
   - **Preview URL** (for PRs): `https://your-project-git-branch.vercel.app`

2. **Copy the URL** for testing

### 5.2 Test Homepage

Visit your production URL:

```
https://your-project.vercel.app
```

**You should see**:
- ✅ Landing page with Korean AI compliance messaging
- ✅ "Start Free Assessment" button
- ✅ Korean and English text displaying correctly
- ✅ Compliance deadline countdown (77 days remaining)

### 5.3 Test Risk Assessment

1. **Click "Start Free Assessment"**
2. **Fill out the form**:
   - Check "Does your AI system process personal data?"
   - Check "Does your AI system impact safety?"
3. **Click "Calculate Risk Score"**
4. **Verify**:
   - ✅ Risk score displays (should be 100/100 for high risk)
   - ✅ Color coding (red for high risk, green for low)
   - ✅ Compliance messaging in Korean

### 5.4 Test Pricing Plans

After risk assessment:

1. **Scroll to pricing section**
2. **Verify**:
   - ✅ Currency toggle (USD/KRW) works
   - ✅ Prices display correctly:
     - Starter: $99/month or ₩130,000/월
     - Professional: $299/month or ₩390,000/월
   - ✅ Installment dropdown appears (when KRW selected)
   - ✅ Korean payment info box shows

### 5.5 Test Stripe Checkout (Optional for now)

⚠️ **Note**: This requires Stripe Price IDs configured.

1. **Click "Get Started" on a plan**
2. **Should redirect to Stripe Checkout** (test mode)
3. **Verify**:
   - ✅ Correct amount shown
   - ✅ Currency matches (KRW or USD)
   - ✅ Korean card option available (if KRW)

**Don't complete payment** - just verify the checkout loads.

⏱️ **Time**: 3-5 minutes

---

## Step 6: Configure Custom Domain (사용자 정의 도메인)

### 6.1 Add Custom Domain

1. **Go to Vercel dashboard** → **Project Settings** → **Domains**
2. **Click "Add Domain"**
3. **Enter your domain**: `aicomplianceguardian.com`
4. **Click "Add"**

### 6.2 Add www Subdomain

Also add:
- `www.aicomplianceguardian.com`

Vercel will automatically redirect www to apex domain.

### 6.3 Update DNS Records

Go to your domain registrar and add:

**For Apex Domain** (aicomplianceguardian.com):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www Subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 6.4 SSL Certificate

Vercel automatically provisions SSL:
- ✅ Free SSL from Let's Encrypt
- ✅ Auto-renewal
- ✅ HTTPS enforced
- ✅ No configuration needed

**DNS propagation**: 5 minutes to 24 hours (usually 10-30 minutes)

⏱️ **Time**: 5 minutes + DNS propagation

---

## Step 7: Connect to Backend (백엔드 연결)

### 7.1 Update CORS in Backend

Your Railway backend needs to allow your Vercel domain:

1. **Go to Railway dashboard** → **Backend service** → **Variables**
2. **Update `ALLOWED_ORIGINS`**:
   ```env
   ALLOWED_ORIGINS=https://your-project.vercel.app,https://aicomplianceguardian.com
   ```
3. **Redeploy backend** (if needed)

### 7.2 Test API Connection

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Visit your Vercel site**
4. **Trigger risk assessment**
5. **Check Network tab for API calls**:
   - ✅ `POST https://your-backend.railway.app/v1/systems/1/score`
   - ✅ Status: 200 OK
   - ✅ Response contains risk assessment data

If you see CORS errors:
- Verify `ALLOWED_ORIGINS` in Railway
- Check API URL in Vercel environment variables
- Redeploy both services

⏱️ **Time**: 3 minutes

---

## Step 8: Enable Auto-Deploy (자동 배포)

### 8.1 Verify Auto-Deploy Settings

Vercel automatically deploys on every git push:

1. **Go to Settings** → **Git**
2. **Verify "Production Branch"**: `main` (or `saas-bootstrap`)
3. **Auto-deploy** is enabled by default ✅

### 8.2 Configure Preview Deployments

For pull requests:

1. **Settings** → **Git** → **Preview Deployments**
2. **Enable "Automatic Preview Deployments"** ✅
3. **Select branches**: All branches

This creates a preview URL for every PR.

### 8.3 Test Auto-Deploy

```bash
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "test: verify auto-deploy"
git push origin main

# Vercel will automatically:
# ✅ Detect push
# ✅ Build new version
# ✅ Deploy to production
# ✅ Notify via email/Slack (if configured)
```

⏱️ **Time**: 2 minutes

---

## Step 9: Configure Analytics (분석 설정)

### 9.1 Enable Vercel Analytics

1. **Go to Analytics tab** in Vercel dashboard
2. **Click "Enable Analytics"** (free tier available)
3. **Features**:
   - ✅ Page view tracking
   - ✅ Performance metrics
   - ✅ Web Vitals (LCP, FID, CLS)
   - ✅ Geographic distribution

### 9.2 Add Google Analytics (Optional)

Add to environment variables:
```env
Name: NEXT_PUBLIC_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
```

Then add to `app/layout.tsx`:
```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

⏱️ **Time**: 2 minutes

---

## Step 10: Set Up Stripe Checkout Success Page (결제 성공 페이지)

### 10.1 Verify Success Page

Your app has a success page at `/success`. Test it:

```
https://your-project.vercel.app/success?session_id=test
```

### 10.2 Configure Stripe Redirect

In Stripe Dashboard:

1. **Go to Products** → Select a product → **Payment links**
2. **Or in API**: When creating checkout session, set:
   ```javascript
   success_url: 'https://your-project.vercel.app/success?session_id={CHECKOUT_SESSION_ID}'
   cancel_url: 'https://your-project.vercel.app'
   ```

This is already configured in your code (`app/api/create-checkout-session/route.ts`).

⏱️ **Time**: 2 minutes

---

## Post-Deployment Checklist (배포 후 체크리스트)

### Functionality Tests (기능 테스트)

- [ ] Homepage loads correctly
- [ ] Risk assessment form works
- [ ] Risk score calculation accurate
- [ ] Pricing plans display correctly
- [ ] Currency toggle (USD/KRW) works
- [ ] Installment selector works (KRW only)
- [ ] Korean payment info displays
- [ ] Stripe checkout redirects (test with test keys)
- [ ] Success page loads
- [ ] Chat widget appears (if enabled)

### Visual/UX Checks (UI/UX 확인)

- [ ] Korean text displays correctly (no broken characters)
- [ ] Fonts load properly
- [ ] Colors match design (blue primary, red for high risk)
- [ ] Mobile responsive (test on phone)
- [ ] Desktop layout correct
- [ ] Loading states work
- [ ] Error messages display
- [ ] Accessibility (keyboard navigation, screen readers)

### Korean Localization (한국어 현지화)

- [ ] All Korean text uses formal language (존댓말)
- [ ] Currency formatting: ₩130,000 (with commas)
- [ ] Date formatting: 2026년 1월 22일
- [ ] Installment terms in Korean: 3개월 할부
- [ ] Payment methods in Korean: 신용카드/체크카드
- [ ] Compliance deadline countdown accurate (77 days)

### SEO & Performance (SEO 및 성능)

- [ ] Page title includes "Korean AI Basic Act"
- [ ] Meta description mentions compliance
- [ ] Open Graph image set
- [ ] Lighthouse score > 90 (Performance)
- [ ] Core Web Vitals: Green
- [ ] Images optimized (use Next.js Image component)

### Security (보안)

- [ ] HTTPS enabled (Vercel automatic)
- [ ] No secrets exposed in client-side code
- [ ] STRIPE_SECRET_KEY only used server-side
- [ ] API calls use HTTPS
- [ ] CORS configured correctly
- [ ] Content Security Policy (CSP) set

---

## Troubleshooting (문제 해결)

### Build Fails: "Module not found"

**Problem**: Missing dependency

**Solution**:
```bash
# Install missing package
npm install missing-package

# Commit and push
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Environment Variables Not Working

**Problem**: Variables not accessible

**Solution**:
1. Verify variable names start with `NEXT_PUBLIC_` for client-side
2. Check "Production" environment is checked
3. Redeploy after adding variables
4. Clear browser cache

### API Calls Fail with CORS Error

**Problem**: Backend rejecting requests

**Solution**:
1. Add Vercel URL to `ALLOWED_ORIGINS` in Railway
2. Format: `https://your-project.vercel.app` (no trailing slash)
3. Include both production and preview URLs
4. Redeploy backend

### Stripe Checkout Not Working

**Problem**: Redirects to 404 or fails

**Solution**:
1. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
2. Check `STRIPE_SECRET_KEY` is set (server-side)
3. Ensure Price IDs are created in Stripe Dashboard
4. Test with Stripe test cards: `4242 4242 4242 4242`

### Korean Characters Display as ���

**Problem**: Encoding issue

**Solution**:
1. Ensure UTF-8 encoding in `app/layout.tsx`:
   ```typescript
   <head>
     <meta charSet="UTF-8" />
   </head>
   ```
2. Check font supports Korean characters
3. Verify Next.js config has `i18n` setup (if using)

### Chat Widget Not Appearing

**Problem**: Component not loading

**Solution**:
1. Check `NEXT_PUBLIC_ENABLE_CHAT_WIDGET=true`
2. Verify ChatWidget component imported in `page.tsx`
3. Check browser console for errors
4. Test on different browsers

---

## Performance Optimization (성능 최적화)

### 1. Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="AI Compliance Guardian"
  width={200}
  height={50}
  priority
/>
```

### 2. Font Optimization

Use `next/font`:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      {children}
    </html>
  )
}
```

### 3. Route Caching

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}
```

---

## Next Steps (다음 단계)

After frontend is deployed:

1. ✅ **Test Full Stack**: Frontend + Backend + Database + Stripe
2. ✅ **Set Up Monitoring**: Vercel Analytics, Sentry
3. ✅ **Configure Email**: Test welcome emails, risk assessment emails
4. ✅ **Add Custom Domain**: Point DNS to Vercel
5. ✅ **Go Live**: Switch Stripe to live mode
6. ✅ **Marketing**: Launch to Korean market! 🚀

---

## Cost Estimates (비용 예상)

### Free Tier (Development)

- **Vercel Hobby**: $0/month
  - Unlimited deployments
  - 100GB bandwidth
  - Free SSL
  - Analytics (limited)

### Pro Tier (Production)

- **Vercel Pro**: $20/month
  - Team collaboration
  - Advanced analytics
  - Increased limits
  - Priority support

**Total Cost (Full Stack)**:
- Backend (Railway): $10-35/month
- Frontend (Vercel): $0-20/month
- **Total**: $10-55/month

---

## Resources (참고 자료)

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Status**: https://vercel-status.com
- **Vercel Community**: https://github.com/vercel/next.js/discussions
- **Vercel Examples**: https://vercel.com/templates/next.js

---

**Deployment Complete!** 🎉

Your Korean AI Compliance SaaS frontend is now live on Vercel!

**Frontend URL**: `https://your-project.vercel.app`
**Backend URL**: `https://your-backend.railway.app`

**Total Time**: 15-20 minutes ⏱️

**Full Stack LIVE!** ✅

---

**77 days until Korean AI Basic Act enforcement** (January 22, 2026)

Start helping Korean companies comply today! 화이팅! 🇰🇷
