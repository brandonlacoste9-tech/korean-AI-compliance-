# Korean AI Compliance Guardian - Installation Script
# Usage: irm https://claude.ai/install.ps1 | iex
# This script automatically sets up the Korean AI Compliance Guardian application

#Requires -Version 5.1

param(
    [string]$InstallPath = "$env:USERPROFILE\korean-ai-compliance",
    [switch]$SkipPrerequisites,
    [switch]$NoInteractive,
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Color output functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  $($Message.PadRight(59))  ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message)
    Write-Host "▶ $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "  ℹ️  $Message" -ForegroundColor Gray
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "  ⚠️  $Message" -ForegroundColor Yellow
}

# Check if a command exists
function Test-CommandExists {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check and install prerequisites
function Test-Prerequisites {
    Write-Header "Checking Prerequisites"

    $missing = @()

    # Check Git
    Write-Step "Checking for Git..."
    if (Test-CommandExists "git") {
        $gitVersion = git --version
        Write-Success "Git found: $gitVersion"
    } else {
        Write-Warning-Custom "Git not found"
        $missing += "Git"
    }

    # Check Node.js
    Write-Step "Checking for Node.js..."
    if (Test-CommandExists "node") {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
    } else {
        Write-Warning-Custom "Node.js not found"
        $missing += "Node.js"
    }

    # Check Python
    Write-Step "Checking for Python..."
    if (Test-CommandExists "python") {
        $pythonVersion = python --version
        Write-Success "Python found: $pythonVersion"
    } elseif (Test-CommandExists "python3") {
        $pythonVersion = python3 --version
        Write-Success "Python found: $pythonVersion"
    } else {
        Write-Warning-Custom "Python not found"
        $missing += "Python"
    }

    return $missing
}

# Install prerequisites using winget
function Install-Prerequisites {
    param([array]$Missing)

    if ($Missing.Count -eq 0) {
        return
    }

    Write-Header "Installing Missing Prerequisites"

    # Check if winget is available
    if (-not (Test-CommandExists "winget")) {
        Write-Error-Custom "winget not found. Please install prerequisites manually:"
        Write-Info "Git: https://git-scm.com/download/win"
        Write-Info "Node.js: https://nodejs.org/"
        Write-Info "Python: https://www.python.org/downloads/"
        throw "Prerequisites missing and winget unavailable"
    }

    foreach ($tool in $Missing) {
        Write-Step "Installing $tool..."

        try {
            switch ($tool) {
                "Git" {
                    winget install --id Git.Git -e --source winget --silent --accept-package-agreements --accept-source-agreements
                }
                "Node.js" {
                    winget install --id OpenJS.NodeJS.LTS -e --source winget --silent --accept-package-agreements --accept-source-agreements
                }
                "Python" {
                    winget install --id Python.Python.3.11 -e --source winget --silent --accept-package-agreements --accept-source-agreements
                }
            }
            Write-Success "$tool installed successfully"
        } catch {
            Write-Error-Custom "Failed to install $tool : $_"
            throw "Installation failed"
        }
    }

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    Write-Success "Environment variables refreshed"
}

# Clone repository
function Clone-Repository {
    Write-Header "Cloning Repository"

    if (Test-Path $InstallPath) {
        Write-Warning-Custom "Directory already exists: $InstallPath"

        if (-not $NoInteractive) {
            $response = Read-Host "Do you want to delete it and reinstall? (y/N)"
            if ($response -ne "y" -and $response -ne "Y") {
                Write-Info "Installation cancelled"
                exit 0
            }
        }

        Write-Step "Removing existing directory..."
        Remove-Item -Path $InstallPath -Recurse -Force
        Write-Success "Existing directory removed"
    }

    Write-Step "Cloning from GitHub..."
    try {
        git clone --branch $Branch https://github.com/brandonlacoste9-tech/korean-AI-compliance-.git $InstallPath
        Write-Success "Repository cloned successfully"
    } catch {
        Write-Error-Custom "Failed to clone repository: $_"
        throw "Clone failed"
    }
}

# Setup backend
function Setup-Backend {
    Write-Header "Setting Up Backend (FastAPI)"

    Set-Location "$InstallPath\backend"

    # Create virtual environment
    Write-Step "Creating Python virtual environment..."
    try {
        if (Test-CommandExists "python") {
            python -m venv venv
        } else {
            python3 -m venv venv
        }
        Write-Success "Virtual environment created"
    } catch {
        Write-Error-Custom "Failed to create virtual environment: $_"
        throw "Virtual environment creation failed"
    }

    # Activate virtual environment and install dependencies
    Write-Step "Installing Python dependencies..."
    try {
        if ($IsWindows -or $env:OS -match "Windows") {
            & ".\venv\Scripts\Activate.ps1"
            .\venv\Scripts\python.exe -m pip install --upgrade pip
            .\venv\Scripts\pip.exe install -r requirements.txt
        } else {
            & "./venv/bin/Activate.ps1"
            ./venv/bin/python -m pip install --upgrade pip
            ./venv/bin/pip install -r requirements.txt
        }
        Write-Success "Python dependencies installed"
    } catch {
        Write-Error-Custom "Failed to install dependencies: $_"
        throw "Dependency installation failed"
    }

    # Copy environment file
    Write-Step "Setting up environment configuration..."
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Success "Backend .env file created (please configure)"
    } else {
        Write-Info "Backend .env file already exists"
    }
}

# Setup frontend
function Setup-Frontend {
    Write-Header "Setting Up Frontend (Next.js)"

    Set-Location "$InstallPath\frontend"

    # Install dependencies
    Write-Step "Installing Node.js dependencies..."
    try {
        # Check if pnpm is available, otherwise use npm
        if (Test-CommandExists "pnpm") {
            Write-Info "Using pnpm for package installation"
            pnpm install
        } elseif (Test-CommandExists "npm") {
            Write-Info "Using npm for package installation"
            npm install
        } else {
            Write-Error-Custom "Neither npm nor pnpm found"
            throw "Package manager not found"
        }
        Write-Success "Node.js dependencies installed"
    } catch {
        Write-Error-Custom "Failed to install dependencies: $_"
        throw "Dependency installation failed"
    }

    # Copy environment file
    Write-Step "Setting up environment configuration..."
    if (-not (Test-Path ".env.local")) {
        Copy-Item ".env.example" ".env.local"
        Write-Success "Frontend .env.local file created (please configure)"
    } else {
        Write-Info "Frontend .env.local file already exists"
    }
}

# Display next steps
function Show-NextSteps {
    Write-Header "Installation Complete! 🎉"

    Write-Host @"
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT STEPS                               │
└─────────────────────────────────────────────────────────────────┘

1️⃣  Configure Environment Variables:

   Backend: $InstallPath\backend\.env
   • DATABASE_URL         - PostgreSQL connection string
   • STRIPE_SECRET_KEY    - Stripe API secret key
   • RESEND_API_KEY       - Resend email API key
   • JWT_SECRET           - Secure random string for JWT

   Frontend: $InstallPath\frontend\.env.local
   • NEXT_PUBLIC_API_URL              - Backend API URL
   • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Stripe publishable key
   • NEXT_PUBLIC_STRIPE_PRICE_ID        - Stripe price ID
   • XAI_API_KEY                        - xAI/Grok API key

2️⃣  Start the Backend Server:
   cd $InstallPath\backend
   .\venv\Scripts\Activate.ps1
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

3️⃣  Start the Frontend Server (in a new terminal):
   cd $InstallPath\frontend
   npm run dev
   # Or: pnpm dev

4️⃣  Access the Application:
   Frontend: http://localhost:3000
   Backend API: http://localhost:8000
   API Docs: http://localhost:8000/docs

5️⃣  Test Deployment Status:
   .\test-deployment.ps1

┌─────────────────────────────────────────────────────────────────┐
│                         RESOURCES                               │
└─────────────────────────────────────────────────────────────────┘

📚 Documentation: $InstallPath\docs\
🔧 Scripts: $InstallPath\scripts\
🐛 Issues: https://github.com/brandonlacoste9-tech/korean-AI-compliance-/issues

┌─────────────────────────────────────────────────────────────────┐
│         Korean AI Compliance Guardian - Ready to Go! 🇰🇷         │
└─────────────────────────────────────────────────────────────────┘

⏰ Countdown: Only 77 days until compliance deadline (Jan 22, 2026)

"@ -ForegroundColor Cyan
}

# Main installation flow
try {
    Write-Header "Korean AI Compliance Guardian - Installer"
    Write-Host "한국형 AI 기본법 & PIPC 준수 SaaS" -ForegroundColor Magenta
    Write-Host ""
    Write-Info "Installation path: $InstallPath"
    Write-Info "Branch: $Branch"
    Write-Host ""

    # Check prerequisites
    if (-not $SkipPrerequisites) {
        $missingTools = Test-Prerequisites

        if ($missingTools.Count -gt 0) {
            if ($NoInteractive) {
                Write-Error-Custom "Missing prerequisites: $($missingTools -join ', ')"
                throw "Prerequisites not met"
            }

            $response = Read-Host "`nDo you want to install missing prerequisites? (Y/n)"
            if ($response -eq "" -or $response -eq "y" -or $response -eq "Y") {
                Install-Prerequisites -Missing $missingTools
            } else {
                Write-Error-Custom "Prerequisites required for installation"
                throw "Prerequisites not met"
            }
        }
    }

    # Clone repository
    Clone-Repository

    # Setup backend
    Setup-Backend

    # Setup frontend
    Setup-Frontend

    # Return to install path
    Set-Location $InstallPath

    # Show next steps
    Show-NextSteps

} catch {
    Write-Host "`n" -NoNewline
    Write-Error-Custom "Installation failed: $_"
    Write-Host "`nFor support, please visit: https://github.com/brandonlacoste9-tech/korean-AI-compliance-/issues" -ForegroundColor Yellow
    exit 1
}
