import Link from 'next/link';
import { sanitizePaymentParams } from '@/lib/payment-params';
import PaymentSuccessAnalytics from '@/components/PaymentSuccessAnalytics';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const COACH_COLORS: Record<string, string> = {
  MARCUS: 'bg-yellow-500',
  TITAN: 'bg-red-500',
  AURORA: 'bg-purple-500',
  PHOENIX: 'bg-orange-500',
  NEXUS: 'bg-pink-500',
};

const COACH_STYLES: Record<string, string> = {
  MARCUS: 'Stoic Strategist',
  TITAN: 'Physical Performance',
  AURORA: 'Mindful Catalyst',
  PHOENIX: 'Comeback Specialist',
  NEXUS: 'Integration Engine',
};

function getPlanInfo(plan: string | undefined) {
  const isLifetime = plan === 'lifetime';
  const isPro = plan === 'pro_monthly' || plan === 'pro_yearly';

  if (isLifetime) {
    return {
      badge: 'LIFETIME',
      label: 'Lifetime Access',
      description: 'One payment. Every feature. Forever.',
      coaches: ['MARCUS', 'TITAN', 'AURORA', 'PHOENIX', 'NEXUS'],
      features: [
        'Unlimited goals, habits, and coach messages',
        'All 5 AI coaches — fully unlocked',
        'Advanced analytics and weekly AI reviews',
        'Telegram bot and proactive coaching',
        'All future updates — no extra cost',
        'Founding member badge',
      ],
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-900/50',
      bgColor: 'bg-amber-950/15',
    };
  }

  if (isPro) {
    return {
      badge: plan === 'pro_yearly' ? 'PRO YEARLY' : 'PRO MONTHLY',
      label: plan === 'pro_yearly' ? 'Pro Yearly' : 'Pro Monthly',
      description: plan === 'pro_yearly' ? 'Annual plan. Best value.' : 'Monthly plan. Cancel anytime.',
      coaches: ['MARCUS', 'TITAN', 'AURORA', 'PHOENIX', 'NEXUS'],
      features: [
        'Unlimited goals, habits, and coach messages',
        'All 5 AI coaches — fully unlocked',
        'Advanced analytics and weekly AI reviews',
        'Telegram bot and proactive coaching',
        'Priority support',
      ],
      accentColor: 'text-orange-400',
      borderColor: 'border-orange-900/50',
      bgColor: 'bg-orange-950/15',
    };
  }

  return {
    badge: 'PLAN',
    label: plan ?? 'Access Updated',
    description: 'Your plan access has been updated.',
    coaches: ['MARCUS', 'TITAN'],
    features: [],
    accentColor: 'text-zinc-300',
    borderColor: 'border-zinc-800',
    bgColor: 'bg-zinc-900/30',
  };
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = sanitizePaymentParams(await searchParams);
  const info = getPlanInfo(params.plan);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <PaymentSuccessAnalytics plan={params.plan ?? undefined} />

      {/* Terminal header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-orange-600 bg-orange-950/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-pixel text-[0.37rem] tracking-widest text-orange-500">PAYMENT_CONFIRMED</p>
          {params.sessionId && (
            <p className="font-pixel text-[0.32rem] tracking-widest text-zinc-600 mt-0.5">
              REF: {params.sessionId.slice(0, 24)}…
            </p>
          )}
        </div>
      </div>

      {/* Plan active block */}
      <div className={`border ${info.borderColor} ${info.bgColor} p-5 mb-6`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-pixel text-[0.37rem] tracking-widest text-zinc-500">PLAN_ACTIVE</span>
          <span className={`font-pixel text-[0.37rem] tracking-widest ${info.accentColor} border ${info.borderColor} px-2 py-0.5`}>
            {info.badge}
          </span>
        </div>
        <h1 className={`font-sans text-2xl font-bold ${info.accentColor} mt-1`}>{info.label}</h1>
        <p className="font-terminal text-sm text-zinc-400 mt-1">{info.description}</p>
        <p className="font-terminal text-xs text-zinc-600 mt-3">
          Access may take a moment to reflect. Refresh your dashboard if features are not yet visible.
        </p>
      </div>

      {/* Coaches unlocked */}
      <div className="border border-zinc-800 bg-zinc-950/50 p-5 mb-6">
        <p className="font-pixel text-[0.37rem] tracking-widest text-zinc-500 mb-4">COACHES_UNLOCKED</p>
        <div className="space-y-2.5">
          {info.coaches.map((coach) => (
            <div key={coach} className="flex items-center gap-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${COACH_COLORS[coach] ?? 'bg-zinc-500'}`} />
              <span className="font-terminal text-sm font-medium text-zinc-200">{coach}</span>
              <span className="font-terminal text-xs text-zinc-500">— {COACH_STYLES[coach]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features unlocked */}
      {info.features.length > 0 && (
        <div className="border border-zinc-800 bg-zinc-950/50 p-5 mb-8">
          <p className="font-pixel text-[0.37rem] tracking-widest text-zinc-500 mb-4">FEATURES_ACTIVE</p>
          <ul className="space-y-2">
            {info.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 bg-orange-500" />
                <span className="font-terminal text-sm text-zinc-300">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="flex-1 border-2 border-orange-600 bg-orange-600 px-5 py-3 text-center font-pixel text-[0.42rem] tracking-widest text-black transition hover:bg-orange-500 active:translate-x-[1px] active:translate-y-[1px]"
        >
          OPEN DASHBOARD
        </Link>
        <Link
          href="/coach"
          className="flex-1 border-2 border-zinc-700 px-5 py-3 text-center font-pixel text-[0.42rem] tracking-widest text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
        >
          MEET YOUR COACHES
        </Link>
      </div>

      <div className="mt-5 flex justify-center">
        <Link href="/billing" className="font-terminal text-xs text-zinc-600 underline-offset-2 hover:text-zinc-400 hover:underline">
          View billing details
        </Link>
      </div>
    </main>
  );
}
