import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { ComplianceBadgeGrid } from '@/components/ComplianceBadge';

export default function CompliancePage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';

  return (
    <>
      <Head>
        <title>{isKorean ? '준법 가이드 | AI 준법 가디언' : 'Compliance Guide | AI Compliance Guardian'}</title>
        <meta 
          name="description" 
          content={isKorean 
            ? '한국 AI 기본법 및 PIPC 준수 가이드' 
            : 'Korean AI Basic Act and PIPC Compliance Guide'} 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-obangsaek-cheong hover:underline mb-8 inline-block">
            ← {isKorean ? '홈으로' : 'Back to Home'}
          </Link>

          <ComplianceBadgeGrid />

          <h1 className="text-5xl font-black text-obangsaek-cheong text-center mb-8">
            {isKorean ? '🇰🇷 준법 가이드' : '🇰🇷 Compliance Guide'}
          </h1>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Korean AI Basic Act Section */}
            <section className="glass p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? '인공지능 기본법' : 'Korean AI Basic Act'}
              </h2>
              <p className="text-gray-700 mb-4 formal-korean leading-relaxed">
                {isKorean
                  ? '2026년 1월 22일부터 시행되는 한국 인공지능 기본법은 AI 시스템의 개발, 배포 및 운영에 대한 포괄적인 규정을 제공합니다. 모든 AI 서비스 제공자는 본 법률을 준수해야 합니다.'
                  : 'The Korean AI Basic Act, effective from January 22, 2026, provides comprehensive regulations for the development, deployment, and operation of AI systems. All AI service providers must comply with this law.'}
              </p>
              <ul className="space-y-2 text-gray-700 formal-korean">
                <li>✓ {isKorean ? 'AI 시스템 등록 및 신고 의무' : 'AI system registration and reporting requirements'}</li>
                <li>✓ {isKorean ? '투명성 및 설명 가능성 요구사항' : 'Transparency and explainability requirements'}</li>
                <li>✓ {isKorean ? '위험 평가 및 관리' : 'Risk assessment and management'}</li>
                <li>✓ {isKorean ? '사용자 권리 보호' : 'User rights protection'}</li>
              </ul>
            </section>

            {/* PIPC Section */}
            <section className="glass p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-obangsaek-jeok mb-4">
                {isKorean ? 'PIPC 개인정보보호' : 'PIPC Personal Data Protection'}
              </h2>
              <p className="text-gray-700 mb-4 formal-korean leading-relaxed">
                {isKorean
                  ? '개인정보보호위원회(PIPC)는 개인정보의 수집, 처리, 저장에 대한 엄격한 규정을 시행합니다. AI 서비스는 모든 개인정보 보호 규정을 준수해야 합니다.'
                  : 'The Personal Information Protection Commission (PIPC) enforces strict regulations on the collection, processing, and storage of personal information. AI services must comply with all data protection regulations.'}
              </p>
              <ul className="space-y-2 text-gray-700 formal-korean">
                <li>✓ {isKorean ? '명시적 사용자 동의 필수' : 'Explicit user consent required'}</li>
                <li>✓ {isKorean ? '데이터 거주지 요구사항 (서울)' : 'Data residency requirements (Seoul)'}</li>
                <li>✓ {isKorean ? '감사 로그 보관 (3년)' : 'Audit log retention (3 years)'}</li>
                <li>✓ {isKorean ? '데이터 암호화 및 보안' : 'Data encryption and security'}</li>
              </ul>
            </section>

            {/* MSIT Section */}
            <section className="glass p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? 'MSIT 과학기술정보통신부' : 'MSIT Ministry of Science and ICT'}
              </h2>
              <p className="text-gray-700 mb-4 formal-korean leading-relaxed">
                {isKorean
                  ? '과학기술정보통신부(MSIT)는 AI 기본법의 주요 규제 기관입니다. 모든 고위험 AI 시스템은 MSIT 승인을 받아야 합니다.'
                  : 'The Ministry of Science and ICT (MSIT) is the primary regulatory body for the AI Basic Act. All high-risk AI systems require MSIT approval.'}
              </p>
              <ul className="space-y-2 text-gray-700 formal-korean">
                <li>✓ {isKorean ? '고위험 AI 시스템 사전 승인' : 'Pre-approval for high-risk AI systems'}</li>
                <li>✓ {isKorean ? '정기 준법 감사' : 'Regular compliance audits'}</li>
                <li>✓ {isKorean ? '표준 및 지침 준수' : 'Standards and guidelines compliance'}</li>
                <li>✓ {isKorean ? '사고 보고 의무' : 'Incident reporting obligations'}</li>
              </ul>
            </section>

            {/* Implementation Support */}
            <section className="bg-gradient-to-r from-obangsaek-cheong to-obangsaek-jeok text-white p-8 rounded-xl">
              <h2 className="text-3xl font-bold mb-4">
                {isKorean ? '준법 지원 서비스' : 'Compliance Support'}
              </h2>
              <p className="mb-6 formal-korean">
                {isKorean
                  ? 'AI 준법 가디언이 귀사의 완벽한 준법 준비를 지원합니다.'
                  : 'AI Compliance Guardian supports your complete compliance preparation.'}
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/pricing"
                  className="px-6 py-3 bg-white text-obangsaek-cheong rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  {isKorean ? '요금제 보기' : 'View Pricing'}
                </Link>
                <Link 
                  href="/contact"
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-obangsaek-cheong transition-colors"
                >
                  {isKorean ? '문의하기' : 'Contact Us'}
                </Link>
              </div>
            </section>
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
