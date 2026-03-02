# Azure Pipeline Authentication Setup

## Prerequisites
- Azure CLI installed and authenticated
- GitHub CLI installed and authenticated
- Owner access to the Azure subscription
- Admin access to the GitHub repository

## Step 1: Create Resource Groups

Create separate resource groups for each environment:

```bash
# Create dev resource group
az group create \
  --name kyndex-rg-dev \
  --location eastus

# Create prod resource group
az group create \
  --name kyndex-rg-prod \
  --location eastus
```

## Step 2: Create User-Assigned Managed Identity for Pipeline

Create a dedicated managed identity for the GitHub Actions pipeline (in a separate resource group):

```bash
# Create dedicated resource group for pipeline identity
az group create \
  --name kyndex-pipeline-rg \
  --location eastus

# Create user-assigned managed identity
az identity create \
  --name kyndex-pipeline-identity \
  --resource-group kyndex-pipeline-rg
```

Get the identity details (you'll need these):

```bash
IDENTITY_ID=$(az identity show \
  --name kyndex-pipeline-identity \
  --resource-group kyndex-pipeline-rg \
  --query id -o tsv)

IDENTITY_CLIENT_ID=$(az identity show \
  --name kyndex-pipeline-identity \
  --resource-group kyndex-pipeline-rg \
  --query clientId -o tsv)

echo "Identity ID: $IDENTITY_ID"
echo "Client ID: $IDENTITY_CLIENT_ID"
```

## Step 3: Set Up RBAC Roles

Assign necessary roles to the managed identity for each environment:

```bash
# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# For Dev environment
DEV_RG="kyndex-rg-dev"
az role assignment create \
  --assignee-object-id $(az identity show \
    --name kyndex-pipeline-identity \
    --resource-group kyndex-pipeline-rg \
    --query principalId -o tsv) \
  --assignee-principal-type ServicePrincipal \
  --role Contributor \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$DEV_RG

# For Prod environment
PROD_RG="kyndex-rg-prod"
az role assignment create \
  --assignee-object-id $(az identity show \
    --name kyndex-pipeline-identity \
    --resource-group kyndex-pipeline-rg \
    --query principalId -o tsv) \
  --assignee-principal-type ServicePrincipal \
  --role Contributor \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$PROD_RG
```

## Step 4: Create Federated Credentials for OIDC

Set up federated credentials to enable OIDC authentication:

```bash
# For develop branch (dev environment)
az identity federated-credential create \
  --name github-develop \
  --identity-name kyndex-pipeline-identity \
  --resource-group kyndex-pipeline-rg \
  --issuer https://token.actions.githubusercontent.com \
  --subject repo:<your-org>/<your-repo>:ref:refs/heads/develop \
  --audiences api://AzureADTokenExchange

# For main branch (prod environment)
az identity federated-credential create \
  --name github-main \
  --identity-name kyndex-pipeline-identity \
  --resource-group kyndex-pipeline-rg \
  --issuer https://token.actions.githubusercontent.com \
  --subject repo:<your-org>/<your-repo>:ref:refs/heads/main \
  --audiences api://AzureADTokenExchange
```

## Step 5: Get Tenant ID and Subscription ID

```bash
TENANT_ID=$(az account show --query tenantId -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

echo "Tenant ID: $TENANT_ID"
echo "Subscription ID: $SUBSCRIPTION_ID"
```

## Step 6: Create GitHub Organization/Repository Secrets

Set up the required secrets in your GitHub repository:

**Using GitHub CLI:**

```bash
# Set secrets
gh secret set AZURE_CLIENT_ID --body "$IDENTITY_CLIENT_ID"
gh secret set AZURE_TENANT_ID --body "$TENANT_ID"
gh secret set AZURE_SUBSCRIPTION_ID --body "$SUBSCRIPTION_ID"
```

**Or manually in GitHub UI:**
1. Go to Repository Settings > Secrets and variables > Actions
2. Create the following secrets:
   - `AZURE_CLIENT_ID`: Client ID of the managed identity
   - `AZURE_TENANT_ID`: Tenant ID
   - `AZURE_SUBSCRIPTION_ID`: Subscription ID

## Step 7: Create GitHub Environments and Variables

Create environments with approval checks:

**Using GitHub CLI:**

```bash
# Create dev environment
gh api repos/<org>/<repo>/environments/dev \
  -f name=dev -f protection_rules='[{"type": "required_reviewers", "reviewers": 1}]'

# Create prod environment
gh api repos/<org>/<repo>/environments/prod \
  -f name=prod -f protection_rules='[{"type": "required_reviewers", "reviewers": 2}]'

# Set variables
gh variable set AZURE_ENV_NAME --body "kyndex-dev" --env dev
gh variable set AZURE_RESOURCE_GROUP --body "kyndex-rg-dev" --env dev
gh variable set AZURE_LOCATION --body "eastus" --env dev

gh variable set AZURE_ENV_NAME --body "kyndex-prod" --env prod
gh variable set AZURE_RESOURCE_GROUP --body "kyndex-rg-prod" --env prod
gh variable set AZURE_LOCATION --body "eastus" --env prod
```

**Or in GitHub UI:**
1. Go to Settings > Environments
2. Create `dev` environment with:
   - Variable: `AZURE_ENV_NAME` = `kyndex-dev`
   - Variable: `AZURE_RESOURCE_GROUP` = `kyndex-rg-dev`
   - Variable: `AZURE_LOCATION` = `eastus`
   - Optional: Add deployment protection rules for manual approval

3. Create `prod` environment with:
   - Variable: `AZURE_ENV_NAME` = `kyndex-prod`
   - Variable: `AZURE_RESOURCE_GROUP` = `kyndex-rg-prod`
   - Variable: `AZURE_LOCATION` = `eastus`
   - Recommended: Add deployment protection rules requiring multiple approvers

## Step 8: Initialize AZD Environment (Local)

Before pushing, initialize the AZD environment locally:

```bash
cd /path/to/kyndex
azd env new kyndex-dev --no-prompt
azd env get-values
```

## Step 9: Push Code and Trigger Pipeline

```bash
git push origin develop  # Triggers dev deployment
git push origin main     # Triggers prod deployment
```

## Verification

Monitor the GitHub Actions workflow:
1. Go to Actions tab in your repository
2. Find "Deploy to Azure" workflow
3. Check logs for each deployment step

## Troubleshooting

### OIDC Token Exchange Failure
- Verify federated credentials are created with correct subject and issuer
- Ensure the managed identity has proper RBAC roles

### Deployment Fails with Permission Denied
- Check Azure role assignments
- Verify managed identity has Contributor role on resource groups
- Ensure AcrPull role is assigned for container registry access

### Application Not Starting
- Check container app logs: `az containerapp logs show -n backend-dev -g kyndex-rg-dev`
- Verify environment variables are set correctly
- Check Application Insights for runtime errors

## Additional Resources
- [Azure Developer CLI Documentation](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [GitHub Actions OIDC with Azure](https://learn.microsoft.com/en-us/azure/developer/github-actions/connect-from-azure)
- [Azure Container Apps Deployment](https://learn.microsoft.com/en-us/azure/container-apps/deployment)
