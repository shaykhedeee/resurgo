/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'www.themealdb.com' },
      { protocol: 'https', hostname: 'images.openfoodfacts.org' },
      { protocol: 'https', hostname: 'static.openfoodfacts.org' },
      // Vision Board image providers
      { protocol: 'https', hostname: 'image.pollinations.ai' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.unsplash.com' },
      { protocol: 'https', hostname: '*.pexels.com' },
      { protocol: 'https', hostname: 'media.gettyimages.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24h CDN cache for optimized images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Production-grade security headers
  async headers() {
    const allowedOrigin = isDev ? '*' : 'https://resurgo.life';
    return [
      // CORS for API routes — restricts to resurgo.life in production (§17.1)
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: allowedOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          // CSP only in production — dev mode needs 'unsafe-eval' for webpack HMR
          ...(isDev ? [] : [{
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://js.puter.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clerk.accounts.dev https://clerk.resurgo.life https://challenges.cloudflare.com https://*.cloudflare.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://connect.facebook.net https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://fonts.googleapis.com https://*.clerk.accounts.dev https://clerk.resurgo.life https://challenges.cloudflare.com https://*.cloudflare.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: https://www.facebook.com",
              "connect-src 'self' https://wttr.in https://api.groq.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.aimlapi.com https://api.cerebras.ai https://api.together.xyz https://api.openai.com http://localhost:11434 https://api.puter.com https://*.puter.com https://js.puter.com https://*.clerk.accounts.dev https://clerk.resurgo.life https://*.convex.cloud wss://*.convex.cloud wss: https://accounts.google.com https://api.notion.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://image.pollinations.ai https://api-inference.huggingface.co https://images.unsplash.com https://api.unsplash.com https://connect.facebook.net https://www.facebook.com https://www.clarity.ms",
              "frame-src 'self' https://*.clerk.accounts.dev https://clerk.resurgo.life https://accounts.google.com https://www.notion.so https://challenges.cloudflare.com https://*.cloudflare.com https://www.google.com https://www.recaptcha.net",
              "form-action 'self'",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
            ].join('; '),
          }]),
        ],
      },
    ];
  },

  // Skip type checking in build (handled by IDE/CI separately)
  typescript: {
    ignoreBuildErrors: true,
  },

  // SEO-friendly redirects
  async redirects() {
    return [
      // /pricing is the canonical SEO path in sitemap; /billing is the actual route
      {
        source: '/pricing',
        destination: '/billing',
        permanent: true, // 301 — passes PageRank to /billing
      },
    ];
  },

  // Compression and performance
  compress: true,
  
  // PWA configuration
  poweredByHeader: false,
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
      'recharts',
      '@/components',
      '@/lib',
    ],
    // Client-side router cache TTL (Next.js 15+)
    staleTimes: {
      dynamic: 30,   // Cache dynamic pages 30s on back navigation
      static: 300,   // Cache static pages 5 minutes
    },
  },
}

module.exports = withBundleAnalyzer(nextConfig)
