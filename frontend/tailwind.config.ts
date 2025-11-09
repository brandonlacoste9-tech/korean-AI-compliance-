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
          baek: '#FFFFFF',    // 백 - White (center)
          cheong: '#0047AB',  // 청 - Blue (east)
          jeok: '#C8102E',    // 적 - Red (south)
          heuk: '#000000',    // 흑 - Black (north)
          hwang: '#FFD700',   // 황 - Yellow (west)
        },
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
