import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Header from '@/components/Header';
import CountdownTimer from '@/components/CountdownTimer';
import RiskAssessment from '@/components/RiskAssessment';
import PricingCards from '@/components/PricingCards';
import { HomeSEO } from '@/components/SEO';
import { Analytics, trackConversion } from '@/components/Analytics';
import Testimonials from '@/components/Testimonials';
import SocialProof from '@/components/SocialProof';
import { usePerformance } from '@/hooks/usePerformance';

export default function Home() {
  const { t } = useTranslation('common');

  // Performance optimization
  usePerformance();

  // Target date: January 22, 2026
  const targetDate = new Date('2026-01-22T00:00:00+09:00');

  // Track CTA clicks
  const handleCTAClick = () => {
    trackConversion('trial_started');
    const element = document.getElementById('risk-assessment');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HomeSEO />
      <Analytics />

      <div className="min-h-screen">
        <Header />

        {/* Social Proof Banner */}
        <SocialProof />

        <main>
          {/* Hero Section */}
          <section id="home" className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-obangsaek-heuk mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-obangsaek-heuk/80 mb-8">
                {t('hero.subtitle')}
              </p>
              
              <div className="mb-12">
                <CountdownTimer targetDate={targetDate} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCTAClick}
                  className="btn-primary text-lg"
                >
                  {t('hero.cta')}
                </button>
              </div>
            </div>
          </section>

          {/* Compliance Features Section */}
          <section className="bg-gradient-to-r from-obangsaek-cheong/5 to-obangsaek-jeok/5 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-obangsaek-heuk mb-12">
                {t('compliance.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🇰🇷</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('compliance.seoul_residency')}
                  </h3>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('compliance.audit_logging')}
                  </h3>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('compliance.msit_certified')}
                  </h3>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('compliance.pipc_compliant')}
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Assessment Section */}
          <section id="risk-assessment" className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
              <RiskAssessment />
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-obangsaek-heuk mb-4">
                {t('pricing.title')}
              </h2>
              <p className="text-xl text-obangsaek-heuk/80">
                {t('pricing.subtitle')}
              </p>
            </div>
            <PricingCards />
          </section>

          {/* Testimonials Section */}
          <Testimonials />

          {/* Footer */}
          <footer className="glass-dark border-t border-obangsaek-cheong/20 py-8 mt-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <p className="text-sm text-obangsaek-baek/80">
                    {t('footer.copyright')}
                  </p>
                  <p className="text-sm text-obangsaek-baek/80 mt-1">
                    {t('footer.contact')}
                  </p>
                </div>
                <div className="flex space-x-6">
                  <a
                    href="#"
                    className="text-sm text-obangsaek-baek/80 hover:text-obangsaek-hwang transition"
                  >
                    {t('footer.privacy')}
                  </a>
                  <a
                    href="#"
                    className="text-sm text-obangsaek-baek/80 hover:text-obangsaek-hwang transition"
                  >
                    {t('footer.terms')}
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
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
