"use client";

import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';

export default function AccountPage() {
  const router = useRouter();
  const convexUser = useQuery(api.users.current, {});
  const tasks = useQuery(api.tasks.list, {});
  const habits = useQuery(api.habits.listAll, {});
  const goals = useQuery(api.goals.listAll, {});
  const [exporting, setExporting] = useState(false);

  const handleSignOut = async () => {
    try {
      await window.Clerk?.signOut?.();
    } catch (e) {
      console.error('Sign out error', e);
    }
    window.location.href = '/';
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.4.0',
        user: convexUser ? {
          name: convexUser.name,
          email: convexUser.email,
          plan: convexUser.plan,
          timezone: convexUser.timezone,
          createdAt: convexUser._creationTime,
          onboardingComplete: convexUser.onboardingComplete,
        } : null,
        tasks: tasks ?? [],
        habits: habits ?? [],
        goals: goals ?? [],
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resurgo-full-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!confirm('Delete your account and all local data? This cannot be undone.\n\nNote: To fully delete your account data, please also contact support@resurgo.life.')) return;
    try { localStorage.clear(); } catch (e) {}
    handleSignOut();
  };

  const userName = convexUser?.name ?? '...';
  const userEmail = convexUser?.email ?? '...';
  const userPlan = convexUser?.plan ?? 'free';

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-2xl">

        {/* ── HEADER ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">OPERATOR_ACCOUNT :: SYSTEM_PANEL</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">OPERATOR_ACCOUNT</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">PROFILE :: SUBSCRIPTION :: SECURITY :: DATA</p>
          </div>
        </div>

        {/* ── PROFILE ── */}
        <div className="mb-3 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">OPERATOR_PROFILE</span>
          </div>
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center border border-zinc-800 bg-black font-mono text-xl font-bold text-orange-600">
              {userName[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-zinc-200">{userName}</p>
              <p className="font-mono text-xs text-zinc-400">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* ── SUBSCRIPTION ── */}
        <div className="mb-3 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">SUBSCRIPTION_TIER</span>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <span className="font-mono text-xs tracking-widest text-zinc-400">
              PLAN :: <span className="text-orange-500">{(userPlan === 'free' ? 'FREE_TIER' : userPlan).toUpperCase()}</span>
            </span>
            <div className="flex gap-2">
              <button onClick={() => router.push('/pricing')} className="border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/50 min-h-[40px]">
                [CHANGE_PLAN]
              </button>
              <button onClick={() => router.push('/billing')} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700 min-h-[40px]">
                [BILLING]
              </button>
            </div>
          </div>
        </div>

        {/* ── SECURITY ── */}
        <div className="mb-3 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">SECURITY_SESSIONS</span>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <p className="font-mono text-xs text-zinc-400">SESSION_MANAGEMENT</p>
            <button onClick={handleSignOut} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700 min-h-[40px]">
              [SIGN_OUT_ALL]
            </button>
          </div>
        </div>

        {/* ── DATA ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">DATA_MANAGEMENT</span>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <p className="font-mono text-xs text-zinc-400">EXPORT_OR_PURGE_OPERATOR_DATA</p>
            <div className="flex gap-2">
              <button onClick={handleExport} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700 min-h-[40px]">
                {exporting ? '[EXPORTING...]' : '[EXPORT_DATA]'}
              </button>
              <button onClick={handleDeleteAccount} className="border border-red-900 bg-red-950/20 px-3 py-1.5 font-mono text-xs tracking-widest text-red-500 transition hover:bg-red-950/40 min-h-[40px]">
                [DELETE_ACCOUNT]
              </button>
            </div>
          </div>
        </div>

        {/* ── SIGN OUT ── */}
        <button
          onClick={handleSignOut}
          className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 min-h-[44px]"
        >
          [SIGN_OUT]
        </button>

      </div>
    </div>
  );
}
