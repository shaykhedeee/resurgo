import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// HELP CATEGORY DATA
// ═══════════════════════════════════════════════════════════════════════════════

const categoriesData: Record<string, {
  title: string;
  description: string;
  icon: string;
  articles: Array<{
    id: string;
    title: string;
    summary: string;
    content: string;
    readTime: number;
  }>;
}> = {
  'getting-started': {
    title: 'Getting Started',
    description: 'New to RESURGO? Start here to learn the basics and set up your first habits and goals.',
    icon: 'GS',
    articles: [
      {
        id: 'first-habit',
        title: 'Creating Your First Habit',
        summary: 'Learn how to create and track your first habit in RESURGO',
        readTime: 3,
        content: `
## Creating Your First Habit

Welcome to RESURGO! Creating your first habit is simple and takes less than a minute.

### Step 1: Open the Add Menu
Tap the **+** button in the bottom navigation bar to open the add menu.

### Step 2: Select "New Habit"
Choose "New Habit" from the options.

### Step 3: Fill in the Details
- **Name**: Give your habit a clear, action-oriented name (e.g., "Meditate for 5 minutes")
- **Frequency**: Choose daily, weekly, or specific days
- **Time of Day**: Morning, afternoon, evening, or anytime
- **Trigger Habit** (optional): Link it to an existing routine for habit stacking

### Step 4: Save and Start Tracking!
Tap "Create Habit" and you're ready to go. Complete your habit each day by tapping the checkbox.

### Pro Tip: Start Small
Remember the Two-Minute Rule: make your habit so easy you can't say no. "Read for 2 minutes" beats "Read for an hour" when building consistency.
        `,
      },
      {
        id: 'habit-stacking',
        title: 'Understanding Habit Stacking',
        summary: 'Learn the powerful technique of linking new habits to existing ones',
        readTime: 4,
        content: `
## Understanding Habit Stacking

Habit stacking is one of the most powerful techniques from James Clear's Atomic Habits. It leverages your existing neural pathways to build new habits.

### The Formula
**"After [CURRENT HABIT], I will [NEW HABIT]."**

### Examples:
- After I pour my morning coffee, I will meditate for 2 minutes
- After I sit down at my desk, I will write my top 3 priorities
- After I finish dinner, I will go for a 10-minute walk

### How to Use Habit Stacking in RESURGO

1. Create a new habit
2. In the "Trigger Habit" field, select an existing habit
3. RESURGO will remind you to complete the new habit right after the trigger

### Why It Works
Your brain is already primed to perform the trigger habit. By linking the new behavior to it, you're essentially "hitching a ride" on an existing neural pathway.

### Best Practices
- Choose a trigger that happens at the same time/place daily
- Make the new habit small enough to complete quickly
- Be specific about both the trigger and the new habit
        `,
      },
      {
        id: 'ai-goals',
        title: 'Setting Up Goals with AI',
        summary: 'Let RESURGO AI break down your big goals into achievable milestones',
        readTime: 5,
        content: `
## Setting Up Goals with AI Decomposition

RESURGO's AI uses Atomic Habits principles to transform your big goals into actionable daily tasks.

### How It Works

1. **Create a Goal**: Tap + > New Goal
2. **Describe Your Goal**: Be specific (e.g., "Learn to play guitar well enough to perform 3 songs")
3. **Set a Target Date**: When do you want to achieve this?
4. **Let AI Work**: Our AI analyzes your goal and creates:
   - Weekly milestones
   - Daily tasks using the Two-Minute Rule
   - Identity statements
   - Habit stacks

### What You Get

- **Identity Statement**: "I am becoming the type of person who..."
- **Milestones**: 3-4 weekly checkpoints to track progress
- **Daily Tasks**: Small, achievable tasks that take 10-30 minutes
- **Habit Suggestions**: New habits to support your goal

### Tips for Better Results
- Be specific about your end goal
- Include measurable outcomes if possible
- Mention any constraints (time, resources)
- Free users get 1 AI decomposition; Pro users get unlimited
        `,
      },
      {
        id: 'navigation',
        title: 'Navigating the App',
        summary: 'A tour of RESURGO main screens and features',
        readTime: 3,
        content: `
## Navigating RESURGO

Let's take a quick tour of the main areas in RESURGO.

### Bottom Navigation
- **Home**: Your daily dashboard with today's habits and tasks
- **Calendar**: See your completion history and plan ahead
- **+ Button**: Add new habits, goals, or tasks
- **Stats**: View your streaks, analytics, and progress
- **Settings**: Account, preferences, and subscription

### Home Screen
- Today's habits to complete
- Current streak and XP progress
- Active goals and milestones
- Quick actions

### Sidebar Menu
- Profile and achievements
- All habits (including archived)
- All goals
- Pomodoro timer
- Data export (Pro)

### Quick Actions
- Swipe right on a habit to mark complete
- Swipe left to skip (maintains streak awareness)
- Tap for more options and details
        `,
      },
    ],
  },
  'features': {
    title: 'Features Guide',
    description: 'Learn how to use every RESURGO feature to maximize your productivity.',
    icon: 'FG',
    articles: [
      {
        id: 'pomodoro',
        title: 'Pomodoro Timer',
        summary: 'Use the built-in focus timer to boost productivity',
        readTime: 3,
        content: `
## Using the Pomodoro Timer

The Pomodoro Technique helps you work in focused bursts with regular breaks.

### Default Settings
- **Focus**: 25 minutes
- **Short Break**: 5 minutes
- **Long Break**: 15 minutes (after 4 focus sessions)

### How to Use
1. Open the Pomodoro Timer from the sidebar
2. Select a habit or task to work on (optional)
3. Tap "Start Focus"
4. Work until the timer ends
5. Take your break
6. Repeat!

### Automatic Tracking
When you link a task to your Pomodoro session, RESURGO automatically:
- Logs time spent on the task
- Marks the task complete when you finish
- Awards bonus XP for focused work

### Customization (Pro)
Pro users can customize timer durations and sounds in Settings.
        `,
      },
      {
        id: 'gamification',
        title: 'Gamification & XP System',
        summary: 'Understand how XP, levels, and achievements work',
        readTime: 4,
        content: `
## Gamification in RESURGO

RESURGO uses game mechanics to make habit building fun and rewarding.

### Earning XP
- Complete a habit: 10-50 XP (based on difficulty)
- Maintain streak: Multiplier bonus
- Complete milestones: 100 XP
- Achieve goals: 500 XP
- Daily all-clear: 25 XP bonus

### Levels
- Level 1-10: Novice
- Level 11-25: Apprentice
- Level 26-50: Achiever
- Level 51-75: Master
- Level 76-100: Legend

### Achievements & Badges
Unlock badges for:
- Streak milestones (7, 14, 30, 60, 100 days)
- Completing goals
- Using features
- Special events

### Leaderboards (Pro)
Compete with friends or the global community on weekly and monthly leaderboards.
        `,
      },
    ],
  },
  'habits-goals': {
    title: 'Habits & Goals',
    description: 'Master habit building with proven Atomic Habits principles.',
    icon: 'HG',
    articles: [
      {
        id: 'four-laws',
        title: 'The Four Laws of Behavior Change',
        summary: 'The core framework from Atomic Habits that powers RESURGO',
        readTime: 6,
        content: `
## The Four Laws of Behavior Change

RESURGO is built on James Clear's Four Laws from Atomic Habits. Here's how each applies:

### Law 1: Make It Obvious (Cue)
- **RESURGO Feature**: Trigger habits, notifications, calendar reminders
- **How to Apply**: 
  - Set specific times for habits
  - Use habit stacking
  - Enable smart notifications

### Law 2: Make It Attractive (Craving)
- **RESURGO Feature**: XP rewards, streaks, achievements, temptation bundling
- **How to Apply**:
  - Pair habits with things you enjoy
  - Join the community for accountability
  - Celebrate your wins

### Law 3: Make It Easy (Response)
- **RESURGO Feature**: Two-Minute Rule, habit simplification, environment priming
- **How to Apply**:
  - Start with tiny habits
  - Reduce friction (prepare the night before)
  - Use the 2-minute version first

### Law 4: Make It Satisfying (Reward)
- **RESURGO Feature**: Immediate XP, visual streaks, achievement unlocks
- **How to Apply**:
  - Check off your habits (dopamine hit!)
  - Watch your streak grow
  - Review your progress weekly
        `,
      },
      {
        id: 'two-minute-rule',
        title: 'The Two-Minute Rule Explained',
        summary: 'How to make any habit easy to start',
        readTime: 4,
        content: `
## The Two-Minute Rule

"When you start a new habit, it should take less than two minutes to do." - James Clear

### Why It Works
The hardest part of any habit is starting. The Two-Minute Rule removes the barrier by making the habit so small you can't say no.

### Examples
| Full Habit | Two-Minute Version |
|------------|-------------------|
| Read 30 pages | Read one page |
| Do 30 min yoga | Roll out yoga mat |
| Study for 2 hours | Open my notes |
| Run 5 miles | Put on running shoes |

### In RESURGO
When AI decomposes your goals, it automatically creates Two-Minute versions:
- "Start small: [2-min version]"
- "Full: [complete task]"

### The Gateway Habit
The Two-Minute version is a "gateway habit" - once you start, you often continue. But even if you don't, you've reinforced the behavior.

### Pro Tip
Master showing up before you optimize performance. Consistency beats intensity.
        `,
      },
    ],
  },
  'account': {
    title: 'Account & Billing',
    description: 'Manage your subscription, profile, and settings.',
    icon: 'AC',
    articles: [
      {
        id: 'upgrade-pro',
        title: 'How to Upgrade to Pro',
        summary: 'Step-by-step guide to unlocking premium features',
        readTime: 2,
        content: `
## Upgrading to RESURGO Pro

### What You Get with Pro
- Unlimited habits and goals
- Unlimited AI coaching with Kai
- Advanced analytics and insights
- Data export (JSON/CSV)
- Custom themes and sounds
- Priority support

### How to Upgrade
1. Go to **Settings** > **Subscription**
2. Tap **"Upgrade to Pro"**
3. Choose your plan:
   - Monthly: $4.99/month
   - Yearly: $29.99/year (save 50%!)
   - Lifetime: $49.99 one-time
4. Complete payment via Dodo Payments
5. Enjoy instant access!

### Payment Methods
We accept all major credit cards, Apple Pay, and Google Pay.

### Billing FAQ
- Cancel anytime - no questions asked
- 14-day money-back guarantee
- Charges appear as "RESURGO" on your statement
        `,
      },
      {
        id: 'data-export',
        title: 'Exporting Your Data',
        summary: 'Download your habits, goals, and progress data',
        readTime: 2,
        content: `
## Exporting Your Data (Pro Feature)

Your data belongs to you. Pro users can export everything.

### How to Export
1. Go to **Settings** > **Data**
2. Tap **"Export Data"**
3. Choose format: **JSON** or **CSV**
4. Select what to export:
   - Habits & completion history
   - Goals & milestones
   - Statistics & streaks
   - All of the above
5. Download your file

### Data Formats
- **JSON**: Best for developers or importing elsewhere
- **CSV**: Best for spreadsheets (Excel, Google Sheets)

### Automatic Backups
Pro users also get automatic cloud backups every 24 hours.
        `,
      },
    ],
  },
  'troubleshooting': {
    title: 'Troubleshooting',
    description: 'Solutions to common issues and problems.',
    icon: 'TS',
    articles: [
      {
        id: 'streaks-not-counting',
        title: 'Streaks Not Counting Correctly',
        summary: 'Fix issues with streak tracking',
        readTime: 3,
        content: `
## Fixing Streak Issues

If your streaks aren't counting correctly, try these solutions:

### Check Your Timezone
Streaks reset at midnight in YOUR timezone.
1. Go to **Settings** > **Preferences**
2. Verify your timezone is correct
3. If wrong, update and wait 24 hours

### Did You Complete ALL Habits?
Your daily streak counts consecutive days where you completed ALL active habits, not just some.

### Grace Period
RESURGO uses a "never miss twice" approach:
- Miss 1 day: Streak pauses (not reset)
- Miss 2 days: Streak resets

### Still Having Issues?
1. Try logging out and back in
2. Clear app cache (Settings > Clear Cache)
3. Contact support with your username
        `,
      },
      {
        id: 'notifications',
        title: 'Notifications Not Working',
        summary: 'Troubleshoot notification issues',
        readTime: 3,
        content: `
## Fixing Notification Issues

### Step 1: Check RESURGO Settings
1. Go to **Settings** > **Notifications**
2. Ensure notifications are **enabled**
3. Set your preferred reminder times

### Step 2: Check Device Settings
**iPhone/iPad:**
1. Settings > RESURGO > Notifications > Allow

**Android:**
1. Settings > Apps > RESURGO > Notifications > Enable

**Web/Desktop:**
1. Click the lock icon in your browser address bar
2. Allow notifications for RESURGO

### Step 3: PWA Installation
For best results, install RESURGO as a PWA:
1. Open RESURGO in your browser
2. Tap "Add to Home Screen"
3. Launch from your home screen

### Still Not Working?
Some browsers (especially Safari) have stricter notification policies. Try Chrome or Firefox for best results.
        `,
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}): Promise<Metadata> {
  const { category } = await params;
  const data = categoriesData[category];
  
  if (!data) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${data.title} - RESURGO Help Center`,
    description: data.description,
    openGraph: {
      title: `${data.title} - RESURGO Help Center`,
      description: data.description,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default async function HelpCategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;
  const data = categoriesData[category];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <nav className="text-sm text-[var(--text-muted)]">
          <Link href="/help" className="hover:text-[var(--accent)]">Help Center</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">{data.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
            <span className="text-3xl">{data.icon}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{data.title}</h1>
            <p className="text-[var(--text-secondary)]">{data.description}</p>
          </div>
        </div>
      </header>

      {/* Articles List */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {data.articles.map((article) => (
            <Link
              key={article.id}
              href={`/help/${category}/${article.id}`}
              className="block glass-card p-6 hover:border-[var(--accent)]/50 transition-all group"
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                {article.title}
              </h2>
              <p className="text-[var(--text-secondary)] mb-3">{article.summary}</p>
              <span className="text-sm text-[var(--text-muted)]">
                {article.readTime} min read
              </span>
            </Link>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Help Center
          </Link>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE STATIC PARAMS
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  return Object.keys(categoriesData).map((category) => ({
    category,
  }));
}
