# GitHub Actions Workflows

이 디렉토리는 한국 AI 준법 플랫폼의 자동화된 워크플로우를 포함합니다.
This directory contains automated workflows for the Korean AI Compliance platform.

## 📋 Active Workflows

### 🤖 Auto PR Triage (`auto-pr-triage.yml`)
**Purpose**: Automatically manage PR lifecycle and ensure code quality

**Triggers:**
- Daily at 9 AM UTC (6 PM KST)
- On PR events (opened, synchronize, reopened)
- Manual dispatch

**Features:**
- ✅ Automatic PR classification (keep/close/rebase/review)
- ✅ Closes outdated PRs with bilingual messages
- ✅ Rebases medium-priority PRs
- ✅ Runs lint and build checks
- ✅ CodeQL security analysis
- ✅ Posts status comments in Korean (존댓말) and English
- ✅ Korean AI 기본법 & PIPC compliance markers

---

### 🎨 Frontend CI (`frontend-ci.yml`)
**Purpose**: Lint, test, and build frontend code

**Triggers:**
- Push to main/develop (frontend changes)
- Pull requests to main/develop (frontend changes)

**Jobs:**
- Lint with ESLint
- Type check with TypeScript
- Run Jest tests with coverage
- Build Next.js application
- Security scanning with TruffleHog

---

### 🐍 Backend CI (`backend-ci.yml`)
**Purpose**: Lint, test, and validate Python backend

**Triggers:**
- Push to main/develop (backend changes)
- Pull requests to main/develop (backend changes)

**Jobs:**
- Format check with Black
- Lint with Flake8
- Import sorting with isort
- Type check with MyPy
- Run pytest with coverage
- Security scanning (Safety, Bandit, TruffleHog)
- Korean AI compliance verification

---

### 🛡️ Security & Compliance (`security-compliance.yml`)
**Purpose**: Comprehensive security and compliance scanning

**Triggers:**
- Push to main/develop
- Pull requests to main/develop
- Weekly schedule (Mondays at 9 AM UTC)

**Jobs:**
- Secret scanning with TruffleHog
- Dependency security review
- CodeQL security analysis (JavaScript & Python)
- Korean AI Basic Law compliance audit
- PIPC compliance verification
- Countdown to AI Basic Law deadline (2026-01-22)

---

### 💚 Health Check (`health-check.yml`)
**Purpose**: Monitor platform health continuously

**Triggers:**
- Every 5 minutes
- Manual dispatch

**Checks:**
- Backend API health
- Frontend availability
- Database connectivity
- External service status

---

### 🚀 Deploy (`deploy.yml`)
**Purpose**: Deploy application to production

**Triggers:**
- Push to main branch
- Manual dispatch

**Steps:**
- Build and deploy frontend
- Deploy backend services
- Run post-deployment health checks

---

## 🎯 Compliance Standards

All workflows enforce:
- ✅ Korean AI 기본법 (AI Basic Law) compliance
- ✅ PIPC (Personal Information Protection Commission) guidelines
- ✅ Formal Korean language (존댓말) in user-facing messages
- ✅ Bilingual support (Korean/English)
- ✅ Security scanning and vulnerability detection
- ✅ Audit logging and transparency

---

## 🔧 Manual Triggers

All workflows support manual triggering via `workflow_dispatch`:

```bash
# Trigger via GitHub CLI
gh workflow run auto-pr-triage.yml

# Or via GitHub UI:
# Actions → Select workflow → Run workflow
```

---

## 📊 Monitoring

View workflow runs:
- GitHub Actions tab
- Individual PR checks
- Email notifications on failure

---

## 🛠️ Maintenance

**Regular Tasks:**
1. Review failed workflow runs weekly
2. Update dependencies in workflows quarterly
3. Adjust PR classification rules as needed
4. Monitor CodeQL alerts and remediate

**Contact:**
- Workflow issues: Open an issue with `workflow` label
- Security concerns: Open an issue with `security` label

---

## 📚 Additional Resources

- [Workflow Automation Plan](../../WORKFLOW_AUTOMATION_PLAN.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Korean AI Basic Law Reference](../../docs/compliance/article-31-reference.md)

---

*Last updated: 2025-11-15*
*Maintained by: Development Team*
