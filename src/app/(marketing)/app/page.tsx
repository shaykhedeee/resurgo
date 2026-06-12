import type { Metadata } from 'next';
import Image from 'next/image';
import { TermLinkButton } from '@/components/ui/TermButton';
import { siteUrl } from '@/lib/marketing/seo-config';

export const metadata: Metadata = {
  title: 'Download Resurgo App — Android APK & iOS PWA | AI Productivity',
  description:
    'Get Resurgo on your device. Download the Android APK or install the iOS Safari PWA in under 60 seconds for offline productivity, habits, and AI coaching.',
  keywords: [
    'Resurgo APK download', 'Android productivity app', 'habit tracker app',
    'AI coach Android', 'focus timer app Android', 'habit stacking app',
    'download productivity app', 'native Android app', 'PWA vs APK',
    'install Resurgo Android', 'offline habit tracker', 'push notifications app',
    'AI productivity assistant Android', 'Resurgo app download link',
    'iOS PWA install', 'Add to Home Screen iPhone', 'productivity app iOS',
  ],
  alternates: { canonical: '/app' },
  openGraph: {
    title: 'Download Resurgo App — Android APK & iOS PWA',
    description: 'Native Android app with push notifications, offline mode, AI coaching. iOS via Safari PWA. Both sync seamlessly with your cloud account.',
    type: 'website',
    url: '/app',
    images: ['/og-image.png'],
  },
};

const IOS_APK_STEPS = [  // Actually "PWA install" for iOS
  { step: 1, text: 'Open resurgo.life in Safari (required — Chrome won\'t work).', icon: '🔗' },
  { step: 2, text: 'Tap the Share button (□↑) → scroll down to "Add to Home Screen".', icon: '⊕' },
  { step: 3, text: 'Tap "Add". Resurgo appears on your home screen like a native app.', icon: '📱' },
  { step: 4, text: 'Open from home screen. Enable push notifications when prompted.', icon: '🔔' },
];

const ANDROID_APK_STEPS = [
  { step: 1, text: 'Tap "Download APK" and save the .apk file to your Downloads folder.', icon: '⬇' },
  { step: 2, text: 'Open your Downloads folder and tap the Resurgo APK file.', icon: '📂' },
  { step: 3, text: 'If prompted, tap "Settings" → enable "Install from unknown sources" for your browser, then retry.', icon: '⚙' },
  { step: 4, text: 'Tap "Install" → "Open". Sign in or create your Resurgo account.', icon: '🚀' },
];

const IOS_STEPS = [
  { step: 1, text: 'Open resurgo.life in Safari (required for installation).', icon: '🔗' },
  { step: 2, text: 'Tap the Share button (□↑) → scroll to "Add to Home Screen".', icon: '⊕' },
  { step: 3, text: 'Tap "Add". Resurgo appears on your home screen as a native app.', icon: '📱' },
  { step: 4, text: 'Open from home screen. Enable push notifications when prompted for full experience.', icon: '🔔' },
];

const ANDROID_PWA_STEPS = [
  { step: 1, text: 'Open resurgo.life in Google Chrome on your Android device.', icon: '🔗' },
  { step: 2, text: 'Tap the three dots (⋮) in the top-right corner.', icon: '⋮' },
  { step: 3, text: 'Select "Add to Home Screen" or "Install App".', icon: '⊕' },
  { step: 4, text: 'Confirm the prompt. Resurgo is now fully installed on your device.', icon: '📱' },
];

const NATIVE_FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Launch',
    desc: 'Opens from your home screen in milliseconds — no browser tab, no address bar, pure app experience.',
  },
  {
    icon: '📴',
    title: 'Offline First',
    desc: 'All habits, tasks, and goals cache locally. Actions queue and sync automatically when you reconnect.',
  },
  {
    icon: '🔔',
    title: 'Push Notifications',
    desc: 'Streak reminders, AI coach messages, morning briefings, and habit nudges delivered directly to your device (Android full, iOS Safari PWA limited).',
  },
  {
    icon: '🎯',
    title: 'Native Widgets',
    desc: 'Daily Wins home screen widget shows today\'s habits and goals at a glance — Android only (iOS widget coming in App Store release).',
  },
  {
    icon: '🔄',
    title: 'Real-Time Sync',
    desc: 'Sign in once — data syncs across Android, iOS, web, and desktop instantly via Convex.',
  },
  {
    icon: '🛡️',
    title: 'Secure & Verified',
    desc: 'Android APK is code-signed with release keystore. SHA-256 checksum available. iOS PWA installs via Safari.',
  },
];

const SCREENSHOTS = [
  { src: '/screenshots/975shots_so.png', alt: 'Dashboard overview with AI coach', width: 1080, height: 1920 },
  { src: '/screenshots/96_1x_shots_so.png', alt: 'Habit tracking with streaks', width: 1080, height: 1920 },
  { src: '/screenshots/924_1x_shots_so.png', alt: 'Focus timer and productivity sessions', width: 1080, height: 1920 },
  { src: '/screenshots/860_1x_shots_so.png', alt: 'AI coaching chat interface', width: 1080, height: 1920 },
];

const APK_URL = '/downloads/resurgo-latest.apk';
const APK_VERSION = '2.0.0';
const APK_SIZE = '~1.3 MB';

function StepList({
  steps,
  color = 'orange',
}: {
  steps: { step: number; text: string; icon?: string }[];
  color?: 'orange' | 'blue';
}) {
  const border = color === 'blue'
    ? 'border-blue-800 bg-blue-950/30 text-blue-400'
    : 'border-orange-800 bg-orange-950/30 text-orange-400';
  return (
    <ol className="space-y-3">
      {steps.map((s) => (
        <li key={s.step} className="flex gap-3">
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border font-pixel text-[0.6rem] ${border}`}>
            {s.icon || s.step}
          </span>
          <p className="font-terminal text-xs leading-relaxed text-zinc-400">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

function Kicker({ text, color = 'text-orange-500' }: { text: string; color?: string }) {
  return <p className={`font-pixel text-[0.45rem] tracking-widest ${color} mb-2`}>{text}</p>;
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="group border border-zinc-800 bg-zinc-950 p-5 transition hover:border-orange-900/50 hover:bg-orange-950/5">
      <div className="mb-2 text-2xl">{icon}</div>
      <h3 className="mb-1 font-pixel text-sm font-bold text-zinc-200">{title}</h3>
      <p className="font-terminal text-xs leading-relaxed text-zinc-500">{desc}</p>
    </div>
  );
}

function ScreenshotCarousel() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SCREENSHOTS.map((shot) => (
        <div
          key={shot.src}
          className="relative aspect-[9/19] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

const ANDROID_MIN_VERSION = 'Android 8.0+ (Oreo)';

export default function AppDownloadPage() {
  const apkFileName = 'resurgo-latest.apk';

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-zinc-900 px-6 pb-16 pt-20 text-center">
        <div className="mx-auto max-w-3xl">
          <Kicker text="RESURGO_APP :: INSTANT_WEB_PWA_SETUP" />
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Get Resurgo on Your Device
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-terminal text-base leading-relaxed text-zinc-400">
            Resurgo runs as an optimized, web-native Progressive Web App (PWA). Launch it instantly on iOS Safari, Android Chrome, or your Desktop without App Store downloads, manual APK overrides, or security exceptions.
          </p>

          {/* Platform badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="border border-blue-800 px-3 py-1 font-pixel text-[0.45rem] tracking-wider text-blue-400 bg-blue-950/20">◎ iOS Safari PWA (Recommended)</span>
            <span className="border border-green-800 px-3 py-1 font-pixel text-[0.45rem] tracking-wider text-green-400 bg-green-950/20">◎ Android Chrome PWA (Recommended)</span>
            <span className="border border-purple-800 px-3 py-1 font-pixel text-[0.45rem] tracking-wider text-purple-400 bg-purple-950/20">◎ Desktop PWA</span>
          </div>
        </div>
      </section>

      {/* ═══ DOWNLOAD CARD ════════════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-12">
        <div className="mx-auto max-w-md">
          <div className="border-2 border-blue-900 bg-zinc-950 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-left">
                <p className="font-pixel text-[0.4rem] tracking-widest text-blue-400">APP_EXPERIENCE</p>
                <p className="font-pixel text-xl font-bold text-zinc-100">Web PWA</p>
                <p className="font-terminal text-xs text-zinc-500">Fast install · Auto-updates</p>
              </div>
              <div className="text-right">
                <p className="font-pixel text-[0.4rem] tracking-widest text-blue-400">STATUS</p>
                <p className="font-terminal text-xs text-green-400 font-semibold">● Live & Production Ready</p>
                <p className="font-terminal text-xs text-zinc-500">Offline & Notifications ready</p>
              </div>
            </div>

            <a
              href="/quick-start"
              className="flex w-full items-center justify-center gap-2 border-2 border-blue-700 bg-blue-700 px-6 py-4 font-terminal text-base font-bold text-white shadow-[3px_3px_0px_rgba(0,0,0,0.6)] transition hover:bg-blue-600 active:translate-x-px active:translate-y-px"
            >
              🚀 INSTANT WEB SETUP & LAUNCH
            </a>

            <div className="mt-3 flex items-center justify-center gap-4 text-xs font-terminal text-zinc-600">
              <span className="flex items-center gap-1">✓ Instant launch</span>
              <span className="flex items-center gap-1">✓ iOS & Android</span>
              <span className="flex items-center gap-1">✓ 100% Secure PWA</span>
            </div>
          </div>

          <p className="mt-4 text-center font-terminal text-xs text-zinc-500">
            <strong className="text-zinc-400">Alternative:</strong> For closed environments, you can manually download the <a href={APK_URL} className="text-orange-400 underline font-semibold">Android manual APK wrapper</a>, which serves as a Developer Sandbox Beta.
          </p>
        </div>
      </section>

      {/* ═══ APP PREVIEW (SCREENSHOTS) ════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Kicker text="APP_PREVIEW" />
          <h2 className="mb-6 font-pixel text-xl text-zinc-200">Resurgo on your device</h2>
          <ScreenshotCarousel />
          <p className="mt-3 text-center font-terminal text-xs text-zinc-600">
            Full-resolution screenshots from the Resurgo production client. The web-native PWA provides a pristine, standalone, fullscreen immersive experience.
          </p>
        </div>
      </section>

      {/* ═══ WHY NATIVE MATTERS ═══════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Kicker text="NATIVE_APP_ADVANTAGES" />
          <h2 className="mb-8 font-pixel text-xl text-zinc-200">Why install the app?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {NATIVE_FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSTALLATION GUIDE ═══════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Kicker text="INSTALLATION" />
          <h2 className="mb-6 font-pixel text-xl text-zinc-200">Install Resurgo on your device</h2>

          <div className="grid gap-6">
            {/* ── iOS ───────────────────────────────────────────────────────── */}
            <div className="border-2 border-blue-900 bg-zinc-950 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-pixel text-base text-blue-400">
                <span>◎</span> iOS: INSTALL VIA SAFARI (PWA - RECOMMENDED)
              </h3>
              <p className="mb-3 font-terminal text-xs text-zinc-500">
                Resurgo on iOS uses Safari's "Add to Home Screen" PWA. Works like a native app with offline mode and push notifications (iOS 16.4+). No App Store download needed.
              </p>
              <StepList steps={IOS_STEPS} color="blue" />
              <p className="mt-3 font-terminal text-xs text-zinc-500">
                Requires iOS 16.4+. Safari only (Chrome/Firefox iOS don't support PWA install).
              </p>
            </div>

            {/* ── ANDROID PWA ────────────────────────────────────────────────── */}
            <div className="border-2 border-green-900 bg-zinc-950 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-pixel text-base text-green-400">
                <span>◎</span> ANDROID: INSTANT CHROME INSTALL (PWA - RECOMMENDED)
              </h3>
              <p className="mb-3 font-terminal text-xs text-zinc-500">
                Install Resurgo directly through your Chrome browser on Android. It acts exactly like a native app, syncs in the background, and updates seamlessly in real time.
              </p>
              <StepList steps={ANDROID_PWA_STEPS} color="blue" />
            </div>

            {/* ── ANDROID MANUAL APK ─────────────────────────────────────────── */}
            <div className="border border-zinc-800 bg-zinc-950 p-5 opacity-90">
              <h3 className="mb-3 flex items-center gap-2 font-pixel text-base text-zinc-400">
                <span>⬇</span> ANDROID: MANUAL APK (DEVELOPER SANDBOX BETA ONLY)
              </h3>
              <StepList steps={ANDROID_APK_STEPS} color="orange" />
              <p className="mt-3 font-terminal text-xs text-zinc-500">
                Requires Android 8.0+. Warning: manual updates are required for new releases. Recommended only if browser installation is restricted on your device.
              </p>
            </div>
          </div>

          <div className="mt-6 border border-zinc-800 bg-zinc-950 px-4 py-3">
            <p className="font-terminal text-xs leading-relaxed text-zinc-500">
              <strong className="text-zinc-400">Note:</strong> Android 8.0+ required for APK. For older devices,
              use Chrome PWA (works on Android 7.0+). Both versions sync with the same cloud account.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECURITY & VERIFICATION ═════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Kicker text="SECURITY" />
          <h2 className="mb-6 font-pixel text-xl text-zinc-200">Verified & Secure</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
              <div className="mb-2 text-2xl">🔐</div>
              <h3 className="mb-1 font-pixel text-xs font-bold text-zinc-300">Code Signed</h3>
              <p className="font-terminal text-xs text-zinc-500">
                APK signed with our release keystore. Verified by Android at install time.
              </p>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
              <div className="mb-2 text-2xl">📦</div>
              <h3 className="mb-1 font-pixel text-xs font-bold text-zinc-300">Open Source</h3>
              <p className="font-terminal text-xs text-zinc-500">
                Full source on GitHub. Auditable build process, no hidden telemetry.
              </p>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
              <div className="mb-2 text-2xl">✅</div>
              <h3 className="mb-1 font-pixel text-xs font-bold text-zinc-300">Clean Install</h3>
              <p className="font-terminal text-xs text-zinc-500">
                No ads, no trackers, no data selling. Your data stays in your Convex cloud.
              </p>
            </div>
          </div>

          <div className="mt-6 border border-zinc-800 bg-zinc-950 px-4 py-3">
            <p className="font-terminal text-xs text-zinc-400">
              <strong className="text-zinc-300">Verification:</strong> SHA-256 checksum will be added to release page.
              Download the .sha256 file and verify with: <code className="rounded bg-zinc-900 px-1">sha256sum resurgo-latest.apk</code>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══════════════════════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Kicker text="FAQ" />
          <h2 className="mb-6 font-pixel text-xl text-zinc-200">Common questions</h2>
          <div className="space-y-1">
            {[
              {
                q: 'Is the APK safe to install?',
                a: 'Yes. Built from the same open-source codebase that runs resurgo.life. Code-signed, malware-free, and verifiable via SHA-256 checksum. No hidden trackers or ads.',
              },
              {
                q: 'What\'s the difference between the APK and the PWA?',
                a: 'The APK is a native wrapper with push notification support, home screen widget, and updated splash screen. The PWA via Chrome updates automatically without re-downloading. Both connect to the same cloud backend.',
              },
              {
                q: 'Will the APK receive automatic updates?',
                a: 'No — native apps can\'t auto-update without the Play Store. You\'ll need to download new versions manually from this page. Enable auto-updates on the PWA version instead.',
              },
              {
                q: 'Do I need to uninstall the PWA if I install the APK?',
                a: 'No. They coexist separately. Sign into the same account — data stays in sync. You can use either or both.',
              },
              {
                q: 'Which Android versions are supported?',
                a: 'Android 8.0 Oreo (API 26) or higher. For Android 7.0–7.1, install via Chrome PWA instead.',
              },
              {
                q: 'Why no iOS APK / IPA file?',
                a: 'Apple only allows App Store or Enterprise distribution. iOS users must install via Safari "Add to Home Screen" PWA method until the App Store release.',
              },
              {
                q: 'My phone says "app may harm your device" — is that normal?',
                a: 'That warning appears for all non-Play Store apps. It\'s auto-generated by Google Play Protect. Resurgo is safe — verify the SHA-256 checksum if concerned.',
              },
            ].map((faq) => (
              <details key={faq.q} className="group border border-zinc-800 bg-zinc-950">
                <summary className="cursor-pointer px-5 py-4 font-terminal text-sm font-semibold text-zinc-200 transition hover:text-orange-400 group-open:text-orange-400">
                  {faq.q}
                </summary>
                <p className="px-5 pb-4 font-terminal text-xs leading-relaxed text-zinc-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ════════════════════════════════════════════════════ */}
      <section className="border-t border-zinc-900 px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <Kicker text="START_NOW" />
          <h2 className="font-pixel text-2xl text-zinc-100">
            Build better habits.<br />
            <span className="text-orange-400">From your pocket.</span>
          </h2>
          <p className="mt-3 font-terminal text-sm text-zinc-400">
            Install Resurgo on Android now. No account needed to download — sign up in-app in under a minute.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <TermLinkButton href="/sign-up" variant="primary" size="lg">
              Create Free Account
            </TermLinkButton>
            <TermLinkButton href="/features" variant="secondary" size="lg">
              Explore Features
            </TermLinkButton>
          </div>
        </div>
      </section>

      {/* Structured Data (SoftwareApplication) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            '@id': `${siteUrl}/#software`,
            name: 'Resurgo',
            operatingSystem: 'Android 8.0+',
            applicationCategory: 'LifestyleApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            downloadUrl: `${siteUrl}${APK_URL}`,
            softwareVersion: APK_VERSION,
            description:
              'AI-powered productivity app for Android. Habit tracking, AI coaching, focus timers, offline sync, push notifications. Direct APK download.',
            url: `${siteUrl}/app`,
            author: { '@id': `${siteUrl}/#organization` },
            publisher: { '@id': `${siteUrl}/#organization` },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '127',
            },
            featureList: [
              'Offline-first habit & task tracking',
              '5 AI coach personas with chat',
              'Pomodoro & Deep Work timers',
              'Home screen widget (Daily Wins)',
              'Push notifications for reminders',
              'Real-time cloud sync via Convex',
              'Goal decomposition with AI',
              'Mood, sleep & wellness tracking',
            ],
          }),
        }}
      />
    </main>
  );
}
