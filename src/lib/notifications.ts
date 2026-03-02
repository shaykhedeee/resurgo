// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Push Notification Service
// Web Push Notifications for reminders and motivation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 
    'Notification' in window && 
    'serviceWorker' in navigator;
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isPushSupported()) return 'unsupported';
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Show a local notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<boolean> {
  if (!isPushSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    // Use service worker for better reliability if available
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      } as NotificationOptions);
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        ...options,
      });
    }
    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// SCHEDULED NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────────

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  type: 'morning' | 'evening' | 'streak' | 'habit' | 'goal' | 'custom';
  data?: Record<string, string>;
}

interface NotificationIntelligenceOptions {
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  intelligenceLevel?: 'gentle' | 'balanced' | 'coaching';
  personalizationMode?: 'auto' | 'work' | 'university' | 'general';
  scheduleProfile?: 'standard' | 'shift' | 'flexible' | 'student' | 'retired' | 'stay-at-home';
}

const SCHEDULED_NOTIFICATIONS_KEY = 'ascend-scheduled-notifications';

/**
 * Save scheduled notifications to localStorage
 */
function saveScheduledNotifications(notifications: ScheduledNotification[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

/**
 * Load scheduled notifications from localStorage
 */
export function loadScheduledNotifications(): ScheduledNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    if (!data) return [];
    return JSON.parse(data).map((n: ScheduledNotification) => ({
      ...n,
      scheduledTime: new Date(n.scheduledTime),
    }));
  } catch {
    return [];
  }
}

/**
 * Schedule a notification for a specific time
 */
export function scheduleNotification(notification: Omit<ScheduledNotification, 'id'>): string {
  const notifications = loadScheduledNotifications();
  const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  notifications.push({ ...notification, id });
  saveScheduledNotifications(notifications);
  
  return id;
}

/**
 * Cancel a scheduled notification
 */
export function cancelScheduledNotification(id: string): void {
  const notifications = loadScheduledNotifications();
  saveScheduledNotifications(notifications.filter(n => n.id !== id));
}

/**
 * Check and fire any due notifications
 */
export async function checkScheduledNotifications(): Promise<void> {
  const notifications = loadScheduledNotifications();
  const now = new Date();
  const due: ScheduledNotification[] = [];
  const remaining: ScheduledNotification[] = [];

  for (const notification of notifications) {
    if (notification.scheduledTime <= now) {
      due.push(notification);
    } else {
      remaining.push(notification);
    }
  }

  // Fire due notifications
  for (const notification of due) {
    await showNotification(notification.title, {
      body: notification.body,
      tag: notification.id,
      data: notification.data,
    });
  }

  // Save remaining notifications
  saveScheduledNotifications(remaining);
}

// ─────────────────────────────────────────────────────────────────────────────────
// REMINDER MESSAGES
// ─────────────────────────────────────────────────────────────────────────────────

const MORNING_MESSAGES = [
  { title: 'Rise and Shine', body: 'Ready to begin? Your habits are waiting.' },
  { title: 'Good Morning', body: 'Small actions today create big results tomorrow.' },
  { title: 'New Day, New Opportunities', body: 'What will you accomplish today?' },
  { title: 'Let\'s Go', body: 'Your future self will thank you for today\'s effort.' },
  { title: 'Launch Your Day', body: 'Every habit completed is a vote for your best self.' },
];

const EVENING_MESSAGES = [
  { title: 'Evening Check-in', body: 'Have you completed all your habits today?' },
  { title: 'Almost Done', body: 'You are close. Log the last habits for today.' },
  { title: 'Great Progress', body: 'Review your day and log any remaining habits.' },
  { title: 'Reflect and Rest', body: 'Take a moment to celebrate today\'s wins.' },
];

const STREAK_WARNING_MESSAGES = [
  { title: 'Streak at Risk', body: 'You have not logged habits today. Protect your streak.' },
  { title: 'Keep Your Streak Active', body: 'Log at least one habit to keep momentum.' },
  { title: 'Save Your Progress', body: 'Your streak is valuable. Log a habit now.' },
];

const MOTIVATION_MESSAGES = [
  { title: 'Quick Reminder', body: 'Consistency beats perfection. Keep showing up.' },
  { title: 'You\'ve Got This', body: 'Progress, not perfection. Every step counts.' },
  { title: 'Champion Mindset', body: 'Champions are made in the moments others quit.' },
  { title: 'Stay Focused', body: 'Your goals are closer than you think. Keep pushing.' },
];

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
}

function isWithinQuietHours(minutes: number, start: string, end: string): boolean {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);

  if (startMinutes === endMinutes) {
    return false;
  }

  if (startMinutes < endMinutes) {
    return minutes >= startMinutes && minutes < endMinutes;
  }

  return minutes >= startMinutes || minutes < endMinutes;
}

function shiftOutOfQuietHours(time: string, quietStart: string, quietEnd: string): string {
  const current = parseTimeToMinutes(time);
  if (!isWithinQuietHours(current, quietStart, quietEnd)) {
    return time;
  }
  return quietEnd;
}

function resolvePersonalizationMode(options: NotificationIntelligenceOptions): 'work' | 'university' | 'general' {
  if (options.personalizationMode && options.personalizationMode !== 'auto') {
    return options.personalizationMode;
  }

  if (options.scheduleProfile === 'student') {
    return 'university';
  }

  if (options.scheduleProfile === 'standard' || options.scheduleProfile === 'flexible' || options.scheduleProfile === 'shift') {
    return 'work';
  }

  return 'general';
}

function buildIntelligentNotificationPlan(
  morningTime: string,
  eveningTime: string,
  streakWarningEnabled: boolean,
  options: NotificationIntelligenceOptions
): { morningTime: string; eveningTime: string; streakWarningEnabled: boolean } {
  let plannedMorning = morningTime;
  let plannedEvening = eveningTime;
  let plannedStreakWarning = streakWarningEnabled;

  const intelligenceLevel = options.intelligenceLevel ?? 'balanced';
  const mode = resolvePersonalizationMode(options);

  if (mode === 'work') {
    plannedMorning = '07:30';
    plannedEvening = '19:30';
  } else if (mode === 'university') {
    plannedMorning = '08:30';
    plannedEvening = '20:30';
  }

  if (intelligenceLevel === 'gentle') {
    plannedStreakWarning = false;
  }

  if (options.quietHoursEnabled) {
    const start = options.quietHoursStart || '22:00';
    const end = options.quietHoursEnd || '06:00';
    plannedMorning = shiftOutOfQuietHours(plannedMorning, start, end);
    plannedEvening = shiftOutOfQuietHours(plannedEvening, start, end);
  }

  return {
    morningTime: plannedMorning,
    eveningTime: plannedEvening,
    streakWarningEnabled: plannedStreakWarning,
  };
}

function clearScheduledByType(types: Array<ScheduledNotification['type']>): void {
  const notifications = loadScheduledNotifications();
  saveScheduledNotifications(notifications.filter((n) => !types.includes(n.type)));
}

/**
 * Get a random message from a category
 */
export function getRandomMessage(type: 'morning' | 'evening' | 'streak' | 'motivation'): { title: string; body: string } {
  const messages = type === 'morning' ? MORNING_MESSAGES
    : type === 'evening' ? EVENING_MESSAGES
    : type === 'streak' ? STREAK_WARNING_MESSAGES
    : MOTIVATION_MESSAGES;
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// ─────────────────────────────────────────────────────────────────────────────────
// NOTIFICATION SCHEDULER
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Schedule daily reminders based on user preferences
 */
export function scheduleDailyReminders(
  morningTime: string, // "07:00"
  eveningTime: string, // "21:00"
  streakWarningEnabled: boolean = true,
  options: NotificationIntelligenceOptions = {}
): void {
  const plan = buildIntelligentNotificationPlan(morningTime, eveningTime, streakWarningEnabled, options);
  clearScheduledByType(['morning', 'evening', 'streak']);

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Parse times
  const [morningHour, morningMin] = plan.morningTime.split(':').map(Number);
  const [eveningHour, eveningMin] = plan.eveningTime.split(':').map(Number);

  // Schedule morning reminder
  const morningDate = new Date(today);
  morningDate.setHours(morningHour, morningMin, 0, 0);
  if (morningDate > now) {
    const msg = getRandomMessage('morning');
    scheduleNotification({
      ...msg,
      scheduledTime: morningDate,
      type: 'morning',
    });
  }

  // Schedule evening reminder
  const eveningDate = new Date(today);
  eveningDate.setHours(eveningHour, eveningMin, 0, 0);
  if (eveningDate > now) {
    const msg = getRandomMessage('evening');
    scheduleNotification({
      ...msg,
      scheduledTime: eveningDate,
      type: 'evening',
    });
  }

  // Schedule streak warning (2 hours before midnight if enabled)
  if (plan.streakWarningEnabled) {
    const streakWarningDate = new Date(today);
    streakWarningDate.setHours(22, 0, 0, 0);
    if (streakWarningDate > now) {
      const msg = getRandomMessage('streak');
      scheduleNotification({
        ...msg,
        scheduledTime: streakWarningDate,
        type: 'streak',
      });
    }
  }
}

/**
 * Schedule a habit-specific reminder
 */
export function scheduleHabitReminder(
  habitName: string,
  reminderTime: Date
): string {
  return scheduleNotification({
    title: `Time for: ${habitName}`,
    body: 'Your scheduled habit is ready. Let\'s do this!',
    scheduledTime: reminderTime,
    type: 'habit',
    data: { habitName },
  });
}

// ─────────────────────────────────────────────────────────────────────────────────
// SERVICE WORKER REGISTRATION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Register the service worker for push notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;

  // In local development, avoid stale cache/service-worker issues that can
  // make the app appear stuck on old pages.
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
      console.log('Service Worker disabled on localhost');
    } catch {
      // no-op
    }
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Start the notification checking interval
 */
let notificationCheckInterval: NodeJS.Timeout | null = null;

export function startNotificationChecker(): void {
  if (notificationCheckInterval) return;
  
  // Check every minute
  notificationCheckInterval = setInterval(() => {
    checkScheduledNotifications();
  }, 60000);

  // Also check immediately
  checkScheduledNotifications();
}

export function stopNotificationChecker(): void {
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
    notificationCheckInterval = null;
  }
}
