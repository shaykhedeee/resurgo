import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/browserconfig.xml',
  '/privacy',
  '/terms',
  '/help(.*)',
  '/guides(.*)',
  '/support',
  '/billing',
  '/pricing',
  '/features',
  '/about',
  '/download',
  '/contact',
  '/faq',
  '/blog(.*)',
  '/templates(.*)',
  '/docs(.*)',
  '/learn(.*)',
  '/compare(.*)',
  '/use-cases(.*)',
  '/roadmap',
  '/changelog',
  '/security',
  '/tools(.*)',
  '/demo',
  '/offline',
  '/payment(.*)',
  '/api/health',
  '/api/webhooks/dodo',
  '/api/webhooks/clerk-billing',
  '/api/analytics/event',
  '/api/analytics/events',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files and metadata assets (images, manifest, robots, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|llms\\.txt|browserconfig\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|webmanifest)$).*)',
    '/(api|trpc)(.*)',
  ],
};
