// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — NativePushInitializer
// Auto-registers FCM push token, configures native UI chrome, handles deep
// links, and manages app lifecycle events inside the Capacitor native shell.
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useNativePush } from '../hooks/useNativePush';
import { isNativeApp } from '../lib/platform';

// Lazy-load the update checker so it's code-split away from web bundles
const AppUpdateChecker = lazy(() =>
  import('./AppUpdateChecker').then((m) => ({ default: m.AppUpdateChecker }))
);

/**
 * Invisible init component — minimal UI (just the update toast), mostly
 * side-effects. Registers FCM token, status bar, back button, deep links,
 * and shows an update prompt when a new APK is available.
 */
export function NativePushInitializer() {
  const { isRegistered, isNative } = useNativePush();

  useEffect(() => {
    // Push registration state tracked via isRegistered
  }, [isNative, isRegistered]);

  // ── App plugin lifecycle events ──────────────────────────────────────────
  useEffect(() => {
    if (!isNativeApp()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const { App } = await import('@capacitor/app');

        // Handle back button on Android
        const backHandler = await App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });

        // Handle app resume — clear notification badge & refresh token
        const resumeHandler = await App.addListener('resume', async () => {
          try {
            const { clearAllNotifications } = await import('../lib/native-push');
            await clearAllNotifications();
          } catch {
            // ignore
          }
        });

        // Handle deep links — App Links (resurgo.life URLs opened from other apps)
        const urlHandler = await App.addListener('appUrlOpen', (event) => {
          try {
            const url = new URL(event.url);
            // Navigate inside the WebView for resurgo.life URLs
            if (url.hostname === 'resurgo.life' || url.hostname === 'www.resurgo.life') {
              const path = url.pathname + url.search + url.hash;
              if (path && path !== '/') {
                window.location.href = path;
              }
            }
          } catch {
            // Malformed URL — ignore
          }
        });

        cleanup = () => {
          backHandler.remove();
          resumeHandler.remove();
          urlHandler.remove();
        };
      } catch {
        // App plugin not available (web)
      }
    })();

    return () => cleanup?.();
  }, []);

  // ── Status bar theming ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isNativeApp()) return;

    (async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setBackgroundColor({ color: '#0A0A0B' });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch {
        // StatusBar plugin not available
      }
    })();
  }, []);

  // ── Keyboard / viewport management ─────────────────────────────────────
  useEffect(() => {
    if (!isNativeApp()) return;

    // On Android, the keyboard resize can cause layout shifts.
    // Use visualViewport to keep the UI stable.
    const vv = window.visualViewport;
    if (!vv) return;

    function handleResize() {
      // Set a CSS variable the UI can use to avoid keyboard overlap
      const offsetY = window.innerHeight - (vv?.height ?? window.innerHeight);
      document.documentElement.style.setProperty('--keyboard-offset', `${offsetY}px`);
    }

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  // ── Inject native app class for CSS targeting ──────────────────────────
  useEffect(() => {
    if (!isNativeApp()) return;
    document.documentElement.classList.add('native-app');
    document.documentElement.classList.add('capacitor');
    return () => {
      document.documentElement.classList.remove('native-app');
      document.documentElement.classList.remove('capacitor');
    };
  }, []);

  if (!isNativeApp()) return null;

  return (
    <Suspense fallback={null}>
      <AppUpdateChecker />
    </Suspense>
  );
}

export default NativePushInitializer;
