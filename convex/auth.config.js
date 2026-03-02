// ═══════════════════════════════════════════════════════════════════════════════
// Convex auth configuration — trusts Clerk JWTs
// Clerk OIDC: Convex validates access tokens against Clerk JWKS
// ═══════════════════════════════════════════════════════════════════════════════
const authConfig = {
  providers: [
    {
      // Clerk Frontend API URL — must match the `iss` claim in the JWT
      // Set CLERK_FRONTEND_API_URL in Convex Dashboard environment variables
      // PRODUCTION: https://clerk.resurgo.life  (matches pk_live_ key)
      // DEVELOPMENT: https://awaited-kitten-8.clerk.accounts.dev  (matches pk_test_ key)
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: 'convex',
    },
  ],
};
export default authConfig;
