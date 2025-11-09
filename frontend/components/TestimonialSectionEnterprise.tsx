import React from 'react';

const testimonials = [
  {
    name: '김민수',
    role: 'CTO',
    company: '서울테크놀로지',
    quote: 'AI 기본법 대응을 위해 이 플랫폼을 통해 리스크를 선제적으로 평가했습니다.'
  },
  {
    name: '이영희',
    role: 'Head of Data Science',
    company: '파인데이터',
    quote: '국내 규제 환경에 최적화된 툴로써 매우 유용했습니다.'
  },
  {
    name: '박준형',
    role: 'Compliance Lead',
    company: '코리아파이낸스',
    quote: '감사 로그 저장과 투명성 확보에 큰 도움이 되었습니다.'
  }
];

export const TestimonialSectionEnterprise = () => (
  <section className="py-24 bg-bgPrimary text-textLight px-6 sm:px-12 lg:px-24">
    <h2 className="text-3xl font-semibold mb-12">고객 후기</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-bgCard p-6 rounded-md border border-gray-700">
          <p className="italic mb-4">&ldquo;{t.quote}&rdquo;</p>
          <p className="font-semibold">{t.name}, {t.role} — {t.company}</p>
        </div>
      ))}
    </div>
  </section>
);
