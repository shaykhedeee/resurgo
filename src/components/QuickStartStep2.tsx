'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archetype, QuickStartFlowState } from './QuickStartFlow';
import { ArrowRight, Loader2 } from 'lucide-react';

interface QuickStartStep2Props {
  archetype?: Archetype;
  onComplete: (brainDump: string, parsedData: {
    goals: string[];
    blockers: string[];
    energy: number;
    timeAvailable: string;
    suggestedGoals: string[];
    suggestedHabits: Array<{ title: string; frequency: string; domain: string }>;
    suggestedTasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
    archetype: string;
  } | null) => void;
}

async function parseWithArchetypeDetector(brainDump: string, archetype?: Archetype) {
  try {
    const response = await fetch('/api/ai/brain-dump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: brainDump,
        source: archetype ? `onboarding_${archetype}` : 'onboarding',
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.analysis) {
      return null;
    }

    const analysis = data.analysis;

    const rawConfidence = typeof analysis.confidence === 'number' ? analysis.confidence : 0;
    const energy = Math.min(10, Math.max(0, Math.round(rawConfidence > 1 ? rawConfidence / 10 : rawConfidence * 10)));

    let timeAvailable = '2-3 hours per day';
    if (analysis.priorityFocus && analysis.priorityFocus.length > 0) {
      if (analysis.priorityFocus.length >= 2) {
        timeAvailable = analysis.priorityFocus.slice(0, 2).join(', ');
      } else {
        timeAvailable = analysis.priorityFocus[0];
      }
    }

    return {
      goals: analysis.goals || [],
      blockers: analysis.struggles || [],
      energy: energy,
      timeAvailable: timeAvailable,
      suggestedGoals: analysis.suggestedGoals || [],
      suggestedHabits: analysis.suggestedHabits || [],
      suggestedTasks: analysis.suggestedTasks || [],
      archetype: analysis.archetype || 'The Achiever',
    };
  } catch (error) {
    console.error('Error calling brain-dump API:', error);
    return null;
  }
}

export function QuickStartStep2({ archetype, onComplete }: QuickStartStep2Props) {
  const [brainDump, setBrainDump] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!brainDump.trim()) return;

    setIsProcessing(true);
    try {
      const parsedData = await parseWithArchetypeDetector(brainDump, archetype);
      if (parsedData) {
        onComplete(brainDump, parsedData);
      } else {
        onComplete(brainDump, null);
      }
    } catch (error) {
      console.error('Error parsing brain dump:', error);
      onComplete(brainDump, null);
    } finally {
      setIsProcessing(false);
    }
  };

  const isReady = brainDump.trim().length > 0 && !isProcessing;

  let headerTitle = "What are you trying to ship or change in the next 30 days?";
  let headerDesc = "Tell me about your product, project, or personal sprint. Messy is fine—just dump what needs to get done.";
  let textareaPlaceholder = "e.g., I'm shipping my landing page and setting up my product analytics while tracking daily fitness and sleep...";

  if (archetype === 'adhd') {
    headerTitle = "What are you trying to ship or change in the next 30 days?";
    headerDesc = "Got ADHD? Let's bypass the layout freeze. Dump your thoughts, shipping targets, frustrations, or half-finished ideas below—no order or organization needed.";
    textareaPlaceholder = "e.g., I want to ship my coding project and hit 3 hours of focused build time, but executive dysfunction/inertia keeps kicking in and I lose track after a couple of days...";
  } else if (archetype === 'ambitious') {
    headerTitle = "What are you trying to ship or change in the next 30 days?";
    headerDesc = "Let's align your execution sprint. Tell me about your MVP targets, database setups, Stripe integrations, or user acquisition goals to build a high-velocity 30-day roadmap.";
    textareaPlaceholder = "e.g., I need to launch my SaaS MVP, integrate Stripe checkout, configure the database schemas, and acquire my first 10 beta users...";
  } else if (archetype === 'student') {
    headerTitle = "What are you trying to ship or change in the next 30 days?";
    headerDesc = "Balancing classes, exams, habits, and life? Dump your study goals, assignment deadlines, and personal habits below to build a balanced daily schedule.";
    textareaPlaceholder = "e.g., Preparing for midterms next week, need to study 3 hours a day, want to go to the gym 3x/week, and stop procrastinating on my history essay...";
  } else if (archetype === 'athlete') {
    headerTitle = "What are you trying to ship or change in the next 30 days?";
    headerDesc = "Aiming for peak physical and mental consistency? Dump your training objectives, recovery goals, habits, and struggles below to construct your protocol.";
    textareaPlaceholder = "e.g., Training for a half marathon, need to run 4x/week, track protein intake, hit 8 hours of sleep, but struggling to balance early morning runs with work...";
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{headerTitle}</h2>
            <p className="text-sm text-zinc-400">
              {headerDesc}
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              disabled={isProcessing}
              placeholder={textareaPlaceholder}
              className="w-full h-48 p-4 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none disabled:opacity-50 transition-all"
            />
            <div className="mt-2 text-xs text-zinc-500">
              {brainDump.length} characters
            </div>
          </div>

          {/* Progress indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-orange-400"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing your brain dump...</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!isReady}
            whileHover={isReady ? { scale: 1.02 } : {}}
            whileTap={isReady ? { scale: 0.98 } : {}}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isReady
                ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Let's Plan
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Helper Text */}
          <p className="text-xs text-zinc-600 text-center">
            The more detail you give, the better I can help
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}