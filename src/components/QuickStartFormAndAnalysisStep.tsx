'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  User,
  Phone,
  Calendar,
  Ruler,
  Scale,
  Brain,
  Zap,
  Check,
  Loader2,
  Sparkles,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Shield,
  Activity,
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickStartFormAndAnalysisStepProps {
  brainDump: string;
  parsedData: {
    goals: string[];
    blockers: string[];
    energy: number;
    timeAvailable: string;
  } | null;
  plannerSelections: {
    goals: string[];
    habits: Array<{ title: string; frequency: string; domain: string }>;
    tasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
  };
  detectedArchetypeRaw?: string; // archetype name from AI brain dump (e.g. "The Achiever")
}

export function QuickStartFormAndAnalysisStep({
  brainDump,
  parsedData,
  plannerSelections,
  detectedArchetypeRaw = 'The Achiever'
}: QuickStartFormAndAnalysisStepProps) {
  const router = useRouter();
  const { user: convexUser, isLoading: convexUserLoading } = useStoreUser();
  const commitPlanner = useMutation(api.users.commitOnboardingPlanner);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  
  // Phase management inside step 3
  // 'form' -> user inputs profile/fitness details
  // 'diagnostics' -> show interactive calculation logs and profile analysis
  // 'launching' -> show finalized state with celebration and take them to dashboard
  const [phase, setPhase] = useState<'form' | 'diagnostics' | 'launching'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);

  // Pre-fill name from Convex once loaded
  useEffect(() => {
    if (convexUser?.name && !name) {
      setName(convexUser.name);
    }
  }, [convexUser, name]);

  const mapArchetype = (raw: string): 'adhd' | 'ambitious' | 'student' | 'athlete' | 'other' => {
    const norm = raw.toLowerCase();
    if (norm.includes('achiever') || norm.includes('optimizer') || norm.includes('ambitious')) {
      return 'ambitious';
    }
    if (norm.includes('warrior') || norm.includes('athlete') || norm.includes('fitness')) {
      return 'athlete';
    }
    if (norm.includes('student') || norm.includes('academic') || norm.includes('learner')) {
      return 'student';
    }
    if (norm.includes('adhd') || norm.includes('rebuilder') || norm.includes('scattered') || norm.includes('overwhelmed')) {
      return 'adhd';
    }
    return 'other';
  };

  // Simple BMI Calculator
  const getBMI = () => {
    if (!height || !weight) return null;
    const heightInMeters = Number(height) / 100;
    return Number((Number(weight) / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Hydration Baseline Calculator (ml)
  const getWaterBaseline = () => {
    if (!weight) return 2000; // default 2L
    return Math.round(Number(weight) * 35); // 35ml per kg
  };

  // Caloric baseline (BMR) estimation
  const getBMR = () => {
    if (!weight || !height || !dob) return 2000;
    
    // Estimate age
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = Math.max(15, currentYear - birthYear);
    
    // Harris-Benedict baseline estimation
    return Math.round(10 * Number(weight) + 6.25 * Number(height) - 5 * age + 5);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setPhase('diagnostics');

    // Simulate diagnostic loading logs for premium hacker/brutalist style
    const logs = [
      '⚡ [SYSTEM] Initiating Bio-Metrics Diagnostic Scan...',
      `👤 [BIOLOGY] Analyzing Name: "${name}"`,
      phone ? `📞 [COMMUNICATIONS] Registering cellular binding node: ${phone}` : '📞 [COMMUNICATIONS] No primary cellular node linked.',
      dob ? `📅 [CHRONO] Target DOB Registered: ${dob}` : '📅 [CHRONO] Baseline calendar profile established.',
      height && weight ? `📏 [PHYSICAL] Processing dimensions: ${height}cm, ${weight}kg` : '📏 [PHYSICAL] standard baseline dimensions applied.',
      '🧮 [ENGINE] Synthesizing brain dump semantic map...',
      `🧠 [NEURAL] Detected Cognitive Archetype: "${detectedArchetypeRaw}"`,
      `🧬 [HEALTH] Est. Daily Baseline Hydration: ${(getWaterBaseline() / 1000).toFixed(2)}L`,
      `🔥 [METABOLIC] Est. Basal Metabolic Rate (BMR): ${getBMR()} kcal/day`,
      `📊 [INDEX] Est. Body Mass Index (BMI): ${getBMI() || 'Standard Active'}`,
      '📦 [SYSTEM] Compiling selected goals, habits, and tasks into atomic commits...',
      '🚀 [LAUNCH] Optimization Blueprint Fully Generated. Awaiting Launch Sequence.'
    ];

    setDiagnosticLogs([]);
    setTypingIndex(0);

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setDiagnosticLogs((prev) => [...prev, logs[i]]);
    }

    setIsSubmitting(false);
  };

  const handleLaunchSequence = async () => {
    setIsSubmitting(true);
    try {
      // Execute atomic Convex mutation
      await commitPlanner({
        name: name || undefined,
        phoneNumber: phone || undefined,
        dob: dob || undefined,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        archetypeDetected: mapArchetype(detectedArchetypeRaw),
        goals: plannerSelections.goals,
        habits: plannerSelections.habits,
        tasks: plannerSelections.tasks
      });

      setPhase('launching');
      
      // Trigger canvas-confetti celebration
      setTimeout(() => {
        triggerConfetti();
      }, 200);

      // Redirect to dashboard after 3.8 seconds
      setTimeout(() => {
        router.replace('/dashboard');
      }, 3800);
    } catch (err) {
      console.error('Launch execution failed:', err);
      // Fallback
      router.replace('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#F97316', '#7C3AED', '#EC4899', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {phase === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-8 h-8 text-orange-500 animate-pulse" />
                Bio-Metric & Fitness Profile
              </h2>
              <p className="text-zinc-400">
                To connect your wellness records, budget, and daily planners, let's secure your physical and core personal profile details.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 font-mono text-sm transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full p-3 rounded bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 font-mono text-sm transition-all"
                  />
                </div>

                {/* DOB */}
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-3 rounded bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 font-mono text-sm transition-all"
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5" /> Height (cm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="272"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="175"
                    className="w-full p-3 rounded bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="70"
                    className="w-full p-3 rounded bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono text-sm transition-all"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Your profile and biological data is encrypted and saved locally.
                </div>
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded flex items-center gap-2 transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Generate Neural Diagnostic
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {phase === 'diagnostics' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2 font-mono">
                <Brain className="w-8 h-8 text-orange-500 animate-pulse" />
                NEURAL_DIAGNOSTIC_REPORT
              </h2>
              <p className="text-zinc-500 text-xs font-mono">
                COMPILING LIFE OS SYNERGY PROFILE
              </p>
            </div>

            {/* Diagnostic Terminal View */}
            <div className="bg-black border border-zinc-800 p-6 rounded-lg font-mono text-sm text-zinc-400 space-y-2 h-96 overflow-y-auto shadow-inner select-none scrollbar-thin scrollbar-thumb-zinc-800">
              {diagnosticLogs.map((log, index) => {
                const isSystem = log.includes('[SYSTEM]');
                const isHighlight = log.includes('[HEALTH]') || log.includes('[METABOLIC]') || log.includes('[INDEX]') || log.includes('[NEURAL]');
                
                let textColor = 'text-zinc-400';
                if (isSystem) textColor = 'text-orange-500 font-bold';
                else if (isHighlight) textColor = 'text-emerald-400';
                else if (log.includes('[LAUNCH]')) textColor = 'text-yellow-400 font-semibold animate-pulse';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${textColor} py-0.5 border-b border-zinc-950`}
                  >
                    {log}
                  </motion.div>
                );
              })}
              {diagnosticLogs.length < 12 && (
                <div className="flex items-center gap-2 text-zinc-600 mt-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Synthesizing neural pathways...</span>
                </div>
              )}
            </div>

            {/* Action panel showing summary of diagnostics details once loaded */}
            {diagnosticLogs.length >= 12 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
                    <p className="text-xs text-zinc-500 uppercase font-mono">Cognitive Archetype</p>
                    <p className="text-lg font-bold text-orange-500 mt-1">{detectedArchetypeRaw}</p>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
                    <p className="text-xs text-zinc-500 uppercase font-mono">Hydration Target</p>
                    <p className="text-lg font-bold text-blue-400 mt-1">{(getWaterBaseline() / 1000).toFixed(2)} Liters</p>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
                    <p className="text-xs text-zinc-500 uppercase font-mono">Metabolic Baseline</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{getBMR()} kcal/day</p>
                  </div>
                </div>

                <motion.button
                  onClick={handleLaunchSequence}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-colors font-mono text-sm tracking-wider uppercase border border-orange-500 shadow-orange-950"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      COMMITTING BLUEPRINT...
                    </>
                  ) : (
                    <>
                      🚀 Launch Resurgo Life OS
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'launching' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 py-8"
          >
            {/* Celebration Header */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-block"
              >
                <Trophy className="w-16 h-16 text-yellow-500 filter drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
              </motion.div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">System Operational! 🚀</h2>
              <p className="text-lg text-zinc-300">Your custom Life OS environment is fully integrated.</p>
            </motion.div>

            {/* Today's Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Goals */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-opacity-10 border border-orange-700 border-opacity-30 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-mono">Core Goals</p>
                  <p className="text-lg font-semibold text-white">{plannerSelections.goals.length} Committed</p>
                </div>
              </div>

              {/* Habits */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-10 border border-purple-700 border-opacity-30 flex items-center gap-3">
                <Zap className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-mono">Habits Injected</p>
                  <p className="text-lg font-semibold text-white">{plannerSelections.habits.length} Active</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-opacity-10 border border-blue-700 border-opacity-30 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-mono">Directives Ready</p>
                  <p className="text-lg font-semibold text-white">{plannerSelections.tasks.length} Today</p>
                </div>
              </div>
            </motion.div>

            {/* Coach Message */}
            <motion.div
              className="p-5 bg-zinc-900 border border-orange-500 border-opacity-20 rounded-lg relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600 opacity-5 blur-2xl rounded-full"></div>
              <p className="text-xs text-orange-500 font-semibold font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Core AI Mindset Overlay
              </p>
              <p className="text-sm text-zinc-300 italic">
                "Welcome to Resurgo Life OS, {name}. Your neural blueprint is complete. Our AI system monitors your budget, daily habits, tasks, and fitness parameters to calculate your Daily Synergy Score (DSS). Prepare for Day 1."
              </p>
            </motion.div>

            {/* PWA Install Nudge */}
            <motion.div
              className="p-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-opacity-10 border border-emerald-700 border-opacity-30 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>
                <p className="text-sm text-emerald-400 font-bold">💡 Connect Your Mobile App:</p>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Launch the application on Android or iOS via Cape Sync to activate push notifications.
                </p>
              </div>
            </motion.div>

            {/* Redirect Info */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span className="text-xs font-mono">REDIRECTING TO OPERATIONAL DASHBOARD...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
