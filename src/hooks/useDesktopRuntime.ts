// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — useDesktopRuntime Hook
// Provides desktop-specific state to React components:
//   • Whether we are in the desktop shell
//   • Current brain routing policy (cloud / local / byok / hybrid)
//   • Local agent status (reachable + available models)
//   • Which BYOK providers are configured
//   • Helpers to change the policy and save/delete credentials
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  isDesktop,
  loadBrainPolicy,
  saveBrainPolicy,
  getAvailableSources,
  saveCredential,
  deleteCredential,
  type BrainPolicy,
  type BYOKProvider,
  type LocalAgentStatus,
  type CredentialKey,
} from '@/lib/desktop';

export interface DesktopRuntimeState {
  /** True when running inside the Tauri desktop app */
  isDesktopApp: boolean;

  /** Current AI routing policy */
  policy: BrainPolicy;

  /** True while probing providers */
  checking: boolean;

  /** First reachable local agent (null if none) */
  localAgent: LocalAgentStatus | null;

  /** List of BYOK cloud providers that have keys configured */
  byokProviders: BYOKProvider[];

  /** Change and persist the routing policy */
  setPolicy: (p: BrainPolicy) => void;

  /** Save a credential (provider key or local agent URL) */
  saveKey: (key: CredentialKey, value: string) => Promise<void>;

  /** Delete a credential */
  deleteKey: (key: CredentialKey) => Promise<void>;

  /** Re-probe all sources */
  refresh: () => Promise<void>;
}

const INITIAL_STATE: DesktopRuntimeState = {
  isDesktopApp: false,
  policy: 'hybrid',
  checking: false,
  localAgent: null,
  byokProviders: [],
  setPolicy: () => {},
  saveKey: async () => {},
  deleteKey: async () => {},
  refresh: async () => {},
};

export function useDesktopRuntime(): DesktopRuntimeState {
  const [isDesktopApp] = useState(() => isDesktop());
  const [policy, setPolicyState] = useState<BrainPolicy>(() => loadBrainPolicy());
  const [checking, setChecking] = useState(false);
  const [localAgent, setLocalAgent] = useState<LocalAgentStatus | null>(null);
  const [byokProviders, setByokProviders] = useState<BYOKProvider[]>([]);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const { local, byokProviders: byok } = await getAvailableSources();
      if (!mounted.current) return;
      setLocalAgent(local);
      setByokProviders(byok);
    } finally {
      if (mounted.current) setChecking(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    // Re-probe every 60 seconds while the component is mounted
    const interval = setInterval(() => void refresh(), 60_000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [refresh]);

  const setPolicy = useCallback((p: BrainPolicy) => {
    saveBrainPolicy(p);
    setPolicyState(p);
  }, []);

  const saveKey = useCallback(async (key: CredentialKey, value: string) => {
    await saveCredential(key, value);
    // Re-probe after saving to update availability
    void refresh();
  }, [refresh]);

  const deleteKey = useCallback(async (key: CredentialKey) => {
    await deleteCredential(key);
    void refresh();
  }, [refresh]);

  return {
    isDesktopApp,
    policy,
    checking,
    localAgent,
    byokProviders,
    setPolicy,
    saveKey,
    deleteKey,
    refresh,
  };
}
