// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Authentication Diagnostic Endpoint
// GET /api/auth/diagnose
//
// Returns diagnostic information about Clerk authentication configuration.
// Used for debugging sign-in/sign-up issues without exposing secrets.
// No auth required — only reveals non-sensitive config status.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Get all relevant Clerk environment variables
  const clerkPk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  const clerkSecretKey = process.env.CLERK_SECRET_KEY ? '***' : '';
  const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET ? '***' : '';
  const clerkJwtIssuer = process.env.CLERK_JWT_ISSUER_DOMAIN || '';
  const clerkFrontendApi = process.env.CLERK_FRONTEND_API_URL || '';
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '';
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '';
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';

  // Validation checks
  const checks = {
    publishableKeyPresent: !!clerkPk,
    publishableKeyValid: clerkPk.startsWith('pk_'),
    publishableKeyIsLive: clerkPk.startsWith('pk_live_'),
    publishableKeyIsTest: clerkPk.startsWith('pk_test_'),
    secretKeyPresent: !!process.env.CLERK_SECRET_KEY,
    webhookSecretPresent: !!process.env.CLERK_WEBHOOK_SECRET,
    jwtIssuerPresent: !!clerkJwtIssuer,
    jwtIssuerFormat: validateJwtIssuer(clerkJwtIssuer),
    signInUrlPresent: !!signInUrl,
    signUpUrlPresent: !!signUpUrl,
    convexUrlPresent: !!convexUrl,
    convexUrlValid: /^https:\/\/.+\.convex\.cloud$/.test(convexUrl),
  };

  // Determine configuration status
  const status = determineStatus(checks);
  const recommendations = generateRecommendations(checks, clerkPk, clerkJwtIssuer);

  // Build environment mismatch warnings
  const warnings: string[] = [];
  
  if (checks.publishableKeyIsLive && clerkJwtIssuer.includes('.clerk.accounts.dev')) {
    warnings.push('JWT issuer is development domain (.accounts.dev) but publishable key is live (pk_live_)');
  }
  
  if (checks.publishableKeyIsTest && clerkJwtIssuer.includes('.clerk.accounts.com')) {
    warnings.push('JWT issuer is production domain (.accounts.com) but publishable key is test (pk_test_)');
  }

  if (checks.secretKeyPresent && !checks.jwtIssuerPresent) {
    warnings.push('CLERK_SECRET_KEY is set but CLERK_JWT_ISSUER_DOMAIN is missing (required for Convex integration)');
  }

  return NextResponse.json(
    {
      timestamp,
      status,
      configuration: {
        publishableKey: maskKey(clerkPk),
        hasSecretKey: !!process.env.CLERK_SECRET_KEY,
        hasWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
        jwtIssuer: clerkJwtIssuer || 'NOT_SET',
        jwtIssuerFormat: checks.jwtIssuerFormat,
        signInUrl,
        signUpUrl,
        convexUrl: convexUrl || 'NOT_SET',
      },
      checks,
      warnings,
      recommendations,
      environment: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || 'local',
    },
    { status: 200 }
  );
}

function validateJwtIssuer(issuer: string): string {
  if (!issuer) return 'NOT_SET';
  if (issuer.includes('.clerk.accounts.dev')) return 'DEVELOPMENT';
  if (issuer.includes('.clerk.accounts.com')) return 'PRODUCTION';
  if (issuer.includes('clerk.resurgo.life')) return 'CUSTOM_DOMAIN';
  return 'UNKNOWN_FORMAT';
}

function maskKey(key: string): string {
  if (!key) return 'NOT_SET';
  if (key.startsWith('pk_live_')) return 'pk_live_' + key.slice(8, 15) + '***';
  if (key.startsWith('pk_test_')) return 'pk_test_' + key.slice(8, 15) + '***';
  return 'INVALID_FORMAT';
}

function determineStatus(checks: Record<string, boolean | string>): 'OK' | 'WARNING' | 'ERROR' {
  const requiredChecks = [
    'publishableKeyPresent',
    'publishableKeyValid',
    'secretKeyPresent',
  ];

  const allRequired = requiredChecks.every(check => checks[check] === true);
  
  if (!allRequired) return 'ERROR';
  
  const warnings = Object.entries(checks).filter(([key, value]) => 
    !requiredChecks.includes(key) && value === false
  ).length;

  return warnings > 0 ? 'WARNING' : 'OK';
}

function generateRecommendations(
  checks: Record<string, boolean | string>,
  clerkPk: string,
  jwtIssuer: string
): string[] {
  const recommendations: string[] = [];

  if (!checks.publishableKeyPresent) {
    recommendations.push('Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in Vercel environment variables');
  } else if (!checks.publishableKeyValid) {
    recommendations.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with pk_ (found: ' + maskKey(clerkPk) + ')');
  }

  if (!checks.secretKeyPresent) {
    recommendations.push('Set CLERK_SECRET_KEY in Vercel environment variables for server-side auth');
  }

  if (!checks.webhookSecretPresent) {
    recommendations.push('Set CLERK_WEBHOOK_SECRET (whsec_*) from Clerk dashboard Webhooks section');
  }

  if (!checks.jwtIssuerPresent) {
    recommendations.push('Set CLERK_JWT_ISSUER_DOMAIN (needed for Convex integration with Clerk)');
  }

  if (checks.jwtIssuerPresent && typeof checks.jwtIssuerFormat === 'string' && checks.jwtIssuerFormat === 'CUSTOM_DOMAIN') {
    recommendations.push('Verify custom JWT issuer domain (clerk.resurgo.life) is configured in Clerk dashboard');
  }

  if (!checks.convexUrlPresent) {
    recommendations.push('Set NEXT_PUBLIC_CONVEX_URL in Vercel environment variables');
  } else if (!checks.convexUrlValid) {
    recommendations.push('NEXT_PUBLIC_CONVEX_URL must be valid Convex deployment URL (*.convex.cloud)');
  }

  if (recommendations.length === 0) {
    recommendations.push('Configuration appears valid. If issues persist, check Clerk dashboard for errors.');
  }

  return recommendations;
}
