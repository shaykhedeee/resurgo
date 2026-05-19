'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Archetype } from './QuickStartFlow';
import { ChevronRight, Brain, Target, BookOpen, Zap, HelpCircle } from 'lucide-react';

interface QuickStartStep1Props {
  onComplete: (archetype: Archetype) => void;
}

const archetypeOptions: Array<{
  id: Archetype;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    id: 'adhd',
    label: 'I\'m Overwhelmed',
    description: 'Too many ideas, can\'t start, decisions paralyze me',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-pink-600 to-rose-600',
  },
  {
    id: 'ambitious',
    label: 'I Want to Hit a Goal',
    description: 'Clear target, need structure to get there',
    icon: <Target className="w-5 h-5" />,
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'student',
    label: 'Preparing for an Exam',
    description: 'Need to study smart, stay focused',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'athlete',
    label: 'I Want Fitness',
    description: 'Building strength, tracking progress, staying consistent',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'other',
    label: 'Something Else',
    description: 'I\'ll figure it out as I go',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'from-slate-600 to-gray-600',
  },
];

export function QuickStartStep1({ onComplete }: QuickStartStep1Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">Hey there 👋</h1>
            <p className="text-lg text-zinc-400">
              What brought you here today?
            </p>
            <p className="text-sm text-zinc-500">
              This helps me understand your situation (30 seconds)
            </p>
          </div>

          {/* Archetype Options */}
          <div className="grid grid-cols-1 gap-3">
            {archetypeOptions.map((option, idx) => (
              <motion.button
                key={option.id}
                onClick={() => onComplete(option.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group w-full p-4 rounded-lg border border-zinc-700 bg-gradient-to-r ${option.color} bg-opacity-5 hover:bg-opacity-10 transition-all duration-200 text-left`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color} bg-opacity-20 mt-1`}>
                      <div className={`bg-gradient-to-r ${option.color} bg-clip-text text-transparent`}>
                        {option.icon}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {option.label}
                      </p>
                      <p className="text-sm text-zinc-400 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 transition-colors mt-1" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Helper Text */}
          <p className="text-xs text-zinc-600 text-center">
            Don't worry, you can change this anytime
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
