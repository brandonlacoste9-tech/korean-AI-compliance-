import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PricingCards from '@/components/PricingCards';

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, any> = {
        'pricing.starter.name': 'Starter',
        'pricing.starter.price': 'Free',
        'pricing.starter.description': 'Essential compliance tools for small teams',
        'pricing.starter.features': [
          'Basic risk assessment',
          'Compliance checklist',
          'Email support',
          'Monthly reports',
        ],
        'pricing.starter.cta': 'Get Started',
        'pricing.professional.name': 'Professional',
        'pricing.professional.price': '₩390,000',
        'pricing.professional.period': 'per month',
        'pricing.professional.description': 'Complete compliance solution for enterprises',
        'pricing.professional.features': [
          'Advanced risk assessment & monitoring',
          'PIPC audit logging (Seoul region)',
          'Real-time compliance dashboard',
          'Dedicated compliance consulting',
          'MSIT/PIPC certification support',
          'Priority support (24/7)',
        ],
        'pricing.professional.cta': 'Subscribe Now',
      };
      
      if (options?.returnObjects) {
        return translations[key];
      }
      return translations[key] || key;
    },
  }),
}));

describe('PricingCards Component', () => {
  it('renders both pricing cards', () => {
    render(<PricingCards />);
    
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  it('displays correct prices', () => {
    render(<PricingCards />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('₩390,000')).toBeInTheDocument();
  });

  it('displays starter plan features', () => {
    render(<PricingCards />);
    
    expect(screen.getByText('Basic risk assessment')).toBeInTheDocument();
    expect(screen.getByText('Compliance checklist')).toBeInTheDocument();
    expect(screen.getByText('Email support')).toBeInTheDocument();
    expect(screen.getByText('Monthly reports')).toBeInTheDocument();
  });

  it('displays professional plan features', () => {
    render(<PricingCards />);
    
    expect(screen.getByText('Advanced risk assessment & monitoring')).toBeInTheDocument();
    expect(screen.getByText('PIPC audit logging (Seoul region)')).toBeInTheDocument();
    expect(screen.getByText('Real-time compliance dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dedicated compliance consulting')).toBeInTheDocument();
    expect(screen.getByText('MSIT/PIPC certification support')).toBeInTheDocument();
    expect(screen.getByText('Priority support (24/7)')).toBeInTheDocument();
  });

  it('displays call-to-action buttons', () => {
    render(<PricingCards />);
    
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe Now' })).toBeInTheDocument();
  });

  it('displays descriptions for both plans', () => {
    render(<PricingCards />);
    
    expect(screen.getByText('Essential compliance tools for small teams')).toBeInTheDocument();
    expect(screen.getByText('Complete compliance solution for enterprises')).toBeInTheDocument();
  });

  it('renders checkmarks for features', () => {
    const { container } = render(<PricingCards />);
    
    // Each feature should have a checkmark SVG
    const checkmarks = container.querySelectorAll('svg');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('displays period for professional plan', () => {
    render(<PricingCards />);
    
    expect(screen.getByText(/per month/)).toBeInTheDocument();
  });
});
