'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — useStoreUser Hook
// Automatically syncs Clerk user to Convex on sign-in
// Use in any component that needs the current user
// ═══════════════════════════════════════════════════════════════════════════════

import { useUser } from '@clerk/nextjs';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';

export function useStoreUser() {
  // isLoading from useConvexAuth() is true while Clerk+Convex are handshaking
  const { isAuthenticated, isLoading: convexAuthLoading } = useConvexAuth();
  const { user: _clerkUser } = useUser();
  const storeUser = useMutation(api.users.store);
  const convexUser = useQuery(
    api.users.current,
    isAuthenticated ? {} : 'skip'
  );

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Sync user to Convex when authenticated
    setSyncing(true);
    storeUser()
      .then(() => setSyncing(false))
      .catch((err) => {
        console.error('Failed to sync user:', err);
        setSyncing(false);
      });
  }, [isAuthenticated, storeUser]);

  // Key fix: only treat "undefined convexUser" as loading when we ARE authenticated.
  // When not authenticated, query is skipped (returns undefined) — that is NOT a loading state.
  // Without this, unauthenticated visitors see the loading screen forever and never get
  // redirected to /sign-in.
  const isLoading = convexAuthLoading || syncing || (isAuthenticated && convexUser === undefined);

  return {
    user: convexUser,
    isLoading,
    isAuthenticated,
  };
}
