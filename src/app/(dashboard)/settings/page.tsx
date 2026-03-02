'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Settings Page
// Profile, schedule, notifications, theme preferences
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import {
  Save,
  Archive,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 border border-zinc-900 bg-zinc-950">
      <div className="border-b border-zinc-900 px-4 py-2.5">
        <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const currentUser = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateSchedule = useMutation(api.users.updateSchedule);
  const updateNotifPrefs = useMutation(api.users.updateNotificationPrefs);

  // Archived items (downgrade preservation)
  const archivedHabits = useQuery(api.habits.listArchivedByDowngrade) ?? [];
  const archivedGoals = useQuery(api.goals.listArchivedByDowngrade) ?? [];

  // Profile fields
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [profileSaved, setProfileSaved] = useState(false);

  // Schedule fields
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [peakTime, setPeakTime] = useState('morning');
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Notification fields
  const [morningMotivation, setMorningMotivation] = useState(true);
  const [middayCheckin, setMiddayCheckin] = useState(true);
  const [eveningWinddown, setEveningWinddown] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [hydrationReminders, setHydrationReminders] = useState(false);
  const [focusSessionReminders, setFocusSessionReminders] = useState(true);
  const [sleepReminders, setSleepReminders] = useState(true);
  const [weeklyReviewReminders, setWeeklyReviewReminders] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('06:00');
  const [reminderStyle, setReminderStyle] = useState<'gentle' | 'supportive' | 'persistent' | 'minimal'>('supportive');
  const [coachingFrequency, setCoachingFrequency] = useState<'daily' | 'weekly' | 'struggling_only' | 'manual'>('daily');
  const [notifSaved, setNotifSaved] = useState(false);

  // Initialize from current user
  useEffect(() => {
    if (currentUser) {
      const u = currentUser as Record<string, unknown>;
      setName(currentUser.name ?? clerkUser?.fullName ?? '');
      setTimezone(currentUser.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
      setTheme((u.theme as 'light' | 'dark' | 'system') ?? 'dark');
      setWakeTime((u.wakeTime as string) ?? '07:00');
      setSleepTime((u.sleepTime as string) ?? '23:00');
      setPeakTime((u.peakProductivityTime as string) ?? 'morning');

      const prefs = u.notificationPrefs as {
        morningMotivation?: boolean; middayCheckin?: boolean; eveningWinddown?: boolean;
        taskReminders?: boolean; hydrationReminders?: boolean; focusSessionReminders?: boolean;
        sleepReminders?: boolean; weeklyReviewReminders?: boolean; quietHoursEnabled?: boolean;
        quietHoursStart?: string; quietHoursEnd?: string;
        reminderStyle?: 'gentle' | 'supportive' | 'persistent' | 'minimal';
        coachingFrequency?: 'daily' | 'weekly' | 'struggling_only' | 'manual';
      } | undefined;
      if (prefs) {
        setMorningMotivation(prefs.morningMotivation ?? true);
        setMiddayCheckin(prefs.middayCheckin ?? true);
        setEveningWinddown(prefs.eveningWinddown ?? true);
        setTaskReminders(prefs.taskReminders ?? true);
        setHydrationReminders(prefs.hydrationReminders ?? false);
        setFocusSessionReminders(prefs.focusSessionReminders ?? true);
        setSleepReminders(prefs.sleepReminders ?? true);
        setWeeklyReviewReminders(prefs.weeklyReviewReminders ?? true);
        setQuietHoursEnabled(prefs.quietHoursEnabled ?? true);
        setQuietHoursStart(prefs.quietHoursStart ?? '22:00');
        setQuietHoursEnd(prefs.quietHoursEnd ?? '06:00');
        setReminderStyle(prefs.reminderStyle ?? 'supportive');
        setCoachingFrequency(prefs.coachingFrequency ?? 'daily');
      }
    }
  }, [currentUser, clerkUser]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, timezone, theme });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      await updateSchedule({
        wakeTime,
        sleepTime,
        peakProductivityTime: peakTime,
      });
      setScheduleSaved(true);
      setTimeout(() => setScheduleSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save schedule:', e);
    }
  };

  const handleSaveNotifs = async () => {
    try {
      await updateNotifPrefs({
        prefs: {
          morningMotivation,
          middayCheckin,
          eveningWinddown,
          taskReminders,
          hydrationReminders,
          focusSessionReminders,
          sleepReminders,
          weeklyReviewReminders,
          quietHoursEnabled,
          quietHoursStart,
          quietHoursEnd,
          reminderStyle,
          coachingFrequency,
        },
      });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save notification prefs:', e);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="border border-zinc-900 bg-zinc-950 px-8 py-6 text-center">
          <p className="font-mono text-xs tracking-widest text-orange-600">LOADING_CONFIGURATION_</p>
          <span className="inline-block h-2 w-2 animate-blink bg-orange-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-3xl">

        {/* -- CONFIGURATION_MATRIX HEADER -- */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">
              CONFIGURATION_MATRIX :: SYSTEM_PREFERENCES
            </span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Settings</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">
              Profile · Schedule · Notifications · Appearance · Data
            </p>
          </div>
        </div>

        {/* -- PROFILE SECTION -- */}
        <SettingsSection title="OPERATOR_PROFILE">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">DISPLAY_NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">EMAIL_ADDRESS</label>
              <p className="font-mono text-xs text-zinc-500">{clerkUser?.primaryEmailAddress?.emailAddress ?? 'N/A'}</p>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">TIMEZONE</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
              >
                {Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">ACCESS_TIER</label>
              <span className={`inline-block border px-2.5 py-0.5 font-mono text-[9px] tracking-widest ${
                currentUser.plan === 'lifetime' ? 'border-purple-900 text-purple-500' :
                currentUser.plan === 'pro'      ? 'border-orange-900 text-orange-500' :
                'border-zinc-800 text-zinc-400'
              }`}>
                {(currentUser.plan?.toUpperCase() ?? 'FREE') + '_TIER'}
              </span>
            </div>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-5 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60"
            >
              <Save className="h-3 w-3" />
              {profileSaved ? '[SAVED_OK]' : '[SAVE_PROFILE]'}
            </button>
          </div>
        </SettingsSection>

        {/* -- APPEARANCE SECTION -- */}
        <SettingsSection title="APPEARANCE_MODE">
          <div className="flex gap-2">
            {(['dark', 'light', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`border px-4 py-2 font-mono text-[10px] tracking-widest transition ${
                  theme === t
                    ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* -- SCHEDULE SECTION -- */}
        <SettingsSection title="DAILY_SCHEDULE">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">WAKE_TIME</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">SLEEP_TIME</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">PEAK_PRODUCTIVITY_WINDOW</label>
              <select
                value={peakTime}
                onChange={(e) => setPeakTime(e.target.value)}
                className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
              >
                <option value="morning">MORNING</option>
                <option value="afternoon">AFTERNOON</option>
                <option value="evening">EVENING</option>
                <option value="late_night">LATE_NIGHT</option>
              </select>
            </div>
            <button
              onClick={handleSaveSchedule}
              className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-5 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60"
            >
              <Save className="h-3 w-3" />
              {scheduleSaved ? '[SAVED_OK]' : '[SAVE_SCHEDULE]'}
            </button>
          </div>
        </SettingsSection>

        {/* -- NOTIFICATIONS SECTION -- */}
        <SettingsSection title="NOTIFICATION_PREFS">
          <div className="space-y-3">
            {[
              { label: 'MORNING_MOTIVATION',   value: morningMotivation,     setter: setMorningMotivation     },
              { label: 'MIDDAY_CHECKIN',        value: middayCheckin,          setter: setMiddayCheckin          },
              { label: 'EVENING_WINDDOWN',      value: eveningWinddown,        setter: setEveningWinddown        },
              { label: 'TASK_REMINDERS',        value: taskReminders,          setter: setTaskReminders          },
              { label: 'HYDRATION_NUDGES',      value: hydrationReminders,     setter: setHydrationReminders     },
              { label: 'FOCUS_SESSION_NUDGES',  value: focusSessionReminders,  setter: setFocusSessionReminders  },
              { label: 'SLEEP_REMINDERS',       value: sleepReminders,         setter: setSleepReminders         },
              { label: 'WEEKLY_REVIEW_REMIND',  value: weeklyReviewReminders,  setter: setWeeklyReviewReminders  },
              { label: 'QUIET_HOURS',           value: quietHoursEnabled,      setter: setQuietHoursEnabled      },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-zinc-500">{label}</span>
                <button
                  onClick={() => setter(!value)}
                  className={`h-5 w-9 border transition ${
                    value ? 'border-orange-800 bg-orange-950/50' : 'border-zinc-800 bg-zinc-950'
                  }`}
                  aria-pressed={value}
                >
                  <span className={`block h-3 w-3 border border-zinc-600 bg-zinc-400 transition-all ${
                    value ? 'ml-[18px] border-orange-600 bg-orange-500' : 'ml-0.5'
                  }`} />
                </button>
              </div>
            ))}

            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 border border-zinc-800 bg-black p-3">
                <div>
                  <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">QUIET_START</label>
                  <input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    className="w-full border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">QUIET_END</label>
                  <input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    className="w-full border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">REMINDER_STYLE</label>
              <select
                value={reminderStyle}
                onChange={(e) => setReminderStyle(e.target.value as typeof reminderStyle)}
                className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
              >
                <option value="gentle">GENTLE</option>
                <option value="supportive">SUPPORTIVE</option>
                <option value="persistent">PERSISTENT</option>
                <option value="minimal">MINIMAL</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[9px] tracking-widest text-zinc-400">COACHING_FREQUENCY</label>
              <select
                value={coachingFrequency}
                onChange={(e) => setCoachingFrequency(e.target.value as typeof coachingFrequency)}
                className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none"
              >
                <option value="daily">DAILY</option>
                <option value="weekly">WEEKLY</option>
                <option value="struggling_only">WHEN_STRUGGLING</option>
                <option value="manual">MANUAL_ONLY</option>
              </select>
            </div>

            <button
              onClick={handleSaveNotifs}
              className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-5 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60"
            >
              <Save className="h-3 w-3" />
              {notifSaved ? '[SAVED_OK]' : '[SAVE_NOTIFICATIONS]'}
            </button>
          </div>
        </SettingsSection>

        {/* -- ARCHIVED ITEMS -- */}
        {(archivedHabits.length > 0 || archivedGoals.length > 0) && (
          <SettingsSection title="ARCHIVED_ITEMS">
            <p className="mb-3 font-mono text-[10px] text-zinc-400">
              These items were archived on plan downgrade. Upgrade to restore.
            </p>

            {archivedHabits.length > 0 && (
              <div className="mb-3">
                <p className="mb-1.5 font-mono text-[9px] tracking-widest text-zinc-400">
                  NODES ({archivedHabits.length})
                </p>
                <div className="space-y-px">
                  {(archivedHabits as { _id: string; title: string; category: string }[]).map((h) => (
                    <div key={h._id} className="flex items-center gap-2 border border-zinc-900 bg-black px-3 py-2">
                      <Archive className="h-3 w-3 shrink-0 text-zinc-400" />
                      <span className="flex-1 truncate font-mono text-[10px] text-zinc-500">{h.title}</span>
                      <span className="font-mono text-[9px] text-zinc-400">{h.category?.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {archivedGoals.length > 0 && (
              <div className="mb-3">
                <p className="mb-1.5 font-mono text-[9px] tracking-widest text-zinc-400">
                  OBJECTIVES ({archivedGoals.length})
                </p>
                <div className="space-y-px">
                  {(archivedGoals as { _id: string; title: string; category: string }[]).map((g) => (
                    <div key={g._id} className="flex items-center gap-2 border border-zinc-900 bg-black px-3 py-2">
                      <Archive className="h-3 w-3 shrink-0 text-zinc-400" />
                      <span className="flex-1 truncate font-mono text-[10px] text-zinc-500">{g.title}</span>
                      <span className="font-mono text-[9px] text-zinc-400">{g.category?.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/billing"
              className="inline-flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60"
            >
              <RefreshCw className="h-3 w-3" />
              [UPGRADE_TO_RESTORE]
              <ArrowRight className="h-3 w-3" />
            </Link>
          </SettingsSection>
        )}

        {/* -- QUICK LINKS -- */}
        <SettingsSection title="QUICK_LINKS">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'BILLING_&_PLAN', href: '/billing', desc: 'Manage subscription' },
              { label: 'INTEGRATIONS', href: '/integrations', desc: 'API keys & webhooks' },
              { label: 'HELP_CENTER', href: '/help', desc: 'Guides & tutorials' },
              { label: 'API_DOCS', href: '/docs', desc: 'Developer reference' },
              { label: 'SUPPORT', href: '/support', desc: 'Contact & FAQ' },
              { label: 'REFERRALS', href: '/referrals', desc: 'Invite & earn rewards' },
            ].map(({ label, href, desc }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between border border-zinc-800 px-3 py-2.5 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-zinc-400">{label}</p>
                  <p className="font-mono text-[10px] text-zinc-500">{desc}</p>
                </div>
                <ArrowRight className="h-3 w-3 text-zinc-400" />
              </Link>
            ))}
          </div>
        </SettingsSection>

        {/* -- DATA & ACCOUNT -- */}
        <SettingsSection title="DATA_&_ACCOUNT">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-zinc-400">EXPORT_DATA</p>
                <p className="font-mono text-[10px] text-zinc-500">Download all your data as JSON</p>
              </div>
              <button className="border border-zinc-800 px-4 py-2 font-mono text-[10px] tracking-widest text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200">
                [EXPORT]
              </button>
            </div>
            <div className="border-t border-zinc-900 pt-3 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-red-400">DELETE_ACCOUNT</p>
                <p className="font-mono text-[10px] text-zinc-500">Permanently delete your account and all data</p>
              </div>
              <button className="border border-red-900/50 px-4 py-2 font-mono text-[10px] tracking-widest text-red-400/70 transition hover:border-red-800 hover:bg-red-950/20 hover:text-red-400">
                [DELETE]
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* -- APP INFO -- */}
        <div className="mb-4 border border-dashed border-zinc-900 p-4 text-center">
          <p className="font-mono text-[9px] tracking-widest text-zinc-500">
            RESURGO v1.4.0 &middot; NEXT.JS 14 &middot; CONVEX &middot; CLERK
          </p>
          <p className="mt-1 font-mono text-[9px] text-zinc-400">
            <Link href="/changelog" className="hover:text-zinc-200 transition">View changelog</Link>
            {' · '}
            <Link href="/privacy" className="hover:text-zinc-200 transition">Privacy</Link>
            {' · '}
            <Link href="/terms" className="hover:text-zinc-200 transition">Terms</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
