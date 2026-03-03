'use client';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Deep Scan Onboarding Page
// Replaces basic onboarding with 5-stage Deep Scan Protocol
// ═══════════════════════════════════════════════════════════════════════════════

import { DeepScanProtocol } from '@/components/DeepScanProtocol';

export default function DeepScanPage() {
  return <DeepScanProtocol />;
}
