// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Push Notifications (Convex)
// Server-side FCM delivery + token management
// Replaces Telegram as the primary notification channel for native app users
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, internalAction, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

// ─────────────────────────────────────────────────────────────────────────────
// registerPushToken — Called from the native app after FCM registration
// Stores the device FCM token on the user record
// ─────────────────────────────────────────────────────────────────────────────
export const registerPushToken = mutation({
  args: {
    fcmToken: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!user) {
      console.warn('[pushNotifications] User not found for clerkId:', identity.subject);
      return null;
    }
    await ctx.db.patch(user._id, {
      fcmToken: args.fcmToken,
      fcmTokenUpdatedAt: Date.now(),
      pushEnabled: true,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// unregisterPushToken — Clears FCM token (e.g. sign-out on device)
// ─────────────────────────────────────────────────────────────────────────────
export const unregisterPushToken = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!user) return null;
    await ctx.db.patch(user._id, {
      fcmToken: undefined,
      pushEnabled: false,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUsersWithPush — Internal query: all users with an FCM token
// ─────────────────────────────────────────────────────────────────────────────
export const getUsersWithPush = internalQuery({
  args: {},
  returns: v.array(v.object({
    _id: v.id('users'),
    fcmToken: v.string(),
    name: v.string(),
    preferredTime: v.optional(v.string()),
    timezone: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('pushEnabled'), true))
      .collect();
    return users
      .filter((u) => u.fcmToken)
      .map((u) => ({
        _id: u._id,
        fcmToken: u.fcmToken!,
        name: u.name,
        preferredTime: u.preferredTime,
        timezone: u.timezone,
      }));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserFcmToken — Internal query: get a single user's FCM token by userId
// ─────────────────────────────────────────────────────────────────────────────
export const getUserFcmToken = internalQuery({
  args: { userId: v.id('users') },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.fcmToken) return null;
    return user.fcmToken;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// sendPushNotification — Internal action: sends a push via FCM HTTP v1 API
// Requires FIREBASE_SERVICE_ACCOUNT_JSON env var (stringified JSON)
// ─────────────────────────────────────────────────────────────────────────────
export const sendPushNotification = internalAction({
  args: {
    fcmToken: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.record(v.string(), v.string())),
  },
  returns: v.boolean(),
  handler: async (_ctx, args) => {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      console.warn('[FCM] FIREBASE_SERVICE_ACCOUNT_JSON not set — skipping push');
      return false;
    }

    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      const accessToken = await getAccessToken(serviceAccount);
      const projectId = serviceAccount.project_id;

      const message = {
        message: {
          token: args.fcmToken,
          notification: {
            title: args.title,
            body: args.body,
          },
          android: {
            priority: 'high' as const,
            notification: {
              sound: 'default',
              channel_id: args.data?.channel_id ?? 'resurgo_default',
              icon: 'ic_notification',
              color: '#14B899',
              click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
          },
          data: args.data ?? {},
        },
      };

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[FCM] Send failed (${response.status}):`, errorText);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[FCM] Error sending push:', err);
      return false;
    }
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// sendMorningDigestsPush — Internal action: sends morning digest to all FCM users
// Called by the cron alongside the Telegram version
// ─────────────────────────────────────────────────────────────────────────────
export const sendMorningDigestsPush = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      console.log('[FCM] FIREBASE_SERVICE_ACCOUNT_JSON not set — skipping push digests');
      return null;
    }

    const users = await ctx.runQuery(internal.pushNotifications.getUsersWithPush, {});

    for (const user of users) {
      try {
        const { api } = await import('./_generated/api');
        const summary = await ctx.runQuery(api.telegram.getUserSummary, { userId: user._id });

        const taskCount = summary.topTasks.length;
        const habitCount = summary.habitsToday.length;
        const completedHabits = summary.habitsToday.filter((h: { completedToday: boolean }) => h.completedToday).length;

        const body = [
          taskCount > 0 ? `📋 ${taskCount} tasks today` : '✨ No tasks — clean slate!',
          habitCount > 0 ? `🔥 ${completedHabits}/${habitCount} habits done` : '',
          summary.activeGoals.length > 0 ? `🎯 ${summary.activeGoals.length} active goals` : '',
        ].filter(Boolean).join(' • ');

        await ctx.runAction(internal.pushNotifications.sendPushNotification, {
          fcmToken: user.fcmToken,
          title: `☀️ Good morning, ${user.name.split(' ')[0]}!`,
          body,
          data: { type: 'morning_digest', route: '/dashboard' },
        });
      } catch (err) {
        console.error(`[FCM] Failed to send digest to user ${user._id}:`, err);
      }
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// deliverDueRemindersPush — Internal action: delivers reminders via FCM
// Called by the cron alongside the Telegram version
// ─────────────────────────────────────────────────────────────────────────────
export const deliverDueRemindersPush = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) return null;

    const { internal: internalApi } = await import('./_generated/api');
    const now = Date.now();
    const dueReminders = await ctx.runQuery(internalApi.reminders.getPendingReminders, {
      beforeTimestamp: now,
    });

    for (const reminder of dueReminders) {
      try {
        // Look up user's FCM token
        const fcmToken = await ctx.runQuery(
          internal.pushNotifications.getUserFcmToken,
          { userId: reminder.userId }
        );

        if (fcmToken) {
          await ctx.runAction(internal.pushNotifications.sendPushNotification, {
            fcmToken,
            title: '⏰ Reminder',
            body: reminder.text,
            data: { type: 'reminder', reminderId: reminder._id },
          });
        }

        // Also mark as sent (if not already handled by Telegram flow)
        // The Telegram action already marks it, but this is a safe no-op duplicate
      } catch (err) {
        console.error(`[FCM] Failed to deliver reminder ${reminder._id}:`, err);
      }
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// sendCoachingNudgePush — Sends an AI coaching nudge to a specific user
// Called from coachAI.ts after generating an insight
// ─────────────────────────────────────────────────────────────────────────────
export const sendCoachingNudgePush = internalAction({
  args: {
    userId: v.id('users'),
    title: v.string(),
    body: v.string(),
    route: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args): Promise<boolean> => {
    const fcmToken: string | null = await ctx.runQuery(
      internal.pushNotifications.getUserFcmToken,
      { userId: args.userId }
    );
    if (!fcmToken) return false;

    return ctx.runAction(internal.pushNotifications.sendPushNotification, {
      fcmToken,
      title: args.title,
      body: args.body,
      data: {
        type: 'coaching',
        route: args.route ?? '/dashboard/coach',
        channel_id: 'resurgo_coaching',
      },
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// sendStreakAlertPush — Warns user their streak is at risk
// Called from habits.ts when a streak is about to break
// ─────────────────────────────────────────────────────────────────────────────
export const sendStreakAlertPush = internalAction({
  args: {
    userId: v.id('users'),
    habitName: v.string(),
    currentStreak: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, args): Promise<boolean> => {
    const fcmToken: string | null = await ctx.runQuery(
      internal.pushNotifications.getUserFcmToken,
      { userId: args.userId }
    );
    if (!fcmToken) return false;

    return ctx.runAction(internal.pushNotifications.sendPushNotification, {
      fcmToken,
      title: `🔥 ${args.currentStreak}-day streak at risk!`,
      body: `Don't break your ${args.habitName} streak! Complete it before midnight to keep your momentum.`,
      data: {
        type: 'streak_alert',
        route: '/dashboard/habits',
        channel_id: 'resurgo_reminders',
      },
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// sendAchievementPush — Celebrates XP milestones, level ups, and badges
// Called from gamification.ts when a milestone is reached
// ─────────────────────────────────────────────────────────────────────────────
export const sendAchievementPush = internalAction({
  args: {
    userId: v.id('users'),
    title: v.string(),
    body: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args): Promise<boolean> => {
    const fcmToken: string | null = await ctx.runQuery(
      internal.pushNotifications.getUserFcmToken,
      { userId: args.userId }
    );
    if (!fcmToken) return false;

    return ctx.runAction(internal.pushNotifications.sendPushNotification, {
      fcmToken,
      title: args.title,
      body: args.body,
      data: {
        type: 'achievement',
        route: '/dashboard/achievements',
        channel_id: 'resurgo_achievements',
      },
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// sendGoalMilestonePush — Notifies when a goal milestone is completed
// ─────────────────────────────────────────────────────────────────────────────
export const sendGoalMilestonePush = internalAction({
  args: {
    userId: v.id('users'),
    goalName: v.string(),
    milestoneName: v.string(),
    progressPercent: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, args): Promise<boolean> => {
    const fcmToken: string | null = await ctx.runQuery(
      internal.pushNotifications.getUserFcmToken,
      { userId: args.userId }
    );
    if (!fcmToken) return false;

    const emoji = args.progressPercent >= 100 ? '🏆' : '🎯';
    const title = args.progressPercent >= 100
      ? `${emoji} Goal Complete: ${args.goalName}!`
      : `${emoji} Milestone: ${args.milestoneName}`;
    const body = args.progressPercent >= 100
      ? `Congratulations! You've completed "${args.goalName}". What an achievement!`
      : `${args.progressPercent}% done with "${args.goalName}". Keep going!`;

    return ctx.runAction(internal.pushNotifications.sendPushNotification, {
      fcmToken,
      title,
      body,
      data: {
        type: 'goal_milestone',
        route: '/dashboard/goals',
        channel_id: 'resurgo_achievements',
      },
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// FCM OAuth2 Token Generation
// Uses a service account to generate a short-lived OAuth2 access token for
// the FCM HTTP v1 API. This avoids needing the deprecated server key.
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
}

// Simple JWT creation using Web Crypto API (no external dependencies)
async function getAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: serviceAccount.token_uri,
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const unsigned = `${headerB64}.${payloadB64}`;

  // Import the RSA private key
  const pemContents = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsigned)
  );
  const signatureB64 = base64url(
    Array.from(new Uint8Array(signature)).map((b) => String.fromCharCode(b)).join('')
  );

  const jwt = `${unsigned}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    throw new Error(`Token exchange failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

function base64url(str: string): string {
  const b64 = btoa(str);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
