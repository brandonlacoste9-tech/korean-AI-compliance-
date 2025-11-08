import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Services() {
  const { t } = useTranslation('common');

  const services = [
    {
      id: 'risk-assessment',
      icon: '📊',
      title: t('services.risk_assessment.title'),
      titleFallback: 'AI Risk Assessment',
      description: t('services.risk_assessment.description'),
      descriptionFallback: 'Comprehensive evaluation of your AI systems against Korean AI Act requirements and PIPC guidelines.',
      features: [
        'Automated risk scoring based on AI usage patterns',
        'Facial recognition and biometric system compliance',
        'Personal data processing impact analysis',
        'High-risk AI categorization (medical, finance, surveillance)',
        'MSIT approval requirement assessment',
        'Detailed compliance timeline and roadmap'
      ]
    },
    {
      id: 'consulting',
      icon: '⚖️',
      title: t('services.consulting.title'),
      titleFallback: 'Korean AI Law Compliance Consulting',
      description: t('services.consulting.description'),
      descriptionFallback: 'Expert guidance on navigating Korean AI regulations, PIPA compliance, and data localization requirements.',
      features: [
        'Korean AI Act (인공지능 기본법) compliance strategy',
        'PIPA (개인정보 보호법) personal data protection',
        'Data localization (Seoul/Busan data centers)',
        'ISMS-P certification preparation',
        'Legal framework interpretation and implementation',
        'Regulatory filing and MSIT approval assistance'
      ]
    },
    {
      id: 'reporting',
      icon: '📋',
      title: t('services.reporting.title'),
      titleFallback: 'Automated Compliance Reporting',
      description: t('services.reporting.description'),
      descriptionFallback: 'Streamlined audit logging, transparency reports, and regulatory documentation generation.',
      features: [
        'Real-time audit trail generation',
        'PIPC-compliant consent tracking',
        'Automated transparency reports',
        'AI decision explainability documentation',
        'Bias detection and mitigation reporting',
        'Quarterly compliance status dashboards'
      ]
    },
    {
      id: 'integration',
      icon: '🔗',
      title: t('services.integration.title'),
      titleFallback: 'MSIT/PIPC Standards Integration',
      description: t('services.integration.description'),
      descriptionFallback: 'Technical implementation of government-mandated compliance tools and monitoring systems.',
      features: [
        'MSIT (과학기술정보통신부) standard integration',
        'PIPC audit logging infrastructure',
        'Real-time compliance monitoring dashboard',
        'Automated alert system for violations',
        'API integration with government reporting systems',
        'Secure data residency verification'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{t('services.page_title') || 'Services - AI Compliance Guardian'}</title>
        <meta name="description" content={t('services.page_description') || 'Comprehensive Korean AI compliance services including risk assessment, consulting, reporting, and MSIT/PIPC integration.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-obangsaek-cheong mb-6">
                {t('services.hero_title') || 'Our Compliance Services'}
              </h1>
              <p className="text-xl text-obangsaek-heuk/80 mb-8">
                {t('services.hero_subtitle') || 'Comprehensive solutions for Korean AI regulation compliance, tailored to your business needs.'}
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/#risk-assessment" className="btn-primary">
                  {t('services.cta_assessment') || 'Get Risk Assessment'}
                </Link>
                <Link href="/#pricing" className="btn-secondary">
                  {t('services.cta_pricing') || 'View Pricing'}
                </Link>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="bg-gradient-to-r from-obangsaek-cheong/5 to-obangsaek-jeok/5 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {services.map((service) => (
                  <div key={service.id} className="glass rounded-2xl p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="text-5xl">{service.icon}</div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-obangsaek-cheong mb-2">
                          {service.title || service.titleFallback}
                        </h2>
                        <p className="text-obangsaek-heuk/80">
                          {service.description || service.descriptionFallback}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-obangsaek-heuk mb-3">
                        {t('services.features_title') || 'Key Features:'}
                      </h3>
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-obangsaek-cheong mt-1">✓</span>
                          <span className="text-obangsaek-heuk/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-obangsaek-cheong mb-12">
                {t('services.why_choose.title') || 'Why Choose AI Compliance Guardian?'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🇰🇷</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('services.why_choose.korean_expertise') || 'Korean Law Expertise'}
                  </h3>
                  <p className="text-sm text-obangsaek-heuk/80">
                    Deep understanding of Korean AI Act, PIPA, and MSIT requirements
                  </p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('services.why_choose.automated') || 'Automated Solutions'}
                  </h3>
                  <p className="text-sm text-obangsaek-heuk/80">
                    Cutting-edge automation for compliance monitoring and reporting
                  </p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">
                    {t('services.why_choose.data_security') || 'Data Security'}
                  </h3>
                  <p className="text-sm text-obangsaek-heuk/80">
                    Seoul-based infrastructure with ISMS-P certified security
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="glass-dark py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-obangsaek-baek mb-6">
                {t('services.cta.title') || 'Ready to Ensure Compliance?'}
              </h2>
              <p className="text-xl text-obangsaek-baek/80 mb-8 max-w-2xl mx-auto">
                {t('services.cta.subtitle') || 'Start with a free risk assessment to understand your compliance requirements.'}
              </p>
              <Link href="/#risk-assessment" className="btn-primary text-lg">
                {t('services.cta.button') || 'Get Started Now'}
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="glass-dark border-t border-obangsaek-cheong/20 py-8">
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
