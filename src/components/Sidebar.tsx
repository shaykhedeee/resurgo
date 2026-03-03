// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Sidebar Navigation Component
// Modern sidebar navigation inspired by professional SaaS apps
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { useTheme } from '@/components/ThemeProvider';
import { Logo } from '@/components/Logo';
import { LEVELS } from '@/types';
import { cn } from '@/lib/utils';
import { 
  CalendarCheck, 
  Target, 
  CheckCircle2,
  Sparkles,
  Timer,
  Calendar,
  TrendingUp,
  Settings,
  Sun,
  Moon,
  Crown,
  Flame,
  Zap,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Shield,
  Heart,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenUpgrade?: () => void;
  onOpenProfile?: () => void;
  onOpenWeeklyReview?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  onOpenSettings, 
  onOpenUpgrade,
  onOpenProfile,
  onOpenWeeklyReview,
  collapsed: controlledCollapsed,
  onCollapsedChange
}: SidebarProps) {
  const { user } = useAscendStore();
  const { theme, toggleTheme, mounted } = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Support both controlled and uncontrolled modes
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = (value: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(value);
    } else {
      setInternalCollapsed(value);
    }
  };
  
  const currentLevel = LEVELS.find(l => l.level === user.gamification.level) || LEVELS[0];
  const prevLevelXp = user.gamification.level > 1 ? LEVELS[user.gamification.level - 2]?.xpRequired || 0 : 0;
  const nextLevelXp = currentLevel.xpRequired + 500;
  const xpProgress = ((user.gamification.totalXP - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

  const navSections = [
    {
      title: 'Main',
      items: [
        { id: 'today', label: 'Today', icon: CalendarCheck, color: 'text-ascend-500' },
        { id: 'habits', label: 'Habits', icon: Target, color: 'text-purple-400' },
        { id: 'tasks', label: 'Tasks', icon: CheckCircle2, color: 'text-blue-400' },
        { id: 'goals', label: 'Goals', icon: Sparkles, color: 'text-gold-400' },
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: 'focus', label: 'Focus Mode', icon: Timer, color: 'text-orange-400' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-pink-400' },
        { id: 'progress', label: 'Analytics', icon: TrendingUp, color: 'text-green-400' },
        { id: 'wellness', label: 'Wellness', icon: Heart, color: 'text-rose-400' },
      ]
    },
    {
      title: 'Review',
      items: [
        { id: 'weekly-review', label: 'Weekly Review', icon: BookOpen, color: 'text-indigo-400' },
      ]
    }
  ];

  const currentTheme = mounted ? theme : 'dark';

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full z-40 hidden md:flex flex-col",
        "bg-[var(--surface)] border-r border-[var(--border)]",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header - Centered Logo */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          "justify-center"
        )}>
          <Logo size="md" />
          {!collapsed && (
            <div className="text-center">
              <h1 className="text-lg font-bold text-themed tracking-tight">Resurgo</h1>
              <p className="text-xs text-themed-muted tracking-[0.2em] uppercase">by WEBNESS</p>
            </div>
          )}
        </div>
      </div>

      {/* User Card - Clickable Profile */}
      <div className={cn(
        "p-4 border-b border-[var(--border)]",
        collapsed && "flex justify-center"
      )}>
        {collapsed ? (
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 
                      flex items-center justify-center text-white font-bold
                      hover:scale-105 transition-transform cursor-pointer"
            title="View Profile"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <div className="space-y-3">
            {/* Profile Section - Clickable */}
            <button
              onClick={onOpenProfile}
              className="w-full flex items-center gap-3 p-2 -m-2 rounded-xl
                       hover:bg-[var(--surface-hover)] transition-all cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 
                              flex items-center justify-center text-white font-bold
                              group-hover:scale-105 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold-400 
                              flex items-center justify-center text-xs font-bold text-black
                              border-2 border-[var(--surface)]">
                  {user.gamification.level}
                </div>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="font-semibold text-themed text-sm truncate">{user.name}</p>
                <p className="text-xs text-themed-muted truncate">{currentLevel.name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-themed-muted group-hover:text-themed transition-colors" />
            </button>

            {/* XP Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-themed-muted flex items-center gap-1">
                  <Zap className="w-3 h-3 text-gold-400" />
                  {user.gamification.totalXP} XP
                </span>
                <span className="text-themed-muted flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  {user.gamification.weeklyStreak} day streak
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 transition-all duration-500"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Plan Badge - Subtle */}
            {user.plan === 'free' ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg
                           bg-[var(--surface-hover)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-themed-muted" />
                  <span className="text-xs text-themed-muted">Free Plan</span>
                </div>
                <button
                  onClick={onOpenUpgrade}
                  className="text-xs font-medium text-ascend-500 hover:text-ascend-400 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                           bg-gradient-to-r from-ascend-500/20 to-gold-400/20 border border-gold-400/30">
                <Crown className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-xs font-semibold text-gold-400">
                  {user.plan === 'lifetime' ? 'Lifetime' : 'Pro'} Member
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6" aria-label="Main navigation">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-themed-muted">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'weekly-review' && onOpenWeeklyReview) {
                        onOpenWeeklyReview();
                      } else {
                        onTabChange(item.id);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                      "transition-all duration-200 group",
                      collapsed && "justify-center",
                      isActive 
                        ? "bg-ascend-500/10 text-ascend-500" 
                        : "text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isActive ? item.color : "group-hover:text-ascend-400"
                    )} />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ascend-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions - Compact Row */}
      <div className="p-3 border-t border-[var(--border)]">
        {collapsed ? (
          // Collapsed: Stack vertically
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
              title={currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {currentTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 rounded-xl text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2.5 rounded-xl text-themed-muted hover:bg-[var(--surface-hover)] hover:text-themed transition-all mt-1"
              title="Expand"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // Expanded: Single row at bottom
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
                title={currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {currentTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg text-themed-secondary hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
                title="Help & Support"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-themed-muted hover:bg-[var(--surface-hover)] hover:text-themed transition-all"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
