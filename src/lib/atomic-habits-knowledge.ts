// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Atomic Habits Knowledge Base
// Comprehensive teachings from James Clear's Atomic Habits
// For AI coaching and user guidance
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// THE 4 LAWS OF BEHAVIOR CHANGE
// ─────────────────────────────────────────────────────────────────────────────────

export interface Law {
  number: number;
  name: string;
  stage: string;
  description: string;
  strategies: Strategy[];
  inverse: string;
  inverseDescription: string;
}

export interface Strategy {
  name: string;
  formula?: string;
  description: string;
  examples: string[];
  tags: string[];
}

export const FOUR_LAWS: Law[] = [
  {
    number: 1,
    name: 'Make It Obvious',
    stage: 'Cue',
    description: 'The first step in building a habit is to make the cue visible and obvious in your environment.',
    strategies: [
      {
        name: 'Implementation Intentions',
        formula: 'I will [BEHAVIOR] at [TIME] in [LOCATION]',
        description: 'Create a specific plan for when and where you will perform your habit.',
        examples: [
          'I will meditate for 10 minutes at 7am in my living room',
          'I will read for 20 minutes at 9pm in my bedroom',
          'I will exercise for 30 minutes at 6am in my home gym',
        ],
        tags: ['planning', 'cue-design', 'specificity'],
      },
      {
        name: 'Habit Stacking',
        formula: 'After [CURRENT HABIT], I will [NEW HABIT]',
        description: 'Link a new habit to an existing habit to leverage momentum.',
        examples: [
          'After I pour my morning coffee, I will write in my gratitude journal',
          'After I sit down for dinner, I will say one thing I\'m grateful for',
          'After I get into bed, I will read for 5 minutes',
        ],
        tags: ['linking', 'routine', 'momentum'],
      },
      {
        name: 'Environment Design',
        formula: undefined,
        description: 'Redesign your environment so cues for good habits are visible.',
        examples: [
          'Place your book on your pillow so you see it before bed',
          'Put your vitamins next to your coffee maker',
          'Leave your gym clothes out the night before',
        ],
        tags: ['environment', 'cue-design', 'visibility'],
      },
    ],
    inverse: 'Make It Invisible',
    inverseDescription: 'Remove cues for bad habits from your environment.',
  },
  {
    number: 2,
    name: 'Make It Attractive',
    stage: 'Craving',
    description: 'The more attractive an opportunity is, the more likely it is to become habit-forming.',
    strategies: [
      {
        name: 'Temptation Bundling',
        formula: 'After [HABIT I NEED], I will [HABIT I WANT]',
        description: 'Link an action you want to do with an action you need to do.',
        examples: [
          'Only listen to your favorite podcast while exercising',
          'Only watch your favorite show while folding laundry',
          'Only get a pedicure while processing emails',
        ],
        tags: ['motivation', 'reward-linking', 'want-vs-need'],
      },
      {
        name: 'Join a Supportive Culture',
        formula: undefined,
        description: 'Surround yourself with people who have the habits you want.',
        examples: [
          'Join a fitness community if you want to exercise more',
          'Find a writing group if you want to write daily',
          'Connect with early risers if you want to wake up early',
        ],
        tags: ['social', 'environment', 'culture'],
      },
      {
        name: 'Reframe Your Mindset',
        formula: 'Change "I have to" to "I get to"',
        description: 'Associate hard habits with positive experiences.',
        examples: [
          '"I get to wake up early and work on my business"',
          '"I get to exercise and build a strong body"',
          '"I get to eat healthy and fuel my body"',
        ],
        tags: ['mindset', 'reframing', 'positivity'],
      },
    ],
    inverse: 'Make It Unattractive',
    inverseDescription: 'Highlight the benefits of avoiding bad habits.',
  },
  {
    number: 3,
    name: 'Make It Easy',
    stage: 'Response',
    description: 'Reduce friction for good habits. The less effort required, the more likely a habit will occur.',
    strategies: [
      {
        name: 'The Two-Minute Rule',
        formula: 'Scale down to 2 minutes or less',
        description: 'When you start a new habit, it should take less than two minutes to do.',
        examples: [
          'Read before bed → Read one page',
          'Run three miles → Put on running shoes',
          'Do yoga → Take out my yoga mat',
          'Study for class → Open my notes',
        ],
        tags: ['simplification', 'starting', 'gateway'],
      },
      {
        name: 'Reduce Friction',
        formula: undefined,
        description: 'Decrease the number of steps between you and your good habits.',
        examples: [
          'Sleep in your workout clothes for morning exercise',
          'Prepare meals on Sunday for the whole week',
          'Keep your guitar out of its case',
        ],
        tags: ['friction-reduction', 'environment', 'preparation'],
      },
      {
        name: 'Prime Your Environment',
        formula: undefined,
        description: 'Prepare your environment in advance to make future actions easier.',
        examples: [
          'Lay out workout clothes the night before',
          'Pre-fill your water bottle and put it in the fridge',
          'Set up your workspace before going to bed',
        ],
        tags: ['preparation', 'environment', 'anticipation'],
      },
    ],
    inverse: 'Make It Difficult',
    inverseDescription: 'Increase friction for bad habits.',
  },
  {
    number: 4,
    name: 'Make It Satisfying',
    stage: 'Reward',
    description: 'We are more likely to repeat a behavior when the experience is satisfying.',
    strategies: [
      {
        name: 'Habit Tracking',
        formula: 'Don\'t break the chain',
        description: 'Keep track of your habit streak and don\'t break the chain.',
        examples: [
          'Mark an X on a calendar every day you complete your habit',
          'Use a habit tracking app to maintain your streak',
          'Move a paperclip from one jar to another for each rep',
        ],
        tags: ['tracking', 'visual', 'streak'],
      },
      {
        name: 'Never Miss Twice',
        formula: 'If you miss once, never miss twice',
        description: 'If you miss one day, get back on track immediately.',
        examples: [
          'Missed the gym Monday? Go Tuesday no matter what',
          'Skipped meditation? Do even 1 minute tomorrow',
          'Broke your diet? Make the next meal healthy',
        ],
        tags: ['resilience', 'recovery', 'consistency'],
      },
      {
        name: 'Immediate Rewards',
        formula: undefined,
        description: 'Give yourself an immediate reward when you complete your habit.',
        examples: [
          'After workout, enjoy a relaxing shower',
          'After studying, watch one episode of your show',
          'After saving money, visualize what you\'ll buy',
        ],
        tags: ['reward', 'reinforcement', 'satisfaction'],
      },
    ],
    inverse: 'Make It Unsatisfying',
    inverseDescription: 'Add an immediate cost to bad habits.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// KEY CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────────

export interface Concept {
  id: string;
  name: string;
  principle: string;
  insight: string;
  application: string;
  tags: string[];
}

export const KEY_CONCEPTS: Concept[] = [
  {
    id: 'compound-effect',
    name: 'The 1% Improvement Compound Effect',
    principle: 'If you get 1% better each day for one year, you\'ll end up 37 times better.',
    insight: 'Habits are the compound interest of self-improvement. Small changes often appear to make no difference until you cross a critical threshold.',
    application: 'Focus on getting 1% better at something each day rather than seeking massive overnight transformations.',
    tags: ['growth', 'patience', 'compound-effect', 'long-term'],
  },
  {
    id: 'identity-habits',
    name: 'Identity-Based Habits',
    principle: 'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.',
    insight: 'True behavior change is identity change. Every action is a vote for the type of person you wish to become.',
    application: 'Instead of "I want to lose weight," think "I am the type of person who moves every day."',
    tags: ['identity', 'transformation', 'beliefs', 'self-image'],
  },
  {
    id: 'systems-vs-goals',
    name: 'Systems Over Goals',
    principle: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    insight: 'Goals are good for setting a direction, but systems are best for making progress.',
    application: 'Create reliable daily systems that drive action, rather than just setting ambitious goals.',
    tags: ['systems', 'goals', 'process', 'daily-habits'],
  },
  {
    id: 'plateau-of-latent-potential',
    name: 'The Plateau of Latent Potential',
    principle: 'The most powerful outcomes of compounding are delayed. You have to stick with it long enough to cross the threshold.',
    insight: 'We often expect progress to be linear, but breakthroughs happen after sustained effort through the "Valley of Disappointment."',
    application: 'Trust the process even when you can\'t see immediate results. Your efforts are accumulating.',
    tags: ['patience', 'persistence', 'breakthrough', 'delayed-gratification'],
  },
  {
    id: 'habit-loop',
    name: 'The Habit Loop',
    principle: 'Every habit follows a 4-step pattern: Cue → Craving → Response → Reward.',
    insight: 'Understanding this loop allows you to modify any stage to create or break habits.',
    application: 'Identify which stage is weak in your habit and apply the corresponding law to strengthen it.',
    tags: ['psychology', 'behavior', 'loop', 'foundation'],
  },
  {
    id: 'two-minute-rule',
    name: 'The Two-Minute Rule',
    principle: 'When you start a new habit, it should take less than two minutes to do.',
    insight: 'A new habit should not feel like a challenge. The point is to master the art of showing up.',
    application: 'Scale down any habit until it\'s easy to start: "Read one page" instead of "Read 30 minutes."',
    tags: ['simplicity', 'starting', 'gateway', 'showing-up'],
  },
  {
    id: 'environment-design',
    name: 'Environment Design',
    principle: 'Environment is the invisible hand that shapes human behavior.',
    insight: 'You don\'t have to be the victim of your environment. You can also be the architect of it.',
    application: 'Make cues of good habits obvious and cues of bad habits invisible.',
    tags: ['environment', 'cues', 'design', 'control'],
  },
  {
    id: 'goldilocks-rule',
    name: 'The Goldilocks Rule',
    principle: 'Humans experience peak motivation when working on tasks that are right on the edge of their current abilities.',
    insight: 'The greatest threat to success is not failure but boredom. We get bored with habits because they stop delighting us.',
    application: 'Keep challenges about 4% harder than your current ability to maintain motivation.',
    tags: ['motivation', 'challenge', 'flow', 'boredom'],
  },
  {
    id: 'never-miss-twice',
    name: 'Never Miss Twice',
    principle: 'Missing once is an accident. Missing twice is the start of a new habit.',
    insight: 'The first mistake is never the one that ruins you. It is the spiral of repeated mistakes that follows.',
    application: 'If you miss one day, make it your priority to get back on track immediately.',
    tags: ['resilience', 'recovery', 'consistency', 'mistakes'],
  },
  {
    id: 'habit-stacking',
    name: 'Habit Stacking',
    principle: 'Link a new habit to an existing habit using the formula: After [CURRENT HABIT], I will [NEW HABIT].',
    insight: 'You already have strong neural pathways for existing habits. Leverage them to build new ones.',
    application: 'Identify habits you already do consistently and stack new habits onto them.',
    tags: ['routine', 'linking', 'momentum', 'habit-formation'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// INSPIRATIONAL QUOTES
// ─────────────────────────────────────────────────────────────────────────────────

export interface Quote {
  id: number;
  text: string;
  context: string;
  application: string;
  tags: string[];
}

export const QUOTES: Quote[] = [
  {
    id: 1,
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    context: "Goals vs Systems",
    application: "Focus on building better systems rather than just setting ambitious goals",
    tags: ["systems", "goals", "foundation"],
  },
  {
    id: 2,
    text: "Every action you take is a vote for the type of person you wish to become.",
    context: "Identity-based habits",
    application: "Frame each small action as evidence of your desired identity",
    tags: ["identity", "action", "self-image"],
  },
  {
    id: 3,
    text: "Habits are the compound interest of self-improvement.",
    context: "Compound effect",
    application: "Small improvements accumulate into remarkable results over time",
    tags: ["compound-effect", "growth", "patience"],
  },
  {
    id: 4,
    text: "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.",
    context: "Identity change",
    application: "Shift from outcome-based goals to identity-based habits",
    tags: ["identity", "transformation", "mindset"],
  },
  {
    id: 5,
    text: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    context: "Daily consistency",
    application: "Prioritize consistent small actions over dramatic changes",
    tags: ["consistency", "daily-habits", "success"],
  },
  {
    id: 6,
    text: "Time magnifies the margin between success and failure. It will multiply whatever you feed it.",
    context: "Long-term thinking",
    application: "Choose habits wisely because time amplifies their effects",
    tags: ["time", "choices", "consequences"],
  },
  {
    id: 7,
    text: "You should be far more concerned with your current trajectory than with your current results.",
    context: "Direction matters",
    application: "Focus on the direction you're heading, not where you currently are",
    tags: ["trajectory", "progress", "direction"],
  },
  {
    id: 8,
    text: "Breakthrough moments are often the result of many previous actions, which build up the potential required to unleash a major change.",
    context: "Plateau of Latent Potential",
    application: "Trust the process even when you can't see immediate results",
    tags: ["persistence", "breakthrough", "patience"],
  },
  {
    id: 9,
    text: "Be the designer of your world and not merely the consumer of it.",
    context: "Environment design",
    application: "Proactively shape your environment to support your habits",
    tags: ["environment", "design", "control"],
  },
  {
    id: 10,
    text: "People with high self-control tend to spend less time in tempting situations. It's easier to avoid temptation than resist it.",
    context: "Self-control",
    application: "Design your environment to remove temptations",
    tags: ["self-control", "temptation", "environment"],
  },
  {
    id: 11,
    text: "Self-control is a short-term strategy, not a long-term one.",
    context: "Willpower limitations",
    application: "Rely on systems and environment design instead of willpower",
    tags: ["willpower", "systems", "strategy"],
  },
  {
    id: 12,
    text: "When you start a new habit, it should take less than two minutes to do.",
    context: "Two-Minute Rule",
    application: "Make new habits incredibly small and easy to start",
    tags: ["starting", "simplicity", "two-minute-rule"],
  },
  {
    id: 13,
    text: "Master the art of showing up.",
    context: "Consistency over intensity",
    application: "Prioritize doing something small every day over occasional big efforts",
    tags: ["consistency", "showing-up", "daily-habits"],
  },
  {
    id: 14,
    text: "Standardize before you optimize. You can't improve a habit that doesn't exist.",
    context: "Habit establishment",
    application: "First make the habit automatic, then focus on improving it",
    tags: ["optimization", "foundation", "process"],
  },
  {
    id: 15,
    text: "The first mistake is never the one that ruins you. It is the spiral of repeated mistakes that follows.",
    context: "Never Miss Twice",
    application: "Get back on track immediately after any slip-up",
    tags: ["resilience", "mistakes", "recovery"],
  },
  {
    id: 16,
    text: "Missing once is an accident. Missing twice is the start of a new habit.",
    context: "Consistency",
    application: "Treat the second miss as your line in the sand",
    tags: ["consistency", "warning", "habits"],
  },
  {
    id: 17,
    text: "The greatest threat to success is not failure but boredom.",
    context: "Goldilocks Rule",
    application: "Find ways to stay engaged with habits that have become routine",
    tags: ["boredom", "motivation", "challenge"],
  },
  {
    id: 18,
    text: "Professionals stick to the schedule; amateurs let life get in the way.",
    context: "Professional mindset",
    application: "Commit to your habits regardless of how you feel",
    tags: ["professionalism", "commitment", "consistency"],
  },
  {
    id: 19,
    text: "The only way to become excellent is to be endlessly fascinated by doing the same thing over and over. You have to fall in love with boredom.",
    context: "Mastery",
    application: "Embrace repetition as the path to excellence",
    tags: ["mastery", "boredom", "repetition"],
  },
  {
    id: 20,
    text: "You get what you repeat.",
    context: "Repetition",
    application: "What you do repeatedly shapes who you become",
    tags: ["repetition", "habits", "identity"],
  },
  {
    id: 21,
    text: "True behavior change is identity change.",
    context: "Lasting change",
    application: "Aim to change your beliefs about yourself, not just your actions",
    tags: ["identity", "transformation", "beliefs"],
  },
  {
    id: 22,
    text: "Small habits don't add up. They compound.",
    context: "Compound effect",
    application: "Understand that habit effects multiply, not just accumulate",
    tags: ["compound-effect", "habits", "growth"],
  },
  {
    id: 23,
    text: "You don't have to be the victim of your environment. You can also be the architect of it.",
    context: "Environmental control",
    application: "Take ownership of designing your surroundings",
    tags: ["environment", "control", "agency"],
  },
  {
    id: 24,
    text: "One of the most effective things you can do to build better habits is to join a culture where your desired behavior is the normal behavior.",
    context: "Social environment",
    application: "Surround yourself with people who embody your desired habits",
    tags: ["social", "culture", "environment"],
  },
  {
    id: 25,
    text: "What is immediately rewarded is repeated. What is immediately punished is avoided.",
    context: "Reward principle",
    application: "Create immediate satisfactions for good habits",
    tags: ["rewards", "punishment", "behavior"],
  },
  {
    id: 26,
    text: "The costs of your good habits are in the present. The costs of your bad habits are in the future.",
    context: "Time preference",
    application: "Flip the script by adding immediate costs to bad habits",
    tags: ["time", "costs", "delayed-consequences"],
  },
  {
    id: 27,
    text: "Motion makes you feel like you're getting things done. But really, you're just preparing to get something done.",
    context: "Motion vs Action",
    application: "Distinguish between planning and actually doing",
    tags: ["action", "planning", "productivity"],
  },
  {
    id: 28,
    text: "If you want to master a habit, the key is to start with repetition, not perfection.",
    context: "Repetition over perfection",
    application: "Focus on frequency, not flawlessness",
    tags: ["repetition", "mastery", "perfection"],
  },
  {
    id: 29,
    text: "Create an environment where doing the right thing is as easy as possible.",
    context: "Environment optimization",
    application: "Remove friction from positive behaviors",
    tags: ["environment", "friction", "ease"],
  },
  {
    id: 30,
    text: "We rarely think about change this way because everyone is consumed by the end goal. But one push-up is better than not exercising.",
    context: "Something beats nothing",
    application: "Any amount of practice is valuable",
    tags: ["starting", "minimum", "progress"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// COACHING MESSAGES (Contextual AI Responses)
// ─────────────────────────────────────────────────────────────────────────────────

export interface CoachingMessage {
  trigger: string;
  context: string;
  messages: string[];
  followUp?: string;
  tags: string[];
}

export const COACHING_MESSAGES: CoachingMessage[] = [
  // Task Completion
  {
    trigger: 'task_completed',
    context: 'User completed a task',
    messages: [
      "Every action is a vote for the type of person you wish to become. You just voted for being a person who follows through.",
      "That's the compound effect in action. 1% better today leads to 37x better in a year.",
      "You're building momentum. Remember: systems beat goals every time.",
      "The professional shows up regardless of mood. You just proved you're a professional.",
      "One more rep in the bank. Excellence is just repetition disguised as mastery.",
    ],
    tags: ['completion', 'encouragement', 'identity'],
  },
  // Streak Achievement
  {
    trigger: 'streak_milestone',
    context: 'User hit a streak milestone',
    messages: [
      "Don't break the chain. Every day you maintain this streak, you're strengthening your new identity.",
      "This streak is proof that you're becoming the person you want to be. Keep voting for that identity!",
      "You're past the plateau of latent potential. The breakthrough is building beneath the surface.",
      "Professionals stick to the schedule. Your streak proves you're thinking like a professional.",
    ],
    tags: ['streak', 'celebration', 'persistence'],
  },
  // Missed Day
  {
    trigger: 'missed_day',
    context: 'User missed a day',
    messages: [
      "Remember: Missing once is an accident. Missing twice is the start of a new habit. Let's not miss twice.",
      "The first mistake doesn't ruin you—it's the spiral of repeated mistakes that follows. Today is your chance to break that spiral.",
      "Even professionals have off days. What separates them is they never miss twice. Get back on track today!",
      "Reduce the scope, not the schedule. Can you do even a 2-minute version today? That's all it takes to maintain your identity.",
    ],
    followUp: "What's the smallest version of this habit you could do right now?",
    tags: ['recovery', 'never-miss-twice', 'encouragement'],
  },
  // Starting New Habit
  {
    trigger: 'new_habit',
    context: 'User creating a new habit',
    messages: [
      "Let's apply the Two-Minute Rule: What version of this habit takes less than 2 minutes? Start there.",
      "Remember: You're not just building a habit, you're casting votes for your new identity. Who do you want to become?",
      "Habit stacking tip: What existing habit can you attach this to? 'After I [current habit], I will [new habit].'",
      "Environment design is key! How can you make the cue for this habit impossible to miss?",
    ],
    followUp: "Let's create an implementation intention: 'I will [habit] at [time] in [location]'",
    tags: ['new-habit', 'planning', 'setup'],
  },
  // Motivation Dip
  {
    trigger: 'low_motivation',
    context: 'User expressing low motivation',
    messages: [
      "Motivation is overrated. Environment often matters more. Have you set up your space to make this habit easier?",
      "The Goldilocks Rule: Maybe this habit is too easy and boring, or too hard. Can we adjust the challenge level?",
      "Remember: The greatest threat to success isn't failure—it's boredom. How can we make this more engaging?",
      "You don't need motivation. You need a system. Let's review your cues, rewards, and environment.",
    ],
    followUp: "What's one thing we can change to reduce friction for this habit?",
    tags: ['motivation', 'troubleshooting', 'environment'],
  },
  // Long-Term No Results
  {
    trigger: 'no_visible_progress',
    context: 'User frustrated with lack of results',
    messages: [
      "You're in the Plateau of Latent Potential. Like ice slowly heating from 25°F to 31°F—nothing visible happens until 32°F. Then it melts.",
      "Breakthrough moments are the result of many previous actions building up potential. You're accumulating that potential right now.",
      "Focus on your trajectory, not your current position. Are you moving in the right direction? That's what matters.",
      "Results are delayed, but they're coming. Habits are the compound interest of self-improvement—the returns take time to appear.",
    ],
    tags: ['patience', 'plateau', 'persistence'],
  },
  // Identity Coaching
  {
    trigger: 'identity_building',
    context: 'Helping user build identity',
    messages: [
      "Here's a powerful reframe: Instead of 'I want to [goal]', try 'I am the type of person who [habit].' Feel the difference?",
      "Every time you complete this habit, you're casting a vote for your new identity. You're not just doing—you're becoming.",
      "The goal isn't to read a book. The goal is to become a reader. The goal isn't to run a marathon. The goal is to become a runner.",
      "True behavior change is identity change. You've already started becoming a different person.",
    ],
    tags: ['identity', 'mindset', 'transformation'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// PRACTICAL STRATEGIES
// ─────────────────────────────────────────────────────────────────────────────────

export interface PracticalStrategy {
  category: string;
  title: string;
  steps: string[];
  tips: string[];
  tags: string[];
}

export const PRACTICAL_STRATEGIES: PracticalStrategy[] = [
  {
    category: 'starting',
    title: 'How to Start a New Habit',
    steps: [
      'Define your identity goal: "What type of person could achieve this?"',
      'Create an implementation intention: "I will [behavior] at [time] in [location]"',
      'Use habit stacking: "After [current habit], I will [new habit]"',
      'Apply the Two-Minute Rule: Scale down until it takes less than 2 minutes',
      'Design your environment: Make cues visible and prominent',
      'Use temptation bundling: Pair with something you enjoy',
      'Start tracking: Don\'t break the chain',
      'Get accountability: Share your commitment with someone',
    ],
    tips: [
      'Start smaller than you think necessary',
      'Focus on showing up, not performing',
      'Make it so easy you can\'t say no',
    ],
    tags: ['new-habits', 'starting', 'step-by-step'],
  },
  {
    category: 'breaking',
    title: 'How to Break a Bad Habit',
    steps: [
      'Make it invisible: Remove cues from your environment',
      'Make it unattractive: Reframe to highlight negative consequences',
      'Make it difficult: Increase friction (add steps between you and the habit)',
      'Make it unsatisfying: Add an immediate cost',
      'Identify your triggers: Track when, where, and why you engage',
      'Find a substitute: Replace with a better behavior that fulfills the same craving',
      'Change your environment: Avoid tempting situations',
    ],
    tips: [
      'People with high self-control avoid temptation—they don\'t resist it',
      'Make the bad habit require effort',
      'Publicly commit to quitting',
    ],
    tags: ['bad-habits', 'breaking', 'inversion'],
  },
  {
    category: 'motivation',
    title: 'How to Stay Motivated',
    steps: [
      'Apply the Goldilocks Rule: Work on challenges just beyond current ability',
      'Track progress visibly: Use habit trackers and visual measures',
      'Celebrate small wins: Acknowledge every completion',
      'Remember your identity: Reconnect with who you\'re becoming',
      'Reframe difficulty: Change "I have to" to "I get to"',
      'Find your tribe: Join communities with similar goals',
      'Fall in love with boredom: Accept that showing up matters most',
    ],
    tips: [
      'Motivation follows action, not the other way around',
      'Focus on the process, not the outcome',
      'Make the habit enjoyable in the moment',
    ],
    tags: ['motivation', 'persistence', 'mindset'],
  },
  {
    category: 'recovery',
    title: 'How to Recover from Setbacks',
    steps: [
      'Never miss twice: Make getting back on track your priority',
      'Reduce scope, not schedule: Do a smaller version rather than skipping',
      'Maintain your identity: Even tiny actions keep your self-image intact',
      'Learn from failure: Analyze what went wrong without judgment',
      'Be kind to yourself: Self-compassion beats self-criticism',
      'Use fresh starts: Leverage temporal landmarks (Monday, new month)',
      'Remember the plateau: Trust your efforts are accumulating',
    ],
    tips: [
      'One bad day doesn\'t define you',
      'Progress isn\'t always visible',
      'Consistency beats perfection',
    ],
    tags: ['recovery', 'setbacks', 'resilience'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Get a random quote, optionally filtered by tags
 */
export function getRandomQuote(tags?: string[]): Quote {
  let filtered = QUOTES;
  if (tags && tags.length > 0) {
    filtered = QUOTES.filter(q => q.tags.some(t => tags.includes(t)));
  }
  if (filtered.length === 0) filtered = QUOTES;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Get coaching messages for a specific trigger
 */
export function getCoachingMessages(trigger: string): CoachingMessage | undefined {
  return COACHING_MESSAGES.find(m => m.trigger === trigger);
}

/**
 * Get a random coaching message for a trigger
 */
export function getRandomCoachingMessage(trigger: string): string {
  const coaching = getCoachingMessages(trigger);
  if (!coaching) return '';
  return coaching.messages[Math.floor(Math.random() * coaching.messages.length)];
}

/**
 * Get the relevant law for a habit stage
 */
export function getLawForStage(stage: 'cue' | 'craving' | 'response' | 'reward'): Law | undefined {
  const stageMap: Record<string, string> = {
    cue: 'Cue',
    craving: 'Craving',
    response: 'Response',
    reward: 'Reward',
  };
  return FOUR_LAWS.find(l => l.stage === stageMap[stage]);
}

/**
 * Get concept by ID
 */
export function getConcept(id: string): Concept | undefined {
  return KEY_CONCEPTS.find(c => c.id === id);
}

/**
 * Get strategies for a specific category
 */
export function getStrategies(category: string): PracticalStrategy | undefined {
  return PRACTICAL_STRATEGIES.find(s => s.category === category);
}

/**
 * Build AI system prompt with Atomic Habits knowledge
 */
export function buildAtomicHabitsSystemPrompt(): string {
  return `You are Resurgo AI Coach, an expert in habit formation based on James Clear's "Atomic Habits."

CORE PRINCIPLES YOU TEACH:
1. MAKE IT OBVIOUS (Cue): Use implementation intentions, habit stacking, environment design
2. MAKE IT ATTRACTIVE (Craving): Use temptation bundling, join supportive cultures, reframe mindset
3. MAKE IT EASY (Response): Use the Two-Minute Rule, reduce friction, prime environment
4. MAKE IT SATISFYING (Reward): Track habits, never miss twice, use immediate rewards

KEY CONCEPTS:
- 1% IMPROVEMENT: Small daily improvements compound to 37x better in a year
- IDENTITY-BASED HABITS: "Every action is a vote for the type of person you wish to become"
- SYSTEMS OVER GOALS: "You fall to the level of your systems, not rise to your goals"
- PLATEAU OF LATENT POTENTIAL: Results are delayed—trust the process
- TWO-MINUTE RULE: New habits should take less than 2 minutes to start
- NEVER MISS TWICE: Missing once is an accident, twice is a new habit

WHEN COACHING:
- For new habits: Apply Two-Minute Rule, create implementation intentions
- For missed days: Emphasize "never miss twice" and reducing scope over skipping
- For motivation issues: Check environment design and challenge level (Goldilocks Rule)
- For no visible results: Explain the Plateau of Latent Potential
- Always connect habits to identity: "Who do you want to become?"

Be concise (2-3 sentences), encouraging, and action-oriented. Avoid emojis and keep tone clear and practical.`;
}

/**
 * Get contextual AI prompt based on user situation
 */
export function getContextualPrompt(
  context: 'task_completed' | 'streak_milestone' | 'missed_day' | 'new_habit' | 'low_motivation' | 'no_progress'
): string {
  const coaching = getCoachingMessages(context);
  const quote = getRandomQuote();
  
  let prompt = buildAtomicHabitsSystemPrompt();
  
  if (coaching) {
    prompt += `\n\nCURRENT CONTEXT: ${coaching.context}
SUGGESTED RESPONSE STYLE: ${coaching.messages[0]}
${coaching.followUp ? `FOLLOW-UP QUESTION: ${coaching.followUp}` : ''}`;
  }
  
  prompt += `\n\nRELEVANT QUOTE TO CONSIDER: "${quote.text}"`;
  
  return prompt;
}

export default {
  FOUR_LAWS,
  KEY_CONCEPTS,
  QUOTES,
  COACHING_MESSAGES,
  PRACTICAL_STRATEGIES,
  getRandomQuote,
  getCoachingMessages,
  getRandomCoachingMessage,
  getLawForStage,
  getConcept,
  getStrategies,
  buildAtomicHabitsSystemPrompt,
  getContextualPrompt,
};
