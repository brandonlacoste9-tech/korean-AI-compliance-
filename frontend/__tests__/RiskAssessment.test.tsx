import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiskAssessment from '@/components/RiskAssessment';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'risk_assessment.title': 'AI Risk Assessment',
        'risk_assessment.subtitle': 'Check if your AI systems comply with Korean regulations',
        'risk_assessment.company_name': 'Company Name',
        'risk_assessment.company_name_placeholder': 'Enter your company name',
        'risk_assessment.email': 'Email Address',
        'risk_assessment.email_placeholder': 'Enter your email',
        'risk_assessment.ai_usage': 'AI Usage',
        'risk_assessment.ai_usage_placeholder': 'Describe your AI use cases',
        'risk_assessment.personal_data': 'Processing Personal Data?',
        'risk_assessment.yes': 'Yes',
        'risk_assessment.no': 'No',
        'risk_assessment.submit': 'Submit Assessment',
        'risk_assessment.submitting': 'Submitting...',
        'risk_assessment.success': 'Assessment submitted successfully. We\'ll contact you soon.',
        'risk_assessment.error': 'An error occurred. Please try again.',
      };
      return translations[key] || key;
    },
  }),
}));

describe('RiskAssessment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the risk assessment form correctly', () => {
    render(<RiskAssessment />);
    
    expect(screen.getByText('AI Risk Assessment')).toBeInTheDocument();
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('AI Usage')).toBeInTheDocument();
    expect(screen.getByText('Processing Personal Data?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Assessment' })).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<RiskAssessment />);
    
    const companyInput = screen.getByLabelText('Company Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    const aiUsageInput = screen.getByLabelText('AI Usage') as HTMLTextAreaElement;

    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(aiUsageInput, { target: { value: 'Machine learning models' } });

    expect(companyInput.value).toBe('Test Company');
    expect(emailInput.value).toBe('test@example.com');
    expect(aiUsageInput.value).toBe('Machine learning models');
  });

  it('submits form successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<RiskAssessment />);
    
    const companyInput = screen.getByLabelText('Company Name');
    const emailInput = screen.getByLabelText('Email Address');
    const aiUsageInput = screen.getByLabelText('AI Usage');
    const submitButton = screen.getByRole('button', { name: 'Submit Assessment' });

    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(aiUsageInput, { target: { value: 'Machine learning models' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Assessment submitted successfully. We\'ll contact you soon.')).toBeInTheDocument();
    });
  });

  it('handles form submission error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<RiskAssessment />);
    
    const companyInput = screen.getByLabelText('Company Name');
    const emailInput = screen.getByLabelText('Email Address');
    const aiUsageInput = screen.getByLabelText('AI Usage');
    const submitButton = screen.getByRole('button', { name: 'Submit Assessment' });

    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(aiUsageInput, { target: { value: 'Machine learning models' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<RiskAssessment />);
    
    const companyInput = screen.getByLabelText('Company Name');
    const emailInput = screen.getByLabelText('Email Address');
    const aiUsageInput = screen.getByLabelText('AI Usage');
    const submitButton = screen.getByRole('button', { name: 'Submit Assessment' });

    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(aiUsageInput, { target: { value: 'Machine learning models' } });
    
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
  });
});
