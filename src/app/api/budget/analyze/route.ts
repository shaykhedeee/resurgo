import { NextRequest, NextResponse } from 'next/server';

const LOCATION_CURRENCY_MAP: Record<string, { code: string; symbol: string; locale: string }> = {
  'united kingdom': { code: 'GBP', symbol: '£', locale: 'en-GB' },
  'uk': { code: 'GBP', symbol: '£', locale: 'en-GB' },
  'england': { code: 'GBP', symbol: '£', locale: 'en-GB' },
  'scotland': { code: 'GBP', symbol: '£', locale: 'en-GB' },
  'wales': { code: 'GBP', symbol: '£', locale: 'en-GB' },
  'united states': { code: 'USD', symbol: '$', locale: 'en-US' },
  'usa': { code: 'USD', symbol: '$', locale: 'en-US' },
  'us': { code: 'USD', symbol: '$', locale: 'en-US' },
  'canada': { code: 'CAD', symbol: 'C$', locale: 'en-CA' },
  'australia': { code: 'AUD', symbol: 'A$', locale: 'en-AU' },
  'europe': { code: 'EUR', symbol: '€', locale: 'en-IE' },
  'germany': { code: 'EUR', symbol: '€', locale: 'de-DE' },
  'france': { code: 'EUR', symbol: '€', locale: 'fr-FR' },
  'spain': { code: 'EUR', symbol: '€', locale: 'es-ES' },
  'italy': { code: 'EUR', symbol: '€', locale: 'it-IT' },
  'netherlands': { code: 'EUR', symbol: '€', locale: 'nl-NL' },
  'nigeria': { code: 'NGN', symbol: '₦', locale: 'en-NG' },
  'india': { code: 'INR', symbol: '₹', locale: 'en-IN' },
  'south africa': { code: 'ZAR', symbol: 'R', locale: 'en-ZA' },
  'uae': { code: 'AED', symbol: 'AED', locale: 'ar-AE' },
  'dubai': { code: 'AED', symbol: 'AED', locale: 'ar-AE' },
  'ghana': { code: 'GHS', symbol: '₵', locale: 'en-GH' },
  'kenya': { code: 'KES', symbol: 'KSh', locale: 'en-KE' },
  'singapore': { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
  'new zealand': { code: 'NZD', symbol: 'NZ$', locale: 'en-NZ' },
  'brazil': { code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  'mexico': { code: 'MXN', symbol: '$', locale: 'es-MX' },
  'japan': { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  'china': { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
  'sweden': { code: 'SEK', symbol: 'kr', locale: 'sv-SE' },
  'norway': { code: 'NOK', symbol: 'kr', locale: 'nb-NO' },
  'denmark': { code: 'DKK', symbol: 'kr', locale: 'da-DK' },
  'switzerland': { code: 'CHF', symbol: 'CHF', locale: 'de-CH' },
  'poland': { code: 'PLN', symbol: 'zł', locale: 'pl-PL' },
  'turkey': { code: 'TRY', symbol: '₺', locale: 'tr-TR' },
  'pakistan': { code: 'PKR', symbol: '₨', locale: 'ur-PK' },
  'bangladesh': { code: 'BDT', symbol: '৳', locale: 'bn-BD' },
  'saudi arabia': { code: 'SAR', symbol: '﷼', locale: 'ar-SA' },
  'egypt': { code: 'EGP', symbol: 'E£', locale: 'ar-EG' },
};

export function detectCurrency(location: string): { code: string; symbol: string; locale: string } {
  if (!location) return { code: 'USD', symbol: '$', locale: 'en-US' };
  const lower = location.toLowerCase().trim();
  for (const [key, val] of Object.entries(LOCATION_CURRENCY_MAP)) {
    if (lower.includes(key)) return val;
  }
  return { code: 'USD', symbol: '$', locale: 'en-US' };
}

async function callAI(prompt: string): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.3,
        }),
      });
      if (res.ok) {
        const data = await res.json() as { choices: Array<{ message: { content: string } }> };
        return data.choices[0]?.message?.content ?? '';
      }
    } catch { /* fall through */ }
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      if (res.ok) {
        const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
        return data.candidates[0]?.content?.parts[0]?.text ?? '';
      }
    } catch { /* fall through */ }
  }

  throw new Error('No AI provider available');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      age?: number; gender?: string; lifeStage?: string; householdType?: string;
      incomeAmount?: number; incomeFrequency?: string; currency?: string; location?: string;
      budgetGoal?: string; dietaryPreference?: string; cooksAtHome?: string;
      hasTransportCosts?: boolean; fixedCommitments?: Array<{ name: string; amount: number }>;
      duration?: string;
    };

    const {
      age, gender, lifeStage, householdType,
      incomeAmount, incomeFrequency, currency, location,
      budgetGoal, dietaryPreference, cooksAtHome, hasTransportCosts,
      fixedCommitments, duration,
    } = body;

    const currencyInfo = detectCurrency(location ?? '');
    const effectiveCurrency = currency || currencyInfo.code;
    const effectiveSymbol = currencyInfo.symbol;

    const systemPrompt = `You are Resurgo's Budget Intelligence AI. You receive a user's complete financial profile and generate a detailed, hyper-personalized budget breakdown.

You MUST:
- Be specific to their gender, age, life stage, location, income level, household type, and dietary preference
- Calculate realistic category allocations (not generic percentages — real numbers in their local currency ${effectiveCurrency} ${effectiveSymbol})
- Suggest specific grocery items appropriate for their location, budget, dietary needs, and cooking ability
- Cover: Groceries, Transport, Utilities, Entertainment, Savings, Emergency Fund, Clothing, Subscriptions, Miscellaneous
- Flag if budget is too tight and suggest adjustments
- Generate a "survival mode" sub-plan if income is very low
- For students/allowance users: prioritize food, transport, and a small savings goal above all else
- All suggestions must be actionable, not vague
- Output ONLY valid JSON (no markdown, no code blocks) in this exact structure:

{
  "totalBudget": number,
  "currency": "${effectiveCurrency}",
  "symbol": "${effectiveSymbol}",
  "period": "${duration || 'monthly'}",
  "isTight": boolean,
  "survivalMode": boolean,
  "categories": [
    {
      "id": "groceries",
      "name": "Groceries",
      "icon": "🛒",
      "allocated": number,
      "suggestions": ["item1 - qty - approx cost", "item2 - qty - approx cost"],
      "cheaperAlternatives": ["tip1", "tip2"],
      "nearbyStores": ["store name (for their location)"]
    }
  ],
  "insights": [
    "insight1 (one sentence, actionable)",
    "insight2 (one sentence, actionable)",
    "insight3 (one sentence, actionable)"
  ],
  "adjustmentTips": ["tip1", "tip2"]
}`;

    const userPrompt = `User financial profile:
- Age: ${age || 'unknown'}, Gender: ${gender || 'unspecified'}
- Life stage: ${lifeStage || 'unknown'}, Household: ${householdType || 'unknown'}
- Income: ${effectiveSymbol}${incomeAmount || 0} ${incomeFrequency || 'monthly'}
- Location: ${location || 'unknown'}, Currency: ${effectiveCurrency}
- Budget goal: ${budgetGoal || 'track spending'}
- Dietary preference: ${dietaryPreference || 'none'}
- Cooks at home: ${cooksAtHome || 'sometimes'}
- Has transport costs: ${hasTransportCosts ? 'yes' : 'no'}
- Fixed commitments: ${fixedCommitments?.length ? fixedCommitments.map(c => `${c.name}: ${effectiveSymbol}${c.amount}`).join(', ') : 'none'}
- Duration: ${duration || 'monthly'}

Generate a detailed, personalized budget plan as JSON. Be specific and realistic for their location and income level.`;

    const raw = await callAI(`${systemPrompt}\n\n${userPrompt}`);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');
    const plan = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, plan, currency: effectiveCurrency, symbol: effectiveSymbol });
  } catch (err) {
    console.error('Budget analysis error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
