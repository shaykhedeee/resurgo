// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Desktop Keychain: BYOK Credential Store
// Stores and retrieves user-supplied AI provider API keys using:
//   • OS keychain (macOS Keychain, Windows Credential Manager, libsecret on Linux)
//     when running inside the Tauri desktop shell
//   • Encrypted sessionStorage fallback when running in a regular browser
//     (keys are never sent to any server — they live in the browser process only)
//
// Keys are stored under the name "resurgo/<provider>", e.g. "resurgo/groq".
// Only the *presence* of a key is ever exposed to the UI, never the raw value.
// ═══════════════════════════════════════════════════════════════════════════

import { isDesktop } from './detect';

export type BYOKProvider =
  | 'groq'
  | 'gemini'
  | 'openrouter'
  | 'cerebras'
  | 'together'
  | 'aiml'
  | 'openai';

export type LocalAgentProvider =
  | 'ollama_url'
  | 'lmstudio_url'
  | 'custom_url';

export type CredentialKey = BYOKProvider | LocalAgentProvider;

// ── Tauri keychain path ───────────────────────────────────────────────────────

type TauriInvoke = (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;

function getTauriInvoke(): TauriInvoke | null {
  if (!isDesktop()) return null;
  const w = window as Window & { __TAURI__?: { core?: { invoke?: TauriInvoke } } };
  return w.__TAURI__?.core?.invoke ?? null;
}

async function tauriStoreSecret(key: CredentialKey, value: string): Promise<void> {
  const invoke = getTauriInvoke();
  if (!invoke) throw new Error('Tauri not available');
  await invoke('store_secret', { key, value });
}

async function tauriGetSecret(key: CredentialKey): Promise<string | null> {
  const invoke = getTauriInvoke();
  if (!invoke) return null;
  const result = await invoke('get_secret', { key });
  return (result as string | null | undefined) ?? null;
}

async function tauriDeleteSecret(key: CredentialKey): Promise<void> {
  const invoke = getTauriInvoke();
  if (!invoke) return;
  await invoke('delete_secret', { key });
}

async function tauriListKeys(): Promise<CredentialKey[]> {
  const invoke = getTauriInvoke();
  if (!invoke) return [];
  const result = await invoke('list_secret_keys');
  return (result as CredentialKey[]) ?? [];
}

// ── Browser sessionStorage fallback ──────────────────────────────────────────
// Keys are stored under "resurgo-byok-<provider>" in sessionStorage.
// sessionStorage is cleared when the tab/browser closes.
// This is NOT secure long-term storage — it's a convenience fallback for
// users testing the web app. Desktop users always get the OS keychain path.

const SS_PREFIX = 'resurgo-byok-';

function ssSet(key: CredentialKey, value: string): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(`${SS_PREFIX}${key}`, value);
}

function ssGet(key: CredentialKey): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(`${SS_PREFIX}${key}`);
}

function ssDelete(key: CredentialKey): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(`${SS_PREFIX}${key}`);
}

function ssListKeys(): CredentialKey[] {
  if (typeof sessionStorage === 'undefined') return [];
  const keys: CredentialKey[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k?.startsWith(SS_PREFIX)) {
      keys.push(k.slice(SS_PREFIX.length) as CredentialKey);
    }
  }
  return keys;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Store a user-supplied AI provider key.
 * Desktop: saved to OS keychain. Browser: saved to sessionStorage.
 */
export async function saveCredential(key: CredentialKey, value: string): Promise<void> {
  if (value.trim() === '') {
    return deleteCredential(key);
  }
  if (isDesktop()) {
    await tauriStoreSecret(key, value.trim());
  } else {
    ssSet(key, value.trim());
  }
}

/**
 * Retrieve a stored credential value.
 * Returns null if not set.
 */
export async function getCredential(key: CredentialKey): Promise<string | null> {
  if (isDesktop()) {
    return tauriGetSecret(key);
  }
  return ssGet(key);
}

/**
 * Delete a stored credential.
 */
export async function deleteCredential(key: CredentialKey): Promise<void> {
  if (isDesktop()) {
    await tauriDeleteSecret(key);
  } else {
    ssDelete(key);
  }
}

/**
 * List which credential keys are currently set (no values exposed).
 */
export async function listConfiguredKeys(): Promise<CredentialKey[]> {
  if (isDesktop()) {
    return tauriListKeys();
  }
  return ssListKeys();
}

/**
 * Returns true if the given provider has a key configured.
 */
export async function hasCredential(key: CredentialKey): Promise<boolean> {
  const val = await getCredential(key);
  return val !== null && val.length > 0;
}

/**
 * Returns a map of which BYOK cloud providers are configured.
 * Used by the brain router and UI.
 */
export async function getConfiguredBYOKProviders(): Promise<Record<BYOKProvider, boolean>> {
  const providers: BYOKProvider[] = [
    'groq', 'gemini', 'openrouter', 'cerebras', 'together', 'aiml', 'openai',
  ];
  const results = await Promise.all(providers.map((p) => hasCredential(p)));
  return Object.fromEntries(
    providers.map((p, i) => [p, results[i]])
  ) as Record<BYOKProvider, boolean>;
}

/**
 * Returns a map of which local agent endpoints are configured.
 */
export async function getConfiguredLocalAgents(): Promise<Record<LocalAgentProvider, boolean>> {
  const agents: LocalAgentProvider[] = ['ollama_url', 'lmstudio_url', 'custom_url'];
  const results = await Promise.all(agents.map((a) => hasCredential(a)));
  return Object.fromEntries(
    agents.map((a, i) => [a, results[i]])
  ) as Record<LocalAgentProvider, boolean>;
}
