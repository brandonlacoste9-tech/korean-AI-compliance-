"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentType {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  price: number;
  deliveryTime: string;
  icon: string;
  features: string[];
}

export default function DocsGeneratorPage() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const documentTypes: DocumentType[] = [
    {
      id: 'risk-assessment',
      name: 'AI Risk Assessment Report',
      nameKo: 'AI 위험도 평가 보고서',
      description: 'Comprehensive risk analysis for your AI systems under Korean AI Basic Act',
      descriptionKo: 'AI 기본법 준수를 위한 종합 위험도 분석 보고서',
      price: 149,
      deliveryTime: 'Instant delivery',
      icon: '📊',
      features: [
        'Risk scoring and classification',
        'Regulatory compliance mapping',
        'Mitigation recommendations',
        'Korean & English versions',
        'PDF + DOCX formats'
      ]
    },
    {
      id: 'transparency-report',
      name: 'AI Transparency Report',
      nameKo: 'AI 투명성 보고서',
      description: 'Detailed transparency documentation for AI system operations',
      descriptionKo: 'AI 시스템 운영의 투명성을 위한 상세 문서',
      price: 99,
      deliveryTime: 'Instant delivery',
      icon: '🔍',
      features: [
        'Model architecture disclosure',
        'Training data documentation',
        'Decision-making process',
        'Bias and fairness analysis',
        'User-friendly format'
      ]
    },
    {
      id: 'data-governance',
      name: 'Data Governance Policy',
      nameKo: '데이터 거버넌스 정책',
      description: 'Complete data governance framework for PIPC compliance',
      descriptionKo: 'PIPC 준수를 위한 완전한 데이터 거버넌스 프레임워크',
      price: 129,
      deliveryTime: 'Instant delivery',
      icon: '🛡️',
      features: [
        'Data collection policies',
        'Storage and security protocols',
        'Access control guidelines',
        'Data retention schedules',
        'Privacy impact assessment'
      ]
    },
    {
      id: 'audit-log',
      name: 'Audit Log System Template',
      nameKo: '감사 로그 시스템 템플릿',
      description: 'Ready-to-implement audit logging system with code samples',
      descriptionKo: '즉시 구현 가능한 감사 로깅 시스템 및 코드 샘플',
      price: 79,
      deliveryTime: 'Instant delivery',
      icon: '📝',
      features: [
        'Database schema templates',
        'Python/Node.js code samples',
        'Log retention policies',
        'Search and reporting tools',
        'Integration guidelines'
      ]
    },
    {
      id: 'compliance-checklist',
      name: 'Full Compliance Checklist',
      nameKo: '전체 준법 체크리스트',
      description: 'Exhaustive checklist covering all Korean AI Act requirements',
      descriptionKo: 'AI 기본법 모든 요구사항을 망라한 체크리스트',
      price: 49,
      deliveryTime: 'Instant delivery',
      icon: '✅',
      features: [
        'Article-by-article breakdown',
        'Implementation timeline',
        'Priority recommendations',
        'Progress tracking template',
        'Regular updates included'
      ]
    },
    {
      id: 'full-package',
      name: 'Complete Compliance Package',
      nameKo: '전체 준법 패키지',
      description: 'All documents bundled at 40% discount',
      descriptionKo: '모든 문서 40% 할인 번들',
      price: 299,
      deliveryTime: 'Instant delivery',
      icon: '🎁',
      features: [
        'All 5 documents included',
        '6 months of updates',
        'Priority email support',
        'Custom company branding',
        'Save $206 vs individual'
      ]
    }
  ];

  const handlePurchase = async (docId: string) => {
    setLoading(true);
    setSelectedDoc(docId);

    try {
      const response = await fetch('/api/create-doc-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: docId })
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
      setSelectedDoc(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                📄 ComplianceDocAI
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Compliance Documentation in Minutes</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            🚀 Trusted by 500+ Korean companies
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900 leading-tight">
            Generate Korean AI Act
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Compliance Documents
            </span>
            <br />
            in Minutes, Not Weeks
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop paying $5K-$50K for manual compliance documentation. Our AI generates
            professional, legally-vetted documents instantly for 95% less.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Instant delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>No subscription needed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>100% refund guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">$299</div>
            <div className="text-sm text-gray-600">vs $15,000 traditional</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl font-black text-purple-600 mb-2">5 min</div>
            <div className="text-sm text-gray-600">vs 3-6 weeks manual</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl font-black text-green-600 mb-2">500+</div>
            <div className="text-sm text-gray-600">companies served</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl font-black text-red-600 mb-2">437</div>
            <div className="text-sm text-gray-600">days until deadline</div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-black text-gray-900 mb-4">
            Choose Your Document
          </h3>
          <p className="text-xl text-gray-600">
            Professional compliance documentation delivered instantly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {documentTypes.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${
                doc.id === 'full-package' ? 'border-4 border-purple-500 relative' : 'border border-gray-200'
              }`}
            >
              {doc.id === 'full-package' && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  BEST VALUE
                </div>
              )}

              <div className="p-6">
                <div className="text-5xl mb-4">{doc.icon}</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {doc.nameKo}
                </h4>
                <p className="text-sm text-gray-500 mb-1">{doc.name}</p>
                <p className="text-gray-600 mb-4 min-h-[48px]">
                  {doc.descriptionKo}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-blue-600">
                      ${doc.price}
                    </span>
                    <span className="text-gray-500">/ one-time</span>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    ⚡ {doc.deliveryTime}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {doc.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(doc.id)}
                  disabled={loading && selectedDoc === doc.id}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                    doc.id === 'full-package'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && selectedDoc === doc.id ? (
                    'Processing...'
                  ) : (
                    <>Purchase Now →</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Trusted by Leading Korean Companies
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Saved us 6 weeks and $20K in consulting fees. The documents are comprehensive and professional."
              </p>
              <div className="text-sm font-semibold text-gray-900">김민준, CTO</div>
              <div className="text-xs text-gray-500">AI Startup in Seoul</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Perfect for our compliance deadline. Generated all required docs in one afternoon."
              </p>
              <div className="text-sm font-semibold text-gray-900">이서연, Legal Director</div>
              <div className="text-xs text-gray-500">E-commerce Platform</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4">
                "The audit log template alone was worth the price. Saved our development team weeks."
              </p>
              <div className="text-sm font-semibold text-gray-900">박준호, Engineering Lead</div>
              <div className="text-xs text-gray-500">Fintech Company</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                Are the documents legally valid?
              </h4>
              <p className="text-gray-600">
                Yes! Our documents are based on official Korean AI Basic Act guidelines and reviewed
                by compliance experts. However, we recommend having your legal team review for
                company-specific requirements.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                How quickly will I receive my documents?
              </h4>
              <p className="text-gray-600">
                Instantly! After payment, you'll receive download links via email within 2-3 minutes.
                Documents are delivered in both PDF and editable DOCX formats.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                Can I customize the documents?
              </h4>
              <p className="text-gray-600">
                Yes! All documents are provided in editable format. You can customize company details,
                specific AI systems, and any other company-specific information.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                What if I'm not satisfied?
              </h4>
              <p className="text-gray-600">
                We offer a 100% money-back guarantee within 7 days of purchase, no questions asked.
                We're confident you'll find the documents valuable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-black mb-4">
            Don't Wait Until the Deadline
          </h3>
          <p className="text-xl mb-2 opacity-90">
            Only <span className="font-black text-3xl">437 days</span> left until Jan 22, 2026
          </p>
          <p className="text-lg mb-8 opacity-90">
            Get your compliance documentation today and avoid last-minute rush
          </p>
          <button
            onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Choose Your Document →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-white mb-4">ComplianceDocAI</h4>
              <p className="text-sm">
                AI-powered compliance documentation for Korean companies.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>Risk Assessment</li>
                <li>Transparency Report</li>
                <li>Data Governance</li>
                <li>Audit Logs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>help@compliancedocai.com</li>
                <li>+82-2-1234-5678</li>
                <li>Mon-Fri 9AM-6PM KST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>© 2025 ComplianceDocAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
