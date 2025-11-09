# Vercel Deployment Status
$VERCEL_TOKEN = "esrnBXwmbz5Y0M6Ee5jkecRp"

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
