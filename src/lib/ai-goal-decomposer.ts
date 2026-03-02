// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Goal Decomposition Engine
// Breaks ultimate goals into milestones → weekly objectives → daily tasks
// ═══════════════════════════════════════════════════════════════════════════════

import {
  AIGoalDecompositionRequest,
  AIGoalDecompositionResponse,
  Milestone,
  WeeklyObjective,
  DailyTask,
  GoalCategory,
  Habit,
} from '@/types';
import { addDays, differenceInDays, endOfWeek } from 'date-fns';
import { ascendAI } from './ai-service';

// Type definitions for AI responses
interface AITaskResponse {
  title: string;
  description: string;
  estimatedMinutes?: number;
  priority?: string;
  difficulty?: string;
  bestTimeOfDay?: string;
}

interface AIWeeklyObjectiveResponse {
  title: string;
  description: string;
  estimatedHours?: number;
  dailyTasks?: AITaskResponse[];
}

interface AIMilestoneResponse {
  title: string;
  description: string;
  weekNumber: number;
  estimatedHours?: number;
  weeklyObjectives: AIWeeklyObjectiveResponse[];
  weeklyFocus?: string[];
}

interface AIHabitResponse {
  title: string;
  name?: string;
  description: string;
  frequency?: string;
  category?: string;
}

interface AIGoalPlanResponse {
  milestones: AIMilestoneResponse[];
  suggestedHabits?: AIHabitResponse[];
  summary?: string;
  estimatedTotalHours?: number;
  estimatedSuccessRate?: number;
  keyRisks?: string[];
  motivationalMessage?: string;
}

// Lightweight template type used by getMilestoneTemplates (no AI response fields needed)
interface MilestoneTemplate {
  title: string;
  description: string;
  weeklyFocus: string[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI PROMPT TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────────

const _SYSTEM_PROMPT = `You are Resurgo AI, an expert life coach and goal-setting strategist with deep knowledge of how long goals typically take to achieve based on research and real-world data.

Your approach:
1. ANALYZE the goal for feasibility and create a realistic timeline based on research
2. ESTIMATE realistic time requirements based on the user's context (age, busyness, skill level)
3. DECOMPOSE into 3-5 major milestones (checkpoints)
4. BREAK DOWN each milestone into weekly objectives
5. CREATE specific daily tasks with time estimates for each week
6. IDENTIFY potential obstacles and suggest mitigation strategies
7. RECOMMEND supporting habits that reinforce the goal
8. PROVIDE research-based duration estimates

You are encouraging but realistic. You adapt difficulty based on user's skill level and available time.
Consider the user's age and busyness level when scheduling tasks.

Always respond with valid JSON matching the required schema.`;

const _GOAL_DECOMPOSITION_PROMPT = `
Decompose the following goal into a structured action plan:

ULTIMATE GOAL: {goal}
TARGET DATE: {targetDate}
CATEGORY: {category}
SKILL LEVEL: {skillLevel}
AVAILABLE TIME: {hoursPerDay} hours per day
DIFFICULTY PREFERENCE: {difficulty}
USER AGE: {userAge}
BUSYNESS LEVEL: {busynessLevel}
PREFERRED WORK TIMES: {preferredWorkTimes}
CONSTRAINTS: {constraints}

Total time available: {totalDays} days ({totalWeeks} weeks)

Create a comprehensive plan with:
1. Research-based time estimate for this type of goal
2. 3-5 milestones spread across the timeline
3. Weekly objectives for each milestone
4. Daily tasks (15-60 min each) with specific time estimates
5. Suggested supporting habits

Respond with JSON in this exact format:
{
  "summary": "A 2-3 sentence summary of the plan",
  "estimatedTotalHours": 120,
  "estimatedWeeksToComplete": 12,
  "recommendedDailyMinutes": 45,
  "researchBasedDuration": {
    "typical": "3-6 months for most people",
    "fastest": "6-8 weeks with intense focus",
    "comfortable": "4-5 months at a relaxed pace",
    "source": "Based on studies of similar goal achievers"
  },
  "milestones": [
    {
      "title": "Milestone 1 Title",
      "description": "What this milestone represents",
      "weekNumber": 4,
      "estimatedHours": 30,
      "weeklyObjectives": [
        {
          "title": "Week 1 Objective",
          "description": "What to accomplish this week",
          "estimatedHours": 7,
          "dailyTasks": [
            {
              "title": "Task name",
              "description": "Brief description",
              "estimatedMinutes": 30,
              "priority": "high",
              "difficulty": "medium",
              "bestTimeOfDay": "morning"
            }
          ]
        }
      ]
    }
  ],
  "estimatedSuccessRate": 85,
  "keyRisks": ["Risk 1", "Risk 2"],
  "motivationalMessage": "Encouraging message for the user",
  "suggestedHabits": [
    {
      "name": "Habit name",
      "description": "Why this helps",
      "frequency": "daily",
      "category": "productivity"
    }
  ]
}
`;

// ─────────────────────────────────────────────────────────────────────────────────
// RESEARCH-BASED TIME ESTIMATES
// ─────────────────────────────────────────────────────────────────────────────────

const GOAL_TIME_ESTIMATES: Record<string, { typical: string; fastest: string; comfortable: string; avgHours: number }> = {
  // Fitness goals
  'run_5k': { typical: '6-8 weeks', fastest: '4 weeks', comfortable: '10-12 weeks', avgHours: 40 },
  'run_marathon': { typical: '16-20 weeks', fastest: '12 weeks', comfortable: '24-30 weeks', avgHours: 200 },
  'lose_weight_10lbs': { typical: '8-12 weeks', fastest: '5-6 weeks', comfortable: '14-16 weeks', avgHours: 60 },
  'lose_weight_30lbs': { typical: '4-6 months', fastest: '3 months', comfortable: '8-10 months', avgHours: 180 },
  'build_muscle': { typical: '3-6 months', fastest: '8-10 weeks', comfortable: '6-12 months', avgHours: 150 },
  
  // Learning goals
  'learn_language_basic': { typical: '3-6 months', fastest: '2 months', comfortable: '9-12 months', avgHours: 200 },
  'learn_language_fluent': { typical: '1-2 years', fastest: '6 months', comfortable: '2-3 years', avgHours: 600 },
  'learn_instrument': { typical: '6-12 months', fastest: '3-4 months', comfortable: '1-2 years', avgHours: 300 },
  'learn_programming': { typical: '3-6 months', fastest: '8 weeks', comfortable: '9-12 months', avgHours: 400 },
  
  // Career goals
  'get_promotion': { typical: '6-12 months', fastest: '3-6 months', comfortable: '1-2 years', avgHours: 200 },
  'change_career': { typical: '6-12 months', fastest: '3-6 months', comfortable: '1-2 years', avgHours: 300 },
  'start_business': { typical: '6-12 months', fastest: '3 months', comfortable: '1-2 years', avgHours: 500 },
  
  // Finance goals
  'save_money': { typical: '6-12 months', fastest: '3-6 months', comfortable: '1-2 years', avgHours: 50 },
  'pay_off_debt': { typical: '1-3 years', fastest: '6-12 months', comfortable: '3-5 years', avgHours: 100 },
  
  // Default for other goals
  'default': { typical: '2-4 months', fastest: '4-6 weeks', comfortable: '4-6 months', avgHours: 100 },
};

function getGoalTimeEstimate(goal: string, _category: string): typeof GOAL_TIME_ESTIMATES['default'] {
  const goalLower = goal.toLowerCase();
  
  // Fitness matching
  if (goalLower.includes('5k') || goalLower.includes('couch to')) return GOAL_TIME_ESTIMATES['run_5k'];
  if (goalLower.includes('marathon')) return GOAL_TIME_ESTIMATES['run_marathon'];
  if ((goalLower.includes('lose') || goalLower.includes('weight')) && goalLower.includes('30')) return GOAL_TIME_ESTIMATES['lose_weight_30lbs'];
  if (goalLower.includes('lose') || goalLower.includes('weight')) return GOAL_TIME_ESTIMATES['lose_weight_10lbs'];
  if (goalLower.includes('muscle') || goalLower.includes('strength') || goalLower.includes('bulk')) return GOAL_TIME_ESTIMATES['build_muscle'];
  
  // Learning matching
  if (goalLower.includes('language') && (goalLower.includes('fluent') || goalLower.includes('speak'))) return GOAL_TIME_ESTIMATES['learn_language_fluent'];
  if (goalLower.includes('language') || goalLower.includes('spanish') || goalLower.includes('french') || goalLower.includes('japanese')) return GOAL_TIME_ESTIMATES['learn_language_basic'];
  if (goalLower.includes('guitar') || goalLower.includes('piano') || goalLower.includes('instrument') || goalLower.includes('music')) return GOAL_TIME_ESTIMATES['learn_instrument'];
  if (goalLower.includes('code') || goalLower.includes('programming') || goalLower.includes('developer')) return GOAL_TIME_ESTIMATES['learn_programming'];
  
  // Career matching
  if (goalLower.includes('promotion') || goalLower.includes('promoted')) return GOAL_TIME_ESTIMATES['get_promotion'];
  if (goalLower.includes('career change') || goalLower.includes('new career')) return GOAL_TIME_ESTIMATES['change_career'];
  if (goalLower.includes('business') || goalLower.includes('startup') || goalLower.includes('launch')) return GOAL_TIME_ESTIMATES['start_business'];
  
  // Finance matching
  if (goalLower.includes('save') && (goalLower.includes('$') || goalLower.includes('money'))) return GOAL_TIME_ESTIMATES['save_money'];
  if (goalLower.includes('debt') || goalLower.includes('pay off')) return GOAL_TIME_ESTIMATES['pay_off_debt'];
  
  return GOAL_TIME_ESTIMATES['default'];
}

// ─────────────────────────────────────────────────────────────────────────────────
// GOAL DECOMPOSITION SERVICE
// ─────────────────────────────────────────────────────────────────────────────────

export class AIGoalDecomposer {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    this.model = 'gpt-4o-mini'; // Cost-effective for structured output
  }

  async decomposeGoal(request: AIGoalDecompositionRequest): Promise<AIGoalDecompositionResponse> {
    const today = new Date();
    const totalDays = differenceInDays(request.targetDate, today);
    const totalWeeks = Math.ceil(totalDays / 7);

    console.log('AI Goal Decomposer: Generating plan for:', request.ultimateGoal);
    
    try {
      // Try real AI first (Groq/Gemini)
      const rawAiResponse = await ascendAI.decomposeGoal(
        request.ultimateGoal,
        request.category,
        request.targetDate,
        {
          skillLevel: request.currentSkillLevel,
          hoursPerDay: request.availableHoursPerDay,
          difficulty: request.preferredDifficulty,
        }
      );
      const aiResponse = rawAiResponse as AIGoalPlanResponse;
      console.log('AI Goal Decomposer: Real AI response received');
      const result = this.transformToResponse(aiResponse, request, totalWeeks);
      return result;
    } catch (error) {
      console.warn('AI Goal Decomposer: Real AI failed, using enhanced mock:', error);
      
      // Fallback to mock data with brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const result = this.generateMockDecomposition(request, totalDays, totalWeeks);
        console.log('AI Goal Decomposer: Mock plan generated successfully');
        return result;
      } catch (mockError) {
        console.error('AI Goal Decomposition Error:', mockError);
        throw new Error('Failed to generate goal plan');
      }
    }
  }

  private transformToResponse(
    aiResponse: AIGoalPlanResponse,
    _request: AIGoalDecompositionRequest,
    _totalWeeks: number
  ): AIGoalDecompositionResponse {
    const goalId = this.generateId();
    const today = new Date();

    const milestones: Milestone[] = aiResponse.milestones.map((m: AIMilestoneResponse, mIndex: number) => {
      const milestoneId = this.generateId();
      const milestoneDate = addDays(today, m.weekNumber * 7);

      const weeklyObjectives: WeeklyObjective[] = m.weeklyObjectives.map((w: AIWeeklyObjectiveResponse, wIndex: number) => {
        const objectiveId = this.generateId();
        const weekStart = addDays(today, (mIndex === 0 ? wIndex : m.weekNumber - m.weeklyObjectives.length + wIndex) * 7);
        
        const dailyTasks: DailyTask[] = (w.dailyTasks || []).map((t: AITaskResponse, tIndex: number) => ({
          id: this.generateId(),
          objectiveId,
          title: t.title,
          description: t.description,
          scheduledDate: addDays(weekStart, tIndex % 7),
          estimatedMinutes: t.estimatedMinutes || 30,
          priority: (t.priority as DailyTask['priority']) || 'medium',
          status: 'pending' as const,
          xpReward: this.calculateTaskXp((t.difficulty as 'easy' | 'medium' | 'hard') || 'medium'),
          difficulty: (t.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
        }));

        return {
          id: objectiveId,
          milestoneId,
          title: w.title,
          description: w.description,
          weekNumber: mIndex === 0 ? wIndex + 1 : m.weekNumber - m.weeklyObjectives.length + wIndex + 1,
          startDate: weekStart,
          endDate: endOfWeek(weekStart),
          status: 'not_started',
          dailyTasks,
          progressPercentage: 0,
        };
      });

      return {
        id: milestoneId,
        goalId,
        title: m.title,
        description: m.description,
        targetDate: milestoneDate,
        status: 'not_started',
        weeklyObjectives,
        progressPercentage: 0,
        progress: 0,
        order: mIndex + 1,
      };
    });

    const suggestedHabits: Partial<Habit>[] = (aiResponse.suggestedHabits || []).map((h: AIHabitResponse) => ({
      name: h.name ?? h.title,
      description: h.description,
      category: (h.category || 'custom') as Habit['category'],
      frequency: (h.frequency === 'daily' ? 'daily' : 'custom') as 'daily' | 'custom',
      monthlyGoal: h.frequency === 'daily' ? 25 : 15,
      icon: this.getCategoryIcon(h.category ?? 'custom'),
      color: this.getCategoryColor(h.category ?? 'custom'),
    }));

    return {
      goalId,
      summary: aiResponse.summary ?? `Your personalized plan for "${_request.ultimateGoal}" is ready.`,
      milestones,
      estimatedSuccessRate: aiResponse.estimatedSuccessRate ?? 80,
      keyRisks: aiResponse.keyRisks ?? [],
      motivationalMessage: aiResponse.motivationalMessage ?? 'You\'ve got this! Every journey begins with a single step.',
      suggestedHabits,
    };
  }

  private generateMockDecomposition(
    request: AIGoalDecompositionRequest,
    totalDays: number,
    totalWeeks: number
  ): AIGoalDecompositionResponse {
    const goalId = this.generateId();
    const today = new Date();
    const milestonesCount = Math.min(5, Math.max(3, Math.floor(totalWeeks / 4)));

    // Generate smart milestones based on goal category
    const milestoneTemplates = this.getMilestoneTemplates(request.category, request.ultimateGoal);
    
    const milestones: Milestone[] = milestoneTemplates.slice(0, milestonesCount).map((template, mIndex) => {
      const milestoneId = this.generateId();
      const weekNumber = Math.floor((totalWeeks / milestonesCount) * (mIndex + 1));
      const milestoneDate = addDays(today, weekNumber * 7);
      const weeksForMilestone = Math.floor(totalWeeks / milestonesCount);

      const weeklyObjectives: WeeklyObjective[] = Array.from({ length: Math.min(weeksForMilestone, 4) }, (_, wIndex) => {
        const objectiveId = this.generateId();
        const absoluteWeek = Math.floor((totalWeeks / milestonesCount) * mIndex) + wIndex + 1;
        const weekStart = addDays(today, (absoluteWeek - 1) * 7);
        const focusList = template.weeklyFocus ?? ['Progress', 'Review', 'Practice', 'Refinement'];

        const dailyTasks: DailyTask[] = Array.from({ length: 5 }, (_, tIndex) => ({
          id: this.generateId(),
          objectiveId,
          title: this.getTaskTitle(request.category, mIndex, wIndex, tIndex),
          description: this.getTaskDescription(request.category, tIndex),
          scheduledDate: addDays(weekStart, tIndex),
          estimatedMinutes: this.getTaskDuration(request.preferredDifficulty),
          priority: (tIndex === 0 ? 'high' : tIndex < 3 ? 'medium' : 'low') as DailyTask['priority'],
          status: 'pending' as const,
          xpReward: this.calculateTaskXp(tIndex === 0 ? 'hard' : 'medium'),
          difficulty: (tIndex === 0 ? 'hard' : 'medium') as 'easy' | 'medium' | 'hard',
        }));

        return {
          id: objectiveId,
          milestoneId,
          title: `Week ${absoluteWeek}: ${focusList[wIndex % focusList.length]}`,
          description: `Focus on ${focusList[wIndex % focusList.length].toLowerCase()} to build momentum.`,
          weekNumber: absoluteWeek,
          startDate: weekStart,
          endDate: endOfWeek(weekStart),
          status: 'not_started' as const,
          dailyTasks,
          progressPercentage: 0,
        };
      });

      return {
        id: milestoneId,
        goalId,
        title: template.title,
        description: template.description,
        targetDate: milestoneDate,
        status: 'not_started' as const,
        weeklyObjectives,
        progressPercentage: 0,
        progress: 0,
        order: mIndex + 1,
      };
    });

    const suggestedHabits = this.getSuggestedHabits(request.category);
    const identityStatement = this.getIdentityStatement(request.category, request.ultimateGoal);

    return {
      goalId,
      summary: `Your ${totalWeeks}-week journey to "${request.ultimateGoal}" is structured into ${milestonesCount} key milestones. Each week builds on the last, with daily tasks designed to fit your ${request.availableHoursPerDay} hours of available time. ${identityStatement}`,
      milestones,
      estimatedSuccessRate: this.calculateSuccessRate(request),
      keyRisks: this.getKeyRisks(request.category),
      motivationalMessage: this.getMotivationalMessage(request.category),
      suggestedHabits,
      identityStatement,
      microTaskPreview: this.getMicroTaskPreview(milestones),
      // Time estimates
      ...this.calculateTimeEstimates(request, totalWeeks, milestones),
    };
  }

  private calculateTimeEstimates(
    request: AIGoalDecompositionRequest,
    totalWeeks: number,
    milestones: Milestone[]
  ): {
    estimatedTotalHours: number;
    estimatedWeeksToComplete: number;
    recommendedDailyMinutes: number;
    researchBasedDuration: { typical: string; fastest: string; comfortable: string; source: string };
  } {
    const timeEstimate = getGoalTimeEstimate(request.ultimateGoal, request.category);
    
    // Calculate total task hours from milestones
    let totalTaskMinutes = 0;
    milestones.forEach(m => {
      m.weeklyObjectives.forEach(w => {
        w.dailyTasks.forEach(t => {
          totalTaskMinutes += t.estimatedMinutes;
        });
      });
    });
    
    const estimatedTotalHours = Math.max(timeEstimate.avgHours, Math.round(totalTaskMinutes / 60));
    
    // Adjust recommended daily minutes based on busyness
    let recommendedDailyMinutes = Math.round((estimatedTotalHours * 60) / (totalWeeks * 5));
    if (request.busynessLevel === 'very_busy') {
      recommendedDailyMinutes = Math.min(recommendedDailyMinutes, 30);
    } else if (request.busynessLevel === 'busy') {
      recommendedDailyMinutes = Math.min(recommendedDailyMinutes, 45);
    } else if (request.busynessLevel === 'light') {
      recommendedDailyMinutes = Math.max(recommendedDailyMinutes, 45);
    }
    
    return {
      estimatedTotalHours,
      estimatedWeeksToComplete: totalWeeks,
      recommendedDailyMinutes,
      researchBasedDuration: {
        typical: timeEstimate.typical,
        fastest: timeEstimate.fastest,
        comfortable: timeEstimate.comfortable,
        source: 'Based on research of similar goal achievers',
      },
    };
  }

  private getIdentityStatement(category: GoalCategory, _goal: string): string {
    const identities: Record<GoalCategory, string> = {
      fitness: 'You are becoming someone who prioritizes their physical health and shows up for their body every day.',
      health: 'You are becoming someone who treats their body with respect and makes choices that serve their wellbeing.',
      career: 'You are becoming someone who takes bold action toward their professional dreams and creates opportunities.',
      education: 'You are becoming someone who learns continuously and embraces the joy of mastery.',
      finance: 'You are becoming someone who manages money wisely and builds lasting wealth.',
      relationships: 'You are becoming someone who nurtures deep connections and shows up for the people they love.',
      creativity: 'You are becoming someone who creates boldly and shares their unique gifts with the world.',
      mindfulness: 'You are becoming someone who lives with presence and responds to life with calm awareness.',
      productivity: 'You are becoming someone who focuses on what matters most and makes every day count.',
      custom: 'You are becoming someone who takes consistent action toward their dreams.',
    };
    return identities[category] || identities.custom;
  }

  private getMicroTaskPreview(milestones: Milestone[]): { task: string; day: string; xp: number }[] {
    const preview: { task: string; day: string; xp: number }[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Get first 5 tasks from first milestone as preview
    if (milestones.length > 0 && milestones[0].weeklyObjectives.length > 0) {
      const firstObjective = milestones[0].weeklyObjectives[0];
      firstObjective.dailyTasks.slice(0, 5).forEach((task, index) => {
        preview.push({
          task: task.title,
          day: dayNames[index % 7],
          xp: task.xpReward,
        });
      });
    }
    
    return preview;
  }

  private getMilestoneTemplates(category: GoalCategory, _goal: string): MilestoneTemplate[] {
    const templates: Record<GoalCategory, MilestoneTemplate[]> = {
      fitness: [
        { title: 'Foundation Building', description: 'Establish baseline fitness and build consistent exercise habits', weeklyFocus: ['Baseline Assessment', 'Form Practice', 'Endurance Building', 'Recovery Optimization'] },
        { title: 'Strength Development', description: 'Progressive overload and technique refinement', weeklyFocus: ['Strength Training', 'Cardio Integration', 'Flexibility Work', 'Performance Testing'] },
        { title: 'Peak Performance', description: 'Push limits and achieve breakthrough results', weeklyFocus: ['Intensity Training', 'Competition Prep', 'Nutrition Optimization', 'Mental Conditioning'] },
        { title: 'Goal Achievement', description: 'Final push and celebration of your fitness transformation', weeklyFocus: ['Final Preparation', 'Goal Completion', 'Maintenance Planning', 'Progress Documentation'] },
      ],
      health: [
        { title: 'Health Audit', description: 'Understand your current health status and create baseline measurements', weeklyFocus: ['Health Assessment', 'Nutrition Review', 'Sleep Analysis', 'Stress Evaluation'] },
        { title: 'Habit Formation', description: 'Build core health habits that stick', weeklyFocus: ['Morning Routine', 'Nutrition Habits', 'Movement Integration', 'Mindfulness Practice'] },
        { title: 'Optimization', description: 'Fine-tune your health routines for maximum impact', weeklyFocus: ['Energy Optimization', 'Sleep Enhancement', 'Diet Refinement', 'Stress Management'] },
        { title: 'Sustainable Health', description: 'Lock in long-term health behaviors', weeklyFocus: ['Habit Stacking', 'Progress Review', 'Future Planning', 'Celebration'] },
      ],
      career: [
        { title: 'Skill Assessment', description: 'Identify gaps and opportunities for growth', weeklyFocus: ['Current State Analysis', 'Goal Mapping', 'Skill Gaps', 'Learning Plan'] },
        { title: 'Skill Building', description: 'Develop key competencies for career advancement', weeklyFocus: ['Core Skills', 'Advanced Learning', 'Practical Application', 'Feedback Integration'] },
        { title: 'Network Expansion', description: 'Build relationships that accelerate your career', weeklyFocus: ['Networking Strategy', 'Relationship Building', 'Mentorship', 'Personal Branding'] },
        { title: 'Career Leap', description: 'Take decisive action toward your career goal', weeklyFocus: ['Opportunity Creation', 'Application/Pitch', 'Interview Prep', 'Negotiation'] },
      ],
      education: [
        { title: 'Learning Foundation', description: 'Set up optimal learning environment and strategies', weeklyFocus: ['Study System Setup', 'Resource Gathering', 'Schedule Creation', 'Learning Techniques'] },
        { title: 'Core Knowledge', description: 'Master fundamental concepts and build understanding', weeklyFocus: ['Concept Study', 'Practice Problems', 'Note Taking', 'Review Sessions'] },
        { title: 'Deep Mastery', description: 'Develop expertise and advanced understanding', weeklyFocus: ['Advanced Topics', 'Project Work', 'Peer Learning', 'Expert Consultation'] },
        { title: 'Knowledge Integration', description: 'Apply learning and demonstrate mastery', weeklyFocus: ['Practical Application', 'Portfolio Building', 'Assessment Prep', 'Achievement Recognition'] },
      ],
      finance: [
        { title: 'Financial Clarity', description: 'Understand your complete financial picture', weeklyFocus: ['Income Analysis', 'Expense Tracking', 'Debt Assessment', 'Net Worth Calculation'] },
        { title: 'Budget Mastery', description: 'Create and stick to an effective budget', weeklyFocus: ['Budget Creation', 'Expense Optimization', 'Savings Automation', 'Spending Habits'] },
        { title: 'Growth Strategy', description: 'Build wealth through smart money management', weeklyFocus: ['Investment Learning', 'Portfolio Building', 'Income Growth', 'Tax Optimization'] },
        { title: 'Financial Freedom', description: 'Achieve and maintain your financial goal', weeklyFocus: ['Goal Review', 'Strategy Adjustment', 'Milestone Celebration', 'Future Planning'] },
      ],
      relationships: [
        { title: 'Self-Reflection', description: 'Understand your relationship patterns and needs', weeklyFocus: ['Personal Assessment', 'Communication Style', 'Emotional Intelligence', 'Goal Setting'] },
        { title: 'Connection Building', description: 'Develop deeper, more meaningful relationships', weeklyFocus: ['Active Listening', 'Quality Time', 'Vulnerability Practice', 'Conflict Resolution'] },
        { title: 'Relationship Deepening', description: 'Strengthen bonds and build trust', weeklyFocus: ['Trust Building', 'Shared Experiences', 'Support Systems', 'Appreciation Practice'] },
        { title: 'Lasting Connection', description: 'Create sustainable relationship habits', weeklyFocus: ['Routine Building', 'Check-in Systems', 'Growth Together', 'Celebration'] },
      ],
      creativity: [
        { title: 'Creative Awakening', description: 'Reconnect with your creative potential', weeklyFocus: ['Inspiration Gathering', 'Block Removal', 'Skill Assessment', 'Project Ideation'] },
        { title: 'Daily Practice', description: 'Build a consistent creative practice', weeklyFocus: ['Routine Building', 'Technique Practice', 'Experimentation', 'Feedback Seeking'] },
        { title: 'Project Development', description: 'Create substantial creative work', weeklyFocus: ['Project Focus', 'Iteration', 'Refinement', 'Polish'] },
        { title: 'Creative Expression', description: 'Share your work and celebrate your creativity', weeklyFocus: ['Completion', 'Sharing', 'Reflection', 'Next Steps'] },
      ],
      mindfulness: [
        { title: 'Awareness Foundation', description: 'Build basic mindfulness skills', weeklyFocus: ['Breath Work', 'Body Scan', 'Present Moment', 'Observation'] },
        { title: 'Deepening Practice', description: 'Expand mindfulness into daily life', weeklyFocus: ['Longer Sessions', 'Walking Meditation', 'Mindful Eating', 'Emotion Awareness'] },
        { title: 'Integration', description: 'Make mindfulness automatic', weeklyFocus: ['Habit Stacking', 'Stress Response', 'Compassion Practice', 'Difficult Emotions'] },
        { title: 'Mindful Living', description: 'Live with continuous awareness', weeklyFocus: ['Full Integration', 'Teaching Others', 'Retreat Planning', 'Lifelong Practice'] },
      ],
      productivity: [
        { title: 'System Audit', description: 'Understand your current productivity landscape', weeklyFocus: ['Time Audit', 'Energy Mapping', 'Distraction Analysis', 'Tool Review'] },
        { title: 'System Building', description: 'Create your personal productivity system', weeklyFocus: ['Task Management', 'Calendar Blocking', 'Focus Sessions', 'Review Routines'] },
        { title: 'Optimization', description: 'Fine-tune for maximum output', weeklyFocus: ['Deep Work', 'Automation', 'Delegation', 'Energy Management'] },
        { title: 'Peak Performance', description: 'Maintain high productivity sustainably', weeklyFocus: ['Routine Mastery', 'Burnout Prevention', 'Continuous Improvement', 'Success Celebration'] },
      ],
      custom: [
        { title: 'Planning Phase', description: 'Define success and create your roadmap', weeklyFocus: ['Goal Clarity', 'Resource Planning', 'Timeline Setting', 'Support Systems'] },
        { title: 'Execution Phase', description: 'Take consistent action toward your goal', weeklyFocus: ['Daily Actions', 'Progress Tracking', 'Adjustment', 'Momentum Building'] },
        { title: 'Acceleration Phase', description: 'Increase intensity and push through plateaus', weeklyFocus: ['Intensity Increase', 'Obstacle Removal', 'Support Leverage', 'Skill Enhancement'] },
        { title: 'Completion Phase', description: 'Finish strong and celebrate achievement', weeklyFocus: ['Final Push', 'Quality Check', 'Completion', 'Celebration'] },
      ],
    };

    return templates[category] || templates.custom;
  }

  private getTaskTitle(category: GoalCategory, milestone: number, week: number, task: number): string {
    const taskBanks: Record<GoalCategory, string[][]> = {
      fitness: [
        ['Complete baseline fitness test', 'Plan weekly workout schedule', 'Research proper form videos', 'Prepare workout space', 'Do first full workout'],
        ['Progressive overload session', 'Active recovery day', 'Nutrition planning', 'Track measurements', 'Mobility routine'],
      ],
      health: [
        ['Complete health journal entry', 'Prepare healthy meals', 'Get 8 hours of sleep', 'Take a 30-min walk', 'Practice deep breathing'],
        ['Meal prep for the week', 'Try a new healthy recipe', 'Schedule health checkup', 'Track water intake', 'Evening stretching'],
      ],
      career: [
        ['Update resume/portfolio', 'Research industry trends', 'Reach out to 2 connections', 'Learn new skill (30 min)', 'Set weekly career goals'],
        ['Apply to opportunities', 'Practice interview skills', 'Attend networking event', 'Complete online course', 'Review and reflect'],
      ],
      education: [
        ['Study core concepts (1 hour)', 'Complete practice exercises', 'Review and take notes', 'Watch educational content', 'Quiz yourself'],
        ['Deep dive into topic', 'Group study session', 'Create summary notes', 'Teach concept to someone', 'Assessment preparation'],
      ],
      finance: [
        ['Track all expenses', 'Review budget progress', 'Research investment options', 'Automate one payment', 'Find one expense to cut'],
        ['Increase savings rate', 'Review subscriptions', 'Learn about investing', 'Set up emergency fund', 'Plan next month'],
      ],
      relationships: [
        ['Have meaningful conversation', 'Express gratitude', 'Plan quality time', 'Practice active listening', 'Send appreciation message'],
        ['Try new activity together', 'Address one small issue', 'Create shared goal', 'Celebrate small wins', 'Reflect on relationship'],
      ],
      creativity: [
        ['Create for 30 minutes', 'Consume inspiring content', 'Brainstorm new ideas', 'Share work with someone', 'Learn new technique'],
        ['Work on main project', 'Experiment freely', 'Get feedback', 'Refine recent work', 'Plan next creative sprint'],
      ],
      mindfulness: [
        ['Morning meditation (10 min)', 'Mindful lunch break', 'Gratitude journaling', 'Body scan before bed', 'Mindful walking'],
        ['Extended meditation (20 min)', 'Loving-kindness practice', 'Digital detox hour', 'Nature connection', 'Reflection session'],
      ],
      productivity: [
        ['Time block your day', 'Complete top 3 priorities', 'Review and clear inbox', 'Eliminate one distraction', 'End-of-day review'],
        ['Deep work session (2 hours)', 'Batch similar tasks', 'Delegate one task', 'Automate repetitive work', 'Weekly review'],
      ],
      custom: [
        ['Work on main goal (30 min)', 'Review progress', 'Learn something relevant', 'Remove one obstacle', 'Plan tomorrow'],
        ['Extended focus session', 'Get feedback on progress', 'Adjust approach if needed', 'Celebrate small win', 'Prepare for next week'],
      ],
    };

    const bank = taskBanks[category] || taskBanks.custom;
    const milestoneBank = bank[milestone % bank.length] || bank[0];
    return milestoneBank[task % milestoneBank.length] || `Complete daily task ${task + 1}`;
  }

  private getTaskDescription(category: GoalCategory, taskIndex: number): string {
    const descriptions = [
      'Focus on quality over quantity. Take your time.',
      'Build momentum with consistent action.',
      'Review your progress and adjust as needed.',
      'Push slightly beyond your comfort zone.',
      'Celebrate completing this task!',
    ];
    return descriptions[taskIndex % descriptions.length];
  }

  private getTaskDuration(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return Math.random() > 0.5 ? 15 : 20;
      case 'moderate': return Math.random() > 0.5 ? 30 : 45;
      case 'challenging': return Math.random() > 0.5 ? 45 : 60;
      default: return 30;
    }
  }

  private calculateTaskXp(difficulty: 'easy' | 'medium' | 'hard'): number {
    switch (difficulty) {
      case 'easy': return 5;
      case 'medium': return 10;
      case 'hard': return 20;
      default: return 10;
    }
  }

  private calculateSuccessRate(request: AIGoalDecompositionRequest): number {
    let rate = 70;
    if (request.preferredDifficulty === 'easy') rate += 10;
    if (request.preferredDifficulty === 'challenging') rate -= 5;
    if (request.availableHoursPerDay >= 2) rate += 5;
    if (request.currentSkillLevel === 'advanced') rate += 5;
    if (request.currentSkillLevel === 'beginner') rate -= 5;
    return Math.min(95, Math.max(50, rate));
  }

  private getKeyRisks(category: GoalCategory): string[] {
    const risks: Record<GoalCategory, string[]> = {
      fitness: ['Injury from overtraining', 'Motivation dips in week 3-4', 'Inconsistent schedule'],
      health: ['Old habits creeping back', 'Social pressure', 'Stress eating'],
      career: ['Imposter syndrome', 'Rejection fatigue', 'Time conflicts'],
      education: ['Information overload', 'Procrastination', 'Lack of application'],
      finance: ['Unexpected expenses', 'Lifestyle inflation', 'Short-term thinking'],
      relationships: ['Communication breakdowns', 'Time constraints', 'Unresolved issues'],
      creativity: ['Perfectionism', 'Creative blocks', 'Comparison to others'],
      mindfulness: ['Inconsistent practice', 'Expecting quick results', 'Life getting busy'],
      productivity: ['Burnout', 'Over-optimization', 'Neglecting rest'],
      custom: ['Losing focus', 'Underestimating time', 'Not tracking progress'],
    };
    return risks[category] || risks.custom;
  }

  private getMotivationalMessage(category: GoalCategory): string {
    const messages: Record<GoalCategory, string> = {
      fitness: '💪 Your body is capable of amazing things. Every workout is a vote for the person you want to become!',
      health: '🌱 Health is wealth. Small daily choices compound into a vibrant, energetic life!',
      career: '🚀 Your career is a marathon, not a sprint. Each step forward is progress worth celebrating!',
      education: '📚 Every expert was once a beginner. Your dedication to learning will open doors you can\'t yet imagine!',
      finance: '💰 Financial freedom is built one smart decision at a time. You\'re investing in your future self!',
      relationships: '❤️ Connection is the deepest human need. The effort you put into relationships returns tenfold!',
      creativity: '🎨 Your unique perspective is your superpower. Create boldly and share your gifts with the world!',
      mindfulness: '🧘 Peace is not found, it\'s practiced. Each moment of presence is a gift to yourself!',
      productivity: '⚡ Productivity isn\'t about doing more—it\'s about doing what matters. You\'re on the right track!',
      custom: '✨ You have everything you need to succeed. Trust the process and keep showing up!',
    };
    return messages[category] || messages.custom;
  }

  private getSuggestedHabits(category: GoalCategory): Partial<Habit>[] {
    const habitSuggestions: Record<GoalCategory, Partial<Habit>[]> = {
      fitness: [
        { name: 'Morning stretch', description: '5-minute mobility routine', category: 'fitness', monthlyGoal: 25, icon: '🧘', color: '#22C55E' },
        { name: 'Track protein intake', description: 'Log daily protein consumption', category: 'health', monthlyGoal: 25, icon: '🥩', color: '#EF4444' },
        { name: 'Sleep 7+ hours', description: 'Prioritize recovery', category: 'health', monthlyGoal: 25, icon: '😴', color: '#6366F1' },
      ],
      health: [
        { name: 'Drink 8 glasses water', description: 'Stay hydrated', category: 'health', monthlyGoal: 25, icon: '💧', color: '#3B82F6' },
        { name: 'Eat vegetables', description: 'Include veggies in every meal', category: 'health', monthlyGoal: 25, icon: '🥦', color: '#22C55E' },
        { name: 'No phone before bed', description: '30 min screen-free before sleep', category: 'self_care', monthlyGoal: 20, icon: '📵', color: '#8B5CF6' },
      ],
      career: [
        { name: 'Learn 30 minutes', description: 'Daily skill development', category: 'learning', monthlyGoal: 20, icon: '📖', color: '#F59E0B' },
        { name: 'Network contact', description: 'Reach out to one connection', category: 'social', monthlyGoal: 15, icon: '🤝', color: '#EC4899' },
        { name: 'Review goals', description: 'Check progress on career goals', category: 'productivity', monthlyGoal: 25, icon: '🎯', color: '#14B8A6' },
      ],
      education: [
        { name: 'Study session', description: 'Focused learning time', category: 'learning', monthlyGoal: 25, icon: '📚', color: '#6366F1' },
        { name: 'Review notes', description: 'Spaced repetition review', category: 'learning', monthlyGoal: 20, icon: '📝', color: '#8B5CF6' },
        { name: 'Teach concept', description: 'Explain what you learned', category: 'learning', monthlyGoal: 10, icon: '👨‍🏫', color: '#F59E0B' },
      ],
      finance: [
        { name: 'Track expenses', description: 'Log all spending', category: 'finance', monthlyGoal: 25, icon: '💸', color: '#22C55E' },
        { name: 'Review budget', description: 'Check budget adherence', category: 'finance', monthlyGoal: 8, icon: '📊', color: '#3B82F6' },
        { name: 'No impulse buys', description: 'Wait 24h before purchases', category: 'finance', monthlyGoal: 25, icon: '🛑', color: '#EF4444' },
      ],
      relationships: [
        { name: 'Quality time', description: 'Undivided attention with loved ones', category: 'social', monthlyGoal: 20, icon: '💑', color: '#EC4899' },
        { name: 'Express gratitude', description: 'Thank someone specifically', category: 'social', monthlyGoal: 25, icon: '🙏', color: '#F59E0B' },
        { name: 'Active listening', description: 'Really hear someone', category: 'social', monthlyGoal: 20, icon: '👂', color: '#14B8A6' },
      ],
      creativity: [
        { name: 'Create daily', description: 'Make something, anything', category: 'creativity', monthlyGoal: 25, icon: '🎨', color: '#8B5CF6' },
        { name: 'Consume inspiration', description: 'Read, watch, or listen to art', category: 'creativity', monthlyGoal: 20, icon: '✨', color: '#F59E0B' },
        { name: 'Share work', description: 'Put your creation out there', category: 'creativity', monthlyGoal: 8, icon: '📤', color: '#3B82F6' },
      ],
      mindfulness: [
        { name: 'Morning meditation', description: '10 minutes of stillness', category: 'mindfulness', monthlyGoal: 25, icon: '🧘', color: '#14B8A6' },
        { name: 'Gratitude journal', description: 'Write 3 things you\'re grateful for', category: 'mindfulness', monthlyGoal: 25, icon: '📓', color: '#F59E0B' },
        { name: 'Mindful breathing', description: '3 deep breaths, multiple times', category: 'mindfulness', monthlyGoal: 25, icon: '🌬️', color: '#6366F1' },
      ],
      productivity: [
        { name: 'Plan tomorrow', description: 'Set top 3 priorities night before', category: 'productivity', monthlyGoal: 25, icon: '📋', color: '#3B82F6' },
        { name: 'Deep work block', description: '90 min uninterrupted focus', category: 'productivity', monthlyGoal: 20, icon: '🎯', color: '#EF4444' },
        { name: 'Inbox zero', description: 'Process email to empty', category: 'productivity', monthlyGoal: 20, icon: '📧', color: '#22C55E' },
      ],
      custom: [
        { name: 'Daily action', description: 'One step toward your goal', category: 'productivity', monthlyGoal: 25, icon: '⚡', color: '#F59E0B' },
        { name: 'Progress review', description: 'Check your advancement', category: 'productivity', monthlyGoal: 8, icon: '📊', color: '#3B82F6' },
        { name: 'Self-care', description: 'Do something just for you', category: 'self_care', monthlyGoal: 20, icon: '💆', color: '#EC4899' },
      ],
    };

    return habitSuggestions[category] || habitSuggestions.custom;
  }

  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      health: '❤️', fitness: '💪', mindfulness: '🧘', productivity: '⚡',
      learning: '📚', creativity: '🎨', social: '👥', finance: '💰',
      self_care: '💆', custom: '✨',
    };
    return icons[category] || '✨';
  }

  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      health: '#EF4444', fitness: '#22C55E', mindfulness: '#14B8A6', productivity: '#3B82F6',
      learning: '#6366F1', creativity: '#8B5CF6', social: '#EC4899', finance: '#F59E0B',
      self_care: '#F472B6', custom: '#6B7280',
    };
    return colors[category] || '#6B7280';
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const aiGoalDecomposer = new AIGoalDecomposer();
