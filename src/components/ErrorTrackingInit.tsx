// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Error Tracking Initializer
// Client-side component to initialize error tracking
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';
import { initErrorTracking } from '@/lib/sentry';

export function ErrorTrackingInit() {
  useEffect(() => {
    // Initialize error tracking on mount
    initErrorTracking();
  }, []);

  // This component doesn't render anything
  return null;
}
