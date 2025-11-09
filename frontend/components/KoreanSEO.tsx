import Head from 'next/head';

interface KoreanSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

/**
 * Korean AI Compliance SaaS - SEO Component
 * Optimized for Korean market (Naver, Google Korea)
 */
export default function KoreanSEO({
  title = 'AI 컴플라이언스 가디언 - 한국 AI 법규 준수 솔루션',
  description = '2026년 1월 22일 한국 AI 기본법 시행 대비. MSIT 인증, PIPC 준수, 완벽한 AI 컴플라이언스 관리 솔루션.',
  keywords = ['AI 컴플라이언스', '한국 AI 법', 'PIPA', 'MSIT', '개인정보보호', 'AI 리스크 평가', '컴플라이언스 솔루션'],
  ogImage = '/images/og-korean-compliance.jpg',
  canonical
}: KoreanSEOProps) {
  const siteUrl = 'https://korean-ai-compliance.vercel.app'; // Update with your domain
  const fullTitle = `${title} | Korean AI Compliance Guardian`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Language */}
      <html lang="ko-KR" />
      <meta httpEquiv="content-language" content="ko-KR" />
      <link rel="alternate" hrefLang="ko" href={siteUrl} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:site_name" content="AI Compliance Guardian" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Naver Search Optimization */}
      <meta name="naver-site-verification" content="YOUR_NAVER_VERIFICATION_CODE" />
      <meta name="NaverBot" content="All" />
      <meta name="NaverBot" content="index,follow" />

      {/* Google Search Console */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Korean Market Specific */}
      <meta name="geo.region" content="KR" />
      <meta name="geo.placename" content="Seoul" />
      <meta name="geo.position" content="37.5665;126.9780" />
      <meta name="ICBM" content="37.5665, 126.9780" />

      {/* Business Schema.org for Korean Market */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AI Compliance Guardian',
            alternateName: 'AI 컴플라이언스 가디언',
            url: siteUrl,
            logo: `${siteUrl}/images/logo.png`,
            description: description,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'KR',
              addressRegion: 'Seoul',
              addressLocality: 'Gangnam-gu'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer Service',
              email: 'support@ai-compliance.kr',
              availableLanguage: ['Korean', 'English']
            },
            sameAs: [
              // Add social media links
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'AI Compliance Consulting',
            provider: {
              '@type': 'Organization',
              name: 'AI Compliance Guardian'
            },
            areaServed: {
              '@type': 'Country',
              name: 'South Korea'
            },
            description: description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'KRW',
              price: '390000',
              priceValidUntil: '2026-12-31'
            }
          })
        }}
      />

      {/* FAQ Schema (helps Google show rich results) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '한국 AI 기본법이 언제 시행되나요?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '2026년 1월 22일부터 한국 AI 기본법이 전면 시행됩니다.'
                }
              },
              {
                '@type': 'Question',
                name: 'MSIT 승인이 필요한가요?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '고위험 AI 시스템은 과학기술정보통신부(MSIT)의 사전 승인이 필요합니다.'
                }
              },
              {
                '@type': 'Question',
                name: 'PIPA 준수는 어떻게 하나요?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '개인정보보호법(PIPA) 준수를 위해 당사의 자동화된 컴플라이언스 도구를 사용하세요.'
                }
              }
            ]
          })
        }}
      />

      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://korean-ai-compliance.onrender.com" />

      {/* DNS Prefetch for faster loading */}
      <link rel="dns-prefetch" href="https://checkout.stripe.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

      {/* Korean Fonts Preload */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
        as="style"
      />
    </Head>
  );
}
