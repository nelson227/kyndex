# 🚀 Connect to GitHub and Deploy

Your local repository is ready! Follow these quick steps to push to GitHub and start the CI/CD pipeline:

## Step 1: Create GitHub Repository

Option A - Using GitHub Web UI:
1. Go to https://github.com/new
2. Enter repository name: `kyndex` (or your choice)
3. **IMPORTANT**: Select "Private" if you don't want it public
4. Don't initialize with README/gitignore/license (we have these)
5. Click "Create repository"

Option B - Using GitHub CLI:
```bash
gh repo create kyndex --private --source=. --remote=origin --push
```

## Step 2: Add Remote (if using Web UI)

After creating the repository on GitHub, you'll see commands like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kyndex.git
git branch -M main
git push -u origin main
git push -u origin develop
```

Run these commands in your terminal.

## Step 3: Verify Branches on GitHub

Check that both `main` and `develop` branches exist:
```bash
git branch -a
```

## Step 4: Set Default Branch to Develop (Optional)

In GitHub:
1. Go to Settings > Branches
2. Set "Default branch" to `develop`

## Step 5: Protect Main Branch (Recommended)

In GitHub:
1. Go to Settings > Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require approvals (at least 2)
   - Dismiss stale reviews

## Step 6: Configure GitHub Environments and Secrets

Run the automated setup script:

```powershell
# Make sure you're authenticated to Azure and GitHub
az login
gh auth login

# Run the setup script
.azure\setup-azure-auth-for-pipeline.ps1
```

The script will:
- Create Azure resource groups (dev & prod)
- Create managed identity for CI/CD
- Set up OIDC federated credentials
- Create GitHub secrets (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID)
- Create GitHub environments (dev, prod)
- Initialize AZD environments

## Step 7: Trigger Deployment

Push code to trigger the pipeline:

```bash
# Deploy to dev environment
git push origin develop

# Or deploy to production
git push origin main
```

Monitor in GitHub Actions: Settings > Actions > Workflows > Deploy to Azure

## Current Git Status

Your local repo has:
- ✅ Main branch (main) - Production ready
- ✅ Develop branch (develop) - Development/staging
- ✅ All source code
- ✅ Docker configuration
- ✅ Azure infrastructure files
- ✅ GitHub Actions workflow
- ✅ Setup scripts and documentation

## Next Commands

```bash
# Option 1: Push to existing GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/kyndex.git
git push -u origin main
git push -u origin develop

# Option 2: Create new GitHub repo and push (GitHub CLI)
gh repo create kyndex --private --source=. --remote=origin --push

# Then run the setup
.azure\setup-azure-auth-for-pipeline.ps1
```

## ✅ Deployment Ready!

Once you push to GitHub, the CI/CD pipeline will:
1. Build your application
2. Run tests
3. Provision Azure resources (first time)
4. Push Docker images to Container Registry
5. Deploy to Container Apps
6. Set up monitoring and logging

Everything is automated from here! 🎉
