# Vercel Deployment Status
$VERCEL_TOKEN = $env:VERCEL_TOKEN

if (-not $VERCEL_TOKEN) {
    Write-Host "❌ Error: VERCEL_TOKEN environment variable not set" -ForegroundColor Red
    Write-Host "Please set the VERCEL_TOKEN environment variable before running this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Vercel Deployments Status" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $headers = @{ "Authorization" = "Bearer $VERCEL_TOKEN" }
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?limit=5" -Headers $headers
    
    foreach ($d in $response.deployments) {
        $icon = if ($d.state -eq "READY") { "✅" } else { "🔨" }
        Write-Host "$icon $($d.name) - $($d.state)" -ForegroundColor White
        Write-Host "   https://$($d.url)" -ForegroundColor Cyan
    }
    Write-Host "`n✅ API access working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
