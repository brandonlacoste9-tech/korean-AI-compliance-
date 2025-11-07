# Copilot Enterprise Instructions

## Purpose
Copilot Enterprise is enabled for this repo. All automated generation must comply with Korean AI 기본법 & PIPC, use formal Korean (존댓말), and Obangsaek/glassmorphism UI standards.

## Backend
- Always log consent, IP, timestamp for /api/risk/assess
- Use SQLAlchemy and Supabase Seoul residency only
- All error messages in 존댓말 (formal Korean) and English
- Do NOT expose secrets in suggestions or code

## Frontend
- UI must use Obangsaek palette:
  - 백 (White), 청 (Blue), 적 (Red), 흑 (Black), 황 (Yellow)
- Glassmorphism on modal, header, buttons
- Always support bilingual (ko/en) with next-i18next
- MSIT, PIPC trust badges present on landing, forms
- Mobile-first (95% of users mobile)

## CI/CD
- Always include secret scanning
- Use branch protection: 1+ review to merge
- Show countdown (until 2026-01-22) prominently in Korean & English in UI/code

## Legal/Compliance
- All generated output must be MSIT and PIPC compliant
- Email templates, Stripe info should be formal, never casual
- Refer to this file for all Copilot Chat prompts

---

엔터프라이즈 코파일럿을 사용할 때, 반드시 한국 준법(준수) 및 오방색 디자인, 존댓말 로깅을 지켜주세요.