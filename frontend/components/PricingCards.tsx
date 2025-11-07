import React from 'react';
import { useTranslation } from 'next-i18next';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  isProfessional?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  cta,
  isProfessional = false,
}) => {
  const handleSubscribe = async () => {
    if (!isProfessional) {
      // For starter plan, just scroll to risk assessment
      const element = document.getElementById('risk-assessment');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not configured');
        return;
      }
      
      const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_professional_plan_krw',
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
    }
  };

  return (
    <div
      className={`glass rounded-2xl p-6 md:p-8 flex flex-col h-full relative ${
        isProfessional ? 'border-2 border-obangsaek-jeok shadow-xl' : ''
      }`}
    >
      {isProfessional && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-obangsaek-jeok to-obangsaek-cheong text-white px-4 py-1 rounded-full text-sm font-bold">
            POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-obangsaek-heuk mb-2">{name}</h3>
        <div className="flex items-baseline mb-3">
          <span className="text-4xl md:text-5xl font-bold text-obangsaek-cheong">{price}</span>
          {period && <span className="ml-2 text-obangsaek-heuk/70">/ {period}</span>}
        </div>
        <p className="text-sm text-obangsaek-heuk/80">{description}</p>
      </div>

      <div className="flex-grow mb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-obangsaek-cheong mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-obangsaek-heuk">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSubscribe}
        className={`w-full py-3 rounded-lg font-medium transition ${
          isProfessional
            ? 'btn-primary'
            : 'btn-secondary'
        }`}
      >
        {cta}
      </button>
    </div>
  );
};

const PricingCards: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
      <div className="relative">
        <PricingCard
          name={t('pricing.starter.name')}
          price={t('pricing.starter.price')}
          description={t('pricing.starter.description')}
          features={t('pricing.starter.features', { returnObjects: true }) as string[]}
          cta={t('pricing.starter.cta')}
          isProfessional={false}
        />
      </div>

      <div className="relative">
        <PricingCard
          name={t('pricing.professional.name')}
          price={t('pricing.professional.price')}
          period={t('pricing.professional.period')}
          description={t('pricing.professional.description')}
          features={t('pricing.professional.features', { returnObjects: true }) as string[]}
          cta={t('pricing.professional.cta')}
          isProfessional={true}
        />
      </div>
    </div>
  );
};

export default PricingCards;
