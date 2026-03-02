// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Puter.js AI Integration
// Free AI service using Puter.js - users pay their own usage, we pay nothing!
// Docs: https://docs.puter.com/AI/
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Puter.js provides FREE AI capabilities:
 * - GPT-4o mini (default) - Free!
 * - Claude models available
 * - No API key needed - user's Puter account handles billing
 * 
 * Usage in components:
 * 1. Import: import { puterChat, puterComplete, isPuterAvailable } from '@/lib/puter-ai'
 * 2. Check availability: if (isPuterAvailable()) { ... }
 * 3. Call AI: const response = await puterChat('Your message')
 */

export interface PuterChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface PuterChatOptions {
  model?: 'gpt-4o-mini' | 'claude-3-5-sonnet' | 'claude-3-haiku';
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
}

// Type declaration for global puter object
declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (message: string | PuterChatMessage[], options?: PuterChatOptions) => Promise<{
          message: {
            content: string;
          };
        } | ReadableStream<string>>;
        complete: (prompt: string, options?: PuterChatOptions) => Promise<string>;
      };
      print: (message: string) => void;
    };
  }
}

/**
 * Check if Puter.js is loaded and available
 */
export function isPuterAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.puter?.ai;
}

/**
 * Load Puter.js dynamically if not already loaded
 * Should be called once in app initialization
 */
export async function loadPuter(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  // Already loaded
  if (window.puter?.ai) return true;
  
  return new Promise((resolve) => {
    // Check if script already exists
    if (document.querySelector('script[src*="puter.com"]')) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.puter?.ai) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 5000);
      return;
    }

    // Create and inject script
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    
    script.onload = () => {
      // Give it a moment to initialize
      setTimeout(() => {
        resolve(!!window.puter?.ai);
      }, 500);
    };
    
    script.onerror = () => {
      console.warn('Failed to load Puter.js');
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Send a chat message using Puter.js AI (FREE!)
 * Uses GPT-4o mini by default
 */
export async function puterChat(
  message: string | PuterChatMessage[],
  options: PuterChatOptions = {}
): Promise<string> {
  if (!isPuterAvailable()) {
    throw new Error('Puter.js is not available. Call loadPuter() first.');
  }
  
  try {
    const response = await window.puter!.ai.chat(message, {
      model: options.model || 'gpt-4o-mini',
      stream: false,
      ...options,
    });
    
    // Non-streaming response
    if ('message' in (response as object)) {
      return (response as { message: { content: string } }).message.content;
    }
    
    return '';
  } catch (error) {
    console.error('Puter AI chat error:', error);
    throw error;
  }
}

/**
 * Get a simple completion using Puter.js AI (FREE!)
 */
export async function puterComplete(
  prompt: string,
  options: PuterChatOptions = {}
): Promise<string> {
  if (!isPuterAvailable()) {
    throw new Error('Puter.js is not available. Call loadPuter() first.');
  }
  
  try {
    const response = await window.puter!.ai.complete(prompt, {
      model: options.model || 'gpt-4o-mini',
      ...options,
    });
    
    return response;
  } catch (error) {
    console.error('Puter AI complete error:', error);
    throw error;
  }
}

/**
 * Stream a chat response using Puter.js AI (FREE!)
 */
export async function* puterChatStream(
  message: string | PuterChatMessage[],
  options: PuterChatOptions = {}
): AsyncGenerator<string, void, unknown> {
  if (!isPuterAvailable()) {
    throw new Error('Puter.js is not available. Call loadPuter() first.');
  }
  
  const response = await window.puter!.ai.chat(message, {
    model: options.model || 'gpt-4o-mini',
    stream: true,
    ...options,
  }) as ReadableStream<string>;
  
  const reader = response.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────────

import { buildAtomicHabitsSystemPrompt } from './atomic-habits-knowledge';

/**
 * Chat with Atomic Habits coaching context using Puter.js (FREE!)
 */
export async function puterHabitCoach(
  userMessage: string,
  context?: { currentStreak?: number; totalHabits?: number; recentMisses?: number }
): Promise<string> {
  const systemPrompt = buildAtomicHabitsSystemPrompt();
  
  let contextInfo = '';
  if (context) {
    contextInfo = `\n\nUser context: ${context.currentStreak || 0} day streak, ${context.totalHabits || 0} habits tracked`;
    if (context.recentMisses && context.recentMisses > 0) {
      contextInfo += `, ${context.recentMisses} recent misses`;
    }
  }
  
  const messages: PuterChatMessage[] = [
    { role: 'system', content: systemPrompt + contextInfo },
    { role: 'user', content: userMessage }
  ];
  
  return puterChat(messages);
}

/**
 * Get goal decomposition using Puter.js (FREE!)
 */
export async function puterDecomposeGoal(goal: string, targetDate?: string): Promise<string> {
  const prompt = `You are an expert goal coach using Atomic Habits principles by James Clear.

GOAL: "${goal}"
${targetDate ? `TARGET DATE: ${targetDate}` : ''}

Break this goal down into:
1. An identity statement ("I am the type of person who...")
2. 3-4 milestones with small daily tasks
3. Daily habits using habit stacking ("After [existing], I will [new]")

Apply:
- Two-Minute Rule (start tiny)
- 1% improvements
- Make it obvious, attractive, easy, satisfying

Respond with actionable, specific tasks.`;

  return puterChat(prompt);
}
