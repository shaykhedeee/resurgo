'use client';

// ─────────────────────────────────────────────────────────────────────────────
// RESURGO - Ebook Landing Client (Interactive Lead Capture)
// Brutalist Zinc & Orange HUD designed to convert high-output builders.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, FormEvent } from 'react';
import { Download, Mail, BookOpen, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EbookLandingClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `resurgo:lead_engine$ ${msg}`].slice(-4));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');
    setLogs([]);

    // Telemetry log simulator for premium cyberpunk feedback
    addLog('initializing_secure_handshake...');
    await new Promise((resolve) => setTimeout(resolve, 600));

    addLog('authenticating_email_domain...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'ebook_landing_page',
          offer: 'unshackled_ebook',
          variant: 'brutalist_lead_v1',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server validation failed');
      }

      addLog('lead_registered_in_convex...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      addLog('syncing_subscriber_to_buttondown...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      setStatus('success');
      addLog('handshake_complete :: dispatching_payload');

      // Trigger automatic direct browser download of the ebook!
      const link = document.createElement('a');
      link.href = '/downloads/productivity-blueprint.md';
      link.download = 'UNSHACKLED_productivity_blueprint.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'System failed to capture email. Please try again.');
      addLog('handshake_aborted :: error_handling_active');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── CHAPTER MAP (TELEMETRY VIEW) ── */}
      <div className="border border-zinc-900 bg-zinc-950/40 p-4 font-mono text-[10px] leading-relaxed text-zinc-500">
        <p className="border-b border-zinc-900 pb-2 text-[11px] font-bold text-zinc-400">
          // COMPRESSED_CURRICULUM_MATRIX :: 5_CORE_UNITS
        </p>
        <div className="mt-3 space-y-2.5">
          <div className="flex gap-2">
            <span className="text-orange-600 shrink-0">[U_01]</span>
            <div>
              <p className="text-zinc-300 font-bold uppercase tracking-wider">The Chemistry of Consistency</p>
              <p className="text-zinc-500">Integrating the Habit Loop, the 4 Laws of Behavior Change (Atomic Habits) & BJ Fogg's B=MAP formula.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-600 shrink-0">[U_02]</span>
            <div>
              <p className="text-zinc-300 font-bold uppercase tracking-wider">The Illusion of Isolated Metrics</p>
              <p className="text-zinc-500">Why isolated task lists reset your streaks, trigger the Abandonment Spiral, and how the Daily Synergy Score (DSS) solves it.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-600 shrink-0">[U_03]</span>
            <div>
              <p className="text-zinc-300 font-bold uppercase tracking-wider">Low-Friction ADHD Executive Ingestion</p>
              <p className="text-zinc-500">Clearing cognitive bandwidth through rapid brain dumps, and using agentic triage to seed actions without stress.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-600 shrink-0">[U_04]</span>
            <div>
              <p className="text-zinc-300 font-bold uppercase tracking-wider">The Multi-Business Scoping Protocol</p>
              <p className="text-zinc-500">Protecting context switching, applying Cal Newport's Deep Work triggers, and dividing projects to preserve stamina.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-600 shrink-0">[U_05]</span>
            <div>
              <p className="text-zinc-300 font-bold uppercase tracking-wider">Reclaiming Circadian Circuity</p>
              <p className="text-zinc-500">Syncing workflows with peak focus chronobiology windows, energy mapping, and adaptive rest configurations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE FORM ── */}
      <div className="border border-zinc-900 bg-zinc-950 p-6">
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                ENTER OPERATOR EMAIL
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  disabled={status === 'submitting'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="h-10 w-full border border-zinc-800 bg-black pl-10 pr-4 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-700" />
              </div>
            </div>

            {/* Simulated telemetry feedback during submit */}
            {logs.length > 0 && (
              <div className="border border-zinc-900/60 bg-black/60 p-2.5 font-mono text-[8px] text-orange-600/80 leading-relaxed uppercase">
                {logs.map((log, idx) => (
                  <p key={idx} className="truncate">{log}</p>
                ))}
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-start gap-2 border border-red-900 bg-red-950/20 p-3 text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="font-mono text-[10px] leading-relaxed uppercase">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting' || !email}
              className={cn(
                "w-full flex items-center justify-center gap-2 border h-10 font-mono text-[10px] tracking-widest transition-all cursor-pointer font-bold uppercase rounded-[2px]",
                status === 'submitting'
                  ? "border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed"
                  : "border-orange-600 bg-orange-950/20 text-orange-400 hover:bg-orange-600 hover:text-black"
              )}
            >
              <Download className="h-3.5 w-3.5" />
              {status === 'submitting' ? 'AUTHENTICATING...' : 'GET FREE LIFETIME BLUEPRINT'}
            </button>

            <div className="flex items-center justify-center gap-1.5 font-mono text-[8px] text-zinc-600 uppercase tracking-wider text-center">
              <ShieldCheck className="h-3 w-3 text-zinc-700" />
              <span>No spam. Instant direct download. Secure encryption.</span>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500 bg-emerald-950/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-widest">TRANSMISSION DISPATCHED</h3>
              <p className="font-mono text-[10px] text-zinc-400 leading-relaxed uppercase">
                Your blueprint `UNSHACKLED_productivity_blueprint.md` has been successfully compiled and triggered. Check your browser download queue!
              </p>
            </div>
            <div className="border border-zinc-900/60 bg-black/60 p-2.5 font-mono text-[8px] text-emerald-500/80 leading-relaxed uppercase">
              <p>resurgo:lead_engine$ lead_registered_successfully</p>
              <p>resurgo:lead_engine$ direct_file_delivery_dispatched</p>
              <p>resurgo:lead_engine$ session_closed_safely</p>
            </div>
            <div className="pt-2">
              <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                Didn't start downloading?{' '}
                <a
                  href="/downloads/productivity-blueprint.md"
                  download
                  className="text-orange-500 hover:underline cursor-pointer"
                >
                  Click here to force download
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
