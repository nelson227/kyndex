# Development Guide - Kyndex

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+
- Git

### Local Setup

```bash
# Clone repository
git clone https://github.com/kyndex/kyndex.git
cd kyndex

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start services with Docker
docker-compose up -d

# Run database migrations
npm run db:migrate:dev

# Start development servers
npm run dev
```

---

## 📚 Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root NestJS module
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── google.strategy.ts
│   │   │   │   └── github.strategy.ts
│   │   │   └── guards/
│   │   │       ├── jwt.guard.ts
│   │   │       └── roles.guard.ts
│   │   └── [other modules...]
│   ├── common/
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   └── types/
│   ├── config/
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   └── utils/
├── test/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker/
├── .env.example
├── .eslintrc.json
├── tsconfig.json
├── jest.config.js
└── package.json
```

### Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   │   ├── [id]/
│   │   │   └── edit/
│   │   ├── matching/
│   │   ├── messaging/
│   │   └── transactions/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   ├── layouts/
│   └── ui/
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useSkills.ts
│   │       ├── useMatching.ts
│   │       └── ...
│   ├── utils/
│   └── constants/
├── styles/
├── public/
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Code Conventions

### TypeScript

#### Naming Conventions
```typescript
// Classes: PascalCase
class UserService { }

// Interfaces: PascalCase with I prefix (optional)
interface IUserService { }
type UserProfile = { ... }  // Prefer type over interface

// Functions & methods: camelCase
function getUserById(id: string) { }

// Constants: UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 20;
const MAX_RETRIES = 3;

// Variables: camelCase
let currentUser: User;

// Private properties: camelCase with underscore
private _cache: Map<string, any>;
```

#### Type Annotations
```typescript
// Always use explicit return types
function calculateMatche Score(userId: string): number {
  return 0.85;
}

// Always annotate parameters
async function fetchUser(id: string): Promise<User> {
  return { ... };
}

// Use const assertions for immutable values
const config = {
  apiUrl: 'https://api.kyndex.com',
  maxRetries: 3
} as const;
```

### NestJS Backend Conventions

#### Module Structure
```typescript
// skills.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill, UserSkill } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, UserSkill])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService], // Only export services
})
export class SkillsModule {}
```

#### Service Pattern
```typescript
// skills.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/database/prisma.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateSkillDto): Promise<Skill> {
    return this.db.skill.create({
      data: dto,
    });
  }

  async findOneById(id: string): Promise<Skill | null> {
    return this.db.skill.findUnique({
      where: { id },
    });
  }

  async search(query: string): Promise<Skill[]> {
    return this.db.skill.findMany({
      where: {
        name: { search: query }
      }
    });
  }
}
```

#### Controller Pattern
```typescript
// skills.controller.ts
import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Public } from '@app/common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new skill' })
  async create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List skills' })
  async findAll(
    @Query() query: ListSkillsQueryDto,
  ) {
    return this.skillsService.findMany(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.skillsService.findOneById(id);
  }
}
```

#### DTO Pattern
```typescript
// dto/create-skill.dto.ts
import { IsString, IsEnum, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEnum(['programming', 'design', 'marketing', 'other'])
  category: string;

  @IsString()
  description?: string;
}
```

### React Frontend Conventions

#### Component Structure
```typescript
// components/UserCard.tsx
import { FC } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';

interface UserCardProps {
  user: UserProfile;
  onSelect?: (userId: string) => void;
}

export const UserCard: FC<UserCardProps> = ({ user, onSelect }) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition">
      <h3 className="font-bold">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.location}</p>
      <Link href={`/profile/${user.id}`}>
        View Profile
      </Link>
    </div>
  );
};
```

#### Hook Pattern
```typescript
// lib/hooks/useMatching.ts
import { useCallback, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import type { MatchResult } from '@/lib/types';

export function useMatching() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatches = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const data = await apiClient.get(`/matching/recommendations?userId=${userId}`);
      setResults(data.matches);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, fetchMatches };
}
```

---

## 🔒 Security Guidelines

### Authentication & Authorization
```typescript
// Always use JWT guards on protected routes
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard) // Protect route
  async getCurrentUser(@Request() req) {
    return req.user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Role-based protection
  async deleteUser(@Param('id') id: string) {
    // Admin only
  }
}
```

### Input Validation
```typescript
// Always validate user input with pipes
@Post()
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
async create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

### Password Hashing
```typescript
import * as bcrypt from 'bcrypt';

// Never store plain passwords
async hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Always verify with bcrypt
async validatePassword(plainPassword: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashed);
}
```

---

## 📝 Database Operations

### Prisma Best Practices

```typescript
// ✅ DO: Use transactions for critical operations
const result = await prisma.$transaction(async (tx) => {
  const transaction = await tx.transaction.create({
    data: { ... }
  });
  
  await tx.creditWallet.update({
    where: { userId: toUserId },
    data: { balance: { increment: amount } }
  });
  
  return transaction;
});

// ❌ DON'T: Make separate calls (risk race condition)
await prisma.transaction.create({ data: {...} });
await prisma.creditWallet.update({ ... });

// ✅ DO: Optimize queries with select
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    profile: true,
    offeredSkills: {
      include: { skill: true }
    }
  }
});

// ❌ DON'T: Fetch entire user
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { _all: true } // Inefficient
});
```

---

## 🧪 Testing

### Unit Testing (Jest)

```typescript
// skills.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PrismaService } from '@app/common/database/prisma.service';

describe('SkillsService', () => {
  let service: SkillsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: {
            skill: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a skill', async () => {
    const newSkill = { id: '1', name: 'Python', category: 'programming' };
    jest.spyOn(prisma.skill, 'create').mockResolvedValue(newSkill);

    expect(await service.create({ name: 'Python', category: 'programming' }))
      .toEqual(newSkill);
  });
});
```

### E2E Testing

```bash
# Run E2E tests
npm run test:e2e

# With specific test file
npm run test:e2e -- matching.e2e-spec.ts
```

---

## 📊 Logging

### Structured Logging (Pino)

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  async doSomething() {
    this.logger.log('Starting operation', { userId: '123' });
    this.logger.warn('Operation took long time', { duration: 5000 });
    this.logger.error('Operation failed', new Error('Some error'), { retries: 3 });
  }
}
```

### Log Levels
- `error` : Critical issues (exceptions)
- `warn` : Potential issues
- `log` : General information
- `debug` : Detailed debugging

---

## 🚀 Deployment

### Docker Build

```bash
# Build Docker image
docker build -f docker/Dockerfile -t kyndex-api:latest .

# Run container
docker run -p 3000:3000 --env-file .env.prod kyndex-api:latest
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Deployment script
```

---

## 📋 Checklist Before PR

- [ ] Code lints successfully (`npm run lint`)
- [ ] All tests pass (`npm run test`)
- [ ] Database migrations run successfully
- [ ] No console.log() in code (use logger)
- [ ] Types are correct (no `any` unless justified)
- [ ] Environment variables documented in .env.example
- [ ] API endpoints documented with Swagger
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] No secrets committed

---

## 🐛 Debugging

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/main.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["--nolazy"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Common Debugging Tips

```typescript
// Add debug logs with structured data
this.logger.debug('Matching result', {
  userId: '123',
  matchScore: 0.87,
  processingTime: '245ms'
});

// Use try/catch with proper error logging
try {
  await this.matchingService.findMatches(userId);
} catch (error) {
  this.logger.error('Matching failed', error, {
    userId,
    timestamp: new Date().toISOString()
  });
  throw error;
}
```

---

## 📞 Getting Help

- **Issues** : GitHub Issues for bugs/features
- **Discussions** : GitHub Discussions for questions
- **Docs** : [Technical Spec](../TECHNICAL_SPEC.md)
- **Slack** : #dev-help channel

---

**Version** : 1.0.0  
**Mise à jour** : 27 février 2026
