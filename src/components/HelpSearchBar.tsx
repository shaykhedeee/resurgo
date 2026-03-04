"use client";

import { useState, useCallback } from "react";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  articles: string[];
}

interface Props {
  categories: HelpCategory[];
}

/**
 * Client-side search bar for the Help Center.
 * Filters categories by title, description, and article names.
 * Renders matching results below the input.
 */
export function HelpSearchBar({ categories }: Props) {
  const [query, setQuery] = useState("");

  const normalize = (s: string) => s.toLowerCase().trim();

  const filtered = useCallback(() => {
    const q = normalize(query);
    if (!q) return [];
    return categories.filter(
      (c) =>
        normalize(c.title).includes(q) ||
        normalize(c.description).includes(q) ||
        c.articles.some((a) => normalize(a).includes(q))
    );
  }, [query, categories]);

  const results = filtered();

  return (
    <div className="max-w-xl mx-auto relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for help articles..."
        className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/10 border border-white/20 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
      <svg
        className="absolute left-5 top-4 w-5 h-5 text-[var(--text-muted)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Search results dropdown */}
      {query.length > 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-white/10 bg-[#111] shadow-lg max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-[var(--text-muted)]">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            results.map((cat) => (
              <a
                key={cat.id}
                href={`/help/${cat.id}`}
                className="block px-5 py-3 hover:bg-white/5 transition-colors"
              >
                <p className="font-semibold text-[var(--text-primary)]">{cat.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{cat.description}</p>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
