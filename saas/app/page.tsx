"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import ChatWidget from '../components/ChatWidget';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY');

export default function Home() {
  const [riskScore, setRiskScore] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  const [installments, setInstallments] = useState<number>(1);

  const handleAssess = (formData: FormData) => {
    const highRisk = (formData.get('personal_data') ? 1 : 0) + (formData.get('safety_impact') ? 1 : 0);
    const score = highRisk * 50;
    setRiskScore(score);
  };

  const handleCheckout = async (plan: 'starter' | 'professional' | 'enterprise') => {
    setLoading(true);
    try {
      // Call your backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, riskScore, currency }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      priceUSD: 99,
      priceKRW: 130000,
      features: ['Risk Assessment', 'Basic Compliance Reports', 'Email Support', 'Up to 5 AI Systems'],
    },
    {
      id: 'professional',
      name: 'Professional',
      priceUSD: 299,
      priceKRW: 390000,
      features: ['Everything in Starter', 'Advanced Analytics', 'Priority Support', 'Up to 25 AI Systems', 'Automated Monitoring'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceUSD: null,
      priceKRW: null,
      features: ['Everything in Professional', 'Unlimited AI Systems', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee'],
    },
  ];

  const calculateInstallment = (priceKRW: number, months: number) => {
    return Math.ceil(priceKRW / months);
  };

  const formatPrice = (priceUSD: number | null, priceKRW: number | null) => {
    if (priceUSD === null || priceKRW === null) {
      return (
        <div>
          <p className="text-3xl font-bold text-blue-600">
            {currency === 'KRW' ? '맞춤 견적' : 'Custom'}
          </p>
        </div>
      );
    }

    return (
      <div>
        {currency === 'KRW' ? (
          <>
            {installments > 1 ? (
              <>
                <p className="text-3xl font-bold text-blue-600">
                  ₩{calculateInstallment(priceKRW, installments).toLocaleString('ko-KR')} × {installments}개월
                </p>
                <p className="text-sm text-gray-500">
                  (총 ₩{priceKRW.toLocaleString('ko-KR')}/월)
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-blue-600">₩{priceKRW.toLocaleString('ko-KR')}/월</p>
                <p className="text-sm text-gray-500">(${priceUSD}/month)</p>
              </>
            )}
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-blue-600">${priceUSD}/month</p>
            <p className="text-sm text-gray-500">(₩{priceKRW.toLocaleString('ko-KR')}/월)</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">AI 규정 준수 가디언</h1>
          <p className="mt-1 text-gray-600">Korean AI Basic Act Compliance SaaS</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {!showForm ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Ensure Korean AI Act Compliance</h2>
            <p className="text-xl text-gray-600 mb-8">Get your free risk assessment in 2 minutes</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold"
            >
              Start Free Assessment
            </button>
          </div>
        ) : riskScore === 0 ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">AI System Risk Assessment</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAssess(new FormData(e.currentTarget)); }}>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" name="personal_data" className="w-5 h-5" />
                  <span className="text-lg">Does your AI system process personal data?</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" name="safety_impact" className="w-5 h-5" />
                  <span className="text-lg">Does your AI system impact safety or critical decisions?</span>
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full"
              >
                Calculate Risk Score
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Risk Assessment Results</h2>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Risk Score:</span>
                  <span className={`text-3xl font-bold ${riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                    {riskScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${riskScore > 50 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-gray-700">
                  {riskScore > 50
                    ? '⚠️ High Risk - Immediate compliance action required under Korean AI Basic Act'
                    : '✅ Low Risk - Regular monitoring and documentation recommended'}
                </p>
              </div>
              <button
                onClick={() => { setRiskScore(0); setShowForm(true); }}
                className="text-blue-600 hover:underline"
              >
                ← Start New Assessment
              </button>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Choose Your Compliance Plan</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => { setCurrency('USD'); setInstallments(1); }}
                      className={`px-4 py-2 rounded ${currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => setCurrency('KRW')}
                      className={`px-4 py-2 rounded ${currency === 'KRW' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                    >
                      KRW (₩)
                    </button>
                  </div>

                  {currency === 'KRW' && (
                    <div className="flex items-center space-x-2">
                      <label htmlFor="installments" className="text-sm font-medium text-gray-700">
                        할부:
                      </label>
                      <select
                        id="installments"
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>일시불 (Pay in full)</option>
                        <option value={3}>3개월 할부 (3 months)</option>
                        <option value={6}>6개월 할부 (6 months)</option>
                        <option value={12}>12개월 할부 (12 months)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="bg-white p-8 rounded-lg shadow hover:shadow-xl transition">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">{formatPrice(plan.priceUSD, plan.priceKRW)}</div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {currency === 'KRW' && plan.id !== 'enterprise' && (
                      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2">
                          🇰🇷 한국 결제 옵션:
                        </p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• 신용카드/체크카드</li>
                          <li>• 무이자 할부 (최대 12개월)</li>
                          <li>• 카카오페이 (곧 지원 예정)</li>
                          <li>• 네이버페이 (곧 지원 예정)</li>
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => handleCheckout(plan.id as any)}
                      disabled={loading || plan.id === 'enterprise'}
                      className={`w-full py-3 rounded-lg font-semibold ${
                        plan.id === 'enterprise'
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {loading ? 'Processing...' : plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat Widget */}
      <ChatWidget riskScore={riskScore} />
    </div>
  );
}