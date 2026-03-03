# API Documentation - Kyndex

API Base URL: `http://localhost:3001/api/v1`

**Documentation Interactive**: http://localhost:3001/api-docs (Swagger UI)

---

## 🔐 Authentification

### POST `/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** 201
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

### POST `/auth/login`
Se connecter avec email et password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** 200
```json
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

---

### POST `/auth/refresh`
Renouveler le JWT token avec le refresh token.

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** 200
```json
{
  "accessToken": "new_jwt_token"
}
```

---

### POST `/auth/logout`
Se déconnecter (invalide le refresh token).

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200
```json
{
  "message": "Logged out successfully"
}
```

---

## 👤 Profil

### GET `/profile/me`
Récupérer mon profil.

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "userType": "BOTH"
  },
  "profile": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "I'm a developer",
    "city": "Paris",
    "avatarUrl": "https://...",
    "averageRating": 4.5,
    "totalReviews": 12
  }
}
```

---

### PUT `/profile/me`
Mettre à jour mon profil.

**Headers:** `Authorization: Bearer {JWT}`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "I'm a developer",
  "city": "Paris",
  "location": "Paris, France"
}
```

**Response:** 200 (profile updated)

---

### POST `/profile/complete-setup`
Marquer le profil comme complété (end of onboarding).

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200
```json
{
  "isProfileComplete": true
}
```

---

## 📋 Demandes de Services

### GET `/service-requests`
Lister toutes les demandes de services.

**Query Parameters:**
- `status` (optionnel) : OPEN, IN_PROGRESS, COMPLETED
- `limit` (default: 50)
- `offset` (default: 0)

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200
```json
[
  {
    "id": "uuid",
    "title": "Need a web developer",
    "description": "Build a React app for my startup",
    "budget": 5000,
    "currency": "EUR",
    "location": "Paris",
    "dueDate": "2026-03-20T00:00:00Z",
    "requiredSkills": "React,Node.js,PostgreSQL",
    "status": "OPEN",
    "statusForProvider": "NOUVEAU",
    "customer": {
      "id": "uuid",
      "email": "client@example.com",
      "profile": {
        "firstName": "Jane",
        "lastName": "Doe",
        "city": "Paris",
        "avatarUrl": "https://..."
      }
    },
    "bookings": [],
    "createdAt": "2026-03-01T10:00:00Z"
  }
]
```

---

### GET `/service-requests/:id`
Récupérer les détails d'une demande spécifique.

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200 (same as above single item)

---

### POST `/service-requests`
Créer une nouvelle demande de service.

**Headers:** `Authorization: Bearer {JWT}`

**Body:**
```json
{
  "title": "Need a web developer",
  "description": "Build a React app for my startup",
  "budget": 5000,
  "currency": "EUR",
  "location": "Paris",
  "dueDate": "2026-03-20T00:00:00Z",
  "requiredSkills": "React,Node.js,PostgreSQL"
}
```

**Response:** 201
```json
{
  "id": "uuid",
  "title": "Need a web developer",
  // ... full request object
}
```

---

### POST `/service-requests/:id/apply`
Répondre à une demande (créer un booking comme provider).

**Headers:** `Authorization: Bearer {JWT}`

**Body:**
```json
{
  "serviceId": "uuid-optionnel",
  "message": "I can help with this project"
}
```

**Response:** 201
```json
{
  "id": "booking-uuid",
  "status": "PENDING",
  "serviceRequestId": "uuid",
  "customerId": "uuid",
  "providerId": "uuid",
  "totalPrice": 0,
  "createdAt": "2026-03-01T10:00:00Z"
}
```

---

## 💬 Messaging

### GET `/messages/conversations`
Lister mes conversations.

**Headers:** `Authorization: Bearer {JWT}`

**Query Parameters:**
- `limit` (default: 50)
- `offset` (default: 0)

**Response:** 200
```json
[
  {
    "id": "uuid",
    "title": null,
    "participants": [
      {
        "userId": "uuid",
        "user": {
          "profile": {
            "firstName": "John"
          }
        },
        "joinedAt": "2026-03-01T10:00:00Z"
      }
    ],
    "lastMessage": {
      "content": "Hi, are you available?",
      "createdAt": "2026-03-01T11:00:00Z"
    }
  }
]
```

---

### POST `/messages/conversations`
Créer une nouvelle conversation.

**Headers:** `Authorization: Bearer {JWT}`

**Body:**
```json
{
  "otherUserId": "uuid"
}
```

**Response:** 201
```json
{
  "id": "conversation-uuid",
  "participants": []
}
```

---

### GET `/messages/conversations/:conversationId/messages`
Récupérer les messages d'une conversation.

**Headers:** `Authorization: Bearer {JWT}`

**Query Parameters:**
- `limit` (default: 50)
- `offset` (default: 0)

**Response:** 200
```json
[
  {
    "id": "message-uuid",
    "content": "Hi, are you available?",
    "sender": {
      "profile": {
        "firstName": "John"
      }
    },
    "createdAt": "2026-03-01T11:00:00Z"
  }
]
```

---

### POST `/messages/conversations/:conversationId/messages`
Envoyer un message.

**Headers:** `Authorization: Bearer {JWT}`

**Body:**
```json
{
  "content": "Yes, I'm available. When do you want to start?"
}
```

**Response:** 201
```json
{
  "id": "message-uuid",
  "content": "Yes, I'm available...",
  "senderId": "uuid",
  "conversationId": "uuid",
  "createdAt": "2026-03-01T11:05:00Z"
}
```

---

## 📚 Services

### GET `/services`
Lister mes services.

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200
```json
[
  {
    "id": "service-uuid",
    "userId": "uuid",
    "title": "Full Stack Development",
    "description": "Build web apps with React & Node.js",
    "basePrice": 100,
    "priceType": "HOURLY",
    "currency": "EUR",
    "location": "Paris",
    "remote": true,
    "onsite": false,
    "status": "ACTIVE",
    "averageRating": 4.8,
    "totalBookings": 5
  }
]
```

---

### POST `/services`
Créer un nouveau service.

**Headers:** `Authorization: Bearer {JWT}`

**Body:**
```json
{
  "skillId": "uuid",
  "categoryId": "uuid",
  "title": "Full Stack Development",
  "description": "Build web apps",
  "basePrice": 100,
  "priceType": "HOURLY",
  "location": "Paris",
  "remote": true,
  "onsite": false
}
```

**Response:** 201

---

### PUT `/services/:id`
Mettre à jour un service.

**Headers:** `Authorization: Bearer {JWT}`

**Body:** (même structure que POST)

**Response:** 200

---

### DELETE `/services/:id`
Supprimer un service.

**Headers:** `Authorization: Bearer {JWT}`

**Response:** 200

---

## 📂 Catégories

### GET `/categories`
Lister toutes les catégories de services.

**Response:** 200
```json
[
  {
    "id": "uuid",
    "name": "Web Development",
    "slug": "web-development",
    "icon": "code"
  }
]
```

---

## ❌ Erreurs Courantes

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Action**: Utiliser le `refreshToken` pour obtenir un nouveau JWT.

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity (Validation Error)
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

**API Version**: v1  
**Last Updated**: 3 mars 2026
