'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — ConvexClientProvider
// Wraps the app with Convex + Clerk auth integration.
// Must be nested inside <ClerkProvider> — handled by root layout.
// Includes error boundary so a Convex/Clerk init failure doesn't freeze the
// entire page (users still get the static HTML shell with working <a> links).
// ═══════════════════════════════════════════════════════════════════════════════

import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient, ConvexProviderWithAuth } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import React, { Component, ReactNode, Suspense, lazy } from 'react';

// Lazy-load native push initializer — only loads in Capacitor WebView
const NativePushInitializer = lazy(() => import('./NativePushInitializer'));

// ── Convex client (safe to instantiate at module level) ──────────────────────
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isPlaceholderClerkKey =
  !clerkPublishableKey ||
  /REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);
const hasValidClerkKey =
  !!clerkPublishableKey &&
  clerkPublishableKey !== 'YOUR_PUBLISHABLE_KEY' &&
  clerkPublishableKey.startsWith('pk_') &&
  !isPlaceholderClerkKey;

// ── Error boundary: catches Clerk/Convex init crashes during hydration ───────
class ConvexErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('[ConvexClientProvider] hydration/init error caught:', error);
  }
  render() {
    if (this.state.hasError) {
      // Render children without Convex — links still work, page is navigable
      return this.props.children;
    }
    return this.props.children;
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // If Convex URL is missing, render children without provider (graceful degradation)
  if (!convex) {
    console.warn('[ConvexClientProvider] NEXT_PUBLIC_CONVEX_URL not set — running without Convex.');
    return <>{children}</>;
  }

  // If Clerk is unavailable/misconfigured, use plain Convex provider to avoid
  // crashing public pages (e.g. /sign-in) with a runtime exception.
  if (!hasValidClerkKey) {
    console.warn('[ConvexClientProvider] Clerk key missing/invalid — running Convex without Clerk auth context.');
    return (
      <ConvexErrorBoundary>
        <ConvexProviderWithAuth
          client={convex}
          useAuth={() => ({
            isLoading: false,
            isAuthenticated: false,
            fetchAccessToken: async () => null,
          })}
        >
          {children}
        </ConvexProviderWithAuth>
      </ConvexErrorBoundary>
    );
  }

  return (
    <ConvexErrorBoundary>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
        <Suspense fallback={null}>
          <NativePushInitializer />
        </Suspense>
      </ConvexProviderWithClerk>
    </ConvexErrorBoundary>
  );
}
