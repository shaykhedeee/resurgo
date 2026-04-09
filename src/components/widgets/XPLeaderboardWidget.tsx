'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — XP Leaderboard Widget (Dashboard)
// Top 20 users by XP with current user rank highlight
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Trophy, Crown, Medal } from 'lucide-react';
import Image from 'next/image';

const RANK_COLORS: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-zinc-300',
  3: 'text-amber-600',
};

const RANK_ICONS: Record<number, typeof Trophy> = {
  1: Crown,
  2: Trophy,
  3: Medal,
};

export default function XPLeaderboardWidget() {
  const data = useQuery(api.gamification.getLeaderboard);

  if (data === undefined) {
    return (
      <div className="border border-zinc-900 bg-zinc-950 h-full flex items-center justify-center">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600 animate-pulse">
          LOADING...
        </span>
      </div>
    );
  }

  const { entries, myRank, myXP } = data;
  const notInTop20 = myRank !== undefined && myRank > 20;

  return (
    <div className="border border-zinc-900 bg-zinc-950 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5 shrink-0">
        <Trophy className="h-3.5 w-3.5 text-yellow-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-yellow-500">LEADERBOARD</span>
        <span className="ml-auto font-terminal text-[0.65rem] text-zinc-500">TOP 20 · ALL TIME</span>
      </div>

      {entries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-terminal text-xs text-zinc-600 text-center px-4">
            No rankings yet — start earning XP to appear here!
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-zinc-900/50">
            {entries.map((entry) => {
              const RankIcon = RANK_ICONS[entry.rank];
              const rankColor = RANK_COLORS[entry.rank] ?? 'text-zinc-600';
              const isMe = entry.isCurrentUser;

              return (
                <li
                  key={String(entry.userId)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition ${
                    isMe
                      ? 'bg-orange-950/20 border-l-2 border-orange-500'
                      : 'hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Rank */}
                  <div className={`shrink-0 w-6 flex justify-center ${rankColor}`}>
                    {RankIcon ? (
                      <RankIcon className="h-3.5 w-3.5" />
                    ) : (
                      <span className="font-pixel text-[0.55rem]">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="shrink-0">
                    {entry.imageUrl ? (
                      <Image
                        src={entry.imageUrl}
                        alt={entry.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <span className="font-terminal text-[0.5rem] text-zinc-400 uppercase">
                          {entry.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name + level */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-terminal text-xs truncate ${isMe ? 'text-orange-300' : 'text-zinc-200'}`}>
                      {entry.name}
                      {isMe && <span className="ml-1 text-orange-500 text-[0.55rem]">(you)</span>}
                    </p>
                    <p className="font-pixel text-[0.4rem] tracking-widest text-zinc-600 uppercase">
                      Lv {entry.level} · {entry.levelName}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="shrink-0 text-right">
                    <p className={`font-terminal text-xs font-bold ${isMe ? 'text-orange-400' : 'text-zinc-400'}`}>
                      {entry.totalXP.toLocaleString()}
                    </p>
                    <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-700">XP</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Current user footer (if outside top 20) */}
          {notInTop20 && myRank !== undefined && myXP !== undefined && (
            <div className="border-t border-zinc-800 mx-4 mt-1 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[0.5rem] text-orange-400">YOU</span>
                <span className="font-terminal text-xs text-zinc-400">Rank #{myRank}</span>
              </div>
              <span className="font-terminal text-xs font-bold text-orange-400">
                {myXP.toLocaleString()} XP
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
