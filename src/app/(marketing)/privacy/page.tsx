import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Resurgo',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: PRIVACY_POLICY</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Privacy Policy</h1>
            <p className="mt-1 font-mono text-xs text-zinc-400">Your data, your rules. Here&apos;s exactly what we collect.</p>
          </div>
        </div>
        <div className="space-y-5 font-mono text-sm text-zinc-400">
          {[
            {
              title: 'WHAT_WE_COLLECT',
              items: [
                'Account info: email, name (via Clerk)',
                'Usage data: goals, habits, tasks you create',
                'Session data: focus sessions, mood logs, journal entries',
                'Device info: browser type, IP address (for security)',
              ],
            },
            {
              title: 'WHAT_WE_DONT_COLLECT',
              items: [
                'We do NOT sell your data to third parties',
                'We do NOT read your journal entries for advertising',
                'We do NOT share personal data with AI training datasets',
              ],
            },
            {
              title: 'HOW_WE_USE_DATA',
              items: [
                'Provide and improve the Service',
                'Send AI coaching responses (processed via Groq API)',
                'Send transactional emails (account, billing)',
                'Analyze aggregate usage to improve features',
              ],
            },
            {
              title: 'DATA_STORAGE',
              items: [
                'Data stored in Convex (EU-West-1)',
                'Auth handled by Clerk (SOC2 compliant)',
                'Payments handled by Stripe (PCI compliant)',
                'Data encrypted in transit (TLS 1.3) and at rest',
              ],
            },
            {
              title: 'YOUR_RIGHTS',
              items: [
                'Access: request a copy of your data',
                'Deletion: delete your account and all data',
                'Export: download your data in JSON format',
                'Correction: update inaccurate information',
              ],
            },
          ].map(({ title, items }) => (
            <section key={title} className="border border-zinc-900 bg-zinc-950 p-5 space-y-3">
              <h2 className="text-xs font-bold text-zinc-200 tracking-widest">{title}</h2>
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-orange-600 shrink-0">&gt;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="text-xs font-bold text-zinc-200 tracking-widest mb-2">CONTACT</h2>
            <p>Privacy questions: <span className="text-orange-400">privacy@resurgo.life</span></p>
          </div>
        </div>
      </div>
    </main>
  );
}
