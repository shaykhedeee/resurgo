import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { AuthRuntimeBoundary } from '@/components/AuthRuntimeBoundary';
import { clerkAppearance, hasValidClerkKey } from '@/lib/auth/clerkAppearance';

export default function Page() {
  if (!hasValidClerkKey) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 overflow-hidden">
        <div className="w-full max-w-lg rounded-2xl border border-red-900/50 bg-red-950/15 p-6">
          <p className="font-mono text-xs tracking-widest text-red-400">AUTH_CONFIG_ERROR</p>
          <h1 className="mt-2 text-xl font-semibold text-zinc-100">Sign-in is temporarily unavailable</h1>
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
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/4 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgb(255 255 255 / 0.15) 1px,transparent 1px),linear-gradient(90deg,rgb(255 255 255 / 0.15) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="mb-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-7 h-7 bg-orange-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">RESURGO</span>
          </Link>
          <p className="text-zinc-500 text-xs mt-2 font-mono tracking-widest">EXECUTION OS · SIGN IN</p>
        </div>

        <div className="mb-4 border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="font-mono text-[10px] tracking-widest text-orange-500">EMAIL_FIRST_SIGN_IN_FLOW</p>
          <ol className="mt-2 space-y-1 font-mono text-xs text-zinc-400">
            <li>1. Enter your account email in the form below.</li>
            <li>2. If a previous identity appears, select <span className="text-zinc-200">Use another account</span> to enter a different email.</li>
            <li>3. Use <span className="text-zinc-200">Forgot password</span> if you need a secure reset link.</li>
          </ol>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-zinc-500">
            Expected behavior: sign in with your email, then continue directly to your execution dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="border border-zinc-800 bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Terminal bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
              </div>
              <span className="ml-2 font-mono text-[10px] tracking-widest text-orange-500">
                <span className="text-orange-600 animate-pulse mr-1">●</span> AUTH_TERMINAL :: SIGN_IN
              </span>
            </div>
            <Link href="/" className="font-mono text-[10px] tracking-widest text-zinc-500 hover:text-zinc-300 transition">
              [← HOME]
            </Link>
          </div>

          <div className="p-6">
            <AuthRuntimeBoundary mode="sign-in">
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            </AuthRuntimeBoundary>

            <p className="mt-4 text-[11px] leading-relaxed text-zinc-600 border-t border-zinc-800 pt-3">
              For account security, always sign in with your registered email. If an email is preselected and incorrect, switch account before continuing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-zinc-600 text-[11px]">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-orange-500 hover:text-orange-400 transition">
            Create one free
          </Link>
        </p>
      </div>
    </main>
  );
}
