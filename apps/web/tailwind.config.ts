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
        // 🇰🇷 Korean Government Official Palette (Taeguk + Government UI)
        // Black / White / Red / Blue — National Colors
        taegukRed: '#C60C30',      // 태극 빨강 - warnings, required, errors
        taegukBlue: '#003478',     // 태극 파랑 - primary government blue
        govWhite: '#FFFFFF',       // 정부 흰색
        govBlack: '#101010',       // 정부 검정
        govGrayLight: '#F2F2F2',   // 정부 연한 회색
        govGray: '#C2C2C2',        // 정부 회색
        obangYellow: '#FDB813',    // 오방색 황색 - highlights, badges
        
        // Obangsaek (오방색) - Traditional Korean Five Colors (preserved)
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
          msit: '#003478',          // Updated to match taegukBlue
          pipc: '#C60C30',          // Updated to match taegukRed
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
