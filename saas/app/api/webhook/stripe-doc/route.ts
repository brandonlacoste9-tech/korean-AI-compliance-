import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const resend = new Resend(process.env.RESEND_API_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_DOC || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract metadata
      const documentType = session.metadata?.documentType;
      const customerEmail = session.customer_details?.email;

      if (!documentType) {
        console.error('No document type in metadata');
        break;
      }

      try {
        // Generate documents automatically
        console.log(`🔄 Auto-generating documents for ${customerEmail}: ${documentType}`);

        // In production, this would:
        // 1. Generate the actual documents
        // 2. Upload to storage
        // 3. Send email with download links
        // 4. Log to database
        // 5. Track analytics

        // Simulate document generation
        const downloadLinks = await generateDocumentsAutomated(documentType, session.id);

        // Send email automatically
        if (customerEmail && process.env.RESEND_API_KEY) {
          await sendDocumentEmail(customerEmail, documentType, downloadLinks);
          console.log(`✅ Documents sent to ${customerEmail}`);
        }

        // Log purchase to database (in production)
        await logPurchase({
          sessionId: session.id,
          customerEmail: customerEmail || '',
          documentType,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          timestamp: new Date().toISOString()
        });

        console.log(`✅ Automated document delivery completed for ${customerEmail}`);

      } catch (error) {
        console.error('Error in automated document generation:', error);
        // Send error notification to admin
        await notifyAdmin('Document generation failed', { session, error });
      }

      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed');
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function generateDocumentsAutomated(documentType: string, sessionId: string): Promise<string[]> {
  // In production, implement actual document generation
  // For now, return placeholder URLs

  const baseUrl = 'https://storage.compliancedocai.com';

  return [
    `${baseUrl}/docs/${sessionId}/${documentType}.pdf`,
    `${baseUrl}/docs/${sessionId}/${documentType}.docx`
  ];
}

async function sendDocumentEmail(email: string, documentType: string, downloadLinks: string[]) {
  const documentNames: Record<string, string> = {
    'risk-assessment': 'AI Risk Assessment Report',
    'transparency-report': 'AI Transparency Report',
    'data-governance': 'Data Governance Policy',
    'audit-log': 'Audit Log System Template',
    'compliance-checklist': 'Full Compliance Checklist',
    'full-package': 'Complete Compliance Package'
  };

  const docName = documentNames[documentType] || documentType;

  try {
    await resend.emails.send({
      from: 'ComplianceDocAI <docs@compliancedocai.com>',
      to: email,
      subject: `✅ Your ${docName} is Ready!`,
      html: `
        <h1>Your documents are ready!</h1>
        <p>Thank you for your purchase. Your ${docName} has been generated and is ready to download.</p>
        <h2>Download Links:</h2>
        <ul>
          ${downloadLinks.map(link => `<li><a href="${link}">${link}</a></li>`).join('')}
        </ul>
        <p>If you have any questions, reply to this email or contact support@compliancedocai.com</p>
      `
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

async function logPurchase(data: any) {
  // In production, save to Supabase or your database
  console.log('📊 Purchase logged:', data);

  // Example Supabase code:
  // const { createClient } = require('@supabase/supabase-js');
  // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  // await supabase.from('document_purchases').insert(data);
}

async function notifyAdmin(subject: string, details: any) {
  console.error(`🚨 ADMIN NOTIFICATION: ${subject}`, details);

  // In production, send email to admin
  if (process.env.ADMIN_EMAIL && process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'System <system@compliancedocai.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 ${subject}`,
        html: `<pre>${JSON.stringify(details, null, 2)}</pre>`
      });
    } catch (error) {
      console.error('Failed to notify admin:', error);
    }
  }
}
