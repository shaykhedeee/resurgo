'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Budget Planner (AI-Powered Full Rebuild)
// Smart budget analysis · currency detection · expense logging · AI insights
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { FormEvent, useState, useCallback, useEffect } from 'react';
import {
  Plus, Trash2, Target, X, ChevronRight, ChevronLeft, RefreshCw, Zap,
  ShoppingCart, Car, Home, Coffee, Dumbbell, Shirt,
  Wifi, Briefcase, AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TxType = 'income' | 'expense';
type Tab = 'ai-plan' | 'transactions' | 'goals';

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  suggestions: string[];
  cheaperAlternatives?: string[];
  nearbyStores?: string[];
}

interface BudgetPlan {
  totalBudget: number;
  currency: string;
  symbol: string;
  period: string;
  isTight: boolean;
  survivalMode: boolean;
  categories: BudgetCategory[];
  insights: string[];
  adjustmentTips?: string[];
}

interface Transaction {
  _id: string;
  type: TxType;
  amount: number;
  currency?: string;
  category: string;
  description: string;
  date: string;
}

interface FinancialGoal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency?: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused';
}

const EXPENSE_CATS = ['Housing', 'Food', 'Transport', 'Health', 'Entertainment', 'Education', 'Clothing', 'Utilities', 'Subscriptions', 'Other'];
const INCOME_CATS  = ['Salary', 'Freelance', 'Investment', 'Business', 'Side Hustle', 'Gift', 'Other'];
const CURRENCIES   = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD', 'AUD', 'NGN', 'ZAR', 'GHS', 'KES', 'SGD', 'BRL', 'MXN'];
const LIFE_STAGES = ['Student', 'Employed', 'Freelancer', 'Business Owner', 'Unemployed', 'Other'];
const HOUSEHOLD_TYPES = ['Living alone', 'With family', 'With roommates', 'With partner'];
const INCOME_FREQUENCIES = ['Weekly', 'Bi-weekly', 'Monthly'];
const BUDGET_GOALS = ['Survive the month', 'Save something', 'Pay off debt', 'Build emergency fund', 'Invest', 'Just track spending'];
const DIETARY_PREFS = ['No restrictions', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free', 'Budget-max (cheapest possible)'];
const COOK_OPTIONS = ['Yes', 'Sometimes', 'Rarely'];

const CAT_ICONS: Record<string, React.ElementType> = {
  groceries: ShoppingCart, food: ShoppingCart, transport: Car, housing: Home,
  entertainment: Coffee, fitness: Dumbbell, clothing: Shirt,
  utilities: Wifi, subscriptions: Wifi, savings: Target, 'emergency fund': Target,
  miscellaneous: Briefcase, other: Briefcase,
};

function fmt(n: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n}`;
  }
}

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getCatIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(CAT_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Briefcase;
}

interface WizardData {
  lifeStage: string;
  householdType: string;
  incomeAmount: string;
  incomeFrequency: string;
  currency: string;
  budgetGoal: string;
  dietaryPreference: string;
  cooksAtHome: string;
  hasTransportCosts: boolean;
  fixedRent: string;
  fixedLoan: string;
  duration: string;
}

function BudgetWizard({ onComplete, defaultCurrency }: { onComplete: (data: WizardData) => void; defaultCurrency: string }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    lifeStage: '', householdType: '', incomeAmount: '', incomeFrequency: 'Monthly',
    currency: defaultCurrency || 'USD', budgetGoal: '', dietaryPreference: '',
    cooksAtHome: 'Sometimes', hasTransportCosts: false, fixedRent: '', fixedLoan: '', duration: 'Monthly',
  });

  const upd = (k: keyof WizardData, v: string | boolean) => setData((d) => ({ ...d, [k]: v }));

  const canNext = [
    data.lifeStage && data.householdType,
    data.incomeAmount && data.incomeFrequency && data.currency,
    data.budgetGoal,
    data.dietaryPreference && data.cooksAtHome,
  ][step];

  const stepTitles = ["Who are you?", "What are you working with?", "What's your budget for?", "Any restrictions?"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-orange-500">STEP {step + 1}/4</p>
            <h2 className="mt-0.5 font-mono text-base font-bold text-zinc-100">{stepTitles[step]}</h2>
          </div>
          <div className="flex gap-1">
            {[0,1,2,3].map((i) => (
              <div key={i} className={cn('h-1 w-8', i <= step ? 'bg-orange-500' : 'bg-zinc-800')} />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {step === 0 && (
            <>
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">LIFE_STAGE</p>
                <div className="grid grid-cols-2 gap-2">
                  {LIFE_STAGES.map((s) => (
                    <button key={s} onClick={() => upd('lifeStage', s)}
                      className={cn('border py-2.5 px-3 font-mono text-xs tracking-wide text-left transition',
                        data.lifeStage === s ? 'border-orange-600 bg-orange-950/40 text-orange-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">HOUSEHOLD_TYPE</p>
                <div className="grid grid-cols-2 gap-2">
                  {HOUSEHOLD_TYPES.map((h) => (
                    <button key={h} onClick={() => upd('householdType', h)}
                      className={cn('border py-2.5 px-3 font-mono text-xs tracking-wide text-left transition',
                        data.householdType === h ? 'border-orange-600 bg-orange-950/40 text-orange-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600')}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">AMOUNT</p>
                  <input type="number" value={data.incomeAmount} onChange={(e) => upd('incomeAmount', e.target.value)}
                    placeholder="e.g. 1500" className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-orange-700 focus:outline-none" />
                </div>
                <div>
                  <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">CURRENCY</p>
                  <select value={data.currency} onChange={(e) => upd('currency', e.target.value)}
                    className="h-10 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:outline-none">
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">FREQUENCY</p>
                <div className="flex gap-2">
                  {INCOME_FREQUENCIES.map((f) => (
                    <button key={f} onClick={() => upd('incomeFrequency', f)}
                      className={cn('flex-1 border py-2 font-mono text-xs transition',
                        data.incomeFrequency === f ? 'border-orange-600 bg-orange-950/40 text-orange-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">FIXED COMMITMENTS (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={data.fixedRent} onChange={(e) => upd('fixedRent', e.target.value)}
                    placeholder="Rent/month" className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 placeholder:text-zinc-500 focus:border-orange-700 focus:outline-none" />
                  <input type="number" value={data.fixedLoan} onChange={(e) => upd('fixedLoan', e.target.value)}
                    placeholder="Loan repayment" className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 placeholder:text-zinc-500 focus:border-orange-700 focus:outline-none" />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">PRIMARY_GOAL</p>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_GOALS.map((g) => (
                  <button key={g} onClick={() => upd('budgetGoal', g)}
                    className={cn('border py-2.5 px-3 font-mono text-xs tracking-wide text-left transition',
                      data.budgetGoal === g ? 'border-orange-600 bg-orange-950/40 text-orange-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600')}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">DIETARY_PREFERENCE</p>
                <div className="grid grid-cols-2 gap-2">
                  {DIETARY_PREFS.map((d) => (
                    <button key={d} onClick={() => upd('dietaryPreference', d)}
                      className={cn('border py-2.5 px-3 font-mono text-xs tracking-wide text-left transition',
                        data.dietaryPreference === d ? 'border-orange-600 bg-orange-950/40 text-orange-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600')}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">DO YOU COOK AT HOME?</p>
                <div className="flex gap-2">
                  {COOK_OPTIONS.map((c) => (
                    <button key={c} onClick={() => upd('cooksAtHome', c)}
                      className={cn('flex-1 border py-2 font-mono text-xs transition',
                        data.cooksAtHome === c ? 'border-orange-600 bg-orange-950/40 text-orange-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600')}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => upd('hasTransportCosts', !data.hasTransportCosts)}
                  className={cn('h-5 w-5 border flex items-center justify-center transition',
                    data.hasTransportCosts ? 'border-orange-600 bg-orange-600' : 'border-zinc-600')}>
                  {data.hasTransportCosts && <span className="font-mono text-[10px] text-black">✓</span>}
                </button>
                <p className="font-mono text-xs text-zinc-400">I have regular transport costs (car, transit)</p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 border-t border-zinc-800 p-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 border border-zinc-700 px-4 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-300 transition">
              <ChevronLeft className="h-3 w-3" /> BACK
            </button>
          )}
          <button
            onClick={() => step < 3 ? setStep(s => s + 1) : onComplete(data)}
            disabled={!canNext}
            className={cn('flex-1 flex items-center justify-center gap-1.5 border py-2.5 font-mono text-xs tracking-widest transition',
              canNext ? 'border-orange-700 bg-orange-950/40 text-orange-400 hover:bg-orange-950/70' : 'border-zinc-800 text-zinc-600 cursor-not-allowed')}>
            {step < 3 ? (<>NEXT <ChevronRight className="h-3 w-3" /></>) : (<><Zap className="h-3 w-3" /> GENERATE_PLAN</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  cat, spent, currency, onLogExpense,
}: {
  cat: BudgetCategory;
  spent: number;
  currency: string;
  onLogExpense: (catId: string, catName: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pct = cat.allocated > 0 ? Math.min(100, Math.round((spent / cat.allocated) * 100)) : 0;
  const isOver = spent > cat.allocated;
  // used to determine icon type for future use
  void getCatIcon(cat.name);

  return (
    <div className={cn('border bg-zinc-950', isOver ? 'border-amber-700' : 'border-zinc-800')}>
      <div className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{cat.icon}</span>
            <div>
              <p className="font-mono text-xs font-bold text-zinc-200">{cat.name}</p>
              <p className="font-mono text-xs text-zinc-400">{fmt(cat.allocated, currency)}</p>
            </div>
          </div>
          {isOver && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
        </div>
        <div className="mt-3 h-1.5 bg-zinc-900">
          <div className={cn('h-full transition-all', isOver ? 'bg-amber-500' : 'bg-orange-600')} style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 flex justify-between">
          <p className="font-mono text-[10px] text-zinc-500">Spent: {fmt(spent, currency)}</p>
          <p className={cn('font-mono text-[10px]', isOver ? 'text-amber-400' : 'text-zinc-500')}>{pct}%</p>
        </div>
        <div className="mt-3 flex gap-1.5">
          <button onClick={() => onLogExpense(cat.id, cat.name)}
            className="flex-1 border border-zinc-700 py-1.5 font-mono text-[10px] tracking-wider text-zinc-300 hover:border-zinc-500 hover:text-zinc-200 transition">
            + LOG
          </button>
          {cat.suggestions.length > 0 && (
            <button onClick={() => setExpanded(v => !v)}
              className="border border-zinc-700 px-2 py-1.5 font-mono text-[10px] text-zinc-400 hover:border-zinc-500 transition">
              {expanded ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>
      {expanded && cat.suggestions.length > 0 && (
        <div className="border-t border-zinc-800 p-3 md:p-4">
          <p className="mb-2 font-mono text-[10px] tracking-widest text-orange-500">AI SUGGESTIONS</p>
          <ul className="space-y-1">
            {cat.suggestions.map((s, i) => (
              <li key={i} className="font-mono text-[10px] text-zinc-400">• {s}</li>
            ))}
          </ul>
          {cat.cheaperAlternatives && cat.cheaperAlternatives.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 font-mono text-[10px] tracking-widest text-green-600">SAVE MORE</p>
              {cat.cheaperAlternatives.map((a, i) => (
                <p key={i} className="font-mono text-[10px] text-green-500">→ {a}</p>
              ))}
            </div>
          )}
          {cat.nearbyStores && cat.nearbyStores.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 font-mono text-[10px] tracking-widest text-cyan-600">BUDGET STORES</p>
              {cat.nearbyStores.map((s, i) => (
                <p key={i} className="font-mono text-[10px] text-cyan-400">🏪 {s}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BudgetPage() {
  const [tab, setTab] = useState<Tab>('ai-plan');
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [month, setMonth] = useState(thisMonth());
  const [showWizard, setShowWizard] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<BudgetPlan | null>(null);
  const [logTarget, setLogTarget] = useState<{ id: string; name: string } | null>(null);
  const [logAmount, setLogAmount] = useState('');
  const [logNote, setLogNote] = useState('');
  const [txType, setTxType] = useState<TxType>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txCurrency, setTxCurrency] = useState('USD');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);
  const [addingTx, setAddingTx] = useState(false);

  const transactions = useQuery(api.budget.listTransactions, { month });
  const financialGoals = useQuery(api.budget.listFinancialGoals);
  const budgetProfile = useQuery(api.budget.getBudgetProfile);
  const storedPlan = useQuery(api.budget.getBudgetPlan, { month });
  const userProfile = useQuery(api.users.current);

  const addTransaction = useMutation(api.budget.addTransaction);
  const deleteTransaction = useMutation(api.budget.deleteTransaction);
  const createFinancialGoal = useMutation(api.budget.createFinancialGoal);
  const updateFinancialGoal = useMutation(api.budget.updateFinancialGoal);
  const saveBudgetProfile = useMutation(api.budget.saveBudgetProfile);
  const saveBudgetPlan = useMutation(api.budget.saveBudgetPlan);

  const detectedCurrency = (() => {
    const loc = (userProfile as any)?.location || '';
    if (!loc) return 'USD';
    const lower = loc.toLowerCase();
    if (lower.includes('uk') || lower.includes('england') || lower.includes('britain')) return 'GBP';
    if (lower.includes('nigeria')) return 'NGN';
    if (lower.includes('india')) return 'INR';
    if (lower.includes('south africa')) return 'ZAR';
    if (lower.includes('australia')) return 'AUD';
    if (lower.includes('canada')) return 'CAD';
    if (lower.includes('europe') || lower.includes('germany') || lower.includes('france') || lower.includes('spain') || lower.includes('italy') || lower.includes('netherlands')) return 'EUR';
    if (lower.includes('uae') || lower.includes('dubai')) return 'AED';
    return 'USD';
  })();

  useEffect(() => {
    if (storedPlan?.planJson) {
      try { setPlan(JSON.parse(storedPlan.planJson)); } catch { /* ignore */ }
    }
  }, [storedPlan]);

  useEffect(() => {
    if (budgetProfile === null) setShowWizard(true);
  }, [budgetProfile]);

  const spentByCategory = (() => {
    const map: Record<string, number> = {};
    if (!transactions || !plan) return map;
    for (const tx of transactions as Transaction[]) {
      if (tx.type !== 'expense') continue;
      const lower = tx.category.toLowerCase();
      for (const cat of plan.categories) {
        if (lower.includes(cat.id) || lower.includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(lower)) {
          map[cat.id] = (map[cat.id] || 0) + tx.amount;
          break;
        }
      }
    }
    return map;
  })();

  const handleWizardComplete = useCallback(async (data: WizardData) => {
    setShowWizard(false);
    setIsGenerating(true);
    const fixedCommitments: Array<{ name: string; amount: number }> = [];
    if (data.fixedRent) fixedCommitments.push({ name: 'Rent', amount: parseFloat(data.fixedRent) });
    if (data.fixedLoan) fixedCommitments.push({ name: 'Loan repayment', amount: parseFloat(data.fixedLoan) });
    await saveBudgetProfile({
      lifeStage: data.lifeStage, householdType: data.householdType,
      incomeAmount: parseFloat(data.incomeAmount) || 0, incomeFrequency: data.incomeFrequency,
      currency: data.currency, budgetGoal: data.budgetGoal,
      dietaryPreference: data.dietaryPreference, cooksAtHome: data.cooksAtHome,
      hasTransportCosts: data.hasTransportCosts, fixedCommitments, duration: data.duration,
      location: (userProfile as any)?.location || '',
    });
    try {
      const res = await fetch('/api/budget/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: (userProfile as any)?.age, gender: (userProfile as any)?.gender,
          lifeStage: data.lifeStage, householdType: data.householdType,
          incomeAmount: parseFloat(data.incomeAmount) || 0, incomeFrequency: data.incomeFrequency,
          currency: data.currency, location: (userProfile as any)?.location || '',
          budgetGoal: data.budgetGoal, dietaryPreference: data.dietaryPreference,
          cooksAtHome: data.cooksAtHome, hasTransportCosts: data.hasTransportCosts,
          fixedCommitments, duration: data.duration,
        }),
      });
      const json = await res.json() as { success: boolean; plan?: BudgetPlan };
      if (json.success && json.plan) {
        setPlan(json.plan);
        await saveBudgetPlan({ planJson: JSON.stringify(json.plan), currency: json.plan.currency, totalBudget: json.plan.totalBudget, month });
      }
    } catch (e) { console.error('Budget AI error:', e); }
    finally { setIsGenerating(false); }
  }, [saveBudgetProfile, saveBudgetPlan, userProfile, month]);

  const handleLogExpense = async () => {
    if (!logTarget || !logAmount) return;
    await addTransaction({ type: 'expense', amount: parseFloat(logAmount), currency: plan?.currency || detectedCurrency, category: logTarget.name, description: logNote || `Logged: ${logTarget.name}`, date: new Date().toISOString().split('T')[0] });
    setLogTarget(null); setLogAmount(''); setLogNote('');
  };

  const handleAddTx = async (e: FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txCategory || !txDesc) return;
    setAddingTx(true);
    try {
      await addTransaction({ type: txType, amount: parseFloat(txAmount), currency: txCurrency, category: txCategory, description: txDesc, date: txDate });
      setTxAmount(''); setTxCategory(''); setTxDesc(''); setShowAddTx(false);
    } finally { setAddingTx(false); }
  };

  const handleAddGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;
    setAddingGoal(true);
    try {
      await createFinancialGoal({ title: goalTitle, targetAmount: parseFloat(goalTarget), currentAmount: goalCurrent ? parseFloat(goalCurrent) : 0, deadline: goalDeadline || undefined });
      setGoalTitle(''); setGoalTarget(''); setGoalCurrent(''); setGoalDeadline(''); setShowAddGoal(false);
    } finally { setAddingGoal(false); }
  };

  const activeCurrency = plan?.currency || detectedCurrency;
  const totalAllocated = plan?.categories.reduce((s, c) => s + c.allocated, 0) ?? 0;
  const freeBudget = plan ? plan.totalBudget - totalAllocated : 0;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      {showWizard && <BudgetWizard onComplete={handleWizardComplete} defaultCurrency={detectedCurrency} />}

      {logTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <p className="font-mono text-xs tracking-widest text-zinc-400">LOG — {logTarget.name.toUpperCase()}</p>
              <button onClick={() => setLogTarget(null)}><X className="h-4 w-4 text-zinc-400" /></button>
            </div>
            <div className="p-4 space-y-3">
              <input type="number" value={logAmount} onChange={(e) => setLogAmount(e.target.value)} placeholder="Amount" inputMode="numeric"
                className="h-12 w-full border border-zinc-800 bg-black px-3 font-mono text-lg text-zinc-200 placeholder:text-zinc-500 focus:border-orange-700 focus:outline-none" />
              <input type="text" value={logNote} onChange={(e) => setLogNote(e.target.value)} placeholder="Quick note (optional)"
                className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 placeholder:text-zinc-500 focus:border-orange-700 focus:outline-none" />
              <button onClick={handleLogExpense} disabled={!logAmount}
                className="w-full border border-orange-800 bg-orange-950/30 py-2.5 font-mono text-xs tracking-widest text-orange-500 hover:bg-orange-950/50 transition disabled:opacity-50">
                [LOG_EXPENSE]
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-4">
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: BUDGET_INTELLIGENCE</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Budget Planner</h1>
              <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">AI-powered · currency-aware · built for your life</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
                className="border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none" />
              <button onClick={() => setShowAddTx(true)}
                className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-300 hover:border-zinc-500 transition">
                <Plus className="h-3 w-3" /> TX
              </button>
            </div>
          </div>

          {plan && (
            <div className="border-t border-zinc-900 px-5 py-3">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="text-zinc-400">💰 Budget: <span className="text-zinc-100 font-bold">{fmt(plan.totalBudget, activeCurrency)}/{plan.period}</span></span>
                <span className="text-zinc-400">✅ Allocated: <span className="text-zinc-100">{fmt(totalAllocated, activeCurrency)}</span></span>
                <span className="text-zinc-400">🔓 Free: <span className={cn('font-bold', freeBudget < 0 ? 'text-red-400' : 'text-green-400')}>{fmt(Math.abs(freeBudget), activeCurrency)}</span></span>
                {plan.isTight && <span className="text-amber-400">⚠️ Tight budget</span>}
                {plan.survivalMode && <span className="text-red-400">🆘 Survival mode</span>}
              </div>
              <button onClick={() => setShowWizard(true)}
                className="mt-2 flex items-center gap-1.5 border border-orange-900 bg-orange-950/20 px-3 py-1 font-mono text-xs text-orange-500 hover:bg-orange-950/40 transition">
                <RefreshCw className="h-3 w-3" /> REGENERATE PLAN
              </button>
            </div>
          )}

          <div className="flex border-t border-zinc-900">
            {(['ai-plan', 'transactions', 'goals'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('border-r border-zinc-900 px-5 py-2.5 font-mono text-xs tracking-widest transition',
                  tab === t ? 'bg-zinc-900 text-orange-500' : 'text-zinc-400 hover:text-zinc-300')}>
                {t === 'ai-plan' ? 'AI_PLAN' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {tab === 'ai-plan' && (
          <div className="space-y-4">
            {isGenerating && (
              <div className="border border-orange-900 bg-orange-950/10 p-8 text-center">
                <div className="mx-auto mb-3 h-2 w-2 animate-ping rounded-full bg-orange-500" />
                <p className="font-mono text-xs tracking-widest text-orange-400">BUDGET_AI :: ANALYZING_PROFILE...</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">Building your personalized budget plan...</p>
              </div>
            )}
            {!plan && !isGenerating && (
              <div className="border border-zinc-800 bg-zinc-950 py-16 text-center">
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_AI_PLAN_GENERATED</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">Complete the budget wizard to generate your AI plan.</p>
                <button onClick={() => setShowWizard(true)}
                  className="mt-4 flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 mx-auto hover:bg-orange-950/50 transition">
                  <Zap className="h-3 w-3" /> START_WIZARD
                </button>
              </div>
            )}
            {plan && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {plan.categories.map((cat) => (
                    <CategoryCard key={cat.id} cat={cat} spent={spentByCategory[cat.id] || 0} currency={activeCurrency} onLogExpense={(id, name) => setLogTarget({ id, name })} />
                  ))}
                </div>
                {plan.insights.length > 0 && (
                  <div className="border border-zinc-800 bg-zinc-950 p-4">
                    <p className="mb-3 font-mono text-xs tracking-widest text-orange-500">AI_INSIGHTS</p>
                    <div className="space-y-2">
                      {plan.insights.slice(0, 3).map((insight, i) => (
                        <p key={i} className="font-mono text-xs text-zinc-400">{insight}</p>
                      ))}
                    </div>
                    {plan.adjustmentTips && plan.adjustmentTips.length > 0 && (
                      <div className="mt-3 border-t border-zinc-900 pt-3">
                        <p className="mb-2 font-mono text-xs tracking-widest text-green-600">ADJUSTMENT_TIPS</p>
                        {plan.adjustmentTips.map((tip, i) => (
                          <p key={i} className="font-mono text-[10px] text-green-500">→ {tip}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'transactions' && (
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2">
              <p className="font-mono text-xs tracking-widest text-zinc-400">TRANSACTIONS — {month} ({transactions?.length ?? 0} entries)</p>
            </div>
            {(!transactions || transactions.length === 0) ? (
              <div className="py-12 text-center"><p className="font-mono text-xs tracking-widest text-zinc-400">NO_TRANSACTIONS_RECORDED</p></div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {(transactions as Transaction[]).map((tx) => (
                  <div key={tx._id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/30">
                    <div className={cn('h-2 w-2 shrink-0 rounded-full', tx.type === 'income' ? 'bg-green-500' : 'bg-red-500')} />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-zinc-300">{tx.description}</p>
                      <p className="font-mono text-xs text-zinc-400">{tx.category} · {tx.date}</p>
                    </div>
                    <p className={cn('font-mono text-sm font-bold', tx.type === 'income' ? 'text-green-400' : 'text-red-400')}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount, tx.currency)}
                    </p>
                    <button onClick={() => deleteTransaction({ transactionId: tx._id as Id<'transactions'> })} className="ml-2 text-zinc-400 hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'goals' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={() => setShowAddGoal(true)}
                className="flex items-center gap-1.5 border border-green-800 bg-green-950/30 px-4 py-1.5 font-mono text-xs tracking-widest text-green-500 hover:bg-green-950/60 transition">
                <Plus className="h-3 w-3" /> ADD_GOAL
              </button>
            </div>
            {(!financialGoals || financialGoals.length === 0) ? (
              <div className="border border-zinc-900 bg-zinc-950 py-12 text-center">
                <Target className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_FINANCIAL_GOALS</p>
              </div>
            ) : (
              (financialGoals as FinancialGoal[]).map((g) => {
                const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
                return (
                  <div key={g._id} className="border border-zinc-900 bg-zinc-950 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-bold text-zinc-200">{g.title}</p>
                        <p className="mt-0.5 font-mono text-xs text-zinc-400">{fmt(g.currentAmount)} / {fmt(g.targetAmount)} · {pct}%{g.deadline && ` · Due ${g.deadline}`}</p>
                      </div>
                      <span className={cn('font-mono text-xs px-2 py-0.5 border',
                        g.status === 'completed' ? 'border-green-800 text-green-500' : g.status === 'active' ? 'border-amber-800 text-amber-500' : 'border-zinc-800 text-zinc-500')}>
                        {g.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 bg-zinc-900">
                      <div className="h-full bg-green-600 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input type="number" placeholder="Update amount..."
                        className="h-7 w-36 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-green-800 focus:outline-none"
                        onBlur={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) { updateFinancialGoal({ goalId: g._id as Id<'financialGoals'>, currentAmount: val }); e.target.value = ''; } }} />
                      {g.status === 'active' && (
                        <button onClick={() => updateFinancialGoal({ goalId: g._id as Id<'financialGoals'>, status: 'completed' })}
                          className="border border-green-900 px-3 font-mono text-xs text-green-600 hover:bg-green-950/30">
                          MARK_DONE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {showAddTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">ADD_TRANSACTION</p>
                <button onClick={() => setShowAddTx(false)}><X className="h-4 w-4 text-zinc-400" /></button>
              </div>
              <form onSubmit={handleAddTx} className="space-y-3 p-4">
                <div className="flex gap-2">
                  {(['expense', 'income'] as TxType[]).map((t) => (
                    <button key={t} type="button" onClick={() => { setTxType(t); setTxCategory(''); }}
                      className={cn('flex-1 border py-2 font-mono text-xs tracking-widest transition',
                        txType === t ? (t === 'expense' ? 'border-red-800 bg-red-950/30 text-red-500' : 'border-green-800 bg-green-950/30 text-green-500') : 'border-zinc-800 text-zinc-400')}>
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="number" step="0.01" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="Amount" required
                    className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none" />
                  <select value={txCurrency} onChange={(e) => setTxCurrency(e.target.value)} className="h-9 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300">
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} required className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300">
                  <option value="">Select category...</option>
                  {(txType === 'expense' ? EXPENSE_CATS : INCOME_CATS).map((c) => <option key={c}>{c}</option>)}
                </select>
                <input type="text" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} placeholder="Description" required
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none" />
                <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300" />
                <button type="submit" disabled={addingTx} className="w-full border border-green-800 bg-green-950/30 py-2.5 font-mono text-xs tracking-widest text-green-500 disabled:opacity-50">
                  {addingTx ? 'SAVING_' : '[SAVE_TRANSACTION]'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showAddGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">ADD_FINANCIAL_GOAL</p>
                <button onClick={() => setShowAddGoal(false)}><X className="h-4 w-4 text-zinc-400" /></button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-3 p-4">
                <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="Goal title" required
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none" />
                <div className="flex gap-2">
                  <input type="number" step="0.01" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} placeholder="Target amount" required
                    className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none" />
                  <input type="number" step="0.01" value={goalCurrent} onChange={(e) => setGoalCurrent(e.target.value)} placeholder="Current saved"
                    className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none" />
                </div>
                <input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300" />
                <button type="submit" disabled={addingGoal} className="w-full border border-green-800 bg-green-950/30 py-2.5 font-mono text-xs tracking-widest text-green-500 disabled:opacity-50">
                  {addingGoal ? 'SAVING_' : '[CREATE_GOAL]'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
