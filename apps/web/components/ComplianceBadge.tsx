import React from 'react';
import { useTranslation } from 'next-i18next';

interface ComplianceBadgeProps {
  type: 'msit' | 'pipc' | 'iso42001';
  size?: 'sm' | 'md' | 'lg';
  verified?: boolean;
}

export default function ComplianceBadge({ 
  type, 
  size = 'md', 
  verified = true 
}: ComplianceBadgeProps) {
  const { t } = useTranslation('common');

  const badges = {
    msit: {
      name: 'MSIT',
      fullName: '과학기술정보통신부',
      fullNameEn: 'Ministry of Science and ICT',
      color: 'obangsaek-cheong',
      icon: '🇰🇷',
    },
    pipc: {
      name: 'PIPC',
      fullName: '개인정보보호위원회',
      fullNameEn: 'Personal Information Protection Commission',
      color: 'obangsaek-jeok',
      icon: '🛡️',
    },
    iso42001: {
      name: 'ISO 42001',
      fullName: 'AI Management System',
      fullNameEn: 'AI Management System Certification',
      color: 'obangsaek-hwang',
      icon: '✓',
    },
  };

  const badge = badges[type];
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <div 
      className={`compliance-badge inline-flex items-center gap-2 rounded-full font-semibold border-2 ${sizeClasses[size]} transition-all hover:scale-105`}
      style={{ 
        borderColor: `var(--color-${badge.color})`,
        color: `var(--color-${badge.color})`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-lg">{badge.icon}</span>
      <span className="font-black">{badge.name}</span>
      {verified && (
        <span className="text-green-600" title="인증 완료">✓</span>
      )}
    </div>
  );
}

export function ComplianceBadgeGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      <ComplianceBadge type="msit" />
      <ComplianceBadge type="pipc" />
      <ComplianceBadge type="iso42001" />
    </div>
  );
}
