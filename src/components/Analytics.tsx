// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Analytics Dashboard Charts
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn, getCompletionColor } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Target, Flame, Trophy, Calendar } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// Custom Tooltip Component
// ─────────────────────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1F] border border-white/10 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.dataKey === 'percentage' && '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────────
// Daily Consistency Chart
// ─────────────────────────────────────────────────────────────────────────────────

export function DailyConsistencyChart() {
  const { calendar, habits, habitEntries, getDailyStats } = useAscendStore();
  
  const data = useMemo(() => {
    const result = [];
    for (let day = 1; day <= calendar.daysInMonth; day++) {
      const date = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const stats = getDailyStats(date);
      result.push({
        day: day.toString(),
        completed: stats.completed,
        total: stats.total,
        percentage: stats.percentage,
      });
    }
    return result;
  }, [calendar, habitEntries, habits]);

  // Calculate summary for screen readers
  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0);
  const avgPercentage = Math.round(data.reduce((sum, d) => sum + d.percentage, 0) / data.length);

  return (
    <div className="glass-card p-4 sm:p-6" role="region" aria-label="Daily consistency chart">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Daily Consistency</h3>
          <p className="text-xs sm:text-sm text-white/60">Habits completed each day</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ascend-500/20">
          <TrendingUp className="w-4 h-4 text-ascend-400" aria-hidden="true" />
          <span className="text-sm font-medium text-ascend-400">This Month</span>
        </div>
      </div>
      
      {/* Screen reader summary */}
      <div className="sr-only">
        This month you completed {totalCompleted} habits with an average completion rate of {avgPercentage}%.
      </div>
      
      <div className="h-48 sm:h-64" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14B899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="day" 
              stroke="#ffffff40" 
              fontSize={11}
              tickLine={false}
              interval={2}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#14B899"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompleted)"
              name="Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Monthly Completion Donut
// ─────────────────────────────────────────────────────────────────────────────────

export function MonthlyCompletionDonut() {
  const { getMonthlyStats } = useAscendStore();
  const stats = getMonthlyStats();
  
  const data = [
    { name: 'Completed', value: stats.completed, color: '#14B899' },
    { name: 'Remaining', value: Math.max(0, stats.total - stats.completed), color: '#2E2E32' },
  ];

  return (
    <div className="glass-card p-4 sm:p-6" role="region" aria-label="Monthly progress chart">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Monthly Progress</h3>
          <p className="text-xs sm:text-sm text-white/60">Overall completion rate</p>
        </div>
      </div>
      
      {/* Screen reader summary */}
      <div className="sr-only">
        Monthly progress: {stats.percentage}% complete. {stats.completed} out of {stats.total} habits completed.
      </div>
      
      <div className="relative h-40 sm:h-52 flex items-center justify-center" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-2xl sm:text-4xl font-bold"
            style={{ color: getCompletionColor(stats.percentage) }}
          >
            {stats.percentage}%
          </span>
          <span className="text-xs sm:text-sm text-white/60">Complete</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4">
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">{stats.completed}</p>
          <p className="text-[10px] sm:text-xs text-white/60">Completed</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-[10px] sm:text-xs text-white/60">Total Goal</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Weekly Breakdown Chart
// ─────────────────────────────────────────────────────────────────────────────────

export function WeeklyBreakdownChart() {
  const { calendar, getWeeklyStats } = useAscendStore();
  
  const data = useMemo(() => {
    return calendar.weekNumbers.map((weekNum) => {
      const stats = getWeeklyStats(weekNum);
      return {
        week: `Week ${weekNum}`,
        completed: stats.completed,
        total: stats.total,
        percentage: stats.percentage,
      };
    });
  }, [calendar, getWeeklyStats]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Weekly Breakdown</h3>
          <p className="text-sm text-white/60">Performance by week</p>
        </div>
        <Calendar className="w-5 h-5 text-white/40" />
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="week" 
              stroke="#ffffff40" 
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="percentage" 
              name="Completion"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getCompletionColor(entry.percentage)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Top Habits Ranking
// ─────────────────────────────────────────────────────────────────────────────────

export function TopHabitsRanking() {
  const { getMonthlyStats } = useAscendStore();
  const stats = getMonthlyStats();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Habit Rankings</h3>
          <p className="text-sm text-white/60">Best and struggling habits</p>
        </div>
        <Trophy className="w-5 h-5 text-gold-400" />
      </div>
      
      {/* Top Performers */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
          🏆 Top Performers
        </h4>
        <div className="space-y-3">
          {stats.topHabits.slice(0, 3).map((habit, index) => (
            <div key={habit.id} className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                index === 0 && "bg-gold-400 text-black",
                index === 1 && "bg-gray-300 text-black",
                index === 2 && "bg-amber-600 text-white"
              )}>
                {index + 1}
              </div>
              <span className="text-lg">{habit.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{habit.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, habit.percentage)}%`,
                        backgroundColor: getCompletionColor(habit.percentage)
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: getCompletionColor(habit.percentage) }}>
                    {habit.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Attention */}
      {stats.worstHabits.length > 0 && stats.worstHabits[0].percentage < 60 && (
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
            ⚠️ Needs Attention
          </h4>
          <div className="space-y-3">
            {stats.worstHabits.filter(h => h.percentage < 60).slice(0, 2).map((habit) => (
              <div key={habit.id} className="flex items-center gap-3">
                <span className="text-lg">{habit.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{habit.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${habit.percentage}%`,
                          backgroundColor: getCompletionColor(habit.percentage)
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: getCompletionColor(habit.percentage) }}>
                      {habit.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.topHabits.length === 0 && (
        <div className="text-center py-6 text-white/40">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Start tracking habits to see rankings</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Stats Cards Row
// ─────────────────────────────────────────────────────────────────────────────────

export function StatsCards() {
  const { user, habits, getMonthlyStats } = useAscendStore();
  const monthStats = getMonthlyStats();

  const stats = [
    {
      label: 'Current Streak',
      value: user.gamification.weeklyStreak,
      suffix: 'days',
      icon: Flame,
      color: '#F97316',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'This Month',
      value: monthStats.percentage,
      suffix: '%',
      icon: Target,
      color: getCompletionColor(monthStats.percentage),
      bgColor: 'bg-ascend-500/10',
    },
    {
      label: 'Total XP',
      value: user.gamification.totalXP.toLocaleString(),
      suffix: '',
      icon: Trophy,
      color: '#FBBF24',
      bgColor: 'bg-gold-400/10',
    },
    {
      label: 'Active Habits',
      value: habits.filter(h => !h.archived && h.isActive).length,
      suffix: '',
      icon: TrendingUp,
      color: '#14B899',
      bgColor: 'bg-ascend-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={cn(
            "glass-card p-3 sm:p-4 flex items-center gap-2 sm:gap-4",
            "hover:border-white/20 transition-colors"
          )}
        >
          <div className={cn("p-2 sm:p-3 rounded-xl shrink-0", stat.bgColor)}>
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: stat.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold text-white truncate">
              {stat.value}
              <span className="text-sm sm:text-lg font-normal text-white/60 ml-1">
                {stat.suffix}
              </span>
            </p>
            <p className="text-[10px] sm:text-xs text-white/60 truncate">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
