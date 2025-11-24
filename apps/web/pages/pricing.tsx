import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';

interface PricingTier {
  id: string;
  name: string;
  nameKo: string;
  priceKRW: string;
  priceUSD: string;
  billing: string;
  billingKo: string;
  description: string;
  descriptionKo: string;
  features: string[];
  featuresKo: string[];
  highlighted?: boolean;
  stripePriceId?: string;
}

export default function PricingPage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const tiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      nameKo: '스타터',
      priceKRW: '₩129,000',
      priceUSD: '$99',
      billing: '/month',
      billingKo: '/월',
      description: 'Perfect for startups testing AI compliance',
      descriptionKo: 'AI 준법을 시작하는 스타트업에 적합',
      features: [
        'Up to 3 AI risk assessments/month',
        'Basic PIPA compliance checklist',
        'Email support (48hr response)',
        'Compliance status dashboard',
        'Korean AI Act overview guide',
        'Basic audit logging (30-day retention)',
      ],
      featuresKo: [
        '월 3회 AI 위험 평가',
        '기본 PIPA 준법 체크리스트',
        '이메일 지원 (48시간 응답)',
        '준법 현황 대시보드',
        'AI 기본법 개요 가이드',
        '기본 감사 로그 (30일 보관)',
      ],
      stripePriceId: 'price_starter_monthly',
    },
    {
      id: 'professional',
      name: 'Professional',
      nameKo: '프로페셔널',
      priceKRW: '₩390,000',
      priceUSD: '$299',
      billing: '/month',
      billingKo: '/월',
      description: 'For growing companies with active AI deployment',
      descriptionKo: 'AI를 적극 활용하는 성장 기업을 위한 플랜',
      features: [
        'Unlimited AI risk assessments',
        'Full PIPA & Korean AI Act compliance suite',
        'Priority support (24hr response)',
        'Real-time compliance monitoring',
        'MSIT approval preparation assistance',
        'Automated transparency reports',
        'Audit logging (1-year retention)',
        'Quarterly compliance review calls',
        'API access for automation',
      ],
      featuresKo: [
        '무제한 AI 위험 평가',
        'PIPA 및 AI 기본법 완전 준법 패키지',
        '우선 지원 (24시간 응답)',
        '실시간 준법 모니터링',
        'MSIT 승인 준비 지원',
        '자동 투명성 보고서',
        '감사 로그 (1년 보관)',
        '분기별 준법 검토 회의',
        '자동화 API 액세스',
      ],
      highlighted: true,
      stripePriceId: 'price_professional_monthly',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      nameKo: '엔터프라이즈',
      priceKRW: '맞춤 견적',
      priceUSD: 'Custom',
      billing: '',
      billingKo: '',
      description: 'Tailored solutions for large organizations',
      descriptionKo: '대규모 조직을 위한 맞춤형 솔루션',
      features: [
        'Everything in Professional, plus:',
        'Dedicated compliance manager',
        'Custom compliance workflows',
        'On-premise deployment option',
        'SLA guarantees',
        'White-label solutions',
        'Advanced API & integrations',
        'Custom training & workshops',
      ],
      featuresKo: [
        '프로페셔널 플랜의 모든 기능 포함',
        '전담 준법 관리자',
        '맞춤형 준법 워크플로우',
        '온프레미스 배포 옵션',
        'SLA 보증',
        '화이트 라벨 솔루션',
        '고급 API 및 통합',
        '맞춤형 교육 및 워크샵',
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{isKorean ? '요금제 | AI 준법 가디언' : 'Pricing | AI Compliance Guardian'}</title>
        <meta 
          name="description" 
          content={isKorean 
            ? 'AI 준법 가디언 요금제 - 한국 AI 기본법 및 PIPC 준수 SaaS' 
            : 'AI Compliance Guardian Pricing - Korean AI Basic Act & PIPC Compliance SaaS'} 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-obangsaek-cheong hover:underline mb-8 inline-block">
            ← {isKorean ? '홈으로' : 'Back to Home'}
          </Link>

          <h1 className="text-5xl font-black text-obangsaek-cheong text-center mb-4">
            {isKorean ? '요금제' : 'Pricing Plans'}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 formal-korean">
            {isKorean 
              ? '귀사에 적합한 플랜을 선택하세요. 모든 플랜은 KRW로 결제됩니다.' 
              : 'Choose the plan that fits your needs. All plans are billed in KRW.'}
          </p>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`glass p-8 rounded-xl ${
                  tier.highlighted
                    ? 'ring-4 ring-obangsaek-cheong shadow-2xl scale-105'
                    : 'shadow-lg'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-4 py-1 bg-obangsaek-cheong text-white rounded-full text-sm font-bold">
                      {isKorean ? '추천' : 'RECOMMENDED'}
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-obangsaek-cheong mb-2">
                  {isKorean ? tier.nameKo : tier.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-black text-gray-900">
                    {isKorean ? tier.priceKRW : tier.priceUSD}
                  </span>
                  <span className="text-gray-600">
                    {isKorean ? tier.billingKo : tier.billing}
                  </span>
                </div>

                <p className="text-gray-700 mb-6 formal-korean">
                  {isKorean ? tier.descriptionKo : tier.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {(isKorean ? tier.featuresKo : tier.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 formal-korean">
                      <span className="text-green-600 mr-2 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-bold transition-colors ${
                    tier.highlighted
                      ? 'bg-obangsaek-cheong text-white hover:bg-obangsaek-cheong-dark'
                      : 'border-2 border-obangsaek-cheong text-obangsaek-cheong hover:bg-obangsaek-cheong hover:text-white'
                  }`}
                  onClick={() => {
                    if (tier.stripePriceId) {
                      // Stripe checkout integration placeholder
                      window.location.href = `/api/stripe/checkout?priceId=${tier.stripePriceId}`;
                    } else {
                      window.location.href = '/contact';
                    }
                  }}
                >
                  {tier.priceKRW === '맞춤 견적' || tier.priceUSD === 'Custom'
                    ? isKorean ? '문의하기' : 'Contact Sales'
                    : isKorean ? '시작하기' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          {/* Trust Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4 formal-korean">
              {isKorean
                ? '🇰🇷 모든 결제는 Stripe을 통해 안전하게 처리되며, KRW로 청구됩니다.'
                : '🇰🇷 All payments are securely processed through Stripe and billed in KRW.'}
            </p>
            <p className="text-gray-600 formal-korean">
              {isKorean
                ? '데이터는 서울 리전에 보관되며, PIPC 및 MSIT 준수를 보장합니다.'
                : 'Data is stored in Seoul region, ensuring PIPC and MSIT compliance.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
