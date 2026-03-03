# Kyndex - Plateforme de Marché de Services par Compétences

## 🎯 Vue d'Ensemble

Kyndex est une **plateforme marketplace peer-to-peer** permettant aux utilisateurs d'**offrir et demander des services** basés sur leurs compétences.

### Modèle d'Affaires
- **Service Listings** : Les prestataires postent leurs services avec tarifs et détails
- **Service Requests** : Les clients postent des demandes de services (besoins)
- **Matching Direct** : Les prestataires découvrent et répondent aux demandes
- **Conversations** : Communication directe entre client et prestataire
- **Transactions & Système de Crédits** : Paiements internes sécurisés
- **Réputation** : Avis et ratings basés sur les interactions

---

## 📁 Structure du Projet

```
kyndex/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentification JWT
│   │   │   ├── profile/        # Gestion des profils
│   │   │   ├── services/       # Offres de services
│   │   │   ├── bookings/       # Réservations/Contrats
│   │   │   ├── messages/       # Messaging
│   │   │   ├── categories/     # Catégories de services
│   │   │   └── match/          # Matching (legacy)
│   │   ├── common/             # Decorators, Guards, Filters
│   │   ├── config/             # Configuration
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma DB
│   │   └── migrations/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Login/Register
│   │   │   ├── onboarding/     # Setup du profil
│   │   │   ├── discover/       # Découvrir les services
│   │   │   ├── dashboard/      # Accueil (demandes de services)
│   │   │   ├── profile/        # Mon profil & mes services
│   │   │   ├── messages/       # Conversations
│   │   │   ├── matches/        # Legacy matching
│   │   │   └── services/       # Gestion des services
│   │   ├── components/         # Composants réutilisables
│   │   ├── lib/                # Utilities (API client, etc.)
│   │   └── hooks/              # Custom React hooks
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md         # Architecture et flux
│   ├── FEATURES.md             # Features actuelles
│   ├── API.md                  # Routes API
│   ├── DATABASE.md             # Schéma Prisma
│   └── DEVELOPMENT.md          # Guide de développement
│
└── docker-compose.yml          # Dev environment
```

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 20
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone le repo
git clone https://github.com/utilisateur/kyndex.git
cd kyndex

# Backend
cd backend
npm install
npm run dev
# Serveur sur http://localhost:3001

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
# Serveur sur http://localhost:3000
```

### Avec Docker
```bash
docker-compose up
```

---

## 🎨 Fonctionnalités Principales

### ✅ Actuelles (MVP)

#### Authentification & Profils
- Registration/Login par email
- JWT avec refresh tokens
- Onboarding pour completer le profil
- Profil utilisateur avec avatar et bio

#### Services & Demandes
- **Services**: Prestataires postent leurs services (tarif, description, localisation)
- **Service Requests**: Clients postent des demandes (besoins, budget, deadline)
- **Réponses**: Prestataires découvrent et répondent aux demandes
- **Dashboard**: Voir les demandes en cours avec statuts (NOUVEAU / À_VALIDER / EN_ATTENTE)

#### Messaging
- Conversations en temps réel
- Création auto de conversation lors d'une réponse
- Messages avec timestamps

#### Système de Réputation
- Avis et ratings
- Compteurs de services complétés

### 🔄 En Développement

- Système de paiements complet
- Notifications temps réel
- Matchmaking avancé basé sur compétences

### 📋 Plannifiées (Futures)

- Système de badges
- Portefeuille/Portfolio avec images
- Matching basé sur l'IA
- Intégrations externes (Stripe, etc.)

---

## 🔒 Architecture de Sécurité

- **Auth** : JWT tokens (15min) + Refresh tokens (7 jours)
- **Code** : Strongly typed avec TypeScript
- **DB** : ORM via Prisma avec validations
- **CORS** : Configuré pour développement
- **Logs** : Console logs pour debugging

---

## 🛠️ Stack Technique

### Backend
- **Runtime** : Node.js 20.19.5
- **Framework** : NestJS 10.2.8
- **ORM** : Prisma 5.5.2
- **Real-time** : Socket.io 4.7.2
- **Language** : TypeScript
- **Formatting** : Prettier

### Frontend
- **Framework** : Next.js 14.0.3 (App Router)
- **React** : 18
- **Styling** : Tailwind CSS
- **State** : Zustand 4.4.3
- **HTTP Client** : Axios
- **Forms** : React Hook Form
- **Icons** : Lucide React
- **Language** : TypeScript

### Database
- **Dev** : SQLite (local)
- **Prod** : PostgreSQL (plannifié)
- **Schema Management** : Prisma migrations

---

## 📊 Modèle de Données Simplifié

```
User (Profil)
  ├── Profile (Bio, Avatar, Localisation)
  ├── Services[] (Offres de services)
  ├── ServiceRequests[] (Demandes postées)
  ├── Bookings[] (Réservations comme customer ou provider)
  └── Conversations[] (Messages)

Service
  ├── Skill (Compétence)
  ├── Category (Catégorie)
  └── Bookings[] (Réservations)

ServiceRequest
  ├── Customer (Qui demande)
  └── Bookings[] (Réponses des prestataires)

Booking
  ├── Customer (Client)
  ├── Provider (Prestataire)
  ├── Service (Service concerné)
  ├── ServiceRequest (Demande concernée)
  └── Messages[] (Communications)
```

---

## 📚 Documentation Complète

- **[Architecture Détaillée](./docs/ARCHITECTURE.md)** - Flux de l'application et architecture
- **[Fonctionnalités](./docs/FEATURES.md)** - Liste complète des features
- **[Routes API](./docs/API.md)** - Endpoints et documentation
- **[Schéma Database](./docs/DATABASE.md)** - Modèles Prisma
- **[Guide Développement](./docs/DEVELOPMENT.md)** - Comment développer

---

## 🔧 Développement

### Commandes Utiles

```bash
# Backend
cd backend

npm run dev          # Mode développement avec watch
npm run build        # Build production
npm run typecheck    # Vérifier les types TS
npm run test         # Lancer les tests

# Prisma
npx prisma migrate dev    # Créer une migration
npx prisma studio        # Visual database editor
npx prisma generate       # Régénérer le client
npx prisma seed           # Poppler la DB avec seed.ts

# Frontend
cd frontend

npm run dev          # Mode développement
npm run build        # Build production
npm run lint         # Linter le code
npm run type-check   # Vérifier les types
```

### Flux de Développement

1. **Créer une branche** : `git checkout -b feature/nom-feature`
2. **Développer** : Faire les changements
3. **Tester localement** : Vérifier dans le navigateur
4. **Commit** : `git commit -m "feat: description"`
5. **Push & PR** : Créer une pull request

---

## 📞 Support & Contact

- **Issues** : Créer un issue GitHub
- **Discussions** : Utiliser GitHub Discussions
- **Email** : [support@kyndex.fr](mailto:support@kyndex.fr)

---

## 📄 Licence

MIT License

---

**Version** : 1.0.0 MVP  
**Statut** : En développement actif  
**Dernière mise à jour** : 3 mars 2026
