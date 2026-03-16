// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Security Page
// Terminal-styled overview of auth, encryption, privacy, and compliance
// ═══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security — Resurgo',
  description: 'How Resurgo protects your data: authentication, encryption, privacy, and compliance.',
};

interface SecuritySection {
  id: string;
  cmd: string;
  title: string;
  subtitle: string;
  items: { label: string; detail: string }[];
}

const SECTIONS: SecuritySection[] = [
  {
    id: 'auth',
    cmd: 'AUTH',
    title: 'Authentication',
    subtitle: 'Powered by Clerk — enterprise-grade identity management',
    items: [
      { label: 'SSO / OAuth', detail: 'Google, GitHub, and more — no password required if you prefer' },
      { label: 'Multi-Factor Auth', detail: 'TOTP and SMS 2FA available on all accounts' },
      { label: 'Session management', detail: 'Device-level session control; revoke access from any device' },
      { label: 'Brute-force protection', detail: 'Rate-limiting and lockouts on failed attempts' },
      { label: 'JWT tokens', detail: 'Short-lived, signed tokens; auto-rotated on every request' },
    ],
  },
  {
    id: 'data',
    cmd: 'DATA',
    title: 'Data Encryption',
    subtitle: 'All data encrypted in transit and at rest',
    items: [
      { label: 'TLS 1.3', detail: 'All traffic between client and server uses TLS 1.3' },
      { label: 'At-rest encryption', detail: 'AES-256 encryption for all data stored in Convex databases' },
      { label: 'Database isolation', detail: 'Each deployment runs in isolated Convex infrastructure' },
      { label: 'No raw password storage', detail: 'Passwords are never stored — authentication handled entirely by Clerk' },
      { label: 'Secure file uploads', detail: 'Files stored in Convex storage with signed URL access' },
    ],
  },
  {
    id: 'privacy',
    cmd: 'PRIVACY',
    title: 'Data Privacy',
    subtitle: 'Your data belongs to you — always',
    items: [
      { label: 'Data minimisation', detail: 'We only collect data required to deliver core features' },
      { label: 'No selling data', detail: 'Your personal data is never sold or shared with advertisers' },
      { label: 'User-controlled deletion', detail: 'Delete your account and all associated data at any time from Settings' },
      { label: 'Export your data', detail: 'Request a full data export in JSON format at any time' },
      { label: 'Third-party integrations', detail: 'Only Clerk (auth), Convex (database), and Vercel (hosting) have limited access' },
    ],
  },
  {
    id: 'compliance',
    cmd: 'COMPLIANCE',
    title: 'Compliance & Standards',
    subtitle: 'Built to meet international data protection requirements',
    items: [
      { label: 'GDPR', detail: 'Fully compliant with EU General Data Protection Regulation' },
      { label: 'CCPA', detail: 'California Consumer Privacy Act rights honoured for all users' },
      { label: 'Data Processing Agreements', detail: 'DPAs available for enterprise customers on request' },
      { label: 'Audit logging', detail: 'All sensitive actions are logged with timestamps and user ID' },
      { label: 'Vulnerability disclosure', detail: 'Responsible disclosure: security@resurgo.life' },
    ],
  },
  {
    id: 'infra',
    cmd: 'INFRA',
    title: 'Infrastructure',
    subtitle: 'Deployed on best-in-class cloud infrastructure',
    items: [
      { label: 'Vercel Edge Network', detail: 'Global CDN with automatic DDoS mitigation' },
      { label: 'Convex cloud', detail: 'SOC 2 Type II certified real-time database infrastructure' },
      { label: 'Zero-downtime deploys', detail: 'Atomic deployments — no maintenance windows' },
      { label: 'Availability SLA', detail: '99.9% availability target with automated monitoring and alerting' },
      { label: 'Disaster recovery', detail: 'Automated backups; point-in-time recovery available' },
    ],
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="font-pixel text-[0.5rem] tracking-[0.3em] text-orange-600 mb-4">SYSTEM:SECURITY_OVERVIEW</p>
          <h1 className="font-pixel text-xl sm:text-2xl tracking-widest text-zinc-100 mb-4">
            Security & Privacy
          </h1>
          <p className="font-terminal text-base text-zinc-400 max-w-lg">
            Resurgo is built on security-first infrastructure. Here&apos;s exactly how we protect your data.
          </p>
        </div>
      </div>

      {/* Security sections */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.id} className="border border-zinc-900">
            {/* Section header */}
            <div className="border-b border-zinc-900 bg-zinc-950 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-[0.45rem] tracking-widest text-orange-700 bg-orange-950 px-1.5 py-0.5">
                  {section.cmd}
                </span>
                <h2 className="font-pixel text-[0.6rem] tracking-widest text-zinc-200">{section.title}</h2>
              </div>
              <span className="font-terminal text-xs text-zinc-600 hidden sm:block">// {section.subtitle}</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-zinc-900">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-4 py-3 hover:bg-zinc-950 transition-colors">
                  <span className="font-pixel text-[0.4rem] tracking-widest text-green-600 mt-0.5 shrink-0">✓</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-[0.45rem] tracking-widest text-zinc-300 mb-0.5">{item.label}</p>
                    <p className="font-terminal text-sm text-zinc-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Contact block */}
        <div className="border-2 border-orange-900 bg-zinc-950 p-6">
          <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-3">SECURITY_CONTACT</p>
          <p className="font-terminal text-sm text-zinc-400 mb-4">
            Found a vulnerability? We take security reports seriously and will respond within 48 hours.
          </p>
          <div className="border border-zinc-800 bg-black px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-pixel text-[0.4rem] tracking-widest text-zinc-500">{'>'} RESPONSIBLE_DISCLOSURE</p>
              <p className="font-terminal text-sm text-orange-400 mt-0.5">security@resurgo.life</p>
            </div>
            <a
              href="mailto:security@resurgo.life"
              className="font-pixel text-[0.45rem] tracking-widest px-3 py-2 border border-orange-900 text-orange-400 hover:bg-orange-950 transition-colors whitespace-nowrap"
            >
              REPORT
            </a>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/privacy" className="font-terminal text-sm text-zinc-600 hover:text-orange-500 transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/terms" className="font-terminal text-sm text-zinc-600 hover:text-orange-500 transition-colors">
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
