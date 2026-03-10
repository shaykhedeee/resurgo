# Contributing to RESURGO

Thank you for your interest in contributing to RESURGO! 🚀  
This guide explains how to get your changes merged as smoothly as possible.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Branch & Commit Conventions](#branch--commit-conventions)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing](#testing)
8. [Reporting Bugs](#reporting-bugs)
9. [Requesting Features](#requesting-features)

---

## Code of Conduct

By participating in this project you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## How to Contribute

1. **Fork** the repository and create a branch from `main`.
2. **Write your changes** — keep them focused and small.
3. **Add or update tests** for the changed behaviour.
4. **Ensure the full CI check passes** locally (`npm run verify:deploy`).
5. **Submit a Pull Request** — fill in the template completely.

For major features or architectural changes, please **open an issue first** to discuss the idea before writing code.

---

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- A free [Convex](https://convex.dev) account
- A free [Clerk](https://clerk.dev) account

### Local Setup

```bash
# 1. Fork & clone
git clone https://github.com/<your-username>/resurgo.git
cd resurgo

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Fill in at minimum: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
# CONVEX_DEPLOYMENT, NEXT_PUBLIC_CONVEX_URL

# 4. Start development servers
npm run dev
```

---

## Branch & Commit Conventions

### Branch Names

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/vision-board-sharing` |
| Bug fix | `fix/<short-description>` | `fix/habit-streak-reset` |
| Refactor | `refactor/<short-description>` | `refactor/goal-query-performance` |
| Documentation | `docs/<short-description>` | `docs/contributing-guide` |
| Chore | `chore/<short-description>` | `chore/update-dependencies` |

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

**Examples:**

```
feat(goals): add bulk archive action for goal list
fix(habits): prevent streak counter from resetting on timezone change
perf(convex): eliminate N+1 query in restoreArchivedOnUpgrade
docs(readme): update deployment instructions for Next.js 16
```

---

## Pull Request Process

1. **Fill in the PR template** completely — incomplete PRs will be asked to resubmit.
2. **Link related issues** using `Closes #123` in the PR description.
3. **Keep PRs small and focused** — one logical change per PR.
4. **All CI checks must pass** before review.
5. **Request review** from a maintainer once CI is green.
6. A maintainer will merge after one approval.

---

## Coding Standards

### TypeScript

- **Strict mode** is enabled — avoid `any` types.
- Use `Id<'tableName'>` (from `convex/_generated/dataModel`) for Convex document IDs.
- Prefer named exports over default exports in `convex/` files.
- Add argument and return validators to **all** Convex functions.

### Convex Functions

- Use `internalQuery` / `internalMutation` / `internalAction` for private helpers.
- **Avoid N+1 queries** — fetch aggregates once before a loop, not inside it.
- Do not use `filter` on queries; define an index and use `withIndex`.
- Use `ctx.db.patch` for partial updates and `ctx.db.replace` for full replacement.

### React / Next.js

- Prefer Server Components for data-fetching pages; use `"use client"` only where interactivity is required.
- Keep components in `src/components/` small and single-purpose.
- Use the `cn()` utility from `src/lib/utils.ts` for conditional class names.

### Styling

- Use Tailwind utility classes — avoid inline `style` props.
- Follow the existing colour token convention (`text-foreground`, `bg-card`, etc.).

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

- New features should include at least a smoke test.
- Bug fixes should include a regression test that fails before the fix and passes after.
- Keep tests co-located with source: `src/lib/foo.test.ts` tests `src/lib/foo.ts`.

---

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) issue template.

Please include:
- Steps to reproduce
- Expected behaviour
- Actual behaviour
- Browser / OS / device
- Relevant console errors or screenshots

---

## Requesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) issue template.

Please include:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

Thank you for making RESURGO better! 🙏
