'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { Activity, ArrowRight, Battery, CheckCircle2, FlaskConical, HeartPulse, Moon, Pill } from 'lucide-react';

import { api } from '../../../../convex/_generated/api';

function formatSleep(minutes?: number) {
  if (!minutes) return '0h 00m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${String(mins).padStart(2, '0')}m`;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function HealthPage() {
  const sleepStats = useQuery(api.sleep.getSleepStats, { days: 14 });
  const sleepLogs = useQuery(api.sleep.listSleepLogs, { days: 7 });
  const todayCheckIn = useQuery(api.dailyCheckIns.getToday, {});

  const sleepScore = sleepStats?.avgQuality ? (sleepStats.avgQuality / 5) * 100 : 0;
  const energyScore = todayCheckIn?.morningEnergy ? (todayCheckIn.morningEnergy / 5) * 100 : 0;
  const recoveryScore = clampScore((sleepScore * 0.6) + (energyScore * 0.4));
  const recoveryLabel = recoveryScore >= 80 ? 'Ready' : recoveryScore >= 55 ? 'Steady' : recoveryScore > 0 ? 'Protect' : 'No data';

  const stats = [
    {
      label: '14D AVG SLEEP',
      value: formatSleep(sleepStats?.avgDurationMinutes),
      detail: `${sleepStats?.totalLogs ?? 0} logs`,
      Icon: Moon,
      tone: 'text-blue-300',
    },
    {
      label: 'SLEEP QUALITY',
      value: sleepStats?.avgQuality ? `${sleepStats.avgQuality}/5` : '0/5',
      detail: sleepStats?.bestQualityDate ? `best ${sleepStats.bestQualityDate}` : 'awaiting logs',
      Icon: HeartPulse,
      tone: 'text-emerald-300',
    },
    {
      label: 'ENERGY TODAY',
      value: todayCheckIn?.morningEnergy ? `${todayCheckIn.morningEnergy}/5` : 'not set',
      detail: todayCheckIn?.morningCompletedAt ? 'morning check-in done' : 'check-in pending',
      Icon: Battery,
      tone: 'text-yellow-300',
    },
    {
      label: 'RECOVERY',
      value: `${recoveryScore}%`,
      detail: recoveryLabel,
      Icon: Activity,
      tone: 'text-orange-300',
    },
  ];

  const actions = [
    {
      href: '/wellness',
      label: 'Sleep, Mood, Journal',
      detail: 'Log sleep quality, energy, gratitude, and recovery notes.',
      Icon: Moon,
    },
    {
      href: '/food',
      label: 'Nutrition + Water',
      detail: 'Track calories, macros, hydration, and meal consistency.',
      Icon: FlaskConical,
    },
    {
      href: '/fitness',
      label: 'Training Recovery',
      detail: 'Balance strength, cardio, steps, and lower-intensity days.',
      Icon: HeartPulse,
    },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">BODY :: HEALTH_CORE</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Health</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-500">
              Sleep tracker / Energy levels / Supplements / Blood markers / Recovery score
            </p>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          {stats.map(({ label, value, detail, Icon, tone }) => (
            <div key={label} className="border border-zinc-900 bg-zinc-950 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] tracking-widest text-zinc-500">{label}</span>
                <Icon className={`h-4 w-4 ${tone}`} />
              </div>
              <p className="font-mono text-2xl font-bold text-zinc-100">{value}</p>
              <p className="mt-1 font-mono text-[10px] tracking-wider text-zinc-500">{detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">RECOVERY_TIMELINE</span>
            </div>
            <div className="divide-y divide-zinc-900">
              {sleepLogs && sleepLogs.length > 0 ? (
                sleepLogs.map((log: any) => (
                  <div key={log._id} className="grid gap-2 px-4 py-3 sm:grid-cols-[120px_1fr_100px] sm:items-center">
                    <p className="font-mono text-xs text-zinc-400">{log.date}</p>
                    <div className="h-2 bg-zinc-900">
                      <div
                        className="h-full bg-orange-600"
                        style={{ width: `${Math.min(100, Math.round(((log.durationMinutes ?? 0) / 540) * 100))}%` }}
                      />
                    </div>
                    <p className="font-mono text-xs text-zinc-300 sm:text-right">
                      {formatSleep(log.durationMinutes)} / {log.quality ?? 0}/5
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <Moon className="mx-auto mb-3 h-6 w-6 text-zinc-600" />
                  <p className="font-mono text-xs tracking-widest text-zinc-500">NO_SLEEP_LOGS_YET</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">NEXT_ACTIONS</span>
              </div>
              <div className="divide-y divide-zinc-900">
                {actions.map(({ href, label, detail, Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-900/60">
                    <Icon className="h-4 w-4 shrink-0 text-orange-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-xs font-bold tracking-widest text-zinc-200">{label}</span>
                      <span className="block font-mono text-[10px] leading-relaxed text-zinc-500">{detail}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-violet-300" />
                  <p className="font-mono text-xs font-bold tracking-widest text-zinc-200">SUPPLEMENTS</p>
                </div>
                <p className="font-mono text-[10px] leading-relaxed text-zinc-500">
                  Optional tracker slot. Keep dosage, timing, and adherence here when supplement logging is enabled.
                </p>
              </div>
              <div className="border border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <p className="font-mono text-xs font-bold tracking-widest text-zinc-200">BLOOD MARKERS</p>
                </div>
                <p className="font-mono text-[10px] leading-relaxed text-zinc-500">
                  Optional lab marker slot for glucose, lipids, vitamin D, hormones, or custom health metrics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
