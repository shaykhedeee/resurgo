'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — ClerkProviderWrapper
// Wraps children with ClerkProvider only when a valid key is configured.
// Falls back to rendering children without auth during build / keyless dev.
// ═══════════════════════════════════════════════════════════════════════════════

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in';
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up';
const signInFallbackRedirectUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || '/dashboard';
const signUpFallbackRedirectUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL || '/dashboard';

// JWT issuer domain - try multiple sources
const jwtIssuerDomain = 
  process.env.CLERK_JWT_ISSUER_DOMAIN ||
  process.env.CLERK_FRONTEND_API_URL ||
  undefined;

const isPlaceholderKey =
  !publishableKey ||
  /REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(publishableKey);
const hasValidKey =
  publishableKey &&
  publishableKey !== 'YOUR_PUBLISHABLE_KEY' &&
  publishableKey.startsWith('pk_') &&
  !isPlaceholderKey;

// Log configuration status (only in development or on error)
if (typeof window !== 'undefined' && !hasValidKey) {
  console.warn('[ClerkProviderWrapper] Invalid or missing Clerk configuration:', {
    hasPublishableKey: !!publishableKey,
    isPlaceholder: isPlaceholderKey,
    startsWithPk: publishableKey?.startsWith('pk_'),
    hasJwtIssuer: !!jwtIssuerDomain,
    environment: process.env.NODE_ENV,
  });
}

export default function ClerkProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  if (!hasValidKey) {
    // No valid Clerk key — render without auth (build-time / dev without keys)
    if (typeof window !== 'undefined') {
      console.warn(
        '[ClerkProviderWrapper] Rendering without Clerk authentication. ' +
        'Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_*) to Vercel environment variables.'
      );
    }
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
      afterSignOutUrl="/"
      // Optional: set JWT issuer if available for Convex integration
      {...(jwtIssuerDomain && { appearance: { variables: { colorPrimary: '#EA580C' } } })}
    >
      {children}
    </ClerkProvider>
  );
}
