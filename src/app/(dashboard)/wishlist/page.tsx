'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Wishlist Page
// Terminal-styled gift / goal wishlist management
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type WishlistItem = {
  _id: Id<'wishlistItems'>;
  name: string;
  price?: number;
  currency?: string;
  priority: string;
  url?: string;
  notes?: string;
  bought: boolean;
  createdAt: number;
};

type Priority = 'low' | 'medium' | 'high';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-zinc-500 border-zinc-800',
  medium: 'text-yellow-600 border-yellow-900',
  high: 'text-red-500 border-red-900',
};

function formatPrice(price?: number, currency = 'USD'): string {
  if (price == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export default function WishlistPage() {
  const items = useQuery(api.wishlist.list, {}) as WishlistItem[] | undefined;
  const createItem = useMutation(api.wishlist.create);
  const toggleBought = useMutation(api.wishlist.toggleBought);
  const removeItem = useMutation(api.wishlist.remove);

  // Filter
  const [filter, setFilter] = useState<'all' | 'pending' | 'bought'>('all');

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [priority, setPriority] = useState<Priority>('medium');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);

  const filtered = (items ?? []).filter((i) => {
    if (filter === 'pending') return !i.bought;
    if (filter === 'bought') return i.bought;
    return true;
  });

  const totalUnbought = (items ?? []).filter((i) => !i.bought)
    .reduce((s, i) => s + (i.price ?? 0), 0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await createItem({
        name: name.trim(),
        price: price ? parseFloat(price) : undefined,
        currency: currency || undefined,
        priority,
        url: url.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setName(''); setPrice(''); setUrl(''); setNotes('');
      setPriority('medium');
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id: Id<'wishlistItems'>) {
    await toggleBought({ id });
  }

  async function handleRemove(id: Id<'wishlistItems'>) {
    await removeItem({ id });
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Page header */}
      <div className="border-b border-zinc-900 bg-zinc-950 px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-pixel text-[0.45rem] tracking-[0.3em] text-orange-600 mb-2">PERSONAL:WISHLIST</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-pixel text-base tracking-widest text-zinc-100">Wishlist</h1>
              <p className="font-terminal text-sm text-zinc-500 mt-1">Track what you want to buy or achieve.</p>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="font-pixel text-[0.45rem] tracking-widest px-3 py-2 bg-orange-600 text-black hover:bg-orange-500 transition-colors shrink-0"
            >
              + ADD_ITEM
            </button>
          </div>

          {/* Stats */}
          {items && items.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="border border-zinc-900 px-3 py-1.5">
                <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">TOTAL_ITEMS</p>
                <p className="font-terminal text-xl text-zinc-300">{items.length}</p>
              </div>
              <div className="border border-zinc-900 px-3 py-1.5">
                <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">PENDING</p>
                <p className="font-terminal text-xl text-zinc-300">{items.filter((i) => !i.bought).length}</p>
              </div>
              {totalUnbought > 0 && (
                <div className="border border-zinc-900 px-3 py-1.5">
                  <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">ESTIMATED_TOTAL</p>
                  <p className="font-terminal text-xl text-orange-400">{formatPrice(totalUnbought)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAdd} className="border border-zinc-900 bg-zinc-950 p-4 space-y-3">
            <p className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">NEW_ITEM:</p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="item name *"
              required
              className="w-full bg-black border border-zinc-800 font-terminal text-sm text-zinc-200 placeholder:text-zinc-700 px-3 py-2 outline-none focus:border-orange-800"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="price (optional)"
                min="0"
                step="0.01"
                className="bg-black border border-zinc-800 font-terminal text-sm text-zinc-200 placeholder:text-zinc-700 px-3 py-2 outline-none focus:border-orange-800"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-black border border-zinc-800 font-terminal text-sm text-zinc-300 px-3 py-2 outline-none focus:border-orange-800"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="link (optional)"
              className="w-full bg-black border border-zinc-800 font-terminal text-sm text-zinc-200 placeholder:text-zinc-700 px-3 py-2 outline-none focus:border-orange-800"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="notes (optional)"
              rows={2}
              className="w-full bg-black border border-zinc-800 font-terminal text-sm text-zinc-200 placeholder:text-zinc-700 px-3 py-2 outline-none focus:border-orange-800 resize-none"
            />

            {/* Priority */}
            <div>
              <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600 mb-1.5">PRIORITY:</p>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`font-pixel text-[0.38rem] tracking-widest px-2 py-1 border uppercase transition-colors ${
                      priority === p ? 'bg-orange-950 border-orange-700 text-orange-300' : 'border-zinc-800 text-zinc-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={adding || !name.trim()}
                className="font-pixel text-[0.45rem] tracking-widest px-4 py-2 bg-orange-600 text-black hover:bg-orange-500 disabled:opacity-50 transition-colors"
              >
                {adding ? 'ADDING_' : '[ SAVE ]'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="font-pixel text-[0.45rem] tracking-widest px-3 py-2 border border-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}

        {/* Filter pills */}
        {items && items.length > 0 && (
          <div className="flex gap-2">
            {(['all', 'pending', 'bought'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-pixel text-[0.4rem] tracking-widest px-3 py-1.5 border uppercase transition-colors ${
                  filter === f ? 'border-orange-700 text-orange-400 bg-orange-950' : 'border-zinc-800 text-zinc-600 hover:border-zinc-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Items list */}
        {items === undefined ? (
          <p className="font-pixel text-[0.4rem] tracking-widest text-zinc-700 py-8 text-center">LOADING_</p>
        ) : filtered.length === 0 ? (
          <div className="border border-zinc-900 py-12 text-center">
            <p className="font-pixel text-[0.45rem] tracking-widest text-zinc-600">[ NO_ITEMS ]</p>
            <p className="font-terminal text-sm text-zinc-700 mt-2">
              {filter === 'all' ? 'Add something to your wishlist.' : `No ${filter} items.`}
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {filtered.map((item) => (
              <div
                key={item._id}
                className={`flex items-start gap-3 border px-4 py-3 group transition-colors ${
                  item.bought ? 'border-zinc-900 bg-zinc-950/50 opacity-60' : 'border-zinc-900 hover:border-zinc-800 bg-zinc-950'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(item._id)}
                  className={`mt-0.5 w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                    item.bought ? 'border-green-700 bg-green-950' : 'border-zinc-700 hover:border-orange-700'
                  }`}
                >
                  {item.bought && <span className="font-pixel text-[0.3rem] text-green-400">✓</span>}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className={`font-terminal text-sm ${item.bought ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                      {item.name}
                    </span>
                    <span className={`font-pixel text-[0.35rem] tracking-widest px-1 py-0.5 border ${PRIORITY_COLORS[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>

                  {item.price != null && (
                    <p className="font-terminal text-sm text-orange-400 mt-0.5">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  )}

                  {item.notes && (
                    <p className="font-terminal text-xs text-zinc-600 mt-0.5 truncate">{item.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 hover:text-orange-500 transition-colors"
                    >
                      LINK ↗
                    </a>
                  )}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="font-pixel text-[0.38rem] tracking-widest text-zinc-800 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    DEL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
