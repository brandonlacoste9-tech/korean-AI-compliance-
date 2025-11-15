# AI Compliance Guardian - Web Application

Korean AI Basic Act & PIPC Compliance SaaS - Next.js Frontend

## 🇰🇷 Features

- **Bilingual Support**: Korean (KR) first, English (EN) parity
- **Obangsaek Design**: Traditional Korean five-color system (오방색)
- **Glassmorphism UI**: Modern, compliant interface
- **Countdown Timer**: Real-time countdown to AI Basic Act (Jan 22, 2026)
- **MSIT/PIPC Badges**: Compliance certification display
- **Seoul Data Residency**: All data stored in Seoul region (Supabase)

## 📋 Pages

- `/` - Landing page with countdown and features
- `/compliance` - Korean AI Basic Act & PIPC compliance guide
- `/pricing` - Pricing tiers (KRW only, Stripe integration)
- `/dashboard` - User compliance dashboard (auth required)
- `/badge/[id]` - Dynamic badge verification page
- `/legal/privacy` - Privacy policy (formal Korean, PIPC compliant)
- `/faq` - Frequently asked questions
- `/contact` - Contact form with PIPC consent

## 🎨 Design System

### Obangsaek Colors
- **백 (Baek/White)**: `#F8F9FA` - Purity, righteousness
- **청 (Cheong/Blue)**: `#003D82` - Spring, growth (MSIT)
- **적 (Jeok/Red)**: `#CD2E3A` - Summer, passion (PIPC)
- **흑 (Heuk/Black)**: `#1A1A1A` - Winter, wisdom
- **황 (Hwang/Yellow)**: `#F7B500` - Earth, balance

### Glassmorphism
- Frosted glass effects with backdrop blur
- Transparent overlays with border highlights
- Compliance badge styling

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (Seoul Region)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (KRW only)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Obangsaek
- **i18n**: next-i18next
- **Auth**: Supabase Auth
- **Database**: Supabase (Seoul)
- **Payments**: Stripe (KRW)
- **API Client**: Axios

## 🛡️ Compliance

### PIPC Requirements
- ✓ Explicit user consent
- ✓ Data residency (Seoul)
- ✓ Audit logging (3 years)
- ✓ Formal Korean language (존댓말)

### MSIT Requirements
- ✓ AI system registration
- ✓ Transparency reporting
- ✓ Risk assessment tools
- ✓ Compliance monitoring

### Korean AI Basic Act
- ✓ Countdown to Jan 22, 2026
- ✓ Risk classification
- ✓ User rights protection
- ✓ Incident reporting

## 📄 License

Proprietary - Korean AI Compliance Guardian

---

**Data Residency**: 🇰🇷 Seoul, Republic of Korea  
**Compliance**: MSIT · PIPC · ISO 42001  
**Languages**: 한국어 (Korean) · English
