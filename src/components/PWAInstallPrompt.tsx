// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — PWA Install Prompt
// Shows "Add to Home Screen" banner when browser fires beforeinstallprompt.
// Works on Android Chrome/Edge/Samsung. iOS Safari gets a manual-step hint.
// Uses terminal/zinc design system to match the rest of the app.
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Already installed as PWA — never show
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true);
    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Previously dismissed within 7 days
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    // iOS Safari — no beforeinstallprompt; show manual tip instead
    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !/(chrome|crios|fxios|opios)/i.test(ua);
    setIsIOS(iosDevice);

    // Chrome / Edge / Samsung Internet — native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 15000); // 15 s after the prompt fires
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS: show tip after 45 s of use
    if (iosDevice) {
      const t = setTimeout(() => setShowPrompt(true), 45000);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    void deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isInstalled || dismissed || !showPrompt) return null;

  // ── iOS Safari — manual instructions ───────────────────────────────────────
  if (isIOS) {
    return (
      <div
        role="banner"
        aria-label="Install Resurgo app"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950 px-4 py-3 shadow-2xl"
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Image src="/icons/icon-192x192.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] font-bold tracking-widest text-orange-400 uppercase">
              Add to Home Screen
            </p>
            <p className="font-mono text-xs text-zinc-400 leading-snug mt-0.5">
              Tap <Share className="inline h-3 w-3 text-zinc-300 align-middle" />{' '}
              then{' '}
              <strong className="text-zinc-200">&ldquo;Add to Home Screen&rdquo;</strong>
              {' '}for the app.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 p-1 text-zinc-600 hover:text-zinc-300 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Android / Desktop Chrome / Edge ────────────────────────────────────────
  return (
    <div
      role="banner"
      aria-label="Install Resurgo app"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950 px-4 py-3 shadow-2xl"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <Image src="/icons/icon-192x192.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-xl" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-400 uppercase">
            Install_Resurgo
          </p>
          <p className="font-mono text-xs text-zinc-400">
            Add to home screen — no app store required.
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-mono text-xs tracking-widest text-orange-400 transition hover:bg-orange-950/60 active:scale-95"
        >
          <Download className="h-3 w-3" />
          [INSTALL]
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 p-1 text-zinc-600 hover:text-zinc-300 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
