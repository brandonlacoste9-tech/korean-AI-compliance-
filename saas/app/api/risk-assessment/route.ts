import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://korean-ai-compliance.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields match backend schema
    const { company_name, email, ai_usage, processes_personal_data } = body;

    if (!company_name || !email || !ai_usage || typeof processes_personal_data !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields. Please provide company_name, email, ai_usage, and processes_personal_data.' },
        { status: 400 }
      );
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/v1/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name,
        email,
        ai_usage,
        processes_personal_data,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || 'Backend error occurred' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Risk assessment error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
