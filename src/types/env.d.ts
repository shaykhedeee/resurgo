declare namespace NodeJS {
  interface ProcessEnv {
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    CLERK_SECRET_KEY?: string;
    CLERK_JWT_ISSUER_DOMAIN?: string;
    CLERK_WEBHOOK_SECRET?: string;

    // Convex
    CONVEX_DEPLOYMENT?: string;
    NEXT_PUBLIC_CONVEX_URL?: string;
    CONVEX_DEPLOY_KEY?: string;

    // Billing
    BILLING_WEBHOOK_SYNC_SECRET?: string;
    BILLING_PRO_MONTHLY_CHECKOUT_URL?: string;
    BILLING_PRO_YEARLY_CHECKOUT_URL?: string;
    BILLING_LIFETIME_CHECKOUT_URL?: string;
    BILLING_PORTAL_URL?: string;

    // AI server-side keys
    GROQ_API_KEY?: string;
    GOOGLE_AI_STUDIO_KEY?: string;
    GOOGLE_AI_STUDIO_KEY_BACKUP?: string;
    OPENROUTER_API_KEY?: string;
    OPENAI_API_KEY?: string;
    AIML_API_KEY?: string;
    CEREBRAS_API_KEY?: string;
    TOGETHER_API_KEY?: string;
    MISTRAL_API_KEY?: string;
    FIREWORKS_API_KEY?: string;
    SCALEWAY_API_KEY?: string;

    // App config
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_AI_PROVIDER?: string;
    NEXT_PUBLIC_AI_ENABLED?: string;
    NEXT_PUBLIC_PUTER_ENABLED?: string;
    NEXT_PUBLIC_AI_MAX_TOKENS_FREE?: string;
    NEXT_PUBLIC_AI_MAX_TOKENS_PREMIUM?: string;
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
    NEXT_PUBLIC_BING_SITE_VERIFICATION?: string;

    // Push notifications
    NEXT_PUBLIC_VAPID_PUBLIC_KEY?: string;
    VAPID_PRIVATE_KEY?: string;
    VAPID_SUBJECT?: string;

    // Telegram Bot
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_WEBHOOK_SECRET?: string;
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?: string;

    // HuggingFace (vision board image generation)
    HF_ACCESS_TOKEN?: string;

    // Dodo Payments
    DODO_API_KEY?: string;
    DODO_WEBHOOK_SECRET?: string;
    DODO_PRODUCT_ID_PRO_MONTHLY?: string;
    DODO_PRODUCT_ID_PRO_YEARLY?: string;
    DODO_PRODUCT_ID_LIFETIME?: string;
    NEXT_PUBLIC_DODO_CHECKOUT_PRO_MONTHLY?: string;
    NEXT_PUBLIC_DODO_CHECKOUT_PRO_YEARLY?: string;
    NEXT_PUBLIC_DODO_CHECKOUT_LIFETIME?: string;
    NEXT_PUBLIC_DODO_CUSTOMER_PORTAL_URL?: string;

    // Email (Resend)
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    EMAIL_INTERNAL_SECRET?: string;

    // App version
    NEXT_PUBLIC_APP_VERSION?: string;
  }
}

// Clerk global on window (loaded via CDN / Next.js)
interface Window {
  Clerk?: {
    signOut?: () => Promise<void>;
    [key: string]: unknown;
  };
}
