'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Archetype, QuickStartFlowState } from './QuickStartFlow';
import { CheckCircle2, Gift, Zap, Sparkles, Loader2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickStartStep3Props {
  archetype: Archetype;
  brainDump: string;
  parsedData: QuickStartFlowState['parsedData'] | null;
  onComplete: () => void;
}

export function QuickStartStep3({
  archetype,
  brainDump,
  parsedData,
  onComplete,
}: QuickStartStep3Props) {
  const router = useRouter();
  const { user } = useStoreUser();
  const [isCreatingTasks, setIsCreatingTasks] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Convex mutations
  const updateUserOnboarding = useMutation(api.users.updateOnboarding);

  useEffect(() => {
    const createFirstTasks = async () => {
      if (!user) return;

      try {
        // Mark onboarding as complete and set archetype
        await updateUserOnboarding({
          onboardingComplete: true,
          archetypeDetected: archetype,
          layerLevel: 1,
          onboardingPath: 'quick-start',
        });

        setIsCreatingTasks(false);
        
        // Trigger celebration
        setTimeout(() => {
          setShowCelebration(true);
          // Trigger confetti
          triggerConfetti();
        }, 300);

        // Redirect to dashboard after 3.5 seconds
        setTimeout(() => {
          router.replace('/dashboard');
        }, 3500);
      } catch (error) {
        console.error('Error creating first tasks:', error);
        // Still proceed to dashboard even if error
        router.replace('/dashboard');
      }
    };

    createFirstTasks();
  }, [user, archetype, updateUserOnboarding, router]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F97316', '#EA580C', '#C2410C', '#FFFFFF', '#7C3AED'],
      gravity: 1,
      scalar: 0.8,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {isCreatingTasks && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-center"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Sparkles className="w-12 h-12 text-orange-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Creating your first day...</h2>
              <p className="text-zinc-400">This won't take long</p>
            </div>
          </motion.div>
        )}

        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
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
                <Trophy className="w-16 h-16 text-yellow-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Let's Go! 🚀</h2>
              <p className="text-lg text-zinc-300">Your first day is ready</p>
            </motion.div>

            {/* Today's Stats */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Tasks */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-opacity-10 border border-blue-700 border-opacity-30">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Today's Tasks</p>
                    <p className="text-lg font-semibold text-white">3 planned</p>
                  </div>
                </div>
              </div>

              {/* Habit */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-10 border border-purple-700 border-opacity-30">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Daily Habit</p>
                    <p className="text-lg font-semibold text-white">1 habit started</p>
                  </div>
                </div>
              </div>

              {/* XP */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-opacity-10 border border-orange-700 border-opacity-30">
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-sm text-zinc-400">First Day Bonus</p>
                    <p className="text-lg font-semibold text-white">+50 XP • Streak Day 1</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Coach Message */}
            <motion.div
              className="p-4 rounded-lg bg-zinc-900 border border-orange-500 border-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-zinc-400 mb-2">Your Coach Says:</p>
              <p className="text-white italic">
                "You're off to a great start. Remember: progress beats perfection. Let's go get Day 1 done."
              </p>
            </motion.div>

            {/* PWA Install Nudge */}
            <motion.div
              className="p-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-opacity-10 border border-emerald-700 border-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-emerald-400 font-semibold">💡 Pro Tip:</p>
              <p className="text-sm text-zinc-300 mt-1">
                Install Resurgo on your home screen for faster access. Look for the "Add to Home Screen" option.
              </p>
            </motion.div>

            {/* Redirect Info */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Taking you to your dashboard...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
