// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Accessibility Utilities
// Skip links, focus management, and a11y helpers
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────────
// SKIP LINK COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function SkipLink({ href = '#main-content', children = 'Skip to main content' }: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4
                 focus:px-4 focus:py-2 focus:bg-ascend-500 focus:text-white focus:rounded-lg
                 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
                 focus:ring-offset-ascend-500 transition-all"
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// FOCUS TRAP HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus first element
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      previouslyFocused?.focus();
    };
  }, [isActive]);

  return containerRef;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ANNOUNCE CHANGES FOR SCREEN READERS
// ─────────────────────────────────────────────────────────────────────────────────

interface AnnouncerContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

export function useAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    throw new Error('useAnnouncer must be used within AnnouncerProvider');
  }
  return context;
}

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Clear first to ensure screen readers pick up the change
    if (priority === 'polite') {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    } else {
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 50);
    }
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Polite announcements (non-interrupting) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      {/* Assertive announcements (interrupting) */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// REDUCED MOTION HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// ─────────────────────────────────────────────────────────────────────────────────
// FOCUS VISIBLE STYLES
// ─────────────────────────────────────────────────────────────────────────────────

export function FocusRing({ 
  children, 
  className,
  offset = 2,
}: { 
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  return (
    <div 
      className={cn(
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ascend-500",
        `focus-within:ring-offset-${offset}`,
        "focus-within:ring-offset-[var(--background)]",
        "rounded-lg transition-shadow",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// VISUALLY HIDDEN (Screen Reader Only)
// ─────────────────────────────────────────────────────────────────────────────────

export function VisuallyHidden({ 
  children, 
  as: Component = 'span' 
}: { 
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// ACCESSIBLE ICON BUTTON
// ─────────────────────────────────────────────────────────────────────────────────

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'danger';
}

export function IconButton({ 
  label, 
  icon, 
  size = 'md', 
  variant = 'default',
  className,
  ...props 
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const variantClasses = {
    default: 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
    ghost: 'hover:bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
    danger: 'hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "rounded-lg transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--background)]",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// LOADING ANNOUNCEMENT
// ─────────────────────────────────────────────────────────────────────────────────

export function LoadingAnnouncement({ 
  isLoading, 
  loadingMessage = 'Loading...',
  completeMessage = 'Content loaded',
}: {
  isLoading: boolean;
  loadingMessage?: string;
  completeMessage?: string;
}) {
  const [prevLoading, setPrevLoading] = useState(isLoading);
  const { announce } = useAnnouncer();

  useEffect(() => {
    if (isLoading && !prevLoading) {
      announce(loadingMessage, 'polite');
    } else if (!isLoading && prevLoading) {
      announce(completeMessage, 'polite');
    }
    setPrevLoading(isLoading);
  }, [isLoading, prevLoading, loadingMessage, completeMessage, announce]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN CONTENT LANDMARK
// ─────────────────────────────────────────────────────────────────────────────────

export function MainContent({ 
  children, 
  className,
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      id="main-content"
      role="main"
      tabIndex={-1}
      className={cn("outline-none", className)}
    >
      {children}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// KEYBOARD-ONLY FOCUS STYLES (CSS)
// ─────────────────────────────────────────────────────────────────────────────────

// Add this CSS to your globals.css:
/*
@layer utilities {
  .focus-visible-only:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }
  
  .focus-visible-ring:focus-visible {
    @apply outline-none ring-2 ring-ascend-500 ring-offset-2 ring-offset-[var(--background)];
  }
}
*/

export default {
  SkipLink,
  useFocusTrap,
  AnnouncerProvider,
  useAnnouncer,
  usePrefersReducedMotion,
  FocusRing,
  VisuallyHidden,
  IconButton,
  LoadingAnnouncement,
  MainContent,
};
