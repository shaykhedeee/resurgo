// ═══════════════════════════════════════════════════════════════════════════════
// ResurgoIFY - Push Notifications Hook
// Client-side notification management: permission, scheduling, reminders
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback } from 'react';

type NotificationPermission = 'granted' | 'denied' | 'default';

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledFor: Date;
  recurring?: 'daily' | 'weekly';
  tag?: string;
}

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, body: string, options?: NotificationOptions) => void;
  scheduleReminder: (time: string, title: string, body: string) => void;
  cancelAllReminders: () => void;
  scheduledReminders: ScheduledNotification[];
}

const REMINDERS_KEY = 'resurgo-notification-reminders';
const THROTTLE_KEY = 'resurgo-notification-timestamps';
const MAX_PER_HOUR = 3;
const QUIET_START = 23; // 11 PM
const QUIET_END = 7;   // 7 AM

function isQuietHours(): boolean {
  const h = new Date().getHours();
  return h >= QUIET_START || h < QUIET_END;
}

function isThrottled(): boolean {
  try {
    const raw = localStorage.getItem(THROTTLE_KEY);
    if (!raw) return false;
    const timestamps: number[] = JSON.parse(raw);
    const oneHourAgo = Date.now() - 3600000;
    const recent = timestamps.filter((t) => t > oneHourAgo);
    return recent.length >= MAX_PER_HOUR;
  } catch {
    return false;
  }
}

function recordNotification(): void {
  try {
    const raw = localStorage.getItem(THROTTLE_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const oneHourAgo = Date.now() - 3600000;
    const recent = timestamps.filter((t) => t > oneHourAgo);
    recent.push(Date.now());
    localStorage.setItem(THROTTLE_KEY, JSON.stringify(recent));
  } catch {
    // ignore storage errors
  }
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledNotification[]>([]);

  useEffect(() => {
    // Check if notifications are supported
    const supported = typeof window !== 'undefined' && 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission as NotificationPermission);
    }

    // Load saved reminders
    try {
      const saved = localStorage.getItem(REMINDERS_KEY);
      if (saved) {
        setScheduledReminders(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Check scheduled reminders periodically
  useEffect(() => {
    if (!isSupported || permission !== 'granted') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const reminders = [...scheduledReminders];
      let updated = false;

      reminders.forEach((reminder) => {
        const scheduledTime = new Date(reminder.scheduledFor);
        if (now >= scheduledTime) {
          // Fire the notification
          sendNotificationDirect(reminder.title, reminder.body, {
            tag: reminder.tag || `reminder-${reminder.id}`,
          });

          if (reminder.recurring === 'daily') {
            // Reschedule for tomorrow
            const tomorrow = new Date(scheduledTime);
            tomorrow.setDate(tomorrow.getDate() + 1);
            reminder.scheduledFor = tomorrow;
            updated = true;
          } else if (reminder.recurring === 'weekly') {
            // Reschedule for next week
            const nextWeek = new Date(scheduledTime);
            nextWeek.setDate(nextWeek.getDate() + 7);
            reminder.scheduledFor = nextWeek;
            updated = true;
          } else {
            // One-time, remove it
            const idx = reminders.indexOf(reminder);
            reminders.splice(idx, 1);
            updated = true;
          }
        }
      });

      if (updated) {
        setScheduledReminders(reminders);
        localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isSupported, permission, scheduledReminders]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result === 'granted';
    } catch {
      return false;
    }
  }, [isSupported]);

  const sendNotificationDirect = (title: string, body: string, options?: NotificationOptions) => {
    if (!isSupported || Notification.permission !== 'granted') return;
    if (isQuietHours() || isThrottled()) return;

    recordNotification();

    // Try service worker notification first (works in background)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: { title, body, ...options },
      });
    } else {
      // Fallback to direct Notification API
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });
    }
  };

  const sendNotification = useCallback((title: string, body: string, options?: NotificationOptions) => {
    sendNotificationDirect(title, body, options);
  }, [isSupported]);

  const scheduleReminder = useCallback((time: string, title: string, body: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledFor = new Date();
    scheduledFor.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledFor <= now) {
      scheduledFor.setDate(scheduledFor.getDate() + 1);
    }

    const reminder: ScheduledNotification = {
      id: `reminder-${Date.now()}`,
      title,
      body,
      scheduledFor,
      recurring: 'daily',
      tag: `habit-reminder-${hours}-${minutes}`,
    };

    const updated = [...scheduledReminders, reminder];
    setScheduledReminders(updated);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  }, [scheduledReminders]);

  const cancelAllReminders = useCallback(() => {
    setScheduledReminders([]);
    localStorage.removeItem(REMINDERS_KEY);
  }, []);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleReminder,
    cancelAllReminders,
    scheduledReminders,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// NOTIFICATION MESSAGES
// ─────────────────────────────────────────────────────────────────────────────────

export const NOTIFICATION_MESSAGES = {
  morningReminder: {
    title: 'Good morning! Time to Resurgo',
    body: 'Start your day right. Check your habits and tasks for today.',
  },
  eveningReview: {
    title: 'How was your day?',
    body: 'Take a moment to review your progress and log any remaining habits.',
  },
  streakReminder: {
    title: 'Keep your streak alive!',
    body: 'You still have habits to complete today. Don\'t break the chain!',
  },
  weeklyReview: {
    title: 'Weekly Review Time',
    body: 'Reflect on your week and plan for the next one.',
  },
  milestone: (name: string) => ({
    title: 'Milestone reached!',
    body: `Congratulations! You completed: ${name}`,
  }),
  streakMilestone: (days: number) => ({
    title: `${days}-day streak!`,
    body: `Amazing consistency! You've maintained your streak for ${days} days.`,
  }),
};

export default useNotifications;
