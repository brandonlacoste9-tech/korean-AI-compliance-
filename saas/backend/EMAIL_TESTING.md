# Email Campaign API - Testing Guide

This guide shows how to test all email campaign endpoints in the Korean AI Compliance SaaS.

## Setup

1. **Get Resend API Key**:
   - Go to https://resend.com/api-keys
   - Create a new API key
   - Update `.env.local`:
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

2. **Verify Email Domain** (for production):
   - Add and verify your domain in Resend dashboard
   - Update `FROM_EMAIL` in `email_campaign.py` to use your verified domain

3. **Start Backend**:
   ```bash
   cd C:\Users\north\korean-AI-compliance-\saas\backend
   py -m uvicorn app.main:app --reload --port 8000
   ```

---

## API Endpoints

Base URL: `http://localhost:8000/v1/email`

### 1. Health Check

**Endpoint**: `GET /v1/email/health`

**Test**:
```bash
curl http://localhost:8000/v1/email/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "email_campaign",
  "resend_configured": true
}
```

---

### 2. Send Welcome Email

**Endpoint**: `POST /v1/email/send-welcome`

**Korean Version**:
```bash
curl -X POST http://localhost:8000/v1/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {
      "email": "test@example.com",
      "name": "김철수",
      "language": "ko"
    }
  }'
```

**English Version**:
```bash
curl -X POST http://localhost:8000/v1/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {
      "email": "test@example.com",
      "name": "John Doe",
      "language": "en"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Welcome email sent",
  "email_id": "abc123xyz",
  "timestamp": "2025-01-07T12:00:00"
}
```

---

### 3. Send Risk Assessment Email

**Endpoint**: `POST /v1/email/send-risk-assessment`

**High Risk (>50)**:
```bash
curl -X POST http://localhost:8000/v1/email/send-risk-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {
      "email": "test@example.com",
      "language": "ko"
    },
    "risk_score": 100,
    "system_name": "고객 추천 AI"
  }'
```

**Low Risk (≤50)**:
```bash
curl -X POST http://localhost:8000/v1/email/send-risk-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {
      "email": "test@example.com",
      "language": "ko"
    },
    "risk_score": 25,
    "system_name": "데이터 분석 AI"
  }'
```

---

### 4. Send Compliance Deadline Email

**Endpoint**: `POST /v1/email/send-compliance-deadline`

**Test** (send to multiple recipients):
```bash
curl -X POST http://localhost:8000/v1/email/send-compliance-deadline \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": [
      {
        "email": "ceo@example.com",
        "name": "CEO",
        "language": "ko"
      },
      {
        "email": "compliance@example.com",
        "name": "Compliance Officer",
        "language": "ko"
      }
    ],
    "days_remaining": 90
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Sent 2 emails",
  "results": [
    {
      "email": "ceo@example.com",
      "success": true,
      "email_id": "abc123"
    },
    {
      "email": "compliance@example.com",
      "success": true,
      "email_id": "def456"
    }
  ]
}
```

---

### 5. Send Document Ready Email

**Endpoint**: `POST /v1/email/send-document-ready`

**Test**:
```bash
curl -X POST http://localhost:8000/v1/email/send-document-ready \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {
      "email": "test@example.com",
      "language": "ko"
    },
    "documents": [
      "제32조: 위험 관리 계획서",
      "제33조: 배포 전 검토 보고서",
      "제31조: AI 시스템 등록 문서",
      "제36조: 사고 대응 절차서"
    ]
  }'
```

---

### 6. Send Payment Success Email

**Endpoint**: `POST /v1/email/send-payment-success`

**Test**:
```bash
curl -X POST http://localhost:8000/v1/email/send-payment-success \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {
      "email": "test@example.com",
      "language": "ko"
    },
    "plan_name": "Professional Plan",
    "amount": "₩390,000/월",
    "payment_method": "신용카드 (Visa ****1234)",
    "next_billing_date": "2025-02-07"
  }'
```

---

## Python Testing Script

Save as `test_emails.py` in `saas/backend/`:

```python
import requests
import json

BASE_URL = "http://localhost:8000/v1/email"

def test_health():
    """Test health check endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())
    return response.status_code == 200

def test_welcome_email(email: str = "test@example.com"):
    """Test welcome email"""
    payload = {
        "recipient": {
            "email": email,
            "name": "김철수",
            "language": "ko"
        }
    }
    response = requests.post(f"{BASE_URL}/send-welcome", json=payload)
    print("Welcome Email:", response.json())
    return response.status_code == 200

def test_risk_assessment_email(email: str = "test@example.com", risk_score: int = 100):
    """Test risk assessment email"""
    payload = {
        "recipient": {
            "email": email,
            "language": "ko"
        },
        "risk_score": risk_score,
        "system_name": "고객 추천 AI"
    }
    response = requests.post(f"{BASE_URL}/send-risk-assessment", json=payload)
    print(f"Risk Assessment Email (Score: {risk_score}):", response.json())
    return response.status_code == 200

def test_compliance_deadline(emails: list = ["test@example.com"], days: int = 90):
    """Test compliance deadline email"""
    payload = {
        "recipients": [
            {"email": email, "language": "ko"} for email in emails
        ],
        "days_remaining": days
    }
    response = requests.post(f"{BASE_URL}/send-compliance-deadline", json=payload)
    print(f"Compliance Deadline ({days} days):", response.json())
    return response.status_code == 200

def test_document_ready(email: str = "test@example.com"):
    """Test document ready email"""
    payload = {
        "recipient": {
            "email": email,
            "language": "ko"
        },
        "documents": [
            "제32조: 위험 관리 계획서",
            "제33조: 배포 전 검토 보고서",
            "제31조: AI 시스템 등록 문서"
        ]
    }
    response = requests.post(f"{BASE_URL}/send-document-ready", json=payload)
    print("Document Ready Email:", response.json())
    return response.status_code == 200

def test_payment_success(email: str = "test@example.com"):
    """Test payment success email"""
    payload = {
        "recipient": {
            "email": email,
            "language": "ko"
        },
        "plan_name": "Professional Plan",
        "amount": "₩390,000/월",
        "payment_method": "신용카드 (Visa ****1234)",
        "next_billing_date": "2025-02-07"
    }
    response = requests.post(f"{BASE_URL}/send-payment-success", json=payload)
    print("Payment Success Email:", response.json())
    return response.status_code == 200

if __name__ == "__main__":
    print("=== Email Campaign API Testing ===\n")

    # Replace with your test email
    TEST_EMAIL = "your-email@example.com"

    tests = [
        ("Health Check", test_health),
        ("Welcome Email", lambda: test_welcome_email(TEST_EMAIL)),
        ("High Risk Assessment", lambda: test_risk_assessment_email(TEST_EMAIL, 100)),
        ("Low Risk Assessment", lambda: test_risk_assessment_email(TEST_EMAIL, 25)),
        ("Compliance Deadline", lambda: test_compliance_deadline([TEST_EMAIL], 90)),
        ("Document Ready", lambda: test_document_ready(TEST_EMAIL)),
        ("Payment Success", lambda: test_payment_success(TEST_EMAIL))
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n--- Testing: {test_name} ---")
        try:
            success = test_func()
            results.append((test_name, "✅ PASSED" if success else "❌ FAILED"))
        except Exception as e:
            print(f"Error: {e}")
            results.append((test_name, "❌ ERROR"))

    print("\n\n=== Test Results ===")
    for test_name, result in results:
        print(f"{result} - {test_name}")
```

**Run Tests**:
```bash
cd C:\Users\north\korean-AI-compliance-\saas\backend
py test_emails.py
```

---

## Frontend Integration Examples

### After User Signup (Welcome Email)

Add to your signup handler:

```typescript
// After successful signup
const sendWelcomeEmail = async (userEmail: string, language: 'ko' | 'en' = 'ko') => {
  try {
    const response = await fetch('http://localhost:8000/v1/email/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: {
          email: userEmail,
          language: language
        }
      })
    });

    if (response.ok) {
      console.log('Welcome email sent successfully');
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};
```

### After Risk Assessment

Add to `page.tsx` after risk calculation:

```typescript
const handleAssess = async (formData: FormData) => {
  const highRisk = (formData.get('personal_data') ? 1 : 0) + (formData.get('safety_impact') ? 1 : 0);
  const score = highRisk * 50;
  setRiskScore(score);

  // Send risk assessment email
  const userEmail = "user@example.com"; // Get from auth context
  await fetch('http://localhost:8000/v1/email/send-risk-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { email: userEmail, language: 'ko' },
      risk_score: score,
      system_name: "AI 시스템"
    })
  });
};
```

### After Successful Payment

Add to `success/page.tsx`:

```typescript
useEffect(() => {
  const sendPaymentEmail = async () => {
    const userEmail = "user@example.com"; // Get from Stripe session or auth

    await fetch('http://localhost:8000/v1/email/send-payment-success', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { email: userEmail, language: 'ko' },
        plan_name: "Professional Plan",
        amount: "₩390,000/월",
        payment_method: "신용카드",
        next_billing_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      })
    });
  };

  sendPaymentEmail();
}, []);
```

---

## Scheduled Campaigns (Cron Jobs)

### Compliance Deadline Reminders

Create `saas/backend/cron/send_deadline_reminders.py`:

```python
"""
Scheduled job to send compliance deadline reminders
Run daily: py -m cron.send_deadline_reminders
"""

import requests
from datetime import datetime

DEADLINE_DATE = datetime(2026, 1, 1)  # AI Basic Act full enforcement
API_URL = "http://localhost:8000/v1/email/send-compliance-deadline"

def calculate_days_remaining():
    now = datetime.now()
    delta = DEADLINE_DATE - now
    return delta.days

def get_all_users():
    """Get all registered users from database"""
    # TODO: Query your database for user emails
    return [
        {"email": "user1@example.com", "language": "ko"},
        {"email": "user2@example.com", "language": "ko"},
    ]

def send_reminders():
    days_remaining = calculate_days_remaining()

    # Only send at milestones: 180, 90, 60, 30, 14, 7, 3, 1 days
    milestones = [180, 90, 60, 30, 14, 7, 3, 1]

    if days_remaining not in milestones:
        print(f"Not a milestone day ({days_remaining} days remaining)")
        return

    users = get_all_users()

    payload = {
        "recipients": users,
        "days_remaining": days_remaining
    }

    response = requests.post(API_URL, json=payload)

    if response.status_code == 200:
        print(f"✅ Sent deadline reminders to {len(users)} users ({days_remaining} days remaining)")
    else:
        print(f"❌ Failed to send reminders: {response.text}")

if __name__ == "__main__":
    send_reminders()
```

**Schedule with Windows Task Scheduler** or **cron** on Linux:
```bash
# Run daily at 9 AM
0 9 * * * cd /path/to/saas/backend && py -m cron.send_deadline_reminders
```

---

## Testing Checklist

Before going to production:

- [ ] Resend API key configured in `.env.local`
- [ ] Domain verified in Resend dashboard
- [ ] Update `FROM_EMAIL` to verified domain
- [ ] Test all 6 email endpoints with real email
- [ ] Check spam folders (emails might land there initially)
- [ ] Verify Korean characters display correctly
- [ ] Test unsubscribe links (add if required)
- [ ] Add rate limiting to prevent abuse
- [ ] Monitor Resend dashboard for delivery rates
- [ ] Set up email analytics tracking

---

## Troubleshooting

### "Resend API key not configured"
- Check `.env.local` has `RESEND_API_KEY=re_...`
- Restart FastAPI backend after updating `.env.local`

### Emails not sending
- Check Resend dashboard for errors
- Verify domain is verified (for production)
- Check email doesn't exceed rate limits

### Korean characters broken
- Ensure `Content-Type: application/json; charset=utf-8`
- Check HTML email templates have `<meta charset="UTF-8">`

### Emails in spam
- Add SPF, DKIM, DMARC records to your domain
- Follow Resend's domain verification guide
- Avoid spam trigger words in subject lines

---

**Next Steps:**

1. Get Resend API key: https://resend.com/api-keys
2. Update `.env.local` with your key
3. Run `py test_emails.py` to test all endpoints
4. Integrate email triggers into frontend flows
5. Set up scheduled compliance reminders

**Questions?** Check Resend docs: https://resend.com/docs
