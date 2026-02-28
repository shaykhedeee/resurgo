'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useEffect, useState } from 'react';
import { Copy, Check, Share2, Users, Trophy, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReferralPage() {
  const user = useQuery(api.users.current, {});
  const myReferrals = useQuery(api.referrals.getMyReferrals, {});
  const ensureCode = useMutation(api.referrals.ensureReferralCode);

  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (user?.referralCode) {
      setReferralCode(user.referralCode);
    } else if (user && !user.referralCode) {
      ensureCode().then((code) => setReferralCode(code));
    }
  }, [user]);

  const referralLink = referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://resurgo.life'}/?ref=${referralCode}`
    : '';

  const copyLink = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareVia = (platform: string) => {
    const text = `I'm leveling up my life with Resurgo 🔥 — the terminal-style productivity app that actually gets you to achieve your goals. Join me and let's rise together.`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">GROWTH :: REFERRAL_SYSTEM</span>
          </div>
          <div className="px-5 py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-orange-900 bg-orange-950/20">
              <span className="text-2xl">🔥</span>
            </div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
              Help Shape Your<br />Homeboy&apos;s Life Too
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-400">
              You started your comeback. Now pull someone else up.
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Get 30 days Pro free for every 3 friends who join and stay active.
            </p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-4 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">YOUR_REFERRAL_LINK</span>
          </div>
          <div className="p-4 space-y-3">
            {referralCode ? (
              <>
                <div className="flex items-center gap-2 border border-zinc-800 bg-black px-3 py-2">
                  <span className="flex-1 truncate font-mono text-[11px] text-orange-400">{referralLink}</span>
                  <button onClick={copyLink} className="shrink-0 p-1 text-zinc-400 transition hover:text-zinc-300">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-zinc-400">CODE:</span>
                  <span className="border border-orange-900 bg-orange-950/20 px-3 py-1 font-mono text-sm font-bold tracking-widest text-orange-500">
                    {referralCode}
                  </span>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="h-2 w-24 animate-pulse bg-zinc-800 mx-auto rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mb-4 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">SHARE_VIA</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-zinc-900">
            {[
              { id: 'twitter', label: 'X / TWITTER', emoji: '𝕏' },
              { id: 'whatsapp', label: 'WHATSAPP', emoji: '💬' },
              { id: 'telegram', label: 'TELEGRAM', emoji: '✈️' },
            ].map(({ id, label, emoji }) => (
              <button key={id} onClick={() => shareVia(id)} disabled={!referralLink}
                className="flex flex-col items-center gap-1.5 py-4 transition hover:bg-zinc-900 disabled:opacity-40">
                <span className="text-xl">{emoji}</span>
                <span className="font-mono text-[8px] tracking-widest text-zinc-500">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {myReferrals && (
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: 'TOTAL_INVITES', value: myReferrals.total, color: 'text-zinc-300' },
              { label: 'COMPLETED', value: myReferrals.completed, color: 'text-green-500' },
              { label: 'REWARDS_EARNED', value: Math.floor(myReferrals.completed / 3), color: 'text-orange-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="border border-zinc-900 bg-zinc-950 p-4 text-center">
                <p className="font-mono text-[8px] tracking-widest text-zinc-400">{label}</p>
                <p className={cn('mt-2 font-mono text-2xl font-bold', color)}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">HOW_IT_WORKS</span>
          </div>
          <div className="p-4 space-y-2">
            {[
              'Share your unique link or code with a friend',
              'Friend signs up and completes onboarding',
              'You both start building better habits together',
              'Get 30 days of Pro features per 3 successful referrals',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-orange-900 font-mono text-[9px] font-bold text-orange-600">
                  {i + 1}
                </span>
                <span className="font-mono text-[11px] text-zinc-400">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hustle quote */}
        <div className="mt-4 border border-dashed border-zinc-800 bg-zinc-950 p-4 text-center">
          <p className="font-mono text-xs italic text-zinc-400">
            &quot;Know someone who needs to get their shit together?<br />
            Send them this link. It might change their life.&quot;
          </p>
          <p className="mt-2 font-mono text-[9px] tracking-widest text-zinc-400">— Resurgo</p>
        </div>
      </div>
    </div>
  );
}
