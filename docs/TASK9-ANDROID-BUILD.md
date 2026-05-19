# TASK 9: ANDROID APP BUILD & GOOGLE PLAY LAUNCH
## Step-by-Step Execution (5-8 hours total)

**Date:** May 13, 2026  
**Timeline:** Complete by May 20 (7 days)  
**Expected Impact:** +30-50 new signups/day once live  

---

## PHASE 1: LOCAL BUILD SETUP (1-2 Hours)

### Step 1: Generate Android Signing Key
**Purpose:** Create secure key for signing APKs for Google Play

```bash
# Run from project root
keytool -genkey -v -keystore resurgo-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias resurgo-key \
  -storepass your_store_password \
  -keypass your_key_password
```

**Important:**
- Save the keystore file **SECURELY** (commit .gitignore, back up locally)
- Remember both passwords (you'll need them for every build)
- Validity: 10000 days ≈ 27 years (covers app lifecycle)

### Step 2: Configure Gradle for Signing
**File:** android/app/build.gradle

Add signing config:
```gradle
android {
  ...
  signingConfigs {
    release {
      storeFile file('../../resurgo-release.keystore')
      storePassword 'your_store_password'
      keyAlias 'resurgo-key'
      keyPassword 'your_key_password'
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      shrinkResources true
    }
  }
}
```

### Step 3: Build APK (Production)
```bash
cd android
./gradlew build --release
```

**Output location:** 
- `android/app/build/outputs/apk/release/app-release.apk`
- Size: ~50-60MB (check this)

**Troubleshooting:**
- If build fails: `./gradlew clean && ./gradlew build --release`
- Check Java version: `java -version` (need Java 11+)

---

## PHASE 2: GOOGLE PLAY SETUP (1 Hour)

### Step 1: Create Google Play Developer Account
**URL:** https://play.google.com/apps/publish/

**Cost:** $25 USD (one-time)  
**Time:** 15 minutes (includes payment)

**Setup requirements:**
- Google account
- Payment method (credit card)
- Developer name + email

### Step 2: Create New App in Play Console
1. Go to Google Play Console Dashboard
2. Click "Create app"
3. Fill out:
   - **App name:** Resurgo
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
   - **Category:** Productivity
4. Click Create

### Step 3: Set Up App Listing
**Section: "App information"**
- [ ] App name: Resurgo
- [ ] Short description: "Execution OS for solo operators. AI coaches. No card required."
- [ ] Full description: (see below)
- [ ] Category: Productivity
- [ ] Content rating: Required (takes 10 min to fill questionnaire)

**Full Description Template:**
```
RESURGO: Your Execution Operating System

Stop failing at your goals. Start shipping what matters.

The Problem:
→ 94% of people abandon goals by week 2
→ Most apps track habits in isolation (no connection to your actual goals)
→ Goal-setting frameworks are useless without an execution system

The Solution:
✓ One calm next step (ADHD-friendly interface)
✓ AI breaks down your goal into daily executable tasks
✓ Real-time AI coaching (5 coaches, all day every day)
✓ Streak tracking + weekly AI review
✓ Focus sessions + habit stacking

What Users Say:
"First 30-day streak I've ever maintained"
"Shipped 2 features in planning time"
"Replaced 5 apps with one system"

FREE FOREVER plan includes:
→ 3 active goals
→ 5 habit check-ins/day
→ 10 AI messages/day
→ 2 coaches (Marcus + Titan)
→ Full focus timer + weekly reviews

Pro ($4.99/month or $49.99/lifetime):
→ Unlimited everything
→ All 5 coaches unlocked
→ Advanced analytics
→ Priority support

Built by indie hacker for solo operators, entrepreneurs, ADHD folks, 
and anyone tired of apps that don't work.

Website: https://resurgo.life
Privacy: https://resurgo.life/privacy
Support: support@resurgo.life
```

---

## PHASE 3: SCREENSHOTS & ASSETS (1-2 Hours)

### Required Assets:

1. **App Icon** (512x512 PNG)
   - Use existing logo: designs/app-icon-512.png
   - Or create: orange "R" on black background

2. **Screenshots** (1080x1920, min 2, max 8)
   **Key screens to capture:**
   - Screen 1: Goal decomposition (main value prop)
   - Screen 2: Daily execution view (one calm task)
   - Screen 3: Streak tracking + AI coach
   - Screen 4: Weekly AI review
   - Screen 5: Coach recommendations

   **Format:** 
   - Emulator screenshots: `emulator screenshot` command
   - Or phone screenshot + crop to 1080x1920

3. **Feature Graphic** (1024x500 PNG)
   **Design:**
   - Orange Resurgo logo on black background
   - Tagline: "Execution OS for Solo Operators"
   - Subtext: "AI breaks down your goals into daily tasks"

4. **Video Preview** (Optional, 15-30 seconds)
   - Demo: Goal input → AI decomposition → execution flow
   - Or: Before/after screenshot sequence with captions

---

## PHASE 4: PLAY STORE CONFIGURATION (30 Minutes)

### Step 1: Upload APK
**In Google Play Console:**
1. Go to "App releases" → "Testing"
2. Click "Create new release"
3. Upload APK:
   - Drag & drop `app-release.apk` from android/app/build/outputs/apk/release/
4. Review & confirm

### Step 2: Add Screenshots
**In Google Play Console:**
1. Go to "Store Listing" → "Screenshots"
2. Upload 5-8 screenshots (1080x1920 each)
3. Arrange in order (goal → execution → coaching → review → results)

### Step 3: Add Icon & Graphics
1. Go to "Store Listing" → "Graphic Assets"
2. Upload:
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
3. Save

### Step 4: Content Rating
1. Go to "Content Rating"
2. Click "Create content rating questionnaire"
3. Select "Productivity" category
4. Answer ~20 questions (5 minutes)
5. Get age rating (usually 3+)

### Step 5: Pricing & Distribution
1. Go to "Pricing & Distribution"
2. Select: FREE
3. Check: "Available in all countries"
4. Content guidelines: Accept all
5. Save

---

## PHASE 5: BETA TESTING (3-5 Days)

### Step 1: Create Closed Testing Track
**In Google Play Console:**
1. Go to "App releases" → "Testing" → "Closed testing"
2. Create new release
3. Upload APK
4. Click "Create email list" → add 10-20 beta testers
5. Launch as "Closed testing"

**This sends emails to testers with link to install**

### Step 2: Collect Feedback
- Give testers 3-5 days to test
- Collect bugs in spreadsheet
- Fix critical issues
- Re-upload fixed APK

### Step 3: Final QA Checklist
Before production release:
- [ ] App launches without crash
- [ ] Sign-up flow works
- [ ] Goal decomposition works
- [ ] Habit tracking works
- [ ] AI coaching responds
- [ ] Weekly review generates
- [ ] Payment links work (test mode)
- [ ] All permissions requested correctly
- [ ] Privacy policy link works
- [ ] Support email works

---

## PHASE 6: PRODUCTION RELEASE (1 Hour)

### Step 1: Move to Production
**In Google Play Console:**
1. Go to "App releases" → "Production"
2. Click "Create new release"
3. Select fixed APK from closed testing track
4. Confirm all store listing data
5. Click "Review and release"

**⚠️ IMPORTANT:** Review takes 2-4 hours. App will be live after approval.

### Step 2: Monitor First Day
- [ ] Monitor Google Play analytics for first install rate
- [ ] Check for crash reports
- [ ] Monitor email for support requests
- [ ] Post announcement on X/Twitter/Reddit

---

## LAUNCH ANNOUNCEMENT (Day of Production Release)

### X/Twitter Thread:
```
🤖 Resurgo is now on Android!

For 2 months I built an iOS-only app on PWA. Today: 
Android app is live on Google Play.

Download now: https://play.google.com/store/apps/details?id=life.resurgo

What changed:
→ Offline-first task execution
→ Native notifications
→ Home screen widget (coming week 2)
→ Installation shortcut

If you're on Android: install it now.
If you see a bug: hit reply—I'm reading everything.

#buildinpublic #android #productivity

Download: https://play.google.com/store/apps/details?id=life.resurgo
```

### Reddit Post:
- Post to r/androidapps, r/productivity, r/SideProject
- Title: "Built Resurgo—AI goal-execution system. Just launched on Android. Free forever."
- Disclose founder status
- Include PH and website links

---

## EXPECTED METRICS

| Metric | Week 1 | Month 1 | Month 3 |
|--------|--------|---------|---------|
| Android installs | 20-50 | 100-200 | 500-1K |
| Install → signup | 30% | 35% | 40% |
| New signups | 6-15 | 35-70 | 200-400 |

---

## TROUBLESHOOTING

**Build fails with "invalid keystore":**
- Check passwords are correct
- Check file path exists
- Run: `keytool -list -v -keystore resurgo-release.keystore`

**APK is too large (>100MB):**
- Enable minifyEnabled in gradle
- Remove unused dependencies
- Compress assets

**Google Play review rejected:**
- Check: privacy policy linked
- Check: crashlytics working
- Check: no misleading claims
- Resubmit with response

---

## FILE REFERENCES

**Build config:** android/app/build.gradle  
**Signing key:** resurgo-release.keystore (keep safe!)  
**App ID:** life.resurgo  

---

**Timeline:** May 13-20 (7 days)  
**Deadline:** May 20 (before Mountain Day signups spike)  
**Owner:** Founder  
**Success:** 20+ Android installs, 0 day-1 crashes
