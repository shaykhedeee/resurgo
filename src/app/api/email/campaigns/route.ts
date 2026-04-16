// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Email Marketing Campaign System via Resend
// POST: send a campaign or transactional email
// GET:  list available campaign templates
// Env: RESEND_API_KEY (already set), RESEND_FROM_MARKETING=marketing@resurgo.life
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/** Constant-time string comparison to prevent timing attacks */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_MARKETING = process.env.RESEND_FROM_MARKETING || 'Resurgo <marketing@resurgo.life>';
const FROM_SUPPORT = process.env.RESEND_FROM_SUPPORT || 'Resurgo <support@resurgo.life>';
const FROM_NOREPLY = process.env.RESEND_FROM_EMAIL || 'Resurgo <noreply@resurgo.life>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resurgo.life';

// ─── HTML Email Templates ────────────────────────────────────────────────────

const BASE_STYLES = `
  body { margin:0; padding:0; background:#050505; font-family: 'Courier New', Courier, monospace; }
  .wrap { max-width:600px; margin:0 auto; background:#0a0a0a; border:1px solid #1a1a1a; }
  .header { background:#0d0d0d; border-bottom:2px solid #FF6B35; padding:24px 32px; }
  .logo { font-size:22px; font-weight:bold; color:#FF6B35; letter-spacing:4px; }
  .tagline { font-size:10px; color:#555; letter-spacing:3px; margin-top:4px; }
  .body { padding:32px; }
  .h1 { font-size:20px; color:#fff; margin:0 0 16px; letter-spacing:1px; }
  .p { font-size:13px; color:#aaa; line-height:1.7; margin:0 0 16px; }
  .cta { display:inline-block; background:#FF6B35; color:#000; font-weight:bold;
         font-size:12px; letter-spacing:3px; padding:14px 28px; text-decoration:none;
         margin:8px 0 24px; }
  .divider { border:none; border-top:1px solid #1a1a1a; margin:24px 0; }
  .stat { display:inline-block; background:#111; border:1px solid #222; padding:12px 20px;
          margin:4px; text-align:center; }
  .stat-num { font-size:24px; color:#FF6B35; font-weight:bold; }
  .stat-label { font-size:9px; color:#555; letter-spacing:2px; margin-top:4px; display:block; }
  .footer { background:#070707; border-top:1px solid #1a1a1a; padding:20px 32px;
            font-size:10px; color:#333; }
  .badge { display:inline-block; background:#FF6B35; color:#000; font-size:8px;
           letter-spacing:2px; padding:3px 8px; font-weight:bold; margin:0 4px; }
`;

function wrapEmail(headerBadge: string, subject: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">RESURGO</div>
    <div class="tagline">LIFE OPERATING SYSTEM <span class="badge">${headerBadge}</span></div>
  </div>
  <div class="body">
    ${bodyContent}
  </div>
  <div class="footer">
    You're receiving this because you signed up at resurgo.life<br>
    <a href="${SITE_URL}/settings" style="color:#FF6B35;">Manage email preferences</a> &nbsp;|&nbsp;
    <a href="${SITE_URL}/unsubscribe?email={{email}}" style="color:#555;">Unsubscribe</a><br><br>
    Resurgo Life OS · resurgo.life · support@resurgo.life
  </div>
</div>
</body>
</html>`;
}

// ─── Template Definitions ─────────────────────────────────────────────────────

const TEMPLATES: Record<string, {
  subject: string;
  from: string;
  badge: string;
  html: (vars: Record<string, string>) => string;
  text: (vars: Record<string, string>) => string;
}> = {
  welcome: {
    subject: 'Welcome to Resurgo — Your Life OS is Online',
    from: FROM_NOREPLY,
    badge: 'WELCOME',
    html: (v) => wrapEmail('WELCOME', 'Welcome to Resurgo', `
      <div class="h1">&gt; SYSTEM ONLINE, ${v.name || 'OPERATOR'}</div>
      <p class="p">Your Resurgo account is active. You now have access to one of the most powerful AI life operating systems ever built.</p>
      <p class="p">Your free plan includes:</p>
      <ul style="color:#aaa; font-size:13px; line-height:2; padding-left:20px;">
        <li>2 AI life coaches (MARCUS + TITAN) — available 24/7</li>
        <li>Goal tracker with AI decomposition</li>
        <li>Habit tracker with streak system</li>
        <li>Daily check-in protocol</li>
        <li>Smart task management</li>
      </ul>
      <hr class="divider">
      <p class="p">The fastest way to see results: complete your first <strong style="color:#FF6B35;">Deep Scan</strong> — a psychological assessment that builds your personal AI profile.</p>
      <a href="${SITE_URL}/dashboard" class="cta">[ENTER_DASHBOARD]</a>
      <p class="p" style="font-size:11px; color:#555;">Reply to this email anytime — support@resurgo.life responds within 24 hours.</p>
    `),
    text: (v) => `Welcome to Resurgo, ${v.name || 'Operator'}.\n\nYour account is active. Visit ${SITE_URL}/dashboard to start.\n\nSupport: support@resurgo.life`,
  },

  streak_milestone: {
    subject: '🔥 {{streak}}-Day Streak — The Discipline Matrix Recognizes You',
    from: FROM_NOREPLY,
    badge: 'ACHIEVEMENT',
    html: (v) => wrapEmail('ACHIEVEMENT', 'Streak Milestone', `
      <div class="h1">🔥 ${v.streak}-DAY STREAK ACHIEVED</div>
      <p class="p">OPERATOR ${v.name || ''},</p>
      <p class="p">You've maintained your ${v.habitName || 'habit'} streak for <strong style="color:#FF6B35;">${v.streak} consecutive days</strong>. This is not a coincidence — it's a signal.</p>
      <div style="text-align:center; margin:24px 0;">
        <div class="stat"><div class="stat-num">${v.streak}</div><span class="stat-label">DAY STREAK</span></div>
        <div class="stat"><div class="stat-num">${v.xp || '+'+ (parseInt(v.streak) * 10)}</div><span class="stat-label">XP EARNED</span></div>
      </div>
      <p class="p">At this rate, this habit becomes automatic in approximately ${Math.max(1, 66 - parseInt(v.streak))} more days. That's when it stops being a discipline and becomes an identity.</p>
      <a href="${SITE_URL}/dashboard/habits" class="cta">[VIEW_PROGRESS]</a>
    `),
    text: (v) => `${v.streak}-day streak on ${v.habitName}. Keep going — ${SITE_URL}/dashboard/habits`,
  },

  weekly_digest: {
    subject: 'RESURGO :: WEEKLY_REPORT — Your Progress Data',
    from: FROM_NOREPLY,
    badge: 'WEEKLY REPORT',
    html: (v) => wrapEmail('WEEKLY REPORT', 'Weekly Progress Report', `
      <div class="h1">WEEKLY_REPORT :: ${v.weekDates || 'This Week'}</div>
      <p class="p">OPERATOR ${v.name || ''},</p>
      <p class="p">Your Resurgo performance data for the week:</p>
      <div style="margin:16px 0;">
        <div class="stat"><div class="stat-num">${v.habitsCompleted || 0}</div><span class="stat-label">HABITS DONE</span></div>
        <div class="stat"><div class="stat-num">${v.goalsProgress || 0}%</div><span class="stat-label">GOAL PROGRESS</span></div>
        <div class="stat"><div class="stat-num">${v.tasksCompleted || 0}</div><span class="stat-label">TASKS CLOSED</span></div>
        <div class="stat"><div class="stat-num">${v.xpEarned || 0}</div><span class="stat-label">XP EARNED</span></div>
      </div>
      <hr class="divider">
      <p class="p"><strong style="color:#FF6B35;">Next week's focus:</strong> ${v.nextFocus || 'Continue building momentum. Small consistent actions compound into massive results.'}</p>
      <a href="${SITE_URL}/dashboard" class="cta">[REVIEW_DASHBOARD]</a>
    `),
    text: (v) => `Weekly Report for ${v.name}.\nHabits: ${v.habitsCompleted}, Goals: ${v.goalsProgress}%, Tasks: ${v.tasksCompleted}\nSee full report: ${SITE_URL}/dashboard`,
  },

  reengagement: {
    subject: 'RESURGO :: OPERATOR_OFFLINE — Your system is waiting',
    from: FROM_MARKETING,
    badge: 'RE-ENGAGE',
    html: (v) => wrapEmail('SIGNAL LOST', 'We miss you', `
      <div class="h1">&gt; OPERATOR_OFFLINE :: ${v.daysSince || '7'} DAYS</div>
      <p class="p">OPERATOR ${v.name || ''},</p>
      <p class="p">Your Resurgo system has been running in standby for <strong style="color:#FF6B35;">${v.daysSince || '7'} days</strong>.</p>
      <p class="p">Your goals haven't changed. Your habits are waiting. Your AI coaches have been standing by.</p>
      <p class="p">Coming back is the hardest step. Everything you need to pick up exactly where you left off is still there — no judgment, no restarting from zero.</p>
      <a href="${SITE_URL}/dashboard" class="cta">[RESUME_MISSION]</a>
      <hr class="divider">
      <p class="p" style="font-size:11px; color:#555;">PHOENIX, the comeback specialist coach, is available to help you rebuild momentum. Just open the app and start a conversation.</p>
    `),
    text: (v) => `OPERATOR ${v.name}, your Resurgo system is waiting. Come back: ${SITE_URL}/dashboard`,
  },

  upgrade_nudge: {
    subject: 'Unlock 3 More AI Coaches + Advanced Features',
    from: FROM_MARKETING,
    badge: 'PRO',
    html: (v) => wrapEmail('UPGRADE', 'Upgrade to Pro', `
      <div class="h1">UPGRADE_AVAILABLE :: TIER_PRO</div>
      <p class="p">OPERATOR ${v.name || ''},</p>
      <p class="p">You've been using Resurgo for ${v.daysActive || 'a while'}. You've seen what's possible with the basics.</p>
      <p class="p">Here's what unlocking Pro gives you:</p>
      <ul style="color:#aaa; font-size:13px; line-height:2; padding-left:20px;">
        <li>All 5 AI coaches (MARCUS + TITAN + AURORA + PHOENIX + NEXUS)</li>
        <li>Unlimited habit tracking</li>
        <li>Advanced goal analytics</li>
        <li>Vision board with AI insights</li>
        <li>Priority AI response speed</li>
      </ul>
      <p class="p" style="color:#FF6B35; font-size:15px;">Yearly plan: $29.99/year = $2.50/month</p>
      <a href="${SITE_URL}/pricing" class="cta">[UPGRADE_NOW]</a>
    `),
    text: (_v) => `Upgrade to Resurgo Pro — unlock all 5 AI coaches: ${SITE_URL}/pricing`,
  },
};

// ─── Resend API Call ──────────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: opts.from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      reply_to: opts.replyTo || 'support@resurgo.life',
      tags: opts.tags || [],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Resend API error');
  return data;
}

// ─── Route Handlers ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const adminSecret = request.headers.get('x-admin-secret');
  const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
  if (!ADMIN_SECRET || !adminSecret || !timingSafeCompare(adminSecret, ADMIN_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const templateList = Object.entries(TEMPLATES).map(([id, t]) => ({
    id,
    subject: t.subject,
    from: t.from,
    badge: t.badge,
    description: `Email template: ${id}`,
  }));
  return NextResponse.json({
    configured: !!RESEND_API_KEY,
    from: { marketing: FROM_MARKETING, support: FROM_SUPPORT, noreply: FROM_NOREPLY },
    templates: templateList,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Admin auth required for all sends (prevents open relay abuse)
    const adminSecret = request.headers.get('x-admin-secret');
    const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
    if (!ADMIN_SECRET || !adminSecret || !timingSafeCompare(adminSecret, ADMIN_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized. x-admin-secret header required.' }, { status: 401 });
    }
    const isAdmin = true;

    const body = await request.json();
    const { type, to, vars = {}, batchRecipients } = body;

    if (!type || !TEMPLATES[type]) {
      return NextResponse.json({ error: `Unknown template: ${type}. Use: ${Object.keys(TEMPLATES).join(', ')}` }, { status: 400 });
    }

    const template = TEMPLATES[type];
    const subject = template.subject.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] || '');

    // Batch send (admin only)
    if (batchRecipients && isAdmin) {
      const results = [];
      for (const recipient of batchRecipients.slice(0, 50)) { // rate limit protection
        const recipientVars = { ...vars, ...recipient.vars, name: recipient.name || vars.name };
        try {
          const result = await sendEmail({
            to: recipient.email,
            subject,
            html: template.html(recipientVars),
            text: template.text(recipientVars),
            from: template.from,
            tags: [{ name: 'campaign', value: type }],
          });
          results.push({ email: recipient.email, success: true, id: result.id });
        } catch (err) {
          results.push({ email: recipient.email, success: false, error: String(err) });
        }
        // Rate limit: 2 req/s safe for Resend free tier
        await new Promise(r => setTimeout(r, 500));
      }
      return NextResponse.json({ success: true, batchResults: results, sent: results.filter(r => r.success).length });
    }

    // Single send
    if (!to) {
      return NextResponse.json({ error: 'Required: to (email address) or batchRecipients array' }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject,
      html: template.html(vars),
      text: template.text(vars),
      from: template.from,
      tags: [{ name: 'campaign', value: type }],
    });

    return NextResponse.json({ success: true, emailId: result.id, template: type, to });
  } catch (err) {
    console.error('[email/campaigns]', err);
    return NextResponse.json({ error: 'Email send failed', details: String(err) }, { status: 500 });
  }
}
