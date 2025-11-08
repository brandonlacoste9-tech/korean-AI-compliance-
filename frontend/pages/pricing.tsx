import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import axios from 'axios';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceKRW: string;
  billing: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  stripeLink?: string;
}

export default function Pricing() {
  const { t } = useTranslation('common');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const pricingTiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$99',
      priceKRW: '₩129,000',
      billing: '/month',
      description: 'Perfect for startups testing AI compliance requirements',
      features: [
        'AI Risk Assessment (up to 3 assessments/month)',
        'Basic PIPA compliance checklist',
        'Email support (48hr response)',
        'Compliance status dashboard',
        'Korean AI Act overview guide',
        'Monthly compliance newsletter',
        'Basic audit logging (30-day retention)'
      ],
      cta: 'Start Free Trial',
      stripeLink: '/api/stripe/create-checkout?plan=starter'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$299',
      priceKRW: '₩390,000',
      billing: '/month',
      description: 'For growing companies with active AI deployment',
      features: [
        'Unlimited AI Risk Assessments',
        'Full PIPA & Korean AI Act compliance suite',
        'Priority support (24hr response)',
        'Real-time compliance monitoring',
        'MSIT approval preparation assistance',
        'Automated transparency reports',
        'Audit logging (1-year retention)',
        'Quarterly compliance review calls',
        'ISMS-P certification guidance',
        'Data localization verification (Seoul/Busan)',
        'API access for automation',
        'Custom compliance workflows'
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      stripeLink: '/api/stripe/create-checkout?plan=professional'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      priceKRW: '맞춤 견적',
      billing: '',
      description: 'Tailored solutions for large organizations and high-risk AI',
      features: [
        'Everything in Professional, plus:',
        'Dedicated compliance manager',
        'Custom SLA & 24/7 priority support',
        'On-site compliance audits',
        'White-label compliance portal',
        'Multi-team & multi-project management',
        'Advanced MSIT/PIPC integration',
        'Custom regulatory filing assistance',
        'Legal team coordination',
        'Unlimited API access',
        'Custom contract terms',
        'Volume pricing discounts'
      ],
      cta: 'Contact Sales',
      stripeLink: '/#contact'
    }
  ];

  const handleCheckout = async (tier: PricingTier) => {
    if (tier.id === 'enterprise') {
      // Scroll to contact form
      window.location.href = '/#contact';
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Call backend to create Stripe checkout session
      const response = await axios.post(`${apiUrl}/api/stripe/create-checkout`, {
        plan: tier.id,
        currency: 'krw'  // Default to KRW, can be made dynamic
      });

      if (response.data.success && response.data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkout_url;
      } else if (response.data.message) {
        // Free plan or other message
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error: ${error.response.data.detail || 'Failed to create checkout session'}`);
      } else {
        alert('Failed to start checkout. Please try again or contact support.');
      }
    }
  };

  const faqs = [
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! Both Starter and Professional plans include a 14-day free trial with full access to all features. No credit card required.'
    },
    {
      question: 'What happens after the Korean AI Act deadline (January 22, 2026)?',
      answer: 'We continuously update our compliance tools to reflect the latest regulatory changes. Your subscription ensures you stay compliant with all updates and new requirements.'
    },
    {
      question: 'Is my data stored in Korea?',
      answer: 'Yes. All customer data is stored in Seoul and Busan data centers to meet Korean data localization requirements under PIPA.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely. You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.'
    },
    {
      question: 'Do you provide MSIT approval assistance?',
      answer: 'Professional and Enterprise plans include MSIT approval preparation. Enterprise customers get dedicated support for regulatory filings.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, Korean bank transfers, and can arrange invoicing for Enterprise customers.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for any plan. You only pay the monthly or annual subscription price.'
    },
    {
      question: 'What if I need custom compliance features?',
      answer: 'Enterprise plans are fully customizable. Contact our sales team to discuss your specific requirements.'
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing - AI Compliance Guardian | Korean AI Act Compliance</title>
        <meta name="description" content="Transparent pricing for Korean AI compliance. Plans starting at $99/month with 14-day free trial. PIPA, Korean AI Act, and MSIT compliance made simple." />
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
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-obangsaek-heuk/80 mb-8">
                Choose the plan that fits your compliance needs. All plans include 14-day free trial.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center glass rounded-lg p-1 mb-12">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-md transition ${
                    billingCycle === 'monthly'
                      ? 'bg-obangsaek-cheong text-white'
                      : 'text-obangsaek-heuk'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 rounded-md transition ${
                    billingCycle === 'annual'
                      ? 'bg-obangsaek-cheong text-white'
                      : 'text-obangsaek-heuk'
                  }`}
                >
                  Annual
                  <span className="ml-2 text-xs text-obangsaek-hwang">Save 20%</span>
                </button>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="container mx-auto px-4 pb-12 md:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`glass rounded-2xl p-8 flex flex-col ${
                    tier.highlighted
                      ? 'ring-2 ring-obangsaek-cheong shadow-2xl scale-105'
                      : ''
                  }`}
                >
                  {tier.highlighted && (
                    <div className="bg-obangsaek-cheong text-white text-sm font-bold px-4 py-1 rounded-full mb-4 text-center">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-obangsaek-cheong mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-obangsaek-heuk/80 mb-6">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-obangsaek-heuk">
                        {tier.price}
                      </span>
                      <span className="text-obangsaek-heuk/60 ml-2">
                        {tier.billing}
                      </span>
                    </div>
                    <div className="text-sm text-obangsaek-heuk/60 mt-1">
                      {tier.priceKRW} {tier.billing}
                    </div>
                    {billingCycle === 'annual' && tier.id !== 'enterprise' && (
                      <div className="text-sm text-obangsaek-hwang font-semibold mt-2">
                        Billed annually - 20% savings
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleCheckout(tier)}
                    className={`w-full py-3 rounded-lg font-semibold transition mb-6 ${
                      tier.highlighted
                        ? 'bg-obangsaek-cheong text-white hover:bg-obangsaek-jeok'
                        : 'bg-obangsaek-cheong/10 text-obangsaek-cheong hover:bg-obangsaek-cheong/20'
                    }`}
                  >
                    {tier.cta}
                  </button>

                  <div className="space-y-3 flex-grow">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-obangsaek-cheong mt-1 flex-shrink-0">✓</span>
                        <span className="text-sm text-obangsaek-heuk/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance Guarantee */}
          <section className="bg-gradient-to-r from-obangsaek-cheong/5 to-obangsaek-jeok/5 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-obangsaek-cheong mb-6">
                  Compliance Guarantee
                </h2>
                <p className="text-lg text-obangsaek-heuk/80 mb-8">
                  We guarantee our compliance tools meet all current Korean AI Act, PIPA, and MSIT requirements.
                  If we miss a regulatory update, we'll upgrade your compliance package at no extra cost.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass rounded-xl p-6">
                    <div className="text-3xl mb-3">🇰🇷</div>
                    <h3 className="font-bold text-obangsaek-cheong mb-2">Seoul-Based</h3>
                    <p className="text-sm text-obangsaek-heuk/80">
                      All data stored in Korean data centers
                    </p>
                  </div>
                  <div className="glass rounded-xl p-6">
                    <div className="text-3xl mb-3">⚖️</div>
                    <h3 className="font-bold text-obangsaek-cheong mb-2">Legal Team Approved</h3>
                    <p className="text-sm text-obangsaek-heuk/80">
                      Reviewed by Korean compliance attorneys
                    </p>
                  </div>
                  <div className="glass rounded-xl p-6">
                    <div className="text-3xl mb-3">🔄</div>
                    <h3 className="font-bold text-obangsaek-cheong mb-2">Always Up-to-Date</h3>
                    <p className="text-sm text-obangsaek-heuk/80">
                      Continuous regulatory monitoring & updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-obangsaek-cheong mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="glass rounded-xl p-6">
                    <h3 className="font-bold text-obangsaek-cheong mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-obangsaek-heuk/80">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="glass-dark py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-obangsaek-baek mb-6">
                Ready to Get Compliant?
              </h2>
              <p className="text-xl text-obangsaek-baek/80 mb-8 max-w-2xl mx-auto">
                Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#risk-assessment" className="btn-primary text-lg">
                  Start Free Assessment
                </Link>
                <Link href="/services" className="btn-secondary text-lg">
                  Learn More
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
