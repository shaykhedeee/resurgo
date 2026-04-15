# Resurgo API Documentation

**Last Updated**: April 2026  
**API Version**: v1.0  
**Base URL**: `https://app.resurgo.life/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer YOUR_API_KEY
```

API keys can be generated in [Settings → API](https://app.resurgo.life/settings/api).

### Key Formats

- **Public Key**: Starts with `pk_` (safe to share, only read access)
- **Secret Key**: Starts with `sk_` (keep confidential, full access)

---

## Response Format

All API responses follow a standardized envelope format:

### Success Response (200-299)

```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Example task"
  },
  "timestamp": "2026-04-11T10:30:00Z",
  "requestId": "1712834400000-a1b2c3d"
}
```

### Error Response (400-599)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: title",
    "details": {
      "field": "title"
    }
  },
  "timestamp": "2026-04-11T10:30:00Z",
  "requestId": "1712834400000-a1b2c3d"
}
```

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Retry Strategy

For transient failures (5xx errors), implement exponential backoff:

```javascript
const maxRetries = 3;
const retryDelays = [250, 750, 1500]; // milliseconds

for (let attempt = 0; attempt < maxRetries; attempt++) {
  try {
    const response = await fetch(url, options);
    if (response.ok) return response;
    if (response.status < 500) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    if (attempt < maxRetries - 1) {
      await new Promise(r => setTimeout(r, retryDelays[attempt]));
      continue;
    }
    throw error;
  }
}
```

---

## Rate Limiting

API calls are rate limited to **100 requests per minute per API key**.

When rate limited, the response includes:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 42

{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

## Endpoints

### Tasks API

#### List Tasks

```http
GET /v1/tasks?status=todo&limit=50&offset=0
Authorization: Bearer pk_XXXXX
```

**Query Parameters**:
- `status` (optional): Filter by status (`todo`, `done`, `archived`, `deleted`)
- `limit` (optional, default: 50): Number of results (max: 100)
- `offset` (optional, default: 0): Pagination offset

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "task_123",
      "title": "Complete project proposal",
      "status": "todo",
      "dueDate": "2026-04-15T00:00:00Z",
      "priority": "high",
      "createdAt": "2026-04-10T10:30:00Z",
      "updatedAt": "2026-04-11T09:15:00Z"
    }
  ],
  "timestamp": "2026-04-11T10:30:00Z"
}
```

---

#### Get Task

```http
GET /v1/tasks/{taskId}
Authorization: Bearer pk_XXXXX
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "task_123",
    "title": "Complete project proposal",
    "description": "Prepare executive summary and timeline",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-04-15T00:00:00Z",
    "tags": ["work", "urgent"],
    "createdAt": "2026-04-10T10:30:00Z",
    "updatedAt": "2026-04-11T09:15:00Z"
  },
  "timestamp": "2026-04-11T10:30:00Z"
}
```

**Error Cases**:
- `404 NOT_FOUND`: Task does not exist

---

#### Create Task

```http
POST /v1/tasks
Authorization: Bearer sk_XXXXX
Content-Type: application/json

{
  "title": "Review Q2 budget",
  "description": "Analyze spending across departments",
  "priority": "high",
  "dueDate": "2026-04-20T17:00:00Z",
  "tags": ["finance", "review"]
}
```

**Required Fields**:
- `title` (string, max 255 chars): Task title

**Optional Fields**:
- `description` (string, max 2000 chars): Task description
- `priority` (enum: low, medium, high, urgent)
- `dueDate` (ISO 8601 datetime)
- `tags` (array of strings, max 10 tags)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "task_456",
    "title": "Review Q2 budget",
    "status": "todo",
    "createdAt": "2026-04-11T10:30:00Z",
    "updatedAt": "2026-04-11T10:30:00Z"
  },
  "timestamp": "2026-04-11T10:30:00Z"
}
```

**Error Cases**:
- `400 BAD_REQUEST`: Missing or invalid fields
- `409 CONFLICT`: Duplicate task within same day

---

### Health Check

```http
GET /health
```

**Response** (no auth required):
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.4.0",
    "timestamp": "2026-04-11T10:30:00Z",
    "checks": {
      "convex": "configured",
      "clerk": "configured",
      "auth_mode": "live"
    }
  }
}
```

---

## Best Practices

1. **Use API Keys Securely**
   - Never commit secret keys to version control
   - Rotate keys regularly
   - Use public keys (`pk_*`) only for client-side operations

2. **Handle Errors Gracefully**
   - Implement exponential backoff for retries
   - Log errors with request IDs for debugging
   - Display user-friendly messages

3. **Optimize Performance**
   - Use pagination for large result sets
   - Filter by status/date where possible
   - Cache responses appropriately

4. **Monitor Rate Limits**
   - Track your Rate-Limit headers
   - Implement request queuing if approaching limits
   - Contact support if you need higher limits

---

## Support

For API issues or questions:

- **Email**: support@resurgo.life
- **Status Page**: https://status.resurgo.life
- **Docs**: https://docs.resurgo.life
- **Community**: https://discord.gg/resurgo

---

## Changelog

### v1.0 (Apr 2026)
- ✅ Initial API release
- ✅ Tasks and Goals endpoints
- ✅ Habits and Wellness tracking
- ✅ AI Coach integration
