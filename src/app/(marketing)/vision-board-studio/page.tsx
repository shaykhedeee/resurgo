// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Studio Landing Page
// Route: /vision-board-studio
// ═══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import Link from 'next/link';

const APP_URL = 'https://resurgo.life';

export const metadata: Metadata = {
  title: 'AI Vision Board Maker — Resurgo Vision Board Studio',
  description:
    'The most accurate AI vision board generator. Powered by your personality, goals, and psychology — not generic stock photos. ImagineArt + Freepik quality. Free to try.',
  keywords: [
    'AI vision board maker',
    'vision board generator',
    'AI vision board',
    'best vision board app 2025',
    'vision board with AI images',
    'personalized vision board',
    'psychological vision board',
    'dream board creator',
  ],
  alternates: { canonical: `${APP_URL}/vision-board-studio` },
  openGraph: {
    title: 'AI Vision Board Maker — Resurgo',
    description: 'Generate deeply personal vision boards powered by your personality type and life goals.',
    url: `${APP_URL}/vision-board-studio`,
    type: 'website',
  },
};

const STEPS = [
  {
    num: '01',
    title: 'Answer 4 quick questions',
    desc: 'Choose your life domains (career, health, wealth), describe your specific vision in your own words, and pick a visual style.',
    icon: '✦',
    color: '#f97316',
  },
  {
    num: '02',
    title: 'AI analyzes your psychology',
    desc: 'RESURGO reads your personality profile, archetype, habit patterns, and goal history to understand what imagery will resonate with YOU.',
    icon: '◈',
    color: '#8b5cf6',
  },
  {
    num: '03',
    title: 'Premium AI generates your images',
    desc: 'ImagineArt + Freepik AI render cinematic, photorealistic images of YOUR specific vision — not generic stock photos.',
    icon: '⬡',
    color: '#10b981',
  },
  {
    num: '04',
    title: 'Download and live it',
    desc: 'Your vision board is saved to your dashboard. Download HD PNG, set as your wallpaper, and revisit daily as your north star.',
    icon: '◉',
    color: '#f59e0b',
  },
];

const FEATURES = [
  {
    title: 'Personality-driven imagery',
    desc: 'High-conscientiousness? You get structured achievement scenes. High-openness? Surreal, creative vistas. Your board adapts to your psychology.',
    icon: '🧠',
  },
  {
    title: 'Your words → AI prompts',
    desc: 'Say "I want to run a 7-figure agency from Ibiza" — the AI generates exactly that scene with cinematic precision, not a generic "business success" photo.',
    icon: '🎯',
  },
  {
    title: 'ImagineArt + Freepik quality',
    desc: 'Premium AI providers generate photorealistic, magazine-grade imagery. Backed by Pollinations, HuggingFace, Stability AI as cascade fallbacks.',
    icon: '✨',
  },
  {
    title: '4 curated visual styles',
    desc: 'Pinterest Bold, Clean Minimal, Luxury Editorial, or Cinematic Dream. Each style has its own color system, layout, and visual language.',
    icon: '🎨',
  },
  {
    title: 'Stock image library search',
    desc: 'Prefer curated photos? Search 10M+ images from Pexels, Unsplash, and Getty directly inside the studio.',
    icon: '🖼️',
  },
  {
    title: 'HD Download + Dashboard sync',
    desc: 'Download your board as a high-resolution PNG. It also lives on your dashboard — a daily visual reminder of where you\'re heading.',
    icon: '⬇️',
  },
];

const SOCIAL_PROOF = [
  { emoji: '💪', quote: 'First vision board that actually feels like ME', name: 'Alex T.', role: 'Entrepreneur' },
  { emoji: '🎯', quote: 'The cinematic imagery keeps me motivated daily', name: 'Sarah K.', role: 'Designer' },
  { emoji: '🚀', quote: 'I screenshot it and use it as my phone wallpaper', name: 'James M.', role: 'Founder' },
];

const STYLES = [
  { name: 'Pinterest Bold', desc: 'High contrast, dynamic, aspirational', gradient: 'from-orange-900/40 to-red-900/40', border: 'border-orange-800' },
  { name: 'Clean Minimal', desc: 'Airy, calm, soft natural light', gradient: 'from-zinc-900/80 to-zinc-800/40', border: 'border-zinc-700' },
  { name: 'Luxury Editorial', desc: 'Gold tones, magazine-grade polish', gradient: 'from-yellow-900/40 to-amber-900/40', border: 'border-yellow-800' },
  { name: 'Cinematic Dream', desc: 'Moody, dramatic, depth of field', gradient: 'from-violet-900/40 to-indigo-900/40', border: 'border-violet-800' },
];

export default function VisionBoardStudioPage() {
  return (
    <main className="bg-black text-zinc-100 min-h-screen overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-purple-500/6 rounded-full blur-3xl" />
        </div>

        {/* Pixel badge */}
        <div className="inline-flex items-center gap-2 border border-orange-800 bg-orange-950/20 px-3 py-1 rounded-full mb-6">
          <span className="text-orange-400 text-[9px] tracking-widest font-mono">✦ AI_VISION_BOARD_STUDIO</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto">
          The Most Accurate{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">AI Vision Board</span>
          {' '}Ever Made
        </h1>

        <p className="mt-5 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Powered by your personality profile, archetype, and specific life goals.
          Not generic stock photos — cinematic AI-generated imagery of <em>your exact vision</em>.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-up"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-lg transition text-sm">
            ✦ Create My Vision Board — Free
          </Link>
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-lg transition text-sm">
            Already a member →
          </Link>
        </div>

        <p className="mt-3 text-zinc-600 text-xs">Free to try · No credit card · Takes 2 minutes</p>

        {/* Hero mockup */}
        <div className="relative mt-14 max-w-3xl mx-auto">
          {/* Pixel corner decorations */}
          <svg className="absolute -top-3 -left-3 w-10 h-10 opacity-60" viewBox="0 0 40 40" aria-hidden="true">
            <rect x="0" y="0" width="8" height="4" fill="#f97316"/>
            <rect x="0" y="4" width="4" height="4" fill="#f97316" opacity="0.7"/>
            <rect x="0" y="8" width="4" height="4" fill="#f97316" opacity="0.4"/>
            <rect x="4" y="0" width="4" height="4" fill="#f97316" opacity="0.7"/>
          </svg>
          <svg className="absolute -top-3 -right-3 w-10 h-10 opacity-60" viewBox="0 0 40 40" aria-hidden="true">
            <rect x="32" y="0" width="8" height="4" fill="#8b5cf6"/>
            <rect x="36" y="4" width="4" height="4" fill="#8b5cf6" opacity="0.7"/>
            <rect x="36" y="8" width="4" height="4" fill="#8b5cf6" opacity="0.4"/>
            <rect x="28" y="0" width="4" height="4" fill="#8b5cf6" opacity="0.7"/>
          </svg>

          {/* Board mockup */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-sm font-bold text-orange-400">My 2025 Empire Vision</div>
              <div className="text-[10px] text-zinc-500 italic mt-1">&ldquo;I build empires with intention and live life on my terms&rdquo;</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { cat: 'CAREER', emoji: '🚀', color: 'from-orange-900/60', text: 'Leading my own 7-figure agency' },
                { cat: 'WEALTH', emoji: '💰', color: 'from-amber-900/60', text: 'Financial freedom by 30' },
                { cat: 'HEALTH', emoji: '💪', color: 'from-green-900/60', text: 'Athletic peak physique' },
                { cat: 'TRAVEL', emoji: '✈️', color: 'from-blue-900/60', text: 'Working from Ibiza & Bali' },
                { cat: 'MINDSET', emoji: '🧘', color: 'from-violet-900/60', text: 'Unshakeable inner peace' },
                { cat: 'RELATIONSHIP', emoji: '❤️', color: 'from-pink-900/60', text: 'Deep love & partnership' },
              ].map((panel) => (
                <div key={panel.cat}
                  className={`aspect-square rounded-lg bg-gradient-to-b ${panel.color} to-zinc-900 border border-zinc-800 flex flex-col items-center justify-end p-2`}>
                  <span className="text-xl mb-1">{panel.emoji}</span>
                  <span className="text-[8px] text-zinc-300 text-center leading-tight">{panel.text}</span>
                  <span className="text-[7px] text-zinc-600 mt-0.5 font-mono">{panel.cat}</span>
                </div>
              ))}
            </div>
            {/* Pixel brand mark */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-[8px] text-zinc-700 font-mono">resurgo.life</span>
              <span className="text-[8px] text-orange-700 font-mono">VISION_BOARD_v2.1</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-mono tracking-widest text-orange-500">✦ HOW_IT_WORKS</span>
            <h2 className="text-3xl font-bold mt-2">From prompt to masterpiece in 60 seconds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.num} className="relative border border-zinc-800 bg-zinc-950 rounded-xl p-5 hover:border-zinc-700 transition group">
                {/* Step connector line */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${step.color}20`, border: `1px solid ${step.color}40` }}>
                    <span>{step.icon}</span>
                  </div>
                  <span className="font-mono text-xs" style={{ color: step.color }}>{step.num}</span>
                </div>
                <h3 className="font-bold text-sm text-zinc-100 mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VISUAL STYLES ═══════════════════════════════════════════════════ */}
      <section className="py-16 px-4 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono tracking-widest text-purple-500">◈ VISUAL_STYLES</span>
            <h2 className="text-2xl font-bold mt-2">Four signature aesthetics</h2>
            <p className="text-zinc-500 text-sm mt-1">Each style has its own color system, layout, and visual language</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STYLES.map((style) => (
              <div key={style.name}
                className={`bg-gradient-to-br ${style.gradient} border ${style.border} rounded-xl p-4 text-center hover:scale-[1.02] transition`}>
                <div className="font-bold text-sm text-zinc-200 mb-1">{style.name}</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{style.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-mono tracking-widest text-green-500">⬡ CAPABILITIES</span>
            <h2 className="text-2xl font-bold mt-2">Everything your vision board needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat) => (
              <div key={feat.title}
                className="border border-zinc-800 bg-zinc-950/80 rounded-xl p-5 hover:border-zinc-700 transition">
                <div className="text-2xl mb-3">{feat.icon}</div>
                <h3 className="font-bold text-sm text-zinc-100 mb-1.5">{feat.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AI PROVIDERS ════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-mono tracking-widest text-amber-500">◉ IMAGE_PROVIDERS</span>
          <h2 className="text-xl font-bold mt-2 mb-2">Premium AI cascade — best quality, always</h2>
          <p className="text-zinc-500 text-sm mb-8">
            We try 6 AI providers in order of quality, so your board always has the best possible images.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { name: 'ImagineArt', badge: 'PRIMARY', color: 'text-orange-400 border-orange-800 bg-orange-950/20' },
              { name: 'Freepik AI', badge: 'PREMIUM', color: 'text-amber-400 border-amber-800 bg-amber-950/20' },
              { name: 'Pollinations', badge: 'FREE', color: 'text-zinc-400 border-zinc-700 bg-zinc-900/40' },
              { name: 'HuggingFace', badge: 'FREE', color: 'text-zinc-400 border-zinc-700 bg-zinc-900/40' },
              { name: 'Stability AI', badge: 'FALLBACK', color: 'text-zinc-500 border-zinc-800 bg-zinc-900/20' },
              { name: 'Gemini', badge: 'FALLBACK', color: 'text-zinc-500 border-zinc-800 bg-zinc-900/20' },
            ].map((p, i) => (
              <div key={p.name} className={`border rounded-lg p-3 ${p.color}`}>
                <div className="text-[9px] font-mono mb-1">{String(i + 1).padStart(2, '0')}</div>
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[8px] mt-0.5 opacity-70">{p.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF ════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500">{`// USER_FEEDBACK`}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SOCIAL_PROOF.map((testimonial) => (
              <div key={testimonial.name}
                className="border border-zinc-800 bg-zinc-950 rounded-xl p-5">
                <div className="text-2xl mb-3">{testimonial.emoji}</div>
                <p className="text-zinc-300 text-sm italic mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="text-zinc-400 text-xs font-semibold">{testimonial.name}</div>
                  <div className="text-zinc-600 text-[10px]">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          {/* Pixel decorations */}
          <div className="flex justify-center gap-1 mb-8" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-sm"
                style={{
                  backgroundColor: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#8b5cf6' : '#10b981',
                  opacity: 0.3 + (i / 12) * 0.7,
                }} />
            ))}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Build your board. Live your vision.
          </h2>
          <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
            Join thousands using RESURGO to visualize and execute their biggest life goals.
            Vision Board is available on the <span className="text-amber-400">Pro</span> plan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-lg transition">
              ✦ Start Free — Create My Board
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-amber-700 text-zinc-300 hover:text-amber-400 rounded-lg transition text-sm">
              See Pro pricing →
            </Link>
          </div>

          <p className="mt-4 text-zinc-600 text-[10px] font-mono">
            FREE_TIER_AVAILABLE · PRO_FROM_$9/MO · CANCEL_ANYTIME
          </p>
        </div>
      </section>

    </main>
  );
}
