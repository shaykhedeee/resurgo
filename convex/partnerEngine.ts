// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Partner Engine Convex Mutations
//
// applyPartnerActions  — idempotent action applier (clientRef ledger)
// listRecentActions    — query for the changes-applied feed
//
// Actions received as JSON string to avoid complex Convex validator nesting.
// Each action is gated by the partnerActionLedger (clientRef idempotency).
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Auth helper ─────────────────────────────────────────────────────────────

async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found');
  return user;
}

// ─── Value mappers ────────────────────────────────────────────────────────────

/** Partner engine priority (CRITICAL/HIGH/MEDIUM/LOW) → DB (urgent/high/medium/low) */
function mapPriority(p?: string): 'low' | 'medium' | 'high' | 'urgent' {
  switch ((p ?? '').toUpperCase()) {
    case 'CRITICAL': return 'urgent';
    case 'HIGH':     return 'high';
    case 'MEDIUM':   return 'medium';
    default:         return 'low';
  }
}

/** Partner engine goal status → DB status */
function mapGoalStatus(s?: string): 'draft' | 'in_progress' | 'completed' | 'paused' | 'abandoned' {
  switch (s) {
    case 'active':    return 'in_progress';
    case 'completed': return 'completed';
    case 'paused':    return 'paused';
    case 'archived':  return 'abandoned';
    default:          return 'in_progress';
  }
}

/** Partner engine horizon → category string */
function mapHorizon(h?: string): string {
  switch (h) {
    case 'today':   return 'daily';
    case 'week':    return 'weekly';
    case 'month':   return 'monthly';
    case 'quarter': return 'quarterly';
    case 'year':    return 'yearly';
    case 'someday': return 'someday';
    default:        return 'monthly';
  }
}

/** Partner engine habit frequency → DB frequency */
function mapHabitFreq(t?: string): 'daily' | 'weekdays' | 'weekends' | '3x_week' | 'weekly' | 'custom' {
  switch (t) {
    case 'daily':    return 'daily';
    case 'weekdays': return 'weekdays';
    case 'weekly':   return 'weekly';
    case '3x_week':  return '3x_week';
    case 'custom':   return 'custom';
    default:         return 'daily';
  }
}

// ─── applyPartnerActions ─────────────────────────────────────────────────────

export const applyPartnerActions = mutation({
  args: {
    /** JSON-serialised PartnerActionT[] */
    actionsJson: v.string(),
  },
  /**
   * Returns JSON-encoded ActionApplyResult[]:
   *  { clientRef, type, status, reason?, entityId?, label? }
   */
  returns: v.string(),
  handler: async (ctx, { actionsJson }): Promise<string> => {
    const user = await getAuthUser(ctx);
    const now = Date.now();

    let actions: any[];
    try {
      actions = JSON.parse(actionsJson);
      if (!Array.isArray(actions)) throw new Error('not an array');
    } catch {
      throw new Error('actionsJson must be a JSON array');
    }

    const results: Array<{
      clientRef: string;
      type: string;
      status: 'applied' | 'skipped' | 'failed';
      reason?: string;
      entityId?: string;
      label?: string;
    }> = [];

    for (const action of actions) {
      const clientRef: string = action?.clientRef ?? '';
      const type: string = action?.type ?? '';

      if (!clientRef || !type) {
        results.push({ clientRef: clientRef || '?', type: type || '?', status: 'failed', reason: 'Missing clientRef or type' });
        continue;
      }

      // ── Idempotency check ─────────────────────────────────────────────────
      const existing = await ctx.db
        .query('partnerActionLedger')
        .withIndex('by_userId_clientRef', (q: any) => q.eq('userId', user._id).eq('clientRef', clientRef))
        .unique();

      if (existing) {
        results.push({ clientRef, type, status: 'skipped', reason: 'Duplicate clientRef', entityId: existing.entityId });
        continue;
      }

      let entityId: string | undefined;
      let label: string | undefined;
      let status: 'applied' | 'failed' = 'applied';
      let reason: string | undefined;

      // ── Dispatch ──────────────────────────────────────────────────────────
      try {
        switch (type) {

          // ── TASK actions ─────────────────────────────────────────────────

          case 'task.upsert': {
            const t = action.task ?? {};
            const priority = mapPriority(t.priority);
            const xpValue = priority === 'urgent' ? 20 : priority === 'high' ? 15 : priority === 'medium' ? 10 : 5;

            if (t.id) {
              // Update existing (best-effort — id may be Convex _id string)
              try {
                const existing: any = await ctx.db.get(t.id as any);
                if (existing && existing.userId === user._id) {
                  await ctx.db.patch(t.id as any, {
                    title: t.title,
                    priority,
                    dueDate: t.dueDate ?? undefined,
                    energyRequired: t.energy,
                    notes: t.notes ?? undefined,
                    updatedAt: now,
                  });
                  entityId = t.id;
                  label = `Updated task: ${t.title}`;
                  break;
                }
              } catch {
                // fall through to create
              }
            }

            // Create new
            const newId = await ctx.db.insert('tasks', {
              userId: user._id,
              title: t.title,
              priority,
              status: 'todo',
              dueDate: t.dueDate ?? undefined,
              energyRequired: t.energy,
              notes: t.notes ?? undefined,
              source: 'ai_generated',
              xpValue,
              subtasks: [],
              createdAt: now,
              updatedAt: now,
            });
            entityId = newId;
            label = `Created task: ${t.title} [${(t.priority ?? 'MEDIUM').toUpperCase()}, ${t.category ?? 'PERSONAL'}]`;
            break;
          }

          case 'task.complete': {
            try {
              const task: any = await ctx.db.get(action.taskId as any);
              if (task && task.userId === user._id) {
                await ctx.db.patch(action.taskId as any, {
                  status: 'done',
                  completedAt: action.completedAt ? new Date(action.completedAt).getTime() : now,
                  updatedAt: now,
                });
                entityId = action.taskId;
                label = `Completed task`;
              } else {
                status = 'failed'; reason = 'Task not found or not owned';
              }
            } catch {
              status = 'failed'; reason = `Task ${action.taskId} not found`;
            }
            break;
          }

          case 'task.archive': {
            try {
              const task: any = await ctx.db.get(action.taskId as any);
              if (task && task.userId === user._id) {
                await ctx.db.patch(action.taskId as any, { status: 'done', updatedAt: now });
                entityId = action.taskId;
                label = `Archived task`;
              } else {
                status = 'failed'; reason = 'Task not found or not owned';
              }
            } catch {
              status = 'failed'; reason = `Task ${action.taskId} not found`;
            }
            break;
          }

          // ── HABIT actions ─────────────────────────────────────────────────

          case 'habit.upsert': {
            const h = action.habit ?? {};
            const frequency = mapHabitFreq(h.schedule?.type);

            if (h.id) {
              try {
                const existing: any = await ctx.db.get(h.id as any);
                if (existing && existing.userId === user._id) {
                  const habitStatus = h.status === 'paused' || h.status === 'archived' ? false : true;
                  await ctx.db.patch(h.id as any, {
                    name: h.name,
                    frequency,
                    isActive: habitStatus,
                    updatedAt: now,
                  });
                  entityId = h.id;
                  label = `Updated habit: ${h.name}`;
                  break;
                }
              } catch {
                // fall through to create
              }
            }

            const habitId = await ctx.db.insert('habits', {
              userId: user._id,
              title: h.name,
              category: 'personal_growth',
              frequency,
              timeOfDay: 'anytime',
              isActive: h.status !== 'paused' && h.status !== 'archived',
              streakCurrent: 0,
              streakLongest: 0,
              habitType: 'yes_no',
              difficultyLevel: 1,
              source: 'ai_generated',
              createdAt: now,
              updatedAt: now,
            } as any);
            entityId = habitId;
            label = `Created habit: ${h.name} (${frequency})`;
            break;
          }

          case 'habit.log': {
            // Find habit by ID, then insert a log entry
            try {
              const habit: any = await ctx.db.get(action.habitId as any);
              if (habit && habit.userId === user._id) {
                const logId = await ctx.db.insert('habitLogs', {
                  habitId: action.habitId as any,
                  userId: user._id,
                  date: action.date,
                  status: 'completed',
                  value: action.value ?? 1,
                  completedAt: now,
                  loggedVia: 'auto',
                });
                entityId = logId;
                label = `Logged habit on ${action.date}`;
              } else {
                status = 'failed'; reason = 'Habit not found or not owned';
              }
            } catch {
              status = 'failed'; reason = `Habit ${action.habitId} not found`;
            }
            break;
          }

          // ── GOAL actions ──────────────────────────────────────────────────

          case 'goal.upsert': {
            const g = action.goal ?? {};
            const goalStatus = mapGoalStatus(g.status);
            const category = mapHorizon(g.horizon);

            if (g.id) {
              try {
                const existing: any = await ctx.db.get(g.id as any);
                if (existing && existing.userId === user._id) {
                  await ctx.db.patch(g.id as any, {
                    title: g.title,
                    status: goalStatus,
                    whyImportant: g.why ?? undefined,
                    updatedAt: now,
                  });
                  entityId = g.id;
                  label = `Updated goal: ${g.title}`;
                  break;
                }
              } catch {
                // fall through to create
              }
            }

            const goalId = await ctx.db.insert('goals', {
              userId: user._id,
              title: g.title,
              category,
              status: goalStatus,
              progress: 0,
              whyImportant: g.why ?? undefined,
              source: 'ai_generated',
              createdAt: now,
              updatedAt: now,
            } as any);
            entityId = goalId;
            label = `Created goal: ${g.title} (${g.horizon ?? 'month'})`;
            break;
          }

          // ── USER PREF actions ─────────────────────────────────────────────

          case 'pref.set': {
            const pref = action.pref ?? {};
            const patch: Record<string, any> = { updatedAt: now };
            if (pref.timezone)           patch.timezone = pref.timezone;
            if (pref.tone)               patch.coachPersonality = pref.tone; // closest mapping
            if (pref.reminderIntensity && user.notificationPrefs) {
              patch.notificationPrefs = {
                ...user.notificationPrefs,
                reminderStyle: pref.reminderIntensity === 'intense' ? 'persistent'
                  : pref.reminderIntensity === 'minimal' ? 'minimal' : 'supportive',
              };
            }
            await ctx.db.patch(user._id, patch);
            label = `Updated preferences: ${Object.keys(pref).join(', ')}`;
            break;
          }

          case 'user.segment.set': {
            await ctx.db.patch(user._id, {
              archetype: action.segment,
              archetypeConfidence: action.confidence,
              onboardingData: JSON.stringify({ segmentReason: action.reason ?? '' }),
              updatedAt: now,
            });
            label = `Set segment: ${action.segment} (${Math.round((action.confidence ?? 0) * 100)}% confidence)`;
            break;
          }

          case 'user.coachingVector.patch': {
            // Merge patch into existing psychProfile record
            const profile = await ctx.db
              .query('psychProfiles')
              .withIndex('by_user', (q: any) => q.eq('userId', user._id))
              .unique();

            if (profile) {
              let profileData: any = {};
              try { profileData = JSON.parse(profile.profileData); } catch {}
              profileData.coachingVector = {
                ...(profileData.coachingVector ?? {}),
                ...action.patch,
              };
              await ctx.db.patch(profile._id, {
                profileData: JSON.stringify(profileData),
                lastUpdated: now,
              });
              label = `Updated coaching vector: ${Object.keys(action.patch ?? {}).join(', ')}`;
            } else {
              status = 'failed'; reason = 'No psych profile found — build one via /api/coach first';
            }
            break;
          }

          case 'user.memory.patch': {
            await ctx.db.patch(user._id, {
              summaryMemory: (action.memorySummary ?? '').slice(0, 800),
              updatedAt: now,
            });
            label = `Updated memory summary`;
            break;
          }

          // ── NUDGE actions ─────────────────────────────────────────────────

          case 'nudge.schedule': {
            const remindAtMs = new Date(action.when).getTime();
            if (isNaN(remindAtMs)) {
              status = 'failed'; reason = `Invalid ISO timestamp: ${action.when}`; break;
            }
            const remId = await ctx.db.insert('reminders', {
              userId: user._id,
              text: action.message,
              remindAt: remindAtMs,
              status: 'pending',
              source: 'app',
              createdAt: now,
            });
            entityId = remId;
            label = `Scheduled ${action.purpose ?? 'nudge'}: "${action.message.slice(0, 60)}"`;
            break;
          }

          case 'nudge.cancel': {
            try {
              const reminder: any = await ctx.db.get(action.nudgeId as any);
              if (reminder && reminder.userId === user._id) {
                await ctx.db.patch(action.nudgeId as any, { status: 'dismissed' });
                entityId = action.nudgeId;
                label = `Cancelled nudge`;
              } else {
                status = 'failed'; reason = 'Reminder not found or not owned';
              }
            } catch {
              status = 'failed'; reason = `Reminder ${action.nudgeId} not found`;
            }
            break;
          }

          // ── JOURNAL actions ───────────────────────────────────────────────

          case 'journal.add': {
            const moodMap: Record<string, number> = {
              very_low: 1, low: 2, neutral: 3, good: 4, great: 5,
            };
            const moodScore = action.mood ? moodMap[action.mood] ?? 3 : undefined;

            // Insert journal entry
            const jId = await ctx.db.insert('journal', {
              userId: user._id,
              date: action.date,
              content: action.text,
              type: 'freeform',
              createdAt: now,
            });
            entityId = jId;

            // Also log mood if provided
            if (moodScore !== undefined) {
              await ctx.db.insert('moodEntries', {
                userId: user._id,
                date: action.date,
                score: moodScore,
                notes: action.text.slice(0, 200),
                createdAt: now,
              });
            }
            label = `Added journal entry for ${action.date}${moodScore ? ` (mood: ${action.mood})` : ''}`;
            break;
          }

          // ── MOODBOARD actions ─────────────────────────────────────────────

          case 'moodboard.create': {
            const board = action.board ?? {};
            const config = JSON.stringify({
              id: board.id ?? `board_${now}`,
              title: board.title ?? 'My Resurgo Board',
              aesthetic: board.aesthetic ?? 'calm_minimal',
              palette: board.palette ?? ['#111827', '#F9FAFB', '#22C55E'],
              tiles: (board.tiles ?? []).slice(0, 40),
              createdByPartnerEngine: true,
            });

            const vbId = await ctx.db.insert('visionBoards', {
              userId: user._id,
              config,
              version: 1,
              isActive: true,
              createdAt: now,
              updatedAt: now,
            });
            entityId = vbId;
            label = `Created moodboard: "${board.title ?? 'My Resurgo Board'}" (${board.aesthetic ?? 'calm_minimal'})`;
            break;
          }

          case 'moodboard.update': {
            try {
              const board: any = await ctx.db.get(action.boardId as any);
              if (board && board.userId === user._id) {
                let config: any = {};
                try { config = JSON.parse(board.config); } catch {}

                const u = action.update ?? {};
                if (u.title)     config.title = u.title;
                if (u.aesthetic) config.aesthetic = u.aesthetic;
                if (u.palette)   config.palette = u.palette;

                // Tile operations
                if (u.addTiles?.length) {
                  config.tiles = [...(config.tiles ?? []), ...u.addTiles].slice(0, 60);
                }
                if (u.updateTiles?.length) {
                  const updMap = new Map((u.updateTiles as any[]).map((t: any) => [t.id, t]));
                  config.tiles = (config.tiles ?? []).map((t: any) => updMap.has(t.id) ? updMap.get(t.id) : t);
                }
                if (u.removeTileIds?.length) {
                  const removeSet = new Set(u.removeTileIds);
                  config.tiles = (config.tiles ?? []).filter((t: any) => !removeSet.has(t.id));
                }

                await ctx.db.patch(action.boardId as any, {
                  config: JSON.stringify(config),
                  updatedAt: now,
                });
                entityId = action.boardId;
                const changes: string[] = [];
                if (u.palette)          changes.push('palette');
                if (u.aesthetic)        changes.push('aesthetic');
                if (u.addTiles?.length) changes.push(`+${u.addTiles.length} tiles`);
                if (u.removeTileIds?.length) changes.push(`-${u.removeTileIds.length} tiles`);
                if (u.updateTiles?.length) changes.push(`~${u.updateTiles.length} tiles`);
                label = `Updated moodboard: ${changes.join(', ') || 'settings'}`;
              } else {
                status = 'failed'; reason = 'Moodboard not found or not owned';
              }
            } catch {
              status = 'failed'; reason = `Moodboard ${action.boardId} not found`;
            }
            break;
          }

          default:
            status = 'failed';
            reason = `Unknown action type: ${type}`;
        }
      } catch (err) {
        status = 'failed';
        reason = (err instanceof Error) ? err.message : String(err);
        console.error(`[PartnerEngine] Action ${type} (${clientRef}) failed:`, err);
      }

      // ── Record in ledger if not failed ────────────────────────────────────
      if (status === 'applied') {
        await ctx.db.insert('partnerActionLedger', {
          userId: user._id,
          clientRef,
          actionType: type,
          appliedAt: now,
          entityId: entityId ? String(entityId) : undefined,
          resultData: label,
        });
      }

      results.push({ clientRef, type, status, reason, entityId: entityId ? String(entityId) : undefined, label });
    }

    return JSON.stringify(results);
  },
});

// ─── getPartnerContext ────────────────────────────────────────────────────────
// Compact snapshot injected into the system prompt. Intentionally small.

export const getPartnerContext = query({
  args: {},
  returns: v.string(),
  handler: async (ctx): Promise<string> => {
    const user = await getAuthUser(ctx);

    // Top 5 open tasks (by creation desc)
    const rawTasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId_status', (q: any) => q.eq('userId', user._id).eq('status', 'todo'))
      .order('desc')
      .take(5);

    const topTasks = rawTasks.map((t: any) => ({
      id: String(t._id),
      title: t.title,
      dueDate: t.dueDate ?? null,
      priority: t.priority ?? null,
    }));

    // Active goals (max 5)
    const rawGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q: any) => q.eq('userId', user._id).eq('status', 'in_progress'))
      .order('desc')
      .take(5);

    const activeGoals = rawGoals.map((g: any) => ({
      id: String(g._id),
      title: g.title,
    }));

    // Most recent active moodboard
    const board = await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q: any) => q.eq('userId', user._id).eq('isActive', true))
      .order('desc')
      .first();

    return JSON.stringify({
      topTasks,
      activeGoals,
      moodboardId: board ? String(board._id) : null,
      segment: user.archetype ?? null,
      memorySummary: user.summaryMemory ?? '',
      timezone: user.timezone ?? 'UTC',
      tone: user.coachPersonality ?? 'balanced',
      reminderIntensity: user.notificationPrefs?.reminderStyle ?? 'normal',
    });
  },
});

// ─── listRecentActions ────────────────────────────────────────────────────────

export const listRecentActions = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.string(),
  handler: async (ctx, { limit }): Promise<string> => {
    const user = await getAuthUser(ctx);
    const entries = await ctx.db
      .query('partnerActionLedger')
      .withIndex('by_userId_appliedAt', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .take(limit ?? 20);

    return JSON.stringify(
      entries.map((e: any) => ({
        clientRef: e.clientRef,
        actionType: e.actionType,
        appliedAt: e.appliedAt,
        entityId: e.entityId,
        label: e.resultData,
      }))
    );
  },
});
