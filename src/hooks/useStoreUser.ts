'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — useStoreUser Hook
// Automatically syncs Clerk user to Convex on sign-in
// Use in any component that needs the current user
// ═══════════════════════════════════════════════════════════════════════════════

import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';

export function useStoreUser() {
  // isLoading from useConvexAuth() is true while Clerk+Convex are handshaking
  const { isAuthenticated, isLoading: convexAuthLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const convexUser = useQuery(
    api.users.current,
    isAuthenticated ? {} : 'skip'
  );

  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncInFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      setSyncing(false);
      setSyncError(null);
      syncInFlightRef.current = false;
      return;
    }

    // Query still loading; wait to know whether a user record already exists.
    if (convexUser === undefined) return;

    // User already exists in Convex; no sync needed.
    if (convexUser) {
      setSyncing(false);
      setSyncError(null);
      return;
    }

    if (syncInFlightRef.current) return;

    const retryDelaysMs = [250, 750, 1500];

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const syncWithRetry = async () => {
      syncInFlightRef.current = true;
      setSyncing(true);
      setSyncError(null);

      try {
        let lastError: unknown = null;

        for (let attempt = 0; attempt < retryDelaysMs.length; attempt++) {
          try {
            await storeUser();
            if (!cancelled) {
              setSyncing(false);
              setSyncError(null);
            }
            syncInFlightRef.current = false;
            return;
          } catch (err) {
            lastError = err;
            if (attempt < retryDelaysMs.length - 1) {
              await sleep(retryDelaysMs[attempt]);
            }
          }
        }

        const message =
          lastError instanceof Error ? lastError.message : 'Unknown sync failure';
        console.error('Failed to sync user after retries:', lastError);
        if (!cancelled) {
          setSyncError(message);
          setSyncing(false);
        }
      } finally {
        syncInFlightRef.current = false;
      }
    };

    void syncWithRetry();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, convexUser, storeUser]);

  // Key fix: only treat "undefined convexUser" as loading when we ARE authenticated.
  // When not authenticated, query is skipped (returns undefined) — that is NOT a loading state.
  // Without this, unauthenticated visitors see the loading screen forever and never get
  // redirected to /sign-in.
  const isLoading = convexAuthLoading || syncing || (isAuthenticated && convexUser === undefined);

  return {
    user: convexUser,
    isLoading,
    isAuthenticated,
    syncError,
  };
}
