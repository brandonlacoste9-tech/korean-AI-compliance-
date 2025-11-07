# Korean AI Compliance Guardian - Frontend

Production-ready Next.js frontend with bilingual support (Korean/English), Obangsaek design system, and full MSIT/PIPC compliance features.

## Features

- **Bilingual Support**: Korean (formal 존댓말) and English via next-i18next
- **Obangsaek Color System**: Traditional Korean five colors (백, 청, 적, 흑, 황)
- **Glassmorphism UI**: Modern, mobile-first responsive design
- **77-Day Countdown**: Urgent countdown to January 22, 2026 compliance deadline
- **Risk Assessment Form**: Integrated with backend API for AI compliance evaluation
- **Stripe Integration**: KRW pricing for Professional Plan (₩390,000/월)
- **MSIT/PIPC Badges**: Trust indicators throughout the UI
- **Mobile-First**: Optimized for 95%+ mobile user base

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## Project Structure

```
frontend/
├── pages/
│   ├── _app.tsx           # App wrapper with i18n
│   ├── index.tsx          # Landing page
│   ├── success.tsx        # Stripe success page
│   └── cancel.tsx         # Stripe cancel page
├── components/
│   ├── Header.tsx         # Navigation with language toggle
│   ├── CountdownTimer.tsx # 77-day countdown
│   ├── RiskAssessment.tsx # Risk assessment form
│   └── PricingCards.tsx   # Pricing plans with Stripe
├── public/
│   └── locales/
│       ├── ko/common.json # Korean translations (formal)
│       └── en/common.json # English translations
├── styles/
│   └── globals.css        # Obangsaek colors and glassmorphism
├── __tests__/             # Component tests
└── ...config files
```

## Compliance Features

### PIPC Compliance
- Consent logging with IP and timestamp
- Seoul region data residency (Supabase)
- Formal Korean language throughout (존댓말)

### MSIT Certification
- Trust badges displayed prominently
- Compliance indicators on all pages

## Color System (Obangsaek)

- **백 (Baek)**: White `#FFFFFF` - Center
- **청 (Cheong)**: Blue `#0047AB` - East
- **적 (Jeok)**: Red `#C8102E` - South
- **흑 (Heuk)**: Black `#000000` - North
- **황 (Hwang)**: Yellow `#FFD700` - West

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- next-i18next
- Stripe
- Jest & React Testing Library

## License

Apache-2.0
