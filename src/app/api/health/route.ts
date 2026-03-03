// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Health Check Endpoint
// Returns 200 with basic service status. Used by uptime monitors.
// GET /api/health
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Fast cold starts on Vercel edge

export async function GET() {
  const now = new Date().toISOString();

  return NextResponse.json(
    {
      status: 'ok',
      service: 'resurgo',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      timestamp: now,
      environment: process.env.NODE_ENV || 'unknown',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
