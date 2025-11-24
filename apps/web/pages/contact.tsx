import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';

export default function ContactPage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Integrate with API endpoint
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        consent: false,
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <>
      <Head>
        <title>{isKorean ? '문의하기 | AI 준법 가디언' : 'Contact Us | AI Compliance Guardian'}</title>
        <meta 
          name="description" 
          content={isKorean 
            ? 'AI 준법 가디언 문의 - 준법 지원팀이 도와드립니다'
            : 'Contact AI Compliance Guardian - Our compliance team is here to help'} 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-obangsaek-cheong hover:underline mb-8 inline-block">
            ← {isKorean ? '홈으로' : 'Back to Home'}
          </Link>

          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-black text-obangsaek-cheong text-center mb-4">
              {isKorean ? '문의하기' : 'Contact Us'}
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12 formal-korean">
              {isKorean 
                ? '귀사의 AI 준법 준비를 도와드리겠습니다'
                : "We're here to help with your AI compliance preparation"}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-obangsaek-cheong mb-6">
                  {isKorean ? '메시지 보내기' : 'Send us a message'}
                </h2>

                {submitted ? (
                  <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
                    <div className="text-5xl mb-4">✓</div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      {isKorean ? '감사합니다!' : 'Thank you!'}
                    </h3>
                    <p className="text-green-700 formal-korean">
                      {isKorean 
                        ? '문의가 접수되었습니다. 24시간 이내에 답변드리겠습니다.'
                        : 'Your inquiry has been received. We will respond within 24 hours.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 formal-korean">
                        {isKorean ? '이름 *' : 'Name *'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-obangsaek-cheong focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 formal-korean">
                        {isKorean ? '이메일 *' : 'Email *'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-obangsaek-cheong focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 formal-korean">
                        {isKorean ? '회사명' : 'Company'}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-obangsaek-cheong focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 formal-korean">
                        {isKorean ? '전화번호' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-obangsaek-cheong focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 formal-korean">
                        {isKorean ? '문의 유형 *' : 'Subject *'}
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-obangsaek-cheong focus:outline-none"
                      >
                        <option value="">{isKorean ? '선택하세요' : 'Select...'}</option>
                        <option value="general">{isKorean ? '일반 문의' : 'General Inquiry'}</option>
                        <option value="compliance">{isKorean ? '준법 상담' : 'Compliance Consultation'}</option>
                        <option value="pricing">{isKorean ? '요금 문의' : 'Pricing Question'}</option>
                        <option value="technical">{isKorean ? '기술 지원' : 'Technical Support'}</option>
                        <option value="partnership">{isKorean ? '파트너십' : 'Partnership'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 formal-korean">
                        {isKorean ? '메시지 *' : 'Message *'}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-obangsaek-cheong focus:outline-none"
                      />
                    </div>

                    {/* PIPC Consent - Required for Korean compliance */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={formData.consent}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                        <span className="text-sm text-gray-700 formal-korean">
                          {isKorean
                            ? '개인정보 수집 및 이용에 동의합니다. 수집된 정보는 문의 응답 목적으로만 사용되며, 서울 리전에 안전하게 보관됩니다. (PIPC 준수) *'
                            : 'I consent to the collection and use of personal information. Collected information will only be used to respond to inquiries and is securely stored in the Seoul region. (PIPC compliant) *'}
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-obangsaek-cheong text-white rounded-lg font-bold hover:bg-obangsaek-cheong-dark transition-colors"
                    >
                      {isKorean ? '전송' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="glass p-8 rounded-xl">
                  <h2 className="text-2xl font-bold text-obangsaek-cheong mb-6">
                    {isKorean ? '연락처 정보' : 'Contact Information'}
                  </h2>
                  
                  <div className="space-y-6">
                    <ContactInfo
                      icon="📧"
                      title={isKorean ? '이메일' : 'Email'}
                      content="support@ai-compliance-guardian.kr"
                    />
                    <ContactInfo
                      icon="📞"
                      title={isKorean ? '전화' : 'Phone'}
                      content="+82-2-XXXX-XXXX"
                    />
                    <ContactInfo
                      icon="🕐"
                      title={isKorean ? '운영 시간' : 'Business Hours'}
                      content={isKorean 
                        ? '평일 09:00 - 18:00 (KST)' 
                        : 'Weekdays 09:00 - 18:00 (KST)'}
                    />
                    <ContactInfo
                      icon="📍"
                      title={isKorean ? '주소' : 'Address'}
                      content={isKorean 
                        ? '서울특별시, 대한민국' 
                        : 'Seoul, Republic of Korea'}
                    />
                  </div>
                </div>

                <div className="glass p-8 rounded-xl">
                  <h3 className="text-xl font-bold text-obangsaek-cheong mb-4">
                    {isKorean ? '빠른 링크' : 'Quick Links'}
                  </h3>
                  <div className="space-y-3">
                    <QuickLink href="/pricing" label={isKorean ? '요금제 보기' : 'View Pricing'} />
                    <QuickLink href="/compliance" label={isKorean ? '준법 가이드' : 'Compliance Guide'} />
                    <QuickLink href="/faq" label={isKorean ? '자주 묻는 질문' : 'FAQ'} />
                    <QuickLink href="/legal/privacy" label={isKorean ? '개인정보 처리방침' : 'Privacy Policy'} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-obangsaek-cheong to-obangsaek-jeok text-white p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">
                    {isKorean ? '🇰🇷 준법 보증' : '🇰🇷 Compliance Guarantee'}
                  </h3>
                  <p className="formal-korean">
                    {isKorean
                      ? '모든 통신은 암호화되며, 데이터는 서울 리전에 보관됩니다. PIPC 및 MSIT 완전 준수.'
                      : 'All communications are encrypted and data is stored in Seoul region. Fully PIPC and MSIT compliant.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactInfo({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href}
      className="block text-obangsaek-cheong hover:underline font-semibold"
    >
      → {label}
    </Link>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
