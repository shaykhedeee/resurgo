// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Desktop Detection Utilities
// Detects whether we are running inside a Tauri desktop shell.
// This is the single source-of-truth guard used by all desktop-specific code.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Returns true when the app is running inside the Tauri desktop shell.
 * Works in both browser and SSR contexts (safe to call anywhere).
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  // window.__TAURI_INTERNALS__ is injected by Tauri when withGlobalTauri = true
  return !!(window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
}

/**
 * Returns true when we are in a regular browser (not Tauri, not SSR).
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && !isDesktop();
}

/**
 * Safe wrapper: runs `fn` only when inside Tauri.
 */
export function whenDesktop<T>(fn: () => T): T | null {
  if (!isDesktop()) return null;
  return fn();
}
