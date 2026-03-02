# Automation Script for Vercel Deployment
# This script pushes code to GitHub and prepares for Vercel deployment

param(
    [string]$GitHubToken = "",
    [string]$GitHubUsername = "",
    [string]$RepoName = "kyndex"
)

Write-Host "`n🚀 KYNDEX DEPLOYMENT AUTOMATION" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Configure Git Credentials
if ([string]::IsNullOrEmpty($GitHubToken) -or [string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "❌ GitHub credentials required!" -ForegroundColor Red
    Write-Host "`nUsage:" -ForegroundColor Yellow
    Write-Host "  .\deploy-vercel.ps1 -GitHubUsername 'your-username' -GitHubToken 'your-token'" -ForegroundColor Yellow
    Write-Host "`nGet token: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "  Permissions needed: repo, workflow`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Using GitHub Account: $GitHubUsername" -ForegroundColor Green
Write-Host "✓ Repository: $RepoName`n" -ForegroundColor Green

# Step 2: Configure Git remote
Write-Host "📝 Configuring Git remote..." -ForegroundColor Cyan
$repoUrl = "https://${GitHubUsername}:${GitHubToken}@github.com/${GitHubUsername}/${RepoName}.git"
git remote rm origin 2>$null
git remote add origin $repoUrl
Write-Host "✓ Remote configured`n" -ForegroundColor Green

# Step 3: Ensure on main branch
Write-Host "🔀 Switching to main branch..." -ForegroundColor Cyan
git fetch origin 2>$null
git checkout main 2>$null || git checkout -b main
Write-Host "✓ On main branch`n" -ForegroundColor Green

# Step 4: Push to GitHub
Write-Host "📤 Pushing code to GitHub..." -ForegroundColor Cyan
git push -u origin main --force
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Code pushed successfully!`n" -ForegroundColor Green
    Write-Host "🔗 Repository: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push code`n" -ForegroundColor Red
    exit 1
}

# Step 5: Generate Deployment URLs
Write-Host "`n🎉 DEPLOYMENT INSTRUCTIONS:`n" -ForegroundColor Green
Write-Host "1. Go to https://vercel.com" -ForegroundColor Yellow
Write-Host "2. Sign in with GitHub (or create account)" -ForegroundColor Yellow
Write-Host "3. Click 'Add New' → 'Project'" -ForegroundColor Yellow
Write-Host "4. Select repository: $RepoName" -ForegroundColor Yellow
Write-Host "5. Add Environment Variables:" -ForegroundColor Yellow
Write-Host "   DATABASE_URL = file:./dev.db" -ForegroundColor Cyan
Write-Host "   JWT_SECRET = (min 32 chars random string)" -ForegroundColor Cyan
Write-Host "   NEXTAUTH_SECRET = (min 32 chars random string)" -ForegroundColor Cyan
Write-Host "6. Click 'Deploy'" -ForegroundColor Yellow

Write-Host "`n📋 Your URLs will be:" -ForegroundColor Green
Write-Host "   Frontend: https://$RepoName.vercel.app" -ForegroundColor Cyan
Write-Host "   Backend:  https://$RepoName.vercel.app/api/v1" -ForegroundColor Cyan

Write-Host "`n✅ Setup complete! Follow steps above in Vercel dashboard.`n" -ForegroundColor Green
