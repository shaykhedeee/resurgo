/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
  
  // Production-grade security headers
  async headers() {
    return [
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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // CSP only in production — dev mode needs 'unsafe-eval' for webpack HMR
          ...(isDev ? [] : [{
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.puter.com https://*.clerk.accounts.dev https://clerk.resurgo.life https://challenges.cloudflare.com https://*.cloudflare.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://fonts.googleapis.com https://*.clerk.accounts.dev https://clerk.resurgo.life https://challenges.cloudflare.com https://*.cloudflare.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.groq.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.aimlapi.com https://api.cerebras.ai https://api.together.xyz https://api.mistral.ai https://api.fireworks.ai https://api.scaleway.ai https://api.openai.com https://js.puter.com https://*.clerk.accounts.dev https://clerk.resurgo.life https://*.convex.cloud wss://*.convex.cloud wss: https://accounts.google.com https://api.notion.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com",
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
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Compression and performance
  compress: true,
  
  // PWA configuration
  poweredByHeader: false,
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', '@/components', '@/lib'],
  },
}

module.exports = nextConfig
