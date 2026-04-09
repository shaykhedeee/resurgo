// =============================================================================
// Resurgo — Environment Variable Validation
// Validates required env vars at import time and logs warnings for missing ones.
// Import this module early (e.g. in layout.tsx) to catch misconfigurations.
// =============================================================================

type EnvVar = {
  key: string;
  required: boolean;
  description: string;
  /** If true, only required on the server (not in client bundles) */
  serverOnly?: boolean;
};

const ENV_SCHEMA: EnvVar[] = [
  {
    key: 'NEXT_PUBLIC_CONVEX_URL',
    required: true,
    description: 'Convex deployment URL — backend will not function without it',
  },
  {
    key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    required: true,
    description: 'Clerk publishable key — auth will not function without it',
  },
  {
    key: 'CLERK_WEBHOOK_SECRET',
    required: true,
    description: 'Clerk webhook signing secret for billing events',
    serverOnly: true,
  },
  {
    key: 'NEXT_PUBLIC_SITE_URL',
    required: false,
    description: 'Canonical site URL (defaults to localhost:3000)',
  },
  {
    key: 'NEXT_PUBLIC_GA_ID',
    required: false,
    description: 'Google Analytics measurement ID',
  },
  {
    key: 'NEXT_PUBLIC_CLARITY_ID',
    required: false,
    description: 'Microsoft Clarity project ID',
  },
  {
    key: 'BRAVE_SEARCH_API_KEY',
    required: false,
    description: 'Server-side Brave Search API key for researcher mode',
    serverOnly: true,
  },
];

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validates all environment variables against the schema.
 * Call once during app startup (e.g. in root layout or instrumentation).
 */
export function validateEnv(): EnvValidationResult {
  const isServer = typeof window === 'undefined';
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const v of ENV_SCHEMA) {
    // Skip server-only vars when running in the browser
    if (v.serverOnly && !isServer) continue;

    const value = process.env[v.key];
    const isMissing = !value || value.trim() === '';

    if (isMissing && v.required) {
      missing.push(`${v.key} — ${v.description}`);
    } else if (isMissing && !v.required) {
      warnings.push(`${v.key} — ${v.description}`);
    }
  }

  const valid = missing.length === 0;

  // Log results (only in development to avoid noise in production logs)
  if (typeof window === 'undefined') {
    // Server-side logging
    if (missing.length > 0) {
      console.error(
        `\n❌ [Resurgo] Missing REQUIRED environment variables:\n${missing.map((m) => `   • ${m}`).join('\n')}\n`
      );
    }
    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn(
        `\n⚠️  [Resurgo] Missing optional environment variables:\n${warnings.map((w) => `   • ${w}`).join('\n')}\n`
      );
    }
    if (valid && process.env.NODE_ENV === 'development') {
      console.log('✅ [Resurgo] All required environment variables are set.');
    }
  }

  return { valid, missing, warnings };
}

// Auto-validate on first import (server-side only, at build/startup time)
if (typeof window === 'undefined') {
  validateEnv();
}
