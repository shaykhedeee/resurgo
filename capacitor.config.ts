// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Capacitor Configuration
// WebView wrapper pointing at the hosted Next.js app with full native features
// ═══════════════════════════════════════════════════════════════════════════════

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'life.resurgo.app',
  appName: 'Resurgo',
  webDir: 'out',  // Production build output (Next.js static export goes here)

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
    // allowMixedContent is not a valid Capacitor 5 android property; removed
    backgroundColor: '#0A0A0B',
    // Capture resurgo.life URLs as App Links (deep linking)
    buildOptions: {
      keystorePath: 'resurgo-release.keystore',
      keystoreAlias: 'resurgo-key',
    },
    // Override user-agent to identify native app in analytics
    overrideUserAgent: 'ResurgoApp/2.0.0 (Android; Capacitor)',
    // WebView debugging in dev builds
    webContentsDebuggingEnabled: false,
  },

  // iOS-specific configuration
ios: {
    // Content security — disallow mixed HTTP/HTTPS (configured via meta tag instead)
    // statusBarPadding not available in Capacitor 5 types — configured via Info.plist
    overrideUserAgent: 'ResurgoApp/2.0.0 (iOS; Capacitor)',
    // Associated Domains for Universal Links (deep linking without app prompt)
    // See docs/IOS-DEPLOYMENT.md for apple-app-site-association setup
    // buildOptions: {
    //   associatedDomains: ['applinks:resurgo.life']
    // }
  },

  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      backgroundColor: '#0A0A0B',
      style: 'LIGHT',  // iOS uses LIGHT/DARK — LIGHT = dark text on light bg, DARK = light text on dark
      overlaysWebView: false,
    },
    SplashScreen: {
      launchAutoHide: false,         // Manually hide via SplashScreen.hide() for smooth app reveal
      launchShowDuration: 2500,      // Show for 2.5s minimum before hiding
      backgroundColor: '#0A0A0B',
      showSpinner: false,            // Use custom animated icon instead
      splashFullScreen: true,
      splashImmersive: true,
      // iOS uses LaunchScreen.storyboard — see App/App/Assets.xcassets/LaunchImage.launchimage
      fadeInDuration: 200,           // Fade in from system
      fadeOutDuration: 400,          // Smooth fade-out when hiding
      androidSplashResourceName: 'splash',  // Android only
    },
    Haptics: {
      // No special config needed — plugin auto-initializes
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    // App plugin handles minimal-ui mode for iOS PWA
    App: {
      // iOS-specific: set to 'yes' to hide Safari UI when launched from home screen
      // This is configured automatically via Info.plist
    },
  },

  // Don't log in production
  loggingBehavior: 'none',

  // iOS-specific build options (Xcode project generation)
  // These are used when running `npx cap add ios` or `npx cap sync ios`
  // For detailed iOS configuration, edit ios/App/App.entitlements and Info.plist
};

export default config;
