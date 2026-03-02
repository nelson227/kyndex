#!/bin/bash

# GitHub and Azure Deployment Setup Script
# This script sets up the GitHub repository and configures Azure CI/CD

set -e

echo "=========================================="
echo "🚀 Kyndex - GitHub & Azure Setup"
echo "=========================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

echo "✓ GitHub CLI authenticated"
echo ""

# Get repository info
read -p "Enter GitHub repository name (default: kyndex): " REPO_NAME
REPO_NAME=${REPO_NAME:-kyndex}

read -p "Is this a new repository? (y/N): " NEW_REPO
NEW_REPO=${NEW_REPO:-n}

GITHUB_USER=$(gh api user --jq .login)
REPO_FULL_NAME="$GITHUB_USER/$REPO_NAME"

echo ""
echo "Repository: $REPO_FULL_NAME"
echo ""

# Create new repo if needed
if [[ "$NEW_REPO" =~ ^[Yy]$ ]]; then
    echo "Creating new GitHub repository..."
    gh repo create "$REPO_NAME" --private --source=. --remote=origin --push
    echo "✓ Repository created and code pushed"
else
    # Add existing remote
    echo "Adding remote origin..."
    git remote add origin "https://github.com/$REPO_FULL_NAME.git"
    
    echo "Pushing code..."
    git push -u origin main
    git push -u origin develop
    echo "✓ Code pushed to GitHub"
fi

echo ""
echo "=========================================="
echo "✓ GitHub Repository Ready!"
echo "=========================================="
echo ""
echo "Now setting up Azure CI/CD..."
echo ""

# Run Azure setup script
if [ -f ".azure/setup-azure-auth-for-pipeline.ps1" ]; then
    echo "Run this PowerShell command to complete the setup:"
    echo ""
    echo "  .azure\\setup-azure-auth-for-pipeline.ps1"
    echo ""
    echo "This will:"
    echo "  - Create Azure resource groups"
    echo "  - Create managed identity for GitHub Actions"
    echo "  - Set up OIDC federated credentials"
    echo "  - Configure GitHub secrets"
    echo "  - Initialize AZD environments"
    echo ""
fi

echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
