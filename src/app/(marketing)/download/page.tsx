import type { Metadata } from 'next';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Download Resurgo — Install on Android, iOS, Windows & macOS',
  description:
    'Download Resurgo on Android (APK), iPhone, iPad, Windows or macOS. Install the AI productivity app directly — no app store required.',
  keywords: [
    'Resurgo download', 'Resurgo APK', 'Resurgo Android download',
    'install Resurgo iPhone', 'AI productivity app download',
    'progressive web app install', 'Resurgo Windows', 'Resurgo macOS',
  ],
  alternates: { canonical: '/download' },
  openGraph: {
    title: 'Download Resurgo — Android · iOS · Windows · macOS',
    description: 'Download Resurgo on any device. Android APK ready. iOS, Windows & macOS installs available.',
    type: 'website',
    url: '/download',
  },
};

// ─── Android APK install steps ───────────────────────────────────────────────
const ANDROID_APK_STEPS = [
  { step: 1, text: 'Tap "Download APK" above and save the file.' },
  { step: 2, text: 'Open your Downloads folder and tap the .apk file.' },
  { step: 3, text: 'If prompted, allow "Install from unknown sources" for your browser.' },
  { step: 4, text: 'Tap Install → Open. Sign in with your Resurgo account.' },
];

const ANDROID_PWA_STEPS = [
  { step: 1, text: 'Open resurgo.life in Chrome or Samsung Internet.' },
  { step: 2, text: 'Tap the menu (⋮) then "Add to Home screen".' },
  { step: 3, text: 'Tap "Add" — the Resurgo icon appears on your home screen.' },
  { step: 4, text: 'Open from home screen and allow push notifications when prompted.' },
];

const IOS_STEPS = [
  { step: 1, text: 'Open resurgo.life in Safari (must be Safari, not Chrome).' },
  { step: 2, text: 'Tap the Share button (□↑) in Safari\'s toolbar.' },
  { step: 3, text: 'Scroll down and tap "Add to Home Screen".' },
  { step: 4, text: 'Tap "Add" — Resurgo appears on your home screen like a native app.' },
];

const FEATURES = [
  { label: 'FAST_LAUNCH',      desc: 'Opens instantly from your home screen or dock — no browser tabs.' },
  { label: 'OFFLINE_READY',    desc: 'Key screens cache locally. Actions queue and sync when reconnected.' },
  { label: 'FULL_DASHBOARD',   desc: 'Every feature: habits, tasks, goals, AI coaches, weekly reviews.' },
  { label: 'CLOUD_SYNC',       desc: 'Sign in once — all data syncs across every device automatically.' },
  { label: 'PUSH_NOTIFICATIONS', desc: 'Streak reminders, morning briefings, and coach nudges (iOS 16.4+, Android).' },
  { label: 'FREE_TO_INSTALL',  desc: 'No app store account needed. Install directly from your browser.' },
];


// APK download URL — points to GitHub Releases until self-hosted APK is uploaded
// TODO: after uploading APK to /public/downloads/resurgo-latest.apk, change back to:
//   'https://resurgo.life/downloads/resurgo-latest.apk'
const APK_URL = 'https://github.com/shaykhedeee/resurgo/releases/latest';
const APK_VERSION = 'v1.0.0';

// ─── Shared step list ─────────────────────────────────────────────────────────
function StepList({
  steps,
  color = 'orange',
}: {
  steps: { step: number; text: string }[];
  color?: 'orange' | 'blue';
}) {
  const border = color === 'blue' ? 'border-blue-800 bg-blue-950/30 text-blue-400' : 'border-orange-800 bg-orange-950/30 text-orange-400';
  return (
    <ol className="space-y-3">
      {steps.map((s) => (
        <li key={s.step} className="flex gap-3">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border font-pixel text-[0.5rem] ${border}`}>
            {s.step}
          </span>
          <p className="font-terminal text-xs leading-relaxed text-zinc-400">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

// ─── Section kicker ───────────────────────────────────────────────────────────
function Kicker({ text, color = 'text-orange-500' }: { text: string; color?: string }) {
  return <p className={`font-pixel text-[0.45rem] tracking-widest ${color} mb-1`}>{text}</p>;
}

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-zinc-900 px-6 pb-16 pt-20 text-center">
        <div className="mx-auto max-w-2xl">
          <Kicker text="GET_RESURGO :: INSTALL_ON_YOUR_DEVICE" />
          <h1 className="font-pixel text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Download Resurgo
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-terminal text-sm leading-relaxed text-zinc-400">
            Install Resurgo natively on Android, iPhone, Windows or macOS. No app store needed — download direct, install in under a minute.
          </p>
          {/* Platform pill badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: '⬇ Android APK', color: 'border-green-800 text-green-400 bg-green-950/20' },
              { label: '◎ iOS Safari', color: 'border-blue-800 text-blue-400 bg-blue-950/20' },
              { label: '◌ Windows', color: 'border-zinc-700 text-zinc-500 bg-zinc-900/40' },
              { label: '◌ macOS', color: 'border-zinc-700 text-zinc-500 bg-zinc-900/40' },
            ].map((p) => (
              <span key={p.label} className={`border px-3 py-1 font-pixel text-[0.45rem] tracking-wider ${p.color}`}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4-CARD PLATFORM GRID ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Kicker text="CHOOSE_YOUR_PLATFORM" />
        <h2 className="mb-10 font-pixel text-xl text-zinc-200">Pick your device</h2>

        <div className="grid gap-5 sm:grid-cols-2">

          {/* ── ANDROID ───────────────────────────────────────────────────── */}
          <div className="border-2 border-green-900 bg-zinc-950 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.6)]">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Kicker text="ANDROID" color="text-green-400" />
                <h3 className="font-pixel text-base text-zinc-100">Android</h3>
                <p className="mt-0.5 font-terminal text-xs text-zinc-500">APK direct download · or install via Chrome</p>
              </div>
              <span className="border border-green-800 bg-green-950/30 px-2 py-1 font-pixel text-[0.4rem] tracking-widest text-green-400">
                {APK_VERSION}
              </span>
            </div>

            {/* APK download button */}
            <a
              href={APK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 flex w-full items-center justify-center gap-2 border-2 border-green-700 bg-green-700 px-4 py-3 font-terminal text-sm font-bold text-white shadow-[3px_3px_0px_rgba(0,0,0,0.6)] transition hover:bg-green-600 active:translate-x-px active:translate-y-px"
            >
              ⬇&nbsp;&nbsp;Download APK ({APK_VERSION})
            </a>
            <p className="mb-5 font-terminal text-[0.6rem] text-zinc-600">
              SHA-256 checksum listed on the GitHub release page · Android 8.0+ required
            </p>

            {/* APK install steps */}
            <details className="group mb-4">
              <summary className="mb-3 cursor-pointer font-pixel text-[0.45rem] tracking-widest text-green-500 group-open:text-green-300">
                HOW_TO_INSTALL_APK ▾
              </summary>
              <StepList steps={ANDROID_APK_STEPS} color="orange" />
            </details>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="font-pixel text-[0.38rem] tracking-widest text-zinc-700">OR_USE_BROWSER</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* PWA fallback */}
            <details className="group">
              <summary className="mb-3 cursor-pointer font-pixel text-[0.45rem] tracking-widest text-zinc-500 group-open:text-zinc-300">
                INSTALL_VIA_CHROME_INSTEAD ▾
              </summary>
              <StepList steps={ANDROID_PWA_STEPS} color="orange" />
            </details>
          </div>

          {/* ── iOS ───────────────────────────────────────────────────────── */}
          <div className="border-2 border-blue-900 bg-zinc-950 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.6)]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Kicker text="IPHONE_/_IPAD" color="text-blue-400" />
                <h3 className="font-pixel text-base text-zinc-100">iOS</h3>
                <p className="mt-0.5 font-terminal text-xs text-zinc-500">Add to Home Screen via Safari</p>
              </div>
              <span className="border border-zinc-700 bg-zinc-900/50 px-2 py-1 font-pixel text-[0.4rem] tracking-widest text-zinc-500">
                APP_STORE SOON
              </span>
            </div>

            {/* PWA install note */}
            <div className="mb-5 border border-blue-900/50 bg-blue-950/20 px-4 py-3">
              <p className="font-terminal text-xs leading-relaxed text-blue-300">
                Add Resurgo to your iPhone or iPad home screen via Safari — it launches in full-screen, sends push notifications (iOS 16.4+), and works just like a native app.
              </p>
            </div>

            {/* iOS steps */}
            <StepList steps={IOS_STEPS} color="blue" />

            <p className="mt-4 font-terminal text-[0.6rem] text-zinc-600">
              Must use Safari. Chrome on iOS does not support Add to Home Screen installation.
            </p>
          </div>

          {/* ── WINDOWS ───────────────────────────────────────────────────── */}
          <div className="relative border-2 border-zinc-800 bg-zinc-950 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] opacity-80">
            {/* Coming soon ribbon */}
            <div className="absolute right-0 top-0 border-l border-b border-zinc-700 bg-zinc-800 px-3 py-1 font-pixel text-[0.38rem] tracking-widest text-zinc-400">
              COMING_SOON
            </div>

            <div className="mb-4">
              <Kicker text="WINDOWS" color="text-zinc-500" />
              <h3 className="font-pixel text-base text-zinc-500">Windows</h3>
              <p className="mt-0.5 font-terminal text-xs text-zinc-600">Native .exe installer · Microsoft Store</p>
            </div>

            <div className="mb-5 border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="font-terminal text-xs leading-relaxed text-zinc-500">
                A native Windows installer (.exe or MSIX via Microsoft Store) is in development. You can already install Resurgo as a desktop app via Chrome or Edge right now.
              </p>
            </div>

            <div className="mb-3">
              <p className="mb-2 font-pixel text-[0.4rem] tracking-widest text-zinc-600">USE_TODAY_VIA_BROWSER</p>
              <ol className="space-y-2">
                {[
                  'Open resurgo.life in Chrome or Edge on Windows.',
                  'Click the install icon (⊕) in the address bar, or go to ⋮ menu → "Install Resurgo".',
                  'Click Install. Resurgo opens from your Start Menu and taskbar.',
                ].map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-zinc-700 bg-zinc-900 font-pixel text-[0.5rem] text-zinc-500">
                      {i + 1}
                    </span>
                    <p className="font-terminal text-xs leading-relaxed text-zinc-500">{t}</p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-2 font-terminal text-[0.6rem] text-zinc-700">
              Native installer coming — join the waitlist at resurgo.life/roadmap
            </p>
          </div>

          {/* ── macOS ─────────────────────────────────────────────────────── */}
          <div className="relative border-2 border-zinc-800 bg-zinc-950 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] opacity-80">
            {/* Coming soon ribbon */}
            <div className="absolute right-0 top-0 border-l border-b border-zinc-700 bg-zinc-800 px-3 py-1 font-pixel text-[0.38rem] tracking-widest text-zinc-400">
              COMING_SOON
            </div>

            <div className="mb-4">
              <Kicker text="MACOS" color="text-zinc-500" />
              <h3 className="font-pixel text-base text-zinc-500">macOS</h3>
              <p className="mt-0.5 font-terminal text-xs text-zinc-600">Native .dmg installer · Mac App Store</p>
            </div>

            <div className="mb-5 border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="font-terminal text-xs leading-relaxed text-zinc-500">
                A native macOS app (.dmg) is in development. Install Resurgo as a desktop app via Safari or Chrome now while the native version is being prepared.
              </p>
            </div>

            <div className="mb-3">
              <p className="mb-2 font-pixel text-[0.4rem] tracking-widest text-zinc-600">USE_TODAY_VIA_BROWSER</p>
              <ol className="space-y-2">
                {[
                  'Open resurgo.life in Safari or Chrome on macOS.',
                  'Safari: File → "Add to Dock". Chrome: ⋮ → "Install Resurgo".',
                  'Resurgo opens in its own window, separate from your browser.',
                ].map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-zinc-700 bg-zinc-900 font-pixel text-[0.5rem] text-zinc-500">
                      {i + 1}
                    </span>
                    <p className="font-terminal text-xs leading-relaxed text-zinc-500">{t}</p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-2 font-terminal text-[0.6rem] text-zinc-700">
              Native installer coming — join the waitlist at resurgo.life/roadmap
            </p>
          </div>

        </div>
      </section>

      {/* ═══ WHAT YOU GET ══════════════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Kicker text="CAPABILITIES" />
          <h2 className="mb-8 font-pixel text-xl text-zinc-200">What you get on every platform</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="border border-zinc-800 bg-zinc-950 px-4 py-4">
                <p className="mb-1 font-pixel text-[0.45rem] tracking-widest text-orange-500">{f.label}</p>
                <p className="font-terminal text-xs leading-relaxed text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Kicker text="FAQ" />
          <h2 className="mb-8 font-pixel text-xl text-zinc-200">Common questions</h2>
          <div className="space-y-1">
            {[
              {
                q: 'Is the APK safe to install?',
                a: 'Yes. The APK is built from the same codebase that runs on resurgo.life and published directly from our GitHub repository (github.com/shaykhedeee/resurgo). The SHA-256 checksum is listed on the release page so you can verify the file before installing.',
              },
              {
                q: 'Do I need an account to use the app?',
                a: 'Yes. Sign up free at resurgo.life — it takes about 30 seconds. Your data syncs to the cloud so it\'s available on every device you install Resurgo on.',
              },
              {
                q: 'Is the PWA version the same as the APK?',
                a: 'Functionally identical. The APK is a native wrapper around the same web app. The PWA installed via Chrome gives the same experience and updates automatically without re-downloading.',
              },
              {
                q: 'Why can\'t I download an IPA for iPhone?',
                a: 'Apple requires all iOS apps to be distributed through the App Store or an Enterprise program. Until Resurgo is on the App Store, the best iOS installation is via Safari "Add to Home Screen" — it\'s nearly identical to a native app.',
              },
              {
                q: 'Will I lose data if I reinstall?',
                a: 'No. All your habits, tasks, goals, and history live in the cloud (Convex). Uninstalling removes the icon — log back in on any device and everything is there.',
              },
              {
                q: 'Which Android version is required?',
                a: 'Android 8.0 (Oreo) or higher for the APK. The PWA via Chrome works on Android 7.0+.',
              },
            ].map((faq) => (
              <details key={faq.q} className="group border border-zinc-800 bg-zinc-950">
                <summary className="cursor-pointer px-5 py-4 font-terminal text-sm font-semibold text-zinc-200 transition group-open:text-orange-400">
                  {faq.q}
                </summary>
                <p className="px-5 pb-4 font-terminal text-xs leading-relaxed text-zinc-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ════════════════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <Kicker text="READY_TO_BEGIN" />
          <h2 className="font-pixel text-2xl text-zinc-100">
            Build better habits.<br />
            <span className="text-orange-400">Starting today.</span>
          </h2>
          <p className="mt-3 font-terminal text-sm text-zinc-400">
            Create your free account and install Resurgo on your device in under 2 minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <TermLinkButton href="/sign-up" variant="primary" size="lg">
              Start Free — No Credit Card
            </TermLinkButton>
            <TermLinkButton href="/pricing" variant="secondary" size="lg">
              View Plans
            </TermLinkButton>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Resurgo',
            operatingSystem: 'Android, iOS, Windows, macOS',
            applicationCategory: 'LifestyleApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            downloadUrl: 'https://resurgo.life/downloads/resurgo-latest.apk',
            softwareVersion: APK_VERSION,
            description:
              'AI-powered productivity assistant. Install on Android (APK), iPhone/iPad (PWA), Windows and macOS.',
            url: 'https://resurgo.life',
            author: { '@type': 'Organization', name: 'Resurgo', url: 'https://resurgo.life' },
          }),
        }}
      />
    </main>
  );
}

