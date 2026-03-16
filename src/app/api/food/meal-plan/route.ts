// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Meal Plan Generator
// Generates personalized weekly meal plans based on user goals + preferences
// Uses Groq/Gemini for AI planning + TheMealDB for real recipes
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

const CALORIE_GOALS: Record<string, number> = {
  lose_weight: 1600,
  maintain: 2000,
  build_muscle: 2400,
  performance: 2800,
};

const DIET_CATEGORIES: Record<string, string[]> = {
  balanced: ['Chicken', 'Seafood', 'Beef', 'Vegetarian', 'Pasta', 'Side'],
  vegetarian: ['Vegetarian', 'Side', 'Pasta', 'Miscellaneous'],
  vegan: ['Vegetarian', 'Side', 'Miscellaneous'],
  keto: ['Beef', 'Chicken', 'Seafood', 'Lamb'],
  high_protein: ['Chicken', 'Beef', 'Seafood', 'Lamb'],
};

async function fetchRandomFromCategory(category: string): Promise<any | null> {
  try {
    const res = await fetch(`${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await res.json();
    const meals = data.meals;
    if (!meals?.length) return null;
    const pick = meals[Math.floor(Math.random() * Math.min(meals.length, 20))];
    // Fetch full details
    const detailRes = await fetch(`${MEALDB_BASE}/lookup.php?i=${pick.idMeal}`);
    const detail = await detailRes.json();
    return detail.meals?.[0] ?? pick;
  } catch {
    return null;
  }
}

function buildMealPlan(
  goal: string,
  diet: string,
  days: number
): Promise<any[][]> {
  const targetCalories = CALORIE_GOALS[goal] ?? 2000;
  const categories = DIET_CATEGORIES[diet] ?? DIET_CATEGORIES.balanced;

  const mealSlots = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const calorieDistribution = {
    Breakfast: Math.round(targetCalories * 0.25),
    Lunch: Math.round(targetCalories * 0.35),
    Dinner: Math.round(targetCalories * 0.30),
    Snack: Math.round(targetCalories * 0.10),
  };

  // Fetch meals for each day
  const promises = Array.from({ length: days }, async (_, dayIdx) => {
    return Promise.all(
      mealSlots.map(async (slot) => {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const meal = await fetchRandomFromCategory(category);
        return {
          slot,
          meal: meal ? {
            id: `mdb_${meal.idMeal}`,
            name: meal.strMeal,
            category: meal.strCategory || category,
            thumbnail: meal.strMealThumb,
            youtubeUrl: meal.strYoutube,
          } : null,
          targetCalories: calorieDistribution[slot as keyof typeof calorieDistribution],
          day: dayIdx + 1,
        };
      })
    );
  });

  return Promise.all(promises);
}

async function generateAIMealAdvice(
  goal: string,
  diet: string,
  restrictions: string[],
  calories: number
): Promise<string> {
  if (!GROQ_KEY) {
    return `Your ${calories}-calorie ${diet} meal plan is designed to support your ${goal.replace(/_/g, ' ')} goal. Focus on nutrient timing, staying hydrated, and consistency over perfection.`;
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 280,
        messages: [{
          role: 'user',
          content: `Write a 3-sentence personalized nutrition coach note for someone with these parameters:
Goal: ${goal.replace(/_/g, ' ')}
Diet type: ${diet}
Dietary restrictions: ${restrictions.length ? restrictions.join(', ') : 'none'}
Daily calorie target: ${calories} kcal

Be specific, motivating, and practical. No fluff.`,
        }],
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch {
    return '';
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const {
    goal = 'maintain',
    diet = 'balanced',
    restrictions = [],
    days = 7,
    activityLevel = 'moderate',
  } = body;

  const calorieGoal = CALORIE_GOALS[goal] ?? 2000;
  // Adjust for activity level
  const activityMultipliers: Record<string, number> = {
    sedentary: 0.85,
    light: 0.93,
    moderate: 1.0,
    active: 1.10,
    very_active: 1.20,
  };
  const adjustedCalories = Math.round(calorieGoal * (activityMultipliers[activityLevel] ?? 1.0));

  const [weekPlan, aiAdvice] = await Promise.all([
    buildMealPlan(goal, diet, Math.min(days, 7)),
    generateAIMealAdvice(goal, diet, restrictions, adjustedCalories),
  ]);

  return NextResponse.json({
    plan: weekPlan,
    summary: {
      goal,
      diet,
      dailyCalorieTarget: adjustedCalories,
      macroSplit: {
        protein: goal === 'build_muscle' ? 35 : 25,
        carbs: goal === 'keto' ? 5 : 45,
        fat: goal === 'keto' ? 70 : 30,
      },
      aiAdvice,
      restrictions,
    },
  });
}
