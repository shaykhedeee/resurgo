"use client";

import { useState, FormEvent } from "react";

/**
 * Client-side newsletter subscribe form for the Guides page.
 * Shows a success toast on submit (no backend yet — stores locally).
 */
export function GuideSubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    // Persist to localStorage until a real email API is wired up
    try {
      const subs: string[] = JSON.parse(localStorage.getItem("guide_subs") ?? "[]");
      if (!subs.includes(email)) {
        subs.push(email);
        localStorage.setItem("guide_subs", JSON.stringify(subs));
      }
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm text-green-400 font-medium py-2">
        ✓ Subscribed! We&apos;ll send you weekly habit tips.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] mb-3"
      />
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors min-h-[44px]"
      >
        Subscribe
      </button>
    </form>
  );
}
