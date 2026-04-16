import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { AuthRuntimeBoundary } from '@/components/AuthRuntimeBoundary';
import { clerkAppearance, hasValidClerkKey } from '@/lib/auth/clerkAppearance';

export default function Page() {
  if (!hasValidClerkKey) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 overflow-hidden">
        <div className="w-full max-w-lg rounded-2xl border border-red-900/50 bg-red-950/15 p-6">
          <p className="font-mono text-xs tracking-widest text-red-400">AUTH_CONFIG_ERROR</p>
          <h1 className="mt-2 text-xl font-semibold text-zinc-100">Sign-up is temporarily unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            Clerk is not configured correctly in this deployment. Add a valid
            <code className="mx-1 rounded bg-black/40 px-1.5 py-0.5 text-zinc-100">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>
            and redeploy.
          </p>
          <div className="mt-5">
            <Link href="/" className="inline-flex items-center rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-orange-600/6 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-purple-600/4 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/3 rounded-full blur-[60px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.15) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Scanline effect */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:shadow-orange-600/40 transition-shadow">
              <span className="text-white font-bold text-base">R</span>
              <div className="absolute inset-0 rounded-lg border border-orange-400/20" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">RESURGO</span>
          </Link>
          <p className="text-zinc-500 text-xs mt-3 font-mono tracking-[0.2em]">EXECUTION OS · CREATE ACCOUNT</p>
        </div>

        {/* Instruction panel */}
        <div className="mb-5 border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="font-mono text-[10px] tracking-[0.15em] text-green-500/90 uppercase">New Operator Setup</p>
          </div>
          <ol className="space-y-1.5 font-mono text-xs text-zinc-400">
            <li className="flex gap-2"><span className="text-zinc-600 select-none">01</span> Create your account with email</li>
            <li className="flex gap-2"><span className="text-zinc-600 select-none">02</span> Complete verification if prompted</li>
            <li className="flex gap-2"><span className="text-zinc-600 select-none">03</span> Set your first goal in <span className="text-green-400">under 5 minutes</span></li>
          </ol>
        </div>

        {/* Main card */}
        <div className="border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Terminal bar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 font-mono text-[10px] tracking-widest text-zinc-400">
                <span className="text-green-500 animate-pulse mr-1">●</span> AUTH :: NEW_OPERATOR
              </span>
            </div>
            <Link href="/" className="font-mono text-[10px] tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors">
              [← HOME]
            </Link>
          </div>

          <div className="p-6 sm:p-7">
            <AuthRuntimeBoundary mode="sign-up">
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            </AuthRuntimeBoundary>
          </div>
        </div>

        {/* What you get section */}
        <div className="mt-5 border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm rounded-xl px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase mb-2.5">Free forever includes</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono"><span className="text-orange-500 text-[8px]">▸</span> 5 AI Coaches</span>
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono"><span className="text-orange-500 text-[8px]">▸</span> Habit Tracking</span>
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono"><span className="text-orange-500 text-[8px]">▸</span> Focus Timers</span>
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono"><span className="text-orange-500 text-[8px]">▸</span> Weekly Reviews</span>
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono"><span className="text-orange-500 text-[8px]">▸</span> Goal System</span>
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono"><span className="text-orange-500 text-[8px]">▸</span> Daily Planning</span>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-4 flex items-center justify-center gap-5">
          <span className="text-zinc-600 text-[10px] flex items-center gap-1.5 font-mono tracking-wide">
            <span className="text-green-500">●</span> Encrypted
          </span>
          <span className="text-zinc-700 select-none">·</span>
          <span className="text-zinc-600 text-[10px] flex items-center gap-1.5 font-mono tracking-wide">
            <span className="text-orange-500">●</span> No credit card
          </span>
          <span className="text-zinc-700 select-none">·</span>
          <span className="text-zinc-600 text-[10px] flex items-center gap-1.5 font-mono tracking-wide">
            <span className="text-blue-400">●</span> Privacy first
          </span>
        </div>

        <p className="mt-4 text-center text-zinc-500 text-xs">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </main>
  );
}
