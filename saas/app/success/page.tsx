"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // You can verify the session on your backend here
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Welcome to AI Compliance Guardian!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your subscription has been successfully activated.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">What's Next?</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span>Check your email for your login credentials and setup instructions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span>Access your compliance dashboard to register your AI systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span>Start generating compliance reports for the Korean AI Basic Act</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                <span>Set up automated monitoring and alerts</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <a
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Go to Dashboard
            </a>
            <div>
              <a href="/systems" className="text-blue-600 hover:underline">
                Register Your First AI System →
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@aicomplianceguardian.com" className="text-blue-600 hover:underline">
                support@aicomplianceguardian.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
