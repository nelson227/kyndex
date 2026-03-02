# 🚀 Kyndex - Azure Deployment Guide

Your Kyndex application is now ready to deploy to Azure with a complete CI/CD pipeline!

## 📋 Prerequisites

Before starting, ensure you have:

1. **Azure CLI** - [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **GitHub CLI** - [Install GitHub CLI](https://cli.github.com/)
3. **Active Azure Subscription** - [Create free account](https://azure.microsoft.com/free/)
4. **GitHub account** with repository access
5. **Node.js 18+** - Already installed

## 🔐 Option 1: Automated Setup (Recommended)

Run the automated setup script that will configure everything for you:

### Step 1: Authenticate to Azure
```powershell
az login
```

### Step 2: Authenticate to GitHub (if not already)
```powershell
gh auth login
```

### Step 3: Run the Automated Setup Script
```powershell
cd .azure
.\setup-azure-auth-for-pipeline.ps1
```

The script will:
- ✓ Create Azure resource groups (dev & prod)
- ✓ Create managed identity for pipeline OIDC
- ✓ Set up federated credentials
- ✓ Assign RBAC roles
- ✓ Create GitHub secrets (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID)
- ✓ Create GitHub environments (dev, prod)
- ✓ Set environment variables
- ✓ Initialize AZD environments

**When prompted:**
- Enter your GitHub organization (username or org name)
- Enter your repository name

## 🔐 Option 2: Manual Setup

If you prefer setting up manually, follow the detailed instructions in [.azure/pipeline-setup.md](.azure/pipeline-setup.md)

## 📦 After Setup: Deploy Your Application

### Option A: Automatic Deployment (Recommended)

The GitHub Actions workflow will automatically deploy when you push code:

```bash
# Commit your changes
git add .
git commit -m "Add Azure deployment configuration"

# Push to develop branch for dev deployment
git push origin develop

# Or push to main branch for production deployment  
git push origin main
```

Monitor deployment in GitHub Actions tab → Deploy to Azure workflow.

### Option B: Manual Deployment with AZD

If you want to deploy manually:

#### For Development Environment:
```bash
azd env select kyndex-dev
azd provision --no-prompt  # Provision Azure resources
azd deploy --no-prompt     # Deploy application
```

#### For Production Environment:
```bash
azd env select kyndex-prod
azd provision --no-prompt  # Provision Azure resources
azd deploy --no-prompt     # Deploy application
```

## 🏗️ Infrastructure Components

Your deployment includes:

### Compute
- **Frontend**: Azure Container Apps (Next.js)
- **Backend**: Azure Container Apps (NestJS)
- **Container Registry**: For storing Docker images

### Data
- **PostgreSQL Database**: Flexible Server for application data
- **Key Vault**: For secure secrets management

### Monitoring
- **Application Insights**: Performance monitoring
- **Log Analytics**: Log aggregation and analysis

### Security
- **Managed Identity**: OIDC authentication for GitHub Actions
- **Private networking**: Secure inter-service communication
- **RBAC**: Role-based access control

## 📊 Monitoring & Logs

### View Application Logs
```bash
# Development
az containerapp logs show \
  -n backend-dev \
  -g kyndex-rg-dev

az containerapp logs show \
  -n frontend-dev \
  -g kyndex-rg-dev

# Production
az containerapp logs show \
  -n backend-prod \
  -g kyndex-rg-prod

az containerapp logs show \
  -n frontend-prod \
  -g kyndex-rg-prod
```

### Check Application Insights
```bash
az monitor app-insights show \
  -n kyndex-ai-dev \
  -g kyndex-rg-dev
```

## 🌐 Accessing Your Application

After deployment, get the URLs:

```bash
# Development endpoints
az containerapp show \
  -n frontend-dev \
  -g kyndex-rg-dev \
  --query properties.configuration.ingress.fqdn

az containerapp show \
  -n backend-dev \
  -g kyndex-rg-dev \
  --query properties.configuration.ingress.fqdn
```

## 🔄 Updating Your Application

To update your application:

1. Make code changes locally
2. Commit and push to GitHub
3. GitHub Actions will automatically:
   - ✓ Build Docker images
   - ✓ Push to Container Registry
   - ✓ Update Container Apps
   - ✓ Run health checks

## 🛠️ Troubleshooting

### Deployment Failed
1. Check GitHub Actions logs
2. Review Azure deployment errors:
```bash
az containerapp show -n backend-dev -g kyndex-rg-dev
```

### Application Not Starting
1. Check environment variables
2. View container logs:
```bash
az containerapp logs show -n backend-dev -g kyndex-rg-dev --tail 100
```

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check connection string in Key Vault:
```bash
az keyvault secret show \
  --vault-name kyndex-kv-XXXXX \
  --name DatabaseConnectionString
```

## 📖 Additional Resources

- [Azure Developer CLI Docs](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 💰 Cost Management

To avoid unexpected charges:

```bash
# View costs
az consumption meter list --subscription $SUBSCRIPTION_ID

# Delete resources when not needed
az group delete -n kyndex-rg-dev
az group delete -n kyndex-rg-prod
az group delete -n kyndex-pipeline-rg
```

## ✅ Deployment Checklist

- [ ] Azure CLI installed and authenticated
- [ ] GitHub CLI installed and authenticated
- [ ] Ran setup-azure-auth-for-pipeline.ps1
- [ ] GitHub secrets configured (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID)
- [ ] GitHub environments created (dev, prod)
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow executed successfully
- [ ] Application accessible at returned URLs
- [ ] Logs visible in Application Insights

## 🎉 You're All Set!

Your Kyndex application is now deployed to Azure with:
- ✓ Automated CI/CD pipeline
- ✓ Multi-environment deployment (dev & prod)
- ✓ Secure OIDC authentication
- ✓ Complete monitoring and logging
- ✓ Auto-scaling capabilities

Enjoy your fully managed cloud deployment! 🚀
