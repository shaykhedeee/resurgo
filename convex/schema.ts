// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RESURGO â€” Convex Database Schema
// AI-Powered Life Transformation System â€” Real-time, Type-safe, Serverless
// Complete schema per DETAILEDPLANASCEND.md Parts 3-9
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// â”€â”€â”€ Shared validators â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // USERS â€” Synced with Clerk (enhanced with vision & life design)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    dailyTaskCap: v.optional(v.number()),
    // Fitness & Health Details
    phoneNumber: v.optional(v.string()),
    dob: v.optional(v.string()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    // â”€â”€ Quick-Start Onboarding (Phase 1) â”€â”€
    onboardingPath: v.optional(v.union(v.literal('quick-start'), v.literal('legacy'), v.literal('other'))),
    archetypeDetected: v.optional(v.union(
      v.literal('adhd'),
      v.literal('ambitious'),
      v.literal('student'),
      v.literal('athlete'),
      v.literal('other')
    )),
    layerLevel: v.optional(v.number()), // 1 (basic), 2 (unlocked), 3 (advanced)
    dayOneCompleted: v.optional(v.number()), // Timestamp when user completed first task + PWA install
    streakFreezeCount: v.number(),
    // â”€â”€ Onboarding preferences â”€â”€
    focusAreas: v.optional(v.array(v.string())),
    selectedHabitTemplates: v.optional(v.array(v.string())),
    preferredTime: v.optional(v.string()),
    primaryGoal: v.optional(v.string()),
    primaryGoalReason: v.optional(v.string()),
    primaryGoalDeadline: v.optional(v.string()),
    // â”€â”€ Vision & Life Design (Module 1) â”€â”€
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
    // â”€â”€ Schedule preferences (Onboarding) â”€â”€
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
    // â”€â”€ Notification preferences â”€â”€
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
    // â”€â”€ Coach personality â”€â”€
    coachPersonality: v.optional(v.union(
      v.literal('supportive'),
      v.literal('challenging'),
      v.literal('analytical'),
      v.literal('humorous')
    )),
    // â”€â”€ Recovery state â”€â”€
    lastActiveAt: v.optional(v.number()),
    recoveryStatus: v.optional(v.union(
      v.literal('active'),
      v.literal('at_risk'),
      v.literal('inactive'),
      v.literal('recovering')
    )),
    // â”€â”€ Billing concurrency guard â”€â”€
    planVersion: v.optional(v.number()),     // monotonic counter, incremented on each plan change
    planUpdatedAt: v.optional(v.number()),   // ms timestamp of last plan update for stale-event guard
    lastBillingEventId: v.optional(v.string()), // last applied webhook event id
    // â”€â”€ Telegram integration â”€â”€
    telegramChatId: v.optional(v.string()),  // Telegram chat ID after /start auth flow
    telegramLinked: v.optional(v.boolean()), // true after user has completed link flow
    // â”€â”€ Native push (FCM) â”€â”€
    fcmToken: v.optional(v.string()),             // Firebase Cloud Messaging device token
    fcmTokenUpdatedAt: v.optional(v.number()),    // Timestamp of last token update
    pushEnabled: v.optional(v.boolean()),          // Whether native push is active
    // â”€â”€ Referral â”€â”€
    referralCode: v.optional(v.string()),    // unique code for referral tracking
    // â”€â”€ Coach selection â”€â”€
    selectedCoach: v.optional(v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
      v.literal('ORACLE'),
      v.literal('NEXUS'),
      v.literal('ZENON'),
    )),
    // â”€â”€ Emergency mode (AI-triggered) â”€â”€
    emergencyMode: v.optional(v.boolean()),
    emergencyModeReason: v.optional(v.string()),
    emergencyModeActivatedAt: v.optional(v.number()),
    // â”€â”€ AI coach memory â”€â”€
    summaryMemory: v.optional(v.string()), // Short rolling AI memory string
    // â”€â”€ User archetype (Section 25 â€” onboarding segmentation) â”€â”€
    archetype: v.optional(v.string()),          // UserArchetype enum value
    archetypeConfidence: v.optional(v.number()),
    secondaryArchetype: v.optional(v.string()),
    onboardingData: v.optional(v.string()),     // JSON of onboarding answers
    // â”€â”€ Dashboard layout â”€â”€
    dashboardLayout: v.optional(v.array(v.object({
      id: v.string(),
      visible: v.boolean(),
      order: v.number(),
    }))),
    // â”€â”€ Dodo Payments â”€â”€
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
    // â”€â”€ Customer Engagement Score (0-100, recomputed weekly) â”€â”€
    engagementScore: v.optional(v.number()),
    engagementBand: v.optional(v.union(
      v.literal('power'),     // 80-100: upsell + referral
      v.literal('active'),    // 50-79:  healthy, nurture
      v.literal('at_risk'),   // 20-49:  win-back push + nudge
      v.literal('churning'),  // 0-19:   urgent email + offer
    )),
    engagementUpdatedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email'])
    .index('by_telegramChatId', ['telegramChatId'])
    .index('by_dodoCustomerId', ['dodoCustomerId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GOALS â€” Enhanced with decomposition engine (Module 2)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // â”€â”€ Goal decomposition fields â”€â”€
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
    // â”€â”€ Downgrade preservation â”€â”€
    archivedByDowngrade: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_parentGoalId', ['parentGoalId'])
    .index('by_userId_archivedByDowngrade', ['userId', 'archivedByDowngrade']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // MILESTONES â€” Goal decomposition intermediate steps
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // HABITS â€” Enhanced with types, progression, and stacking (Module 4)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // â”€â”€ Enhanced habit type system â”€â”€
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
    // â”€â”€ Habit Stacking cue â”€â”€
    cueType: v.optional(v.union(
      v.literal('time'),
      v.literal('location'),
      v.literal('action'),
      v.literal('emotion'),
      v.literal('none')
    )),
    cueDescription: v.optional(v.string()),
    afterHabitId: v.optional(v.id('habits')),
    // â”€â”€ Progression system â”€â”€
    difficultyLevel: v.optional(v.number()),
    autoProgressionEnabled: v.optional(v.boolean()),
    progressionIntervalDays: v.optional(v.number()),
    progressionIncreaseAmount: v.optional(v.number()),
    // â”€â”€ Stats â”€â”€
    totalCompletions: v.optional(v.number()),
    completionRate7Day: v.optional(v.number()),
    completionRate30Day: v.optional(v.number()),
    lastCompletedAt: v.optional(v.number()),
    // â”€â”€ Motivation â”€â”€
    whyImportant: v.optional(v.string()),
    immediateReward: v.optional(v.string()),
    // â”€â”€ Specific time â”€â”€
    specificTime: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    // â”€â”€ Downgrade preservation â”€â”€
    archivedByDowngrade: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_active', ['userId', 'isActive'])
    .index('by_goalId', ['goalId'])
    .index('by_userId_archivedByDowngrade', ['userId', 'archivedByDowngrade']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // HABIT LOGS â€” Enhanced with energy/difficulty tracking
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // â”€â”€ Enhanced tracking â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TASKS â€” Enhanced with goal/milestone linking, energy, Eisenhower (Module 3)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // â”€â”€ Enhanced task fields â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TASK LISTS â€” Group tasks (Personal, Work, etc.)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  taskLists: defineTable({
    userId: v.id('users'),
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GAMIFICATION â€” Enhanced with coins, power-ups, XP history (Part 4)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  gamification: defineTable({
    userId: v.id('users'),
    totalXP: v.number(),
    level: v.number(),
    coins: v.optional(v.number()),
    currentLevelXP: v.optional(v.number()),
    xpToNextLevel: v.optional(v.number()),
    // â”€â”€ Level tier system â”€â”€
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
    // â”€â”€ Power-ups owned â”€â”€
    powerUps: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.string(),
      quantity: v.number(),
    }))),
    // â”€â”€ Streaks â”€â”€
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    streakShieldsUsed: v.optional(v.number()),
    lastStreakDate: v.optional(v.string()),
    // â”€â”€ Stats â”€â”€
    totalTasksCompleted: v.optional(v.number()),
    totalHabitsCompleted: v.optional(v.number()),
    totalGoalsCompleted: v.optional(v.number()),
    totalFocusMinutes: v.optional(v.number()),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // XP HISTORY â€” Track XP earning events
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    .index('by_userId', ['userId'])
    .index('by_userId_createdAt', ['userId', 'createdAt']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // MOOD / WELLNESS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // JOURNAL â€” Reflection entries
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // IDENTITIES â€” Atomic Habits identity tracking
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // AI INSIGHTS â€” Enhanced with more types (Module 7)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // FOCUS SESSIONS â€” Enhanced with methods & distraction tracking (Module 6)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // â”€â”€ Enhanced focus tracking â”€â”€
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
    // â”€â”€ Ambient/environment â”€â”€
    ambientSound: v.optional(v.string()),
  })
    .index('by_userId', ['userId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // HABIT STACKS â€” Chain habits together
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  habitStacks: defineTable({
    userId: v.id('users'),
    name: v.string(),
    habitIds: v.array(v.id('habits')),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // DAILY PLANS â€” Morning intentions & evening reflections (Module 5)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  dailyPlans: defineTable({
    userId: v.id('users'),
    date: v.string(), // YYYY-MM-DD
    // â”€â”€ Morning intention â”€â”€
    intention: v.optional(v.string()),
    topPriorities: v.optional(v.array(v.string())),
    // â”€â”€ Time blocks â”€â”€
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
    // â”€â”€ Daily score â”€â”€
    dailyScore: v.optional(v.number()), // 0-100
    tasksCompletedCount: v.optional(v.number()),
    tasksTotalCount: v.optional(v.number()),
    habitsCompletedCount: v.optional(v.number()),
    habitsTotalCount: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
    // â”€â”€ Evening reflection â”€â”€
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowPlan: v.optional(v.string()),
    dayRating: v.optional(v.number()), // 1-5
    // â”€â”€ Meta â”€â”€
    morningCompletedAt: v.optional(v.number()),
    eveningCompletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // WEEKLY REVIEWS â€” Auto-generated summaries (Module 7)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  weeklyReviews: defineTable({
    userId: v.id('users'),
    weekStartDate: v.string(), // ISO Monday date
    weekEndDate: v.string(),
    // â”€â”€ Stats â”€â”€
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
    // â”€â”€ Insights â”€â”€
    highlights: v.optional(v.array(v.string())),
    areasToImprove: v.optional(v.array(v.string())),
    aiSummary: v.optional(v.string()),
    nextWeekFocus: v.optional(v.string()),
    // â”€â”€ User input â”€â”€
    userReflection: v.optional(v.string()),
    nextWeekGoals: v.optional(v.array(v.string())),
    overallRating: v.optional(v.number()), // 1-5
    reviewed: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_week', ['userId', 'weekStartDate']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // RECOVERY LOGS â€” Comeback/recovery tracking (Module 8)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  recoveryLogs: defineTable({
    userId: v.id('users'),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('abandoned')
    ),
    // â”€â”€ Detection â”€â”€
    triggerReason: v.union(
      v.literal('streak_break'),
      v.literal('long_absence'),
      v.literal('engagement_drop'),
      v.literal('user_initiated')
    ),
    daysInactive: v.number(),
    // â”€â”€ Comeback protocol phase â”€â”€
    phase: v.union(
      v.literal('acknowledgement'),
      v.literal('assessment'),
      v.literal('minimal_restart'),
      v.literal('gradual_rebuild'),
      v.literal('full_momentum')
    ),
    // â”€â”€ Recovery plan â”€â”€
    minimalRoutine: v.optional(v.array(v.string())),
    adjustedGoals: v.optional(v.array(v.string())),
    // â”€â”€ Progress â”€â”€
    recoveryStreak: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // COACHING MESSAGES â€” AI coach interactions (Module 9)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GOAL TEMPLATES â€” Reusable templates library
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BILLING WEBHOOK EVENTS â€” Durable idempotency & audit trail
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BILLING EVENTS â€” Expanded support/security audit trail
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHATBOT EVENTS â€” Intent/conversion instrumentation
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GROWTH EVENTS â€” Product-led growth instrumentation (vision board funnel)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHATBOT FOLLOW-UPS â€” Scheduled 24h/72h checkbacks
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // REMINDERS â€” Scheduled reminders (from Telegram /remind command or app)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TELEGRAM CONTEXT â€” Last 10 messages per user for coherent multi-turn AI
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TELEGRAM OTPS â€” Short-lived tokens for the /start account-link auth flow
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // COACH MEMORY â€” AI persona long-term memory per user per coach
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      v.literal('ZENON'),
    ),
    insights: v.array(v.string()),       // inferred behavioral patterns
    patterns: v.array(v.string()),       // recurring themes from history
    // Enhanced memory fields for self-learning
    preferredTopics: v.optional(v.array(v.string())),       // topics user engages with most
    communicationStyle: v.optional(v.string()),              // e.g. "concise and action-oriented", "detailed and empathetic"
    successPatterns: v.optional(v.array(v.string())),        // what advice/approaches led to action
    struggleAreas: v.optional(v.array(v.string())),          // recurring blockers/challenges
    emotionalTriggers: v.optional(v.array(v.string())),      // what motivates or demotivates them
    goalDecompositionProfile: v.optional(v.string()),           // how this user prefers plans broken down (micro vs macro, domains, detail level)
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


  // MEMORIES - Vector-indexed persistent AI memory
  memories: defineTable({
    userId: v.id('users'),
    coachId: v.optional(v.string()),
    content: v.string(),
    embedding: v.array(v.number()),
    type: v.union(v.literal('behavioral'), v.literal('achievement'), v.literal('failure'), v.literal('preference'), v.literal('insight'), v.literal('weekly_summary')),
    relevanceScore: v.optional(v.number()),
    sourceType: v.optional(v.union(v.literal('coaching_session'), v.literal('habit_completion'), v.literal('goal_event'), v.literal('weekly_review'), v.literal('mood_entry'))),
    sourceId: v.optional(v.string()),
    appliedAt: v.optional(v.number()),
    applyCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_type', ['userId', 'type'])
    .index('by_userId_createdAt', ['userId', 'createdAt'])
    .vectorIndex('by_embedding', { vectorField: 'embedding', dimensions: 1536, filterFields: ['userId'] }),

  // WEEKLY INTELLIGENCE - AI weekly performance reports
  weeklyIntelligence: defineTable({
    userId: v.id('users'),
    weekStartDate: v.string(),
    weekEndDate: v.string(),
    habitCompletionRate: v.number(),
    taskCompletionRate: v.number(),
    focusMinutes: v.number(),
    moodAverage: v.optional(v.number()),
    streakStatus: v.string(),
    topInsight: v.string(),
    winOfTheWeek: v.string(),
    areaToImprove: v.string(),
    nextWeekFocus: v.string(),
    personalizedMessage: v.string(),
    patternFlags: v.optional(v.array(v.string())),
    deliveredAt: v.optional(v.number()),
    viewedAt: v.optional(v.number()),
    telegramSent: v.optional(v.boolean()),
    emailSent: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_weekStart', ['userId', 'weekStartDate']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BUDGET TRANSACTIONS â€” Personal finance tracker
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BUDGET CATEGORIES â€” Spend envelopes / budgets per category
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // FINANCIAL GOALS â€” Saving targets
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // NUTRITION LOGS â€” Daily calorie + macro tracking
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // SLEEP LOGS â€” Sleep quality & duration tracking
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BUSINESS GOALS â€” Business Command Center
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // WEBHOOKS â€” Zapier/Make outbound event subscriptions
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // API KEYS â€” Public developer API authentication
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // REFERRALS â€” "Help shape your homeboy's life too"
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // LEADS â€” Marketing lead capture
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // MARKETING EVENTS â€” Marketing instrumentation events
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  marketingEvents: defineTable({
    event: v.string(),
    path: v.union(v.string(), v.null()),
    properties: v.optional(v.any()),
    createdAt: v.number(),
    sessionId: v.optional(v.string()),
  })
    .index('by_event', ['event'])
    .index('by_createdAt', ['createdAt']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GENERATED BLOG POSTS â€” Automated research-backed content engine
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  generatedBlogPosts: defineTable({
    slug: v.string(),
    title: v.string(),
    desc: v.string(),
    content: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('rejected')
    ),
    tags: v.array(v.string()),
    seoKeywords: v.array(v.string()),
    heroImage: v.string(),
    readTime: v.string(),
    research: v.object({
      googleTrends: v.array(v.object({
        title: v.string(),
        url: v.optional(v.string()),
        traffic: v.optional(v.string()),
      })),
      redditSignals: v.array(v.object({
        title: v.string(),
        subreddit: v.string(),
        url: v.string(),
        score: v.number(),
        comments: v.number(),
      })),
      selectedTopic: v.string(),
      score: v.number(),
    }),
    generatedAt: v.number(),
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_status', ['status'])
    .index('by_status_publishedAt', ['status', 'publishedAt']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // META CAMPAIGNS â€” Cached Meta Marketing API campaign data
  // Synced periodically from Meta API to avoid hitting rate limits
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // META CONVERSION EVENTS â€” Server-side conversion event log
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PARTNER ACTION LEDGER â€” Idempotency tracker for Partner Engine clientRefs
  // Each action the AI proposes carries a clientRef. We record it here so that
  // retries / duplicate submissions never create duplicate records.
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PSYCH PROFILES â€” Psychology Engine (OCEAN + CBT + SDT)
  // Stores AI-inferred coaching style per user. NEVER shown to user.
  // Built gradually over 30+ interactions. Private, deletable (GDPR).
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  psychProfiles: defineTable({
    userId: v.id('users'),
    profileData: v.string(),    // JSON-serialised PsychProfile
    interactionCount: v.number(),
    lastUpdated: v.number(),
  })
    .index('by_user', ['userId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // DEEP SCAN â€” Enhanced onboarding data (5-stage Deep Scan Protocol)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  deepScans: defineTable({
    userId: v.id('users'),
    // â”€â”€ Stage 1: Identity Scan â”€â”€
    nickname: v.optional(v.string()),
    age: v.optional(v.number()),
    occupation: v.optional(v.string()),
    lifeStage: v.optional(v.string()),          // e.g. student, early_career, mid_career, transition, retirement
    // â”€â”€ Stage 2: Life Pillar Assessment â”€â”€
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
    // â”€â”€ Stage 3: Root Cause Analysis â”€â”€
    biggestChallenge: v.optional(v.string()),
    failedBefore: v.optional(v.string()),       // what they've tried before
    whatStopped: v.optional(v.string()),         // what stopped them
    sabotagePatterns: v.optional(v.array(v.string())), // self-sabotage patterns
    // â”€â”€ Stage 4: Behavioral Fingerprint â”€â”€
    chronotype: v.optional(v.string()),         // early_bird, night_owl, variable
    energyPattern: v.optional(v.string()),      // steady, burst, slow_start
    motivationStyle: v.optional(v.string()),    // intrinsic, extrinsic, social, competitive
    accountabilityStyle: v.optional(v.string()),// self, partner, public, consequences
    stressResponse: v.optional(v.string()),     // fight, flight, freeze, fawn
    decisionStyle: v.optional(v.string()),      // analytical, intuitive, collaborative, decisive
    // â”€â”€ Stage 5: Commitment Calibration â”€â”€
    commitmentLevel: v.optional(v.number()),    // 1-10
    dailyTimeAvailable: v.optional(v.number()), // minutes per day
    biggestFear: v.optional(v.string()),
    ninetyDayVision: v.optional(v.string()),
    startingDifficulty: v.optional(v.string()), // gentle, moderate, intense
    // â”€â”€ AI-Generated Results â”€â”€
    aiDiagnosis: v.optional(v.string()),        // AI summary of findings
    aiRecommendations: v.optional(v.string()),  // JSON of recommended approach
    archetype: v.optional(v.string()),
    archetypeConfidence: v.optional(v.number()),
    // â”€â”€ Meta â”€â”€
    completedStages: v.array(v.number()),       // [1,2,3,4,5]
    currentStage: v.number(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // DAILY CHECK-INS â€” Morning briefing + Evening debrief
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  dailyCheckIns: defineTable({
    userId: v.id('users'),
    date: v.string(),             // YYYY-MM-DD
    // â”€â”€ Morning Check-in â”€â”€
    morningMood: v.optional(v.number()),        // 1-5
    morningEnergy: v.optional(v.number()),      // 1-5
    sleepQuality: v.optional(v.number()),       // 1-5
    morningIntention: v.optional(v.string()),
    topThreePriorities: v.optional(v.array(v.string())),
    morningAiBriefing: v.optional(v.string()),  // AI-generated morning briefing
    morningCompletedAt: v.optional(v.number()),
    // â”€â”€ Evening Check-in â”€â”€
    eveningMood: v.optional(v.number()),
    eveningEnergy: v.optional(v.number()),
    dayRating: v.optional(v.number()),          // 1-5
    biggestWin: v.optional(v.string()),
    biggestChallenge: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowFocus: v.optional(v.string()),
    eveningAiReflection: v.optional(v.string()), // AI-generated evening reflection
    eveningCompletedAt: v.optional(v.number()),
    // â”€â”€ Stats (auto-populated) â”€â”€
    tasksCompleted: v.optional(v.number()),
    habitsCompleted: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
    xpEarned: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // AI GREETINGS â€” First Contact briefing after onboarding
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // VISION BOARDS â€” AI-generated personalized vision boards (Section 24)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      v.literal('vision'),     // Pure vision board
      v.literal('manifesting'), // Manifestation board
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // WISHLIST ITEMS â€” Goal-oriented saving & purchase tracking (Wealth section)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SCRATCH NOTES â€” Quick capture from dashboard "Quick Note" widget
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
scratchNotes: defineTable({
  userId: v.id('users'),
  text: v.string(),
  source: v.optional(v.string()),
  createdAt: v.number(),
})
.index('by_userId', ['userId'])
.index('by_userId_createdAt', ['userId', 'createdAt']),

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TESTIMONIALS â€” User testimonials for social proof
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
testimonials: defineTable({
  userId: v.optional(v.id('users')), // Optional: linked to user account
  name: v.string(),                  // Name for display
  roleOrICP: v.string(),             // Role or Ideal Customer Profile
  outcomeHeadline: v.string(),       // 5-7 words, specific metric/result
  quote: v.string(),                 // 1-2 sentences, specific, no hype
  metricBadge: v.optional(v.string()), // Optional metric badge (e.g., "94-day streak")
  featured: v.boolean(),             // Whether to feature prominently
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index('by_featured', ['featured'])
.index('by_createdAt', ['createdAt'])
.index('by_userId', ['userId']),

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// WORKOUT LOGS â€” Physical fitness activity tracking (Fitness section)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// COACH NOTIFICATIONS â€” Proactive AI coach nudges
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// USER INTELLIGENCE MODEL â€” Central behavioral context for AI
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
userIntelligenceModel: defineTable({
  userId: v.id('users'),
  energyLevel: v.optional(v.number()),         // 1-10
  stressScore: v.optional(v.number()),         // 1-10
  sleepHoursLastNight: v.optional(v.number()),
  consistencyScore: v.optional(v.number()),    // 0-100
  focusScore: v.optional(v.number()),          // 0-100
  chronotype: v.optional(v.union(
    v.literal('morning'),
    v.literal('afternoon'),
    v.literal('evening'),
    v.literal('irregular'),
  )),
  adhdFlag: v.optional(v.boolean()),
  preferredWorkBlocks: v.optional(v.array(v.object({
    startHour: v.number(),
    endHour: v.number(),
    intensity: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
  }))),
  lastAnalyzedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index('by_userId', ['userId'])
.index('by_userId_updatedAt', ['userId', 'updatedAt']),

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BRAIN DUMP â€” Raw and AI-structured onboarding intelligence
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
brainDump: defineTable({
  userId: v.id('users'),
  rawText: v.string(),
  structured: v.optional(v.object({
    goals: v.array(v.string()),
    fears: v.array(v.string()),
    constraints: v.array(v.string()),
    energyProfile: v.optional(v.string()),
    suggestedHabits: v.optional(v.array(v.string())),
  })),
  analysisStatus: v.union(
    v.literal('pending'),
    v.literal('completed'),
    v.literal('needs_clarification'),
    v.literal('failed'),
  ),
  analysisVersion: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index('by_userId', ['userId'])
.index('by_userId_createdAt', ['userId', 'createdAt'])
.index('by_userId_status', ['userId', 'analysisStatus']),

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// EXECUTION STREAM â€” Unified "Today" feed (tasks + habits + focus sessions)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
executionStream: defineTable({
  userId: v.id('users'),
  dateKey: v.string(), // YYYY-MM-DD in user-local date
  sourceType: v.union(
    v.literal('task'),
    v.literal('habit'),
    v.literal('focus_session'),
  ),
  sourceId: v.string(),
  title: v.string(),
  detail: v.optional(v.string()),
  priority: v.optional(v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high'),
    v.literal('critical'),
  )),
  status: v.union(
    v.literal('pending'),
    v.literal('in_progress'),
    v.literal('completed'),
    v.literal('skipped'),
  ),
  sortOrder: v.number(),
  estimateMinutes: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  metadata: v.optional(v.any()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index('by_userId', ['userId'])
.index('by_userId_dateKey', ['userId', 'dateKey'])
.index('by_userId_dateKey_status', ['userId', 'dateKey', 'status'])
.index('by_userId_dateKey_sortOrder', ['userId', 'dateKey', 'sortOrder']),

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// EMAIL LOGS â€” Track lifecycle emails sent to prevent duplicates
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

leadEmailLogs: defineTable({
  leadId: v.id('leads'),
  email: v.string(),
  emailType: v.string(), // e.g. 'lead_day0', 'lead_day3', 'lead_day7'
  sentAt: v.number(),
  success: v.boolean(),
  resendId: v.optional(v.string()),
  error: v.optional(v.string()),
})
.index('by_leadId', ['leadId'])
.index('by_leadId_emailType', ['leadId', 'emailType']),

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CANCELLATION SURVEYS â€” Churn insights from departing users
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
cancellationSurveys: defineTable({
  userId: v.id('users'),
  reason: v.string(),
  otherReason: v.optional(v.string()),
  feedback: v.optional(v.string()),
  wouldReturn: v.optional(v.boolean()),
  createdAt: v.number(),
})
.index('by_userId', ['userId'])
.index('by_reason', ['reason']),

systemHealth: defineTable({
    checkAt: v.number(),
    status: v.string(),
    details: v.any(),
    createdAt: v.number(),
  })
    .index('by_createdAt', ['createdAt']),

  userIntegrations: defineTable({
    userId: v.id('users'),
    provider: v.union(v.literal('google'), v.literal('notion'), v.literal('fitbit')),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    scopes: v.array(v.string()),
    settings: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_provider', ['userId', 'provider']),
});

