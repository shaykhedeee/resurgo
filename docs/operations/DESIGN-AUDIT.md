# RESURGO — DESIGN AUDIT & CODE CLEANUP REPORT
> Full audit of UI inconsistencies, code architecture issues, and cleanup tasks.
> Generated from codebase scan of 425 TypeScript/TSX files.

---

## 1. CRITICAL INCONSISTENCIES (Fix Before Launch)

### 1.1 Coach Count Mismatch
**Problem:** The codebase references both 5 and 8 coaches in different locations.

| Location | Says | Should Say |
|---|---|---|
| `src/components/LandingPageV2.tsx` L69 | "8 Specialized AI Coaches" | **5 Core + 3 Premium** |
| `src/components/LandingPageV2.tsx` L248 | "5 core AI coaches" (correct) | ✅ |
| `src/components/LandingPageV2.tsx` L297 | "5 CORE AI COACHING PERSONAS" (correct) | ✅ |
| `src/components/marketing/ProductShowcase.tsx` L50 | "8 specialized AI coaches" | **5 Core + 3 Premium** |
| `src/components/marketing/StickyCTA.tsx` L10 | "8 specialized AI coaches" | **5 Core + 3 Premium** |
| `src/app/api/marketing/instagram/route.ts` L25 | "8 coaches" | **5+3** |
| `src/app/(marketing)/features/page.tsx` L50 | "5 Core + Premium Personas" (correct) | ✅ |
| `src/app/(marketing)/faq/page.tsx` L46 | "5 core" (correct) | ✅ |
| `src/lib/billing/plans.ts` L42 | "5 core" (correct) | ✅ |
| `docs/PRODUCT_TRUTH.md` | "EXACTLY 5" | Needs update to 5+3 |

**Resolution:** The actual code has 8 coach definitions (MARCUS, AURORA, TITAN, SAGE, PHOENIX, NOVA, ORACLE, NEXUS). Marketing should say "5 core AI coaches (free) + 3 premium personas (Pro)". Update PRODUCT_TRUTH to reflect reality.

### 1.2 Pricing References
**All pricing must match:** Free / $4.99 mo / $29.99 yr / $49.99 lifetime

Files to verify:
- `src/lib/billing/plans.ts` ← Source of truth
- `src/app/billing/page.tsx`
- `src/app/(marketing)/pricing/page.tsx`
- `src/components/LandingPageV2.tsx`
- `src/app/(marketing)/faq/page.tsx`
- All niche landing pages under `src/app/(marketing)/niche/`

**Note:** `docs/operations/userflow-and-retention.md` mentions $9/mo and $199 lifetime in several places — these are from external AI chat outputs, NOT your actual pricing. Do NOT change your pricing to match those docs.

---

## 2. OVERSIZED FILES (Split Recommended)

| File | Size | Recommendation |
|---|---|---|
| `src/app/(marketing)/blog/[slug]/page.tsx` | 184.3 KB | Has all 39 blog posts inline. Consider moving post content to separate data files. |
| `src/components/LandingPageV2.tsx` | 79.3 KB | Extract sections into sub-components (HeroSection, FeaturesGrid, PricingSection, etc.) |
| `src/components/TemplateLibraryV2.tsx` | 72.5 KB | Extract template data to separate file |
| `src/components/VisionBoard.tsx` | 64.3 KB | Extract wizard steps into sub-components |
| `src/components/LandingPage.tsx` | 55.0 KB | **LIKELY UNUSED** — V2 is active. Verify and remove. |
| `src/app/(dashboard)/plan-builder/page.tsx` | 49.9 KB | Extract plan sections |
| `src/app/(dashboard)/dashboard/page.tsx` | 47.9 KB | Extract widgets into separate components |
| `src/components/DeepScanProtocol.tsx` | 47.8 KB | Extract scan steps |
| `src/components/DeepOnboarding.tsx` | 46.5 KB | Extract wizard steps |
| `src/app/guides/[slug]/page.tsx` | 46.4 KB | Move guide content to data files |

---

## 3. POTENTIALLY REDUNDANT COMPONENTS

### 3.1 Landing Pages
| Component | Size | Purpose | Action |
|---|---|---|---|
| `LandingPage.tsx` | 55 KB | V1 landing page | **DELETE if V2 is the active version** |
| `LandingPageV2.tsx` | 79.3 KB | V2 landing page (active) | Keep, extract sub-components |

**Verify:** Check `src/app/page.tsx` to confirm which is imported.
→ `page.tsx` imports `LandingPageV2` — **LandingPage.tsx is dead code.**

### 3.2 Onboarding Components
| Component | Size | Purpose | Action |
|---|---|---|---|
| `Onboarding.tsx` | 35.2 KB | Original onboarding (Zustand-based) | **Audit usage — may be dead code** |
| `DeepOnboarding.tsx` | 46.5 KB | Deep profiling flow | Verify if this is used |
| `onboarding/page.tsx` | 38.6 KB | Onboarding page route | This is the primary flow |
| `DeepScanProtocol.tsx` | 47.8 KB | Deep scan assessment | Used in dashboard |

**Issue:** Three separate onboarding paths exist. Need ONE clear happy path.

### 3.3 AI Coach Components
| Component | Purpose | Action |
|---|---|---|
| `AICoach.tsx` | Card-based AI coaching (local API client, Zustand store) | **May conflict with coach page Convex implementation** |
| `SmartCoach.tsx` | Atomic Habits coaching display | Verify usage |
| `coach/page.tsx` | Full coach chat interface (Convex-based) | Primary coach experience |

**Issue:** `AICoach.tsx` uses `useAscendStore` (Zustand) and `aiClient` (direct fetch). The main coach page uses Convex actions. These are two separate AI systems.

### 3.4 State Management Duplication
| System | Where | What |
|---|---|---|
| **Zustand** (`src/lib/store.ts`) | Client-side | User, habits, entries, gamification, goals, tasks |
| **Convex** (`convex/*.ts`) | Server-side | Same data, plus AI, billing, wellness, etc. |

**Problem:** Data may be duplicated between Zustand and Convex. The Zustand store appears to be a legacy system from when the app used local storage. Most dashboard/coach features now use Convex directly.

**Action:** Audit which components still import `useAscendStore`. If only legacy components, plan migration.

---

## 4. UI CONSISTENCY ISSUES

### 4.1 Font Usage Audit
Terminal theme requires:
- `Press Start 2P` — pixel labels, small headings
- `IBM Plex Mono` / `VT323` — terminal copy, data
- `Inter` — body text, descriptions

**Check:** Ensure no components use system fonts or other non-brand fonts.

### 4.2 Color Consistency
| Intent | Canonical | Check For |
|---|---|---|
| Primary accent | `orange-500` (#f97316) | Any use of different orange shades |
| Success | `emerald-400/500` | Inconsistent green shades |
| Error | `red-400/500` | Inconsistent red shades |
| Background | `black` / `zinc-950` | Inconsistent dark backgrounds |
| Text | `zinc-100` to `zinc-400` | Text that's too bright or too dim |

### 4.3 Button Styles
- Terminal buttons should use `TermButton` / `TermLinkButton`
- Check for standard HTML buttons or non-terminal-styled components
- CTAs should be UPPERCASE with underscores

### 4.4 Mobile Responsiveness
- Mobile dashboard exists (`MobileDashboard.tsx`)
- Verify no desktop-only layouts leak into mobile
- All tap targets must be 44px+ minimum
- Swipe gestures for task completion

---

## 5. DEAD CODE CANDIDATES

### Files to Investigate
| File | Reason |
|---|---|
| `src/components/LandingPage.tsx` | V1 — likely unused since V2 is imported |
| `src/components/Onboarding.tsx` | Zustand-based — may be dead since onboarding/page.tsx exists |
| `src/components/AICoach.tsx` | Local AI client — may be superseded by Convex coach |
| `src/components/SmartCoach.tsx` | Atomic habits display — verify if rendered anywhere |
| `src/lib/store.ts` | Zustand store — if Convex handles all data, this may be legacy |

### Safe Removal Process
1. `grep -r "LandingPage" src/` — verify no imports
2. `grep -r "Onboarding" src/` — verify which onboarding is used
3. `grep -r "AICoach" src/` — verify no active imports
4. `grep -r "useAscendStore" src/` — find all Zustand dependents
5. Only remove after verifying zero imports

---

## 6. PERFORMANCE CONCERNS

### Bundle Size
- Blog page at 184KB is very large — all 39 posts rendered as a single dynamic page
- Consider: Static generation for blog posts (SSG), or splitting blog content to separate JSON/MDX files
- LandingPageV2 at 79KB — split into lazy-loaded sections

### Image Optimization
- Vision board images should use Next.js `<Image>` with optimization
- Social media meta images should be pre-generated, not dynamic

### Data Fetching
- Dashboard page makes 7+ Convex queries simultaneously
- Consider: Batching queries, lazy-loading non-critical widgets

---

## 7. SECURITY NOTES

### Already Implemented ✅
- `addSecurityHeaders()` in AI routes
- `isTrustedOrigin()` check
- `sanitizeString()` for user input
- Clerk auth on protected routes
- API key auth for v1 routes

### Verify
- [ ] All API routes check authentication
- [ ] No API keys exposed in client-side code
- [ ] Rate limiting on public endpoints
- [ ] CORS configured correctly
- [ ] CSP headers present

---

## 8. CLEANUP PRIORITY QUEUE

### Immediate (Before Launch)
1. Fix coach count: change "8" → "5 core + 3 premium" in all marketing references
2. Verify pricing consistency across all pages
3. Remove `LandingPage.tsx` if confirmed unused
4. Add Microsoft Clarity snippet

### Short-term (Week 1-2)
5. Audit Zustand vs Convex data duplication
6. Consolidate onboarding to one clear path
7. Split `LandingPageV2.tsx` into sub-components
8. Split `dashboard/page.tsx` into widget components
9. Move blog content out of single page component

### Medium-term (Week 3-4)
10. Remove/migrate `Onboarding.tsx` (Zustand) if unused
11. Consolidate AI coach components
12. Clean up unused imports across codebase
13. Add loading states for all Convex queries
14. Optimize bundle with dynamic imports

---

*Generated from codebase scan | April 2026*
