'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Terminal Cockpit & Interactive Command Line
// Frictionless quick-logging of tasks, habits, mood, sleep, and water
// Real-time Synapse Feed displaying live platform telemetry & activity logs
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Terminal, Send, HelpCircle, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedItem {
  id: string;
  time: string;
  type: 'system' | 'task' | 'habit' | 'wellness' | 'finance';
  content: string;
}

export function TerminalCockpit() {
  const [input, setInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '◉ RESURGO COCKPIT PROTOCOL ENGAGED.',
    '> Type /help or click commands below for quick command listing.',
    '> Ready for instant keyboard-centric logging...',
    '',
  ]);
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: '1', time: '09:12', type: 'system', content: 'Synapse Core cohesion calculated at 78%.' },
    { id: '2', time: '09:15', type: 'wellness', content: 'Aurora detected 5.8 hours of sleep; scaling tasks recommended.' },
  ]);

  const [activeTab, setActiveTab] = useState<'cli' | 'feed'>('cli');

  // Convex mutations
  const createTask = useMutation(api.tasks.create);
  const createHabit = useMutation(api.habits.create);
  const logMood = useMutation(api.wellness.logMood);
  const logWater = useMutation(api.nutrition.updateWaterAndSteps);
  const logSleep = useMutation(api.sleep.logSleep);
  const startFocus = useMutation(api.focusSessions.start);
  const createJournal = useMutation(api.wellness.createJournalEntry);

  const inputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const addLog = (line: string) => {
    setTerminalLines(prev => [...prev, line]);
  };

  const playBeep = (freq = 880, duration = 0.15) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported
    }
  };

  const handleCommand = async (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    addLog(`> ${trimmed}`);
    setInput('');

    // Parse command
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    const todayISO = now.toISOString().split('T')[0];

    try {
      switch (command) {
        case '/help':
        case '/h':
          addLog('━━ AVAILABLE QUICK LOG COMMANDS ━━');
          addLog('/t <title> : Create a new task in Backlog');
          addLog('/habit <title> : Establish a daily habit');
          addLog('/mood <1-10> : Log current emotional scale');
          addLog('/water <glasses> : Add water logged in glasses');
          addLog('/sleep <hours> : Log last night sleep duration');
          addLog('/focus <mins> : Initiate deep-work focus timer');
          addLog('/reflect <text> : Log a daily reflection entry');
          addLog('/simplify : Toggle Emergency Simplified Mode');
          addLog('/clear : Flush terminal buffer screen');
          break;

        case '/clear':
          setTerminalLines([]);
          break;

        case '/t':
        case '/task':
          if (!args) {
            addLog('✗ Error: Specify a task title. Example: /t Write copy');
            break;
          }
          await createTask({ title: args, priority: 'medium' });
          addLog(`✓ Task Created Reactive State: "${args}"`);
          playBeep(980, 0.12);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'task', content: `Created task: "${args}"` },
            ...prev
          ]);
          break;

        case '/habit':
          if (!args) {
            addLog('✗ Error: Specify a habit name. Example: /habit Pushups');
            break;
          }
          await createHabit({ title: args, category: 'personal', frequency: 'daily', timeOfDay: 'anytime' });
          addLog(`✓ Habit Started Reactive State: "${args}"`);
          playBeep(980, 0.12);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'habit', content: `Started daily habit: "${args}"` },
            ...prev
          ]);
          break;

        case '/mood':
          const mScore = parseInt(args);
          if (isNaN(mScore) || mScore < 1 || mScore > 10) {
            addLog('✗ Error: Specify a mood score 1-10. Example: /mood 8');
            break;
          }
          await logMood({ score: mScore, notes: 'Logged via Cockpit CLI', date: todayISO });
          addLog(`✓ Mood Logged: ${mScore}/10 (Empathy modules recalibrated)`);
          playBeep(1100, 0.18);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'wellness', content: `Mood logged at ${mScore}/10` },
            ...prev
          ]);
          break;

        case '/water':
          const glasses = parseInt(args);
          if (isNaN(glasses) || glasses <= 0) {
            addLog('✗ Error: Specify number of glasses. Example: /water 3');
            break;
          }
          const ml = glasses * 250;
          await logWater({ waterMl: ml, date: todayISO });
          addLog(`✓ Hydration Updated: +${ml}ml logged (${glasses} glasses)`);
          playBeep(1050, 0.14);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'wellness', content: `Logged ${glasses} glasses of water (+${ml}ml)` },
            ...prev
          ]);
          break;

        case '/sleep':
          const hours = parseFloat(args);
          if (isNaN(hours) || hours <= 0 || hours > 24) {
            addLog('✗ Error: Specify valid sleep hours. Example: /sleep 7.5');
            break;
          }
          await logSleep({
            date: todayISO,
            bedtime: '23:00',
            wakeTime: '07:00',
            quality: 4,
            notes: 'Logged via Cockpit CLI',
            durationMinutes: Math.round(hours * 60)
          });
          addLog(`✓ Sleep telemetry saved: ${hours} hours logged for today`);
          playBeep(1000, 0.16);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'wellness', content: `Logged last night sleep: ${hours}h` },
            ...prev
          ]);
          break;

        case '/focus':
          const mins = parseInt(args);
          if (isNaN(mins) || mins <= 0 || mins > 240) {
            addLog('✗ Error: Specify focus duration (1-240 mins). Example: /focus 25');
            break;
          }
          await startFocus({ type: 'pomodoro', durationMinutes: mins });
          addLog(`✓ Focus Telemetry Started: Pomodoro session initiated for ${mins} minutes`);
          playBeep(1200, 0.15);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'system', content: `Started ${mins}m Pomodoro Session` },
            ...prev
          ]);
          break;

        case '/reflect':
          if (!args) {
            addLog('✗ Error: Write your reflection. Example: /reflect Completed main tasks!');
            break;
          }
          await createJournal({ date: todayISO, content: args, type: 'reflection' });
          addLog(`✓ Reflection saved to Daily Log (Identity telemetry synced)`);
          playBeep(1150, 0.14);
          setFeed(prev => [
            { id: Date.now().toString(), time: timeStr, type: 'wellness', content: `Journaled: "${args.substring(0, 30)}..."` },
            ...prev
          ]);
          break;

        case '/simplify':
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('resurgo-toggle-simplify'));
            addLog(`✓ Simplify Toggle dispatched. Today layout recalculated.`);
            playBeep(900, 0.1);
          }
          break;

        default:
          addLog(`✗ Unknown command: "${command}". Type /help for support.`);
          playBeep(440, 0.25);
          break;
      }
    } catch (err) {
      addLog(`✗ Mutation execution failed: ${String(err)}`);
      playBeep(330, 0.3);
    }
  };

  const handleSuggest = (suggestText: string) => {
    setInput(suggestText);
    inputRef.current?.focus();
  };

  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 p-4 rounded-[2px] font-mono shadow-[4px_4px_0px_rgba(0,0,0,0.85)] max-w-5xl mx-auto space-y-4">
      {/* COCKPIT HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-orange-500" />
          <span className="text-[10px] font-bold tracking-widest text-zinc-100 uppercase">SYSTEM_COCKPIT_CLI v3.1</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('cli')}
            className={cn(
              'px-2 py-0.5 text-[8px] border uppercase transition-all',
              activeTab === 'cli'
                ? 'border-orange-500 bg-orange-950/20 text-orange-400'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
            )}
          >
            Terminal CLI
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={cn(
              'px-2 py-0.5 text-[8px] border uppercase transition-all flex items-center gap-1',
              activeTab === 'feed'
                ? 'border-orange-500 bg-orange-950/20 text-orange-400'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
            )}
          >
            <Activity className="h-2.5 w-2.5" />
            Synapse Feed
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'cli' ? (
        <div className="space-y-3">
          {/* TERMINAL PANEL */}
          <div className="border border-zinc-900 bg-black/80 p-3 h-40 overflow-y-auto scrollbar-thin text-[11px] leading-relaxed">
            {terminalLines.map((line, i) => (
              <p
                key={i}
                className={cn(
                  line.startsWith('>') ? 'text-zinc-400' :
                  line.startsWith('✓') ? 'text-emerald-400' :
                  line.startsWith('✗') ? 'text-red-400 animate-shake' :
                  line.startsWith('━━') ? 'text-orange-500 font-bold' :
                  'text-zinc-500'
                )}
              >
                {line}
              </p>
            ))}
            <div ref={logEndRef} />
          </div>

          {/* INPUT BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(input);
            }}
            className="flex items-center gap-2 border border-zinc-800 bg-black p-2"
          >
            <span className="text-orange-500 text-xs font-bold pl-1 animate-pulse">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type /t task title, /mood 8, /water 4... or /help"
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:ring-0 focus:outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-1.5 border border-orange-900 bg-orange-950/20 text-orange-400 hover:bg-orange-950/50 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* QUICK CHIP SUGGESTIONS */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button onClick={() => handleSuggest('/t ')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300">
              [+TASK]
            </button>
            <button onClick={() => handleSuggest('/mood ')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300">
              [LOG_MOOD]
            </button>
            <button onClick={() => handleSuggest('/water ')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300">
              [LOG_WATER]
            </button>
            <button onClick={() => handleSuggest('/sleep ')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300">
              [LOG_SLEEP]
            </button>
            <button onClick={() => handleSuggest('/focus ')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300">
              [START_FOCUS]
            </button>
            <button onClick={() => handleSuggest('/reflect ')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300">
              [LOG_REFLECTION]
            </button>
            <button onClick={() => handleSuggest('/help')} className="px-2 py-0.5 border border-zinc-900 bg-black text-[8px] text-orange-500 hover:border-zinc-700">
              [LIST_HELP]
            </button>
          </div>
        </div>
      ) : (
        /* SYNAPSE FEED TAB */
        <div className="border border-zinc-900 bg-black/80 p-3 h-[216px] overflow-y-auto scrollbar-thin space-y-2">
          {feed.map((item) => {
            const colors = {
              system: 'border-zinc-900 text-zinc-400 bg-zinc-950/20',
              task: 'border-orange-950/40 text-orange-400 bg-orange-950/5',
              habit: 'border-emerald-950/40 text-emerald-400 bg-emerald-950/5',
              wellness: 'border-purple-950/40 text-purple-400 bg-purple-950/5',
              finance: 'border-blue-950/40 text-blue-400 bg-blue-950/5',
            };

            return (
              <div
                key={item.id}
                className={cn(
                  'border px-3 py-2 text-[10px] leading-relaxed flex items-center justify-between gap-4 animate-in fade-in duration-300',
                  colors[item.type]
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-600">[{item.time}]</span>
                  <span>{item.content}</span>
                </div>
                <span className="text-[8px] uppercase font-bold tracking-widest text-zinc-600">
                  {item.type}
                </span>
              </div>
            );
          })}

          {feed.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-zinc-700 space-y-2">
              <Activity className="h-8 w-8 opacity-20" />
              <p className="text-[10px] uppercase tracking-widest">No Synapse Logs Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
