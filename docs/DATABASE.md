# Database Schema - Kyndex

## Overview
- **Primary Database** : PostgreSQL 14+
- **ORM** : Prisma
- **Timezone** : UTC
- **Character Set** : UTF-8

---

## Entity Relationship Diagram (ERD)

```
                          ┌─────────────────┐
                          │      User       │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ email (UNIQUE)  │
                          │ passwordHash    │
                          │ role            │
                          │ status          │
                          │ createdAt       │
                          │ updatedAt       │
                          └────────┬────────┘
                                   │ 1:1
                          ┌────────▼────────┐
                          │    Profile      │
                          ├─────────────────┤
                          │ userId (FK)     │
                          │ bio             │
                          │ location        │
                          │ avatar          │
                          │ languages       │
                          │ availability    │
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │ 1:N                      │ 1:N                      │ 1:N
        │                          │                          │
        ▼                          ▼                          ▼
   ┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐
   │ UserSkill   │    │  Conversation    │    │    Review        │
   ├─────────────┤    ├──────────────────┤    ├──────────────────┤
   │ id (PK)     │    │ id (PK)          │    │ id (PK)          │
   │ userId (FK) │    │ createdAt        │    │ fromUserId (FK)  │
   │ skillId (FK)│    │ updatedAt        │    │ toUserId (FK)    │
   │ type        │    │ lastMessageId(FK)│    │ rating           │
   │ level       │    │ isActive         │    │ comment          │
   │             │    │                  │    │ category         │
   └──────┬──────┘    └────────┬─────────┘    │ createdAt        │
   │                          │ 1:N           └──────────────────┘
   │                          │
   │                    ┌─────▼──────┐
   │ M:N            │   Message    │
   │            │ id (PK)      │
   │            │ convoId (FK) │
   │            │ senderId(FK) │
   │            │ content      │
   │            │ createdAt    │
   │            │ updatedAt    │
   │            └──────────────┘
   │
   └──────────────────▶ ┌──────────────┐
                       │   Skill      │
                       ├──────────────┤
                       │ id (PK)      │
                       │ name         │
                       │ category     │
                       │ icon         │
                       │ createdAt    │
                       └──────────────┘

                       ┌──────────────┐
                       │ Transaction  │
                       ├──────────────┤
                       │ id (PK)      │
                       │ fromId (FK)  │
                       │ toId (FK)    │
                       │ type         │
                       │ amount       │
                       │ status       │
                       │ currency     │
                       │ createdAt    │
                       │ completedAt  │
                       └──────────────┘

                       ┌──────────────┐
                       │CreditWallet  │
                       ├──────────────┤
                       │ id (PK)      │
                       │ userId (FK)  │
                       │ balance      │
                       │ lastUpdated  │
                       └──────────────┘
```

---

## Prisma Schema (prisma/schema.prisma)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ CORE MODELS ============

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(USER)
  status        UserStatus @default(ACTIVE)
  
  // Relations
  profile       Profile?
  offeredSkills UserSkill[] @relation("offered")
  wantedSkills  UserSkill[] @relation("wanted")
  
  sentMessages    Message[] @relation("sent")
  receivedMessages Message[] @relation("received")
  
  initiatedConversations Conversation[] @relation("initiator")
  conversationParticipants ConversationParticipant[]
  
  sentReviews    Review[] @relation("from")
  receivedReviews Review[] @relation("to")
  
  sentTransactions    Transaction[] @relation("from")
  receivedTransactions Transaction[] @relation("to")
  
  creditWallet  CreditWallet?
  transactionLedger TransactionLedger[]
  
  reports       Report[] @relation("reported")
  reportedBy    Report[] @relation("reporter")
  
  auditLogs     AuditLog[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([email])
  @@index([status])
  @@index([createdAt])
}

enum Role {
  USER
  ADMIN
  ORGANIZATION
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  BANNED
}

model Profile {
  id            String    @id @default(uuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  bio           String?   @db.Text
  location      String?
  avatar        String?
  languages     String[]  @default(["en"])
  availability  String    @default("flexible") // flexible, weekends, evenings
  timezone      String    @default("UTC")
  reputationScore Float   @default(0) @db.Decimal(3, 2) // 0-5
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([location])
}

// ============ SKILLS MODELS ============

model Skill {
  id            String    @id @default(uuid())
  name          String    @unique
  category      String    // programming, design, marketing, etc.
  subcategory   String?
  description   String?   @db.Text
  icon          String?
  
  userSkills    UserSkill[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([category])
  @@index([name])
  @@fulltext([name, description]) // For full-text search
}

model UserSkill {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation("offered", fields: [userId], references: [id], onDelete: Cascade)
  
  skillId       String
  skill         Skill     @relation(fields: [skillId], references: [id], onDelete: Cascade)
  
  type          SkillType // offered, wanted
  level         Int       @db.SmallInt // 1-5
  endorsements  Int       @default(0)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([userId, skillId, type])
  @@index([userId, type])
  @@index([skillId])
}

enum SkillType {
  OFFERED
  WANTED
}

// ============ MESSAGING MODELS ============

model Conversation {
  id            String    @id @default(uuid())
  
  participants  ConversationParticipant[]
  messages      Message[]
  
  lastMessageId String?
  lastMessage   Message?  @relation("last_message", fields: [lastMessageId], references: [id])
  
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([createdAt])
}

model ConversationParticipant {
  id              String    @id @default(uuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  joinedAt        DateTime  @default(now())
  leftAt          DateTime?
  lastReadAt      DateTime?

  @@unique([conversationId, userId])
  @@index([userId])
}

model Message {
  id              String    @id @default(uuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  senderId        String
  sender          User      @relation("sent", fields: [senderId], references: [id])
  
  content         String    @db.Text
  attachments     Attachment[]
  
  isEdited        Boolean   @default(false)
  editedAt        DateTime?
  
  // For marking as last message in conversation
  isLastInConversation Conversation? @relation("last_message")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt])
}

model Attachment {
  id              String    @id @default(uuid())
  messageId       String
  message         Message   @relation(fields: [messageId], references: [id], onDelete: Cascade)
  
  url             String
  type            String    // image, file, link
  name            String
  size            Int
  
  createdAt       DateTime  @default(now())
}

// ============ TRANSACTION MODELS ============

model Transaction {
  id              String    @id @default(uuid())
  
  fromUserId      String
  fromUser        User      @relation("from", fields: [fromUserId], references: [id])
  
  toUserId        String
  toUser          User      @relation("to", fields: [toUserId], references: [id])
  
  type            TransactionType // money, credits, hybrid
  amount          Decimal   @db.Decimal(10, 2)
  currency        String    @default("EUR")
  
  status          TransactionStatus @default(PENDING)
  
  stripePaymentId String?   @unique
  description     String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  completedAt     DateTime?

  ledgerEntries   TransactionLedger[]

  @@index([fromUserId])
  @@index([toUserId])
  @@index([status])
  @@index([createdAt])
}

enum TransactionType {
  MONEY        // Stripe payment
  CREDITS      // Internal credits
  HYBRID       // Mix of both
}

enum TransactionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

model CreditWallet {
  id              String    @id @default(uuid())
  
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  balance         Decimal   @default(0) @db.Decimal(10, 2)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId])
}

model TransactionLedger {
  id              String    @id @default(uuid())
  
  transactionId   String
  transaction     Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  type            String    // DEBIT, CREDIT
  amount          Decimal   @db.Decimal(10, 2)
  
  description     String?
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([transactionId])
  @@index([createdAt])
}

// ============ REPUTATION MODELS ============

model Review {
  id              String    @id @default(uuid())
  
  fromUserId      String
  fromUser        User      @relation("from", fields: [fromUserId], references: [id], onDelete: Cascade)
  
  toUserId        String
  toUser          User      @relation("to", fields: [toUserId], references: [id], onDelete: Cascade)
  
  rating          Int       @db.SmallInt // 1-5
  comment         String?   @db.Text
  category        String    @default("general") // communication, reliability, quality, etc.
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([fromUserId, toUserId, category])
  @@index([toUserId])
  @@index([createdAt])
}

// ============ MODERATION MODELS ============

model Report {
  id              String    @id @default(uuid())
  
  reportedUserId  String
  reportedUser    User      @relation("reported", fields: [reportedUserId], references: [id])
  
  reportedByUserId String
  reportedByUser  User      @relation("reporter", fields: [reportedByUserId], references: [id])
  
  reason          ReportReason
  description     String?   @db.Text
  
  status          ReportStatus @default(PENDING)
  resolution      String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  resolvedAt      DateTime?

  @@index([reportedUserId])
  @@index([status])
}

enum ReportReason {
  INAPPROPRIATE_CONTENT
  HARASSMENT
  FRAUD
  SCAM
  FAKE_PROFILE
  SPAM
  OTHER
}

enum ReportStatus {
  PENDING
  INVESTIGATING
  RESOLVED
  DISMISSED
}

// ============ AUDIT & LOGS ============

model AuditLog {
  id              String    @id @default(uuid())
  
  userId          String?
  user            User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action          String    // USER_LOGIN, USER_CREATED, TRANSACTION_COMPLETED, etc.
  tableName       String?   // Table affected
  recordId        String?   // Record ID affected
  changes         Json?     // Before/after values
  
  ipAddress       String?
  userAgent       String?
  
  createdAt       DateTime  @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

// ============ MATCHING CACHE ============

model MatchingResult {
  id              String    @id @default(uuid())
  
  userId          String
  matchedUserId   String
  
  matchScore      Float     @db.Decimal(3, 2)
  matchReason     String
  
  commonSkills    String[]  @default([])
  algorithmVersion String  @default("v1")
  
  createdAt       DateTime  @default(now())
  expiresAt       DateTime  // Cache expiration TTL

  @@unique([userId, matchedUserId])
  @@index([userId])
  @@index([expiresAt])
}
```

---

## Indexes Strategy

| Table | Index | Benefit |
|-------|-------|---------|
| User | email | Fast authentication |
| User | status | Filter active users |
| Profile | location | Geo-based filtering |
| Skill | category | Category browsing |
| UserSkill | userId, type | Quick skill queries |
| Conversation | createdAt | Timeline queries |
| Message | conversationId, createdAt | Message history |
| Transaction | status, createdAt | Filtering/sorting |
| Review | toUserId | Reputation calculation |

---

## Full-Text Search Indexes

```sql
-- Skill full-text search
CREATE INDEX skill_name_desc_idx ON "Skill" 
USING gin(to_tsvector('english', "name" || ' ' || COALESCE("description", '')));

-- Message content search
CREATE INDEX message_content_idx ON "Message" 
USING gin(to_tsvector('english', "content"));
```

---

## Database Migrations (Prisma)

```bash
# Create migration after schema changes
npx prisma migrate dev --name add_new_field

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

---

## Backup Strategy

- **Daily Snapshots** : AWS RDS automated backups (7 days retention)
- **Weekly exports** : Full database dumps to S3
- **Point-in-time recovery** : 30 days retention

---

## Performance Considerations

1. **Partitioning** : Consider partition by date for Message and TransactionLedger tables (Phase 3)
2. **Archival** : Move old messages/logs to archiveDB (> 1 year)
3. **Read Replicas** : Add read replicas for heavy queries (Phase 2)
4. **Query Optimization** : Monitor slow queries with pg_stat_statements

---

**Dernière mise à jour** : 27 février 2026
