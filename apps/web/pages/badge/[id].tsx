import React from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ComplianceBadge from '@/components/ComplianceBadge';

interface BadgeData {
  id: string;
  organizationName: string;
  organizationNameKo: string;
  badgeType: 'msit' | 'pipc' | 'iso42001';
  issuedDate: string;
  expiryDate: string;
  verified: boolean;
  verificationUrl: string;
}

export default function BadgeVerificationPage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';
  const router = useRouter();
  const { id } = router.query;

  // Placeholder data - would be fetched from API based on badge ID
  const badge: BadgeData = {
    id: id as string || 'BADGE-2024-001',
    organizationName: 'Sample AI Corp',
    organizationNameKo: '샘플 AI 기업',
    badgeType: 'msit',
    issuedDate: '2024-11-01',
    expiryDate: '2025-11-01',
    verified: true,
    verificationUrl: `https://msit.go.kr/verify/${id}`,
  };

  const badgeTypes = {
    msit: { name: 'MSIT', fullNameKo: '과학기술정보통신부', fullNameEn: 'Ministry of Science and ICT' },
    pipc: { name: 'PIPC', fullNameKo: '개인정보보호위원회', fullNameEn: 'Personal Information Protection Commission' },
    iso42001: { name: 'ISO 42001', fullNameKo: 'AI 관리 시스템', fullNameEn: 'AI Management System' },
  };

  const badgeInfo = badgeTypes[badge.badgeType];

  return (
    <>
      <Head>
        <title>
          {isKorean 
            ? `배지 검증 - ${badge.organizationNameKo} | AI 준법 가디언`
            : `Badge Verification - ${badge.organizationName} | AI Compliance Guardian`}
        </title>
        <meta 
          name="description" 
          content={isKorean 
            ? `${badge.organizationNameKo}의 ${badgeInfo.name} 준법 배지 검증`
            : `${badge.organizationName} ${badgeInfo.name} compliance badge verification`}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Verification Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-obangsaek-cheong mb-4">
                {isKorean ? '🇰🇷 배지 검증' : '🇰🇷 Badge Verification'}
              </h1>
              <p className="text-xl text-gray-600 formal-korean">
                {isKorean 
                  ? '한국 AI 기본법 및 PIPC 준법 인증 확인'
                  : 'Korean AI Basic Act and PIPC Compliance Certification'}
              </p>
            </div>

            {/* Badge Display */}
            <div className="glass p-8 rounded-xl shadow-2xl mb-8">
              <div className="text-center mb-8">
                <div className="inline-block mb-6">
                  <ComplianceBadge type={badge.badgeType} size="lg" verified={badge.verified} />
                </div>
                
                {badge.verified ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-xl font-bold">
                    <span className="text-3xl">✓</span>
                    <span>{isKorean ? '인증 확인됨' : 'Verified'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-600 text-xl font-bold">
                    <span className="text-3xl">✗</span>
                    <span>{isKorean ? '인증 실패' : 'Not Verified'}</span>
                  </div>
                )}
              </div>

              {/* Organization Details */}
              <div className="space-y-4 text-gray-700">
                <DetailRow 
                  label={isKorean ? '조직명' : 'Organization'}
                  value={isKorean ? badge.organizationNameKo : badge.organizationName}
                />
                <DetailRow 
                  label={isKorean ? '배지 ID' : 'Badge ID'}
                  value={badge.id}
                />
                <DetailRow 
                  label={isKorean ? '인증 기관' : 'Certifying Authority'}
                  value={isKorean ? badgeInfo.fullNameKo : badgeInfo.fullNameEn}
                />
                <DetailRow 
                  label={isKorean ? '발급일' : 'Issued Date'}
                  value={badge.issuedDate}
                />
                <DetailRow 
                  label={isKorean ? '만료일' : 'Expiry Date'}
                  value={badge.expiryDate}
                />
              </div>

              {/* Verification Link */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <a
                  href={badge.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-obangsaek-cheong hover:underline font-semibold"
                >
                  <span>{isKorean ? '공식 사이트에서 확인' : 'Verify on Official Site'}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* About This Badge */}
            <div className="glass p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? '이 배지에 대하여' : 'About This Badge'}
              </h2>
              <p className="text-gray-700 mb-4 formal-korean leading-relaxed">
                {isKorean
                  ? `이 ${badgeInfo.name} 배지는 조직이 한국 AI 기본법 및 개인정보보호 규정을 준수함을 나타냅니다. 모든 배지는 정기적으로 검증되며, 준법 상태가 유지되는지 확인됩니다.`
                  : `This ${badgeInfo.name} badge indicates that the organization complies with Korean AI Basic Act and personal data protection regulations. All badges are regularly verified to ensure ongoing compliance.`}
              </p>
              <p className="text-gray-700 formal-korean leading-relaxed">
                {isKorean
                  ? '배지 진위 여부가 확실하지 않은 경우, 위의 공식 확인 링크를 사용하시거나 당사에 문의하십시오.'
                  : 'If you are uncertain about the authenticity of this badge, please use the official verification link above or contact us.'}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4 formal-korean">
                {isKorean 
                  ? '귀사도 준법 인증을 받고 싶으신가요?' 
                  : 'Want to get compliance certification for your organization?'}
              </p>
              <Link
                href="/pricing"
                className="inline-block px-8 py-3 bg-obangsaek-cheong text-white rounded-lg font-bold hover:bg-obangsaek-cheong-dark transition-colors"
              >
                {isKorean ? '시작하기' : 'Get Started'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="font-mono text-gray-900">{value}</span>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  // Would fetch badge data from API based on params.id
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
