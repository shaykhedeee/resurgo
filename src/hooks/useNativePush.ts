// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — useNativePush Hook
// Manages Capacitor push notification lifecycle for Android (FCM)
// Registers token with Convex, listens for foreground notifications
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';
import { isNativeApp } from '../lib/platform';
import { registerForPush, addPushListeners, clearAllNotifications } from '../lib/native-push';

interface UseNativePushReturn {
  /** Whether native push is available and registered */
  isRegistered: boolean;
  /** The FCM token (if obtained) */
  fcmToken: string | null;
  /** Whether we're inside a Capacitor native app */
  isNative: boolean;
  /** Re-register push token (useful after sign-in) */
  reRegister: () => Promise<void>;
}

export function useNativePush(): UseNativePushReturn {
  const { user } = useUser();
  const registerToken = useMutation(api.pushNotifications.registerPushToken);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const registeredRef = useRef(false);

  const isNative = typeof window !== 'undefined' ? isNativeApp() : false;

  const doRegister = useCallback(async () => {
    if (!isNative || !user?.id || registeredRef.current) return;
    registeredRef.current = true;

    try {
      const token = await registerForPush();
      if (!token) {
        registeredRef.current = false;
        return;
      }

      setFcmToken(token);

      // Store token in Convex
      await registerToken({ fcmToken: token });
      setIsRegistered(true);

      // Set up foreground notification listeners
      const cleanup = await addPushListeners({
        onReceived: (notification) => {
          console.log('[useNativePush] Foreground notification:', notification.title);
          // Could show a toast here via sonner
        },
        onTapped: (notification) => {
          console.log('[useNativePush] Notification tapped:', notification.data);
          // Deep-link based on notification.data.route
          if (notification.data?.route && typeof window !== 'undefined') {
            window.location.href = notification.data.route;
          }
        },
      });

      cleanupRef.current = cleanup;

      // Clear badge / notification tray on app resume
      clearAllNotifications().catch(() => {});
    } catch (err) {
      console.error('[useNativePush] Registration failed:', err);
      registeredRef.current = false;
    }
  }, [isNative, user?.id, registerToken]);

  useEffect(() => {
    doRegister();
    return () => {
      cleanupRef.current?.();
    };
  }, [doRegister]);

  const reRegister = useCallback(async () => {
    registeredRef.current = false;
    setIsRegistered(false);
    setFcmToken(null);
    await doRegister();
  }, [doRegister]);

  return { isRegistered, fcmToken, isNative, reRegister };
}

export default useNativePush;
