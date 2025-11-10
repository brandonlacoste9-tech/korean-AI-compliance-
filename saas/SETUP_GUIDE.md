# MVP Dashboard Setup Guide
# MVP 대시보드 설정 가이드

This guide will help you set up the MVP Dashboard with all essential features working.

이 가이드는 모든 필수 기능이 작동하는 MVP 대시보드를 설정하는 데 도움을 줍니다.

## Quick Start (빠른 시작)

### 1. Supabase Setup (Supabase 설정)

1. Go to [supabase.com](https://supabase.com) and create a new project
   - Choose **Seoul region** for PIPC compliance
   - 서울 리전을 선택하여 PIPC 준수

2. Copy your project URL and anon key from Settings → API

3. Run the database migration:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `/database/migrations/001_initial_schema.sql`
   - Click "Run"

### 2. Environment Variables (환경 변수)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Stripe (get from Stripe dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### 3. Install Dependencies (의존성 설치)

```bash
npm install
```

### 4. Run the Application (애플리케이션 실행)

```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Backend Setup (백엔드 설정)

In a separate terminal, start the backend:

```bash
cd ../backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Features Implemented (구현된 기능)

### ✅ Authentication (인증)
- Signup with email/password (이메일/비밀번호로 회원가입)
- Login with Supabase Auth (Supabase Auth로 로그인)
- Secure session management (안전한 세션 관리)

### ✅ Dashboard (대시보드)
- Risk score display (위험도 점수 표시)
- Compliance checklist with 5 key items (5개 핵심 항목이 있는 준법 체크리스트)
- Progress tracking (진행률 추적)
- Mark items as complete (항목을 완료로 표시)

### ✅ PDF Generation (PDF 생성)
- Download compliance report (준법 보고서 다운로드)
- Includes risk score and checklist status (위험도 점수 및 체크리스트 상태 포함)

### ✅ Email Automation (이메일 자동화)
- Welcome email on signup (회원가입 시 환영 이메일)
- Backend endpoint for weekly reminders (주간 리마인더를 위한 백엔드 엔드포인트)

### ✅ Stripe Integration (Stripe 연동)
- Payment processing (결제 처리)
- Subscription management (구독 관리)
- Webhook handling (웹훅 처리)

## Database Schema (데이터베이스 스키마)

### Tables:
1. **user_profiles** - User account data (사용자 계정 데이터)
2. **risk_assessments** - Historical risk assessments (과거 위험도 평가)
3. **checklist_templates** - Compliance checklist items (준법 체크리스트 항목)
4. **email_queue** - Automated email campaigns (자동화된 이메일 캠페인)
5. **payment_history** - Stripe payment records (Stripe 결제 기록)

## Testing the MVP (MVP 테스트)

### 1. Create an Account (계정 생성)
1. Go to `/signup`
2. Fill in company name, email, and password
3. Click "회원가입" (Sign Up)
4. Check email for welcome message

### 2. Login (로그인)
1. Go to `/login`
2. Enter credentials
3. Redirected to dashboard

### 3. Use Dashboard (대시보드 사용)
1. View your risk score (위험도 점수 확인)
2. Check compliance progress (준법 진행률 확인)
3. Click checklist items to mark complete (체크리스트 항목 클릭하여 완료 표시)
4. Download PDF report (PDF 보고서 다운로드)

### 4. Test Payment (결제 테스트)
1. Go to pricing page
2. Select a plan
3. Use Stripe test card: 4242 4242 4242 4242
4. Complete checkout

## Deployment (배포)

### Vercel Deployment (Vercel 배포)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend Deployment (백엔드 배포)

Deploy backend to Railway or similar service:

```bash
# Railway CLI
railway up
```

Update `NEXT_PUBLIC_API_URL` to your deployed backend URL.

## Troubleshooting (문제 해결)

### Authentication Issues (인증 문제)
- Check Supabase URL and keys in `.env.local`
- Verify Supabase project is active
- Check browser console for errors

### Email Not Sending (이메일 미전송)
- Verify RESEND_API_KEY in backend `.env`
- Check backend logs for email errors
- Email automation requires backend to be running

### PDF Download Not Working (PDF 다운로드 안 됨)
- Check browser console for jsPDF errors
- Ensure jsPDF is installed: `npm install jspdf`

### Database Errors (데이터베이스 오류)
- Verify SQL migration ran successfully
- Check RLS policies in Supabase
- Ensure user is authenticated before accessing data

## Next Steps (다음 단계)

1. **Weekly Reminders**: Set up a cron job to call `/api/send-weekly-reminders`
2. **Risk Assessment**: Integrate risk assessment form with dashboard
3. **Payment Webhooks**: Test Stripe webhook endpoint thoroughly
4. **Email Templates**: Customize email templates in backend
5. **Mobile Optimization**: Test on mobile devices

## Support (지원)

For issues or questions:
- Email: support@aicomplianceguardian.com
- Documentation: Check `/docs` folder

---

**Status**: MVP Ready for Testing ✅
**Last Updated**: 2025-01-10
