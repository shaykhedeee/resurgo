// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Template Library
// Pre-built habit and goal templates for quick start
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  X,
  Search,
  Sparkles,
  Target,
  Heart,
  Dumbbell,
  BookOpen,
  Briefcase,
  Zap,
  DollarSign,
  Palette,
  Check,
  ChevronRight,
  Star,
} from 'lucide-react';
import { HabitCategory, HabitFrequency } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

// Display category for templates (user-friendly names)
type TemplateCategory = 'Health' | 'Productivity' | 'Learning' | 'Mindfulness' | 'Social' | 'Finance' | 'Creative' | 'Sleep';

// Map display categories to HabitCategory type
const categoryMap: Record<TemplateCategory, HabitCategory> = {
  'Health': 'health',
  'Productivity': 'productivity',
  'Learning': 'learning',
  'Mindfulness': 'mindfulness',
  'Social': 'social',
  'Finance': 'finance',
  'Creative': 'creativity',
  'Sleep': 'health', // Sleep maps to health category
};

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  frequency: HabitFrequency;
  icon: string;
  color: string;
  xpReward: number;
  targetDays?: number[];
  popular?: boolean;
}

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  timeframe: string;
  suggestedHabits: string[];
  popular?: boolean;
}

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'habit' | 'goal' | 'all';
}

// ─────────────────────────────────────────────────────────────────────────────────
// TEMPLATE DATA
// ─────────────────────────────────────────────────────────────────────────────────

const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health & Fitness
  {
    id: 'h1',
    name: 'Morning Exercise',
    description: 'Start your day with 30 minutes of exercise',
    category: 'Health',
    frequency: 'daily',
    icon: 'FT',
    color: '#10B981',
    xpReward: 25,
    popular: true,
  },
  {
    id: 'h2',
    name: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    category: 'Health',
    frequency: 'daily',
    icon: 'HY',
    color: '#3B82F6',
    xpReward: 15,
    popular: true,
  },
  {
    id: 'h3',
    name: '10,000 Steps',
    description: 'Walk at least 10,000 steps daily',
    category: 'Health',
    frequency: 'daily',
    icon: 'WK',
    color: '#10B981',
    xpReward: 20,
  },
  {
    id: 'h4',
    name: 'No Junk Food',
    description: 'Avoid processed and junk food',
    category: 'Health',
    frequency: 'daily',
    icon: 'NT',
    color: '#22C55E',
    xpReward: 20,
  },
  {
    id: 'h5',
    name: 'Stretch for 10 Minutes',
    description: 'Daily stretching routine',
    category: 'Health',
    frequency: 'daily',
    icon: 'MD',
    color: '#8B5CF6',
    xpReward: 15,
  },
  // Productivity
  {
    id: 'h6',
    name: 'Deep Work Session',
    description: '2 hours of focused, uninterrupted work',
    category: 'Productivity',
    frequency: 'daily',
    icon: 'TG',
    color: '#F59E0B',
    xpReward: 30,
    popular: true,
  },
  {
    id: 'h7',
    name: 'Plan Tomorrow',
    description: 'Spend 10 minutes planning the next day',
    category: 'Productivity',
    frequency: 'daily',
    icon: 'PL',
    color: '#6366F1',
    xpReward: 15,
  },
  {
    id: 'h8',
    name: 'Inbox Zero',
    description: 'Process all emails to zero',
    category: 'Productivity',
    frequency: 'daily',
    icon: 'EM',
    color: '#EC4899',
    xpReward: 20,
  },
  {
    id: 'h9',
    name: 'No Social Media Before Noon',
    description: 'Protect your morning focus',
    category: 'Productivity',
    frequency: 'daily',
    icon: 'FD',
    color: '#EF4444',
    xpReward: 25,
  },
  // Learning
  {
    id: 'h10',
    name: 'Read for 30 Minutes',
    description: 'Daily reading habit',
    category: 'Learning',
    frequency: 'daily',
    icon: 'RD',
    color: '#8B5CF6',
    xpReward: 20,
    popular: true,
  },
  {
    id: 'h11',
    name: 'Learn a New Word',
    description: 'Expand your vocabulary daily',
    category: 'Learning',
    frequency: 'daily',
    icon: 'WD',
    color: '#06B6D4',
    xpReward: 10,
  },
  {
    id: 'h12',
    name: 'Practice a Language',
    description: '15 minutes of language learning',
    category: 'Learning',
    frequency: 'daily',
    icon: 'LG',
    color: '#14B8A6',
    xpReward: 20,
  },
  {
    id: 'h13',
    name: 'Watch Educational Content',
    description: 'Learn something new from videos',
    category: 'Learning',
    frequency: 'daily',
    icon: 'VD',
    color: '#F43F5E',
    xpReward: 15,
  },
  // Mindfulness
  {
    id: 'h14',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    category: 'Mindfulness',
    frequency: 'daily',
    icon: 'MD',
    color: '#8B5CF6',
    xpReward: 20,
    popular: true,
  },
  {
    id: 'h15',
    name: 'Gratitude Journal',
    description: 'Write 3 things you\'re grateful for',
    category: 'Mindfulness',
    frequency: 'daily',
    icon: 'GR',
    color: '#F59E0B',
    xpReward: 15,
  },
  {
    id: 'h16',
    name: 'Digital Detox Hour',
    description: 'One hour without any screens',
    category: 'Mindfulness',
    frequency: 'daily',
    icon: 'DT',
    color: '#22C55E',
    xpReward: 20,
  },
  {
    id: 'h17',
    name: 'Evening Reflection',
    description: 'Reflect on your day for 5 minutes',
    category: 'Mindfulness',
    frequency: 'daily',
    icon: 'RF',
    color: '#6366F1',
    xpReward: 15,
  },
  // Sleep
  {
    id: 'h18',
    name: 'Sleep by 10 PM',
    description: 'Get to bed early for better rest',
    category: 'Sleep',
    frequency: 'daily',
    icon: 'SL',
    color: '#6366F1',
    xpReward: 25,
  },
  {
    id: 'h19',
    name: 'No Screens Before Bed',
    description: 'Avoid screens 1 hour before sleep',
    category: 'Sleep',
    frequency: 'daily',
    icon: 'NS',
    color: '#8B5CF6',
    xpReward: 20,
  },
  // Social
  {
    id: 'h20',
    name: 'Connect with a Friend',
    description: 'Reach out to someone you care about',
    category: 'Social',
    frequency: 'daily',
    icon: 'FR',
    color: '#EC4899',
    xpReward: 15,
  },
  {
    id: 'h21',
    name: 'Family Time',
    description: 'Quality time with family',
    category: 'Social',
    frequency: 'daily',
    icon: 'FA',
    color: '#F43F5E',
    xpReward: 20,
  },
  // Finance
  {
    id: 'h22',
    name: 'Track Expenses',
    description: 'Log all your spending',
    category: 'Finance',
    frequency: 'daily',
    icon: 'EX',
    color: '#22C55E',
    xpReward: 15,
  },
  {
    id: 'h23',
    name: 'No Impulse Buying',
    description: 'Wait 24 hours before purchases',
    category: 'Finance',
    frequency: 'daily',
    icon: 'NB',
    color: '#F59E0B',
    xpReward: 20,
  },
  // Creative
  {
    id: 'h24',
    name: 'Creative Practice',
    description: '30 minutes of creative work',
    category: 'Creative',
    frequency: 'daily',
    icon: 'AR',
    color: '#EC4899',
    xpReward: 25,
  },
  {
    id: 'h25',
    name: 'Write 500 Words',
    description: 'Daily writing practice',
    category: 'Creative',
    frequency: 'daily',
    icon: 'WR',
    color: '#6366F1',
    xpReward: 25,
  },
];

const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'g1',
    title: 'Run a Marathon',
    description: 'Train and complete a full 42km marathon',
    category: 'fitness',
    icon: 'RN',
    timeframe: '6 months',
    suggestedHabits: ['Morning Exercise', '10,000 Steps', 'Drink 8 Glasses of Water'],
    popular: true,
  },
  {
    id: 'g2',
    title: 'Read 50 Books This Year',
    description: 'Develop a consistent reading habit',
    category: 'learning',
    icon: 'BK',
    timeframe: '12 months',
    suggestedHabits: ['Read for 30 Minutes', 'Digital Detox Hour'],
    popular: true,
  },
  {
    id: 'g3',
    title: 'Learn a New Language',
    description: 'Achieve conversational fluency',
    category: 'learning',
    icon: 'LN',
    timeframe: '12 months',
    suggestedHabits: ['Practice a Language', 'Learn a New Word'],
    popular: true,
  },
  {
    id: 'g4',
    title: 'Lose 20 Pounds',
    description: 'Reach a healthy weight through sustainable habits',
    category: 'health',
    icon: 'WL',
    timeframe: '4 months',
    suggestedHabits: ['Morning Exercise', 'No Junk Food', 'Drink 8 Glasses of Water'],
  },
  {
    id: 'g5',
    title: 'Build a Side Business',
    description: 'Launch and grow a profitable side project',
    category: 'career',
    icon: 'BZ',
    timeframe: '6 months',
    suggestedHabits: ['Deep Work Session', 'Plan Tomorrow'],
    popular: true,
  },
  {
    id: 'g6',
    title: 'Save $10,000 Emergency Fund',
    description: 'Build financial security',
    category: 'finance',
    icon: 'SV',
    timeframe: '12 months',
    suggestedHabits: ['Track Expenses', 'No Impulse Buying'],
  },
  {
    id: 'g7',
    title: 'Meditate for 365 Days',
    description: 'Build an unbreakable meditation practice',
    category: 'mindfulness',
    icon: 'MM',
    timeframe: '12 months',
    suggestedHabits: ['Morning Meditation', 'Evening Reflection'],
  },
  {
    id: 'g8',
    title: 'Write a Book',
    description: 'Complete your first novel or non-fiction book',
    category: 'creative',
    icon: 'WB',
    timeframe: '12 months',
    suggestedHabits: ['Write 500 Words', 'Deep Work Session'],
  },
  {
    id: 'g9',
    title: 'Get Promoted',
    description: 'Advance to the next level in your career',
    category: 'career',
    icon: 'PR',
    timeframe: '12 months',
    suggestedHabits: ['Deep Work Session', 'Read for 30 Minutes', 'Plan Tomorrow'],
  },
  {
    id: 'g10',
    title: 'Improve Sleep Quality',
    description: 'Establish healthy sleep patterns',
    category: 'health',
    icon: 'SQ',
    timeframe: '2 months',
    suggestedHabits: ['Sleep by 10 PM', 'No Screens Before Bed', 'Evening Reflection'],
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Sparkles },
  { id: 'popular', name: 'Popular', icon: Star },
  { id: 'health', name: 'Health & Fitness', icon: Dumbbell },
  { id: 'productivity', name: 'Productivity', icon: Zap },
  { id: 'learning', name: 'Learning', icon: BookOpen },
  { id: 'mindfulness', name: 'Mindfulness', icon: Heart },
  { id: 'creative', name: 'Creative', icon: Palette },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'career', name: 'Career', icon: Briefcase },
];

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function TemplateLibrary({ isOpen, onClose, type = 'all' }: TemplateLibraryProps) {
  const { addHabit } = useAscendStore();
  const [activeTab, setActiveTab] = useState<'habits' | 'goals'>(type === 'goal' ? 'goals' : 'habits');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Filter templates
  const filteredHabits = HABIT_TEMPLATES.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                           selectedCategory === 'popular' && habit.popular ||
                           habit.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredGoals = GOAL_TEMPLATES.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                           selectedCategory === 'popular' && goal.popular ||
                           goal.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTemplate = (id: string) => {
    setSelectedTemplates(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    // Add selected habit templates
    selectedTemplates.forEach(id => {
      const template = HABIT_TEMPLATES.find(h => h.id === id);
      if (template) {
        addHabit({
          name: template.name,
          description: template.description,
          category: categoryMap[template.category],
          frequency: template.frequency,
          color: template.color,
          icon: template.icon,
          customDays: template.targetDays,
          targetCompletions: 1,
          isActive: true,
        });
      }
    });
    
    setSelectedTemplates(new Set());
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-[5%]
                   md:w-[900px] md:max-h-[90vh] z-50 animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Template Library"
      >
        <div className="h-full bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-500 to-gold-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Template Library
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Start with proven templates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          </div>

          {/* Tabs */}
          {type === 'all' && (
            <div className="flex border-b border-[var(--border)]">
              <button
                onClick={() => setActiveTab('habits')}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors relative",
                  activeTab === 'habits'
                    ? "text-ascend-500"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Habit Templates
                </span>
                {activeTab === 'habits' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ascend-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors relative",
                  activeTab === 'goals'
                    ? "text-gold-400"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Goal Templates
                </span>
                {activeTab === 'goals' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
                )}
              </button>
            </div>
          )}

          {/* Search */}
          <div className="px-6 py-3 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] 
                         rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                         focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Categories */}
            <div className="w-48 border-r border-[var(--border)] p-3 overflow-y-auto hidden md:block">
              <div className="space-y-1">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === cat.id
                          ? "bg-ascend-500/10 text-ascend-500"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'habits' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredHabits.map(habit => (
                    <button
                      key={habit.id}
                      onClick={() => toggleTemplate(habit.id)}
                      className={cn(
                        "relative p-4 rounded-xl border text-left transition-all hover:shadow-md",
                        selectedTemplates.has(habit.id)
                          ? "border-ascend-500 bg-ascend-500/5"
                          : "border-[var(--border)] hover:border-ascend-500/50"
                      )}
                    >
                      {/* Selected Indicator */}
                      {selectedTemplates.has(habit.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-ascend-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      
                      {/* Popular Badge */}
                      {habit.popular && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400 text-[10px] font-medium">
                          Popular
                        </div>
                      )}

                      <div className="flex items-start gap-3 mt-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ backgroundColor: habit.color + '20' }}
                        >
                          {habit.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-[var(--text-primary)] truncate">
                            {habit.name}
                          </h4>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
                            {habit.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
                            <span className="px-2 py-0.5 rounded-full bg-[var(--surface)]">
                              {habit.category}
                            </span>
                            <span>+{habit.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredGoals.map(goal => (
                    <div
                      key={goal.id}
                      className="p-4 rounded-xl border border-[var(--border)] hover:border-gold-400/50 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center text-2xl shrink-0">
                          {goal.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[var(--text-primary)]">
                              {goal.title}
                            </h4>
                            {goal.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400 text-[10px] font-medium">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {goal.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="px-2 py-1 rounded-full bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
                              {goal.timeframe}
                            </span>
                            {goal.suggestedHabits.slice(0, 2).map(habit => (
                              <span 
                                key={habit}
                                className="px-2 py-1 rounded-full bg-ascend-500/10 text-xs text-ascend-500"
                              >
                                {habit}
                              </span>
                            ))}
                            {goal.suggestedHabits.length > 2 && (
                              <span className="text-xs text-[var(--text-muted)]">
                                +{goal.suggestedHabits.length - 2} more habits
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="px-4 py-2 rounded-lg bg-gold-400/10 text-gold-400 text-sm font-medium
                                   hover:bg-gold-400/20 transition-colors flex items-center gap-1"
                        >
                          Use Template
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {((activeTab === 'habits' && filteredHabits.length === 0) ||
                (activeTab === 'goals' && filteredGoals.length === 0)) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                  <h3 className="font-medium text-[var(--text-primary)]">No templates found</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {selectedTemplates.size > 0 && (
            <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">
                  {selectedTemplates.size} template{selectedTemplates.size !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTemplates(new Set())}
                    className="px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] 
                             hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleAddSelected}
                    className="px-4 py-2 rounded-lg bg-ascend-500 text-white text-sm font-medium
                             hover:bg-ascend-600 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Add Selected Habits
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TemplateLibrary;
