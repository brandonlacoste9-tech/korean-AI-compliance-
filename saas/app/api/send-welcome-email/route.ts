import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, companyName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Call backend API to send welcome email
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${backendUrl}/api/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          company_name: companyName,
          language: 'ko',
        }),
      });

      if (!response.ok) {
        console.error('Backend email API failed:', await response.text());
        // Don't fail the request if email fails
      }
    } catch (error) {
      console.error('Failed to send welcome email via backend:', error);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent',
    });
  } catch (error: any) {
    console.error('Error in send-welcome-email API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
