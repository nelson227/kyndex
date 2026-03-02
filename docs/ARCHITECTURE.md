# Architecture Details - Kyndex

## 1. Flux d'Architecture General

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Web (Next.js PWA)  │  Mobile (React Native/Flutter)    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS + WebSocket
┌────────────────────────▼────────────────────────────────────────┐
│                     API Gateway Layer                             │
│  • Authentication Filter                                         │
│  • Rate Limiting                                                 │
│  • Request/Response Logging                                      │
│  • CORS Management                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    Business Logic Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Auth Service   │ User Service   │ Skills Service        │  │
│  │ Matching Svc   │ Messaging Svc  │ Transaction Service   │  │
│  │ Reputation Svc │ AI Service     │ Notification Svc      │  │
│  │ Admin Service  │ Cache Layer    │                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      Data Layer                                   │
│  ┌─────────────────────┬──────────────────┬──────────────────┐ │
│  │   PostgreSQL        │     Redis        │  Elasticsearch   │ │
│  │  (Source of Truth)  │   (Cache/Queue)  │  (Full-text)     │ │
│  └─────────────────────┴──────────────────┴──────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    External Services                              │
│  • Stripe (Payments)  • Firebase (Push)  • OpenAI (AI/LLM)     │
│  • SendGrid (Email)   • Twilio (SMS)     • Sentry (Monitoring) │
└───────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Services - Phase 1 (Monolithe Modulaire)

### Structure Physique
```
backend-app/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── strategies/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── skills/
│   │   ├── matching/
│   │   ├── messaging/
│   │   ├── transactions/
│   │   ├── reputation/
│   │   ├── notifications/
│   │   ├── ai/
│   │   └── admin/
│   ├── common/
│   │   ├── database/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   └── pipes/
│   ├── config/
│   ├── types/
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── test/
```

### Isolation Services
Chaque service NestJS est isolé par :
- **Module dédié** : auth.module.ts, users.module.ts, etc.
- **Exports limités** : Exposer que les entités publiques
- **Dépendances explicites** : Imports/exports dans modules.ts
- **Repositories** : Accès data centralisé

---

## 3. Communication Entre Services

### Intra-service (Phase 1)
```typescript
// skills.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Skill, UserSkill])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService] // Exporté pour matching service
})
export class SkillsModule {}

// matching.module.ts
@Module({
  imports: [SkillsModule], // Dépend de Skills
  controllers: [MatchingController],
  providers: [MatchingService]
})
export class MatchingModule {}
```

### Inter-service (Phase 2+)
```
Services independents
        │
        ├─→ Event Bus (RabbitMQ/Kafka)
        │
        ├─→ REST APIs internes
        │
        └─→ gRPC (calls directs)
```

---

## 4. Data Flow - Matching Process

```
User Search
    │
    ▼
┌─────────────────────────┐
│ Matching Service        │
│ - Get user skills       │
│ - Get user location     │
│ - Get reputation score  │
└────────┬────────────────┘
         │
         ├─→ Skills Service (cache)
         ├─→ User Service (profile)
         └─→ Search (Elasticsearch)
                    │
                    ▼
         ┌──────────────────────┐
         │ Scoring Algorithm    │
         │ skills_sim * 0.5 +   │
         │ location * 0.3 +     │
         │ reputation * 0.2     │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Results Ranked       │
         │ + Pagination         │
         │ + Cache (Redis)      │
         └──────────┬───────────┘
                    │
                    ▼
              Response API
```

---

## 5. Real-time Architecture (Messaging)

```
Client (Web/Mobile)
    │
    ├─→ WebSocket Connection (Socket.io)
    │
    ▼
┌─────────────────────────┐
│ Socket.io Server        │
│ - Connection manager    │
│ - Room management       │
│ - Event broadcasting    │
└────────────┬────────────┘
             │
             ├─→ Redis Adapter (multi-server)
             │
             └─→ Messaging Service
                    │
                    ├─→ Store to PostgreSQL
                    ├─→ Update cache
                    └─→ Broadcast to other clients
```

---

## 6. Payment & Credit Flow

```
User initiates transaction
         │
         ▼
┌──────────────────────┐
│ Transaction Service  │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
Stripe       Internal
Payment      Credits
    │          │
    ├─→────────┤
           │
           ▼
    ┌──────────────────────┐
    │ Ledger (append-only) │
    │ - Immutable records  │
    │ - Audit trail       │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Credit Wallet        │
    │ - User balance       │
    │ - Cache in Redis     │
    └──────────────────────┘
```

---

## 7. AI Layer Integration

```
┌────────────────────────────────────┐
│ AI Service (NestJS Module)         │
└────────────┬───────────────────────┘
             │
    ┌────────┼────────┬──────────────┐
    │        │        │              │
    ▼        ▼        ▼              ▼
Profile   Service  Message      Fraud
NLP       Value    Moderation   Detection
Extraction Estimation (Toxicity) (Classification)
    │        │        │              │
    └────────┼────────┼──────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ External LLM API     │
    │ (OpenAI / Local)     │
    └──────────────────────┘
```

---

## 8. Security Layers

### Layer 1: Network
- HTTPS/TLS 1.3
- API Gateway rate limiting
- WAF (CloudFlare)

### Layer 2: Application
- JWT verification
- OAuth2 authorization
- API key validation

### Layer 3: Backend
- Role-Based Access Control (RBAC)
- Row-Level Security (RLS) en DB
- Input validation (Zod)
- SQL injection prevention (Prisma)

### Layer 4: Data
- Encryption at rest (sensitive data)
- Encryption in transit
- Regular backups
- RGPD compliance tools

---

## 9. Caching Strategy

```
Request
  │
  ├─→ Check Redis
  │        │
  │   Hit? ├─→ Return (fast)
  │        │
  │        └─→ Miss
  │            │
  │            ▼
  │    PostgreSQL/ES
  │            │
  │            ├─→ Process
  │            │
  │            ├─→ Store Redis
  │            │   (TTL: 30m-24h)
  │            │
  │            └─→ Return
  │
  └─→ Response
```

**Cache Keys Pattern**
- `user:{userId}` - User data
- `skills:{skillId}` - Skill info
- `matching:batch:{batchId}` - Matching results
- `messages:{conversationId}` - Recent messages

---

## 10. Scalability Points

### Horizontal Scaling
- **API Servers** : Stateless (easy scaling)
- **Load Balancer** : Nginx/AWS ALB
- **Database** : Master-replica (read replicas)
- **Cache** : Redis Cluster

### Vertical Points (bottleneck watch)
- **Database writes** : Monolithic access
- **AI processing** : CPU-intensive
- **Real-time broadcast** : Memory usage

### Future: Microservices
```
Phase 1              Phase 2+
Monolith       →    Messaging Service (separate)
                    AI Service (separate)
                    Notification Service (separate)
                    (Event streaming connection)
```

---

## 11. Disaster Recovery

- **Backup Strategy** : Daily snapshots PostgreSQL
- **Replication** : Multi-AZ RDS
- **Failover** : Automatic (< 5 min)
- **Monitoring** : Alerting on critical metrics
- **SLA** : 99.99% uptime target

---

## 12. Development Environments

```
Local Development
├─ Docker Compose (all services)
├─ .env.local with fake credentials
└─ localhost:3000

Dev Environment
├─ Same as production (smaller scale)
├─ Real databases
└─ Staging OAuth/Stripe keys

Production
├─ Multi-region deployment
├─ Managed services (RDS, ElastiCache)
└─ Production credentials (Vault)
```

---

**Dernière mise à jour** : 27 février 2026
