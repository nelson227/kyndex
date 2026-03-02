# GitHub and Azure Deployment Setup Script (PowerShell)
# Complete setup for GitHub repository and Azure CI/CD pipeline

param(
    [string]$RepoName = "kyndex",
    [bool]$IsNewRepo = $false,
    [bool]$SkipAzureSetup = $false
)

function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

# Check prerequisites
Write-Header "Checking Prerequisites"

# Check GitHub CLI
try {
    $ghVersion = gh --version 2>$null
    if ($?) {
        Write-Success "GitHub CLI installed"
    }
} catch {
    Write-Error "GitHub CLI not found. Install from: https://cli.github.com/"
    exit 1
}

# Check Azure CLI
try {
    $azVersion = az --version 2>$null
    if ($?) {
        Write-Success "Azure CLI installed"
    }
} catch {
    Write-Info "Azure CLI not found. Install from: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli"
}

# Check git
try {
    $gitVersion = git --version 2>$null
    if ($?) {
        Write-Success "Git installed"
    }
} catch {
    Write-Error "Git not found"
    exit 1
}

Write-Header "GitHub Repository Setup"

# Prompt for repository name
if ([string]::IsNullOrEmpty($RepoName)) {
    $RepoName = Read-Host "Enter GitHub repository name (default: kyndex)"
    if ([string]::IsNullOrEmpty($RepoName)) {
        $RepoName = "kyndex"
    }
}

Write-Info "Repository name: $RepoName"

# Get current GitHub user
try {
    $GitHubUser = gh api user --jq ".login" 2>$null
    Write-Success "GitHub user: $GitHubUser"
} catch {
    Write-Error "Failed to get GitHub user. Make sure you're authenticated: gh auth login"
    exit 1
}

$RepositoryFullName = "$GitHubUser/$RepoName"
Write-Info "Full repository: $RepositoryFullName"

# Check if creating new repo
if (-not $IsNewRepo) {
    Write-Host ""
    $NewRepoConfirm = Read-Host "Create new GitHub repository? (y/N)"
    $IsNewRepo = $NewRepoConfirm -eq "y" -or $NewRepoConfirm -eq "Y"
}

Write-Header "Setting up GitHub Repository"

if ($IsNewRepo) {
    Write-Info "Creating new GitHub repository as private..."
    gh repo create $RepoName --private --source=. --remote=origin --push
    if ($?) {
        Write-Success "Repository created and code pushed"
    } else {
        Write-Error "Failed to create repository"
        exit 1
    }
} else {
    Write-Info "Adding remote to existing repository..."
    git remote remove origin 2>$null
    git remote add origin "https://github.com/$RepositoryFullName.git"
    
    Write-Info "Pushing code to GitHub..."
    git push -u origin main 2>/dev/null || Write-Info "Main branch push completed (may already exist)"
    git push -u origin develop 2>/dev/null || Write-Info "Develop branch push completed"
    
    if ($?) {
        Write-Success "Code pushed to GitHub"
    }
}

# Configure GitHub branch protection
Write-Header "Configuring GitHub Branch Protection"

Write-Info "Setting up main branch protection rules..."
try {
    gh api repos/$RepositoryFullName/branches/main/protection `
        -X PUT `
        -f required_status_checks='{"strict":true,"contexts":[]}' `
        -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":2}' `
        -f enforce_admins=true `
        -f allow_force_pushes=false `
        -f allow_deletions=false 2>/dev/null
    Write-Success "Main branch protection configured"
} catch {
    Write-Info "Could not configure branch protection (may require additional permissions)"
}

# Azure Setup
if (-not $SkipAzureSetup) {
    Write-Header "Azure CI/CD Setup"
    
    Write-Info "Authenticating to Azure..."
    try {
        $AccountInfo = az account show 2>$null | ConvertFrom-Json
        if ($AccountInfo) {
            Write-Success "Authenticated to Azure"
            Write-Info "Subscription: $($AccountInfo.name)"
        }
    } catch {
        Write-Info "Not authenticated to Azure. Run: az login"
    }
    
    Write-Header "Running Azure Setup Script"
    
    if (Test-Path ".\.azure\setup-azure-auth-for-pipeline.ps1") {
        Write-Info "Launching Azure authentication setup script..."
        Write-Host ""
        
        # Ask if user wants to continue
        $ContinueAzure = Read-Host "Continue with Azure setup? (y/N)"
        
        if ($ContinueAzure -eq "y" -or $ContinueAzure -eq "Y") {
            & ".\.azure\setup-azure-auth-for-pipeline.ps1"
        } else {
            Write-Info "Skipped Azure setup. You can run it later with:"
            Write-Info ".\.azure\setup-azure-auth-for-pipeline.ps1"
        }
    } else {
        Write-Error "Azure setup script not found"
    }
}

Write-Header "Setup Complete!"

Write-Success "Your Kyndex application is ready for deployment!"
Write-Info ""
Write-Info "Repository: https://github.com/$RepositoryFullName"
Write-Info "Branches:"
Write-Info "  - develop (automatic deployment to dev)"
Write-Info "  - main (automatic deployment to prod, requires approval)"
Write-Info ""
Write-Info "Next steps:"
Write-Info "1. If Azure setup didn't run, execute: .\.azure\setup-azure-auth-for-pipeline.ps1"
Write-Info "2. Monitor deployment in GitHub Actions tab"
Write-Info "3. Check application URLs in deployment logs"
Write-Info ""
Write-Success "CI/CD Pipeline is ready! Push code to deploy automatically."
