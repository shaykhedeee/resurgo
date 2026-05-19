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
            <h2 className="text-2xl font-bold text-white">Brain Dump</h2>
            <p className="text-sm text-zinc-400">
              What's on your mind? Messy is fine. I'll sort it.
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              disabled={isProcessing}
              placeholder="Ideas, blockers, goals, anything... just dump it all here and I'll help you organize it"
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