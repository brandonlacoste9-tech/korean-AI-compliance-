import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      payment_method_options: Object.keys(paymentMethodOptions).length > 0 ? paymentMethodOptions : undefined,
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
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
