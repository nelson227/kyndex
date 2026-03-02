# Contributing to Kyndex

## 🤝 How to Contribute

We welcome contributions to Kyndex! Whether it's bug reports, feature requests, or code contributions, your help is appreciated.

---

## 📋 Before You Start

1. **Read the Technical Specification** : [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md)
2. **Check existing issues** : Avoid duplicates
3. **Setup development environment** : Follow [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 🐛 Reporting Bugs

### Create an Issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)
- Environment details

**Example:**
```
Title: Login fails with special characters in password

Steps:
1. Go to registration page
2. Enter password with @ symbol: "Test@123"
3. Click Register
4. Try to login

Expected: Login succeeds
Actual: "Invalid password" error

Environment: Windows 11, Chrome 120
```

---

## ✨ Suggesting Features

### Feature Request Template
- **Use case** : What problem does it solve?
- **Proposed solution** : How would it work?
- **Alternatives** : Other approaches considered?
- **Impact** : Which users/modules affected?

---

## 💻 Code Contributions

### 1. Fork & Clone
```bash
git clone https://github.com/your-username/kyndex.git
cd kyndex
git remote add upstream https://github.com/kyndex/kyndex.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/add-matching-filters
# or for bugfix:
git checkout -b fix/messaging-timestamp-issue
```

**Branch naming convention:**
- `feature/description` : New features
- `fix/description` : Bug fixes
- `refactor/description` : Code improvements
- `docs/description` : Documentation updates

### 3. Make Your Changes

#### Code Style
- Follow the conventions in [DEVELOPMENT.md](./DEVELOPMENT.md)
- Run linter: `npm run lint`
- Format code: `npm run format`
- Run tests: `npm run test`

#### Commit Messages
Use conventional commits:
```
feat: add skill filter to matching results
fix: correct timezone conversion in transaction dates
refactor: simplify user profile validation
docs: update API documentation
test: add tests for credit transfer service

BREAKING CHANGE: removed deprecated /api/v1/auth endpoint
```

Format: `<type>(<scope>): <subject>`
- `feat` : New feature
- `fix` : Bug fix
- `refactor` : Code refactoring
- `docs` : Documentation
- `test` : Test files
- `chore` : Build/dependencies
- `perf` : Performance improvements

### 4. Before Pushing: Verify

```bash
# Run all checks
npm run lint          # Check code style
npm run format        # Auto-format code
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests

# Run database migrations (if needed)
npm run db:migrate:dev

# Build project
npm run build
```

### 5. Push & Create Pull Request

```bash
git push origin feature/add-matching-filters
```

**Go to GitHub and create a Pull Request with:**

#### PR Title
Descriptive title following conventional commits:
```
feat: add skill filter to matching recommendations
```

#### PR Description
```markdown
## Description
Add ability to filter matching recommendations by specific skills.

## Related Issue
Fixes #123

## Changes
- Add SkillFilterDto
- Update MatchingService.findMatches() with filter logic
- Add skill filter input to frontend

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots
[Add if UI changes]

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] No breaking changes (or documented)
```

---

## 📦 Project Structure for Contributors

```
Your contribution affects:
├── Backend service? → Follow backend conventions
├── Frontend component? → Follow React conventions
├── Database schema? → Update schema.prisma + migrations
├── API endpoint? → Document in API.md + add tests
└── Configuration? → Update .env.example
```

---

## 🔄 Code Review Process

1. **Automated Checks** : Tests, linting, security scans
2. **Peer Review** : At least 1 maintainer review
3. **Changes Requested** : Address feedback
4. **Approval** : PR merged after approval

---

## 📝 Documentation

### When to Update Docs

| Change | Documentation |
|--------|---------------|
| New API endpoint | [API.md](./API.md) |
| Database change | [DATABASE.md](./DATABASE.md) |
| Architecture change | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Development tip | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| New service | [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md) |

### Comment Guidelines

```typescript
// ✅ Good: Explains WHY, not WHAT
// We use Redis here for caching because matching
// results are expensive to compute and reused frequently
const cachedResult = await redisClient.get(cacheKey);

// ❌ Bad: Obvious from code
// Get cache result
const cachedResult = await redisClient.get(cacheKey);

// ✅ Good: Complex logic documented
// Score calculation uses weighted formula:
// score = (skillMatch * 0.5) + (location * 0.3) + (reputation * 0.2)
// This weighting prioritizes skill compatibility over geography
const score = calculateMatchScore(user1, user2);
```

---

## 🧪 Testing Requirements

### Unit Tests
```typescript
// Write tests for new services/utilities
describe('MatchingService', () => {
  it('should calculate correct match score', async () => {
    expect(calculateScore(...)).toBe(0.87);
  });

  it('should handle edge cases', () => {
    expect(calculateScore({}, {})).toBe(0);
  });
});
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### Coverage Requirements
- Aim for **80%+ code coverage**
- All public APIs must have tests
- Critical business logic **100% coverage**

---

## 🔐 Security Considerations

- **No secrets in code** : Use environment variables
- **Validate all inputs** : Use Zod/class-validator
- **Avoid SQL injection** : Use ORM (Prisma)
- **Hash passwords** : Never store plain text
- **Rate limiting** : Implement for public APIs
- **HTTPS only** : All external communications

---

## 🚀 Performance Best Practices

```typescript
// ✅ DO: Use indexes for queries
await prisma.user.findMany({
  where: { location: 'Paris' } // Has index
});

// ✅ DO: Paginate results
take: 20,
skip: (page - 1) * 20,

// ✅ DO: Select only needed fields
select: { id: true, name: true }

// ❌ DON'T: N+1 queries
for (const user of users) {
  const skills = await getSkills(user.id); // Inefficient loop
}

// ✅ DO: Batch with include/select
include: { skills: true }
```

---

## 📚 Resources

- **TypeScript** : https://www.typescriptlang.org/docs/
- **NestJS** : https://docs.nestjs.com/
- **Next.js** : https://nextjs.org/docs
- **Prisma** : https://www.prisma.io/docs/
- **PostgreSQL** : https://www.postgresql.org/docs/

---

## 🙏 Code of Conduct

### Our Pledge
Be respectful, inclusive, and professional in all interactions.

### Expected Behavior
- Be helpful and collaborative
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy and kindness

### Unacceptable Behavior
- Harassment, discrimination
- Disrespectful comments
- Personal attacks
- Spam

---

## 📞 Questions?

- **Discussions** : Start a GitHub Discussion
- **Issues** : Ask in existing related issue
- **Slack** : #contributors channel (if available)

---

## ✅ Contributor Checklist

Before submitting a PR:

```
Code
- [ ] Follows project style guide
- [ ] Lints successfully
- [ ] No console.log() statements
- [ ] No `any` types (unless justified comment)
- [ ] Error handling implemented
- [ ] Input validation added

Testing
- [ ] Unit tests added/updated
- [ ] Tests pass locally
- [ ] E2E tests updated (if needed)
- [ ] Code coverage maintained

Documentation
- [ ] Code comments added (complex logic)
- [ ] README/docs updated
- [ ] API docs updated (if breaking changes)
- [ ] .env.example updated

Security
- [ ] No secrets committed
- [ ] Inputs validated
- [ ] No SQL injection risks
- [ ] Authorization checks added

Performance
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Appropriate caching added
```

---

thank you for contributing! 🙌

**Last updated:** 27 février 2026
