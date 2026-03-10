# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported |
|---|---|
| Latest `main` | ✅ Yes |
| Older releases | ❌ No |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security issue, please disclose it responsibly by sending an email to:

**security@resurgo.life**

Include as much of the following as possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Any suggested mitigations or fixes
- Whether you would like to be credited in the security advisory

### Response Timeline

| Milestone | Target |
|---|---|
| Initial acknowledgement | Within 48 hours |
| Triage & severity assessment | Within 5 business days |
| Fix or mitigation | Dependent on severity (critical: 7 days, high: 14 days, medium/low: 30 days) |
| Public advisory | After the fix is deployed |

---

## Security Design

### Authentication

- All user sessions are managed by [Clerk](https://clerk.dev), which provides industry-standard auth (OAuth, MFA, session management).
- API routes use `auth()` from `@clerk/nextjs/server` to verify sessions server-side.
- Convex functions call `ctx.auth.getUserIdentity()` to enforce authentication at the database layer.

### Data Access

- Every Convex query and mutation filters by `userId` using a database index — users cannot read or modify another user's data.
- Admin routes (`/admin/*`) perform an explicit admin-role check before serving data.

### Input Validation

- All Convex function arguments are validated with `v` validators at the framework level.
- User-generated HTML content is sanitised with [DOMPurify](https://github.com/cure53/DOMPurify) before rendering.

### API Security

- Server-side AI routes use environment variable keys that are never exposed to the client.
- Webhook endpoints verify signatures (Clerk `svix`, DodoPayments) before processing events.
- Rate limiting is applied to high-frequency endpoints via `src/lib/security.ts`.

### Dependencies

- We use `npm audit` in CI to detect known vulnerabilities in dependencies.
- Dependabot is configured to automatically open PRs for dependency updates.

---

## Acknowledgements

We are grateful to the security researchers who responsibly disclose vulnerabilities and help keep RESURGO secure.
