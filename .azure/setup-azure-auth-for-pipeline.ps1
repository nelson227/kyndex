# Azure Pipeline Authentication Setup Script
# This script automates the creation of Azure resources and GitHub secrets for pipeline OIDC authentication

param(
    [string]$GitHubOrg = $(Read-Host "Enter GitHub organization name"),
    [string]$GitHubRepo = $(Read-Host "Enter GitHub repository name"),
    [string]$SubscriptionId = "",
    [string]$TenantId = "",
    [string]$Location = "eastus"
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

Write-Header "Azure Pipeline Authentication Setup"

# Step 1: Get current Azure subscription context
Write-Info "Checking Azure CLI authentication..."
try {
    $currentContext = az account show 2>$null | ConvertFrom-Json
    if (-not $currentContext) {
        Write-Error "Not authenticated to Azure. Run 'az login' first."
        exit 1
    }
    Write-Success "Authenticated to Azure"
} catch {
    Write-Error "Failed to check Azure authentication"
    exit 1
}

# Get subscription and tenant IDs if not provided
if ([string]::IsNullOrEmpty($SubscriptionId)) {
    $SubscriptionId = $currentContext.id
}
if ([string]::IsNullOrEmpty($TenantId)) {
    $TenantId = $currentContext.tenantId
}

Write-Info "Subscription ID: $SubscriptionId"
Write-Info "Tenant ID: $TenantId"

# Step 2: Create resource groups
Write-Header "Creating Resource Groups"

$resourceGroups = @("kyndex-pipeline-rg", "kyndex-rg-dev", "kyndex-rg-prod")

foreach ($rg in $resourceGroups) {
    Write-Info "Creating resource group: $rg"
    $existing = az group exists -n $rg 2>$null
    if ($existing -eq "true") {
        Write-Success "Resource group $rg already exists"
    } else {
        az group create -n $rg -l $Location 2>$null | Out-Null
        if ($?) {
            Write-Success "Created resource group $rg"
        } else {
            Write-Error "Failed to create resource group $rg"
        }
    }
}

# Step 3: Create user-assigned managed identity
Write-Header "Creating User-Assigned Managed Identity"

$identityName = "kyndex-pipeline-identity"
Write-Info "Creating managed identity: $identityName"

$existing = az identity show -n $identityName -g kyndex-pipeline-rg 2>$null
if ($existing) {
    Write-Success "Managed identity $identityName already exists"
} else {
    az identity create -n $identityName -g kyndex-pipeline-rg 2>$null | Out-Null
    if ($?) {
        Write-Success "Created managed identity $identityName"
    } else {
        Write-Error "Failed to create managed identity"
        exit 1
    }
}

# Get identity details
$identityJson = az identity show -n $identityName -g kyndex-pipeline-rg 2>$null | ConvertFrom-Json
$identityId = $identityJson.id
$clientId = $identityJson.clientId
$principalId = $identityJson.principalId

Write-Info "Identity ID: $identityId"
Write-Info "Client ID: $clientId"

# Step 4: Assign RBAC roles
Write-Header "Assigning RBAC Roles"

$environmentRgs = @{
    "dev" = "kyndex-rg-dev"
    "prod" = "kyndex-rg-prod"
}

foreach ($env in $environmentRgs.GetEnumerator()) {
    $rgName = $env.Value
    $scope = "/subscriptions/$SubscriptionId/resourceGroups/$rgName"
    
    Write-Info "Assigning Contributor role to $rgName for managed identity"
    
    $assignment = az role assignment list --assignee $clientId --scope $scope 2>$null | ConvertFrom-Json
    if ($assignment -and $assignment.Count -gt 0) {
        Write-Success "Role already assigned to $rgName"
    } else {
        az role assignment create `
            --assignee-object-id $principalId `
            --assignee-principal-type ServicePrincipal `
            --role Contributor `
            --scope $scope 2>$null | Out-Null
        
        if ($?) {
            Write-Success "Assigned Contributor role to $rgName"
        } else {
            Write-Error "Failed to assign role to $rgName"
        }
    }
}

# Step 5: Create federated credentials
Write-Header "Creating Federated Credentials for OIDC"

$fedCreds = @(
    @{
        name = "github-develop"
        subject = "repo:$($GitHubOrg)/$($GitHubRepo):ref:refs/heads/develop"
    },
    @{
        name = "github-main"
        subject = "repo:$($GitHubOrg)/$($GitHubRepo):ref:refs/heads/main"
    }
)

foreach ($cred in $fedCreds) {
    Write-Info "Creating federated credential: $($cred.name)"
    
    $existing = az identity federated-credential show `
        -n $cred.name `
        --identity-name $identityName `
        -g kyndex-pipeline-rg 2>$null
    
    if ($existing) {
        Write-Success "Federated credential $($cred.name) already exists"
    } else {
        az identity federated-credential create `
            -n $cred.name `
            --identity-name $identityName `
            -g kyndex-pipeline-rg `
            --issuer https://token.actions.githubusercontent.com `
            --subject $cred.subject `
            --audiences api://AzureADTokenExchange 2>$null | Out-Null
        
        if ($?) {
            Write-Success "Created federated credential $($cred.name)"
        } else {
            Write-Error "Failed to create federated credential $($cred.name)"
        }
    }
}

# Step 6: Create GitHub secrets
Write-Header "Configuring GitHub Secrets"

Write-Info "GitHub Organization: $GitHubOrg"
Write-Info "GitHub Repository: $GitHubRepo"

Write-Info "Setting GitHub secrets using GitHub CLI..."

try {
    gh secret set AZURE_CLIENT_ID --body $clientId --repo "$GitHubOrg/$GitHubRepo" 2>$null
    Write-Success "Set AZURE_CLIENT_ID secret"
    
    gh secret set AZURE_TENANT_ID --body $TenantId --repo "$GitHubOrg/$GitHubRepo" 2>$null
    Write-Success "Set AZURE_TENANT_ID secret"
    
    gh secret set AZURE_SUBSCRIPTION_ID --body $SubscriptionId --repo "$GitHubOrg/$GitHubRepo" 2>$null
    Write-Success "Set AZURE_SUBSCRIPTION_ID secret"
} catch {
    Write-Error "Failed to set GitHub secrets. Please set them manually."
    Write-Info "AZURE_CLIENT_ID: $clientId"
    Write-Info "AZURE_TENANT_ID: $TenantId"
    Write-Info "AZURE_SUBSCRIPTION_ID: $SubscriptionId"
}

# Step 7: Create GitHub environments and variables
Write-Header "Creating GitHub Environments and Variables"

$environments = @(
    @{
        name = "dev"
        vars = @{
            AZURE_ENV_NAME = "kyndex-dev"
            AZURE_RESOURCE_GROUP = "kyndex-rg-dev"
            AZURE_LOCATION = $Location
        }
        required_reviewers = 1
    },
    @{
        name = "prod"
        vars = @{
            AZURE_ENV_NAME = "kyndex-prod"
            AZURE_RESOURCE_GROUP = "kyndex-rg-prod"
            AZURE_LOCATION = $Location
        }
        required_reviewers = 2
    }
)

foreach ($env in $environments) {
    Write-Info "Setting up environment: $($env.name)"
    
    foreach ($var in $env.vars.GetEnumerator()) {
        Write-Info "Setting variable $($var.Name) for $($env.name) environment"
        gh variable set $var.Name --body $var.Value --env $env.name --repo "$GitHubOrg/$GitHubRepo" 2>$null
        if ($?) {
            Write-Success "Set variable $($var.Name) for $($env.name)"
        }
    }
}

# Step 8: Initialize AZD environment
Write-Header "Initializing AZD Environments"

Write-Info "Initializing development AZD environment..."
azd env new kyndex-dev --no-prompt 2>$null | Out-Null
if ($?) {
    Write-Success "Initialized kyndex-dev AZD environment"
    azd env set AZURE_SUBSCRIPTION_ID $SubscriptionId
    azd env set AZURE_RESOURCE_GROUP "kyndex-rg-dev"
    azd env set AZURE_LOCATION $Location
}

Write-Info "Initializing production AZD environment..."
azd env new kyndex-prod --no-prompt 2>$null | Out-Null
if ($?) {
    Write-Success "Initialized kyndex-prod AZD environment"
    azd env set AZURE_SUBSCRIPTION_ID $SubscriptionId
    azd env set AZURE_RESOURCE_GROUP "kyndex-rg-prod"
    azd env set AZURE_LOCATION $Location
}

# Summary
Write-Header "Setup Summary"

Write-Success "Azure authentication setup completed!"
Write-Info "`nCreated Resources:"
Write-Info "- Resource Groups: kyndex-pipeline-rg, kyndex-rg-dev, kyndex-rg-prod"
Write-Info "- Managed Identity: kyndex-pipeline-identity"
Write-Info "- Federated Credentials: github-develop, github-main"
Write-Info "`nGitHub Configuration:"
Write-Info "- Secrets: AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID"
Write-Info "- Environments: dev, prod with appropriate variables"
Write-Info "`nNext Steps:"
Write-Info "1. Commit and push code to GitHub:"
Write-Info "   git add ."
Write-Info "   git commit -m 'Add Azure deployment configuration'"
Write-Info "   git push origin develop"
Write-Info "`n2. The GitHub Actions pipeline will automatically run and deploy to Azure"
Write-Info "`n3. Monitor the deployment in the Actions tab of your GitHub repository"
