# Changelog

All notable changes to RESURGO will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Comprehensive GitHub community health files (CONTRIBUTING, SECURITY, CODE_OF_CONDUCT)
- GitHub issue templates for bug reports and feature requests
- GitHub pull request template
- Dependabot configuration for automated dependency updates
- `dependency-review` GitHub Actions workflow to block PRs introducing vulnerable dependencies
- `security-scan` GitHub Actions workflow for weekly `npm audit` runs

### Changed
- Updated README with accurate tech stack, feature table, pricing, and Docker instructions
- README clone URL corrected to `shaykhedeee/resurgo`

### Fixed
- **Performance:** Eliminated N+1 database query pattern in `convex/goals.ts` — `restoreArchivedOnUpgrade` (public + internal) now fetches the active-goal count once before iterating, reducing Convex read units from O(n) to O(1) per restore operation
- **Performance:** Same N+1 fix applied to `convex/habits.ts` — `restoreArchivedOnUpgrade` (public + internal)
- **Clarity:** Renamed ambiguous variables (`archived` → `archivedGoals`/`archivedHabits`, `activeCount` → `currentlyActiveGoals`/`currentlyActiveHabits`, `restored` counter logic extracted to `activeGoalCount`/`activeHabitCount`)

---

## [2.0.0] — 2025-01-01

### Added
- DodoPayments integration (subscription + one-time billing)
- Referral programme with unique codes and reward tracking
- Telegram bot integration for quick task capture
- Push notifications via Capacitor
- Android APK build pipeline (GitHub Actions)
- Vision Board feature
- Budget Tracker
- Nutrition & wellness (meal plans, food search via OpenFoodFacts)
- Morning briefing & evening reflection AI generation
- Brain-dump → structured task conversion
- Orchestrator AI for multi-goal planning
- Deep Scan diagnostics endpoint
- Meta Marketing API integration
- Admin dashboard (content, marketing, system status)
- Offline queue for tasks and brain-dump when network is unavailable

### Changed
- Migrated payments from Clerk Billing to DodoPayments
- Upgraded Next.js to v16
- Upgraded Convex to v1.31
- Upgraded Capacitor to v8
- Improved AI provider fallback chain (Groq → Gemini → OpenRouter)

---

## [1.0.0] — 2024-06-01

### Added
- Initial release of RESURGO
- Goal management with AI decomposition (Groq / Gemini / OpenRouter)
- Habit tracking with streak calculation
- Gamification system (XP, levels, badges)
- Focus timer (Pomodoro + Deep Work modes)
- Interactive calendar
- Analytics dashboard
- Wellness / mood tracking
- Dark / light theme
- PWA support
- Data export (JSON + PDF)
- Clerk authentication
- Convex real-time database

[Unreleased]: https://github.com/shaykhedeee/resurgo/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/shaykhedeee/resurgo/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/shaykhedeee/resurgo/releases/tag/v1.0.0
