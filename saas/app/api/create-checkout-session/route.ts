import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { plan, riskScore, currency = 'USD' } = await request.json();

    // Define pricing based on plan and currency
    const pricesUSD: Record<string, number> = {
      starter: 9900, // $99 in cents
      professional: 29900, // $299 in cents
      enterprise: 0, // Contact sales
    };

    const pricesKRW: Record<string, number> = {
      starter: 130000, // ₩130,000 (already in won)
      professional: 390000, // ₩390,000
      enterprise: 0, // Contact sales
    };

    const prices = currency === 'KRW' ? pricesKRW : pricesUSD;
    const currencyCode = currency === 'KRW' ? 'krw' : 'usd';

    if (!prices[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Korean payment methods for KRW currency
    const paymentMethodTypes = currency === 'KRW'
      ? ['card', 'kr_card'] // kakao_pay and naver_pay require additional setup in Stripe
      : ['card'];

    // Payment method configuration for Korean market
    const paymentMethodOptions = currency === 'KRW' ? {
      kr_card: {
        installments: {
          enabled: true,
          plan: {
            count: 12, // Allow up to 12 month installments
            interval: 'month',
            type: 'fixed_count',
          },
        },
      },
    } : {};

    // Create Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes as any,
      line_items: [
        {
          price_data: {
            currency: currencyCode,
            product_data: {
              name: `AI Compliance Guardian - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              description: `Korean AI Basic Act Compliance Platform (Risk Score: ${riskScore}/100)`,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: prices[plan],
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      metadata: {
        plan,
        riskScore: String(riskScore),
        currency,
        market: currency === 'KRW' ? 'Korea' : 'International',
      },
    };

    // Add payment method options if available
    if (Object.keys(paymentMethodOptions).length > 0) {
      sessionParams.payment_method_options = paymentMethodOptions as any;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
