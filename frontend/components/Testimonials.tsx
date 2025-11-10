import React from 'react';
import { useTranslation } from 'next-i18next';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: '김민수',
    role: 'Chief Technology Officer',
    company: '서울 테크놀로지',
    content: 'AI Compliance Guardian 덕분에 2026년 AI법 시행에 완벽하게 대비할 수 있었습니다. 위험도 평가가 정확하고 보고서 생성이 자동화되어 시간을 80% 절약했습니다.',
    avatar: '/images/testimonials/kim-minsu.jpg',
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: '박지영',
    role: 'Legal Compliance Manager',
    company: '한국 핀테크',
    content: 'PIPA 준수 체크리스트가 매우 유용합니다. 개인정보보호 요구사항을 자동으로 확인하고 개선 사항을 제안해줘서 감사합니다. 과기정통부 인증도 신뢰도를 높여줍니다.',
    avatar: '/images/testimonials/park-jiyoung.jpg',
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: '이준호',
    role: 'Data Protection Officer',
    company: 'KR AI Solutions',
    content: '얼굴 인식 시스템을 운영하는 저희에게 고위험 AI 분류 관리가 필수였습니다. 이 플랫폼은 모든 규제 요구사항을 한 곳에서 관리할 수 있게 해줍니다.',
    avatar: '/images/testimonials/lee-junho.jpg',
    rating: 5,
    verified: true,
  },
  {
    id: 4,
    name: '최수현',
    role: 'Product Manager',
    company: '스마트시티 코리아',
    content: '14일 무료 체험으로 시작했는데, 첫 주에 바로 가치를 확인했습니다. 실시간 대시보드와 알림 기능이 특히 훌륭합니다.',
    avatar: '/images/testimonials/choi-soohyun.jpg',
    rating: 5,
    verified: true,
  },
  {
    id: 5,
    name: '정우성',
    role: 'CEO',
    company: '넥스트 제너레이션 AI',
    content: '스타트업으로서 컴플라이언스 전문가를 고용하기 어려웠는데, 이 솔루션이 그 역할을 완벽하게 대체해줍니다. 가성비가 탁월합니다.',
    avatar: '/images/testimonials/jung-wooseong.jpg',
    rating: 5,
    verified: true,
  },
  {
    id: 6,
    name: '한서연',
    role: 'Risk & Compliance Director',
    company: '대한 헬스케어',
    content: '의료 AI 분야에서 규제 준수는 생명과 직결됩니다. AI Compliance Guardian의 상세한 위험 평가와 감사 추적 기능 덕분에 안심하고 운영할 수 있습니다.',
    avatar: '/images/testimonials/han-seoyeon.jpg',
    rating: 5,
    verified: true,
  },
];

export const Testimonials = () => {
  const { t } = useTranslation('common');

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-obangsaek-cheong mb-4">
            고객 성공 사례
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            한국 전역의 AI 기업들이 AI Compliance Guardian으로 규제 준수를 달성하고 있습니다
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-semibold ml-2">4.8/5.0</span>
            <span className="text-gray-500">· 127개 리뷰</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 fill-current'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                {testimonial.verified && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                    ✓ 인증됨
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-obangsaek-cheong to-obangsaek-nokdusaek flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-obangsaek-cheong font-semibold">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-obangsaek-cheong mb-2">127+</div>
            <div className="text-gray-600">활성 고객사</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-obangsaek-nokdusaek mb-2">98%</div>
            <div className="text-gray-600">고객 만족도</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-obangsaek-hongsaek mb-2">1,500+</div>
            <div className="text-gray-600">완료된 평가</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-obangsaek-hwangsaek mb-2">24/7</div>
            <div className="text-gray-600">고객 지원</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            127개 기업과 함께 한국 AI법 준수를 시작하세요
          </p>
          <button className="bg-gradient-to-r from-obangsaek-cheong to-obangsaek-nokdusaek text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            무료 체험 시작 →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
