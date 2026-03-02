# ⚡ Kyndex - Quick Start Deployment

**Your application is ready to deploy!** Follow these steps:

## 🚀 Complete Setup in 3 Commands

```powershell
# Step 1: Setup GitHub Repository (creates new private repo and pushes code)
.azure\setup-github-and-azure.ps1

# This automatically runs the Azure setup wizard inside
# OR if you need to run Azure setup separately:

# Step 2: Complete Azure Authentication (if not already done)
.azure\setup-azure-auth-for-pipeline.ps1
```

That's it! The automation handles everything:
- ✅ Creates/connects GitHub repository (private)
- ✅ Configures branch protection on main
- ✅ Creates Azure resource groups (dev & prod)
- ✅ Sets up managed identity and OIDC
- ✅ Configures GitHub secrets and environments
- ✅ Initializes AZD environments
- ✅ Creates GitHub Actions workflow

## 🎯 What Happens Next

After setup runs:

1. **Automatic Deployments Trigger**:
   - Push to `develop` branch → Auto-deploys to dev environment
   - Push to `main` branch → Auto-deploys to prod (requires approval)

2. **GitHub Actions**:
   - Builds Docker images
   - Provisions Azure resources (first time)
   - Pushes to Container Registry
   - Deploys to Container Apps
   - Sets up databases and monitoring

3. **Get Application URLs**:
   - Check GitHub Actions logs → Deployment outputs
   - Or check Azure Portal → Container Apps

## 📋 Prerequisites

Install if you don't have them:
- **GitHub CLI**: `https://cli.github.com/`
- **Azure CLI**: `https://learn.microsoft.com/en-us/cli/azure/install-azure-cli`

Then authenticate:
```powershell
gh auth login
az login
```

## 🔑 Environment Variables

GitHub automatically creates:
- **AZURE_CLIENT_ID**: Managed Identity client ID
- **AZURE_TENANT_ID**: Azure tenant ID  
- **AZURE_SUBSCRIPTION_ID**: Subscription ID

These are set as secrets in GitHub (hidden).

## 📊 Monitor Deployment

After pushing code:

1. Go to GitHub repository → **Actions** tab
2. Find **"Deploy to Azure"** workflow
3. Click to see real-time logs
4. Get application URLs from outputs

## 🌐 Access Your Application

After successful deployment:

```powershell
# Get frontend URL
az containerapp show -n frontend-dev -g kyndex-rg-dev --query properties.configuration.ingress.fqdn -o tsv

# Get backend API URL
az containerapp show -n backend-dev -g kyndex-rg-dev --query properties.configuration.ingress.fqdn -o tsv
```

## ❌ Troubleshooting

### GitHub CLI not authenticated
```powershell
gh auth login
```

### Azure CLI not authenticated
```powershell
az login
```

### Script fails with permission denied
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Need to run setup manually
Check each individual script:
- Create GitHub repo: Follow `GITHUB_SETUP.md`
- Configure Azure: Follow `.azure/pipeline-setup.md`

## 📚 Full Documentation

- **DEPLOY.md** - Complete deployment guide
- **.azure/DEPLOYMENT_SUMMARY.md** - Architecture details
- **.azure/pipeline-setup.md** - Detailed Azure setup
- **GITHUB_SETUP.md** - Manual GitHub setup

## ✨ Features Included

✅ Multi-stage Docker builds  
✅ Automatic CI/CD with GitHub Actions  
✅ Azure Container Apps (auto-scaling)  
✅ PostgreSQL Database  
✅ Application Insights (monitoring)  
✅ Key Vault (secrets)  
✅ OIDC authentication (secure)  
✅ Managed Identity (least privilege)  
✅ Health checks (auto-restart)  
✅ HTTPS/TLS (automatic)  

---

## ⏱️ Estimated Time

- Setup script: **2-5 minutes**
- First deployment: **5-10 minutes**
- Subsequent deployments: **2-3 minutes**

---

## 🎉 You're All Set!

Run this command to start:

```powershell
.azure\setup-github-and-azure.ps1
```

Your Kyndex platform will be live on Azure within minutes! 🚀
