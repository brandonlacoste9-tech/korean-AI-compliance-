import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';

interface ChecklistItem {
  id: string;
  step: number;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  items: {
    id: string;
    text: string;
    textKo: string;
    critical: boolean;
  }[];
  tools?: {
    name: string;
    link: string;
  }[];
  penalty?: string;
  penaltyKo?: string;
}

const checklistData: ChecklistItem[] = [
  {
    id: 'applicability',
    step: 1,
    title: 'Determine Applicability',
    titleKo: '적용 대상 확인',
    description: 'Check if Korean AI Basic Act applies to your AI system',
    descriptionKo: '귀사의 AI 시스템이 한국 AI 기본법 적용 대상인지 확인하세요',
    items: [
      {
        id: 'serves-korean-users',
        text: 'Does your AI system serve Korean users or markets?',
        textKo: 'AI 시스템이 한국 사용자나 시장을 대상으로 합니까?',
        critical: true,
      },
      {
        id: 'critical-domains',
        text: 'Used in critical domains (healthcare, finance, education, security)?',
        textKo: '중요 분야(의료, 금융, 교육, 보안)에서 사용됩니까?',
        critical: true,
      },
      {
        id: 'automated-decisions',
        text: 'Involves automated decision-making, recommendations, or generative AI?',
        textKo: '자동화된 의사결정, 추천, 생성형 AI를 포함합니까?',
        critical: true,
      },
    ],
    penalty: 'If yes to any: you are subject to Korean AI Basic Act',
    penaltyKo: '하나라도 해당되면: 한국 AI 기본법 적용 대상입니다',
  },
  {
    id: 'risk-classification',
    step: 2,
    title: 'Conduct Risk Classification',
    titleKo: '위험도 분류 수행',
    description: 'Classify your AI system and document the evaluation',
    descriptionKo: 'AI 시스템을 분류하고 평가 내용을 문서화하세요',
    items: [
      {
        id: 'classify-impact',
        text: 'Classify system as "High-Impact" or "General Use"',
        textKo: '시스템을 "고위험" 또는 "일반용도"로 분류',
        critical: true,
      },
      {
        id: 'document-method',
        text: 'Document risk evaluation method (impact scoring, use case matrix)',
        textKo: '위험도 평가 방법 문서화 (영향도 점수, 사용 사례 매트릭스)',
        critical: true,
      },
      {
        id: 'store-logs',
        text: 'Store logs of classification decision',
        textKo: '분류 결정 로그 저장',
        critical: false,
      },
    ],
    tools: [
      {
        name: 'AI Compliance Guardian Risk Assessment',
        link: '/',
      },
    ],
  },
  {
    id: 'transparency',
    step: 3,
    title: 'Ensure Transparency',
    titleKo: '투명성 보장',
    description: 'Clearly disclose AI usage to users',
    descriptionKo: '사용자에게 AI 사용을 명확히 공개하세요',
    items: [
      {
        id: 'disclose-usage',
        text: 'Clearly disclose AI usage (e.g., "This result is AI-generated")',
        textKo: 'AI 사용 명시 (예: "이 결과는 AI가 생성했습니다")',
        critical: true,
      },
      {
        id: 'explanation-mechanism',
        text: 'Provide explanation mechanisms for high-risk decisions',
        textKo: '고위험 결정에 대한 설명 메커니즘 제공',
        critical: true,
      },
      {
        id: 'human-loop',
        text: 'Include disclaimers or human-in-the-loop options',
        textKo: '면책조항 또는 사람 개입 옵션 포함',
        critical: false,
      },
    ],
    penalty: '₩30M fine for non-disclosure',
    penaltyKo: '미공개 시 3천만원 벌금',
  },
  {
    id: 'local-representative',
    step: 4,
    title: 'Appoint Local Representative',
    titleKo: '국내 대리인 지정',
    description: 'Designate a Korean legal representative if no local presence',
    descriptionKo: '국내 사업장이 없는 경우 한국 법적 대리인 지정',
    items: [
      {
        id: 'designate-rep',
        text: 'Designate Korean legal representative (if no local presence)',
        textKo: '한국 법적 대리인 지정 (국내 사업장 없는 경우)',
        critical: true,
      },
      {
        id: 'submit-info',
        text: 'Submit representative info to MSIT/PIPC portals',
        textKo: 'MSIT/PIPC 포털에 대리인 정보 제출',
        critical: true,
      },
      {
        id: 'response-capability',
        text: 'Ensure rep can respond to compliance inquiries within deadlines',
        textKo: '대리인이 기한 내 준법 문의 대응 가능하도록 보장',
        critical: false,
      },
    ],
    penalty: '₩30M fine for no representative',
    penaltyKo: '대리인 미지정 시 3천만원 벌금',
  },
  {
    id: 'audit-logging',
    step: 5,
    title: 'PIPC-Compliant Audit Logging',
    titleKo: 'PIPC 준수 감사 로깅',
    description: 'Set up comprehensive audit logging for compliance',
    descriptionKo: '준법을 위한 포괄적인 감사 로깅 설정',
    items: [
      {
        id: 'consent-logs',
        text: 'Store consent logs and data access logs',
        textKo: '동의 로그 및 데이터 접근 로그 저장',
        critical: true,
      },
      {
        id: 'processing-history',
        text: 'Maintain processing history (when AI acts on personal data)',
        textKo: '처리 이력 유지 (AI가 개인정보를 처리할 때)',
        critical: true,
      },
      {
        id: 'audit-export',
        text: 'Enable audit log download/export for MSIT/PIPC inspection',
        textKo: 'MSIT/PIPC 검사를 위한 감사 로그 다운로드/내보내기 지원',
        critical: true,
      },
    ],
    tools: [
      {
        name: 'Supabase Seoul (Seoul-region data residency)',
        link: 'https://supabase.com',
      },
      {
        name: 'Guardian Platform PIPC Logging',
        link: '/features',
      },
    ],
  },
  {
    id: 'security',
    step: 6,
    title: 'Security & Safety Requirements',
    titleKo: '보안 및 안전 요구사항',
    description: 'Implement security protocols and safety measures',
    descriptionKo: '보안 프로토콜 및 안전 조치 구현',
    items: [
      {
        id: 'isms-iso',
        text: 'Implement ISMS-P/ISO 27001 security protocols',
        textKo: 'ISMS-P/ISO 27001 보안 프로토콜 구현',
        critical: true,
      },
      {
        id: 'monitoring',
        text: 'Set up real-time monitoring and alerting for AI anomalies',
        textKo: 'AI 이상 징후에 대한 실시간 모니터링 및 알림 설정',
        critical: true,
      },
      {
        id: 'human-fallback',
        text: 'Provide human fallback and override',
        textKo: '사람 개입 및 재정의 옵션 제공',
        critical: false,
      },
    ],
  },
  {
    id: 'communication',
    step: 7,
    title: 'Communicate & Prove Compliance',
    titleKo: '준법 소통 및 증명',
    description: 'Publicly demonstrate your compliance efforts',
    descriptionKo: '준법 노력을 공개적으로 입증하세요',
    items: [
      {
        id: 'ai-policy',
        text: 'Publish Korean-language AI Use Policy on your site',
        textKo: '웹사이트에 한국어 AI 사용 정책 게시',
        critical: true,
      },
      {
        id: 'compliance-badges',
        text: 'Share compliance badges (e.g., "AI Basic Act Ready") on homepage',
        textKo: '홈페이지에 준법 배지 게시 (예: "AI 기본법 준수")',
        critical: false,
      },
      {
        id: 'document-pack',
        text: 'Maintain Compliance Document Pack for auditors/customers',
        textKo: '감사관/고객을 위한 준법 문서 패키지 유지',
        critical: true,
      },
    ],
  },
  {
    id: 'penalties',
    step: 8,
    title: 'Be Aware of Penalties',
    titleKo: '벌칙 숙지',
    description: 'Understand potential fines and consequences',
    descriptionKo: '잠재적 벌금 및 결과 이해',
    items: [
      {
        id: 'fine-no-rep',
        text: '₩30M fine for: No local representative',
        textKo: '₩3천만원 벌금: 국내 대리인 미지정',
        critical: true,
      },
      {
        id: 'fine-no-transparency',
        text: '₩30M fine for: No transparency mechanisms',
        textKo: '₩3천만원 벌금: 투명성 메커니즘 부재',
        critical: true,
      },
      {
        id: 'fine-no-logs',
        text: '₩30M fine for: No audit logs',
        textKo: '₩3천만원 벌금: 감사 로그 부재',
        critical: true,
      },
      {
        id: 'suspension',
        text: 'Deployment suspension possible for high-impact violations',
        textKo: '고위험 위반 시 서비스 중단 가능',
        critical: true,
      },
    ],
    penalty: 'Total potential fines: ₩30M+ per violation',
    penaltyKo: '총 잠재 벌금: 위반 당 ₩3천만원 이상',
  },
];

export default function ChecklistPage() {
  const [language, setLanguage] = useState<'en' | 'ko'>('ko');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const calculateProgress = () => {
    const totalItems = checklistData.reduce((sum, section) => sum + section.items.length, 0);
    const completedCount = completedItems.size;
    return Math.round((completedCount / totalItems) * 100);
  };

  const progress = calculateProgress();

  return (
    <>
      <Head>
        <title>
          {language === 'ko'
            ? '한국 AI 기본법 준수 체크리스트 | AI 준법 가디언'
            : 'Korean AI Basic Act Compliance Checklist | AI Compliance Guardian'}
        </title>
        <meta
          name="description"
          content={
            language === 'ko'
              ? '2026년 시행 한국 AI 기본법 완벽 대응 체크리스트. 8단계로 준법 준비를 완료하세요.'
              : 'Complete compliance checklist for Korean AI Basic Act 2026. Prepare for enforcement in 8 steps.'
          }
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Language Toggle */}
            <div className="flex justify-end mb-8">
              <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                <button
                  onClick={() => setLanguage('ko')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    language === 'ko'
                      ? 'bg-obangsaek-cheong text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-obangsaek-cheong text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {language === 'ko'
                  ? '🇰🇷 한국 AI 기본법 준수 체크리스트'
                  : '🇰🇷 Korean AI Basic Act Compliance Checklist'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'ko'
                  ? '2026년 1월 22일 시행 대비 | 8단계 완벽 준비 가이드'
                  : 'Prepare for Jan 22, 2026 Enforcement | Complete 8-Step Guide'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'ko' ? '전체 진행도' : 'Overall Progress'}
                  </span>
                  <span className="text-2xl font-bold text-obangsaek-cheong">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-obangsaek-cheong to-obangsaek-nokdusaek h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {completedItems.size} / {checklistData.reduce((sum, s) => sum + s.items.length, 0)}{' '}
                  {language === 'ko' ? '항목 완료' : 'items completed'}
                </p>
              </div>
            </div>

            {/* Checklist Sections */}
            <div className="space-y-8 max-w-5xl mx-auto">
              {checklistData.map((section) => (
                <div key={section.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-obangsaek-cheong to-blue-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                        {section.step}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">
                          {language === 'ko' ? section.titleKo : section.title}
                        </h2>
                        <p className="text-blue-100">
                          {language === 'ko' ? section.descriptionKo : section.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="p-6 space-y-4">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                          completedItems.has(item.id)
                            ? 'border-green-500 bg-green-50'
                            : item.critical
                            ? 'border-red-300 bg-red-50/50'
                            : 'border-gray-200 bg-white'
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {/* Checkbox */}
                        <div className="pt-1">
                          <div
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              completedItems.has(item.id)
                                ? 'bg-green-500 border-green-500'
                                : item.critical
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                          >
                            {completedItems.has(item.id) && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <p
                            className={`text-base ${
                              completedItems.has(item.id)
                                ? 'line-through text-gray-500'
                                : 'text-gray-800'
                            }`}
                          >
                            {language === 'ko' ? item.textKo : item.text}
                          </p>
                          {item.critical && !completedItems.has(item.id) && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                              {language === 'ko' ? '필수' : 'Critical'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tools Section */}
                  {section.tools && section.tools.length > 0 && (
                    <div className="px-6 pb-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>🛠️</span>
                          {language === 'ko' ? '추천 도구' : 'Recommended Tools'}
                        </h4>
                        <ul className="space-y-1">
                          {section.tools.map((tool, idx) => (
                            <li key={idx}>
                              <a
                                href={tool.link}
                                className="text-obangsaek-cheong hover:underline text-sm"
                              >
                                → {tool.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Penalty Warning */}
                  {section.penalty && (
                    <div className="px-6 pb-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700 font-medium">
                              {language === 'ko' ? section.penaltyKo : section.penalty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-obangsaek-cheong to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-4">
                  {language === 'ko'
                    ? '자동화로 준법을 더 쉽게!'
                    : 'Automate Your Compliance Journey'}
                </h3>
                <p className="text-xl mb-6 text-blue-100">
                  {language === 'ko'
                    ? 'AI 준법 가디언으로 모든 체크리스트를 자동 관리하세요'
                    : 'Manage your entire checklist automatically with AI Compliance Guardian'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-white text-obangsaek-cheong rounded-lg font-bold text-lg hover:shadow-xl transition-all"
                  >
                    {language === 'ko' ? '무료 평가 시작 →' : 'Start Free Assessment →'}
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-block px-8 py-4 bg-obangsaek-nokdusaek text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all"
                  >
                    {language === 'ko' ? '요금제 보기' : 'View Pricing'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Download PDF CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  // TODO: Implement PDF download
                  alert(
                    language === 'ko'
                      ? 'PDF 다운로드 기능 준비 중입니다!'
                      : 'PDF download feature coming soon!'
                  );
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:border-obangsaek-cheong hover:text-obangsaek-cheong transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {language === 'ko' ? 'PDF 다운로드' : 'Download PDF'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
    },
  };
};
