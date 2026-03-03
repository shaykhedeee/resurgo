'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Orchestrator Page
// Multi-provider prompt decomposition interface
// ═══════════════════════════════════════════════════════════════════════════════

import { AIOrchestrator } from '@/components/AIOrchestrator';

export default function OrchestratorPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-8 md:px-6">
      <AIOrchestrator />
    </div>
  );
}
