# 🚀 Déploiement Vercel - Guide Étape par Étape

## ✅ État Actuel

### URLs Locales (Déverrouillage)
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Docs API:** http://localhost:3001/api-docs

---

## 📋 Déploiement sur Vercel (Gratuit)

### Étape 1: Pousser sur GitHub

```bash
# 1. Créer un dépôt GitHub vide sur github.com
#    - Nom recommandé: "kyndex" 
#    - Description: "Plateforme de services peer-to-peer avec matching intelligent"
#    - Visibility: Public

# 2. Ajouter la remote GitHub (remplacer VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/kyndex.git
git branch -M main
git push -u origin main

# OU, si vous voulez pousser depuis develop:
git push -u origin develop
```

### Étape 2: Créer un Compte Vercel

1. Aller à https://vercel.com
2. Cliquer sur "Sign Up"
3. Se connecter avec GitHub
4. Autoriser Vercel à accéder aux repositories

### Étape 3: Importer le Projet

1. Sur Vercel dashboard, cliquer "Add New..." → "Project"
2. Sélectionner le repository "kyndex"
3. Cliquer "Import"
4. Dans les paramètres d'environnement, ajouter:
   ```
   DATABASE_URL = file:./dev.db
   JWT_SECRET = your-super-secret-key-min-32-chars-long
   NEXTAUTH_SECRET = another-secret-key-min-32-chars-long
   ```
5. Cliquer "Deploy"

### Étape 4: Obtenir vos URLs

Une fois le déploiement terminé:
- **Frontend:** https://kyndex.vercel.app
- **Backend:** https://kyndex-backend.vercel.app/api/v1 (si déployé séparément)

---

## 🔧 Configuration Alternative: Vercel + Render (Backend)

Si vous voulez:
- **Frontend sur Vercel**
- **Backend sur Render** (service gratuit)

**Backend sur Render:**
1. Créer un compte sur https://render.com
2. Connecter le même repo GitHub
3. Créer un nouveau "Web Service"
4. Branch: `main` ou `develop`
5. Define Build Command: `cd backend && npm install && npm run build`
6. Start Command: `node dist/main.js`

Vous recevrez une URL comme: `https://kyndex-backend.onrender.com`

---

## 🎯 Résumé Final

| Service | URL | Libre |
|---------|-----|-------|
| **Frontend** | https://kyndex.vercel.app | ✅ Oui (5 déploiements/jour) |
| **Backend** | https://kyndex-backend.onrender.com | ✅ Oui (1h/mois gratuit) |
| **Base de données** | SQLite incluse | ✅ Oui |
| **Custom Domain** | kyndex.com | ❌ Payant |

---

## 📞 Support Rapide

- Erreur lors du build? Vérifier les logs Vercel
- Base de données non migrée? Ajouter dans le Build Command: `npm run migrate`
- Variables d'env manquantes? Vérifier dans Project Settings → Environment Variables

