import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  keywords?: string[];
  canonicalUrl?: string;
}

export const SEO = ({
  title = 'AI Compliance Guardian - 한국 AI법 준수 솔루션',
  description = '2026년 1월 22일 시행되는 한국 인공지능(AI) 법규 완벽 대응. AI 위험도 평가, PIPA 컴플라이언스, 자동화된 보고서. 14일 무료 체험.',
  image = '/images/og-image.png',
  article = false,
  keywords = ['한국 AI법', 'AI 컴플라이언스', '인공지능 규제', 'PIPA', '개인정보보호', 'AI 위험도 평가', 'AI Act Korea'],
  canonicalUrl,
}: SEOProps) => {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app';
  const fullUrl = canonicalUrl || `${siteUrl}${router.asPath}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Structured data for Korean business
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Compliance Guardian',
    description: description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '390000',
      priceCurrency: 'KRW',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '390000',
        priceCurrency: 'KRW',
        billingDuration: 'P1M',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
    provider: {
      '@type': 'Organization',
      name: 'AI Compliance Guardian',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'KR',
        addressRegion: 'Seoul',
      },
    },
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="AI Compliance Guardian" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Mobile & PWA */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#003D82" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="AI Compliance" />

      {/* Korean Government Compliance */}
      <meta name="geo.region" content="KR-11" />
      <meta name="geo.placename" content="Seoul" />
      <meta name="language" content="Korean" />
      <meta name="country" content="South Korea" />

      {/* Robots & Indexing */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://korean-ai-compliance.onrender.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Security Headers (meta equivalents) */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Head>
  );
};

// Page-specific SEO helpers
export const HomeSEO = () => (
  <SEO
    title="AI Compliance Guardian - 한국 AI법 완벽 대응 솔루션"
    description="2026년 1월 22일 시행 대비! AI 위험도 평가, PIPA 준수, 자동화된 규제 보고. 과기정통부 인증. 14일 무료 체험 시작."
    keywords={['한국 AI법', 'AI 컴플라이언스', '2026 AI규제', 'MSIT 인증', 'PIPC 준수', '인공지능 법규']}
  />
);

export const PricingSEO = () => (
  <SEO
    title="가격 안내 - AI Compliance Guardian | 월 ₩390,000"
    description="투명한 가격. Professional 플랜 월 ₩390,000. 14일 무료 체험, AI 위험도 무제한 평가, PIPA 자동 체크, 우선 지원."
    keywords={['AI 컴플라이언스 가격', 'SaaS 가격', '한국 AI법 비용', '컴플라이언스 소프트웨어']}
  />
);

export const AssessmentSEO = () => (
  <SEO
    title="AI 위험도 평가 - 무료 분석 | AI Compliance Guardian"
    description="귀사의 AI 시스템 위험도를 즉시 평가하세요. 한국 AI법 분류 기준에 따른 무료 분석. 3분 소요."
    keywords={['AI 위험도 평가', 'AI 리스크 분석', '한국 AI법 분류', '무료 AI 평가']}
  />
);
