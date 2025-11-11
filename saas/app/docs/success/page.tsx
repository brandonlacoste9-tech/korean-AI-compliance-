"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(true);
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('session_id');
  const docType = searchParams.get('doc');

  useEffect(() => {
    if (sessionId && docType) {
      generateDocuments();
    }
  }, [sessionId, docType]);

  const generateDocuments = async () => {
    try {
      setGenerating(true);

      // Simulate document generation (in production, this would call your doc generation service)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch('/api/generate-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          documentType: docType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate documents');
      }

      setDownloadLinks(data.downloadLinks || []);
    } catch (err: any) {
      console.error('Document generation error:', err);
      setError(err.message || 'Failed to generate documents');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const documentNames: Record<string, { name: string; nameKo: string }> = {
    'risk-assessment': {
      name: 'AI Risk Assessment Report',
      nameKo: 'AI 위험도 평가 보고서'
    },
    'transparency-report': {
      name: 'AI Transparency Report',
      nameKo: 'AI 투명성 보고서'
    },
    'data-governance': {
      name: 'Data Governance Policy',
      nameKo: '데이터 거버넌스 정책'
    },
    'audit-log': {
      name: 'Audit Log System Template',
      nameKo: '감사 로그 시스템 템플릿'
    },
    'compliance-checklist': {
      name: 'Full Compliance Checklist',
      nameKo: '전체 준법 체크리스트'
    },
    'full-package': {
      name: 'Complete Compliance Package',
      nameKo: '전체 준법 패키지'
    }
  };

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Generating Your Documents...
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            AI is creating your compliance documentation
          </p>
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <span>Payment confirmed</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse"></div>
              <span>Generating documents...</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
              <span>Sending email...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = 'mailto:support@compliancedocai.com'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  const docInfo = docType ? documentNames[docType] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl">
                ✓
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your compliance documents are ready
            </p>
            {docInfo && (
              <p className="text-lg text-gray-500">
                {docInfo.nameKo} ({docInfo.name})
              </p>
            )}
          </div>

          {/* Download Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📥 Download Your Documents
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📄</div>
                  <div>
                    <div className="font-semibold text-gray-900">PDF Version</div>
                    <div className="text-sm text-gray-600">Professional format, ready to print</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Download PDF (production: actual file download)')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📝</div>
                  <div>
                    <div className="font-semibold text-gray-900">DOCX Version</div>
                    <div className="text-sm text-gray-600">Editable format, customize as needed</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Download DOCX (production: actual file download)')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                >
                  Download
                </button>
              </div>

              {docType === 'full-package' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">📊</div>
                      <div>
                        <div className="font-semibold text-gray-900">Implementation Guide</div>
                        <div className="text-sm text-gray-600">Step-by-step compliance roadmap</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Download Guide')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                    >
                      Download
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">💻</div>
                      <div>
                        <div className="font-semibold text-gray-900">Code Templates</div>
                        <div className="text-sm text-gray-600">Python & Node.js implementations</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Download Code')}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all"
                    >
                      Download
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📧</div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Email Sent!
                  </div>
                  <p className="text-sm text-gray-600">
                    We've also sent download links to your email. Check your inbox (and spam folder just in case).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">
              🚀 What's Next?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="font-bold">1.</span>
                <span>Review the documents and customize company-specific details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">2.</span>
                <span>Share with your legal and compliance team for review</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">3.</span>
                <span>Implement recommendations and track progress</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">4.</span>
                <span>Schedule regular compliance reviews before the January 2026 deadline</span>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              Our team is here to support you with any questions about your compliance documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = 'mailto:support@compliancedocai.com'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                📧 Email Support
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Upsell Section */}
          {docType !== 'full-package' && (
            <div className="mt-8 bg-purple-50 rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🎁 Complete Your Compliance Suite
                </h3>
                <p className="text-gray-600 mb-6">
                  Get all remaining documents for just $199 (save 50% vs individual purchase)
                </p>
                <button
                  onClick={() => router.push('/docs')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                >
                  Upgrade to Full Package →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
