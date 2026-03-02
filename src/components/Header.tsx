// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Header Component
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAscendStore } from '@/lib/store';
import { useTheme } from '@/components/ThemeProvider';
import { Logo } from '@/components/Logo';
import { LEVELS } from '@/types';
import { 
  Sparkles, 
  Flame, 
  Settings, 
  Bell,
  Menu,
  X,
  Target,
  BarChart3,
  Calendar,
  Sun,
  Moon,
  Timer,
  CheckCircle2,
  Crown
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenUpgrade?: () => void;
}

export function Header({ activeTab, onTabChange, onOpenSettings, onOpenUpgrade }: HeaderProps) {
  const router = useRouter();
  const { user, logout, hasCompletedOnboarding } = useAscendStore();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const currentLevel = LEVELS.find(l => l.level === user.gamification.level) || LEVELS[0];
  const prevLevelXp = user.gamification.level > 1 ? LEVELS[user.gamification.level - 2]?.xpRequired || 0 : 0;
  const nextLevelXp = currentLevel.xpRequired + 500; // Approximate next level XP
  const xpProgress = ((user.gamification.totalXP - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

  const navItems = [
    { id: 'today', label: 'Today', icon: BarChart3 },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'goals', label: 'Goals', icon: Sparkles },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  // Don't render theme-dependent UI until mounted
  const currentTheme = mounted ? theme : 'dark';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors bg-[var(--background)]/90 pt-[env(safe-area-inset-top,0px)]"
            style={{ borderColor: 'var(--glass-border)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Premium Design */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Logo size="md" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gold-400 
                            flex items-center justify-center text-[8px] font-bold text-black z-10">
                {user.gamification.level}
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight" 
                  style={{ color: 'var(--text-primary)' }}>
                RESURGO
              </h1>
              <p className="text-[10px] -mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Rise to your potential
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  min-h-[44px] focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
                  ${activeTab === item.id 
                    ? 'bg-ascend-500/20 text-ascend-500' 
                    : 'hover:bg-[var(--surface-hover)]'
                  }`}
                style={{ color: activeTab === item.id ? undefined : 'var(--text-secondary)' }}
              >
                <item.icon className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Upgrade Button - for free users */}
            {user.plan === 'free' && onOpenUpgrade && (
              <button
                onClick={onOpenUpgrade}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-gradient-to-r from-gold-400 to-gold-500 text-white
                         text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
            )}

            {/* Pro Badge - for paid users */}
            {user.plan !== 'free' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           bg-gradient-to-r from-ascend-500/20 to-gold-400/20 border border-gold-400/30">
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-semibold text-gold-400">
                  {user.plan === 'lifetime' ? 'Lifetime' : 'Pro'}
                </span>
              </div>
            )}

            {/* XP Bar (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl border"
                 style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-400">
                  {user.gamification.weeklyStreak}
                </span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: 'var(--border)' }} />
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Lvl {user.gamification.level} • {user.gamification.title}
                  </span>
                  <span className="text-xs font-medium text-ascend-500">
                    {user.gamification.totalXP} XP
                  </span>
                </div>
                <div className="w-32 h-1.5 rounded-full overflow-hidden" 
                     style={{ backgroundColor: 'var(--border)' }}>
                  <div 
                    className="h-full bg-gradient-to-r from-ascend-500 to-gold-400 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-300 hover:bg-[var(--surface-hover)] 
                       active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center" 
              title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-[var(--text-secondary)] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--text-secondary)] transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Notifications - Hidden on mobile */}
            <button 
              className="hidden sm:flex relative p-2.5 rounded-xl transition-colors hover:bg-[var(--surface-hover)]
                       min-w-[44px] min-h-[44px] items-center justify-center" 
              title="Notifications" 
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-ascend-500 rounded-full" />
            </button>

            {/* Settings */}
            <button 
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl transition-colors hover:bg-[var(--surface-hover)]
                       min-w-[44px] min-h-[44px] flex items-center justify-center" 
              title="Settings" 
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            {/* Resume Onboarding (if incomplete) */}
            {!hasCompletedOnboarding && (
              <button
                onClick={() => router.push('/onboarding')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                         bg-[var(--surface)] text-sm font-medium border border-[var(--border)] hover:bg-[var(--surface-hover)]"
                title="Resume Onboarding"
                aria-label="Resume onboarding"
              >
                Start
              </button>
            )}

            {/* Sign out */}
            <button
              onClick={() => {
                try {
                  logout();
                } catch (e) {
                  // ignore
                }
                router.push('/');
              }}
              className="p-2.5 rounded-xl transition-colors hover:bg-[var(--surface-hover)] text-sm hidden md:inline-flex items-center"
              title="Sign out"
              aria-label="Sign out"
            >
              Sign out
            </button>

            {/* Mobile Menu Toggle - Hidden since we have bottom nav */}
            <button 
              className="hidden p-2.5 rounded-xl transition-colors hover:bg-[var(--surface-hover)]
                       min-w-[44px] min-h-[44px] items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--text-primary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--text-primary)]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up" 
               style={{ borderTopWidth: '1px', borderColor: 'var(--glass-border)' }}>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${activeTab === item.id 
                      ? 'bg-ascend-500/20 text-ascend-500' 
                      : 'hover:bg-[var(--surface-hover)]'
                    }`}
                  style={{ color: activeTab === item.id ? undefined : 'var(--text-secondary)' }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Mobile XP */}
            <div className="mt-4 px-4 py-3 rounded-xl border"
                 style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ascend-500">
                    Level {user.gamification.level}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    • {user.gamification.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-orange-400">
                    {user.gamification.weeklyStreak} day streak
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden"
                   style={{ backgroundColor: 'var(--border)' }}>
                <div 
                  className="h-full bg-gradient-to-r from-ascend-500 to-gold-400 rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {user.gamification.totalXP} / {nextLevelXp} XP to next level
              </p>
            </div>
          </div>
        )}
    </header>
  );
}
