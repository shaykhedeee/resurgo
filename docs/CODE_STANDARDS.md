# Resurgo Code Quality & Professional Standards

**Version**: 1.1  
**Last Updated**: April 16, 2026

This document establishes the professional standards and best practices for the Resurgo codebase.

---

## Table of Contents

1. [Code Style Guide](#code-style-guide)
2. [API Standards](#api-standards)
3. [Error Handling](#error-handling)
4. [Logging Standards](#logging-standards)
5. [TypeScript Best Practices](#typescript-best-practices)
6. [Testing Requirements](#testing-requirements)
7. [Documentation Standards](#documentation-standards)
8. [Security Requirements](#security-requirements)

---

## Code Style Guide

### File Organization

```
src/
├── app/                    # Next.js app router
│   ├── (dashboard)/        # Protected routes
│   ├── api/                # API endpoints
│   ├── layout.tsx         # Root layout with providers
│   └── sitemap.ts         # SEO sitemap (auto-generated)
├── components/             # Reusable React components
│   ├── ui/                # Shadcn/ui components
│   └── features/          # Feature-specific components
├── lib/                    # Utilities and helpers
│   ├── api/               # API utilities (responses, handlers)
│   ├── ai/                # AI orchestration services
│   └── marketing/         # Marketing-related utilities
├── hooks/                 # Custom React hooks
├── middleware.ts          # Next.js middleware (Clerk auth)
└── types/                 # TypeScript types and interfaces
```

### Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| Components | `PascalCase` | `UserCard.tsx`, `TaskList.tsx` |
| Functions/Hooks | `camelCase` | `formatDate()`, `useNotifications()` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| Files (components) | `PascalCase` | `UserCard.tsx` |
| Files (utils/hooks) | `camelCase` | `formatters.ts`, `useAuth.ts` |
| Interfaces | `PascalCase` | `User`, `TaskResponse` |
| Type Variables (generic) | `T`, `U`, `K` | (standard TS convention) |

### Import Organization

```typescript
// 1. External packages
import { useState } from 'react';
import { NextResponse } from 'next/server';

// 2. Internal absolute imports
import { createLogger } from '@/lib/logger';
import { User } from '@/types/models';

// 3. Relative imports (avoid when possible)
import { helper } from '../utils/helper';

// 4. Side effects
import '@/styles/globals.css';
```

### Code Comment Style

```typescript
/**
 * Multi-line descriptions for functions and exports.
 * Supports JSDoc tags for IDE autocomplete.
 *
 * @param userId - The ID of the user to fetch
 * @returns User data or null if not found
 * @throws {NotFoundError} When user doesn't exist
 * 
 * @example
 * const user = await fetchUser('user_123');
 */
export async function fetchUser(userId: string): Promise<User | null> {
  // Single-line comments for inline logic
  if (!userId) {
    return null;
  }

  // ───────────────────────────────────────────────────────────────
  // Section separators for logical blocks
  // ───────────────────────────────────────────────────────────────
  return db.user.findById(userId);
}
```

---

## API Standards

### Response Envelope

All API responses MUST follow the standardized envelope (see `src/lib/api/responses.ts`):

```typescript
// Success
{
  success: true,
  data: { /* ... */ },
  timestamp: "2026-04-11T10:30:00Z",
  requestId: "1712834400000-abc123"
}

// Error
{
  success: false,
  error: {
    code: "INVALID_REQUEST",
    message: "User-friendly error message",
    details: { /* optional */ }
  },
  timestamp: "2026-04-11T10:30:00Z",
  requestId: "1712834400000-abc123"
}
```

### Endpoint Patterns

```
GET    /api/v1/{resource}           # List (paginated)
GET    /api/v1/{resource}/{id}      # Get single
POST   /api/v1/{resource}           # Create
PATCH  /api/v1/{resource}/{id}      # Update
DELETE /api/v1/{resource}/{id}      # Delete
POST   /api/v1/{resource}/{id}/action # Custom action
```

### Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful resource creation |
| 204 | No content (after DELETE) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid auth) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 429 | Rate limited |
| 500 | Internal server error |

---

## Error Handling

### DO ✅

```typescript
// Specific, descriptive error codes
throw new Error('PAYMENT_FAILED: Stripe charge declined');

// Structured error responses
return apiError('VALIDATION_ERROR', 'Email format invalid', 400, {
  field: 'email'
});

// Use appropriate HTTP status codes
if (!resource) {
  return apiNotFound('Task');
}

// Log with context
log.error('Payment processing failed', {
  userId,
  stripeError: error.message,
  action: 'charge'
});
```

### DON'T ❌

```typescript
// Generic errors
throw new Error('Error');

// Raw console.error in production code
console.error('Something failed');

// Exposing internal error details
return apiInternalError('Database connection lost on server db-5');

// Swallowing errors
try {
  await fetchData();
} catch (_) {
  // Silent failure
}
```

---

## Logging Standards

### Use `createLogger()` for server-side code

```typescript
import { createLogger } from '@/lib/logger';

const log = createLogger('Auth');  // Use feature name as tag

// Development: Logs all levels
// Production: Only warn/error
log.debug('User session started', { userId });
log.info('Payment received', { amount, currency });
log.warn('Retry attempt 2 of 3', { endpoint, status });
log.error('Authentication failed', { reason: 'invalid_token' });
```

### Client-side logging

For client-side components, use the error tracking system:

```typescript
import { captureError } from '@/lib/sentry';

try {
  await updateTask(taskId, data);
} catch (error) {
  captureError(error, {
    component: 'TaskEditor',
    action: 'update',
    taskId
  });
}
```

---

## TypeScript Best Practices

### NO `any` Types

```typescript
// ❌ DON'T
const data: any = response.json();
const element = queryElement as any;

// ✅ DO
interface ApiResponse {
  success: boolean;
  data: unknown;
}
const data: ApiResponse = await response.json();
const element = queryElement as HTMLElement;
```

### Use Const Assertions for Literals

```typescript
// ✅ Good
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];

// ✅ Also Good
const roles = ['admin', 'user', 'guest'] as const;
```

### Avoid Optional Chaining Abuse

```typescript
// ❌ Too many levels
user?.profile?.settings?.notifications?.email?.enabled

// ✅ Better
const emailNotificationEnabled = user?.profile?.settings?.notifications?.email?.enabled ?? false;
```

### Use Proper Type Guards

```typescript
// ❌ Poor
if (value) {
  // Unclear what 'value' must be
}

// ✅ Better
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' && 
    value !== null && 
    'id' in value && 
    'name' in value
  );
}

if (isUser(value)) {
  console.log(value.name);  // Safe, typed
}
```

---

## Testing Requirements

### Test Coverage Targets

- **Critical paths** (auth, payments, data sync): 90%+
- **API routes**: 80%+
- **Utilities**: 70%+

### Test Naming

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', () => {
      // Arrange, Act, Assert (AAA pattern)
    });

    it('should throw ValidationError when email is invalid', () => {
      // ...
    });

    it('should return user with isVerified = false initially', () => {
      // ...
    });
  });
});
```

### Run Tests Before Committing

```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode (development)
npm run test:coverage  # Generate coverage report
```

---

## Documentation Standards

### Component Documentation

```typescript
/**
 * Card component for displaying task information.
 * 
 * Features:
 * - Click-to-edit title
 * - Priority badge
 * - Due date display
 * - Keyboard navigation
 * 
 * @component
 * @example
 * return (
 *   <TaskCard task={task} onUpdate={handleUpdate} />
 * )
 * 
 * @param props - Component props
 * @param props.task - The task object to display
 * @param props.onUpdate - Callback when task is modified
 * @returns Rendered task card component
 */
export function TaskCard({ task, onUpdate }: TaskCardProps) {
  // ...
}
```

### Function Documentation Template

```typescript
/**
 * Brief description of what the function does.
 * 
 * More detailed explanation if needed, including:
 * - What it accepts
 * - What it returns
 * - When it might fail
 * 
 * @param arg1 - Description of arg1
 * @param arg2 - Description of arg2
 * @returns Description of return value
 * @throws {ErrorType} When specific condition occurs
 * 
 * @example
 * const result = myFunction(value1, value2);
 * console.log(result);
 */
export function myFunction(arg1: string, arg2: number): boolean {
  // ...
}
```

### README.md Standards

Every folder should have a clear README if it contains complex logic:

```markdown
# Module Name

**Purpose**: One-line description

## Usage

```typescript
// Quick example
```

## Structure

- `file1.ts` - What it does
- `file2.ts` - What it does

## Related Modules

- Link to related modules
```

---

## Security Requirements

### Environment Variables

- [x] Never commit `.env` or `.env.local` files
- [x] Never log secret values (API keys, tokens, etc.)
- [x] Use structured validation (see `src/lib/env.ts`)
- [x] Rotate secrets regularly

### API Security

```typescript
// ✅ Validate input
const { email } = z.object({
  email: z.string().email()
}).parse(req.body);

// ✅ Use constant-time comparison for secrets
const isValid = crypto.timingSafeEqual(
  Buffer.from(token),
  Buffer.from(expectedToken)
);

// ✅ Sanitize output
response.data = sanitizeHtml(userContent);

// ✅ Use HTTPS only
if (process.env.NODE_ENV === 'production' && !isHttps) {
  return apiError('HTTPS_REQUIRED', '...', 400);
}
```

### Data Privacy

- [x] Hash passwords with bcrypt/argon2
- [x] Never store sensitive data unencrypted
- [x] Implement data retention policies
- [x] Log access to sensitive data for audit

---

## Pre-Launch Checklist

- [ ] All `console.log` calls are from AI logging, not debugging
- [ ] No `as any` or `@ts-ignore` without justification
- [ ] All API endpoints return standardized response envelope
- [ ] Error messages are user-friendly (no stack traces in production)
- [ ] Environment variables are validated at startup
- [ ] Test coverage is above minimum targets
- [ ] Documentation is up-to-date
- [ ] Lighthouse audit score is 90+
- [ ] No security vulnerabilities detected
- [ ] Performance metrics meet targets (FCP < 1.2s, LCP < 2.5s)

---

## Enforcement

These standards are enforced through:

- **Linting**: `npm run lint` (ESLint + Prettier)
- **Type Checking**: `npm run typecheck` (TypeScript)
- **Tests**: `npm run test` (Jest)
- **Build Validation**: `npm run build` runs all checks
- **PR Reviews**: Manual review before merge

---

## Questions or Suggestions?

Update this document and create a PR with your improvements.
