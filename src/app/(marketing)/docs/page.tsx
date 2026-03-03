import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Documentation — Resurgo Developer Docs | REST API, Webhooks & SDKs',
  description: 'Complete Resurgo API documentation. REST endpoints for goals, habits, stats, AI coaching, webhooks, Telegram integration, and more. Quickstart guide, authentication, rate limits, and error codes.',
  keywords: [
    'Resurgo API', 'developer docs', 'REST API documentation', 'habit tracker API',
    'goal tracking API', 'webhooks', 'Telegram bot API', 'AI coaching API',
    'productivity API', 'Resurgo developer', 'API reference', 'Resurgo integration',
  ],
  openGraph: {
    title: 'Resurgo API Documentation — Developer Docs',
    description: 'Complete REST API reference for goals, habits, AI coaching, webhooks, and integrations.',
    type: 'website',
    url: 'https://resurgo.life/docs',
  },
  twitter: {
    card: 'summary',
    title: 'Resurgo API Docs',
    description: 'Complete REST API reference for goals, habits, AI coaching, and integrations.',
  },
  alternates: { canonical: 'https://resurgo.life/docs' },
};

/* ── Endpoint data ────────────────────────────────────────────────────────── */

const CORE_ENDPOINTS = [
  { method: 'GET',  path: '/api/v1',              desc: 'API health check — returns version, status, and available endpoints' },
  { method: 'GET',  path: '/api/v1/goals',         desc: 'List all goals for the authenticated user (supports pagination)' },
  { method: 'POST', path: '/api/v1/goals',         desc: 'Create a new goal with title, category, timeline, and milestones' },
  { method: 'GET',  path: '/api/v1/habits',        desc: 'List all habits with streak data (daily, weekly frequency)' },
  { method: 'POST', path: '/api/v1/habits/log',    desc: 'Log a habit completion — updates streak and awards XP' },
  { method: 'GET',  path: '/api/v1/stats',         desc: 'Get productivity statistics: streaks, completion rates, XP, level' },
];

const AI_ENDPOINTS = [
  { method: 'POST', path: '/api/ai/chat',           desc: 'Send a message to the AI coach — returns coaching response' },
  { method: 'POST', path: '/api/ai/suggestions',    desc: 'Get AI-powered suggestions for habits, tasks, or goals' },
  { method: 'POST', path: '/api/ai/decompose',      desc: 'Decompose a goal into milestones, tasks, and daily actions via AI' },
  { method: 'POST', path: '/api/coach',             desc: 'Invoke a specific AI coach persona (Marcus, Aurora, Titan, etc.)' },
  { method: 'POST', path: '/api/chatbot',           desc: 'Kai chatbot — conversational AI for general productivity help' },
  { method: 'POST', path: '/api/chatbot/events',    desc: 'Stream chatbot events for real-time conversation updates' },
];

const INTEGRATION_ENDPOINTS = [
  { method: 'POST', path: '/api/telegram/webhook',           desc: 'Telegram bot webhook — receives messages and commands' },
  { method: 'POST', path: '/api/webhooks/dodo',              desc: 'Dodo Payments webhook — processes payment events' },
  { method: 'POST', path: '/api/webhooks/clerk-billing',     desc: 'Clerk auth webhook — handles user events and billing sync' },
  { method: 'POST', path: '/api/vision-board/generate',      desc: 'Generate a vision board image from user goals' },
  { method: 'POST', path: '/api/partner-engine',             desc: 'Partner engine — find accountability partners' },
  { method: 'POST', path: '/api/onboarding/detect-archetype', desc: 'Detect user archetype from onboarding answers' },
];

const ERROR_CODES = [
  { code: '200', meaning: 'OK — Request succeeded' },
  { code: '201', meaning: 'Created — Resource created successfully' },
  { code: '400', meaning: 'Bad Request — Invalid parameters or missing fields' },
  { code: '401', meaning: 'Unauthorized — Missing or invalid API key' },
  { code: '403', meaning: 'Forbidden — Insufficient permissions for this action' },
  { code: '404', meaning: 'Not Found — Resource does not exist' },
  { code: '429', meaning: 'Rate Limited — Too many requests, try again later' },
  { code: '500', meaning: 'Internal Error — Something went wrong on our end' },
];

/* ── Component ────────────────────────────────────────────────────────────── */

export default function DocsPage() {
  const docsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: 'Resurgo API Documentation',
    description: 'Complete REST API reference for the Resurgo productivity platform.',
    url: 'https://resurgo.life/docs',
    author: { '@type': 'Organization', name: 'Resurgo' },
    dateModified: '2026-02-15',
    about: {
      '@type': 'SoftwareApplication',
      name: 'Resurgo',
      applicationCategory: 'ProductivityApplication',
    },
  };

  const methodColor = (m: string) =>
    m === 'GET' ? 'border-blue-900 text-blue-400' :
    m === 'POST' ? 'border-green-900 text-green-400' :
    m === 'PUT' ? 'border-yellow-900 text-yellow-400' :
    m === 'DELETE' ? 'border-red-900 text-red-400' :
    'border-zinc-800 text-zinc-400';

  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-8 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: DEVELOPER_DOCS</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">API Reference</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">Build on top of Resurgo with our REST API, webhooks, and integrations. 17+ endpoints available.</p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">TABLE_OF_CONTENTS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4">
            {[
              { label: 'Quickstart', anchor: '#quickstart' },
              { label: 'Authentication', anchor: '#auth' },
              { label: 'Core Endpoints', anchor: '#core' },
              { label: 'AI Endpoints', anchor: '#ai' },
              { label: 'Integrations', anchor: '#integrations' },
              { label: 'Rate Limits', anchor: '#rates' },
              { label: 'Error Codes', anchor: '#errors' },
              { label: 'Webhooks', anchor: '#webhooks' },
            ].map(({ label, anchor }) => (
              <a key={anchor} href={anchor}
                className="border border-zinc-800 px-3 py-2 font-mono text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition text-center">
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* Quickstart */}
        <div id="quickstart" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">QUICKSTART</div>
          <div className="p-5 space-y-4 font-mono text-sm">
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-zinc-400">1. GENERATE_API_KEY</p>
              <p className="text-zinc-400">Go to Dashboard &rarr; Integrations &rarr; API Keys &rarr; Generate Key</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-zinc-400">2. MAKE_FIRST_REQUEST</p>
              <div className="border border-zinc-800 bg-black p-4">
                <pre className="text-xs text-green-400 overflow-x-auto">{`curl https://resurgo.life/api/v1 \\
  -H "x-api-key: rsg_your_key_here"`}</pre>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-zinc-400">3. RESPONSE</p>
              <div className="border border-zinc-800 bg-black p-4">
                <pre className="text-xs text-orange-400 overflow-x-auto">{`{
  "version": "1.4.0",
  "status": "operational",
  "endpoints": {
    "goals": "/api/v1/goals",
    "habits": "/api/v1/habits",
    "stats": "/api/v1/stats"
  }
}`}</pre>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-zinc-400">4. CREATE_A_GOAL</p>
              <div className="border border-zinc-800 bg-black p-4">
                <pre className="text-xs text-green-400 overflow-x-auto">{`curl -X POST https://resurgo.life/api/v1/goals \\
  -H "x-api-key: rsg_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Learn Spanish",
    "category": "learning",
    "timeline": "6 months",
    "description": "Reach B1 level conversational fluency"
  }'`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div id="auth" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">AUTHENTICATION</div>
          <div className="p-5 space-y-3 font-mono text-sm text-zinc-400">
            <p>All API requests require authentication via API key. Pass your key in the request header:</p>
            <div className="border border-zinc-800 bg-black p-4">
              <pre className="text-xs text-orange-400">{`x-api-key: rsg_your_api_key_here
# or
Authorization: Bearer rsg_your_api_key_here`}</pre>
            </div>
            <p className="text-xs text-zinc-400">
              Generate API keys from your <Link href="/integrations" className="text-orange-400 hover:underline">Integrations dashboard</Link>. 
              Keys start with <span className="text-orange-400">rsg_</span> and are shown once upon generation.
            </p>
            <div className="border border-dashed border-zinc-800 bg-black/50 p-3 text-xs">
              <p className="text-yellow-400 font-bold text-xs tracking-widest mb-1">SECURITY_NOTE</p>
              <p className="text-zinc-500">Never expose your API key in client-side code or public repositories. Use environment variables and server-side requests only.</p>
            </div>
          </div>
        </div>

        {/* Core Endpoints */}
        <div id="core" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">CORE_ENDPOINTS</div>
          <div className="divide-y divide-zinc-900">
            {CORE_ENDPOINTS.map(({ method, path, desc }) => (
              <div key={path + method} className="flex items-center gap-4 px-5 py-3">
                <span className={`shrink-0 border px-2 py-0.5 font-mono text-xs font-bold tracking-widest ${methodColor(method)}`}>
                  {method}
                </span>
                <span className="font-mono text-xs text-zinc-300 min-w-[180px]">{path}</span>
                <span className="font-mono text-xs text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Example: Create Goal Response */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">EXAMPLE_RESPONSE :: POST /api/v1/goals</div>
          <div className="p-5">
            <div className="border border-zinc-800 bg-black p-4">
              <pre className="text-xs text-orange-400 overflow-x-auto">{`{
  "success": true,
  "goal": {
    "id": "g_abc123xyz",
    "title": "Learn Spanish",
    "category": "learning",
    "progress": 0,
    "milestones": [
      { "title": "Complete A1 basics", "target": "Month 1" },
      { "title": "Hold 5-min conversation", "target": "Month 3" },
      { "title": "Pass B1 test", "target": "Month 6" }
    ],
    "createdAt": "2026-02-15T10:30:00Z",
    "status": "active"
  }
}`}</pre>
            </div>
          </div>
        </div>

        {/* AI Endpoints */}
        <div id="ai" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">AI_ENDPOINTS</div>
          <div className="divide-y divide-zinc-900">
            {AI_ENDPOINTS.map(({ method, path, desc }) => (
              <div key={path} className="flex items-center gap-4 px-5 py-3">
                <span className={`shrink-0 border px-2 py-0.5 font-mono text-xs font-bold tracking-widest ${methodColor(method)}`}>
                  {method}
                </span>
                <span className="font-mono text-xs text-zinc-300 min-w-[220px]">{path}</span>
                <span className="font-mono text-xs text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Example: AI Chat */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">EXAMPLE :: POST /api/ai/chat</div>
          <div className="p-5 space-y-3">
            <p className="font-mono text-xs tracking-widest text-zinc-400">REQUEST_BODY</p>
            <div className="border border-zinc-800 bg-black p-4">
              <pre className="text-xs text-green-400 overflow-x-auto">{`{
  "message": "I keep procrastinating on my coding project",
  "coach": "marcus",
  "context": { "currentStreak": 5, "level": 12 }
}`}</pre>
            </div>
            <p className="font-mono text-xs tracking-widest text-zinc-400">RESPONSE</p>
            <div className="border border-zinc-800 bg-black p-4">
              <pre className="text-xs text-orange-400 overflow-x-auto">{`{
  "response": "Procrastination on a project you care about usually means the next step isn't clear enough. Break it into a 15-minute task. What's the smallest thing you could ship today?",
  "coach": "marcus",
  "actionItems": [
    "Define one small deliverable for today",
    "Set a 25-min focus session",
    "Review progress tomorrow"
  ]
}`}</pre>
            </div>
          </div>
        </div>

        {/* Integration Endpoints */}
        <div id="integrations" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">INTEGRATION_ENDPOINTS</div>
          <div className="divide-y divide-zinc-900">
            {INTEGRATION_ENDPOINTS.map(({ method, path, desc }) => (
              <div key={path} className="flex items-center gap-4 px-5 py-3">
                <span className={`shrink-0 border px-2 py-0.5 font-mono text-xs font-bold tracking-widest ${methodColor(method)}`}>
                  {method}
                </span>
                <span className="font-mono text-xs text-zinc-300 min-w-[280px]">{path}</span>
                <span className="font-mono text-xs text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks */}
        <div id="webhooks" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">WEBHOOKS</div>
          <div className="p-5 space-y-4 font-mono text-sm text-zinc-400">
            <p>Resurgo supports outgoing webhooks to notify your systems when events occur. Configure webhooks in Dashboard &rarr; Integrations &rarr; Webhooks.</p>
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-zinc-300 font-bold">AVAILABLE_EVENTS</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'goal.created', 'goal.completed', 'goal.updated',
                  'habit.logged', 'habit.streak_milestone',
                  'user.level_up', 'user.achievement_unlocked',
                  'session.focus_completed',
                  'payment.succeeded', 'payment.failed',
                ].map((event) => (
                  <div key={event} className="flex items-center gap-2 border border-zinc-800 px-3 py-1.5">
                    <span className="text-orange-600">&gt;</span>
                    <code className="text-xs text-zinc-300">{event}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-zinc-300 font-bold">WEBHOOK_PAYLOAD_EXAMPLE</p>
              <div className="border border-zinc-800 bg-black p-4">
                <pre className="text-xs text-orange-400 overflow-x-auto">{`{
  "event": "habit.logged",
  "timestamp": "2026-02-15T08:00:00Z",
  "data": {
    "habitId": "h_xyz789",
    "habitName": "Morning Meditation",
    "streak": 21,
    "xpAwarded": 25
  },
  "signature": "sha256=..."
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Rate limits */}
        <div id="rates" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">RATE_LIMITS</div>
          <div className="grid divide-x divide-zinc-900 grid-cols-3">
            {[
              { plan: 'FREE', limit: '0 req/hr', note: 'No API access' },
              { plan: 'PRO', limit: '100 req/hr', note: 'Standard rate' },
              { plan: 'ENTERPRISE', limit: 'Custom', note: 'Contact us' },
            ].map(({ plan, limit, note }) => (
              <div key={plan} className="p-5 text-center">
                <p className="font-mono text-xs tracking-widest text-zinc-400">{plan}</p>
                <p className="mt-2 font-mono text-lg font-bold text-zinc-200">{limit}</p>
                <p className="mt-1 font-mono text-xs text-zinc-400">{note}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-900 p-4 font-mono text-xs text-zinc-500">
            Rate limit headers are included in every response: <code className="text-orange-400">X-RateLimit-Limit</code>, <code className="text-orange-400">X-RateLimit-Remaining</code>, <code className="text-orange-400">X-RateLimit-Reset</code>
          </div>
        </div>

        {/* Error Codes */}
        <div id="errors" className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">ERROR_CODES</div>
          <div className="divide-y divide-zinc-900">
            {ERROR_CODES.map(({ code, meaning }) => (
              <div key={code} className="flex items-center gap-4 px-5 py-2.5">
                <span className={`shrink-0 border px-2 py-0.5 font-mono text-xs font-bold tracking-widest ${
                  code.startsWith('2') ? 'border-green-900 text-green-400' :
                  code.startsWith('4') ? 'border-yellow-900 text-yellow-400' :
                  'border-red-900 text-red-400'
                }`}>
                  {code}
                </span>
                <span className="font-mono text-xs text-zinc-400">{meaning}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-900 p-4">
            <p className="font-mono text-xs tracking-widest text-zinc-400 mb-2">ERROR_RESPONSE_FORMAT</p>
            <div className="border border-zinc-800 bg-black p-3">
              <pre className="text-xs text-red-400 overflow-x-auto">{`{
  "error": true,
  "code": 401,
  "message": "Invalid API key. Check your x-api-key header.",
  "docs": "https://resurgo.life/docs#auth"
}`}</pre>
            </div>
          </div>
        </div>

        {/* SDK / Libraries */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">SDKs_&amp;_LIBRARIES</div>
          <div className="p-5 space-y-3 font-mono text-sm text-zinc-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { lang: 'JavaScript / Node.js', status: 'Available', code: 'npm install @resurgo/sdk' },
                { lang: 'Python', status: 'Coming Soon', code: 'pip install resurgo' },
                { lang: 'cURL', status: 'Available', code: 'Works out of the box' },
                { lang: 'Telegram Bot', status: 'Built-in', code: '@ResurgoBot on Telegram' },
              ].map(({ lang, status, code }) => (
                <div key={lang} className="border border-zinc-800 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-300">{lang}</p>
                    <span className={`text-xs tracking-widest px-1.5 py-0.5 border ${
                      status === 'Available' ? 'border-green-900 text-green-400' :
                      status === 'Built-in' ? 'border-blue-900 text-blue-400' :
                      'border-zinc-800 text-zinc-500'
                    }`}>{status.toUpperCase()}</span>
                  </div>
                  <code className="text-xs text-orange-400">{code}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/help" className="border border-zinc-800 bg-zinc-950 p-4 text-center font-mono text-xs text-zinc-400 hover:bg-zinc-900 transition">
            HELP_CENTER
          </Link>
          <Link href="/support" className="border border-zinc-800 bg-zinc-950 p-4 text-center font-mono text-xs text-zinc-400 hover:bg-zinc-900 transition">
            SUPPORT
          </Link>
          <Link href="/changelog" className="border border-zinc-800 bg-zinc-950 p-4 text-center font-mono text-xs text-zinc-400 hover:bg-zinc-900 transition">
            CHANGELOG
          </Link>
        </div>
      </div>
    </main>
  );
}
