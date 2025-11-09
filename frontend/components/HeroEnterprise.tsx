import React from 'react';

export const HeroEnterprise = () => (
  <section className="min-h-screen bg-bgPrimary text-textLight font-sans flex flex-col justify-center px-6 sm:px-12 lg:px-24">
    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">대한민국 AI 컴플라이언스 허브</h1>
    <p className="mt-4 text-lg text-textMuted">
      AI 기본법(2026)에 대비한 기업용 리스크 평가 및 준수 플랫폼
    </p>
    <div className="mt-8">
      <a
        href="/"
        className="inline-block bg-accentYellow text-black py-3 px-8 rounded-md font-medium hover:bg-yellow-500 transition"
      >
        무료 리스크 평가 시작하기
      </a>
    </div>
  </section>
);
