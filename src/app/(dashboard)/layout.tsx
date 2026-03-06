'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dashboard Layout (Protected) — PIXEL TERMINAL EDITION
// Sidebar + top-bar shell for all authenticated routes
// Pixel-art icons, ASCII-style grouped sections, stepped animations
// ═══════════════════════════════════════════════════════════════════════════════

import { Logo, LogoMark } from '@/components/Logo';
import { PixelIcon, NAV_ICON_MAP } from '@/components/PixelIcon';
import type { PixelIconName } from '@/components/PixelIcon';
import { useStoreUser } from '@/hooks/useStoreUser';
import { DowngradePlanNotice } from '@/components/DowngradePlanNotice';
import { OnboardingResume } from '@/components/OnboardingResume';
import { Toast } from '@/components/Toast';
import { GlobalSearch } from '@/components/GlobalSearch';
import BrainDump from '@/components/BrainDump';
import LevelUpDetector from '@/components/LevelUpDetector';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserButton, useClerk } from '@clerk/nextjs';
import { Search, Brain, Bell } from 'lucide-react';

// ── Navigation Sections (ASCII-grouped, collapsible) ──
const NAV_SECTIONS = [
  {
    label: 'CMD CENTER',
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/goals', label: 'Goals' },
      { href: '/tasks', label: 'Tasks' },
      { href: '/habits', label: 'Habits' },
      { href: '/calendar', label: 'Calendar' },
      { href: '/analytics', label: 'Analytics' },
    ],
  },
  {
    label: '★ AI COACH',
    collapsible: false,
    defaultOpen: true,
    items: [
      { href: '/coach', label: 'AI Coach' },
      { href: '/orchestrator', label: 'Orchestrator' },
      { href: '/plan-builder', label: 'Plan Builder' },
    ],
  },
  {
    label: 'WELLNESS',
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/wellness', label: 'Wellness' },
      { href: '/focus', label: 'Focus Timer' },
      { href: '/vision-board', label: 'Vision Board' },
    ],
  },
  {
    label: 'WEALTH',
    collapsible: true,
    defaultOpen: false,
    items: [
      { href: '/budget', label: 'Budget' },
      { href: '/business', label: 'Business' },
      { href: '/wishlist', label: 'Wishlist' },
    ],
  },
  {
    label: 'SYSTEM',
    collapsible: true,
    defaultOpen: false,
    items: [
      { href: '/integrations', label: 'Integrations' },
      { href: '/referrals', label: 'Refer & Earn' },
    ],
  },
];

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useStoreUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [brainDumpOpen, setBrainDumpOpen] = useState(false);
  // Per-section collapse state (for collapsible sidebar sections)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV_SECTIONS.forEach((s) => { initial[s.label] = s.defaultOpen; });
    return initial;
  });
  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Cmd+K / Ctrl+K to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect users who haven't completed onboarding to deep-scan
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.onboardingComplete && !pathname.startsWith('/deep-scan') && !pathname.startsWith('/first-contact')) {
      router.push('/deep-scan');
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3 border-2 border-zinc-800 bg-black px-8 py-6" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.9)' }}>
          <LogoMark className="w-8 h-8 mb-1" />
          <div className="h-[2px] w-32 bg-zinc-900 overflow-hidden">
            <div className="h-full w-1/2 bg-orange-600 animate-[progress-indeterminate_1.5s_steps(12)_infinite]" />
          </div>
          <p className="font-pixel text-[0.65rem] tracking-widest text-zinc-500">INITIALIZING<span className="animate-blink">_</span></p>
          <p className="font-terminal text-sm tracking-widest text-zinc-600">LOADING WORKSPACE...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-pixel text-[0.65rem] tracking-widest text-zinc-400">REDIRECTING<span className="animate-blink">_</span></p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-black">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/85 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen flex-col border-r-2 border-zinc-800 bg-black',
          'transition-all duration-200',
          collapsed ? 'w-14' : 'w-56',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        style={{ borderRadius: 0 }}
      >
        {/* Logo / Header */}
        <div className="flex h-12 items-center justify-between border-b-2 border-zinc-800 px-3">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <Logo showText size="sm" />
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <LogoMark className="w-6 h-6" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden p-1 text-zinc-500 hover:text-orange-400 md:block"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PixelIcon name={collapsed ? 'chevron-right' : 'chevron-left'} size={14} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-zinc-500 hover:text-orange-400 md:hidden"
          >
            <PixelIcon name="x" size={14} />
          </button>
        </div>

        {/* Nav links — ASCII-grouped, collapsible sections */}
        <nav className="flex-1 overflow-y-auto py-1 scrollbar-thin">
          {NAV_SECTIONS.map((section) => {
            const isOpen = openSections[section.label] ?? section.defaultOpen;
            return (
            <div key={section.label} className="mb-1">
              {/* Section header — clickable for collapsible sections */}
              {!collapsed && (
                <button
                  onClick={() => section.collapsible && toggleSection(section.label)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 pt-3 pb-1 text-left',
                    section.collapsible ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                  )}
                >
                  <span className={cn(
                    'font-pixel text-[0.45rem] tracking-[0.15em]',
                    section.label === '★ AI COACH' ? 'text-orange-600' : 'text-zinc-600'
                  )}>
                    ── {section.label} ──
                  </span>
                  {section.collapsible && (
                    <span className="font-pixel text-[0.5rem] text-zinc-700 transition-transform duration-150">
                      {isOpen ? '▼' : '►'}
                    </span>
                  )}
                </button>
              )}
              {collapsed && <div className="mx-2 my-2 h-px bg-zinc-800" />}
              {/* Section items — hide when collapsed */}
              {(isOpen || collapsed) && (
              <ul className="space-y-px px-1.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const iconName = NAV_ICON_MAP[item.label] || ('dashboard' as PixelIconName);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-2.5 px-3 py-2 font-terminal text-base tracking-wide',
                          'transition-colors duration-100 border-l-2',
                          isActive
                            ? 'border-orange-500 bg-orange-950/20 text-orange-400'
                            : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-300'
                        )}
                      >
                        <PixelIcon
                          name={iconName}
                          size={16}
                          className={cn(
                            'shrink-0 transition-colors duration-100',
                            isActive ? 'text-orange-400' : 'text-zinc-600 group-hover:text-zinc-400'
                          )}
                        />
                        {!collapsed && (
                          <span>
                            {isActive && <span className="text-orange-600 mr-1">&gt;</span>}
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              )}
            </div>
            );
          })}
        </nav>

        {/* Bottom section — Settings + User */}
        <div className="border-t-2 border-zinc-800 py-2 px-1.5 space-y-px">
          {/* Settings link */}
          {(() => {
            const isActive = pathname === '/settings' || pathname.startsWith('/settings/');
            return (
              <Link
                href="/settings"
                className={cn(
                  'group flex items-center gap-2.5 px-3 py-2 font-terminal text-base tracking-wide',
                  'transition-colors duration-100 border-l-2',
                  isActive
                    ? 'border-orange-500 bg-orange-950/20 text-orange-400'
                    : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-300'
                )}
              >
                <PixelIcon
                  name="settings"
                  size={16}
                  className={cn('shrink-0', isActive ? 'text-orange-400' : 'text-zinc-600 group-hover:text-zinc-400')}
                />
                {!collapsed && (
                  <span>
                    {isActive && <span className="text-orange-600 mr-1">&gt;</span>}
                    Settings
                  </span>
                )}
              </Link>
            );
          })()}

          {/* User section */}
          <div className={cn(
            'flex items-center gap-2 px-2.5 py-2 border-t-2 border-zinc-800 mt-1',
            collapsed && 'justify-center'
          )}>
            <UserButton afterSignOutUrl="/" />
            {!collapsed && (
              <>
                {user && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-terminal text-sm text-zinc-300">{user.name}</p>
                    <p className="truncate font-pixel text-[0.6rem] tracking-wider text-zinc-600 uppercase">
                      {user.plan === 'free' ? '[ FREE ]' : user.plan === 'lifetime' ? '[ LIFETIME ]' : '[ PRO ]'}
                    </p>
                  </div>
                )}
                <button
                  className="font-terminal text-sm text-zinc-500 hover:text-orange-500 transition-colors duration-100"
                  onClick={() => { void signOut({ redirectUrl: '/' }); }}
                >
                  EXIT
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className={cn(
        'flex-1 transition-all duration-200 pb-16 md:pb-0',
        collapsed ? 'md:ml-14' : 'md:ml-56'
      )}>
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b-2 border-zinc-800 bg-black px-4 md:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-1 text-zinc-500 hover:text-orange-400">
            <PixelIcon name="menu" size={16} />
          </button>
          <Logo showText size="sm" />
          <div className="flex-1" />
          <button
            onClick={() => setBrainDumpOpen(true)}
            className="p-1 text-purple-400 hover:text-purple-300"
            title="Brain Dump"
          >
            <Brain className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="relative p-1 text-zinc-500 hover:text-orange-400"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1 text-zinc-500 hover:text-orange-400"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Command palette hint (desktop) */}
        <div className="hidden md:flex sticky top-0 z-30 h-10 items-center justify-end gap-2 border-b border-zinc-800/50 bg-black/80 backdrop-blur-sm px-6">
          <button
            onClick={() => setBrainDumpOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-purple-800/50 text-purple-400 hover:text-purple-300 hover:border-purple-700 transition-colors"
            title="Brain Dump"
          >
            <Brain className="w-3 h-3" />
            <span className="font-terminal text-xs">Brain Dump</span>
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="relative p-1.5 rounded-md border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            <Search className="w-3 h-3" />
            <span className="font-terminal text-xs">Search</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded text-[0.6rem] border border-zinc-700 bg-zinc-900 font-terminal text-zinc-500">⌘K</kbd>
          </button>
        </div>

        {/* Downgrade notice banner */}
        <div className="px-4 pt-4 md:px-6">
          <DowngradePlanNotice />
        </div>
        {/* Onboarding resume banner/modal (non-blocking) */}
        <OnboardingResume onboardingComplete={user?.onboardingComplete} />
        {children}
      </main>

      {/* ── Mobile bottom tab bar — enhanced with raised AI centre button ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-end justify-around border-t-2 border-zinc-800 bg-black pb-1 md:hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 4px)' }}
      >
        {([
          { href: '/dashboard', label: 'HOME',   iconName: 'home'   as PixelIconName },
          { href: '/goals',     label: 'GOALS',  iconName: 'goals'  as PixelIconName },
        ] as { href: string; label: string; iconName: PixelIconName }[]).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2 transition-colors duration-100',
                isActive ? 'text-orange-400' : 'text-zinc-600',
              )}>
              <PixelIcon name={item.iconName} size={18} />
              <span className="font-pixel text-[0.33rem] tracking-wider">{item.label}</span>
              {isActive && <div className="mt-0.5 h-[2px] w-4 bg-orange-500" />}
            </Link>
          );
        })}

        {/* ── Raised AI Coach centre button ── */}
        <Link href="/coach"
          className={cn(
            'relative -top-3 flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5',
            'border-2 shadow-[0_0_20px_rgba(234,88,12,0.35)] transition-all active:scale-95',
            pathname === '/coach' || pathname.startsWith('/coach/')
              ? 'border-orange-500 bg-orange-600 text-black shadow-[0_0_28px_rgba(234,88,12,0.55)]'
              : 'border-orange-700 bg-orange-950 text-orange-400',
          )}>
          <PixelIcon name={'coach' as PixelIconName} size={18} />
          <span className="font-pixel text-[0.3rem] tracking-wider">AI</span>
        </Link>

        {([
          { href: '/habits', label: 'HABITS', iconName: 'habits' as PixelIconName },
          { href: '/focus',  label: 'FOCUS',  iconName: 'focus'  as PixelIconName },
        ] as { href: string; label: string; iconName: PixelIconName }[]).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2 transition-colors duration-100',
                isActive ? 'text-orange-400' : 'text-zinc-600',
              )}>
              <PixelIcon name={item.iconName} size={18} />
              <span className="font-pixel text-[0.33rem] tracking-wider">{item.label}</span>
              {isActive && <div className="mt-0.5 h-[2px] w-4 bg-orange-500" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Global Toast Notification System ── */}
      <Toast />

      {/* ── Level-Up Celebration Detector ── */}
      <LevelUpDetector />

      {/* ── Global Command Palette (Cmd+K) ── */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(tab) => { router.push(`/${tab}`); setSearchOpen(false); }}
      />

      {/* ── Brain Dump Modal ── */}
      <BrainDump isOpen={brainDumpOpen} onClose={() => setBrainDumpOpen(false)} />

      {/* ── Floating Brain Dump Button ── */}
      <button
        onClick={() => setBrainDumpOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center border border-purple-700 bg-purple-900/80 text-purple-300 shadow-lg backdrop-blur-sm transition hover:bg-purple-800 hover:text-purple-200 md:bottom-6 md:right-6 md:h-14 md:w-14"
        title="Brain Dump — pour out everything on your mind"
      >
        <Brain className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
