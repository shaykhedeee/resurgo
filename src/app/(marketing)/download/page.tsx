// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// RESURGO.life â€” /download â€” PWA Installation Guide
// No app store required â€” install directly from the browser.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Install Resurgo â€” Free PWA App | AI Habit Tracker',
  description:
    'Install Resurgo on your phone or desktop in seconds â€” no app store needed. Add it to your home screen for a full native-app experience on any device.',
  keywords: [
    'Resurgo install', 'Resurgo app', 'habit tracker PWA', 'add to home screen',
    'AI habit tracker mobile', 'progressive web app habit tracker',
  ],
  alternates: { canonical: '/download' },
  openGraph: {
    title: 'Install Resurgo â€” PWA App',
    description: 'Add to your home screen in seconds. Works on Android, iPhone, and desktop. No app store needed.',
    type: 'website',
    url: '/download',
  },
};

const FEATURES = [
  {
    icon: 'ðŸ””',
    title: 'Push Notifications',
    description: 'Morning digests, habit reminders, and AI coaching nudges â€” enabled from your browser settings after installing.',
  },
  {
    icon: 'âš¡',
    title: 'Instant Launch',
    description: 'Tap the icon and you\'re in. No browser tabs, no URL bar â€” a full-screen dedicated experience from your home screen.',
  },
  {
    icon: 'ðŸ“Š',
    title: 'Full Dashboard Access',
    description: 'Every feature from the web app: habits, goals, tasks, AI coach, vision board, analytics â€” always in your pocket.',
  },
  {
    icon: 'ðŸ”’',
    title: 'Secure Authentication',
    description: 'Same Clerk-powered account across all devices. Your data syncs in real-time via Convex â€” zero setup needed.',
  },
  {
    icon: 'ðŸ“¶',
    title: 'Works Offline',
    description: 'Your cached data is available even when your connection drops. Changes sync when you\'re back online.',
  },
  {
    icon: 'ðŸŒ™',
    title: 'Smart Quiet Hours',
    description: 'Set quiet hours in Settings and Resurgo batches notifications intelligently â€” no buzzing at 2 AM.',
  },
];

const INSTALL_ANDROID = [
  { step: 1, title: 'Open resurgo.life in Chrome', description: 'Use Chrome or Samsung Internet on your Android device.' },
  { step: 2, title: 'Tap the menu (â‹®) â†’ "Add to Home screen"', description: 'Or look for the install icon (âŠ•) that appears in the address bar.' },
  { step: 3, title: 'Tap "Add"', description: 'Android adds the Resurgo icon to your home screen instantly.' },
  { step: 4, title: 'Launch & allow notifications', description: 'Open Resurgo from your home screen and allow push notifications when prompted.' },
];

const INSTALL_IOS = [
  { step: 1, title: 'Open resurgo.life in Safari', description: 'Must use Safari â€” Chrome on iOS cannot install PWAs.' },
  { step: 2, title: 'Tap the Share button (â–¡â†‘)', description: 'Found at the bottom of the screen on iPhone.' },
  { step: 3, title: 'Tap "Add to Home Screen"', description: 'Scroll down the share sheet if needed.' },
  { step: 4, title: 'Tap "Add"', description: 'Safari adds Resurgo to your home screen like a native app.' },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* ─── APK + Install Hero ─── */}
      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-20">
          <div className="mb-4 font-mono text-xs tracking-widest text-orange-400">
            GET_RESURGO :: NATIVE_APK + HOME_SCREEN
          </div>
          <h1 className="font-mono text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
            Download Resurgo
          </h1>
          {/* APK primary download */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/downloads/resurgo-latest.apk" download
              className="flex items-center gap-2 border-2 border-orange-600 bg-orange-600 px-6 py-3 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-orange-500">
              ↓ Download APK (Android)
            </a>
            <Link href="/sign-up"
              className="border border-orange-800 bg-orange-950/30 px-5 py-3 font-mono text-sm tracking-widest text-orange-400 transition hover:bg-orange-950/60">
              [GET_STARTED_FREE]
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-600">
            <span>✓ Android 7.0+</span>
            <span>✓ ~15MB</span>
            <span>✓ Signed release build</span>
            <span>✓ v1.0.0</span>
          </div>
          <div className="mt-5 max-w-xl border border-yellow-900/40 bg-yellow-950/10 px-4 py-3">
            <p className="font-mono text-xs leading-relaxed text-yellow-400">
              <strong>Android sideload note:</strong> Allow &quot;Install from unknown sources&quot; in
              Settings → Security → Install unknown apps. This is standard for APKs outside the Play Store.
            </p>
          </div>
          <h2 className="mt-10 font-mono text-xl text-zinc-400">Or install as a home screen app on any device</h2>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            No app store needed — works on iPhone, iPad, and any desktop browser.
          </p>
        </div>
      </section>

      {/* Install Steps: Android + iOS */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2 font-mono text-2xl font-bold text-zinc-100">How to Install</h2>
        <p className="mb-12 font-mono text-sm text-zinc-400">
          Pick your device and follow the steps. Takes under 30 seconds.
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Android */}
          <div className="border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-orange-400">ANDROID_/_CHROME</span>
              <span className="text-xs text-zinc-600">(also Samsung Internet, Edge)</span>
            </div>
            <ol className="space-y-5">
              {INSTALL_ANDROID.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-orange-800 bg-orange-950/30 font-mono text-xs text-orange-400">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold text-zinc-200">{s.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* iOS */}
          <div className="border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-blue-400">IPHONE_/_IPAD_SAFARI</span>
            </div>
            <ol className="space-y-5">
              {INSTALL_IOS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-blue-800 bg-blue-950/30 font-mono text-xs text-blue-400">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold text-zinc-200">{s.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-mono text-xs text-zinc-600">
              Note: iOS 16.4+ supports push notifications for PWAs in Safari.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-zinc-900 mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2 font-mono text-2xl font-bold text-zinc-100">What You Get</h2>
        <p className="mb-12 font-mono text-sm text-zinc-400">Everything the web app offers â€” delivered to your home screen.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="font-mono text-sm font-semibold text-zinc-200 mb-1">{f.title}</h3>
              <p className="font-mono text-xs text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-900 mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-8 font-mono text-2xl font-bold text-zinc-100">FAQ</h2>
        <div className="space-y-1">
          {[
            {
              q: 'Do I need to create an account?',
              a: 'Yes. Sign up free at resurgo.life â€” takes about 30 seconds. Your data is stored in the cloud and syncs across all your devices.',
            },
            {
              q: 'Is this a real app or just a bookmark?',
              a: 'It\'s a Progressive Web App (PWA) â€” it launches in standalone mode (no browser UI), has its own icon, can receive push notifications, caches data, and works offline. It behaves like a native app on your device.',
            },
            {
              q: 'Why not the Play Store or App Store?',
              a: 'PWAs install instantly without any store approval process. Your app always runs the latest version automatically â€” no manual updates needed. For most use cases, the PWA experience is identical to a native app.',
            },
            {
              q: 'Does it work on desktop?',
              a: 'Yes. Chrome and Edge on Windows/Mac/Linux support PWA installation. Click the install icon (âŠ•) in the browser address bar, or go to Settings â†’ Cast, Save, and Share â†’ Install page as app.',
            },
            {
              q: 'Will I lose my data if I uninstall the PWA?',
              a: 'No. All your data lives in Convex (cloud). Uninstalling the PWA only removes the app icon. Log back in on any device or browser and everything is there.',
            },
            {
              q: 'Does Telegram integration still work?',
              a: 'Yes. Telegram remains available for quick habit check-ins, daily nudges, and coaching messages. The PWA handles the full interactive experience; Telegram handles quick on-the-go interactions.',
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group border border-zinc-800 bg-zinc-950"
            >
              <summary className="cursor-pointer px-5 py-4 font-mono text-sm font-semibold text-zinc-200 group-open:text-orange-400 transition">
                {faq.q}
              </summary>
              <p className="px-5 pb-4 font-mono text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-900 mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs tracking-widest text-orange-400 mb-3">READY_TO_BEGIN</p>
        <h2 className="font-mono text-3xl font-bold text-zinc-100">Start building better habits today.</h2>
        <p className="mt-3 font-mono text-sm text-zinc-400 max-w-md mx-auto">
          Open resurgo.life in your browser, sign up free, then install it to your home screen.
        </p>
        <Link
          href="/sign-up"
          className="mt-8 inline-block border border-orange-800 bg-orange-950/30 px-8 py-3 font-mono text-sm tracking-widest text-orange-400 transition hover:bg-orange-950/60"
        >
          [GET_STARTED_FREE]
        </Link>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Resurgo',
            operatingSystem: 'Android, iOS, Windows, macOS, Linux',
            applicationCategory: 'LifestyleApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: 'AI-powered habit tracker with goal decomposition, push notifications, and gamified progress tracking. Install as a PWA on any device.',
            url: 'https://resurgo.life',
            author: {
              '@type': 'Organization',
              name: 'Resurgo',
              url: 'https://resurgo.life',
            },
          }),
        }}
      />
    </main>
  );
}

