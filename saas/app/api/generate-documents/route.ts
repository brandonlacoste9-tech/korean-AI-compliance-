import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface DocumentTemplate {
  generatePDF: (data: any) => Promise<string>;
  generateDOCX: (data: any) => Promise<string>;
}

// Document generation functions (simplified - in production, use proper PDF/DOCX libraries)
const generateDocument = async (documentType: string, sessionId: string): Promise<{ pdf: string; docx: string }> => {
  // In production, this would:
  // 1. Fetch customer details from Stripe session
  // 2. Generate actual PDF/DOCX files using templates
  // 3. Upload to S3 or similar storage
  // 4. Return download URLs

  // For now, return placeholder URLs
  return {
    pdf: `https://storage.compliancedocai.com/docs/${sessionId}/${documentType}.pdf`,
    docx: `https://storage.compliancedocai.com/docs/${sessionId}/${documentType}.docx`
  };
};

const documentTemplates: Record<string, { name: string; nameKo: string; description: string }> = {
  'risk-assessment': {
    name: 'AI Risk Assessment Report',
    nameKo: 'AI 위험도 평가 보고서',
    description: 'Comprehensive risk analysis for Korean AI Basic Act compliance'
  },
  'transparency-report': {
    name: 'AI Transparency Report',
    nameKo: 'AI 투명성 보고서',
    description: 'Detailed transparency documentation'
  },
  'data-governance': {
    name: 'Data Governance Policy',
    nameKo: '데이터 거버넌스 정책',
    description: 'Complete data governance framework'
  },
  'audit-log': {
    name: 'Audit Log System Template',
    nameKo: '감사 로그 시스템 템플릿',
    description: 'Ready-to-implement audit logging system'
  },
  'compliance-checklist': {
    name: 'Full Compliance Checklist',
    nameKo: '전체 준법 체크리스트',
    description: 'Exhaustive compliance checklist'
  },
  'full-package': {
    name: 'Complete Compliance Package',
    nameKo: '전체 준법 패키지',
    description: 'All compliance documents bundled'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, documentType, customerEmail } = body;

    if (!sessionId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate documents
    const documents = await generateDocument(documentType, sessionId);

    // Get document info
    const docInfo = documentTemplates[documentType];

    // Prepare download links
    const downloadLinks = [
      { format: 'PDF', url: documents.pdf },
      { format: 'DOCX', url: documents.docx }
    ];

    // If full package, add additional documents
    if (documentType === 'full-package') {
      downloadLinks.push(
        { format: 'Implementation Guide', url: `${documents.pdf}?guide=true` },
        { format: 'Code Templates', url: `${documents.pdf}?code=true` }
      );
    }

    // Send email with download links (if email provided)
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ComplianceDocAI <docs@compliancedocai.com>',
          to: customerEmail,
          subject: `Your ${docInfo.name} is Ready!`,
          html: generateEmailHTML(docInfo, downloadLinks)
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      downloadLinks: downloadLinks.map(link => link.url),
      documentInfo: docInfo
    });

  } catch (error: any) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate documents' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(docInfo: any, downloadLinks: any[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Compliance Documents are Ready</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📄 ComplianceDocAI</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Documents are Ready!</p>
  </div>

  <!-- Success Message -->
  <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
    <div style="font-size: 40px; text-align: center; margin-bottom: 10px;">✓</div>
    <h2 style="margin: 0 0 10px 0; color: #166534; text-align: center; font-size: 20px;">Payment Successful!</h2>
    <p style="margin: 0; color: #166534; text-align: center;">
      Your ${docInfo.nameKo} (${docInfo.name}) is ready to download.
    </p>
  </div>

  <!-- Download Section -->
  <div style="margin-bottom: 30px;">
    <h3 style="color: #1f2937; margin-bottom: 15px;">📥 Download Your Documents:</h3>
    ${downloadLinks.map(link => `
      <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; color: #1f2937;">${link.format}</span>
          <a href="${link.url}" style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Download</a>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- What's Next -->
  <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
    <h3 style="color: #1e40af; margin-top: 0;">🚀 What's Next?</h3>
    <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
      <li style="margin-bottom: 8px;">Review and customize the documents for your company</li>
      <li style="margin-bottom: 8px;">Share with your legal and compliance team</li>
      <li style="margin-bottom: 8px;">Implement recommendations and track progress</li>
      <li style="margin-bottom: 8px;">Schedule regular compliance reviews</li>
    </ol>
  </div>

  <!-- Support -->
  <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #374151;">Need Help?</h3>
    <p style="color: #6b7280; margin-bottom: 15px;">Our team is here to support you</p>
    <a href="mailto:support@compliancedocai.com" style="background: #2563eb; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">📧 Contact Support</a>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p style="margin: 0 0 10px 0;">© 2025 ComplianceDocAI. All rights reserved.</p>
    <p style="margin: 0;">
      <a href="https://compliancedocai.com" style="color: #2563eb; text-decoration: none;">Website</a> •
      <a href="https://compliancedocai.com/support" style="color: #2563eb; text-decoration: none;">Support</a> •
      <a href="https://compliancedocai.com/privacy" style="color: #2563eb; text-decoration: none;">Privacy</a>
    </p>
  </div>

</body>
</html>
  `;
}
