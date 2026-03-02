// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Enhanced Template Library V2
// Pre-built templates + Custom templates + Import/Export
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  X,
  Search,
  Sparkles,
  Target,
  Brain,
  Check,
  ChevronRight,
  Star,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit3,
  Award,
  Info,
  Package,
  Grid,
  List,
  Save,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { 
  HabitTemplate, 
  GoalTemplate, 
  CustomTemplate, 
  TemplateCategory, 
  TemplateExport,
  TemplateBundle,
  HabitCategory,
  HabitFrequency,
  GoalCategory,
} from '@/types';
import {
  HABIT_TEMPLATES,
  GOAL_TEMPLATES,
  TEMPLATE_BUNDLES,
  TEMPLATE_CATEGORIES,
  searchTemplates,
} from '@/lib/template-data';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'habit' | 'goal' | 'all';
  onTemplateApplied?: () => void;
}

type TabType = 'browse' | 'bundles' | 'custom' | 'import';
type ViewMode = 'grid' | 'list';
type SortOption = 'popular' | 'name' | 'newest' | 'difficulty';

// Category mapping for creating habits
const categoryMap: Record<TemplateCategory, HabitCategory> = {
  'health': 'health',
  'fitness': 'health',
  'productivity': 'productivity',
  'learning': 'learning',
  'mindfulness': 'mindfulness',
  'social': 'social',
  'finance': 'finance',
  'creative': 'creativity',
  'career': 'productivity',
  'sleep': 'health',
  'nutrition': 'health',
  'relationships': 'social',
  'personal-growth': 'mindfulness',
};

const goalCategoryMap: Record<TemplateCategory, GoalCategory> = {
  'health': 'health',
  'fitness': 'fitness',
  'productivity': 'productivity',
  'learning': 'education',
  'mindfulness': 'mindfulness',
  'social': 'relationships',
  'finance': 'finance',
  'creative': 'creativity',
  'career': 'career',
  'sleep': 'health',
  'nutrition': 'health',
  'relationships': 'relationships',
  'personal-growth': 'mindfulness',
};

// ─────────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE FOR CUSTOM TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────────

const CUSTOM_TEMPLATES_KEY = 'ascend-custom-templates';

function loadCustomTemplates(): CustomTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomTemplates(templates: CustomTemplate[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

// Category Filter Pills
function CategoryPills({ 
  selected, 
  onChange 
}: { 
  selected: string; 
  onChange: (category: string) => void;
}) {
  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'popular', label: 'Popular', icon: Star },
    ...Object.entries(TEMPLATE_CATEGORIES).map(([id, data]) => ({
      id,
      label: data.label,
      icon: null,
      emoji: data.icon,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            selected === cat.id
              ? "bg-ascend-500 text-white"
              : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          )}
        >
          {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
          {'emoji' in cat && cat.emoji && <span>{cat.emoji}</span>}
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// Habit Template Card
function HabitTemplateCard({
  template,
  isSelected,
  onToggle,
  onDetails,
  viewMode = 'grid',
}: {
  template: HabitTemplate;
  isSelected: boolean;
  onToggle: () => void;
  onDetails: () => void;
  viewMode?: ViewMode;
}) {
  const categoryData = TEMPLATE_CATEGORIES[template.category];

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border transition-all",
          isSelected
            ? "border-ascend-500 bg-ascend-500/5"
            : "border-[var(--border)] hover:border-ascend-500/50"
        )}
      >
        <button
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
            isSelected
              ? "border-ascend-500 bg-ascend-500"
              : "border-[var(--border)] hover:border-ascend-500"
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: template.color + '20' }}
        >
          {template.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-[var(--text-primary)] truncate">
              {template.name}
            </h4>
            {template.popular && (
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
            {template.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2 py-1 rounded-full bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
            {categoryData?.label || template.category}
          </span>
          <span className="text-xs text-ascend-500 font-medium">+{template.xpReward} XP</span>
          <button
            onClick={onDetails}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            <Info className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative p-4 rounded-xl border text-left transition-all hover:shadow-md group",
        isSelected
          ? "border-ascend-500 bg-ascend-500/5"
          : "border-[var(--border)] hover:border-ascend-500/50"
      )}
    >
      {/* Selection Indicator */}
      <div
        className={cn(
          "absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "border-ascend-500 bg-ascend-500"
            : "border-[var(--border)] group-hover:border-ascend-500/50"
        )}
      >
        {isSelected && <Check className="w-3 h-3 text-white" />}
      </div>

      {/* Popular Badge */}
      {template.popular && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400 text-[10px] font-medium">
          <Star className="w-3 h-3 fill-gold-400" />
          Popular
        </div>
      )}

      <div className="flex items-start gap-3 mt-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: template.color + '20' }}
        >
          {template.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-[var(--text-primary)] truncate pr-4">
            {template.name}
          </h4>
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
            {template.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-secondary)]">
              {categoryData?.label || template.category}
            </span>
            <span className="text-ascend-500 font-medium">+{template.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* Difficulty indicator */}
      {template.difficulty && (
        <div className="mt-3 flex items-center gap-1">
          {['easy', 'medium', 'hard'].map((level, i) => (
            <div
              key={level}
              className={cn(
                "h-1 flex-1 rounded-full",
                i === 0 && (template.difficulty === 'easy' || template.difficulty === 'medium' || template.difficulty === 'hard')
                  ? 'bg-emerald-500'
                  : 'bg-[var(--surface)]',
                i === 1 && (template.difficulty === 'medium' || template.difficulty === 'hard')
                  ? 'bg-amber-500'
                  : i === 1 ? 'bg-[var(--surface)]' : '',
                i === 2 && template.difficulty === 'hard'
                  ? 'bg-red-500'
                  : i === 2 ? 'bg-[var(--surface)]' : ''
              )}
            />
          ))}
        </div>
      )}

      {/* Info button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDetails();
        }}
        className="absolute bottom-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 
                 hover:bg-[var(--surface-hover)] transition-all"
      >
        <Info className="w-4 h-4 text-[var(--text-muted)]" />
      </button>
    </button>
  );
}

// Goal Template Card
function GoalTemplateCard({
  template,
  onUse,
  onDetails,
}: {
  template: GoalTemplate;
  onUse: () => void;
  onDetails: () => void;
}) {
  const _categoryData = TEMPLATE_CATEGORIES[template.category];

  return (
    <div className="p-4 rounded-xl border border-[var(--border)] hover:border-gold-400/50 transition-all hover:shadow-md group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center text-2xl shrink-0">
          {template.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[var(--text-primary)]">
              {template.title}
            </h4>
            {template.popular && (
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {template.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2 py-1 rounded-full bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
              {template.timeframe}
            </span>
            {template.difficulty && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs",
                template.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-500",
                template.difficulty === 'medium' && "bg-amber-500/10 text-amber-500",
                template.difficulty === 'hard' && "bg-red-500/10 text-red-500",
                template.difficulty === 'expert' && "bg-purple-500/10 text-purple-500"
              )}>
                {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
              </span>
            )}
            {template.suggestedHabits.slice(0, 2).map((habitId, i) => {
              const habit = HABIT_TEMPLATES.find(h => h.id === habitId);
              return habit ? (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-ascend-500/10 text-xs text-ascend-500"
                >
                  {habit.icon} {habit.name}
                </span>
              ) : null;
            })}
            {template.suggestedHabits.length > 2 && (
              <span className="text-xs text-[var(--text-muted)]">
                +{template.suggestedHabits.length - 2} habits
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={onUse}
            className="px-4 py-2 rounded-lg bg-gold-400/10 text-gold-400 text-sm font-medium
                     hover:bg-gold-400/20 transition-colors flex items-center gap-1"
          >
            Use Template
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onDetails}
            className="px-4 py-2 rounded-lg text-[var(--text-muted)] text-sm
                     hover:bg-[var(--surface-hover)] transition-colors"
          >
            Details
          </button>
        </div>
      </div>

      {/* Milestones preview */}
      {template.suggestedMilestones && template.suggestedMilestones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-2">
            {template.suggestedMilestones.length} milestones over {template.timeframe}
          </p>
          <div className="flex gap-1">
            {template.suggestedMilestones.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full bg-gold-400/30"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bundle Card
function BundleCard({
  bundle,
  onUse,
}: {
  bundle: TemplateBundle;
  onUse: () => void;
}) {
  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-transparent hover:border-ascend-500/50 transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ascend-500/20 to-gold-400/20 flex items-center justify-center text-3xl">
          {bundle.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-[var(--text-primary)]">
            {bundle.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {bundle.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              {bundle.habitTemplates.length} habits
            </span>
            {bundle.goalTemplates.length > 0 && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {bundle.goalTemplates.length} goal{bundle.goalTemplates.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onUse}
          className="px-4 py-2 rounded-lg bg-ascend-500 text-white text-sm font-medium
                   hover:bg-ascend-600 transition-colors flex items-center gap-1 shrink-0"
        >
          <Package className="w-4 h-4" />
          Use Bundle
        </button>
      </div>

      {/* Preview habits */}
      <div className="mt-4 flex flex-wrap gap-2">
        {bundle.habitTemplates.slice(0, 5).map((habit) => (
          <span
            key={habit.id}
            className="px-2 py-1 rounded-full bg-[var(--surface)] text-xs text-[var(--text-secondary)]"
          >
            {habit.icon} {habit.name}
          </span>
        ))}
        {bundle.habitTemplates.length > 5 && (
          <span className="px-2 py-1 text-xs text-[var(--text-muted)]">
            +{bundle.habitTemplates.length - 5} more
          </span>
        )}
      </div>
    </div>
  );
}

// Template Detail Modal
function TemplateDetailModal({
  template,
  type,
  onClose,
  onUse,
}: {
  template: HabitTemplate | GoalTemplate;
  type: 'habit' | 'goal';
  onClose: () => void;
  onUse: () => void;
}) {
  const isHabit = type === 'habit';
  const habitTemplate = template as HabitTemplate;
  const goalTemplate = template as GoalTemplate;
  const categoryData = TEMPLATE_CATEGORIES[template.category];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                isHabit ? "bg-ascend-500/10" : "bg-gold-400/10"
              )}
              style={isHabit ? { backgroundColor: habitTemplate.color + '20' } : {}}
            >
              {isHabit ? habitTemplate.icon : goalTemplate.icon}
            </div>
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">
                {isHabit ? habitTemplate.name : goalTemplate.title}
              </h2>
              <span className="text-xs text-[var(--text-muted)]">
                {categoryData?.label || template.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">Description</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {isHabit ? habitTemplate.description : goalTemplate.description}
            </p>
          </div>

          {/* Habit-specific details */}
          {isHabit && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[var(--surface)] text-center">
                  <p className="text-xs text-[var(--text-muted)]">Frequency</p>
                  <p className="font-medium text-sm text-[var(--text-primary)] capitalize">
                    {habitTemplate.frequency}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface)] text-center">
                  <p className="text-xs text-[var(--text-muted)]">XP Reward</p>
                  <p className="font-medium text-sm text-ascend-500">
                    +{habitTemplate.xpReward} XP
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface)] text-center">
                  <p className="text-xs text-[var(--text-muted)]">Difficulty</p>
                  <p className={cn(
                    "font-medium text-sm capitalize",
                    habitTemplate.difficulty === 'easy' && "text-emerald-500",
                    habitTemplate.difficulty === 'medium' && "text-amber-500",
                    habitTemplate.difficulty === 'hard' && "text-red-500"
                  )}>
                    {habitTemplate.difficulty || 'Medium'}
                  </p>
                </div>
              </div>

              {/* Scientific basis */}
              {habitTemplate.scientificBasis && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-medium text-purple-400">Why It Works</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {habitTemplate.scientificBasis}
                  </p>
                </div>
              )}

              {/* Tips */}
              {habitTemplate.tips && habitTemplate.tips.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Tips for Success</h3>
                  <ul className="space-y-2">
                    {habitTemplate.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Goal-specific details */}
          {!isHabit && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[var(--surface)] text-center">
                  <p className="text-xs text-[var(--text-muted)]">Timeframe</p>
                  <p className="font-medium text-sm text-[var(--text-primary)]">
                    {goalTemplate.timeframe}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface)] text-center">
                  <p className="text-xs text-[var(--text-muted)]">Difficulty</p>
                  <p className={cn(
                    "font-medium text-sm capitalize",
                    goalTemplate.difficulty === 'easy' && "text-emerald-500",
                    goalTemplate.difficulty === 'medium' && "text-amber-500",
                    goalTemplate.difficulty === 'hard' && "text-red-500",
                    goalTemplate.difficulty === 'expert' && "text-purple-500"
                  )}>
                    {goalTemplate.difficulty || 'Medium'}
                  </p>
                </div>
              </div>

              {/* Milestones */}
              {goalTemplate.suggestedMilestones && goalTemplate.suggestedMilestones.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Milestones</h3>
                  <div className="space-y-2">
                    {goalTemplate.suggestedMilestones.map((milestone, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-[var(--text-primary)]">
                            {milestone.title}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            Week {milestone.weekNumber}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {milestone.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Habits */}
              {goalTemplate.suggestedHabits.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Suggested Habits</h3>
                  <div className="flex flex-wrap gap-2">
                    {goalTemplate.suggestedHabits.map((habitId) => {
                      const habit = HABIT_TEMPLATES.find(h => h.id === habitId);
                      return habit ? (
                        <span
                          key={habitId}
                          className="px-3 py-1.5 rounded-full bg-ascend-500/10 text-sm text-ascend-500"
                        >
                          {habit.icon} {habit.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Success Metrics */}
              {goalTemplate.successMetrics && goalTemplate.successMetrics.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Success Metrics</h3>
                  <ul className="space-y-2">
                    {goalTemplate.successMetrics.map((metric, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <Award className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
          <button
            onClick={onUse}
            className={cn(
              "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
              isHabit
                ? "bg-ascend-500 text-white hover:bg-ascend-600"
                : "bg-gold-400 text-black hover:bg-gold-500"
            )}
          >
            <Plus className="w-5 h-5" />
            {isHabit ? 'Add This Habit' : 'Use This Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Create Custom Template Modal
function CreateTemplateModal({
  onClose,
  onSave,
  existingTemplate,
}: {
  onClose: () => void;
  onSave: (template: CustomTemplate) => void;
  existingTemplate?: CustomTemplate;
}) {
  const [type, setType] = useState<'habit' | 'goal'>(existingTemplate?.type || 'habit');
  const [name, setName] = useState(existingTemplate?.name || '');
  const [description, setDescription] = useState(existingTemplate?.description || '');
  const [category, setCategory] = useState<TemplateCategory>(existingTemplate?.category || 'productivity');
  const [icon, setIcon] = useState(existingTemplate?.icon || 'TM');
  const [color, setColor] = useState(existingTemplate?.color || '#F97316');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [xpReward, setXpReward] = useState(15);
  const [timeframe, setTimeframe] = useState('3 months');
  const [tags, setTags] = useState<string[]>(existingTemplate?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    const template: CustomTemplate = {
      id: existingTemplate?.id || `custom-${Date.now()}`,
      type,
      name,
      description,
      category,
      icon,
      color,
      sourceId: existingTemplate?.sourceId,
      data: type === 'habit'
        ? {
            frequency,
            xpReward,
            targetCompletions: 1,
          }
        : {
            timeframe,
            timeframeDays: parseInt(timeframe) * 30 || 90,
            suggestedHabits: [],
          },
      tags,
      usageCount: existingTemplate?.usageCount || 0,
      isFavorite: existingTemplate?.isFavorite || false,
      createdAt: existingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(template);
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const EMOJI_OPTIONS = ['TM', 'TG', 'FT', 'RD', 'MD', 'FN', 'AR', 'CR', 'HL', 'ST', 'GO', 'HT', 'PD', 'GR', 'RN', 'BR'];
  const COLOR_OPTIONS = ['#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#22C55E'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-primary)]">
            {existingTemplate ? 'Edit Template' : 'Create Custom Template'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Type Toggle */}
          {!existingTemplate && (
            <div className="flex gap-2 p-1 bg-[var(--surface)] rounded-lg">
              <button
                onClick={() => setType('habit')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                  type === 'habit'
                    ? "bg-ascend-500 text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Habit Template
              </button>
              <button
                onClick={() => setType('goal')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                  type === 'goal'
                    ? "bg-gold-400 text-black"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Goal Template
              </button>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'habit' ? 'Morning Meditation' : 'Learn Spanish'}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                       text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                       focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template..."
              rows={2}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                       text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none
                       focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            />
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-1 p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    className={cn(
                      "w-8 h-8 rounded-md text-lg hover:bg-[var(--surface-hover)] transition-colors",
                      icon === emoji && "bg-ascend-500/20 ring-2 ring-ascend-500"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Color
              </label>
              <div className="flex flex-wrap gap-1 p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={`Select color ${c}`}
                    className={cn(
                      "w-8 h-8 rounded-md transition-all",
                      color === c && "ring-2 ring-offset-2 ring-offset-[var(--card)]"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TemplateCategory)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                       text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            >
              {Object.entries(TEMPLATE_CATEGORIES).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.icon} {data.label}
                </option>
              ))}
            </select>
          </div>

          {/* Habit-specific fields */}
          {type === 'habit' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                             text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="specific">Specific Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                             text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Goal-specific fields */}
          {type === 'goal' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                         text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
              >
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
              </select>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                         text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                         focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                         hover:bg-[var(--surface-hover)] transition-colors"
              >
                <Plus className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--surface)] text-xs text-[var(--text-secondary)]"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)]
                       hover:bg-[var(--surface-hover)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-lg bg-ascend-500 text-white font-medium
                       hover:bg-ascend-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function TemplateLibrary({ isOpen, onClose, type = 'all', onTemplateApplied }: TemplateLibraryProps) {
  const { addHabit, addGoal } = useAscendStore();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [contentTab, setContentTab] = useState<'habits' | 'goals'>(type === 'goal' ? 'goals' : 'habits');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>(loadCustomTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | undefined>();
  const [detailTemplate, setDetailTemplate] = useState<{ template: HabitTemplate | GoalTemplate; type: 'habit' | 'goal' } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort templates
  const filteredHabits = useMemo(() => {
    let habits = [...HABIT_TEMPLATES];

    // Search
    if (searchQuery) {
      const { habits: searchResults } = searchTemplates(searchQuery);
      habits = searchResults;
    }

    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== 'popular') {
      habits = habits.filter(h => h.category === selectedCategory);
    } else if (selectedCategory === 'popular') {
      habits = habits.filter(h => h.popular);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        habits.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'difficulty':
        const diffOrder = { easy: 1, medium: 2, hard: 3 };
        habits.sort((a, b) => (diffOrder[a.difficulty || 'medium'] || 2) - (diffOrder[b.difficulty || 'medium'] || 2));
        break;
      case 'popular':
      default:
        habits.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return habits;
  }, [searchQuery, selectedCategory, sortBy]);

  const filteredGoals = useMemo(() => {
    let goals = [...GOAL_TEMPLATES];

    // Search
    if (searchQuery) {
      const { goals: searchResults } = searchTemplates(searchQuery);
      goals = searchResults;
    }

    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== 'popular') {
      goals = goals.filter(g => g.category === selectedCategory);
    } else if (selectedCategory === 'popular') {
      goals = goals.filter(g => g.popular);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        goals.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'difficulty':
        const diffOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
        goals.sort((a, b) => (diffOrder[a.difficulty || 'medium'] || 2) - (diffOrder[b.difficulty || 'medium'] || 2));
        break;
      case 'popular':
      default:
        goals.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return goals;
  }, [searchQuery, selectedCategory, sortBy]);

  // Handlers
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

  const handleAddSelectedHabits = () => {
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
          targetCompletions: template.targetCompletions || 1,
          isActive: true,
        });
      }
    });

    setSelectedTemplates(new Set());
    onTemplateApplied?.();
    onClose();
  };

  const handleAddSingleHabit = (template: HabitTemplate) => {
    addHabit({
      name: template.name,
      description: template.description,
      category: categoryMap[template.category],
      frequency: template.frequency,
      color: template.color,
      icon: template.icon,
      customDays: template.targetDays,
      targetCompletions: template.targetCompletions || 1,
      isActive: true,
    });

    setDetailTemplate(null);
    onTemplateApplied?.();
    onClose();
  };

  const handleUseGoalTemplate = (template: GoalTemplate) => {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + (template.timeframeDays || 90));
    addGoal({
      id: crypto.randomUUID(),
      userId: '',
      title: template.title,
      description: template.description,
      category: goalCategoryMap[template.category],
      targetDate,
      createdAt: now,
      status: 'not_started',
      milestones: [],
      aiGenerated: false,
      progressPercentage: 0,
      progress: 0,
    });
    onTemplateApplied?.();
    onClose();
  };

  const handleUseBundle = (bundle: TemplateBundle) => {
    // Add all habits from the bundle
    bundle.habitTemplates.forEach(template => {
      addHabit({
        name: template.name,
        description: template.description,
        category: categoryMap[template.category],
        frequency: template.frequency,
        color: template.color,
        icon: template.icon,
        customDays: template.targetDays,
        targetCompletions: template.targetCompletions || 1,
        isActive: true,
      });
    });

    onTemplateApplied?.();
    onClose();
  };

  const handleSaveCustomTemplate = (template: CustomTemplate) => {
    const updated = editingTemplate
      ? customTemplates.map(t => t.id === template.id ? template : t)
      : [...customTemplates, template];
    
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
    setShowCreateModal(false);
    setEditingTemplate(undefined);
  };

  const handleDeleteCustomTemplate = (id: string) => {
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
  };

  const handleUseCustomTemplate = (template: CustomTemplate) => {
    if (template.type === 'habit') {
      const data = template.data as { frequency: HabitFrequency; xpReward: number; targetCompletions: number };
      addHabit({
        name: template.name,
        description: template.description,
        category: categoryMap[template.category],
        frequency: data.frequency,
        color: template.color || '#F97316',
        icon: template.icon,
        targetCompletions: data.targetCompletions,
        isActive: true,
      });
    }

    // Update usage count
    const updated = customTemplates.map(t =>
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    setCustomTemplates(updated);
    saveCustomTemplates(updated);

    onTemplateApplied?.();
    onClose();
  };

  // Import/Export handlers
  const handleExport = () => {
    const categorySet = new Set(customTemplates.map(t => t.category));
    const exportData: TemplateExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      type: 'bundle',
      templates: customTemplates,
      metadata: {
        totalTemplates: customTemplates.length,
        categories: Array.from(categorySet),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascend-templates-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as TemplateExport;
        
        if (!data.version || !data.templates) {
          throw new Error('Invalid template file format');
        }

        // Merge with existing templates (avoid duplicates by ID)
        const existingIds = new Set(customTemplates.map(t => t.id));
        const newTemplates = data.templates.filter(t => !existingIds.has(t.id)) as CustomTemplate[];
        
        if (newTemplates.length === 0) {
          setImportError('All templates already exist');
          return;
        }

        const updated = [...customTemplates, ...newTemplates];
        setCustomTemplates(updated);
        saveCustomTemplates(updated);
        setImportSuccess(`Imported ${newTemplates.length} template${newTemplates.length > 1 ? 's' : ''}`);
      } catch {
        setImportError('Failed to parse template file. Please check the file format.');
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  };

  if (!isOpen) return null;

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
                   md:w-[950px] md:max-h-[90vh] z-50 animate-slide-up"
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
                  {HABIT_TEMPLATES.length} habits • {GOAL_TEMPLATES.length} goals • {TEMPLATE_BUNDLES.length} bundles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ascend-500/10 text-ascend-500
                         text-sm font-medium hover:bg-ascend-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[var(--border)] px-4">
            {[
              { id: 'browse', label: 'Browse', icon: Grid },
              { id: 'bundles', label: 'Bundles', icon: Package },
              { id: 'custom', label: 'My Templates', icon: Star },
              { id: 'import', label: 'Import/Export', icon: Download },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-ascend-500"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'custom' && customTemplates.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-ascend-500/20 text-ascend-500 text-xs">
                    {customTemplates.length}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ascend-500" />
                )}
              </button>
            ))}
          </div>

          {/* Search & Filters (for Browse tab) */}
          {activeTab === 'browse' && (
            <div className="px-4 py-3 space-y-3 border-b border-[var(--border)]">
              {/* Search & View Options */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
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
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                           text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
                >
                  <option value="popular">Popular</option>
                  <option value="name">Name</option>
                  <option value="difficulty">Difficulty</option>
                </select>
                <div className="flex border border-[var(--border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'grid' ? "bg-ascend-500/10 text-ascend-500" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'list' ? "bg-ascend-500/10 text-ascend-500" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Habit/Goal Toggle */}
              {type === 'all' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setContentTab('habits')}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                      contentTab === 'habits'
                        ? "bg-ascend-500 text-white"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    Habit Templates
                  </button>
                  <button
                    onClick={() => setContentTab('goals')}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                      contentTab === 'goals'
                        ? "bg-gold-400 text-black"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    Goal Templates
                  </button>
                </div>
              )}

              {/* Category Pills */}
              <div className="overflow-x-auto pb-1">
                <CategoryPills selected={selectedCategory} onChange={setSelectedCategory} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Browse Tab */}
            {activeTab === 'browse' && (
              <>
                {contentTab === 'habits' ? (
                  <div className={cn(
                    viewMode === 'grid'
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                      : "space-y-2"
                  )}>
                    {filteredHabits.map(habit => (
                      <HabitTemplateCard
                        key={habit.id}
                        template={habit}
                        isSelected={selectedTemplates.has(habit.id)}
                        onToggle={() => toggleTemplate(habit.id)}
                        onDetails={() => setDetailTemplate({ template: habit, type: 'habit' })}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredGoals.map(goal => (
                      <GoalTemplateCard
                        key={goal.id}
                        template={goal}
                        onUse={() => handleUseGoalTemplate(goal)}
                        onDetails={() => setDetailTemplate({ template: goal, type: 'goal' })}
                      />
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {((contentTab === 'habits' && filteredHabits.length === 0) ||
                  (contentTab === 'goals' && filteredGoals.length === 0)) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                    <h3 className="font-medium text-[var(--text-primary)]">No templates found</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Bundles Tab */}
            {activeTab === 'bundles' && (
              <div className="space-y-4">
                {TEMPLATE_BUNDLES.map(bundle => (
                  <BundleCard
                    key={bundle.id}
                    bundle={bundle}
                    onUse={() => handleUseBundle(bundle)}
                  />
                ))}
              </div>
            )}

            {/* Custom Templates Tab */}
            {activeTab === 'custom' && (
              <>
                {customTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customTemplates.map(template => (
                      <div
                        key={template.id}
                        className="p-4 rounded-xl border border-[var(--border)] hover:border-ascend-500/50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                            style={{ backgroundColor: (template.color || '#F97316') + '20' }}
                          >
                            {template.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-[var(--text-primary)] truncate">
                                {template.name}
                              </h4>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                template.type === 'habit' ? "bg-ascend-500/20 text-ascend-500" : "bg-gold-400/20 text-gold-400"
                              )}>
                                {template.type}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-[var(--text-muted)]">
                                Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                          <button
                            onClick={() => handleUseCustomTemplate(template)}
                            className="flex-1 py-1.5 rounded-lg bg-ascend-500/10 text-ascend-500 text-sm font-medium
                                     hover:bg-ascend-500/20 transition-colors"
                          >
                            Use
                          </button>
                          <button
                            onClick={() => {
                              setEditingTemplate(template);
                              setShowCreateModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                          >
                            <Edit3 className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomTemplate(template.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4">
                      <Star className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="font-medium text-[var(--text-primary)]">No custom templates yet</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
                      Create your own templates to quickly add habits and goals you use frequently
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 rounded-lg bg-ascend-500 text-white text-sm font-medium
                               hover:bg-ascend-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Template
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Import/Export Tab */}
            {activeTab === 'import' && (
              <div className="max-w-md mx-auto space-y-6">
                {/* Export Section */}
                <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-ascend-500/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-ascend-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Export Templates</h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        Download your custom templates as JSON
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleExport}
                    disabled={customTemplates.length === 0}
                    className="w-full py-2.5 rounded-lg bg-ascend-500 text-white font-medium
                             hover:bg-ascend-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export {customTemplates.length} Template{customTemplates.length !== 1 ? 's' : ''}
                  </button>
                </div>

                {/* Import Section */}
                <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center">
                      <Download className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Import Templates</h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        Load templates from a JSON file
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-primary)]
                             hover:bg-[var(--surface-hover)] transition-colors font-medium
                             flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File to Import
                  </button>

                  {/* Status messages */}
                  {importError && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-sm text-red-500">{importError}</p>
                    </div>
                  )}
                  {importSuccess && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p className="text-sm text-emerald-500">{importSuccess}</p>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Tips</h4>
                  <ul className="space-y-1 text-xs text-[var(--text-muted)]">
                    <li>• Export your templates before clearing browser data</li>
                    <li>• Share template files with friends</li>
                    <li>• Backup your templates regularly</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'browse' && selectedTemplates.size > 0 && contentTab === 'habits' && (
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
                    onClick={handleAddSelectedHabits}
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

      {/* Detail Modal */}
      {detailTemplate && (
        <TemplateDetailModal
          template={detailTemplate.template}
          type={detailTemplate.type}
          onClose={() => setDetailTemplate(null)}
          onUse={() => {
            if (detailTemplate.type === 'habit') {
              handleAddSingleHabit(detailTemplate.template as HabitTemplate);
            }
            setDetailTemplate(null);
          }}
        />
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingTemplate(undefined);
          }}
          onSave={handleSaveCustomTemplate}
          existingTemplate={editingTemplate}
        />
      )}
    </>
  );
}

export default TemplateLibrary;
