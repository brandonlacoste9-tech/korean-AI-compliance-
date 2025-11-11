import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

interface DocumentPrice {
  price: number;
  name: string;
  description: string;
}

const documentPrices: Record<string, DocumentPrice> = {
  'risk-assessment': {
    price: 14900, // $149 in cents
    name: 'AI Risk Assessment Report',
    description: 'Comprehensive AI risk analysis for Korean AI Basic Act compliance'
  },
  'transparency-report': {
    price: 9900, // $99
    name: 'AI Transparency Report',
    description: 'Detailed transparency documentation for AI system operations'
  },
  'data-governance': {
    price: 12900, // $129
    name: 'Data Governance Policy',
    description: 'Complete data governance framework for PIPC compliance'
  },
  'audit-log': {
    price: 7900, // $79
    name: 'Audit Log System Template',
    description: 'Ready-to-implement audit logging system with code samples'
  },
  'compliance-checklist': {
    price: 4900, // $49
    name: 'Full Compliance Checklist',
    description: 'Exhaustive checklist covering all Korean AI Act requirements'
  },
  'full-package': {
    price: 29900, // $299
    name: 'Complete Compliance Package',
    description: 'All 5 compliance documents bundled (save 40%)'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentType } = body;

    if (!documentType || !documentPrices[documentType]) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    const doc = documentPrices[documentType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: doc.name,
              description: doc.description,
              images: ['https://compliancedocai.com/og-image.png'], // Add your actual image URL
            },
            unit_amount: doc.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/docs/success?session_id={CHECKOUT_SESSION_ID}&doc=${documentType}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/docs`,
      metadata: {
        documentType: documentType,
        productType: 'compliance_document',
      },
      customer_email: body.email || undefined,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
