# Korean Payment Methods Setup Guide

This guide explains how to enable Korean-specific payment methods (Kakao Pay, Naver Pay) in Stripe for your Korean AI Compliance SaaS.

## Current Implementation

✅ **Currently Enabled:**
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Korean Cards (`kr_card`)
- Installment payments (up to 12 months)
- KRW currency support

⏳ **Coming Soon:**
- Kakao Pay
- Naver Pay

---

## Why Korean Payment Methods Matter

### Market Expectations
- **90%+ of Korean consumers** prefer local payment methods
- **Kakao Pay** - Used by 35+ million Koreans
- **Naver Pay** - Used by 30+ million Koreans
- **Installments** - Koreans expect 무이자 할부 (interest-free installments)

### Conversion Optimization
Without Korean payment methods, you may lose:
- **60-70% of potential Korean customers**
- **Higher cart abandonment rates**
- **Lower trust** from Korean users

---

## How to Enable Kakao Pay & Naver Pay in Stripe

### Step 1: Enable Payment Methods in Stripe Dashboard

1. **Log in to Stripe Dashboard**: https://dashboard.stripe.com
2. **Go to Settings** → **Payment methods**
3. **Enable Korean payment methods:**
   - ✅ Korean cards (`kr_card`)
   - ⏳ Kakao Pay (contact Stripe support)
   - ⏳ Naver Pay (contact Stripe support)

### Step 2: Contact Stripe Support

Kakao Pay and Naver Pay require:
- **Business verification** in Korea
- **Korean business registration** number
- **Bank account** in Korea

**Contact Stripe:**
- Email: support@stripe.com
- Subject: "Enable Kakao Pay and Naver Pay for Korean Market"
- Include: Your business details and Korean registration info

### Step 3: Update Code (Already Done!)

The code is already configured to support these payment methods:

\`\`\`typescript
// In create-checkout-session/route.ts
const paymentMethodTypes = currency === 'KRW'
  ? ['card', 'kr_card', 'kakao_pay', 'naver_pay']
  : ['card'];
\`\`\`

Once Stripe enables these methods for your account, they will automatically work!

---

## Installment Payments (할부)

### Current Setup

✅ **Up to 12-month installments** for Korean cards

\`\`\`typescript
kr_card: {
  installments: {
    enabled: true,
    plan: {
      count: 12,
      interval: 'month',
      type: 'fixed_count',
    },
  },
}
\`\`\`

### How It Works

1. Korean customer selects KRW currency
2. During Stripe checkout, they choose installment option
3. Options: 일시불 (full payment), 3개월, 6개월, 12개월
4. Card issuer handles the installment processing

### Popular Installment Options

| Term | Korean | Common For |
|------|--------|------------|
| Lump sum | 일시불 | Small purchases |
| 3 months | 3개월 할부 | ₩100K-300K |
| 6 months | 6개월 할부 | ₩300K-600K |
| 12 months | 12개월 할부 | ₩600K+ |

---

## Testing Korean Payments

### Test Cards (Stripe Test Mode)

**Korean Card:**
- Number: `4000 0082 6000 0000`
- Expiry: Any future date
- CVC: Any 3 digits

**Success:**
- Card: `4242 4242 4242 4242`

**Declined:**
- Card: `4000 0000 0000 0002`

### Testing Installments

1. Set currency to **KRW**
2. Use test Korean card: `4000 0082 6000 0000`
3. In Stripe checkout, installment options will appear
4. Select installment term (3, 6, or 12 months)
5. Complete payment

---

## Price Recommendations for Korean Market

### Psychological Pricing in Korea

**Current Pricing:**
- Starter: ₩130,000/월
- Professional: ₩390,000/월

**Recommendations:**
- Use round numbers ending in 0,000
- Avoid 4 (unlucky number in Korea)
- Consider bundles: 3-month, 6-month, annual

**Discount Strategies:**
- Annual plan: 10-20% discount (Korean customers love value)
- Early bird: First 100 customers get special price
- Referral: 친구 추천 (friend referral) discounts

---

## Korean Payment UX Best Practices

### Language
✅ Show payment method names in Korean:
- 신용카드/체크카드
- 카카오페이
- 네이버페이
- 무이자 할부

### Trust Signals
Add these to increase conversions:
- 🔒 SSL 보안 (SSL Security)
- 100% 환불 보장 (100% Refund Guarantee)
- 개인정보 보호 (Privacy Protection)
- Stripe 공인 파트너 (Stripe Certified Partner)

### Success Page
Show in Korean:
- 결제 완료! (Payment Complete!)
- 영수증이 이메일로 발송되었습니다 (Receipt sent to email)
- 고객센터: support@aicomplianceguardian.com

---

## Stripe Fees for Korean Payments

| Payment Method | Stripe Fee |
|----------------|------------|
| International Card | 3.6% + ₩40 |
| Korean Card | 3.4% + ₩40 |
| Kakao Pay | 3.4% + ₩40 |
| Naver Pay | 3.4% + ₩40 |

*Rates may vary - check Stripe Korea pricing*

---

## Next Steps

1. **Contact Stripe** to enable Kakao Pay & Naver Pay
2. **Get Korean business registration** (if needed)
3. **Test** with Korean test cards
4. **Update** .env.local with any new credentials
5. **Launch** to Korean market! 🚀

---

## Resources

- **Stripe Korea Docs**: https://stripe.com/docs/payments/payment-methods/overview#korea
- **Kakao Pay**: https://www.kakaopay.com/
- **Naver Pay**: https://pay.naver.com/
- **Stripe Support**: https://support.stripe.com/

---

**Questions?**

Contact Stripe support or refer to this documentation when implementing Korean payment methods.

*Last updated: November 2025*
