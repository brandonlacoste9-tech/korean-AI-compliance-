# Korean AI Compliance

Automated compliance monitoring for Korea's AI Basic Act (Enforcement: Jan 22, 2026).

## Quick Start

### Backend  
```bash
cd backend
cp .env.example .env  # Add secrets here!
pip install fastapi uvicorn pytest httpx
# Or if requirements.txt exists: pip install -r requirements.txt
uvicorn app.main:app --reload
```
Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the API UI.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## Modern Dev Workflow

- **Use feature branches!**  
  Create a new branch for major features or fixes:
  ```bash
  git checkout -b feature/my-new-feature
  # ...make changes...
  git push origin feature/my-new-feature
  ```
  Open a Pull Request (PR) to merge to `main`.  
  **Enable branch protection** in GitHub settings for peer review and production safety.

  [GitHub branch protection guide →](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

- **CI/CD Secrets &amp; Safety:**  
  Do **not** commit `.env` files with secrets.  
  Store secrets as repo/environment variables ([GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)).  
  The sample `.env.example` is provided.

## Deployment

| Layer      | Platform           | Guide                                                            |
|------------|--------------------|------------------------------------------------------------------|
| Backend    | [Railway](https://railway.app) / [Render](https://render.com) / [Fly.io](https://fly.io)      | [Python FastAPI on Railway →](https://docs.railway.app/guides/deploy-fastapi)   |
| Frontend   | [Netlify](https://www.netlify.com/) / [Vercel](https://vercel.com/)       | [Next.js on Netlify →](https://docs.netlify.com/integrations/frameworks/next-js/overview/) |

**CI/CD is auto-configured:**  
Merges to `main` will run tests and (if deploy keys/secrets present) deploy to Railway/Netlify.

## Features

- Regulatory monitoring (MSIT/PIPC/law.go.kr)
- Risk assessment scoring (0-100)
- Korean compliance templates
- Evidence vault with timestamping
- Domestic representative service
- Internationalization: Add Korean language/i18n for frontend, docs, and UI

## Revenue Model

- **Free tier:** Weekly updates
- **Pro:** ₩3.9M/year - Daily monitoring + API
- **Enterprise:** ₩19.9M/year - Full compliance + rep service

## Security &amp; Maintenance

- Keep dependencies updated (`pip list --outdated`, `npm outdated`)
- Use Dependabot for automated PRs ([see setup](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/about-dependabot-version-updates))
- Report vulnerabilities via GitHub "Security" tab or [email](mailto:brandon@brandonlacoste9-tech.com)

---

Contact: brandon@brandonlacoste9-tech.com
