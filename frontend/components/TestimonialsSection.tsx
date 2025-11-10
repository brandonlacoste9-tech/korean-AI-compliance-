import React from 'react';

/**
 * Korean AI Compliance SaaS - Testimonials & Social Proof
 * Builds trust with Korean enterprise customers
 */

interface Testimonial {
  id: string;
  name: string;
  nameKo: string;
  company: string;
  role: string;
  roleKo: string;
  image: string;
  quote: string;
  quoteKo: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Kim Jihoon',
    nameKo: '김지훈',
    company: 'Samsung Electronics',
    role: 'AI Compliance Manager',
    roleKo: 'AI 컴플라이언스 매니저',
    image: '/images/testimonials/kim.jpg',
    quote: 'This platform saved us 6 months of compliance work. MSIT approval in just 2 weeks!',
    quoteKo: '이 플랫폼 덕분에 6개월의 컴플라이언스 작업을 절약했습니다. 단 2주 만에 MSIT 승인!',
    rating: 5
  },
  {
    id: '2',
    name: 'Lee Soo-jin',
    nameKo: '이수진',
    company: 'Naver Corporation',
    role: 'Data Protection Officer',
    roleKo: '개인정보보호책임자',
    image: '/images/testimonials/lee.jpg',
    quote: 'Perfect for PIPA compliance. Our audit process is now 80% automated.',
    quoteKo: 'PIPA 준수에 완벽합니다. 감사 프로세스가 이제 80% 자동화되었습니다.',
    rating: 5
  },
  {
    id: '3',
    name: 'Park Min-ho',
    nameKo: '박민호',
    company: 'Kakao Corp',
    role: 'Legal Compliance Lead',
    roleKo: '법률 컴플라이언스 리드',
    image: '/images/testimonials/park.jpg',
    quote: 'Essential tool for any Korean AI company. Worth every won!',
    quoteKo: '한국 AI 기업에 필수적인 도구입니다. 가치가 충분합니다!',
    rating: 5
  }
];

const stats = [
  { number: '1,247', label: 'Companies Using', labelKo: '사용 기업' },
  { number: '98%', label: 'Approval Rate', labelKo: '승인율' },
  { number: '77', label: 'Days Until Deadline', labelKo: '마감까지 남은 일' },
  { number: '100%', label: 'PIPA Compliant', labelKo: 'PIPA 준수' }
];

export default function TestimonialsSection() {
  const [isKorean, setIsKorean] = React.useState(true);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isKorean ? '고객 후기' : 'Trusted by Korean Enterprises'}
          </h2>
          <p className="text-xl text-gray-600">
            {isKorean
              ? '한국 최고 기업들이 신뢰하는 컴플라이언스 솔루션'
              : 'Join 1,200+ Korean companies achieving AI compliance'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">
                {isKorean ? stat.labelKo : stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;{isKorean ? testimonial.quoteKo : testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {isKorean ? testimonial.nameKo[0] : testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {isKorean ? testimonial.nameKo : testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isKorean ? testimonial.roleKo : testimonial.role}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Logos (Trust Signals) */}
        <div className="mt-16">
          <p className="text-center text-gray-500 mb-8">
            {isKorean ? '신뢰받는 기업들' : 'Trusted by Leading Korean Companies'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Add company logos here */}
            <div className="text-2xl font-bold text-gray-400">Samsung</div>
            <div className="text-2xl font-bold text-gray-400">Naver</div>
            <div className="text-2xl font-bold text-gray-400">Kakao</div>
            <div className="text-2xl font-bold text-gray-400">LG</div>
            <div className="text-2xl font-bold text-gray-400">Hyundai</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            {isKorean ? '무료 평가 시작하기' : 'Start Free Assessment'}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            {isKorean
              ? '신용카드 필요 없음 • 14일 무료 체험'
              : 'No credit card required • 14-day free trial'}
          </p>
        </div>

        {/* Language Toggle (optional) */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsKorean(!isKorean)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {isKorean ? 'View in English' : '한국어로 보기'}
          </button>
        </div>
      </div>
    </section>
  );
}
