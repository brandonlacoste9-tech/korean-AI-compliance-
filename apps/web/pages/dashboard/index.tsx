import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { ComplianceBadgeGrid } from '@/components/ComplianceBadge';

interface ComplianceStatus {
  overall: 'compliant' | 'warning' | 'non-compliant';
  lastAudit: string;
  nextAudit: string;
  assessments: number;
  issues: number;
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';
  
  // Placeholder data - would be fetched from API
  const [status, setStatus] = useState<ComplianceStatus>({
    overall: 'compliant',
    lastAudit: '2024-11-01',
    nextAudit: '2025-02-01',
    assessments: 12,
    issues: 2,
  });

  const statusColors = {
    compliant: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'non-compliant': 'bg-red-100 text-red-800 border-red-300',
  };

  const statusLabels = {
    compliant: isKorean ? '준수' : 'Compliant',
    warning: isKorean ? '주의' : 'Warning',
    'non-compliant': isKorean ? '미준수' : 'Non-Compliant',
  };

  return (
    <>
      <Head>
        <title>{isKorean ? '대시보드 | AI 준법 가디언' : 'Dashboard | AI Compliance Guardian'}</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-obangsaek-cheong hover:underline mb-8 inline-block">
            ← {isKorean ? '홈으로' : 'Back to Home'}
          </Link>

          <h1 className="text-5xl font-black text-obangsaek-cheong mb-8">
            {isKorean ? '준법 대시보드' : 'Compliance Dashboard'}
          </h1>

          {/* Auth placeholder - would check authentication */}
          <div className="glass p-6 rounded-xl mb-8 border-2 border-yellow-400 bg-yellow-50">
            <p className="text-gray-700 formal-korean">
              {isKorean
                ? '⚠️ 인증이 필요합니다. 로그인하여 대시보드에 액세스하세요.'
                : '⚠️ Authentication required. Please log in to access the dashboard.'}
            </p>
            <Link 
              href="/api/auth/login"
              className="mt-4 inline-block px-6 py-2 bg-obangsaek-cheong text-white rounded-lg font-bold hover:bg-obangsaek-cheong-dark transition-colors"
            >
              {isKorean ? '로그인' : 'Log In'}
            </Link>
          </div>

          {/* Dashboard Preview - would be shown after auth */}
          <div className="space-y-8 opacity-50">
            <ComplianceBadgeGrid />

            {/* Overall Status */}
            <div className="glass p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-obangsaek-cheong mb-6">
                {isKorean ? '전체 준법 현황' : 'Overall Compliance Status'}
              </h2>
              
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 font-bold text-lg ${statusColors[status.overall]}`}>
                <span className="text-2xl">
                  {status.overall === 'compliant' ? '✓' : status.overall === 'warning' ? '⚠️' : '✗'}
                </span>
                {statusLabels[status.overall]}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <StatCard 
                  label={isKorean ? '완료된 평가' : 'Assessments Completed'}
                  value={status.assessments.toString()}
                  icon="📊"
                />
                <StatCard 
                  label={isKorean ? '미해결 이슈' : 'Open Issues'}
                  value={status.issues.toString()}
                  icon="⚠️"
                />
                <StatCard 
                  label={isKorean ? '마지막 감사' : 'Last Audit'}
                  value={status.lastAudit}
                  icon="📅"
                />
                <StatCard 
                  label={isKorean ? '다음 감사' : 'Next Audit'}
                  value={status.nextAudit}
                  icon="📆"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? '최근 활동' : 'Recent Activity'}
              </h2>
              <div className="space-y-4">
                <ActivityItem 
                  title={isKorean ? 'AI 위험 평가 완료' : 'AI Risk Assessment Completed'}
                  date="2024-11-14"
                  status="success"
                />
                <ActivityItem 
                  title={isKorean ? '감사 로그 생성됨' : 'Audit Log Generated'}
                  date="2024-11-13"
                  status="success"
                />
                <ActivityItem 
                  title={isKorean ? '투명성 보고서 대기 중' : 'Transparency Report Pending'}
                  date="2024-11-12"
                  status="warning"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? '빠른 작업' : 'Quick Actions'}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <ActionButton 
                  label={isKorean ? '새 위험 평가' : 'New Risk Assessment'}
                  icon="📋"
                />
                <ActionButton 
                  label={isKorean ? '보고서 생성' : 'Generate Report'}
                  icon="📄"
                />
                <ActionButton 
                  label={isKorean ? '지원 문의' : 'Contact Support'}
                  icon="💬"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-obangsaek-cheong transition-colors">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-black text-obangsaek-cheong mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function ActivityItem({ title, date, status }: { title: string; date: string; status: 'success' | 'warning' }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{status === 'success' ? '✓' : '⚠️'}</span>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-obangsaek-cheong text-obangsaek-cheong hover:bg-obangsaek-cheong hover:text-white transition-colors font-bold">
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Would check authentication here
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
