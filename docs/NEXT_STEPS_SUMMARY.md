# Comprehensive Resurgo.Life Web App Enhancement Prompt

## Project Overview
You are tasked with deeply analyzing and enhancing the Resurgo.Life web application - a holistic personal development platform. This requires thorough examination of the entire codebase, documentation, and feature set to transform it into a production-ready, AI-powered, gamified wellness application.

---

## Phase 1: Deep Discovery & Analysis

### 1.1 Codebase Reconnaissance
```
TASK: Perform comprehensive codebase analysis
- Scan ALL files in the repository recursively
- Map out the complete file structure and dependencies
- Identify all React components, API routes, utilities, and services
- Document the current data flow and state management architecture
- List all existing features and their implementation status
- Identify incomplete features, TODO comments, and technical debt
```

### 1.2 Documentation Deep Dive
```
TASK: Exhaustive documentation review
- Read and analyze EVERY .md file in the project
- Extract ALL planned features, enhancements, and requirements
- Identify the original vision and intended user experience
- Create a master feature list with priority levels
- Delete redundant, outdated, or irrelevant documentation
- Consolidate important information into organized docs
```

### 1.3 Environment & API Configuration Analysis
```
TASK: Environment configuration audit
- Review the .env file for all new API keys
- Document each API key's purpose and service
- Verify which APIs are integrated vs. configured but unused
- Research rate limits and refresh patterns for free tier APIs
- Create integration status report for all API services
```

---

## Phase 2: AI System Architecture Overhaul

### 2.1 Multi-Model AI Pipeline Implementation
```
TASK: Build sophisticated multi-model AI orchestration system

REQUIREMENTS:
- Integrate ALL available free AI models from API keys in .env
- Create intelligent routing system that selects optimal model(s) per task
- Implement 4-5 model pipeline for complex tasks:
  * Model 1: Initial task analysis and breakdown
  * Model 2: Deep processing and context enhancement
  * Model 3: Validation and refinement
  * Model 4: Output optimization
  * Model 5: Quality assurance and formatting

TECHNICAL SPECIFICATIONS:
- Build a centralized AI orchestrator service (src/services/ai-orchestrator.js)
- Implement rate limit management with automatic rotation
- Create token budget tracker to prevent API exhaustion
- Add automatic fallback mechanisms when models are rate-limited
- Implement response caching to minimize API calls
- Build retry logic with exponential backoff

ARCHITECTURE:
```typescript
// Pseudo-structure
class AIOrchestrator {
  - modelPool: Map<string, AIModel>
  - rateLimitManager: RateLimitTracker
  - taskRouter: TaskRouter
  - responseCache: CacheManager
  
  async processTask(task, complexity, userContext) {
    // Route to single model or pipeline based on complexity
    if (complexity === 'high') {
      return await this.multiModelPipeline(task, userContext)
    }
    return await this.singleModelProcess(task, userContext)
  }
  
  async multiModelPipeline(task, context) {
    // Stage 1: Decomposition
    // Stage 2: Deep analysis
    // Stage 3: Synthesis
    // Stage 4: Refinement
    // Stage 5: Validation
  }
}
```

### 2.2 User Learning & Personalization System
```
TASK: Implement adaptive AI that learns user patterns

FEATURES TO BUILD:
- User behavior tracking system
- Preference learning algorithm
- Contextual memory for conversations
- Pattern recognition for habits and goals
- Personalized suggestion engine
- Adaptive communication style (learns user's tone preference)

DATA TO TRACK:
- User interaction patterns
- Task completion history
- Goal achievement rates
- Preferred times for activities
- Communication style preferences
- Response to different motivation types
- Wellness area focus (physical, mental, spiritual, etc.)

IMPLEMENTATION:
- Create user profile learning service
- Build vector database for user context (use free embedding API)
- Implement conversation memory (last 10-20 interactions)
- Create personalization scoring algorithm
- Add user insights dashboard
```

### 2.3 AI Greeting & Interaction Enhancement
```
TASK: Implement dynamic, personalized AI greeting system

REQUIREMENTS:
- Greet user by name on login
- Time-aware greetings (morning, afternoon, evening)
- Context-aware messages based on:
  * Last login time
  * Pending tasks
  * Streak status
  * Recent achievements
  * Upcoming goals
- Motivational messages aligned with user's current journey
- Celebration of milestones and achievements

EXAMPLES:
- "Good morning, Alex! Ready to conquer day 15 of your meditation streak? 🧘"
- "Welcome back, Sam! You've completed 3/5 tasks today - momentum is building! 💪"
- "Hey Jordan! It's been 3 days - we missed you. Let's ease back in together."
```

---

## Phase 3: Feature Enhancement & Depth Addition

### 3.1 Vision Board Feature Overhaul
```
TASK: Transform vision board into professional-grade manifestation tool

CURRENT STATE: Analyze existing implementation
TARGET STATE: AI-powered, visually stunning, interactive vision board

ENHANCEMENTS REQUIRED:
1. AI-Powered Image Generation
   - Integrate free image generation API (e.g., Stability AI, Leonardo.ai free tier)
   - Generate high-quality, relevant images based on user's goals
   - Create cohesive aesthetic based on user preferences
   - Support custom image uploads with AI enhancement

2. Vision Board Builder
   - Drag-and-drop interface for image arrangement
   - Multiple template layouts (grid, collage, magazine-style)
   - Text overlay with custom fonts and styling
   - Category-based organization (career, health, relationships, etc.)

3. Smart Features
   - AI suggests images based on goal descriptions
   - Auto-arrangement for aesthetic composition
   - Vision board analytics (views, time spent, goal completion correlation)
   - Daily affirmation generation tied to vision board elements
   - Progress photo overlays (compare current state to vision)

4. Export & Sharing
   - High-resolution download (1920x1080, 4K)
   - Mobile wallpaper optimization
   - Shareable links (optional)
   - Print-ready formats

TECHNICAL IMPLEMENTATION:
- Use Canvas API or Fabric.js for board creation
- Integrate Unsplash API or Pexels API for stock images
- Use free AI image generation for custom visuals
- Implement real-time collaboration (future: share boards with accountability partners)
```

### 3.2 Wellness Center Feature Expansion
```
TASK: Build comprehensive wellness hub with depth and intelligence

FEATURES TO IMPLEMENT:

1. Wellness Assessment Dashboard
   - Physical health score (based on fitness, sleep, nutrition data)
   - Mental health tracking (mood patterns, stress levels)
   - Spiritual wellness (meditation, mindfulness, purpose alignment)
   - Social wellness (relationship quality, community engagement)
   - Visual radar chart showing balance across dimensions

2. Guided Programs
   - AI-generated personalized wellness plans
   - 7-day, 30-day, 90-day challenge programs
   - Adaptive difficulty based on user progress
   - Multiple focus areas: stress reduction, energy boost, sleep improvement, etc.

3. Resource Library
   - Curated articles (pull from free APIs or scrape wellness sites legally)
   - Video integration (YouTube API for guided meditations, workouts)
   - Audio library for sleep sounds, meditation, affirmations
   - Journaling prompts specific to wellness goals

4. Wellness Check-ins
   - Daily/weekly wellness surveys
   - Mood tracking with emotion AI analysis
   - Energy level monitoring
   - Stress trigger identification
   - Sleep quality logging

5. Integration Hub
   - Connect all wellness-related features (fitness, nutrition, meditation, sleep)
   - Unified wellness score calculation
   - Cross-feature insights (e.g., "Your meditation streak correlates with better sleep")
```

### 3.3 Fitness & Nutrition System
```
TASK: Build advanced fitness and nutrition tracking with AI coaching

FITNESS FEATURES:

1. Workout Tracking
   - Exercise library (integrate free fitness APIs: WGER, ExerciseDB)
   - Custom workout builder
   - AI-generated workout plans based on:
     * User goals (muscle gain, weight loss, endurance, flexibility)
     * Available equipment
     * Time availability
     * Fitness level
     * Past performance
   - Video demonstrations (YouTube API integration)
   - Progress tracking (weight lifted, reps, duration)
   - Body measurements tracking
   - Progress photos with AI body composition analysis

2. Activity Tracking
   - Daily step counter (if device supports)
   - Active minutes tracking
   - Calorie burn estimation
   - Integration with free fitness APIs

NUTRITION FEATURES:

1. Food Tracking & Logging
   - Comprehensive food database (integrate USDA FoodData Central API - FREE)
   - Barcode scanning (use free tier of Open Food Facts API)
   - Quick add frequent foods
   - Meal photo logging with AI food recognition
   - Recipe builder with nutritional breakdown

2. Intelligent Nutrition Planning
   - Calculate personalized macro targets:
     * Based on: age, weight, height, gender, activity level, goals
     * Support goals: weight loss, maintenance, muscle gain, athletic performance
   - Micronutrient tracking (vitamins, minerals)
   - Hydration tracking with smart reminders
   - Meal prep planner with grocery lists
   - AI meal suggestions based on:
     * Nutritional gaps
     * Dietary preferences/restrictions
     * Budget
     * Cooking skill level
     * Time availability
     * Available ingredients

3. Advanced Nutrition Intelligence
   - Nutritional value optimization for user's lifestyle
   - Deficiency detection and correction suggestions
   - Meal timing optimization (pre/post workout, intermittent fasting support)
   - Food-mood correlation tracking
   - Digestive health insights
   - Supplement recommendations (informational only)

4. Weight Management
   - Smart weight goal setting (safe rate calculation)
   - Progress predictions using AI
   - Plateau detection and breaking strategies
   - Body composition estimates (if measurements provided)
   - Visual progress charts and trends

TECHNICAL IMPLEMENTATION:
- Integrate USDA FoodData Central API (free, comprehensive)
- Use Open Food Facts API for barcode scanning
- Implement Mifflin-St Jeor equation for BMR calculation
- Build macro calculator with multiple formula support
- Create meal suggestion algorithm using nutritional algebra
- Add recipe API integration (Spoonacular free tier or Edamam)
```

### 3.4 Water Tracking Integration
```
TASK: Implement intelligent hydration tracking system

FEATURES:
- Daily water intake goal calculation (based on weight, activity, climate)
- Quick log buttons (cup, bottle, liter presets)
- Custom container sizes
- Hydration reminders with smart timing (avoid nighttime)
- Integration with weather API (increase suggestions on hot days)
- Dehydration warning system
- Hydration streak tracking
- Visual fill indicator (animated water glass/bottle)
- Correlation analysis (hydration vs. energy, mood, skin health)

APIS TO USE:
- Weather API (OpenWeatherMap free tier) for climate-based adjustments
```

### 3.5 Weather Integration
```
TASK: Integrate weather data for contextual wellness insights

IMPLEMENTATION:
- Fetch user location (with permission)
- Display current weather on dashboard
- Use weather data to influence:
  * Workout suggestions (indoor vs. outdoor)
  * Water intake recommendations
  * Mood tracking context
  * Energy level expectations
  * Seasonal wellness tips
- Severe weather alerts
- UV index for outdoor activity planning
- Air quality index (if available in free tier)

API: OpenWeatherMap (free tier, 1000 calls/day)
```

---

## Phase 4: Dashboard & Overview Enhancement

### 4.1 Advanced Terminal-Style Dashboard
```
TASK: Create futuristic, terminal-inspired overview dashboard

DESIGN CONCEPT:
- Sci-fi aesthetic with clean, modern execution
- Terminal/command-line inspired elements
- Matrix-like subtle animations
- Dark theme with neon accent colors (#00ff00, #00ffff, #ff00ff)
- Glassmorphism effects for depth
- Monospace fonts for data displays

DASHBOARD SECTIONS:

1. Command Center Header
   - User greeting with avatar
   - Current date/time with timezone
   - System status indicators (streak, XP level, wellness score)
   - Quick action terminal (command palette)

2. Stats Grid (Terminal Blocks)
   ┌─ TODAY'S METRICS ─────────────────┐
   │ Tasks: 3/7 completed [▓▓▓░░░░] 43%│
   │ XP Earned: +125 [████░░] Level 12 │
   │ Streak: 🔥 15 days STRONG         │
   │ Wellness: ████████░░ 82/100       │
   └───────────────────────────────────┘

3. Real-Time Activity Feed
   > 09:23 - Completed "Morning Meditation" [+50 XP]
   > 10:45 - Logged breakfast [892 cal] 
   > 12:30 - Workout logged: Upper Body [+75 XP]
   > 14:15 - Hydration goal: 6/8 glasses ✓

4. Multi-Dimensional Progress Visualization
   - Radar chart for wellness dimensions
   - XP progress bar with level indicator
   - Habit strength meters
   - Goal completion rings (iOS-style activity rings)
   - Body metrics visualization (weight, measurements over time)

5. AI Insights Terminal
   ┌─ SYSTEM INSIGHTS ─────────────────┐
   │ > Analyzing patterns...           │
   │ > You're most productive 9-11 AM  │
   │ > Meditation streak = better sleep│
   │ > Suggestion: Add protein to lunch│
   └───────────────────────────────────┘

6. Quick Stats Panel
   - Weather widget
   - Water intake tracker
   - Calorie budget (consumed/remaining)
   - Next task timer
   - Upcoming habit reminders

7. Achievement Showcase
   - Recent badges earned
   - Level progression
   - Milestone celebrations
   - Leaderboard (if competitive mode enabled)

TECHNICAL REQUIREMENTS:
- Use Chart.js or D3.js for visualizations
- Implement WebGL for smooth animations (Three.js for 3D elements)
- Use CSS Grid for responsive terminal layout
- Add typewriter effect for AI messages
- Implement real-time updates using WebSockets or polling
- Use React Spring for fluid animations
```

### 4.2 Body Model Visualization (Account Tab)
```
TASK: Create interactive 3D/2D body model in user profile

FEATURES:
- Scientific anatomical figure (gender-specific)
- Display user's height and weight
- Body measurements overlay (chest, waist, hips, arms, legs)
- BMI indicator with health range visualization
- Progress overlay (before/after silhouettes)
- Interactive body parts (click for specific measurements)
- Muscle group highlight (show what's being worked)
- Posture analysis (if photo uploaded)

TECHNICAL IMPLEMENTATION:
- Use SVG for 2D model with annotations
- Or Three.js for 3D rotatable model
- Color code body systems (muscular, skeletal, etc.)
- Animate changes over time
- Integration with fitness tracking data

DESIGN:
- Clean, medical/scientific aesthetic
- Futuristic UI elements
- Smooth transitions
- Responsive for mobile
```

---

## Phase 5: Gamification System Overhaul

### 5.1 XP & Leveling System
```
TASK: Build comprehensive, functional gamification engine

CURRENT ISSUES TO FIX:
- XP not being added to user profile
- No visible XP bar
- Level progression not working
- Achievements not triggering

XP SYSTEM DESIGN:

1. XP Sources & Values
   - Task completion: 10-100 XP (based on difficulty)
   - Habit completion: 25 XP
   - Streak milestone: 50-500 XP (7, 30, 60, 100 days)
   - Goal achievement: 100-1000 XP (based on goal size)
   - Daily login: 5 XP
   - Wellness check-in: 15 XP
   - Workout logged: 30-100 XP (based on intensity)
   - Meal logged: 10 XP
   - Perfect day (all tasks + habits): 200 XP bonus
   - Weekly consistency: 150 XP
   - Challenge completion: 500-2000 XP

2. Leveling Formula
   ```javascript
   // Exponential curve to keep progression challenging
   function getXPForLevel(level) {
     return Math.floor(100 * Math.pow(level, 1.5));
   }
   
   function getUserLevel(totalXP) {
     let level = 1;
     let xpNeeded = 0;
     while (totalXP >= xpNeeded) {
       level++;
       xpNeeded += getXPForLevel(level);
     }
     return level - 1;
   }
   ```

3. Visual Representation
   - Animated XP bar (fill animation on gain)
   - Level badge/number prominently displayed
   - XP gain notifications (+25 XP popup)
   - Level up celebrations (confetti, sound, modal)
   - Next level progress (e.g., "Level 12: 450/650 XP")

4. Level Benefits (Unlocks)
   - Level 5: Custom themes unlocked
   - Level 10: Advanced analytics
   - Level 15: AI coach personality options
   - Level 20: Beta features access
   - Level 25: Premium vision board templates
   - Level 50: Legendary status badge

ACHIEVEMENT SYSTEM:

Categories:
- Streaks (7, 30, 100, 365 days)
- Consistency (perfect weeks, months)
- Milestones (100 tasks, 1000 tasks)
- Wellness (meditation hours, workouts completed)
- Nutrition (healthy meals, calorie goals met)
- Growth (goals achieved, habits mastered)
- Special (Easter eggs, hidden challenges)

Implementation:
- Achievement checker service (runs on every user action)
- Achievement popup with badge animation
- Achievement gallery in profile
- Rarity tiers (common, rare, epic, legendary)
- Social sharing options

LEADERBOARDS (OPTIONAL):

- Weekly XP leaderboard
- Streak leaderboard
- Category-specific boards (fitness, nutrition, mindfulness)
- Friends-only leaderboard
- Opt-in participation (privacy-focused)

SUBTLE BUT IMPACTFUL DESIGN:
- No overwhelming gamification elements
- Tasteful animations and celebrations
- Optional visibility (can be minimized)
- Focus on intrinsic motivation enhanced by extrinsic rewards
- Meaningful progression tied to real-world growth
```

---

## Phase 6: Telegram Bot Integration

### 6.1 Telegram Webhook Setup
```
TASK: Configure and deploy Telegram bot with webhook

ISSUE: Webhook not properly configured

SOLUTION STEPS:

1. Verify Bot Token
   - Confirm TELEGRAM_BOT_TOKEN in .env is correct
   - Test token validity: GET https://api.telegram.org/bot<TOKEN>/getMe

2. Webhook Configuration
   ```javascript
   // Backend API route: /api/telegram/webhook
   
   const WEBHOOK_URL = `${process.env.APP_URL}/api/telegram/webhook`;
   
   // Set webhook
   async function setWebhook() {
     const response = await fetch(
       `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           url: WEBHOOK_URL,
           allowed_updates: ['message', 'callback_query']
         })
       }
     );
     return response.json();
   }
   ```

3. Webhook Handler Implementation
   - Create Express route for POST /api/telegram/webhook
   - Parse incoming updates
   - Authenticate user via chat_id
   - Process commands and messages
   - Send responses using sendMessage API

4. Bot Commands to Implement
   /start - Welcome and link account
   /tasks - View today's tasks
   /addtask - Quick task addition
   /habits - Check habit status
   /log - Quick logging (food, water, workout)
   /stats - Daily summary
   /motivate - Get AI motivation
   /goals - View active goals
   /streak - Check streak status

5. Notification System
   - Morning motivation message
   - Task reminders
   - Habit reminders
   - Streak warnings
   - Goal deadline alerts
   - Achievement celebrations

6. Deployment Considerations
   - Ensure HTTPS for webhook (Telegram requirement)
   - Use environment variable for webhook URL
   - Implement secret token verification
   - Add rate limiting
   - Log all interactions for debugging

TESTING:
- Use ngrok for local testing
- Verify webhook is receiving updates: /getWebhookInfo
- Test all commands thoroughly
- Ensure bi-directional sync (web app ↔ Telegram)
```

---

## Phase 7: UI/UX Enhancements

### 7.1 Landing Page Flow Improvement
```
TASK: Fix auto-scroll issue and improve landing page experience

CURRENT ISSUE: Page auto-scrolls to demo section, disrupting user flow

FIXES REQUIRED:
1. Remove any scroll-to-section code on page load
2. Ensure smooth, user-controlled scrolling
3. Implement proper anchor links for navigation
4. Add smooth scroll behavior with CSS
   ```css
   html {
     scroll-behavior: smooth;
   }
   ```
5. Fix any useEffect hooks causing unwanted scrolling
6. Check for hash routing issues (#demo redirects)

ENHANCEMENTS:
- Hero section: Stronger value proposition
- Feature showcase: Animated demonstrations
- Social proof: Testimonials, stats, trust indicators
- Clear CTA buttons with visual hierarchy
- Mobile-responsive design verification
- Fast load time optimization (<3s FCP)
```

### 7.2 Overall UX Improvements
```
TASK: Enhance user understandability and intuitive navigation

IMPROVEMENTS NEEDED:

1. Onboarding Flow
   - First-time user tutorial (interactive walkthrough)
   - Goal-setting wizard on signup
   - Feature discovery tooltips
   - Progressive disclosure of complex features

2. Navigation
   - Clear information architecture
   - Breadcrumbs for deep pages
   - Search functionality (global search)
   - Quick access sidebar/command palette (Cmd+K)

3. Feedback & Guidance
   - Inline help text
   - Contextual tips
   - Empty states with guidance
   - Error messages with solutions
   - Success confirmations
   - Loading states for all async operations

4. Accessibility
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader optimization
   - Color contrast verification
   - Focus indicators
   - Alt text for all images

5. Responsive Design
   - Mobile-first approach
   - Touch-friendly targets (44x44px minimum)
   - Adaptive layouts for tablet, desktop
   - PWA optimization for app-like feel

6. Performance Optimization
   - Code splitting
   - Lazy loading for routes and images
   - Image optimization (WebP, lazy loading)
   - Bundle size reduction
   - Caching strategies
   - Prefetching for anticipated routes
```

---

## Phase 8: Task & Habit Intelligence

### 8.1 Smart Task Management
```
TASK: Enhance task system with AI-powered accuracy and relevance

FEATURES TO IMPLEMENT:

1. AI Task Generation
   - Based on user goals, generate relevant daily/weekly tasks
   - Priority scoring using urgency/importance matrix
   - Time estimation using historical data
   - Difficulty assessment

2. Task Relevance Filtering
   - Remove or archive irrelevant tasks automatically
   - Suggest task modifications based on user behavior
   - Identify redundant or conflicting tasks

3. Smart Scheduling
   - Optimal time slot suggestions
   - Energy level correlation (suggest hard tasks when user is most productive)
   - Calendar integration (respect existing commitments)
   - Task batching recommendations

4. Dependency Tracking
   - Link related tasks
   - Sequential task chains
   - Blocker identification

5. Recurring Task Intelligence
   - Smart frequency adjustment based on completion patterns
   - Adaptive reminders
   - Automatic reschedule on miss
```

### 8.2 Personalized Habit Recommendations
```
TASK: Build intelligent habit suggestion system

REQUIREMENTS:

1. User-Specific Habit Generation
   - Analyze user's goals, weaknesses, lifestyle
   - Suggest habits with highest impact for their situation
   - Consider time availability and current habit load
   - Avoid overwhelming with too many habits

2. Habit Library
   - Categorized habit database (health, productivity, mindfulness, relationships)
   - Evidence-based habit effectiveness ratings
   - Difficulty levels
   - Time requirements
   - Benefits explanation

3. Habit Stacking Suggestions
   - Identify existing routines to piggyback on
   - Suggest logical habit chains (e.g., "After coffee → meditate")

4. Adaptive Difficulty
   - Start with easy versions (1 push-up, 1 minute meditation)
   - Gradually increase based on consistency
   - Regression to easier version after breaks

5. Context-Aware Reminders
   - Location-based (e.g., "Stretch" when arriving home)
   - Time-based with optimal timing
   - Frequency adjustment based on completion rate

IMPLEMENTATION:
- Create habit recommendation algorithm
- Build habit knowledge base
- Implement habit analytics (completion rate, best time, longest streak)
- Add habit journey visualization (30-day habit formation curve)
```

---

## Phase 9: Additional Free API Integrations

### 9.1 Comprehensive API Integration Checklist
```
TASK: Research and integrate all useful free APIs

CATEGORIES & APIS:

1. Wellness & Health
   ✓ Nutrition: USDA FoodData Central
   ✓ Exercise: ExerciseDB, WGER Workout Manager
   ✓ Meditation: (custom content or YouTube API)
   ✓ Sleep: (user input + analysis)

2. Productivity
   - Quotes API (motivational quotes): ZenQuotes, Quotable
   - News API: NewsAPI (free tier)
   - Calendar: Google Calendar API (with user OAuth)

3. Environment
   ✓ Weather: OpenWeatherMap
   - Air Quality: IQAir, OpenAQ
   - Sunrise/Sunset: Sunrise-Sunset API

4. Knowledge
   - Dictionary: Free Dictionary API
   - Wikipedia: MediaWiki API
   - Learning: (educational content APIs if available)

5. Entertainment
   - Podcasts: (RSS feeds, iTunes API)
   - Music: (Spotify API for motivational playlists - read-only)
   - Books: Open Library API

6. Finance (if relevant to goals)
   - Currency: Exchange Rates API
   - Stocks: Alpha Vantage (free tier)

7. Location
   - Geocoding: OpenCage, Nominatim
   - Maps: Leaflet with OpenStreetMap

8. AI Services (already addressed)
   - Various LLM APIs
   - Image generation
   - Text-to-speech (if needed for accessibility)

INTEGRATION STRATEGY:
- Create unified API service layer
- Implement caching to respect rate limits
- Graceful degradation if API unavailable
- User preferences for data sources
- Background sync for data-heavy APIs
```

---

## Phase 10: Notification System

### 10.1 Comprehensive Notification Implementation
```
TASK: Build fully functional, intelligent notification system

NOTIFICATION TYPES:

1. Push Notifications (PWA)
   - Request permission on user opt-in
   - Service worker implementation
   - Background sync for offline delivery

2. In-App Notifications
   - Notification center/inbox
   - Real-time updates (WebSocket or polling)
   - Categorized by type

3. Telegram Notifications (if enabled)
   - Sync with Telegram bot
   - User preference for notification types

4. Email Notifications (optional)
   - Digest emails (weekly summaries)
   - Important alerts only

NOTIFICATION TRIGGERS:

Reminders:
- Habit reminders (customizable times)
- Task deadlines approaching
- Water intake reminders
- Meal time suggestions
- Bedtime wind-down
- Wake-up motivation

Achievements:
- XP milestones
- Level up
- Achievements unlocked
- Streak milestones
- Goal completion

Social:
- Friend achievements (if social features exist)
- Challenges (if competitive mode)

Insights:
- Weekly progress summary
- Monthly review ready
- AI-detected patterns
- Wellness alerts (e.g., "You seem stressed this week")

SMART NOTIFICATION FEATURES:
- Quiet hours (no notifications during sleep)
- Notification batching (don't spam user)
- Priority levels (critical, high, medium, low)
- Action buttons (complete task from notification)
- Snooze options
- Delivery channel preferences per notification type

TECHNICAL IMPLEMENTATION:
- Service Worker for push notifications
- Notification API (Web Notifications)
- Permission management
- Notification preferences UI
- Background task scheduling
- Delivery tracking and analytics

USER CONTROLS:
- Master notification toggle
- Per-type toggles (habits, tasks, achievements, etc.)
- Quiet hours configuration
- Frequency settings (immediate, batched, digest)
- Channel preferences (push, telegram, email)
```

---

## Phase 11: Theming & Visual Polish

### 11.1 Sci-Fi Futuristic Theme
```
TASK: Implement cohesive sci-fi aesthetic across application

DESIGN SYSTEM:

Color Palette:
- Primary: Deep space navy (#0a0e27)
- Secondary: Cyan accent (#00d9ff)
- Tertiary: Electric purple (#b833ff)
- Success: Neon green (#00ff88)
- Warning: Orange (#ff9500)
- Error: Red (#ff3366)
- Text: Off-white (#e0e6ed)
- Text secondary: Gray (#8892a6)

Typography:
- Headers: "Orbitron", "Rajdhani" (geometric, futuristic)
- Body: "Inter", "Space Grotesk" (clean, readable)
- Code/Terminal: "Fira Code", "JetBrains Mono"

UI Elements:
- Glassmorphism cards (frosted glass effect)
- Subtle glow effects on interactive elements
- Animated gradients
- Particle backgrounds (canvas or CSS)
- Neon borders on focus
- Smooth transitions (200-300ms)
- Micro-interactions (hover effects, button presses)

Components Style:
- Rounded corners (8-12px border-radius)
- Floating action buttons
- Holographic effects on important elements
- Progress bars with glow
- Cards with depth (box-shadow, backdrop-blur)

Animations:
- Fade-in on route change
- Slide-in for modals
- Bounce for success states
- Pulse for notifications
- Loading spinners (futuristic, not generic)
- Chart animations (smooth rendering)

IMPLEMENTATION:
- Create comprehensive CSS variables
- Build component library with Storybook (optional)
- Ensure dark theme is primary (light theme optional)
- Use CSS-in-JS or styled-components for dynamic styling
- Implement theme toggle (if supporting multiple themes)
```

### 11.2 Terminal UI Elements
```
TASK: Add terminal-inspired UI components

COMPONENTS TO CREATE:

1. Command Palette
   - Keyboard shortcut to open (Cmd/Ctrl + K)
   - Fuzzy search for actions
   - Quick navigation to features
   - Command history
   - Suggested commands based on context

2. Terminal-Style Input
   - Monospace font
   - Cursor blink animation
   - Command auto-complete
   - Syntax highlighting for advanced users

3. Activity Log Terminal
   - Scrollable log of user actions
   - Timestamp for each entry
   - Color-coded by action type
   - Filterable by category

4. System Status Indicators
   - Inspired by server monitoring dashboards
   - Real-time metrics
   - Uptime (streak days)
   - Response time (task completion speed)

5. Data Visualization
   - ASCII art charts (for aesthetic, not primary data viz)
   - Matrix-style data streams
   - Hexadecimal or binary decorative elements

EXAMPLES:
```
┌─ COMMAND PALETTE ─────────────────────┐
│ > Add new task_                       │
│                                        │
│ Suggestions:                           │
│   → Add new task                       │
│   → Add habit                          │
│   → Add goal                           │
│   → Navigate to Dashboard              │
└────────────────────────────────────────┘

┌─ ACTIVITY LOG ────────────────────────┐
│ [14:23:45] TASK_COMPLETE: "Workout"   │
│ [14:22:10] XP_GAINED: +75 XP          │
│ [13:45:32] MEAL_LOGGED: "Lunch"       │
│ [09:15:08] HABIT_COMPLETE: "Meditate" │
└────────────────────────────────────────┘
```

---

## Phase 12: Gamification Subtlety & Impact

### 12.1 Balanced Gamification Design
```
TASK: Implement impactful yet non-intrusive gamification

PRINCIPLES:
- Support intrinsic motivation, don't replace it
- Celebration of real progress, not arbitrary metrics
- Optional visibility (can be minimized for minimalists)
- Meaningful rewards tied to actual growth

SUBTLE ELEMENTS:

1. Progress Indicators
   - Minimalist progress bars (thin, elegant)
   - Completion checkmarks with subtle animation
   - Streak flames (small, tasteful icons)
   - Level badge (corner indicator, not overwhelming)

2. Micro-Celebrations
   - Brief confetti on achievement (2-3 seconds)
   - Satisfying checkmark animation
   - Gentle notification sounds (optional, user-controlled)
   - Haptic feedback on mobile (if supported)

3. Visual Feedback
   - Smooth transitions on XP gain
   - Glow effect on level up
   - Color shift for streak milestones
   - Animated numbers counting up

IMPACTFUL ELEMENTS:

1. Milestone Celebrations
   - Full-screen modal for major achievements
   - Shareable achievement cards
   - Personalized congratulations message from AI
   - Unlock notification for new features

2. Progress Insights
   - "You're in the top 10% for consistency"
   - "Your meditation practice has grown 300%"
   - "You've built 5 lasting habits"

3. Comparison & Context
   - Personal best indicators
   - "Your longest streak yet!"
   - Year-over-year growth
   - Before/after comparisons

IMPLEMENTATION GUIDELINES:
- Use animation libraries sparingly (CSS animations preferred)
- Respect prefers-reduced-motion
- Provide settings to reduce gamification visibility
- Focus on personal growth, not comparison to others (unless opted-in)
```

---

## Phase 13: PWA Optimization

### 13.1 Progressive Web App Enhancement
```
TASK: Ensure PWA functions like native application without performance issues

CURRENT CONCERN: "Add to Desktop" feature potentially hurting performance

OPTIMIZATIONS REQUIRED:

1. Service Worker Optimization
   - Efficient caching strategy (cache-first for static, network-first for dynamic)
   - Background sync for offline actions
   - Minimal service worker file size
   - Proper versioning and update mechanism

2. Manifest Configuration
   - Correct icons for all sizes (192x192, 512x512)
   - Splash screens for different devices
   - Theme colors matching app design
   - Display mode: standalone
   - Orientation preferences

3. Performance Monitoring
   - Lighthouse CI integration
   - Core Web Vitals tracking
     * LCP (Largest Contentful Paint) < 2.5s
     * FID (First Input Delay) < 100ms
     * CLS (Cumulative Layout Shift) < 0.1
   - Memory leak detection
   - Battery usage optimization

4. Offline Functionality
   - Offline-first architecture where possible
   - Queue actions when offline, sync when online
   - Clear offline indicators
   - Cached data management (prevent unlimited growth)

5. Install Experience
   - Custom install prompt (not relying solely on browser)
   - Onboarding specific to installed app
   - App shortcuts (context menu options)
   - Push notification setup post-install

6. Platform Integration
   - Share target (receive shares from other apps)
   - File handling (if relevant)
   - Contact picker integration (if needed)
   - Media session API (if audio features exist)

PERFORMANCE CHECKLIST:
□ Code splitting implemented
□ Lazy loading for images and routes
□ Bundle size < 200KB (initial load)
□ Tree shaking enabled
□ Minification and compression (gzip/brotli)
□ CDN for static assets
□ Image optimization (responsive images, WebP)
□ Font optimization (subset, woff2)
□ Remove unused CSS/JS
□ Avoid render-blocking resources
□ Efficient state management (avoid unnecessary re-renders)

TESTING:
- Test on low-end devices (throttle CPU/network in DevTools)
- Test offline mode thoroughly
- Verify install on iOS, Android, Desktop (Chrome, Edge)
- Monitor real-world performance with analytics
```

---

## Phase 14: Security Hardening

### 14.1 Security Best Practices Implementation
```
TASK: Secure application for production deployment

SECURITY MEASURES:

1. Authentication & Authorization
   - Secure password hashing (bcrypt, min 10 rounds)
   - JWT implementation review
     * Short expiration times (15 min access, 7 day refresh)
     * Secure token storage (httpOnly cookies for refresh token)
     * Token rotation
   - Rate limiting on auth endpoints
   - Account lockout after failed attempts
   - Password strength requirements
   - Optional 2FA (TOTP via authenticator apps)

2. API Security
   - API key rotation capability
   - Secure storage of API keys (never in client-side code)
   - Request signing for sensitive operations
   - Rate limiting per user/IP
   - Input validation and sanitization
   - Output encoding
   - CORS configuration (whitelist only necessary origins)

3. Data Protection
   - Encryption at rest for sensitive data
   - Encryption in transit (HTTPS only, HSTS headers)
   - SQL injection prevention (parameterized queries, ORM)
   - XSS prevention (Content Security Policy, sanitization)
   - CSRF protection (CSRF tokens)
   - Secure session management

4. Infrastructure
   - Environment variables for all secrets
   - .env file never committed (in .gitignore)
   - Different keys for dev/staging/production
   - Database access controls
   - Regular dependency updates (automated with Dependabot)
   - Vulnerability scanning (npm audit, Snyk)

5. Privacy
   - GDPR compliance considerations
   - Privacy policy
   - Terms of service
   - Cookie consent (if using tracking cookies)
   - Data export functionality
   - Account deletion capability
   - Minimal data collection principle

6. Headers & Policies
   ```javascript
   // Security headers
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"],
         imgSrc: ["'self'", "data:", "https:"],
       },
     },
     hsts: {
       maxAge: 31536000,
       includeSubDomains: true,
       preload: true
     }
   }));
   ```

7. Logging & Monitoring
   - Error logging (without exposing sensitive data)
   - Security event logging (failed logins, unusual activity)
   - Monitoring for suspicious patterns
   - Alerting for critical events

SECURITY AUDIT CHECKLIST:
□ No secrets in repository
□ All inputs validated
□ All outputs sanitized
□ Authentication tested
□ Authorization tested (can users access others' data?)
□ HTTPS enforced
□ Security headers implemented
□ Dependencies updated
□ No vulnerable packages
□ Rate limiting active
□ CORS properly configured
□ Error messages don't leak sensitive info
□ SQL injection tests passed
□ XSS tests passed
□ CSRF protection verified
```

---

## Phase 15: Code Optimization & Cleanup

### 15.1 Codebase Optimization
```
TASK: Optimize entire codebase for maintainability and performance

OPTIMIZATION AREAS:

1. Code Structure
   - Consistent file/folder naming convention
   - Logical component organization
   - Separation of concerns (presentation vs. logic)
   - Reusable utility functions
   - Custom hooks for shared logic
   - Service layer for API calls

2. React Optimization
   - Use React.memo for expensive components
   - Implement useCallback and useMemo appropriately
   - Avoid inline function definitions in JSX
   - Lazy load routes with React.lazy()
   - Code splitting by route and feature
   - Optimize re-renders (React DevTools Profiler)

3. State Management
   - Evaluate if global state is necessary for each piece of data
   - Use local state when possible
   - Context optimization (split contexts by concern)
   - Consider state management library if complexity warrants (Zustand, Jotai)

4. Database Queries
   - Index frequently queried fields
   - Optimize N+1 query problems
   - Use aggregation pipelines efficiently
   - Implement pagination for large datasets
   - Cache frequently accessed data

5. API Optimization
   - Batch requests where possible
   - Implement caching (in-memory, Redis)
   - Use compression (gzip/brotli)
   - Optimize payload sizes (send only necessary data)
   - Implement proper HTTP caching headers

6. Asset Optimization
   - Compress images (TinyPNG, Squoosh)
   - Use WebP with fallbacks
   - Implement responsive images (srcset)
   - SVG optimization
   - Font subsetting
   - Remove unused fonts and icons

7. Code Quality
   - ESLint configuration and adherence
   - Prettier for consistent formatting
   - TypeScript migration (recommended for large project)
   - Remove console.logs from production
   - Remove dead code
   - Remove unused dependencies
   - Meaningful variable and function names
   - Comments for complex logic only

8. Testing Preparation
   - Unit tests for utility functions
   - Integration tests for critical flows
   - E2E tests for user journeys
   - Test coverage reporting

REFACTORING PRIORITIES:
1. Extract repeated code into utilities
2. Break large components into smaller ones
3. Create consistent API response formats
4. Standardize error handling
5. Implement loading states consistently
6. Create reusable UI components
7. Document complex functions with JSDoc

PERFORMANCE TARGETS:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total bundle size: < 500KB
- API response times: < 200ms (p95)
- Database queries: < 50ms (p95)
```

### 15.2 Documentation & Comments
```
TASK: Ensure codebase is well-documented

DOCUMENTATION TO CREATE/UPDATE:

1. README.md
   - Project overview
   - Features list
   - Tech stack
   - Installation instructions
   - Environment variables documentation
   - Development guide
   - Deployment guide
   - Contributing guidelines

2. API Documentation
   - Document all API endpoints
   - Request/response formats
   - Authentication requirements
   - Error codes
   - Rate limits
   - Example requests (Postman collection or similar)

3. Component Documentation
   - Props documentation
   - Usage examples
   - Storybook (optional but recommended)

4. Code Comments
   - Complex algorithms explained
   - Business logic rationale
   - Workarounds and why they're needed
   - TODO comments for future improvements (tracked in issues)

5. Architecture Documentation
   - System architecture diagram
   - Data flow diagrams
   - Database schema
   - State management strategy
   - Authentication flow

6. Deployment Documentation
   - Deployment checklist
   - Environment setup
   - Monitoring setup
   - Backup strategy
   - Rollback procedures
```

---

## Phase 16: Pre-Deployment Preparation

### 16.1 Production Readiness Checklist
```
TASK: Prepare application for production deployment

DEPLOYMENT CHECKLIST:

□ Environment Configuration
  □ Production .env configured
  □ All API keys active and tested
  □ Database connection string (production)
  □ CORS whitelist configured
  □ Allowed origins set

□ Build Process
  □ Production build tested locally
  □ No build errors or warnings
  □ Source maps generated (for debugging)
  □ Bundle size analyzed and optimized

□ Testing
  □ All features manually tested
  □ Cross-browser testing (Chrome, Firefox, Safari, Edge)
  □ Mobile testing (iOS, Android)
  □ PWA install tested
  □ Offline mode tested
  □ Different screen sizes tested

□ Performance
  □ Lighthouse score > 90 (all categories)
  □ Load testing completed
  □ Database performance verified
  □ API rate limits tested

□ Security
  □ Security audit completed
  □ Penetration testing (basic)
  □ SSL certificate configured
  □ Security headers verified

□ Monitoring & Analytics
  □ Error tracking set up (Sentry, LogRocket, etc.)
  □ Analytics configured (if needed)
  □ Uptime monitoring (UptimeRobot, etc.)
  □ Performance monitoring (New Relic, Datadog, or built-in)

□ Legal & Compliance
  □ Privacy policy added
  □ Terms of service added
  □ Cookie policy (if applicable)
  □ GDPR compliance verified

□ Backup & Recovery
  □ Database backup strategy implemented
  □ Backup restoration tested
  □ Disaster recovery plan documented

□ Documentation
  □ User guide/help section
  □ FAQ section
  □ Changelog started
  □ Known issues documented

□ Domain & Hosting
  □ Domain purchased and configured
  □ DNS records set
  □ Hosting platform selected (Vercel, Netlify, custom)
  □ CDN configured (if separate from hosting)

□ Final Checks
  □ All features working end-to-end
  □ No console errors
  □ No broken links
  □ Contact/support email working
  □ Social media links (if any) working
  □ Favicon and app icons correct
  □ Meta tags for SEO (if public-facing)
  □ Open Graph tags for social sharing
```

### 16.2 Deployment Strategy
```
TASK: Plan and execute deployment

RECOMMENDED APPROACH:

1. Staging Deployment
   - Deploy to staging environment first
   - Conduct final testing in production-like environment
   - Get feedback from beta testers (if available)

2. Production Deployment
   - Choose deployment platform:
     * Vercel (recommended for Next.js/React)
     * Netlify
     * AWS Amplify
     * Custom (VPS with Docker)
   
   - Deployment steps:
     1. Push code to main branch
     2. Trigger production build
     3. Run automated tests (if CI/CD set up)
     4. Deploy to production
     5. Run smoke tests on production
     6. Monitor for errors

3. Post-Deployment
   - Monitor error rates
   - Check analytics for user behavior
   - Verify all integrations working
   - Be ready for rapid hotfix if needed

4. Rollback Plan
   - Keep previous version accessible
   - Document rollback procedure
   - Test rollback in staging

5. Gradual Rollout (Advanced)
   - Feature flags for new features
   - Percentage-based rollout
   - A/B testing for UI changes
```

---

## Phase 17: Implementation Priority & Timeline

### 17.1 Phased Implementation Approach
```
Given the extensive scope, implement in prioritized phases:

PHASE 1 (Critical - Week 1-2):
□ Fix current broken features (XP system, gamification)
□ Environment variable integration verification
□ Telegram webhook setup
□ Landing page auto-scroll fix
□ Security hardening basics
□ Code cleanup and optimization

PHASE 2 (High Priority - Week 2-4):
□ AI system overhaul (multi-model pipeline)
□ Dashboard enhancement (terminal UI)
□ Task and habit intelligence improvements
□ Notification system implementation
□ Vision board overhaul
□ Wellness center expansion

PHASE 3 (Medium Priority - Week 4-6):
□ Fitness and nutrition system
□ Water tracking integration
□ Weather integration
□ Additional free API integrations
□ Gamification refinement
□ Body model visualization

PHASE 4 (Enhancement - Week 6-8):
□ Theme and visual polish
□ Advanced UI/UX improvements
□ Performance optimization
□ PWA optimization
□ Comprehensive testing

PHASE 5 (Pre-Launch - Week 8-9):
□ Security audit
□ Documentation completion
□ Deployment preparation
□ Beta testing
□ Final bug fixes

PHASE 6 (Launch - Week 9-10):
□ Staging deployment
□ Production deployment
□ Monitoring setup
□ User onboarding materials
□ Support system ready
```

---

## Final Instructions for AI Implementation

```
EXECUTION GUIDELINES:

1. ANALYZE FIRST
   - Read EVERY file in the codebase
   - Understand current architecture before making changes
   - Identify dependencies between features
   - Map out data flow

2. DOCUMENT CHANGES
   - Keep detailed log of modifications
   - Comment complex implementations
   - Update README and documentation
   - Create migration guides if database changes

3. TEST CONTINUOUSLY
   - Test each feature after implementation
   - Regression test existing features
   - Document test cases

4. MAINTAIN CONSISTENCY
   - Follow existing code style
   - Use consistent naming conventions
   - Maintain architectural patterns

5. PRIORITIZE STABILITY
   - Don't break existing working features
   - Implement error boundaries
   - Graceful degradation for API failures

6. COMMUNICATE CLEARLY
   - Provide progress updates
   - Flag blockers or decisions needed
   - Explain trade-offs made

7. OPTIMIZE INCREMENTALLY
   - Don't prematurely optimize
   - Measure before and after optimization
   - Focus on user-perceptible improvements

SUCCESS CRITERIA:
✓ All features functional and tested
✓ No console errors in production
✓ Lighthouse score > 90 across all categories
✓ Security audit passed
✓ Documentation complete
✓ Successfully deployed to production
✓ User feedback mechanism in place
✓ Monitoring and analytics active

DELIVERABLES:
- Fully functional web application
- Comprehensive documentation
- Deployment guide
- Test coverage report
- Security audit report
- Performance benchmark results
- Known issues and roadmap for future enhancements
```

---

This comprehensive prompt provides clear, detailed instructions for completely overhauling and enhancing your Resurgo.Life application. The AI assistant working on this will have a complete roadmap covering every aspect from deep analysis through to production deployment. Each phase is broken down into specific tasks with actionable steps, ensuring a structured and efficient implementation process. The focus on documentation, testing, and security will help ensure a robust and maintainable codebase moving forward.


TASK: Become an expert on Resurgo.Life through exhaustive analysis

STEP 1: File-by-File Deep Scan
- Read EVERY single file in the repository (components, pages, services, utils, configs)
- Create mental map of:
  * Current features (working, broken, partial)
  * User flows (authentication → onboarding → dashboard → features)
  * Data models and relationships
  * API integrations (implemented vs. planned)
  * UI/UX patterns and inconsistencies
  * Technical debt locations

STEP 2: Documentation Excavation
- Read ALL .md files completely (README, FEATURES, TODO, CHANGELOG, etc.)
- Extract EVERY planned feature mentioned anywhere
- Identify the founder's original vision vs. current state
- Find hidden requirements in comments, commit messages, old docs
- Create master feature matrix:
  ✓ Implemented and working
  ⚠ Implemented but broken
  ○ Planned but not started
  × Deprecated/no longer needed

STEP 3: User Journey Mapping
- Map complete user flows:
  1. Landing page → Sign up → Onboarding → First use
  2. Daily usage patterns (morning check-in → task management → evening review)
  3. Feature discovery paths
  4. Settings and customization flows
  5. Mobile vs. desktop experiences

STEP 4: Page-by-Page Perfection Analysis
For EACH page/route, document:
- Current state and functionality
- User pain points
- Missing features that should be there
- UI/UX improvements needed
- Performance bottlenecks
- Accessibility issues
- Mobile responsiveness issues
- How it connects to other pages
- What would make this page "perfect"

DELIVERABLE: Complete application audit report before making ANY changes
PHASE 1: CRITICAL FOUNDATIONS (Week 1-2)
1.1 Intelligent Onboarding System - "Deep Scanner"
text

TASK: Create world-class onboarding that sets up the entire app to work FOR the user

CONCEPT: "The 5-Minute Life Setup"
- User answers thoughtful questions once
- AI builds complete personalized system
- User never has to configure anything manually again

ONBOARDING FLOW ARCHITECTURE:

┌─────────────────────────────────────────────────────────────┐
│                    WELCOME TO RESURGO                        │
│  "Let's spend 5 minutes understanding you, then we'll build  │
│   a personalized life operating system that works for you."  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: WHO ARE YOU? (Personal Foundation)                  │
├─────────────────────────────────────────────────────────────┤
│ • Name, age, timezone (auto-detect)                         │
│ • Current life phase: Student / Professional / Entrepreneur │
│   / Parent / Retired / Transitioning                        │
│ • Primary role/identity                                      │
│ • Daily schedule type: Fixed / Flexible / Chaotic           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: LIFE ASSESSMENT (Current State Analysis)            │
├─────────────────────────────────────────────────────────────┤
│ "Rate your current satisfaction (1-10) in:"                 │
│ • Physical Health & Fitness                                  │
│ • Mental & Emotional Wellbeing                              │
│ • Career & Finances                                          │
│ • Relationships & Social Life                               │
│ • Personal Growth & Learning                                │
│ • Purpose & Meaning                                          │
│                                                              │
│ AI Analysis: Identifies areas needing most support          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: DEEP DESIRES (What Matters Most)                    │
├─────────────────────────────────────────────────────────────┤
│ "If Resurgo could help you achieve anything, what would it  │
│  be? Describe your ideal life in 6 months:"                 │
│                                                              │
│ [Large text area for free-form input]                       │
│                                                              │
│ AI Processing: NLP analysis to extract:                     │
│ - Core values (family, freedom, achievement, etc.)          │
│ - Goal categories (health, wealth, relationships, etc.)     │
│ - Motivation type (intrinsic vs. extrinsic)                 │
│ - Communication style preferences                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: LIFESTYLE MAPPING (Daily Rhythm Analysis)           │
├─────────────────────────────────────────────────────────────┤
│ • What time do you typically wake up?                       │
│ • When are you most energetic? Morning / Afternoon / Night  │
│ • How many hours can you dedicate to personal growth daily? │
│ • Do you prefer: Structured routines / Flexible approaches  │
│ • Current habits (good and bad) - quick checklist          │
│ • Biggest obstacles to consistency                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: HEALTH PROFILE (Baseline Data)                      │
├─────────────────────────────────────────────────────────────┤
│ Physical Stats:                                              │
│ • Height, Current Weight, Goal Weight (if applicable)       │
│ • Body measurements (optional but recommended)              │
│ • Activity level: Sedentary / Lightly Active / Very Active  │
│ • Dietary preferences/restrictions                          │
│                                                              │
│ Wellness Habits:                                             │
│ • Sleep hours (average)                                      │
│ • Water intake (current estimate)                           │
│ • Exercise frequency                                         │
│ • Stress level (1-10)                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: AI MASTER PLAN GENERATION                           │
├─────────────────────────────────────────────────────────────┤
│ [Loading animation: "Analyzing your responses..."]          │
│                                                              │
│ AI Multi-Model Pipeline in Action:                          │
│ ✓ Model 1: Extracting core needs and patterns              │
│ ✓ Model 2: Generating personalized goal framework          │
│ ✓ Model 3: Creating habit architecture                     │
│ ✓ Model 4: Building nutrition & fitness plan               │
│ ✓ Model 5: Optimizing for your lifestyle constraints       │
│                                                              │
│ "Your personalized plan is ready!"                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: PLAN REVIEW & CONFIRMATION                          │
├─────────────────────────────────────────────────────────────┤
│ "Here's what I've created for you:"                         │
│                                                              │
│ 📊 YOUR GOALS (5-7 smart goals based on your desires)       │
│ ✅ YOUR HABITS (3-5 keystone habits to start)               │
│ 🏋️ YOUR FITNESS PLAN (workout schedule if applicable)       │
│ 🍎 YOUR NUTRITION PLAN (macro targets, meal suggestions)    │
│ 🧘 YOUR WELLNESS ROUTINE (meditation, sleep optimization)   │
│ 📅 YOUR DAILY STRUCTURE (optimized for your rhythm)         │
│                                                              │
│ [Accept Plan] [Customize Further] [Start Over]              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: NOTIFICATION SETUP                                   │
├─────────────────────────────────────────────────────────────┤
│ "How should Resurgo support you throughout the day?"        │
│                                                              │
│ Enable push notifications? [Yes] [No]                       │
│ Connect Telegram for mobile alerts? [Connect] [Skip]        │
│ Email summaries? [Daily] [Weekly] [Never]                   │
│                                                              │
│ Reminder preferences:                                        │
│ • Morning motivation: [Time picker]                         │
│ • Habit reminders: [Customize per habit]                    │
│ • Evening review: [Time picker]                             │
│ • Quiet hours: [Start] to [End]                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: WELCOME TO YOUR NEW LIFE                            │
├─────────────────────────────────────────────────────────────┤
│ 🎉 Setup Complete!                                           │
│                                                              │
│ "Your personalized life operating system is now running.    │
│  Everything is configured and ready. Just show up daily,    │
│  and Resurgo will handle the rest."                         │
│                                                              │
│ Quick Start Guide:                                           │
│ ✓ Dashboard shows your daily plan                          │
│ ✓ AI checks in with you throughout the day                 │
│ ✓ Progress tracked automatically                           │
│ ✓ Plans adapt as you grow                                  │
│                                                              │
│ [Take Me to My Dashboard] [Watch Quick Tour]                │
└─────────────────────────────────────────────────────────────┘

TECHNICAL IMPLEMENTATION:

1. Create multi-step form component with:
   - Progress indicator (1/9, 2/9, etc.)
   - Smooth transitions between steps
   - Save progress (can exit and resume)
   - Back button functionality
   - Skip options for optional sections

2. AI Processing Pipeline:
   ```javascript
   async function processOnboarding(responses) {
     // Stage 1: Data extraction
     const userProfile = await extractUserProfile(responses);
     
     // Stage 2: Multi-model analysis (4-5 AI models)
     const insights = await deepAnalysis(userProfile);
     
     // Stage 3: Goal generation
     const goals = await generatePersonalizedGoals(insights);
     
     // Stage 4: Habit architecture
     const habits = await createHabitSystem(goals, userProfile);
     
     // Stage 5: Fitness plan (if applicable)
     const fitnessP = await buildFitnessPlan(userProfile, goals);
     
     // Stage 6: Nutrition plan
     const nutritionPlan = await calculateNutritionPlan(userProfile);
     
     // Stage 7: Daily structure optimization
     const schedule = await optimizeDailySchedule(
       userProfile, 
       habits, 
       fitnessP
     );
     
     // Stage 8: Synthesis & personalization
     return await synthesizeMasterPlan({
       goals, habits, fitnessP, nutritionPlan, schedule
     });
   }
Data Storage Structure:

JavaScript

userProfile = {
  personal: { name, age, timezone, lifePhase, identity },
  assessment: { healthScore, wellbeingScore, ... },
  desires: { freeFormText, extractedValues, goalCategories },
  lifestyle: { wakeTime, energyPeak, availability, ... },
  health: { height, weight, activityLevel, ... },
  preferences: { 
    notificationSettings,
    communicationStyle,
    motivationType 
  },
  aiGeneratedPlan: {
    goals: [...],
    habits: [...],
    fitness: {...},
    nutrition: {...},
    schedule: {...}
  },
  onboardingCompleted: true,
  onboardingDate: timestamp
}
Personalization Engine:

Store all onboarding data in user profile
Use as context for ALL future AI interactions
Continuously update profile based on behavior
Re-run analysis monthly to adapt plans
TESTING REQUIREMENTS:

Test with various user personas (student, professional, parent, etc.)
Ensure AI generates sensible plans for each archetype
Verify all paths through onboarding work
Test data persistence and resume functionality
Mobile responsiveness for entire flow
text


### 1.2 Fix All Broken Core Features
TASK: Identify and fix all non-functional features immediately

PRIORITY FIXES:

XP & Gamification System
CURRENT ISSUES:

XP not being added when tasks completed
No visible XP bar
Level calculation broken
Achievements not triggering
FIXES REQUIRED:

Debug XP award mechanism (check all trigger points)
Implement visible, animated XP bar component
Fix level calculation algorithm
Create achievement detection service
Add XP transaction logging for debugging
TEST CASES:
✓ Complete task → XP awarded → Bar updates → Database persists
✓ Level up → Celebration triggered → Benefits unlocked
✓ Achievement earned → Notification shown → Badge added to profile

Telegram Bot Webhook
CURRENT ISSUE: Webhook not functioning

COMPLETE IMPLEMENTATION:

JavaScript

// backend/routes/telegram.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// Set webhook (run once or via admin endpoint)
async function setupWebhook() {
  const webhookUrl = `${process.env.APP_URL}/api/telegram/webhook`;
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: WEBHOOK_SECRET,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: true
      })
    }
  );
  return response.json();
}

// Webhook endpoint
router.post('/webhook', async (req, res) => {
  // Verify secret token
  const receivedToken = req.headers['x-telegram-bot-api-secret-token'];
  if (receivedToken !== WEBHOOK_SECRET) {
    return res.status(403).send('Forbidden');
  }
  
  const update = req.body;
  
  try {
    await handleTelegramUpdate(update);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).send('Error processing update');
  }
});

async function handleTelegramUpdate(update) {
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    
    if (text.startsWith('/')) {
      await handleCommand(chatId, text);
    } else {
      await handleMessage(chatId, text);
    }
  }
}

async function handleCommand(chatId, command) {
  const commands = {
    '/start': handleStart,
    '/tasks': showTasks,
    '/habits': showHabits,
    '/stats': showStats,
    '/help': showHelp
  };
  
  const handler = commands[command.split(' ')[0]];
  if (handler) {
    await handler(chatId, command);
  }
}

async function sendMessage(chatId, text, options = {}) {
  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
        ...options
      })
    }
  );
}

module.exports = { router, setupWebhook };
DEPLOYMENT STEPS:

Add TELEGRAM_WEBHOOK_SECRET to .env (generate random string)
Deploy webhook endpoint
Run setupWebhook() once (via admin panel or script)
Verify webhook: GET https://api.telegram.org/bot<TOKEN>/getWebhookInfo
Test with /start command in Telegram
Landing Page Auto-Scroll Issue
FIX:

JavaScript

// Remove any useEffect with scrollIntoView or window.scrollTo
// Check for hash-based routing (#demo) causing scroll

useEffect(() => {
  // REMOVE THIS if it exists:
  // const demoSection = document.getElementById('demo');
  // demoSection?.scrollIntoView({ behavior: 'smooth' });
}, []);

// Instead, only scroll on explicit user action:
const scrollToDemo = () => {
  document.getElementById('demo')?.scrollIntoView({ 
    behavior: 'smooth' 
  });
};

// Use on button click only:
<button onClick={scrollToDemo}>See Demo</button>
Environment Variable Integration
AUDIT:

List ALL API keys in .env
Document purpose of each key
Verify each is being used in code
Check for duplicate or conflicting keys
Ensure server-side keys aren't exposed to client
CREATE: env-config-map.md

Markdown

# Environment Variables Configuration

## AI Services
- OPENAI_API_KEY → Multi-model pipeline (src/services/ai/openai.js)
- ANTHROPIC_API_KEY → Claude integration (src/services/ai/claude.js)
- GROQ_API_KEY → Fast inference (src/services/ai/groq.js)
[... list ALL]

## External APIs
- USDA_API_KEY → Nutrition data (src/services/nutrition.js)
- OPENWEATHER_API_KEY → Weather integration (src/services/weather.js)
[... complete list]

## Configuration
- APP_URL → Base URL for webhooks and redirects
- DATABASE_URL → MongoDB connection string
[... all config vars]
Documentation Cleanup
TASK: Review ALL .md files

FILES TO REVIEW:

README.md → Update with current features, setup instructions
FEATURES.md → Consolidate into main README or separate docs folder
TODO.md → Convert to GitHub Issues, delete file
CHANGELOG.md → Keep and maintain
API.md → Update with all current endpoints
[Any others found]
DELETE if:

Outdated and contradicts current implementation
Duplicate information
No longer relevant
CONSOLIDATE:

Move all docs to /docs folder
Create clear structure:
/docs
/user-guide
/developer
/api
/deployment
text


---

## PHASE 2: WIDGET REVOLUTION (Week 2-3)

### 2.1 World-Class Widget System
TASK: Research and create the best dashboard widgets in existence

RESEARCH PHASE:

Study these platforms for widget inspiration:

Notion - Flexible blocks and databases
Linear - Minimalist, functional design
Apple Health - Data visualization excellence
Superhuman - Speed and keyboard shortcuts
Raycast - Command palette and extensions
Arc Browser - Modern, customizable interface
Obsidian - Personal knowledge management
Cron Calendar - Beautifully designed productivity
Height - Project management aesthetics
Mercury - Financial dashboard design
WIDGET DESIGN PRINCIPLES:
✓ Information density without clutter
✓ Actionable (not just display data)
✓ Beautiful data visualization
✓ Responsive and fast
✓ Customizable size and position
✓ Consistent design language
✓ Accessible and keyboard-friendly

WIDGET LIBRARY:

┌─────────────────────────────────────────────────────────────┐
│ ESSENTIAL WIDGETS │
└─────────────────────────────────────────────────────────────┘

COMMAND CENTER (Large - 2x2 or full width)
┌──────────────────────────────────────────────────────────┐
│ ⚡ COMMAND CENTER [⚙️] [⤢] │
├──────────────────────────────────────────────────────────┤
│ │
│ 👤 Good morning, Alex 🔥 Day 47 │
│ "You're on track to make this your best month yet" │
│ │
│ ┌──────────────────────────────────────────────────┐ │
│ │ > Quick Actions_ │ │
│ │ │ │
│ │ ✓ Log breakfast 🏋️ Start workout │ │
│ │ 📝 Add task 🧘 Meditate now │ │
│ │ 💧 Log water 📊 View insights │ │
│ └──────────────────────────────────────────────────┘ │
│ │
│ Today's Focus: │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ 13/20 total actions │
│ │
│ ┌─────────────┬─────────────┬─────────────┐ │
│ │ TASKS │ HABITS │ WELLNESS │ │
│ │ 5/8 ✓ │ 3/5 ✓ │ 82/100 │ │
│ └─────────────┴─────────────┴─────────────┘ │
│ │
│ 🎯 Active Goals: 3 in progress │
│ 💪 Longest Streak: 47 days (current!) │
│ ⚡ XP Today: +185 → Level 23 [▓▓▓▓░] 450/650 │
│ │
│ Recent Activity: │
│ • 09:23 ✓ Completed "Morning Meditation" [+50 XP] │
│ • 10:15 📝 Added task "Finish presentation" │
│ • 11:30 💧 Logged water (6/8 glasses) │
│ │
└──────────────────────────────────────────────────────────┘

FEATURES:

Personalized greeting with user name and streak
AI-generated motivational message (changes daily)
Quick action buttons for common tasks
Real-time progress visualization
Recent activity feed with timestamps
XP and level progress
Keyboard shortcuts for all actions
Customizable quick actions
TERMINAL CLOCK (Small - 1x1)
┌──────────────────────────┐
│ ⏰ SYSTEM TIME │
├──────────────────────────┤
│ │
│ 14:23:45 │
│ Thursday, Jan 16 │
│ │
│ ☀️ Sunny 23°C │
│ └─ Perfect for a run │
│ │
│ 🌅 Sunrise: 07:12 │
│ 🌇 Sunset: 17:45 │
│ │
└──────────────────────────┘

FEATURES:

Live updating time (HH:MM:SS)
Pixelated sun/moon/cloud icon based on weather
Weather integration with contextual suggestion
Sunrise/sunset times
Terminal-style monospace font
Subtle animations (ticking seconds, weather transitions)
HYDRATION TRACKER (Medium - 1x1)
┌──────────────────────────┐
│ 💧 HYDRATION │
├──────────────────────────┤
│ │
│ [Animated │
│ Water │
│ Bottle │
│ Filling │
│ 6/8] │
│ │
│ 1.8L / 2.4L goal │
│ ▓▓▓▓▓▓▓▓░░ 75% │
│ │
│ [+250ml] [+500ml] [+1L] │
│ │
│ 💡 75% hydrated │
│ Next: in 45 min │
│ │
└──────────────────────────┘

FEATURES:

Pixelated water bottle visual (fills up)
Quick log buttons (250ml, 500ml, 1L)
Custom amount input
Progress percentage
Smart reminders based on activity and weather
Hydration status indicator
History graph (tap to expand)
NUTRITION DASHBOARD (Large - 2x1)
┌────────────────────────────────────────────────────────┐
│ 🍎 NUTRITION [History] [+] │
├────────────────────────────────────────────────────────┤
│ │
│ Daily Target: 2,200 cal | Consumed: 1,650 | Left: 550│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ 75% │
│ │
│ ┌──────────┬──────────┬──────────┬──────────┐ │
│ │ PROTEIN │ CARBS │ FATS │ FIBER │ │
│ │ 120g │ 180g │ 55g │ 28g │ │
│ │ ▓▓▓▓▓░ │ ▓▓▓▓▓▓▓░ │ ▓▓▓▓▓▓░ │ ▓▓▓▓▓▓▓▓ │ │
│ │ 80% │ 90% │ 85% │ 93% │ │
│ └──────────┴──────────┴──────────┴──────────┘ │
│ │
│ Today's Meals: │
│ 🌅 Breakfast (520 cal) - 08:30 │
│ Oatmeal, banana, protein shake │
│ 🌞 Lunch (680 cal) - 13:00 │
│ Chicken breast, rice, vegetables │
│ 🍎 Snack (150 cal) - 16:00 │
│ Apple, almonds │
│ 🌙 Dinner (planned, ~850 cal) │
│ → AI Suggestion: Salmon, quinoa, broccoli │
│ │
│ 💡 Insights: You're 20g short on protein. Add a │
│ protein-rich snack or increase dinner portion. │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Calorie progress with visual bar
Macro breakdown (protein, carbs, fats, fiber)
Individual macro progress bars
Meal log with timestamps
AI meal suggestions for remaining calories
Nutritional insights and recommendations
Quick add recent foods
Photo meal logging (AI food recognition)
Barcode scanner integration
TASK FLOW (Medium - 2x1)
┌────────────────────────────────────────────────────────┐
│ ✅ TASKS [All] [Today] [Week] │
├────────────────────────────────────────────────────────┤
│ │
│ ⚡ Due Today (5) Completed: 3/8 │
│ │
│ [ ] Review presentation draft 🔴 High │
│ Due in 2 hours [→] [⋮] │
│ │
│ [✓] Morning workout 🟢 Done │
│ Completed 09:30 (+75 XP) │
│ │
│ [ ] Call dentist for appointment 🟡 Medium │
│ Due today [→] [⋮] │
│ │
│ [ ] Meal prep for tomorrow 🟡 Medium │
│ Due tonight [→] [⋮] │
│ │
│ [✓] Read 20 pages 🟢 Done │
│ Completed 22:15 (+25 XP) │
│ │
│ 💡 AI Suggestion: Based on your energy patterns, │
│ tackle "Review presentation" now (your peak time) │
│ │
│ [+ Add Task] [AI Generate Tasks] │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Clean task list with checkboxes
Priority indicators (color-coded)
Due time/countdown
Completed tasks with XP earned
AI task suggestions based on:
Time of day
Energy levels
Calendar
Goal alignment
Quick actions (reschedule, edit, delete)
Drag and drop reordering
Keyboard shortcuts (j/k navigation, x to check)
Filter by time range
HABIT TRACKER (Medium - 1x2)
┌──────────────────────────┐
│ 🎯 HABITS [Week][▼] │
├──────────────────────────┤
│ │
│ 🧘 Meditate 10min │
│ M T W T F S S │
│ ✓ ✓ ✓ ✓ · · · │
│ 🔥 47 day streak │
│ │
│ 📚 Read 20 pages │
│ M T W T F S S │
│ ✓ ✓ ✓ ✓ · · · │
│ 🔥 32 day streak │
│ │
│ 💪 Workout │
│ M T W T F S S │
│ ✓ · ✓ ✓ · · · │
│ ⚡ 3 this week │
│ │
│ 💧 8 glasses water │
│ ▓▓▓▓▓▓░░ 6/8 │
│ [+ Log Glass] │
│ │
│ 🌙 Sleep 8 hours │
│ Last: 7.5h (⚠️ -30min) │
│ [Log Sleep] │
│ │
│ ────────────── │
│ │
│ 💡 Perfect week: 2/5 │
│ Keep it up! 🚀 │
│ │
│ [+ New Habit] │
│ │
└──────────────────────────┘

FEATURES:

Pixelated icons for each habit
Week view with checkmark grid
Streak counter with flame icon
Quick check-off functionality
Habit strength visualization
Current progress for quantity-based habits
Perfect week tracking
Expandable to month/year view
WELLNESS RADAR (Medium - 1x1)
┌──────────────────────────┐
│ 🌟 WELLNESS SCORE │
├──────────────────────────┤
│ │
│ [Radar Chart] │
│ Physical │
│ / \ │
│ Mental Spiritual │
│ \ / │
│ Social │
│ │
│ Overall: 82/100 ✨ │
│ │
│ Strengths: │
│ ✓ Physical (92) │
│ ✓ Spiritual (88) │
│ │
│ Needs Attention: │
│ ⚠️ Social (68) │
│ │
│ 💡 Suggestion: │
│ Schedule social time │
│ this weekend │
│ │
└──────────────────────────┘

FEATURES:

Interactive radar/spider chart
5-6 wellness dimensions
Overall wellness score
Strengths and weaknesses highlighted
AI suggestions for improvement
Click dimension for deep dive
Historical comparison (week over week)
XP & LEVEL (Small - 1x1)
┌──────────────────────────┐
│ ⚡ PROGRESSION │
├──────────────────────────┤
│ │
│ LEVEL 23 │
│ ✨ Achiever ✨ │
│ │
│ ▓▓▓▓▓▓▓▓░░░░ │
│ 450 / 650 XP │
│ │
│ Today: +185 XP 🎯 │
│ This Week: +1,240 XP │
│ │
│ Next Level Benefits: │
│ 🎨 Custom themes │
│ 📊 Advanced analytics │
│ │
│ Recent Achievements: │
│ 🏆 Week Warrior │
│ 🔥 Meditation Master │
│ │
└──────────────────────────┘

FEATURES:

Large level number display
Level title/badge
Animated XP progress bar
XP gained today and this week
Preview of next level benefits
Recent achievement badges
Subtle particle effects
Celebration animation on level up
GOAL TRACKER (Large - 2x1)
┌────────────────────────────────────────────────────────┐
│ 🎯 ACTIVE GOALS [All][+] │
├────────────────────────────────────────────────────────┤
│ │
│ 🏋️ Lose 10kg [On Track] ✓ │
│ ▓▓▓▓▓▓▓░░░░░░░░ 45% (4.5kg / 10kg) │
│ Started: Jan 1 | Target: Apr 1 (75 days left) │
│ Recent: -0.3kg this week 📉 Great progress! │
│ │
│ 📚 Read 24 books this year [Ahead] ✨ │
│ ▓▓▓▓░░░░░░░░░░░ 25% (6 / 24 books) │
│ Currently reading: "Atomic Habits" (60% done) │
│ At this pace: 28 books by Dec 31 🚀 │
│ │
│ 💰 Save $5,000 [Behind] ⚠️ │
│ ▓▓▓░░░░░░░░░░░░ 18% ($900 / $5,000) │
│ Need to save $585/month to reach goal │
│ 💡 Tip: Set up automatic transfer │
│ │
│ 🧘 Meditate 100 days straight [Crushing] 🔥 │
│ ▓▓▓▓▓▓▓▓▓░░░░░░ 47 / 100 days │
│ Current streak: 47 days 🔥 Don't break it! │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Multiple goals with individual progress
Status indicators (on track, ahead, behind)
Progress visualization with percentage
Time-based projections
Milestones and sub-goals
AI insights and recommendations
Celebration animations on milestones
Goal templates library
AI INSIGHTS (Medium - 2x1)
┌────────────────────────────────────────────────────────┐
│ 🤖 AI INSIGHTS [Refresh] [⋮] │
├────────────────────────────────────────────────────────┤
│ │
│ 💡 Pattern Detected: │
│ "You complete 60% more tasks on days when you │
│ meditate in the morning. Your meditation streak │
│ is boosting your productivity significantly." │
│ │
│ ────────────────────────────────────────────────── │
│ │
│ 📊 This Week's Trends: │
│ ✓ Sleep quality: ↗️ +12% (great!) │
│ ⚠️ Water intake: ↘️ -8% (needs attention) │
│ ✓ Workout consistency: ↗️ 100% (perfect week!) │
│ │
│ ────────────────────────────────────────────────── │
│ │
│ 🎯 Personalized Recommendation: │
│ "Based on your goal to lose weight and current │
│ macro balance, try adding more protein to breakfast. │
│ Suggestion: Add 2 eggs or a protein shake." │
│ │
│ ────────────────────────────────────────────────── │
│ │
│ 🌟 Momentum Check: │
│ You're on a 47-day streak and building real habits. │
│ This is when transformation happens. Keep going! 💪 │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

AI-detected patterns and correlations
Trend analysis with visual indicators
Personalized recommendations
Motivational insights
Refresh for new insights
Based on user's complete activity data
Natural language, conversational tone
VISION BOARD PREVIEW (Medium - 1x1)
┌──────────────────────────┐
│ ✨ VISION BOARD │
├──────────────────────────┤
│ │
│ [Mini Vision Board │
│ Collage Preview] │
│ │
│ Your Dreams: │
│ • Beach house │
│ • Fit & healthy │
│ • Financial freedom │
│ │
│ [Open Full Board] │
│ │
│ 💡 Daily Affirmation: │
│ "I am becoming the │
│ best version of │
│ myself every day." │
│ │
└──────────────────────────┘

STREAK CALENDAR (Medium - 1x1)
┌──────────────────────────┐
│ 🔥 STREAK CALENDAR │
├──────────────────────────┤
│ │
│ January 2025 │
│ S M T W T F S │
│ 1 2 3 4 5 │
│ 6 7 8 9 10 11 12 │
│ 13 14 15 16 17 18 19 │
│ ✓ ✓ ✓ ✓ · · · │
│ │
│ Perfect Days: 16/31 │
│ Current Streak: 47 🔥 │
│ Longest: 47 days │
│ │
│ 💡 You've never been │
│ more consistent! │
│ │
└──────────────────────────┘

QUICK STATS (Small - 1x1)
┌──────────────────────────┐
│ 📊 QUICK STATS │
├──────────────────────────┤
│ │
│ This Week: │
│ ✅ 28/35 tasks │
│ 🎯 5/5 habits │
│ 🏋️ 4/4 workouts │
│ 📚 140 pages read │
│ 💧 55/56 glasses │
│ │
│ Overall: 96% 🌟 │
│ │
│ Best Week Yet! 🎉 │
│ │
└──────────────────────────┘

WIDGET CUSTOMIZATION SYSTEM:

┌────────────────────────────────────────────────────────┐
│ Widget Management Panel (Gear icon on each widget) │
├────────────────────────────────────────────────────────┤
│ │
│ ⚙️ Widget Settings: COMMAND CENTER │
│ │
│ Size: [Small] [Medium] [●Large] [Full Width] │
│ Position: [↑] [↓] [←] [→] │
│ Refresh: [●30s] [1min] [5min] [Manual] │
│ │
│ Visibility: │
│ [✓] Show greeting │
│ [✓] Show quick actions │
│ [✓] Show activity feed │
│ [ ] Show AI insights │
│ │
│ Quick Actions (select up to 6): │
│ [✓] Log breakfast [✓] Start workout │
│ [✓] Add task [✓] Meditate now │
│ [✓] Log water [✓] View insights │
│ [ ] Add habit [ ] Check calendar │
│ │
│ [Save] [Reset to Default] [Remove Widget] │
│ │
└────────────────────────────────────────────────────────┘

IMPLEMENTATION DETAILS:

Widget Architecture:

JavaScript

// src/components/widgets/Widget.jsx
const Widget = ({ 
  type, 
  size, 
  config, 
  onConfigChange,
  onResize,
  onMove 
}) => {
  const WidgetComponent = WIDGET_MAP[type];
  
  return (
    <WidgetContainer 
      size={size}
      draggable
      resizable
      onDragEnd={onMove}
      onResizeEnd={onResize}
    >
      <WidgetHeader>
        <WidgetTitle>{config.title}</WidgetTitle>
        <WidgetActions>
          <IconButton onClick={() => onConfigChange()}>
            ⚙️
          </IconButton>
          <IconButton onClick={() => onResize('fullscreen')}>
            ⤢
          </IconButton>
        </WidgetActions>
      </WidgetHeader>
      
      <WidgetContent>
        <WidgetComponent config={config} />
      </WidgetContent>
    </WidgetContainer>
  );
};
Dashboard Layout System:

Use react-grid-layout for drag-and-drop
Persist layout to user preferences
Responsive breakpoints (mobile, tablet, desktop)
Default layouts for new users
Layout templates (Focus, Analytics, Wellness, etc.)
Data Refresh Strategy:

WebSocket for real-time updates
Polling fallback for older browsers
Per-widget refresh configuration
Smart batching of API calls
Optimistic UI updates
Mobile Optimization:

Simplified widget views on mobile
Swipeable widget carousel
Collapsible sections
Touch-friendly interactions
Reduced animation on low-power devices
text


---

## PHASE 3: PAGE-BY-PAGE PERFECTION (Week 3-4)

### 3.1 Comprehensive Page Audit & Enhancement
TASK: Systematically perfect every page in the application

METHODOLOGY: For each page, analyze and enhance:

Purpose and user value
Information architecture
Visual design and consistency
Functionality and features
Performance and loading
Mobile responsiveness
Accessibility
User flow to/from this page
─────────────────────────────────────────────────────────────

PAGE 1: LANDING PAGE (/landing or /)

CURRENT STATE ANALYSIS:

First impression for new users
Should convey value proposition clearly
Convert visitors to signups
ENHANCEMENTS REQUIRED:

Hero Section:
┌────────────────────────────────────────────────────────┐
│ │
│ 🎯 RESURGO.LIFE │
│ Your Life, Simplified & Amplified │
│ │
│ "Set it up once, let it work for you forever" │
│ │
│ Stop juggling apps. Stop manual tracking. Stop │
│ decision fatigue. Resurgo is your AI-powered life │
│ operating system that handles the complexity so you │
│ can focus on what truly matters. │
│ │
│ [Start Free → Takes 5 Minutes] │
│ [Watch 90-Second Demo] │
│ │
│ ✓ No credit card ✓ Setup in 5 min ✓ Genuinely free │
│ │
└────────────────────────────────────────────────────────┘

Value Proposition (3-Column):
┌─────────────┬─────────────┬─────────────┐
│ 🧠 AI That │ 📊 Everything│ 🎯 Focus On │
│ Understands │ Integrated │ What Matters│
│ You │ │ │
├─────────────┼─────────────┼─────────────┤
│ Deep │ Tasks, │ Resurgo │
│ onboarding │ habits, │ handles │
│ creates your│ fitness, │ tracking & │
│ personalized│ nutrition, │ planning. │
│ system in │ wellness - │ You handle │
│ 5 minutes │ all in one │ living. │
└─────────────┴─────────────┴─────────────┘

Problem/Solution Section:
"Tired of..."

Juggling 10 different apps for health, productivity, goals
Manually logging everything every day
Forgetting your habits and losing streaks
Not knowing if you're making real progress
Decision fatigue about what to do next
"Resurgo solves this by..."

One app for your entire life
AI that learns you and auto-plans your day
Smart reminders that actually help
Clear progress visualization
Always knowing your next move
Features Showcase (Animated Demos):

"5-Minute Setup" - Screen recording of onboarding
"AI Daily Planner" - Widget showing personalized daily plan
"Comprehensive Tracking" - Nutrition, fitness, habits unified
"Beautiful Insights" - Data visualizations and trends
"True Integration" - All features working together
Social Proof:

"1,247 people are already simplifying their lives with Resurgo"
Testimonial quotes (if available, or aspirational)
Trust indicators (privacy-focused, secure, no data selling)
Pricing (Simple):
"Genuinely Free. Forever.
We believe everyone deserves access to tools that help them grow.
Resurgo is free, no catches."

[Potential future: Premium tier for advanced features, but core always free]

Final CTA:
┌────────────────────────────────────────────┐
│ Ready to simplify your life? │
│ [Get Started - Free Forever] │
│ │
│ Or explore: │
│ [Features] [How It Works] [Demo Video] │
└────────────────────────────────────────────┘

DESIGN REQUIREMENTS:

Modern, clean, not cluttered
Subtle animations (fade-in on scroll, hover effects)
Fast loading (<2s LCP)
Mobile-first responsive design
Clear visual hierarchy
Consistent with app design language (but more polished)
Accessible (WCAG AA)
NO auto-scroll on page load
TECHNICAL:

Lazy load images and videos
Optimize hero image (WebP, compressed)
Preload critical assets
Smooth scroll behavior for anchor links
Analytics tracking for button clicks
A/B test different headlines (future)
─────────────────────────────────────────────────────────────

PAGE 2: DASHBOARD (/)

CURRENT STATE: Main hub after login
PURPOSE: Daily command center for all activities

ENHANCEMENTS:

Layout Structure:
┌────────────────────────────────────────────────────────┐
│ HEADER: Logo, User Menu, Notifications, Settings │
├────────────────────────────────────────────────────────┤
│ GREETING: "Good morning, Alex - Day 47 🔥" │
├────────────────────────────────────────────────────────┤
│ │
│ [Widget Grid - Customizable via drag & drop] │
│ │
│ ┌──────────┬──────────┬──────────┐ │
│ │ Command │ Clock │ Hydration│ │
│ │ Center │ │ │ │
│ │ (2x2) │ (1x1) │ (1x1) │ │
│ └──────────┴──────────┴──────────┘ │
│ │
│ ┌──────────┬──────────────────────┐ │
│ │ Task │ Nutrition Dashboard │ │
│ │ Flow │ (2x1) │ │
│ │ (2x1) │ │ │
│ └──────────┴──────────────────────┘ │
│ │
│ ┌──────────┬──────────┬──────────┐ │
│ │ Habits │ Wellness │ XP & │ │
│ │ (1x2) │ Radar │ Level │ │
│ │ │ (1x1) │ (1x1) │ │
│ └──────────┴──────────┴──────────┘ │
│ │
│ [+ Add Widget] [Customize Layout] [Reset to Default] │
│ │
└────────────────────────────────────────────────────────┘

KEY FEATURES:

Personalized greeting with AI-generated daily message
Drag-and-drop widget arrangement
Size presets (1x1, 1x2, 2x1, 2x2, full-width)
Save layout to user preferences
Quick actions accessible from command center widget
Real-time data updates (WebSocket or polling)
Keyboard shortcuts (Cmd+K for command palette)
Performance: <1s load time for dashboard
MOBILE VIEW:

Single column widget stack
Swipeable cards
Collapsible widgets
Bottom navigation bar for quick access
Optimized for thumb navigation
─────────────────────────────────────────────────────────────

PAGE 3: TASKS (/tasks)

PURPOSE: Comprehensive task management

LAYOUT:
┌────────────────────────────────────────────────────────┐
│ TASKS [Views: List|Board|Cal]│
├────────────────────────────────────────────────────────┤
│ │
│ [+ Add Task] [AI Generate Tasks] [Filters ▼] │
│ │
│ ┌──────────┬──────────┬──────────┬──────────┐ │
│ │ INBOX │ TODAY │ UPCOMING │COMPLETED │ │
│ │ (23) │ (8) │ (15) │ (147) │ │
│ └──────────┴──────────┴──────────┴──────────┘ │
│ │
│ TODAY (8 tasks) [Sort: Priority ▼]│
│ ─────────────────────────────────────────────────── │
│ │
│ 🔴 HIGH PRIORITY (2) │
│ [ ] Review presentation draft │
│ Due in 2 hours | Project: Work │
│ [Edit] [Reschedule] [Delete] │
│ │
│ [ ] Submit expense report │
│ Due 5:00 PM | @finance │
│ [Edit] [Reschedule] [Delete] │
│ │
│ 🟡 MEDIUM PRIORITY (4) │
│ [ ] Call dentist │
│ [ ] Grocery shopping │
│ [ ] Email John about meeting │
│ [ ] Update project timeline │
│ │
│ 🟢 LOW PRIORITY (2) │
│ [ ] Research vacation destinations │
│ [ ] Organize digital files │
│ │
│ 💡 AI SUGGESTION: │
│ Based on your calendar, you have 2 hours free this │
│ afternoon. Perfect time to tackle "Review │
│ presentation" and "Update project timeline" │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Multiple views (List, Kanban board, Calendar)
Quick add with natural language ("tomorrow 3pm call mom")
AI task generation based on goals
Priority levels (auto-suggested by AI)
Due dates with smart scheduling
Projects/categories/tags
Subtasks and checklists
Recurring tasks
Time estimates
Drag and drop reordering
Bulk actions
Keyboard shortcuts (j/k navigate, x check, e edit)
Search and filters (by project, tag, date, priority)
Integration with calendar
Completion animations (+XP popup)
AI ENHANCEMENTS:

Suggest tasks based on goals
Auto-prioritize based on deadlines and importance
Optimal scheduling recommendations
Deadline prediction for projects
Pattern recognition (tasks you often create)
MOBILE:

Simplified list view
Swipe to complete
Bottom sheet for quick add
Voice input for task creation
─────────────────────────────────────────────────────────────

PAGE 4: HABITS (/habits)

PURPOSE: Build and track keystone habits

LAYOUT:
┌────────────────────────────────────────────────────────┐
│ HABITS [+ Add Habit] │
├────────────────────────────────────────────────────────┤
│ │
│ Active Habits: 5 | Perfect Days This Month: 16/31 │
│ │
│ 🧘 Morning Meditation (10 minutes) │
│ ┌────────────────────────────────────────────────┐ │
│ │ M T W T F S S | M T W T F S S │ │
│ │ ✓ ✓ ✓ ✓ ✓ ✓ ✓ | ✓ ✓ ✓ ✓ · · · │ │
│ │ │ │
│ │ 🔥 47-day streak | Best: 47 days | 100% this week│ │
│ │ │ │
│ │ [✓ Check In] [View History] [Edit] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 📚 Read 20 Pages │
│ ┌────────────────────────────────────────────────┐ │
│ │ Week view: ✓ ✓ ✓ ✓ · · · │ │
│ │ 🔥 32-day streak | Currently: "Atomic Habits" │ │
│ │ [✓ Check In] [Log Pages] [Edit] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 💪 Workout (4x per week) │
│ ┌────────────────────────────────────────────────┐ │
│ │ This week: ✓ · ✓ ✓ · · · (3/4) │ │
│ │ On track! 1 more workout to hit weekly goal │ │
│ │ [✓ Log Workout] [View Details] [Edit] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 💧 Drink 8 Glasses of Water │
│ ┌────────────────────────────────────────────────┐ │
│ │ Today: ▓▓▓▓▓▓░░ 6/8 glasses (75%) │ │
│ │ [+ 250ml] [+ 500ml] [+ 1L] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 🌙 Sleep 8 Hours │
│ ┌────────────────────────────────────────────────┐ │
│ │ Last night: 7.5 hours (⚠️ 30 min short) │ │
│ │ Avg this week: 7.8 hours │ │
│ │ [Log Sleep] [View Trends] [Edit] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ ───────────────────────────────────────────────── │
│ │
│ 💡 HABIT INSIGHTS: │
│ • Your meditation streak is your longest ever! 🎉 │
│ • You've completed all habits 16 times this month │
│ • Tip: Pair "workout" with "morning" for better │
│ consistency (morning workouts = 90% completion) │
│ │
│ 📚 HABIT LIBRARY: │
│ Browse 100+ evidence-based habits: │
│ [Health] [Productivity] [Mindfulness] [Social] │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Visual streak calendar
Flexible habit types:
Binary (done/not done)
Quantity (e.g., 8 glasses, 20 pages)
Frequency (e.g., 4x per week)
Duration (e.g., 10 minutes)
Reminder scheduling
Habit stacking suggestions
Strength meter (based on consistency)
Historical data and trends
Habit notes/journal
Photo check-ins for visual habits
Habit templates library
AI habit suggestions based on goals
GAMIFICATION:

Streak flames 🔥
Perfect week badges
Habit strength levels (beginner → master)
Achievement unlocks (7-day, 30-day, 100-day, 365-day)
MOBILE:

Quick check-in from widget
Push notifications for reminders
Streaks visible in notification
─────────────────────────────────────────────────────────────

PAGE 5: GOALS (/goals)

PURPOSE: Long-term objective tracking and planning

LAYOUT:
┌────────────────────────────────────────────────────────┐
│ GOALS [Active] [Achieved] [All] │
├────────────────────────────────────────────────────────┤
│ │
│ [+ New Goal] [AI Suggest Goals] [Templates] │
│ │
│ 🏋️ HEALTH: Lose 10kg │
│ ┌────────────────────────────────────────────────┐ │
│ │ Progress: ▓▓▓▓▓▓▓░░░░░░░░ 45% (4.5kg / 10kg) │ │
│ │ │ │
│ │ Started: Jan 1, 2025 │ │
│ │ Target: Apr 1, 2025 (75 days left) │ │
│ │ Status: ✓ On Track │ │
│ │ │ │
│ │ Recent Progress: │ │
│ │ • This week: -0.3kg 📉 │ │
│ │ • This month: -1.8kg 📉 │ │
│ │ • Trend: Consistent, sustainable pace ✓ │ │
│ │ │ │
│ │ Connected Habits: │ │
│ │ • 💪 Workout 4x/week (100% this week) │ │
│ │ • 🥗 Track nutrition (daily streak: 47) │ │
│ │ │ │
│ │ Next Milestone: 5kg lost (0.5kg away!) │ │
│ │ │ │
│ │ [Update Progress] [View Details] [Edit] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 📚 LEARNING: Read 24 Books This Year │
│ ┌────────────────────────────────────────────────┐ │
│ │ Progress: ▓▓▓▓░░░░░░░░░░░ 25% (6 / 24 books) │ │
│ │ │ │
│ │ Currently Reading: │ │
│ │ 📖 "Atomic Habits" by James Clear (60% done) │ │
│ │ │ │
│ │ Books Completed: │ │
│ │ 1. "Deep Work" - Cal Newport │ │
│ │ 2. "Sapiens" - Yuval Noah Harari │ │
│ │ 3. "Can't Hurt Me" - David Goggins │ │
│ │ 4. "The Subtle Art..." - Mark Manson │ │
│ │ 5. "Mindset" - Carol Dweck │ │
│ │ 6. "Thinking, Fast and Slow" - Daniel Kahneman │ │
│ │ │ │
│ │ Projection: At current pace, you'll read 28 │ │
│ │ books this year! 🚀 Ahead of target! │ │
│ │ │ │
│ │ [Log Book] [Update Progress] [View All] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 💰 FINANCIAL: Save $5,000 for Emergency Fund │
│ ┌────────────────────────────────────────────────┐ │
│ │ Progress: ▓▓▓░░░░░░░░░░░░ 18% ($900 / $5,000) │ │
│ │ │ │
│ │ Status: ⚠️ Behind Schedule │ │
│ │ │ │
│ │ To reach goal by target date (Jun 30): │ │
│ │ • Need to save: $585/month │ │
│ │ • Current rate: $300/month │ │
│ │ • Gap: $285/month │ │
│ │ │ │
│ │ 💡 AI Suggestions: │ │
│ │ • Set up automatic transfer on payday │ │
│ │ • Review subscriptions for savings │ │
│ │ • Track daily expenses to identify cuts │ │
│ │ │ │
│ │ [Update Amount] [Adjust Target] [Get Tips] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 🧘 WELLNESS: Meditate 100 Days Straight │
│ ┌────────────────────────────────────────────────┐ │
│ │ Progress: ▓▓▓▓▓▓▓▓▓░░░░░░ 47 / 100 days │ │
│ │ │ │
│ │ Current Streak: 🔥 47 days │ │
│ │ Status: 🚀 Crushing It! │ │
│ │ │ │
│ │ Total Meditation Time: 7h 50min │ │
│ │ Average Session: 10 minutes │ │
│ │ │ │
│ │ Next Milestone: 50 days (3 days away!) │ │
│ │ │ │
│ │ 💡 Impact Observed: │ │
│ │ Since starting this streak, your: │ │
│ │ • Task completion rate: ↗️ +23% │ │
│ │ • Sleep quality: ↗️ +15% │ │
│ │ • Stress levels: ↘️ -30% │ │
│ │ │ │
│ │ [Check In] [View Journal] [Edit] [⋮] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ ───────────────────────────────────────────────── │
│ │
│ 🎯 GOAL TEMPLATES: │
│ [Lose Weight] [Build Muscle] [Save Money] │
│ [Read More] [Learn Language] [Start Business] │
│ [Run Marathon] [Quit Bad Habit] [Custom] │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Visual progress bars with percentages
Time-based tracking (start date, target date, time remaining)
Status indicators (on track, ahead, behind, at risk)
Milestones and sub-goals
Connected habits and tasks
AI projections and predictions
Impact tracking (how goal affects other areas)
Goal journal/notes
Photo progress (for physical goals)
Celebration on achievement
Goal templates for quick setup
SMART goal framework guidance
AI ENHANCEMENTS:

Suggest realistic timelines
Identify dependencies between goals
Detect conflicting goals
Recommend adjustments when behind
Celebrate wins and provide motivation
MOBILE:

Simplified cards
Quick progress updates
Photo uploads for visual goals
─────────────────────────────────────────────────────────────

PAGE 6: FITNESS (/fitness)

PURPOSE: Comprehensive workout tracking and planning

LAYOUT:
┌────────────────────────────────────────────────────────┐
│ FITNESS [Workouts] [Progress] [Plan]│
├────────────────────────────────────────────────────────┤
│ │
│ [+ Log Workout] [Start AI Workout] [Library] │
│ │
│ 📊 THIS WEEK'S SUMMARY │
│ ┌────────────────────────────────────────────────┐ │
│ │ Workouts: 4/4 ✓ Perfect Week! 🎉 │ │
│ │ Total Time: 4h 35min │ │
│ │ Calories Burned: ~1,850 kcal │ │
│ │ Volume: 12,450 kg lifted │ │
│ │ │ │
│ │ M: Upper Body (65min, 3,200kg) │ │
│ │ W: Lower Body (70min, 4,500kg) │ │
│ │ F: Upper Body (60min, 3,100kg) │ │
│ │ S: Lower Body (80min, 4,650kg) │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 🏋️ YOUR PROGRAM: Push/Pull/Legs (Intermediate) │
│ ┌────────────────────────────────────────────────┐ │
│ │ Next Workout: PUSH (Chest, Shoulders, Triceps)│ │
│ │ │ │
│ │ Exercises (8): │ │
│ │ 1. Bench Press: 4 sets x 8-10 reps │ │
│ │ Last: 80kg x 8, 8, 7, 6 → Increase weight? │ │
│ │ │ │
│ │ 2. Incline Dumbbell Press: 3 x 10-12 │ │
│ │ 3. Overhead Press: 4 x 8-10 │ │
│ │ 4. Lateral Raises: 3 x 12-15 │ │
│ │ 5. Tricep Dips: 3 x 10-12 │ │
│ │ 6. Cable Flyes: 3 x 12-15 │ │
│ │ 7. Overhead Tricep Extension: 3 x 12-15 │ │
│ │ 8. Face Pulls: 3 x 15-20 │ │
│ │ │ │
│ │ Estimated Time: 65-75 minutes │ │
│ │ │ │
│ │ [Start This Workout] [Modify] [Change Program] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 📈 PROGRESS TRACKING │
│ ┌────────────────────────────────────────────────┐ │
│ │ Bench Press (1RM): 100kg │ │
│ │ [Line graph showing progress over 3 months] │ │
│ │ +15kg since Dec 1 🚀 │ │
│ │ │ │
│ │ Squat (1RM): 120kg │ │
│ │ Deadlift (1RM): 140kg │ │
│ │ Overhead Press (1RM): 60kg │ │
│ │ │ │
│ │ [View All Exercises] [Set New PRs] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 📸 PROGRESS PHOTOS │
│ ┌────────────────────────────────────────────────┐ │
│ │ [Front] [Side] [Back] │ │
│ │ │ │
│ │ Latest: Jan 15, 2025 │ │
│ │ Compare with: [Dec 1] [3 months ago] [Start] │ │
│ │ │ │
│ │ AI Body Composition Analysis: │ │
│ │ • Muscle mass: ↗️ +2.3kg │ │
│ │ • Body fat: ↘️ -3.1% │ │
│ │ • Visual changes: More shoulder definition │ │
│ │ │ │
│ │ [Upload New Photo] [View Timeline] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 💡 AI COACH INSIGHTS: │
│ • Your bench press is progressing faster than usual. │
│ Consider deload week next week to prevent injury. │
│ • Sleep avg 7.5h - aim for 8h for optimal recovery. │
│ • Protein intake good, but add 20g post-workout. │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Workout program selection/customization
Exercise library with videos and instructions
Workout logging with rest timers
Progressive overload tracking
Personal records (PRs) tracking
Volume and intensity metrics
Progress photos with AI comparison
Body measurements tracking
AI workout generation based on:
Goals (strength, hypertrophy, endurance, weight loss)
Equipment available
Time available
Experience level
Previous performance
Deload week recommendations
Injury prevention tips
Integration with nutrition (recommended calories based on activity)
WORKOUT LOGGING FLOW:

Select/start workout
For each exercise:
View previous performance
Log sets, reps, weight
Rest timer between sets
Notes (e.g., "felt easy, increase weight next time")
Finish workout → Summary screen → +XP
MOBILE:

Optimized for gym use
Large buttons for sweaty fingers
Auto-lock prevention during workouts
Offline mode (sync when back online)
Quick logging interface
─────────────────────────────────────────────────────────────

PAGE 7: NUTRITION (/nutrition)

PURPOSE: Food tracking, meal planning, and nutritional optimization

[Content too long - see previous detailed nutrition widget for comprehensive features]

ADDITIONAL PAGE-SPECIFIC FEATURES:

Meal planner (weekly view)
Recipe library with nutritional info
Grocery list generator
Restaurant meal logging (database of common chain restaurant meals)
Macro/micro tracking with deficiency alerts
Water intake integration
Supplement tracker
AI meal suggestions based on:
Remaining macros for the day
Dietary preferences
Ingredients on hand
Time available for cooking
Budget constraints
Food journal with notes (how you felt after meals)
Progress photos correlation with diet
─────────────────────────────────────────────────────────────

PAGE 8: WELLNESS CENTER (/wellness)

PURPOSE: Holistic wellbeing hub - mental, emotional, spiritual health

LAYOUT:
┌────────────────────────────────────────────────────────┐
│ WELLNESS CENTER [Overview] │
├────────────────────────────────────────────────────────┤
│ │
│ 🌟 YOUR WELLNESS SCORE: 82/100 │
│ ┌────────────────────────────────────────────────┐ │
│ │ │ │
│ │ [Radar Chart - 6 Dimensions] │ │
│ │ │ │
│ │ Physical Health: 92/100 ✨ │ │
│ │ Mental Wellbeing: 85/100 ✓ │ │
│ │ Emotional Balance: 78/100 ⚠️ │ │
│ │ Spiritual Alignment: 88/100 ✓ │ │
│ │ Social Connection: 68/100 ⚠️ │ │
│ │ Purpose & Meaning: 90/100 ✨ │ │
│ │ │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 📊 WELLNESS PROGRAMS │
│ ┌────────────────────────────────────────────────┐ │
│ │ Active: 30-Day Stress Reduction Challenge │ │
│ │ Day 16/30 │ │
│ │ ▓▓▓▓▓▓▓▓░░░░░░░░ 53% │ │
│ │ │ │
│ │ Today's Practice: │ │
│ │ • 10-min guided meditation (morning) │ │
│ │ • Breathing exercise (3x today) │ │
│ │ • Gratitude journaling (evening) │ │
│ │ │ │
│ │ [View Program] [Today's Tasks] [Progress] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 🧘 MINDFULNESS & MEDITATION │
│ ┌────────────────────────────────────────────────┐ │
│ │ Total Sessions: 147 │ │
│ │ Total Time: 24h 30min │ │
│ │ Current Streak: 🔥 47 days │ │
│ │ │ │
│ │ [Start Session] │ │
│ │ Quick Meditations: │ │
│ │ • 5-min Breathing Exercise │ │
│ │ • 10-min Body Scan │ │
│ │ • 15-min Guided Meditation │ │
│ │ • 20-min Deep Relaxation │ │
│ │ │ │
│ │ [Browse Library] [My Favorites] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 😊 MOOD & EMOTIONS │
│ ┌────────────────────────────────────────────────┐ │
│ │ How are you feeling right now? │ │
│ │ 😊 Great 🙂 Good 😐 Okay 🙁 Down 😢 Rough │ │
│ │ │ │
│ │ This Week's Mood Trend: │ │
│ │ [Line graph with emoji points] │ │
│ │ Mostly positive! 🌟 │ │
│ │ │ │
│ │ Patterns Detected: │ │
│ │ • Better mood on days you meditate │ │
│ │ • Stress peaks on Mondays (work meetings) │ │
│ │ • Happiest after workouts │ │
│ │ │ │
│ │ [Log Mood] [Mood Journal] [View Insights] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 😴 SLEEP TRACKING │
│ ┌────────────────────────────────────────────────┐ │
│ │ Last Night: 7h 30min (⚠️ 30min short of goal) │ │
│ │ Quality: ⭐⭐⭐⭐☆ (4/5) │ │
│ │ │ │
│ │ This Week Average: 7h 48min │ │
│ │ Goal: 8h per night │ │
│ │ │ │
│ │ [Week view bar chart of sleep hours] │ │
│ │ │ │
│ │ Sleep Score: 85/100 │ │
│ │ • Duration: ✓ Mostly good │ │
│ │ • Consistency: ✓ Regular schedule │ │
│ │ • Quality: ✓ Deep sleep adequate │ │
│ │ │ │
│ │ 💡 Tips for Better Sleep: │ │
│ │ • Bedtime: 10:30 PM (in 2h 15min) │ │
│ │ • Start wind-down routine at 10:00 PM │ │
│ │ • Avoid screens after 9:30 PM │ │
│ │ │ │
│ │ [Log Sleep] [View Trends] [Sleep Tips] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 📝 JOURNALING │
│ ┌────────────────────────────────────────────────┐ │
│ │ Journaling Streak: 🔥 23 days │ │
│ │ │ │
│ │ Today's Prompts: │ │
│ │ • What am I grateful for today? │ │
│ │ • What challenged me and what did I learn? │ │
│ │ • What's one thing I'm proud of? │ │
│ │ │ │
│ │ [Start Entry] [View Past Entries] │ │
│ │ │ │
│ │ Quick Gratitude: │ │
│ │ [Type 3 things you're grateful for...] │ │
│ │ │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 🌱 PERSONAL GROWTH RESOURCES │
│ ┌────────────────────────────────────────────────┐ │
│ │ Curated Content: │ │
│ │ • 📚 Recommended Reading (psychology, growth) │ │
│ │ • 🎧 Podcast Episodes (mindfulness, science) │ │
│ │ • 📹 Video Courses (meditation, therapy) │ │
│ │ • 📝 Articles (mental health, wellbeing) │ │
│ │ │ │
│ │ [Browse Library] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ 💡 WELLNESS INSIGHTS (AI-Generated) │
│ "Your wellness score has improved 8 points since last │
│ month! The biggest driver is your consistent │
│ meditation practice and improved sleep quality. │
│ Consider focusing on social connections this month │
│ - schedule time with friends/family." │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Multi-dimensional wellness assessment
Guided wellness programs (7-day, 30-day, 90-day challenges)
Meditation timer and library
Mood tracking with pattern detection
Sleep quality monitoring
Gratitude and reflective journaling
Breathing exercises
Stress management techniques
Emotional regulation tools
Curated content library
AI wellness coaching
Integration with all other health metrics
PROGRAMS AVAILABLE:

Stress Reduction (30 days)
Better Sleep (21 days)
Gratitude Practice (7 days)
Mindfulness Foundation (30 days)
Emotional Intelligence (60 days)
Purpose Discovery (90 days)
─────────────────────────────────────────────────────────────

PAGE 9: VISION BOARD (/vision-board)

PURPOSE: Visual manifestation and goal visualization tool

[Detailed in widget section - expand to full page experience]

ADDITIONAL FEATURES:

Multiple boards (personal, career, health, relationships)
AI image generation for goals
Drag-and-drop board builder
Text overlays and quotes
Daily affirmation generator tied to board
Mobile wallpaper export
Print-ready downloads
Progress overlays (current state vs. vision)
Sharing (optional, with privacy controls)
─────────────────────────────────────────────────────────────

PAGE 10: PROFILE & SETTINGS (/profile)

PURPOSE: User account management and customization

LAYOUT:
┌────────────────────────────────────────────────────────┐
│ PROFILE [Edit] [Settings]│
├────────────────────────────────────────────────────────┤
│ │
│ ┌──────────────┬────────────────────────────────────┐│
│ │ │ ALEX JOHNSON ││
│ │ [Avatar] │ @alexj • Level 23 Achiever ││
│ │ │ Member since: Jan 1, 2025 ││
│ │ [Change] │ 🔥 47-day streak ││
│ └──────────────┴────────────────────────────────────┘│
│ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [3D/2D Body Model Visualization] │ │
│ │ │ │
│ │ [Anatomical figure] │ │
│ │ │ │
│ │ Height: 175 cm (5'9") │ │
│ │ Weight: 75.5 kg (current) / 70 kg (goal) │ │
│ │ BMI: 24.7 (Normal range) │ │
│ │ │ │
│ │ Measurements: │ │
│ │ • Chest: 98 cm │ │
│ │ • Waist: 82 cm │ │
│ │ • Hips: 95 cm │ │
│ │ • Arms: 34 cm │ │
│ │ • Thighs: 56 cm │ │
│ │ │ │
│ │ [Update Measurements] [View Progress] │ │
│ └─────────────────────────────────────────────────┘ │
│ │
│ 📊 STATS & ACHIEVEMENTS │
│ ┌────────────────────────────────────────────────┐ │
│ │ Total XP: 14,850 │ │
│ │ Level: 23 (Achiever) │ │
│ │ Achievements: 47/150 🏆 │ │
│ │ Perfect Days: 72 │ │
│ │ Longest Streak: 47 days (current!) │ │
│ │ │ │
│ │ [View All Achievements] │ │
│ └────────────────────────────────────────────────┘ │
│ │
│ ⚙️ SETTINGS │
│ ┌────────────────────────────────────────────────┐ │
│ │ Account: │ │
│ │ • Email: alex@example.com [Change] │ │
│ │ • Password: ******** [Change] │ │
│ │ • 2FA: ○ Disabled [Enable] │ │
│ │ │ │
│ │ Notifications: │ │
│ │ • Push Notifications: ✓ Enabled │ │
│ │ • Telegram Bot: ✓ Connected │ │
│ │ • Email Summaries: Weekly │ │
│ │ • Quiet Hours: 10:00 PM - 7:00 AM │ │
│ │ [Manage Notifications] │ │
│ │ │ │
│ │ Preferences: │ │
│ │ • Theme: Dark (Auto, Light, Dark) │ │
│ │ • Start of Week: Monday │ │
│ │ • Date Format: DD/MM/YYYY │ │
│ │ • Time Format: 24-hour │ │
│ │ • Units: Metric │ │
│ │ │ │
│ │ Privacy: │ │
│ │ • Profile Visibility: Private │ │
│ │ • Data Sharing: Disabled │ │
│ │ [Privacy Settings] │ │
│ │ │ │
│ │ Data: │ │
│ │ • [Export All Data] │ │
│ │ • [Delete Account] │ │
│ │ │ │
│ └────────────────────────────────────────────────┘ │
│ │
└────────────────────────────────────────────────────────┘

FEATURES:

Avatar upload and customization
User stats showcase
3D/2D body model with measurements
Achievement gallery
Comprehensive settings:
Account security (password, 2FA)
Notification preferences (per type, quiet hours)
UI preferences (theme, units, formats)
Privacy controls
Data export (GDPR compliance)
Account deletion
BODY MODEL:

Interactive 3D model (rotatable) OR detailed 2D diagram
Click body parts for specific measurements
Measurement history graph
Photo upload for visual progress
AI posture analysis (if photo provided)
─────────────────────────────────────────────────────────────

PAGE 11: INSIGHTS & ANALYTICS (/insights)

PURPOSE: Deep data analysis and pattern recognition

FEATURES:

Overview dashboard with key metrics
Time series graphs for all trackable data
Correlation analysis (e.g., sleep vs. productivity)
Pattern detection (AI-identified trends)
Custom date ranges
Comparison views (week-over-week, month-over-month, year-over-year)
Export reports
Predictive analytics (trend projections)
SECTIONS:

Overall Summary
Productivity Analysis (tasks, time management)
Health Metrics (fitness, nutrition, sleep)
Habit Strength Over Time
Goal Progress Trajectory
Wellness Trends
Custom Reports
─────────────────────────────────────────────────────────────

PAGE 12: DOCS & HELP (/docs, /help)

[Detailed in separate section below]

─────────────────────────────────────────────────────────────

GLOBAL UI/UX ENHANCEMENTS ACROSS ALL PAGES:

Consistent Navigation

Persistent sidebar (desktop) or bottom bar (mobile)
Breadcrumbs for deep pages
Global search (Cmd+K command palette)
Quick action shortcuts
Loading States

Skeleton screens (not spinners)
Optimistic UI updates
Progressive enhancement
Offline indicators
Error Handling

Friendly error messages
Suggested actions
Retry mechanisms
Support contact
Accessibility

WCAG 2.1 AA compliance
Keyboard navigation
Screen reader optimization
Focus indicators
Color contrast verification
Performance

Route-based code splitting
Lazy loading
Image optimization
Caching strategies
< 2s initial load
< 1s page transitions
Responsiveness

Mobile-first design
Fluid layouts
Touch-friendly (44x44px minimum)
Responsive images
Adaptive content (hide/show based on screen size)
Consistency

Design system components
Consistent spacing (8px grid)
Typography scale
Color palette
Icon set (pixelated style)
Animation library
Feedback

Action confirmations
Success messages
Inline validation
Toast notifications
Progress indicators
text


---

## PHASE 4: BRANDING & VISUAL IDENTITY (Week 4-5)

### 4.1 Logo Consistency & Refinement
TASK: Establish and enforce consistent branding across all touchpoints

LOGO SPECIFICATIONS:

PRIMARY LOGO:
┌──────────────────────────────┐
│ │
│ 🔶 RESURGO │
│ ↗️ │
│ │
└──────────────────────────────┘

Components:

Icon: Orange pixelated arrow pointing up-right (↗️)
Wordmark: "RESURGO" in bold, modern sans-serif (Orbitron/Rajdhani)
Color: Orange (#FF6B35 or similar energetic orange)
Style: Clean, modern, slightly futuristic
VARIATIONS NEEDED:

Full logo (icon + wordmark) - for headers, landing page
Icon only - for favicon, app icon, small spaces
Wordmark only - for narrow spaces
Monochrome - for print, low-color scenarios
Reversed - for dark backgrounds
USAGE GUIDELINES:

Header/Navigation:

Desktop: Full logo (icon + wordmark) in top-left
Mobile: Icon only in top-left, wordmark optional
App Icon (PWA):

Use icon only version
Ensure contrast against common home screen backgrounds
Create all required sizes (192x192, 512x512, etc.)
Favicon:

Simplified icon version
Multiple sizes for different devices
Loading Screens:

Animated version of icon (arrow drawing itself)
ERROR: Remove "by webmess" completely

Search codebase for ANY instance of "webmess" or "by webmess"
Remove from:
Footer
About page
Login/signup pages
Metadata
Comments
Replace with just "RESURGO" or nothing
IMPLEMENTATION CHECKLIST:
□ Create logo SVG file (vector, scalable)
□ Generate PNG exports (multiple sizes)
□ Create favicon.ico and favicon.png
□ Generate PWA icons (manifest.json icons array)
□ Update all <img> tags referencing logo
□ Update all CSS background-image logo references
□ Update meta tags (og:image with logo)
□ Create logo component for consistent rendering

React

<Logo variant="full" size="md" color="primary" />
□ Remove "by webmess" from all locations
□ Test logo visibility on all backgrounds (light, dark, colored)

BRANDING CONSISTENCY:

Logo should appear identical everywhere
Use React component, not copy-pasted code
Centralize logo files in /public/assets/brand/
Document logo usage in brand guidelines
text


### 4.2 Pixelated Icon System
TASK: Create comprehensive pixelated icon library for terminal aesthetic

ICON DESIGN PRINCIPLES:

16x16 or 32x32 pixel grid
Limited color palette (orange, cyan, white, black)
Retro-futuristic style
Instantly recognizable
Consistent line weight
Subtle, not overwhelming
ICON LIBRARY NEEDED:

NAVIGATION:

Dashboard: pixelated gauge/dial
Tasks: pixelated checkbox list
Habits: pixelated calendar with check
Goals: pixelated target/bullseye
Fitness: pixelated dumbbell
Nutrition: pixelated apple
Wellness: pixelated meditation pose/lotus
Vision Board: pixelated picture frame
Profile: pixelated user avatar
Settings: pixelated gear
WEATHER:

☀️ Sunny: pixelated sun (yellow/orange)
⛅ Partly cloudy: pixelated sun with cloud
☁️ Cloudy: pixelated cloud (gray)
🌧️ Rainy: pixelated cloud with rain drops
⛈️ Storm: pixelated cloud with lightning
🌙 Night: pixelated moon and stars
❄️ Snow: pixelated snowflake
HABITS & ACTIONS:

💧 Water: pixelated water drop or glass
🏋️ Workout: pixelated person lifting or dumbbell
📚 Reading: pixelated book
🧘 Meditation: pixelated person meditating
🥗 Food: pixelated apple/carrot
😴 Sleep: pixelated Zzz or moon
✓ Check: pixelated checkmark
Add: pixelated plus sign
🔥 Streak: pixelated flame
GAMIFICATION:

⚡ XP: pixelated lightning bolt
🏆 Achievement: pixelated trophy
🎯 Goal: pixelated target
⭐ Star: pixelated star
💎 Reward: pixelated gem/diamond
UI ELEMENTS:

↑↓←→ Arrows: pixelated directional arrows
⚙️ Settings: pixelated gear
🔔 Notifications: pixelated bell
🔍 Search: pixelated magnifying glass
ℹ️ Info: pixelated i in circle
⚠️ Warning: pixelated exclamation in triangle
✕ Close: pixelated X
☰ Menu: pixelated hamburger
STATS:

📊 Chart: pixelated bar graph
📈 Trending up: pixelated line graph ascending
📉 Trending down: pixelated line graph descending
🎚️ Level: pixelated progress bar
IMPLEMENTATION:

Option 1: SVG Sprite Sheet

HTML

<!-- icon-sprite.svg -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
  <symbol id="icon-sun" viewBox="0 0 32 32">
    <!-- Pixelated sun path data -->
  </symbol>
  <symbol id="icon-water" viewBox="0 0 32 32">
    <!-- Pixelated water drop path data -->
  </symbol>
  <!-- ... all icons ... -->
</svg>

<!-- Usage: -->
<svg class="icon icon-sun">
  <use href="#icon-sun"></use>
</svg>
Option 2: React Icon Component

React

// components/PixelIcon.jsx
const PixelIcon = ({ name, size = 24, color = 'currentColor' }) => {
  const icons = {
    sun: <path d="..." />,
    water: <path d="..." />,
    // ... all icons
  };
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32"
      fill={color}
      style={{ imageRendering: 'pixelated' }}
    >
      {icons[name]}
    </svg>
  );
};

// Usage:
<PixelIcon name="sun" size={32} color="#FF6B35" />
CSS FOR PIXEL-PERFECT RENDERING:

CSS

.pixel-icon {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
ICON CREATION PROCESS:

Use pixel art tool (Aseprite, Piskel, or code manually)
Export as SVG with pixel-perfect paths
Optimize SVG (remove unnecessary attributes)
Add to icon library
Document in style guide
ACCESSIBILITY:

All icons must have aria-label or title
Decorative icons: aria-hidden="true"
Interactive icons: proper button/link semantics
text


### 4.3 Terminal Aesthetic Enhancement
TASK: Refine and perfect the terminal/sci-fi theme across all interfaces

DESIGN ELEMENTS:

TYPOGRAPHY:
Headers: 'Orbitron' or 'Rajdhani' (geometric, futuristic)
Body: 'Inter' (clean, readable)
Code/Data: 'Fira Code' or 'JetBrains Mono' (monospace with ligatures)

Font Loading:

Subset fonts (latin only if applicable)
Use font-display: swap
Preload critical fonts
COLOR PALETTE (TERMINAL THEME):

CSS

:root {
  /* Background */
  --bg-primary: #0a0e27;      /* Deep space navy */
  --bg-secondary: #1a1f3a;    /* Lighter navy */
  --bg-tertiary: #2a2f4a;     /* Card backgrounds */
  
  /* Accent Colors */
  --accent-primary: #00d9ff;  /* Cyan */
  --accent-secondary: #b833ff; /* Purple */
  --accent-tertiary: #FF6B35; /* Orange (brand) */
  
  /* Status Colors */
  --success: #00ff88;         /* Neon green */
  --warning: #ff9500;         /* Orange */
  --error: #ff3366;           /* Red */
  --info: #00d9ff;            /* Cyan */
  
  /* Text */
  --text-primary: #e0e6ed;    /* Off-white */
  --text-secondary: #8892a6;  /* Gray */
  --text-tertiary: #5a6376;   /* Darker gray */
  
  /* Borders & Lines */
  --border-color: rgba(0, 217, 255, 0.2); /* Subtle cyan */
  --glow-color: rgba(0, 217, 255, 0.5);   /* Glow effect */
}
UI COMPONENTS STYLING:

Cards/Panels:

CSS

.terminal-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(0, 217, 255, 0.1); /* Subtle glow */
  backdrop-filter: blur(10px); /* Glassmorphism */
}

.terminal-card-header {
  border-bottom: 1px solid var(--border-color);
  font-family: 'Fira Code', monospace;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
}
Buttons:

CSS

.terminal-button {
  background: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: 10px 20px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.terminal-button:hover {
  background: var(--accent-primary);
  color: var(--bg-primary);
  box-shadow: 0 0 20px var(--glow-color);
}

.terminal-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(0, 217, 255, 0.3), 
    transparent
  );
  transition: left 0.5s;
}

.terminal-button:hover::before {
  left: 100%;
}
Inputs:

CSS

.terminal-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.terminal-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 10px var(--glow-color);
}

.terminal-input::placeholder {
  color: var(--text-tertiary);
  opacity: 0.5;
}
Progress Bars:

CSS

.terminal-progress {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  position: relative;
}

.terminal-progress-fill {
  background: linear-gradient(
    90deg,
    var(--accent-primary),
    var(--accent-secondary)
  );
  height: 100%;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px var(--glow-color);
  animation: progress-glow 2s ease-in-out infinite;
}

@keyframes progress-glow {
  0%, 100% { box-shadow: 0 0 10px var(--glow-color); }
  50% { box-shadow: 0 0 20px var(--glow-color); }
}
TERMINAL EFFECTS:

Scanline Effect (subtle):

CSS

.terminal-scanlines {
  position: relative;
}

.terminal-scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 3px
  );
  pointer-events: none;
  opacity: 0.3;
}
Typing Animation for Text:

CSS

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

.terminal-typing {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--accent-primary);
  animation: 
    typing 2s steps(30, end),
    blink 0.75s step-end infinite;
}
Glow on Hover:

CSS

.glow-on-hover {
  transition: all 0.3s ease;
}

.glow-on-hover:hover {
  text-shadow: 
    0 0 10px var(--accent-primary),
    0 0 20px var(--accent-primary),
    0 0 30px var(--accent-primary);
}
DIGITAL ART ELEMENTS:

Geometric Patterns:

Use SVG patterns for backgrounds
Circuit board motifs
Grid lines
Hexagonal patterns
Example:

React

<svg className="background-pattern">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,217,255,0.1)" strokeWidth="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
</svg>
ANIMATED BACKGROUNDS:

Particle System (subtle):

React

// Use library like react-particles or custom canvas
<Particles
  params={{
    particles: {
      number: { value: 50 },
      color: { value: "#00d9ff" },
      opacity: { value: 0.3 },
      size: { value: 2 },
      line_linked: {
        enable: true,
        color: "#00d9ff",
        opacity: 0.2
      },
      move: {
        speed: 1,
        out_mode: "bounce"
      }
    }
  }}
/>
LOADING ANIMATIONS:

Terminal Loading:

React

<div className="terminal-loader">
  <span>Loading</span>
  <span className="dots">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>
</div>

<style>
  .dots span {
    animation: blink 1.4s infinite both;
  }
  .dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
</style>
BALANCE: Digital but not overwhelming

Use terminal aesthetic for data displays and dashboards
Use cleaner design for content areas
Provide option to reduce effects (accessibility)
Test with users to ensure readability and usability
text


---

## PHASE 5: ENHANCED LANDING PAGE (Week 5)
TASK: Transform landing page into conversion-optimized marketing page

RESEARCH: Study top SaaS landing pages:

Linear (https://linear.app)
Notion (https://notion.so)
Superhuman (https://superhuman.com)
Arc Browser (https://arc.net)
Cal.com (https://cal.com)
Mercury (https://mercury.com)
Raycast (https://raycast.com)
ELEMENTS TO INCORPORATE:

Hero Section (Above the Fold)

Clear value proposition (one sentence)
Subheading explaining the "how"
Primary CTA (Start Free)
Secondary CTA (Watch Demo)
Trust indicators (no CC required, free forever, etc.)
Hero visual (animated product screenshot or demo)
Problem/Agitation Section

Relatable pain points
"Tired of..." format
Emotional connection
Solution Section

How Resurgo solves each problem
Feature highlights with icons
Benefits, not just features
Product Demo Section

Interactive demo or high-quality video
Walkthrough of key features
Before/after comparison
Features Showcase

3-6 key features with explanations
Visual demonstrations
Use cases
How It Works Section

3-4 step process
"Setup in 5 minutes" emphasis
Visual flow diagram
Benefits/Outcomes Section

What users achieve
Transformation, not just functionality
Real examples (if available)
Social Proof Section

Testimonials (if available, or aspirational)
Usage stats ("1,000+ people improving daily")
Trust badges (privacy-focused, secure, etc.)
Pricing Section (if applicable)

Clear, simple
"Free Forever" if truly free
Comparison table if tiers exist
FAQ Section

Address common objections
Build trust
Reduce friction
Final CTA Section

Strong call-to-action
Reiterate value
Remove any remaining objections
COPYWRITING PRINCIPLES:

Clarity over cleverness
Benefits over features
Active voice
Conversational tone
Unique vocabulary (not "uptime," "synergy," etc.)
Instead: "Always working for you," "Everything connected," etc.
DESIGN PRINCIPLES:

Generous whitespace
Visual hierarchy (F-pattern)
Scroll-triggered animations (subtle)
Fast loading (<2s)
Mobile-first responsive
Accessible (WCAG AA)
TECHNICAL IMPLEMENTATION:

Lazy load images
Optimize for Core Web Vitals
Preload critical assets
Use Intersection Observer for scroll animations
Analytics tracking (button clicks, scroll depth)
EXAMPLE COPY:

Hero:
"Your Life, Simplified & Amplified
Stop juggling apps. Stop manual tracking. Stop decision fatigue.
Resurgo is your AI-powered life operating system."

[Start Free - Takes 5 Minutes] [Watch Demo]

Problem:
"Tired of...
❌ Opening 10 different apps to manage your life
❌ Forgetting to log habits and losing streaks
❌ Not knowing if you're actually making progress
❌ Decision fatigue about what to do next"

Solution:
"Resurgo handles the complexity, you focus on living.
✓ One app for tasks, habits, fitness, nutrition, and wellness
✓ AI that learns you and auto-plans your day
✓ Smart tracking that feels effortless
✓ Clear progress so you always know where you stand"

How It Works:
"1. Tell us about yourself (5 minutes)
2. AI builds your personalized system
3. Live your life, Resurgo handles the rest
4. Watch yourself transform"

[Continue with each section...]

text


---

## PHASE 6: DOCUMENTATION & HELP SYSTEM (Week 6)

### 6.1 Comprehensive Documentation Structure
TASK: Create professional, helpful documentation system

DOCUMENTATION ARCHITECTURE:

/docs
/getting-started
- welcome.md (overview of Resurgo)
- quick-start.md (5-minute setup guide)
- first-steps.md (what to do after onboarding)
/features
- tasks.md (comprehensive task management guide)
- habits.md (habit building and tracking)
- goals.md (goal setting and achievement)
- fitness.md (workout tracking and planning)
- nutrition.md (food logging and meal planning)
- wellness.md (mental health and mindfulness)
- vision-board.md (creating and using vision boards)
- gamification.md (XP, levels, achievements)
/ai-system
- how-ai-works.md (overview of AI capabilities)
- personalization.md (how AI learns you)
- ai-features.md (specific AI-powered features)
- multi-model-pipeline.md (technical deep dive)
/integrations
- telegram-bot.md (setup and usage)
- notifications.md (push, telegram, email)
- api-services.md (all integrated APIs explained)
/data-privacy
- privacy-policy.md (GDPR-compliant)
- data-handling.md (what data, why, where)
- security.md (how data is protected)
- export-delete.md (user data rights)
/technical
- api-reference.md (if public API exists)
- architecture.md (system overview)
- performance.md (optimization details)
/troubleshooting
- common-issues.md (FAQ-style solutions)
- contact-support.md (how to get help)

DOCUMENTATION PAGE DESIGN:

┌────────────────────────────────────────────────────────┐
│ SIDEBAR (Left) CONTENT (Center) TOC (Right)│
├────────────────────────────────────────────────────────┤
│ 📚 Documentation │
│ │
│ Getting Started # How AI Works in Resurgo │
│ • Welcome │
│ • Quick Start Resurgo uses multiple AI... │
│ • First Steps │
│ ## Multi-Model Pipeline │
│ Features │
│ • Tasks Complex tasks go through... │
│ • Habits │
│ • Goals [Diagram showing pipeline] │
│ [... all pages] │
│ ## Personalization │
│ [Search box] │
│ The AI learns from... │
└────────────────────────────────────────────────────────┘

FEATURES:

Search Functionality

Full-text search across all docs
Instant results
Keyboard shortcut (/)
Table of Contents

Auto-generated from headings
Sticky sidebar
Smooth scroll to sections
Breadcrumbs

Clear navigation path
Click to go up levels
Code Blocks

Syntax highlighting
Copy button
Language labels
Interactive Examples

Embedded demos where applicable
Try-it-yourself sections
Versioning (future)

Version selector if major updates
Changelog links
Feedback

"Was this helpful?" on each page
Report issue link
Related Articles

"See also" suggestions
Next/Previous navigation
SPECIAL FEATURE: AI Instruction Export

┌────────────────────────────────────────────────────────┐
│ # How to Use Resurgo's AI Features │
│ │
│ [Content of the guide...] │
│ │
│ ─────────────────────────────────────────────────────│
│ │
│ 📋 Copy as AI Instructions │
│ │
│ [Button: Copy Markdown for AI] │
│ │
│ This will copy this page in a format optimized for │
│ AI assistants like ChatGPT, Claude, etc. Paste it │
│ into your AI chat to get help using this feature. │
│ │
└────────────────────────────────────────────────────────┘

Implementation:

React

<button onClick={() => copyMarkdownForAI(pageContent)}>
  📋 Copy Markdown for AI
</button>

function copyMarkdownForAI(content) {
  const aiOptimized = `
# Resurgo.Life Feature Guide

${content}

---

Instructions for AI:
- This is documentation for Resurgo.Life, a personal development app
- Help the user understand and use this feature
- Provide specific examples and tips
- Reference the documentation above in your responses
  `;
  
  navigator.clipboard.writeText(aiOptimized);
  showToast('Copied! Paste this into your AI assistant');
}
CONTENT WRITING GUIDELINES:

Clear and Concise

Short paragraphs (2-3 sentences)
Active voice
Avoid jargon
Use examples
Structure

Start with "what" (overview)
Then "why" (benefits)
Then "how" (step-by-step)
End with tips/best practices
Visual Aids

Screenshots for UI instructions
Diagrams for concepts
Flowcharts for processes
GIFs for interactions
Accessibility

Alt text for images
Descriptive link text (not "click here")
Logical heading hierarchy (H1 → H2 → H3)
High contrast text
Maintenance

Date last updated
Versioning if applicable
Regular audits for accuracy
text


### 6.2 AI Services Documentation (Special Focus)
TASK: Explain the sophisticated AI system in user-friendly terms

FILE: /docs/ai-system/how-ai-works.md

CONTENT OUTLINE:

How AI Powers Resurgo
Overview
Resurgo isn't just another app - it's your intelligent life operating system. Here's how our AI works behind the scenes to make your life easier.

The Core Idea: One App, Many AI Models
Most apps use one AI model. We use multiple specialized models working together, each excellent at different tasks:

Model 1: Understanding your goals and desires
Model 2: Planning and scheduling
Model 3: Motivation and coaching
Model 4: Data analysis and insights
Model 5: Content generation (meal plans, workouts, etc.)
Think of it like a team of experts, each with their specialty, collaborating to help you.

The Multi-Model Pipeline
For complex tasks (like creating your personalized life plan), your request goes through multiple AI models in sequence:

[Visual diagram of pipeline]

┌─────────────────────────────────────────────────────────┐
│ YOUR INPUT │
│ "I want to lose weight and be more productive" │
└──────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ STAGE 1: Analysis (Model 1) │
│ Understands your goal, extracts key info │
└──────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ STAGE 2: Planning (Model 2) │
│ Creates workout and meal plan structure │
└──────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ STAGE 3: Optimization (Model 3) │
│ Adjusts plan based on your lifestyle constraints │
└──────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ STAGE 4: Personalization (Model 4) │
│ Adds your preferences, past patterns, motivations │
└──────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ YOUR PERSONALIZED PLAN │
│ Complete fitness + nutrition + productivity system │
└─────────────────────────────────────────────────────────┘

How AI Learns You
Every interaction teaches Resurgo more about you:

Tasks you complete → Learns your productive hours
Habits you maintain → Understands your consistency patterns
Foods you log → Discovers your taste preferences
Workouts you do → Knows your fitness level and preferences
Mood check-ins → Recognizes your emotional patterns
This data stays private (more in Privacy Policy) and is used solely to serve you better.

Smart Features Powered by AI
1. Auto-Task Generation
AI suggests tasks based on your goals. For example, if your goal is "Launch side business," AI might suggest:

Research business registration
Create business plan outline
Design logo
Set up social media accounts
2. Optimal Scheduling
AI knows when you're most productive and suggests task timing accordingly.

3. Habit Recommendations
Based on your goals and lifestyle, AI suggests keystone habits with highest impact.

4. Meal Planning
AI creates meal plans that:

Hit your macro targets
Match your dietary preferences
Fit your cooking skill level
Use ingredients you have or can easily get
Optimize for nutritional value
5. Workout Programming
AI designs workouts considering:

Your fitness goals
Available equipment
Time constraints
Recovery needs
Past performance
6. Insights & Patterns
AI analyzes your data to find helpful correlations:

"You complete 60% more tasks on days you meditate"
"Your sleep quality improves when you work out in the morning"
"You're most likely to break habits on Sundays - here's why"
Why Multiple Free Models?
We use free-tier AI models to keep Resurgo accessible to everyone. To work around rate limits:

Smart Routing: Simple tasks use simpler models, complex tasks use advanced models
Caching: We remember common requests to avoid repeat API calls
Rotation: We automatically rotate between models when one reaches its limit
Batching: Multiple user requests are efficiently batched where possible
This means you get sophisticated AI capabilities without hitting service limits, and we can keep Resurgo free.

Privacy & Security
Your data never trains public AI models
All AI processing happens server-side (your data doesn't leave Resurgo)
We use AI APIs securely and compliantly
You can export or delete your data anytime
The Future of AI in Resurgo
We're constantly improving:

More sophisticated pattern recognition
Predictive analytics (goal completion likelihood)
Voice interaction
Image-based tracking (food, progress photos)
Real-time coaching and intervention
[End of document]

[Was this helpful? Yes / No]
[Copy Markdown for AI] [Edit on GitHub] [Report Issue]

text


---

## PHASE 7: SaaS Best Practices Implementation (Week 6-7)

### 7.1 Research Top SaaS Platforms
TASK: Study and implement best practices from leading SaaS companies

PLATFORMS TO ANALYZE:

Linear (Project Management)

Clean, minimalist UI
Keyboard shortcuts everywhere
Fast performance
Excellent onboarding
Command palette (Cmd+K)
Notion (Productivity)

Flexible, block-based architecture
Comprehensive features without overwhelm
Excellent documentation
Community and templates
Superhuman (Email)

Speed-focused design
Keyboard-first interaction
Gamified onboarding
Premium feel despite being software
Mercury (Finance)

Beautiful data visualization
Dashboard excellence
Clear value proposition
Trust-building design
Raycast (Productivity Launcher)

Extensibility
Command-driven interface
Fast and lightweight
Developer-friendly
Cal.com (Scheduling)

Open-source transparency
Clean booking flow
Integration-first approach
Vercel (Development Platform)

Developer experience focus
Exceptional documentation
Clear pricing
Fast deployment
LESSONS TO IMPLEMENT:

FROM LINEAR:
✓ Implement comprehensive keyboard shortcuts
✓ Add command palette (Cmd/Ctrl+K)
✓ Optimize for speed (< 1s page transitions)
✓ Clean, distraction-free UI
✓ Contextual help and tooltips

FROM NOTION:
✓ Flexible content blocks (if applicable)
✓ Template library for goals, habits, etc.
✓ Excellent search functionality
✓ Help center integration

FROM SUPERHUMAN:
✓ Guided onboarding with achievements
✓ Keyboard shortcut training
✓ Delightful micro-interactions
✓ Premium feel in design details

FROM MERCURY:
✓ Beautiful data visualizations
✓ Dashboard as primary view
✓ Clear financial metrics (for us: progress metrics)
✓ Professional, trustworthy design

FROM RAYCAST:
✓ Extensible architecture (future: plugins?)
✓ Command-first interaction model
✓ Developer tools for power users

FROM CAL.COM:
✓ Simplified core flow
✓ Clear call-to-action
✓ Integration showcases

FROM VERCEL:
✓ Exceptional documentation
✓ Developer-friendly
✓ Clear deployment/setup process

IMPLEMENTATION CHECKLIST:

□ Keyboard Shortcuts

Create comprehensive shortcut system
Shortcut cheatsheet (accessible via ?)
Conflict resolution with browser shortcuts
Customizable shortcuts (future)
□ Command Palette

Fuzzy search for all actions
Recent commands
Contextual suggestions
Keyboard training
□ Performance Optimization

Code splitting per route
Lazy loading for heavy components
Image optimization
Caching strategies
Lighthouse score > 90 all categories
□ Onboarding Excellence

Interactive tutorial
Progress tracking
Celebratory moments
Clear next steps
Optional skip
□ Help System

Contextual help tooltips
Embedded docs
Search-powered help
Video tutorials (future)
□ Professional Design

Consistent spacing
Typography scale
Color system
Component library
Animation system
□ Data Visualization

Chart library (Chart.js or D3.js)
Consistent chart styling
Interactive graphs
Export capabilities
□ Templates & Presets

Goal templates
Habit bundles
Workout programs
Meal plans
User-created templates (future)


RESURGO.LIFE - ULTIMATE TRANSFORMATION PROMPT
🎯 CORE MISSION STATEMENT
"EASE ON SETTING UP THE THING TO WORK FOR YOU SO YOU CAN FOCUS ON THINGS THAT MATTER"

This is not just an app - it's an intelligent life operating system that configures itself around the user, learns their patterns, and automates their growth journey. Every feature, every interaction, every line of code must serve this singular purpose: reduce friction, increase impact, enable focus on what truly matters.

PHASE 0: DEEP ARCHAEOLOGICAL SCAN 🔍
Critical Pre-Work Analysis
text

TASK: COMPREHENSIVE CODEBASE ARCHAEOLOGY

Step 1: FULL REPOSITORY SCAN
□ Clone and analyze every single file
□ Read all .md documentation files thoroughly
□ Understand the original vision vs current state
□ Map feature completion status (0-100% for each feature)
□ Identify orphaned code, incomplete features, broken links
□ Document every TODO, FIXME, and comment

Step 2: FEATURE INVENTORY
□ List ALL intended features from documentation
□ Mark status: ✅ Complete | 🔄 Partial | ❌ Missing | 🐛 Broken
□ Cross-reference with actual code implementation
□ Identify feature gaps and broken connections

Step 3: USER FLOW MAPPING
□ Map every possible user journey
□ Identify friction points and dead ends
□ Document current onboarding flow
□ Analyze drop-off points in user experience

Step 4: TECHNICAL DEBT ASSESSMENT
□ Unused dependencies
□ Duplicate code
□ Inefficient patterns
□ Security vulnerabilities
□ Performance bottlenecks
□ Inconsistent naming/structure

Step 5: API INTEGRATION AUDIT
□ List all API keys in .env
□ Verify which are actually being used
□ Identify unused but configured APIs
□ Research additional free APIs that align with vision
□ Document rate limits and refresh cycles

DELIVERABLE: Comprehensive audit report before any changes
PHASE 1: CRITICAL FOUNDATION (Week 1-2)
1.1 Logo & Brand Consistency Overhaul
text

TASK: Establish unified brand identity across entire application

LOGO SPECIFICATIONS:
- Design: Orange pixelated arrow + "RESURGO" wordmark
- Style: Simple, powerful, memorable
- Format: SVG for scalability
- Variations needed:
  * Full logo (arrow + text)
  * Icon only (arrow) - for favicon, app icon
  * Horizontal layout (dashboard header)
  * Vertical layout (landing page)
  * Monochrome version (for watermarks)

REMOVAL REQUIREMENTS:
- Find and remove ALL instances of "by webmess"
- Search codebase for: "webmess", "by ", credit attributions
- Clean footer, about page, metadata

IMPLEMENTATION LOCATIONS:
✓ Landing page header
✓ Dashboard header/sidebar
✓ Favicon (all sizes)
✓ PWA app icons (192x192, 512x512)
✓ Email templates
✓ Loading screens
✓ Login/signup pages
✓ Error pages
✓ Documentation pages
✓ Social media preview images (og:image)

CONSISTENCY CHECKS:
- Exact same logo file used everywhere (not recreated)
- Consistent sizing ratios
- Proper spacing/padding around logo
- Color consistency (#FF6B35 or exact orange hex)
- No variations in wordmark font

TECHNICAL IMPLEMENTATION:
```jsx
// Create unified Logo component
// src/components/common/Logo.jsx
const Logo = ({ variant = 'full', size = 'md', className }) => {
  return (
    <div className={`logo logo-${variant} logo-${size} ${className}`}>
      {/* SVG implementation */}
    </div>
  );
};

// Use throughout app
<Logo variant="full" size="lg" />
<Logo variant="icon" size="sm" />
1.2 Pixelated Icon System Design
text

TASK: Create cohesive pixelated icon library for terminal aesthetic

ICON RESEARCH:
- Study: Minecraft icons, retro game UI, terminal emulators
- Reference: Pokemon pixel art, 8-bit game assets
- Modern examples: Habbo Hotel, Stardew Valley UI

REQUIRED ICONS (Priority List):

CATEGORY: Dashboard & Overview
□ Pixelated sun (weather: sunny) - with rays
□ Pixelated clouds (weather: cloudy)
□ Pixelated rain drops (weather: rainy)
□ Pixelated moon/stars (weather: night)
□ Water bottle/glass (hydration tracker) - with fill levels
□ Food/plate icon (calorie tracker)
□ Apple or carrot (nutrition)
□ Dumbbell (fitness)
□ Heart (health/wellness)
□ Brain (mental health)
□ Meditation pose (mindfulness)

CATEGORY: Tasks & Productivity
□ Checkbox (empty, checked, partial)
□ Calendar/date
□ Clock/timer
□ Flag (goals)
□ Trophy (achievements)
□ Star (favorites)
□ Fire (streak)
□ Lightning bolt (quick actions)

CATEGORY: Progress & Gamification
□ XP bar segments
□ Level badge/shield
□ Upward arrow (progress)
□ Target/bullseye (goals)
□ Chart/graph
□ Battery (energy levels)

CATEGORY: Navigation & Actions
□ Plus sign (add)
□ Gear (settings)
□ User avatar placeholder
□ Bell (notifications)
□ Hamburger menu
□ Arrow (back, forward, up, down)
□ Magnifying glass (search)
□ Pencil (edit)
□ Trash can (delete)

CATEGORY: Wellness Specific
□ Bed (sleep)
□ Scale (weight)
□ Ruler (measurements)
□ Thermometer (temperature/progress)
□ Pill (supplements)
□ Book (learning/reading)

DESIGN SPECIFICATIONS:
- Grid size: 16x16px or 32x32px (consistent)
- Color palette: Limited colors (terminal-appropriate)
  * Primary: #00FF88 (neon green)
  * Secondary: #00D9FF (cyan)
  * Accent: #FF6B35 (orange)
  * Warning: #FFD700 (gold)
  * Neutral: #8892A6 (gray)
- Export formats: SVG, PNG (2x, 3x for retina)
- Naming convention: icon-[name]-pixel.svg

IMPLEMENTATION:
```jsx
// Icon component system
// src/components/icons/PixelIcon.jsx
const PixelIcon = ({ name, size = 24, color, animated = false }) => {
  return (
    <span className={`pixel-icon pixel-icon-${name} ${animated ? 'animated' : ''}`}>
      {/* Load from sprite sheet or individual SVG */}
    </span>
  );
};

// Usage examples
<PixelIcon name="water-bottle" size={32} />
<PixelIcon name="sun" size={24} animated />
<PixelIcon name="fire" size={16} color="#FF6B35" />
ANIMATION IDEAS:

Water bottle: fill level animates up/down
Sun: gentle rotation or pulsing rays
Fire: flickering animation
Clock: ticking second hand
XP bar: filling animation
Notification bell: ringing shake
CREATION TOOLS:

Aseprite (pixel art software)
Piskel (free browser-based)
Photoshop with 16x16 canvas
Export to SVG for scalability
text


---

## 1.3 Enhanced Terminal Clock & Weather Widget
TASK: Create sophisticated time/weather display for dashboard

TERMINAL CLOCK DESIGN:

┌─ SYSTEM TIME ──────────────────────────────┐
│ │
│ ╔═══════════════════╗ │
│ ║ 14:23:45 PST ║ │
│ ║ THU, DEC 19 ║ │
│ ╚═══════════════════╝ │
│ │
│ [☀️] 72°F Clear Skies UV: 6/10 │
│ │
│ Sunrise: 07:15 AM | Sunset: 04:45 PM │
│ │
└─────────────────────────────────────────────┘

FEATURES TO IMPLEMENT:

Real-Time Clock

Live updating every second
User's timezone detection (Intl API)
12/24 hour format toggle (user preference)
Date with day name
Optional: Binary/Hexadecimal time display (geek mode)
Weather Integration

OpenWeatherMap API integration
Current temperature
Weather condition (with pixelated icon)
Feels like temperature
Humidity percentage
Wind speed
UV index
Air quality index (if available)
Sunrise/sunset times (with icon transition)
Pixelated Weather Icons

Sunny: ☀️ pixelated sun with rays
Partly cloudy: 🌤️ sun with cloud
Cloudy: ☁️ pixel cloud
Rainy: 🌧️ cloud with rain drops
Stormy: ⛈️ cloud with lightning
Snowy: 🌨️ cloud with snowflakes
Night: 🌙 moon and stars
Animate transitions between states
Contextual Features

Background color shift based on time of day
Motivational message based on time
Morning: "Good morning! Ready to conquer the day?"
Afternoon: "Keep the momentum going!"
Evening: "Winding down - reflect on your wins"
Night: "Rest well, recharge for tomorrow"
Weather-based suggestions
Hot: "Stay hydrated! 💧"
Rainy: "Indoor workout day? 🏋️"
Cold: "Warm meal recommended 🍲"
Terminal Aesthetic

Monospace font (Fira Code, JetBrains Mono)
ASCII art borders
Blinking cursor animation
Scanline effect (subtle)
CRT screen curvature (very subtle)
Typing animation on load
TECHNICAL IMPLEMENTATION:

React

// src/components/widgets/TerminalClock.jsx
const TerminalClock = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch weather data
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 600000); // 10 min
    
    return () => {
      clearInterval(timer);
      clearInterval(weatherInterval);
    };
  }, []);
  
  const fetchWeather = async () => {
    // Get user location
    const position = await getUserLocation();
    // Call OpenWeatherMap API
    const data = await getWeatherData(position);
    setWeather(data);
  };
  
  return (
    <div className="terminal-clock">
      {/* Clock display */}
      {/* Weather display */}
      {/* Contextual message */}
    </div>
  );
};
API INTEGRATION:

OpenWeatherMap free tier: 1000 calls/day
Cache weather data for 10 minutes
Fallback to cached data if API fails
Graceful degradation if geolocation denied
text


---

## 1.4 Ultimate Widget System Architecture
TASK: Research and build world-class widget system

RESEARCH PHASE:
Study these best-in-class widget systems:

Apple macOS Widgets
Google Material Design Cards
Notion databases and views
Linear.app project widgets
Obsidian plugin widgets
Todoist productivity widgets
Fitbit/Apple Health widgets
Trello board widgets
Grafana dashboard panels
Bloomberg Terminal (for data density)
WIDGET CATEGORIES:

═══════════════════════════════════════════════
CATEGORY 1: QUICK GLANCE WIDGETS (Small)
═══════════════════════════════════════════════

Streak Counter

Current streak number (large, prominent)
Fire emoji animation
Longest streak record
Mini graph of last 30 days
Size: 1x1 grid unit
XP Progress

Current level badge
XP bar (visual fill)
XP to next level
Daily XP earned today
Size: 1x1 grid unit
Today's Tasks

Task count (3/7 complete)
Completion percentage
Next task preview
Quick add button
Size: 1x1 grid unit
Water Intake

Pixelated water bottle with fill level
Current intake / goal
Quick log buttons (+250ml, +500ml)
Size: 1x1 grid unit
Weather Snapshot

Temperature + icon
Condition
High/Low
Size: 1x1 grid unit
═══════════════════════════════════════════════
CATEGORY 2: MEDIUM WIDGETS (Moderate Space)
═══════════════════════════════════════════════

Nutrition Tracker

Calorie budget (consumed/remaining)
Macro breakdown (protein/carbs/fats) - mini pie chart
Meal log preview (last 3 meals)
Pixelated food icons
Quick log button
Size: 2x1 grid units
Fitness Summary

Today's workout status
Active minutes
Calories burned
Quick workout log
Pixelated dumbbell icon
Size: 2x1 grid units
Habit Grid

Visual grid of all habits
Color-coded by completion
Click to toggle completion
Streak indicators
Size: 2x2 grid units
Focus Timer

Pomodoro-style timer
Current task being focused on
Session count today
Start/pause/reset controls
Size: 2x1 grid units
Wellness Radar

6-dimension radar chart
Physical
Mental
Emotional
Social
Spiritual
Financial
Scores for each dimension
Overall wellness score
Size: 2x2 grid units
═══════════════════════════════════════════════
CATEGORY 3: LARGE WIDGETS (Significant Space)
═══════════════════════════════════════════════

Daily Overview Dashboard (Medium-Large)

Time of day greeting
Today's schedule preview
Priority tasks (top 3)
Habits due today
Upcoming events
Weather + suggestions
Quick actions bar
Size: 3x2 grid units
Progress Analytics

Weekly/monthly trends
Multiple chart types
Task completion rates
Habit adherence
Goal progress
XP gain graph
Size: 3x2 grid units
═══════════════════════════════════════════════
CATEGORY 4: SUPER ADVANCED MEGA WIDGET
═══════════════════════════════════════════════

COMMAND CENTER (The Centerpiece)
Size: 4x3 grid units (largest widget)

This is the ultimate widget - a comprehensive control panel

SECTIONS:

┌─ COMMAND CENTER ─────────────────────────────────────────┐
│ │
│ ┌─ VITAL STATS ───────┐ ┌─ TODAY'S MISSION ────────┐ │
│ │ Level: 42 🔥 15d │ │ □ Morning Meditation │ │
│ │ XP: 8,450/10,000 │ │ ✓ Breakfast logged │ │
│ │ Wellness: 87/100 │ │ □ Gym session │ │
│ └─────────────────────┘ │ □ Client presentation │ │
│ │ ✓ Read 20 pages │ │
│ ┌─ LIVE METRICS ──────┐ └──────────────────────────┘ │
│ │ 💧 1.5L / 2.5L │ │
│ │ 🍎 1,450 / 2,200cal │ ┌─ INSIGHTS ──────────────┐ │
│ │ 🏃 30 / 60 min │ │ > Peak productivity: │ │
│ │ 😊 Mood: Energetic │ │ 9-11 AM │ │
│ └─────────────────────┘ │ > You're on track for │ │
│ │ your best week yet! │ │
│ ┌─ QUICK ACTIONS ─────┐ │ > Suggestion: Add more │ │
│ │ [+ Task] [+ Habit] │ │ protein to lunch │ │
│ │ [Log Food] [Timer] │ └─────────────────────────┘ │
│ └─────────────────────┘ │
│ │
│ ┌─ PROGRESS VISUALIZATION ──────────────────────────┐ │
│ │ │ │
│ │ [Mini charts showing: XP trend, habit heat map, │ │
│ │ goal progress rings, wellness radar] │ │
│ │ │ │
│ └────────────────────────────────────────────────────┘ │
│ │
│ ┌─ ACTIVE FOCUS ──────────────────────────────────────┐│
│ │ 🎯 Current: Deep Work Session ││
│ │ ⏱️ Timer: 25:00 [Pause] [Stop] ││
│ │ 📊 3/4 sessions today | Next break in 25 min ││
│ └──────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────┘

FEATURES:

Real-time data updates (WebSocket or 5s polling)
Interactive elements (click any metric to drill down)
Drag-to-reorder sections
Customizable layout (user can toggle sections)
AI-powered insights (updated hourly)
Quick action buttons with keyboard shortcuts
Motivational quotes rotation
Celebration animations on achievements
Color-coded by status (green=good, yellow=attention, red=action needed)
Responsive scaling (adapts to screen size)
Export snapshot feature (save as image)
TECHNICAL COMPLEXITY:

Multiple data sources aggregated
Real-time calculations
Efficient re-rendering (React.memo, useMemo)
Chart library integration (Chart.js or Recharts)
Local state management for interactions
Persistent layout preferences
═══════════════════════════════════════════════
ADDITIONAL WIDGETS
═══════════════════════════════════════════════

Vision Board Preview

Mini version of full vision board
3x3 grid of goal images
Click to expand to full editor
Size: 2x2 grid units
AI Coach Chat

Quick chat interface
Last 3 AI messages
Input field
Voice input button
Size: 2x3 grid units
Achievements Gallery

Recent achievements (last 5)
Badge display
Progress to next achievement
Size: 2x1 grid units
Calendar Widget

Month view
Events/habits marked
Streak days highlighted
Click day to see details
Size: 2x2 grid units
Leaderboard

Top 5 users (if competitive mode)
User's rank
Weekly XP comparison
Size: 1x2 grid units
Daily Quote

Motivational quote
Author attribution
Refresh button
Share button
Size: 2x1 grid units
Body Metrics

Weight graph (last 30 days)
Current measurements
Progress vs. goal
Pixelated body figure
Size: 2x2 grid units
═══════════════════════════════════════════════
WIDGET SYSTEM ARCHITECTURE
═══════════════════════════════════════════════

GRID LAYOUT SYSTEM:

CSS Grid with 4-6 columns (responsive)
Each widget occupies grid cells
Drag-and-drop to rearrange (react-grid-layout)
User preferences saved to database
Presets for different layouts (Focused, Overview, Analytics)
WIDGET FEATURES:
✓ Expand/collapse
✓ Refresh button
✓ Settings (gear icon)
✓ Info tooltip (what is this?)
✓ Remove from dashboard
✓ Full-screen mode
✓ Export data from widget

RESPONSIVE BEHAVIOR:

Desktop: 6 columns
Tablet: 4 columns
Mobile: 2 columns (some widgets full-width)
Auto-resize and reflow
CUSTOMIZATION OPTIONS:

Widget marketplace (all available widgets)
Drag to add to dashboard
Theme per widget (optional color variations)
Data refresh intervals
Notification preferences per widget
PERFORMANCE OPTIMIZATION:

Lazy load widget components
Virtual scrolling for long lists
Debounced API calls
Shared data fetching (don't duplicate calls)
Memoization of expensive calculations
IMPLEMENTATION STRUCTURE:

React

// src/components/widgets/WidgetGrid.jsx
const WidgetGrid = () => {
  const [layout, setLayout] = useState(userLayout);
  const [widgets, setWidgets] = useState(activeWidgets);
  
  return (
    <GridLayout
      layout={layout}
      onLayoutChange={saveLayout}
      cols={6}
      rowHeight={100}
      width={1200}
    >
      {widgets.map(widget => (
        <div key={widget.id} data-grid={widget.gridConfig}>
          <Widget type={widget.type} config={widget.config} />
        </div>
      ))}
    </GridLayout>
  );
};

// src/components/widgets/Widget.jsx
const Widget = ({ type, config }) => {
  const WidgetComponent = widgetRegistry[type];
  
  return (
    <div className="widget-container">
      <WidgetHeader title={config.title} />
      <WidgetBody>
        <WidgetComponent {...config} />
      </WidgetBody>
    </div>
  );
};
WIDGET REGISTRY:

JavaScript

// src/widgets/registry.js
export const widgetRegistry = {
  'streak-counter': StreakCounterWidget,
  'xp-progress': XPProgressWidget,
  'tasks-today': TasksTodayWidget,
  'water-intake': WaterIntakeWidget,
  'weather': WeatherWidget,
  'nutrition-tracker': NutritionTrackerWidget,
  'fitness-summary': FitnessSummaryWidget,
  'habit-grid': HabitGridWidget,
  'focus-timer': FocusTimerWidget,
  'wellness-radar': WellnessRadarWidget,
  'daily-overview': DailyOverviewWidget,
  'progress-analytics': ProgressAnalyticsWidget,
  'command-center': CommandCenterWidget,
  // ... all widgets
};
text


---

# PHASE 2: AI ONBOARDING & DEEP SCANNING SYSTEM (Week 1-2)

## 2.1 Intelligent User Onboarding Flow
TASK: Build comprehensive AI-powered user profiling system

MISSION: The app should understand the user deeply before they even start using features.

ONBOARDING FLOW ARCHITECTURE:

┌──────────────────────────────────────────────────────────────┐
│ RESURGO ONBOARDING JOURNEY │
│ (25-30 minutes total) │
└──────────────────────────────────────────────────────────────┘

STEP 1: WELCOME & VISION (2 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Screen: Inspiring welcome message

Video/animation showing app capabilities
"What if your life could run itself?"
Brief value proposition
[Get Started] button
STEP 2: ACCOUNT CREATION (1 minute)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name, Email, Password
Optional: Profile photo
Social login options (Google, Apple)
Terms acceptance (with easy-to-understand language)
STEP 3: PRIMARY GOAL IDENTIFICATION (3 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question: "What brought you to Resurgo today?"

Options (multi-select allowed):
□ Get healthier and fitter
□ Build better habits
□ Achieve specific goals
□ Improve mental wellness
□ Boost productivity
□ Track nutrition and diet
□ Develop spiritually
□ Improve relationships
□ Learn and grow
□ Find balance in life
□ Other: __________

For each selected, quick follow-up:

"Tell me more about your health goals" (text input)
AI analyzes and categorizes
STEP 4: LIFESTYLE DEEP SCAN (8-10 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is the CORE of user understanding

SECTION A: Daily Routine

"What time do you typically wake up?"
[Slider: 4 AM - 12 PM]
"What time do you usually go to bed?"
[Slider: 7 PM - 3 AM]
"How many hours of sleep do you get?"
[Auto-calculated + manual override]
"Describe your typical day" (optional text)
"What's your current energy pattern?"
[Graph: drag to show energy throughout day]
SECTION B: Work & Productivity

"What's your occupation/main daily activity?"
[Text input with autocomplete]
"How many hours per day do you work?"
[Slider: 0-16 hours]
"Is your work mostly:"
◯ Physical
◯ Mental/desk work
◯ Mixed
"What's your biggest productivity challenge?"
[Multiple choice + other]
SECTION C: Health & Fitness

"Current fitness level?"
◯ Beginner (little to no exercise)
◯ Intermediate (exercise 2-3x/week)
◯ Advanced (exercise 4+x/week)
◯ Athlete
"What's your current weight?" (optional)
[Number input + unit toggle lb/kg]
"What's your height?"
[Input + unit toggle]
"Do you have any physical limitations or health conditions?"
[Text input, reassurance about privacy]
"Dietary preferences?"
□ No restrictions
□ Vegetarian
□ Vegan
□ Keto
□ Paleo
□ Allergies: __________
□ Other: __________
SECTION D: Mental & Emotional Wellness

"How would you rate your current stress level?"
[Scale: 1-10 with emoji indicators]
"Do you currently practice any mindfulness activities?"
□ Meditation
□ Journaling
□ Yoga
□ Breathwork
□ None yet (want to start)
"What emotional state do you want more of?"
□ Calm
□ Energy
□ Focus
□ Happiness
□ Confidence
SECTION E: Current Habits & Challenges

"Which habits do you already have?"
[Checklist of common habits with search]
"What habits have you tried to build but struggled with?"
[Text input with examples]
"What's your biggest life challenge right now?"
[Free text, AI analyzes]
"When do you usually have free time?"
Morning / Afternoon / Evening / Night
Weekdays / Weekends
[Multi-select]
SECTION F: Motivation & Communication Style

"What motivates you most?"
◯ Achievement and progress
◯ Competition and rankings
◯ Helping others
◯ Personal growth
◯ Health and longevity
◯ Appearance and aesthetics
"How do you prefer to be encouraged?"
◯ Gentle and supportive
◯ Direct and challenging
◯ Data-driven and logical
◯ Inspirational and emotional
"How much guidance do you want from AI?"
[Slider: Minimal - Moderate - High]
STEP 5: AI PLAN BUILDER (5-7 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Processing Screen:

"Analyzing your profile..."
"Building your personalized roadmap..."
"Setting up your workspace..."
[Progress bar with fun facts/tips]
AI MULTI-MODEL PIPELINE:

Model 1 (GPT-4o/Claude): Analyze raw responses
Model 2 (Gemini): Generate habit recommendations
Model 3 (GPT-4o): Create task lists and routines
Model 4 (Claude): Build motivational messaging
Model 5 (Gemini): Validate and optimize plan
OUTPUT: Comprehensive User Profile

JSON

{
  "userId": "uuid",
  "profile": {
    "goals": ["health", "productivity", "mental-wellness"],
    "lifestyle": {
      "wakeTime": "06:00",
      "sleepTime": "22:30",
      "occupation": "software-developer",
      "workHours": 8,
      "workType": "mental",
      "freeTime": ["evening", "weekends"]
    },
    "health": {
      "fitnessLevel": "intermediate",
      "weight": 75,
      "height": 180,
      "restrictions": ["vegetarian"],
      "conditions": []
    },
    "preferences": {
      "motivationStyle": "achievement",
      "communicationStyle": "direct-challenging",
      "aiGuidanceLevel": "high"
    },
    "currentState": {
      "stressLevel": 7,
      "energyPattern": [4,5,7,9,8,6,5,3],
      "existingHabits": ["morning-coffee", "evening-walk"],
      "challenges": ["time-management", "consistent-exercise"]      

      I wasn't able to find public reviews or screenshots of your specific app at resurgo.life/dashboard, so I can't do a pixel-by-pixel UI audit. However, based on your description (panel-based habit/task tracker, built from scratch, aiming for zero learning curve), I can give you an extremely thorough SaaS-expert-level analysis grounded in exactly what the market demands right now and where the gaps are. Let me be brutally honest.

---

# 🔬 DEEP STRATEGIC ANALYSIS: Resurgo.life

## I. THE MARKET YOU'RE ENTERING (Reality Check)

The global habit tracking apps market is valued at USD 13.06 billion in 2025 and projected to reach USD 14.94 billion in 2026, growing to USD 50.21 billion by 2035 at a CAGR of 14.41%. This is a massive, growing market — but also an **incredibly crowded** one.

Key players include Productive Habit Tracker, Streaks, Habitica, Habitify, Beeminder & more. You're up against 20+ established players with millions of users.

### The brutal churn problem you MUST solve:
There's a 52% drop-off rate in 30 days, 44% of users lose motivation, and 39% churn from lack of personalization and app fatigue. And more broadly in SaaS, nearly 70% of new users stop using software within three months.

**This is your #1 existential threat. Not features. Not UI. RETENTION.**

---

## II. CRITICAL PROBLEMS WITH YOUR CURRENT APPROACH

### 🚩 Problem 1: "Panel Look" = Power-User Aesthetic in a Casual-User Market

You said it yourself — you like the panel look but "a lot of people won't." You're right. Here's why this is fatal:

For iPhone users specifically, you want apps designed for quick interactions. Pull out your phone, mark a habit complete in seconds, put it away. No logging into websites, no navigating through menus, no friction between you and tracking.

The winning apps in this space optimize for **under 10 seconds of daily interaction**. Tracking daily habits is easy in many apps, but unless it is super quick to enter, you'll forget or not have the time. In Way of Life, users can enter status of 7-8 areas in a few seconds.

**A panel/dashboard layout implies:**
- Multiple sections to scan
- Information density (feels like work)
- Desktop-first thinking in a mobile-first world
- "Admin tool" vibes instead of "personal companion" vibes

### 🚩 Problem 2: "Zero Learning Curve" Is Your Goal — But a Web Dashboard Is the Opposite

You want zero learning curve, yet you're building a dashboard at a URL (`/dashboard`). This immediately introduces friction:

- User has to open a browser
- Navigate to a URL (or find a bookmark)
- No native push notifications
- No widgets, no lock screen, no Siri/voice
- No offline capability

iOS-specific features like widgets, Siri Shortcuts, and notifications make the best habit trackers feel integrated into your daily routine instead of another app to remember.

Widget quality: The best habit trackers put your habits on your home screen or lock screen. Check off habits without opening the app.

**Zero learning curve doesn't mean "simple UI." It means the app finds the user, not the other way around.** The best apps in this space reach the user through notifications, widgets, watch complications, and calendar integrations — not by waiting for someone to visit a URL.

### 🚩 Problem 3: You're Building a Tool, Not a Behavior System

Habit formation has moved beyond motivation and willpower. It is now understood as a systems problem driven by cues, rewards, friction reduction, and identity reinforcement. Habit building apps have evolved accordingly. The best platforms no longer just remind users to check off tasks. They help users design habits that fit real life, reinforce behavior through feedback loops, and adapt when motivation inevitably fluctuates.

A task tracker / habit tracker that's just checkboxes on a dashboard is **2018 technology**. The market has moved to:

1. **AI-driven scheduling** — Reclaim.ai works through your calendar, automatically scheduling flexible time for your habits around your meetings, appointments, and personal events.
2. **Behavioral science integration** — Rigid streak-based systems often break when users miss a day. Better habit apps allow recovery, reflection, and continuation without penalty. Flexibility reduces guilt and improves long-term adherence.
3. **Gamification that works** — Habitica added multiplayer habit challenges attracting 3.8 million new users within six months.
4. **Wearable/biometric sync** — 49% of users actively sync habit data from fitness bands and smartwatches.
5. **Emotion-aware recommendations** — TickTick rolled out emotion-based habit recommendations after analyzing more than 210 million user interactions.

### 🚩 Problem 4: No Clear Differentiation

You're entering a space where reviewers consider almost 50 popular habit tracking apps and most fall short. If I visit your app and can't immediately answer "Why this over Habitify/Streaks/Reclaim?" in 3 seconds, you've lost.

### 🚩 Problem 5: Web-Only Is a Dealbreaker

Habitify is available on iPhone, iPad, Mac, Apple Watch, Windows, Web App, Android, Galaxy Watch, Pixel Watch. The biggest reason Habitify earns a top spot is its reach. It spans mobile, desktop, and web, which makes it easier to keep habits visible wherever your day happens.

Being web-only in 2026 is like opening a restaurant with no front door. People track habits on their phones. Period.

---

## III. WHAT'S ACTUALLY NOT PRACTICAL IN THE SPACE RIGHT NOW (Opportunities for You)

Here's where I flip this to your advantage — the gaps in the market:

### Gap 1: Every app forces you to learn THEIR system
Moderate learning curve. The habit tracker piece is straightforward, but understanding how to use tasks, goals, and documents together takes a few days. Even the "simple" apps require setup flows, onboarding tutorials, and choosing between 14 types of habit tracking views. **True zero-config is unsolved.**

### Gap 2: The "all-in-one" apps are bloated; the simple apps are too limited
One app replaces what used to be Streaks, Things, and a Notion dashboard. — But these all-in-one apps become overwhelming. Meanwhile, the simple ones (Everyday, Streaks) cap at 3-12 habits and feel like toys.

### Gap 3: Nobody has solved the 30-day cliff
52% drop-off in 30 days. Every app loses half its users in a month. The app that cracks retention with behavioral nudges, adaptive difficulty, and emotional intelligence wins the market.

### Gap 4: AI is overhyped but under-delivered
Over the past two years, there have been apps touting AI habit coaching features. None of the AI habit tracker apps met basic criteria for inclusion. Some apps from last year have already been shut down. Habit tracking doesn't need to be trendy—it just needs to be effective.

There's a massive opening for **practical AI** (not chatbot gimmicks) — like auto-detecting when you're overcommitted, suggesting habit simplification, or predicting your likely failure days.

---

## IV. YOUR ACTION PLAN (Prioritized)

### 🔴 PHASE 1: SURVIVAL (Next 30 days)
| Priority | Action | Why |
|----------|--------|-----|
| **P0** | **Build a PWA or native mobile app** | Web-only is dead on arrival. A PWA gives you push notifications, home screen install, and offline — minimum viable mobile presence |
| **P0** | **Gut the dashboard complexity** | Your landing state should be ONE screen: today's habits, tap to complete. That's it. Hide everything else behind progressive disclosure |
| **P0** | **Sub-3-second daily interaction** | Time how long it takes to mark a habit done from phone unlock. If it's more than 3 seconds, redesign |
| **P1** | **Add push notifications/reminders** | Without this, you literally cannot compete. This is table stakes |

### 🟡 PHASE 2: DIFFERENTIATION (60 days)
| Priority | Action | Why |
|----------|--------|-----|
| **P1** | **Define your ONE unique wedge** | Are you the "no-BS" tracker? The "ADHD-friendly" tracker? The "anti-streak" tracker? Pick ONE identity |
| **P1** | **Implement flexible consistency (not rigid streaks)** | Rigid streak-based systems break when users miss a day. Better apps allow recovery without penalty. This is behavioral science gold |
| **P2** | **Calendar integration** (Google/Outlook) | Unlike traditional apps that separate habits and calendars, the best bring them together in one unified timeline. Habits don't sit in a disconnected list—they become a visible part of your daily schedule. |
| **P2** | **Smart defaults / templates** | Instead of asking users to set up habits, offer "Start my morning routine" or "Build a workout habit" one-tap templates |

### 🟢 PHASE 3: MOAT-BUILDING (90+ days)
| Priority | Action | Why |
|----------|--------|-----|
| **P2** | **Practical AI layer** — predict failure days, auto-adjust difficulty, smart rescheduling | 46% of newly launched apps incorporate predictive habit suggestions from behavioral data. But most are gimmicks. Do it *well* |
| **P2** | **Social accountability** (not social media — think accountability partners) | Many apps let you share progress with friends or join challenges, which adds social pressure (the good kind) to keep going. |
| **P3** | **Wearable sync** (Apple Health, Google Fit) | 49% of users actively sync habit data from wearables. |
| **P3** | **Widget/Lock screen support** | Non-negotiable for iOS traction |

---

## V. PRICING STRATEGY REALITY

The market is brutal on pricing. HabitNow charges $11.99 for Premium as a one-time purchase. Everyday is free for 3 habits; Premium from $2.50/month. Reclaim's paid plans start at $10/month.

In 2026, pricing is increasingly treated as a strategic product capability. Teams are combining fixed fees with usage and value-linked components to align with customer outcomes.

**My recommendation:** Free tier with 3-5 habits (no time limit). Pro at $4-5/month or $29/year. Lifetime deal at $49-79 for early adopters to fund development. Don't compete with Reclaim at $10/month — you're not there yet.

---

## VI. THE HARD TRUTH SUMMARY

| What you think matters | What actually matters |
|---|---|
| Panel/dashboard design | 3-second mobile interaction |
| Feature richness | Retention past 30 days |
| "Built from scratch" pride | Users don't care how it's built |
| Zero learning curve (UI simplicity) | Zero learning curve (behavioral simplicity: app finds the user, not the reverse) |
| Being best in industry | Being best for ONE specific person type |

**The #1 thing killing habit tracker startups is building for yourself instead of for the person who quits every app after 2 weeks.** That person — the serial quitter — is your real customer. The person who *already* tracks habits will use Habitify forever. The person who has *never* successfully built a habit is where the $50B market lives.

Build for them. Not for the panel-loving power user in you.

---

Want me to go deeper on any specific area — the mobile strategy, pricing, onboarding flow design, or competitive positioning? Just ask. I'm here to help you win in this brutal market. 

BLOG POST TEMPLATE STRUCTURE (for EACH post):
═══════════════════════════════════════════

1. URL: /blog/[slug] (e.g., /blog/adhd-habit-tracking-guide)
   - Clean, keyword-rich, descriptive
   
2. META:
   - Title: Under 60 chars, keyword front-loaded
   - Description: Under 155 chars, compelling
   - OG Image: Custom graphic for each post (social sharing)
   - Schema markup: Article type with author, date, modified

3. ABOVE THE FOLD:
   ┌─────────────────────────────────────────┐
   │ Category tag (e.g., "ADHD & Productivity")│
   │                                           │
   │ H1: The actual title (28-36px)            │
   │                                           │
   │ Subtitle/hook line (18px, lighter color)  │
   │                                           │
   │ Author + Date + Read time (e.g., "8 min") │
   │                                           │
   │ [Hero image or animated terminal GIF]     │
   └─────────────────────────────────────────┘

4. TABLE OF CONTENTS (sticky sidebar on desktop):
   - Auto-generated from H2s
   - Clickable jump links
   - Highlights current section as user scrolls

5. CONTENT BODY:
   ┌─ TL;DR Box (key takeaways in 3-4 bullets) ─┐
   │ For people who won't read 2000 words.       │
   │ Also perfect for AI citation/snippets.      │
   └─────────────────────────────────────────────┘
   
   H2: First major section
     - Short paragraphs (2-3 sentences max)
     - Bullet points for lists
     - Pull quotes or callout boxes for key insights
     - Internal links to related blog posts
     
   H2: Second major section
     H3: Sub-section
     - Images/GIFs/screenshots with alt text
     - Data points or statistics (cited)
     
   [INLINE CTA: "Try this in Resurgo → Sign up free"]
   
   H2: Third major section
     - Comparison tables where relevant
     - Code blocks if technical
     
   H2: Conclusion / What to Do Next
     - Actionable summary
     - Link to relevant Resurgo feature

6. BOTTOM CTA:
   ┌─────────────────────────────────────────┐
   │ "Ready to [benefit]?"                    │
   │ [Start Free — No credit card needed]     │
   └─────────────────────────────────────────┘

7. RELATED POSTS (3 cards with thumbnails)

8. AUTHOR BIO + SOCIAL LINKS

9. COMMENTS (optional — can use Giscus for free)


# 📋 RESURGO.LIFE — COMPLETE MASTER REFERENCE DOCUMENT
### For AI Coding Agent | Last Updated: February 2026

---

> **PURPOSE OF THIS DOCUMENT:** This is the single source of truth for building, fixing, and scaling RESURGO.life. It contains every decision made, every piece of code needed, every integration detail, and the full roadmap. Reference this document for ANY question about the app's architecture, features, payments, AI, marketing, or strategy.

---

## TABLE OF CONTENTS

```
SECTION 1:  App Vision & Identity
SECTION 2:  Current Tech Stack (What Stays, What Changes)
SECTION 3:  Critical Bug Fixes & Environment Variables
SECTION 4:  Payment System (Dodo Payments — Complete Setup)
SECTION 5:  Entitlements & Plan Gating (Replace Clerk Billing)
SECTION 6:  AI Provider System (Free APIs + Multi-Provider Router)
SECTION 7:  Brain Dump System (Schema + Parser + Validator + API)
SECTION 8:  AI Coaching Engine (System Prompts + Personality)
SECTION 9:  AI Onboarding Flow ("The Deep Ask")
SECTION 10: Telegram Bot Integration
SECTION 11: Landing Page Structure (14+ Sections)
SECTION 12: Blog System (SEO-Optimized Structure)
SECTION 13: Navigation & UI Fixes
SECTION 14: Missing Features to Build
SECTION 15: Security & Data Pipeline Rules
SECTION 16: Marketing Execution Plan
SECTION 17: Pricing Strategy
SECTION 18: SEO Strategy
SECTION 19: VS Code Extension (Phase 3)
SECTION 20: Post-Launch Execution Timeline
SECTION 21: Admin System
```

---

# SECTION 1: APP VISION & IDENTITY

## What Is RESURGO.life?

RESURGO.life is an AI-powered life management app. It is NOT just a habit tracker or task tracker. It is a personal accountability partner that:

1. Lets users **brain-dump** everything on their mind in raw, unstructured text
2. Uses **AI to parse, prioritize, and organize** that chaos into actionable tasks
3. Provides an **AI coaching partner** that knows the user's life context and keeps them accountable
4. Sends **proactive reminders** via Telegram (and eventually WhatsApp) so the app finds the user, not the other way around
5. Tracks **habits, goals, tasks, budget, and wellness** in one place
6. Has a **terminal/command-center aesthetic** that is fast, keyboard-driven, and ADHD-friendly

## The Core Philosophy

```
"I was drowning in unfinished tasks, broken habits, and zero 
direction. No app worked because they all felt like MORE work. 
So I built the app I wished existed — one where I could just 
dump everything on my mind and let AI figure out the rest. 
That app is RESURGO."
```

## Brand Identity

- **Name:** RESURGO.life (always include .life — other "Resurgo" brands exist)
- **Meaning:** Latin for "I rise again"
- **Tagline:** "AI-powered life management. Dump your chaos. Rise again."
- **Target Users:** People with ADHD, developers, tech workers, anyone who has tried and abandoned other productivity apps
- **Design Language:** Terminal/command-center aesthetic — dark theme, monospace fonts for data, but modern typography for communication. Think Linear.app meets Warp Terminal.
- **Tone of Voice:** Direct but warm. Like a best friend who happens to be a life coach. Never corporate. Never "hustle culture."

## CRITICAL: Rename All "Ascend/Ascendify" References

The app currently has inconsistent branding. Every instance of "Ascend" or "Ascendify" in the codebase must be renamed to "RESURGO" or "RESURGO.life". Check:
- `layout.tsx`
- Loading screens
- Coach personas
- Settings page
- Any hardcoded strings
- Page titles and meta tags

---

# SECTION 2: CURRENT TECH STACK

## What Stays (DO NOT CHANGE):

```
┌──────────────────────────────────────────────────┐
│                 RESURGO.LIFE STACK                │
├──────────────────────────────────────────────────┤
│                                                  │
│  🔐 AUTH:       Clerk            → KEEP AS-IS    │
│  🗄️ DATABASE:   Convex           → KEEP AS-IS    │
│  🌐 HOSTING:    Vercel           → KEEP AS-IS    │
│  🎨 FRONTEND:   Next.js + React  → KEEP AS-IS    │
│  💅 STYLING:    Tailwind CSS     → KEEP AS-IS    │
│                                                  │
│  🤖 AI:         Groq + Google    → ADD (new)     │
│  💳 PAYMENTS:   Dodo Payments    → ADD (new)     │
│  📱 MESSAGING:  Telegram Bot     → ADD keys      │
│                                                  │
│  ❌ REMOVE:     Nothing                          │
│  ❌ REWRITE:    Nothing                          │
│  ❌ DO NOT USE: Clerk Billing (blocked in India) │
│  ❌ DO NOT USE: Better Auth (unnecessary switch) │
│  ❌ DO NOT USE: PyTorch (overkill, use LLM APIs) │
│                                                  │
└──────────────────────────────────────────────────┘
```

## What Clerk Is Used For (Auth ONLY):

```
✅ KEEP: <SignInButton />
✅ KEEP: <UserButton />
✅ KEEP: <SignUp />
✅ KEEP: auth() in API routes
✅ KEEP: useUser() hook
✅ KEEP: useAuth() hook
✅ KEEP: Clerk middleware (middleware.ts)
✅ KEEP: User management dashboard
✅ KEEP: Session handling
✅ KEEP: All existing Clerk environment variables

❌ SKIP: <PricingTable /> (build custom pricing page)
❌ SKIP: Clerk Dashboard → Billing section
❌ SKIP: has({ plan: 'pro' }) for entitlements
❌ SKIP: Any Clerk Billing checkout URLs
```

## Why Not Clerk Billing?

Clerk Billing is explicitly NOT supported in India. Their documentation states: "Clerk Billing is not supported in Brazil, India, Malaysia, Mexico, Singapore, and Thailand due to payment processing restrictions." The founder is India-based. This is a hard blocker with no workaround.

## Why Not Stripe Directly?

Stripe India is invite-only, has high fees (2-4.5%+), and requires the founder to handle all tax, VAT, FEMA, and RBI compliance manually. Not practical for a solo founder.

## Why Not Better Auth?

Clerk is already working. Auth is the most painful thing to migrate. A switch would cost 2-3 weeks minimum for zero user-facing benefit. Never rewrite infrastructure that's already working before the first sale.

## Why Not PyTorch?

Training an LLM from scratch requires massive GPU infrastructure, millions of training examples, and ML engineering expertise. The app needs LLM APIs (Groq, Google, OpenRouter) with well-crafted system prompts and user context injection. This gives 95% of the same result at 0.01% of the cost and complexity.

---

# SECTION 3: CRITICAL BUG FIXES & ENVIRONMENT VARIABLES

## Bug: Loading Screen Hang

**Symptom:** After login, screen shows "INITIALIZING_SYSTEM_ LOADING WORKSPACE..." and never progresses.

**Root Cause:** `CLERK_FRONTEND_API_URL` is not set in Convex Dashboard environment variables. The `auth.config.js` reads `process.env.CLERK_FRONTEND_API_URL` to validate Clerk JWTs. Without it, every authenticated Convex query returns undefined forever.

**Fix:**
1. Go to Clerk Dashboard → API Keys → copy Frontend API URL (format: `https://your-project.clerk.accounts.dev`)
2. Go to Convex Dashboard → Settings → Environment Variables
3. Add: `CLERK_FRONTEND_API_URL` = `https://your-project.clerk.accounts.dev`
4. **STATUS: FIXED** ✅

## Additional Loading Resilience (Implement These):

```typescript
// In useStoreUser.ts or wherever the init sequence runs:
// Add a 10-second timeout + error message

const INIT_TIMEOUT_MS = 10_000;

useEffect(() => {
  const timer = setTimeout(() => {
    if (isLoading) {
      setError('Loading is taking longer than expected. Please refresh the page.');
      setIsLoading(false);
    }
  }, INIT_TIMEOUT_MS);

  return () => clearTimeout(timer);
}, [isLoading]);
```

**Rule: Every screen must have THREE states: Loading, Loaded, and Error. If the Error state is missing anywhere, add it.**

## All Required Environment Variables:

### Vercel Environment Variables:
```env
# ── CLERK (already set) ──
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ── CONVEX (already set) ──
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=...

# ── AI PROVIDERS (ADD THESE — ALL FREE) ──
GROQ_API_KEY=gsk_...
GOOGLE_AI_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...
GITHUB_PAT=ghp_...

# ── DODO PAYMENTS (ADD AFTER KYC) ──
DODO_API_KEY=...
DODO_WEBHOOK_SECRET=...

# ── TELEGRAM (ADD THESE) ──
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...
```

### Convex Dashboard Environment Variables:
```env
CLERK_FRONTEND_API_URL=https://your-project.clerk.accounts.dev
```

---

# SECTION 4: PAYMENT SYSTEM — DODO PAYMENTS

## Why Dodo Payments?

Dodo Payments is a Merchant of Record (MoR) built specifically for Indian solopreneurs and micro-SaaS companies selling globally. It handles:
- Global payment collection (USD, EUR, GBP, etc.)
- Tax, VAT, GST compliance in 220+ countries
- FEMA and RBI compliance for Indian businesses
- Converts to INR and deposits to Indian bank account
- No US entity required
- No invite needed (unlike Stripe India)
- KYC approval typically under 48 hours
- Fee: 5% + $0.50 per transaction

## Money Flow:
```
Customer (anywhere in world, any currency)
    ↓
Dodo Payments (processes payment, handles tax)
    ↓
Converts to INR
    ↓
Your Indian Bank Account (weekly payouts)
    ↓
You 🎉
```

## Setup Steps:
```
1. Sign up at dodopayments.com
2. Complete KYC: PAN card, Aadhaar, bank account details
3. Wait for approval (24-48 hours)
4. Create 3 products in Dodo dashboard:
   - "Resurgo Pro Monthly" → $4.99/month (recurring)
   - "Resurgo Pro Annual" → $29.99/year (recurring)
   - "Resurgo Lifetime" → $49.99 (one-time)
5. Get your:
   - DODO_API_KEY
   - DODO_WEBHOOK_SECRET
   - Checkout URLs for each product
6. Add keys to Vercel environment variables
7. Deploy webhook route (code below)
8. Deploy pricing page (code below)
9. Test with a real small payment
```

## Webhook Route:

```typescript
// File: src/app/api/webhooks/dodo/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import crypto from 'crypto';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Verify webhook signature to prevent fake calls
function verifySignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-dodo-signature');

  // Verify webhook authenticity
  if (!verifySignature(body, signature, process.env.DODO_WEBHOOK_SECRET!)) {
    console.error('[Dodo Webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.type) {
      case 'subscription.active': {
        const customerEmail = event.data.customer.email;
        const productId = event.data.product_id;

        // Map product IDs to plan names
        let plan = 'pro';
        if (productId === process.env.DODO_LIFETIME_PRODUCT_ID) {
          plan = 'lifetime';
        }

        await convex.mutation(api.users.updatePlan, {
          email: customerEmail,
          plan,
          subscriptionId: event.data.subscription_id || null,
          expiresAt: event.data.current_period_end || null,
          paymentProvider: 'dodo',
        });
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        await convex.mutation(api.users.updatePlan, {
          email: event.data.customer.email,
          plan: 'free',
          subscriptionId: null,
          expiresAt: null,
          paymentProvider: null,
        });
        break;
      }

      case 'payment.succeeded': {
        // For lifetime purchases (one-time)
        if (event.data.product_id === process.env.DODO_LIFETIME_PRODUCT_ID) {
          await convex.mutation(api.users.updatePlan, {
            email: event.data.customer.email,
            plan: 'lifetime',
            subscriptionId: null,
            expiresAt: null,
            paymentProvider: 'dodo',
          });
        }
        break;
      }

      case 'payment.failed': {
        // Log but don't downgrade immediately
        // Dodo handles retry logic
        console.warn('[Dodo Webhook] Payment failed for:', event.data.customer?.email);
        break;
      }

      default:
        console.log('[Dodo Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Dodo Webhook] Processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

## Convex Mutation for Plan Updates:

```typescript
// File: convex/users.ts — ADD this mutation

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const updatePlan = mutation({
  args: {
    email: v.string(),
    plan: v.string(),
    subscriptionId: v.union(v.string(), v.null()),
    expiresAt: v.union(v.string(), v.null()),
    paymentProvider: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (!user) {
      console.error('[updatePlan] User not found:', args.email);
      return;
    }

    await ctx.db.patch(user._id, {
      plan: args.plan,
      subscriptionId: args.subscriptionId,
      planExpiresAt: args.expiresAt,
      paymentProvider: args.paymentProvider,
      planUpdatedAt: Date.now(),
    });
  },
});

// Query to get current user with plan info
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) =>
        q.eq('clerkId', identity.subject)
      )
      .first();

    return user;
  },
});
```

## Ensure User Schema Has Plan Fields:

```typescript
// In your Convex schema (convex/schema.ts), ensure users table has:

users: defineTable({
  // ... existing fields ...
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),

  // Plan fields (ADD these if missing)
  plan: v.optional(v.string()),           // 'free' | 'pro' | 'lifetime'
  isAdmin: v.optional(v.boolean()),       // For giving yourself free Pro
  subscriptionId: v.optional(v.union(v.string(), v.null())),
  planExpiresAt: v.optional(v.union(v.string(), v.null())),
  paymentProvider: v.optional(v.union(v.string(), v.null())),
  planUpdatedAt: v.optional(v.number()),

  // Onboarding fields (ADD these if missing)
  onboardingComplete: v.optional(v.boolean()),
  lifeSituation: v.optional(v.string()),
  energyPattern: v.optional(v.string()),
  communicationStyle: v.optional(v.string()),
  workingHours: v.optional(v.string()),
})
  .index('by_clerk_id', ['clerkId'])
  .index('by_email', ['email']),
```

---

# SECTION 5: ENTITLEMENTS & PLAN GATING

Since we can't use Clerk's `has()` for billing checks, build our own entitlement system:

```typescript
// File: src/lib/entitlements.ts

export type PlanType = 'free' | 'pro' | 'lifetime';

export interface PlanLimits {
  maxGoals: number;
  maxBrainDumpsPerDay: number;
  maxAIMessagesPerDay: number;
  allCoaches: boolean;
  advancedAnalytics: boolean;
  telegramPro: boolean;
  budgetTracking: boolean;
  weeklyAIReview: boolean;
  emergencyMode: boolean;
  aiToolkit: boolean;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxGoals: 3,
    maxBrainDumpsPerDay: 5,
    maxAIMessagesPerDay: 10,
    allCoaches: false,          // Only PHOENIX coach on free
    advancedAnalytics: false,
    telegramPro: false,
    budgetTracking: false,
    weeklyAIReview: false,
    emergencyMode: true,        // Keep this free — it's a safety feature
    aiToolkit: false,
  },
  pro: {
    maxGoals: Infinity,
    maxBrainDumpsPerDay: Infinity,
    maxAIMessagesPerDay: Infinity,
    allCoaches: true,
    advancedAnalytics: true,
    telegramPro: true,
    budgetTracking: true,
    weeklyAIReview: true,
    emergencyMode: true,
    aiToolkit: true,
  },
  lifetime: {
    maxGoals: Infinity,
    maxBrainDumpsPerDay: Infinity,
    maxAIMessagesPerDay: Infinity,
    allCoaches: true,
    advancedAnalytics: true,
    telegramPro: true,
    budgetTracking: true,
    weeklyAIReview: true,
    emergencyMode: true,
    aiToolkit: true,
  },
};

export function getPlanLimits(plan?: string | null): PlanLimits {
  const validPlan = (plan as PlanType) || 'free';
  return PLAN_LIMITS[validPlan] || PLAN_LIMITS.free;
}

export function canAccess(
  userPlan: string | null | undefined,
  isAdmin: boolean | undefined,
  feature: keyof PlanLimits
): boolean {
  // Admins always have full access
  if (isAdmin) return true;

  const limits = getPlanLimits(userPlan);
  const value = limits[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return false;
}

export function getRemainingUsage(
  userPlan: string | null | undefined,
  isAdmin: boolean | undefined,
  feature: 'maxGoals' | 'maxBrainDumpsPerDay' | 'maxAIMessagesPerDay',
  currentUsage: number
): { remaining: number; limit: number; isUnlimited: boolean } {
  if (isAdmin) return { remaining: Infinity, limit: Infinity, isUnlimited: true };

  const limits = getPlanLimits(userPlan);
  const limit = limits[feature];

  if (limit === Infinity) return { remaining: Infinity, limit, isUnlimited: true };

  return {
    remaining: Math.max(0, limit - currentUsage),
    limit,
    isUnlimited: false,
  };
}
```

## React Hook for Entitlements:

```typescript
// File: src/hooks/usePlan.ts

import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { canAccess, getPlanLimits, getRemainingUsage, type PlanLimits } from '@/lib/entitlements';

export function usePlan() {
  const user = useQuery(api.users.getCurrentUser);

  const plan = user?.plan || 'free';
  const isAdmin = user?.isAdmin || false;
  const limits = getPlanLimits(plan);

  return {
    plan,
    isAdmin,
    isPro: plan === 'pro' || plan === 'lifetime' || isAdmin,
    limits,
    can: (feature: keyof PlanLimits) => canAccess(plan, isAdmin, feature),
    remaining: (
      feature: 'maxGoals' | 'maxBrainDumpsPerDay' | 'maxAIMessagesPerDay',
      currentUsage: number
    ) => getRemainingUsage(plan, isAdmin, feature, currentUsage),
  };
}

// Usage in any component:
// const { can, isPro, remaining } = usePlan();
// if (!can('advancedAnalytics')) return <UpgradePrompt />;
// const { remaining: dumpsLeft } = remaining('maxBrainDumpsPerDay', todaysDumps);
```

## Upgrade Prompt Component:

```tsx
// File: src/components/UpgradePrompt.tsx

'use client';

interface UpgradePromptProps {
  feature: string;
  message?: string;
}

export function UpgradePrompt({ feature, message }: UpgradePromptProps) {
  return (
    <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-6 text-center">
      <p className="text-yellow-400 text-lg mb-2">
        {'>'} {feature} requires Pro_
      </p>
      <p className="text-zinc-400 text-sm mb-4">
        {message || 'Upgrade to unlock unlimited access to all features.'}
      </p>
      <a
        href="/pricing"
        className="inline-block bg-green-500 text-black px-6 py-2 rounded font-bold hover:bg-green-400 transition"
      >
        View Plans →
      </a>
    </div>
  );
}
```

---

# SECTION 6: AI PROVIDER SYSTEM

## Free AI APIs (No Credit Card Required):

| Provider | Signup | Free Limits | Best For | Model |
|----------|--------|-------------|----------|-------|
| **Groq** | console.groq.com | ~30 RPM, 14,400 req/day | Coaching, brain dumps, conversations | `llama-3.3-70b-versatile` |
| **Google AI Studio** | aistudio.google.com | 1,500 req/day, 1M tokens/min | Summarization, bulk processing, templates | `gemini-2.5-flash` |
| **OpenRouter** | openrouter.ai | Varies by model (`:free` models) | Fallback when others hit limits | `meta-llama/llama-3.3-70b-instruct:free` |
| **GitHub Models** | github.com (existing PAT) | Included with GitHub account | Emergency fallback | `openai/gpt-4o-mini` |
| **Cloudflare Workers AI** | dash.cloudflare.com | 10,000 req/day | Backup, image generation | Various open-source |

## Multi-Provider Router (Production Code):

```typescript
// File: src/lib/ai/provider-router.ts

import OpenAI from 'openai';

// ============================================
// PROVIDER CONFIGURATION
// ============================================

interface AIProvider {
  name: string;
  client: OpenAI;
  model: string;
  priority: number;
  maxRPM: number;
  requestsThisMinute: number;
  minuteStart: number;
  healthScore: number;
  bestFor: string[];
}

function createProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env.GROQ_API_KEY) {
    providers.push({
      name: 'groq',
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: 'llama-3.3-70b-versatile',
      priority: 1,
      maxRPM: 30,
      requestsThisMinute: 0,
      minuteStart: Date.now(),
      healthScore: 100,
      bestFor: ['coaching', 'braindump', 'conversation'],
    });
  }

  if (process.env.GOOGLE_AI_KEY) {
    providers.push({
      name: 'google',
      client: new OpenAI({
        apiKey: process.env.GOOGLE_AI_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      }),
      model: 'gemini-2.5-flash',
      priority: 2,
      maxRPM: 60,
      requestsThisMinute: 0,
      minuteStart: Date.now(),
      healthScore: 100,
      bestFor: ['summarization', 'analysis', 'templates', 'bulk'],
    });
  }

  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: 'openrouter',
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      }),
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      priority: 3,
      maxRPM: 20,
      requestsThisMinute: 0,
      minuteStart: Date.now(),
      healthScore: 100,
      bestFor: ['fallback'],
    });
  }

  if (process.env.GITHUB_PAT) {
    providers.push({
      name: 'github',
      client: new OpenAI({
        apiKey: process.env.GITHUB_PAT,
        baseURL: 'https://models.github.ai/inference',
      }),
      model: 'openai/gpt-4o-mini',
      priority: 4,
      maxRPM: 15,
      requestsThisMinute: 0,
      minuteStart: Date.now(),
      healthScore: 100,
      bestFor: ['emergency-fallback'],
    });
  }

  return providers;
}

const providers = createProviders();

// ============================================
// RATE LIMIT TRACKER
// ============================================

function checkRateLimit(provider: AIProvider): boolean {
  const now = Date.now();
  if (now - provider.minuteStart > 60_000) {
    provider.requestsThisMinute = 0;
    provider.minuteStart = now;
  }
  return provider.requestsThisMinute < provider.maxRPM;
}

function recordRequest(provider: AIProvider, success: boolean): void {
  provider.requestsThisMinute++;
  const score = success ? 100 : 0;
  provider.healthScore = provider.healthScore * 0.9 + score * 0.1;
}

// ============================================
// SMART ROUTER
// ============================================

type TaskType = 'coaching' | 'braindump' | 'summarization' |
                'analysis' | 'templates' | 'conversation' | 'bulk';

function selectProvider(taskType?: TaskType): AIProvider | null {
  const available = providers
    .filter(p => checkRateLimit(p) && p.healthScore > 20)
    .sort((a, b) => {
      const aMatch = taskType && a.bestFor.includes(taskType) ? -10 : 0;
      const bMatch = taskType && b.bestFor.includes(taskType) ? -10 : 0;
      return (aMatch + a.priority) - (bMatch + b.priority)
             || b.healthScore - a.healthScore;
    });

  return available[0] || null;
}

// ============================================
// MAIN API — CALL WITH RETRY + FALLBACK
// ============================================

export interface AIRequest {
  systemPrompt: string;
  userMessage: string;
  taskType?: TaskType;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  latencyMs: number;
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const maxRetries = providers.length;
  const errors: Error[] = [];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const provider = selectProvider(request.taskType);

    if (!provider) {
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    const startTime = Date.now();

    try {
      const response = await Promise.race([
        provider.client.chat.completions.create({
          model: provider.model,
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2048,
          ...(request.jsonMode && provider.name !== 'openrouter'
            ? { response_format: { type: 'json_object' as const } }
            : {}),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 15_000)
        ),
      ]);

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from AI');
      }

      recordRequest(provider, true);

      return {
        content,
        provider: provider.name,
        model: provider.model,
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      recordRequest(provider, false);
      errors.push(error instanceof Error ? error : new Error(String(error)));

      console.error(
        `[AI Router] ${provider.name} failed (attempt ${attempt + 1}):`,
        error instanceof Error ? error.message : error
      );

      if (error instanceof Error && error.message.includes('429')) {
        provider.requestsThisMinute = provider.maxRPM;
      }

      continue;
    }
  }

  throw new Error(
    `All AI providers failed after ${maxRetries} attempts. Errors: ${
      errors.map(e => e.message).join('; ')
    }`
  );
}
```

---

# SECTION 7: BRAIN DUMP SYSTEM (COMPLETE)

## 7A: JSON Schema (Zod)

```typescript
// File: src/lib/ai/brain-dump/schema.ts

import { z } from 'zod';

export const TaskCategory = z.enum([
  'WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 'LEARNING',
  'SOCIAL', 'HOME', 'CREATIVE', 'ADMIN', 'URGENT_LIFE',
]);

export const TaskPriority = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const EmotionTag = z.enum([
  'overwhelmed', 'anxious', 'frustrated', 'hopeful',
  'motivated', 'exhausted', 'confused', 'guilty',
  'neutral', 'excited',
]);

export const ParsedTaskSchema = z.object({
  title: z.string()
    .min(2, 'Task title must be at least 2 characters')
    .max(200, 'Task title must be under 200 characters'),
  category: TaskCategory,
  priority: TaskPriority,
  estimated_minutes: z.number().int().min(5).max(480).nullable(),
  suggested_due: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format')
    .nullable(),
  depends_on: z.string().nullable(),
  relates_to_goal: z.string().nullable(),
  energy_level: z.enum(['high', 'medium', 'low']),
  is_recurring: z.boolean(),
  recurrence_pattern: z.string().nullable(),
});

export const BrainDumpResponseSchema = z.object({
  emotions_detected: z.array(EmotionTag).min(1),
  emotional_acknowledgment: z.string().min(10).max(300),
  tasks: z.array(ParsedTaskSchema).min(0).max(50),
  habits_suggested: z.array(z.object({
    name: z.string(),
    frequency: z.enum(['daily', 'weekly', '3x_week', 'weekdays']),
    reason: z.string().max(100),
  })),
  patterns_observed: z.string().max(500).nullable(),
  quick_win: z.string().max(200),
  total_estimated_hours: z.number().nullable(),
  overcommitment_warning: z.boolean(),
  overcommitment_message: z.string().max(300).nullable(),
});

export type ParsedTask = z.infer<typeof ParsedTaskSchema>;
export type BrainDumpResponse = z.infer<typeof BrainDumpResponseSchema>;
```

## 7B: Parsing System Prompt

```typescript
// File: src/lib/ai/brain-dump/prompt.ts

import type { UserContext } from '../types';

export function buildBrainDumpSystemPrompt(
  userContext: UserContext,
  todayDate: string
): string {
  return `
# ROLE
You are RESURGO's Brain Dump Parser. The user has just poured out
everything on their mind. Your job is to:
1. FIRST acknowledge their emotions (don't skip this)
2. Extract every actionable task
3. Identify potential habits
4. Flag overcommitment
5. Suggest a quick win

# TODAY'S DATE
${todayDate}

# USER CONTEXT
Name: ${userContext.name || 'User'}
Situation: ${userContext.lifeSituation || 'Unknown'}
Energy Pattern: ${userContext.energyPattern || 'Unknown'}
Active Goals: ${userContext.goals?.map(g => g.title).join(', ') || 'None set'}
Existing Tasks: ${userContext.existingTaskCount || 0} tasks already pending
Working Hours: ${userContext.workingHours || 'Unknown'}

# PARSING RULES

## Task Extraction
- Extract EVERY actionable item, even vague ones
- "I need to start exercising" → Task: "Go for a 20-minute walk" (make concrete)
- "My boss is annoying" → NOT a task (emotional venting — acknowledge it)
- "I should probably call my mom" → Task: "Call mom" (remove hedging)
- If something is both a task AND an emotion, create the task AND acknowledge

## Priority Assignment
- CRITICAL: Hard deadline within 48 hours, or serious consequences if missed
- HIGH: Important for goals, due within a week, or blocks other tasks
- MEDIUM: Important but no urgent deadline
- LOW: Nice to have, aspirational, or can wait

## Energy Level Assignment
- high: Creative work, difficult conversations, complex problem-solving
- medium: Admin, calls, shopping, moderate thinking
- low: Organizing, simple emails, cleaning, routine tasks

## Date Suggestions
- "by Friday" → calculate actual date from today
- "next week" → next Monday
- "soon" → 3 days from today
- No time indicator → null (don't guess)

## Habit Detection
- If someone mentions wanting to do something regularly, suggest as habit
- Don't create habits for one-time tasks

## Overcommitment Detection
- If total estimated hours > 40 for tasks due this week → overcommitted
- If user already has ${userContext.existingTaskCount || 0} pending tasks
  and is adding 10+ more → flag it

# OUTPUT FORMAT
Respond with ONLY valid JSON. No markdown. No explanation.
No text before or after the JSON.

{
  "emotions_detected": ["overwhelmed"],
  "emotional_acknowledgment": "string",
  "tasks": [{
    "title": "string",
    "category": "WORK|PERSONAL|HEALTH|FINANCE|LEARNING|SOCIAL|HOME|CREATIVE|ADMIN|URGENT_LIFE",
    "priority": "CRITICAL|HIGH|MEDIUM|LOW",
    "estimated_minutes": number|null,
    "suggested_due": "YYYY-MM-DD"|null,
    "depends_on": "task title"|null,
    "relates_to_goal": "goal title"|null,
    "energy_level": "high|medium|low",
    "is_recurring": boolean,
    "recurrence_pattern": "daily|weekly|etc"|null
  }],
  "habits_suggested": [{"name": "string", "frequency": "daily|weekly|3x_week|weekdays", "reason": "string"}],
  "patterns_observed": "string"|null,
  "quick_win": "string",
  "total_estimated_hours": number|null,
  "overcommitment_warning": boolean,
  "overcommitment_message": "string"|null
}
`.trim();
}
```

## 7C: Validator + Retry + Repair Pipeline

```typescript
// File: src/lib/ai/brain-dump/parser.ts

import { callAI, type AIResponse } from '../provider-router';
import { BrainDumpResponseSchema, type BrainDumpResponse } from './schema';
import { buildBrainDumpSystemPrompt } from './prompt';
import type { UserContext } from '../types';

// ============================================
// ERROR LOGGING
// ============================================

interface ParseAttemptLog {
  timestamp: string;
  attempt: number;
  provider: string;
  rawResponsePreview: string;
  error: string | null;
  success: boolean;
  repairAttempted: boolean;
  latencyMs: number;
}

const parseLog: ParseAttemptLog[] = [];

function logAttempt(entry: ParseAttemptLog): void {
  parseLog.push(entry);
  if (parseLog.length > 100) parseLog.shift();
  if (!entry.success) {
    console.error('[BrainDump Parser] Failed attempt:', {
      attempt: entry.attempt,
      provider: entry.provider,
      error: entry.error,
    });
  }
}

export function getParseLog(): ParseAttemptLog[] {
  return [...parseLog];
}

// ============================================
// JSON EXTRACTION & CLEANING
// ============================================

function extractJSON(raw: string): string {
  // Strategy 1: Already valid JSON
  try {
    JSON.parse(raw);
    return raw;
  } catch { /* continue */ }

  // Strategy 2: Markdown code block
  const codeBlockMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Strategy 3: First { to last }
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return raw.substring(firstBrace, lastBrace + 1);
  }

  return raw;
}

function sanitizeJSON(jsonStr: string): string {
  return jsonStr
    .replace(/,\s*([}\]])/g, '$1')           // Trailing commas
    .replace(/[\x00-\x1F\x7F]/g, (char) => { // Control chars
      if (['\n', '\r', '\t'].includes(char)) return char;
      return '';
    });
}

// ============================================
// VALIDATION
// ============================================

interface ValidationResult {
  success: boolean;
  data?: BrainDumpResponse;
  errors?: string[];
}

function validateResponse(raw: string): ValidationResult {
  try {
    const jsonStr = extractJSON(raw);
    const sanitized = sanitizeJSON(jsonStr);

    let parsed: unknown;
    try {
      parsed = JSON.parse(sanitized);
    } catch (jsonError) {
      return { success: false, errors: [`Invalid JSON: ${(jsonError as Error).message}`] };
    }

    const result = BrainDumpResponseSchema.safeParse(parsed);
    if (result.success) return { success: true, data: result.data };

    return {
      success: false,
      errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
    };
  } catch (error) {
    return { success: false, errors: [`Unexpected: ${(error as Error).message}`] };
  }
}

// ============================================
// REPAIR PROMPT
// ============================================

function buildRepairPrompt(original: string, errors: string[]): string {
  return `
The previous JSON response had validation errors.
Fix ONLY the errors below and return corrected JSON.
No text before or after the JSON.

ERRORS:
${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}

ORIGINAL (fix this):
${original}
`.trim();
}

// ============================================
// MAIN PARSER
// ============================================

export interface BrainDumpInput {
  rawText: string;
  userContext: UserContext;
}

export interface BrainDumpResult {
  success: boolean;
  data?: BrainDumpResponse;
  error?: string;
  provider?: string;
  totalLatencyMs: number;
  attempts: number;
}

export async function parseBrainDump(input: BrainDumpInput): Promise<BrainDumpResult> {
  const { rawText, userContext } = input;
  const startTime = Date.now();
  const today = new Date().toISOString().split('T')[0];

  // Guards
  if (!rawText || rawText.trim().length < 3) {
    return { success: false, error: 'Too short. Tell me more.', totalLatencyMs: 0, attempts: 0 };
  }

  const truncatedText = rawText.length > 5000
    ? rawText.substring(0, 5000) + '\n[...truncated]'
    : rawText;

  const systemPrompt = buildBrainDumpSystemPrompt(userContext, today);

  // ── ATTEMPT 1: Fresh parse ──
  let aiResponse: AIResponse;
  try {
    aiResponse = await callAI({
      systemPrompt,
      userMessage: truncatedText,
      taskType: 'braindump',
      temperature: 0.3,
      maxTokens: 4096,
      jsonMode: true,
    });
  } catch (error) {
    logAttempt({
      timestamp: new Date().toISOString(), attempt: 1,
      provider: 'all-failed', rawResponsePreview: '',
      error: (error as Error).message, success: false,
      repairAttempted: false, latencyMs: Date.now() - startTime,
    });
    return {
      success: false,
      error: 'AI temporarily unavailable. Please try again.',
      totalLatencyMs: Date.now() - startTime, attempts: 1,
    };
  }

  const v1 = validateResponse(aiResponse.content);
  logAttempt({
    timestamp: new Date().toISOString(), attempt: 1,
    provider: aiResponse.provider,
    rawResponsePreview: aiResponse.content.substring(0, 300),
    error: v1.errors?.join('; ') || null, success: v1.success,
    repairAttempted: false, latencyMs: aiResponse.latencyMs,
  });

  if (v1.success && v1.data) {
    return {
      success: true, data: v1.data, provider: aiResponse.provider,
      totalLatencyMs: Date.now() - startTime, attempts: 1,
    };
  }

  // ── ATTEMPT 2: Repair ──
  try {
    const repairResponse = await callAI({
      systemPrompt: 'You are a JSON repair assistant. Return ONLY valid JSON.',
      userMessage: buildRepairPrompt(aiResponse.content, v1.errors || []),
      taskType: 'analysis', temperature: 0.1, maxTokens: 4096, jsonMode: true,
    });

    const v2 = validateResponse(repairResponse.content);
    logAttempt({
      timestamp: new Date().toISOString(), attempt: 2,
      provider: repairResponse.provider,
      rawResponsePreview: repairResponse.content.substring(0, 300),
      error: v2.errors?.join('; ') || null, success: v2.success,
      repairAttempted: true, latencyMs: repairResponse.latencyMs,
    });

    if (v2.success && v2.data) {
      return {
        success: true, data: v2.data, provider: repairResponse.provider,
        totalLatencyMs: Date.now() - startTime, attempts: 2,
      };
    }
  } catch { /* continue to attempt 3 */ }

  // ── ATTEMPT 3: Complete re-parse ──
  try {
    const retry = await callAI({
      systemPrompt: systemPrompt + '\n\nCRITICAL: Be EXTREMELY careful with JSON. Double-check every comma and bracket.',
      userMessage: truncatedText,
      taskType: 'braindump', temperature: 0.2, maxTokens: 4096, jsonMode: true,
    });

    const v3 = validateResponse(retry.content);
    logAttempt({
      timestamp: new Date().toISOString(), attempt: 3,
      provider: retry.provider,
      rawResponsePreview: retry.content.substring(0, 300),
      error: v3.errors?.join('; ') || null, success: v3.success,
      repairAttempted: false, latencyMs: retry.latencyMs,
    });

    if (v3.success && v3.data) {
      return {
        success: true, data: v3.data, provider: retry.provider,
        totalLatencyMs: Date.now() - startTime, attempts: 3,
      };
    }
  } catch { /* all failed */ }

  // ── ALL FAILED ──
  return {
    success: false,
    error: 'Had trouble parsing. Try breaking it into shorter points.',
    totalLatencyMs: Date.now() - startTime, attempts: 3,
  };
}
```

## 7D: API Route

```typescript
// File: src/app/api/brain-dump/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { parseBrainDump } from '@/lib/ai/brain-dump/parser';
import { getUserContext } from '@/lib/user-context';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { text: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'Missing "text" field' }, { status: 400 });
  }

  const userContext = await getUserContext(userId);

  // TODO: Check rate limit (5/day free, unlimited pro)
  // const { can } = checkEntitlements(userContext);
  // if (!can('maxBrainDumpsPerDay', todayCount)) return 402;

  const result = await parseBrainDump({ rawText: body.text, userContext });

  if (!result.success) {
    return NextResponse.json({
      success: false, error: result.error,
      attempts: result.attempts, latencyMs: result.totalLatencyMs,
    }, { status: 422 });
  }

  return NextResponse.json({
    success: true, data: result.data,
    meta: {
      provider: result.provider, attempts: result.attempts,
      latencyMs: result.totalLatencyMs,
      taskCount: result.data!.tasks.length,
      habitCount: result.data!.habits_suggested.length,
    },
  });
}
```

## 7E: Shared Types

```typescript
// File: src/lib/ai/types.ts

export interface UserContext {
  name?: string;
  email?: string;
  plan?: string;
  isAdmin?: boolean;
  lifeSituation?: string;
  energyPattern?: string;
  communicationStyle?: string;
  workingHours?: string;
  schedule?: string;
  goals?: Array<{ title: string; status: string; progress: number }>;
  tasks?: Array<{ title: string; priority?: string; dueDate?: string }>;
  habits?: Array<{ name: string; currentStreak: number; bestStreak: number }>;
  existingTaskCount?: number;
  recentActivity?: string;
  patterns?: string;
}
```

---

# SECTION 8: AI COACHING ENGINE

## Master System Prompt:

```typescript
// File: src/lib/ai/coaching-system-prompt.ts

import type { UserContext } from './types';

export function buildCoachingSystemPrompt(userContext: UserContext): string {
  return `
# IDENTITY
You are RESURGO, an AI life management partner. You are NOT a generic
chatbot. You are the user's personal accountability partner who knows
their life context and cares about their progress.

# YOUR PERSONALITY
- Direct but warm. Like a best friend who's also a life coach.
- You call out avoidance gently but clearly.
- You celebrate small wins genuinely.
- NEVER use corporate motivational language ("synergy", "hustle",
  "grind", "manifest").
- Speak like a real human. Casual but intelligent.
- If the user is overwhelmed, you simplify.
- If they're coasting, you challenge.

# CORE PHILOSOPHY
- Systems over motivation. Motivation is unreliable. Systems work.
- "Design for your worst day, not your best day."
- Progress over perfection. Doing 50% beats abandoning 100%.
- Recovery is part of the plan. Missing a day ≠ failure.
- Finishing > starting. Prioritize completing over starting new things.
- Honest assessment > false positivity.

# USER CONTEXT
Name: ${userContext.name || 'User'}
Situation: ${userContext.lifeSituation || 'Not shared yet — ask about this.'}
Goals: ${userContext.goals?.map(g => `${g.title} (${g.progress}%)`).join(', ') || 'None set'}
Active Tasks: ${userContext.existingTaskCount || 0} pending
Habit Streaks: ${userContext.habits?.map(h => `${h.name}: ${h.currentStreak}d`).join(', ') || 'None'}
Recent Activity: ${userContext.recentActivity || 'Unknown'}
Communication Style: ${userContext.communicationStyle || 'balanced'}
Known Patterns: ${userContext.patterns || 'Not yet identified'}

# BEHAVIORAL RULES

1. BRAIN DUMP PROCESSING:
   Parse into: actionable tasks + emotions + underlying concerns.
   Acknowledge emotions FIRST, then organize tasks.

2. TASK PRIORITIZATION:
   a) Deadlines (soonest first)
   b) Dependencies (what blocks other things?)
   c) Impact (what moves the needle most?)
   d) Energy match (hard tasks for high-energy, easy for low)

3. ACCOUNTABILITY WITHOUT GUILT:
   - If they missed tasks: "What got in the way? Let's adjust."
   - Track patterns. If they consistently miss same type of task, surface it.

4. PROACTIVE SUGGESTIONS:
   Suggest things they haven't thought of based on their goals.

5. WHEN THEY DON'T KNOW WHAT TO DO:
   "We don't need a 5-year plan. What's one thing bugging you this week?"

6. RESPONSE FORMAT:
   - Under 200 words unless analyzing a brain dump
   - Bullet points for lists
   - ✅ completed, ⏳ in-progress, 🔴 overdue
   - End with ONE question or ONE next action

# NEVER
- Give medical, legal, or financial investment advice
- Be passive ("Whatever you want!")
- Overwhelm with 10+ suggestions (max 3 at a time)
- Sound like a corporate wellness app
`.trim();
}
```

---

# SECTION 9: AI ONBOARDING FLOW

## The "Deep Ask" — Conversational Onboarding:

```typescript
// File: src/lib/ai/onboarding-flow.ts

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    type: 'ai_message' as const,
    content: `Hey. Welcome to RESURGO. 👋

I'm not going to ask you to set up categories and color-code your life.
Instead, let's just talk.

I want to understand where you are so I can actually help. Takes about 3 minutes.`,
    options: ["Let's do this", 'Skip for now'],
    skipTarget: 'dashboard',
  },
  {
    id: 'brain_state',
    type: 'open_text' as const,
    prompt: `What's on your mind right now? Don't organize it — just dump everything.
Tasks you're behind on, things stressing you out, stuff you keep forgetting. All of it.`,
    processor: 'brain_dump_parser',
  },
  {
    id: 'life_context',
    type: 'quick_select' as const,
    prompt: 'Help me understand your daily life:',
    questions: [
      {
        text: 'What best describes your situation?',
        options: ['Student', 'Employed full-time', 'Freelancer/Self-employed',
                  'Between things', 'Building something'],
      },
      {
        text: 'What does your schedule look like?',
        options: ['Fixed hours (9-5ish)', 'Flexible', 'Chaotic/unpredictable',
                  'What schedule?'],
      },
      {
        text: 'When do you have the most energy?',
        options: ['Morning person', 'Afternoon peak', 'Night owl',
                  'Honestly? Never lately'],
      },
    ],
  },
  {
    id: 'goals_check',
    type: 'branching' as const,
    prompt: 'Do you have clear goals right now, or figuring things out?',
    options: [
      { text: 'I know what I want to achieve', next: 'goal_capture' },
      { text: 'I have a vague idea', next: 'goal_exploration' },
      { text: "No clue. Just trying to get unstuck.", next: 'no_goals_comfort' },
    ],
  },
  {
    id: 'no_goals_comfort',
    type: 'ai_message' as const,
    content: `That's completely fine. Seriously.

Most apps make you feel broken without a 5-year plan. That's BS.

Here's what we do instead: focus on what's right in front of you.
Clear the mental clutter. Build momentum.
The direction reveals itself when you're actually moving.

Let's start with the tasks you dumped earlier and make today less chaotic.`,
    next: 'communication_style',
  },
  {
    id: 'communication_style',
    type: 'quick_select' as const,
    prompt: 'Last thing — how should I talk to you?',
    questions: [
      {
        text: 'Pick your coach style:',
        options: [
          '🤝 Gentle & encouraging',
          '📋 Straight-shooter — tell me what to do',
          '🔥 Push me hard — I need accountability',
          '🧠 Analytical — help me think through things',
        ],
      },
    ],
  },
  {
    id: 'complete',
    type: 'ai_message' as const,
    content: `I've got a picture of where you are.

[DYNAMIC: Show parsed tasks and suggested first actions]

Your dashboard is ready. I'll check in tomorrow morning.
You can always text me here or on Telegram to dump tasks, ask for help, or vent.

Let's go. 🚀`,
    action: 'save_and_redirect_dashboard',
  },
];
```

---

# SECTION 10: TELEGRAM BOT

## Status: Code is 100% complete — just needs environment variables.

### Activation Steps:
```
1. Message @BotFather on Telegram
2. Send /newbot → name it "RESURGO.life" → username @ResurgoLifeBot
3. Copy the bot token
4. Add to Vercel env: TELEGRAM_BOT_TOKEN=<token>
5. Generate a random webhook secret
6. Add to Vercel env: TELEGRAM_WEBHOOK_SECRET=<secret>
7. Set webhook URL: https://resurgo.life/api/telegram/webhook
8. Deploy
```

### Commands the Bot Should Support:
```
/start      → Onboarding flow
/add [task] → "Buy groceries" → AI categorizes + prioritizes
/today      → Today's prioritized tasks
/done [#]   → Mark task complete
/habits     → Check in on daily habits
/budget [amount] [category] → Log expense
/coach      → Open AI coach conversation
/dump       → Brain dump → AI parses into tasks
```

### Nudge Engine (Proactive Messages):
```
MORNING (user's wake time):
"Good morning! Today:
1. 🔴 Finish report (due today)
2. 🟡 Call dentist
3. 🟢 30-min walk (streak: Day 7!)
Reply ⚡/😐/😴 for your energy level."

MIDDAY (1 PM):
"Quick check: did you start #1? Reply ✅ or ❌"

EVENING (9 PM):
"Day recap: ✅ 3 done | ⏳ 1 carried | 🔥 Streak: Day 6
One thing for tomorrow: [suggestion]"
```

---

# SECTION 11: LANDING PAGE STRUCTURE

The current landing page is too sparse. Expand to 14+ sections:

```
SECTION 1: Hero
"Your life, finally organized. Zero setup. Zero learning curve."
[Animated terminal demo] [CTA: "Start Free"]

SECTION 2: The Problem
"You've tried 10 apps. You've abandoned all of them."
[Stats about app abandonment]

SECTION 3: How It Works (3 steps)
1. Dump everything → Tell AI what's on your mind
2. AI organizes → Priorities, schedules, structure
3. Get nudged → Telegram/WhatsApp keeps you going

SECTION 4: Brain Dump Feature Demo
Show the brain dump → parsed tasks animation

SECTION 5: Habit Tracking
Terminal-style habit streaks visualization

SECTION 6: AI Coach
Show the 6 coach personas with conversation examples

SECTION 7: Telegram Integration
"Your app, in your pocket. Zero friction."

SECTION 8: "Built for people who think differently"
ADHD-friendly design, zero cognitive load

SECTION 9: "For the person rebuilding after burnout"
Relatable use case

SECTION 10: "For the developer who forgets to take breaks"
Developer-specific use case

SECTION 11: Social proof / testimonials (placeholder)

SECTION 12: Demo video (60-second screen recording)

SECTION 13: Pricing (Free / Pro / Lifetime)

SECTION 14: FAQ (8+ questions)

SECTION 15: Final CTA
"Stop planning to get organized. Start now."

SECTION 16: Footer
```

---

# SECTION 13: NAVIGATION & UI FIXES

## Menu Bar:
- Make it look like an ACTUAL menu bar
- Horizontal nav with clearly labeled items
- Hover states, active state indicators
- Group nav items logically:
  ```
  Life    → TASKS, HABITS, GOALS
  Insights → ANALYTICS, CALENDAR
  Wellness → WELLNESS, BUDGET
  Work    → BUSINESS, FOCUS
  Tools   → AI COACH, PLAN BUILDER
  Account → SETTINGS
  ```
- On mobile: bottom tab bar (NOT hamburger menu)

## Typography:
- H1: minimum 28px
- H2: minimum 22px
- H3: minimum 18px
- Body: minimum 15px
- Terminal monospace for data labels ONLY
- Modern sans-serif for primary communication

## Add "What is RESURGO.life?":
First thing every new visitor sees — tagline under the logo:
**"AI-powered life management. Tasks, habits, budget — one place."**

## Terminal/Modern Toggle (Optional Future):
A CSS class toggle between terminal dark aesthetic and clean modern alternative (zinc-900 backgrounds, larger text, rounded-xl cards). Makes app accessible to non-terminal users.

---

# SECTION 14: MISSING FEATURES TO BUILD

## Priority Features:

### 1. Brain Dump Quick Capture
Floating `+` button, always visible in corner. Tap → voice/text input → AI parses → tasks created. Zero navigation.

### 2. Emergency Mode
When user says "I'm overwhelmed" or hits panic button:
- Dashboard simplifies to ONLY top 3 tasks
- AI: "Everything else can wait. Just these three."
- Calmer visual theme

### 3. Weekly AI Review (Auto-generated Sunday)
- What you accomplished
- What you missed and why (pattern analysis)
- Suggested adjustments
- One encouraging observation

### 4. Energy-Based Scheduling
Users tag tasks as high/medium/low energy. AI suggests hard tasks for peak energy windows, easy tasks for low-energy times.

### 5. Goal Template Library (SEO Goldmine)
50+ pre-built goal templates, each on its own URL:
- `/templates/read-24-books-this-year`
- `/templates/run-a-5k-in-12-weeks`
Each page gets indexed by Google = programmatic SEO.

### 6. AI Toolkit (Pro Feature)
- AI Summarizer (paste text → key points)
- Email Rewriter (paste draft → improved)
- Goal Validator ("Is this realistic?")
- Decision Helper ("Help me decide X vs Y")
All feed back into Resurgo task system.

### 7. VS Code Extension (Phase 3)
See Section 19.

---

# SECTION 15: SECURITY & DATA PIPELINE RULES

```
USER INPUT → SANITIZE → AI PROVIDER → VALIDATE → DATABASE
     ↓           ↓           ↓            ↓          ↓
  [Auth]    [XSS/SQL     [Encrypted    [Zod       [Access
  Check]     Strip]      API Key]     Schema]    Control]

RULES:
═════
1. API Keys: NEVER in frontend code. Always Vercel env vars.
   AI calls happen server-side ONLY (API routes or server actions).

2. User Input:
   - Strip HTML tags before sending to AI
   - Max input: 5000 chars (prevent token bombing)
   - Rate limit: 10 brain dumps/user/hour

3. AI Response:
   - ALWAYS validate with Zod before trusting
   - Never store raw AI output without validation
   - Never render raw AI output without sanitization

4. Authentication:
   - Every API route checks auth() from Clerk
   - Every database query filters by userId
   - Admin routes check isAdmin flag

5. Database:
   - Convex handles auth at function level
   - Every query/mutation must verify identity
   - Never expose user data across accounts
```

---

# SECTION 16: MARKETING EXECUTION PLAN

## Week 1: Foundation
```
□ Fix remaining UI bugs
□ Set up Dodo Payments
□ Landing page overhaul (14+ sections)
□ Create accounts: Twitter/X, Reddit, IndieHackers, dev.to, Medium
□ Record 60-second screen demo
□ Take 10 marketing screenshots
□ Set up Google Search Console
□ Install analytics
```

## Week 2: Soft Launch
```
□ Post on r/SideProject (authentic story, not salesy)
□ Post on r/ADHD (ADHD-focused angle)
□ Post on r/productivity
□ Post on IndieHackers
□ Write & publish blog post #1 (personal story)
□ Cross-post to Medium + dev.to
□ Start daily Twitter/X posts
```

## Week 3-4: Build in Public
```
□ Weekly Twitter thread: "Building Resurgo, Week N"
□ Blog post #2: "Why Todo Lists Fail"
□ Blog post #3: "Terminal-Style Productivity"
□ DM 10 productivity YouTubers (offer free Lifetime)
□ Create TikTok/Reels of terminal UI (visually viral)
□ Launch Telegram bot in productivity groups
```

## Week 5-6: ProductHunt Launch
```
□ Create PH upcoming page
□ Prepare: logo, screenshots, GIF, tagline
□ Tagline: "Dump your chaos. AI organizes your life."
□ Launch Tuesday 12:01 AM PST
□ Respond to EVERY comment
□ Target: Top 10 → 1,000-3,000 signups
```

## Ongoing Content:
```
□ 2 blog posts per week
□ Daily Twitter/X
□ Weekly YouTube screen recording
□ Monthly Reddit update
□ Cold DM micro-influencers
```

---

# SECTION 17: PRICING STRATEGY

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 forever | 3 goals, 5 brain dumps/day, 10 AI messages/day, basic habits, Telegram basic |
| **Pro Monthly** | $4.99/mo | Unlimited everything, all coaches, analytics, budget, weekly review |
| **Pro Annual** | $29.99/yr ($2.50/mo) | Same as Pro, 50% savings |
| **Lifetime** | $49.99 once | Everything forever. Raise to $99 after first 100 users |

**Free tier framing:** "Free plan focuses you on your 3 most important goals. Because trying to do everything is why you're stuck."

---

# SECTION 18: SEO STRATEGY

## Problem: "Resurgo" is heavily competed for.
Other businesses (charity, coaching company, women's SaaS) use the same name. Always brand as **RESURGO.life**.

## Site Pages Needed:
```
/                → Landing page (14+ sections)
/pricing         → Pricing page
/blog            → Blog index
/blog/[slug]     → Individual posts
/features        → Feature breakdown
/about           → Personal story
/templates       → Goal template library
/templates/[slug]→ Individual templates (programmatic SEO)
```

## Target Keywords (Long-Tail):
```
"terminal-style habit tracker"
"habit tracker for developers"
"ADHD-friendly task manager"
"AI task prioritizer app"
"brain dump to task list app"
"habit tracker with AI coaching"
```

## Meta Tags on Every Page:
```html
<title>Page Title | RESURGO.life</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://resurgo.life/..." />
```

---

# SECTION 19: VS CODE EXTENSION (PHASE 3)

Build after core app is stable and first sale achieved.

### What It Does:
1. Sidebar panel showing today's tasks
2. Status bar showing current habit streak / next task
3. Command palette: `Ctrl+Shift+P → "Resurgo: Add Task"`
4. Pomodoro timer integrated with tasks
5. TODO comment scanner that syncs with Resurgo
6. Quick habit check-in without leaving editor

### Tech:
- TypeScript using VS Code Extension API
- Communicates with Resurgo API
- Published to VS Code Marketplace

---

# SECTION 20: EXECUTION TIMELINE

```
WEEK 1: PAYMENT + AI ACTIVATION
├── Day 1-2: Dodo Payments signup + KYC
├── Day 3-4: Add ALL AI API keys, deploy provider router
├── Day 5-7: Build webhook + entitlements + pricing page
└── Give yourself admin/lifetime in Convex

WEEK 2: BRAIN DUMP + ONBOARDING
├── Deploy brain dump system (full pipeline)
├── Deploy AI onboarding conversation
├── Activate Telegram bot
└── Test everything end-to-end

WEEK 3: LANDING PAGE + CONTENT
├── Expand landing page to 14+ sections
├── Fix nav, headings, branding
├── Write blog post #1 (personal story)
├── Set up Google Search Console + analytics
└── Create social media accounts

WEEK 4: SOFT LAUNCH
├── Post on Reddit (r/SideProject, r/ADHD, r/productivity)
├── Post on IndieHackers
├── Start daily Twitter/X
└── Cross-post blog to Medium + dev.to

WEEK 5-6: PRODUCT HUNT
├── Prepare PH assets
├── Launch on Tuesday
├── Push for Top 10
└── Convert free users to paid

WEEK 8+: ITERATE + SCALE
├── Weekly AI Review feature
├── Goal Template Library
├── AI Toolkit
├── WhatsApp integration
├── VS Code extension
```

---

# SECTION 21: ADMIN SYSTEM

## Give Yourself Pro/Lifetime:

### Option 1 (Simplest — do this NOW):
Go to Convex Dashboard → Data → users table → find your record → edit:
```
plan: "lifetime"
isAdmin: true
```

### Option 2 (Code-based):
```typescript
// In Convex, wherever you check plans:
const ADMIN_EMAILS = ['your-email@domain.com'];

// In any plan check:
if (ADMIN_EMAILS.includes(user.email) || user.isAdmin) {
  return FULL_ACCESS;
}
```

### Future Admin Panel (/admin route):
```
Protected by isAdmin check. Shows:
- Total users
- Active sessions today
- Plan breakdown (free/pro/lifetime)
- Recent signups
- One-click upgrade any user
- Parse error logs from brain dump system
- AI provider health scores
```

---

# END OF MASTER DOCUMENT

```
SUMMARY OF WHAT TO CHANGE:
═════════════════════════
✅ KEEP: Clerk (auth), Convex (DB), Vercel (hosting), Next.js
➕ ADD:  Dodo Payments (billing), AI API keys (4 providers)
➕ ADD:  Brain dump system, coaching prompts, onboarding flow
🔧 FIX:  Loading bug (DONE), nav bar, headings, branding
📝 BUILD: Landing page, blog, pricing page, Telegram activation
❌ DO NOT: Remove Clerk, switch to Better Auth, use PyTorch,
           use Clerk Billing (blocked in India)
```
```markdown
# RESURGO — First-Sale Runbook + Technical Spec (Send to Coder AI)
Date: 2026-02-28  
Audience: engineering/AI agent implementing product + growth changes end-to-end.

---

## 0) Executive summary (what we’re building toward)
**Goal:** get Resurgo to the first paid customer quickly without overbuilding, while keeping the “built for myself” spirit.

**North Star:** “Time-to-first-success” = user signs up → dumps thoughts → gets a usable plan for Today in < 60 seconds.

**Your wedge (sellable promise):**  
“I was drowning in unfinished tasks, broken habits, and zero direction. No app worked because they all felt like more work. So I built the app I wished existed — dump everything on your mind and let AI figure out the rest. That app is RESURGO.”

**Core loop:** Brain Dump → AI parses + prioritizes → Today plan → gentle nudges (Telegram) → weekly review → retention → upgrade.

---

## 1) Current stack + status (assumptions)
- Frontend: Next.js app (App Router assumed)
- Backend: Convex functions + database
- Auth: Clerk (keep)
- Billing: currently using **Clerk Billing**
- Integrations: Telegram bot (planned/partially implemented)
- AI: mix of (a) cloud model APIs + (b) offline/local AI already used in the app
- The “LOADING WORKSPACE / INITIALIZING_SYSTEM_” bug is **fixed** (but add guardrails so it never becomes infinite again).

---

## 2) Product direction (do NOT add random features)
### 2.1 Two-layer UI strategy (“what came between terminals and dashboards?”)
Implement a **Command Center UI**:
- Modern dashboard layout (cards/sections)
- Command palette as primary input (`Cmd+K`)
- Terminal aesthetic can stay as a theme, not a requirement

**Progressive disclosure:**
- Default: “Today” view (simple)
- Advanced: “Control Room” view (stats/settings/templates)

### 2.2 Theme toggle (keep ADHD-friendly, avoid alienating others)
- Theme A: Terminal / Focus Mode
- Theme B: Clean / Modern Dark Mode

Same data + features; only presentation changes.

---

## 3) Critical UX fixes (from your observations)
### 3.1 Landing page must explain Resurgo in 5 seconds
Hero copy template:
- Headline: “Dump your chaos. Resurgo turns it into a plan.”
- Subhead: “Tasks, habits, and accountability — without setup.”
- CTA: “Start free” + “Watch 60-second demo”

### 3.2 Navigation must look like navigation
- Sidebar with icons + labels (always visible on desktop)
- Group items:
  - Today
  - Inbox (Brain Dump / Capture)
  - Tasks
  - Habits
  - Goals
  - Budget (later, keep but don’t lead with it)
  - Coach
  - Insights (only show once user has data)
  - Settings

Typography:
- Base font 15–16px minimum
- H1 28px+, H2 22px+, H3 18px+
- Terminal monospace is okay for “labels”, not for primary reading.

### 3.3 Loading screen must never be infinite (even if “fixed”)
Add:
- 6–10s watchdog timer → show error + Retry + Sign out
- Always render shell UI quickly; load data async

Observability:
- Sentry (errors)
- PostHog (funnel metrics)
- Basic “/settings/system-status” page showing:
  - auth ok
  - DB ok
  - AI provider availability
  - webhook health
  - integration health

---

## 4) Billing: keep Clerk Auth; Clerk Billing is the question (India constraint)
### 4.1 Facts about Clerk Billing (important constraints)
From Clerk’s official Billing docs (updated Feb 24, 2026):
- **Billing is in Beta**; APIs may undergo breaking changes.
- Clerk Billing:
  - **uses Stripe for payment processing**
  - is **not Merchant of Record**
  - **supports USD only**
  - **does not support refunds inside Clerk** (refunds via Stripe won’t reflect in Clerk MRR)
  - **does not support 3D Secure / additional factor authentication**
  - **is not supported in India** (also Brazil, Malaysia, Mexico, Singapore, Thailand). 

### 4.2 What we do (minimal disruption strategy)
- **Do not remove Clerk.** Keep Clerk Auth.
- Decouple “entitlements/plan” from Clerk Billing so you can swap payment providers cleanly.

Implementation rule:
- Product access is controlled by **Convex entitlements**:
  - `users.plan = free|pro|lifetime`
  - `users.isAdmin = boolean`
  - Feature flags check plan in Convex, not in UI-only code.

### 4.3 Two viable billing paths
**Path A (if you will keep Clerk Billing anyway):**
- Accept constraints above.
- Ensure your business setup can actually operate with Clerk Billing given India “not supported” statement. 

**Path B (recommended for India + global): use a Merchant-of-Record**
Example: Dodo Payments positions itself as a reseller/MoR-like layer (their docs describe merchants selling “using Dodo Payments as a reseller”), and they publish fee structure.   
- You implement checkout with Dodo
- Dodo webhook → Convex sets plan entitlements
- Keep Clerk Auth unchanged

### 4.4 Give yourself Pro for free (no hacks)
- In Convex: `isAdmin=true` for your user.
- Entitlement logic: `if isAdmin => plan = pro` at runtime (or “admin overrides plan”).

---

## 5) WhatsApp vs Telegram (channel strategy)
### 5.1 Telegram: recommended primary chat surface
- Low friction, bot-friendly, aligns with your “dump tasks anywhere” vision.

### 5.2 WhatsApp: high risk for “AI partner” positioning
Meta/WhatsApp updated Business API policy to prohibit general-purpose AI assistants where AI is the primary functionality, effective **Jan 15, 2026** (with earlier restrictions for new users after Oct 15, 2025).   
So:
- Do NOT build WhatsApp as the main AI coaching interface right now.
- If you do WhatsApp later: keep it “incidental” (notifications, receipts, narrow flows).

---

## 6) AI providers: you must obtain keys; we cannot generate keys for you
We cannot provide actual API keys. Keys must be generated in each provider dashboard and stored server-side as environment variables.

### 6.1 Providers that have free tiers / free access (use as optional fallbacks)
- **OpenRouter** offers a Free plan with “free models only” and **50 requests/day** (per their pricing page). 
- **Google Gemini API** pricing pages show models with free tier “free of charge” for certain usage tiers (exact quota enforcement depends on Google’s quota system for your project). 
- **Cloudflare Workers** Free tier includes **100,000 requests/day** for Workers (useful for lightweight AI routing / edge logic, not necessarily LLM tokens). 
- **Groq**: has a free tier with rate limits; exact limits vary by account/model and are shown in the Groq Console limits page. 

### 6.2 Offline / local AI
Keep your offline AI as:
- fallback when cloud is down
- privacy mode
- cost control

Use architecture: `AI Router -> providers[] -> local provider` (Ollama/OpenAI-compatible endpoint) when available.

### 6.3 Security rules for AI keys
- NEVER expose keys to client-side code
- All LLM calls go through server routes or Convex actions
- Add rate limiting per user (brain dump endpoints are expensive)

---

## 7) Production-safe Brain Dump feature (robust from day one)
### 7.1 Desired UX
- Floating “Capture” button everywhere
- Modal with large text area: “Dump everything on your mind”
- On submit:
  1) show short empathetic acknowledgment
  2) show extracted tasks (editable)
  3) show “Add all” / “Add selected”
  4) show “Quick win for right now”

### 7.2 JSON schema (Zod)
Create: `src/lib/braindump/schema.ts`

```ts
import { z } from "zod";

export const Category = z.enum([
  "WORK","PERSONAL","HEALTH","FINANCE","LEARNING","SOCIAL","HOME","CREATIVE","ADMIN","URGENT_LIFE",
]);

export const Priority = z.enum(["CRITICAL","HIGH","MEDIUM","LOW"]);
export const Energy = z.enum(["low","medium","high"]);

export const Emotion = z.enum([
  "overwhelmed","anxious","frustrated","hopeful","motivated","exhausted","confused","guilty","neutral","excited",
]);

export const ParsedTask = z.object({
  title: z.string().min(2).max(200),
  category: Category,
  priority: Priority,
  estimated_minutes: z.number().int().min(5).max(480).nullable(),
  suggested_due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  depends_on: z.string().max(200).nullable(),
  relates_to_goal: z.string().max(200).nullable(),
  energy_level: Energy,
  is_recurring: z.boolean(),
  recurrence_pattern: z.string().max(50).nullable(),
});

export const BrainDumpResponse = z.object({
  emotions_detected: z.array(Emotion).min(1),
  emotional_acknowledgment: z.string().min(10).max(300),

  tasks: z.array(ParsedTask).max(50),

  habits_suggested: z.array(z.object({
    name: z.string().min(2).max(80),
    frequency: z.enum(["daily","weekly","3x_week","weekdays"]),
    reason: z.string().min(5).max(120),
  })).max(10),

  patterns_observed: z.string().max(500).nullable(),
  quick_win: z.string().min(5).max(200),

  total_estimated_hours: z.number().min(0).max(500).nullable(),
  overcommitment_warning: z.boolean(),
  overcommitment_message: z.string().max(300).nullable(),
});

export type BrainDumpResponseT = z.infer<typeof BrainDumpResponse>;
```

### 7.3 Parsing prompt (strict JSON only)
Create: `src/lib/braindump/prompt.ts`

```ts
export function buildBrainDumpPrompt(params: {
  todayISO: string;
  userName?: string;
  goals?: string[];
  existingTaskCount?: number;
}) {
  const { todayISO, userName, goals, existingTaskCount } = params;

  return `
You are RESURGO's Brain Dump Parser.

TODAY: ${todayISO}
USER: ${userName ?? "User"}
ACTIVE GOALS: ${(goals && goals.length ? goals.join(", ") : "None")}
EXISTING TASK COUNT: ${existingTaskCount ?? 0}

Instructions:
1) First acknowledge emotions.
2) Extract actionable tasks (make vague items concrete).
3) Assign category, priority, energy level.
4) Suggest due dates ONLY when implied by the text.
5) Detect habits only when user implies recurrence.
6) Flag overcommitment when workload seems unrealistic.

Return ONLY valid JSON. No markdown. No commentary.
JSON must match the exact schema below.

{
  "emotions_detected": ["overwhelmed"],
  "emotional_acknowledgment": "string",
  "tasks": [
    {
      "title": "string",
      "category": "WORK",
      "priority": "HIGH",
      "estimated_minutes": 30,
      "suggested_due": "YYYY-MM-DD",
      "depends_on": null,
      "relates_to_goal": null,
      "energy_level": "medium",
      "is_recurring": false,
      "recurrence_pattern": null
    }
  ],
  "habits_suggested": [
    { "name": "string", "frequency": "daily", "reason": "string" }
  ],
  "patterns_observed": null,
  "quick_win": "string",
  "total_estimated_hours": 3.5,
  "overcommitment_warning": false,
  "overcommitment_message": null
}
  `.trim();
}
```

### 7.4 Production-safe parser (reject invalid JSON, retry with repair prompt, log failures)
Create: `src/lib/braindump/parser.ts`

```ts
import { BrainDumpResponse, type BrainDumpResponseT } from "./schema";

type LLM = (args: {
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
  jsonMode?: boolean;
}) => Promise<{ text: string; provider?: string; model?: string; latencyMs?: number }>;

function extractJsonCandidate(raw: string): string {
  // 1) If already valid JSON
  try { JSON.parse(raw); return raw; } catch {}

  // 2) code block
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (m?.[1]) return m[1].trim();

  // 3) first { ... last }
  const a = raw.indexOf("{");
  const b = raw.lastIndexOf("}");
  if (a >= 0 && b > a) return raw.slice(a, b + 1);

  return raw;
}

function sanitizeJson(s: string): string {
  return s
    .replace(/,\s*([}\]])/g, "$1") // trailing commas
    .replace(/[\u0000-\u001F\u007F]/g, (c) => (c === "\n" || c === "\r" || c === "\t" ? c : "")); // control chars
}

function validate(raw: string): { ok: true; data: BrainDumpResponseT } | { ok: false; errors: string[] } {
  const candidate = sanitizeJson(extractJsonCandidate(raw));
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (e) {
    return { ok: false, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }

  const res = BrainDumpResponse.safeParse(parsed);
  if (res.success) return { ok: true, data: res.data };

  return {
    ok: false,
    errors: res.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
  };
}

function repairPrompt(original: string, errors: string[]) {
  return `
Fix the JSON to satisfy the schema. Return ONLY corrected JSON.
No markdown. No extra text.

Errors:
${errors.map((e, i) => `${i + 1}. ${e}`).join("\n")}

Original:
${original}
  `.trim();
}

export async function parseBrainDump(args: {
  llm: LLM;
  systemPrompt: string;
  userText: string;
  logger?: (evt: Record<string, unknown>) => void;
}): Promise<{ ok: true; data: BrainDumpResponseT } | { ok: false; message: string }> {
  const { llm, systemPrompt, userText, logger } = args;

  const attempts: Array<{ stage: string; raw?: string; errors?: string[] }> = [];

  // Attempt 1: parse
  const r1 = await llm({ system: systemPrompt, user: userText, temperature: 0.3, maxTokens: 2500, jsonMode: true });
  const v1 = validate(r1.text);
  attempts.push({ stage: "parse-1", raw: r1.text, ...(v1.ok ? {} : { errors: v1.errors }) });

  if (v1.ok) {
    logger?.({ event: "braindump_ok", provider: r1.provider, model: r1.model, attempts: 1 });
    return { ok: true, data: v1.data };
  }

  // Attempt 2: repair
  const r2 = await llm({
    system: "You are a JSON repair assistant. Output ONLY valid JSON.",
    user: repairPrompt(r1.text, v1.errors),
    temperature: 0.1,
    maxTokens: 2500,
    jsonMode: true,
  });
  const v2 = validate(r2.text);
  attempts.push({ stage: "repair-2", raw: r2.text, ...(v2.ok ? {} : { errors: v2.errors }) });

  if (v2.ok) {
    logger?.({ event: "braindump_ok_after_repair", provider: r2.provider, model: r2.model, attempts: 2 });
    return { ok: true, data: v2.data };
  }

  // Attempt 3: hard retry (re-parse with stricter instruction)
  const r3 = await llm({
    system: systemPrompt + "\nCRITICAL: Return ONLY valid JSON. No prose. Double-check commas/quotes.",
    user: userText,
    temperature: 0.2,
    maxTokens: 2500,
    jsonMode: true,
  });
  const v3 = validate(r3.text);
  attempts.push({ stage: "parse-3", raw: r3.text, ...(v3.ok ? {} : { errors: v3.errors }) });

  if (v3.ok) {
    logger?.({ event: "braindump_ok_after_retry", provider: r3.provider, model: r3.model, attempts: 3 });
    return { ok: true, data: v3.data };
  }

  // Log failure (store only snippets; avoid dumping full private text)
  logger?.({
    event: "braindump_failed",
    attempts: attempts.map(a => ({ stage: a.stage, errors: a.errors, rawPreview: (a.raw ?? "").slice(0, 300) })),
  });

  return { ok: false, message: "I couldn’t reliably structure that dump. Try splitting it into smaller chunks or bullet points." };
}
```

Implementation notes:
- Rate limit the endpoint (per user) to prevent abuse/cost spikes.
- Never store raw user dumps in logs (store previews only).
- Persist validated tasks into Convex with an “import batch id” so user can undo.

---

## 8) AI coaching bots: “personal touch” without overbuilding
### 8.1 Coaching UX (simple)
- Daily check-in (morning): “Energy today?” + “Time available?” + “One thing you want done”
- AI outputs: Top 3 tasks + 1 quick win
- Evening review: “Did you do your #1?” If no, “What blocked you?” -> adjust tomorrow

### 8.2 Coaching prompt strategy
- One global “Resurgo Coach” system prompt
- Persona modifiers (Phoenix, Analyst, Drill Sergeant, Gentle, etc.)
- User memory injected from Convex:
  - goals
  - recent completions
  - missed patterns
  - preferred tone
- Keep responses short, 1 question max, 3 suggestions max.

---

## 9) AI router (cloud + offline + safe)
Implement:
- `callLLM(taskType, system, user)` chooses best provider available
- falls back to offline model when cloud is rate-limited/unavailable
- timeouts + retries + circuit breaker per provider

Avoid overengineering:
- 2–3 providers is enough at first (Primary + Fallback + Offline).

Provider selection must not assume fixed free-tier quotas; read provider dashboards.

---

## 10) Marketing + SEO (first sale plan)
### 10.1 Minimum landing page sections (12)
1) Hero (clear 1-line promise)
2) “Built because I needed it” story (your differentiator)
3) 3-step “How it works”
4) Brain Dump demo (GIF/video)
5) Today plan demo
6) Coach demo (one conversation screenshot)
7) Telegram demo (nudge screenshots)
8) Who it’s for (ADHD, burnout recovery, overwhelmed builders)
9) Pricing
10) FAQ
11) Privacy/security note (short)
12) Final CTA

### 10.2 Blog that ranks: structure (UI/UX)
- Sticky table of contents (desktop)
- TL;DR box at top (3–5 bullets)
- “Action steps” box near bottom
- Internal links: every post links to 2–4 related posts
- Schema.org Article markup
- Related posts cards
- Author bio (build trust)

### 10.3 Content strategy (topical authority clusters)
Pillar: “ADHD + Task Overwhelm: The Complete Guide to Getting Unstuck”  
Cluster posts:
- “Why todo lists fail (and what to do instead)”
- “The brain dump method: how to clear mental clutter fast”
- “Streaks are overrated: build habits without shame”
- “Terminal UI productivity: why it helps some brains”

Add programmatic SEO later:
- `/templates/*` goal templates (each indexed page).

### 10.4 Distribution (first users → first paid)
- Reddit (story-first, not sales)
- IndieHackers build log
- Short demo clips (15–30s): “Dump → Plan → Done”
- Founder Pilot: first 20 users get discounted Pro; you do concierge onboarding.

---

## 11) Metrics + instrumentation
Track in PostHog:
- `signup_completed`
- `brain_dump_submitted`
- `tasks_imported_from_dump`
- `task_completed_today`
- `telegram_connected`
- `upgrade_clicked`
- `upgrade_completed`

Key metric:
- P75 time-to-first-success < 60 seconds.

---

## 12) Security, privacy, and “don’t overdo it”
Minimum required:
- Server-side LLM calls only
- Strict JSON validation (Zod)
- Rate limiting
- PII minimization in logs
- Separate “raw dump storage” from “derived tasks” (optional)
- Clearly state in privacy policy what data is sent to AI providers

Do NOT:
- build a complex agent framework before you have paying users
- add WhatsApp AI partner as primary channel (policy risk) 

---

## 13) Implementation backlog (ordered)
### P0 (today/tomorrow)
- Add watchdog timeout + error UI on initialization
- Add System Status page (auth/db/ai/webhooks/integrations)
- Brain Dump endpoint using the production-safe parser above
- Floating capture button + import flow
- PostHog + Sentry

### P1 (week 1)
- Landing page expansion (12 sections)
- Command palette (Cmd+K) for add task/habit/search
- Theme toggle (terminal vs clean)

### P2 (week 2)
- Telegram bot: /dump, /today, daily nudges
- Coach daily check-in + evening review
- Blog route + first 2 posts

### P3 (week 3–4)
- Billing decision:
  - If staying on Clerk Billing: accept Beta + USD-only + no 3DS + not supported in India caveat 
  - Otherwise: implement MoR billing (e.g., Dodo) webhook → Convex entitlements 
- Founder Pilot launch, get first paying user

---

## 14) Environment variables (template)
Never commit real keys.

```env
# Auth
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

# Convex
CONVEX_DEPLOYMENT=...

# AI providers (optional)
GROQ_API_KEY=...
GOOGLE_AI_KEY=...
OPENROUTER_API_KEY=...

# Offline AI (optional)
OLLAMA_BASE_URL=http://localhost:11434/v1

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...

# Observability
SENTRY_DSN=...
POSTHOG_KEY=...
POSTHOG_HOST=...
```

---

## 15) Notes for coder AI (Sonnet) — operating principles
- Prefer “simple + robust” over “feature-rich + fragile”.
- Every AI output that affects DB must be schema-validated.
- Never allow infinite loaders.
- Make the Today screen the product.
- Reduce UI complexity via progressive disclosure.
- Billing must be modular: entitlements in Convex; payment provider can change.

End of document.
```

If you want, I can also generate a second “implementation-only” version (no marketing) formatted as a Jira-ready checklist with exact file paths and acceptance criteria for each ticket.

Let me research mood board generation, free AI image APIs, user segmentation frameworks, and how all three systems integrate into a unified onboarding-to-personalization pipeline.Here is the **complete addendum** for your master document — covering the AI-Generated Vision/Mood Board system, the enhanced onboarding user segmentation pipeline, and free image generation integration. Send this alongside the previous master documents to your coding AI.

---

# 📎 MASTER DOCUMENT — ADDENDUM: SECTIONS 24, 25, & 26
## (Add these after Sections 22 & 23)

---

# SECTION 24: AI-GENERATED VISION/MOOD BOARD SYSTEM

## The Concept — Why This Is A Killer Feature

No habit tracker or productivity app has EVER integrated an AI-generated vision board that's **powered by the user's own goals, psychology profile, and onboarding data.** Existing vision board apps like Perfectly Happy (250,000+ users, 4.8 stars) are standalone — they don't connect to your actual tasks, habits, or progress.

By combining visualization, daily affirmations, gratitude journaling and mood tracking into one seamless experience, these apps offer a comprehensive solution for anyone looking to manifest their goals. But they're all **disconnected** from actual productivity systems.

RESURGO's Vision Board is different:
- It's **generated by AI** based on the user's actual goals, onboarding answers, and psychology profile
- It **updates automatically** as goals change or get completed
- It uses **free AI image generation** (zero cost)
- It serves as both motivation AND a daily reminder integrated into the dashboard
- It combines the best of what existing apps offer: visualization tools with slideshows and daily reminders, collaboration features, inspirational content with built-in libraries of quotes and affirmations, progress tracking, and affirmation alerts

## Free AI Image Generation APIs (Zero Cost)

### Primary: Cloudflare Workers AI

You can deploy your own free AI image generation API using Cloudflare Workers, with up to 100,000 API calls per day, generating stunning images from text prompts using powerful models like Stable Diffusion XL.

Workers AI allows you to run AI models in a serverless way, without having to worry about scaling, maintaining, or paying for unused infrastructure. You can invoke models running on GPUs on Cloudflare's network from your own code.

### Secondary: Google AI Studio (Gemini Image Gen)

As of February 2026, Gemini 2.0 Flash is available completely free of charge in Google AI Studio for all available regions. For developers who want to experiment without committing any budget, Google provides several genuinely free paths to Gemini image generation.

This means you can generate images at absolutely zero cost, though you'll face rate limits that prevent high-volume production use.

### Tertiary: Puter.js (Zero Config)

Puter.js provides access to powerful image generation models including GPT Image, DALL-E 2, DALL-E 3, Gemini 2.5 Flash Image Preview, Flux.1 Schnell, Flux.1 Kontext, Flux 1.1 Pro, Stable Diffusion 3, and Stable Diffusion XL directly from your frontend code.

This model enables developers to offer advanced image generation capabilities to users at no cost to themselves, without any API keys or server-side setup. You can use Puter.js without any API keys or sign-ups.

### Setup: Cloudflare Workers AI Image Generator

```
SETUP STEPS:
1. Go to dash.cloudflare.com → create free account
2. Go to Workers & Pages → Create Worker
3. Name it "resurgo-image-gen"
4. Deploy the code below
5. Go to Settings → Variables → Add API_KEY
6. Go to Settings → Variables → Service bindings → Add AI → Workers AI
7. Save and Deploy
8. Your endpoint: https://resurgo-image-gen.YOUR-SUBDOMAIN.workers.dev
9. Add to Vercel env: CLOUDFLARE_IMAGE_API_URL and CLOUDFLARE_IMAGE_API_KEY
```

### Cloudflare Worker Code:

```javascript
// Deploy this as a Cloudflare Worker at dash.cloudflare.com

export default {
  async fetch(request, env) {
    const API_KEY = env.API_KEY;

    // Auth check
    const auth = request.headers.get("Authorization");
    if (auth !== `Bearer ${API_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const { prompt, width, height } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Generate image using Stable Diffusion XL
      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: prompt,
          width: width || 1024,
          height: height || 1024,
        }
      );

      // Return as base64 for easy frontend consumption
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(result))
      );

      return new Response(
        JSON.stringify({
          success: true,
          image: `data:image/png;base64,${base64}`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Generation failed", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
```

## The Vision Board Generator (Backend)

```typescript
// File: src/lib/ai/vision-board/generator.ts

import { callAI } from '../provider-router';
import type { UserContext } from '../types';
import type { PsychProfile } from '../psychology/profile-schema';

// ============================================
// BOARD THEME TYPES
// ============================================

export interface VisionBoardTheme {
  colorPalette: string[];    // 5 hex colors
  mood: string;              // "warm-ambitious" | "calm-focused" | "energetic-bold" etc
  fontStyle: string;         // "serif-elegant" | "sans-modern" | "mono-tech"
  layoutStyle: string;       // "grid" | "collage" | "minimal" | "mosaic"
}

export interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imagePrompt: string;       // AI-crafted prompt for image generation
  affirmation: string;       // Personal affirmation tied to this goal
  category: string;          // HEALTH | CAREER | PERSONAL | FINANCE etc
  progress: number;          // 0-100 from goal tracking
  position: number;          // Order on the board
}

export interface VisionBoardConfig {
  userId: string;
  title: string;             // "Your 2026 Vision" or custom
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string; // Big affirmation in the center
  generatedAt: string;
  version: number;
}

// ============================================
// GENERATE BOARD CONFIG FROM USER DATA
// ============================================

const BOARD_GENERATION_PROMPT = `
# ROLE
You are RESURGO's Vision Board Designer. You create deeply personal, 
psychologically-informed vision boards for users based on their goals, 
personality, life situation, and emotional state.

# YOUR TASK
Generate a vision board configuration that will:
1. Visually represent the user's goals in a way that resonates with their 
   personality type and emotional needs
2. Create image prompts that are inspirational but REALISTIC (no fantasy/
   magical thinking — grounded visualization)
3. Write affirmations that match their communication style preference
4. Choose a color palette and mood that aligns with their psychological profile

# RULES FOR IMAGE PROMPTS
- Create vivid, specific text-to-image prompts for Stable Diffusion
- Focus on OUTCOMES not processes ("person celebrating at a finish line" 
  not "person running")
- Include style keywords: "photorealistic, warm lighting, aspirational, 
  high quality, 4K"
- Never include text in images (AI struggles with text rendering)
- Make prompts culturally neutral and inclusive
- Each prompt must be unique and directly tied to a specific goal

# RULES FOR AFFIRMATIONS
- First person, present tense ("I am" not "I will be")
- Specific to their goal, not generic motivational quotes
- Match their communication style:
  - Gentle: soft, nurturing language
  - Direct: clear, assertive statements
  - Challenging: bold, pushing boundaries
  - Analytical: logical, evidence-based

# RULES FOR THEME
- High neuroticism users → calming colors (blues, greens, soft neutrals)
- High extraversion users → vibrant colors (warm oranges, energetic yellows)
- High conscientiousness → clean, structured layouts (grid, minimal)
- High openness → creative layouts (collage, mosaic, unexpected combos)
- Low energy/overwhelmed → simplified board (fewer panels, more whitespace)

# USER CONTEXT
${'{USER_CONTEXT}'}

# PSYCHOLOGY PROFILE
${'{PSYCH_PROFILE}'}

# OUTPUT FORMAT (JSON only, no other text)
{
  "title": "string — personal title for their board",
  "theme": {
    "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "mood": "string — e.g., warm-ambitious, calm-focused",
    "fontStyle": "serif-elegant | sans-modern | mono-tech",
    "layoutStyle": "grid | collage | minimal | mosaic"
  },
  "panels": [
    {
      "goalTitle": "string — from their actual goals",
      "imagePrompt": "string — detailed SD prompt for this goal",
      "affirmation": "string — personal affirmation for this goal",
      "category": "HEALTH|CAREER|PERSONAL|FINANCE|LEARNING|RELATIONSHIP",
      "position": number
    }
  ],
  "centerAffirmation": "string — the BIG overarching affirmation"
}
`;

export async function generateVisionBoardConfig(
  userContext: UserContext,
  psychProfile: PsychProfile | null
): Promise<VisionBoardConfig | null> {
  const prompt = BOARD_GENERATION_PROMPT
    .replace('{USER_CONTEXT}', JSON.stringify({
      name: userContext.name,
      goals: userContext.goals,
      lifeSituation: userContext.lifeSituation,
      communicationStyle: userContext.communicationStyle,
    }, null, 2))
    .replace('{PSYCH_PROFILE}', psychProfile
      ? JSON.stringify({
          bigFive: psychProfile.bigFive,
          motivational: psychProfile.motivational,
          behavioral: {
            communicationPreferences: psychProfile.behavioral.communicationPreferences,
            stressCopingStyle: psychProfile.behavioral.stressCopingStyle,
          },
        }, null, 2)
      : 'Not yet available — use balanced defaults'
    );

  try {
    const response = await callAI({
      systemPrompt: prompt,
      userMessage: 'Generate a personalized vision board configuration.',
      taskType: 'analysis',
      temperature: 0.8, // Higher creativity for vision boards
      maxTokens: 3000,
      jsonMode: true,
    });

    const parsed = JSON.parse(
      response.content.substring(
        response.content.indexOf('{'),
        response.content.lastIndexOf('}') + 1
      )
    );

    // Add metadata
    const config: VisionBoardConfig = {
      userId: userContext.email || '',
      title: parsed.title,
      theme: parsed.theme,
      panels: parsed.panels.map((p: VisionBoardPanel, i: number) => ({
        ...p,
        id: `panel-${i}-${Date.now()}`,
        progress: userContext.goals?.find(
          g => g.title.toLowerCase().includes(p.goalTitle.toLowerCase())
        )?.progress || 0,
        position: p.position || i,
      })),
      centerAffirmation: parsed.centerAffirmation,
      generatedAt: new Date().toISOString(),
      version: 1,
    };

    return config;
  } catch (error) {
    console.error('[VisionBoard] Generation failed:', error);
    return null;
  }
}
```

## Image Generation Service

```typescript
// File: src/lib/ai/vision-board/image-service.ts

// ============================================
// MULTI-PROVIDER IMAGE GENERATION
// ============================================

interface ImageResult {
  success: boolean;
  imageData?: string;    // base64 data URL
  provider: string;
  error?: string;
}

// Provider 1: Cloudflare Workers AI (PRIMARY — 100K/day free)
async function generateWithCloudflare(prompt: string): Promise<ImageResult> {
  try {
    const response = await fetch(process.env.CLOUDFLARE_IMAGE_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_IMAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1024,
      }),
    });

    if (!response.ok) throw new Error(`Cloudflare: ${response.status}`);

    const data = await response.json();
    return {
      success: true,
      imageData: data.image,
      provider: 'cloudflare',
    };
  } catch (error) {
    return {
      success: false,
      provider: 'cloudflare',
      error: (error as Error).message,
    };
  }
}

// Provider 2: Google AI Studio Gemini (SECONDARY)
async function generateWithGemini(prompt: string): Promise<ImageResult> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate an image: ${prompt}` }]
          }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini: ${response.status}`);

    const data = await response.json();
    // Extract image from Gemini response
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: unknown }) => p.inlineData
    );

    if (imagePart?.inlineData) {
      return {
        success: true,
        imageData: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
        provider: 'gemini',
      };
    }

    throw new Error('No image in Gemini response');
  } catch (error) {
    return {
      success: false,
      provider: 'gemini',
      error: (error as Error).message,
    };
  }
}

// ============================================
// MAIN: Generate with fallback
// ============================================

export async function generateImage(prompt: string): Promise<ImageResult> {
  // Try Cloudflare first (100K free/day)
  const cf = await generateWithCloudflare(prompt);
  if (cf.success) return cf;

  // Fallback to Gemini
  const gemini = await generateWithGemini(prompt);
  if (gemini.success) return gemini;

  // All failed
  return {
    success: false,
    provider: 'none',
    error: 'All image providers failed',
  };
}

// Generate all images for a vision board (with rate limiting)
export async function generateBoardImages(
  panels: Array<{ id: string; imagePrompt: string }>
): Promise<Map<string, string>> {
  const images = new Map<string, string>();

  for (const panel of panels) {
    const result = await generateImage(panel.imagePrompt);
    if (result.success && result.imageData) {
      images.set(panel.id, result.imageData);
    }
    // Rate limit: wait 2 seconds between generations
    await new Promise(r => setTimeout(r, 2000));
  }

  return images;
}
```

## API Route for Vision Board

```typescript
// File: src/app/api/vision-board/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { generateVisionBoardConfig } from '@/lib/ai/vision-board/generator';
import { generateBoardImages } from '@/lib/ai/vision-board/image-service';
import { getUserContext } from '@/lib/user-context';
import type { PsychProfile } from '@/lib/ai/psychology/profile-schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get user context
    const userContext = await getUserContext(userId);

    // 2. Get psychology profile
    let psychProfile: PsychProfile | null = null;
    try {
      const profileDoc = await convex.query(api.psychology.getProfile, {
        userId: userContext.convexUserId,
      });
      if (profileDoc) psychProfile = JSON.parse(profileDoc.profile);
    } catch { /* No profile yet */ }

    // 3. Generate board configuration
    const config = await generateVisionBoardConfig(userContext, psychProfile);
    if (!config) {
      return NextResponse.json(
        { error: 'Failed to generate board config' },
        { status: 500 }
      );
    }

    // 4. Generate images for each panel
    const images = await generateBoardImages(config.panels);

    // 5. Combine config with images
    const boardWithImages = {
      ...config,
      panels: config.panels.map(panel => ({
        ...panel,
        imageData: images.get(panel.id) || null,
      })),
    };

    // 6. Save to database
    await convex.mutation(api.visionBoards.save, {
      userId: userContext.convexUserId,
      config: JSON.stringify(boardWithImages),
      version: config.version,
    });

    return NextResponse.json({
      success: true,
      board: boardWithImages,
    });

  } catch (error) {
    console.error('[VisionBoard] Generation error:', error);
    return NextResponse.json(
      { error: 'Vision board generation failed' },
      { status: 500 }
    );
  }
}
```

## Convex Schema & Mutations

```typescript
// Add to convex/schema.ts:

visionBoards: defineTable({
  userId: v.id('users'),
  config: v.string(),        // JSON string of VisionBoardConfig (with images)
  version: v.number(),
  isActive: v.boolean(),     // Only one active board at a time
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_user', ['userId'])
  .index('by_user_active', ['userId', 'isActive']),
```

```typescript
// File: convex/visionBoards.ts

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const save = mutation({
  args: {
    userId: v.id('users'),
    config: v.string(),
    version: v.number(),
  },
  handler: async (ctx, args) => {
    // Deactivate previous boards
    const existing = await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', args.userId).eq('isActive', true)
      )
      .collect();

    for (const board of existing) {
      await ctx.db.patch(board._id, { isActive: false });
    }

    // Save new board
    return await ctx.db.insert('visionBoards', {
      userId: args.userId,
      config: args.config,
      version: args.version,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getActive = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', args.userId).eq('isActive', true)
      )
      .first();
  },
});
```

## Frontend: Vision Board Component

```tsx
// File: src/components/VisionBoard.tsx

'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { usePlan } from '@/hooks/usePlan';
import { UpgradePrompt } from './UpgradePrompt';

interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imageData: string | null;
  affirmation: string;
  category: string;
  progress: number;
  position: number;
}

interface VisionBoardConfig {
  title: string;
  theme: {
    colorPalette: string[];
    mood: string;
    fontStyle: string;
    layoutStyle: string;
  };
  panels: VisionBoardPanel[];
  centerAffirmation: string;
}

export function VisionBoard({ userId }: { userId: string }) {
  const { can } = usePlan();
  const [generating, setGenerating] = useState(false);
  const boardDoc = useQuery(api.visionBoards.getActive, { userId: userId as any });

  // Free users get ONE board generation; Pro gets unlimited regeneration
  if (!can('advancedAnalytics') && !boardDoc) {
    // Free users can generate their first board
  }

  const board: VisionBoardConfig | null = boardDoc
    ? JSON.parse(boardDoc.config)
    : null;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/vision-board/generate', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Generation failed');
      // Board will appear via Convex real-time subscription
    } catch (error) {
      console.error('Board generation failed:', error);
    } finally {
      setGenerating(false);
    }
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] 
                      border border-dashed border-zinc-700 rounded-lg p-8">
        <h2 className="text-xl text-green-400 mb-2 font-mono">
          {'>'} VISION_BOARD_
        </h2>
        <p className="text-zinc-400 text-center mb-6 max-w-md">
          Generate a personalized vision board based on your goals,
          personality, and where you are in life. AI creates custom
          images and affirmations just for you.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-green-500 text-black px-6 py-3 rounded font-bold
                     hover:bg-green-400 disabled:opacity-50 disabled:cursor-wait"
        >
          {generating ? '⏳ Generating your board...' : '✨ Generate My Vision Board'}
        </button>
        {generating && (
          <p className="text-zinc-500 text-sm mt-3">
            This takes 30-60 seconds. Creating your personalized images...
          </p>
        )}
      </div>
    );
  }

  const layoutClass = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    collage: 'flex flex-wrap gap-3',
    minimal: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    mosaic: 'grid grid-cols-3 gap-2 auto-rows-[200px]',
  }[board.theme.layoutStyle] || 'grid grid-cols-2 gap-4';

  return (
    <div className="p-6 rounded-xl"
         style={{ background: `linear-gradient(135deg, ${board.theme.colorPalette[0]}15, ${board.theme.colorPalette[1]}15)` }}>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2"
          style={{ color: board.theme.colorPalette[0] }}>
        {board.title}
      </h2>

      {/* Center Affirmation */}
      <p className="text-center text-lg text-zinc-300 mb-6 italic">
        "{board.centerAffirmation}"
      </p>

      {/* Panels */}
      <div className={layoutClass}>
        {board.panels.map((panel) => (
          <div
            key={panel.id}
            className="relative rounded-lg overflow-hidden group cursor-pointer
                       border border-zinc-800 hover:border-zinc-600 transition"
            style={{
              gridRow: board.theme.layoutStyle === 'mosaic' && panel.position === 0
                ? 'span 2' : undefined,
            }}
          >
            {/* Image */}
            {panel.imageData ? (
              <img
                src={panel.imageData}
                alt={panel.goalTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600">📷</span>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100
                            transition-opacity flex flex-col justify-end p-4">
              <span className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: board.theme.colorPalette[2] }}>
                {panel.category}
              </span>
              <h3 className="text-white font-bold text-sm mb-1">
                {panel.goalTitle}
              </h3>
              <p className="text-zinc-300 text-xs italic">
                "{panel.affirmation}"
              </p>

              {/* Progress bar */}
              <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${panel.progress}%`,
                    backgroundColor: board.theme.colorPalette[0],
                  }}
                />
              </div>
              <span className="text-zinc-500 text-xs mt-1">
                {panel.progress}% complete
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Regenerate button (Pro only) */}
      {can('advancedAnalytics') && (
        <div className="text-center mt-6">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="text-sm text-zinc-500 hover:text-green-400 transition"
          >
            {generating ? '⏳ Regenerating...' : '🔄 Regenerate Board'}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Environment Variables for Image Generation:

```env
# Add to Vercel env vars:
CLOUDFLARE_IMAGE_API_URL=https://resurgo-image-gen.YOUR-SUBDOMAIN.workers.dev
CLOUDFLARE_IMAGE_API_KEY=your-strong-secret-key
# Google AI key already added from Section 6
```

---

# SECTION 25: COMPREHENSIVE ONBOARDING USER SEGMENTATION

## The Onboarding Pipeline — How Users Get Analyzed and Grouped

User segmentation in onboarding refers to the process of categorizing and grouping users based on specific characteristics, behaviors, or demographics. The goal is to divide a user base into distinct segments to create a tailored user onboarding experience.

Personalized onboarding increases activation rates by 30–50% by eliminating cognitive translation costs.

Using the welcome screen to segment your new users by the goals they want to achieve can be game-changing. You will get them to accomplish their jobs to be done faster, reduce their time-to-value, and generally help them activate much sooner than if you drag them on a one-size-fits-all product tour.

### The Four Segmentation Layers Combined

The most effective practice involves combining demographics, behavior, and preferences. This holistic approach allows for nuanced user categorization, enabling a more refined onboarding experience.

RESURGO uses four layers simultaneously:

1. **Psychographic** — Understand users' attitudes, interests, values, and motivations. This segmentation helps create onboarding experiences that resonate with users on a deeper level, addressing their unique needs and aspirations.

2. **Behavioral** — Analyze user behavior and actions within the onboarding process, such as feature usage, engagement levels, or completion of specific tasks. This helps target users who have stopped engaging.

3. **Experience Level** — Segment users based on their familiarity and expertise with similar products or services. This allows for customized onboarding experiences that cater to users' prior knowledge and skill levels.

4. **Customer Journey Stage** — Divide users based on their stages in the customer journey. This segmentation enables targeted onboarding strategies that address specific needs and goals at each stage.

## The User Archetype System

```typescript
// File: src/lib/ai/onboarding/archetypes.ts

// ============================================
// RESURGO USER ARCHETYPES
// Each archetype gets a different onboarding experience,
// different coach tone, different default settings,
// and different vision board style
// ============================================

export type UserArchetype =
  | 'the_rebuilder'      // Coming back from burnout/life crisis
  | 'the_optimizer'      // Already productive, wants to be better
  | 'the_scattered'      // ADHD/executive function challenges
  | 'the_seeker'         // Doesn't know what they want yet
  | 'the_ambitious'      // Clear goals, needs accountability
  | 'the_overwhelmed';   // Drowning, needs emergency simplification

export interface ArchetypeConfig {
  archetype: UserArchetype;
  label: string;
  description: string;
  // How the app behaves for this archetype:
  onboarding: {
    depthLevel: 'quick' | 'medium' | 'deep';
    skipBrainDump: boolean;
    autoCreateHabits: boolean;
    suggestedGoalCount: number;
  };
  coaching: {
    defaultTone: 'gentle' | 'direct' | 'challenging' | 'analytical';
    defaultCoach: string; // Coach persona ID
    checkInFrequency: 'twice_daily' | 'daily' | 'every_other_day';
    motivationalApproach: string;
  };
  ui: {
    dashboardComplexity: 'minimal' | 'standard' | 'full';
    showStreaks: boolean;
    showAnalytics: boolean;
    emergencyModeByDefault: boolean;
    visionBoardStyle: string;
  };
  firstAction: {
    type: 'brain_dump' | 'single_task' | 'goal_set' | 'coach_chat' | 'just_breathe';
    prompt: string;
  };
}

export const ARCHETYPE_CONFIGS: Record<UserArchetype, ArchetypeConfig> = {
  the_rebuilder: {
    archetype: 'the_rebuilder',
    label: 'The Rebuilder',
    description: 'Coming back from a tough time. Needs gentle rebuilding.',
    onboarding: {
      depthLevel: 'deep',
      skipBrainDump: false,
      autoCreateHabits: true,    // Start with simple defaults
      suggestedGoalCount: 2,     // Don't overwhelm
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'phoenix',   // The Comeback Specialist
      checkInFrequency: 'daily',
      motivationalApproach: 'Recovery is the goal. Small wins compound.',
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,          // Streaks can feel punishing during rebuilding
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'calm-nature',
    },
    firstAction: {
      type: 'coach_chat',
      prompt: "Welcome back. There's no pressure here. Tell me one thing you want to be different this week.",
    },
  },

  the_optimizer: {
    archetype: 'the_optimizer',
    label: 'The Optimizer',
    description: 'Already productive, looking for that extra edge.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,     // They have their own system
      suggestedGoalCount: 5,
    },
    coaching: {
      defaultTone: 'analytical',
      defaultCoach: 'atlas',       // The Strategic Planner
      checkInFrequency: 'daily',
      motivationalApproach: 'Data-driven improvement. Measure, iterate, optimize.',
    },
    ui: {
      dashboardComplexity: 'full',
      showStreaks: true,
      showAnalytics: true,
      emergencyModeByDefault: false,
      visionBoardStyle: 'clean-minimal',
    },
    firstAction: {
      type: 'brain_dump',
      prompt: "Dump everything on your plate. I'll organize and find the bottlenecks.",
    },
  },

  the_scattered: {
    archetype: 'the_scattered',
    label: 'The Scattered',
    description: 'ADHD/executive function challenges. Needs structure without rigidity.',
    onboarding: {
      depthLevel: 'medium',
      skipBrainDump: false,
      autoCreateHabits: true,
      suggestedGoalCount: 3,
    },
    coaching: {
      defaultTone: 'direct',
      defaultCoach: 'nova',        // The Energy Manager
      checkInFrequency: 'twice_daily',
      motivationalApproach: 'External structure is your friend, not your enemy. I\'ll be your working memory.',
    },
    ui: {
      dashboardComplexity: 'minimal',  // Less visual noise
      showStreaks: true,               // Gamification helps ADHD
      showAnalytics: false,            // Too much data is noise
      emergencyModeByDefault: false,
      visionBoardStyle: 'vibrant-colorful',
    },
    firstAction: {
      type: 'brain_dump',
      prompt: "I know your brain has 47 tabs open. Dump it ALL here. I'll sort the chaos.",
    },
  },

  the_seeker: {
    archetype: 'the_seeker',
    label: 'The Seeker',
    description: 'Doesn\'t know what they want. Needs exploration, not structure.',
    onboarding: {
      depthLevel: 'deep',
      skipBrainDump: true,        // No brain dump — they don't have tasks yet
      autoCreateHabits: true,     // Give them starter habits
      suggestedGoalCount: 1,      // Just ONE exploratory goal
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'sage',       // The Reflective Guide
      checkInFrequency: 'every_other_day',
      motivationalApproach: 'You don\'t need a destination to start walking. Let\'s explore.',
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'open-exploratory',
    },
    firstAction: {
      type: 'coach_chat',
      prompt: "There's no wrong answer here. What's been on your mind lately? Even if it's messy.",
    },
  },

  the_ambitious: {
    archetype: 'the_ambitious',
    label: 'The Ambitious',
    description: 'Clear goals, high energy, needs accountability not direction.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,
      suggestedGoalCount: 5,
    },
    coaching: {
      defaultTone: 'challenging',
      defaultCoach: 'titan',       // The Performance Coach
      checkInFrequency: 'twice_daily',
      motivationalApproach: 'You know what you want. I\'ll make sure you don\'t let yourself off the hook.',
    },
    ui: {
      dashboardComplexity: 'full',
      showStreaks: true,
      showAnalytics: true,
      emergencyModeByDefault: false,
      visionBoardStyle: 'bold-ambitious',
    },
    firstAction: {
      type: 'goal_set',
      prompt: "Let's set your top 3 goals. What are you going after?",
    },
  },

  the_overwhelmed: {
    archetype: 'the_overwhelmed',
    label: 'The Overwhelmed',
    description: 'Everything feels like too much. Needs radical simplification.',
    onboarding: {
      depthLevel: 'quick',        // Don't add MORE to their plate
      skipBrainDump: false,       // Brain dump IS relief for them
      autoCreateHabits: false,    // Zero new commitments
      suggestedGoalCount: 1,      // ONE thing only
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'phoenix',
      checkInFrequency: 'daily',
      motivationalApproach: 'You don\'t need to do everything. You need to do ONE thing. Let\'s find it.',
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,          // Pressure = bad
      showAnalytics: false,
      emergencyModeByDefault: true, // Start in emergency mode
      visionBoardStyle: 'calm-simple',
    },
    firstAction: {
      type: 'just_breathe',
      prompt: "Hey. Take a breath. You're here, and that's a start. Tell me one thing that's weighing on you the most right now. Just one.",
    },
  },
};
```

## The Archetype Detection Prompt

```typescript
// File: src/lib/ai/onboarding/archetype-detector.ts

import { callAI } from '../provider-router';
import type { UserArchetype } from './archetypes';

const DETECTION_PROMPT = `
# ROLE
You are RESURGO's User Archetype Detector. Based on the onboarding 
conversation, determine which archetype best matches this user.

# ARCHETYPES
1. the_rebuilder — Coming back from burnout, life crisis, major setback.
   SIGNALS: mentions past failures, "starting over", "getting back on track",
   references to difficult period, loss, or recovery.

2. the_optimizer — Already has systems, wants improvement.
   SIGNALS: mentions existing tools they use, specific metrics, "efficiency",
   "optimize", already has goals defined, tech-savvy language.

3. the_scattered — ADHD, executive function challenges, chronic disorganization.
   SIGNALS: mentions ADHD directly, "I start things but never finish", "I forget",
   "my brain is chaos", multiple tangents in one message, parenthetical asides.

4. the_seeker — Doesn't know what they want yet.
   SIGNALS: "I don't know", "figuring things out", "lost", "searching for purpose",
   no specific goals mentioned, philosophical questions.

5. the_ambitious — Clear goals, high drive, needs accountability.
   SIGNALS: specific goals with deadlines, competitive language, "I want to be the best",
   lists of things to achieve, mentions of business/career advancement.

6. the_overwhelmed — Drowning, needs radical simplification.
   SIGNALS: "everything is too much", "I can't handle", emotional distress,
   very long dumps of problems, mentions of anxiety/stress, "where do I even start".

# RULES
- Choose the SINGLE best match. Users will have traits of multiple archetypes.
  Pick the dominant one.
- If truly ambiguous, default to "the_seeker" (safest starting point).
- Confidence must be honest. Don't say 90% unless you're very sure.

# ONBOARDING DATA
${'{ONBOARDING_DATA}'}

# OUTPUT (JSON only)
{
  "archetype": "the_rebuilder|the_optimizer|the_scattered|the_seeker|the_ambitious|the_overwhelmed",
  "confidence": number (0-100),
  "reasoning": "Brief explanation of why this archetype",
  "secondary_archetype": "string|null (if strong secondary signal)",
  "detected_signals": ["list", "of", "specific", "signals", "from", "their", "text"]
}
`;

export async function detectArchetype(
  onboardingData: {
    brainDump?: string;
    lifeSituation?: string;
    schedule?: string;
    energyPattern?: string;
    goalsAnswer?: string;
    communicationStyle?: string;
  }
): Promise<{
  archetype: UserArchetype;
  confidence: number;
  reasoning: string;
  secondaryArchetype: UserArchetype | null;
}> {
  const response = await callAI({
    systemPrompt: DETECTION_PROMPT.replace(
      '{ONBOARDING_DATA}',
      JSON.stringify(onboardingData, null, 2)
    ),
    userMessage: 'Detect the user archetype from the onboarding data.',
    taskType: 'analysis',
    temperature: 0.2,
    maxTokens: 500,
    jsonMode: true,
  });

  try {
    const parsed = JSON.parse(
      response.content.substring(
        response.content.indexOf('{'),
        response.content.lastIndexOf('}') + 1
      )
    );

    return {
      archetype: parsed.archetype as UserArchetype,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      secondaryArchetype: parsed.secondary_archetype || null,
    };
  } catch {
    return {
      archetype: 'the_seeker',
      confidence: 20,
      reasoning: 'Detection failed — defaulting to seeker',
      secondaryArchetype: null,
    };
  }
}
```

## Save Archetype to User Record

```typescript
// Add to convex/schema.ts users table:

// In the users defineTable, add:
archetype: v.optional(v.string()),
archetypeConfidence: v.optional(v.number()),
secondaryArchetype: v.optional(v.union(v.string(), v.null())),
onboardingData: v.optional(v.string()), // JSON of onboarding answers
```

```typescript
// Add to convex/users.ts:

export const setArchetype = mutation({
  args: {
    userId: v.id('users'),
    archetype: v.string(),
    confidence: v.number(),
    secondaryArchetype: v.union(v.string(), v.null()),
    onboardingData: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      archetype: args.archetype,
      archetypeConfidence: args.confidence,
      secondaryArchetype: args.secondaryArchetype,
      onboardingData: args.onboardingData,
      onboardingComplete: true,
    });
  },
});
```

---

# SECTION 26: COMPLETE INTEGRATION MAP — HOW EVERYTHING CONNECTS

## The Full Data Flow (Onboarding → Segmentation → Psychology → Coaching → Actions → Vision Board)

```
USER SIGNS UP (Clerk Auth)
    ↓
ONBOARDING CONVERSATION STARTS (Section 9)
    ↓
AI ASKS: life situation, brain dump, goals, energy, style
    ↓
ARCHETYPE DETECTION (Section 25)
    ├── Analyzes ALL onboarding answers
    ├── Assigns archetype: e.g., "the_scattered"
    ├── Confidence: 78%
    └── Saves to Convex users table
    ↓
APP CONFIGURES ITSELF based on archetype:
    ├── Dashboard complexity → minimal
    ├── Default coach → Nova (Energy Manager)
    ├── Check-in frequency → twice daily
    ├── Streaks → shown (gamification helps ADHD)
    └── Analytics → hidden (too much noise)
    ↓
BRAIN DUMP PROCESSED (Section 7)
    ├── Raw text → AI parses → validated tasks
    ├── Tasks created in Convex (via AI Actions)
    └── Habits suggested
    ↓
FIRST COACHING SESSION (Section 8 + 22)
    ├── AI uses adaptive prompt (archetype + onboarding context)
    ├── User talks → AI responds + takes actions
    ├── Tasks created/updated in real-time
    └── Psychology profile begins building (Section 23)
    ↓
VISION BOARD GENERATED (Section 24)
    ├── Uses: goals + psychology profile + archetype
    ├── AI creates image prompts + affirmations
    ├── Cloudflare generates images (free)
    └── Board saved to dashboard
    ↓
DAILY OPERATION:
    ├── Morning: Telegram nudge (top tasks + affirmation from board)
    ├── Midday: Check-in ("Did you start #1?")
    ├── User talks to coach → actions execute live
    ├── Psychology profile refines (every 3rd interaction)
    ├── Evening: Recap + mood log
    └── Weekly: AI Review + board progress update
    ↓
CONTINUOUS IMPROVEMENT:
    ├── Archetype may shift (rebuilder → ambitious over time)
    ├── Coaching tone adapts as psychology profile deepens
    ├── Vision board regenerates when goals change
    └── Nudge frequency adjusts to engagement patterns
```

## New Environment Variables Summary (ALL sections):

```env
# === AI PROVIDERS (Section 6) ===
GROQ_API_KEY=gsk_...
GOOGLE_AI_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...
GITHUB_PAT=ghp_...

# === IMAGE GENERATION (Section 24) ===
CLOUDFLARE_IMAGE_API_URL=https://resurgo-image-gen.YOUR.workers.dev
CLOUDFLARE_IMAGE_API_KEY=your-strong-secret

# === PAYMENTS (Section 4) ===
DODO_API_KEY=...
DODO_WEBHOOK_SECRET=...

# === TELEGRAM (Section 10) ===
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...

# === CLERK (already set) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# === CONVEX (already set) ===
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

## New Convex Tables Summary (ALL sections):

```typescript
// Full schema additions:

// Section 5: Plan fields on users table
// Section 23: psychProfiles table
// Section 24: visionBoards table
// Section 22: suggestions table, reminders table
// Section 25: archetype fields on users table
```

## Implementation Priority:

```
PHASE 1 (Week 1-2): Core Systems
├── □ AI Provider Router (Section 6)
├── □ Brain Dump Pipeline (Section 7)
├── □ Dodo Payments + Entitlements (Sections 4-5)
├── □ Admin access for founder (Section 21)
└── □ Fix UI: nav, headings, branding (Section 13)

PHASE 2 (Week 2-3): The Living System
├── □ AI Actions System (Section 22)
├── □ Coach API with action execution
├── □ Real-time UI updates via Convex
├── □ Action toast notifications
└── □ Onboarding conversation flow (Section 9)

PHASE 3 (Week 3-4): Psychology + Segmentation
├── □ Psychology Profile Schema (Section 23)
├── □ Profile Builder (background updates)
├── □ Adaptive Coaching Prompts
├── □ Archetype Detection (Section 25)
├── □ Archetype-based app configuration
└── □ Safety flag handling

PHASE 4 (Week 4-5): Vision Board
├── □ Cloudflare Worker for image gen
├── □ Vision Board Generator
├── □ Image Service with fallback
├── □ Vision Board UI component
├── □ Board storage in Convex
└── □ Auto-regeneration when goals change

PHASE 5 (Week 5-6): Polish + Launch
├── □ Landing page (Section 11)
├── □ Blog system (Section 12)
├── □ Telegram bot activation (Section 10)
├── □ Pricing page
├── □ Marketing launch (Section 16)
└── □ ProductHunt preparation
```

---

**This is RESURGO's complete brain. Every system connects to every other system. The onboarding feeds the archetype detector which configures the UI which adapts the coaching which builds the psychology profile which generates the vision board which motivates the user which drives engagement which refines everything further. It's one living, breathing system.**

**Send all documents (Master + Addendum 1 + Addendum 2) to your coding AI. It now has everything it needs to build the greatest productivity app ever made.** 🚀




Here is the **complete indented feature schema + production-ready Zod schemas** for the entire Partner Engine. This is the single canonical type system your coding AI should implement.

---

# 📐 RESURGO.LIFE — COMPLETE FEATURE SCHEMA & PARTNER ENGINE TYPES
### The Canonical Type System — Every Feature, Every Action, Every Validation

---

## PART 1: INDENTED FEATURE MAP (THE FULL APP TREE)

```
RESURGO.LIFE
│
├── 🔐 AUTH (Clerk — no changes)
│   ├── SignUp
│   ├── SignIn
│   ├── SignOut
│   ├── SessionManagement
│   └── UserProfile
│
├── 💳 PAYMENTS (Dodo Payments)
│   ├── Products
│   │   ├── Free         → $0/forever
│   │   ├── ProMonthly   → $4.99/mo
│   │   ├── ProAnnual    → $29.99/yr
│   │   └── Lifetime     → $49.99/once
│   ├── WebhookHandler   → /api/webhooks/dodo
│   ├── Entitlements     → src/lib/entitlements.ts
│   │   ├── canAccess(plan, feature) → boolean
│   │   ├── getRemainingUsage(plan, feature, count) → number
│   │   └── PlanLimits config per tier
│   └── PricingPage      → /pricing (custom, not Clerk)
│
├── 🧠 PARTNER ENGINE (The Core AI System)
│   │
│   ├── 🔀 AI Provider Router
│   │   ├── Groq         → PRIMARY (coaching, braindump, conversation)
│   │   ├── Google AI    → SECONDARY (summarization, bulk, images)
│   │   ├── OpenRouter   → TERTIARY (fallback)
│   │   ├── GitHub Models → EMERGENCY (last resort)
│   │   ├── RateLimiter  → per-provider, per-minute tracking
│   │   ├── HealthScorer → exponential moving average per provider
│   │   └── TaskRouter   → routes by task type to best provider
│   │
│   ├── 🧩 Brain Dump Pipeline
│   │   ├── Input        → raw text (max 5000 chars)
│   │   ├── Sanitizer    → strip HTML, control chars
│   │   ├── Parser       → AI extracts tasks/emotions/habits
│   │   ├── Validator    → Zod schema + JSON extraction + sanitization
│   │   ├── Repairer     → retry with repair prompt on validation fail
│   │   ├── Retrier      → up to 3 attempts across providers
│   │   └── Output       → BrainDumpResponse (validated)
│   │       ├── emotions_detected[]
│   │       ├── emotional_acknowledgment
│   │       ├── tasks[]
│   │       │   ├── title, category, priority
│   │       │   ├── estimated_minutes, suggested_due
│   │       │   ├── depends_on, relates_to_goal
│   │       │   ├── energy_level, is_recurring
│   │       │   └── recurrence_pattern
│   │       ├── habits_suggested[]
│   │       ├── patterns_observed
│   │       ├── quick_win
│   │       ├── total_estimated_hours
│   │       ├── overcommitment_warning
│   │       └── overcommitment_message
│   │
│   ├── 💬 Coaching Engine
│   │   ├── SystemPrompt
│   │   │   ├── BasePersonality    → coaching-system-prompt.ts
│   │   │   ├── AdaptiveLayer      → psychology/adaptive-prompt.ts
│   │   │   ├── ActionCapabilities → actions/action-prompt.ts
│   │   │   └── UserContext        → goals, tasks, habits, streaks
│   │   ├── ConversationMemory    → last 20 messages
│   │   ├── CoachPersonas (6)
│   │   │   ├── PHOENIX  → Comeback Specialist    (free tier)
│   │   │   ├── ATLAS    → Strategic Planner      (pro)
│   │   │   ├── NOVA     → Energy Manager         (pro)
│   │   │   ├── SAGE     → Reflective Guide       (pro)
│   │   │   ├── TITAN    → Performance Coach      (pro)
│   │   │   └── SPARK    → Creative Catalyst      (pro)
│   │   └── Output       → PartnerEngineResponse (THE MASTER OUTPUT)
│   │       ├── message            (chat reply)
│   │       ├── actions[]          (app mutations)
│   │       ├── requiresConfirmation[] (indices needing user OK)
│   │       ├── moodInsight        (detected emotional state)
│   │       └── metadata           (provider, latency, tokens)
│   │
│   ├── ⚡ Action System (Live App Mutations)
│   │   ├── task.create
│   │   ├── task.update
│   │   ├── task.complete
│   │   ├── task.delete
│   │   ├── task.reschedule
│   │   ├── task.reprioritize
│   │   ├── habit.create
│   │   ├── habit.check_in
│   │   ├── habit.pause
│   │   ├── goal.create
│   │   ├── goal.update_progress
│   │   ├── goal.complete
│   │   ├── goal.decompose        → break into subtasks
│   │   ├── mood.log
│   │   ├── budget.log_expense
│   │   ├── budget.log_income
│   │   ├── reminder.schedule
│   │   ├── reminder.cancel
│   │   ├── moodboard.update      → regenerate/modify vision board
│   │   ├── moodboard.add_panel
│   │   ├── moodboard.remove_panel
│   │   ├── moodboard.change_theme
│   │   ├── emergency.activate
│   │   ├── emergency.deactivate
│   │   ├── coach.switch           → change active coach persona
│   │   ├── setting.update         → change user preferences
│   │   └── suggest                → requires confirmation
│   │
│   ├── 🧠 Psychology Engine
│   │   ├── BigFive (OCEAN) Profile
│   │   │   ├── openness         (1-10)
│   │   │   ├── conscientiousness (1-10)
│   │   │   ├── extraversion     (1-10)
│   │   │   ├── agreeableness    (1-10)
│   │   │   ├── neuroticism      (1-10)
│   │   │   └── confidence       (0-100%)
│   │   ├── Cognitive Patterns (CBT)
│   │   │   ├── all_or_nothing
│   │   │   ├── overgeneralization
│   │   │   ├── catastrophizing
│   │   │   ├── should_statements
│   │   │   ├── disqualifying_positive
│   │   │   ├── emotional_reasoning
│   │   │   ├── labeling
│   │   │   ├── mind_reading
│   │   │   ├── fortune_telling
│   │   │   └── personalization
│   │   ├── Motivational Profile (SDT + MI)
│   │   │   ├── autonomyNeed     (1-10)
│   │   │   ├── competenceNeed   (1-10)
│   │   │   ├── relatednessNeed  (1-10)
│   │   │   ├── primaryMotivation (intrinsic/identified/introjected/external)
│   │   │   └── changeStage      (precontemplation→maintenance→relapse)
│   │   ├── Behavioral Patterns
│   │   │   ├── peakProductivityTime
│   │   │   ├── procrastinationTriggers[]
│   │   │   ├── completionPatterns
│   │   │   ├── communicationPreferences
│   │   │   └── stressCopingStyle
│   │   ├── Safety Flags
│   │   │   ├── mentionedSelfHarm
│   │   │   ├── persistentLowMood
│   │   │   └── socialIsolationSignals
│   │   └── ProfileUpdater → runs async after every 3rd interaction
│   │
│   └── 🎯 Archetype System
│       ├── the_rebuilder
│       ├── the_optimizer
│       ├── the_scattered
│       ├── the_seeker
│       ├── the_ambitious
│       └── the_overwhelmed
│       Each configures:
│       ├── onboarding depth
│       ├── default coach persona
│       ├── dashboard complexity
│       ├── check-in frequency
│       ├── UI feature visibility
│       └── vision board style
│
├── 🎨 VISION/MOOD BOARD
│   ├── Generator        → AI creates config from goals + psychology
│   ├── ImageService     → Cloudflare (primary) + Gemini (fallback)
│   ├── Themes
│   │   ├── calm-nature         (rebuilder)
│   │   ├── clean-minimal       (optimizer)
│   │   ├── vibrant-colorful    (scattered)
│   │   ├── open-exploratory    (seeker)
│   │   ├── bold-ambitious      (ambitious)
│   │   └── calm-simple         (overwhelmed)
│   ├── Panels           → one per goal, with image + affirmation
│   ├── CenterAffirmation → overarching personal affirmation
│   ├── ProgressOverlay  → real-time goal progress on each panel
│   ├── AutoRegeneration → triggers when goals change significantly
│   └── Actions
│       ├── moodboard.update       → full regeneration
│       ├── moodboard.add_panel    → add panel for new goal
│       ├── moodboard.remove_panel → remove completed/abandoned goal
│       └── moodboard.change_theme → switch visual style
│
├── 📋 TASKS
│   ├── CRUD (create, read, update, delete)
│   ├── AI Priority Assignment
│   ├── Energy Level Tagging
│   ├── Category Assignment
│   ├── Due Date Management
│   ├── Dependency Tracking
│   ├── Recurrence
│   ├── Source Tracking (manual | ai_coach | brain_dump | telegram)
│   └── Completion Analytics
│
├── 🔥 HABITS
│   ├── CRUD
│   ├── Daily Check-In
│   ├── Streak Tracking (current + best)
│   ├── Frequency Options (daily | weekly | 3x_week | weekdays)
│   ├── Flexible Consistency (recovery mode, not rigid streaks)
│   ├── Time-of-Day Preference
│   └── Source Tracking
│
├── 🎯 GOALS
│   ├── CRUD
│   ├── Progress Tracking (0-100%)
│   ├── AI Decomposition (goal → subtasks)
│   ├── Status (active | paused | completed | abandoned)
│   ├── Template Library (/templates/[slug])
│   └── Vision Board Connection
│
├── 💰 BUDGET
│   ├── Log Expense
│   ├── Log Income
│   ├── Category Tracking
│   ├── Monthly Summary
│   └── Source Tracking
│
├── 🧘 WELLNESS
│   ├── Mood Logging (1-5 scale + emotions)
│   ├── Mood Trend Analysis
│   ├── Emergency Mode
│   │   ├── Activation (manual or AI-triggered)
│   │   ├── Simplifies to top 3 tasks only
│   │   ├── Calmer visual theme
│   │   └── Deactivation
│   └── Weekly AI Review
│
├── 📱 TELEGRAM BOT
│   ├── Commands: /start /add /today /done /habits /budget /coach /dump
│   ├── Nudge Engine
│   │   ├── Morning briefing
│   │   ├── Midday check-in
│   │   └── Evening recap
│   └── Natural Language Mode
│
├── 🏠 LANDING PAGE (14+ sections)
│   ├── Hero + CTA
│   ├── Problem Statement
│   ├── How It Works (3 steps)
│   ├── Brain Dump Demo
│   ├── Habit Tracking
│   ├── AI Coach Personas
│   ├── Telegram Integration
│   ├── ADHD-Friendly Design
│   ├── Rebuilder Use Case
│   ├── Developer Use Case
│   ├── Vision Board Feature
│   ├── Demo Video
│   ├── Pricing
│   ├── FAQ
│   ├── Final CTA
│   └── Footer
│
├── 📝 BLOG (/blog)
│   ├── SEO-optimized post template
│   ├── Table of Contents (sticky)
│   ├── TL;DR boxes
│   ├── Inline CTAs
│   └── Related Posts
│
├── 🔒 ADMIN (/admin)
│   ├── User count + plan breakdown
│   ├── Active sessions
│   ├── AI provider health
│   ├── Parse error logs
│   ├── Manual plan upgrades
│   └── isAdmin gate
│
└── 🔮 FUTURE (Phase 3+)
    ├── WhatsApp Integration
    ├── VS Code Extension
    ├── AI Toolkit (summarizer, email writer, decision helper)
    ├── Voice Brain Dump (Web Speech API)
    ├── Calendar Integration (Google/Outlook)
    ├── Wearable Sync (Apple Health/Google Fit)
    └── Light Mode / Terminal Mode Toggle
```

---

## PART 2: THE COMPLETE PARTNER ENGINE ZOD SCHEMAS

This is the **single canonical type file** that defines every type in the Partner Engine. All other files import from here.

```typescript
// ================================================================
// File: src/lib/ai/partner-engine/schemas.ts
//
// THE CANONICAL TYPE SYSTEM FOR RESURGO'S PARTNER ENGINE
// Every action, every response, every validation lives here.
// All other files import from this single source of truth.
// ================================================================

import { z } from 'zod';

// ================================================================
// SECTION A: SHARED ENUMS & PRIMITIVES
// ================================================================

export const TaskCategory = z.enum([
  'WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 'LEARNING',
  'SOCIAL', 'HOME', 'CREATIVE', 'ADMIN', 'URGENT_LIFE',
]);

export const TaskPriority = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const EnergyLevel = z.enum(['high', 'medium', 'low']);

export const HabitFrequency = z.enum(['daily', 'weekly', '3x_week', 'weekdays']);

export const TimeOfDay = z.enum(['morning', 'afternoon', 'evening', 'anytime']);

export const GoalStatus = z.enum(['active', 'paused', 'completed', 'abandoned']);

export const EmotionTag = z.enum([
  'overwhelmed', 'anxious', 'frustrated', 'hopeful',
  'motivated', 'exhausted', 'confused', 'guilty',
  'neutral', 'excited', 'proud', 'lonely',
  'grateful', 'angry', 'sad', 'calm',
]);

export const ReminderWhen = z.enum([
  'in_30_min', 'in_1_hour', 'in_3_hours',
  'tomorrow_morning', 'tomorrow_evening', 'custom',
]);

export const ReminderChannel = z.enum(['in_app', 'telegram', 'both']);

export const ActionSource = z.enum([
  'manual', 'ai_coach', 'brain_dump', 'telegram',
  'onboarding', 'weekly_review', 'nudge_engine',
]);

export const UserArchetype = z.enum([
  'the_rebuilder', 'the_optimizer', 'the_scattered',
  'the_seeker', 'the_ambitious', 'the_overwhelmed',
]);

export const CoachPersona = z.enum([
  'phoenix', 'atlas', 'nova', 'sage', 'titan', 'spark',
]);

export const MoodboardLayout = z.enum([
  'grid', 'collage', 'minimal', 'mosaic',
]);

export const MoodboardThemePreset = z.enum([
  'calm-nature', 'clean-minimal', 'vibrant-colorful',
  'open-exploratory', 'bold-ambitious', 'calm-simple',
]);

export const SuggestionType = z.enum([
  'task', 'habit', 'goal', 'break', 'reflection',
  'coach_switch', 'moodboard_refresh',
]);

// Safe string helpers
const SafeString = (max: number) => z.string().max(max).transform(s => s.trim());
const SafeTitle = SafeString(200).pipe(z.string().min(2));
const SafeNote = SafeString(500);
const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');
const ISODateTime = z.string().regex(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  'Must be ISO 8601'
);
const TimeString = z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM');
const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be #RRGGBB');


// ================================================================
// SECTION B: ALL PARTNER ENGINE ACTIONS (Discriminated Union)
// ================================================================

// ──────────────────────────────────────
// B1: TASK ACTIONS
// ──────────────────────────────────────

const TaskCreateAction = z.object({
  action: z.literal('task.create'),
  data: z.object({
    title: SafeTitle,
    category: TaskCategory,
    priority: TaskPriority,
    dueDate: DateString.nullable(),
    estimatedMinutes: z.number().int().min(5).max(480).nullable(),
    energyLevel: EnergyLevel,
    dependsOn: z.string().nullable().default(null),
    relatesTo: z.string().nullable().default(null), // goal title
    isRecurring: z.boolean().default(false),
    recurrencePattern: z.string().nullable().default(null),
  }),
});

const TaskUpdateAction = z.object({
  action: z.literal('task.update'),
  data: z.object({
    taskIdentifier: z.string().min(1), // title or ID for fuzzy match
    changes: z.object({
      title: SafeTitle.optional(),
      priority: TaskPriority.optional(),
      dueDate: DateString.nullable().optional(),
      category: TaskCategory.optional(),
      energyLevel: EnergyLevel.optional(),
      estimatedMinutes: z.number().int().min(5).max(480).nullable().optional(),
    }).refine(obj => Object.keys(obj).length > 0, {
      message: 'At least one change field is required',
    }),
  }),
});

const TaskCompleteAction = z.object({
  action: z.literal('task.complete'),
  data: z.object({
    taskIdentifier: z.string().min(1),
    completionNote: SafeNote.nullable().default(null),
  }),
});

const TaskDeleteAction = z.object({
  action: z.literal('task.delete'),
  data: z.object({
    taskIdentifier: z.string().min(1),
    reason: SafeNote.nullable().default(null),
  }),
});

const TaskRescheduleAction = z.object({
  action: z.literal('task.reschedule'),
  data: z.object({
    taskIdentifier: z.string().min(1),
    newDate: DateString,
    reason: SafeNote.nullable().default(null),
  }),
});

const TaskReprioritizeAction = z.object({
  action: z.literal('task.reprioritize'),
  data: z.object({
    taskIdentifier: z.string().min(1),
    newPriority: TaskPriority,
    reason: SafeNote.nullable().default(null),
  }),
});

// ──────────────────────────────────────
// B2: HABIT ACTIONS
// ──────────────────────────────────────

const HabitCreateAction = z.object({
  action: z.literal('habit.create'),
  data: z.object({
    name: SafeTitle,
    frequency: HabitFrequency,
    timeOfDay: TimeOfDay.default('anytime'),
    reminderTime: TimeString.nullable().default(null),
    goalConnection: z.string().nullable().default(null), // goal title
  }),
});

const HabitCheckInAction = z.object({
  action: z.literal('habit.check_in'),
  data: z.object({
    habitIdentifier: z.string().min(1),
    completed: z.boolean(),
    note: SafeNote.nullable().default(null),
  }),
});

const HabitPauseAction = z.object({
  action: z.literal('habit.pause'),
  data: z.object({
    habitIdentifier: z.string().min(1),
    resumeDate: DateString.nullable().default(null),
    reason: SafeNote.nullable().default(null),
  }),
});

// ──────────────────────────────────────
// B3: GOAL ACTIONS
// ──────────────────────────────────────

const GoalCreateAction = z.object({
  action: z.literal('goal.create'),
  data: z.object({
    title: SafeTitle,
    description: SafeNote.nullable().default(null),
    targetDate: DateString.nullable().default(null),
    category: TaskCategory,
  }),
});

const GoalUpdateProgressAction = z.object({
  action: z.literal('goal.update_progress'),
  data: z.object({
    goalIdentifier: z.string().min(1),
    progressDelta: z.number().min(-100).max(100),
    note: SafeNote.nullable().default(null),
  }),
});

const GoalCompleteAction = z.object({
  action: z.literal('goal.complete'),
  data: z.object({
    goalIdentifier: z.string().min(1),
    reflectionNote: SafeNote.nullable().default(null),
  }),
});

const GoalDecomposeAction = z.object({
  action: z.literal('goal.decompose'),
  data: z.object({
    goalIdentifier: z.string().min(1),
    subtasks: z.array(z.object({
      title: SafeTitle,
      priority: TaskPriority,
      estimatedMinutes: z.number().int().min(5).max(480).nullable(),
      order: z.number().int().min(0),
    })).min(1).max(10),
  }),
});

// ──────────────────────────────────────
// B4: MOOD / WELLNESS ACTIONS
// ──────────────────────────────────────

const MoodLogAction = z.object({
  action: z.literal('mood.log'),
  data: z.object({
    score: z.number().int().min(1).max(5),
    emotions: z.array(EmotionTag).min(1).max(5),
    note: SafeNote.nullable().default(null),
    triggers: z.array(z.string().max(50)).max(3).default([]),
  }),
});

// ──────────────────────────────────────
// B5: BUDGET ACTIONS
// ──────────────────────────────────────

const BudgetLogExpenseAction = z.object({
  action: z.literal('budget.log_expense'),
  data: z.object({
    amount: z.number().positive().max(1_000_000),
    currency: z.string().length(3).default('USD'), // ISO 4217
    category: z.string().min(1).max(50),
    description: SafeNote,
    date: DateString.nullable().default(null), // null = today
  }),
});

const BudgetLogIncomeAction = z.object({
  action: z.literal('budget.log_income'),
  data: z.object({
    amount: z.number().positive().max(10_000_000),
    currency: z.string().length(3).default('USD'),
    source: z.string().min(1).max(100),
    description: SafeNote.nullable().default(null),
    date: DateString.nullable().default(null),
  }),
});

// ──────────────────────────────────────
// B6: REMINDER ACTIONS
// ──────────────────────────────────────

const ReminderScheduleAction = z.object({
  action: z.literal('reminder.schedule'),
  data: z.object({
    message: SafeString(200),
    when: ReminderWhen,
    customTime: ISODateTime.nullable().default(null),
    channel: ReminderChannel,
    relatedTask: z.string().nullable().default(null),
  }),
});

const ReminderCancelAction = z.object({
  action: z.literal('reminder.cancel'),
  data: z.object({
    reminderIdentifier: z.string().min(1), // message text or ID
  }),
});

// ──────────────────────────────────────
// B7: MOODBOARD / VISION BOARD ACTIONS
// ──────────────────────────────────────

const MoodboardUpdateAction = z.object({
  action: z.literal('moodboard.update'),
  data: z.object({
    reason: z.enum([
      'goal_changed',       // A goal was added, completed, or modified
      'mood_shift',         // User's emotional state changed significantly
      'archetype_evolved',  // User archetype reassigned
      'user_requested',     // User explicitly asked for a refresh
      'weekly_refresh',     // Scheduled weekly update
      'progress_milestone', // Significant progress on a goal (25/50/75/100%)
    ]),
    regenerateImages: z.boolean().default(true),
    preservePanels: z.array(z.string()).default([]), // panel IDs to keep
    newAffirmation: SafeString(300).nullable().default(null), // override center affirmation
  }),
});

const MoodboardAddPanelAction = z.object({
  action: z.literal('moodboard.add_panel'),
  data: z.object({
    goalTitle: SafeTitle,
    category: TaskCategory,
    customImagePrompt: SafeString(500).nullable().default(null),
    customAffirmation: SafeString(200).nullable().default(null),
  }),
});

const MoodboardRemovePanelAction = z.object({
  action: z.literal('moodboard.remove_panel'),
  data: z.object({
    panelIdentifier: z.string().min(1), // panel ID or goal title
    reason: z.enum(['goal_completed', 'goal_abandoned', 'user_requested', 'replaced']),
  }),
});

const MoodboardChangeThemeAction = z.object({
  action: z.literal('moodboard.change_theme'),
  data: z.object({
    preset: MoodboardThemePreset.nullable().default(null),
    custom: z.object({
      colorPalette: z.array(HexColor).length(5),
      mood: z.string().max(50),
      fontStyle: z.enum(['serif-elegant', 'sans-modern', 'mono-tech']),
      layoutStyle: MoodboardLayout,
    }).nullable().default(null),
  }).refine(d => d.preset !== null || d.custom !== null, {
    message: 'Either preset or custom theme must be provided',
  }),
});

// ──────────────────────────────────────
// B8: EMERGENCY MODE ACTIONS
// ──────────────────────────────────────

const EmergencyActivateAction = z.object({
  action: z.literal('emergency.activate'),
  data: z.object({
    reason: SafeString(200),
    focusTasks: z.array(z.string().max(200)).min(1).max(3),
    durationHours: z.number().int().min(1).max(72).default(24),
  }),
});

const EmergencyDeactivateAction = z.object({
  action: z.literal('emergency.deactivate'),
  data: z.object({
    resumeAll: z.boolean().default(false), // restore full dashboard
  }),
});

// ──────────────────────────────────────
// B9: COACH / SETTINGS ACTIONS
// ──────────────────────────────────────

const CoachSwitchAction = z.object({
  action: z.literal('coach.switch'),
  data: z.object({
    persona: CoachPersona,
    reason: SafeNote.nullable().default(null),
  }),
});

const SettingUpdateAction = z.object({
  action: z.literal('setting.update'),
  data: z.object({
    key: z.enum([
      'checkInFrequency', 'dashboardComplexity', 'showStreaks',
      'showAnalytics', 'communicationStyle', 'reminderTime',
      'telegramNotifications', 'weeklyReviewDay',
    ]),
    value: z.union([z.string(), z.boolean(), z.number()]),
  }),
});

// ──────────────────────────────────────
// B10: SUGGESTION ACTION (always requires confirmation)
// ──────────────────────────────────────

const SuggestAction = z.object({
  action: z.literal('suggest'),
  data: z.object({
    type: SuggestionType,
    title: SafeTitle,
    description: SafeNote,
    reason: SafeString(200), // why the AI is suggesting this
    payload: z.record(z.unknown()).nullable().default(null),
    // payload contains the full action data to execute if confirmed
    // e.g., for a task suggestion, it's the task.create data
  }),
});


// ================================================================
// SECTION C: THE UNIFIED ACTION UNION
// ================================================================

export const PartnerAction = z.discriminatedUnion('action', [
  // Tasks
  TaskCreateAction,
  TaskUpdateAction,
  TaskCompleteAction,
  TaskDeleteAction,
  TaskRescheduleAction,
  TaskReprioritizeAction,
  // Habits
  HabitCreateAction,
  HabitCheckInAction,
  HabitPauseAction,
  // Goals
  GoalCreateAction,
  GoalUpdateProgressAction,
  GoalCompleteAction,
  GoalDecomposeAction,
  // Mood / Wellness
  MoodLogAction,
  // Budget
  BudgetLogExpenseAction,
  BudgetLogIncomeAction,
  // Reminders
  ReminderScheduleAction,
  ReminderCancelAction,
  // Moodboard / Vision Board
  MoodboardUpdateAction,
  MoodboardAddPanelAction,
  MoodboardRemovePanelAction,
  MoodboardChangeThemeAction,
  // Emergency
  EmergencyActivateAction,
  EmergencyDeactivateAction,
  // Coach / Settings
  CoachSwitchAction,
  SettingUpdateAction,
  // Suggestions
  SuggestAction,
]);

export type PartnerActionType = z.infer<typeof PartnerAction>;

// Helper: get all action type literals
export const ALL_ACTION_TYPES = [
  'task.create', 'task.update', 'task.complete', 'task.delete',
  'task.reschedule', 'task.reprioritize',
  'habit.create', 'habit.check_in', 'habit.pause',
  'goal.create', 'goal.update_progress', 'goal.complete', 'goal.decompose',
  'mood.log',
  'budget.log_expense', 'budget.log_income',
  'reminder.schedule', 'reminder.cancel',
  'moodboard.update', 'moodboard.add_panel', 'moodboard.remove_panel',
  'moodboard.change_theme',
  'emergency.activate', 'emergency.deactivate',
  'coach.switch', 'setting.update',
  'suggest',
] as const;


// ================================================================
// SECTION D: MOOD INSIGHT (Detected Emotional State)
// ================================================================

export const MoodInsightSchema = z.object({
  detectedMood: z.number().int().min(1).max(5),
  dominantEmotion: EmotionTag,
  secondaryEmotions: z.array(EmotionTag).max(3),
  energyEstimate: EnergyLevel,
  stressLevel: z.enum(['low', 'moderate', 'high', 'critical']),
  shouldLogMood: z.boolean()
    .describe('True if the emotional content is significant enough to log'),
  cognitiveDistortionDetected: z.enum([
    'none', 'all_or_nothing', 'overgeneralization', 'catastrophizing',
    'should_statements', 'disqualifying_positive', 'emotional_reasoning',
    'labeling', 'mind_reading', 'fortune_telling', 'personalization',
  ]).default('none'),
  safetyFlag: z.boolean().default(false)
    .describe('TRUE if self-harm, suicidal ideation, or severe distress detected'),
});

export type MoodInsight = z.infer<typeof MoodInsightSchema>;


// ================================================================
// SECTION E: THE MASTER PARTNER ENGINE RESPONSE
// ================================================================

export const PartnerEngineResponseSchema = z.object({
  // The chat message shown to the user
  message: z.string()
    .min(1)
    .max(5000)
    .describe('Conversational reply shown in chat UI'),

  // Actions to execute on the app (real-time mutations)
  actions: z.array(PartnerAction)
    .max(8)
    .default([])
    .describe('Actions to execute. Max 8 per response.'),

  // Indices of actions that need user OK before executing
  requiresConfirmation: z.array(z.number().int().min(0))
    .default([])
    .describe('Indices in actions[] that need user confirmation'),

  // AI assessment of user emotional state from this message
  moodInsight: MoodInsightSchema
    .nullable()
    .default(null)
    .describe('Null if message has no emotional content worth analyzing'),

  // Metadata for logging/debugging (NOT shown to user)
  metadata: z.object({
    confidenceScore: z.number().min(0).max(100)
      .describe('How confident AI is in this response'),
    contextUsed: z.array(z.enum([
      'goals', 'tasks', 'habits', 'psychology', 'archetype',
      'conversation_history', 'mood_history', 'budget', 'schedule',
    ])).describe('Which context sources influenced this response'),
    suggestedFollowUp: z.string().max(200).nullable().default(null)
      .describe('Internal note: what to ask about next time'),
  }).optional(),
});

export type PartnerEngineResponse = z.infer<typeof PartnerEngineResponseSchema>;


// ================================================================
// SECTION F: BRAIN DUMP RESPONSE (existing, kept for completeness)
// ================================================================

export const ParsedTaskSchema = z.object({
  title: SafeTitle,
  category: TaskCategory,
  priority: TaskPriority,
  estimated_minutes: z.number().int().min(5).max(480).nullable(),
  suggested_due: DateString.nullable(),
  depends_on: z.string().nullable(),
  relates_to_goal: z.string().nullable(),
  energy_level: EnergyLevel,
  is_recurring: z.boolean(),
  recurrence_pattern: z.string().nullable(),
});

export const BrainDumpResponseSchema = z.object({
  emotions_detected: z.array(EmotionTag).min(1),
  emotional_acknowledgment: z.string().min(10).max(300),
  tasks: z.array(ParsedTaskSchema).min(0).max(50),
  habits_suggested: z.array(z.object({
    name: z.string().min(2).max(100),
    frequency: HabitFrequency,
    reason: z.string().max(100),
  })),
  patterns_observed: z.string().max(500).nullable(),
  quick_win: z.string().max(200),
  total_estimated_hours: z.number().nullable(),
  overcommitment_warning: z.boolean(),
  overcommitment_message: z.string().max(300).nullable(),
});

export type ParsedTask = z.infer<typeof ParsedTaskSchema>;
export type BrainDumpResponse = z.infer<typeof BrainDumpResponseSchema>;


// ================================================================
// SECTION G: ARCHETYPE DETECTION RESPONSE
// ================================================================

export const ArchetypeDetectionSchema = z.object({
  archetype: UserArchetype,
  confidence: z.number().min(0).max(100),
  reasoning: z.string().max(300),
  secondaryArchetype: UserArchetype.nullable(),
  detectedSignals: z.array(z.string().max(100)).max(10),
});

export type ArchetypeDetection = z.infer<typeof ArchetypeDetectionSchema>;


// ================================================================
// SECTION H: VISION BOARD CONFIG
// ================================================================

export const VisionBoardPanelSchema = z.object({
  id: z.string(),
  goalTitle: SafeTitle,
  imagePrompt: z.string().max(500),
  affirmation: z.string().max(200),
  category: TaskCategory,
  progress: z.number().min(0).max(100),
  position: z.number().int().min(0),
  imageData: z.string().nullable().default(null), // base64 after generation
});

export const VisionBoardThemeSchema = z.object({
  colorPalette: z.array(HexColor).length(5),
  mood: z.string().max(50),
  fontStyle: z.enum(['serif-elegant', 'sans-modern', 'mono-tech']),
  layoutStyle: MoodboardLayout,
});

export const VisionBoardConfigSchema = z.object({
  userId: z.string(),
  title: z.string().max(100),
  theme: VisionBoardThemeSchema,
  panels: z.array(VisionBoardPanelSchema).min(1).max(12),
  centerAffirmation: z.string().max(300),
  generatedAt: z.string(),
  version: z.number().int().min(1),
});

export type VisionBoardPanel = z.infer<typeof VisionBoardPanelSchema>;
export type VisionBoardTheme = z.infer<typeof VisionBoardThemeSchema>;
export type VisionBoardConfig = z.infer<typeof VisionBoardConfigSchema>;


// ================================================================
// SECTION I: ACTION EXECUTION RESULT
// ================================================================

export const ActionResultSchema = z.object({
  action: z.string(),
  success: z.boolean(),
  message: z.string().max(300),
  entityId: z.string().nullable().default(null),  // Convex ID of created/updated entity
  data: z.record(z.unknown()).nullable().default(null),
  requiresConfirmation: z.boolean().default(false),
  error: z.string().nullable().default(null),
});

export type ActionResult = z.infer<typeof ActionResultSchema>;


// ================================================================
// SECTION J: TYPE EXPORTS (all in one place)
// ================================================================

export type {
  // Enums as types
  TaskCategoryType = z.infer<typeof TaskCategory>,
  TaskPriorityType = z.infer<typeof TaskPriority>,
  EnergyLevelType = z.infer<typeof EnergyLevel>,
  HabitFrequencyType = z.infer<typeof HabitFrequency>,
  UserArchetypeType = z.infer<typeof UserArchetype>,
  CoachPersonaType = z.infer<typeof CoachPersona>,
};
```

---

## PART 3: THE UNIVERSAL VALIDATOR + RETRY/REPAIR WRAPPER

This is a **generic, reusable** validator that works with ANY Zod schema — matching the Brain Dump parser pattern but applicable to every schema in the Partner Engine.

```typescript
// ================================================================
// File: src/lib/ai/partner-engine/validator.ts
//
// UNIVERSAL AI RESPONSE VALIDATOR WITH RETRY + REPAIR
// Works with ANY Zod schema. Used by:
//   - Brain Dump parser
//   - Partner Engine (coach responses)
//   - Archetype Detector
//   - Vision Board Generator
//   - Psychology Profile Builder
// ================================================================

import { z } from 'zod';
import { callAI, type AIRequest, type AIResponse } from '../provider-router';

// ================================================================
// 1. LOGGING
// ================================================================

export interface ValidationAttemptLog {
  timestamp: string;
  schemaName: string;
  attempt: number;
  phase: 'initial' | 'repair' | 'retry';
  provider: string;
  rawResponsePreview: string;  // first 300 chars
  validationErrors: string[] | null;
  success: boolean;
  latencyMs: number;
}

const validationLog: ValidationAttemptLog[] = [];
const MAX_LOG_SIZE = 200;

function log(entry: ValidationAttemptLog): void {
  validationLog.push(entry);
  if (validationLog.length > MAX_LOG_SIZE) validationLog.shift();

  if (!entry.success) {
    console.error(`[Validator:${entry.schemaName}] ${entry.phase} failed:`, {
      attempt: entry.attempt,
      provider: entry.provider,
      errors: entry.validationErrors?.slice(0, 3),
    });
  }
}

export function getValidationLog(schemaName?: string): ValidationAttemptLog[] {
  if (schemaName) {
    return validationLog.filter(l => l.schemaName === schemaName);
  }
  return [...validationLog];
}

// ================================================================
// 2. JSON EXTRACTION (handles all AI output quirks)
// ================================================================

function extractJSON(raw: string): string {
  // Strategy 1: Already valid JSON
  try {
    JSON.parse(raw);
    return raw;
  } catch { /* continue */ }

  // Strategy 2: Markdown code block ```json ... ```
  const codeBlockMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    const extracted = codeBlockMatch[1].trim();
    try {
      JSON.parse(extracted);
      return extracted;
    } catch { /* continue to next strategy */ }
  }

  // Strategy 3: First { to last }  (or [ to ])
  const firstBrace = raw.indexOf('{');
  const firstBracket = raw.indexOf('[');
  const lastBrace = raw.lastIndexOf('}');
  const lastBracket = raw.lastIndexOf(']');

  // Determine if it's an object or array
  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    if (firstBracket === -1 || firstBrace < firstBracket) {
      start = firstBrace;
      end = lastBrace;
    }
  }
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    if (start === -1 || firstBracket < start) {
      start = firstBracket;
      end = lastBracket;
    }
  }

  if (start !== -1 && end !== -1) {
    return raw.substring(start, end + 1);
  }

  // Strategy 4: Return as-is, let parse fail cleanly
  return raw;
}

function sanitizeJSON(jsonStr: string): string {
  return jsonStr
    // Remove trailing commas before } or ]
    .replace(/,\s*([}\]])/g, '$1')
    // Remove JavaScript-style comments
    .replace(/\/\/[^\n]*\n/g, '\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Fix single-quoted strings → double-quoted
    .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')
    // Remove dangerous control characters (keep \n, \r, \t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Fix unescaped newlines inside string values
    .replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, '\\n');
}

// ================================================================
// 3. CORE VALIDATION FUNCTION
// ================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  rawInput?: string;
}

export function validateAIResponse<T>(
  raw: string,
  schema: z.ZodType<T>
): ValidationResult<T> {
  try {
    // Step 1: Extract JSON from potential wrapper text
    const jsonStr = extractJSON(raw);

    // Step 2: Sanitize common issues
    const sanitized = sanitizeJSON(jsonStr);

    // Step 3: Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(sanitized);
    } catch (jsonError) {
      return {
        success: false,
        errors: [`JSON parse error: ${(jsonError as Error).message}`],
        rawInput: sanitized.substring(0, 200),
      };
    }

    // Step 4: Validate against Zod schema
    const result = schema.safeParse(parsed);

    if (result.success) {
      return { success: true, data: result.data };
    }

    // Collect Zod errors with paths
    const errors = result.error.issues.map(issue => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
      return `[${path}] ${issue.message} (got: ${JSON.stringify(issue.received ?? 'undefined').substring(0, 50)})`;
    });

    return { success: false, errors, rawInput: sanitized.substring(0, 200) };
  } catch (error) {
    return {
      success: false,
      errors: [`Unexpected validation error: ${(error as Error).message}`],
    };
  }
}

// ================================================================
// 4. REPAIR PROMPT BUILDER
// ================================================================

function buildRepairPrompt(
  schemaName: string,
  originalResponse: string,
  validationErrors: string[]
): string {
  return `
The previous JSON response for "${schemaName}" had validation errors.
Fix ONLY the errors listed below. Return ONLY corrected valid JSON.
No text, no markdown, no explanation — ONLY the JSON object.

ERRORS TO FIX:
${validationErrors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}

ORIGINAL RESPONSE TO FIX:
${originalResponse.substring(0, 3000)}

Return the corrected JSON now:
`.trim();
}

// ================================================================
// 5. THE MAIN VALIDATED AI CALL — PARSE → VALIDATE → REPAIR → RETRY
// ================================================================

export interface ValidatedAICallOptions<T> {
  // What to send to the AI
  request: AIRequest;

  // What schema to validate against
  schema: z.ZodType<T>;

  // Human-readable name for logging
  schemaName: string;

  // Max attempts (default: 3)
  maxAttempts?: number;

  // Whether to attempt JSON repair on validation failure (default: true)
  enableRepair?: boolean;

  // Whether to retry with a fresh call on total failure (default: true)
  enableRetry?: boolean;

  // Custom fallback if all attempts fail (optional)
  fallback?: () => T;
}

export interface ValidatedAICallResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  provider?: string;
  attempts: number;
  totalLatencyMs: number;
  log: ValidationAttemptLog[];
}

export async function validatedAICall<T>(
  options: ValidatedAICallOptions<T>
): Promise<ValidatedAICallResult<T>> {
  const {
    request,
    schema,
    schemaName,
    maxAttempts = 3,
    enableRepair = true,
    enableRetry = true,
    fallback,
  } = options;

  const startTime = Date.now();
  const attemptLogs: ValidationAttemptLog[] = [];
  let lastErrors: string[] = [];
  let lastRawResponse = '';

  // ── ATTEMPT 1: Fresh AI call ──
  let aiResponse: AIResponse;
  try {
    aiResponse = await callAI(request);
  } catch (error) {
    const entry: ValidationAttemptLog = {
      timestamp: new Date().toISOString(),
      schemaName,
      attempt: 1,
      phase: 'initial',
      provider: 'all-failed',
      rawResponsePreview: '',
      validationErrors: [(error as Error).message],
      success: false,
      latencyMs: Date.now() - startTime,
    };
    log(entry);
    attemptLogs.push(entry);

    if (fallback) {
      return {
        success: true,
        data: fallback(),
        attempts: 1,
        totalLatencyMs: Date.now() - startTime,
        log: attemptLogs,
      };
    }

    return {
      success: false,
      error: 'AI service unavailable. Please try again.',
      attempts: 1,
      totalLatencyMs: Date.now() - startTime,
      log: attemptLogs,
    };
  }

  // Validate attempt 1
  const v1 = validateAIResponse(aiResponse.content, schema);
  const entry1: ValidationAttemptLog = {
    timestamp: new Date().toISOString(),
    schemaName,
    attempt: 1,
    phase: 'initial',
    provider: aiResponse.provider,
    rawResponsePreview: aiResponse.content.substring(0, 300),
    validationErrors: v1.errors || null,
    success: v1.success,
    latencyMs: aiResponse.latencyMs,
  };
  log(entry1);
  attemptLogs.push(entry1);

  if (v1.success && v1.data !== undefined) {
    return {
      success: true,
      data: v1.data,
      provider: aiResponse.provider,
      attempts: 1,
      totalLatencyMs: Date.now() - startTime,
      log: attemptLogs,
    };
  }

  lastErrors = v1.errors || ['Unknown validation error'];
  lastRawResponse = aiResponse.content;

  // ── ATTEMPT 2: Repair ──
  if (enableRepair && maxAttempts >= 2) {
    try {
      const repairResponse = await callAI({
        systemPrompt: `You are a JSON repair assistant for the "${schemaName}" schema. Return ONLY valid JSON. No other text.`,
        userMessage: buildRepairPrompt(schemaName, lastRawResponse, lastErrors),
        taskType: 'analysis',
        temperature: 0.1,
        maxTokens: request.maxTokens || 4096,
        jsonMode: true,
      });

      const v2 = validateAIResponse(repairResponse.content, schema);
      const entry2: ValidationAttemptLog = {
        timestamp: new Date().toISOString(),
        schemaName,
        attempt: 2,
        phase: 'repair',
        provider: repairResponse.provider,
        rawResponsePreview: repairResponse.content.substring(0, 300),
        validationErrors: v2.errors || null,
        success: v2.success,
        latencyMs: repairResponse.latencyMs,
      };
      log(entry2);
      attemptLogs.push(entry2);

      if (v2.success && v2.data !== undefined) {
        return {
          success: true,
          data: v2.data,
          provider: repairResponse.provider,
          attempts: 2,
          totalLatencyMs: Date.now() - startTime,
          log: attemptLogs,
        };
      }

      lastErrors = v2.errors || lastErrors;
      lastRawResponse = repairResponse.content;
    } catch {
      const entryFail: ValidationAttemptLog = {
        timestamp: new Date().toISOString(),
        schemaName,
        attempt: 2,
        phase: 'repair',
        provider: 'repair-failed',
        rawResponsePreview: '',
        validationErrors: ['Repair call failed entirely'],
        success: false,
        latencyMs: Date.now() - startTime,
      };
      log(entryFail);
      attemptLogs.push(entryFail);
    }
  }

  // ── ATTEMPT 3: Full retry with stricter instructions ──
  if (enableRetry && maxAttempts >= 3) {
    try {
      const retryResponse = await callAI({
        ...request,
        systemPrompt: request.systemPrompt + `

CRITICAL INSTRUCTION: Your previous responses had JSON validation errors.
This is attempt 3 of 3. Be EXTREMELY careful with JSON formatting.
Double-check: every comma, every bracket, every quote, every field name.
Field names must EXACTLY match the schema. No extra fields. No missing required fields.
Return ONLY the JSON object. Absolutely no text before or after.

Previous errors were:
${lastErrors.slice(0, 5).map((e, i) => `${i + 1}. ${e}`).join('\n')}`,
        temperature: Math.max(0.1, (request.temperature || 0.7) - 0.3),
      });

      const v3 = validateAIResponse(retryResponse.content, schema);
      const entry3: ValidationAttemptLog = {
        timestamp: new Date().toISOString(),
        schemaName,
        attempt: 3,
        phase: 'retry',
        provider: retryResponse.provider,
        rawResponsePreview: retryResponse.content.substring(0, 300),
        validationErrors: v3.errors || null,
        success: v3.success,
        latencyMs: retryResponse.latencyMs,
      };
      log(entry3);
      attemptLogs.push(entry3);

      if (v3.success && v3.data !== undefined) {
        return {
          success: true,
          data: v3.data,
          provider: retryResponse.provider,
          attempts: 3,
          totalLatencyMs: Date.now() - startTime,
          log: attemptLogs,
        };
      }

      lastErrors = v3.errors || lastErrors;
    } catch {
      const entryFail: ValidationAttemptLog = {
        timestamp: new Date().toISOString(),
        schemaName,
        attempt: 3,
        phase: 'retry',
        provider: 'retry-failed',
        rawResponsePreview: '',
        validationErrors: ['Retry call failed entirely'],
        success: false,
        latencyMs: Date.now() - startTime,
      };
      log(entryFail);
      attemptLogs.push(entryFail);
    }
  }

  // ── ALL ATTEMPTS FAILED ──
  if (fallback) {
    return {
      success: true,
      data: fallback(),
      attempts: maxAttempts,
      totalLatencyMs: Date.now() - startTime,
      log: attemptLogs,
    };
  }

  return {
    success: false,
    error: `Validation failed after ${maxAttempts} attempts. Last errors: ${lastErrors.slice(0, 3).join('; ')}`,
    attempts: maxAttempts,
    totalLatencyMs: Date.now() - startTime,
    log: attemptLogs,
  };
}
```

---

## PART 4: USAGE — HOW EVERY SYSTEM CALLS THE VALIDATOR

Every system in the app uses `validatedAICall()` with its specific schema. Here's the complete usage map:

```typescript
// ================================================================
// File: src/lib/ai/partner-engine/index.ts
//
// THE PARTNER ENGINE — UNIFIED ENTRY POINT
// All AI interactions route through here.
// ================================================================

import {
  PartnerEngineResponseSchema,
  BrainDumpResponseSchema,
  ArchetypeDetectionSchema,
  VisionBoardConfigSchema,
  type PartnerEngineResponse,
  type BrainDumpResponse,
  type ArchetypeDetection,
  type VisionBoardConfig,
} from './schemas';
import { validatedAICall, type ValidatedAICallResult } from './validator';
import { buildCoachingSystemPrompt } from '../coaching-system-prompt';
import { buildAdaptiveCoachingInstructions } from '../psychology/adaptive-prompt';
import { ACTION_SYSTEM_PROMPT_EXTENSION } from '../actions/action-prompt';
import { buildBrainDumpSystemPrompt } from '../brain-dump/prompt';
import type { UserContext } from '../types';
import type { PsychProfile } from '../psychology/profile-schema';

// ================================================================
// 1. COACH CONVERSATION (returns actions + mood insight + moodboard)
// ================================================================

export async function processCoachMessage(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  userContext: UserContext,
  psychProfile: PsychProfile | null
): Promise<ValidatedAICallResult<PartnerEngineResponse>> {
  const systemPrompt = [
    buildCoachingSystemPrompt(userContext),
    buildAdaptiveCoachingInstructions(psychProfile),
    ACTION_SYSTEM_PROMPT_EXTENSION,
  ].join('\n\n');

  const formattedHistory = [
    ...conversationHistory.slice(-20).map(m => `${m.role}: ${m.content}`),
    `user: ${message}`,
  ].join('\n');

  return validatedAICall({
    request: {
      systemPrompt,
      userMessage: formattedHistory,
      taskType: 'coaching',
      temperature: 0.7,
      maxTokens: 3000,
      jsonMode: true,
    },
    schema: PartnerEngineResponseSchema,
    schemaName: 'PartnerEngineResponse',
    maxAttempts: 3,
    enableRepair: true,
    enableRetry: true,
    fallback: () => ({
      message: message.length > 0
        ? "I understood what you said, but I had a processing hiccup. Could you rephrase that?"
        : "I'm here. What's on your mind?",
      actions: [],
      requiresConfirmation: [],
      moodInsight: null,
      metadata: {
        confidenceScore: 0,
        contextUsed: [],
        suggestedFollowUp: null,
      },
    }),
  });
}

// ================================================================
// 2. BRAIN DUMP PROCESSING
// ================================================================

export async function processBrainDump(
  rawText: string,
  userContext: UserContext
): Promise<ValidatedAICallResult<BrainDumpResponse>> {
  const today = new Date().toISOString().split('T')[0];

  const truncated = rawText.length > 5000
    ? rawText.substring(0, 5000) + '\n[...truncated]'
    : rawText;

  return validatedAICall({
    request: {
      systemPrompt: buildBrainDumpSystemPrompt(userContext, today),
      userMessage: truncated,
      taskType: 'braindump',
      temperature: 0.3,
      maxTokens: 4096,
      jsonMode: true,
    },
    schema: BrainDumpResponseSchema,
    schemaName: 'BrainDumpResponse',
    maxAttempts: 3,
    enableRepair: true,
    enableRetry: true,
  });
}

// ================================================================
// 3. ARCHETYPE DETECTION
// ================================================================

export async function detectArchetype(
  onboardingData: Record<string, unknown>
): Promise<ValidatedAICallResult<ArchetypeDetection>> {
  return validatedAICall({
    request: {
      systemPrompt: `You are RESURGO's archetype detector. Analyze onboarding data and determine user archetype. Return JSON only.
      
Archetypes: the_rebuilder, the_optimizer, the_scattered, the_seeker, the_ambitious, the_overwhelmed.

Onboarding data:
${JSON.stringify(onboardingData, null, 2)}`,
      userMessage: 'Detect the user archetype from this onboarding data.',
      taskType: 'analysis',
      temperature: 0.2,
      maxTokens: 500,
      jsonMode: true,
    },
    schema: ArchetypeDetectionSchema,
    schemaName: 'ArchetypeDetection',
    maxAttempts: 2,
    enableRepair: true,
    enableRetry: false,
    fallback: () => ({
      archetype: 'the_seeker' as const,
      confidence: 10,
      reasoning: 'Detection failed — using safe default',
      secondaryArchetype: null,
      detectedSignals: [],
    }),
  });
}

// ================================================================
// 4. VISION BOARD GENERATION
// ================================================================

export async function generateVisionBoard(
  userContext: UserContext,
  psychProfile: PsychProfile | null
): Promise<ValidatedAICallResult<VisionBoardConfig>> {
  // Note: VisionBoardConfigSchema expects userId, generatedAt, version
  // which are added AFTER AI generates the core content.
  // Use a partial schema for AI output, then merge metadata.

  const AIVisionBoardOutput = VisionBoardConfigSchema.omit({
    userId: true,
    generatedAt: true,
    version: true,
  }).extend({
    panels: VisionBoardConfigSchema.shape.panels.element
      .omit({ id: true, progress: true, imageData: true })
      .array()
      .min(1)
      .max(12),
  });

  const result = await validatedAICall({
    request: {
      systemPrompt: `You are RESURGO's Vision Board Designer. Create a deeply personal board.
      
User goals: ${JSON.stringify(userContext.goals)}
Psychology: ${psychProfile ? JSON.stringify(psychProfile.bigFive) : 'Unknown'}
Communication style: ${userContext.communicationStyle || 'balanced'}

Return JSON only. Each panel needs goalTitle, imagePrompt (for Stable Diffusion), affirmation, category, position.`,
      userMessage: 'Generate a personalized vision board.',
      taskType: 'analysis',
      temperature: 0.8,
      maxTokens: 3000,
      jsonMode: true,
    },
    schema: AIVisionBoardOutput,
    schemaName: 'VisionBoardConfig',
    maxAttempts: 2,
    enableRepair: true,
    enableRetry: true,
  });

  if (!result.success || !result.data) {
    return {
      ...result,
      success: false,
      data: undefined,
    } as ValidatedAICallResult<VisionBoardConfig>;
  }

  // Merge AI output with metadata to form full VisionBoardConfig
  const fullConfig: VisionBoardConfig = {
    userId: userContext.email || 'unknown',
    title: result.data.title,
    theme: result.data.theme,
    centerAffirmation: result.data.centerAffirmation,
    generatedAt: new Date().toISOString(),
    version: 1,
    panels: result.data.panels.map((p: any, i: number) => ({
      ...p,
      id: `panel-${i}-${Date.now()}`,
      progress: userContext.goals?.find(
        g => g.title.toLowerCase().includes(p.goalTitle.toLowerCase())
      )?.progress || 0,
      imageData: null, // filled after image generation
    })),
  };

  return {
    ...result,
    data: fullConfig,
  };
}
```

---

## PART 5: MOODBOARD ACTION EXECUTOR

```typescript
// ================================================================
// File: src/lib/ai/partner-engine/moodboard-executor.ts
//
// Handles all moodboard.* actions from the Partner Engine
// ================================================================

import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { generateVisionBoard } from './index';
import { generateBoardImages } from '../vision-board/image-service';
import { getUserContext } from '../../user-context';
import type { PartnerActionType, ActionResult, VisionBoardConfig } from './schemas';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function executeMoodboardAction(
  userId: string,
  convexUserId: string,
  action: PartnerActionType
): Promise<ActionResult> {
  switch (action.action) {

    // ── FULL REGENERATION ──
    case 'moodboard.update': {
      try {
        const userContext = await getUserContext(userId);
        // Get psych profile
        let psychProfile = null;
        try {
          const doc = await convex.query(api.psychology.getProfile, {
            userId: convexUserId as any,
          });
          if (doc) psychProfile = JSON.parse(doc.profile);
        } catch { /* no profile yet */ }

        // Generate new config
        const result = await generateVisionBoard(userContext, psychProfile);
        if (!result.success || !result.data) {
          return {
            action: 'moodboard.update',
            success: false,
            message: 'Failed to generate new vision board',
            entityId: null,
            data: null,
            requiresConfirmation: false,
            error: result.error || null,
          };
        }

        let boardConfig = result.data;

        // Generate images if requested
        if (action.data.regenerateImages) {
          const images = await generateBoardImages(
            boardConfig.panels.map(p => ({
              id: p.id,
              imagePrompt: p.imagePrompt,
            }))
          );
          boardConfig = {
            ...boardConfig,
            panels: boardConfig.panels.map(p => ({
              ...p,
              imageData: images.get(p.id) || null,
            })),
          };
        }

        // Override center affirmation if provided
        if (action.data.newAffirmation) {
          boardConfig.centerAffirmation = action.data.newAffirmation;
        }

        // Save to DB
        const boardId = await convex.mutation(api.visionBoards.save, {
          userId: convexUserId as any,
          config: JSON.stringify(boardConfig),
          version: boardConfig.version,
        });

        return {
          action: 'moodboard.update',
          success: true,
          message: `Vision board regenerated (reason: ${action.data.reason})`,
          entityId: boardId?.toString() || null,
          data: { panelCount: boardConfig.panels.length },
          requiresConfirmation: false,
          error: null,
        };
      } catch (error) {
        return {
          action: 'moodboard.update',
          success: false,
          message: 'Vision board update failed',
          entityId: null,
          data: null,
          requiresConfirmation: false,
          error: (error as Error).message,
        };
      }
    }

    // ── ADD SINGLE PANEL ──
    case 'moodboard.add_panel': {
      try {
        const existingDoc = await convex.query(api.visionBoards.getActive, {
          userId: convexUserId as any,
        });
        if (!existingDoc) {
          return {
            action: 'moodboard.add_panel',
            success: false,
            message: 'No active vision board to add panel to. Generate one first.',
            entityId: null, data: null,
            requiresConfirmation: false, error: null,
          };
        }

        const board: VisionBoardConfig = JSON.parse(existingDoc.config);
        const newPanel = {
          id: `panel-${board.panels.length}-${Date.now()}`,
          goalTitle: action.data.goalTitle,
          imagePrompt: action.data.customImagePrompt ||
            `Aspirational visualization of achieving "${action.data.goalTitle}", photorealistic, warm lighting, high quality`,
          affirmation: action.data.customAffirmation ||
            `I am making progress on ${action.data.goalTitle} every day.`,
          category: action.data.category,
          progress: 0,
          position: board.panels.length,
          imageData: null as string | null,
        };

        // Generate image for new panel
        const { generateImage } = await import('../vision-board/image-service');
        const imgResult = await generateImage(newPanel.imagePrompt);
        if (imgResult.success && imgResult.imageData) {
          newPanel.imageData = imgResult.imageData;
        }

        board.panels.push(newPanel);
        board.version += 1;

        await convex.mutation(api.visionBoards.save, {
          userId: convexUserId as any,
          config: JSON.stringify(board),
          version: board.version,
        });

        return {
          action: 'moodboard.add_panel',
          success: true,
          message: `Added "${action.data.goalTitle}" to vision board`,
          entityId: newPanel.id,
          data: null,
          requiresConfirmation: false,
          error: null,
        };
      } catch (error) {
        return {
          action: 'moodboard.add_panel',
          success: false,
          message: 'Failed to add panel',
          entityId: null, data: null,
          requiresConfirmation: false,
          error: (error as Error).message,
        };
      }
    }

    // ── REMOVE PANEL ──
    case 'moodboard.remove_panel': {
      try {
        const existingDoc = await convex.query(api.visionBoards.getActive, {
          userId: convexUserId as any,
        });
        if (!existingDoc) {
          return {
            action: 'moodboard.remove_panel',
            success: false,
            message: 'No active vision board.',
            entityId: null, data: null,
            requiresConfirmation: false, error: null,
          };
        }

        const board: VisionBoardConfig = JSON.parse(existingDoc.config);
        const searchLower = action.data.panelIdentifier.toLowerCase();
        const panelIndex = board.panels.findIndex(
          p => p.id === action.data.panelIdentifier ||
               p.goalTitle.toLowerCase().includes(searchLower)
        );

        if (panelIndex === -1) {
          return {
            action: 'moodboard.remove_panel',
            success: false,
            message: `Panel "${action.data.panelIdentifier}" not found`,
            entityId: null, data: null,
            requiresConfirmation: false, error: null,
          };
        }

        const removedTitle = board.panels[panelIndex].goalTitle;
        board.panels.splice(panelIndex, 1);
        // Re-index positions
        board.panels.forEach((p, i) => { p.position = i; });
        board.version += 1;

        await convex.mutation(api.visionBoards.save, {
          userId: convexUserId as any,
          config: JSON.stringify(board),
          version: board.version,
        });

        return {
          action: 'moodboard.remove_panel',
          success: true,
          message: `Removed "${removedTitle}" from vision board (${action.data.reason})`,
          entityId: null, data: null,
          requiresConfirmation: false, error: null,
        };
      } catch (error) {
        return {
          action: 'moodboard.remove_panel',
          success: false,
          message: 'Failed to remove panel',
          entityId: null, data: null,
          requiresConfirmation: false,
          error: (error as Error).message,
        };
      }
    }

    // ── CHANGE THEME ──
    case 'moodboard.change_theme': {
      try {
        const existingDoc = await convex.query(api.visionBoards.getActive, {
          userId: convexUserId as any,
        });
        if (!existingDoc) {
          return {
            action: 'moodboard.change_theme',
            success: false,
            message: 'No active vision board.',
            entityId: null, data: null,
            requiresConfirmation: false, error: null,
          };
        }

        const board: VisionBoardConfig = JSON.parse(existingDoc.config);

        if (action.data.custom) {
          board.theme = action.data.custom;
        } else if (action.data.preset) {
          // Map presets to actual themes
          const PRESET_THEMES: Record<string, typeof board.theme> = {
            'calm-nature': {
              colorPalette: ['#4A7C59', '#8FBC8F', '#F5F5DC', '#D2B48C', '#2E4E3F'],
              mood: 'calm-nature',
              fontStyle: 'serif-elegant',
              layoutStyle: 'minimal',
            },
            'clean-minimal': {
              colorPalette: ['#2D2D2D', '#FFFFFF', '#4A90D9', '#F0F0F0', '#333333'],
              mood: 'clean-minimal',
              fontStyle: 'sans-modern',
              layoutStyle: 'grid',
            },
            'vibrant-colorful': {
              colorPalette: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#2D3436'],
              mood: 'vibrant-colorful',
              fontStyle: 'sans-modern',
              layoutStyle: 'collage',
            },
            'open-exploratory': {
              colorPalette: ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#2D3436'],
              mood: 'open-exploratory',
              fontStyle: 'serif-elegant',
              layoutStyle: 'mosaic',
            },
            'bold-ambitious': {
              colorPalette: ['#E74C3C', '#F39C12', '#2C3E50', '#ECF0F1', '#1A1A2E'],
              mood: 'bold-ambitious',
              fontStyle: 'sans-modern',
              layoutStyle: 'grid',
            },
            'calm-simple': {
              colorPalette: ['#B8D4E3', '#F7F1E3', '#A3CB38', '#778CA3', '#2C3A47'],
              mood: 'calm-simple',
              fontStyle: 'sans-modern',
              layoutStyle: 'minimal',
            },
          };

          const presetTheme = PRESET_THEMES[action.data.preset];
          if (presetTheme) {
            board.theme = presetTheme;
          }
        }

        board.version += 1;

        await convex.mutation(api.visionBoards.save, {
          userId: convexUserId as any,
          config: JSON.stringify(board),
          version: board.version,
        });

        return {
          action: 'moodboard.change_theme',
          success: true,
          message: `Vision board theme updated to ${action.data.preset || 'custom'}`,
          entityId: null, data: null,
          requiresConfirmation: false, error: null,
        };
      } catch (error) {
        return {
          action: 'moodboard.change_theme',
          success: false,
          message: 'Failed to change theme',
          entityId: null, data: null,
          requiresConfirmation: false,
          error: (error as Error).message,
        };
      }
    }

    default:
      return {
        action: (action as any).action,
        success: false,
        message: `Unknown moodboard action: ${(action as any).action}`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
  }
}
```

---

## PART 6: UPDATED MASTER ACTION EXECUTOR (Routes All Actions)

```typescript
// ================================================================
// File: src/lib/ai/partner-engine/executor.ts
//
// MASTER ACTION EXECUTOR — Routes every PartnerAction to its handler
// ================================================================

import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { PartnerAction, type PartnerActionType, type ActionResult } from './schemas';
import { executeMoodboardAction } from './moodboard-executor';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function executePartnerActions(
  userId: string,       // Clerk user ID
  convexUserId: string, // Convex document ID
  actions: PartnerActionType[],
  confirmationIndices: number[]
): Promise<ActionResult[]> {
  const results: ActionResult[] = [];

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    const needsConfirmation = confirmationIndices.includes(i);

    // Validate action
    const validation = PartnerAction.safeParse(action);
    if (!validation.success) {
      results.push({
        action: action.action,
        success: false,
        message: `Invalid action: ${validation.error.issues[0]?.message}`,
        entityId: null, data: null,
        requiresConfirmation: false,
        error: validation.error.message,
      });
      continue;
    }

    // Store pending if confirmation needed
    if (needsConfirmation) {
      await convex.mutation(api.suggestions.create, {
        userId: convexUserId as any,
        actionType: action.action,
        payload: JSON.stringify(action),
        status: 'pending',
      });
      results.push({
        action: action.action,
        success: true,
        message: 'Awaiting your confirmation',
        entityId: null,
        data: action.data as Record<string, unknown>,
        requiresConfirmation: true,
        error: null,
      });
      continue;
    }

    // Route to correct executor
    try {
      const result = await routeAction(userId, convexUserId, validation.data);
      results.push(result);
    } catch (error) {
      results.push({
        action: action.action,
        success: false,
        message: `Execution failed: ${(error as Error).message}`,
        entityId: null, data: null,
        requiresConfirmation: false,
        error: (error as Error).message,
      });
    }
  }

  return results;
}

async function routeAction(
  userId: string,
  convexUserId: string,
  action: PartnerActionType
): Promise<ActionResult> {
  const actionGroup = action.action.split('.')[0];

  switch (actionGroup) {
    // ── TASK ACTIONS ──
    case 'task':
      return executeTaskAction(userId, convexUserId, action);

    // ── HABIT ACTIONS ──
    case 'habit':
      return executeHabitAction(userId, convexUserId, action);

    // ── GOAL ACTIONS ──
    case 'goal':
      return executeGoalAction(userId, convexUserId, action);

    // ── MOOD ACTIONS ──
    case 'mood':
      return executeMoodAction(userId, convexUserId, action);

    // ── BUDGET ACTIONS ──
    case 'budget':
      return executeBudgetAction(userId, convexUserId, action);

    // ── REMINDER ACTIONS ──
    case 'reminder':
      return executeReminderAction(userId, convexUserId, action);

    // ── MOODBOARD ACTIONS ──
    case 'moodboard':
      return executeMoodboardAction(userId, convexUserId, action);

    // ── EMERGENCY ACTIONS ──
    case 'emergency':
      return executeEmergencyAction(userId, convexUserId, action);

    // ── COACH ACTIONS ──
    case 'coach':
      return executeCoachAction(userId, convexUserId, action);

    // ── SETTINGS ACTIONS ──
    case 'setting':
      return executeSettingAction(userId, convexUserId, action);

    // ── SUGGESTIONS ──
    case 'suggest':
      return executeSuggestAction(userId, convexUserId, action);

    default:
      return {
        action: action.action,
        success: false,
        message: `Unknown action group: ${actionGroup}`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
  }
}

// ── Each group handler follows the same pattern ──
// These call Convex mutations and return ActionResult

async function executeTaskAction(
  userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  switch (action.action) {
    case 'task.create': {
      const id = await convex.mutation(api.tasks.createFromAI, {
        userId: convexUserId,
        title: action.data.title,
        category: action.data.category,
        priority: action.data.priority,
        dueDate: action.data.dueDate,
        estimatedMinutes: action.data.estimatedMinutes,
        energyLevel: action.data.energyLevel,
        source: 'ai_coach',
      });
      return {
        action: 'task.create', success: true,
        message: `Task created: "${action.data.title}"`,
        entityId: id?.toString() || null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'task.update': {
      await convex.mutation(api.tasks.updateByTitle, {
        userId: convexUserId,
        titleSearch: action.data.taskIdentifier,
        changes: action.data.changes,
      });
      return {
        action: 'task.update', success: true,
        message: `Task updated: "${action.data.taskIdentifier}"`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'task.complete': {
      await convex.mutation(api.tasks.updateByTitle, {
        userId: convexUserId,
        titleSearch: action.data.taskIdentifier,
        changes: { completed: true },
      });
      return {
        action: 'task.complete', success: true,
        message: `✅ Completed: "${action.data.taskIdentifier}"`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'task.delete': {
      await convex.mutation(api.tasks.deleteByTitle, {
        userId: convexUserId,
        titleSearch: action.data.taskIdentifier,
      });
      return {
        action: 'task.delete', success: true,
        message: `Removed: "${action.data.taskIdentifier}"`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'task.reschedule': {
      await convex.mutation(api.tasks.updateByTitle, {
        userId: convexUserId,
        titleSearch: action.data.taskIdentifier,
        changes: { dueDate: action.data.newDate },
      });
      return {
        action: 'task.reschedule', success: true,
        message: `Rescheduled "${action.data.taskIdentifier}" to ${action.data.newDate}`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'task.reprioritize': {
      await convex.mutation(api.tasks.updateByTitle, {
        userId: convexUserId,
        titleSearch: action.data.taskIdentifier,
        changes: { priority: action.data.newPriority },
      });
      return {
        action: 'task.reprioritize', success: true,
        message: `"${action.data.taskIdentifier}" → ${action.data.newPriority} priority`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    default:
      return {
        action: action.action, success: false,
        message: `Unknown task action: ${action.action}`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
  }
}

async function executeHabitAction(
  userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  switch (action.action) {
    case 'habit.create': {
      const id = await convex.mutation(api.habits.createFromAI, {
        userId: convexUserId,
        name: action.data.name,
        frequency: action.data.frequency,
        timeOfDay: action.data.timeOfDay,
        source: 'ai_coach',
      });
      return {
        action: 'habit.create', success: true,
        message: `Habit created: "${action.data.name}" (${action.data.frequency})`,
        entityId: id?.toString() || null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'habit.check_in': {
      await convex.mutation(api.habits.checkIn, {
        userId: convexUserId,
        habitSearch: action.data.habitIdentifier,
        completed: action.data.completed,
      });
      return {
        action: 'habit.check_in', success: true,
        message: action.data.completed
          ? `✅ "${action.data.habitIdentifier}" done!`
          : `⏭ "${action.data.habitIdentifier}" skipped`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'habit.pause': {
      await convex.mutation(api.habits.pause, {
        userId: convexUserId,
        habitSearch: action.data.habitIdentifier,
        resumeDate: action.data.resumeDate,
      });
      return {
        action: 'habit.pause', success: true,
        message: `"${action.data.habitIdentifier}" paused${action.data.resumeDate ? ` until ${action.data.resumeDate}` : ''}`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    default:
      return {
        action: action.action, success: false,
        message: `Unknown habit action`, entityId: null,
        data: null, requiresConfirmation: false, error: null,
      };
  }
}

async function executeGoalAction(
  userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  switch (action.action) {
    case 'goal.create': {
      const id = await convex.mutation(api.goals.createFromAI, {
        userId: convexUserId,
        title: action.data.title,
        description: action.data.description,
        targetDate: action.data.targetDate,
        category: action.data.category,
        source: 'ai_coach',
      });
      return {
        action: 'goal.create', success: true,
        message: `Goal created: "${action.data.title}"`,
        entityId: id?.toString() || null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'goal.update_progress': {
      await convex.mutation(api.goals.updateByTitle, {
        userId: convexUserId,
        titleSearch: action.data.goalIdentifier,
        progressDelta: action.data.progressDelta,
        note: action.data.note,
      });
      return {
        action: 'goal.update_progress', success: true,
        message: `"${action.data.goalIdentifier}" progress +${action.data.progressDelta}%`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'goal.complete': {
      await convex.mutation(api.goals.updateByTitle, {
        userId: convexUserId,
        titleSearch: action.data.goalIdentifier,
        newStatus: 'completed',
        note: action.data.reflectionNote,
      });
      return {
        action: 'goal.complete', success: true,
        message: `🎉 Goal completed: "${action.data.goalIdentifier}"`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    case 'goal.decompose': {
      for (const subtask of action.data.subtasks) {
        await convex.mutation(api.tasks.createFromAI, {
          userId: convexUserId,
          title: subtask.title,
          category: 'PERSONAL',
          priority: subtask.priority,
          dueDate: null,
          estimatedMinutes: subtask.estimatedMinutes,
          energyLevel: 'medium',
          source: 'ai_coach',
        });
      }
      return {
        action: 'goal.decompose', success: true,
        message: `"${action.data.goalIdentifier}" broken into ${action.data.subtasks.length} subtasks`,
        entityId: null, data: null,
        requiresConfirmation: false, error: null,
      };
    }
    default:
      return {
        action: action.action, success: false,
        message: 'Unknown goal action', entityId: null,
        data: null, requiresConfirmation: false, error: null,
      };
  }
}

async function executeMoodAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action !== 'mood.log') {
    return { action: action.action, success: false, message: 'Unknown mood action',
             entityId: null, data: null, requiresConfirmation: false, error: null };
  }
  await convex.mutation(api.wellness.logMood, {
    userId: convexUserId,
    score: action.data.score,
    emotions: action.data.emotions,
    note: action.data.note || null,
    triggers: action.data.triggers,
    source: 'ai_coach',
  });
  return {
    action: 'mood.log', success: true,
    message: `Mood logged: ${action.data.score}/5 (${action.data.emotions[0]})`,
    entityId: null, data: null,
    requiresConfirmation: false, error: null,
  };
}

async function executeBudgetAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action === 'budget.log_expense') {
    await convex.mutation(api.budget.logExpense, {
      userId: convexUserId,
      amount: action.data.amount,
      category: action.data.category,
      description: action.data.description,
      source: 'ai_coach',
    });
    return {
      action: 'budget.log_expense', success: true,
      message: `Expense logged: $${action.data.amount} (${action.data.category})`,
      entityId: null, data: null,
      requiresConfirmation: false, error: null,
    };
  }
  if (action.action === 'budget.log_income') {
    await convex.mutation(api.budget.logIncome, {
      userId: convexUserId,
      amount: action.data.amount,
      source: action.data.source,
      description: action.data.description,
    });
    return {
      action: 'budget.log_income', success: true,
      message: `Income logged: $${action.data.amount} from ${action.data.source}`,
      entityId: null, data: null,
      requiresConfirmation: false, error: null,
    };
  }
  return { action: action.action, success: false, message: 'Unknown budget action',
           entityId: null, data: null, requiresConfirmation: false, error: null };
}

async function executeReminderAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action === 'reminder.schedule') {
    await convex.mutation(api.reminders.create, {
      userId: convexUserId,
      message: action.data.message,
      when: action.data.when,
      customTime: action.data.customTime || null,
      channel: action.data.channel,
    });
    return {
      action: 'reminder.schedule', success: true,
      message: `Reminder set: "${action.data.message}" (${action.data.when})`,
      entityId: null, data: null,
      requiresConfirmation: false, error: null,
    };
  }
  if (action.action === 'reminder.cancel') {
    await convex.mutation(api.reminders.cancelByMessage, {
      userId: convexUserId,
      messageSearch: action.data.reminderIdentifier,
    });
    return {
      action: 'reminder.cancel', success: true,
      message: `Reminder cancelled`,
      entityId: null, data: null,
      requiresConfirmation: false, error: null,
    };
  }
  return { action: action.action, success: false, message: 'Unknown reminder action',
           entityId: null, data: null, requiresConfirmation: false, error: null };
}

async function executeEmergencyAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action === 'emergency.activate') {
    await convex.mutation(api.users.setEmergencyMode, {
      userId: convexUserId,
      active: true,
      reason: action.data.reason,
      focusTasks: action.data.focusTasks,
      durationHours: action.data.durationHours,
    });
    return {
      action: 'emergency.activate', success: true,
      message: `🆘 Emergency mode ON. Focus: ${action.data.focusTasks.length} tasks only.`,
      entityId: null, data: null,
      requiresConfirmation: false, error: null,
    };
  }
  if (action.action === 'emergency.deactivate') {
    await convex.mutation(api.users.setEmergencyMode, {
      userId: convexUserId,
      active: false,
      reason: 'Deactivated',
      focusTasks: [],
      durationHours: 0,
    });
    return {
      action: 'emergency.deactivate', success: true,
      message: '✅ Emergency mode OFF. Full dashboard restored.',
      entityId: null, data: null,
      requiresConfirmation: false, error: null,
    };
  }
  return { action: action.action, success: false, message: 'Unknown emergency action',
           entityId: null, data: null, requiresConfirmation: false, error: null };
}

async function executeCoachAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action !== 'coach.switch') {
    return { action: action.action, success: false, message: 'Unknown coach action',
             entityId: null, data: null, requiresConfirmation: false, error: null };
  }
  await convex.mutation(api.users.updateSettings, {
    userId: convexUserId,
    settings: { activeCoach: action.data.persona },
  });
  return {
    action: 'coach.switch', success: true,
    message: `Coach switched to ${action.data.persona.toUpperCase()}`,
    entityId: null, data: null,
    requiresConfirmation: false, error: null,
  };
}

async function executeSettingAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action !== 'setting.update') {
    return { action: action.action, success: false, message: 'Unknown setting action',
             entityId: null, data: null, requiresConfirmation: false, error: null };
  }
  await convex.mutation(api.users.updateSettings, {
    userId: convexUserId,
    settings: { [action.data.key]: action.data.value },
  });
  return {
    action: 'setting.update', success: true,
    message: `Setting "${action.data.key}" updated`,
    entityId: null, data: null,
    requiresConfirmation: false, error: null,
  };
}

async function executeSuggestAction(
  _userId: string, convexUserId: string, action: PartnerActionType
): Promise<ActionResult> {
  if (action.action !== 'suggest') {
    return { action: action.action, success: false, message: 'Unknown suggest action',
             entityId: null, data: null, requiresConfirmation: false, error: null };
  }
  await convex.mutation(api.suggestions.create, {
    userId: convexUserId as any,
    actionType: action.data.type,
    payload: JSON.stringify(action.data),
    status: 'pending',
  });
  return {
    action: 'suggest', success: true,
    message: `Suggestion: ${action.data.title}`,
    entityId: null,
    data: { type: action.data.type, reason: action.data.reason },
    requiresConfirmation: true,
    error: null,
  };
}
```

---

## PART 7: FILE MAP — WHERE EVERYTHING GOES

```
src/lib/ai/
├── provider-router.ts              ← Multi-provider AI router (Section 6)
├── types.ts                        ← UserContext shared type
├── coaching-system-prompt.ts       ← Base coaching personality
│
├── partner-engine/
│   ├── schemas.ts                  ← THIS FILE: ALL Zod schemas
│   ├── validator.ts                ← Universal validate + repair + retry
│   ├── index.ts                    ← Unified entry point (coach, braindump, etc.)
│   ├── executor.ts                 ← Master action router
│   └── moodboard-executor.ts       ← Moodboard-specific action handlers
│
├── brain-dump/
│   └── prompt.ts                   ← Brain dump system prompt
│
├── actions/
│   └── action-prompt.ts            ← Action capabilities system prompt extension
│
├── psychology/
│   ├── profile-schema.ts           ← PsychProfile Zod schema
│   ├── profile-builder.ts          ← Background profile updater
│   └── adaptive-prompt.ts          ← Psychology-adaptive coaching instructions
│
├── onboarding/
│   ├── archetypes.ts               ← Archetype configs
│   └── archetype-detector.ts       ← Detection prompt + runner
│
└── vision-board/
    ├── generator.ts                ← Board config generation
    └── image-service.ts            ← Cloudflare + Gemini image gen
```

---

**This is the complete canonical type system for RESURGO.life. Every schema, every action, every validation, every executor — all connected, all production-ready, all using the same `validatedAICall()` pattern. Send this to your coding AI as the definitive reference for implementation.**


I **can** scan your public site now, but I still **cannot “deep scan” the authenticated dashboard UI** because `/dashboard` correctly redirects to sign-in (I can’t log in as a crawler).   
What I *can* do (and did) is read your public product spec from the homepage and design an in-depth enhancement plan that **enriches existing modules** (AI goal breakdown, habit stacks, focus sessions, daily planning timeline, unified dashboard, wellness/sleep, XP/levels, weekly AI reviews, nutrition, Telegram, and the 6 AI coaches like Nova/Phoenix/Titan/Sage shown publicly). 

Below is the “make it feel like a professional assistant + non-generic AI + amazing calendar” plan, **without adding net-new product areas**—just making what you already have behave like one cohesive system.

---

## 1) First: define “professional assistant” behavior as product rules (not vibes)
Right now your homepage promises “AI breaks down goals,” “daily planning,” “wellness,” “weekly reviews,” and “AI coaching” all in one system.   
To make it feel like an *assistant*, the system must do three things consistently:

### A) It must **notice** (state awareness)
Use existing signals you already track (mood/energy/sleep, tasks/habits/focus) to maintain a lightweight `UserState`:
- **Capacity** (time available + schedule constraints)
- **Energy** (low/med/high)
- **Mood / stress** (simple tags, not clinical)
- **Momentum** (recent completions vs misses)

You already position wellness & sleep tracking as part of the system—this is where you stop treating it like a “separate page” and make it a **global input**. 

### B) It must **decide** (clear internal prioritization policy)
Create one canonical ranking policy for “what matters today”:
1) deadlines & consequences  
2) blockers/dependencies  
3) goal impact  
4) energy match  
5) “quick win” to reduce overwhelm

### C) It must **act** (live workspace updates)
This is the key difference between “AI chat” and “AI assistant”:

Every meaningful user message should produce:
- a human response, AND
- **validated actions** (create/update tasks, schedule focus blocks, adjust habit difficulty, propose calendar placement, etc.)

You already moved toward this with your Partner Engine + Zod approach—double down on it and make it the backbone of the whole dashboard.

---

## 2) Eliminate generic AI outputs with a 3-stage generation pipeline (no new features, just better output)
Generic tasks happen when the model is asked to do everything in one shot.

### Stage 1 — Extract (strict JSON)
- Parse the user’s brain dump / coach chat into structured items:
  - tasks + due hints + dependencies
  - emotion tags (overwhelmed/anxious/etc.)
  - energy needed (low/med/high)
- Validate with Zod; repair/retry if invalid (you already have this pattern).

### Stage 2 — Enrich (turn top tasks into “executive assistant” task cards)
For the **Top 3–5 tasks only** (important for cost/latency), generate:
- “first 2 minutes” starter step (kills procrastination)
- 3–7 subtasks (not 25)
- time estimate
- “definition of done”
- likely obstacle + mitigation (“If you feel stuck, do X”)

This is how you get “advanced detailed tasks” without making the UI noisy.

### Stage 3 — Schedule (calendar-aware placement)
- Convert “today plan” into time blocks *only if* user has indicated capacity.
- Place deep work when energy is high; admin when low.

This matches where modern calendars are heading: Google Calendar itself added a feature to block time for tasks (so tasks behave like real scheduled blocks). 

---

## 3) Make AI coaches emotionally intelligent (without turning into therapy)
Your marketing already sets expectations that the AI coach “checks in” and adapts.   
To make this real and consistent:

### A) Add a **global “Feeling → Plan” protocol** used by every coach
Every coach response should follow the same internal structure:

1) Reflect emotion briefly (1–2 sentences)  
2) Reduce cognitive load (Top 1–3 tasks when overwhelmed)  
3) Give one tiny next action (≤2 minutes)  
4) Ask one question only (“Want me to schedule this into your planner?”)

### B) Use behavior-change primitives that improve follow-through
The most useful low-controversy psychology tool you can bake in is **implementation intentions** (“If X happens, then I do Y”), which has strong meta-analytic support (Gollwitzer & Sheeran report ~d=0.65 across 94 studies).   
Apply this to habits and to recurring procrastination patterns.

### C) Coach-to-feature guidance (your explicit request)
Make the assistant recommend existing modules based on intent:
- user dumps messy list → route into Brain Dump / inbox parsing
- user mentions times/dates → route into calendar scheduling
- user says “I’m overwhelmed” → route into “Today Top 3” + quick win + short focus session
- user says “I keep failing habit” → route into habit redesign + smaller steps + if-then plan

No new features—just better orchestration and UI prompts.

---

## 4) Calendar enhancement plan (make it “amazing” with what you already have)
You want: tasks on that day, feelings-aware scheduling, non-generic.

### Calendar should show 4 existing object types together
1) scheduled tasks (time blocks)  
2) due-date tasks (all-day chips)  
3) habits (recurring markers)  
4) focus sessions (planned or completed blocks)

Your homepage already claims daily planning + focus sessions + habits exist; the calendar is where they must unify. 

### Drag & drop: task list → calendar (high ROI)
This is the single most “wow, it’s a real productivity system” interaction:
- tasks live in Today/Inbox
- drag onto a time slot creates a scheduled block

FullCalendar explicitly supports “external dragging” to create events when you drop an element on the calendar.   
(If you’re already using another calendar library, replicate the interaction; the UX principle is what matters.)

### Feelings-aware scheduling overlays (no new module, just richer view)
Add an overlay in Day/Week view:
- an “energy bar” (low/med/high blocks)
- capacity meter (available hours vs scheduled)
- auto-warning when day is overloaded

This makes the AI schedule feel grounded, not random.

### “Auto-schedule” button (still the same calendar feature)
One button: “Plan my day”
- uses the Top 3–5 enriched tasks
- respects user capacity + energy
- schedules focus blocks appropriately

Again: Google Calendar’s task time-blocking update is a proof that “tasks as calendar blocks” is a mainstream, expected direction. 

---

## 5) “Use all models available” — do it safely (router-by-job, not chaos)
Using every model on every request makes systems slow, flaky, and expensive.

Instead, implement a **model router**:
- Extractor model (cheap/fast) → strict JSON
- Planner model (best reasoning) → prioritization + decomposition
- Coach model (best tone/empathy) → user-facing message
- Scheduler model → calendar placement

Only run the expensive steps for Top 3–5 items. Everything else stays lightweight.

Also: “free tiers” change. Build graceful degradation:
- offline/local model first (if you have it)
- then free-tier cloud
- then fallback to rules-based plan if quota hit

---

## 6) A concrete “enhance current features” backlog (2-week sprint)
### Week 1 — Make outputs non-generic + assistant-like
- Implement “3-stage pipeline”: Extract → Enrich → Schedule
- Add “Quality Gate” (reject vague tasks like “work on X”; enforce starter step + estimate + done definition)
- Add “UI Copilot prompts”: the assistant suggests which existing feature to use next
- Ensure no infinite loaders; add watchdog + error UI everywhere

### Week 2 — Calendar becomes the execution hub
- Unified calendar objects (tasks/habits/focus/due chips)
- Drag/drop scheduling
- Capacity + energy overlay
- Auto-schedule button
- Coach can propose calendar changes as validated actions (user confirms)

---

## 7) What I need to truly “deep scan” your dashboard UI (so feedback becomes pixel-perfect)
Because `/dashboard` is protected, I can’t evaluate:
- your nav clarity
- onboarding screens
- calendar UI
- task cards
- coach interactions

The fastest way to unlock a real teardown (and also improve conversions) is:
- add `/demo` (public, seeded data, no real AI calls), or
- share 10–15 screenshots / a 2-minute screen recording

No explanation needed—just visuals.

---

If you want, I’ll turn the above into a single coder-facing sprint document with:
- exact acceptance criteria per ticket,
- the action schema changes needed for calendar scheduling,
- and the “AI quality gate” rubric (so the system can automatically refuse generic outputs and regenerate).



I've done extensive research across emotion-aware AI, advanced calendar systems, and multi-model orchestration. Here is the complete enhancement prompt for your coding AI. **This is not about adding features — it's about making every existing feature feel alive, emotionally intelligent, and deeply personalized.**

---

# 📎 MASTER DOCUMENT — ADDENDUM: SECTION 28
# RESURGO.LIFE — DEEP FEATURE ENHANCEMENT: FROM TOOL TO LIVING PARTNER

> **INSTRUCTION TO CODING AI:** This document contains NO new features. It enhances every existing feature in the Resurgo dashboard to be non-generic, emotionally intelligent, proactively guiding, and deeply contextual. Every existing screen, every existing module, every existing AI response must be upgraded according to the specifications below. The goal: when a user opens Resurgo, it should feel like opening a conversation with the smartest, most empathetic executive assistant who has been watching over their entire life.

---

## CRITICAL PREREQUISITE: FIX THE AUTH GATE

Your production site at `resurgo.life` is redirecting unauthenticated visitors (including search engine crawlers) into a Clerk development handshake URL (`*.clerk.accounts.dev`). This means Google cannot index your marketing pages, no one can see your landing page without auth, and I cannot scan your dashboard.

As described in "Start with the right level of complexity," you can address some problems with a single agent if you give it sufficient access to tools and knowledge sources. But the first "tool" your app needs access to is **visibility** — people need to be able to SEE it.

**Fix in middleware.ts:**
```typescript
// File: middleware.ts — Ensure public routes are truly public

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/blog(.*)',
  '/templates(.*)',
  '/compare(.*)',
  '/use-cases(.*)',
  '/tools(.*)',
  '/learn(.*)',
  '/demo',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/leads(.*)',
  '/api/og(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
```

Also verify in Clerk Dashboard that your **production** instance (not development) is connected to your custom domain. Development instances use `*.accounts.dev` which blocks crawlers and external access.

---

## PART 1: THE EMOTIONAL CONTEXT LAYER (Upgrades Everything)

Multimodal AI, emotion detection, and automation will make AI assistants more human-like, efficient, and responsive to user needs. They will be more conversational, proactive, and emotionally intelligent.

The single most impactful enhancement is a **daily state signal** that feeds into every AI decision. You already have wellness/mood tracking — the upgrade is making it the INPUT to everything else, not just a standalone tracker.

### 1A: Enhanced Daily State Check-In (Enriches existing wellness module)

```typescript
// File: src/lib/ai/context/daily-state.ts

export interface DailyState {
  // Core signals (quick to capture — under 10 seconds)
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 'depleted' | 'low' | 'moderate' | 'charged' | 'peak';
  mentalClarity: 'foggy' | 'scattered' | 'normal' | 'focused' | 'razor_sharp';
  
  // Time context
  availableHoursToday: number;     // 0-16
  hasImmovableDeadlines: boolean;
  biggestStressorToday: string | null;
  
  // Derived from recent patterns (auto-calculated, not user-entered)
  sleepQuality: 'poor' | 'fair' | 'good' | 'great' | null;  // from sleep tracking
  streakMomentum: 'declining' | 'flat' | 'building' | 'strong';  // from habit data
  taskCompletionTrend: 'falling' | 'stable' | 'rising';  // from last 7 days
  overcommitmentRisk: 'low' | 'moderate' | 'high' | 'critical';  // from task load vs capacity
  
  // Inferred by AI from all signals combined
  operatingMode: 'survival' | 'maintenance' | 'building' | 'thriving';
  recommendedCapacity: number;  // How many "task units" this person should attempt today
  
  capturedAt: string;
}

// Determine operating mode from combined signals
export function calculateOperatingMode(state: Partial<DailyState>): DailyState['operatingMode'] {
  const moodScore = state.mood || 3;
  const energyMap = { depleted: 1, low: 2, moderate: 3, charged: 4, peak: 5 };
  const energyScore = energyMap[state.energy || 'moderate'];
  const clarityMap = { foggy: 1, scattered: 2, normal: 3, focused: 4, razor_sharp: 5 };
  const clarityScore = clarityMap[state.mentalClarity || 'normal'];
  
  const composite = (moodScore + energyScore + clarityScore) / 3;
  
  if (composite <= 1.5) return 'survival';      // Protect the user, minimal load
  if (composite <= 2.5) return 'maintenance';    // Keep existing commitments, no new ones
  if (composite <= 3.8) return 'building';       // Normal productive capacity
  return 'thriving';                              // Push harder, challenge the user
}

// Calculate recommended task capacity
export function calculateRecommendedCapacity(state: DailyState): number {
  const baseCapacity = {
    survival: 2,       // Only 2 essential tasks
    maintenance: 4,    // Keep the lights on
    building: 7,       // Normal productive day
    thriving: 10,      // Push capacity
  }[state.operatingMode];
  
  // Adjust for available time
  const timeMultiplier = Math.min(1, state.availableHoursToday / 8);
  
  // Adjust for overcommitment risk
  const overcommitPenalty = {
    low: 1, moderate: 0.85, high: 0.7, critical: 0.5,
  }[state.overcommitmentRisk];
  
  return Math.round(baseCapacity * timeMultiplier * overcommitPenalty);
}
```

### 1B: Inject Daily State Into EVERY AI Interaction

This is the critical wiring. Every system prompt across the app now includes the daily state:

```typescript
// File: src/lib/ai/context/state-injection.ts

import type { DailyState } from './daily-state';

export function injectDailyStateIntoPrompt(state: DailyState | null): string {
  if (!state) {
    return `
# USER'S CURRENT STATE
Not captured today. Ask how they're feeling before making any plans.
Default to conservative capacity (4 tasks max).
    `;
  }

  return `
# USER'S CURRENT STATE (captured ${state.capturedAt})
Operating Mode: ${state.operatingMode.toUpperCase()}
Mood: ${state.mood}/5 | Energy: ${state.energy} | Clarity: ${state.mentalClarity}
Available hours today: ${state.availableHoursToday}
Sleep: ${state.sleepQuality || 'unknown'} | Streaks: ${state.streakMomentum}
Task trend (7d): ${state.taskCompletionTrend}
Overcommitment risk: ${state.overcommitmentRisk}
Recommended capacity: ${state.recommendedCapacity} tasks today
${state.biggestStressorToday ? `Primary stressor: "${state.biggestStressorToday}"` : ''}
${state.hasImmovableDeadlines ? '⚠️ HAS HARD DEADLINES TODAY' : ''}

# BEHAVIOR RULES BASED ON STATE:
${getStateRules(state)}
  `.trim();
}

function getStateRules(state: DailyState): string {
  switch (state.operatingMode) {
    case 'survival':
      return `
- MAXIMUM 2 tasks. No exceptions. User is in survival mode.
- Lead every response with emotional acknowledgment.
- Suggest ONLY the absolute minimum required actions.
- Proactively offer to postpone, cancel, or delegate.
- Never say "you should also..." — reduce scope, don't add.
- If they try to add more tasks, gently redirect: "Let's focus on just these for now."
- Tone: Extremely gentle, protective, warm.
      `;
    case 'maintenance':
      return `
- Maximum ${state.recommendedCapacity} tasks. Keep to essentials.
- Acknowledge low energy but maintain gentle accountability.
- Prioritize habit maintenance over new initiatives.
- Suggest shorter versions of tasks where possible.
- Tone: Supportive, pragmatic, brief.
      `;
    case 'building':
      return `
- Normal capacity: ${state.recommendedCapacity} tasks.
- Balance between challenge and sustainability.
- Can introduce new habits or stretch goals.
- Provide detailed breakdowns with time estimates.
- Tone: Confident, structured, encouraging.
      `;
    case 'thriving':
      return `
- High capacity: ${state.recommendedCapacity} tasks.
- Challenge the user — push harder than usual.
- Suggest ambitious actions they've been putting off.
- This is the day for the hard conversation, the scary email, the big task.
- Tone: Direct, high-energy, challenging.
      `;
  }
}
```

### 1C: Daily Check-In UI (Enhances existing wellness module, not a new feature)

```tsx
// File: src/components/dashboard/DailyCheckIn.tsx
// This replaces/enhances the existing mood check-in widget

'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const ENERGY_OPTIONS = [
  { value: 'depleted', emoji: '🪫', label: 'Empty' },
  { value: 'low', emoji: '🔋', label: 'Low' },
  { value: 'moderate', emoji: '⚡', label: 'Okay' },
  { value: 'charged', emoji: '🔥', label: 'Good' },
  { value: 'peak', emoji: '⚡⚡', label: 'Peak' },
] as const;

const CLARITY_OPTIONS = [
  { value: 'foggy', emoji: '🌫️', label: 'Foggy' },
  { value: 'scattered', emoji: '🎯', label: 'Scattered' },
  { value: 'normal', emoji: '👁️', label: 'Clear' },
  { value: 'focused', emoji: '🔬', label: 'Focused' },
  { value: 'razor_sharp', emoji: '⚔️', label: 'Locked In' },
] as const;

export function DailyCheckIn() {
  const todaysState = useQuery(api.wellness.getTodayState);
  const saveState = useMutation(api.wellness.saveDailyState);
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<string>('moderate');
  const [clarity, setClarity] = useState<string>('normal');
  const [hours, setHours] = useState<number>(8);

  // If already checked in today, show summary instead
  if (todaysState) {
    return (
      <div className="border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-xs font-mono">TODAY'S STATE</span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            {todaysState.operatingMode.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <span>Mood: {'⭐'.repeat(todaysState.mood)}</span>
          <span>Energy: {todaysState.energy}</span>
          <span>Capacity: {todaysState.recommendedCapacity} tasks</span>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    await saveState({
      mood, energy, mentalClarity: clarity,
      availableHoursToday: hours,
      hasImmovableDeadlines: false, // TODO: auto-detect from calendar
      biggestStressorToday: null,   // Optional text input
    });
  }

  return (
    <div className="border border-green-500/20 rounded-lg p-6 bg-green-500/5">
      <h3 className="text-green-400 font-mono text-sm mb-4">
        {'>'} MORNING_CHECK_IN_
      </h3>
      <p className="text-zinc-400 text-sm mb-4">
        Quick check — helps me calibrate your day.
      </p>

      {/* Mood (1-5 stars) */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500">How are you feeling?</label>
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setMood(n)}
              className={`w-10 h-10 rounded ${
                mood >= n ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-600'
              }`}
            >
              {n <= mood ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500">Energy level?</label>
        <div className="flex gap-2 mt-1">
          {ENERGY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setEnergy(opt.value)}
              className={`px-3 py-1.5 rounded text-xs ${
                energy === opt.value
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clarity */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500">Mental clarity?</label>
        <div className="flex gap-2 mt-1">
          {CLARITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setClarity(opt.value)}
              className={`px-3 py-1.5 rounded text-xs ${
                clarity === opt.value
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available hours */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500">Hours available today?</label>
        <input
          type="range" min={1} max={14} value={hours}
          onChange={e => setHours(Number(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-xs text-zinc-400">{hours} hours</span>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-black py-2 rounded font-bold text-sm
                   hover:bg-green-400 transition"
      >
        Start My Day →
      </button>
    </div>
  );
}
```

---

## PART 2: ELIMINATE GENERIC AI OUTPUTS

What separates a true AI assistant for productivity from a basic chatbot is execution. A chatbot talks. A real assistant gets work done.

Pi remembers past conversations, uses language from cognitive behavioral therapy, and breaks down to-do lists into realistic plans.

### 2A: The "No Generic" Quality Gate

Add this to EVERY AI system prompt across the entire app — coaching, brain dump, calendar planning, weekly review, goal decomposition:

```typescript
// File: src/lib/ai/quality/no-generic-rules.ts

export const NO_GENERIC_RULES = `
# ABSOLUTE OUTPUT QUALITY RULES — ENFORCED ON EVERY RESPONSE

## TASK QUALITY (applies to every task the AI creates or suggests)
Every task MUST include ALL of these elements:
1. SPECIFIC FIRST STEP: Not "Start working on X" but "Open [specific document/app/site], navigate to [specific section], and [specific action]"
2. TIME ESTIMATE: In minutes (not "a while" or "some time")
3. ENERGY REQUIREMENT: high/medium/low — mapped to user's current state
4. DEFINITION OF DONE: Exactly what "complete" looks like
5. WHY NOW: Reason this task is scheduled at this time/day, tied to user's goals or energy
6. OBSTACLES PREDICTED: One likely blocker and how to handle it

Example of REJECTED output (generic):
  "Work on presentation"

Example of ACCEPTED output (specific):
  "Open Google Slides → presentation deck shared by Sarah on Monday → 
   Complete slides 4-7 (competitor analysis section) → Add the 3 data 
   points from the Q1 report. ~45 min, high energy. 
   Done when: All 4 slides have data, charts, and speaker notes.
   Why now: Your energy peaks at 10 AM and this needs focused thinking.
   Blocker: You might not have the Q1 data — check email from Ahmed first (2 min)."

## RESPONSE QUALITY (applies to every coach message)
- NEVER use these phrases: "Great question!", "I understand", "That's a good start", 
  "You've got this!", "Keep going!", "Stay positive!"
- ALWAYS reference specific user data (their actual tasks, actual streaks, actual goals)
- ALWAYS tie advice to their operating mode and emotional state
- ALWAYS end with exactly ONE concrete next action (not a pep talk)
- If you don't have enough context to be specific, ASK — don't fill with generics

## CALENDAR QUALITY (applies to every schedule suggestion)
- Every time block MUST have a specific activity (not just a category)
- Must account for transition time between blocks (5-10 min buffers)
- Must match energy requirements to the user's energy curve
- Must explicitly note dependencies ("Do X before Y because...")
- Must include at least one recovery block per 3 hours of deep work
`;
```

### 2B: The Quality Validator (Rejects Generic Outputs)

```typescript
// File: src/lib/ai/quality/output-grader.ts

export interface QualityGrade {
  passes: boolean;
  score: number;          // 0-100
  failures: string[];     // What's wrong
  suggestions: string[];  // How to fix
}

export function gradeTaskQuality(task: {
  title: string;
  description?: string;
  estimatedMinutes?: number | null;
  energyLevel?: string;
}): QualityGrade {
  const failures: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check for vague verbs
  const vagueVerbs = ['work on', 'try to', 'start', 'look into', 'think about', 'deal with'];
  const titleLower = task.title.toLowerCase();
  for (const verb of vagueVerbs) {
    if (titleLower.startsWith(verb)) {
      failures.push(`Title starts with vague verb: "${verb}"`);
      suggestions.push(`Replace "${verb}" with a specific action verb (e.g., "Write", "Call", "Send", "Build", "Review")`);
      score -= 20;
    }
  }

  // Check for time estimate
  if (!task.estimatedMinutes) {
    failures.push('Missing time estimate');
    suggestions.push('Add estimatedMinutes (5-480)');
    score -= 15;
  }

  // Check for energy level
  if (!task.energyLevel) {
    failures.push('Missing energy level');
    suggestions.push('Add energyLevel: high|medium|low');
    score -= 10;
  }

  // Check title length (too short = too vague)
  if (task.title.length < 10) {
    failures.push('Title too short (likely generic)');
    suggestions.push('Expand title to include specific action + target');
    score -= 15;
  }

  // Check title length (too long = unreadable)
  if (task.title.length > 120) {
    failures.push('Title too long');
    suggestions.push('Shorten title, move details to description');
    score -= 5;
  }

  return {
    passes: score >= 60,
    score: Math.max(0, score),
    failures,
    suggestions,
  };
}

export function gradeCoachResponse(message: string, userContext: {
  hasGoals: boolean;
  hasTasks: boolean;
  hasHabits: boolean;
  userName?: string;
}): QualityGrade {
  const failures: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check for banned phrases
  const bannedPhrases = [
    'great question', 'i understand', "that's a good start",
    "you've got this", 'keep going', 'stay positive',
    'remember to breathe', 'one day at a time', 'believe in yourself',
    'you can do anything', 'just do your best',
  ];
  const lower = message.toLowerCase();
  for (const phrase of bannedPhrases) {
    if (lower.includes(phrase)) {
      failures.push(`Contains banned generic phrase: "${phrase}"`);
      score -= 15;
    }
  }

  // Check for specificity — does it reference user data?
  const referencesUserData = 
    message.includes('your') || 
    message.includes('you mentioned') ||
    message.includes('yesterday') ||
    message.includes('streak') ||
    (userContext.userName && message.includes(userContext.userName));
  
  if (!referencesUserData && userContext.hasGoals) {
    failures.push('Response doesn\'t reference any specific user data');
    suggestions.push('Include references to user\'s actual goals, tasks, or habits');
    score -= 20;
  }

  // Check for actionable ending
  const lastSentence = message.split(/[.!?]/).filter(s => s.trim()).pop() || '';
  const hasAction = /\?|shall|want me|try|start|open|click|send|call|write/i.test(lastSentence);
  if (!hasAction) {
    failures.push('Response doesn\'t end with a concrete action or question');
    suggestions.push('End with ONE specific next step or a clarifying question');
    score -= 15;
  }

  return {
    passes: score >= 50,
    score: Math.max(0, score),
    failures,
    suggestions,
  };
}
```

### 2C: Auto-Refinement Loop

When AI output fails the quality gate, automatically run a refinement pass:

```typescript
// File: src/lib/ai/quality/refiner.ts

import { callAI } from '../provider-router';
import { gradeTaskQuality, gradeCoachResponse, type QualityGrade } from './output-grader';

const REFINEMENT_PROMPT = `
The following AI output was graded as too generic. Improve it.

QUALITY FAILURES:
{FAILURES}

SUGGESTIONS:
{SUGGESTIONS}

ORIGINAL OUTPUT:
{ORIGINAL}

USER CONTEXT:
{CONTEXT}

Rewrite the output to be specific, actionable, and tied to the user's actual data.
Return ONLY the improved version in the same format as the original.
`;

export async function refineIfNeeded(
  content: string,
  grade: QualityGrade,
  userContext: string,
  contentType: 'task' | 'coach_message'
): Promise<string> {
  if (grade.passes) return content; // Already good enough

  try {
    const response = await callAI({
      systemPrompt: REFINEMENT_PROMPT
        .replace('{FAILURES}', grade.failures.join('\n'))
        .replace('{SUGGESTIONS}', grade.suggestions.join('\n'))
        .replace('{ORIGINAL}', content)
        .replace('{CONTEXT}', userContext),
      userMessage: `Refine this ${contentType} to be more specific and actionable.`,
      taskType: 'analysis',
      temperature: 0.3,
      maxTokens: 1000,
    });

    return response.content;
  } catch {
    return content; // Return original if refinement fails
  }
}
```

---

## PART 3: ENHANCED CALENDAR — THE EXECUTION HUB

Advanced AI assistants don't just store appointments—they actively generate optimized schedules based on task priorities, deadlines, energy levels, and historical patterns. They should be able to automatically reschedule lower-priority items when urgent tasks arise, maintaining overall productivity without manual intervention.

The best assistants factor in capacity, deadlines, effort, and even energy patterns to propose a day you can realistically execute.

Frames let you template your time, and assign different types of tasks throughout your week. Perhaps you want deep work in the morning, quick wins in the afternoon, and your creative time on Tuesday nights. Morgen's system uses Frames to recommend the right tasks at your optimal times. As you give the AI Planner more direction on which types of tasks should be scheduled when using Frames. You can batch tasks, theme days, or work around your natural energy highs and lows.

### 3A: Calendar Data Schema (Enhance existing calendar events)

```typescript
// File: src/lib/calendar/enhanced-schema.ts

export interface CalendarBlock {
  id: string;
  date: string;                    // YYYY-MM-DD
  startTime: string;               // HH:MM (24h)
  endTime: string;                 // HH:MM (24h)
  durationMinutes: number;
  
  // What this block contains
  type: 'deep_work' | 'quick_wins' | 'admin' | 'meeting' | 'habit' |
        'break' | 'recovery' | 'exercise' | 'creative' | 'learning' | 'buffer';
  
  // The specific task(s) assigned to this block
  taskIds: string[];
  taskTitles: string[];            // For display without fetching full tasks
  
  // Energy context
  requiredEnergy: 'high' | 'medium' | 'low';
  userEnergyAtThisTime: 'high' | 'medium' | 'low';  // Based on historical data
  energyMatch: boolean;            // True if required <= available
  
  // Emotional context
  emotionalRationale: string;      // Why this is scheduled here
  // e.g., "Scheduled during your typical morning peak because this 
  //         requires creative thinking. You completed similar tasks 
  //         successfully at this time last Tuesday."
  
  // Dependencies
  prerequisites: string[];         // Task IDs or descriptions that must be done first
  blockedBy: string[];             // What's preventing this from starting
  
  // Flexibility
  isMovable: boolean;              // Can AI reschedule this?
  moveableRange: {                 // If movable, when can it move to?
    earliestDate: string;
    latestDate: string;
    preferredTimeOfDay: string;    // 'morning' | 'afternoon' | 'evening'
  } | null;
  
  // Status
  status: 'planned' | 'in_progress' | 'completed' | 'skipped' | 'postponed';
  completedAt: string | null;
  
  // Visual
  color: string;                   // Hex color based on type/energy
  icon: string;                    // Emoji
}

// Energy curve: learned from user's historical task completion patterns
export interface UserEnergyCurve {
  // For each hour of the day, the typical energy level
  // Based on: when they complete tasks, mood logs, focus session durations
  hourlyEnergy: Record<number, 'high' | 'medium' | 'low'>;
  
  // Best times for different work types
  bestDeepWorkWindow: { start: string; end: string };
  bestCreativeWindow: { start: string; end: string };
  bestAdminWindow: { start: string; end: string };
  
  // Danger zones (when they typically crash or procrastinate)
  lowEnergyHours: number[];        // e.g., [14, 15] = 2-3 PM slump
  
  // Confidence (how many data points this is based on)
  dataPoints: number;
  confidence: number;              // 0-100
}
```

### 3B: AI Schedule Generator (Enhances existing planner)

```typescript
// File: src/lib/ai/calendar/schedule-generator-prompt.ts

import type { DailyState } from '../context/daily-state';
import type { UserEnergyCurve } from '../../calendar/enhanced-schema';

export function buildSchedulePrompt(
  dailyState: DailyState,
  energyCurve: UserEnergyCurve,
  pendingTasks: Array<{
    id: string;
    title: string;
    priority: string;
    estimatedMinutes: number | null;
    energyLevel: string;
    dueDate: string | null;
    category: string;
    dependsOn: string | null;
  }>,
  existingCommitments: Array<{
    title: string;
    startTime: string;
    endTime: string;
    isMovable: boolean;
  }>,
  habits: Array<{
    name: string;
    preferredTime: string;
    durationMinutes: number;
  }>,
  todayDate: string
): string {
  return `
# ROLE
You are RESURGO's Schedule Architect. Generate a detailed, emotionally-informed 
daily schedule that maximizes the user's productivity within their actual capacity.

# TODAY'S DATE
${todayDate}

# USER'S CURRENT STATE
${JSON.stringify(dailyState, null, 2)}

# USER'S ENERGY CURVE (learned from historical patterns)
Best deep work: ${energyCurve.bestDeepWorkWindow.start}-${energyCurve.bestDeepWorkWindow.end}
Best creative: ${energyCurve.bestCreativeWindow.start}-${energyCurve.bestCreativeWindow.end}
Best admin: ${energyCurve.bestAdminWindow.start}-${energyCurve.bestAdminWindow.end}
Low energy danger zones: ${energyCurve.lowEnergyHours.map(h => `${h}:00`).join(', ')}
Confidence in this curve: ${energyCurve.confidence}%

# EXISTING COMMITMENTS (immovable)
${existingCommitments.map(c => `- ${c.startTime}-${c.endTime}: ${c.title} ${c.isMovable ? '(can move)' : '(FIXED)'}`).join('\n')}

# PENDING TASKS (${pendingTasks.length} total, capacity: ${dailyState.recommendedCapacity})
${pendingTasks.slice(0, 20).map(t => 
  `- [${t.priority}] ${t.title} (~${t.estimatedMinutes || '?'}min, energy: ${t.energyLevel})${t.dueDate ? ` DUE: ${t.dueDate}` : ''}${t.dependsOn ? ` DEPENDS ON: ${t.dependsOn}` : ''}`
).join('\n')}

# DAILY HABITS TO SCHEDULE
${habits.map(h => `- ${h.name} (${h.durationMinutes}min, preferred: ${h.preferredTime})`).join('\n')}

# SCHEDULING RULES
1. NEVER schedule more than ${dailyState.recommendedCapacity} tasks
2. HIGH energy tasks go in ${energyCurve.bestDeepWorkWindow.start}-${energyCurve.bestDeepWorkWindow.end}
3. LOW energy tasks go in ${energyCurve.lowEnergyHours.map(h => `${h}:00`).join(', ')} danger zones
4. Include 10-min buffer between every major block
5. Include at least one 15-min recovery break per 3 hours
6. If user is in survival mode: ONLY schedule critical/deadline tasks
7. If user is in thriving mode: include one stretch task they've been avoiding
8. EVERY block must have an emotional rationale explaining WHY it's placed here
9. Respect task dependencies — don't schedule X before its prerequisite Y
10. Place habits in their preferred time slots, adjusting only if conflicts arise
11. Leave at least 1 hour of unscheduled buffer for unexpected items

# OUTPUT FORMAT (JSON only)
{
  "dailySummary": "Brief, personalized morning message about today's plan",
  "operatingMode": "${dailyState.operatingMode}",
  "totalScheduledMinutes": number,
  "totalBufferMinutes": number,
  "schedule": [
    {
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "type": "deep_work|quick_wins|admin|meeting|habit|break|recovery|exercise|creative|learning|buffer",
      "taskTitles": ["Specific task name"],
      "taskIds": ["id or null"],
      "requiredEnergy": "high|medium|low",
      "emotionalRationale": "Why this is here, referencing user's state and energy curve",
      "prerequisites": ["what must be done first"],
      "isMovable": boolean,
      "icon": "emoji"
    }
  ],
  "postponedTasks": [
    {
      "taskTitle": "string",
      "reason": "Why this was postponed",
      "suggestedRescheduleDate": "YYYY-MM-DD"
    }
  ],
  "coachNote": "End-of-day reflection prompt personalized to today's plan"
}
  `.trim();
}
```

### 3C: Calendar Day View Enhancement (UI)

```tsx
// File: src/components/calendar/EnhancedDayView.tsx

'use client';

import type { CalendarBlock } from '@/lib/calendar/enhanced-schema';

interface EnhancedDayViewProps {
  date: string;
  blocks: CalendarBlock[];
  operatingMode: string;
  dailySummary: string;
}

const TYPE_COLORS: Record<string, string> = {
  deep_work: 'border-l-red-500 bg-red-500/5',
  quick_wins: 'border-l-yellow-500 bg-yellow-500/5',
  admin: 'border-l-blue-500 bg-blue-500/5',
  meeting: 'border-l-purple-500 bg-purple-500/5',
  habit: 'border-l-green-500 bg-green-500/5',
  break: 'border-l-zinc-500 bg-zinc-500/5',
  recovery: 'border-l-teal-500 bg-teal-500/5',
  exercise: 'border-l-orange-500 bg-orange-500/5',
  creative: 'border-l-pink-500 bg-pink-500/5',
  learning: 'border-l-indigo-500 bg-indigo-500/5',
  buffer: 'border-l-zinc-700 bg-zinc-800/50',
};

const ENERGY_INDICATORS: Record<string, string> = {
  high: '🔴 High Focus',
  medium: '🟡 Medium',
  low: '🟢 Easy',
};

export function EnhancedDayView({ date, blocks, operatingMode, dailySummary }: EnhancedDayViewProps) {
  return (
    <div className="space-y-2">
      {/* Morning Briefing */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-400 font-mono text-xs">
            {'>'} TODAY'S PLAN — {operatingMode.toUpperCase()} MODE
          </span>
          <span className="text-xs text-zinc-500">{date}</span>
        </div>
        <p className="text-zinc-300 text-sm">{dailySummary}</p>
      </div>

      {/* Energy curve overlay */}
      <div className="h-8 flex gap-px rounded overflow-hidden mb-4">
        {Array.from({ length: 16 }, (_, i) => i + 6).map(hour => (
          <div
            key={hour}
            className="flex-1 relative group"
            title={`${hour}:00`}
          >
            <div className={`h-full ${
              hour >= 9 && hour <= 11 ? 'bg-red-500/30' :
              hour >= 14 && hour <= 15 ? 'bg-zinc-700/30' :
              'bg-green-500/20'
            }`} />
            <span className="absolute -bottom-4 left-0 text-[9px] text-zinc-600">
              {hour % 3 === 0 ? `${hour}:00` : ''}
            </span>
          </div>
        ))}
      </div>

      {/* Schedule blocks */}
      <div className="space-y-1 mt-6">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`border-l-4 rounded-r-lg p-3 group cursor-pointer
                        hover:bg-zinc-800/50 transition
                        ${TYPE_COLORS[block.type] || 'border-l-zinc-600'}`}
          >
            {/* Time + Energy indicator */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">
                  {block.startTime}–{block.endTime}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                  {block.type.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">
                {ENERGY_INDICATORS[block.requiredEnergy]}
              </span>
            </div>

            {/* Task titles */}
            <div className="space-y-0.5">
              {block.taskTitles.map((title, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm text-zinc-200">{block.icon} {title}</span>
                  <span className="text-[10px] text-zinc-600">
                    {block.durationMinutes}min
                  </span>
                </div>
              ))}
            </div>

            {/* Emotional rationale (shown on hover/expand) */}
            <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all
                            duration-300 ease-in-out">
              <p className="text-xs text-zinc-500 mt-2 italic border-t border-zinc-800 pt-2">
                💡 {block.emotionalRationale}
              </p>
              {block.prerequisites.length > 0 && (
                <p className="text-xs text-yellow-500/70 mt-1">
                  ⚠️ First: {block.prerequisites.join(', ')}
                </p>
              )}
            </div>

            {/* Energy match warning */}
            {!block.energyMatch && (
              <div className="text-[10px] text-yellow-500 mt-1">
                ⚡ Energy mismatch — consider moving this to a better slot
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## PART 4: PROACTIVE FEATURE GUIDANCE (AI as Professional Assistant)

AI productivity now depends on execution: Tools like ChatGPT and Claude boost writing and analysis, but real gains come when AI moves from generating content to owning workflows.

Instead of the user figuring out which feature to use, the AI proactively suggests features based on context:

```typescript
// File: src/lib/ai/proactive/feature-guide.ts

import type { DailyState } from '../context/daily-state';

export interface FeatureSuggestion {
  feature: string;          // Route or component name
  label: string;            // Human-readable
  reason: string;           // Why now
  priority: number;         // 1 = most urgent
  icon: string;
}

export function generateFeatureSuggestions(
  dailyState: DailyState | null,
  context: {
    hasCheckedInToday: boolean;
    uncheckedHabitsToday: number;
    overdueTaskCount: number;
    daysWithoutCoachChat: number;
    lastBrainDumpDaysAgo: number;
    currentHour: number;
    goalsWithoutProgress: number;
    weeklyReviewDue: boolean;
    visionBoardExists: boolean;
  }
): FeatureSuggestion[] {
  const suggestions: FeatureSuggestion[] = [];

  // Morning: Check-in first
  if (!context.hasCheckedInToday && context.currentHour < 12) {
    suggestions.push({
      feature: 'daily-check-in',
      label: 'Morning Check-In',
      reason: "Let's calibrate your day first — takes 10 seconds.",
      priority: 1,
      icon: '☀️',
    });
  }

  // Overwhelm detection
  if (dailyState?.operatingMode === 'survival') {
    suggestions.push({
      feature: 'emergency-mode',
      label: 'Emergency Mode',
      reason: "You're running low. Let me simplify to just your top 3 essentials.",
      priority: 1,
      icon: '🆘',
    });
  }

  // Overdue tasks piling up
  if (context.overdueTaskCount > 5) {
    suggestions.push({
      feature: 'brain-dump',
      label: 'Brain Dump & Reset',
      reason: `You have ${context.overdueTaskCount} overdue tasks. Let's dump and re-prioritize.`,
      priority: 2,
      icon: '🧠',
    });
  }

  // Habits unchecked
  if (context.uncheckedHabitsToday > 0 && context.currentHour > 17) {
    suggestions.push({
      feature: 'habits',
      label: 'Habit Check-In',
      reason: `${context.uncheckedHabitsToday} habits unchecked today. Quick check before day ends?`,
      priority: 3,
      icon: '✅',
    });
  }

  // Coach conversation overdue
  if (context.daysWithoutCoachChat > 3) {
    suggestions.push({
      feature: 'coach',
      label: 'Talk to Your Coach',
      reason: `It's been ${context.daysWithoutCoachChat} days since our last chat. How are things going?`,
      priority: 4,
      icon: '💬',
    });
  }

  // Weekly review
  if (context.weeklyReviewDue) {
    suggestions.push({
      feature: 'weekly-review',
      label: 'Weekly Review',
      reason: "Your weekly review is ready — see patterns, wins, and adjustments.",
      priority: 2,
      icon: '📊',
    });
  }

  // Goals stagnating
  if (context.goalsWithoutProgress > 0) {
    suggestions.push({
      feature: 'goals',
      label: 'Goal Check',
      reason: `${context.goalsWithoutProgress} goals haven't had updates recently. Quick pulse check?`,
      priority: 5,
      icon: '🎯',
    });
  }

  // Vision board not created
  if (!context.visionBoardExists) {
    suggestions.push({
      feature: 'vision-board',
      label: 'Create Vision Board',
      reason: "You haven't created your vision board yet — it's AI-generated from your goals.",
      priority: 6,
      icon: '🎨',
    });
  }

  return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
}
```

```tsx
// File: src/components/dashboard/ProactiveSuggestions.tsx

'use client';

import { useRouter } from 'next/navigation';
import type { FeatureSuggestion } from '@/lib/ai/proactive/feature-guide';

export function ProactiveSuggestions({ suggestions }: { suggestions: FeatureSuggestion[] }) {
  const router = useRouter();

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      <span className="text-xs text-zinc-500 font-mono">{'>'} SUGGESTED_ACTIONS_</span>
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => router.push(`/dashboard/${s.feature}`)}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-800
                     hover:border-green-500/30 hover:bg-green-500/5 transition text-left group"
        >
          <span className="text-lg">{s.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-zinc-200 group-hover:text-green-400 transition">
              {s.label}
            </div>
            <div className="text-xs text-zinc-500 truncate">{s.reason}</div>
          </div>
          <span className="text-zinc-700 group-hover:text-green-500 transition">→</span>
        </button>
      ))}
    </div>
  );
}
```

---

## PART 5: MULTI-MODEL ORCHESTRATION (PRACTICAL VERSION)

Adopt a multi-model mindset. Stop optimizing around a single model and start designing architectures that can host and switch between many.

You can use smaller, cheaper models for specialized tasks instead of requiring the most capable (and expensive) model for everything. Better scalability and performance.

Rather than running every query through every model (wasteful), route by **job type**:

```typescript
// Enhancement to existing provider-router.ts — add job-specific routing

export const MODEL_ROUTING_TABLE = {
  // Job type → preferred provider → model → reason
  
  'emotion_detection': {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    reason: 'Best at nuanced emotional understanding in free tier',
    temperature: 0.3,
  },
  
  'task_extraction': {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    reason: 'Fast, good at structured JSON output',
    temperature: 0.2,
  },
  
  'schedule_generation': {
    provider: 'google',
    model: 'gemini-2.5-flash',
    reason: 'Largest context window, best for analyzing full day of data',
    temperature: 0.3,
  },
  
  'coaching_response': {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    reason: 'Best balance of empathy + actionability in free tier',
    temperature: 0.7,
  },
  
  'quality_refinement': {
    provider: 'google',
    model: 'gemini-2.5-flash',
    reason: 'High volume, cheap, good for refinement passes',
    temperature: 0.2,
  },
  
  'weekly_review_synthesis': {
    provider: 'google',
    model: 'gemini-2.5-flash',
    reason: 'Needs to process 7 days of data — needs large context',
    temperature: 0.5,
  },
  
  'vision_board_creative': {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    reason: 'More creative for image prompts and affirmations',
    temperature: 0.8,
  },
  
  'archetype_detection': {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    reason: 'Fast, one-shot classification',
    temperature: 0.2,
  },
  
  'psychology_profile_update': {
    provider: 'google',
    model: 'gemini-2.5-flash',
    reason: 'Needs to process full conversation history',
    temperature: 0.2,
  },
} as const;
```

---

## PART 6: ENHANCED ONBOARDING (Deeper, Faster, More Personal)

Unlike traditional productivity tools, Pi combines task management with emotional intelligence, helping you stay on top of your day while feeling understood.

The existing onboarding flow (Section 9 in master doc) works. Here's the enhancement — make it **feel more like a professional intake session**:

### Onboarding Enhancement: The "Life Audit" Summary

After the conversational onboarding completes, generate a **personalized Life Audit document** that the user can see. This makes them feel deeply understood:

```typescript
// File: src/lib/ai/onboarding/life-audit-prompt.ts

export const LIFE_AUDIT_PROMPT = `
# ROLE
You are generating a "Life Audit" — a one-page summary of what you've 
learned about this person during onboarding. This document is shown TO 
the user as proof that RESURGO understands them.

# ONBOARDING DATA
{ONBOARDING_DATA}

# ARCHETYPE
{ARCHETYPE} (confidence: {CONFIDENCE}%)

# GENERATE THIS DOCUMENT:

## Your Life Audit
[Date]

### Where You Are
[2-3 sentences summarizing their current situation — factual, empathetic, 
no judgment. Reference what they told you specifically.]

### What's Working
[1-3 things that are already positive in their life based on what they shared.
Even if things are hard, find something.]

### What's Getting in the Way
[1-3 specific blockers or patterns you detected. Be honest but kind.
Reference their actual words when possible.]

### Your Archetype: [Name]
[2 sentences explaining what this means and why it fits them.
Frame it as a strength, not a label.]

### Your Starting Plan
[3-5 specific first actions RESURGO has set up for them.
Each tied to something they said during onboarding.]

### What Comes Next
[Brief note about how RESURGO will check in, adapt, and grow with them.]

# RULES:
- Maximum 400 words total
- Use their actual words/situations — never generic
- Warm but professional tone
- This document should make the user think: "Wow, it actually listened."
`;
```

---

## PART 7: IMPLEMENTATION PRIORITY FOR CODING AI

```
IMMEDIATE (This Sprint):
═══════════════════════
□ Fix Clerk middleware — public routes must be crawlable
□ Add Daily State check-in to existing wellness module
□ Wire Daily State into every AI system prompt (state-injection.ts)
□ Add NO_GENERIC_RULES to every system prompt
□ Add quality grader + auto-refinement to coach and brain dump outputs
□ Add proactive feature suggestions to dashboard

NEXT SPRINT:
════════════
□ Build enhanced CalendarBlock schema
□ Build schedule generator prompt with energy curve + emotional rationale
□ Build enhanced day view UI (energy bars, rationale on hover, dependency notes)
□ Wire daily state into calendar generation
□ Add model routing table to provider-router

FOLLOWING SPRINT:
═════════════════
□ Build Life Audit generation at end of onboarding
□ Build energy curve learner (analyze historical task completion times)
□ Add auto-refinement loop for all task outputs
□ Enhance weekly review to include emotional arc analysis
□ Add "operating mode" visual indicator to dashboard header

QUALITY RULES:
═════════════
- Every AI output runs through quality grader before returning to user
- If score < 60: auto-refinement pass (one retry, then return best version)
- Every calendar block has an emotional rationale
- Every task has a first step, time estimate, and definition of done
- No response ever uses banned generic phrases
- Every interaction references the user's actual data
```

---

**This is the enhancement that transforms RESURGO from a tool into a partner. Not a single new feature was added — everything here enriches what already exists. The Daily State feeds into every decision. The quality gate kills generics. The calendar becomes a living, breathing plan that respects feelings. The AI proactively guides instead of waiting to be asked. Ship it.** 🚀

