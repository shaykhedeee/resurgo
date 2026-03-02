// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Accessibility Utilities
// WCAG 2.1 AA compliant helpers and utilities
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// ARIA Attribute Helpers
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Converts boolean to ARIA-compliant string value
 * ARIA attributes like aria-pressed, aria-expanded must be strings
 */
export function ariaBoolean(value: boolean): 'true' | 'false' {
  return value ? 'true' : 'false';
}

/**
 * Converts number to ARIA-compliant string value
 * ARIA attributes like aria-valuenow, aria-valuemin must be strings
 */
export function ariaNumber(value: number): string {
  return String(value);
}

/**
 * Creates ARIA live region attributes for dynamic content
 */
export function ariaLive(
  politeness: 'polite' | 'assertive' | 'off' = 'polite',
  atomic: boolean = true
): { 'aria-live': string; 'aria-atomic': 'true' | 'false' } {
  return {
    'aria-live': politeness,
    'aria-atomic': ariaBoolean(atomic),
  };
}

/**
 * Creates progress bar ARIA attributes
 */
export function ariaProgress(
  current: number,
  min: number = 0,
  max: number = 100,
  label?: string
): Record<string, string> {
  return {
    role: 'progressbar',
    'aria-valuenow': ariaNumber(current),
    'aria-valuemin': ariaNumber(min),
    'aria-valuemax': ariaNumber(max),
    ...(label && { 'aria-label': label }),
  };
}

/**
 * Creates slider ARIA attributes
 */
export function ariaSlider(
  current: number,
  min: number,
  max: number,
  label?: string
): Record<string, string> {
  return {
    role: 'slider',
    'aria-valuenow': ariaNumber(current),
    'aria-valuemin': ariaNumber(min),
    'aria-valuemax': ariaNumber(max),
    tabIndex: '0',
    ...(label && { 'aria-label': label }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// Focus Management
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Focus the first focusable element in a container
 */
export function focusFirst(container: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[0].focus();
    return true;
  }
  return false;
}

/**
 * Focus the last focusable element in a container
 */
export function focusLast(container: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[elements.length - 1].focus();
    return true;
  }
  return false;
}

/**
 * Creates a focus trap within a container
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// Screen Reader Announcements
// ─────────────────────────────────────────────────────────────────────────────────

let announcer: HTMLElement | null = null;

/**
 * Creates the screen reader announcer element
 */
function getAnnouncer(): HTMLElement {
  if (announcer) return announcer;
  
  announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(announcer);
  
  return announcer;
}

/**
 * Announce a message to screen readers
 */
export function announce(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const el = getAnnouncer();
  el.setAttribute('aria-live', priority);
  
  // Clear and set message (needed for repeated announcements)
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}

/**
 * Announce an assertive message (interrupts current speech)
 */
export function announceAssertive(message: string): void {
  announce(message, 'assertive');
}

// ─────────────────────────────────────────────────────────────────────────────────
// Reduced Motion Detection
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subscribe to reduced motion preference changes
 */
export function onReducedMotionChange(
  callback: (prefersReduced: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * Get animation duration based on reduced motion preference
 */
export function getAnimationDuration(normalMs: number): number {
  return prefersReducedMotion() ? 0 : normalMs;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Color Contrast Utilities
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Calculate relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1 requires 4.5:1 for normal text, 3:1 for large text
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA requirements
 */
export function meetsContrastAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Keyboard Navigation Helpers
// ─────────────────────────────────────────────────────────────────────────────────

export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Handle arrow key navigation in a list
 */
export function handleArrowNavigation(
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
  } = {}
): number {
  const { orientation = 'vertical', loop = true } = options;
  
  let newIndex = currentIndex;
  const isVertical = orientation === 'vertical' || orientation === 'both';
  const isHorizontal = orientation === 'horizontal' || orientation === 'both';

  switch (e.key) {
    case 'ArrowUp':
      if (isVertical) {
        e.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = loop ? items.length - 1 : 0;
      }
      break;
    case 'ArrowDown':
      if (isVertical) {
        e.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= items.length) newIndex = loop ? 0 : items.length - 1;
      }
      break;
    case 'ArrowLeft':
      if (isHorizontal) {
        e.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = loop ? items.length - 1 : 0;
      }
      break;
    case 'ArrowRight':
      if (isHorizontal) {
        e.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= items.length) newIndex = loop ? 0 : items.length - 1;
      }
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = items.length - 1;
      break;
  }

  if (newIndex !== currentIndex && items[newIndex]) {
    items[newIndex].focus();
  }

  return newIndex;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Skip Link Component Data
// ─────────────────────────────────────────────────────────────────────────────────

export const skipLinks = [
  { id: 'main-content', label: 'Skip to main content' },
  { id: 'main-nav', label: 'Skip to navigation' },
  { id: 'search', label: 'Skip to search' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────────
// Common Announcements
// ─────────────────────────────────────────────────────────────────────────────────

export const announcements = {
  // Navigation
  pageLoaded: (title: string) => `${title} page loaded`,
  navigationOpened: () => 'Navigation menu opened',
  navigationClosed: () => 'Navigation menu closed',
  
  // Actions
  habitCompleted: (name: string) => `Habit "${name}" marked as complete`,
  habitUncompleted: (name: string) => `Habit "${name}" marked as incomplete`,
  taskCompleted: (name: string) => `Task "${name}" completed`,
  goalCreated: (name: string) => `Goal "${name}" created`,
  
  // Forms
  formError: (count: number) => `Form has ${count} error${count === 1 ? '' : 's'}. Please review.`,
  formSuccess: () => 'Form submitted successfully',
  
  // Loading
  loading: () => 'Loading content',
  loadingComplete: () => 'Content loaded',
  
  // Achievements
  achievementUnlocked: (name: string) => `Achievement unlocked: ${name}`,
  levelUp: (level: number) => `Congratulations! You've reached level ${level}`,
  streakMilestone: (days: number) => `${days} day streak! Keep it up!`,
  
  // Errors
  error: (message: string) => `Error: ${message}`,
  networkError: () => 'Network error. Please check your connection.',
} as const;
