# Monitoring Scripts

This directory contains PowerShell scripts for monitoring the Korean AI Compliance platform infrastructure.

## Available Scripts

### 1. vercel-status.ps1
Checks the status of Vercel deployments for the frontend application.

### 2. render-status.ps1
Monitors the Render backend service health and deployment status. Supports continuous monitoring with the `-Watch` flag.

### 3. full-stack-monitor.ps1
Comprehensive health check for the entire stack including:
- Backend (Render)
- Frontend (Vercel)
- Database (Supabase Seoul)

## Prerequisites

These scripts require API keys to be set as environment variables for security purposes.

### Required Environment Variables

- **VERCEL_TOKEN**: Your Vercel API token (for `vercel-status.ps1`)
- **RENDER_API_KEY**: Your Render API key (for `render-status.ps1` and `full-stack-monitor.ps1`)

### Setting Environment Variables

#### PowerShell (Windows)
```powershell
# Set for current session
$env:VERCEL_TOKEN = "your-vercel-token-here"
$env:RENDER_API_KEY = "your-render-api-key-here"

# Set permanently (User level)
[System.Environment]::SetEnvironmentVariable('VERCEL_TOKEN', 'your-vercel-token-here', 'User')
[System.Environment]::SetEnvironmentVariable('RENDER_API_KEY', 'your-render-api-key-here', 'User')
```

#### Bash (Linux/macOS)
```bash
# Set for current session
export VERCEL_TOKEN="your-vercel-token-here"
export RENDER_API_KEY="your-render-api-key-here"

# Set permanently (add to ~/.bashrc or ~/.zshrc)
echo 'export VERCEL_TOKEN="your-vercel-token-here"' >> ~/.bashrc
echo 'export RENDER_API_KEY="your-render-api-key-here"' >> ~/.bashrc
```

## Usage

### Vercel Status
```powershell
.\vercel-status.ps1
```

### Render Status
```powershell
# Single check
.\render-status.ps1

# Continuous monitoring (refresh every 30 seconds)
.\render-status.ps1 -Watch

# Custom refresh interval
.\render-status.ps1 -Watch -Interval 60
```

### Full Stack Monitor
```powershell
.\full-stack-monitor.ps1
```

## Security Notes

⚠️ **Important**: Never commit API keys or tokens to version control. Always use environment variables or secure vaults for sensitive credentials.

- API keys are read from environment variables at runtime
- Scripts will fail with a clear error message if required environment variables are not set
- The `.env` file pattern is already in `.gitignore` if you choose to use a local `.env` file

## Obtaining API Keys

### Vercel Token
1. Log in to [Vercel](https://vercel.com)
2. Go to Settings → Tokens
3. Create a new token with appropriate permissions

### Render API Key
1. Log in to [Render](https://render.com)
2. Go to Account Settings → API Keys
3. Create a new API key

## Compliance

These scripts follow Korean AI 기본법 & PIPC requirements by:
- Not storing credentials in code
- Using secure environment variable access
- Providing bilingual documentation (한국어/English)
- Maintaining audit trails through proper logging
