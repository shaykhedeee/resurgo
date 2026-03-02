// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Accessibility Components
// Skip links, screen reader announcer, and focus management components
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useRef, useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  prefersReducedMotion, 
  onReducedMotionChange, 
  announce as announceToSR,
  announcements 
} from '@/lib/accessibility';

// ─────────────────────────────────────────────────────────────────────────────────
// Skip Links Component
// ─────────────────────────────────────────────────────────────────────────────────

interface SkipLink {
  id: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultSkipLinks: SkipLink[] = [
  { id: 'main-content', label: 'Skip to main content' },
  { id: 'main-nav', label: 'Skip to navigation' },
];

export function SkipLinks({ links = defaultSkipLinks, className }: SkipLinksProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav aria-label="Skip links" className={cn('skip-links', className)}>
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => handleClick(e, link.id)}
          className={cn(
            'skip-link',
            'fixed top-0 left-0 z-[9999]',
            'px-4 py-3 bg-ascend-500 text-white font-semibold',
            'transform -translate-y-full focus:translate-y-0',
            'transition-transform duration-200',
            'outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ascend-500',
            'rounded-b-lg shadow-lg'
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Screen Reader Announcer Context
// ─────────────────────────────────────────────────────────────────────────────────

interface AnnouncerContextValue {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

export function useAnnouncer(): AnnouncerContextValue {
  const context = useContext(AnnouncerContext);
  if (!context) {
    // Return a safe fallback that uses the direct function
    return {
      announce: announceToSR,
      announcePolite: (msg) => announceToSR(msg, 'polite'),
      announceAssertive: (msg) => announceToSR(msg, 'assertive'),
    };
  }
  return context;
}

interface AnnouncerProviderProps {
  children: ReactNode;
}

export function AnnouncerProvider({ children }: AnnouncerProviderProps) {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const ref = priority === 'assertive' ? assertiveRef : politeRef;
    if (ref.current) {
      ref.current.textContent = '';
      // Use requestAnimationFrame for reliable announcement
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.textContent = message;
        }
      });
    }
  }, []);

  const announcePolite = useCallback((message: string) => announce(message, 'polite'), [announce]);
  const announceAssertive = useCallback((message: string) => announce(message, 'assertive'), [announce]);

  return (
    <AnnouncerContext.Provider value={{ announce, announcePolite, announceAssertive }}>
      {children}
      {/* Screen reader only live regions */}
      <div
        ref={politeRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        ref={assertiveRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </AnnouncerContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Reduced Motion Context
// ─────────────────────────────────────────────────────────────────────────────────

interface ReducedMotionContextValue {
  prefersReducedMotion: boolean;
  getAnimationDuration: (normalMs: number) => number;
}

const ReducedMotionContext = createContext<ReducedMotionContextValue>({
  prefersReducedMotion: false,
  getAnimationDuration: (ms) => ms,
});

export function useReducedMotion(): ReducedMotionContextValue {
  return useContext(ReducedMotionContext);
}

interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());

  useEffect(() => {
    return onReducedMotionChange(setReducedMotion);
  }, []);

  const getAnimationDuration = useCallback(
    (normalMs: number) => (reducedMotion ? 0 : normalMs),
    [reducedMotion]
  );

  return (
    <ReducedMotionContext.Provider
      value={{ prefersReducedMotion: reducedMotion, getAnimationDuration }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Focus Visible Component
// ─────────────────────────────────────────────────────────────────────────────────

interface FocusVisibleProps {
  children: ReactNode;
}

export function FocusVisibleProvider({ children }: FocusVisibleProps) {
  useEffect(() => {
    // Add class to body when using keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-nav');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Main Content Wrapper
// ─────────────────────────────────────────────────────────────────────────────────

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn('outline-none', className)}
      role="main"
    >
      {children}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Visually Hidden (Screen Reader Only)
// ─────────────────────────────────────────────────────────────────────────────────

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: 'span' | 'div' | 'p' | 'label';
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return <Component className="sr-only">{children}</Component>;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Loading Announcer
// ─────────────────────────────────────────────────────────────────────────────────

interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  loadedMessage?: string;
}

export function LoadingAnnouncer({
  isLoading,
  loadingMessage = announcements.loading(),
  loadedMessage = announcements.loadingComplete(),
}: LoadingAnnouncerProps) {
  const { announce } = useAnnouncer();
  const prevLoading = useRef(isLoading);

  useEffect(() => {
    if (isLoading && !prevLoading.current) {
      announce(loadingMessage);
    } else if (!isLoading && prevLoading.current) {
      announce(loadedMessage);
    }
    prevLoading.current = isLoading;
  }, [isLoading, loadingMessage, loadedMessage, announce]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Accessible Icon
// ─────────────────────────────────────────────────────────────────────────────────

interface AccessibleIconProps {
  icon: ReactNode;
  label: string;
  decorative?: boolean;
}

export function AccessibleIcon({ icon, label, decorative = false }: AccessibleIconProps) {
  if (decorative) {
    return (
      <span aria-hidden="true" role="presentation">
        {icon}
      </span>
    );
  }

  return (
    <span role="img" aria-label={label}>
      {icon}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Combined Accessibility Provider
// ─────────────────────────────────────────────────────────────────────────────────

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  return (
    <ReducedMotionProvider>
      <FocusVisibleProvider>
        <AnnouncerProvider>
          <SkipLinks />
          {children}
        </AnnouncerProvider>
      </FocusVisibleProvider>
    </ReducedMotionProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Re-export common announcements
// ─────────────────────────────────────────────────────────────────────────────────

export { announcements };
