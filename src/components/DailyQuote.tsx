// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Daily Motivational Quote Widget
// Curated quotes with daily rotation + optional ZenQuotes API fetch
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';

// ── Curated quotes covering productivity, habits, growth, resilience ──
const QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Progress is not achieved by luck or accident, but by working on yourself daily.", author: "Epictetus" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Your limitation — it's only your imagination.", author: "Anonymous" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Great things never come from comfort zones.", author: "Anonymous" },
  { text: "Dream it. Wish it. Do it.", author: "Anonymous" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Little things make big days.", author: "Anonymous" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Anonymous" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "Life is 10% what happens to me and 90% of how I react to it.", author: "Charles Swindoll" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Persist — nothing in the world can take the place of persistence.", author: "Calvin Coolidge" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
];

function getDailyQuoteIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % QUOTES.length;
}

interface DailyQuoteProps {
  className?: string;
}

export default function DailyQuote({ className }: DailyQuoteProps) {
  const [quoteIndex, setQuoteIndex] = useState(getDailyQuoteIndex);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const quote = QUOTES[quoteIndex];

  const handleRefresh = () => {
    setIsRefreshing(true);
    const newIndex = Math.floor(Math.random() * QUOTES.length);
    setQuoteIndex(newIndex);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div className={`border border-zinc-900 bg-zinc-950 p-4 ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-pixel text-[0.55rem] tracking-widest text-amber-500/80">DAILY_INSPIRATION</span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1 text-zinc-600 hover:text-amber-400 transition-colors"
          title="New quote"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quote */}
      <div className="relative pl-4 border-l-2 border-amber-500/30">
        <Quote className="absolute -left-2 -top-1 w-4 h-4 text-amber-500/20" />
        <p className="text-sm text-zinc-300 leading-relaxed italic">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="mt-2 text-xs text-zinc-500 font-terminal tracking-wide">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
