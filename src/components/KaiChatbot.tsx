'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Kai AI Chatbot Component
// Intelligent help assistant with sales skills
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useQuery } from 'convex/react';
import { useAscendStore } from '@/lib/store';
import { api } from '../../convex/_generated/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  suggestions?: Array<{ label: string; prompt: string }>;
  cta?: { label: string; href: string } | null;
}

type ChatbotClientEventName = 'cta_clicked' | 'resolution_confirmed';

interface KaiChatbotProps {
  variant?: 'floating' | 'embedded' | 'fullscreen';
  initialOpen?: boolean;
  onClose?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function KaiChatbot({
  variant = 'floating',
  initialOpen = false,
  onClose,
}: KaiChatbotProps) {
  const { user: convexUser } = useStoreUser();
  const activeHabits = useQuery(api.habits.listActive, convexUser ? {} : 'skip');
  const {
    user: storeUser,
    habits: allStoreHabits,
    habitEntries: storeHabitEntries,
  } = useAscendStore();

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [asciiWave, setAsciiWave] = useState('');

  // Hydrate safely on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resurgofy_kai_voice_enabled');
      if (stored === 'true') {
        setIsVoiceEnabled(true);
      }
    }
  }, []);

  const handleToggleVoice = () => {
    const newVal = !isVoiceEnabled;
    setIsVoiceEnabled(newVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resurgofy_kai_voice_enabled', String(newVal));
    }
    if (!newVal && typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      setCurrentlySpeakingId(null);
    }
  };

  const speak = useCallback((text: string, messageId: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean markdown structure out of synthesized speech
    let cleanText = text
      .replace(/[#*`•\-\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 1.0;
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (voices.length > 0) {
      selectedVoice = voices.find(v => {
        const nameLower = v.name.toLowerCase();
        return nameLower.includes('google us english') || nameLower.includes('google uk english female') || nameLower.includes('david') || nameLower.includes('zira');
      });

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.default) || voices[0];
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setCurrentlySpeakingId(messageId);
    };

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // ASCII wave animation for Kai
  useEffect(() => {
    if (!currentlySpeakingId) {
      setAsciiWave('');
      return;
    }

    const waves = [
      '▖▘▝▗',
      '▚▞▚▞',
      '▙▛▜▟',
      '▚▞▚▞'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % waves.length;
      setAsciiWave(waves[idx]);
    }, 150);

    return () => clearInterval(interval);
  }, [currentlySpeakingId]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationIdRef = useRef(
    `kai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hey ${convexUser?.name || 'there'}! I'm Kai, your RESURGO assistant.\n\nI can see you have ${realContext?.habitsCount ?? 0} habit${(realContext?.habitsCount ?? 0) === 1 ? '' : 's'} and a ${realContext?.currentStreak ?? 0}-day streak.\n\nI can help you with:\n• Understanding features & getting started\n• Habit advice (using Atomic Habits principles)\n• Troubleshooting\n• Planning your best day\n\nWhat can I help you with today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, convexUser?.name]);

  // ─────────────────────────────────────────────────────────────────────────────
  // REAL USER CONTEXT — replaces hardcoded zeros
  // ─────────────────────────────────────────────────────────────────────────────
  // Sources:
  //   convexUser.plan           ← Convex user.plan (free | pro | lifetime)
  //   activeHabits?.length      ← Convex query: active habits count
  //   storeUser.stats           ← Zustand user stats (currentStreak, totalDaysActive)
  //   storeHabitEntries         ← Zustand habit entries for 7-day completion logic
  const realContext = useMemo(() => {
    if (!convexUser) return undefined;

    // Plan from Convex user record
    const plan = (convexUser.plan as 'free' | 'pro' | 'lifetime') ?? 'free';

    // Active habits count from Convex query (authoritative per-user source)
    const totalHabits = activeHabits?.length ?? 0;

    // Stats from the Zustand store user object (each field guarded individually)
    const stats = storeUser?.stats;
    const currentStreak = stats?.currentStreak ?? 0;
    const daysActive = stats?.totalDaysActive ?? 0;

    // ── Date helpers (computed fresh each invocation so values are deterministic) ──
    const todayStr = new Date().toISOString().split('T')[0];

    const last7Days: string[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    last7Days.sort((a, b) => (a < b ? 1 : -1));

    const last7DaysSet = new Set(last7Days);
    const last3 = last7Days.slice(3, 6);
    const prev3 = last7Days.slice(0, 3);
    const last3Set = new Set(last3);
    const prev3Set = new Set(prev3);

    // Build a date→entry map from the locally tracked habit entries
    const entriesByDate: Record<string, boolean> = {};
    for (let i = 0; i < (storeHabitEntries?.length ?? 0); i++) {
      const e = storeHabitEntries![i];
      if (e.completed) entriesByDate[e.date] = true;
    }

    // Exactly one completion on today's date (does not double-count if two entries share the same date)
    const completedToday = last7DaysSet.has(todayStr)
      ? entriesByDate[todayStr]
        ? 1
        : 0
      : (storeHabitEntries ?? []).filter(
          (e) => e.date === todayStr && e.completed
        ).length;

    const daysWithActivityThisWeek = last7Days.filter(
      (d) => entriesByDate[d]
    ).length;

    // Completed entries in the last 7 days
    const completed7d = last7DaysSet.size > 0
      ? (storeHabitEntries ?? []).filter(
          (e) => e.completed && last7DaysSet.has(e.date)
        ).length
      : 0;

    const totalPossible7d = totalHabits * 7;
    const completionRatio7d =
      totalPossible7d > 0 ? Math.round((completed7d / totalPossible7d) * 100) : 0;

    // Missed = days where user has a recorded entry but it was not completed
    const missed7d = last7Days.filter((d) => {
      const hasEntry = entriesByDate[d];
      if (hasEntry) return false;
      return (
        (storeHabitEntries ?? []).some(
          (e) => e.date === d && !e.completed
        )
      );
    }).length;

    // Streak trend: compare last 3 completed days vs previous 3 completed days
    const last3Completed = last3.filter((d) => entriesByDate[d]).length;
    const prev3Completed = prev3.filter((d) => entriesByDate[d]).length;

    const streakTrend: 'up' | 'flat' | 'down' =
      last3Completed > prev3Completed
        ? 'up'
        : last3Completed < prev3Completed
        ? 'down'
        : 'flat';

    // Human-readable recent activity summary for the LLM
    const recentActivity = `Today: ${completedToday}/${totalHabits} habits done. ${daysWithActivityThisWeek} days with activity this week.`;

    return {
      plan,
      habitsCount: totalHabits,
      currentStreak,
      daysActive,
      completionRatio7d,
      recentMisses7d: missed7d,
      streakTrend,
      recentActivity,
    };
  }, [convexUser, activeHabits, storeUser, storeHabitEntries]);

  // Context-aware suggestions that adapt to user's actual state
  const smartSuggestions = useMemo(() => {
    const ctx = realContext;
    const hasHabits = (ctx?.habitsCount ?? 0) > 0;
    const streak = ctx?.currentStreak ?? 0;
    const ratio = ctx?.completionRatio7d ?? 0;

    if (!hasHabits) {
      return [
        { label: 'Create my first habit', text: 'How do I set up my first habit in Resurgo?' },
        { label: 'Welcome tour', text: 'Show me around Resurgo' },
        { label: 'Atomic Habits intro', text: 'How does Atomic Habits work?' },
      ];
    }

    if (streak === 0 && ratio === 0) {
      return [
        { label: 'Start my streak today', text: 'How can I start building a streak today?' },
        { label: 'Why my streak reset', text: 'Why did my streak reset?' },
        { label: 'Re-motivate me', text: 'I need motivation to get back on track' },
      ];
    }

    if (streak >= 7) {
      return [
        { label: 'Protect my streak', text: 'How do I protect my streak?' },
        { label: 'Level up faster', text: 'Tips to level up faster' },
        { label: 'Deep habit advice', text: "I want deeper Atomic Habits advice" },
      ];
    }

    if (ratio < 40) {
      return [
        { label: 'Build consistency', text: 'How do I build more consistency this week?' },
        { label: 'Simplify my habits', text: 'Which habit should I focus on first?' },
        { label: 'Daily plan', text: 'Plan my day with my best habit' },
      ];
    }

    return [
      { label: 'Plan my day', text: 'Help me plan my top 3 priorities today' },
      { label: 'Habit stacking tips', text: 'Give me a habit stacking idea for my routine' },
      { label: 'Pro features', text: 'What Pro features should I consider?' },
      { label: `My streak is at ${streak} days!`, text: "I've hit a streak milestone!" },
    ];
  }, [realContext]);

  const trackClientEvent = useCallback(
    async (
      eventName: ChatbotClientEventName,
      payload?: {
        intent?: string;
        cta?: { label: string; href: string };
        details?: Record<string, unknown>;
      }
    ) => {
      try {
        await fetch('/api/chatbot/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName,
            conversationId: conversationIdRef.current,
            intent: payload?.intent,
            cta: payload?.cta,
            details: payload?.details,
          }),
        });
      } catch {
        // best-effort telemetry only
      }
    },
    []
  );

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setShowSuggestions(false);
    setInput('');
    setLastError(null);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: conversationIdRef.current,
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: realContext,
        }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        const assistantMsgId = `assistant-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
            intent:
              typeof data.intent === 'string' ? data.intent : undefined,
            suggestions: Array.isArray(data.suggestions)
              ? data.suggestions
              : undefined,
            cta: data.cta ?? null,
          },
        ]);
        if (isVoiceEnabled) {
          speak(data.message, assistantMsgId);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const err = error instanceof Error ? error : new Error('Unknown error');
      setLastError(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Everything hit a snag. Tech can be temperamental.\n\nTry asking again — or type "help" if you keep hitting issues.\n\n(Error: ${error instanceof Error ? error.message : 'unknown'})`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, realContext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // FLOATING VARIANT (Chat bubble)
  // ─────────────────────────────────────────────────────────────────────────────

  if (variant === 'floating') {
    return (
      <>
        {/* Chat bubble button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
            aria-label="Open chat with Kai"
          >
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </button>
        )}

        {/* Chat window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-secondary)]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">K</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Kai</h3>
                  <p className="text-xs text-[var(--text-secondary)]" aria-label={`Chatting with Kai • ${realContext?.plan ?? 'Free'} plan • ${realContext?.currentStreak ?? 0} day streak`}>
                    RESURGO AI Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`h-7 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer border text-[10px] font-mono font-bold leading-none ${
                    isVoiceEnabled
                      ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-400"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                  title={isVoiceEnabled ? "Mute Kai's voice" : "Enable Kai's voice"}
                >
                  {isVoiceEnabled ? `🔊 ${asciiWave || "ON"}` : "🔇 VOICE"}
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                <svg
                  className="w-5 h-5 text-[var(--text-secondary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent)] text-white rounded-br-md'
                        : 'bg-white/10 text-[var(--text-primary)] rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && msg.cta && (
                      <div className="mt-3">
                        <a
                          href={msg.cta.href}
                          onClick={() => {
                            void trackClientEvent('cta_clicked', {
                              intent: msg.intent,
                              cta: msg.cta ?? undefined,
                              details: { variant: 'floating' },
                            });
                          }}
                          className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
                        >
                          {msg.cta.label}
                        </a>
                      </div>
                    )}
                    {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={`${msg.id}-suggestion-${i}`}
                            onClick={() => sendMessage(s.prompt)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-colors"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            void trackClientEvent('resolution_confirmed', {
                              intent: msg.intent,
                              details: { variant: 'floating', messageId: msg.id },
                            });
                          }}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        >
                          ✅ This solved it
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error with retry */}
              {lastError && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-red-300 whitespace-pre-wrap">{lastError.message}</p>
                    <button
                      onClick={() => {
                        setLastError(null);
                        // Retry the last user message
                        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
                        if (lastUserMessage) {
                          sendMessage(lastUserMessage.content);
                        }
                      }}
                      className="mt-2 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white transition-colors"
                    >
                      ↻ Try again
                    </button>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {smartSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s.text)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Kai anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMBEDDED VARIANT (For help center)
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Ask Kai</h3>
            <p className="text-sm text-[var(--text-secondary)]" aria-label={`Chatting with Kai • ${realContext?.plan ?? 'Free'} plan • ${realContext?.currentStreak ?? 0} day streak`}>
              Get instant answers from our AI assistant
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border text-xs font-mono font-bold ${
              isVoiceEnabled
                ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-400"
                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
            title={isVoiceEnabled ? "Mute Kai's voice" : "Enable Kai's voice"}
          >
            {isVoiceEnabled ? `🔊 ${asciiWave || "ON"}` : "🔇 VOICE"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <h4 className="font-medium text-[var(--text-primary)] mb-2">
              How can I help?
            </h4>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Ask me anything about RESURGO, habits, or goals!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {smartSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-[var(--accent)] text-white rounded-br-md'
                      : 'bg-white/10 text-[var(--text-primary)] rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && msg.cta && (
                    <div className="mt-3">
                      <a
                        href={msg.cta.href}
                        onClick={() => {
                          void trackClientEvent('cta_clicked', {
                            intent: msg.intent,
                            cta: msg.cta ?? undefined,
                            details: { variant: 'embedded' },
                          });
                        }}
                        className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        {msg.cta.label}
                      </a>
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={`${msg.id}-embed-suggestion-${i}`}
                          onClick={() => sendMessage(s.prompt)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-colors"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          void trackClientEvent('resolution_confirmed', {
                            intent: msg.intent,
                            details: { variant: 'embedded', messageId: msg.id },
                          });
                        }}
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                      >
                        ✅ This solved it
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error with retry */}
            {lastError && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                  <p className="text-sm text-red-300 whitespace-pre-wrap">{lastError.message}</p>
                  <button
                    onClick={() => {
                      setLastError(null);
                      // Retry the last user message
                      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
                      if (lastUserMessage) {
                        sendMessage(lastUserMessage.content);
                      }
                    }}
                    className="mt-2 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white transition-colors"
                  >
                    ↻ Try again
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export default KaiChatbot;