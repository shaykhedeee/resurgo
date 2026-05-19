# RESURGO: ANDROID APP PUBLISHING GUIDE
> Capacitor → Google Play Store (Week 3-4)

---

## SECTION 1: ANDROID BUILD SETUP

### Prerequisites Check
```powershell
# Verify Android SDK is installed
cd c:\Users\USER\Documents\GOAKL RTRACKER
ls android/                    # Should exist
ls android/build.gradle        # Should exist

# Check Node/npm
npm --version                  # Should be >18
node --version                 # Should be >18
```

### Step 1: Generate Signing Key (One-time)

This creates a certificate to sign your app. **Keep this file safe.**

```powershell
# Navigate to workspace
cd c:\Users\USER\Documents\GOAKL RTRACKER

# Generate keystore (replace with your real credentials)
keytool -genkey -v -keystore resurgo-release.keystore `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias resurgo -storepass YOUR_STORE_PASSWORD `
  -keypass YOUR_KEY_PASSWORD

# This creates: resurgo-release.keystore (KEEP SAFE - back it up to password manager)
```

**Save these in LastPass/1Password:**
- `resurgo-release.keystore` file (download after creation)
- `YOUR_STORE_PASSWORD`
- `YOUR_KEY_PASSWORD`

### Step 2: Configure Build Gradle

Edit `android/app/build.gradle`:

```gradle
// Add this to android.signingConfigs section:

signingConfigs {
    release {
        storeFile file(System.getenv('RESURGO_KEYSTORE_FILE') ?: 'resurgo-release.keystore')
        storePassword System.getenv('RESURGO_STORE_PASSWORD')
        keyAlias 'resurgo'
        keyPassword System.getenv('RESURGO_KEY_PASSWORD')
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Step 3: Build Android App

```powershell
# Set environment variables
$env:RESURGO_KEYSTORE_FILE = "c:\Users\USER\Documents\GOAKL RTRACKER\resurgo-release.keystore"
$env:RESURGO_STORE_PASSWORD = "YOUR_STORE_PASSWORD"
$env:RESURGO_KEY_PASSWORD = "YOUR_KEY_PASSWORD"

# Build web first
npm run build

# Sync Capacitor
npx cap sync android

# Open Android Studio
npx cap open android
```

**In Android Studio:**
1. Select `Build → Generate Signed Bundle/APK`
2. Choose `Android App Bundle` (for Play Store)
3. Select `resurgo-release.keystore`
4. Enter passwords
5. Choose `release` variant
6. Click `Build`
7. File saves to: `android/app/release/app-release.aab`

---

## SECTION 2: GOOGLE PLAY STORE SETUP

### Step 1: Create Google Play Developer Account

```
1. Go to https://play.google.com/console
2. Click "Create Account"
3. Pay $25 one-time registration fee (card required)
4. Wait 2-3 hours for account activation
```

### Step 2: Create App Listing

```
In Google Play Console:
1. Click "Create App"
2. App name: "Resurgo"
3. Choose category: "Productivity"
4. Select content rating: "Unrated for now" (fill later)
5. Click "Create App"
```

### Step 3: Fill App Details

**Store listing:**
- Title (50 chars): "Resurgo — Execution OS"
- Short description (80 chars): "AI goal planner + habit tracker + life OS"
- Full description:
```
Drop your goal. Get a real plan in 90 seconds.

Resurgo is an Execution OS for solo operators—the system that replaces Notion + Todoist + Habitica + MyFitnessPal + Timer.

FEATURES:
✓ AI goal decomposition (90 seconds from goal to plan)
✓ 6 AI coaches (Marcus for strategy, Titan for performance, more)
✓ Habit + focus integration (everything connects and compounds)
✓ ADHD-friendly mode (one calm next step, no judgment)
✓ Weekly AI review (automatic pattern detection)
✓ Focus timer (built-in Pomodoro)
✓ Offline support
✓ PWA + mobile hybrid

PLANS:
Free: 3 goals, 5 habits/day, 2 coaches
Pro: $4.99/month (unlimited everything)
Lifetime: $49.99 one-time (all future features)

Used by 5,000+ solo founders, ADHD operators, freelancers, students.

Privacy: https://resurgo.life/privacy
Terms: https://resurgo.life/terms
Support: support@resurgo.life
```

**Screenshots (min 2, max 8):**
- Screenshot 1: Hero dashboard ("Drop your goal in 90 seconds")
- Screenshot 2: Habit tracking + streaks
- Screenshot 3: AI coach interface
- Screenshot 4: Goal decomposition result
- Screenshot 5: Weekly AI review
- Screenshot 6: ADHD mode (optional)
- Screenshot 7: Pricing tiers

**App icon:**
- 512×512 PNG
- Use existing Resurgo logo
- High contrast, readable at small size

**Feature graphic (for Play Store listing):**
- 1024×500 pixels
- Include headline: "Execute Your Goals in 90 Seconds"

### Step 4: Content Rating

```
In Google Play Console → Content rating:
1. Fill out questionnaire
2. Submit for review
3. Get rating (usually within hours)
4. Publish rating
```

### Step 5: Pricing Setup

```
In App Distribution → Pricing and distribution:
1. Click "Add Product"
2. Choose "In-app subscription"

Subscription 1:
- Product ID: resurgo_pro_monthly
- Name: "Pro Monthly"
- Description: "Unlimited goals, habits, all coaches"
- Price: $4.99/month (USA)
- Billing period: Monthly
- Free trial: 0 days (or 3 if you want)

Subscription 2:
- Product ID: resurgo_pro_yearly
- Name: "Pro Yearly"
- Description: "All Pro features for a year"
- Price: $29.99/year (USA)
- Billing period: Annual

Subscription 3:
- Product ID: resurgo_lifetime
- Name: "Lifetime Access"
- Description: "One-time payment, all future features"
- Price: $49.99
- Billing: One-time purchase (not subscription)
```

---

## SECTION 3: UPLOAD TO GOOGLE PLAY

### Step 1: Upload App Bundle

```
In Google Play Console → App releases:
1. Click "Create new release"
2. Choose "Production" (or "Closed testing" for beta first)
3. Upload `app-release.aab` file
4. Review details
5. Click "Review release"
6. Click "Start rollout to Production"
```

**Recommended:** Start with "Closed Testing" (5-100 testers)
- Get feedback from beta users
- Find bugs before public release
- Takes 2-3 days

### Step 2: Review & Approval

Google's review process:
- Automatic scanning: 2-4 hours
- Manual review (if flagged): 1-7 days
- Typical: Approved within 24-48 hours

### Step 3: Monitor Installation

Once live:
- Track installs in Google Play Console
- Monitor crash reports
- Read reviews + respond to feedback

---

## SECTION 4: BETA TESTING (RECOMMENDED FIRST STEP)

### Pre-Release Testing

```powershell
# Build APK for testing (smaller file for direct install)
cd android
./gradlew assembleRelease

# Output: android\app\release\app-release.apk
# Send to 10-20 testers via email or WeTransfer
```

### Beta Group Setup

```
In Google Play Console:
1. Testing → Closed testing
2. Create "Beta" track
3. Add testers (email addresses)
4. Upload app-release.aab
5. Send testers the link: "https://play.google.com/apps/testing/com.resurgo.app"
6. Wait for feedback (3-7 days)
7. Fix any bugs
8. Release to production
```

**Beta Testing Checklist:**
- [ ] App launches without crashes
- [ ] Sign in / Clerk auth works
- [ ] Free plan: 3 goals visible
- [ ] Can add habit + mark complete
- [ ] Can add goal + decompose with AI
- [ ] Can upgrade to Pro (test payment)
- [ ] Can access all 6 coaches
- [ ] Offline mode works
- [ ] Push notifications work
- [ ] UI responsive on different screen sizes (phone + tablet)

---

## SECTION 5: MARKETING & LAUNCH

### App Store Optimization (ASO)

**Keywords to include in title/description:**
- Goal planner
- Habit tracker
- Productivity app
- AI coach
- ADHD app
- Task manager
- Execution system
- Focus timer
- Life OS

**Rating Strategy:**
- Email all free users on Day 1 (in-app): "Love Resurgo? Rate us on Play Store"
- Target: 4.5+ star rating by month 2

**User Reviews Response Template:**
```
"Thanks for using Resurgo! We're always improving. 

If you have suggestions, reach out: support@resurgo.life

And if you'd like in-app coaching, I'm happy to jump on a call to personalize your plan."
```

### Launch Announcement

**Announce on:**
- [ ] X/Twitter: "Resurgo is now on Google Play"
- [ ] Reddit: Link in r/Android, r/productivity posts
- [ ] Email newsletter: "Download the app"
- [ ] Discord: Announcement thread
- [ ] LinkedIn: "Excited to announce mobile app"

**Social Copy:**
```
🚀 Resurgo is now on Google Play

One app. All your goals + habits + coaching + execution.

Free forever tier included.

Get it: https://play.google.com/store/apps/details?id=com.resurgo.app

#buildinpublic #productivity #android
```

---

## SECTION 6: EXPECTED RESULTS

### Timeline
- Week 3 (May 13-19): Build + beta testing
- Week 4 (May 20-26): Submit to Play Store
- May 28: Expected approval + public launch
- June 1+: Scale marketing around app

### Metrics to Track
- Downloads: Target 500+ by end of June
- Install rate: 2% of web visitors
- Active users: 30% of installers
- Average rating: >4.5 stars
- Crash-free rate: >99%

### Revenue Impact
- Android signups: +30/day (estimated month 1)
- Conversion to Pro: 3-5%
- Additional MRR: +$50-75 month 1, scaling to +$200+/month by month 3

---

## TROUBLESHOOTING

### Build Fails
```
Error: "Could not resolve com.google.android.material"
Solution: Update gradle, run: ./gradlew clean build
```

### APK Size Too Large
```
Solutions:
1. Enable minification (ProGuard)
2. Remove unused dependencies
3. Use WebView from system
```

### Won't Sign
```
Check:
1. Keystore file exists
2. Passwords correct
3. Alias name is "resurgo"
4. File permissions correct
```

### Play Store Rejection
```
Most common:
1. App crashes on launch → Fix: test on real device
2. Permissions not justified → Remove unused permissions
3. Ad ID issues → Remove if not using ads
4. Payment issues → Verify Dodo/Stripe integration

Check Play Console for specific rejection reason.
```

---

## iOS APP (Future)

For iOS distribution (App Store):

1. Register Apple Developer ($99/year)
2. Similar process: Build with Xcode
3. Submit to App Review (7-14 day review)
4. Publish

**Timeline:** 4 weeks post-Android (dependency: TestFlight beta)

---

**Status:** Ready for Android build
**Estimated Time:** 4-8 hours total
**Launch Target:** May 28, 2026
