# RESURGO — CONVERSION TESTS

---

## AB TESTS TO RUN

### Test 1: Hero Headline
- **Hypothesis:** "System" framing converts better than "plan" framing
- **Variant A:** "Most productivity apps organize your chaos. Resurgo turns it into today's plan."
- **Variant B:** "Five apps, zero execution. One system fixes that."
- **Metric:** Click-through to signup
- **Decision rule:** 95% confidence, 500 visitors minimum

### Test 2: CTA Button Text
- **Hypothesis:** "Build my plan" converts better than "Start free"
- **Variant A:** `START_FREE`
- **Variant B:** `BUILD_MY_PLAN`
- **Metric:** Signup clicks
- **Decision rule:** 95% confidence, 500 visitors

### Test 3: Pricing Table Highlight
- **Hypothesis:** Highlighting Lifetime converts more high-intent users
- **Variant A:** Pro Monthly highlighted
- **Variant B:** Lifetime highlighted
- **Metric:** Upgrade clicks
- **Decision rule:** 95% confidence, 300 visitors

### Test 4: Free Plan Explanation
- **Hypothesis:** Clearer free tier benefits increase signups
- **Variant A:** Current brief explanation
- **Variant B:** Detailed feature breakdown
- **Metric:** Signup completion rate
- **Decision rule:** 95% confidence, 500 visitors

---

## IMPLEMENTATION NOTES

- Use Vercel Edge Config + URL params for simple testing
- Google Optimize for more complex experiments
- Run tests for minimum 1 week
- Document results in weekly review