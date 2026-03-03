# Architecture & Flux de Kyndex

## 🏗️ Architecture Générale

Kyndex est construite selon une architecture **monolithique modulaire** avec une séparation claire entre backend et frontend.

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                 │
│  (Browser) Pages → Components → Hooks → API Client  │
└────────────┬────────────────────────────────────────┘
             │ (HTTP/REST)
┌────────────▼────────────────────────────────────────┐
│              NestJS API Backend (Port 3001)         │
│  Routes → Controllers → Services → Repository       │
│                        (Business Logic)              │
└────────────┬────────────────────────────────────────┘
             │ (Prisma ORM)
┌────────────▼────────────────────────────────────────┐
│         SQLite Database (Dev) / PostgreSQL (Prod)   │
│              Schema via Prisma Migrations            │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Flux Principal : Demande de Service

C'est le flow principal de l'application.

### 1️⃣ Client Crée une Demande
```
User (CUSTOMER) → Dashboard → "Créer une demande"
                  ↓
         ServiceRequest créée
         Status: OPEN
         ↓
      Visible pour les providers
```

**Données**:
- title, description
- budget (optionnel)
- location, dueDate (optionnels)
- requiredSkills (optionnel)

---

### 2️⃣ Provider Découvre la Demande
```
Provider → Dashboard
         → Voir les demandes actives
         → Cliquer sur "Voir demandes"
         → Modal affiche toutes les demandes
         → Statut: "NOUVEAU" (rouge), "À_VALIDER" (bleu), "EN_ATTENTE" (jaune)
```

**Statuts calculés basés sur Bookings existants**:
- `NOUVEAU` : Aucun booking
- `À_VALIDER` : Un ou plusieurs bookings en attente d'acceptation
- `EN_ATTENTE` : Au moins un booking accepté (travail en cours)

---

### 3️⃣ Provider Contacte le Client
```
Provider → Clique sur "Voir demandes"
        → Clique sur une demande
        → Modal détails s'ouvre
        → Clique "Contacter"
        ↓
  - Si statut NOUVEAU/À_VALIDER:
      ✅ Bouton "Contacter" activé
      ✅ Crée une Conversation
      ✅ Envoie un message initial
      ✅ Redirige à /messages/{conversationId}
  
  - Si statut EN_ATTENTE:
      ❌ Bouton "Contacter" désactivé
      ⚠️ Message d'avertissement affiché
```

---

### 4️⃣ Conversation & Booking
```
Client et Provider → Discutent dans /messages
                  → Client accepte l'offre
                  → Booking créé
                  → Status: IN_PROGRESS
                  ↓
                  Travail se fait
                  ↓
                  Booking completed
                  ↓
                  Review & Rating
```

---

## 🗂️ Modèle de Données

### User
```typescript
User {
  id: UUID
  email: string (unique)
  passwordHash: string
  role: string (USER, ADMIN)
  userType: string (CUSTOMER, PROVIDER, BOTH)
  status: string (ACTIVE, INACTIVE, BANNED)
  
  Relations:
    profile: Profile (1-to-1)
    services: Service[] (1-to-many) // Offres de services
    serviceRequests: ServiceRequest[] (1-to-many) // Demandes créées
    bookings: Booking[] (1-to-many) // Réservations
    conversations: ConversationParticipant[] // Chats
    reviews: Review[] // Avis reçus
}
```

### Service
```typescript
Service {
  id: UUID
  userId: string // Qui offre le service
  skillId: string
  categoryId: string
  
  title: string
  description: string
  basePrice: float
  priceType: string (HOURLY, FIXED, NEGOTIABLE)
  
  location: string
  onsite: boolean
  remote: boolean
  
  status: string (ACTIVE, INACTIVE, ARCHIVED)
  isVerified: boolean
  
  averageRating: float
  totalBookings: int
  totalReviews: int
}
```

### ServiceRequest
```typescript
ServiceRequest {
  id: UUID
  customerId: string // Qui demande
  serviceId: string? // Service lié (optionnel)
  
  title: string
  description: string
  budget: float?
  currency: string
  
  requiredSkills: string? // Comma-separated
  location: string?
  dueDate: DateTime?
  
  status: string (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
  statusForProvider: computed // NOUVEAU, À_VALIDER, EN_ATTENTE
}
```

### Booking
```typescript
Booking {
  id: UUID
  customerId: string
  providerId: string
  serviceId: string? // Service proposé
  serviceRequestId: string? // Pour quelle demande
  
  status: string (PENDING, ACCEPTED, COMPLETED, CANCELLED)
  totalPrice: float
  
  conversations: Message[]
  reviews: Review[]
}
```

### Conversation
```typescript
Conversation {
  id: UUID
  participants: ConversationParticipant[] // 2+ users
  messages: Message[]
}
```

### Message
```typescript
Message {
  id: UUID
  conversationId: string
  senderId: string
  content: string
  createdAt: DateTime
}
```

---

## 🔌 API Endpoints Clés

### Auth
- `POST /api/v1/auth/register` - Créer un compte
- `POST /api/v1/auth/login` - Se connecter
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Se déconnecter

### Profile
- `GET /api/v1/profile/me` - Mon profil
- `PUT /api/v1/profile/me` - Mettre à jour mon profil
- `POST /api/v1/profile/complete-setup` - Completer le setup

### Services Requests (NEW)
- `GET /api/v1/service-requests` - Lister toutes les demandes
- `GET /api/v1/service-requests/:id` - Détails d'une demande
- `POST /api/v1/service-requests` - Créer une demande
- `POST /api/v1/service-requests/:id/apply` - Répondre à une demande

### Services
- `GET /api/v1/services` - Lister mes services
- `POST /api/v1/services` - Créer un service
- `PUT /api/v1/services/:id` - Mettre à jour un service
- `DELETE /api/v1/services/:id` - Supprimer un service

### Messaging
- `GET /api/v1/messages/conversations` - Mes conversations
- `POST /api/v1/messages/conversations` - Créer une conversation
- `POST /api/v1/messages/conversations/:id/messages` - Envoyer un message
- `GET /api/v1/messages/conversations/:id/messages` - Lire les messages

---

## 📱 Frontend Pages

### Auth Flow
- `/` → Home (public)
- `/auth/login` - Login
- `/auth/register` - Register

### Onboarding
- `/onboarding` - Setup du profil

### Application
- `/dashboard` - Accueil (demandes de services)
- `/discover` - Découvrir les services
- `/profile` - Mon profil
- `/messages/:conversationId` - Conversations
- `/services` - Gestion de mes services

---

## 🔐 Authentication Flow

```
1. User -> /auth/register
   ↓
2. POST /auth/register { email, password }
   ↓
3. Network -> Backend créé User + hash password
   ↓
4. Frontend localStorage reçoit JWT + refreshToken
   ↓
5. Chaque requête inclut Authorization: Bearer {JWT}
   ↓
6. Backend valide JWT avec JwtAuthGuard
   ↓
7. Si JWT expiré (15min):
   - Axios interceptor détecte 401
   - POST /auth/refresh { refreshToken }
   - Token refreshifié
   - Requête réessayée
   ↓
8. Si refreshToken expiré (7 jours):
   - Redirection vers /auth/login
```

---

## 🚀 Cycle de Déploiement

```
Code → Git Push
     ↓
GitHub → Actions (CI/CD)
      ↓
Tests → Build → Deploy
      ↓
Frontend: Vercel (auto)
Backend: Docker → Registry → Deploy
```

---

## 📊 Métriques de Performance

### Cibles
- **Frontend Load Time** : < 2s
- **API Response Time** : < 200ms (p95)
- **Database Query Time** : < 100ms (p95)
- **Uptime Target** : 99.9%

### Monitoring
- Console logs en dev
- Structures logs en prod (à implémenter)

---

## 🔜 Améliorations Futures

- [ ] Notifications temps réel (Socket.io)
- [ ] Système de badges
- [ ] Matching basé sur l'IA
- [ ] Intégration Stripe
- [ ] App mobile (React Native)
- [ ] Multi-langue
- [ ] Dark mode
