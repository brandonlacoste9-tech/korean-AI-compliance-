import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Analytics, trackConversion } from '@/components/Analytics';

export default function Enterprise() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    employees: '',
    aiSystems: '',
    urgency: 'high'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track conversion
    trackConversion('enterprise_demo_request');
    
    // TODO: Send to backend
    console.log('Enterprise demo request:', formData);
    
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Enterprise 솔루션 | AI 준법 가디언</title>
        <meta name="description" content="대기업 맞춤 AI 준법 관리 솔루션. 전담 컨설팅, 온사이트 교육, SLA 99.9% 보장." />
      </Head>

      <Analytics />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold mb-6">
                ⚠️ 2026년 1월 22일까지 437일
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                Enterprise AI 준법 솔루션
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12">
                대기업 맞춤형 완벽한 AI법 준수 시스템
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">✓</span>
                  <span className="font-semibold">MSIT 인증</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">✓</span>
                  <span className="font-semibold">PIPC 준수</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">✓</span>
                  <span className="font-semibold">ISO 27001</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">✓</span>
                  <span className="font-semibold">SLA 99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-16">
              왜 대기업이 선택하는가?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: '🏢',
                  title: '전담 컨설팅',
                  desc: '귀사 전용 컴플라이언스 전문가 배정. 맞춤형 로드맵 제공.'
                },
                {
                  icon: '🎯',
                  title: '온프레미스 옵션',
                  desc: '클라우드 또는 자체 서버. 보안 정책에 맞춘 유연한 배포.'
                },
                {
                  icon: '📊',
                  title: '실시간 대시보드',
                  desc: '경영진용 한눈에 보는 준법 현황. 위험 알림 즉시 수신.'
                },
                {
                  icon: '⚡',
                  title: 'API 무제한',
                  desc: '대용량 트래픽 지원. 초당 10,000건 처리 가능.'
                },
                {
                  icon: '🔒',
                  title: '금융권 보안',
                  desc: 'AES-256 암호화. 침투 테스트 완료. 정기 보안 감사.'
                },
                {
                  icon: '📞',
                  title: '24/7 지원',
                  desc: '전용 핫라인. 1시간 내 응답 보장. 온사이트 방문 지원.'
                }
              ].map((benefit, i) => (
                <div key={i} className="p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12">
                ROI 계산기
              </h2>

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">자체 구축 시</h3>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between border-b pb-2">
                        <span>컴플라이언스 담당자</span>
                        <span className="font-bold">₩60M/년</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>시스템 개발</span>
                        <span className="font-bold">₩80M</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>유지보수</span>
                        <span className="font-bold">₩20M/년</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>외부 컨설팅</span>
                        <span className="font-bold">₩30M/년</span>
                      </div>
                      <div className="flex justify-between pt-4 text-xl font-black text-red-600">
                        <span>총 비용</span>
                        <span>₩110M+/년</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI 준법 가디언</h3>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between border-b pb-2">
                        <span>Enterprise 플랜</span>
                        <span className="font-bold">₩24M/년</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>구축비</span>
                        <span className="font-bold">₩0</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>유지보수</span>
                        <span className="font-bold">₩0</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>컨설팅</span>
                        <span className="font-bold">포함</span>
                      </div>
                      <div className="flex justify-between pt-4 text-xl font-black text-green-600">
                        <span>총 비용</span>
                        <span>₩24M/년</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-600 mb-2">₩86M 절감</div>
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">78% 비용 절감</div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">ROI: 358%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Request Form */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {!submitted ? (
                <>
                  <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-6">
                    무료 데모 신청
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
                    30분 내 귀사 맞춤 데모를 제공해드립니다
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          회사명 *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          담당자명 *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          이메일 *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          연락처 *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        직원 수 *
                      </label>
                      <select
                        name="employees"
                        value={formData.employees}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      >
                        <option value="">선택하세요</option>
                        <option value="100-500">100-500명</option>
                        <option value="500-1000">500-1,000명</option>
                        <option value="1000-5000">1,000-5,000명</option>
                        <option value="5000+">5,000명 이상</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        AI 시스템 설명
                      </label>
                      <textarea
                        name="aiSystems"
                        value={formData.aiSystems}
                        onChange={handleChange}
                        rows={4}
                        placeholder="어떤 AI 시스템을 운영하고 계신가요? (예: 챗봇, 추천 시스템, 품질 검사 등)"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        도입 시급성
                      </label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      >
                        <option value="high">긴급 (1개월 내)</option>
                        <option value="medium">보통 (3개월 내)</option>
                        <option value="low">검토 단계</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all"
                    >
                      무료 데모 신청하기 →
                    </button>

                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                      영업일 기준 1시간 내 연락드립니다
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">✅</div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                    신청이 완료되었습니다!
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    {formData.name}님, 영업일 기준 1시간 내 연락드리겠습니다.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition"
                  >
                    다른 신청하기
                  </button>
                </div>
              )}
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
