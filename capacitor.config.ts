// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Capacitor Configuration
// WebView wrapper pointing at the hosted Next.js app with full native features
// ═══════════════════════════════════════════════════════════════════════════════

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'life.resurgo.app',
  appName: 'Resurgo',

  // Hosted WebView — points at deployed site (no local static bundle)
  server: {
    url: 'https://resurgo.life',
    // Allow navigation to Clerk auth domains and payment providers
    allowNavigation: [
      'resurgo.life',
      '*.resurgo.life',
      '*.clerk.accounts.dev',
      'accounts.clerk.dev',
      'clerk.resurgo.life',
      '*.dodopayments.com',
    ],
    // Offline fallback — show this local HTML when there's no connectivity
    errorPath: 'offline.html',
  },

  // Android-specific configuration
  android: {
    allowMixedContent: false,
    backgroundColor: '#0A0A0B',
    // Capture resurgo.life URLs as App Links (deep linking)
    buildOptions: {
      keystorePath: 'resurgo-release.keystore',
      keystoreAlias: 'resurgo',
    },
    // Override user-agent to identify native app in analytics
    overrideUserAgent: 'ResurgoApp/1.0.0 (Android; Capacitor)',
    // WebView debugging in dev builds
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      backgroundColor: '#0A0A0B',
      style: 'DARK',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchAutoHide: false,         // Manually hide via SplashScreen.hide() for smooth app reveal
      launchShowDuration: 2500,      // Show for 2.5s minimum before hiding
      backgroundColor: '#0A0A0B',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,            // Use custom animated icon instead
      splashFullScreen: true,
      splashImmersive: true,
      androidSplashResourceName: 'splash',
      fadeInDuration: 200,           // Fade in from system
      fadeOutDuration: 400,          // Smooth fade-out when hiding
    },
    Haptics: {
      // No special config needed — plugin auto-initializes
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },

  // Don't log in production
  loggingBehavior: 'none',
};

export default config;
