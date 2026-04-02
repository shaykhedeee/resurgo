/** @jest-environment node */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tests for POST /api/webhooks/dodo
 *
 * Covers:
 *  - Signature verification (valid, invalid, missing)
 *  - Plan mapping for all event types
 *  - Missing secrets → 500
 *  - Missing clerkId → graceful 200 skip
 *  - Successful plan update flow
 *  - Convex error → 500 retry signal
 */

export {};

// ── Shared test utilities ──────────────────────────────────────────────────

const TEST_WEBHOOK_SECRET = 'test_webhook_secret_resurgo';
const TEST_SYNC_SECRET    = 'test_sync_secret_resurgo';
const TEST_CLERK_ID       = 'user_test123';

async function hmacSign(body: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: 'payment.succeeded',
    timestamp: new Date().toISOString(),
    data: {
      payment_id: 'pay_test_001',
      product_id: 'prod_pro_monthly',
      amount: 999,
      currency: 'USD',
      status: 'succeeded',
      customer: { email: 'test@resurgo.life' },
      metadata: { clerkId: TEST_CLERK_ID },
    },
    ...overrides,
  };
}

async function makeRequest(body: Record<string, unknown>, signature: string | null) {
  const raw = JSON.stringify(body);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (signature !== null) headers['webhook-signature'] = signature;

  return new Request('http://localhost/api/webhooks/dodo', {
    method: 'POST',
    headers,
    body: raw,
  }) as any;
}

// ── Mock Convex ────────────────────────────────────────────────────────────

const mockMutation = jest.fn();

jest.mock('convex/browser', () => ({
  ConvexHttpClient: jest.fn().mockImplementation(() => ({
    mutation: mockMutation,
  })),
}));

jest.mock('../../../../../convex/_generated/api', () => ({
  api: {
    users: {
      updatePlanFromWebhook: 'users:updatePlanFromWebhook',
    },
  },
}));

// ── Environment setup ──────────────────────────────────────────────────────

function setEnv() {
  process.env.DODO_WEBHOOK_SECRET   = TEST_WEBHOOK_SECRET;
  process.env.BILLING_WEBHOOK_SYNC_SECRET = TEST_SYNC_SECRET;
  process.env.DODO_PRODUCT_ID_PRO_MONTHLY = 'prod_pro_monthly';
  process.env.DODO_PRODUCT_ID_PRO_YEARLY  = 'prod_pro_yearly';
  process.env.DODO_PRODUCT_ID_LIFETIME    = 'prod_lifetime';
  process.env.NEXT_PUBLIC_CONVEX_URL      = 'https://test.convex.cloud';
}

function clearEnv() {
  delete process.env.DODO_WEBHOOK_SECRET;
  delete process.env.BILLING_WEBHOOK_SYNC_SECRET;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('POST /api/webhooks/dodo', () => {
  beforeEach(() => {
    jest.resetModules();
    mockMutation.mockReset();
    setEnv();
  });

  afterEach(() => {
    clearEnv();
  });

  // ── Signature ──────────────────────────────────────────────────────────

  describe('signature verification', () => {
    it('accepts valid sha256 signature', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const { POST } = await import('./route');

      const event = makeEvent();
      const body = JSON.stringify(event);
      const sig = 'sha256=' + await hmacSign(body, TEST_WEBHOOK_SECRET);
      const req = await makeRequest(event, sig);
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.received).toBe(true);
    });

    it('accepts signature without sha256= prefix', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const { POST } = await import('./route');

      const event = makeEvent();
      const body = JSON.stringify(event);
      const sig = await hmacSign(body, TEST_WEBHOOK_SECRET);
      const req = await makeRequest(event, sig);
      const res = await POST(req);

      expect(res.status).toBe(200);
    });

    it('rejects invalid signature with 400', async () => {
      const { POST } = await import('./route');
      const event = makeEvent();
      const req = await makeRequest(event, 'sha256=invalid_signature_here');
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toMatch(/signature/i);
    });

    it('rejects missing signature with 400', async () => {
      const { POST } = await import('./route');
      const event = makeEvent();
      const req = await makeRequest(event, null);
      const res = await POST(req);

      expect(res.status).toBe(400);
    });

    it('rejects tampered body with 400', async () => {
      const { POST } = await import('./route');

      const originalEvent = makeEvent();
      const originalBody = JSON.stringify(originalEvent);
      const sig = 'sha256=' + await hmacSign(originalBody, TEST_WEBHOOK_SECRET);

      // Tamper: change amount in the actual body sent
      const tamperedEvent = makeEvent({ data: { ...originalEvent.data, amount: 99999 } });
      const req = await makeRequest(tamperedEvent, sig);
      const res = await POST(req);

      expect(res.status).toBe(400);
    });
  });

  // ── Missing config ─────────────────────────────────────────────────────

  describe('missing environment variables', () => {
    it('returns 500 when DODO_WEBHOOK_SECRET is missing', async () => {
      delete process.env.DODO_WEBHOOK_SECRET;
      const { POST } = await import('./route');

      const event = makeEvent();
      const req = await makeRequest(event, 'sha256=doesntmatter');
      const res = await POST(req);

      expect(res.status).toBe(500);
    });

    it('returns 500 when BILLING_WEBHOOK_SYNC_SECRET is missing', async () => {
      delete process.env.BILLING_WEBHOOK_SYNC_SECRET;
      const { POST } = await import('./route');

      const event = makeEvent();
      const req = await makeRequest(event, 'sha256=doesntmatter');
      const res = await POST(req);

      expect(res.status).toBe(500);
    });
  });

  // ── Plan mapping ───────────────────────────────────────────────────────

  async function signedRequest(event: Record<string, unknown>) {
    const { POST } = await import('./route');
    const body = JSON.stringify(event);
    const sig = 'sha256=' + await hmacSign(body, TEST_WEBHOOK_SECRET);
    const req = await makeRequest(event, sig);
    return POST(req);
  }

  describe('payment.succeeded plan mapping', () => {
    it('maps pro_monthly product_id → pro plan', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ data: { ...makeEvent().data, product_id: 'prod_pro_monthly', amount: 999 } });
      const res = await signedRequest(event);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.plan).toBe('pro');
      expect(mockMutation).toHaveBeenCalledWith(
        'users:updatePlanFromWebhook',
        expect.objectContaining({ plan: 'pro', clerkId: TEST_CLERK_ID })
      );
    });

    it('maps pro_yearly product_id → pro plan', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ data: { ...makeEvent().data, product_id: 'prod_pro_yearly', amount: 7900 } });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('pro');
    });

    it('maps lifetime product_id → lifetime plan', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ data: { ...makeEvent().data, product_id: 'prod_lifetime', amount: 4999 } });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('lifetime');
    });

    it('maps amount >= 19900 → lifetime plan (fallback for high-value payments)', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ data: { ...makeEvent().data, product_id: 'unknown_prod', amount: 19900 } });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('lifetime');
    });
  });

  describe('subscription events', () => {
    it('subscription.active → pro', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ type: 'subscription.active' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('pro');
    });

    it('subscription.renewed → pro', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ type: 'subscription.renewed' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('pro');
    });

    it('subscription.cancelled → free', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ type: 'subscription.cancelled' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('free');
    });

    it('subscription.expired → free', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ type: 'subscription.expired' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('free');
    });

    it('payment.failed → free', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ type: 'payment.failed' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('free');
    });

    it('payment.refunded → free', async () => {
      mockMutation.mockResolvedValueOnce({ applied: true, reason: 'plan_updated' });
      const event = makeEvent({ type: 'payment.refunded' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.plan).toBe('free');
    });
  });

  describe('unhandled event types', () => {
    it('skips payment.created without calling Convex', async () => {
      const event = makeEvent({ type: 'payment.created' });
      const res = await signedRequest(event);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.action).toBe('skipped');
      expect(mockMutation).not.toHaveBeenCalled();
    });

    it('skips customer.created without calling Convex', async () => {
      const event = makeEvent({ type: 'customer.created' });
      const res = await signedRequest(event);
      const json = await res.json();
      expect(json.action).toBe('skipped');
      expect(mockMutation).not.toHaveBeenCalled();
    });
  });

  // ── Missing clerkId ────────────────────────────────────────────────────

  describe('missing clerkId in metadata', () => {
    it('returns 200 skip (does not retry) when no clerkId in metadata', async () => {
      const event = makeEvent({
        data: { ...makeEvent().data, metadata: {} }, // no clerkId
      });
      const res = await signedRequest(event);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.action).toBe('skipped');
      expect(json.reason).toMatch(/clerk_id/i);
      expect(mockMutation).not.toHaveBeenCalled();
    });
  });

  // ── Convex failure ─────────────────────────────────────────────────────

  describe('Convex mutation failure', () => {
    it('returns 500 when Convex throws (triggers Dodo retry)', async () => {
      mockMutation.mockRejectedValueOnce(new Error('Convex network timeout'));
      const event = makeEvent();
      const res = await signedRequest(event);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });

  // ── Invalid JSON ───────────────────────────────────────────────────────

  describe('malformed body', () => {
    it('returns 400 for invalid JSON', async () => {
      const { POST } = await import('./route');
      const secret = TEST_WEBHOOK_SECRET;
      const raw = 'not json at all {{{{';
      const sig = 'sha256=' + await hmacSign(raw, secret);

      const req = new Request('http://localhost/api/webhooks/dodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'webhook-signature': sig },
        body: raw,
      }) as any;

      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });
});
