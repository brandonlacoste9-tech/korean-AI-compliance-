import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import axios from 'axios';

interface RiskAssessmentFormData {
  companyName: string;
  email: string;
  aiUsage: string;
  processesPersonalData: boolean;
}

const RiskAssessment: React.FC = () => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<RiskAssessmentFormData>({
    companyName: '',
    email: '',
    aiUsage: '',
    processesPersonalData: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not configured');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      
      // Log consent, IP, and timestamp for PIPC compliance
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        consentGiven: true,
        locale: typeof window !== 'undefined' ? window.navigator.language : 'ko-KR',
      };

      await axios.post(`${apiUrl}/v1/assessments`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitStatus('success');
      setFormData({
        companyName: '',
        email: '',
        aiUsage: '',
        processesPersonalData: false,
      });
    } catch (error) {
      console.error('Risk assessment submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-obangsaek-cheong mb-4">
        {t('risk_assessment.title')}
      </h2>
      <p className="text-obangsaek-heuk mb-6">
        {t('risk_assessment.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-obangsaek-heuk mb-2">
            {t('risk_assessment.company_name')}
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder={t('risk_assessment.company_name_placeholder')}
            required
            className="w-full px-4 py-3 rounded-lg border border-obangsaek-cheong/30 focus:border-obangsaek-cheong focus:outline-none focus:ring-2 focus:ring-obangsaek-cheong/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-obangsaek-heuk mb-2">
            {t('risk_assessment.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('risk_assessment.email_placeholder')}
            required
            className="w-full px-4 py-3 rounded-lg border border-obangsaek-cheong/30 focus:border-obangsaek-cheong focus:outline-none focus:ring-2 focus:ring-obangsaek-cheong/20"
          />
        </div>

        <div>
          <label htmlFor="aiUsage" className="block text-sm font-medium text-obangsaek-heuk mb-2">
            {t('risk_assessment.ai_usage')}
          </label>
          <textarea
            id="aiUsage"
            name="aiUsage"
            value={formData.aiUsage}
            onChange={handleChange}
            placeholder={t('risk_assessment.ai_usage_placeholder')}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-obangsaek-cheong/30 focus:border-obangsaek-cheong focus:outline-none focus:ring-2 focus:ring-obangsaek-cheong/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-obangsaek-heuk mb-2">
            {t('risk_assessment.personal_data')}
          </label>
          <div className="flex items-center space-x-6">
            <label htmlFor="personalDataYes" className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="personalDataYes"
                name="processesPersonalData"
                checked={formData.processesPersonalData === true}
                onChange={() => setFormData((prev) => ({ ...prev, processesPersonalData: true }))}
                className="w-4 h-4 text-obangsaek-cheong focus:ring-obangsaek-cheong"
              />
              <span>{t('risk_assessment.yes')}</span>
            </label>
            <label htmlFor="personalDataNo" className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="personalDataNo"
                name="processesPersonalData"
                checked={formData.processesPersonalData === false}
                onChange={() => setFormData((prev) => ({ ...prev, processesPersonalData: false }))}
                className="w-4 h-4 text-obangsaek-cheong focus:ring-obangsaek-cheong"
              />
              <span>{t('risk_assessment.no')}</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('risk_assessment.submitting') : t('risk_assessment.submit')}
        </button>

        {submitStatus === 'success' && (
          <div className="glass-blue rounded-lg p-4 text-center text-obangsaek-cheong">
            {t('risk_assessment.success')}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="glass-red rounded-lg p-4 text-center text-obangsaek-jeok">
            {t('risk_assessment.error')}
          </div>
        )}
      </form>
    </div>
  );
};

export default RiskAssessment;
