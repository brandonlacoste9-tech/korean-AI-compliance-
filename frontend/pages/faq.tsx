import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedLinks?: { text: string; href: string }[];
}

export default function FAQ() {
  const { t } = useTranslation('common');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📋' },
    { id: 'regulations', name: 'Korean AI Regulations', icon: '⚖️' },
    { id: 'pricing', name: 'Pricing & Plans', icon: '💰' },
    { id: 'technical', name: 'Technical & Implementation', icon: '⚙️' },
    { id: 'timeline', name: 'Timeline & Deadlines', icon: '📅' },
    { id: 'security', name: 'Data & Security', icon: '🔒' }
  ];

  const faqs: FAQItem[] = [
    // Korean AI Regulations
    {
      id: 'korean-ai-act',
      category: 'regulations',
      question: 'What is the Korean AI Act (인공지능 기본법)?',
      answer: 'The Korean AI Act is comprehensive legislation passed in 2024 that regulates AI development and deployment in South Korea. It requires risk assessments for high-risk AI systems, mandates transparency and explainability, enforces bias detection, and establishes MSIT oversight. The law goes into full effect on January 22, 2026, with significant penalties for non-compliance.',
      relatedLinks: [
        { text: 'View Our Services', href: '/services' },
        { text: 'Get Risk Assessment', href: '/#risk-assessment' }
      ]
    },
    {
      id: 'high-risk-ai',
      category: 'regulations',
      question: 'What qualifies as "high-risk AI" under Korean law?',
      answer: 'High-risk AI systems include: facial recognition and biometric authentication, medical diagnosis and treatment systems, autonomous vehicles and transportation control, financial credit scoring and loan approval, surveillance and law enforcement systems, employment screening and HR decisions, and critical infrastructure management. These require MSIT approval and enhanced compliance measures.',
      relatedLinks: [
        { text: 'Professional Plan Features', href: '/pricing#professional' }
      ]
    },
    {
      id: 'pipa-compliance',
      category: 'regulations',
      question: 'How does PIPA (개인정보 보호법) affect AI systems?',
      answer: 'PIPA, Korea\'s Personal Information Protection Act, requires explicit consent for personal data processing, mandates data minimization and purpose limitation, requires secure data storage in Korean data centers, enforces audit logging for all data access, and establishes individual rights to data access and deletion. AI systems processing personal data must fully comply with PIPA requirements.',
      relatedLinks: [
        { text: 'Learn About PIPA Compliance', href: '/services#consulting' }
      ]
    },
    {
      id: 'msit-approval',
      category: 'regulations',
      question: 'Do I need MSIT (과학기술정보통신부) approval?',
      answer: 'MSIT approval is required for high-risk AI systems in sectors including medical, finance, public services, energy, and transportation. The approval process involves submitting technical documentation, demonstrating bias testing and mitigation, providing transparency reports, and undergoing security audits. Our Professional and Enterprise plans include MSIT approval preparation assistance.',
      relatedLinks: [
        { text: 'MSIT Integration Services', href: '/services#integration' },
        { text: 'View Pricing Plans', href: '/pricing' }
      ]
    },

    // Pricing & Plans
    {
      id: 'free-trial',
      category: 'pricing',
      question: 'Do you offer a free trial?',
      answer: 'Yes! Both our Starter ($99/month) and Professional ($299/month) plans include a 14-day free trial with full access to all features. No credit card required to start. You can assess your AI compliance needs risk-free before committing to a paid plan.',
      relatedLinks: [
        { text: 'Start Free Trial', href: '/pricing' },
        { text: 'Get Risk Assessment', href: '/#risk-assessment' }
      ]
    },
    {
      id: 'plan-differences',
      category: 'pricing',
      question: 'What\'s the difference between Starter and Professional plans?',
      answer: 'Starter ($99/mo) includes 3 risk assessments per month, basic PIPA compliance, email support (48hr response), and 30-day audit logging. Professional ($299/mo) includes unlimited assessments, full MSIT preparation, priority support (24hr), 1-year audit retention, API access, quarterly review calls, and ISMS-P certification guidance. Professional is best for companies actively deploying AI systems.',
      relatedLinks: [
        { text: 'Compare All Plans', href: '/pricing' }
      ]
    },
    {
      id: 'enterprise-features',
      category: 'pricing',
      question: 'What does the Enterprise plan include?',
      answer: 'Enterprise plans are fully customized and include: dedicated compliance manager, 24/7 priority support, on-site compliance audits, white-label compliance portal, multi-team project management, custom MSIT/PIPC integration, legal team coordination, unlimited API access, and volume pricing discounts. Contact our sales team for a custom quote.',
      relatedLinks: [
        { text: 'Contact Sales', href: '/#contact' },
        { text: 'View All Features', href: '/pricing' }
      ]
    },
    {
      id: 'upgrade-downgrade',
      category: 'pricing',
      question: 'Can I change my plan later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades apply at the next billing cycle. All your compliance data and history are preserved during plan changes.',
      relatedLinks: [
        { text: 'View Pricing Options', href: '/pricing' }
      ]
    },

    // Technical & Implementation
    {
      id: 'data-localization',
      category: 'technical',
      question: 'Where is my data stored?',
      answer: 'All customer data is stored exclusively in Korean data centers located in Seoul and Busan to meet PIPA data localization requirements. We use ISMS-P certified infrastructure with AES-256 encryption at rest and TLS 1.3 for data in transit. We never transfer data outside of South Korea without explicit consent.',
      relatedLinks: [
        { text: 'Security Details', href: '/services' }
      ]
    },
    {
      id: 'api-integration',
      category: 'technical',
      question: 'Does your platform offer API access?',
      answer: 'Yes. Professional and Enterprise plans include full API access for automation. You can programmatically submit risk assessments, retrieve compliance reports, access audit logs, generate transparency reports, and integrate with your existing systems. API documentation is provided with your plan subscription.',
      relatedLinks: [
        { text: 'Professional Plan', href: '/pricing#professional' },
        { text: 'API Integration Services', href: '/services#integration' }
      ]
    },
    {
      id: 'implementation-time',
      category: 'technical',
      question: 'How long does implementation take?',
      answer: 'Initial setup typically takes 1-2 weeks depending on your plan. Starter plans can be set up in days. Professional plans with API integration usually take 1-2 weeks. Enterprise implementations with custom workflows and on-site audits typically take 4-6 weeks. We provide dedicated onboarding support to accelerate your timeline.',
      relatedLinks: [
        { text: 'Get Started', href: '/pricing' }
      ]
    },
    {
      id: 'isms-p-certification',
      category: 'technical',
      question: 'Do you help with ISMS-P certification?',
      answer: 'Yes. Our Professional and Enterprise plans include ISMS-P (Information Security Management System - Personal Information) certification guidance. We help with gap analysis, documentation preparation, security controls implementation, and audit readiness. ISMS-P certification is often required for organizations processing significant amounts of personal data.',
      relatedLinks: [
        { text: 'Professional Features', href: '/pricing#professional' }
      ]
    },

    // Timeline & Deadlines
    {
      id: 'deadline-2026',
      category: 'timeline',
      question: 'What is the January 22, 2026 deadline?',
      answer: 'January 22, 2026 is the full enforcement date for the Korean AI Act. All AI systems deployed in South Korea must be compliant by this date. Non-compliance can result in fines up to 3% of annual revenue, operational shutdowns, and criminal penalties for severe violations. Companies should start compliance preparations at least 6-12 months before the deadline.',
      relatedLinks: [
        { text: 'Start Risk Assessment', href: '/#risk-assessment' },
        { text: 'View Services', href: '/services' }
      ]
    },
    {
      id: 'compliance-timeline',
      category: 'timeline',
      question: 'How long does it take to become compliant?',
      answer: 'Typical compliance timelines: Low-risk AI systems: 3-6 months. Medium-risk systems: 6-9 months. High-risk systems requiring MSIT approval: 9-18 months. Starting early is critical. Our risk assessment tool can provide a customized timeline estimate based on your specific AI usage.',
      relatedLinks: [
        { text: 'Get Custom Timeline', href: '/#risk-assessment' }
      ]
    },

    // Data & Security
    {
      id: 'audit-logging',
      category: 'security',
      question: 'What audit logging capabilities do you provide?',
      answer: 'We provide comprehensive audit logging including: all data access and modifications, user consent tracking with timestamps, AI decision records with reasoning, bias detection test results, compliance report generation history, and API access logs. Starter plans include 30-day retention, Professional includes 1-year retention, and Enterprise offers custom retention policies.',
      relatedLinks: [
        { text: 'Compare Plans', href: '/pricing' }
      ]
    },
    {
      id: 'data-security',
      category: 'security',
      question: 'How do you ensure data security?',
      answer: 'Our security measures include: Seoul-based ISMS-P certified data centers, AES-256 encryption for data at rest, TLS 1.3 for data in transit, multi-factor authentication (MFA), role-based access control (RBAC), regular security audits, SOC 2 Type II compliance, and 24/7 security monitoring. We maintain the highest security standards required by Korean regulations.',
      relatedLinks: [
        { text: 'Security Features', href: '/services' }
      ]
    }
  ];

  const filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <>
      <Head>
        <title>FAQ - Korean AI Compliance Questions Answered | AI Compliance Guardian</title>
        <meta name="description" content="Answers to common questions about Korean AI Act compliance, PIPA regulations, MSIT approval, pricing, implementation, and data security for AI systems in Korea." />
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
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-obangsaek-heuk/80 mb-8">
                Everything you need to know about Korean AI compliance, our services, and implementation.
              </p>
            </div>
          </section>

          {/* Category Filter */}
          <section className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedCategory === category.id
                        ? 'bg-obangsaek-cheong text-white'
                        : 'glass text-obangsaek-heuk hover:bg-obangsaek-cheong/10'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ List */}
          <section className="container mx-auto px-4 pb-12 md:pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="glass rounded-xl p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-obangsaek-cheong mb-4">
                      {faq.question}
                    </h2>
                    <p className="text-obangsaek-heuk/80 mb-4 leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-obangsaek-cheong/20">
                        {faq.relatedLinks.map((link, index) => (
                          <Link
                            key={index}
                            href={link.href}
                            className="text-sm text-obangsaek-cheong hover:text-obangsaek-jeok transition font-medium"
                          >
                            {link.text} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="glass rounded-xl p-12 text-center">
                  <p className="text-obangsaek-heuk/60">
                    No questions found in this category.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Still Have Questions CTA */}
          <section className="bg-gradient-to-r from-obangsaek-cheong/5 to-obangsaek-jeok/5 py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-obangsaek-cheong mb-6">
                Still Have Questions?
              </h2>
              <p className="text-lg text-obangsaek-heuk/80 mb-8 max-w-2xl mx-auto">
                Our compliance experts are here to help. Get a free risk assessment or schedule a consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#risk-assessment" className="btn-primary text-lg">
                  Get Free Risk Assessment
                </Link>
                <Link href="/#contact" className="btn-secondary text-lg">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-obangsaek-cheong mb-8">
                Helpful Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/services" className="glass rounded-xl p-6 text-center hover:shadow-lg transition">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">Our Services</h3>
                  <p className="text-sm text-obangsaek-heuk/80">
                    Explore our compliance solutions
                  </p>
                </Link>
                <Link href="/pricing" className="glass rounded-xl p-6 text-center hover:shadow-lg transition">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">Pricing Plans</h3>
                  <p className="text-sm text-obangsaek-heuk/80">
                    Find the right plan for you
                  </p>
                </Link>
                <Link href="/#risk-assessment" className="glass rounded-xl p-6 text-center hover:shadow-lg transition">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold text-obangsaek-cheong mb-2">Risk Assessment</h3>
                  <p className="text-sm text-obangsaek-heuk/80">
                    Check your compliance status
                  </p>
                </Link>
              </div>
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
