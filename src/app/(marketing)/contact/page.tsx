import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Resurgo',
  description: 'Get in touch with the Resurgo team.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: CONTACT</span>
          </div>
          <div className="p-6 text-center">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Get in Touch</h1>
            <p className="mt-2 font-mono text-xs text-zinc-500">
              We actually reply. Usually within 24 hours.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'GENERAL_SUPPORT', email: 'support@resurgo.life', desc: 'Account issues, billing, how-to questions' },
            { label: 'FEEDBACK', email: 'hello@resurgo.life', desc: 'Feature requests, ideas, product feedback' },
            { label: 'PARTNERSHIPS', email: 'partners@resurgo.life', desc: 'Integrations, business collaborations, press' },
            { label: 'PRIVACY_LEGAL', email: 'legal@resurgo.life', desc: 'Data requests, legal matters, GDPR' },
          ].map(({ label, email, desc }) => (
            <div key={label} className="border border-zinc-900 bg-zinc-950 p-5 flex items-center justify-between group">
              <div className="space-y-1">
                <p className="font-mono text-[9px] tracking-widest text-zinc-400">{label}</p>
                <a href={`mailto:${email}`} className="font-mono text-sm text-orange-400 hover:text-orange-300">{email}</a>
                <p className="font-mono text-xs text-zinc-500">{desc}</p>
              </div>
              <span className="font-mono text-zinc-400 group-hover:text-zinc-500">→</span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <a href="https://t.me/ResurgoApp" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-950 py-4 font-mono text-xs text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200">
            <span className="text-lg">✈️</span>
            <span>TELEGRAM</span>
          </a>
          <a href="https://twitter.com/ResurgoApp" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-950 py-4 font-mono text-xs text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200">
            <span className="text-lg">𝕏</span>
            <span>TWITTER</span>
          </a>
        </div>

        <div className="mt-6 border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
          <p className="font-mono text-xs text-zinc-500">
            Response time: <span className="text-zinc-300">Monday–Friday, 09:00–18:00 UTC</span>
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            For urgent issues, include &quot;[URGENT]&quot; in your subject line.
          </p>
        </div>
      </div>
    </main>
  );
}
