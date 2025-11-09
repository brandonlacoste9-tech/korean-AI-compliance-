import React from 'react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-bgCard p-6 rounded-md border border-gray-700 hover:shadow-lg transition">
    <div className="h-12 w-12 mb-4 text-accentYellow">{icon}</div>
    <h3 className="text-xl font-semibold text-textLight mb-2">{title}</h3>
    <p className="text-textMuted">{description}</p>
  </div>
);
