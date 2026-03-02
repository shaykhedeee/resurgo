// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Identity System Component
// Based on Atomic Habits: Identity-based habit formation
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Check, 
  Plus, 
  ChevronRight,
  Trophy,
  Target,
  Flame,
  Star,
} from 'lucide-react';
import { ProgressBar } from './TimedTasks';
import { IDENTITY_ARCHETYPES, IDENTITY_THRESHOLDS, type IdentityArchetype, type IdentityLevel } from '@/types';

interface IdentitySystemProps {
  userIdentities?: IdentityArchetype[];
  onSelectIdentity?: (identity: IdentityArchetype) => void;
  isOnboarding?: boolean;
}

export function IdentitySystem({ 
  userIdentities = [], 
  isOnboarding = false 
}: IdentitySystemProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    userIdentities.filter(i => i.isActive).map(i => i.id)
  );
  const [customStatement, setCustomStatement] = useState('');
  const [step, setStep] = useState<'select' | 'customize' | 'complete'>('select');
  const [currentIdentity, setCurrentIdentity] = useState<IdentityArchetype | null>(null);

  const handleSelect = (identity: IdentityArchetype) => {
    if (selectedIds.includes(identity.id)) {
      setSelectedIds(prev => prev.filter(id => id !== identity.id));
    } else if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, identity.id]);
      if (isOnboarding) {
        setCurrentIdentity(identity);
        setStep('customize');
      }
    }
  };

  const getIdentityLevel = (evidenceCount: number): IdentityLevel => {
    if (evidenceCount >= IDENTITY_THRESHOLDS.core.min) return 'core';
    if (evidenceCount >= IDENTITY_THRESHOLDS.established.min) return 'established';
    if (evidenceCount >= IDENTITY_THRESHOLDS.forming.min) return 'forming';
    return 'emerging';
  };

  const getLevelProgress = (evidenceCount: number): { current: number; target: number; label: string } => {
    const level = getIdentityLevel(evidenceCount);
    const threshold = IDENTITY_THRESHOLDS[level];
    const nextLevel = level === 'emerging' ? 'forming' 
                    : level === 'forming' ? 'established' 
                    : level === 'established' ? 'core' 
                    : 'core';
    const nextThreshold = IDENTITY_THRESHOLDS[nextLevel];
    
    return {
      current: evidenceCount - threshold.min,
      target: nextThreshold.min - threshold.min,
      label: `${threshold.label} → ${nextThreshold.label}`,
    };
  };

  const getLevelIcon = (level: IdentityLevel) => {
    switch (level) {
      case 'emerging': return '🌱';
      case 'forming': return '🌿';
      case 'established': return '🌳';
      case 'core': return '💎';
    }
  };

  const getLevelColor = (level: IdentityLevel) => {
    switch (level) {
      case 'emerging': return 'from-green-600 to-green-400';
      case 'forming': return 'from-blue-600 to-blue-400';
      case 'established': return 'from-purple-600 to-purple-400';
      case 'core': return 'from-gold-500 to-yellow-400';
    }
  };

  // Onboarding flow
  if (isOnboarding) {
    if (step === 'select') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Who do you want to become?
            </h2>
            <p className="text-white/60">
              Choose up to 3 identities that resonate with the person you&apos;re becoming.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {IDENTITY_ARCHETYPES.map((identity) => (
              <button
                key={identity.id}
                onClick={() => handleSelect(identity)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                  selectedIds.includes(identity.id)
                    ? "border-ascend-500 bg-ascend-500/10"
                    : "border-white/10 hover:border-white/30 bg-white/5"
                )}
              >
                <div className="text-3xl mb-2">{identity.icon}</div>
                <p className="font-medium text-sm text-white">{identity.name}</p>
                {selectedIds.includes(identity.id) && (
                  <div className="mt-2 w-5 h-5 rounded-full bg-ascend-500 flex items-center justify-center mx-auto">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-white/50">
              {selectedIds.length}/3 selected
            </p>
            <button
              onClick={() => {
                if (selectedIds.length > 0) {
                  const first = IDENTITY_ARCHETYPES.find(i => i.id === selectedIds[0]);
                  if (first) {
                    setCurrentIdentity(first);
                    setStep('customize');
                  }
                }
              }}
              disabled={selectedIds.length === 0}
              className={cn(
                "px-6 py-2 rounded-xl font-medium flex items-center gap-2",
                selectedIds.length > 0
                  ? "bg-ascend-500 hover:bg-ascend-600 text-white"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              )}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    if (step === 'customize' && currentIdentity) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-4">{currentIdentity.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Define Your {currentIdentity.name} Identity
            </h2>
            <p className="text-white/60">
              Complete your identity statement:
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <p className="text-white/80 mb-3">&quot;I am someone who...&quot;</p>
            <textarea
              value={customStatement}
              onChange={(e) => setCustomStatement(e.target.value)}
              placeholder={currentIdentity.statement.replace('I am someone who ', '')}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white 
                       placeholder-white/40 focus:border-ascend-500 focus:outline-none resize-none"
              rows={3}
            />
            <p className="text-xs text-white/40 mt-2">
              💡 Be specific about the behaviors that define this identity
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-white/50 mb-2">Examples:</p>
            <div className="space-y-1">
              {currentIdentity.id === 'athlete' && (
                <>
                  <p className="text-sm text-white/70">• &quot;...never misses a Monday workout&quot;</p>
                  <p className="text-sm text-white/70">• &quot;...moves their body every single day&quot;</p>
                  <p className="text-sm text-white/70">• &quot;...prioritizes physical health&quot;</p>
                </>
              )}
              {currentIdentity.id === 'scholar' && (
                <>
                  <p className="text-sm text-white/70">• &quot;...reads at least 20 pages daily&quot;</p>
                  <p className="text-sm text-white/70">• &quot;...is always learning something new&quot;</p>
                  <p className="text-sm text-white/70">• &quot;...invests in knowledge&quot;</p>
                </>
              )}
              {currentIdentity.id !== 'athlete' && currentIdentity.id !== 'scholar' && (
                <>
                  <p className="text-sm text-white/70">• &quot;...shows up consistently&quot;</p>
                  <p className="text-sm text-white/70">• &quot;...takes action every day&quot;</p>
                  <p className="text-sm text-white/70">• &quot;...never gives up&quot;</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('select')}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep('complete')}
              className="flex-1 py-3 rounded-xl bg-ascend-500 hover:bg-ascend-600 text-white font-medium"
            >
              Save Identity
            </button>
          </div>
        </div>
      );
    }

    if (step === 'complete') {
      return (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 
                        flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Your Identities Are Set!
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Every habit you complete is now a vote for the person you&apos;re becoming. 
            Watch your identity grow stronger with each action.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            {selectedIds.map((id) => {
              const identity = IDENTITY_ARCHETYPES.find(i => i.id === id);
              return identity ? (
                <div 
                  key={id}
                  className="px-4 py-2 rounded-full bg-white/10 text-white flex items-center gap-2"
                >
                  <span>{identity.icon}</span>
                  <span className="text-sm font-medium">{identity.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      );
    }
  }

  // Dashboard view - show user's active identities
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-themed flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-400" />
          Your Identities
        </h3>
        <button className="text-sm text-ascend-400 hover:text-ascend-300 flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Identity
        </button>
      </div>

      {userIdentities.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ascend-500/20 to-gold-400/20 
                        flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-ascend-400" />
          </div>
          <h4 className="font-semibold text-themed mb-2">No Identities Set</h4>
          <p className="text-sm text-themed-secondary mb-4">
            &quot;The goal is not to read a book, it&apos;s to become a reader.&quot;
          </p>
          <button className="btn-primary text-sm">
            Choose Your Identities
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {userIdentities.filter(i => i.isActive).map((identity) => {
            const level = getIdentityLevel(identity.evidenceCount);
            const progress = getLevelProgress(identity.evidenceCount);
            
            return (
              <div 
                key={identity.id}
                className="glass-card p-4 hover:border-ascend-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
                      `bg-gradient-to-br ${getLevelColor(level)}`
                    )}
                    style={{ boxShadow: `0 0 20px ${identity.color}40` }}
                  >
                    {identity.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-themed">{identity.name}</h4>
                      <span className="text-sm">{getLevelIcon(level)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-themed-secondary">
                        {IDENTITY_THRESHOLDS[level].label}
                      </span>
                    </div>
                    <p className="text-sm text-themed-muted mb-3">
                      &quot;{identity.statement}&quot;
                    </p>
                    
                    <ProgressBar
                      current={progress.current}
                      target={progress.target}
                      label={progress.label}
                      color="gold"
                      size="sm"
                    />
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-themed-muted">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {identity.evidenceCount} evidence
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-gold-400" />
                        {identity.linkedHabits.length} linked habits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Atomic Habits Quote */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-ascend-500/10 to-gold-400/10 border border-ascend-500/20">
        <p className="text-sm text-themed italic">
          &quot;Every action you take is a vote for the type of person you wish to become.&quot;
        </p>
        <p className="text-xs text-themed-muted mt-1">— James Clear, Atomic Habits</p>
      </div>
    </div>
  );
}

// Identity Card for Dashboard
interface IdentityCardProps {
  identity: IdentityArchetype;
  compact?: boolean;
}

export function IdentityCard({ identity, compact = false }: IdentityCardProps) {
  const level = identity.level;
  const progress = {
    current: identity.evidenceCount,
    target: IDENTITY_THRESHOLDS[level === 'core' ? 'core' : 
            level === 'established' ? 'core' :
            level === 'forming' ? 'established' : 'forming'].min,
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
        <span>{identity.icon}</span>
        <span className="text-sm font-medium text-themed">{identity.name}</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-gold-400"
            style={{ width: `${(progress.current / progress.target) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${identity.color}20` }}
        >
          {identity.icon}
        </div>
        <div>
          <h4 className="font-semibold text-themed">{identity.name}</h4>
          <p className="text-xs text-themed-muted">{IDENTITY_THRESHOLDS[level].label}</p>
        </div>
      </div>
      <ProgressBar
        current={progress.current}
        target={progress.target}
        showPercentage={true}
        color="gold"
        size="md"
      />
      <p className="text-xs text-themed-muted mt-2">
        {identity.evidenceCount} actions proving this identity
      </p>
    </div>
  );
}
