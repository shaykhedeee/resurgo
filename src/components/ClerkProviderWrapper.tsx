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
const afterSignInUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard';
const afterSignUpUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard';
const hasValidKey =
  publishableKey &&
  publishableKey !== 'YOUR_PUBLISHABLE_KEY' &&
  publishableKey.startsWith('pk_');

export default function ClerkProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  if (!hasValidKey) {
    // No valid Clerk key — render without auth (build-time / dev without keys)
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={afterSignInUrl}
      signUpFallbackRedirectUrl={afterSignUpUrl}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
