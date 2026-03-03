'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Deep Scan Protocol (5-Stage Onboarding)
// Stage 1: Identity Scan — who are you?
// Stage 2: Life Pillar Assessment — rate 8 life pillars
// Stage 3: Root Cause Analysis — what's blocked you before?
// Stage 4: Behavioral Fingerprint — how do you operate?
// Stage 5: Commitment Calibration — how ready are you?
// + AI System Generation screen
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Id } from '../../convex/_generated/dataModel';

// ─── Types ──────────────────────────────────────────────────────────────────
type Stage = 1 | 2 | 3 | 4 | 5 | 'generating' | 'complete';

interface PillarScores {
  health: number;
  career: number;
  finance: number;
  relationships: number;
  mindset: number;
  creativity: number;
  fun: number;
  environment: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const PILLARS: { key: keyof PillarScores; label: string; emoji: string; description: string }[] = [
  { key: 'health', label: 'Health & Body', emoji: '💪', description: 'Physical fitness, nutrition, sleep, energy' },
  { key: 'career', label: 'Career & Work', emoji: '💼', description: 'Job satisfaction, growth, impact, skills' },
  { key: 'finance', label: 'Finance & Wealth', emoji: '💰', description: 'Income, savings, investments, security' },
  { key: 'relationships', label: 'Relationships', emoji: '❤️', description: 'Family, friends, romance, community' },
  { key: 'mindset', label: 'Mindset & Growth', emoji: '🧠', description: 'Learning, resilience, confidence, clarity' },
  { key: 'creativity', label: 'Creativity', emoji: '🎨', description: 'Self-expression, hobbies, art, innovation' },
  { key: 'fun', label: 'Fun & Adventure', emoji: '🎮', description: 'Enjoyment, experiences, spontaneity, play' },
  { key: 'environment', label: 'Environment', emoji: '🏠', description: 'Living space, organization, comfort, nature' },
];

const LIFE_STAGES = [
  { id: 'student', label: 'Student', desc: 'Studying / In school' },
  { id: 'early_career', label: 'Early Career', desc: 'Just starting out (0-5 years)' },
  { id: 'mid_career', label: 'Mid Career', desc: 'Established professional' },
  { id: 'career_change', label: 'Career Change', desc: 'Pivoting to something new' },
  { id: 'entrepreneur', label: 'Entrepreneur', desc: 'Building my own thing' },
  { id: 'parent', label: 'Parent/Caregiver', desc: 'Primary focus on family' },
  { id: 'recovery', label: 'Recovery/Rebuild', desc: 'Rebuilding after a setback' },
  { id: 'retired', label: 'Retired/Transitioning', desc: 'New chapter of life' },
];

const SABOTAGE_PATTERNS = [
  { id: 'procrastination', label: 'Procrastination', desc: 'I delay important things until the last minute' },
  { id: 'perfectionism', label: 'Perfectionism', desc: 'If I can\'t do it perfectly, I won\'t start' },
  { id: 'overcommitting', label: 'Overcommitting', desc: 'I take on too much and burn out' },
  { id: 'self_doubt', label: 'Self-Doubt', desc: 'I don\'t believe I can follow through' },
  { id: 'distraction', label: 'Distraction Addiction', desc: 'Phone, social media, YouTube rabbit holes' },
  { id: 'all_or_nothing', label: 'All-or-Nothing', desc: 'One slip and I give up entirely' },
  { id: 'people_pleasing', label: 'People-Pleasing', desc: 'I put others\' needs before my own goals' },
  { id: 'comfort_zone', label: 'Comfort Zone', desc: 'I avoid discomfort even when it means growth' },
];

const CHRONOTYPES = [
  { id: 'early_bird', label: 'Early Bird 🌅', desc: 'Peak energy 5-10 AM' },
  { id: 'steady', label: 'Steady Burner ☀️', desc: 'Consistent energy throughout day' },
  { id: 'afternoon_peak', label: 'Afternoon Peak ⚡', desc: 'Energy peaks 12-5 PM' },
  { id: 'night_owl', label: 'Night Owl 🦉', desc: 'Best after 6 PM' },
];

const MOTIVATION_STYLES = [
  { id: 'intrinsic', label: 'Inner Drive', desc: 'I\'m motivated by personal meaning and mastery' },
  { id: 'extrinsic', label: 'Results-Driven', desc: 'I\'m motivated by visible outcomes and rewards' },
  { id: 'social', label: 'Social Fuel', desc: 'I thrive with community and accountability partners' },
  { id: 'competitive', label: 'Competitive', desc: 'I perform best when I have something to beat' },
  { id: 'fear_driven', label: 'Deadline Warrior', desc: 'I work best under pressure and consequences' },
];

const ACCOUNTABILITY_STYLES = [
  { id: 'self', label: 'Self-Directed', desc: 'I hold myself accountable' },
  { id: 'partner', label: 'Accountability Partner', desc: 'I need someone to check in with' },
  { id: 'public', label: 'Public Commitment', desc: 'Telling others keeps me on track' },
  { id: 'consequences', label: 'Stakes & Consequences', desc: 'I need skin in the game' },
];

const GENERATION_STEPS = [
  'Analyzing behavioral fingerprint...',
  'Mapping intervention points...',
  'Cross-referencing 47 psychology frameworks...',
  'Calibrating difficulty curves...',
  'Building personalized habit stacks...',
  'Generating AI coaching personality...',
  'Structuring milestone timeline...',
  'Optimizing daily ritual design...',
  'Finalizing your Resurgo protocol...',
  'System ready.',
];

// ─── Component ──────────────────────────────────────────────────────────────
export function DeepScanProtocol() {
  const router = useRouter();
  const scan = useQuery(api.deepScan.getCurrent);
  const startScan = useMutation(api.deepScan.startScan);
  const saveStage1 = useMutation(api.deepScan.saveStage1);
  const saveStage2 = useMutation(api.deepScan.saveStage2);
  const saveStage3 = useMutation(api.deepScan.saveStage3);
  const saveStage4 = useMutation(api.deepScan.saveStage4);
  const saveStage5 = useMutation(api.deepScan.saveStage5);
  const completeScan = useMutation(api.deepScan.completeScan);

  const [scanId, setScanId] = useState<Id<'deepScans'> | null>(null);
  const [stage, setStage] = useState<Stage>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [genStep, setGenStep] = useState(0);

  // Stage 1 state
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [occupation, setOccupation] = useState('');
  const [lifeStage, setLifeStage] = useState('');

  // Stage 2 state
  const [pillarScores, setPillarScores] = useState<PillarScores>({
    health: 5, career: 5, finance: 5, relationships: 5,
    mindset: 5, creativity: 5, fun: 5, environment: 5,
  });
  const [pillarPriorities, setPillarPriorities] = useState<string[]>([]);

  // Stage 3 state
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [failedBefore, setFailedBefore] = useState('');
  const [whatStopped, setWhatStopped] = useState('');
  const [sabotagePatterns, setSabotagePatterns] = useState<string[]>([]);

  // Stage 4 state
  const [chronotype, setChronotype] = useState('');
  const [energyPattern, _setEnergyPattern] = useState('');
  const [motivationStyle, setMotivationStyle] = useState('');
  const [accountabilityStyle, setAccountabilityStyle] = useState('');

  // Stage 5 state
  const [commitmentLevel, setCommitmentLevel] = useState(7);
  const [dailyTimeAvailable, setDailyTimeAvailable] = useState(30);
  const [biggestFear, setBiggestFear] = useState('');
  const [ninetyDayVision, setNinetyDayVision] = useState('');
  const [startingDifficulty, setStartingDifficulty] = useState('moderate');

  // Initialize scan
  useEffect(() => {
    if (scan === undefined) return; // loading
    if (scan && !scan.completedAt) {
      setScanId(scan._id);
      setStage(scan.currentStage as Stage);
      // Restore saved data
      if (scan.nickname) setNickname(scan.nickname);
      if (scan.age) setAge(scan.age);
      if (scan.occupation) setOccupation(scan.occupation);
      if (scan.lifeStage) setLifeStage(scan.lifeStage);
      if (scan.pillarScores) setPillarScores(scan.pillarScores);
      if (scan.pillarPriorities) setPillarPriorities(scan.pillarPriorities);
      if (scan.biggestChallenge) setBiggestChallenge(scan.biggestChallenge);
      if (scan.chronotype) setChronotype(scan.chronotype);
    } else if (!scan) {
      // Start new scan
      startScan().then((id) => setScanId(id));
    } else if (scan.completedAt) {
      // Already completed, go to greeting
      router.push('/first-contact');
    }
  }, [scan, startScan, router]);

  // Generation animation
  useEffect(() => {
    if (stage !== 'generating') return;
    if (genStep >= GENERATION_STEPS.length) {
      setTimeout(() => handleGenerationComplete(), 1000);
      return;
    }
    const delay = genStep === GENERATION_STEPS.length - 1 ? 1200 : 600 + Math.random() * 600;
    const timer = setTimeout(() => setGenStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, genStep]);

  const transitionTo = useCallback((nextStage: Stage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsTransitioning(false);
    }, 400);
  }, []);

  // ── Stage Handlers ──
  const handleStage1 = async () => {
    if (!scanId || !nickname.trim()) return;
    await saveStage1({
      scanId,
      nickname: nickname.trim(),
      age: age === '' ? undefined : age,
      occupation: occupation.trim() || undefined,
      lifeStage: lifeStage || undefined,
    });
    transitionTo(2);
  };

  const handleStage2 = async () => {
    if (!scanId || pillarPriorities.length < 1) return;
    await saveStage2({ scanId, pillarScores, pillarPriorities });
    transitionTo(3);
  };

  const handleStage3 = async () => {
    if (!scanId || !biggestChallenge.trim()) return;
    await saveStage3({
      scanId,
      biggestChallenge: biggestChallenge.trim(),
      failedBefore: failedBefore.trim() || undefined,
      whatStopped: whatStopped.trim() || undefined,
      sabotagePatterns: sabotagePatterns.length > 0 ? sabotagePatterns : undefined,
    });
    transitionTo(4);
  };

  const handleStage4 = async () => {
    if (!scanId) return;
    await saveStage4({
      scanId,
      chronotype: chronotype || undefined,
      energyPattern: energyPattern || undefined,
      motivationStyle: motivationStyle || undefined,
      accountabilityStyle: accountabilityStyle || undefined,
    });
    transitionTo(5);
  };

  const handleStage5 = async () => {
    if (!scanId) return;
    await saveStage5({
      scanId,
      commitmentLevel,
      dailyTimeAvailable,
      biggestFear: biggestFear.trim() || undefined,
      ninetyDayVision: ninetyDayVision.trim() || undefined,
      startingDifficulty: startingDifficulty || undefined,
    });
    transitionTo('generating');
  };

  const handleGenerationComplete = async () => {
    if (!scanId) return;
    try {
      // Call AI to generate diagnosis
      const res = await fetch('/api/deep-scan/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname, age, occupation, lifeStage,
          pillarScores, pillarPriorities,
          biggestChallenge, failedBefore, whatStopped, sabotagePatterns,
          chronotype, motivationStyle, accountabilityStyle,
          commitmentLevel, dailyTimeAvailable, ninetyDayVision,
          startingDifficulty,
        }),
      });

      const diagnosis = res.ok ? await res.json() : null;

      await completeScan({
        scanId,
        aiDiagnosis: diagnosis?.diagnosis ?? 'Your personalized protocol has been generated.',
        aiRecommendations: diagnosis?.recommendations ? JSON.stringify(diagnosis.recommendations) : undefined,
        archetype: diagnosis?.archetype ?? 'The Achiever',
        archetypeConfidence: diagnosis?.confidence ?? 85,
      });
    } catch (err) {
      console.error('AI diagnosis failed:', err);
      await completeScan({
        scanId,
        aiDiagnosis: 'System calibrated. Your personalized protocol is ready.',
        archetype: 'The Achiever',
        archetypeConfidence: 80,
      });
    }

    transitionTo('complete');
    setTimeout(() => router.push('/first-contact'), 2000);
  };

  // ── Pillar priority toggle ──
  const togglePillarPriority = (key: string) => {
    setPillarPriorities((prev) => {
      if (prev.includes(key)) return prev.filter((p) => p !== key);
      if (prev.length >= 3) return prev;
      return [...prev, key];
    });
  };

  // ── Sabotage toggle ──
  const toggleSabotage = (id: string) => {
    setSabotagePatterns((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const progress = typeof stage === 'number' ? (stage / 5) * 100 : stage === 'generating' ? 90 : 100;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-900">
        <div
          className="h-full bg-orange-600 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 border border-zinc-800 bg-black/90 backdrop-blur px-4 py-2">
          <span className={cn(
            'h-2 w-2 rounded-full',
            stage === 'generating' ? 'animate-pulse bg-orange-500' : 'bg-green-500'
          )} />
          <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-400">
            DEEP SCAN PROTOCOL
            {typeof stage === 'number' && ` — STAGE ${stage}/5`}
            {stage === 'generating' && ' — GENERATING SYSTEM'}
            {stage === 'complete' && ' — COMPLETE'}
          </span>
        </div>
      </div>

      <div className={cn(
        'mx-auto max-w-2xl px-4 pt-20 pb-16 transition-all duration-400',
        isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      )}>
        {/* ── STAGE 1: Identity Scan ── */}
        {stage === 1 && (
          <div className="space-y-8">
            <div>
              <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">STAGE 01 — IDENTITY SCAN</p>
              <h2 className="font-pixel text-lg text-zinc-100">Who are you?</h2>
              <p className="mt-2 font-terminal text-base text-zinc-400">
                Before we can build your system, we need to understand the person behind the goals.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  WHAT SHOULD WE CALL YOU?
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your name or nickname..."
                  className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">AGE (OPTIONAL)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="25"
                    className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">OCCUPATION (OPTIONAL)</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Software engineer..."
                    className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                  LIFE STAGE — WHERE ARE YOU NOW?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LIFE_STAGES.map((ls) => (
                    <button
                      key={ls.id}
                      onClick={() => setLifeStage(ls.id)}
                      className={cn(
                        'border-2 px-3 py-2.5 text-left transition-all duration-100',
                        lifeStage === ls.id
                          ? 'border-orange-600 bg-orange-950/30 shadow-[2px_2px_0px_rgba(234,88,12,0.3)]'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                      )}
                    >
                      <p className="font-terminal text-sm text-zinc-200">{ls.label}</p>
                      <p className="font-terminal text-xs text-zinc-500">{ls.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStage1}
              disabled={!nickname.trim()}
              className={cn(
                'w-full border-2 py-3 font-pixel text-[0.5rem] tracking-widest transition-all duration-100',
                nickname.trim()
                  ? 'border-orange-600 bg-orange-600 text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)]'
                  : 'border-zinc-800 text-zinc-600 cursor-not-allowed'
              )}
            >
              CONTINUE TO LIFE ASSESSMENT →
            </button>
          </div>
        )}

        {/* ── STAGE 2: Life Pillar Assessment ── */}
        {stage === 2 && (
          <div className="space-y-8">
            <div>
              <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">STAGE 02 — LIFE PILLAR ASSESSMENT</p>
              <h2 className="font-pixel text-lg text-zinc-100">Rate your life pillars</h2>
              <p className="mt-2 font-terminal text-base text-zinc-400">
                Be brutally honest. Rate each area from 1 (critical) to 10 (thriving). Then select your top 3 priorities.
              </p>
            </div>

            <div className="space-y-4">
              {PILLARS.map((pillar) => (
                <div key={pillar.key} className="border-2 border-zinc-800 bg-black p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{pillar.emoji}</span>
                      <div>
                        <p className="font-terminal text-sm text-zinc-200">{pillar.label}</p>
                        <p className="font-terminal text-xs text-zinc-500">{pillar.description}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'font-pixel text-sm min-w-[2ch] text-right',
                      pillarScores[pillar.key] <= 3 ? 'text-red-400' :
                      pillarScores[pillar.key] <= 6 ? 'text-orange-400' : 'text-green-400'
                    )}>
                      {pillarScores[pillar.key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={pillarScores[pillar.key]}
                    onChange={(e) => setPillarScores((prev) => ({ ...prev, [pillar.key]: parseInt(e.target.value) }))}
                    className="w-full accent-orange-600"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="font-terminal text-xs text-zinc-600">Critical</span>
                    <span className="font-terminal text-xs text-zinc-600">Thriving</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                TOP 3 PRIORITIES — WHAT DO YOU WANT TO FIX FIRST?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PILLARS.map((pillar) => (
                  <button
                    key={pillar.key}
                    onClick={() => togglePillarPriority(pillar.key)}
                    className={cn(
                      'border-2 px-3 py-2 text-left transition-all duration-100 flex items-center gap-2',
                      pillarPriorities.includes(pillar.key)
                        ? 'border-orange-600 bg-orange-950/30'
                        : pillarPriorities.length >= 3
                          ? 'border-zinc-900 text-zinc-600 cursor-not-allowed'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                    )}
                  >
                    <span>{pillar.emoji}</span>
                    <span className="font-terminal text-sm text-zinc-300">{pillar.label}</span>
                    {pillarPriorities.includes(pillar.key) && (
                      <span className="ml-auto font-pixel text-[0.35rem] text-orange-500">
                        #{pillarPriorities.indexOf(pillar.key) + 1}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStage2}
              disabled={pillarPriorities.length < 1}
              className={cn(
                'w-full border-2 py-3 font-pixel text-[0.5rem] tracking-widest transition-all duration-100',
                pillarPriorities.length >= 1
                  ? 'border-orange-600 bg-orange-600 text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px]'
                  : 'border-zinc-800 text-zinc-600 cursor-not-allowed'
              )}
            >
              CONTINUE TO ROOT CAUSE ANALYSIS →
            </button>
          </div>
        )}

        {/* ── STAGE 3: Root Cause Analysis ── */}
        {stage === 3 && (
          <div className="space-y-8">
            <div>
              <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">STAGE 03 — ROOT CAUSE ANALYSIS</p>
              <h2 className="font-pixel text-lg text-zinc-100">What&apos;s been stopping you?</h2>
              <p className="mt-2 font-terminal text-base text-zinc-400">
                Understanding your patterns of failure is the first step to breaking them.
                This is a safe space — honesty here powers the AI.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  WHAT&apos;S YOUR BIGGEST CHALLENGE RIGHT NOW? *
                </label>
                <textarea
                  value={biggestChallenge}
                  onChange={(e) => setBiggestChallenge(e.target.value)}
                  placeholder="Be specific. Not 'I want to be healthier' but 'I can't stick to a workout routine past the first week because...'"
                  rows={3}
                  className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  WHAT HAVE YOU TRIED BEFORE THAT DIDN&apos;T WORK?
                </label>
                <textarea
                  value={failedBefore}
                  onChange={(e) => setFailedBefore(e.target.value)}
                  placeholder="Apps, coaches, programs, methods you've tried..."
                  rows={2}
                  className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  WHAT USUALLY MAKES YOU QUIT?
                </label>
                <textarea
                  value={whatStopped}
                  onChange={(e) => setWhatStopped(e.target.value)}
                  placeholder="What's the moment you usually give up?"
                  rows={2}
                  className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                  SELF-SABOTAGE PATTERNS — SELECT ALL THAT APPLY
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SABOTAGE_PATTERNS.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => toggleSabotage(sp.id)}
                      className={cn(
                        'border-2 px-3 py-2.5 text-left transition-all duration-100',
                        sabotagePatterns.includes(sp.id)
                          ? 'border-red-700 bg-red-950/30'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                      )}
                    >
                      <p className="font-terminal text-sm text-zinc-200">{sp.label}</p>
                      <p className="font-terminal text-xs text-zinc-500">{sp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStage3}
              disabled={!biggestChallenge.trim()}
              className={cn(
                'w-full border-2 py-3 font-pixel text-[0.5rem] tracking-widest transition-all duration-100',
                biggestChallenge.trim()
                  ? 'border-orange-600 bg-orange-600 text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px]'
                  : 'border-zinc-800 text-zinc-600 cursor-not-allowed'
              )}
            >
              CONTINUE TO BEHAVIORAL FINGERPRINT →
            </button>
          </div>
        )}

        {/* ── STAGE 4: Behavioral Fingerprint ── */}
        {stage === 4 && (
          <div className="space-y-8">
            <div>
              <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">STAGE 04 — BEHAVIORAL FINGERPRINT</p>
              <h2 className="font-pixel text-lg text-zinc-100">How do you operate?</h2>
              <p className="mt-2 font-terminal text-base text-zinc-400">
                Your behavioral patterns determine how we calibrate the system.
                There are no wrong answers — just honest ones.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                  CHRONOTYPE — WHEN&apos;S YOUR PEAK?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CHRONOTYPES.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setChronotype(ct.id)}
                      className={cn(
                        'border-2 px-3 py-2.5 text-left transition-all duration-100',
                        chronotype === ct.id
                          ? 'border-orange-600 bg-orange-950/30'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                      )}
                    >
                      <p className="font-terminal text-sm text-zinc-200">{ct.label}</p>
                      <p className="font-terminal text-xs text-zinc-500">{ct.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                  MOTIVATION STYLE — WHAT DRIVES YOU?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOTIVATION_STYLES.map((ms) => (
                    <button
                      key={ms.id}
                      onClick={() => setMotivationStyle(ms.id)}
                      className={cn(
                        'border-2 px-3 py-2.5 text-left transition-all duration-100',
                        motivationStyle === ms.id
                          ? 'border-orange-600 bg-orange-950/30'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                      )}
                    >
                      <p className="font-terminal text-sm text-zinc-200">{ms.label}</p>
                      <p className="font-terminal text-xs text-zinc-500">{ms.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                  ACCOUNTABILITY — WHAT KEEPS YOU ON TRACK?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNTABILITY_STYLES.map((as) => (
                    <button
                      key={as.id}
                      onClick={() => setAccountabilityStyle(as.id)}
                      className={cn(
                        'border-2 px-3 py-2.5 text-left transition-all duration-100',
                        accountabilityStyle === as.id
                          ? 'border-orange-600 bg-orange-950/30'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                      )}
                    >
                      <p className="font-terminal text-sm text-zinc-200">{as.label}</p>
                      <p className="font-terminal text-xs text-zinc-500">{as.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStage4}
              className="w-full border-2 border-orange-600 bg-orange-600 py-3 font-pixel text-[0.5rem] tracking-widest text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] transition-all duration-100 hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px]"
            >
              CONTINUE TO COMMITMENT CALIBRATION →
            </button>
          </div>
        )}

        {/* ── STAGE 5: Commitment Calibration ── */}
        {stage === 5 && (
          <div className="space-y-8">
            <div>
              <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">STAGE 05 — COMMITMENT CALIBRATION</p>
              <h2 className="font-pixel text-lg text-zinc-100">How serious are you?</h2>
              <p className="mt-2 font-terminal text-base text-zinc-400">
                This is the moment of truth. Be honest about your capacity and
                commitment. We&apos;ll calibrate exactly to your level — no shame, no judgment.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  COMMITMENT LEVEL: {commitmentLevel}/10
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={commitmentLevel}
                  onChange={(e) => setCommitmentLevel(parseInt(e.target.value))}
                  className="w-full accent-orange-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-terminal text-xs text-zinc-600">Curious</span>
                  <span className="font-terminal text-xs text-zinc-600">All In</span>
                </div>
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  DAILY TIME AVAILABLE: {dailyTimeAvailable} MIN/DAY
                </label>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={dailyTimeAvailable}
                  onChange={(e) => setDailyTimeAvailable(parseInt(e.target.value))}
                  className="w-full accent-orange-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-terminal text-xs text-zinc-600">5 min</span>
                  <span className="font-terminal text-xs text-zinc-600">2 hours</span>
                </div>
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-3 block">
                  STARTING DIFFICULTY
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gentle', label: '🌱 Gentle', desc: 'Easy wins, build confidence' },
                    { id: 'moderate', label: '⚡ Moderate', desc: 'Balanced challenge' },
                    { id: 'intense', label: '🔥 Intense', desc: 'Push me hard from day 1' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setStartingDifficulty(d.id)}
                      className={cn(
                        'border-2 px-3 py-3 text-center transition-all duration-100',
                        startingDifficulty === d.id
                          ? 'border-orange-600 bg-orange-950/30'
                          : 'border-zinc-800 bg-black hover:border-zinc-600'
                      )}
                    >
                      <p className="font-terminal text-sm text-zinc-200">{d.label}</p>
                      <p className="font-terminal text-xs text-zinc-500 mt-1">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  YOUR 90-DAY VISION — WHAT DOES YOUR LIFE LOOK LIKE?
                </label>
                <textarea
                  value={ninetyDayVision}
                  onChange={(e) => setNinetyDayVision(e.target.value)}
                  placeholder="Describe your ideal life 90 days from now. Be specific..."
                  rows={3}
                  className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 mb-2 block">
                  BIGGEST FEAR ABOUT THIS JOURNEY
                </label>
                <textarea
                  value={biggestFear}
                  onChange={(e) => setBiggestFear(e.target.value)}
                  placeholder="What are you most afraid of? (We'll address this directly...)"
                  rows={2}
                  className="w-full border-2 border-zinc-800 bg-black px-4 py-3 font-terminal text-base text-zinc-100 outline-none focus:border-orange-600 transition placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleStage5}
              className="w-full border-2 border-orange-600 bg-orange-600 py-3 font-pixel text-[0.5rem] tracking-widest text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] transition-all duration-100 hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px]"
            >
              GENERATE MY PROTOCOL →
            </button>
          </div>
        )}

        {/* ── GENERATING SCREEN ── */}
        {stage === 'generating' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center">
              <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">BUILDING YOUR SYSTEM</p>
              <h2 className="font-pixel text-lg text-zinc-100">Generating Protocol...</h2>
            </div>

            {/* Terminal output */}
            <div className="w-full border-2 border-zinc-800 bg-black p-4">
              <div className="space-y-1">
                {GENERATION_STEPS.slice(0, genStep).map((step, i) => (
                  <p key={i} className={cn(
                    'font-terminal text-sm transition-opacity duration-300',
                    i === GENERATION_STEPS.length - 1 ? 'text-green-400 font-bold' : 'text-zinc-500'
                  )}>
                    [{String(i + 1).padStart(2, '0')}/{String(GENERATION_STEPS.length).padStart(2, '0')}] {step}
                  </p>
                ))}
                {genStep < GENERATION_STEPS.length && (
                  <p className="font-terminal text-sm text-orange-400 animate-pulse">
                    [{String(genStep + 1).padStart(2, '0')}/{String(GENERATION_STEPS.length).padStart(2, '0')}] {GENERATION_STEPS[genStep]}
                  </p>
                )}
              </div>
            </div>

            {/* Loading bar */}
            <div className="w-full h-2 bg-zinc-900 border border-zinc-800">
              <div
                className="h-full bg-orange-600 transition-all duration-500"
                style={{ width: `${(genStep / GENERATION_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {stage === 'complete' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div className="w-20 h-20 border-2 border-green-600 bg-green-950/30 flex items-center justify-center">
              <span className="font-pixel text-2xl text-green-400">✓</span>
            </div>
            <h2 className="font-pixel text-lg text-zinc-100">System Generated</h2>
            <p className="font-terminal text-base text-zinc-400">
              Redirecting to your personalized briefing...
            </p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-orange-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-orange-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
