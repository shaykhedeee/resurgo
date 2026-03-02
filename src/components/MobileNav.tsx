// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Mobile Bottom Navigation
// Simplified 3-tab navigation: Today | Progress | Profile
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  CalendarCheck, 
  TrendingUp, 
  User,
  Plus,
  Sparkles,
  Target,
  CheckCircle2,
  X
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export function MobileNav({ activeTab, onTabChange, onAddClick }: MobileNavProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Simplified main navigation - 3 core tabs + center action
  const mainNavItems = [
    { id: 'today', label: 'Today', icon: CalendarCheck },
    { id: 'add', label: 'Add', icon: Plus, isAction: true },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Quick add menu items
  const quickAddItems = [
    { id: 'habit', label: 'New Habit', icon: Target, action: () => { onAddClick(); setShowQuickAdd(false); } },
    { id: 'goal', label: 'New Goal', icon: Sparkles, action: () => { onAddClick(); setShowQuickAdd(false); } },
    { id: 'task', label: 'Quick Task', icon: CheckCircle2, action: () => { onTabChange('tasks'); setShowQuickAdd(false); } },
  ];

  // Map legacy tabs to new tabs
  const getActiveMainTab = () => {
    if (['today', 'dashboard', 'habits', 'tasks', 'goals', 'focus', 'calendar'].includes(activeTab)) {
      if (activeTab === 'today' || activeTab === 'dashboard') return 'today';
      return 'today'; // Default complex tabs show under today
    }
    if (activeTab === 'progress') return 'progress';
    if (activeTab === 'profile') return 'profile';
    return 'today';
  };

  const currentMainTab = getActiveMainTab();

  return (
    <>
      {/* Quick Add Menu Overlay */}
      {showQuickAdd && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowQuickAdd(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xl min-w-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-themed text-sm">Quick Add</h3>
              <button 
                onClick={() => setShowQuickAdd(false)}
                className="p-1.5 hover:bg-[var(--surface-hover)] rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center"
                aria-label="Close quick add menu"
                title="Close"
              >
                <X className="w-4 h-4 text-themed-muted" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-2">
              {quickAddItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex items-center gap-3 w-full p-3 rounded-xl transition-all
                             bg-[var(--surface-hover)] hover:bg-ascend-500/10 text-themed"
                  >
                    <div className="w-8 h-8 rounded-lg bg-ascend-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-ascend-500" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden 
                      bg-[var(--surface)]/95 backdrop-blur-xl 
                      border-t border-[var(--border)]
                      pb-[env(safe-area-inset-bottom,0px)]"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-4">
          {mainNavItems.map((item) => {
            const isActive = currentMainTab === item.id;
            const Icon = item.icon;
            
            if (item.isAction) {
              // Center floating action button
              return (
                <button
                  key={item.id}
                  onClick={() => setShowQuickAdd(true)}
                  className="relative -mt-8 flex items-center justify-center 
                           w-14 h-14 rounded-full 
                           bg-gradient-to-br from-ascend-500 to-ascend-600
                           shadow-lg shadow-ascend-500/30
                           active:scale-95 transition-transform
                           focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                  aria-label="Quick add menu"
                >
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-ascend-500/20 blur-md -z-10" aria-hidden="true" />
                </button>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-xl transition-all min-w-[70px] min-h-[48px]",
                  "focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                  isActive 
                    ? "text-ascend-500" 
                    : "text-[var(--text-muted)] active:bg-[var(--surface-hover)]"
                )}
              >
                <div className={cn(
                  "relative p-1.5 rounded-lg transition-colors",
                  isActive && "bg-ascend-500/10"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )} aria-hidden="true" />
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-ascend-500 rounded-full" aria-hidden="true" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-ascend-500" : "text-[var(--text-muted)]"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
