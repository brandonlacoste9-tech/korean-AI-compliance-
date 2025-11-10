# Full Stack Health Monitor
# Monitors Backend (Render) + Frontend (Vercel) + Database

$RENDER_API_KEY = $env:RENDER_API_KEY

if (-not $RENDER_API_KEY) {
    Write-Host "❌ Error: RENDER_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host "Please set the RENDER_API_KEY environment variable before running this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      Full Stack Monitor - Korean AI Compliance Platform      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# Backend Status (Render)
Write-Host "🔧 BACKEND (Render)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$backendHealthy = $false
try {
    $healthz = Invoke-RestMethod -Uri "https://korean-ai-compliance.onrender.com/healthz" -Method Get -TimeoutSec 10
    Write-Host "  ✅ Health Endpoint: OPERATIONAL" -ForegroundColor Green
    Write-Host "     Version: $($healthz.version)" -ForegroundColor White
    Write-Host "     Uptime: $([Math]::Round($healthz.uptime_seconds / 60, 1)) min" -ForegroundColor White
    Write-Host "     Environment: $($healthz.environment)" -ForegroundColor White
    $backendHealthy = $true
} catch {
    Write-Host "  ❌ Health Endpoint: FAILED" -ForegroundColor Red
}

try {
    $readiness = Invoke-RestMethod -Uri "https://korean-ai-compliance.onrender.com/readiness" -Method Get -TimeoutSec 10
    Write-Host "  ✅ Readiness: $($readiness.status)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Readiness: FAILED" -ForegroundColor Red
}

Write-Host ""

# Frontend Status (Vercel)
Write-Host "🎨 FRONTEND (Vercel)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$frontendHealthy = $false
try {
    $frontend = Invoke-WebRequest -Uri "https://korean-ai-compliance.vercel.app" -UseBasicParsing -TimeoutSec 10
    Write-Host "  ✅ Homepage: HTTP $($frontend.StatusCode)" -ForegroundColor Green
    Write-Host "     Content-Length: $($frontend.Content.Length) bytes" -ForegroundColor White
    
    if ($frontend.Content -match "한국|Korean|AI") {
        Write-Host "  ✅ Korean Content: DETECTED" -ForegroundColor Green
    }
    $frontendHealthy = $true
} catch {
    Write-Host "  ❌ Homepage: FAILED" -ForegroundColor Red
}

# Try Enterprise page
try {
    $enterprise = Invoke-WebRequest -Uri "https://korean-ai-compliance.vercel.app/enterprise" -UseBasicParsing -TimeoutSec 10
    Write-Host "  ✅ Enterprise Page: HTTP $($enterprise.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Enterprise Page: Not yet deployed (expected)" -ForegroundColor Yellow
}

Write-Host ""

# Database Status (Inferred)
Write-Host "🗄️  DATABASE (Supabase Seoul)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($backendHealthy) {
    Write-Host "  ✅ Connection: HEALTHY (inferred from backend)" -ForegroundColor Green
    Write-Host "     Region: Seoul, South Korea" -ForegroundColor White
} else {
    Write-Host "  ⚠️  Connection: Unknown (backend down)" -ForegroundColor Yellow
}

Write-Host ""

# Overall Status
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 OVERALL STATUS:" -ForegroundColor Cyan
Write-Host ""

$allHealthy = $backendHealthy -and $frontendHealthy

if ($allHealthy) {
    Write-Host "  🎉 ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Stack Status: 100% Healthy ✅" -ForegroundColor Green
    Write-Host "  Backend: ✅ | Frontend: ✅ | Database: ✅" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Some Systems Need Attention" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Backend: $(if($backendHealthy){'✅'}else{'❌'})" -ForegroundColor $(if($backendHealthy){'Green'}else{'Red'})
    Write-Host "  Frontend: $(if($frontendHealthy){'✅'}else{'❌'})" -ForegroundColor $(if($frontendHealthy){'Green'}else{'Red'})
}

Write-Host ""
Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "   Backend API: https://korean-ai-compliance.onrender.com/docs" -ForegroundColor Gray
Write-Host "   Frontend: https://korean-ai-compliance.vercel.app" -ForegroundColor Gray
Write-Host "   Enterprise: https://korean-ai-compliance.vercel.app/enterprise" -ForegroundColor Gray
