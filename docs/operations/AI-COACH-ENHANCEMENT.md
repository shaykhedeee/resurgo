# RESURGO — AI COACH ENHANCEMENT PLAN
> Detailed spec for upgrading AI coaches from chat-only to full execution partners.
> Covers: memory system, multi-chain actions, physical task support, personality notifications.

---

## 1. CURRENT STATE

### What's Built
- 8 coach personas (MARCUS, AURORA, TITAN, SAGE, PHOENIX, NOVA, ORACLE, NEXUS)
- Multi-provider AI cascade: Groq (Llama 3.3 70B) → Cerebras → Gemini → Groq 8B fallback
- Action-capable: coaches create tasks, goals, habits from chat via ActionCard system
- Context-aware: reads user's real goals, habits, tasks, check-in data
- Distress detection: safety-first responses for crisis language
- Smart prompt suggestions: contextual starter prompts per coach

### What's Missing
- **No memory** — Coaches don't remember previous conversations or learned patterns
- **No physical tasks** — Can't generate workouts, meal plans, or sleep protocols
- **No multi-step chains** — Can't analyze → plan → create a full week → notify
- **No personality notifications** — Push notifications are generic, not from specific coaches
- **No cross-coach synthesis** — The coaches don't share insights about the user

---

## 2. COACH MEMORY SYSTEM

### Database Schema (New Convex Table)
```typescript
// convex/schema.ts — add this table
coachMemory: defineTable({
  userId: v.id('users'),
  coachId: v.string(), // 'MARCUS' | 'TITAN' | 'AURORA' | 'PHOENIX' | 'NEXUS' | etc.
  memoryType: v.union(
    v.literal('preference'),   // "Prefers morning workouts"
    v.literal('pattern'),      // "Consistency drops on Fridays"
    v.literal('constraint'),   // "Has bad back, avoid heavy deadlifts"
    v.literal('milestone'),    // "Hit 30-day meditation streak"
    v.literal('struggle'),     // "Procrastinates on client emails"
    v.literal('goal_context'), // "Launching SaaS product by Q3"
  ),
  content: v.string(),
  confidence: v.float64(), // 0.0 to 1.0 — how sure are we
  source: v.union(
    v.literal('conversation'),  // Extracted from chat
    v.literal('behavior'),      // Inferred from usage data
    v.literal('check_in'),      // From daily check-ins
    v.literal('manual'),        // User explicitly stated
  ),
  createdAt: v.float64(),
  lastReferencedAt: v.optional(v.float64()),
  expiresAt: v.optional(v.float64()), // Some memories decay (e.g., short-term blockers)
})
  .index('by_user_coach', ['userId', 'coachId'])
  .index('by_user_type', ['userId', 'memoryType'])
  .index('by_user', ['userId']),
```

### Memory Functions (Convex)
```typescript
// convex/coachMemory.ts

// Store a new memory
export const store = mutation({
  args: {
    coachId: v.string(),
    memoryType: v.string(),
    content: v.string(),
    confidence: v.float64(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    // Deduplicate: check for similar existing memory
    const existing = await ctx.db
      .query('coachMemory')
      .withIndex('by_user_coach', q => q.eq('userId', user._id).eq('coachId', args.coachId))
      .collect();
    
    // If similar memory exists with lower confidence, update it
    // Otherwise, create new
    return ctx.db.insert('coachMemory', {
      userId: user._id,
      coachId: args.coachId,
      memoryType: args.memoryType as any,
      content: args.content,
      confidence: args.confidence,
      source: args.source as any,
      createdAt: Date.now(),
    });
  }
});

// Retrieve memories for context injection
export const getForCoach = query({
  args: { coachId: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return ctx.db
      .query('coachMemory')
      .withIndex('by_user_coach', q => q.eq('userId', user._id).eq('coachId', args.coachId))
      .order('desc')
      .take(20); // Last 20 memories, ordered by recency
  }
});

// Cross-coach memory (for ORACLE/NEXUS synthesis)
export const getAllForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return ctx.db
      .query('coachMemory')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .order('desc')
      .take(50);
  }
});
```

### Memory Extraction (During Chat)
After each AI response, run a lightweight extraction pass:
```
SYSTEM: Extract any new facts about the user from this conversation.
Return JSON: [{"type": "preference|pattern|constraint|milestone|struggle|goal_context", "content": "short fact", "confidence": 0.0-1.0}]
If no new facts, return [].
```

This is done server-side after the main response, not blocking the user.

### Memory Injection (Before Chat)
When building the system prompt, inject relevant memories:
```
=== YOUR MEMORY OF THIS OPERATOR ===
- Prefers morning workouts (confidence: 0.9)
- Struggles with consistency on Fridays (confidence: 0.7)
- Has a bad back — avoid heavy deadlifts (confidence: 0.95)
- Currently launching a SaaS product (confidence: 0.85)
- Hit a 30-day meditation streak last month (confidence: 1.0)
```

---

## 3. MULTI-CHAIN AI (AGENT-LIKE BEHAVIOR)

### Current: Single Request-Response
```
User: "Plan my week"
AI: [text response with suggestions]
```

### Enhanced: Chain of Actions
```
User: "Plan my week"
AI: [CHAIN START]
  1. READ goals → found 3 active goals
  2. READ habits → found 5 active habits  
  3. READ calendar → found 2 meetings this week (if calendar integrated)
  4. ANALYZE patterns → user is most productive mornings, energy dips Thursday
  5. GENERATE plan → 5-day plan with tasks + focus blocks
  6. CREATE tasks → 15 tasks created across the week
  7. SET reminders → morning notification for each day
[CHAIN END]

> "Week planned, operator. 15 tasks across 5 days, front-loaded for your Monday/Tuesday energy peak. Thursday is lighter because your data shows energy dips. Each morning you'll get a briefing."
```

### Implementation Approach
- Use existing Convex actions (they can call other internal functions)
- Add a `chainActions` internal action that sequences multiple operations
- Each step logged as ActionCard in the chat response
- User sees real-time progress: "Reading goals... Analyzing patterns... Creating tasks..."

### Chain Templates
| Trigger | Chain |
|---|---|
| "Plan my week" | Read goals → Read habits → Analyze patterns → Generate plan → Create tasks |
| "I'm overwhelmed" | Activate Emergency Mode → Simplify today → Update AI memory → Offer coaching |
| "New goal: [X]" | Decompose goal → Create milestones → Set first week tasks → Schedule review |
| "Review my progress" | Read completed tasks → Read habit streaks → Generate insights → Memory update |
| "Reset everything" | Archive incomplete tasks → Clear today → Fresh brain dump prompt |

---

## 4. PHYSICAL TASK SUPPORT (TITAN COACH)

### Workout Generation
Titan should generate structured workout plans:
```
*TITAN PERFORMANCE PROTOCOL*

TODAY'S SESSION: Upper Body Strength (45 min)

WARM-UP (5 min):
- Arm circles: 30 sec each direction
- Cat-cow: 10 reps
- Band pull-apart: 15 reps

MAIN BLOCK (35 min):
1. Push-ups: 3 × 12 (rest 60s)
2. Dumbbell rows: 3 × 10/side (rest 60s)
3. Overhead press: 3 × 10 (rest 90s)
4. Plank: 3 × 45s (rest 45s)

COOLDOWN (5 min):
- Chest stretch: 30s each side
- Child's pose: 60s
- Deep breathing: 10 breaths

[Add to Today's Tasks] [Log Workout Complete]
```

### Nutrition Guidance (TITAN + AURORA)
```
*TITAN FUEL PROTOCOL*

Based on your goal (energy optimization) and today's workout:

MEAL SUGGESTIONS:
- Pre-workout: Banana + coffee (30 min before)
- Post-workout: Protein shake + oats (within 30 min)
- Lunch: Grilled chicken + rice + vegetables
- Dinner: Salmon + sweet potato + greens

HYDRATION TARGET: 3L water today (you logged 1.2L so far)

[Create Food Log Entry] [Set Water Reminder]
```

### Sleep Protocol (AURORA COACH)
```
*AURORA RECOVERY PROTOCOL*

Your sleep data shows:
- Average this week: 6.2 hours (target: 7.5)
- Quality score: 65% (target: 80%)

TONIGHT'S PROTOCOL:
1. Screen off at 10:00 PM ← set reminder
2. Blue light filter from 9:00 PM
3. Room temp: 65-68°F
4. 5-min breathing exercise before bed
5. No caffeine after 2:00 PM

[Set Sleep Routine Reminder] [Log Sleep Data]
```

---

## 5. PERSONALITY-DRIVEN NOTIFICATIONS

### Notification Templates (Duolingo-Style)
Each coach sends notifications in their distinct voice. These replace generic system notifications.

**MARCUS (Stoic Strategist)**
- Morning: "The day awaits. 3 tasks, 2 habits. Execute."
- Missed task: "You deferred that task yesterday. Today it either dies or ships. Decide."
- Streak milestone: "30 days. Discipline is now default. Keep building."
- Evening: "Review time. What shipped? What didn't? No judgment."

**TITAN (Performance Coach)**
- Morning: "Body first, then business. Have you moved yet?"
- No exercise logged: "4 hours sitting. Stand up. 20 squats. NOW."
- Water reminder: "1L behind on hydration. Your brain is drying out."
- Streak milestone: "14-day workout streak. Your body is adapting. Push harder next week."

**AURORA (Wellness Guide)**
- Morning: "Good morning. Before the tasks — how did you sleep? That number runs everything today."
- Stress detected: "Your check-in data shows elevated stress. 5 minutes of breathing. I'll wait."
- Evening: "Wind down time. Screens off in 30 minutes?"
- Streak milestone: "7 days of consistent sleep. Your nervous system thanks you."

**PHOENIX (Comeback Specialist)**
- After missed days: "3 days dark. That's fine. Today we restart. Just ONE task."
- After resuming: "You came back. That's the hardest part. Momentum restarts NOW."
- Low mood detected: "Rough day? Emergency Mode is one tap away. No shame."
- Streak milestone: "Back-to-back weeks after a crash. THIS is resilience."

**NEXUS (Systems Builder)**
- Morning: "System check: 4/5 habits configured. Run the protocol."
- Pattern detected: "You skip your evening review 3 out of 5 days. Want to move it to morning?"
- Optimization: "Your focus blocks average 22 minutes. Let's push to 30 next week."
- Streak milestone: "Full system operational for 21 days. Routine is becoming automatic."

### Implementation
1. Each notification references the specific coach avatar and color
2. Notification preferences let users choose which coaches can notify
3. Notification timing adapts to user's timezone and activity patterns
4. Max 3 notifications/day (morning, one contextual, evening review)
5. "Quiet hours" respected (already in user schema)

---

## 6. CROSS-COACH SYNTHESIS (ORACLE + NEXUS)

### The Vision
ORACLE and NEXUS (premium coaches) can see ALL other coaches' memories and provide holistic analysis:

```
*ORACLE FULL-SPECTRUM ANALYSIS*

Synthesizing data from all 5 core coaches:

MARCUS reports: Your focus sessions have increased 40% this month.
TITAN notes: Exercise consistency dropped 20% — possible energy drain.
AURORA flags: Sleep debt accumulating (avg 6.1h vs 7.5h target).
PHOENIX detects: No setback recovery needed — you're in growth mode.
NEXUS observes: Morning routine compliance is 95%, evening routine only 60%.

MY DIAGNOSIS:
You're outperforming on execution but underinvesting in recovery. 
The sleep debt will catch up within 2 weeks and crash your productivity.

RECOMMENDED ACTIONS:
1. Add 30-min sleep buffer tonight (AURORA protocol)
2. Move one task from evening to morning (NEXUS optimization)
3. Drop one low-priority goal temporarily (MARCUS strategic pruning)

[Apply All Recommendations] [Review One by One]
```

### Implementation
- ORACLE/NEXUS get access to `coachMemory.getAllForUser()` — all coaches' memories
- Their system prompts include cross-coach synthesis instructions
- Only available on Pro/Lifetime plans
- Can chain actions across coach domains (recommend workout via TITAN + sleep protocol via AURORA)

---

## 7. IMPLEMENTATION PRIORITY

### Phase 1: Memory System (Week 9-10)
1. Add `coachMemory` table to Convex schema
2. Create memory CRUD functions
3. Add memory extraction pass after each chat
4. Inject memories into coach system prompts
5. Test with MARCUS → roll out to all coaches

### Phase 2: Personality Notifications (Week 10-11)
1. Create notification templates for each coach
2. Add coach-specific push notification logic
3. Implement notification preferences UI
4. Connect to Convex cron jobs for scheduled notifications

### Phase 3: Physical Tasks (Week 11-12)
1. Enhance TITAN system prompt with workout generation format
2. Add ActionCard types for workouts, meals, sleep protocols
3. Create task integration (log workout → create Convex entry)
4. Connect to check-in data for optimization

### Phase 4: Multi-Chain + Cross-Coach (Week 13+)
1. Build chain action infrastructure in Convex
2. Create chain templates for common flows
3. Implement ORACLE/NEXUS cross-coach synthesis
4. Add real-time chain progress display in chat

---

*This plan transforms AI coaches from chatbots to genuine execution partners.*

*Last updated: April 2026*
