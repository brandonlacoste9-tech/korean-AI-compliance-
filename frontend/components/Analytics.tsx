import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Google Analytics tracking
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Analytics Provider Component
export const Analytics = () => {
  const router = useRouter();

  useEffect(() => {
    // Track page views on route change
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Only render in production with valid GA ID
  if (!GA_TRACKING_ID || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,  // GDPR/PIPC compliance
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
    </>
  );
};

// Conversion tracking helpers
export const trackConversion = (
  conversionType: 'trial_started' | 'payment_completed' | 'assessment_submitted' | 'enterprise_demo_request'
) => {
  event({
    action: conversionType,
    category: 'conversion',
    label: conversionType,
  });
};

// Korean AI compliance specific tracking
export const trackAssessment = (riskScore: number, recommendation: string) => {
  event({
    action: 'risk_assessment_completed',
    category: 'engagement',
    label: recommendation,
    value: riskScore,
  });
};

export const trackPricing = (plan: string, action: 'viewed' | 'clicked') => {
  event({
    action: `pricing_${action}`,
    category: 'conversion',
    label: plan,
  });
};
