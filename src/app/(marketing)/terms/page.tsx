import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Resurgo | User Agreement',
  description: 'Resurgo terms of service. Read our user agreement covering account usage, billing, subscriptions, intellectual property, data privacy, and liability.',
  keywords: [
    'Resurgo terms of service', 'user agreement', 'terms and conditions',
    'Resurgo legal', 'subscription terms', 'refund policy',
  ],
  openGraph: {
    title: 'Terms of Service — Resurgo',
    description: 'Read our terms of service covering accounts, billing, subscriptions, and more.',
    type: 'website',
    url: 'https://resurgo.life/terms',
  },
  alternates: { canonical: 'https://resurgo.life/terms' },
};

export default function TermsPage() {
  const lastUpdated = 'February 2026';
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: TERMS_OF_SERVICE</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Terms of Service</h1>
            <p className="mt-1 font-mono text-xs text-zinc-400">Last updated: {lastUpdated}</p>
          </div>
        </div>
        <div className="space-y-6 font-mono text-sm text-zinc-400">
          {[
            {
              title: '1. ACCEPTANCE',
              body: 'By accessing or using Resurgo ("the Service"), you agree to be bound by these Terms. If you disagree, you may not use the Service.',
            },
            {
              title: '2. DESCRIPTION',
              body: 'Resurgo is a productivity and personal development platform that provides goal tracking, habit monitoring, AI coaching, and related features. We reserve the right to modify or discontinue the Service at any time.',
            },
            {
              title: '3. USER ACCOUNTS',
              body: 'You must provide accurate information when creating an account. You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorized access.',
            },
            {
              title: '4. ACCEPTABLE USE',
              body: 'You agree not to: (a) violate any laws, (b) infringe on any intellectual property rights, (c) transmit malicious code, (d) interfere with service infrastructure, (e) attempt to access unauthorized areas.',
            },
            {
              title: '5. PAYMENT & BILLING',
              body: 'Pro plans are billed monthly or annually. Subscriptions renew automatically. You can cancel at any time; cancellation takes effect at end of the current billing period. No refunds for partial periods.',
            },
            {
              title: '6. INTELLECTUAL PROPERTY',
              body: 'The Service and its original content, features, and functionality are owned by Resurgo and are protected by copyright, trademark, and other laws.',
            },
            {
              title: '7. DATA & PRIVACY',
              body: 'Your use of the Service is also governed by our Privacy Policy. By using Resurgo, you consent to our data practices as described therein.',
            },
            {
              title: '8. DISCLAIMER',
              body: 'THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR MEET YOUR SPECIFIC REQUIREMENTS.',
            },
            {
              title: '9. LIMITATION OF LIABILITY',
              body: 'IN NO EVENT SHALL RESURGO BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.',
            },
            {
              title: '10. CONTACT',
              body: 'Questions about these Terms? Email us at legal@resurgo.life.',
            },
          ].map(({ title, body }) => (
            <section key={title} className="border border-zinc-900 bg-zinc-950 p-5 space-y-2">
              <h2 className="text-xs font-bold text-zinc-200 tracking-widest">{title}</h2>
              <p className="text-zinc-400 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
