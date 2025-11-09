import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Obangsaek (오방색) - Traditional Korean Five Colors
        obangsaek: {
          baek: '#FFFFFF',    // 백 - White (center)
          cheong: '#0047AB',  // 청 - Blue (east)
          jeok: '#C8102E',    // 적 - Red (south)
          heuk: '#000000',    // 흑 - Black (north)
          hwang: '#FFD700',   // 황 - Yellow (west)
          nokdusaek: '#8FBC8F', // 녹두색 - Green
        },
        // Enterprise Dark Theme
        bgPrimary: '#0A0F1C',
        bgCard: '#1E2A38',
        accentYellow: '#FFDD3C',
        textLight: '#F2F2F2',
        textMuted: '#6C7A89',
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
};

export default config;
