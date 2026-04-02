import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

// Inline-style approach ensures Clerk elements are visible regardless of
// Tailwind JIT purging or CSS specificity battles.
const clerkAppearance = {
  variables: {
    colorPrimary: '#EA580C',
    colorBackground: '#18181b',
    colorInputBackground: '#27272a',
    colorInputText: '#f4f4f5',
    colorText: '#f4f4f5',
    colorTextSecondary: '#d4d4d8',
    colorTextOnPrimaryBackground: '#ffffff',
    colorNeutral: '#a1a1aa',
    colorDanger: '#f87171',
    colorSuccess: '#4ade80',
    colorWarning: '#fbbf24',
    borderRadius: '0.5rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '14px',
    spacingUnit: '4px',
  },
  elements: {
    rootBox: { width: '100%' },
    card: {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
      width: '100%',
    },
    headerTitle: {
      color: '#f4f4f5',
      fontWeight: '700',
      fontSize: '1.125rem',
    },
    headerSubtitle: {
      color: '#a1a1aa',
      fontSize: '0.875rem',
    },
    socialButtonsBlockButton: {
      background: '#27272a',
      border: '1px solid #3f3f46',
      borderRadius: '0.5rem',
      color: '#e4e4e7',
      fontWeight: '500',
      transition: 'background 0.15s, border-color 0.15s',
    },
    socialButtonsBlockButtonText: {
      color: '#e4e4e7',
      fontWeight: '500',
    },
    dividerLine: { background: '#3f3f46' },
    dividerText: {
      color: '#71717a',
      fontSize: '0.75rem',
      background: '#18181b',
      padding: '0 0.5rem',
    },
    formFieldLabel: {
      color: '#e4e4e7',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '4px',
      display: 'block',
    },
    formFieldInput: {
      background: '#27272a',
      border: '1.5px solid #52525b',
      borderRadius: '0.5rem',
      color: '#f4f4f5',
      fontSize: '0.875rem',
      padding: '10px 12px',
      width: '100%',
      outline: 'none',
      transition: 'border-color 0.15s',
    },
    formFieldInputShowPasswordButton: {
      color: '#a1a1aa',
    },
    formButtonPrimary: {
      background: '#EA580C',
      borderRadius: '0.5rem',
      color: '#ffffff',
      fontWeight: '700',
      fontSize: '0.875rem',
      padding: '10px 16px',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    footerActionLink: {
      color: '#f97316',
      fontWeight: '500',
      textDecoration: 'none',
    },
    footerActionText: { color: '#a1a1aa' },
    footerAction: {
      borderTop: '1px solid #27272a',
      paddingTop: '1rem',
      marginTop: '1rem',
    },
    identityPreviewText: { color: '#d4d4d8' },
    identityPreviewEditButton: { color: '#f97316' },
    formFieldSuccessText: { color: '#4ade80', fontSize: '0.75rem' },
    formFieldErrorText: { color: '#f87171', fontSize: '0.75rem', marginTop: '4px' },
    alert: {
      background: 'rgba(127,29,29,0.3)',
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: '0.5rem',
      padding: '12px',
    },
    alertText: { color: '#fca5a5', fontSize: '0.875rem' },
    formResendCodeLink: { color: '#f97316' },
    otpCodeFieldInput: {
      background: '#27272a',
      border: '1.5px solid #52525b',
      borderRadius: '0.5rem',
      color: '#f4f4f5',
      textAlign: 'center',
      fontWeight: '700',
    },
    formFieldCheckboxInput: {
      background: '#27272a',
      border: '1.5px solid #52525b',
      borderRadius: '4px',
    },
    formFieldCheckboxLabel: { color: '#d4d4d8' },
    navbar: { display: 'none' },
    pageScrollBox: { padding: 0 },
  },
};

export default function Page() {
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
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-7 h-7 bg-orange-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">RESURGO</span>
          </Link>
          <p className="text-zinc-500 text-xs mt-2 font-mono tracking-widest">PERFORMANCE OS · SIGN IN</p>
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
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              appearance={clerkAppearance}
            />

            {/* Help note */}
            <p className="mt-4 text-[11px] leading-relaxed text-zinc-600 border-t border-zinc-800 pt-3">
              <span className="text-zinc-500 font-medium">PASSWORD_BREACH_ERROR?</span>{' '}
              Use the{' '}
              <span className="text-orange-500">Forgot password?</span> link above to reset,
              or choose a unique password.
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
