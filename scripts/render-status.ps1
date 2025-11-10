# Render Backend Status Checker
# Monitors backend health and deployment status

param(
    [switch]$Watch,
    [int]$Interval = 30
)

$RENDER_API_KEY = $env:RENDER_API_KEY

if (-not $RENDER_API_KEY) {
    Write-Host "❌ Error: RENDER_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host "Please set the RENDER_API_KEY environment variable before running this script." -ForegroundColor Yellow
    exit 1
}

function Get-RenderServices {
    try {
        $headers = @{
            "Authorization" = "Bearer $RENDER_API_KEY"
            "Accept" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method Get
        return $response
    } catch {
        Write-Host "❌ Error fetching services: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Show-ServiceStatus {
    Clear-Host
    
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         Render Backend Status - Korean AI Compliance         ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    Write-Host ""
    
    $services = Get-RenderServices
    
    if ($services) {
        Write-Host "🔧 RENDER SERVICES:" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host ""
        
        foreach ($service in $services) {
            $statusIcon = switch ($service.serviceDetails.state) {
                "available" { "✅" }
                "suspended" { "⏸️" }
                default { "❓" }
            }
            
            $statusColor = switch ($service.serviceDetails.state) {
                "available" { "Green" }
                "suspended" { "Yellow" }
                default { "White" }
            }
            
            Write-Host "$statusIcon " -NoNewline -ForegroundColor $statusColor
            Write-Host "$($service.service.name)" -ForegroundColor White
            Write-Host "   State: " -NoNewline -ForegroundColor Gray
            Write-Host "$($service.serviceDetails.state)" -ForegroundColor $statusColor
            Write-Host "   URL: " -NoNewline -ForegroundColor Gray
            Write-Host "$($service.service.serviceDetails.url)" -ForegroundColor Cyan
            
            if ($service.service.updatedAt) {
                Write-Host "   Updated: " -NoNewline -ForegroundColor Gray
                Write-Host "$($service.service.updatedAt)" -ForegroundColor White
            }
            
            Write-Host ""
        }
        
        # Test backend health
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "🏥 HEALTH CHECK:" -ForegroundColor Yellow
        Write-Host ""
        
        try {
            $healthResponse = Invoke-RestMethod -Uri "https://korean-ai-compliance.onrender.com/healthz" -Method Get
            Write-Host "✅ Backend Health: " -NoNewline -ForegroundColor Green
            Write-Host "HEALTHY" -ForegroundColor Green
            Write-Host "   Version: $($healthResponse.version)" -ForegroundColor White
            Write-Host "   Uptime: $([Math]::Round($healthResponse.uptime_seconds / 60, 1)) minutes" -ForegroundColor White
        } catch {
            Write-Host "❌ Backend Health: " -NoNewline -ForegroundColor Red
            Write-Host "UNHEALTHY" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "✅ Render API Key Working!" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Could not fetch services" -ForegroundColor Red
    }
}

# Main execution
if ($Watch) {
    Write-Host "🔄 Starting continuous monitoring (Ctrl+C to stop)..." -ForegroundColor Cyan
    Write-Host "Refreshing every $Interval seconds" -ForegroundColor Gray
    Write-Host ""
    
    while ($true) {
        Show-ServiceStatus
        Start-Sleep -Seconds $Interval
    }
} else {
    Show-ServiceStatus
    Write-Host ""
    Write-Host "💡 Tip: Run with -Watch flag for continuous monitoring" -ForegroundColor Gray
    Write-Host "   Example: .\render-status.ps1 -Watch -Interval 30" -ForegroundColor Gray
}
