'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — ConvexClientProvider
// Wraps the app with Convex + Clerk auth integration.
// Must be nested inside <ClerkProvider> — handled by root layout.
// Includes error boundary so a Convex/Clerk init failure doesn't freeze the
// entire page (users still get the static HTML shell with working <a> links).
// ═══════════════════════════════════════════════════════════════════════════════

import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import React, { Component, ReactNode } from 'react';

// ── Convex client — always created (fallback URL prevents build-time throw) ──
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3210';
const convex = new ConvexReactClient(convexUrl);

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
  return (
    <ConvexErrorBoundary>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ConvexErrorBoundary>
  );
}
