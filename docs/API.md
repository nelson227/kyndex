# API Documentation - Kyndex

## Overview

- **Base URL** : `https://api.kyndex.com/v1`
- **Authentication** : Bearer Token (JWT)
- **Content-Type** : `application/json`
- **Rate Limit** : 100 requests/minute per user

---

## Authentication Endpoints

### POST /auth/register
**Description** : Créer un nouveau compte utilisateur

**Request**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "language": "en"
}
```

**Response** (201)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### POST /auth/login
**Description** : Se connecter avec email/password

**Request**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200)
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

---

### POST /auth/oauth/google
**Description** : Se connecter avec Google OAuth

**Request**
```json
{
  "idToken": "Google ID token"
}
```

**Response** (200)
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

---

### POST /auth/oauth/github
**Description** : Se connecter avec GitHub OAuth

**Request**
```json
{
  "code": "Authorization code from GitHub"
}
```

**Response** (200)
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

---

### POST /auth/2fa/enable
**Description** : Activer 2FA (TOTP)

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response** (200)
```json
{
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qrCode": "data:image/png;base64,...",
  "message": "Scan with authenticator app"
}
```

---

### POST /auth/2fa/verify
**Description** : Vérifier code 2FA

**Request**
```json
{
  "code": "123456"
}
```

**Response** (200)
```json
{
  "verified": true,
  "backupCodes": ["backup1", "backup2", ...]
}
```

---

### POST /auth/refresh
**Description** : Renouveler access token

**Request**
```json
{
  "refreshToken": "..."
}
```

**Response** (200)
```json
{
  "accessToken": "..."
}
```

---

## User Endpoints

### GET /users/me
**Description** : Récupérer profil utilisateur actuel

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response** (200)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "reputationScore": 4.8,
  "profile": {
    "bio": "Développeur passionné",
    "location": "Paris, France",
    "languages": ["fr", "en"],
    "availability": "weekends",
    "avatar": "https://..."
  },
  "createdAt": "2026-01-15T10:30:00Z"
}
```

---

### GET /users/{userId}
**Description** : Récupérer profil utilisateur public

**Response** (200)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "reputationScore": 4.8,
  "profile": {
    "bio": "Développeur passionné",
    "location": "Paris, France",
    "languages": ["fr", "en"],
    "avatar": "https://..."
  }
}
```

---

### PATCH /users/me
**Description** : Mettre à jour profil utilisateur

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "name": "Jane Doe",
  "profile": {
    "bio": "Designer créatif",
    "location": "Lyon, France",
    "languages": ["fr", "en", "es"],
    "availability": "flexible"
  }
}
```

**Response** (200)
```json
{
  "id": "...",
  "name": "Jane Doe",
  "profile": { ... },
  "updatedAt": "2026-02-27T15:45:00Z"
}
```

---

### PATCH /users/me/password
**Description** : Changer mot de passe

**Request**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response** (200)
```json
{
  "message": "Password updated successfully"
}
```

---

## Skills Endpoints

### GET /skills
**Description** : Lister toutes les compétences

**Query Parameters**
- `category` (optional) : Filtrer par catégorie
- `search` (optional) : Recherche texte
- `limit` (default: 20) : Pagination
- `offset` (default: 0) : Pagination

**Response** (200)
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Python",
      "category": "programming",
      "level": 3,
      "endorsements": 42
    },
    {
      "id": "uuid",
      "name": "Web Design",
      "category": "design",
      "level": 4
    }
  ],
  "total": 1250,
  "limit": 20,
  "offset": 0
}
```

---

### GET /skills/search
**Description** : Recherche full-text compétences

**Query Parameters**
- `q` (required) : Terme recherche
- `limit` (default: 10)

**Response** (200)
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Python Developer",
      "category": "programming",
      "relevance": 0.95
    }
  ]
}
```

---

### POST /skills
**Description** : Créer compétence personnalisée

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "name": "Photographie de produit",
  "category": "photography",
  "level": 4
}
```

**Response** (201)
```json
{
  "id": "uuid",
  "name": "Photographie de produit",
  "category": "photography",
  "createdAt": "2026-02-27T15:45:00Z"
}
```

---

### GET /users/me/skills
**Description** : Récupérer skills de l'utilisateur

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response** (200)
```json
{
  "offered": [
    {
      "skillId": "uuid",
      "name": "Python",
      "category": "programming",
      "level": 5,
      "type": "offered"
    }
  ],
  "wanted": [
    {
      "skillId": "uuid",
      "name": "UI Design",
      "category": "design",
      "level": 2,
      "type": "wanted"
    }
  ]
}
```

---

### POST /users/me/skills/{skillId}
**Description** : Ajouter compétence (offered ou wanted)

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "type": "offered",
  "level": 4
}
```

**Response** (201)
```json
{
  "userId": "uuid",
  "skillId": "uuid",
  "type": "offered",
  "level": 4,
  "addedAt": "2026-02-27T15:45:00Z"
}
```

---

## Matching Endpoints

### GET /matching/recommendations
**Description** : Récupérer recommendations de skills matching

**Headers**
```
Authorization: Bearer <accessToken>
```

**Query Parameters**
- `limit` (default: 20)
- `offset` (default: 0)
- `filters` (optional) : JSON filters

**Response** (200)
```json
{
  "matches": [
    {
      "userId": "uuid",
      "name": "Jane Smith",
      "matchScore": 0.87,
      "matchReason": "Expert Python, besoin UI Design",
      "commonSkills": ["Web Development"],
      "location": "Paris, France",
      "reputationScore": 4.6,
      "avatar": "https://..."
    }
  ],
  "total": 145,
  "limit": 20,
  "offset": 0
}
```

---

### POST /matching/batch
**Description** : Lancer matching batch (admin)

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "strategy": "skills_proximity",
  "includeNewUsers": true
}
```

**Response** (202)
```json
{
  "batchId": "uuid",
  "status": "processing",
  "timestamp": "2026-02-27T15:45:00Z"
}
```

---

## Messaging Endpoints

### GET /conversations
**Description** : Lister conversations utilisateur

**Headers**
```
Authorization: Bearer <accessToken>
```

**Query Parameters**
- `limit` (default: 20)
- `offset` (default: 0)
- `search` (optional)

**Response** (200)
```json
{
  "conversations": [
    {
      "id": "uuid",
      "participantIds": ["uuid1", "uuid2"],
      "lastMessage": {
        "id": "uuid",
        "content": "Thanks for your help!",
        "createdAt": "2026-02-27T14:30:00Z"
      },
      "unreadCount": 0,
      "createdAt": "2026-02-15T10:00:00Z"
    }
  ],
  "total": 5
}
```

---

### POST /conversations
**Description** : Créer conversation

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "participantId": "uuid",
  "initialMessage": "Hi, I'd like to learn Python from you"
}
```

**Response** (201)
```json
{
  "id": "uuid",
  "participantIds": ["currentUserId", "uuid"],
  "createdAt": "2026-02-27T15:45:00Z"
}
```

---

### GET /conversations/{conversationId}/messages
**Description** : Récupérer messages d'une conversation

**Headers**
```
Authorization: Bearer <accessToken>
```

**Query Parameters**
- `limit` (default: 20)
- `offset` (default: 0)

**Response** (200)
```json
{
  "messages": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "senderId": "uuid",
      "content": "Hi there!",
      "attachments": [],
      "createdAt": "2026-02-27T15:45:00Z",
      "updatedAt": "2026-02-27T15:45:00Z"
    }
  ],
  "total": 42
}
```

---

### POST /conversations/{conversationId}/messages
**Description** : Envoyer un message

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "content": "Thank you for your help!",
  "attachments": []
}
```

**Response** (201)
```json
{
  "id": "uuid",
  "content": "Thank you for your help!",
  "senderId": "uuid",
  "createdAt": "2026-02-27T15:47:00Z"
}
```

---

### WebSocket /messages/stream
**Description** : Real-time messaging stream

**Connection**
```javascript
const socket = io('https://api.kyndex.com', {
  auth: { token: accessToken }
});

socket.on('message:new', (msg) => { ... });
socket.emit('message:send', { conversationId, content });
```

---

## Transaction Endpoints

### POST /transactions
**Description** : Créer transaction

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "type": "hybrid",
  "amount": 50,
  "toUserId": "uuid",
  "description": "Web development service"
}
```

**Response** (201)
```json
{
  "id": "uuid",
  "type": "hybrid",
  "status": "pending",
  "amount": 50,
  "fromUserId": "uuid",
  "toUserId": "uuid",
  "createdAt": "2026-02-27T15:45:00Z"
}
```

---

### GET /transactions
**Description** : Historique transactions utilisateur

**Headers**
```
Authorization: Bearer <accessToken>
```

**Query Parameters**
- `status` (optional) : pending, completed, failed
- `limit` (default: 20)
- `offset` (default: 0)

**Response** (200)
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "hybrid",
      "status": "completed",
      "amount": 50,
      "direction": "sent",
      "otherUserId": "uuid",
      "otherUserName": "Jane Smith",
      "completedAt": "2026-02-26T10:30:00Z"
    }
  ],
  "total": 12
}
```

---

## Wallet/Credits Endpoints

### GET /wallet
**Description** : Récupérer solde crédit wallet

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response** (200)
```json
{
  "userId": "uuid",
  "balance": 250,
  "currency": "KYNDEX_CREDITS",
  "lastUpdated": "2026-02-27T15:45:00Z"
}
```

---

### POST /credits/transfer
**Description** : Transférer crédits

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "toUserId": "uuid",
  "amount": 50,
  "message": "Thanks for your help"
}
```

**Response** (201)
```json
{
  "id": "uuid",
  "fromUserId": "uuid",
  "toUserId": "uuid",
  "amount": 50,
  "status": "completed",
  "completedAt": "2026-02-27T15:47:00Z"
}
```

---

## Reviews Endpoints

### POST /reviews
**Description** : Créer review/rating

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request**
```json
{
  "toUserId": "uuid",
  "rating": 5,
  "comment": "Excellent service! Highly recommended.",
  "category": "communication"
}
```

**Response** (201)
```json
{
  "id": "uuid",
  "fromUserId": "uuid",
  "toUserId": "uuid",
  "rating": 5,
  "comment": "Excellent service!",
  "createdAt": "2026-02-27T15:47:00Z"
}
```

---

### GET /users/{userId}/reviews
**Description** : Récupérer reviews d'un utilisateur

**Response** (200)
```json
{
  "reviews": [
    {
      "id": "uuid",
      "fromUser": {
        "id": "uuid",
        "name": "John Doe"
      },
      "rating": 5,
      "comment": "Great collaboration!",
      "createdAt": "2026-02-20T10:00:00Z"
    }
  ],
  "averageRating": 4.7,
  "total": 15
}
```

---

## Admin Endpoints

### GET /admin/reports
**Description** : Lister user reports (admin only)

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response** (200)
```json
{
  "reports": [
    {
      "id": "uuid",
      "reportedUserId": "uuid",
      "reportedByUserId": "uuid",
      "reason": "inappropriate_content",
      "description": "Offensive language",
      "status": "pending",
      "createdAt": "2026-02-27T15:45:00Z"
    }
  ],
  "total": 3
}
```

---

### POST /admin/users/{userId}/ban
**Description** : Bannir utilisateur (admin)

**Request**
```json
{
  "reason": "violation_terms",
  "duration": "permanent"
}
```

**Response** (200)
```json
{
  "userId": "uuid",
  "status": "banned",
  "reason": "violation_terms",
  "bannedAt": "2026-02-27T15:47:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "You don't have permission for this resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "User not found"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "requestId": "uuid"
}
```

---

**Dernière mise à jour** : 27 février 2026
