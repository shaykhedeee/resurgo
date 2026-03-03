#!/usr/bin/env pwsh
# ═══════════════════════════════════════════════════════════════════════════════
# RESURGO — Vercel Environment Setup Script
# Configures all required environment variables for production deployment
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "🚀 Setting up Resurgo on Vercel..." -ForegroundColor Cyan

# Check if logged in to Vercel
$vercelStatus = vercel whoami 2>&1
if ($vercelStatus -match "Not authenticated") {
    Write-Host "⚠️  Not authenticated to Vercel. Signing in..." -ForegroundColor Yellow
    vercel login --email your-email@example.com
}

Write-Host "`n📝 Vercel Environment Variables" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "Run these commands to set each environment variable in Vercel:" -ForegroundColor Magenta
Write-Host ""

# Production environment variables (with the ones provided by user)
$envVars = @(
    @{ key = "RESEND_API_KEY"; value = "re_7gMehfmx_4yGwYArG2LmCFfWq9SMnMzmf"; description = "Resend email API key" }
    @{ key = "RESEND_FROM_EMAIL"; value = "Resurgo <noreply@resurgo.life>"; description = "Resend from email" }
    @{ key = "EMAIL_INTERNAL_SECRET"; value = "resurgo-email-internal-secret"; description = "Internal email API secret (change this!)" }
)

foreach ($env in $envVars) {
    Write-Host "  vercel env add $($env.key) --environment=production" -ForegroundColor Green
    Write-Host "    Value: $($env.value)" -ForegroundColor Gray
    Write-Host "    Desc: $($env.description)" -ForegroundColor DarkGray
    Write-Host ""
}

Write-Host "`n🔗 UptimeRobot Configuration" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "UptimeRobot API Keys Provided:" -ForegroundColor Magenta
Write-Host "  Main API Key: u3344698-2d524904b7d148634b0a406a" -ForegroundColor Green
Write-Host "  Read-Only Key: ur3344698-71374e8890c90c189a400830" -ForegroundColor Green
Write-Host "  Monitor API Key: m802469450-022b656ca4ac87708d715c5f" -ForegroundColor Green
Write-Host ""
Write-Host "Create UptimeRobot Monitor:" -ForegroundColor Magenta
Write-Host "  1. Go to https://uptimerobot.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Click 'Add New Monitor'" -ForegroundColor Gray
Write-Host "  3. Select 'HTTP(S)' and enter: https://resurgo.life/api/health" -ForegroundColor Gray
Write-Host "  4. Set interval: 5 minutes" -ForegroundColor Gray
Write-Host "  5. Save monitor" -ForegroundColor Gray
Write-Host ""

Write-Host "`n📦 Next Steps:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "  1. Set the environment variables listed above in Vercel" -ForegroundColor Gray
Write-Host "  2. Run: vercel deploy --prod" -ForegroundColor Gray
Write-Host "  3. Verify at: https://resurgo.life" -ForegroundColor Gray
Write-Host "  4. Set up UptimeRobot monitor (see above)" -ForegroundColor Gray
Write-Host ""
