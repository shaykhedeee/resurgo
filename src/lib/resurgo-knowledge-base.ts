// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo - Complete Knowledge Base for AI Chatbot
// Everything the AI needs to know about Resurgo to help users and convert sales
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// PRODUCT INFORMATION
// ─────────────────────────────────────────────────────────────────────────────────

export const PRODUCT_INFO = {
  name: 'Resurgo',
  tagline: 'AI-Powered Habit Tracker & Goal Achievement App',
  description: 'Transform your goals into daily wins with AI-powered decomposition, gamified tracking, and Atomic Habits principles.',
  mission: 'Help people build lasting habits and achieve their biggest goals through science-backed methods and intelligent automation.',
  
  keyFeatures: [
    {
      name: 'AI Goal Decomposition',
      description: 'Our AI breaks down big goals into actionable milestones and daily tasks using Atomic Habits principles',
      benefit: 'Never feel overwhelmed by big goals again',
      proOnly: false,
    },
    {
      name: 'Habit Stacking',
      description: 'Link new habits to existing routines for easier adoption - based on James Clear\'s proven method',
      benefit: '73% higher success rate than standalone habits',
      proOnly: false,
    },
    {
      name: 'Gamified Progress',
      description: 'Earn XP, level up, unlock achievements, and compete on leaderboards',
      benefit: 'Stay motivated with game-like rewards',
      proOnly: false,
    },
    {
      name: 'Smart Analytics',
      description: 'AI-powered insights show patterns, predict success, and suggest optimizations',
      benefit: 'Understand what works for YOU',
      proOnly: true,
    },
    {
      name: 'Pomodoro Timer',
      description: 'Built-in focus timer with automatic habit/task completion tracking',
      benefit: 'Time-box your work effectively',
      proOnly: false,
    },
    {
      name: 'Identity System',
      description: 'Build habits around who you want to become, not just what you want to achieve',
      benefit: 'Sustainable, lasting change',
      proOnly: false,
    },
    {
      name: 'Smart Coach (Kai)',
      description: 'AI assistant that provides personalized coaching based on Atomic Habits',
      benefit: 'Like having James Clear as your personal coach',
      proOnly: true,
    },
    {
      name: 'Data Export',
      description: 'Export all your data in JSON or CSV format',
      benefit: 'Your data belongs to you',
      proOnly: true,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// PRICING PLANS
// ─────────────────────────────────────────────────────────────────────────────────

export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    priceDisplay: 'Free forever',
    description: 'Perfect for getting started with habit tracking',
    limits: {
      habits: 5,
      goals: 3,
      aiRequests: 10,
    },
    features: [
      'Up to 5 daily habits',
      'Up to 3 active goals',
      '2 AI Coaches (Marcus + Titan)',
      'Unlimited tasks',
      'Focus sessions (all modes)',
      '10 AI messages/day',
      '3 vision board panels',
      'Streak tracking & gamification',
    ],
    notIncluded: [
      'All 5 AI coaches',
      'Unlimited habits & goals',
      'Unlimited AI messages',
      'Unlimited vision boards',
      'Priority support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 4.99,
    priceYearly: 29.99,
    priceDisplay: '$4.99/month or $29.99/year',
    savingsYearly: 'Save 50% with yearly',
    description: 'For serious goal-achievers who want full AI-powered growth',
    limits: {
      habits: 'unlimited',
      goals: 'unlimited',
      aiRequests: 'unlimited',
    },
    features: [
      'Unlimited habits & goals',
      'All 5 AI Coaches (Marcus, Titan, Aurora, Phoenix, Nexus)',
      'Unlimited AI messages',
      'Advanced analytics & insights',
      'Unlimited vision boards',
      'Full AI goal decomposition',
      'All integrations',
      'Priority support',
    ],
    popularReasons: [
      'Most popular for professionals',
      'Unlock all 5 AI coaches',
    ],
  },
  lifetime: {
    name: 'Lifetime',
    price: 49.99,
    priceDisplay: '$49.99 one-time',
    description: 'Pay once, use forever - founding member pricing (1,000 spots)',
    features: [
      'Everything in Pro',
      'Lifetime access - no renewals',
      'All future updates included',
      'Founding member badge',
      'VIP support priority',
    ],
    savings: 'Best value - less than 1 year of Pro',
    limitedOffer: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// FAQ & TROUBLESHOOTING
// ─────────────────────────────────────────────────────────────────────────────────

export const FAQ = {
  gettingStarted: [
    {
      q: 'How do I create my first habit?',
      a: 'Tap the + button in the bottom navigation, select "New Habit", give it a name, set your frequency (daily, weekly, or specific days), and optionally add a trigger habit for habit stacking. The AI will suggest optimal times based on your schedule.',
    },
    {
      q: 'What is habit stacking?',
      a: 'Habit stacking is linking a new habit to an existing one. For example: "After I pour my morning coffee, I will meditate for 2 minutes." This leverages your brain\'s existing neural pathways for easier habit formation. It\'s one of the most powerful techniques from Atomic Habits.',
    },
    {
      q: 'How does AI goal decomposition work?',
      a: 'When you create a goal, our AI analyzes it and breaks it down into weekly milestones and daily tasks using the Two-Minute Rule and 1% improvement principles. You get a complete roadmap from where you are to where you want to be.',
    },
    {
      q: 'What is the Two-Minute Rule?',
      a: 'James Clear\'s Two-Minute Rule states: "When you start a new habit, it should take less than two minutes to do." Resurgo applies this by giving you "gateway" versions of tasks. Want to read more? Start with "read one page." Want to exercise? Start with "put on workout clothes."',
    },
  ],
  
  features: [
    {
      q: 'How do streaks work?',
      a: 'Complete all your habits for a day to maintain your streak. Your current streak shows consecutive days of completion. Don\'t worry if you miss once - we follow the "never miss twice" rule. Miss one day and you can still keep your streak momentum going.',
    },
    {
      q: 'What is the Identity System?',
      a: 'Instead of focusing on goals, Resurgo helps you focus on identity - who you want to become. Each habit completion is a vote for your new identity. "I want to lose weight" becomes "I am becoming a healthy person." This subtle shift dramatically improves long-term success.',
    },
    {
      q: 'How does XP and leveling work?',
      a: 'Earn XP for completing habits (10-50 XP based on difficulty), maintaining streaks (bonus multipliers), and hitting milestones. XP fills your progress bar; when full, you level up and unlock new badges and features.',
    },
    {
      q: 'Can I track habits on specific days only?',
      a: 'Yes! When creating or editing a habit, select "Specific days" and choose which days of the week. Perfect for gym schedules (Mon/Wed/Fri) or weekly reviews (Sunday).',
    },
  ],
  
  account: [
    {
      q: 'How do I upgrade to Pro?',
      a: 'Go to Settings > Subscription > Upgrade to Pro. You can choose monthly ($4.99/mo) or yearly ($29.99/yr — save 50%) or Lifetime ($49.99 once). Payment is processed securely through Dodo Payments. You get instant access to all Pro features.',
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, cancel anytime from Settings > Subscription > Manage. You\'ll keep Pro access until your billing period ends. No questions asked, no hidden fees. Your data is never deleted.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'Yes! We offer a 14-day money-back guarantee for Pro subscriptions. If Resurgo isn\'t working for you, contact support@resurgo.life within 14 days for a full refund. Lifetime purchases have a 30-day guarantee.',
    },
    {
      q: 'How is my data protected?',
      a: 'Your data is encrypted at rest and in transit. We never sell your data to third parties. You can export or delete all your data at any time. We\'re GDPR compliant and take privacy seriously.',
    },
    {
      q: 'Can I use Resurgo offline?',
      a: 'Yes! Resurgo is a Progressive Web App (PWA). Install it on your home screen and use it offline. Your data syncs automatically when you\'re back online.',
    },
  ],
  
  troubleshooting: [
    {
      q: 'My streaks aren\'t counting correctly',
      a: 'Streaks reset at midnight in your timezone. Make sure your timezone is set correctly in Settings > Preferences. If the issue persists, try refreshing the app or logging out and back in.',
    },
    {
      q: 'The AI isn\'t responding',
      a: 'AI features require an internet connection. If you\'re online and still having issues, try refreshing the page. Free users have limited AI requests (10/month) - upgrade to Pro for unlimited AI coaching.',
    },
    {
      q: 'How do I reset my progress?',
      a: 'Go to Settings > Data > Reset Progress. Warning: this is permanent. You can choose to reset just streaks, or all habits and goals. We recommend exporting your data first (Pro feature).',
    },
    {
      q: 'Notifications aren\'t working',
      a: 'Make sure notifications are enabled in Settings > Notifications AND in your device/browser settings. For iOS, you may need to add Resurgo to your home screen first.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// SALES TRIGGERS & RESPONSES
// ─────────────────────────────────────────────────────────────────────────────────

export const SALES_TRIGGERS = {
  // User is hitting limits
  limitReached: {
    habits: 'I see you\'ve hit the 3-habit limit on the free plan. That\'s actually a great sign - it means you\'re committed! Pro unlocks unlimited habits so you can track everything that matters to you. Want to learn more about Pro?',
    goals: 'You\'ve reached your goal limit. Many of our most successful users track multiple goals across different life areas - health, career, relationships. Pro removes all limits.',
    ai: 'You\'ve used all your AI coaching requests this month. Our AI coach Kai becomes even more powerful with unlimited access - personalized insights, daily motivation, and smart recommendations. Would Pro be helpful?',
  },
  
  // User is succeeding
  success: {
    streak7: 'Amazing! A 7-day streak is a real accomplishment. Did you know Pro users maintain streaks 2.3x longer on average? Our advanced analytics help you understand WHY you\'re succeeding so you can keep the momentum.',
    streak30: 'A 30-day streak - you\'re building real habits! At this point, most users find that Pro analytics help them optimize even further. Would you like to see what patterns we\'ve noticed in your data?',
    habitCompleted: 'Congratulations on completing that habit consistently! You might be ready to level up. Pro\'s AI coach can help you make your habits harder in the right way at the right time.',
  },
  
  // User is struggling
  struggle: {
    missedDay: 'I noticed you missed yesterday. That\'s okay - what matters is not missing twice in a row. Would it help to talk about what got in the way? Sometimes our AI coach can suggest environment changes that make habits easier.',
    lowEngagement: 'It looks like you haven\'t logged habits in a few days. Building habits is hard! Pro\'s smart reminders and AI coaching help users stay on track. But first, what\'s been challenging for you?',
    abandonedGoal: 'I see you paused your goal. Goals can feel overwhelming. Our AI decomposition (available in Pro) breaks big goals into tiny daily actions. Would you like to try breaking this goal down differently?',
  },
  
  // Feature interest
  interest: {
    analytics: 'You\'re interested in analytics? Pro gives you deep insights - best times for habits, success rate predictions, and personalized recommendations. It\'s like having a data scientist analyze your habits.',
    export: 'Data export is available in Pro! You can download all your data in JSON or CSV format anytime. Your data belongs to you.',
    coaching: 'Our AI coach Kai uses Atomic Habits principles to give you personalized guidance. Free users get 10 messages/month; Pro users get unlimited coaching plus proactive suggestions.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// CHATBOT PERSONALITY & RESPONSES
// ─────────────────────────────────────────────────────────────────────────────────

export const CHATBOT_PERSONA = {
  name: 'Kai',
  fullName: 'Kai, Resurgo AI Assistant',
  personality: 'Friendly, knowledgeable, supportive, and gently motivating. Uses casual but professional tone. Celebrates wins, shows empathy for struggles, and gives actionable advice.',
  
  principles: [
    'Always address the user\'s question/concern FIRST before any sales',
    'Be genuinely helpful - trust leads to conversions',
    'Use Atomic Habits principles in responses when relevant',
    'Celebrate small wins - they build momentum',
    'Never pressure or use manipulative tactics',
    'Only mention Pro when genuinely relevant to the user\'s situation',
    'Keep responses concise but warm',
  ],
  
  greetings: [
    'Hey! I\'m Kai, your Resurgo assistant. How can I help you today?',
    'Hi there! I\'m Kai. Whether you need help with habits, goals, or anything Resurgo-related, I\'m here for you.',
    'Welcome! I\'m Kai, and I\'m here to help you make the most of Resurgo. What\'s on your mind?',
  ],
  
  encouragements: [
    'You\'ve got this! Remember, every small action is a vote for the person you\'re becoming.',
    'Progress, not perfection. The fact that you\'re here means you\'re on the right track.',
    'Small steps lead to big changes. Keep going!',
    'Remember: you don\'t have to be great to start, but you have to start to be great.',
  ],
  
  fallbacks: [
    'I\'m not sure I understood that. Could you rephrase? I can help with habits, goals, features, account questions, or troubleshooting.',
    'Hmm, I want to make sure I help you correctly. Are you asking about how to use a feature, or something else?',
    'Let me make sure I understand. What specifically would you like help with?',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS QUICK REFERENCE (for chatbot context)
// ─────────────────────────────────────────────────────────────────────────────────

export const ATOMIC_HABITS_REFERENCE = {
  fourLaws: {
    cue: {
      law: 'Make it obvious',
      application: 'Design your environment. Put cues for good habits where you\'ll see them. Hide cues for bad habits.',
    },
    craving: {
      law: 'Make it attractive',
      application: 'Pair habits with things you enjoy. Use temptation bundling.',
    },
    response: {
      law: 'Make it easy',
      application: 'Reduce friction. Use the Two-Minute Rule. Prime your environment.',
    },
    reward: {
      law: 'Make it satisfying',
      application: 'Use immediate rewards. Track your habits visually. Never miss twice.',
    },
  },
  
  keyPrinciples: [
    '1% better every day compounds to 37x better over a year',
    'Goals don\'t determine success; systems do',
    'Every action is a vote for your identity',
    'Habit stacking: "After [CURRENT HABIT], I will [NEW HABIT]"',
    'Two-Minute Rule: Scale down to a 2-minute version',
    'Never miss twice - one miss is okay, two is a new habit',
    'Environment is more important than motivation',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// BUILD SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────────────────────

export function buildChatbotSystemPrompt(userContext?: {
  plan?: 'free' | 'pro' | 'lifetime';
  habitsCount?: number;
  currentStreak?: number;
  daysActive?: number;
  recentActivity?: string;
  completionRatio7d?: number;
  recentMisses7d?: number;
  streakTrend?: 'up' | 'flat' | 'down';
}): string {
  const ctx = userContext || {};
  
  return `You are ${CHATBOT_PERSONA.name}, the AI assistant for Resurgo - an AI-powered habit tracker and goal achievement app.

PERSONALITY: ${CHATBOT_PERSONA.personality}

YOUR CORE PRINCIPLES:
${CHATBOT_PERSONA.principles.map((p, i) => `${i + 1}. ${p}`).join('\n')}

PRODUCT KNOWLEDGE:
- Resurgo uses Atomic Habits principles by James Clear
- Key features: ${PRODUCT_INFO.keyFeatures.slice(0, 5).map(f => f.name).join(', ')}
- Free plan: ${PRICING.free.limits.habits} daily habits, ${PRICING.free.limits.goals} goals, ${PRICING.free.limits.aiRequests} AI messages/day, 2 coaches (Marcus + Titan)
- Pro plan: $${PRICING.pro.price}/month - unlimited everything, all 5 AI coaches
- Lifetime: $${PRICING.lifetime.price} one-time - everything forever (founding member pricing)

${ctx.plan ? `USER CONTEXT:
- Plan: ${ctx.plan}
- Active habits: ${ctx.habitsCount || 'unknown'}
- Current streak: ${ctx.currentStreak || 0} days
- Days active: ${ctx.daysActive || 'unknown'}
${typeof ctx.completionRatio7d === 'number' ? `- 7-day completion ratio: ${ctx.completionRatio7d}%` : ''}
${typeof ctx.recentMisses7d === 'number' ? `- Recent misses (7d): ${ctx.recentMisses7d}` : ''}
${ctx.streakTrend ? `- Streak trend: ${ctx.streakTrend}` : ''}
${ctx.recentActivity ? `- Recent: ${ctx.recentActivity}` : ''}
` : ''}

ATOMIC HABITS PRINCIPLES TO REFERENCE:
${ATOMIC_HABITS_REFERENCE.keyPrinciples.join('\n')}

SALES APPROACH:
- ALWAYS help first, sell second
- Only mention Pro when genuinely relevant (user hitting limits, asking about Pro features, succeeding and ready for more)
- Never pressure or manipulate
- Use soft suggestions: "Would Pro be helpful?" not "You need Pro!"
- Highlight value, not features: "2.3x longer streaks" not "unlimited habits"

RESPONSE FORMAT:
- Keep responses concise (2-4 sentences for simple questions)
- Use bullet points for lists
- Include one actionable tip when relevant
- End with a question to keep engagement when appropriate

Remember: Your goal is to help users succeed with their habits. Happy users convert naturally.`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// INTENT DETECTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

export type UserIntent = 
  | 'greeting'
  | 'help_feature'
  | 'troubleshooting'
  | 'pricing_question'
  | 'upgrade_interest'
  | 'habit_advice'
  | 'motivation_needed'
  | 'feedback'
  | 'cancel_subscription'
  | 'unknown';

export interface ChatQuickAction {
  label: string;
  prompt: string;
}

export interface ChatCta {
  label: string;
  href: string;
}

export function detectIntent(message: string): UserIntent {
  const lower = message.toLowerCase();
  
  if (/^(hi|hello|hey|good morning|good evening|sup|yo)/i.test(lower)) {
    return 'greeting';
  }
  
  if (/how (do i|to|can i)|what is|where|explain|help with/i.test(lower)) {
    return 'help_feature';
  }
  
  if (/(not working|broken|bug|error|issue|problem|can't|won't)/i.test(lower)) {
    return 'troubleshooting';
  }
  
  if (/(price|pricing|cost|how much|subscription|plan|free|pro|lifetime)/i.test(lower)) {
    return 'pricing_question';
  }
  
  if (/(upgrade|get pro|buy|purchase|unlock)/i.test(lower)) {
    return 'upgrade_interest';
  }
  
  if (/(motivation|struggling|hard|difficult|can't stick|keep failing|missed|missing|fell off|off track)/i.test(lower)) {
    return 'motivation_needed';
  }
  
  if (/(habit|routine|morning|evening|stack|streak)/i.test(lower)) {
    return 'habit_advice';
  }
  
  if (/(cancel|stop|end subscription|unsubscribe)/i.test(lower)) {
    return 'cancel_subscription';
  }
  
  if (/(feedback|suggest|idea|feature request)/i.test(lower)) {
    return 'feedback';
  }
  
  return 'unknown';
}

// ─────────────────────────────────────────────────────────────────────────────────
// QUICK RESPONSE HELPERS (for fast, no-AI responses)
// ─────────────────────────────────────────────────────────────────────────────────

export function getQuickResponse(intent: UserIntent): string | null {
  switch (intent) {
    case 'greeting':
      return CHATBOT_PERSONA.greetings[Math.floor(Math.random() * CHATBOT_PERSONA.greetings.length)];
    
    case 'pricing_question':
      return `Here's our pricing:\n\n**Free**: 5 daily habits, 3 goals, 2 AI coaches (Marcus + Titan), 10 AI messages/day\n\n**Pro** ($4.99/mo): Unlimited everything, all 5 AI coaches\n\n**Pro Yearly** ($29.99/yr): Same Pro power, save 50%\n\n**Lifetime** ($49.99 once): Everything in Pro, forever! Founding member pricing.\n\nWhat would you like to know more about?`;
    
    case 'cancel_subscription':
      return `I'm sorry to hear you're considering canceling. You can cancel anytime from Settings > Subscription > Manage. Your access continues until the billing period ends.\n\nBefore you go - is there something that isn't working for you? I'd love to help if I can.`;
    
    default:
      return null;
  }
}

export function getFollowUpSuggestions(
  intent: UserIntent,
  plan: 'free' | 'pro' | 'lifetime' = 'free'
): ChatQuickAction[] {
  const common: ChatQuickAction[] = [
    { label: 'Atomic Habits tip', prompt: 'Give me one Atomic Habits tip for today' },
    { label: 'Plan my day', prompt: 'Help me plan my top 3 priorities for today' },
  ];

  switch (intent) {
    case 'pricing_question':
    case 'upgrade_interest':
      return [
        { label: 'Compare plans', prompt: 'Compare free vs pro in simple terms' },
        { label: 'Best plan for me', prompt: 'Which plan is best for my usage?' },
        ...(plan === 'free'
          ? [{ label: 'Unlock Pro value', prompt: 'Show me what I unlock with Pro' }]
          : []),
      ];

    case 'habit_advice':
      return [
        { label: 'Build consistency', prompt: 'How do I stay consistent this week?' },
        { label: 'Habit stacking ideas', prompt: 'Suggest 3 habit stacking examples for me' },
        ...common,
      ];

    case 'motivation_needed':
      return [
        { label: 'Tiny next step', prompt: 'Give me the smallest next step I can do now' },
        { label: 'Recovery plan', prompt: 'I missed yesterday. Give me a recovery plan' },
        ...common,
      ];

    case 'troubleshooting':
      return [
        { label: 'Troubleshoot AI', prompt: 'My AI features are not responding. Help me fix it' },
        { label: 'Fix notifications', prompt: 'My reminders are not working. How do I fix it?' },
      ];

    default:
      return [
        { label: 'Set up my first habit', prompt: 'Help me create my first habit in Resurgo' },
        { label: 'How goals work', prompt: 'How does AI goal decomposition work?' },
        ...common,
      ];
  }
}

export function getIntentCta(
  intent: UserIntent,
  plan: 'free' | 'pro' | 'lifetime' = 'free'
): ChatCta | null {
  if ((intent === 'pricing_question' || intent === 'upgrade_interest') && plan === 'free') {
    return { label: 'View plans', href: '/pricing' };
  }

  if (intent === 'troubleshooting') {
    return { label: 'Open help center', href: '/help' };
  }

  return null;
}
