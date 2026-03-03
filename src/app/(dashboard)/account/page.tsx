"use client";

import { useRouter } from 'next/navigation';
import { useAscendStore } from '@/lib/store';
import { useState } from 'react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, resetStore } = useAscendStore();
  const [exporting, setExporting] = useState(false);

  const handleSignOut = () => {
    try { logout(); } catch (e) {}
    router.push('/');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Grab persisted store if available
      const raw = localStorage.getItem('ascend-storage') || JSON.stringify(useAscendStore.getState());
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resurgo-account-export-${Date.now()}.json`;
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
    if (!confirm('Delete your account and all local data? This cannot be undone.')) return;
    try { resetStore(); } catch (e) {}
    try { logout(); } catch (e) {}
    router.push('/');
  };

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
              {user?.name?.[0] ?? 'U'}
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-zinc-200">{user?.name}</p>
              <p className="font-mono text-xs text-zinc-400">{user?.email}</p>
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
              PLAN :: <span className="text-orange-500">{(user?.plan === 'free' ? 'FREE_TIER' : user?.plan ?? 'FREE_TIER').toUpperCase()}</span>
            </span>
            <div className="flex gap-2">
              <button onClick={() => router.push('/pricing')} className="border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/50">
                [CHANGE_PLAN]
              </button>
              <button onClick={() => alert('Manage billing (server integration required)')} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700">
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
            <p className="font-mono text-xs text-zinc-400">ACTIVE_SESSION_MANAGEMENT :: COMING_SOON</p>
            <button onClick={() => alert('Sign out from other devices (server required)')} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700">
              [REVOKE_SESSIONS]
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
              <button onClick={handleExport} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700">
                {exporting ? '[EXPORTING...]' : '[EXPORT_DATA]'}
              </button>
              <button onClick={handleDeleteAccount} className="border border-red-900 bg-red-950/20 px-3 py-1.5 font-mono text-xs tracking-widest text-red-500 transition hover:bg-red-950/40">
                [DELETE_ACCOUNT]
              </button>
            </div>
          </div>
        </div>

        {/* ── SIGN OUT ── */}
        <button
          onClick={() => { window.Clerk?.signOut?.(); window.location.href = '/'; }}
          className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
        >
          [SIGN_OUT]
        </button>

      </div>
    </div>
  );
}
