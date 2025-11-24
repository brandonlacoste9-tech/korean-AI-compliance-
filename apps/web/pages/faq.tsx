import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';

interface FAQItem {
  question: string;
  questionKo: string;
  answer: string;
  answerKo: string;
  category: 'general' | 'compliance' | 'pricing' | 'technical';
}

export default function FAQPage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question: 'What is AI Compliance Guardian?',
      questionKo: 'AI 준법 가디언은 무엇인가요?',
      answer: 'AI Compliance Guardian is a SaaS platform that helps organizations comply with Korean AI Basic Act and PIPC regulations. We provide risk assessment, audit logging, compliance monitoring, and certification support.',
      answerKo: 'AI 준법 가디언은 조직이 한국 AI 기본법 및 PIPC 규정을 준수하도록 돕는 SaaS 플랫폼입니다. 위험 평가, 감사 로깅, 준법 모니터링 및 인증 지원을 제공합니다.',
    },
    {
      category: 'compliance',
      question: 'When does the Korean AI Basic Act take effect?',
      questionKo: '한국 AI 기본법은 언제 시행되나요?',
      answer: 'The Korean AI Basic Act will take effect on January 22, 2026. All AI service providers must be compliant by this date.',
      answerKo: '한국 AI 기본법은 2026년 1월 22일에 시행됩니다. 모든 AI 서비스 제공자는 이 날짜까지 준수해야 합니다.',
    },
    {
      category: 'compliance',
      question: 'What is PIPC and why is it important?',
      questionKo: 'PIPC란 무엇이며 왜 중요한가요?',
      answer: 'PIPC (Personal Information Protection Commission) is the Korean regulatory body for data protection. Compliance with PIPC regulations is mandatory for any organization handling personal data in Korea.',
      answerKo: 'PIPC(개인정보보호위원회)는 한국의 데이터 보호 규제 기관입니다. 한국에서 개인정보를 처리하는 모든 조직은 PIPC 규정을 준수해야 합니다.',
    },
    {
      category: 'compliance',
      question: 'Where is my data stored?',
      questionKo: '내 데이터는 어디에 저장되나요?',
      answer: 'All data is stored in Seoul-based data centers using Supabase, ensuring full compliance with Korean data residency requirements.',
      answerKo: '모든 데이터는 Supabase를 사용하여 서울 기반 데이터 센터에 저장되며, 한국 데이터 거주지 요구사항을 완벽히 준수합니다.',
    },
    {
      category: 'pricing',
      question: 'What payment methods do you accept?',
      questionKo: '어떤 결제 수단을 받나요?',
      answer: 'We accept all major credit cards and bank transfers through Stripe. All payments are processed in Korean Won (KRW).',
      answerKo: 'Stripe을 통해 모든 주요 신용카드 및 은행 이체를 받습니다. 모든 결제는 원화(KRW)로 처리됩니다.',
    },
    {
      category: 'pricing',
      question: 'Can I cancel my subscription?',
      questionKo: '구독을 취소할 수 있나요?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
      answerKo: '네, 언제든지 구독을 취소할 수 있습니다. 현재 결제 기간이 끝날 때까지 액세스가 계속됩니다.',
    },
    {
      category: 'technical',
      question: 'Do you provide API access?',
      questionKo: 'API 액세스를 제공하나요?',
      answer: 'Yes, Professional and Enterprise plans include API access for automation and integration with your existing systems.',
      answerKo: '네, 프로페셔널 및 엔터프라이즈 플랜에는 자동화 및 기존 시스템과의 통합을 위한 API 액세스가 포함됩니다.',
    },
    {
      category: 'technical',
      question: 'What kind of support do you offer?',
      questionKo: '어떤 종류의 지원을 제공하나요?',
      answer: 'We offer email support for all plans (48hr response for Starter, 24hr for Professional). Enterprise customers get dedicated support with priority response times.',
      answerKo: '모든 플랜에 이메일 지원을 제공합니다(스타터는 48시간, 프로페셔널은 24시간 응답). 엔터프라이즈 고객은 우선 응답 시간으로 전담 지원을 받습니다.',
    },
    {
      category: 'general',
      question: 'Is there a free trial?',
      questionKo: '무료 체험이 있나요?',
      answer: 'Yes, we offer a 14-day free trial for all paid plans. No credit card required to start.',
      answerKo: '네, 모든 유료 플랜에 대해 14일 무료 체험을 제공합니다. 시작하는 데 신용카드가 필요하지 않습니다.',
    },
  ];

  const categories = {
    general: { name: 'General', nameKo: '일반' },
    compliance: { name: 'Compliance', nameKo: '준법' },
    pricing: { name: 'Pricing', nameKo: '요금' },
    technical: { name: 'Technical', nameKo: '기술' },
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>{isKorean ? '자주 묻는 질문 | AI 준법 가디언' : 'FAQ | AI Compliance Guardian'}</title>
        <meta 
          name="description" 
          content={isKorean 
            ? 'AI 준법 가디언에 대한 자주 묻는 질문과 답변'
            : 'Frequently asked questions about AI Compliance Guardian'} 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-obangsaek-cheong hover:underline mb-8 inline-block">
            ← {isKorean ? '홈으로' : 'Back to Home'}
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-black text-obangsaek-cheong text-center mb-4">
              {isKorean ? '자주 묻는 질문' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12 formal-korean">
              {isKorean 
                ? 'AI 준법 가디언에 대해 궁금하신 점을 확인하세요'
                : 'Find answers to common questions about AI Compliance Guardian'}
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-obangsaek-cheong/10 text-obangsaek-cheong rounded-full text-xs font-bold">
                          {isKorean ? categories[faq.category].nameKo : categories[faq.category].name}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 formal-korean">
                        {isKorean ? faq.questionKo : faq.question}
                      </h3>
                    </div>
                    <span className="text-2xl text-obangsaek-cheong ml-4">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 formal-korean leading-relaxed">
                        {isKorean ? faq.answerKo : faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 glass p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? '답변을 찾지 못하셨나요?' : "Didn't find your answer?"}
              </h2>
              <p className="text-gray-700 mb-6 formal-korean">
                {isKorean
                  ? '추가 질문이 있으시면 언제든지 문의해 주세요. 24시간 이내에 답변드리겠습니다.'
                  : 'Feel free to contact us with any additional questions. We will respond within 24 hours.'}
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-obangsaek-cheong text-white rounded-lg font-bold hover:bg-obangsaek-cheong-dark transition-colors"
              >
                {isKorean ? '문의하기' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
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
