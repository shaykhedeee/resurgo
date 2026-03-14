import type { AuthConfig } from 'convex/server';

const clerkIssuerDomain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  process.env.CLERK_FRONTEND_API_URL;

export default {
  providers: [
    {
      // Official Convex docs use CLERK_JWT_ISSUER_DOMAIN.
      // Keep CLERK_FRONTEND_API_URL as a fallback so existing local/dev envs
      // continue to work without surprise breakage.
      domain: clerkIssuerDomain!,
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig;