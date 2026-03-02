// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Profile Modal Component
// User profile, stats, badges, and account settings
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { BADGES, getRarityColor } from '@/lib/rewards';
import { format } from 'date-fns';
import { 
  X, 
  User,
  Flame,
  Zap,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Crown,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { user, habits, goals, logout } = useAscendStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'stats'>('overview');
  
  if (!isOpen) return null;
  
  // Calculate stats
  const activeHabits = habits.filter(h => h.isActive && !h.archived);
  const activeGoals = goals.filter(g => g.status === 'in_progress');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalTasksCompleted = user.stats?.totalHabitsCompleted || 0;
  const currentStreak = user.stats?.currentStreak || 0;
  const longestStreak = user.stats?.longestStreak || 0;
  
  // Get earned badges (simplified - would normally check against actual achievements)
  const earnedBadges: string[] = [];
  if (totalTasksCompleted >= 1) earnedBadges.push('first-steps');
  if (currentStreak >= 3) earnedBadges.push('hat-trick');
  if (currentStreak >= 7) earnedBadges.push('week-warrior');
  if (currentStreak >= 14) earnedBadges.push('fortnight-force');
  if (currentStreak >= 21) earnedBadges.push('habit-former');
  if (currentStreak >= 30) earnedBadges.push('monthly-master');
  if (currentStreak >= 60) earnedBadges.push('iron-will');
  if (currentStreak >= 100) earnedBadges.push('centurion');
  if (completedGoals.length >= 1) earnedBadges.push('goal-achiever');
  if (activeHabits.length >= 5) earnedBadges.push('habit-collector');
  
  const memberSince = user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Today';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] glass-card p-0 overflow-hidden animate-scale-in flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        {/* Header with profile info */}
        <div className="relative bg-gradient-to-br from-ascend-600 to-ascend-700 p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors
                     min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white/80" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm
                          flex items-center justify-center text-3xl font-bold text-white
                          border-4 border-white/30">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            
            {/* Info */}
            <div>
              <h2 id="profile-title" className="text-2xl font-bold text-white">
                {user.name || 'Ascender'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="text-white/90 text-sm">Level {user.gamification?.level || 1}</span>
                <span className="text-white/50 text-sm">•</span>
                <span className="text-white/70 text-sm">{user.gamification?.totalXP || 0} XP</span>
              </div>
              <p className="text-white/60 text-sm mt-1">Member since {memberSince}</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]" role="tablist">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'stats', label: 'Statistics', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              role="tab"
              aria-selected={activeTab === tab.id ? true : false}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-ascend-500 border-b-2 border-ascend-500"
                  : "text-themed-muted hover:text-themed"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[60vh]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-ascend-500/20 to-ascend-600/10 border border-ascend-500/30">
                  <div className="flex items-center gap-2 text-ascend-500 mb-2">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-medium">Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-themed">{currentStreak} days</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-medium">Goals</span>
                  </div>
                  <p className="text-2xl font-bold text-themed">{activeGoals.length}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Tasks Done</span>
                  </div>
                  <p className="text-2xl font-bold text-themed">{totalTasksCompleted}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-medium">Badges</span>
                  </div>
                  <p className="text-2xl font-bold text-themed">{earnedBadges.length}</p>
                </div>
              </div>
              
              {/* Recent Achievements */}
              <div>
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide mb-3">
                  Recent Achievements
                </h3>
                <div className="space-y-2">
                  {earnedBadges.slice(-3).map(badgeId => {
                    const badge = BADGES.find(b => b.id === badgeId);
                    if (!badge) return null;
                    return (
                      <div 
                        key={badgeId}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border",
                          getRarityColor(badge.rarity)
                        )}
                      >
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <p className="font-medium text-themed">{badge.name}</p>
                          <p className="text-xs text-themed-muted">{badge.description}</p>
                        </div>
                      </div>
                    );
                  })}
                  {earnedBadges.length === 0 && (
                    <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
                      <p className="text-themed-muted text-sm">Complete tasks to earn badges!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Account Info */}
              <div>
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide mb-3">
                  Account
                </h3>
                <div className="p-4 rounded-xl bg-[var(--surface)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-themed-secondary text-sm">Plan</span>
                    <span className="text-themed font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-themed-secondary text-sm">Best Streak</span>
                    <span className="text-themed font-medium">{longestStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-themed-secondary text-sm">Active Habits</span>
                    <span className="text-themed font-medium">{activeHabits.length}</span>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)]">
                    <button
                      onClick={() => {
                        try { logout(); } catch (e) {}
                        router.push('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              {/* Earned Badges */}
              <div>
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide mb-3">
                  Earned ({earnedBadges.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {earnedBadges.map(badgeId => {
                    const badge = BADGES.find(b => b.id === badgeId);
                    if (!badge) return null;
                    return (
                      <div 
                        key={badgeId}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border text-center",
                          getRarityColor(badge.rarity)
                        )}
                      >
                        <span className="text-3xl">{badge.icon}</span>
                        <p className="font-medium text-themed text-sm">{badge.name}</p>
                        <p className="text-xs text-themed-muted">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Locked Badges */}
              <div>
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide mb-3">
                  Locked ({BADGES.length - earnedBadges.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BADGES.filter(b => !earnedBadges.includes(b.id)).map(badge => (
                    <div 
                      key={badge.id}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center opacity-50"
                    >
                      <span className="text-3xl grayscale">{badge.icon}</span>
                      <p className="font-medium text-themed-muted text-sm">{badge.name}</p>
                      <p className="text-xs text-themed-muted">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center gap-2 text-themed-muted mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Total Tasks Completed</span>
                  </div>
                  <p className="text-3xl font-bold text-themed">{totalTasksCompleted}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center gap-2 text-themed-muted mb-2">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs">Current Streak</span>
                  </div>
                  <p className="text-3xl font-bold text-ascend-500">{currentStreak} days</p>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center gap-2 text-themed-muted mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Longest Streak</span>
                  </div>
                  <p className="text-3xl font-bold text-themed">{longestStreak} days</p>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center gap-2 text-themed-muted mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs">Total XP</span>
                  </div>
                  <p className="text-3xl font-bold text-gold-400">{user.gamification?.totalXP || 0}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center gap-2 text-themed-muted mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-xs">Goals Completed</span>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{completedGoals.length}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center gap-2 text-themed-muted mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Active Habits</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">{activeHabits.length}</p>
                </div>
              </div>
              
              {/* Level Progress */}
              <div>
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide mb-3">
                  Level Progress
                </h3>
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-themed font-medium">Level {user.gamification?.level || 1}</span>
                    <span className="text-themed-muted text-sm">
                      {user.gamification?.totalXP || 0} / {(user.gamification?.level || 1) * 500} XP
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 transition-all duration-500"
                      style={{ 
                        width: `${Math.min(((user.gamification?.totalXP || 0) % 500) / 500 * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
