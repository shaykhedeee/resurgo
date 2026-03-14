'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Billing Page Analytics
// Client component that fires GA4 + Meta Pixel "view pricing" conversion events
// on mount. Embedded as a zero-UI client island inside the server-rendered
// billing page so we can track this critical funnel step.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export default function BillingPageAnalytics() {
  useEffect(() => {
    // GA4: view_item_list / pricing page viewed
    analytics.viewPricing();
  }, []);

  return null; // pure side-effect component — renders nothing
}
