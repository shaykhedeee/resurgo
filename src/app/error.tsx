// ===============================================================================
// Resurgo - Error Page
// Handles runtime errors gracefully with error tracking
// ===============================================================================

'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { captureError } from '@/lib/sentry';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [errorId, setErrorId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Capture and log the error
    const id = captureError(error, {
      digest: error.digest,
      component: 'ErrorBoundary',
    });
    setErrorId(id);
    console.error('Application error:', error);
  }, [error]);

  const handleCopyErrorId = async () => {
    if (errorId) {
      await navigator.clipboard.writeText(errorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearAndReload = () => {
    // Clear localStorage and reload
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ascend-storage');
      localStorage.removeItem('ascend-user');
      window.location.href = '/';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">

        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            <span className="font-mono text-xs tracking-widest text-red-600">RESURGO_OS :: RUNTIME_EXCEPTION</span>
          </div>
          <div className="px-4 py-4">
            <p className="font-mono text-xs tracking-widest text-zinc-400">FAULT_HANDLER v2.1.0</p>
            <h1 className="mt-1 font-mono text-xl font-bold tracking-tight text-zinc-100">UNHANDLED_ERROR_DETECTED</h1>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              EXCEPTION_LOGGED :: DATA_INTEGRITY_MAINTAINED :: RECOVERY_OPTIONS_BELOW
            </p>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <button
            onClick={reset}
            className="flex w-full items-center justify-center border border-orange-800 bg-orange-950/30 px-6 py-3 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/50"
          >
            [RETRY_OPERATION]
          </button>
          <button
            onClick={handleClearAndReload}
            className="flex w-full items-center justify-center border border-zinc-800 bg-zinc-950 px-6 py-3 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
          >
            [CLEAR_STATE_AND_RESTART]
          </button>
        </div>

        <p className="mb-4 text-center font-mono text-xs tracking-widest text-zinc-400">
          PERSISTENT_ERROR &rarr; CLEAR_BROWSER_CACHE &rarr; CONTACT_SUPPORT
        </p>

        {errorId && (
          <div className="mb-4 flex items-center justify-between border border-zinc-900 bg-zinc-950 px-4 py-2">
            <span className="font-mono text-xs text-zinc-400">ERR_ID: {errorId}</span>
            <button
              onClick={handleCopyErrorId}
              className="border border-zinc-800 p-1 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-400"
              aria-label="Copy error ID"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        )}

        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="border border-red-900 bg-red-950/10 p-4">
            <p className="mb-1 font-mono text-xs tracking-widest text-red-700">DEV_STACK_TRACE</p>
            <p className="break-all font-mono text-xs text-red-500">{error.message}</p>
          </div>
        )}

      </div>
    </div>
  );
}
