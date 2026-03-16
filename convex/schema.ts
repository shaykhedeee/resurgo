// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex Database Schema
// AI-Powered Life Transformation System — Real-time, Type-safe, Serverless
// Complete schema per DETAILEDPLANASCEND.md Parts 3-9
// ═══════════════════════════════════════════════════════════════════════════════

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// ─── Shared validators ──────────────────────────────────────────────────────
const lifeDomainValidator = v.union(
  v.literal('health'),
  v.literal('career'),
  v.literal('finance'),
  v.literal('learning'),
  v.literal('relationships'),
  v.literal('creativity'),
  v.literal('mindfulness'),
  v.literal('personal_growth')
);

const goalTypeValidator = v.union(
  v.literal('achievement'),
  v.literal('transformation'),
  v.literal('skill'),
  v.literal('project'),
  v.literal('quantitative'),
  v.literal('maintenance'),
  v.literal('elimination'),
  v.literal('relationship')
);

export default defineSchema({
  // ─────────────────────────────────────────────────────────────────────────────
  // USERS — Synced with Clerk (enhanced with vision & life design)
  // ─────────────────────────────────────────────────────────────────────────────
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
    billingPeriod: v.optional(v.union(v.literal('month'), v.literal('year'), v.literal('lifetime'))),
    timezone: v.optional(v.string()),
    theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
    onboardingComplete: v.boolean(),
    streakFreezeCount: v.number(),
    // ── Onboarding preferences ──
    focusAreas: v.optional(v.array(v.string())),
    selectedHabitTemplates: v.optional(v.array(v.string())),
    preferredTime: v.optional(v.string()),
    primaryGoal: v.optional(v.string()),
    primaryGoalReason: v.optional(v.string()),
    primaryGoalDeadline: v.optional(v.string()),
    // ── Vision & Life Design (Module 1) ──
    lifeWheelScores: v.optional(v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      learning: v.number(),
      relationships: v.number(),
      creativity: v.number(),
      mindfulness: v.number(),
      personal_growth: v.number(),
    })),
    coreValues: v.optional(v.array(v.string())),
    lifeVision: v.optional(v.string()),
    visionBoard: v.optional(v.array(v.object({
      id: v.string(),
      imageUrl: v.string(),
      caption: v.optional(v.string()),
      domain: v.optional(v.string()),
    }))),
    // ── Schedule preferences (Onboarding) ──
    wakeTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    peakProductivityTime: v.optional(v.string()),
    workSchedule: v.optional(v.object({
      startTime: v.string(),
      endTime: v.string(),
      lunchStart: v.optional(v.string()),
      lunchEnd: v.optional(v.string()),
      workDays: v.array(v.number()),
    })),
    // ── Notification preferences ──
    notificationPrefs: v.optional(v.object({
      morningMotivation: v.boolean(),
      middayCheckin: v.boolean(),
      eveningWinddown: v.boolean(),
      taskReminders: v.boolean(),
      hydrationReminders: v.boolean(),
      focusSessionReminders: v.boolean(),
      sleepReminders: v.boolean(),
      weeklyReviewReminders: v.boolean(),
      quietHoursEnabled: v.boolean(),
      quietHoursStart: v.string(),
      quietHoursEnd: v.string(),
      reminderStyle: v.union(
        v.literal('gentle'),
        v.literal('supportive'),
        v.literal('persistent'),
        v.literal('minimal')
      ),
      coachingFrequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('struggling_only'),
        v.literal('manual')
      ),
    })),
    // ── Coach personality ──
    coachPersonality: v.optional(v.union(
      v.literal('supportive'),
      v.literal('challenging'),
      v.literal('analytical'),
      v.literal('humorous')
    )),
    // ── Recovery state ──
    lastActiveAt: v.optional(v.number()),
    recoveryStatus: v.optional(v.union(
      v.literal('active'),
      v.literal('at_risk'),
      v.literal('inactive'),
      v.literal('recovering')
    )),
    // ── Billing concurrency guard ──
    planVersion: v.optional(v.number()),     // monotonic counter, incremented on each plan change
    planUpdatedAt: v.optional(v.number()),   // ms timestamp of last plan update for stale-event guard
    lastBillingEventId: v.optional(v.string()), // last applied webhook event id
    // ── Telegram integration ──
    telegramChatId: v.optional(v.string()),  // Telegram chat ID after /start auth flow
    telegramLinked: v.optional(v.boolean()), // true after user has completed link flow
    // ── Native push (FCM) ──
    fcmToken: v.optional(v.string()),             // Firebase Cloud Messaging device token
    fcmTokenUpdatedAt: v.optional(v.number()),    // Timestamp of last token update
    pushEnabled: v.optional(v.boolean()),          // Whether native push is active
    // ── Referral ──
    referralCode: v.optional(v.string()),    // unique code for referral tracking
    // ── Coach selection ──
    selectedCoach: v.optional(v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
      v.literal('ORACLE'),
      v.literal('NEXUS'),
    )),
    // ── Emergency mode (AI-triggered) ──
    emergencyMode: v.optional(v.boolean()),
    emergencyModeReason: v.optional(v.string()),
    emergencyModeActivatedAt: v.optional(v.number()),
    // ── AI coach memory ──
    summaryMemory: v.optional(v.string()), // Short rolling AI memory string
    // ── User archetype (Section 25 — onboarding segmentation) ──
    archetype: v.optional(v.string()),          // UserArchetype enum value
    archetypeConfidence: v.optional(v.number()),
    secondaryArchetype: v.optional(v.string()),
    onboardingData: v.optional(v.string()),     // JSON of onboarding answers
    // ── Dashboard layout ──
    dashboardLayout: v.optional(v.array(v.object({
      id: v.string(),
      visible: v.boolean(),
      order: v.number(),
    }))),
    // ── Dodo Payments ──
    dodoCustomerId: v.optional(v.string()), // Dodo Payments customer ID for checkout/portal
    dodoSubscriptionId: v.optional(v.string()), // Active Dodo subscription ID (for plan changes / cancellation)
    subscriptionStatus: v.optional(v.union(
      v.literal('pending'),
      v.literal('active'),
      v.literal('on_hold'),
      v.literal('cancelled'),
      v.literal('failed'),
      v.literal('expired'),
    )),
    nextBillingDate: v.optional(v.string()), // ISO date of next renewal
    cancelAtNextBillingDate: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email'])
    .index('by_telegramChatId', ['telegramChatId'])
    .index('by_dodoCustomerId', ['dodoCustomerId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GOALS — Enhanced with decomposition engine (Module 2)
  // ─────────────────────────────────────────────────────────────────────────────
  goals: defineTable({
    userId: v.id('users'),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('paused'),
      v.literal('abandoned')
    ),
    progress: v.number(), // 0-100
    targetDate: v.optional(v.string()), // ISO date
    startDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    aiPlan: v.optional(v.any()),
    // ── Goal decomposition fields ──
    goalType: v.optional(goalTypeValidator),
    lifeDomain: v.optional(lifeDomainValidator),
    deadlineType: v.optional(v.union(
      v.literal('fixed'),
      v.literal('flexible'),
      v.literal('ongoing')
    )),
    progressType: v.optional(v.union(
      v.literal('percentage'),
      v.literal('milestones'),
      v.literal('numeric_target')
    )),
    targetValue: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    decompositionStatus: v.optional(v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('completed')
    )),
    aiConfidenceScore: v.optional(v.number()),
    whyImportant: v.optional(v.string()),
    successCriteria: v.optional(v.array(v.string())),
    rewards: v.optional(v.array(v.string())),
    difficultyLevel: v.optional(v.number()), // 1-10
    estimatedHours: v.optional(v.number()),
    parentGoalId: v.optional(v.id('goals')),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    visionConnection: v.optional(v.string()),
    completionDate: v.optional(v.number()),
    // ── Downgrade preservation ──
    archivedByDowngrade: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_parentGoalId', ['parentGoalId'])
    .index('by_userId_archivedByDowngrade', ['userId', 'archivedByDowngrade']),

  // ─────────────────────────────────────────────────────────────────────────────
  // MILESTONES — Goal decomposition intermediate steps
  // ─────────────────────────────────────────────────────────────────────────────
  milestones: defineTable({
    userId: v.id('users'),
    goalId: v.id('goals'),
    title: v.string(),
    description: v.optional(v.string()),
    sequenceOrder: v.number(),
    targetDate: v.optional(v.string()),
    completedDate: v.optional(v.number()),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('skipped')
    ),
    progressPercentage: v.number(), // 0-100
    completionCriteria: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_goalId', ['goalId'])
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABITS — Enhanced with types, progression, and stacking (Module 4)
  // ─────────────────────────────────────────────────────────────────────────────
  habits: defineTable({
    userId: v.id('users'),
    goalId: v.optional(v.id('goals')),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    frequency: v.union(
      v.literal('daily'),
      v.literal('weekdays'),
      v.literal('weekends'),
      v.literal('3x_week'),
      v.literal('weekly'),
      v.literal('custom')
    ),
    customDays: v.optional(v.array(v.number())),
    timeOfDay: v.union(
      v.literal('morning'),
      v.literal('afternoon'),
      v.literal('evening'),
      v.literal('anytime')
    ),
    identityLabel: v.optional(v.string()),
    isActive: v.boolean(),
    streakCurrent: v.number(),
    streakLongest: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    order: v.optional(v.number()),
    // ── Enhanced habit type system ──
    habitType: v.optional(v.union(
      v.literal('yes_no'),
      v.literal('quantity'),
      v.literal('duration'),
      v.literal('negative'),
      v.literal('range'),
      v.literal('checklist')
    )),
    targetValue: v.optional(v.number()),
    targetUnit: v.optional(v.string()),
    checklistItems: v.optional(v.array(v.string())),
    // ── Habit Stacking cue ──
    cueType: v.optional(v.union(
      v.literal('time'),
      v.literal('location'),
      v.literal('action'),
      v.literal('emotion'),
      v.literal('none')
    )),
    cueDescription: v.optional(v.string()),
    afterHabitId: v.optional(v.id('habits')),
    // ── Progression system ──
    difficultyLevel: v.optional(v.number()),
    autoProgressionEnabled: v.optional(v.boolean()),
    progressionIntervalDays: v.optional(v.number()),
    progressionIncreaseAmount: v.optional(v.number()),
    // ── Stats ──
    totalCompletions: v.optional(v.number()),
    completionRate7Day: v.optional(v.number()),
    completionRate30Day: v.optional(v.number()),
    lastCompletedAt: v.optional(v.number()),
    // ── Motivation ──
    whyImportant: v.optional(v.string()),
    immediateReward: v.optional(v.string()),
    // ── Specific time ──
    specificTime: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    // ── Downgrade preservation ──
    archivedByDowngrade: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_active', ['userId', 'isActive'])
    .index('by_goalId', ['goalId'])
    .index('by_userId_archivedByDowngrade', ['userId', 'archivedByDowngrade']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABIT LOGS — Enhanced with energy/difficulty tracking
  // ─────────────────────────────────────────────────────────────────────────────
  habitLogs: defineTable({
    habitId: v.id('habits'),
    userId: v.id('users'),
    date: v.string(),
    status: v.union(
      v.literal('completed'),
      v.literal('skipped'),
      v.literal('failed')
    ),
    mood: v.optional(v.number()),
    note: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    // ── Enhanced tracking ──
    value: v.optional(v.number()),
    energyLevel: v.optional(v.union(
      v.literal('high'),
      v.literal('medium'),
      v.literal('low')
    )),
    difficulty: v.optional(v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    )),
    loggedVia: v.optional(v.union(
      v.literal('manual'),
      v.literal('auto'),
      v.literal('reminder')
    )),
  })
    .index('by_habitId', ['habitId'])
    .index('by_habitId_date', ['habitId', 'date'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TASKS — Enhanced with goal/milestone linking, energy, Eisenhower (Module 3)
  // ─────────────────────────────────────────────────────────────────────────────
  tasks: defineTable({
    userId: v.id('users'),
    listId: v.optional(v.id('taskLists')),
    goalId: v.optional(v.id('goals')),
    milestoneId: v.optional(v.id('milestones')),
    parentTaskId: v.optional(v.id('tasks')),
    title: v.string(),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('urgent')
    ),
    status: v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done')),
    dueDate: v.optional(v.string()),
    dueTime: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    subtasks: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          completed: v.boolean(),
        })
      )
    ),
    completedAt: v.optional(v.number()),
    // ── Enhanced task fields ──
    eisenhowerQuadrant: v.optional(v.union(
      v.literal('urgent_important'),
      v.literal('important'),
      v.literal('urgent'),
      v.literal('neither')
    )),
    energyRequired: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    isRecurring: v.optional(v.boolean()),
    recurrenceRule: v.optional(v.object({
      frequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('monthly')
      ),
      interval: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
    })),
    source: v.optional(v.union(
      v.literal('manual'),
      v.literal('ai_generated'),
      v.literal('recurring'),
      v.literal('decomposition'),
      v.literal('imported'),
      v.literal('telegram')
    )),
    xpValue: v.optional(v.number()),
    context: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_listId', ['listId'])
    .index('by_goalId', ['goalId'])
    .index('by_milestoneId', ['milestoneId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TASK LISTS — Group tasks (Personal, Work, etc.)
  // ─────────────────────────────────────────────────────────────────────────────
  taskLists: defineTable({
    userId: v.id('users'),
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GAMIFICATION — Enhanced with coins, power-ups, XP history (Part 4)
  // ─────────────────────────────────────────────────────────────────────────────
  gamification: defineTable({
    userId: v.id('users'),
    totalXP: v.number(),
    level: v.number(),
    coins: v.optional(v.number()),
    currentLevelXP: v.optional(v.number()),
    xpToNextLevel: v.optional(v.number()),
    // ── Level tier system ──
    tier: v.optional(v.union(
      v.literal('beginner'),
      v.literal('explorer'),
      v.literal('achiever'),
      v.literal('master'),
      v.literal('legend')
    )),
    achievements: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        icon: v.string(),
        unlockedAt: v.number(),
        category: v.optional(v.string()),
        rarity: v.optional(v.union(
          v.literal('common'),
          v.literal('rare'),
          v.literal('epic'),
          v.literal('legendary')
        )),
        xpReward: v.optional(v.number()),
        coinReward: v.optional(v.number()),
      })
    ),
    badges: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          icon: v.string(),
        })
      )
    ),
    // ── Power-ups owned ──
    powerUps: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.string(),
      quantity: v.number(),
    }))),
    // ── Streaks ──
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    streakShieldsUsed: v.optional(v.number()),
    lastStreakDate: v.optional(v.string()),
    // ── Stats ──
    totalTasksCompleted: v.optional(v.number()),
    totalHabitsCompleted: v.optional(v.number()),
    totalGoalsCompleted: v.optional(v.number()),
    totalFocusMinutes: v.optional(v.number()),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // XP HISTORY — Track XP earning events
  // ─────────────────────────────────────────────────────────────────────────────
  xpHistory: defineTable({
    userId: v.id('users'),
    amount: v.number(),
    source: v.union(
      v.literal('task_complete'),
      v.literal('habit_complete'),
      v.literal('goal_complete'),
      v.literal('milestone_complete'),
      v.literal('focus_session'),
      v.literal('streak_bonus'),
      v.literal('achievement'),
      v.literal('daily_login'),
      v.literal('weekly_review'),
      v.literal('perfect_day'),
      v.literal('comeback'),
      v.literal('other')
    ),
    description: v.string(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // MOOD / WELLNESS
  // ─────────────────────────────────────────────────────────────────────────────
  moodEntries: defineTable({
    userId: v.id('users'),
    date: v.string(),
    score: v.number(),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // JOURNAL — Reflection entries
  // ─────────────────────────────────────────────────────────────────────────────
  journal: defineTable({
    userId: v.id('users'),
    habitLogId: v.optional(v.id('habitLogs')),
    date: v.string(),
    content: v.string(),
    type: v.optional(v.union(
      v.literal('reflection'),
      v.literal('gratitude'),
      v.literal('goal_note'),
      v.literal('freeform')
    )),
    goalId: v.optional(v.id('goals')),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_goalId', ['goalId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // IDENTITIES — Atomic Habits identity tracking
  // ─────────────────────────────────────────────────────────────────────────────
  identities: defineTable({
    userId: v.id('users'),
    label: v.string(),
    description: v.optional(v.string()),
    evidence: v.array(
      v.object({
        id: v.string(),
        action: v.string(),
        date: v.string(),
        createdAt: v.number(),
      })
    ),
    habitIds: v.optional(v.array(v.id('habits'))),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // AI INSIGHTS — Enhanced with more types (Module 7)
  // ─────────────────────────────────────────────────────────────────────────────
  insights: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('coaching'),
      v.literal('pattern'),
      v.literal('suggestion'),
      v.literal('weekly_summary'),
      v.literal('correlation'),
      v.literal('prediction'),
      v.literal('celebration'),
      v.literal('prescription')
    ),
    content: v.string(),
    title: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
    metadata: v.optional(v.any()),
    viewed: v.optional(v.boolean()),
    viewedAt: v.optional(v.number()),
    dismissed: v.optional(v.boolean()),
    actionTaken: v.optional(v.boolean()),
    feedback: v.optional(v.number()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_type', ['userId', 'type']),

  // ─────────────────────────────────────────────────────────────────────────────
  // FOCUS SESSIONS — Enhanced with methods & distraction tracking (Module 6)
  // ─────────────────────────────────────────────────────────────────────────────
  focusSessions: defineTable({
    userId: v.id('users'),
    taskId: v.optional(v.id('tasks')),
    habitId: v.optional(v.id('habits')),
    duration: v.number(), // minutes planned
    actualDuration: v.optional(v.number()), // minutes actual
    completedAt: v.number(),
    type: v.union(
      v.literal('pomodoro'),
      v.literal('deep_work'),
      v.literal('flowtime'),
      v.literal('time_box'),
      v.literal('custom')
    ),
    // ── Enhanced focus tracking ──
    focusScore: v.optional(v.number()), // 0-100
    productivityRating: v.optional(v.number()), // 1-5
    completionStatus: v.optional(v.union(
      v.literal('completed'),
      v.literal('abandoned'),
      v.literal('interrupted')
    )),
    distractionCount: v.optional(v.number()),
    distractions: v.optional(v.array(v.object({
      timestamp: v.number(),
      description: v.optional(v.string()),
      duration: v.optional(v.number()),
    }))),
    breaksTaken: v.optional(v.number()),
    notes: v.optional(v.string()),
    // ── Ambient/environment ──
    ambientSound: v.optional(v.string()),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABIT STACKS — Chain habits together
  // ─────────────────────────────────────────────────────────────────────────────
  habitStacks: defineTable({
    userId: v.id('users'),
    name: v.string(),
    habitIds: v.array(v.id('habits')),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // DAILY PLANS — Morning intentions & evening reflections (Module 5)
  // ─────────────────────────────────────────────────────────────────────────────
  dailyPlans: defineTable({
    userId: v.id('users'),
    date: v.string(), // YYYY-MM-DD
    // ── Morning intention ──
    intention: v.optional(v.string()),
    topPriorities: v.optional(v.array(v.string())),
    // ── Time blocks ──
    timeBlocks: v.optional(v.array(v.object({
      id: v.string(),
      startTime: v.string(),
      endTime: v.string(),
      title: v.string(),
      type: v.union(
        v.literal('deep_work'),
        v.literal('shallow_work'),
        v.literal('meeting'),
        v.literal('break'),
        v.literal('personal'),
        v.literal('exercise'),
        v.literal('routine')
      ),
      taskId: v.optional(v.id('tasks')),
      completed: v.optional(v.boolean()),
    }))),
    // ── Daily score ──
    dailyScore: v.optional(v.number()), // 0-100
    tasksCompletedCount: v.optional(v.number()),
    tasksTotalCount: v.optional(v.number()),
    habitsCompletedCount: v.optional(v.number()),
    habitsTotalCount: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
    // ── Evening reflection ──
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowPlan: v.optional(v.string()),
    dayRating: v.optional(v.number()), // 1-5
    // ── Meta ──
    morningCompletedAt: v.optional(v.number()),
    eveningCompletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // WEEKLY REVIEWS — Auto-generated summaries (Module 7)
  // ─────────────────────────────────────────────────────────────────────────────
  weeklyReviews: defineTable({
    userId: v.id('users'),
    weekStartDate: v.string(), // ISO Monday date
    weekEndDate: v.string(),
    // ── Stats ──
    tasksCompleted: v.number(),
    tasksTotal: v.number(),
    habitsCompletionRate: v.number(), // 0-100
    focusTotalMinutes: v.number(),
    streakDays: v.number(),
    xpEarned: v.number(),
    goalsProgressed: v.optional(v.array(v.object({
      goalId: v.id('goals'),
      title: v.string(),
      progressChange: v.number(),
    }))),
    // ── Insights ──
    highlights: v.optional(v.array(v.string())),
    areasToImprove: v.optional(v.array(v.string())),
    aiSummary: v.optional(v.string()),
    // ── User input ──
    userReflection: v.optional(v.string()),
    nextWeekGoals: v.optional(v.array(v.string())),
    overallRating: v.optional(v.number()), // 1-5
    reviewed: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_week', ['userId', 'weekStartDate']),

  // ─────────────────────────────────────────────────────────────────────────────
  // RECOVERY LOGS — Comeback/recovery tracking (Module 8)
  // ─────────────────────────────────────────────────────────────────────────────
  recoveryLogs: defineTable({
    userId: v.id('users'),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('abandoned')
    ),
    // ── Detection ──
    triggerReason: v.union(
      v.literal('streak_break'),
      v.literal('long_absence'),
      v.literal('engagement_drop'),
      v.literal('user_initiated')
    ),
    daysInactive: v.number(),
    // ── Comeback protocol phase ──
    phase: v.union(
      v.literal('acknowledgement'),
      v.literal('assessment'),
      v.literal('minimal_restart'),
      v.literal('gradual_rebuild'),
      v.literal('full_momentum')
    ),
    // ── Recovery plan ──
    minimalRoutine: v.optional(v.array(v.string())),
    adjustedGoals: v.optional(v.array(v.string())),
    // ── Progress ──
    recoveryStreak: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status']),

  // ─────────────────────────────────────────────────────────────────────────────
  // COACHING MESSAGES — AI coach interactions (Module 9)
  // ─────────────────────────────────────────────────────────────────────────────
  coachMessages: defineTable({
    userId: v.id('users'),
    role: v.union(v.literal('coach'), v.literal('user')),
    content: v.string(),
    touchpoint: v.optional(v.union(
      v.literal('morning'),
      v.literal('midday'),
      v.literal('evening'),
      v.literal('on_demand'),
      v.literal('intervention'),
      v.literal('celebration')
    )),
    context: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GOAL TEMPLATES — Reusable templates library
  // ─────────────────────────────────────────────────────────────────────────────
  goalTemplates: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    lifeDomain: lifeDomainValidator,
    goalType: goalTypeValidator,
    estimatedWeeks: v.number(),
    difficultyLevel: v.number(),
    milestones: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      weekNumber: v.number(),
    })),
    suggestedHabits: v.optional(v.array(v.object({
      title: v.string(),
      frequency: v.string(),
      estimatedMinutes: v.number(),
    }))),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isPublic: v.boolean(),
    createdBy: v.optional(v.id('users')),
    usageCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_lifeDomain', ['lifeDomain']),

  // ─────────────────────────────────────────────────────────────────────────────
  // BILLING WEBHOOK EVENTS — Durable idempotency & audit trail
  // ─────────────────────────────────────────────────────────────────────────────
  billingWebhookEvents: defineTable({
    eventId: v.string(),
    eventType: v.string(),
    clerkId: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
    status: v.union(v.literal('applied'), v.literal('ignored')),
    reason: v.string(),
    processedAt: v.number(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_clerkId', ['clerkId'])
    .index('by_processedAt', ['processedAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // BILLING EVENTS — Expanded support/security audit trail
  // ─────────────────────────────────────────────────────────────────────────────
  billingEvents: defineTable({
    userId: v.optional(v.id('users')),
    clerkId: v.string(),
    eventId: v.string(),
    eventType: v.string(),
    source: v.union(v.literal('webhook'), v.literal('system'), v.literal('manual')),
    status: v.union(
      v.literal('received'),
      v.literal('applied'),
      v.literal('ignored'),
      v.literal('failed')
    ),
    plan: v.optional(v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime'))),
    reason: v.optional(v.string()),
    details: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_clerkId_and_createdAt', ['clerkId', 'createdAt'])
    .index('by_userId_and_createdAt', ['userId', 'createdAt'])
    .index('by_status_and_createdAt', ['status', 'createdAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // CHATBOT EVENTS — Intent/conversion instrumentation
  // ─────────────────────────────────────────────────────────────────────────────
  chatbotEvents: defineTable({
    clerkId: v.string(),
    eventName: v.union(
      v.literal('intent_detected'),
      v.literal('cta_shown'),
      v.literal('cta_clicked'),
      v.literal('resolution_confirmed')
    ),
    intent: v.optional(v.union(
      v.literal('greeting'),
      v.literal('help_feature'),
      v.literal('troubleshooting'),
      v.literal('pricing_question'),
      v.literal('upgrade_interest'),
      v.literal('habit_advice'),
      v.literal('motivation_needed'),
      v.literal('feedback'),
      v.literal('cancel_subscription'),
      v.literal('unknown')
    )),
    source: v.union(v.literal('api'), v.literal('client'), v.literal('system')),
    conversationId: v.optional(v.string()),
    messageLength: v.optional(v.number()),
    cta: v.optional(v.object({
      label: v.string(),
      href: v.string(),
    })),
    details: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index('by_clerkId_and_createdAt', ['clerkId', 'createdAt'])
    .index('by_eventName_and_createdAt', ['eventName', 'createdAt'])
    .index('by_createdAt', ['createdAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GROWTH EVENTS — Product-led growth instrumentation (vision board funnel)
  // ─────────────────────────────────────────────────────────────────────────────
  growthEvents: defineTable({
    clerkId: v.string(),
    eventName: v.union(
      v.literal('vision_board_viewed'),
      v.literal('vision_board_generate_clicked'),
      v.literal('vision_board_generation_success'),
      v.literal('vision_board_generation_failed'),
      v.literal('vision_board_pro_gate_hit'),
      v.literal('upgrade_clicked')
    ),
    source: v.union(v.literal('client'), v.literal('api'), v.literal('system')),
    page: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    details: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index('by_clerkId_and_createdAt', ['clerkId', 'createdAt'])
    .index('by_eventName_and_createdAt', ['eventName', 'createdAt'])
    .index('by_createdAt', ['createdAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // CHATBOT FOLLOW-UPS — Scheduled 24h/72h checkbacks
  // ─────────────────────────────────────────────────────────────────────────────
  chatbotFollowUps: defineTable({
    clerkId: v.string(),
    intent: v.union(
      v.literal('troubleshooting'),
      v.literal('motivation_needed')
    ),
    reason: v.union(v.literal('checkback_24h'), v.literal('checkback_72h')),
    status: v.union(v.literal('pending'), v.literal('sent'), v.literal('dismissed')),
    conversationId: v.optional(v.string()),
    dueAt: v.number(),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_clerkId_and_dueAt', ['clerkId', 'dueAt'])
    .index('by_status_and_dueAt', ['status', 'dueAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // REMINDERS — Scheduled reminders (from Telegram /remind command or app)
  // ─────────────────────────────────────────────────────────────────────────────
  reminders: defineTable({
    userId: v.id('users'),
    text: v.string(),
    remindAt: v.number(),           // Unix ms timestamp
    status: v.union(
      v.literal('pending'),
      v.literal('sent'),
      v.literal('dismissed')
    ),
    source: v.union(
      v.literal('telegram'),
      v.literal('app')
    ),
    telegramChatId: v.optional(v.string()), // if set, reminder is delivered to Telegram
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_status_remindAt', ['status', 'remindAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TELEGRAM CONTEXT — Last 10 messages per user for coherent multi-turn AI
  // ─────────────────────────────────────────────────────────────────────────────
  telegramContext: defineTable({
    userId: v.id('users'),
    telegramChatId: v.string(),
    messages: v.array(v.object({
      role: v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
      timestamp: v.number(),
    })),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_telegramChatId', ['telegramChatId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TELEGRAM OTPS — Short-lived tokens for the /start account-link auth flow
  // ─────────────────────────────────────────────────────────────────────────────
  telegramOtps: defineTable({
    clerkId: v.string(),
    token: v.string(),              // 6-char alphanumeric OTP
    telegramChatId: v.string(),
    telegramUsername: v.optional(v.string()),
    used: v.boolean(),
    expiresAt: v.number(),          // Unix ms timestamp (15 min TTL)
    createdAt: v.number(),
  })
    .index('by_token', ['token'])
    .index('by_clerkId', ['clerkId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // COACH MEMORY — AI persona long-term memory per user per coach
  // ─────────────────────────────────────────────────────────────────────────────
  coachMemory: defineTable({
    userId: v.id('users'),
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
      v.literal('ORACLE'),
      v.literal('NEXUS'),
    ),
    insights: v.array(v.string()),       // inferred behavioral patterns
    patterns: v.array(v.string()),       // recurring themes from history
    // Enhanced memory fields for self-learning
    preferredTopics: v.optional(v.array(v.string())),       // topics user engages with most
    communicationStyle: v.optional(v.string()),              // e.g. "concise and action-oriented", "detailed and empathetic"
    successPatterns: v.optional(v.array(v.string())),        // what advice/approaches led to action
    struggleAreas: v.optional(v.array(v.string())),          // recurring blockers/challenges
    emotionalTriggers: v.optional(v.array(v.string())),      // what motivates or demotivates them
    coachingEffectiveness: v.optional(v.object({
      totalAdviceGiven: v.number(),
      adviceActedOn: v.number(),
      avgResponseEngagement: v.number(),                     // 0-1 score based on follow-up depth
    })),
    lastAnalysisAt: v.optional(v.number()),
    messageCount: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_coachId', ['userId', 'coachId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // BUDGET TRANSACTIONS — Personal finance tracker
  // ─────────────────────────────────────────────────────────────────────────────
  transactions: defineTable({
    userId: v.id('users'),
    type: v.union(v.literal('income'), v.literal('expense')),
    amount: v.number(),                  // always positive
    currency: v.optional(v.string()),
    category: v.string(),
    subCategory: v.optional(v.string()),
    description: v.string(),
    date: v.string(),                    // YYYY-MM-DD
    isRecurring: v.optional(v.boolean()),
    recurringPeriod: v.optional(v.union(
      v.literal('daily'),
      v.literal('weekly'),
      v.literal('monthly'),
      v.literal('yearly'),
    )),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_userId_category', ['userId', 'category']),

  // ─────────────────────────────────────────────────────────────────────────────
  // BUDGET CATEGORIES — Spend envelopes / budgets per category
  // ─────────────────────────────────────────────────────────────────────────────
  budgetCategories: defineTable({
    userId: v.id('users'),
    name: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    monthlyBudget: v.number(),           // target spend ceiling per month
    type: v.union(v.literal('essential'), v.literal('discretionary'), v.literal('savings'), v.literal('investment')),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // FINANCIAL GOALS — Saving targets
  // ─────────────────────────────────────────────────────────────────────────────
  financialGoals: defineTable({
    userId: v.id('users'),
    title: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    currency: v.optional(v.string()),
    deadline: v.optional(v.string()),    // ISO date
    status: v.union(
      v.literal('active'),
      v.literal('completed'),
      v.literal('paused'),
    ),
    icon: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status']),

  // ─────────────────────────────────────────────────────────────────────────────
  // NUTRITION LOGS — Daily calorie + macro tracking
  // ─────────────────────────────────────────────────────────────────────────────
  nutritionLogs: defineTable({
    userId: v.id('users'),
    date: v.string(),                    // YYYY-MM-DD
    meals: v.array(v.object({
      name: v.string(),
      calories: v.number(),
      protein: v.optional(v.number()),   // g
      carbs: v.optional(v.number()),     // g
      fat: v.optional(v.number()),       // g
      time: v.optional(v.string()),
    })),
    totalCalories: v.number(),
    totalProtein: v.optional(v.number()),
    totalCarbs: v.optional(v.number()),
    totalFat: v.optional(v.number()),
    waterMl: v.optional(v.number()),
    steps: v.optional(v.number()),
    calorieGoal: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // SLEEP LOGS — Sleep quality & duration tracking
  // ─────────────────────────────────────────────────────────────────────────────
  sleepLogs: defineTable({
    userId: v.id('users'),
    date: v.string(),                    // YYYY-MM-DD (date of the night)
    bedtime: v.optional(v.string()),     // HH:MM
    wakeTime: v.optional(v.string()),    // HH:MM
    durationMinutes: v.optional(v.number()),
    quality: v.optional(v.number()),     // 1-5
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // BUSINESS GOALS — Business Command Center
  // ─────────────────────────────────────────────────────────────────────────────
  businessGoals: defineTable({
    userId: v.id('users'),
    businessName: v.optional(v.string()),
    type: v.union(
      v.literal('revenue'),
      v.literal('clients'),
      v.literal('launch'),
      v.literal('growth'),
      v.literal('product'),
      v.literal('marketing'),
      v.literal('operations'),
    ),
    title: v.string(),
    description: v.optional(v.string()),
    target: v.optional(v.number()),       // numeric target (e.g., revenue $)
    current: v.optional(v.number()),      // current value
    unit: v.optional(v.string()),         // $, clients, users, etc.
    deadline: v.optional(v.string()),     // ISO date
    status: v.union(
      v.literal('active'),
      v.literal('completed'),
      v.literal('paused'),
    ),
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      done: v.boolean(),
      dueDate: v.optional(v.string()),
    }))),
    aiTasks: v.optional(v.array(v.string())),  // AI-generated action items
    priority: v.optional(v.number()),     // 1-5
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status']),

  // ─────────────────────────────────────────────────────────────────────────────
  // WEBHOOKS — Zapier/Make outbound event subscriptions
  // ─────────────────────────────────────────────────────────────────────────────
  webhooks: defineTable({
    userId: v.id('users'),
    url: v.string(),
    events: v.array(v.string()),          // e.g. ['task.created', 'habit.logged']
    secret: v.optional(v.string()),       // HMAC secret for verification
    active: v.boolean(),
    name: v.optional(v.string()),
    lastFiredAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // API KEYS — Public developer API authentication
  // ─────────────────────────────────────────────────────────────────────────────
  apiKeys: defineTable({
    userId: v.id('users'),
    name: v.string(),
    keyHash: v.string(),                  // SHA-256 hash of the actual key
    keyPrefix: v.string(),                // first 8 chars for display (rsg_xxxx...)
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    rateLimitPerHour: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_keyHash', ['keyHash']),

  // ─────────────────────────────────────────────────────────────────────────────
  // REFERRALS — "Help shape your homeboy's life too"
  // ─────────────────────────────────────────────────────────────────────────────
  referrals: defineTable({
    referrerId: v.id('users'),
    refereeId: v.optional(v.id('users')),
    code: v.string(),
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
    ),
    rewardGranted: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_referrerId', ['referrerId'])
    .index('by_code', ['code']),

  // ─────────────────────────────────────────────────────────────────────────────
  // LEADS — Marketing lead capture
  // ─────────────────────────────────────────────────────────────────────────────
  leads: defineTable({
    email: v.string(),
    source: v.string(),
    offer: v.union(v.string(), v.null()),
    variant: v.union(v.string(), v.null()),
    referrer: v.union(v.string(), v.null()),
    userAgent: v.union(v.string(), v.null()),
    utmSource: v.union(v.string(), v.null()),
    utmMedium: v.union(v.string(), v.null()),
    utmCampaign: v.union(v.string(), v.null()),
    utmTerm: v.union(v.string(), v.null()),
    utmContent: v.union(v.string(), v.null()),
    capturedAt: v.number(),
    convertedToUser: v.boolean(),
    convertedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_source', ['source']),

  // ─────────────────────────────────────────────────────────────────────────────
  // MARKETING EVENTS — Marketing instrumentation events
  // ─────────────────────────────────────────────────────────────────────────────
  marketingEvents: defineTable({
    event: v.string(),
    path: v.union(v.string(), v.null()),
    properties: v.optional(v.any()),
    createdAt: v.number(),
    sessionId: v.optional(v.string()),
  })
    .index('by_event', ['event'])
    .index('by_createdAt', ['createdAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // META CAMPAIGNS — Cached Meta Marketing API campaign data
  // Synced periodically from Meta API to avoid hitting rate limits
  // ─────────────────────────────────────────────────────────────────────────────
  metaCampaigns: defineTable({
    metaCampaignId: v.string(),         // Meta campaign ID (e.g. "23856...")
    name: v.string(),
    status: v.string(),                  // ACTIVE, PAUSED, DELETED, ARCHIVED
    objective: v.string(),
    dailyBudget: v.optional(v.string()),
    lifetimeBudget: v.optional(v.string()),
    startTime: v.optional(v.string()),
    stopTime: v.optional(v.string()),
    // Latest insight snapshot
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    spend: v.optional(v.number()),
    cpc: v.optional(v.number()),
    ctr: v.optional(v.number()),
    conversions: v.optional(v.number()),
    costPerConversion: v.optional(v.number()),
    reach: v.optional(v.number()),
    // Metadata
    lastSyncedAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_metaCampaignId', ['metaCampaignId'])
    .index('by_status', ['status'])
    .index('by_lastSyncedAt', ['lastSyncedAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // META CONVERSION EVENTS — Server-side conversion event log
  // ─────────────────────────────────────────────────────────────────────────────
  metaConversionEvents: defineTable({
    eventName: v.string(),              // e.g. CompleteRegistration, Purchase, Lead
    eventId: v.string(),                // Dedup ID shared with pixel
    userId: v.optional(v.string()),     // Clerk user ID if authenticated
    sourceUrl: v.optional(v.string()),
    customData: v.optional(v.any()),    // Event params
    sentToMeta: v.boolean(),
    metaResponse: v.optional(v.string()), // JSON stringified response
    createdAt: v.number(),
  })
    .index('by_eventName', ['eventName'])
    .index('by_createdAt', ['createdAt'])
    .index('by_eventId', ['eventId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // PARTNER ACTION LEDGER — Idempotency tracker for Partner Engine clientRefs
  // Each action the AI proposes carries a clientRef. We record it here so that
  // retries / duplicate submissions never create duplicate records.
  // ─────────────────────────────────────────────────────────────────────────────
  partnerActionLedger: defineTable({
    userId: v.id('users'),
    clientRef: v.string(),       // unique per action, format: "date:TYPE:N"
    actionType: v.string(),      // e.g. "task.upsert"
    appliedAt: v.number(),       // ms timestamp
    entityId: v.optional(v.string()),  // resulting Convex _id (string) if created/updated
    resultData: v.optional(v.string()), // JSON summary for the change feed
  })
    .index('by_userId_clientRef', ['userId', 'clientRef'])
    .index('by_userId_appliedAt', ['userId', 'appliedAt']),

  // ───────────────────────────────────────────────────────────────────────────
  // PSYCH PROFILES — Psychology Engine (OCEAN + CBT + SDT)
  // Stores AI-inferred coaching style per user. NEVER shown to user.
  // Built gradually over 30+ interactions. Private, deletable (GDPR).
  // ───────────────────────────────────────────────────────────────────────────
  psychProfiles: defineTable({
    userId: v.id('users'),
    profileData: v.string(),    // JSON-serialised PsychProfile
    interactionCount: v.number(),
    lastUpdated: v.number(),
  })
    .index('by_user', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // DEEP SCAN — Enhanced onboarding data (5-stage Deep Scan Protocol)
  // ─────────────────────────────────────────────────────────────────────────────
  deepScans: defineTable({
    userId: v.id('users'),
    // ── Stage 1: Identity Scan ──
    nickname: v.optional(v.string()),
    age: v.optional(v.number()),
    occupation: v.optional(v.string()),
    lifeStage: v.optional(v.string()),          // e.g. student, early_career, mid_career, transition, retirement
    // ── Stage 2: Life Pillar Assessment ──
    pillarScores: v.optional(v.object({
      health: v.number(),       // 1-10
      career: v.number(),
      finance: v.number(),
      relationships: v.number(),
      mindset: v.number(),
      creativity: v.number(),
      fun: v.number(),
      environment: v.number(),
    })),
    pillarPriorities: v.optional(v.array(v.string())),  // top 3 pillars to focus
    // ── Stage 3: Root Cause Analysis ──
    biggestChallenge: v.optional(v.string()),
    failedBefore: v.optional(v.string()),       // what they've tried before
    whatStopped: v.optional(v.string()),         // what stopped them
    sabotagePatterns: v.optional(v.array(v.string())), // self-sabotage patterns
    // ── Stage 4: Behavioral Fingerprint ──
    chronotype: v.optional(v.string()),         // early_bird, night_owl, variable
    energyPattern: v.optional(v.string()),      // steady, burst, slow_start
    motivationStyle: v.optional(v.string()),    // intrinsic, extrinsic, social, competitive
    accountabilityStyle: v.optional(v.string()),// self, partner, public, consequences
    stressResponse: v.optional(v.string()),     // fight, flight, freeze, fawn
    decisionStyle: v.optional(v.string()),      // analytical, intuitive, collaborative, decisive
    // ── Stage 5: Commitment Calibration ──
    commitmentLevel: v.optional(v.number()),    // 1-10
    dailyTimeAvailable: v.optional(v.number()), // minutes per day
    biggestFear: v.optional(v.string()),
    ninetyDayVision: v.optional(v.string()),
    startingDifficulty: v.optional(v.string()), // gentle, moderate, intense
    // ── AI-Generated Results ──
    aiDiagnosis: v.optional(v.string()),        // AI summary of findings
    aiRecommendations: v.optional(v.string()),  // JSON of recommended approach
    archetype: v.optional(v.string()),
    archetypeConfidence: v.optional(v.number()),
    // ── Meta ──
    completedStages: v.array(v.number()),       // [1,2,3,4,5]
    currentStage: v.number(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // DAILY CHECK-INS — Morning briefing + Evening debrief
  // ─────────────────────────────────────────────────────────────────────────────
  dailyCheckIns: defineTable({
    userId: v.id('users'),
    date: v.string(),             // YYYY-MM-DD
    // ── Morning Check-in ──
    morningMood: v.optional(v.number()),        // 1-5
    morningEnergy: v.optional(v.number()),      // 1-5
    sleepQuality: v.optional(v.number()),       // 1-5
    morningIntention: v.optional(v.string()),
    topThreePriorities: v.optional(v.array(v.string())),
    morningAiBriefing: v.optional(v.string()),  // AI-generated morning briefing
    morningCompletedAt: v.optional(v.number()),
    // ── Evening Check-in ──
    eveningMood: v.optional(v.number()),
    eveningEnergy: v.optional(v.number()),
    dayRating: v.optional(v.number()),          // 1-5
    biggestWin: v.optional(v.string()),
    biggestChallenge: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowFocus: v.optional(v.string()),
    eveningAiReflection: v.optional(v.string()), // AI-generated evening reflection
    eveningCompletedAt: v.optional(v.number()),
    // ── Stats (auto-populated) ──
    tasksCompleted: v.optional(v.number()),
    habitsCompleted: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
    xpEarned: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // AI GREETINGS — First Contact briefing after onboarding
  // ─────────────────────────────────────────────────────────────────────────────
  aiGreetings: defineTable({
    userId: v.id('users'),
    greeting: v.string(),           // Full AI-generated personalized greeting
    systemPlan: v.optional(v.string()),  // Personalized system configuration summary
    recommendations: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
      action: v.string(),           // href or action identifier
      priority: v.number(),
    }))),
    viewed: v.boolean(),
    viewedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ───────────────────────────────────────────────────────────────────────────
  // VISION BOARDS — AI-generated personalized vision boards (Section 24)
  // ───────────────────────────────────────────────────────────────────────────
  visionBoards: defineTable({
    userId: v.id('users'),
    config: v.string(),   // JSON-serialised VisionBoardConfig (includes images)
    version: v.number(),
    isActive: v.boolean(),
    boardType: v.optional(v.union(
      v.literal('goals'),      // Classic goal-based vision board
      v.literal('lifestyle'),  // Aspirational lifestyle board
      v.literal('yearly'),     // Annual vision board
      v.literal('domain'),     // Domain-specific (health, wealth, etc.)
      v.literal('gratitude'),  // What you're grateful for + future
      v.literal('custom'),     // Fully custom
    )),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isFavorite: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_active', ['userId', 'isActive']),

  // Vision Board image bookmarks (saved from stock search for later use)
  visionBoardImages: defineTable({
    userId: v.id('users'),
    imageUrl: v.string(),
    thumbUrl: v.string(),
    alt: v.string(),
    photographer: v.optional(v.string()),
    provider: v.string(),
    attribution: v.string(),
    domain: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_domain', ['userId', 'domain']),

  // ─────────────────────────────────────────────────────────────────────────────
  // WISHLIST ITEMS — Goal-oriented saving & purchase tracking (Wealth section)
  // ─────────────────────────────────────────────────────────────────────────────
  wishlistItems: defineTable({
    userId: v.id('users'),
    name: v.string(),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
    bought: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_bought', ['userId', 'bought']),

  // ─────────────────────────────────────────────────────────────────────────────
  // SCRATCH NOTES — Quick capture from dashboard "Quick Note" widget
  // ─────────────────────────────────────────────────────────────────────────────
  scratchNotes: defineTable({
    userId: v.id('users'),
    text: v.string(),
    source: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_createdAt', ['userId', 'createdAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // WORKOUT LOGS — Physical fitness activity tracking (Fitness section)
  // ─────────────────────────────────────────────────────────────────────────────
  workoutLogs: defineTable({
    userId: v.id('users'),
    date: v.string(),
    type: v.union(
      v.literal('cardio'),
      v.literal('strength'),
      v.literal('flexibility'),
      v.literal('sport'),
      v.literal('other'),
    ),
    name: v.optional(v.string()),
    durationMinutes: v.number(),
    notes: v.optional(v.string()),
    caloriesBurned: v.optional(v.number()),
    exercises: v.optional(v.array(v.object({
      name: v.string(),
      sets: v.optional(v.number()),
      reps: v.optional(v.number()),
      weight: v.optional(v.number()),
      weightUnit: v.optional(v.union(v.literal('kg'), v.literal('lb'))),
      durationSeconds: v.optional(v.number()),
      distance: v.optional(v.number()),
      distanceUnit: v.optional(v.union(v.literal('km'), v.literal('mi'))),
      notes: v.optional(v.string()),
    }))),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // COACH NOTIFICATIONS — Proactive AI coach nudges
  // ─────────────────────────────────────────────────────────────────────────────
  coachNotifications: defineTable({
    userId: v.id('users'),
    coachId: v.string(),
    type: v.string(),
    message: v.string(),
    actions: v.array(v.object({
      label: v.string(),
      action: v.string(),
    })),
    read: v.boolean(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_read', ['userId', 'read'])
    .index('by_userId_createdAt', ['userId', 'createdAt']),

  // ─────────────────────────────────────────────────────────────────────────────
  // EMAIL LOGS — Track lifecycle emails sent to prevent duplicates
  // ─────────────────────────────────────────────────────────────────────────────
  emailLogs: defineTable({
    userId: v.id('users'),
    emailType: v.string(),        // e.g. 'welcome', 'day3_tips', 'day7_streak', 'day14_checkin', 'day21_habit', 'day30_review', 'streak_at_risk', 'win_back'
    sentAt: v.number(),
    success: v.boolean(),
    resendId: v.optional(v.string()),
    error: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_emailType', ['userId', 'emailType']),
});
