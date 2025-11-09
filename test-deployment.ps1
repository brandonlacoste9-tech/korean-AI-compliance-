# Korean AI Compliance - Deployment Test Script
# Run this anytime to verify your deployment status

param(
    [switch]$Watch,
    [int]$Interval = 30
)

function Test-Deployment {
    Clear-Host
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║       Korean AI Compliance - Deployment Status Check         ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    Write-Host ""

    # Backend Tests
    Write-Host "🔧 BACKEND (Render)" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    $backendEndpoints = @{
        "Root" = "https://korean-ai-compliance.onrender.com/"
        "Health" = "https://korean-ai-compliance.onrender.com/health"
        "Healthz" = "https://korean-ai-compliance.onrender.com/healthz"
        "Readiness" = "https://korean-ai-compliance.onrender.com/readiness"
        "Version" = "https://korean-ai-compliance.onrender.com/version"
        "API Docs" = "https://korean-ai-compliance.onrender.com/docs"
    }

    $backendPass = 0
    foreach ($endpoint in $backendEndpoints.GetEnumerator()) {
        try {
            $response = Invoke-WebRequest -Uri $endpoint.Value -Method Get -UseBasicParsing -TimeoutSec 10
            Write-Host "  ✅ $($endpoint.Key.PadRight(15)) - HTTP $($response.StatusCode)" -ForegroundColor Green
            $backendPass++
        } catch {
            Write-Host "  ❌ $($endpoint.Key.PadRight(15)) - FAILED" -ForegroundColor Red
        }
    }

    Write-Host ""
    
    # Frontend Test
    Write-Host "🎨 FRONTEND (Vercel)" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "https://korean-ai-compliance.vercel.app" -UseBasicParsing -TimeoutSec 10
        Write-Host "  ✅ Homepage             - HTTP $($response.StatusCode)" -ForegroundColor Green
        
        # Check for Korean content
        if ($response.Content -match "한국|Korean|AI.*Compliance") {
            Write-Host "  ✅ Korean content       - DETECTED" -ForegroundColor Green
        }
        $frontendPass = $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq 401) {
            Write-Host "  ❌ Homepage             - HTTP 401 (Protected)" -ForegroundColor Red
            Write-Host "     → Disable Vercel Deployment Protection" -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ Homepage             - HTTP $statusCode" -ForegroundColor Red
        }
        $frontendPass = $false
    }

    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "SUMMARY:" -ForegroundColor Cyan
    Write-Host "  Backend:  $backendPass/6 endpoints operational" -ForegroundColor $(if($backendPass -eq 6){"Green"}else{"Yellow"})
    Write-Host "  Frontend: $(if($frontendPass){"✅ Operational"}else{"❌ Not Accessible"})" -ForegroundColor $(if($frontendPass){"Green"}else{"Red"})
    Write-Host ""
    
    if ($backendPass -eq 6 -and $frontendPass) {
        Write-Host "🎉 ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    } elseif ($backendPass -eq 6) {
        Write-Host "⚠️  Backend operational, frontend needs attention" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Some services need attention" -ForegroundColor Red
    }
    Write-Host ""
}

# Main execution
if ($Watch) {
    Write-Host "Starting continuous monitoring (Ctrl+C to stop)..." -ForegroundColor Cyan
    Write-Host "Checking every $Interval seconds" -ForegroundColor Gray
    Write-Host ""
    
    while ($true) {
        Test-Deployment
        Write-Host "Next check in $Interval seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds $Interval
    }
} else {
    Test-Deployment
    Write-Host "💡 Tip: Run with -Watch flag for continuous monitoring" -ForegroundColor Gray
    Write-Host "   Example: .\test-deployment.ps1 -Watch -Interval 60" -ForegroundColor Gray
    Write-Host ""
}
