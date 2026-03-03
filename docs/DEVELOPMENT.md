# Guide de Développement Kyndex

## 🚀 Mise en Place de l'Environnement

### Prérequis
- Node.js >= 20.19.5
- Git
- VS Code (optionnel mais recommandé)
- Docker (optionnel, pour la DB local)

### Installation du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configuration .env (copier .env.example et ajuster)
cp .env.example .env
# Éditer .env avec vos valeurs

# Initialiser la base de données
npx prisma generate       # Générer le client Prisma
npx prisma migrate dev    # Créer la DB et appliquer les migrations
npx prisma seed           # Remplir avec des données de test

# Lancer le serveur
npm run dev
# Serveur disponible sur http://localhost:3001
# Swagger docs sur http://localhost:3001/api-docs
```

### Installation du Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configuration .env.local (copier .env.example et ajuster)
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Lancer le serveur
npm run dev
# App disponible sur http://localhost:3000
```

---

## 📂 Structure des Fichiers

### Backend Structure

```
backend/
├── src/
│   ├── main.ts                 # Point d'entrée
│   ├── app.module.ts           # Module principal
│   ├── common/                 # Utilitaires partagés
│   │   ├── decorators/        # Décorateurs (@CurrentUser, etc.)
│   │   ├── filters/           # Filtres exception globaux
│   │   ├── guards/            # Guards (JWT, etc.)
│   │   └── pipes/             # Pipes de validation
│   ├── config/                 # Configuration app
│   └── modules/                # Modules métier
│       ├── auth/              # Authentification
│       ├── profile/           # Profils utilisateurs
│       ├── services/          # Services & Demandes
│       ├── bookings/          # Réservations
│       ├── messages/          # Messaging
│       ├── categories/        # Catégories
│       └── match/             # Matching (legacy)
├── prisma/
│   ├── schema.prisma           # Schéma DB
│   ├── seed.ts                 # Données de seed
│   └── migrations/             # Migrations DB
├── test/                       # Tests
├── .env.example                # Template .env
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                    # Pages & layouts (App Router)
│   │   ├── page.tsx           # Home
│   │   ├── layout.tsx         # Root layout
│   │   ├── auth/              # Auth pages
│   │   ├── onboarding/        # Setup du profil
│   │   ├── dashboard/         # Accueil principal
│   │   ├── discover/          # Découvrir services
│   │   ├── profile/           # Mon profil
│   │   ├── messages/          # Messaging
│   │   ├── matches/           # Matching (legacy)
│   │   └── services/          # Gérer mes services
│   ├── components/             # Composants réutilisables
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilitaires
│   ├── styles/                 # CSS global
│   └── providers.tsx           # Context providers
├── public/                     # Assets statiques
├── .env.example                # Template .env
└── package.json
```

---

## 🔄 Flux de Développement

### 1. Créer une Nouvelle Fonctionnalité

#### Backend

```bash
# 1. Créer un module s'il n'existe pas
nest g m modules/ma-feature

# 2. Générer controller, service
nest g co modules/ma-feature
nest g s modules/ma-feature

# 3. Ajouter modèles au schema.prisma
# Voir docs/DATABASE.md

# 4. Créer une migration
npx prisma migrate dev --name add_ma_feature

# 5. Implémenter la logique
# - Controller (routes)
# - Service (logique métier)
# - DTOs pour validation

# 6. Tester avec Swagger ou Postman
# http://localhost:3001/api-docs
```

#### Frontend

```bash
# 1. Créer une page
# /src/app/ma-feature/page.tsx

# 2. Créer des composants
# /src/components/MyFeatureComponent.tsx

# 3. Ajouter les API endpoints
# /src/lib/endpoints.ts → API_ENDPOINTS.MY_FEATURE

# 4. Utiliser dans le composant
import { API_ENDPOINTS } from '@/lib/endpoints'
import { apiClient } from '@/lib/api-client'

// Dans le component:
const { data } = await apiClient.get(API_ENDPOINTS.MY_FEATURE)
```

### 2. Workflow Typique pour une PR

```bash
# 1. Créer une branche
git checkout -b feature/nom-feature

# 2. Développer et tester localement
npm run dev  # Backend & frontend

# 3. Tester dans le navigateur
# Frontend: http://localhost:3000
# API Docs: http://localhost:3001/api-docs

# 4. Commit avec message clair
git add .
git commit -m "feat: description courte"
# Les formats: feat:, fix:, docs:, refactor:, etc.

# 5. Push et créer une PR
git push origin feature/nom-feature
# Créer PR sur GitHub

# 6. Code review → Merge → Deploy
```

---

## 💅 Conventions de Code

### TypeScript
- ✅ Types explicites toujours
- ✅ `interface` pour contrats
- ✅ `type` pour unions/aliases
- ✅ Pas de `any`, utiliser `unknown` si nécessaire

### Naming
- **Files** : camelCase pour composants/utilitaires
- **Classes** : PascalCase
- **Variables** : camelCase
- **Constants** : UPPER_SNAKE_CASE
- **Routes API** : kebab-case

---

## 🔒 Sécurité

### À Respecter
- ✅ Ne jamais commit les `.env`
- ✅ Valider tous les inputs côté serveur
- ✅ HTTPS en production
- ✅ CORS configuré strictement
- ✅ Sanitize les inputs pour XSS

---

**Last Updated**: 3 mars 2026
