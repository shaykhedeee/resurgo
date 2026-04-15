'use client';

// ─────────────────────────────────────────────────────────────────────────────
// /link-telegram — OAuth-style account linking page
// User arrives here after clicking the auth link sent by the Telegram bot.
// If logged in: calls linkAccount mutation → shows success + Telegram deep link.
// If not logged in: redirects to sign-in with ?redirect_url back here.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey =
  !!clerkPublishableKey &&
  clerkPublishableKey.startsWith('pk_') &&
  !/REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);

type LinkState = 'idle' | 'linking' | 'success' | 'error' | 'already_linked';

function LinkTelegramPageWithAuth() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const linkAccount = useMutation(api.telegram.linkAccount);

  const [state, setState] = useState<LinkState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [_telegramChatId, setTelegramChatId] = useState('');

  // Auto-attempt linking once Clerk loads and user is signed in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token || state !== 'idle') return;

    const doLink = async () => {
      setState('linking');
      try {
        const result = await linkAccount({ clerkId: clerkUser.id, token });
        if (result.success) {
          setTelegramChatId(result.telegramChatId);
          setState('success');
        } else {
          setErrorMsg(result.error);
          setState('error');
        }
      } catch (_err) {
        setErrorMsg('Something went wrong. Please try again.');
        setState('error');
      }
    };

    doLink();
  }, [isLoaded, isSignedIn, token, state, clerkUser, linkAccount]);

  // ── Not loaded yet ────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <Shell>
        <span className="text-zinc-400 font-mono text-xs tracking-widest animate-pulse">
          LOADING...
        </span>
      </Shell>
    );
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!isSignedIn) {
    return (
      <Shell>
        <p className="text-zinc-300 font-mono text-sm mb-2">Sign in to link your Telegram account.</p>
        <p className="text-zinc-500 font-mono text-xs mb-6">
          After signing in you&apos;ll be returned to this page to complete the link.
        </p>
        <SignInButton
          mode="redirect"
          forceRedirectUrl={`/link-telegram?token=${token}`}
        >
          <button className="border border-orange-600 px-6 py-2 font-mono text-xs tracking-widest text-orange-400 hover:bg-orange-600/10 transition">
            SIGN IN →
          </button>
        </SignInButton>
      </Shell>
    );
  }

  // ── No token ─────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <Shell>
        <p className="text-red-400 font-mono text-sm">Missing link token.</p>
        <p className="text-zinc-500 font-mono text-xs mt-2">
          Open Telegram and send <code className="text-orange-400">/start</code> to get a new link.
        </p>
      </Shell>
    );
  }

  // ── Linking in progress ───────────────────────────────────────────────────
  if (state === 'idle' || state === 'linking') {
    return (
      <Shell>
        <span className="text-orange-400 font-mono text-xs tracking-widest animate-pulse">
          LINKING ACCOUNT...
        </span>
      </Shell>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <Shell>
        <p className="text-red-400 font-mono text-sm mb-2">❌ Link failed</p>
        <p className="text-zinc-400 font-mono text-xs mb-6">{errorMsg}</p>
        <p className="text-zinc-500 font-mono text-xs">
          Open Telegram and send <code className="text-orange-400">/start</code> to get a new link.
        </p>
      </Shell>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div className="text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h1 className="font-mono text-sm tracking-widest text-zinc-200 mb-2">
          TELEGRAM LINKED
        </h1>
        <p className="text-zinc-400 font-mono text-xs mb-6">
          Your Telegram account is now connected to Resurgo.
        </p>

        <div className="border border-zinc-800 bg-zinc-950 p-4 mb-6 text-left">
          <p className="font-mono text-xs text-zinc-500 mb-3 tracking-widest">QUICK COMMANDS</p>
          <ul className="space-y-1 font-mono text-xs text-zinc-400">
            <li><span className="text-orange-400">/digest</span> — today&apos;s plan</li>
            <li><span className="text-orange-400">/task</span> &lt;text&gt; — create a task</li>
            <li><span className="text-orange-400">/habits</span> — view today&apos;s habits</li>
            <li><span className="text-orange-400">/coach</span> &lt;message&gt; — AI coaching</li>
            <li><span className="text-orange-400">/remind</span> &lt;text&gt; in 2 hours — set reminder</li>
          </ul>
        </div>

        <a
          href="https://t.me/"
          className="inline-block border border-orange-600 px-6 py-2 font-mono text-xs tracking-widest text-orange-400 hover:bg-orange-600/10 transition"
        >
          OPEN TELEGRAM →
        </a>
      </div>
    </Shell>
  );
}

export default function LinkTelegramPage() {
  if (!hasValidClerkKey) {
    return (
      <Shell>
        <p className="text-red-400 font-mono text-sm mb-2">Telegram linking unavailable</p>
        <p className="text-zinc-400 font-mono text-xs">
          Clerk authentication is not configured for this environment.
        </p>
      </Shell>
    );
  }

  return <LinkTelegramPageWithAuth />;
}

// ── Shared shell wrapper ──────────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-zinc-900 bg-zinc-950 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-6 w-6 border border-orange-600/60 flex items-center justify-center">
            <span className="text-orange-500 font-mono text-xs font-bold">R</span>
          </div>
          <span className="font-mono text-xs tracking-widest text-zinc-300">RESURGO × TELEGRAM</span>
        </div>

        {children}
      </div>
    </div>
  );
}
