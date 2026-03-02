# Kyndex - Plateforme d'Échange de Compétences

## 🎯 Vue d'Ensemble

Kyndex est une **plateforme marketplace peer-to-peer décentralisée** permettant aux utilisateurs d'échanger des compétences, des services et des connaissances.

### Concept Principal
- **Skill Matching** : Connexion automatique entre utilisateurs offrant et cherchant des compétences similaires
- **Réputation** : Système de notation et badges
- **Transactions** : Paiements et crédits internes
- **Conversations** : Messaging temps réel
- **IA** : Profiling, matching, modération automatiques

---

## 📁 Structure du Projet

```
kyndex/
├── backend/
│   ├── services/
│   │   ├── auth-service/
│   │   ├── user-service/
│   │   ├── skills-service/
│   │   ├── matching-service/
│   │   ├── messaging-service/
│   │   ├── transaction-service/
│   │   ├── reputation-service/
│   │   ├── ai-service/
│   │   ├── notification-service/
│   │   └── admin-service/
│   ├── shared/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── decorators/
│   │   └── middleware/
│   ├── infra/
│   │   ├── docker/
│   │   ├── terraform/
│   │   └── k8s/
│   └── tests/
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── matching/
│   │   ├── messaging/
│   │   └── transactions/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   └── layouts/
│   ├── lib/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── styles/
├── mobile/
│   ├── android/
│   └── ios/
├── docs/
│   ├── api/
│   ├── architecture/
│   └── guides/
└── .github/
    └── workflows/
```

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+
- Git

### Installation Backend
```bash
cd backend
npm install
# Configuration .env
npm run dev
```

### Installation Frontend
```bash
cd frontend
npm install
npm run dev
```

### Avec Docker
```bash
docker-compose up -d
```

---

## 📋 Phases de Développement

### Phase 1 : MVP (3-4 mois)
✅ Authentification + Profiles
✅ Skills & Matching basique
✅ Messaging temps réel
✅ Transactions simples
✅ Système réputation

### Phase 2 : Microservices (2 mois)
- Découpage services
- Event streaming
- AI advanced features

### Phase 3 : Global Scale (3 mois)
- Multi-région
- CDN global
- Performance optimization

### Phase 4 : Public API (2 mois)
- API marketplace publique
- Partner integrations

---

## 🔐 Sécurité

- JWT + OAuth2
- 2FA TOTP
- Rate limiting
- RBAC
- Audit logs
- RGPD compliant

---

## 📊 Métriques & Monitoring

- **Uptime Target** : 99.99%
- **API Latency** : < 200ms (p95)
- **Logging** : Structured logs (Pino)
- **Monitoring** : Prometheus + Grafana
- **Tracing** : OpenTelemetry

---

## 🛠️ Stack Technique

### Backend
- **Runtime** : Node.js
- **Framework** : NestJS
- **ORM** : Prisma
- **Real-time** : Socket.io
- **Queue** : BullMQ
- **Search** : Elasticsearch

### Frontend
- **Framework** : Next.js 14+
- **Style** : Tailwind CSS + shadcn/ui
- **State** : Zustand
- **Forms** : React Hook Form
- **i18n** : next-i18n-router

### Data
- **Database** : PostgreSQL
- **Cache** : Redis
- **Search** : Elasticsearch/PostgreSQL FTS

### Infrastructure
- **Container** : Docker
- **Orchestration** : Kubernetes (future)
- **IaC** : Terraform
- **CI/CD** : GitHub Actions
- **Deployment** : Vercel (frontend) + AWS/GCP (backend)

---

## 📚 Documentation

- [Technical Specification](TECHNICAL_SPEC.md)
- [Architecture Details](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

---

## 👥 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 Licence

MIT License - Voir [LICENSE](./LICENSE)

---

## 📞 Contact

- **Team Lead** : [contact@kyndex.com](mailto:contact@kyndex.com)
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

---

**Version** : 1.0.0  
**Mise à jour** : 27 février 2026
