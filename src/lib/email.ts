// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Email Service (Resend)
// Lightweight transactional email via Resend.com (free tier: 100 emails/day).
// Set RESEND_API_KEY in your environment variables.
//
// Usage:
//   import { sendEmail, sendWelcomeEmail } from '@/lib/email';
//   await sendWelcomeEmail('user@example.com', 'Alex');
// ═══════════════════════════════════════════════════════════════════════════════

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Resurgo <noreply@resurgo.life>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resurgo.life';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Send a transactional email via Resend.
 * Returns silently (no throw) if RESEND_API_KEY is missing — allows dev mode to work.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Email] RESEND_API_KEY not set — skipping email to ${opts.to}: "${opts.subject}"`);
    }
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: opts.replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Email] Resend API error ${res.status}:`, body);
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('[Email] Failed to send:', err);
    return { ok: false, error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRE-BUILT TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#0A0A0B; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; color:#E4E4E7; }
  .container { max-width:560px; margin:0 auto; padding:32px 24px; }
  .header { border-bottom:1px solid #27272A; padding-bottom:16px; margin-bottom:24px; }
  .logo { font-size:18px; font-weight:800; color:#F97316; letter-spacing:0.1em; }
  .content { line-height:1.7; font-size:14px; color:#A1A1AA; }
  .content h2 { color:#FAFAFA; font-size:16px; margin:0 0 8px; }
  .btn { display:inline-block; padding:12px 28px; background:#F97316; color:#000; font-weight:700; text-decoration:none; border-radius:4px; font-size:13px; letter-spacing:0.05em; margin:16px 0; }
  .footer { border-top:1px solid #27272A; margin-top:32px; padding-top:16px; font-size:11px; color:#52525B; text-align:center; }
  .footer a { color:#71717A; }
</style></head>
<body><div class="container">
  <div class="header"><span class="logo">RESURGO</span></div>
  <div class="content">${content}</div>
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Resurgo &middot; <a href="${SITE_URL}/privacy">Privacy</a> &middot; <a href="${SITE_URL}/terms">Terms</a></p>
    <p>You received this because you signed up at <a href="${SITE_URL}">resurgo.life</a></p>
  </div>
</div></body></html>`;
}

/** Welcome email — sent after onboarding completion */
export async function sendWelcomeEmail(to: string, name: string): Promise<SendEmailResult> {
  const firstName = name.split(' ')[0] || 'there';
  return sendEmail({
    to,
    subject: `Welcome to Resurgo, ${firstName} 🚀`,
    html: baseTemplate(`
      <h2>Welcome aboard, ${firstName}!</h2>
      <p>You just joined a system designed to turn big goals into daily wins.</p>
      <p>Here's how to get the most out of Resurgo in your first week:</p>
      <ul style="padding-left:20px;">
        <li><strong>Set 1-3 core habits</strong> — start small, stay consistent.</li>
        <li><strong>Talk to your AI Coach</strong> — type /plan to get a custom action plan.</li>
        <li><strong>Check in daily</strong> — morning check-ins take 30 seconds.</li>
        <li><strong>Hit a 7-day streak</strong> — your first milestone unlocks new features.</li>
      </ul>
      <a href="${SITE_URL}/dashboard" class="btn">OPEN DASHBOARD →</a>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">Questions? Reply to this email or visit <a href="${SITE_URL}/help" style="color:#F97316;">resurgo.life/help</a></p>
    `),
    text: `Welcome to Resurgo, ${firstName}! Open your dashboard: ${SITE_URL}/dashboard`,
    replyTo: 'support@resurgo.life',
  });
}

/** Weekly streak summary — triggered via Convex cron */
export async function sendStreakSummary(to: string, name: string, data: {
  currentStreak: number;
  habitsCompleted: number;
  totalXp: number;
  level: number;
}): Promise<SendEmailResult> {
  const firstName = name.split(' ')[0] || 'there';
  return sendEmail({
    to,
    subject: `${firstName}, your week in review — ${data.currentStreak} day streak 🔥`,
    html: baseTemplate(`
      <h2>Your Weekly Recap</h2>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:8px 0; border-bottom:1px solid #27272A; color:#A1A1AA;">Current Streak</td><td style="padding:8px 0; border-bottom:1px solid #27272A; color:#F97316; font-weight:700; text-align:right;">${data.currentStreak} days 🔥</td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #27272A; color:#A1A1AA;">Habits Completed</td><td style="padding:8px 0; border-bottom:1px solid #27272A; color:#FAFAFA; font-weight:700; text-align:right;">${data.habitsCompleted}</td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #27272A; color:#A1A1AA;">XP Earned</td><td style="padding:8px 0; border-bottom:1px solid #27272A; color:#10B981; font-weight:700; text-align:right;">+${data.totalXp} XP</td></tr>
        <tr><td style="padding:8px 0; color:#A1A1AA;">Level</td><td style="padding:8px 0; color:#8B5CF6; font-weight:700; text-align:right;">LVL ${data.level}</td></tr>
      </table>
      <p>Keep the momentum going — consistency beats intensity.</p>
      <a href="${SITE_URL}/dashboard" class="btn">VIEW FULL ANALYTICS →</a>
    `),
    text: `Your week: ${data.currentStreak}-day streak, ${data.habitsCompleted} habits completed, +${data.totalXp} XP, Level ${data.level}. Keep going! ${SITE_URL}/dashboard`,
  });
}

/** Streak at risk — sent when user misses a day */
export async function sendStreakAtRisk(to: string, name: string, streak: number): Promise<SendEmailResult> {
  const firstName = name.split(' ')[0] || 'there';
  return sendEmail({
    to,
    subject: `⚠️ ${firstName}, your ${streak}-day streak is at risk`,
    html: baseTemplate(`
      <h2>Your streak needs you</h2>
      <p>You have a <strong style="color:#F97316;">${streak}-day streak</strong> — don't let it break.</p>
      <p>Even completing one small habit counts. It takes less than 60 seconds.</p>
      <a href="${SITE_URL}/dashboard" class="btn">CHECK IN NOW →</a>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">You can disable these reminders in <a href="${SITE_URL}/settings" style="color:#F97316;">Settings</a>.</p>
    `),
    text: `Your ${streak}-day streak is at risk! Check in: ${SITE_URL}/dashboard`,
  });
}
