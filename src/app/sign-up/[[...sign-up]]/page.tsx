import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <section className="w-full max-w-md border border-zinc-900 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">AUTH_TERMINAL :: NEW_OPERATOR</span>
          </div>
          <Link href="/" className="font-mono text-xs tracking-widest text-zinc-400 transition-colors hover:text-zinc-300">
            [← HOME]
          </Link>
        </div>
        <div className="p-4 md:p-6">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#EA580C',
                colorBackground: '#09090B',
                colorInputBackground: '#000000',
                colorInputText: '#FAFAF9',
                colorText: '#FAFAF9',
                colorTextSecondary: '#71717A',
                borderRadius: '0px',
              },
              elements: {
                card: 'shadow-none bg-transparent border-0 p-0',
                headerTitle: 'font-mono text-zinc-100',
                headerSubtitle: 'font-mono text-zinc-500',
                socialButtonsBlockButton:
                  'border border-zinc-800 bg-black hover:bg-zinc-950 text-zinc-300 font-mono',
                formButtonPrimary:
                  'bg-orange-700 hover:bg-orange-600 text-white font-mono',
                formFieldInput:
                  'border border-zinc-800 bg-black text-zinc-200 font-mono',
                footerActionLink: 'text-orange-500 hover:text-orange-400 font-mono',
                identityPreviewText: 'font-mono text-zinc-400',
              },
            }}
          />
        </div>
      </section>
    </main>
  );
}
