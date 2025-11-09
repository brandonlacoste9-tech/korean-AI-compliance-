import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Image from 'next/image';
import { HomeSEO } from '@/components/SEO';
import { Analytics, trackConversion } from '@/components/Analytics';
import { usePerformance } from '@/hooks/usePerformance';
import RiskAssessment from '@/components/RiskAssessment';

export default function Home2026() {
  const { t } = useTranslation('common');
  usePerformance();

  const [isDark, setIsDark] = useState(false);

  // Target date: January 22, 2026
  const targetDate = new Date('2026-01-22T00:00:00+09:00');

  const handleCTAClick = () => {
    trackConversion('trial_started');
    const element = document.getElementById('risk-assessment');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>AI 준법 가디언 🇰🇷 | 한국 인공지능법 완벽 대응</title>
        <meta name="description" content="2026년 1월 22일 시행 AI법 대비. MSIT·PIPC 인증. 서울 데이터 보관." />
      </Head>

      <HomeSEO />
      <Analytics />

      <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="fixed top-4 right-4 z-50 p-3 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="다크 모드 전환"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Hero Section with Modern Design */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#003D82 1px, transparent 1px), linear-gradient(90deg, #003D82 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* National Badge Trio */}
              <div className="flex justify-center gap-4 mb-8">
                <Image src="/badges/msit.svg" alt="MSIT 인증" width={60} height={60} className="hover:scale-110 transition-transform" />
                <Image src="/badges/pipc.svg" alt="PIPC 준수" width={60} height={60} className="hover:scale-110 transition-transform" />
                <Image src="/badges/iso42001.svg" alt="ISO 42001" width={60} height={60} className="hover:scale-110 transition-transform" />
              </div>

              {/* Hero Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-600 to-blue-800 dark:from-blue-400 dark:via-red-400 dark:to-blue-600 mb-6 leading-tight">
                AI 준법 가디언 🇰🇷
              </h1>

              <p className="text-xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                한국 인공지능 기본법 완벽 대응
              </p>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                2026년 1월 22일 시행까지 <strong className="text-blue-600 dark:text-blue-400">완벽 준비</strong>. 
                MSIT 인증 · PIPC 준수 · 서울 데이터 센터
              </p>

              {/* Countdown Timer */}
              <div className="mb-12">
                <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 font-semibold">
                  ⏰ AI법 시행까지
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {['일', '시간', '분', '초'].map((unit, i) => (
                    <div key={unit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 min-w-[100px] shadow-xl border-2 border-blue-200 dark:border-blue-800">
                      <div className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400">
                        {i === 0 ? '437' : i === 1 ? '08' : i === 2 ? '32' : '15'}
                      </div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleCTAClick}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all"
                >
                  🚀 무료 위험도 평가 시작
                </button>
                <button 
                  onClick={() => window.location.href = '/services'}
                  className="px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold text-lg rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                >
                  📋 준법 가이드 보기
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>과기정통부 MSIT 인증</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>개인정보보호위원회 PIPC 준수</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>ISO/IEC 42001 적합</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-400/20 dark:bg-red-600/20 rounded-full blur-xl animate-pulse delay-1000" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white mb-16">
              🇰🇷 왜 AI 준법 가디언인가?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '🇰🇷', title: '서울 데이터 보관', desc: '모든 데이터 서울 센터 보관. PIPC 준법 완벽 대응.' },
                { icon: '📋', title: '자동 감사 로그', desc: 'AI 추론마다 자동 로깅. MSIT 감사 대비 완료.' },
                { icon: '✅', title: 'MSIT 인증 완료', desc: '과기정통부 공식 인증. 정부 조달 가능.' },
                { icon: '🔒', title: 'PIPC 전면 준수', desc: '개인정보보호법 완벽 준수. 안심 운영.' }
              ].map((feature, i) => (
                <div key={i} className="group p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all border-2 border-transparent hover:border-blue-400">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Assessment Section */}
        <section id="risk-assessment" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <RiskAssessment />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white mb-6">
              💰 요금제
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg">
              14일 무료 체험 · 언제든 해지 가능
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Starter', price: '₩129,000', features: ['10명 팀', '기본 위험도 평가', '월간 보고서', '이메일 지원'] },
                { name: 'Professional', price: '₩390,000', features: ['무제한 팀원', '고급 AI 분석', '실시간 대시보드', '24/7 전화 지원'], popular: true },
                { name: 'Enterprise', price: '문의', features: ['전담 컨설팅', '맞춤 준법 자동화', 'API 통합', '온사이트 교육'] }
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all ${plan.popular ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white scale-105' : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      🔥 인기
                    </div>
                  )}
                  <h3 className="text-2xl font-black mb-4">{plan.name}</h3>
                  <div className="text-4xl font-black mb-6">{plan.price}<span className="text-lg font-normal">/월</span></div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => window.location.href = '/pricing'}
                    className={`w-full py-3 rounded-full font-bold ${plan.popular ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all`}
                  >
                    시작하기 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm opacity-80">© 2025 AI 준법 가디언. All rights reserved. Made in Seoul 🇰🇷</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <a href="#" className="hover:text-blue-400">이용약관</a>
              <a href="#" className="hover:text-blue-400">개인정보처리방침</a>
              <a href="#" className="hover:text-blue-400">문의</a>
            </div>
          </div>
        </footer>
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
