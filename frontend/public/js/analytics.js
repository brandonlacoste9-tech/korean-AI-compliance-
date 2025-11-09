/**
 * Korean AI Compliance SaaS - Analytics Tracker
 * Tracks conversions, user behavior, and Korean market metrics
 */

// Analytics Configuration
const ANALYTICS_CONFIG = {
  trackPageViews: true,
  trackClicks: true,
  trackScrollDepth: true,
  trackFormSubmissions: true,
  trackTimeOnPage: true,
  koreanMarketFocus: true
};

// Event Tracker
class ComplianceAnalytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.pageLoadTime = 0;
    this.scrollDepth = 0;

    this.init();
  }

  init() {
    // Track page load time
    window.addEventListener('load', () => {
      this.pageLoadTime = Date.now() - performance.timing.navigationStart;
      this.track('page_load', { loadTime: this.pageLoadTime });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (scrollPercent === 25 || scrollPercent === 50 || scrollPercent === 75 || scrollPercent === 100) {
          this.track('scroll_depth', { depth: scrollPercent });
        }
      }
    });

    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, .kr-badge, .kr-btn');
      if (target) {
        this.track('click', {
          element: target.tagName,
          text: target.textContent.substring(0, 50),
          class: target.className
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.track('form_submit', {
        formId: form.id || 'unknown',
        fields: form.elements.length
      });
    });

    // Track time on page before leaving
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - this.sessionStart) / 1000);
      this.track('session_end', { duration: timeOnPage });
    });

    // Detect Korean language preference
    const isKorean = navigator.language.startsWith('ko');
    if (isKorean) {
      this.track('korean_user_detected', { language: navigator.language });
    }

    // Detect mobile (Korean market is 70% mobile)
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    this.track('device_type', { mobile: isMobile });
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data: data,
      page: window.location.pathname,
      referrer: document.referrer
    };

    this.events.push(event);

    // Log to console in development
    if (window.location.hostname === 'localhost') {
      console.log('📊 Analytics:', eventName, data);
    }

    // Send to analytics backend (implement your endpoint)
    this.sendToBackend(event);
  }

  async sendToBackend(event) {
    try {
      // Send to your backend analytics endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Uncomment when backend endpoint is ready:
      // await fetch(`${apiUrl}/api/analytics`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });

      // For now, store in localStorage for review
      const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      stored.push(event);
      if (stored.length > 100) stored.shift(); // Keep last 100 events
      localStorage.setItem('analytics_events', JSON.stringify(stored));

    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Track custom events
  trackConversion(conversionType, value = null) {
    this.track('conversion', {
      type: conversionType,
      value: value,
      timestamp: Date.now()
    });
  }

  // Track pricing tier selection
  trackPricingInterest(tier, price) {
    this.track('pricing_interest', {
      tier: tier,
      price: price,
      currency: 'KRW'
    });
  }

  // Track Stripe checkout initiation
  trackCheckoutStart(plan) {
    this.track('checkout_start', {
      plan: plan,
      step: 'initiated'
    });
  }

  // Track assessment completion
  trackAssessmentComplete(riskScore, recommendation) {
    this.track('assessment_complete', {
      risk_score: riskScore,
      recommendation: recommendation
    });
  }
}

// Initialize analytics
const analytics = new ComplianceAnalytics();

// Export for global use
window.complianceAnalytics = analytics;

// Helper functions for easy tracking
window.trackClick = (element, label) => {
  analytics.track('cta_click', { element, label });
};

window.trackPricing = (tier, price) => {
  analytics.trackPricingInterest(tier, price);
};

window.trackCheckout = (plan) => {
  analytics.trackCheckoutStart(plan);
};

console.log('📊 Korean AI Compliance Analytics: Active');
