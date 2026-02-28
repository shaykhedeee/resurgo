'use client';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dashboard Layout (Protected)
// Sidebar + top-bar shell for all authenticated routes
// ═══════════════════════════════════════════════════════════════════════════════

import { Logo, LogoMark } from '@/components/Logo';
import { useStoreUser } from '@/hooks/useStoreUser';
import { DowngradePlanNotice } from '@/components/DowngradePlanNotice';
import { OnboardingResume } from '@/components/OnboardingResume';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserButton, useClerk } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Sparkles,
  Timer,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar,
  MessageSquare,
  Menu,
  X,
  DollarSign,
  Briefcase,
  Map,
  Puzzle,
  Gift,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard, color: 'text-zinc-500' },
  { href: '/goals', label: 'GOALS', icon: Target, color: 'text-zinc-500' },
  { href: '/tasks', label: 'TASKS', icon: CheckSquare, color: 'text-zinc-500' },
  { href: '/habits', label: 'HABITS', icon: Sparkles, color: 'text-zinc-500' },
  { href: '/focus', label: 'FOCUS', icon: Timer, color: 'text-zinc-500' },
  { href: '/analytics', label: 'ANALYTICS', icon: BarChart3, color: 'text-zinc-500' },
  { href: '/calendar', label: 'CALENDAR', icon: Calendar, color: 'text-zinc-500' },
  { href: '/wellness', label: 'WELLNESS', icon: Heart, color: 'text-zinc-500' },
  { href: '/budget', label: 'BUDGET', icon: DollarSign, color: 'text-zinc-500' },
  { href: '/business', label: 'BUSINESS', icon: Briefcase, color: 'text-zinc-500' },
  { href: '/plan-builder', label: 'PLAN BUILDER', icon: Map, color: 'text-zinc-500' },
  { href: '/coach', label: 'AI COACH', icon: MessageSquare, color: 'text-zinc-500' },
  { href: '/integrations', label: 'INTEGRATIONS', icon: Puzzle, color: 'text-zinc-500' },
  { href: '/refer', label: 'REFER & EARN', icon: Gift, color: 'text-zinc-500' },
];

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'SETTINGS', icon: Settings, color: 'text-zinc-500' },
];

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useStoreUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Show a non-blocking resume banner instead of forcing a redirect

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3 border border-zinc-900 bg-zinc-950 px-8 py-6">
          <div className="h-px w-32 animate-pulse bg-orange-600" />
          <p className="font-mono text-xs tracking-widest text-zinc-500">INITIALIZING_SYSTEM<span className="animate-blink">_</span></p>
          <p className="font-mono text-[10px] tracking-widest text-zinc-400">LOADING WORKSPACE...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-mono text-xs tracking-widest text-zinc-400">REDIRECTING_TO_AUTH<span className="animate-blink">_</span></p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-black">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-zinc-900 bg-zinc-950 transition-all duration-300',
          collapsed ? 'w-14' : 'w-56',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo / Header */}
        <div className="flex h-12 items-center justify-between border-b border-zinc-900 px-3">
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
            className="hidden p-1 text-zinc-400 hover:text-zinc-400 md:block"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-400 md:hidden"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-px px-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 text-[11px] font-mono tracking-wider transition-colors',
                      isActive
                        ? 'border-l border-orange-600 bg-orange-950/30 text-orange-500 pl-2'
                        : 'border-l border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-orange-500' : 'text-zinc-400')} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-zinc-900 py-2 px-1.5 space-y-px">
          {BOTTOM_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 text-[11px] font-mono tracking-wider transition-colors',
                  isActive
                    ? 'border-l border-orange-600 bg-orange-950/30 text-orange-500 pl-2'
                    : 'border-l border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className={cn('flex items-center gap-2 px-2.5 py-2 border-t border-zinc-900 mt-1', collapsed && 'justify-center')}>
            <UserButton afterSignOutUrl="/" />
            {!collapsed && (
              <>
                {user && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[10px] tracking-wider text-zinc-400">{user.name}</p>
                    <p className="truncate font-mono text-[9px] tracking-wider text-zinc-500">
                      {user.plan === 'free' ? 'FREE_TIER' : user.plan === 'lifetime' ? 'LIFETIME' : 'PRO_ACCESS'}
                    </p>
                  </div>
                )}
                <button
                  className="font-mono text-[9px] tracking-widest text-zinc-400 hover:text-orange-600 transition-colors"
                  onClick={() => { void signOut({ redirectUrl: '/' }); }}
                >
                  [EXIT]
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 transition-all duration-300 pb-16 md:pb-0', collapsed ? 'md:ml-14' : 'md:ml-56')}>
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b border-zinc-900 bg-black px-4 md:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-1 text-zinc-400 hover:text-zinc-400">
            <Menu className="h-4 w-4" />
          </button>
          <Logo showText size="sm" />
        </div>

        {/* Downgrade notice banner (shown only when user has archived items) */}
        <div className="px-4 pt-4 md:px-6">
          <DowngradePlanNotice />
        </div>
        {/* Onboarding resume banner/modal (non-blocking) */}
        <OnboardingResume onboardingComplete={user?.onboardingComplete} />
        {children}
      </main>

      {/* -- Mobile bottom tab bar -- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-zinc-900 bg-black pb-safe md:hidden">
        {[
          { href: '/dashboard', label: 'HOME', icon: LayoutDashboard },
          { href: '/goals', label: 'GOALS', icon: Target },
          { href: '/habits', label: 'HABITS', icon: Sparkles },
          { href: '/focus', label: 'FOCUS', icon: Timer },
          { href: '/coach', label: 'COACH', icon: MessageSquare },
        ].map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1',
                isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-zinc-400'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-mono text-[8px] tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
