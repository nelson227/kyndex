# Database Architecture - Kyndex

Database: SQLite (development), PostgreSQL (production)  
ORM: Prisma 5.5.2

---

## 📊 Entity Relationship Diagram

```
User ──┬──→ Profile (1:1)
       ├──→ Service (1:N)
       ├──→ ServiceRequest (1:N)
       ├──→ Booking (1:N as provider)
       ├──→ Booking (1:N as customer)
       ├──→ Conversation (M:N via ConversationParticipant)
       ├──→ Message (1:N)
       ├──→ Review (1:N)
       ├──→ Skill (M:N)
       └──→ CreditWallet (1:1)

ServiceRequest ──┬──→ User (customer) (N:1)
                 ├──→ Booking (1:N)
                 └──→ Skill (M:N)

Service ────────┬──→ User (provider) (N:1)
                ├──→ Skill (N:1)
                ├──→ SkillCategory (N:1)
                └──→ Booking (1:N)

Booking ────────┬──→ ServiceRequest (N:1)
                ├──→ Service (N:1)
                ├──→ User (provider) (N:1)
                ├──→ User (customer) (N:1)
                ├──→ Conversation (1:1)
                └──→ Review (1:1)

Conversation ───┬──→ ConversationParticipant (1:N)
                ├──→ Message (1:N)
                └──→ Booking (N:1)

ConversationParticipant ──→ User (N:1)
ConversationParticipant ──→ Conversation (N:1)

Message ────────┬──→ Conversation (N:1)
                ├──→ User (sender) (N:1)
                └──→ MessageAttachment (1:N)

Review ──────────┬──→ Booking (N:1)
                 ├──→ User (reviewer) (N:1)
                 └──→ User (reviewee) (N:1)

Skill ───────────┬──→ SkillCategory (N:1)
                 └──→ User (M:N)

CreditWallet ───→ User (1:1)

Transaction ────→ CreditWallet (N:1)

Badge ───────────→ User (M:N)
```

---

## 📝 Table Descriptions

### User
Principal table pour tous les utilisateurs du système.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant unique (PK) |
| email | String | ❌ | Email unique |
| passwordHash | String | ❌ | Hash bcrypt du mot de passe |
| role | Enum | ❌ | USER, ADMIN, MODERATOR |
| userType | Enum | ❌ | CUSTOMER, PROVIDER, BOTH |
| isAccountVerified | Boolean | ✅ | Email vérifié? |
| createdAt | DateTime | ❌ | Date de création |
| updatedAt | DateTime | ❌ | Dernière modification |

**Indexes:**
- UNIQUE(email)
- INDEX(createdAt)

---

### Profile
Informations détaillées du profil utilisateur.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| userId | UUID | ❌ | Référence User (FK) |
| firstName | String | ✅ | Prénom |
| lastName | String | ✅ | Nom |
| bio | String | ✅ | Biographie (max 500 car) |
| city | String | ✅ | Ville |
| location | String | ✅ | Localisation GPS |
| avatarUrl | String | ✅ | URL de l'avatar |
| portfolioUrl | String | ✅ | URL du portfolio |
| isProfileComplete | Boolean | ❌ | Profil complété? |
| createdAt | DateTime | ❌ | Date de création |
| updatedAt | DateTime | ❌ | Dernière modification |

**Constraints:**
- UNIQUE(userId)
- Foreign Key: userId → User.id (CASCADE DELETE)

---

### Service
Services offerts par les providers.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| userId | UUID | ❌ | Provider (FK) |
| skillId | UUID | ✅ | Compétence associée (FK) |
| categoryId | UUID | ✅ | Catégorie (FK) |
| title | String | ❌ | Titre du service |
| description | String | ❌ | Description détaillée |
| basePrice | Decimal | ❌ | Prix de base |
| priceType | Enum | ❌ | HOURLY, FIXED, CUSTOM |
| currency | String | ❌ | Code devise (EUR, USD, etc) |
| location | String | ✅ | Localisation |
| remote | Boolean | ❌ | Service en remote? |
| onsite | Boolean | ❌ | Service sur site? |
| status | Enum | ❌ | ACTIVE, PAUSED, CLOSED |
| averageRating | Decimal | ✅ | Note moyenne (0-5) |
| totalBookings | Int | ❌ | Nombre total de réservations |
| createdAt | DateTime | ❌ | Date de création |
| updatedAt | DateTime | ❌ | Dernière modification |

**Indexes:**
- INDEX(userId)
- INDEX(skillId)
- INDEX(categoryId)
- INDEX(status)

---

### ServiceRequest
Demandes de services postées par les customers.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| customerId | UUID | ❌ | Client (FK) |
| title | String | ❌ | Titre de la demande |
| description | String | ❌ | Description détaillée |
| budget | Decimal | ✅ | Budget proposé |
| currency | String | ❌ | Code devise |
| location | String | ✅ | Localisation souhaitée |
| dueDate | DateTime | ✅ | Date limite souhaitée |
| requiredSkills | String | ✅ | Skills requis (CSV) |
| status | Enum | ❌ | OPEN, IN_PROGRESS, COMPLETED, CANCELLED |
| createdAt | DateTime | ❌ | Date de création |
| updatedAt | DateTime | ❌ | Dernière modification |

**Indexes:**
- INDEX(customerId)
- INDEX(status)
- INDEX(createdAt)

---

### Booking
Représente une réservation ou un contrat entre customer et provider.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| serviceRequestId | UUID | ✅ | Demande (FK) |
| serviceId | UUID | ✅ | Service (FK) |
| customerId | UUID | ❌ | Client (FK) |
| providerId | UUID | ❌ | Prestataire (FK) |
| conversationId | UUID | ✅ | Conversation (FK) |
| totalPrice | Decimal | ❌ | Prix total de la commande |
| status | Enum | ❌ | PENDING, ACTIVE, COMPLETED, CANCELLED, DISPUTED |
| startDate | DateTime | ✅ | Date de début |
| completionDate | DateTime | ✅ | Date d'achèvement |
| createdAt | DateTime | ❌ | Date de création |
| updatedAt | DateTime | ❌ | Dernière modification |

**Constraints:**
- Foreign Key: serviceRequestId → ServiceRequest.id (CASCADE)
- Foreign Key: serviceId → Service.id (SET NULL)
- Foreign Key: customerId → User.id
- Foreign Key: providerId → User.id

**Indexes:**
- INDEX(customerId)
- INDEX(providerId)
- INDEX(status)

---

### Conversation
Conversations entre users (via messages).

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| bookingId | UUID | ✅ | Booking associé (FK) |
| title | String | ✅ | Titre optionnel |
| lastActivityAt | DateTime | ❌ | Dernière activité |
| createdAt | DateTime | ❌ | Date de création |
| updatedAt | DateTime | ❌ | Dernière modification |

**Indexes:**
- INDEX(bookingId)
- INDEX(createdAt DESC)

---

### ConversationParticipant
Participants d'une conversation (M:N).

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| conversationId | UUID | ❌ | Conversation (FK) |
| userId | UUID | ❌ | Utilisateur (FK) |
| joinedAt | DateTime | ❌ | Quand rejoindre |
| lastReadAt | DateTime | ✅ | Dernier message lu |
| isActive | Boolean | ❌ | Participe toujours? |

**Constraints:**
- UNIQUE(conversationId, userId)
- Foreign Key: conversationId → Conversation.id (CASCADE)
- Foreign Key: userId → User.id

---

### Message
Messages individuels dans les conversations.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| conversationId | UUID | ❌ | Conversation (FK) |
| senderId | UUID | ❌ | Sender (FK) |
| content | String | ❌ | Contenu du message |
| isEdited | Boolean | ❌ | Message édité? |
| createdAt | DateTime | ❌ | Date d'envoi |
| updatedAt | DateTime | ❌ | Dernière édition |

**Indexes:**
- INDEX(conversationId)
- INDEX(senderId)
- INDEX(createdAt DESC)

---

### MessageAttachment
Fichiers attachés aux messages.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| messageId | UUID | ❌ | Message (FK) |
| fileUrl | String | ❌ | URL du fichier |
| fileName | String | ❌ | Nom du fichier |
| mimeType | String | ❌ | Type MIME |
| createdAt | DateTime | ❌ | Date d'upload |

---

### Review
Avis et évaluations.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| bookingId | UUID | ❌ | Booking (FK) |
| reviewerId | UUID | ❌ | Qui note (FK) |
| revieweeId | UUID | ❌ | Qui est noté (FK) |
| rating | Int | ❌ | Note (1-5) |
| comment | String | ✅ | Avis textuel |
| createdAt | DateTime | ❌ | Date de l'avis |
| updatedAt | DateTime | ❌ | Dernière édition |

**Constraints:**
- UNIQUE(bookingId)
- Foreign Key: bookingId → Booking.id (CASCADE)

**Indexes:**
- INDEX(revieweeId)
- INDEX(rating DESC)

---

### Skill
Compétences disponibles.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| categoryId | UUID | ❌ | Catégorie (FK) |
| name | String | ❌ | Nom de la compétence |
| slug | String | ❌ | URL-friendly name |
| description | String | ✅ | Description |
| icon | String | ✅ | Icône (nom) |

**Constraints:**
- UNIQUE(slug)
- INDEX(categoryId)

---

### SkillCategory
Catégories de compétences.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| name | String | ❌ | Nom de la catégorie |
| slug | String | ❌ | URL-friendly name |
| icon | String | ✅ | Icône |
| order | Int | ❌ | Ordre d'affichage |

**Constraints:**
- UNIQUE(slug)

---

### CreditWallet
Portefeuille de crédits utilisateurs.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| userId | UUID | ❌ | User (FK) |
| balance | Decimal | ❌ | Solde actuel |
| totalEarned | Decimal | ❌ | Total gagné |
| totalSpent | Decimal | ❌ | Total dépensé |
| currency | String | ❌ | Devise |
| updatedAt | DateTime | ❌ | Dernière mise à jour |

**Constraints:**
- UNIQUE(userId)

---

### Transaction
Historique des transactions de crédits.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| walletId | UUID | ❌ | Wallet (FK) |
| type | Enum | ❌ | CREDIT, DEBIT, REFUND |
| amount | Decimal | ❌ | Montant |
| description | String | ✅ | Raison |
| status | Enum | ❌ | PENDING, COMPLETED, FAILED |
| createdAt | DateTime | ❌ | Date |

---

### Badge
Badges de réussite pour les users.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Identifiant (PK) |
| name | String | ❌ | Nom du badge |
| slug | String | ❌ | URL-friendly |
| description | String | ✅ | Description |
| icon | String | ✅ | Icône |

---

## 🔑 Indexes pour Performance

**Service Requests (Queries pour découverte):**
```sql
CREATE INDEX idx_service_requests_status ON ServiceRequest(status);
CREATE INDEX idx_service_requests_created_desc ON ServiceRequest(createdAt DESC);
CREATE INDEX idx_service_requests_customer ON ServiceRequest(customerId);
```

**Bookings (Pour le pipeline de commande):**
```sql
CREATE INDEX idx_bookings_provider ON Booking(providerId);
CREATE INDEX idx_bookings_customer ON Booking(customerId);
CREATE INDEX idx_bookings_status ON Booking(status);
```

**Messages (Pour les conversations):**
```sql
CREATE INDEX idx_messages_conversation ON Message(conversationId);
CREATE INDEX idx_messages_conversation_created ON Message(conversationId, createdAt DESC);
```

**Conversations (Pour le panneau de messaging):**
```sql
CREATE INDEX idx_conversation_participants_user ON ConversationParticipant(userId);
```

---

## 🔄 Migration History

Les migrations Prisma sont sauvegardées dans `prisma/migrations/`:

1. **20260227173848_init** - Schéma initial (User, Profile, Service)
2. **20260228130434_add_portfolio_images** - Ajout portfolio
3. **20260228140135_add_match_model** - Modèle Booking/Matching
4. **20260301115952_initial_yoojo_schema** - Schéma complet actuel

Pour appliquer les migrations:
```bash
npx prisma migrate deploy
```

---

## 🔒 Sécurité

### Principes
- ✅ Foreign keys avec CASCADE DELETE (cohérence)
- ✅ UNIQUE constraints (email, slug, etc)
- ✅ Indexes sur colonnes filtrées (performance)
- ✅ Soft deletes pour User/Profile (données importantes)

### À Implémenter
- Audit logging (tracking des modifications)
- Data encryption at rest (sensible info)
- Row-level security (RBAC)

---

## 📈 Capacités & Limitations

| Aspect | SQLite (Dev) | PostgreSQL (Prod) |
|--------|--------------|------------------|
| Connexions concurrentes | 1-5 | 100+ |
| Taille max DB | 2TB théorique | illimitée |
| Full-text search | Basique | Excellent (GIN) |
| Géospatialité | ❌ | ✅ (PostGIS) |
| JSON type | ✅ | ✅ mieux |
| Transactions | ✅ | ✅ |

---

**ORM Version**: Prisma 5.5.2  
**Last Updated**: 3 mars 2026
