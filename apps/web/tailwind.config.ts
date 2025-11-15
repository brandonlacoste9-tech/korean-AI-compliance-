import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Obangsaek (오방색) - Traditional Korean Five Colors
        obangsaek: {
          // 백 (White/Center) - Purity, righteousness
          white: '#FFFFFF',
          baek: '#F8F9FA',
          // 청 (Blue/East) - Spring, growth
          cheong: '#003D82',
          'cheong-light': '#0066CC',
          'cheong-dark': '#002347',
          // 적 (Red/South) - Summer, passion
          jeok: '#CD2E3A',
          'jeok-light': '#FF4757',
          'jeok-dark': '#991F28',
          // 흑 (Black/North) - Winter, wisdom
          heuk: '#1A1A1A',
          'heuk-light': '#2D2D2D',
          // 황 (Yellow/Center) - Earth, balance
          hwang: '#F7B500',
          'hwang-light': '#FFD700',
          'hwang-dark': '#CC9200',
        },
        // Compliance-focused colors
        compliance: {
          approved: '#10B981',
          pending: '#F59E0B',
          rejected: '#EF4444',
          msit: '#003D82',
          pipc: '#CD2E3A',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'glassmorphism': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glassmorphism-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2))',
      },
    },
  },
  plugins: [],
};

export default config;
