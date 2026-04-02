'use client';

// ════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Guided Creation Wizard v2
// 5-step wizard: board type → vision → domains → details → style
// ════════════════════════════════════════════════════════════════

import { useState } from 'react';

export interface VisionBoardWizardResult {
  boardType: 'manifesting' | 'gratitude' | 'yearly' | 'vision' | 'custom';
  overarchingVision: string;
  domains: string[];
  domainDetails: Record<string, string>;
  stylePreset: 'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream';
  mood: string;
  customPromptBoost: string;
}

interface Props {
  onComplete: (result: VisionBoardWizardResult) => void;
  onSkip: () => void;
}

const BOARD_TYPES = [
  {
    id: 'manifesting' as const,
    label: 'Manifesting Board',
    desc: 'Every image shows the goal as ALREADY achieved. Present tense. You\'ve arrived.',
    emoji: '✦',
    color: 'from-orange-900/50 to-amber-900/30',
    border: 'border-orange-700',
    tag: 'Most Popular',
  },
  {
    id: 'vision' as const,
    label: 'Long-term Vision',
    desc: 'Your 3–5 year fully transformed life. Expansive, aspirational, big picture.',
    emoji: '◈',
    color: 'from-purple-900/50 to-violet-900/30',
    border: 'border-purple-700',
    tag: '',
  },
  {
    id: 'yearly' as const,
    label: `${new Date().getFullYear()} Theme Board`,
    desc: 'Your defining vision for THIS year. Bold, focused, energized.',
    emoji: '◉',
    color: 'from-blue-900/50 to-cyan-900/30',
    border: 'border-blue-700',
    tag: 'Seasonal',
  },
  {
    id: 'gratitude' as const,
    label: 'Gratitude Board',
    desc: 'What you\'re grateful for NOW. Warm, abundant, present-tense celebration.',
    emoji: '❤',
    color: 'from-rose-900/50 to-pink-900/30',
    border: 'border-rose-700',
    tag: '',
  },
  {
    id: 'custom' as const,
    label: 'Custom / Mixed',
    desc: 'Build a completely personalized board — you define the rules.',
    emoji: '⬡',
    color: 'from-zinc-900/80 to-zinc-800/30',
    border: 'border-zinc-600',
    tag: '',
  },
];

const DOMAINS = [
  { id: 'HEALTH', icon: '💪', label: 'Health & Fitness', placeholder: 'e.g. "Athletic physique, running a 10K, morning workouts, peak energy"' },
  { id: 'CAREER', icon: '🚀', label: 'Career & Business', placeholder: 'e.g. "Founder of a 7-figure SaaS, speaking on stages, building a team"' },
  { id: 'WEALTH', icon: '💰', label: 'Wealth & Finance', placeholder: 'e.g. "Penthouse apartment, investment portfolio, passive income, luxury car"' },
  { id: 'RELATIONSHIP', icon: '❤️', label: 'Love & Relationships', placeholder: 'e.g. "Deep love partnership, strong friendships, surrounded by people who inspire"' },
  { id: 'LEARNING', icon: '📚', label: 'Learning & Skills', placeholder: 'e.g. "Fluent in Spanish, expert-level coding, 30 books/year, PhD"' },
  { id: 'TRAVEL', icon: '✈️', label: 'Travel & Adventure', placeholder: 'e.g. "Bali, Japan, Alps, 3 international trips/year, digital nomad"' },
  { id: 'MINDSET', icon: '🧘', label: 'Mindset & Wellness', placeholder: 'e.g. "Daily meditation, calm under pressure, resilience, inner peace"' },
  { id: 'CREATIVITY', icon: '🎨', label: 'Creativity & Passion', placeholder: 'e.g. "Published author, music producer, photography, art studio"' },
  { id: 'SPIRITUALITY', icon: '🌟', label: 'Spirituality & Purpose', placeholder: 'e.g. "Connected to purpose, daily gratitude practice, spiritual discipline"' },
  { id: 'LEADERSHIP', icon: '👑', label: 'Leadership & Legacy', placeholder: 'e.g. "Leading a movement, mentoring others, leaving a lasting impact"' },
  { id: 'FAMILY', icon: '🏡', label: 'Family & Home', placeholder: 'e.g. "Dream home, strong family bonds, present parent, multigenerational legacy"' },
  { id: 'IMPACT', icon: '🌍', label: 'Impact & Purpose', placeholder: 'e.g. "Changing 1M lives, building a foundation, meaningful work at scale"' },
];

const STYLE_OPTIONS = [
  { id: 'pinterest-bold' as const, label: 'Pinterest Bold', desc: 'High contrast, vibrant, aspirational energy', emoji: '⚡', palette: '#f97316, #111, #fbbf24' },
  { id: 'clean-minimal' as const, label: 'Clean Minimal', desc: 'Airy white space, soft natural light, calm', emoji: '🌿', palette: '#0ea5e9, #0f172a, #7dd3fc' },
  { id: 'luxury-editorial' as const, label: 'Luxury Editorial', desc: 'Premium magazine feel, gold-black sophistication', emoji: '✨', palette: '#d97706, #080808, #fde68a' },
  { id: 'cinematic-dream' as const, label: 'Cinematic Dream', desc: 'Moody, dramatic depth of field, film-grade', emoji: '🎬', palette: '#7c3aed, #0c001a, #c4b5fd' },
];

const MOOD_OPTIONS = [
  { label: 'Ambitious & Bold', emoji: '🔥', value: 'Ambitious & Bold' },
  { label: 'Calm & Peaceful', emoji: '🌊', value: 'Calm & Peaceful' },
  { label: 'Luxurious & Premium', emoji: '💫', value: 'Luxurious & Premium' },
  { label: 'Raw & Authentic', emoji: '⚡', value: 'Raw & Authentic' },
  { label: 'Spiritual & Mindful', emoji: '🌙', value: 'Spiritual & Mindful' },
  { label: 'Adventurous & Free', emoji: '🌿', value: 'Adventurous & Free' },
  { label: 'Focused & Disciplined', emoji: '🎯', value: 'Focused & Disciplined' },
  { label: 'Creative & Expressive', emoji: '🎨', value: 'Creative & Expressive' },
];

const VISION_EXAMPLES = [
  'I wake up every day energized, building my dream business from a beautiful home office, while staying healthy and present for the people I love.',
  'My life in 3 years: financially free, living abroad, leading a team I\'m proud of, and in the best shape of my life.',
  'I am the person who has it all together — focused, wealthy, healthy, doing work that matters and fully alive.',
];

const TOTAL_STEPS = 5;

export default function VisionBoardWizard({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(1);
  const [boardType, setBoardType] = useState<VisionBoardWizardResult['boardType']>('manifesting');
  const [overarchingVision, setOverarchingVision] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [domainDetails, setDomainDetails] = useState<Record<string, string>>({});
  const [stylePreset, setStylePreset] = useState<VisionBoardWizardResult['stylePreset']>('pinterest-bold');
  const [mood, setMood] = useState('Ambitious & Bold');
  const [customBoost, setCustomBoost] = useState('');
  // AI suggestion state — tracks which domain (if any) is loading
  const [suggestingDomain, setSuggestingDomain] = useState<string | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const maxDomains = 9; // up to 9 panels for pro boards

  const handleAISuggest = async (domainId: string) => {
    if (suggestingDomain) return; // one at a time
    setSuggestingDomain(domainId);
    setSuggestError(null);
    try {
      const res = await fetch('/api/vision-board/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainId,
          domainLabel: DOMAINS.find((d) => d.id === domainId)?.label ?? domainId,
          overarchingVision,
          boardType,
          mood,
          stylePreset,
        }),
      });
      const json = (await res.json()) as { suggestion?: string; error?: string };
      if (!res.ok || !json.suggestion) throw new Error(json.error ?? 'Suggestion failed');
      setDomainDetails((prev) => ({ ...prev, [domainId]: json.suggestion! }));
    } catch (err) {
      setSuggestError(err instanceof Error ? err.message : 'AI suggestion failed');
      setTimeout(() => setSuggestError(null), 4000);
    } finally {
      setSuggestingDomain(null);
    }
  };

  const toggleDomain = (id: string) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id].slice(0, maxDomains)
    );
  };

  const canProceed = () => {
    if (step === 1) return true; // board type always selected
    if (step === 2) return overarchingVision.trim().length > 10;
    if (step === 3) return selectedDomains.length >= 2;
    if (step === 4) return selectedDomains.every((d) => (domainDetails[d] ?? '').trim().length > 0);
    return true;
  };

  const handleComplete = () => {
    onComplete({
      boardType,
      overarchingVision,
      domains: selectedDomains,
      domainDetails,
      stylePreset,
      mood,
      customPromptBoost: customBoost,
    });
  };

  const stepLabels = ['Board Type', 'Your Vision', 'Life Domains', 'Details', 'Aesthetic'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Terminal header */}
      <div className="border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
          </div>
          <span className="font-mono text-[0.45rem] tracking-widest text-zinc-500">
            VISION_BOARD_WIZARD.sh — {stepLabels[step - 1]?.toUpperCase()} ({step}/{TOTAL_STEPS})
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-3.5 transition-colors ${i + 1 <= step ? 'bg-orange-500' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-6 space-y-5">
          {/* ── STEP 1: Board Type ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_01 :: SELECT_BOARD_TYPE
                </p>
                <h3 className="font-bold text-lg text-zinc-100">What are you creating?</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Each board type uses different AI instructions to generate the right energy.
                </p>
              </div>
              <div className="space-y-2">
                {BOARD_TYPES.map((bt) => (
                  <button
                    key={bt.id}
                    type="button"
                    onClick={() => setBoardType(bt.id)}
                    className={`relative w-full flex items-start gap-3 border p-3.5 text-left transition rounded-lg ${
                      boardType === bt.id
                        ? `bg-gradient-to-r ${bt.color} ${bt.border} border`
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{bt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-zinc-100">{bt.label}</p>
                        {bt.tag && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-orange-700 text-orange-400 bg-orange-950/30">
                            {bt.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{bt.desc}</p>
                    </div>
                    {boardType === bt.id && (
                      <span className="shrink-0 font-mono text-[0.5rem] text-orange-500 mt-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Overarching vision ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_02 :: DEFINE_YOUR_VISION
                </p>
                <h3 className="font-bold text-lg text-zinc-100">
                  Describe your dream life in 1–3 sentences
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Be specific — emotions, environments, outcomes. This shapes every panel.
                </p>
              </div>

              {/* Example prompts */}
              <div className="space-y-2">
                <p className="font-mono text-[0.45rem] tracking-widest text-zinc-600">EXAMPLES FOR INSPIRATION:</p>
                {VISION_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOverarchingVision(ex)}
                    className="w-full text-left border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition rounded-lg"
                  >
                    &quot;{ex}&quot;
                  </button>
                ))}
              </div>

              <textarea
                value={overarchingVision}
                onChange={(e) => setOverarchingVision(e.target.value)}
                placeholder="Describe your ideal future life — where you are, who you are, what you have achieved..."
                rows={4}
                className="w-full border border-zinc-700 bg-black px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none resize-none rounded-lg"
              />
              <div className="flex justify-between text-xs text-zinc-600">
                <span>{overarchingVision.length} chars</span>
                <span>{overarchingVision.split(' ').filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Domain selection ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_03 :: SELECT_LIFE_DOMAINS
                </p>
                <h3 className="font-bold text-lg text-zinc-100">
                  Pick 2–9 areas of your life to visualize
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Each domain becomes a dedicated panel. Select what matters most right now.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDomain(d.id)}
                    className={`flex items-center gap-2 border px-3 py-2.5 text-left transition rounded-lg ${
                      selectedDomains.includes(d.id)
                        ? 'border-orange-600 bg-orange-950/30 text-orange-300'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    <span className="shrink-0 text-base">{d.icon}</span>
                    <span className="text-xs font-semibold">{d.label}</span>
                    {selectedDomains.includes(d.id) && (
                      <span className="ml-auto font-mono text-[0.5rem] text-orange-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>{selectedDomains.length}/{maxDomains} selected {selectedDomains.length < 2 && '· select at least 2'}</span>
                {selectedDomains.length >= 2 && <span className="text-green-500">Ready ✓</span>}
              </div>
            </div>
          )}

          {/* ── STEP 4: Domain details ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_04 :: DETAIL_EACH_DOMAIN
                </p>
                <h3 className="font-bold text-lg text-zinc-100">
                  Describe your vision in each area
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  These become the AI image prompts. More specific = better images.{' '}
                  <span className="text-orange-400/70">Use ✦ AI Suggest to auto-generate.</span>
                </p>
              </div>

              {suggestError && (
                <div className="border border-red-800 bg-red-950/30 rounded-lg px-3 py-2 text-xs text-red-400">
                  {suggestError}
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {selectedDomains.map((domainId) => {
                  const domain = DOMAINS.find((d) => d.id === domainId)!;
                  const filled = (domainDetails[domainId] ?? '').trim().length > 0;
                  const isLoading = suggestingDomain === domainId;
                  return (
                    <div key={domainId} className={`border rounded-lg p-3 space-y-2 ${filled ? 'border-zinc-700' : 'border-zinc-800 bg-zinc-900/20'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-zinc-200">
                          {domain.icon} {domain.label}
                        </p>
                        <div className="flex items-center gap-2">
                          {filled && <span className="text-[10px] text-green-500 font-mono">FILLED ✓</span>}
                          <button
                            type="button"
                            disabled={!!suggestingDomain}
                            onClick={() => handleAISuggest(domainId)}
                            className={`flex items-center gap-1 border border-orange-700/60 bg-orange-950/30 px-2 py-1 rounded text-[10px] font-mono text-orange-400 transition hover:border-orange-600 hover:text-orange-300 disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {isLoading ? (
                              <>
                                <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border border-orange-500 border-t-transparent" />
                                <span>THINKING…</span>
                              </>
                            ) : (
                              <>✦ AI Suggest</>
                            )}
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={domainDetails[domainId] ?? ''}
                        onChange={(e) =>
                          setDomainDetails((prev) => ({ ...prev, [domainId]: e.target.value }))
                        }
                        placeholder={domain.placeholder}
                        rows={2}
                        className="w-full border border-zinc-700 bg-black px-2.5 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none resize-none rounded"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-600">
                {selectedDomains.filter((d) => (domainDetails[d] ?? '').trim().length > 0).length} / {selectedDomains.length} complete
              </p>
            </div>
          )}

          {/* ── STEP 5: Style + mood ── */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_05 :: CHOOSE_AESTHETIC
                </p>
                <h3 className="font-bold text-lg text-zinc-100">
                  Choose your visual style & mood
                </h3>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Visual Style</p>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStylePreset(s.id)}
                      className={`flex items-start gap-2 border p-3 text-left transition rounded-lg ${
                        stylePreset === s.id
                          ? 'border-orange-600 bg-orange-950/30'
                          : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-base shrink-0">{s.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">{s.label}</p>
                        <p className="text-[0.65rem] text-zinc-500">{s.desc}</p>
                        <div className="flex gap-0.5 mt-1.5">
                          {s.palette.split(', ').map((c) => (
                            <span key={c} className="h-2 w-4 rounded-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Board Mood</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(m.value)}
                      className={`flex items-center gap-2 border px-3 py-2 text-xs rounded-lg transition ${
                        mood === m.value
                          ? 'border-orange-600 bg-orange-950/30 text-orange-300'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <span>{m.emoji}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">
                  Extra Details <span className="normal-case text-zinc-700">(optional)</span>
                </p>
                <textarea
                  value={customBoost}
                  onChange={(e) => setCustomBoost(e.target.value)}
                  placeholder="Specific objects, settings, colors, people? e.g. 'sunset tones, Ibiza backdrop, minimalist penthouse'"
                  rows={2}
                  className="w-full border border-zinc-700 bg-black px-2.5 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none resize-none rounded"
                />
              </div>

              {/* Summary */}
              <div className="border border-zinc-800 bg-zinc-900/20 rounded-lg p-3 text-xs space-y-1 text-zinc-500">
                <p className="text-zinc-400 font-semibold mb-1.5">Your board summary:</p>
                <p>🎯 <span className="text-zinc-300">{BOARD_TYPES.find((b) => b.id === boardType)?.label}</span></p>
                <p>🌍 {selectedDomains.length} domains: <span className="text-zinc-300">{selectedDomains.join(', ')}</span></p>
                <p>✨ Style: <span className="text-zinc-300">{STYLE_OPTIONS.find((s) => s.id === stylePreset)?.label}</span></p>
                <p>🔥 Mood: <span className="text-zinc-300">{mood}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-3">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 rounded-lg transition hover:border-zinc-500 hover:text-zinc-200"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition"
            >
              Skip wizard
            </button>
          </div>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="border-2 border-orange-600 bg-orange-600 px-5 py-2 text-sm font-bold text-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="border-2 border-orange-600 bg-orange-600 px-5 py-2 text-sm font-bold text-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500"
            >
              ✦ Generate My Board
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
