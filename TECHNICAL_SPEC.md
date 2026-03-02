# Kyndex – Spécification Technique pour Développement

## 1. Architecture Générale

- **Architecture modulaire orientée services** (API-first)
- **Frontend** : Next.js (React) en PWA + apps mobiles futures
- **Backend** : Node.js (NestJS recommandé) ou Firebase Functions
- **Base de données principale** : PostgreSQL ou Firestore
- **Stockage fichiers** : S3 ou Firebase Storage
- **Temps réel** : WebSockets (Socket.io ou Firebase RTDB)
- **IA layer via API** : OpenAI ou modèles internes

---

## 2. Modules Backend

| Module | Responsabilités |
|--------|-----------------|
| **Auth Service** | JWT, OAuth, 2FA |
| **User Service** | Profils, préférences, réputation |
| **Skills Service** | Taxonomie compétences |
| **Matching Service** | Algorithmes recommandations |
| **Messaging Service** | Temps réel + historique |
| **Transaction Service** | Paiements, crédits |
| **Reputation Service** | Ratings, badges |
| **AI Service** | Valorisation, modération, suggestions |
| **Notification Service** | Push, email, SMS |
| **Admin Service** | Modération, analytics |

---

## 3. Frontend (Web App)

- **Framework** : Next.js avec App Router
- **State Management** : Zustand ou Redux Toolkit
- **UI Kit** : Tailwind + shadcn/ui
- **Internationalisation** : i18n
- **PWA** : Offline partiel, notifications push
- **Formulaires** : React Hook Form + Zod pour validation

---

## 4. Mobile (Phase Ultérieure)

- **Framework** : React Native ou Flutter
- **Partage logique métier** : API REST/GraphQL
- **Notifications** : Firebase FCM
- **Stratégie** : Offline-first partiel

---

## 5. Modèles de Données

### User
```
{
  id: UUID,
  email: string,
  role: 'user' | 'admin' | 'org',
  reputationScore: number,
  createdAt: timestamp
}
```

### Profile
```
{
  userId: UUID,
  bio: string,
  languages: string[],
  location: string,
  availability: string
}
```

### Skill
```
{
  id: UUID,
  name: string,
  category: string
}
```

### UserSkill
```
{
  userId: UUID,
  skillId: UUID,
  type: 'offered' | 'wanted',
  level: 1-5
}
```

### Conversation
```
{
  id: UUID,
  participants: UUID[],
  createdAt: timestamp
}
```

### Message
```
{
  id: UUID,
  conversationId: UUID,
  senderId: UUID,
  content: string,
  attachments: object[]
}
```

### Transaction
```
{
  id: UUID,
  type: 'money' | 'credits' | 'hybrid',
  status: 'pending' | 'completed' | 'failed',
  value: number
}
```

### CreditWallet
```
{
  userId: UUID,
  balance: number
}
```

### Review
```
{
  fromUserId: UUID,
  toUserId: UUID,
  rating: 1-5,
  comment: string
}
```

---

## 6. API Design

### Architecture
- **Approche recommandée** : GraphQL pour matching, REST pour CRUD
- **Versioning** : v1, v2, etc. (pour REST)

### Endpoints Principaux

| Domaine | Endpoints |
|---------|-----------|
| **Auth** | `POST /auth/login`, `POST /auth/oauth`, `POST /auth/2fa` |
| **Users** | `GET /users/me`, `GET /users/{id}`, `PATCH /users/{id}` |
| **Skills** | `GET /skills`, `GET /skills/search`, `POST /skills` |
| **Matching** | `GET /matching/recommendations` |
| **Messaging** | `GET /conversations`, `POST /messages`, `WS /messages/stream` |
| **Transactions** | `GET /transactions`, `POST /transactions`, `POST /payments` |
| **Credits** | `GET /wallet`, `POST /credits/transfer` |
| **Reviews** | `GET /reviews`, `POST /reviews` |
| **Admin** | `GET /admin/reports`, `GET /admin/users` |

---

## 7. Matching Engine

- **Approche** : Matching basé sur graph (skills graph)
- **Scoring** : Similarité compétences + localisation + réputation
- **Modes** : Batch matching + temps réel
- **Évolution** : Matching triangulaire via graph cycles (future)

---

## 8. AI Layer

- **Profiling automatique** : NLP extraction compétences
- **Estimation valeur service** : ML regression + data marketplace
- **Détection fraude** : Classification
- **Analyse toxicité messages** : NLP toxicity detection
- **Summarization conversations** : Résumés automatiques
- **Recommendations personnalisées** : Collaborative filtering

---

## 9. Paiements & Crédits

- **Payment Gateway** : Stripe Connect (marketplace)
- **Wallet Interne** : Système de crédits
- **Ledger** : Append-only transactionnel
- **Escrow** : Logique d'escrow pour transactions
- **Webhooks** : Synchronisation Stripe
- **Multi-devises** : Gestion devises

---

## 10. Sécurité

- **Authentification** : JWT access + refresh tokens
- **OAuth2** : Support providers tiers
- **2FA** : TOTP (Time-based One-Time Password)
- **Rate Limiting** : Par utilisateur et IP
- **Chiffrement** : Données sensibles (AES-256)
- **RBAC** : Roles user/admin/org
- **Audit Logs** : Traçabilité actions critiques

---

## 11. Notifications

- **Message Queue** : BullMQ ou Cloud Tasks
- **Email** : SendGrid ou Resend
- **Push Notifications** : Firebase FCM
- **SMS** : Twilio (optionnel)
- **Préférences** : Gestion par utilisateur

---

## 12. Observabilité

- **Logging** : Winston ou Pino (structuré)
- **Monitoring** : Prometheus + Grafana
- **Tracing Distribué** : OpenTelemetry
- **Error Tracking** : Sentry
- **Analytics Produit** : Segment ou Mixpanel

---

## 13. DevOps & Infrastructure

### Conteneurisation
- **Docker** : Chaque service containerisé
- **Registre** : Docker Hub ou ECR

### CI/CD
- **Platform** : GitHub Actions
- **Environments** : dev, staging, production

### Déploiement
- **Frontend** : Vercel
- **Backend** : AWS (ECS/Lambda) ou Google Cloud (Cloud Run)
- **IaC** : Terraform

### Secrets
- **Management** : GitHub Secrets, AWS Secrets Manager, Vault

---

## 14. Performance & Scalabilité

- **CDN** : Cloudflare
- **Cache** : Redis (session, données chauds)
- **Pagination API** : Cursor-based ou offset
- **Full-Text Search** : Elasticsearch ou PostgreSQL FTS
- **Horizontal Scaling** : Load balancing services
- **Async Jobs** : Pour tâches lourdes (batch processing)

---

## 15. Internationalisation (i18n)

- **Frontend** : Traductions multiples, détection locale
- **Backend** : Locales, validation localisée
- **Timezones** : Gestion fuseaux horaires UTC
- **Paiements** : Multi-devises (conversion real-time)

---

## 16. Conformité & Légal

- **RGPD** : Export/suppression complète données
- **Cookies** : Consentement + gestion banneau
- **Régionalisation** : Données stockées par région
- **Modération** : Politique contenu, flags, reports
- **Terms of Service** : Acceptation utilisateurs

---

## 17. Roadmap Technique

### Phase 1 : MVP Monolithe Modulaire
- Services modulaires dans un monolithe
- Authentification + User profiles
- Skills matching basique
- Messaging temps réel
- Transaction simple
- **Timeline** : 3-4 mois

### Phase 2 : Microservices Critiques
- Découpage Messaging Service
- AI Service indépendant
- Event streaming (Kafka/RabbitMQ)
- **Timeline** : +2 mois

### Phase 3 : Scaling Global Multi-régions
- Multi-région déploiement
- CDN global
- Data replication
- **Timeline** : +3 mois

### Phase 4 : Marketplace API Publique
- API publique pour developers
- API key management
- Rate limiting avancé
- **Timeline** : +2 mois

---

## Dépendances Principales

### Backend
- `nestjs` / `express`
- `postgres` / `prisma` (ou Firestore)
- `socket.io`
- `stripe` SDK
- `redis`
- `bull` (job queue)
- `pino` / `winston`

### Frontend
- `next.js`
- `react`
- `zustand` / `redux-toolkit`
- `tailwindcss`
- `react-hook-form`
- `zod`
- `next-i18n-router`

### Infrastructure
- Docker
- Terraform
- GitHub Actions

---

## Métriques Clés de Succès

| Métrique | Cible |
|----------|-------|
| **Uptime** | 99.99% |
| **Latence API** | < 200ms (p95) |
| **Matching Quality** | F1 Score > 0.85 |
| **Conversion** | > 5% |
| **User Retention** | > 60% (30j) |
| **Time-to-Market** | Phase 1 en 4 mois |

---

**Dernière mise à jour** : 27 février 2026
