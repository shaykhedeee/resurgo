// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Mobile App Optimization
// PWA, offline support, touch gestures, mobile-first design system
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// PWA CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  scope: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation: 'portrait-primary' | 'landscape-primary' | 'portrait' | 'landscape' | 'any';
  backgroundColor: string;
  themeColor: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose: 'any' | 'maskable' | 'any maskable';
  }>;
  screenshots: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor: 'narrow' | 'wide';
  }>;
  categories: string[];
}

export const RESURGO_PWA_CONFIG: PWAConfig = {
  name: 'Resurgo - AI Productivity & Growth Coach',
  shortName: 'Resurgo',
  description: 'Transform chaos into momentum with AI-powered task management, habit tracking, and personal growth',
  startUrl: '/dashboard',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait-primary',
  backgroundColor: '#ffffff',
  themeColor: '#ef4444', // Brand orange
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/icon-maskable-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
  screenshots: [
    {
      src: '/screenshot-narrow-1.png',
      sizes: '540x720',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: '/screenshot-narrow-2.png',
      sizes: '540x720',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: '/screenshot-wide-1.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
    },
  ],
  categories: ['productivity', 'lifestyle'],
};

// ─────────────────────────────────────────────────────────────────────────────
// OFFLINE SUPPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface OfflineQueueItem {
  id: string;
  action: 'create-task' | 'complete-task' | 'update-habit' | 'add-note' | 'brain-dump';
  payload: Record<string, unknown>;
  timestamp: Date;
  retries: number;
  maxRetries: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  isOnline: boolean;
  queuedItems: number;
  lastSyncTime?: Date;
  nextSyncTime?: Date;
  errors: Array<{ itemId: string; error: string }>;
}

export class OfflineQueueManager {
  private static readonly STORAGE_KEY = 'resurgo_offline_queue';
  private queue: OfflineQueueItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  add(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retries' | 'maxRetries'>): OfflineQueueItem {
    const queueItem: OfflineQueueItem = {
      id: `offline-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      retries: 0,
      maxRetries: 3,
      ...item,
    };
    this.queue.push(queueItem);
    this.saveToStorage();
    return queueItem;
  }

  getAll(): OfflineQueueItem[] {
    return [...this.queue];
  }

  remove(id: string): void {
    this.queue = this.queue.filter(item => item.id !== id);
    this.saveToStorage();
  }

  incrementRetries(id: string): void {
    const item = this.queue.find(i => i.id === id);
    if (item) {
      item.retries++;
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(OfflineQueueManager.STORAGE_KEY, JSON.stringify(this.queue));
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(OfflineQueueManager.STORAGE_KEY);
      this.queue = stored ? JSON.parse(stored) : [];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TOUCH GESTURES
// ─────────────────────────────────────────────────────────────────────────────

export type GestureType = 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch-zoom' | 'long-press' | 'double-tap';

export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface GestureEvent {
  type: GestureType;
  startTouch: TouchPoint;
  endTouch: TouchPoint;
  distance: number;
  duration: number;
  velocity: number; // pixels per ms
  target: HTMLElement;
}

export class GestureDetector {
  private touchStart: TouchPoint | null = null;
  private lastTap: number = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private readonly SWIPE_THRESHOLD = 50; // pixels
  private readonly LONG_PRESS_DURATION = 500; // ms
  private readonly DOUBLE_TAP_THRESHOLD = 300; // ms

  detectGesture(event: TouchEvent): GestureEvent | null {
    const touches = event.touches;
    if (touches.length === 0) return null;

    const touch = touches[0];
    const now = Date.now();

    if (event.type === 'touchstart') {
      this.touchStart = { x: touch.clientX, y: touch.clientY, time: now };

      // Set long press timer
      this.longPressTimer = setTimeout(() => {
        // Long press detected
      }, this.LONG_PRESS_DURATION);

      return null;
    }

    if (event.type === 'touchend' && this.touchStart) {
      clearTimeout(this.longPressTimer!);

      const endTouch = { x: touch.clientX, y: touch.clientY, time: now };
      const duration = endTouch.time - this.touchStart.time;
      const deltaX = endTouch.x - this.touchStart.x;
      const deltaY = endTouch.y - this.touchStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / Math.max(1, duration);

      // Detect double tap
      if (distance < 10 && duration < this.DOUBLE_TAP_THRESHOLD && now - this.lastTap < this.DOUBLE_TAP_THRESHOLD) {
        return {
          type: 'double-tap',
          startTouch: this.touchStart,
          endTouch,
          distance,
          duration,
          velocity,
          target: event.target as HTMLElement,
        };
      }

      this.lastTap = now;

      // Detect swipes
      if (distance > this.SWIPE_THRESHOLD) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          return {
            type: deltaX > 0 ? 'swipe-right' : 'swipe-left',
            startTouch: this.touchStart,
            endTouch,
            distance,
            duration,
            velocity,
            target: event.target as HTMLElement,
          };
        } else {
          return {
            type: deltaY > 0 ? 'swipe-down' : 'swipe-up',
            startTouch: this.touchStart,
            endTouch,
            distance,
            duration,
            velocity,
            target: event.target as HTMLElement,
          };
        }
      }

      this.touchStart = null;
    }

    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE DESIGN BREAKPOINTS (Mobile-first)
// ─────────────────────────────────────────────────────────────────────────────

export const MOBILE_BREAKPOINTS = {
  xs: 320,    // Small phones
  sm: 375,    // iPhone SE
  md: 428,    // iPhone Pro
  lg: 768,    // Tablet (portrait)
  xl: 1024,   // Tablet (landscape)
  '2xl': 1440, // Desktop
};

export const MOBILE_FIRST_LAYOUT = {
  statusBar: 24,      // OS status bar height
  headerHeight: 56,   // Mobile header
  tabBarHeight: 56,   // Bottom navigation
  safeAreaBottom: 34, // iPhone notch/home indicator
  safeAreaTop: 44,    // iPhone notch/status bar
};

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE OPTIMIZATIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface MobilePerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  memoryUsage: number;
}

export class PerformanceMonitor {
  static reportMetrics(): MobilePerformanceMetrics {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      firstContentfulPaint: perfData?.responseEnd - perfData?.fetchStart || 0,
      largestContentfulPaint: this.getLCP(),
      cumulativeLayoutShift: this.getCLS(),
      timeToInteractive: this.getTTI(perfData),
      totalBlockingTime: this.getTBT(),
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private static getLCP(): number {
    const entres = performance.getEntriesByType('largest-contentful-paint') as PerformanceEntryList;
    return entres.length > 0 ? entres[entres.length - 1].startTime : 0;
  }

  private static getCLS(): number {
    let cls = 0;
    const entries = performance.getEntriesByType('layout-shift') as unknown as Array<{ hadRecentInput?: boolean; value: number }>;
    entries.forEach(entry => {
      if (!entry.hadRecentInput) cls += entry.value;
    });
    return cls;
  }

  private static getTTI(perfData: PerformanceNavigationTiming): number {
    return perfData?.domInteractive - perfData?.fetchStart || 0;
  }

  private static getTBT(): number {
    const entres = performance.getEntriesByType('longtask') as PerformanceEntryList;
    return entres.reduce((total, entry) => total + (entry.duration - 50), 0);
  }

  private static getMemoryUsage(): number {
    const perf = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    return perf?.usedJSHeapSize || 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE-SPECIFIC FEATURES
// ─────────────────────────────────────────────────────────────────────────────

export interface MobileFeatures {
  biometric: {
    enabled: boolean;
    type: 'fingerprint' | 'face' | 'both';
  };
  hapticFeedback: {
    enabled: boolean;
    strength: 'light' | 'medium' | 'heavy';
  };
  backgroundSync: {
    enabled: boolean;
    interval: number; // seconds
  };
  notificationBadge: {
    enabled: boolean;
    showCount: boolean;
  };
  voiceInput: {
    enabled: boolean;
    languages: string[];
  };
}

export const DEFAULT_MOBILE_FEATURES: MobileFeatures = {
  biometric: {
    enabled: true,
    type: 'both',
  },
  hapticFeedback: {
    enabled: true,
    strength: 'medium',
  },
  backgroundSync: {
    enabled: true,
    interval: 300, // 5 minutes
  },
  notificationBadge: {
    enabled: true,
    showCount: true,
  },
  voiceInput: {
    enabled: true,
    languages: ['en', 'es', 'fr', 'de', 'ja'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// APP SHELL ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────

export interface AppShellConfig {
  header: {
    sticky: boolean;
    showOnScroll: boolean;
    collapseThreshold: number; // pixels scrolled before collapse
  };
  navigation: {
    type: 'bottom-tab' | 'side-drawer' | 'top-nav';
    collapsible: boolean;
    pinned: boolean[];
  };
  content: {
    maxWidth: number;
    padding: number;
    safeAreaInsets: boolean;
  };
}

export const MOBILE_APP_SHELL: AppShellConfig = {
  header: {
    sticky: true,
    showOnScroll: true,
    collapseThreshold: 100,
  },
  navigation: {
    type: 'bottom-tab',
    collapsible: false,
    pinned: [true, true, true, true, false], // Dashboard, Tasks, Habits, Goals, More
  },
  content: {
    maxWidth: 500, // Max width when on larger screens
    padding: 16,
    safeAreaInsets: true,
  },
};
