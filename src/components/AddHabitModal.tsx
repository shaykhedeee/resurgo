// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Add Habit Modal
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { analytics } from '@/lib/analytics';
import { cn, HABIT_ICONS, HABIT_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/utils';
import { HabitFrequency, HabitCategory } from '@/types';
import { 
  X, 
  Plus, 
  Sparkles, 
  Calendar,
  Target,
  Palette,
  Tags,
  ChevronDown,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedGoalId?: string;
}

const FREQUENCY_OPTIONS: { value: HabitFrequency; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Every day' },
  { value: 'weekdays', label: 'Weekdays', description: 'Mon-Fri' },
  { value: 'weekends', label: 'Weekends', description: 'Sat-Sun' },
  { value: 'weekly', label: 'Weekly', description: 'Once per week' },
  { value: 'custom', label: 'Custom', description: 'Specific days' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SUGGESTED_HABITS = [
  { name: 'Morning Exercise', icon: '🏃', color: '#EF4444', category: 'health' as HabitCategory },
  { name: 'Read 30 min', icon: '📚', color: '#8B5CF6', category: 'learning' as HabitCategory },
  { name: 'Meditate', icon: '🧘', color: '#06B6D4', category: 'mindfulness' as HabitCategory },
  { name: 'Drink 8 glasses water', icon: '💧', color: '#3B82F6', category: 'health' as HabitCategory },
  { name: 'Journal', icon: '📝', color: '#F59E0B', category: 'mindfulness' as HabitCategory },
  { name: 'No social media 2h', icon: '📵', color: '#10B981', category: 'productivity' as HabitCategory },
  { name: 'Learn language', icon: '🌍', color: '#EC4899', category: 'learning' as HabitCategory },
  { name: 'Practice instrument', icon: '🎸', color: '#F97316', category: 'creativity' as HabitCategory },
];

export function AddHabitModal({ isOpen, onClose, linkedGoalId }: AddHabitModalProps) {
  const { addHabit, habits, goals } = useAscendStore();
  
  const [step, setStep] = useState<'main' | 'icons' | 'colors'>('main');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [color, setColor] = useState('#14B899');
  const [category, setCategory] = useState<HabitCategory>('general');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [targetCompletions, setTargetCompletions] = useState(1);
  const [selectedGoalId, setSelectedGoalId] = useState(linkedGoalId || '');
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      category,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      targetCompletions,
      linkedGoalId: selectedGoalId || undefined,
      isActive: true,
    });

    analytics.createHabit(category);
    if (habits.length === 0) {
      analytics.firstHabitCreated(category);
    }

    // Reset form
    setName('');
    setDescription('');
    setIcon('⭐');
    setColor('#14B899');
    setCategory('general');
    setFrequency('daily');
    setCustomDays([]);
    setTargetCompletions(1);
    setSelectedGoalId('');
    setStep('main');
    onClose();
  };

  const handleSuggestionClick = (suggestion: typeof SUGGESTED_HABITS[0]) => {
    setName(suggestion.name);
    setIcon(suggestion.icon);
    setColor(suggestion.color);
    setCategory(suggestion.category);
  };

  const toggleCustomDay = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day].sort()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-habit-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-[#12121A]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ascend-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-ascend-400" aria-hidden="true" />
            </div>
            <div>
              <h2 id="add-habit-title" className="text-lg font-bold text-white">Add New Habit</h2>
              <p className="text-xs text-white/50">Build your daily routine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center
                     focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white/60" aria-hidden="true" />
          </button>
        </div>

        {step === 'main' && (
          <div className="p-4 space-y-6">
            {/* Suggestions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                <Sparkles className="w-4 h-4 text-gold-400" aria-hidden="true" />
                Quick Add
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested habits">
                {SUGGESTED_HABITS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    aria-pressed={name === suggestion.name}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-all min-h-[44px]",
                      "focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2",
                      name === suggestion.name
                        ? "bg-ascend-500/20 border border-ascend-500/30 text-ascend-400"
                        : "bg-white/5 hover:bg-white/10 text-white/70"
                    )}
                  >
                    <span aria-hidden="true">{suggestion.icon}</span>
                    <span>{suggestion.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="habit-name" className="block text-sm font-medium text-white/80 mb-2">
                Habit Name <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('icons')}
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 
                           flex items-center justify-center text-2xl transition-colors
                           min-w-[48px] min-h-[48px] focus-visible:ring-2 focus-visible:ring-ascend-500"
                  title="Change icon"
                  aria-label={`Current icon: ${icon}. Click to change`}
                >
                  {icon}
                </button>
                <input
                  id="habit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Morning run, Read 30 min..."
                  className="input-primary flex-1"
                  autoFocus
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this habit important to you?"
                className="input-primary resize-none h-20"
              />
            </div>

            {/* Two-Minute Rule Tip - ADHD Friendly */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-gold-400/10 to-amber-500/10 border border-gold-400/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gold-400 mb-1">
                    Two-Minute Rule
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Make it easy to start! Scale down your habit to just 2 minutes:
                  </p>
                  <ul className="mt-2 text-xs text-white/50 space-y-1">
                    <li>• &quot;Exercise 30 min&quot; → &quot;Put on workout clothes&quot;</li>
                    <li>• &quot;Read a chapter&quot; → &quot;Read one page&quot;</li>
                    <li>• &quot;Meditate 20 min&quot; → &quot;Take 3 deep breaths&quot;</li>
                  </ul>
                  <p className="mt-2 text-xs text-ascend-400 italic">
                    Starting is the hardest part. Once you start, momentum takes over.
                  </p>
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label id="color-picker-label" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <Palette className="w-4 h-4" aria-hidden="true" />
                Color
              </label>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="color-picker-label">
                {HABIT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    role="radio"
                    aria-checked={color === c}
                    aria-label={`Select color ${c}`}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all min-w-[32px] min-h-[32px]",
                      "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12121A]",
                      color === c && "ring-2 ring-white ring-offset-2 ring-offset-[#12121A]"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="relative">
              <label id="category-label" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <Tags className="w-4 h-4" aria-hidden="true" />
                Category
              </label>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="input-primary flex items-center justify-between"
                aria-labelledby="category-label"
                aria-haspopup="listbox"
                aria-expanded={showCategoryDropdown}
              >
                <span className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span>{CATEGORY_LABELS[category]}</span>
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-white/50 transition-transform",
                  showCategoryDropdown && "rotate-180"
                )} />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 
                              bg-[#1A1A24] border border-white/10 rounded-xl 
                              shadow-xl overflow-hidden">
                  {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 flex items-center gap-2 text-left transition-colors",
                        cat === category 
                          ? "bg-ascend-500/20 text-ascend-400" 
                          : "hover:bg-white/5 text-white/70"
                      )}
                    >
                      <span>{CATEGORY_ICONS[cat]}</span>
                      <span>{CATEGORY_LABELS[cat]}</span>
                      {cat === category && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Frequency */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <Calendar className="w-4 h-4" />
                Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FREQUENCY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option.value)}
                    className={cn(
                      "p-3 rounded-xl text-left transition-all",
                      frequency === option.value
                        ? "bg-ascend-500/20 border border-ascend-500/30"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <p className={cn(
                      "text-sm font-medium",
                      frequency === option.value ? "text-ascend-400" : "text-white"
                    )}>
                      {option.label}
                    </p>
                    <p className="text-xs text-white/50">{option.description}</p>
                  </button>
                ))}
              </div>

              {/* Custom Days */}
              {frequency === 'custom' && (
                <div className="mt-4 flex gap-2">
                  {DAYS.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleCustomDay(index)}
                      className={cn(
                        "w-10 h-10 rounded-lg font-medium text-sm transition-all",
                        customDays.includes(index)
                          ? "bg-ascend-500 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      )}
                    >
                      {day.slice(0, 2)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Target Completions */}
            <div>
              <label htmlFor="target-completions" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <Target className="w-4 h-4" aria-hidden="true" />
                Daily Target (for habits you do multiple times)
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="target-completions"
                  type="range"
                  min="1"
                  max="10"
                  value={targetCompletions}
                  onChange={(e) => setTargetCompletions(parseInt(e.target.value))}
                  className="flex-1 accent-ascend-500"
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={targetCompletions}
                  aria-valuetext={`${targetCompletions} times per day`}
                />
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center 
                              text-lg font-bold text-ascend-400" aria-hidden="true">
                  {targetCompletions}x
                </div>
              </div>
            </div>

            {/* Link to Goal */}
            {goals.length > 0 && (
              <div>
                <label htmlFor="linked-goal" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                  <Target className="w-4 h-4" aria-hidden="true" />
                  Link to Goal (optional)
                </label>
                <select
                  id="linked-goal"
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="input-primary"
                  aria-describedby="link-goal-hint"
                >
                  <option value="">No linked goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
                <span id="link-goal-hint" className="sr-only">Select a goal to link this habit to</span>
              </div>
            )}
          </div>
        )}

        {/* Icon Picker */}
        {step === 'icons' && (
          <div className="p-4">
            <button
              onClick={() => setStep('main')}
              className="mb-4 text-sm text-white/60 hover:text-white flex items-center gap-1"
            >
              ← Back to habit details
            </button>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Choose an Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {HABIT_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setIcon(emoji);
                    setStep('main');
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    icon === emoji 
                      ? "bg-ascend-500/20 ring-2 ring-ascend-500" 
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-white/10 bg-[#12121A]/90 backdrop-blur-xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className={cn(
                "btn-primary flex-1 flex items-center justify-center gap-2",
                !name.trim() && "opacity-50 cursor-not-allowed"
              )}
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
