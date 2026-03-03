'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Budget & Finance Tracker
// Transactions, spending categories, net worth overview, financial goals
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { FormEvent, useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Target, DollarSign, PieChart, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type TxType = 'income' | 'expense';
type Tab = 'overview' | 'transactions' | 'goals';

interface Transaction {
  _id: string;
  type: TxType;
  amount: number;
  currency?: string;
  category: string;
  description: string;
  date: string;
}

interface CategorySummary {
  category: string;
  amount: number;
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
const CURRENCIES   = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD', 'AUD'];

function fmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function BudgetPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [month, setMonth] = useState(thisMonth());

  // Form state
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

  const summary = useQuery(api.budget.getMonthSummary, { month });
  const transactions = useQuery(api.budget.listTransactions, { month });
  const financialGoals = useQuery(api.budget.listFinancialGoals);

  const addTransaction = useMutation(api.budget.addTransaction);
  const deleteTransaction = useMutation(api.budget.deleteTransaction);
  const createFinancialGoal = useMutation(api.budget.createFinancialGoal);
  const updateFinancialGoal = useMutation(api.budget.updateFinancialGoal);

  const handleAddTx = async (e: FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txCategory || !txDesc) return;
    setAddingTx(true);
    try {
      await addTransaction({
        type: txType,
        amount: parseFloat(txAmount),
        currency: txCurrency,
        category: txCategory,
        description: txDesc,
        date: txDate,
      });
      setTxAmount(''); setTxCategory(''); setTxDesc('');
      setShowAddTx(false);
    } finally {
      setAddingTx(false);
    }
  };

  const handleAddGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;
    setAddingGoal(true);
    try {
      await createFinancialGoal({
        title: goalTitle,
        targetAmount: parseFloat(goalTarget),
        currentAmount: goalCurrent ? parseFloat(goalCurrent) : 0,
        deadline: goalDeadline || undefined,
      });
      setGoalTitle(''); setGoalTarget(''); setGoalCurrent(''); setGoalDeadline('');
      setShowAddGoal(false);
    } finally {
      setAddingGoal(false);
    }
  };

  const savingsRate = summary && summary.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4">

        {/* ── HEADER ── */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
            <span className="font-mono text-xs tracking-widest text-green-600">RESURGO :: FINANCE_MODULE</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Budget Tracker</h1>
              <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">
                Track income · Manage spending · Build wealth
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs text-zinc-300 focus:border-green-800 focus:outline-none"
              />
              <button
                onClick={() => setShowAddTx(true)}
                className="flex items-center gap-1.5 border border-green-800 bg-green-950/30 px-4 py-1.5 font-mono text-xs tracking-widest text-green-500 transition hover:bg-green-950/60"
              >
                <Plus className="h-3 w-3" /> ADD_TX
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-zinc-900">
            {(['overview', 'transactions', 'goals'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'border-r border-zinc-900 px-5 py-2.5 font-mono text-xs tracking-widest transition',
                  tab === t ? 'bg-zinc-900 text-green-500' : 'text-zinc-400 hover:text-zinc-300'
                )}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: 'INCOME', value: fmt(summary?.totalIncome ?? 0), icon: TrendingUp, color: 'text-green-500', border: 'border-green-900' },
                { label: 'EXPENSES', value: fmt(summary?.totalExpenses ?? 0), icon: TrendingDown, color: 'text-red-500', border: 'border-red-900' },
                { label: 'NET SAVINGS', value: fmt(summary?.net ?? 0), icon: DollarSign, color: (summary?.net ?? 0) >= 0 ? 'text-green-400' : 'text-red-400', border: 'border-zinc-800' },
                { label: 'SAVINGS RATE', value: `${savingsRate}%`, icon: PieChart, color: savingsRate >= 20 ? 'text-green-400' : 'text-amber-400', border: 'border-zinc-800' },
              ].map(({ label, value, icon: Icon, color, border }) => (
                <div key={label} className={cn('border bg-zinc-950 p-4', border)}>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
                    <Icon className={cn('h-3.5 w-3.5', color)} />
                  </div>
                  <p className={cn('mt-2 font-mono text-lg font-bold', color)}>{value}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            {summary && summary.byCategory.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2">
                  <p className="font-mono text-xs tracking-widest text-zinc-400">SPENDING_BY_CATEGORY</p>
                </div>
                <div className="divide-y divide-zinc-900">
                  {summary.byCategory.map((cat: CategorySummary) => {
                    const pct = summary.totalExpenses > 0
                      ? Math.round((cat.amount / summary.totalExpenses) * 100) : 0;
                    return (
                      <div key={cat.category} className="flex items-center gap-3 px-4 py-2.5">
                        <p className="w-28 shrink-0 font-mono text-xs text-zinc-400">{cat.category}</p>
                        <div className="flex-1">
                          <div className="h-1 bg-zinc-900">
                            <div className="h-full bg-red-600" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <p className="w-16 text-right font-mono text-xs text-zinc-400">{fmt(cat.amount)}</p>
                        <p className="w-10 text-right font-mono text-xs text-zinc-400">{pct}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === 'transactions' && (
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2">
              <p className="font-mono text-xs tracking-widest text-zinc-400">
                TRANSACTIONS — {month} ({transactions?.length ?? 0} entries)
              </p>
            </div>
            {(!transactions || transactions.length === 0) ? (
              <div className="py-12 text-center">
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_TRANSACTIONS_RECORDED</p>
                <p className="mt-2 font-mono text-xs text-zinc-400">Add your first transaction to begin tracking.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {transactions.map((tx: Transaction) => (
                  <div key={tx._id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/30">
                    <div className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-zinc-300">{tx.description}</p>
                      <p className="font-mono text-xs text-zinc-400">{tx.category} · {tx.date}</p>
                    </div>
                    <p className={cn(
                      'font-mono text-sm font-bold',
                      tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount, tx.currency)}
                    </p>
                    <button
                      onClick={() => deleteTransaction({ transactionId: tx._id as Id<'transactions'> })}
                      className="ml-2 text-zinc-400 transition hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── GOALS TAB ── */}
        {tab === 'goals' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center gap-1.5 border border-green-800 bg-green-950/30 px-4 py-1.5 font-mono text-xs tracking-widest text-green-500 transition hover:bg-green-950/60"
              >
                <Plus className="h-3 w-3" /> ADD_GOAL
              </button>
            </div>
            {(!financialGoals || financialGoals.length === 0) ? (
              <div className="border border-zinc-900 bg-zinc-950 py-12 text-center">
                <Target className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_FINANCIAL_GOALS</p>
              </div>
            ) : (
              financialGoals.map((g: FinancialGoal) => {
                const pct = g.targetAmount > 0
                  ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
                return (
                  <div key={g._id} className="border border-zinc-900 bg-zinc-950 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-bold text-zinc-200">{g.title}</p>
                        <p className="mt-0.5 font-mono text-xs text-zinc-400">
                          {fmt(g.currentAmount)} / {fmt(g.targetAmount)} · {pct}% complete
                          {g.deadline && ` · Due ${g.deadline}`}
                        </p>
                      </div>
                      <span className={cn(
                        'font-mono text-xs tracking-widest px-2 py-0.5 border',
                        g.status === 'completed' ? 'border-green-800 text-green-500' :
                        g.status === 'active' ? 'border-amber-800 text-amber-500' : 'border-zinc-800 text-zinc-500'
                      )}>
                        {g.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 bg-zinc-900">
                      <div className="h-full bg-green-600 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        placeholder="Update amount..."
                        className="h-7 w-36 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-green-800 focus:outline-none"
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            updateFinancialGoal({ goalId: g._id as Id<'financialGoals'>, currentAmount: val });
                            e.target.value = '';
                          }
                        }}
                      />
                      {g.status === 'active' && (
                        <button
                          onClick={() => updateFinancialGoal({ goalId: g._id as Id<'financialGoals'>, status: 'completed' })}
                          className="border border-green-900 px-3 font-mono text-xs text-green-600 hover:bg-green-950/30"
                        >
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

        {/* ── ADD TRANSACTION MODAL ── */}
        {showAddTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">ADD_TRANSACTION</p>
                <button onClick={() => setShowAddTx(false)} className="text-zinc-400 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddTx} className="space-y-3 p-4">
                <div className="flex gap-2">
                  {(['expense', 'income'] as TxType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setTxType(t); setTxCategory(''); }}
                      className={cn(
                        'flex-1 border py-2 font-mono text-xs tracking-widest transition',
                        txType === t
                          ? t === 'expense' ? 'border-red-800 bg-red-950/30 text-red-500' : 'border-green-800 bg-green-950/30 text-green-500'
                          : 'border-zinc-800 text-zinc-400 hover:text-zinc-300'
                      )}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number" step="0.01" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="Amount" required
                    className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none"
                  />
                  <select
                    value={txCurrency} onChange={(e) => setTxCurrency(e.target.value)}
                    className="h-9 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:outline-none"
                  >
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <select
                  value={txCategory} onChange={(e) => setTxCategory(e.target.value)} required
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-green-800 focus:outline-none"
                >
                  <option value="">Select category...</option>
                  {(txType === 'expense' ? EXPENSE_CATS : INCOME_CATS).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text" value={txDesc} onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="Description" required
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none"
                />
                <input
                  type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)}
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-green-800 focus:outline-none"
                />
                <button
                  type="submit" disabled={addingTx}
                  className="w-full border border-green-800 bg-green-950/30 py-2.5 font-mono text-xs tracking-widest text-green-500 transition hover:bg-green-950/60 disabled:opacity-50"
                >
                  {addingTx ? 'SAVING_' : '[SAVE_TRANSACTION]'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── ADD GOAL MODAL ── */}
        {showAddGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">ADD_FINANCIAL_GOAL</p>
                <button onClick={() => setShowAddGoal(false)} className="text-zinc-400 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-3 p-4">
                <input
                  type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Goal title (e.g. Emergency Fund)" required
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="number" step="0.01" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="Target amount" required
                    className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none"
                  />
                  <input
                    type="number" step="0.01" value={goalCurrent} onChange={(e) => setGoalCurrent(e.target.value)}
                    placeholder="Current saved"
                    className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none"
                  />
                </div>
                <input
                  type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)}
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-green-800 focus:outline-none"
                />
                <button
                  type="submit" disabled={addingGoal}
                  className="w-full border border-green-800 bg-green-950/30 py-2.5 font-mono text-xs tracking-widest text-green-500 transition hover:bg-green-950/60 disabled:opacity-50"
                >
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
