import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { ComplianceBadgeGrid } from '@/components/ComplianceBadge';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';

  return (
    <>
      <Head>
        <title>{isKorean ? 'AI 준법 가디언 🇰🇷 | 한국 AI 기본법 완벽 대응' : 'AI Compliance Guardian | Korean AI Basic Act'}</title>
        <meta 
          name="description" 
          content={isKorean 
            ? '2026년 1월 22일 시행 AI 기본법 대비. MSIT·PIPC 인증. 서울 데이터 보관.' 
            : 'Prepare for Korean AI Basic Act. MSIT·PIPC certified. Seoul data residency.'} 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-obangsaek-baek via-white to-obangsaek-cheong/10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'linear-gradient(#003D82 1px, transparent 1px), linear-gradient(90deg, #003D82 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} 
            />
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              
              {/* Compliance Badges */}
              <ComplianceBadgeGrid />

              {/* Hero Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-obangsaek-cheong via-obangsaek-jeok to-obangsaek-cheong mb-6 leading-tight">
                {isKorean ? 'AI 준법 가디언 🇰🇷' : 'AI Compliance Guardian 🇰🇷'}
              </h1>

              <p className="text-xl md:text-3xl font-semibold text-gray-700 mb-4">
                {isKorean 
                  ? '한국 인공지능 기본법 완벽 대응' 
                  : 'Korean AI Basic Act Compliance Solution'}
              </p>

              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto formal-korean">
                {isKorean
                  ? '2026년 1월 22일 시행까지 완벽 준비. MSIT 인증 · PIPC 준수 · 서울 데이터 센터'
                  : 'Complete preparation for Jan 22, 2026. MSIT certified · PIPC compliant · Seoul data center'}
              </p>

              {/* Countdown Timer */}
              <div className="mb-12">
                <CountdownTimer />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/pricing"
                  className="px-8 py-4 bg-obangsaek-cheong text-white rounded-lg font-bold text-lg hover:bg-obangsaek-cheong-dark transition-colors shadow-lg hover:shadow-xl"
                >
                  {isKorean ? '요금제 보기' : 'View Pricing'}
                </Link>
                <Link 
                  href="/compliance"
                  className="px-8 py-4 glass border-2 border-obangsaek-cheong text-obangsaek-cheong rounded-lg font-bold text-lg hover:bg-obangsaek-cheong hover:text-white transition-colors"
                >
                  {isKorean ? '준법 가이드' : 'Compliance Guide'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-obangsaek-cheong">
              {isKorean ? '주요 기능' : 'Key Features'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon="🛡️"
                title={isKorean ? 'PIPC 감사 로깅' : 'PIPC Audit Logging'}
                description={isKorean 
                  ? '서울 리전 Supabase 기반 완벽한 감사 로그 보관' 
                  : 'Complete audit log retention with Seoul-based Supabase'}
              />
              <FeatureCard
                icon="✓"
                title={isKorean ? 'MSIT/PIPC 인증' : 'MSIT/PIPC Certified'}
                description={isKorean 
                  ? '정부 기관 인증 및 준수 배지 제공' 
                  : 'Government agency certification and compliance badges'}
              />
              <FeatureCard
                icon="🌐"
                title={isKorean ? '이중 언어 지원' : 'Bilingual Support'}
                description={isKorean 
                  ? '한국어/영어 완벽 지원, 존댓말 템플릿' 
                  : 'Full Korean/English support with formal templates'}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-obangsaek-cheong to-obangsaek-jeok text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              {isKorean ? '지금 시작하세요' : 'Get Started Today'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto formal-korean">
              {isKorean
                ? '한국 AI 기본법 시행까지 남은 시간이 얼마 없습니다. 지금 준비를 시작하세요.'
                : "Time is running out before the Korean AI Basic Act takes effect. Start preparing now."}
            </p>
            <Link 
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-obangsaek-cheong rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {isKorean ? '문의하기' : 'Contact Us'}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass p-6 rounded-xl hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-obangsaek-cheong">{title}</h3>
      <p className="text-gray-600 formal-korean">{description}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
