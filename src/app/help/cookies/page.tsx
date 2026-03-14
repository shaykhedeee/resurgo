import { Metadata } from 'next';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Cookie Policy - RESURGO',
  description: 'RESURGO cookie policy. Learn about the cookies we use to improve your experience and how to manage them.',
  openGraph: {
    title: 'Cookie Policy - RESURGO',
    description: 'Information about cookies used on RESURGO.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COOKIE DATA
// ═══════════════════════════════════════════════════════════════════════════════

const cookies = {
  essential: [
    {
      name: 'resurgo-session',
      purpose: 'Maintains your login session',
      duration: '7 days',
      type: 'First-party',
    },
    {
      name: 'resurgo-theme',
      purpose: 'Remembers your theme preference (dark/light)',
      duration: '1 year',
      type: 'First-party',
    },
    {
      name: 'resurgo-onboarding',
      purpose: 'Tracks onboarding completion status',
      duration: '1 year',
      type: 'First-party',
    },
  ],
  functional: [
    {
      name: 'resurgo-preferences',
      purpose: 'Stores your app preferences and settings',
      duration: '1 year',
      type: 'First-party',
    },
    {
      name: 'resurgo-tutorial',
      purpose: 'Tracks which tutorials you have completed',
      duration: '1 year',
      type: 'First-party',
    },
  ],
  analytics: [
    {
      name: '_ga, _ga_*',
      purpose: 'Google Analytics - tracks page views and user behavior',
      duration: '2 years',
      type: 'Third-party (Google)',
    },
    {
      name: '_gid',
      purpose: 'Google Analytics - distinguishes users',
      duration: '24 hours',
      type: 'Third-party (Google)',
    },
  ],
  marketing: [
    {
      name: '_fbp',
      purpose: 'Facebook Pixel - tracks conversions from ads',
      duration: '3 months',
      type: 'Third-party (Meta)',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="py-12 px-4 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-[var(--text-muted)] mb-4">
            <Link href="/help" className="hover:text-[var(--accent)]">Help Center</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--text-secondary)]">Cookie Policy</span>
          </nav>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
            Cookie Policy
          </h1>
          <p className="text-[var(--text-secondary)]">
            Last updated: February 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          
          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              What Are Cookies?
            </h2>
            <div className="glass-card p-6">
              <p className="text-[var(--text-secondary)]">
                Cookies are small text files stored on your device when you visit a website. 
                They help us remember your preferences, understand how you use RESURGO, and 
                improve your experience. Some cookies are essential for the app to function, 
                while others help us optimize our service.
              </p>
            </div>
          </section>

          {/* Essential Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="text-xl">EC</span> Essential Cookies
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              These cookies are necessary for RESURGO to work. You cannot opt out of these.
            </p>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Cookie</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Purpose</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {cookies.essential.map((cookie, i) => (
                    <tr key={i}>
                      <td className="p-4 text-[var(--accent)] font-mono text-sm">{cookie.name}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{cookie.purpose}</td>
                      <td className="p-4 text-[var(--text-muted)]">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Functional Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="text-xl">FC</span> Functional Cookies
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              These cookies enable enhanced functionality and personalization.
            </p>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Cookie</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Purpose</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {cookies.functional.map((cookie, i) => (
                    <tr key={i}>
                      <td className="p-4 text-[var(--accent)] font-mono text-sm">{cookie.name}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{cookie.purpose}</td>
                      <td className="p-4 text-[var(--text-muted)]">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Analytics Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="text-xl">AC</span> Analytics Cookies
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              These cookies help us understand how users interact with RESURGO so we can improve.
            </p>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Cookie</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Purpose</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {cookies.analytics.map((cookie, i) => (
                    <tr key={i}>
                      <td className="p-4 text-[var(--accent)] font-mono text-sm">{cookie.name}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{cookie.purpose}</td>
                      <td className="p-4 text-[var(--text-muted)]">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Marketing Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="text-xl">MC</span> Marketing Cookies
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              These cookies track ad campaign effectiveness. You can opt out of these.
            </p>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Cookie</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Purpose</th>
                    <th className="text-left p-4 text-[var(--text-primary)] font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {cookies.marketing.map((cookie, i) => (
                    <tr key={i}>
                      <td className="p-4 text-[var(--accent)] font-mono text-sm">{cookie.name}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{cookie.purpose}</td>
                      <td className="p-4 text-[var(--text-muted)]">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="text-xl">MG</span> Managing Cookies
            </h2>
            <div className="glass-card p-6 space-y-4">
              <p className="text-[var(--text-secondary)]">
                You can control and manage cookies in several ways:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Browser Settings</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Most browsers allow you to block or delete cookies through settings. 
                    Note that blocking essential cookies may prevent RESURGO from working properly.
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Google Analytics Opt-out</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Google Analytics Opt-out Browser Add-on</a>
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Ad Preferences</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Your Ad Choices</a> to opt out of targeted advertising.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Policy Updates
            </h2>
            <div className="glass-card p-6">
              <p className="text-[var(--text-secondary)]">
                We may update this Cookie Policy from time to time. When we do, we&apos;ll 
                update the &quot;Last updated&quot; date at the top of this page. We encourage 
                you to review this policy periodically to stay informed about our use of cookies.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="glass-card p-6 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-0 mb-2">
              Questions?
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              If you have questions about our use of cookies, please contact us.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors"
            >
              Contact Support
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
