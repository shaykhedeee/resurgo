export const MARKETING_SESSION_KEY = 'resurgo_marketing_session_id';
export const UTM_FIRST_KEY = 'resurgo_utm_first';
export const UTM_LAST_KEY = 'resurgo_utm_last';

function safeParse(value: string | null): Record<string, string> | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return null;
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const existing = window.localStorage.getItem(MARKETING_SESSION_KEY);
  if (existing) return existing;

  const generated = `mkt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(MARKETING_SESSION_KEY, generated);
  return generated;
}

export function captureUtmParams(): { first: Record<string, string> | null; last: Record<string, string> | null } {
  if (typeof window === 'undefined') return { first: null, last: null };

  const params = new URLSearchParams(window.location.search);
  const picked: Record<string, string> = {};
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  for (const key of keys) {
    const value = params.get(key);
    if (value) picked[key] = value;
  }

  if (Object.keys(picked).length === 0) {
    return {
      first: safeParse(window.localStorage.getItem(UTM_FIRST_KEY)),
      last: safeParse(window.localStorage.getItem(UTM_LAST_KEY)),
    };
  }

  const payload = {
    ...picked,
    capturedAt: new Date().toISOString(),
    landingPath: window.location.pathname,
  };

  const first = window.localStorage.getItem(UTM_FIRST_KEY);
  if (!first) {
    window.localStorage.setItem(UTM_FIRST_KEY, JSON.stringify(payload));
  }
  window.localStorage.setItem(UTM_LAST_KEY, JSON.stringify(payload));

  return {
    first: safeParse(window.localStorage.getItem(UTM_FIRST_KEY)),
    last: safeParse(window.localStorage.getItem(UTM_LAST_KEY)),
  };
}

export function trackMarketingEvent(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const body = {
    event,
    path: window.location.pathname,
    properties: {
      ...properties,
      sessionId: getOrCreateSessionId(),
    },
  };

  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Fire-and-forget on purpose.
  });
}
