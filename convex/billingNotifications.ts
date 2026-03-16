// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Billing Notifications
// Fires Discord alerts + Resend transactional emails on Dodo payment events.
// Called directly from convex/http.ts Dodo webhook handlers.
// ═══════════════════════════════════════════════════════════════════════════════

const DISCORD_ALERTS_URL = process.env.DISCORD_ALERTS_WEBHOOK_URL ?? '';
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Resurgo <noreply@resurgo.life>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://resurgo.life';

// ── Discord ───────────────────────────────────────────────────────────────────

interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: DiscordField[];
  footer?: { text: string };
  timestamp?: string;
}

async function sendDiscordEmbed(embed: DiscordEmbed): Promise<void> {
  if (!DISCORD_ALERTS_URL) return;
  try {
    await fetch(DISCORD_ALERTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Resurgo Payments',
        avatar_url: 'https://resurgo.life/icon.png',
        embeds: [
          {
            ...embed,
            footer: embed.footer ?? { text: 'Resurgo · resurgo.life' },
            timestamp: embed.timestamp ?? new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (err) {
    console.error('[billingNotifications] Discord send failed:', err);
  }
}

// ── Resend ────────────────────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.info(`[billingNotifications] RESEND_API_KEY not set — skipping email to ${opts.to}`);
    return;
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
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: 'support@resurgo.life',
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[billingNotifications] Resend ${res.status}:`, body);
    }
  } catch (err) {
    console.error('[billingNotifications] Resend send failed:', err);
  }
}

// ── Email template wrapper ────────────────────────────────────────────────────

function emailHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#0A0A0B;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:#E4E4E7}
  .wrap{max-width:520px;margin:0 auto;padding:32px 24px}
  .logo{font-size:18px;font-weight:800;color:#F97316;letter-spacing:.1em;padding-bottom:16px;border-bottom:1px solid #27272A;margin-bottom:24px}
  p{line-height:1.7;font-size:14px;color:#A1A1AA;margin:0 0 12px}
  h2{color:#FAFAFA;font-size:16px;margin:0 0 12px}
  .btn{display:inline-block;padding:12px 28px;background:#F97316;color:#000;font-weight:700;text-decoration:none;border-radius:4px;font-size:13px;letter-spacing:.05em;margin:16px 0}
  table.stats{width:100%;border-collapse:collapse;margin:16px 0}
  table.stats td{border:1px solid #27272A;padding:10px 14px;font-size:13px}
  table.stats td:first-child{color:#71717A}
  table.stats td:last-child{color:#FAFAFA;font-weight:600}
  .footer{border-top:1px solid #27272A;margin-top:32px;padding-top:16px;font-size:11px;color:#52525B;text-align:center}
  .footer a{color:#71717A}
</style></head>
<body><div class="wrap">
  <div class="logo">RESURGO</div>
  ${body}
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Resurgo · <a href="${SITE_URL}/privacy">Privacy</a> · <a href="${SITE_URL}/terms">Terms</a></p>
    <p>You received this because you have an account at <a href="${SITE_URL}">resurgo.life</a>. <a href="${SITE_URL}/settings">Manage emails</a></p>
  </div>
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC NOTIFICATION FUNCTIONS
// Called from convex/http.ts Dodo webhook handlers.
// All are fire-and-forget (no throws — billing logic must not fail due to notif)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Payment succeeded (one-time or first subscription payment) ────────────────

export async function notifyPaymentSucceeded(opts: {
  customerEmail: string;
  customerName: string;
  amountCents: number;
  currency: string;
  paymentId: string;
  plan: 'pro' | 'lifetime';
}): Promise<void> {
  const { customerEmail, customerName, amountCents, currency, paymentId, plan } = opts;
  const amount = `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const firstName = customerName.split(' ')[0] || 'there';
  const planLabel = plan === 'lifetime' ? '🔥 Lifetime' : '⚡ Pro';

  await Promise.all([
    // Discord
    sendDiscordEmbed({
      title: '💰 New Payment',
      color: 0xFFD700,
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Plan', value: planLabel, inline: true },
        { name: 'Amount', value: amount, inline: true },
        { name: 'Payment ID', value: paymentId, inline: false },
      ],
    }),

    // Resend — payment receipt
    sendEmail({
      to: customerEmail,
      subject: `Payment confirmed — ${planLabel} unlocked 🎉`,
      html: emailHtml(`
        <h2>Payment successful, ${firstName}! 🎉</h2>
        <p>Your <strong style="color:#F97316;">${planLabel}</strong> access is now active. Here's your receipt:</p>
        <table class="stats">
          <tr><td>Amount</td><td>${amount}</td></tr>
          <tr><td>Plan</td><td>${planLabel}</td></tr>
          <tr><td>Payment ID</td><td style="font-size:11px;">${paymentId}</td></tr>
        </table>
        <p>You now have full access to all Pro features including unlimited AI coaching, advanced analytics, and priority support.</p>
        <a href="${SITE_URL}/dashboard" class="btn">START BUILDING →</a>
        <p style="margin-top:16px;font-size:12px;color:#52525B;">Questions? Reply to this email or visit <a href="${SITE_URL}/support" style="color:#F97316;">resurgo.life/support</a></p>
      `),
      text: `Payment confirmed! Your ${planLabel} access is active. Amount: ${amount}. Payment ID: ${paymentId}. Start building: ${SITE_URL}/dashboard`,
    }),
  ]);
}

// ── Subscription activated ────────────────────────────────────────────────────

export async function notifySubscriptionActive(opts: {
  customerEmail: string;
  customerName: string;
  subscriptionId: string;
  amountCents: number;
  currency: string;
  interval: string;
  nextBillingDate?: string;
}): Promise<void> {
  const { customerEmail, customerName, subscriptionId, amountCents, currency, interval, nextBillingDate } = opts;
  const amount = `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const firstName = customerName.split(' ')[0] || 'there';
  const nextBilling = nextBillingDate
    ? new Date(nextBillingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  await Promise.all([
    // Discord
    sendDiscordEmbed({
      title: '📄 Subscription Activated',
      color: 0x2ECC71,
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Amount', value: `${amount}/${interval}`, inline: true },
        { name: 'Next Billing', value: nextBilling, inline: true },
        { name: 'Sub ID', value: subscriptionId, inline: false },
      ],
    }),

    // Resend — welcome email
    sendEmail({
      to: customerEmail,
      subject: `Welcome to Resurgo Pro, ${firstName}! Your subscription is active 🚀`,
      html: emailHtml(`
        <h2>You're in, ${firstName}! 🚀</h2>
        <p>Your <strong style="color:#F97316;">Resurgo Pro</strong> subscription is live. Here's what you unlocked:</p>
        <ul style="padding-left:20px;color:#A1A1AA;font-size:14px;line-height:2;">
          <li><strong style="color:#FAFAFA;">Unlimited AI Coaches</strong> — All 8 specialists, unlimited conversations</li>
          <li><strong style="color:#FAFAFA;">Advanced Analytics</strong> — Deep habit patterns & growth insights</li>
          <li><strong style="color:#FAFAFA;">Priority Features</strong> — Early access to every new feature</li>
          <li><strong style="color:#FAFAFA;">Goal Acceleration AI</strong> — Personalized daily action plans</li>
        </ul>
        <table class="stats" style="margin-top:20px;">
          <tr><td>Plan</td><td>Pro ${interval}</td></tr>
          <tr><td>Amount</td><td>${amount}/${interval}</td></tr>
          <tr><td>Next Billing</td><td>${nextBilling}</td></tr>
          <tr><td>Subscription ID</td><td style="font-size:11px;">${subscriptionId}</td></tr>
        </table>
        <a href="${SITE_URL}/dashboard" class="btn">OPEN YOUR DASHBOARD →</a>
        <p style="font-size:12px;color:#52525B;margin-top:8px;">Manage your subscription anytime at <a href="${SITE_URL}/billing" style="color:#F97316;">resurgo.life/billing</a></p>
      `),
      text: `Welcome to Pro, ${firstName}! Your subscription is active. ${amount}/${interval}. Next billing: ${nextBilling}. Open dashboard: ${SITE_URL}/dashboard`,
    }),
  ]);
}

// ── Subscription renewed ──────────────────────────────────────────────────────

export async function notifySubscriptionRenewed(opts: {
  customerEmail: string;
  customerName: string;
  amountCents: number;
  currency: string;
  interval: string;
  nextBillingDate?: string;
}): Promise<void> {
  const { customerEmail, customerName, amountCents, currency, interval, nextBillingDate } = opts;
  const amount = `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const firstName = customerName.split(' ')[0] || 'there';
  const nextBilling = nextBillingDate
    ? new Date(nextBillingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  await Promise.all([
    // Discord (lighter embed — renewals are routine)
    sendDiscordEmbed({
      title: '🔄 Subscription Renewed',
      color: 0x3498DB,
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Amount', value: amount, inline: true },
        { name: 'Next Billing', value: nextBilling, inline: true },
      ],
    }),

    // Resend — renewal receipt
    sendEmail({
      to: customerEmail,
      subject: `Your Resurgo Pro subscription renewed — receipt inside`,
      html: emailHtml(`
        <h2>Subscription renewed ✅</h2>
        <p>Hi ${firstName},</p>
        <p>Your Resurgo Pro subscription has been successfully renewed. No action needed—just keep building!</p>
        <table class="stats">
          <tr><td>Amount charged</td><td>${amount}</td></tr>
          <tr><td>Billing interval</td><td>${interval}</td></tr>
          <tr><td>Next renewal</td><td>${nextBilling}</td></tr>
        </table>
        <a href="${SITE_URL}/dashboard" class="btn">CONTINUE YOUR STREAK →</a>
        <p style="font-size:12px;color:#52525B;margin-top:8px;">To manage or cancel, visit <a href="${SITE_URL}/billing" style="color:#F97316;">resurgo.life/billing</a></p>
      `),
      text: `Your Resurgo Pro subscription renewed. Amount: ${amount}. Next renewal: ${nextBilling}. Continue: ${SITE_URL}/dashboard`,
    }),
  ]);
}

// ── Subscription cancelled ────────────────────────────────────────────────────

export async function notifySubscriptionCancelled(opts: {
  customerEmail: string;
  customerName: string;
  subscriptionId: string;
}): Promise<void> {
  const { customerEmail, customerName, subscriptionId } = opts;
  const firstName = customerName.split(' ')[0] || 'there';

  await Promise.all([
    // Discord
    sendDiscordEmbed({
      title: '⚠️ Subscription Cancelled',
      color: 0xF1C40F,
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Sub ID', value: subscriptionId, inline: true },
      ],
    }),

    // Resend — cancellation confirmation
    sendEmail({
      to: customerEmail,
      subject: `Your Resurgo Pro subscription has been cancelled`,
      html: emailHtml(`
        <h2>Subscription cancelled</h2>
        <p>Hi ${firstName},</p>
        <p>Your Resurgo Pro subscription has been cancelled. Your access continues until the end of your current billing period.</p>
        <p>After that, your account will switch to the <strong style="color:#FAFAFA;">Free plan</strong>. Your data, habits, and goals will remain intact.</p>
        <p style="margin-top:20px;"><strong style="color:#FAFAFA;">Changed your mind?</strong> You can resubscribe anytime:</p>
        <a href="${SITE_URL}/billing" class="btn">REACTIVATE PRO →</a>
        <p style="margin-top:16px;font-size:13px;color:#A1A1AA;">We'd love to hear what we could do better — reply to this email anytime.</p>
      `),
      text: `Your Resurgo Pro subscription has been cancelled. Access continues to end of billing period. Reactivate at: ${SITE_URL}/billing`,
    }),
  ]);
}

// ── Subscription on hold (payment failed, update required) ───────────────────

export async function notifySubscriptionOnHold(opts: {
  customerEmail: string;
  customerName: string;
  subscriptionId: string;
}): Promise<void> {
  const { customerEmail, customerName, subscriptionId } = opts;
  const firstName = customerName.split(' ')[0] || 'there';

  await Promise.all([
    // Discord
    sendDiscordEmbed({
      title: '🔴 Subscription On Hold',
      color: 0xE74C3C,
      description: 'Payment failed — customer needs to update payment method.',
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Sub ID', value: subscriptionId, inline: true },
      ],
    }),

    // Resend — dunning email
    sendEmail({
      to: customerEmail,
      subject: `⚠️ Action required: update your payment method`,
      html: emailHtml(`
        <h2>Your payment couldn't be processed</h2>
        <p>Hi ${firstName},</p>
        <p>We were unable to charge your payment method for your Resurgo Pro subscription. Your account is on hold.</p>
        <p><strong style="color:#F97316;">Action required:</strong> Please update your payment method to keep your Pro access.</p>
        <a href="${SITE_URL}/billing" class="btn">UPDATE PAYMENT METHOD →</a>
        <p style="margin-top:16px;font-size:13px;color:#A1A1AA;">If you need help, reply to this email and we'll sort it out immediately.</p>
        <p style="font-size:12px;color:#52525B;">Subscription ID: ${subscriptionId}</p>
      `),
      text: `Your Resurgo Pro payment failed. Please update your payment method at ${SITE_URL}/billing to keep Pro access.`,
    }),
  ]);
}

// ── Payment failed ────────────────────────────────────────────────────────────

export async function notifyPaymentFailed(opts: {
  customerEmail: string;
  customerName: string;
  amountCents: number;
  currency: string;
  paymentId: string;
  errorMessage?: string;
}): Promise<void> {
  const { customerEmail, customerName, amountCents, currency, paymentId, errorMessage } = opts;
  const amount = `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const firstName = customerName.split(' ')[0] || 'there';

  await Promise.all([
    // Discord
    sendDiscordEmbed({
      title: '❌ Payment Failed',
      color: 0xE74C3C,
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Amount', value: amount, inline: true },
        { name: 'Error', value: errorMessage ?? 'unknown', inline: false },
        { name: 'Payment ID', value: paymentId, inline: false },
      ],
    }),

    // Resend — payment failure
    sendEmail({
      to: customerEmail,
      subject: `Payment failed — action required`,
      html: emailHtml(`
        <h2>We couldn't process your payment</h2>
        <p>Hi ${firstName},</p>
        <p>Your payment of <strong>${amount}</strong> could not be processed.</p>
        ${errorMessage ? `<p style="color:#EF4444;font-size:13px;">Reason: ${errorMessage}</p>` : ''}
        <p>Please update your payment method to complete your purchase:</p>
        <a href="${SITE_URL}/billing" class="btn">UPDATE PAYMENT →</a>
        <p style="font-size:12px;color:#52525B;margin-top:12px;">Payment ID: ${paymentId}</p>
        <p style="font-size:13px;color:#A1A1AA;">Need help? Reply to this email — we respond within 24 hours.</p>
      `),
      text: `Payment of ${amount} failed. Please update your payment method: ${SITE_URL}/billing`,
    }),
  ]);
}

// ── Refund succeeded ──────────────────────────────────────────────────────────

export async function notifyRefundSucceeded(opts: {
  customerEmail: string;
  customerName: string;
  amountCents: number;
  currency: string;
  paymentId: string;
}): Promise<void> {
  const { customerEmail, customerName, amountCents, currency, paymentId } = opts;
  const amount = `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const firstName = customerName.split(' ')[0] || 'there';

  await Promise.all([
    // Discord
    sendDiscordEmbed({
      title: '↩️ Refund Issued',
      color: 0x95A5A6,
      fields: [
        { name: 'Customer', value: customerEmail, inline: true },
        { name: 'Amount', value: amount, inline: true },
        { name: 'Payment ID', value: paymentId, inline: false },
      ],
    }),

    // Resend — refund confirmation
    sendEmail({
      to: customerEmail,
      subject: `Refund processed — ${amount} on its way`,
      html: emailHtml(`
        <h2>Refund processed ✅</h2>
        <p>Hi ${firstName},</p>
        <p>We've processed a refund of <strong style="color:#FAFAFA;">${amount}</strong> to your original payment method.</p>
        <p>Refunds typically appear within 5–10 business days depending on your bank.</p>
        <table class="stats">
          <tr><td>Refund amount</td><td>${amount}</td></tr>
          <tr><td>Payment ID</td><td style="font-size:11px;">${paymentId}</td></tr>
        </table>
        <p style="margin-top:16px;font-size:13px;color:#A1A1AA;">If you didn't request this refund or have questions, reply to this email.</p>
      `),
      text: `Refund of ${amount} has been processed. Should appear within 5-10 business days. Payment ID: ${paymentId}`,
    }),
  ]);
}
