# 🍎 Resurgo iOS Deployment Guide

Complete instructions for building, signing, and publishing the Resurgo app to the Apple App Store.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [App Signing & Provisioning Profiles](#app-signing--provisioning-profiles)
4. [Firebase APNs Setup](#firebase-apns-setup)
5. [Building for TestFlight](#building-for-testflight)
6. [App Store Submission Checklist](#app-store-submission-checklist)
7. [Deep Linking & Universal Links](#deep-linking--universal-links)
8. [Push Notification Setup](#push-notification-setup)
9. [App Store Screenshot Specifications](#app-store-screenshot-specifications)
10. [Common Build Errors](#common-build-errors)
11. [CI/CD Setup (Optional)](#cicd-setup-optional)

---

## Prerequisites

### Hardware & OS
- **macOS 14 (Sonoma)** or newer (required for Xcode 15+)
- **Apple Silicon Mac (M1/M2/M3)** recommended for faster builds

### Software
- **Xcode 15+** (for iOS 17+ SDK)
  - Install from Mac App Store or [developer.apple.com](https://developer.apple.com/xcode/)
  - After install, open Xcode and install additional components
- **Command Line Tools** (installed automatically with Xcode, or: `xcode-select --install`)
- **CocoaPods** (for iOS dependencies)
  ```bash
  sudo gem install cocoapods
  pod setup
  ```
- **Node.js 18+** (for Capacitor CLI)
- **Git** (version control)

### Apple Developer Account
- **Individual or Organization** Apple Developer Program membership ($99/year)
- Enroll at [developer.apple.com/programs](https://developer.apple.com/programs/)
- Wait for approval (can take several days)

---

## Initial Setup

### 1. Add iOS Platform

From your project root:

```bash
# Install Capacitor dependencies if not already
npm install @capacitor/cli @capacitor/ios

# Add iOS platform (generates ios/ directory)
npx cap add ios

# Sync web assets and native config
npx cap sync ios
```

This creates:
```
ios/
├── App/App/                    # Native source files (Swift)
├── App.xcodeproj/              # Xcode project
└── App.xcworkspace/            # Xcode workspace
```

### 2. Verify iOS Project

```bash
# List Capacitor platforms
npx cap doctor

# Open Xcode to verify project loads
npx cap open ios
```

Xcode should launch with the Resurgo project. If you see errors:
- Check `capacitor.config.ts` for syntax errors
- Ensure `ios/` directory exists
- Run `npx cap sync ios` again

### 3. Configure CI/CD Variables (Optional)

Create `.env.ios.local` (git-ignored) for iOS-specific env vars:
```bash
APP_IDENTIFIER=life.resurgo.app
APPLE_TEAM_ID=XXXXXXXXXX
```

---

## App Signing & Provisioning Profiles

### Understanding iOS Code Signing

iOS apps must be signed with Apple-issued certificates to run on devices or submit to the App Store.

**Key components:**
- **Certificate** — Identifies the developer (development or distribution)
- **App ID** — Bundle identifier registered in Apple Developer Portal
- **Provisioning Profile** — Links certificate + App ID + device UDIDs (for dev/ad-hoc)

### Setup Steps

#### A. Create an App ID

1. Go to [Apple Developer Console → Certificates, IDs & Profiles](https://developer.apple.com/account/resources/identifiers/list)
2. Click **+** → **App IDs** → **App**
3. Fill in:
   - **Description**: Resurgo
   - **Bundle ID**: `life.resurgo.app` (must match `capacitor.config.ts` `appId`)
   - **Capabilities**: Enable:
     - Push Notifications
     - Associated Domains (for Universal Links)
     - Background Modes (remote-notification)
     - Sign In with Apple (if used)
4. Click **Continue** → **Register**

#### B. Create a Certificate Signing Request (CSR)

On your Mac (in Keychain Access):

1. Open **Keychain Access** (Applications/Utilities)
2. Navigate: **Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority**
3. Fill in:
   - **User Email**: your email
   - **Common Name**: `Resurgo Distribution`
   - **CA Email**: (leave blank)
   - **Request Type**: **Saved to disk**
4. Click **Continue** → Save as `resurgo-certificate.csr` to Desktop

#### C. Generate Distribution Certificate

1. In Developer Console → **Certificates** → **+** → **Apple Distribution** (or **iOS Distribution**)
2. Select **App Store and Ad Hoc** (for App Store submission)
3. Choose your **Team** (if part of an organization)
4. Upload the CSR file (`resurgo-certificate.csr`)
5. Download the generated certificate (`AppleDistribution.cer`)
6. Double-click to install in Keychain (or run: `open AppleDistribution.cer`)

#### D. Create Provisioning Profiles

**For Development (Debug builds on device):**

1. Developer Console → **Profiles** → **+** → **iOS App Development**
2. Select the **Resurgo App ID**
3. Choose your **Development Certificate**
4. Select devices to test on (max 100 per year)
5. Name profile: `Resurgo Dev Profile`
6. Download → double-click to install (Xcode usually auto-manages this)

**For App Store Distribution:**

1. Developer Console → **Profiles** → **+** → **App Store**
2. Select **Resurgo App ID**
3. Choose **Apple Distribution Certificate**
4. Name: `Resurgo App Store Profile`
5. Download and install

**For Ad Hoc/Enterprise (optional, for direct .ipa distribution):**

1. Developer Console → **Profiles** → **+** → **Ad Hoc**
2. Select App ID, certificate, and devices
3. Download and install

### Automatic Signing (Easier)

In Xcode:
1. Select **Project** in navigator → **Resurgo** target
2. Go to **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (Apple Developer account)
5. Xcode will create/manage certificates and profiles

Troubleshooting automatic signing:
- Ensure you're logged into Xcode with an Apple ID that has Developer Program access
- Bundle ID must match an App ID registered in your account
- If errors persist, try **Product → Clean Build Folder** then rebuild

---

## Firebase APNs Setup

If your app uses **Firebase Cloud Messaging (FCM)** for push notifications, you must upload your APNs key/certificate.

### 1. Generate APNs Auth Key (Recommended)

1. Go to [Apple Developer → Keys](https://developer.apple.com/account/resources/authkeys/list)
2. Click **+** → Name: `Resurgo APNs Key`
3. Check **Apple Push Notifications service (APNs)**
4. Click **Continue** → **Register**
5. Download the `.p8` key file (only downloadable once!)
   - Save it securely (you'll need it for Firebase)
   - Note the **Key ID** (e.g., `XXXXXXXXXX`)

### 2. Upload APNs Key to Firebase

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your Resurgo project
3. Navigate: **Project Settings → Cloud Messaging**
4. In **APNs authentication key** section, click **Upload**
5. Provide:
   - **APNs key ID**: (from Apple Developer portal)
   - **APNs team ID**: (your Apple Developer Team ID, e.g., `XXXXXXXXXX`)
   - **APNs key file**: upload the `.p8` file
6. Click **Upload**

### 3. Update Firebase Config in Xcode

Update `ios/App/App/Info.plist` with Firebase configuration:

```xml
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>  <!-- Disable if manually handling FCM -->

<key>GoogleService-Info.plist</key>
<!-- Ensure this file is added to Xcode project (use CocoaPods or drag into project) -->
```

### Alternative: APNs Certificates (Legacy)

Instead of an auth key, you can upload certificates:
- Development certificate for debug builds
- Production certificate for App Store builds
- Less flexible (expires annually) — API key preferred

---

## Building for TestFlight

### Overview

TestFlight allows you to distribute beta builds to up to 10,000 testers via the App Store.

### 1. Prerequisites Check

- macOS with Xcode 15+
- iOS project added and synced
- App ID created and configured
- Distribution certificate installed
- App Store provisioning profile created

### 2. Build Release IPA

**Option A: Using Xcode GUI (Recommended for first-time)**

1. Open Xcode: `npx cap open ios`
2. Select **Product → Scheme → Resurgo**
3. Select **iOS Device** (not a simulator) as target
4. Select **Product → Archive** (or ⌘+Shift+B)
5. Wait for build to complete (Organizer window opens)
6. Click **Distribute App** → **App Store Connect** → **Upload**
7. Follow prompts:
   - Choose **Automatic signing** (if not already)
   - Upload of symbols for crash reporting (recommended)
   - Validate → Confirm

**Option B: Using Command Line / Script**

The provided `scripts/build-ios.sh` demonstrates the process (requires macOS):

```bash
chmod +x scripts/build-ios.sh
./scripts/build-ios.sh
```

The script:
1. Runs `npx cap sync ios` to update native assets
2. Opens Xcode to configure signing
3. Builds archive with `xcodebuild`
4. Exports IPA for Ad Hoc or App Store
5. Copies to `public/downloads/resurgo-latest.ipa`

**Build configurations:**
- `Debug` — Development builds (device debugging)
- `Staging` — Pre-production test builds
- `Release` — App Store production

### 3. Upload to App Store Connect

After archive completes in Xcode Organizer:

1. Click **Distribute App**
2. Choose **App Store Connect**
3. Select **Upload**
4. **Options:**
   - **Include bitcode**: No (unless required)
   - **Upload symbols**: Yes (for crash reporting)
   - **Stripping Swift symbols**: No
5. Click **Upload**

Wait for processing (5-15 minutes). Check App Store Connect → **My Apps** → **Resurgo** → **TestFlight**.

### 4. Configure TestFlight

In App Store Connect:

1. Go to **TestFlight** tab
2. Fill in **Beta App Review** information:
   - Contact info
   - Demo account (if app requires login)
   - Test instructions
3. Add **Internal Testers** (up to 100 team members)
4. Add **External Testers** (up to 10,000):
   - Create groups (e.g., "Alpha Testers", "Beta Testers")
   - Add email addresses or share public link
5. Submit for **Beta Review** (takes 1-2 days typically)

### 5. Managing Builds

- New builds require re-upload
- Each build can have different release notes
- TestFlight builds expire after 90 days

---

## App Store Submission Checklist

Before submitting for App Store review, complete this checklist:

### [ ] App Metadata
- [ ] **App Name**: "Resurgo" (unique, checked in App Store Connect)
- [ ] **Subtitle**: Short description (30 chars max)
- [ ] **Description**: Full feature list, benefits, what it does
- [ ] **Keywords**: Search terms (comma-separated, 100 chars max)
- [ ] **Support URL**: `https://resurgo.life/support`
- [ ] **Marketing URL**: `https://resurgo.life`
- [ ] **Privacy Policy URL**: `https://resurgo.life/privacy`
- [ ] **Version Number**: Matches `CFBundleShortVersionString` in Info.plist (e.g., `2.0.0`)
- [ ] **Build Number**: Incremented `CFBundleVersion` (e.g., `1`, `2`, `3`...)

### [ ] Visual Assets
- [ ] **App Icon** (1024×1024 px, no rounded corners — App Store adds them)
  - Upload in App Store Connect → App Information
- [ ] **Screenshots** (.png or .jpg, no alpha channel):
  - iPhone 6.7" (1290×2796 px @ 3x) — Portrait & Landscape
  - iPhone 6.5" (1284×2778 px @ 3x) — Portrait & Landscape
  - iPad Pro (12.9") (2048×2732 px @ 2x) — Portrait & Landscape
  - (See screenshot specs section below for complete list)
- [ ] **Previews** (optional): 15-30 sec video demonstrating app use

### [ ] App Configuration
- [ ] **Bundle ID** matches App ID in Developer Portal (`life.resurgo.app`)
- [ ] **App Store Category**: Primary (e.g., "Health & Fitness") and Secondary
- [ ] **Content Rating** — Completed questionnaire (most likely 12+ or 17+)
- [ ] **Export Compliance** — If using encryption (HTTPS counts, but usually qualifies for exemption)
- [ ] **Advertising Identifier (IDFA)** — Check "No" if not serving ads
- [ ] **App Review Information**:
  - **Demo account** (if login required): username/password
  - **Test instructions**: "Use demo account: test@resurgo.life / password123"
  - **Contact信息**: Name, phone, email
- [ ] **App Privacy** — Data collection disclosure (see section below)

### [ ] Technical Requirements
- [ ] **iOS Deployment Target**: 15.0+ (or as configured)
- [ ] **64-bit architecture** — Yes (all modern iOS devices)
- [ ] **No deprecated APIs** (UIWebView, etc.)
- [ ] **App Transport Security** — HTTPS only (or exceptions justified)
- [ ] **Push notification certificate** installed (if using push)
- [ ] **Universal Links** configured (if using deep linking)

### [ ] Legal & Compliance
- [ ] **Privacy Policy** URL active and accessible
- [ ] **Terms of Service** URL (optional but recommended)
- [ ] **Apple Data Use Disclosure** — Accurately describe data collection
- [ ] **Age Rating** — Accurate based on content
- [ ] **No hidden/undocumented features** — All functionality must be disclosed

### [ ] Final Build
- [ ] **Release build** (not Debug)
- [ ] **No debug code or console logs**
- [ ] **App icons** included in Assets.xcassets
- [ ] **Splash screen** configured
- [ ] **Crash reporting** configured (e.g., Firebase Crashlytics)

---

## Deep Linking & Universal Links

Resurgo uses Universal Links for seamless opening of `resurgo.life` URLs that open the app instead of a browser.

### Setup Steps

#### 1. Configure Associated Domains in Xcode

1. Open Xcode: `npx cap open ios`
2. Select **Project** → **Resurgo** target → **Signing & Capabilities**
3. Click **+ Capability** → **Associated Domains**
4. Add domain: `applinks:resurgo.life`
5. (Optional) Add staging domain: `applinks:staging.resurgo.life`

This updates `Info.plist` and `App.entitlements`.

#### 2. Host apple-app-site-association File

Create `public/.well-known/apple-app-site-association` on your website (resurgo.life):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["XXXXXXXXXX.life.resurgo.app"],  // TeamID + BundleID
        "paths": ["*", "/dashboard/*", "/onboarding/*", "/checkout/*"]
      }
    ]
  }
}
```

Replace `XXXXXXXXXX` with your **Apple Team ID** (from Developer Portal → Membership).

Ensure the file is served with `application/json` MIME type (no `.json` extension).

#### 3. Verify Universal Links

On iOS device:
1. Install app via TestFlight or Xcode
2. Visit `https://resurgo.life/dashboard` in Safari
3. Tap the **Open in "Resurgo"** banner at top

If banner doesn't appear:
- Check `apple-app-site-association` is accessible: `https://resurgo.life/.well-known/apple-app-site-association`
- Validate JSON format (no comments, properly formatted)
- Check Xcode logs for Associated Domains errors

#### 4. Handle Deep Links in Capacitor App

In your web app (`src/lib/` or similar), handle incoming navigation:

```typescript
// Detect if app was opened via Universal Link
useEffect(() => {
  const handleAppOpen = async () => {
    // Capacitor automatically loads the URL in the WebView
    // Parse route on app startup
    const path = window.location.pathname;
    if (path.startsWith('/checkout')) {
      // Navigate to checkout flow
    }
  };
  handleAppOpen();
}, []);
```

### Troubleshooting

- **"Cannot Open Page" error** — Associated Domains not configured correctly
- **App doesn't appear** — Check Team ID + Bundle ID matching
- **Universal Links work once then stop** — Ensure `applinks:resurgo.life` in Info.plist (not `https://`)

---

## Push Notification Setup

Resurgo uses Firebase Cloud Messaging (FCM) for push notifications.

### 1. iOS Configuration

In Xcode (`npx cap open ios`):

1. Select **Project** → **Target** → **Signing & Capabilities**
2. Click **+ Capability** → **Push Notifications**
3. Click **+ Capability** → **Background Modes** → Check **Remote notifications**

This updates:
- `Info.plist` with `UIBackgroundModes` → `remote-notification`
- `App.entitlements` with `aps-environment`

Ensure `aps-environment` matches build type:
- **Debug/Development**: `development`
- **App Store/Production**: `production`

Xcode usually manages this automatically if you have proper provisioning profiles.

### 2. Firebase Console Setup

Follow the [Firebase APNs Setup section](#firebase-apns-setup) above.

### 3. Capacitor Push Notifications Plugin

Already installed: `@capacitor/push-notifications`

Basic usage:

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// Request permission
const { status } = await PushNotifications.requestPermissions();

if (status === 'granted') {
  // Register with FCM
  const { token } = await PushNotifications.register();

  // Send token to your backend/Firebase
  await fetch('/api/register-push-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

  // Listen for notifications
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notification received:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Notification action:', action);
  });
}
```

### 4. Test Push Notifications

**Development builds (via Xcode):**
```bash
# Build and run on device
npx cap run ios
```

Use a tool like [PushTry](https://pushtry.com/) or Firebase CLI:
```bash
# Firebase CLI
firebase firestore:push \
  --token <FCM_TOKEN> \
  --title "Test" \
  --body "Hello from Resurgo!"
```

**TestFlight builds:**
- Upload APNs production certificate/key to Firebase
- FCM automatically routes to production APNs for App Store builds

### Common Issues

| Issue | Solution |
|-------|----------|
| No permission prompt | Ensure `Push Notifications` capability added in Xcode |
| Silent pushes not received | Background mode must be enabled |
| Token registration fails | Check APNs key uploaded to Firebase |
| App receives dev pushes in production | Re-upload APNs key to Firebase; ensure correct environment |

---

## App Store Screenshot Specifications

Apple requires specific screenshot sizes for different devices.

### Required Screenshots

| Device | Orientation | Dimensions (px) | Scale | Notes |
|--------|-------------|-----------------|-------|-------|
| iPhone 6.7" | Portrait | 1290 × 2796 | 3x | iPhone 14 Pro Max, 15 Pro Max, 16 Pro Max |
| iPhone 6.7" | Landscape | 2796 × 1290 | 3x | Optional but recommended |
| iPhone 6.5" | Portrait | 1284 × 2778 | 3x | iPhone 11 Pro Max, XS Max |
| iPhone 5.5" | Portrait | 1242 × 2208 | 3x | iPhone 8 Plus, 7 Plus (legacy) |
| iPad Pro (12.9") | Portrait | 2048 × 2732 | 2x | Latest and previous gen |
| iPad Pro (12.9") | Landscape | 2732 × 2048 | 2x | Optional |

### Optional (but recommended)

- iPhone 6.1" (1179 × 2556 px @3x) — iPhone 14, 15, 16
- iPhone 5.8" (1125 × 2436 px @3x) — iPhone X, XS, 11 Pro
- iPad Pro (11") (1668 × 2388 px @2x)

### Tips for Great Screenshots

1. **Show real content** — Use actual app screenshots, not mockups
2. **Clean status bar** — Hide notifications/time by setting status bar to neutral in simulator
3. **Add device frames** (optional) — Use Apple's marketing resources or design tools
4. **Localized screenshots** — If app supports multiple languages, upload per localization
5. **Consistency** — Same style/order across devices

### Capturing Screenshots

**From Simulator:**
```bash
# Boot simulator with device
xcrun simctl boot "iPhone 15 Pro Max"

# Capture screenshot
xcrun simctl io booted screenshot "screenshot-6.7-portrait.png"
```

**From Physical Device:**
- Press **Side Button + Volume Up** (iPhone X+) or **Home + Power** (older)
- Edit in Photos to crop/crop to correct dimensions

---

## Common Build Errors

### "Command PhaseScriptExecution failed with a nonzero exit code"

**Cause:** CocoaPods dependencies out of sync.

**Fix:**
```bash
cd ios/App
pod deintegrate
pod install --repo-update
cd ../..
npx cap sync ios
```

### "No signing certificate 'Apple Distribution' found"

**Cause:** Distribution certificate not installed.

**Fix:**
1. Double-check certificate installed in Keychain Access → "My Certificates"
2. Or use Xcode automatic signing: Project → Signing & Capabilities → Team

### "Failed to create provisioning profile"

**Fix:**
- Ensure App ID exists in Apple Developer Portal
- Check bundle ID matches exactly
- Verify team selection in Xcode

### "Code signing is required for product type 'Application' in SDK 'iOS'"

**Fix:**
- In Xcode: Project → Build Settings → **Code Signing Identity** → Set to "Apple Development" (Debug) or "Apple Distribution" (Release)
- Or enable "Automatically manage signing"

### "Podfile.lock out of date"

**Fix:**
```bash
cd ios/App
pod install
```

### "Multiple commands produce" errors

**Cause:** Duplicate file references in Xcode project (common after adding custom files manually).

**Fix:**
1. In Xcode, select project navigator
2. Search for duplicate files (red-colored)
3. Delete duplicates (keep only one reference)

### "App has crashed because it attempted to access privacy-sensitive data without a usage description"

**Cause:** Missing privacy description in `Info.plist` for camera, location, etc.

**Fix:** Add usage description keys:
```xml
<key>NSCameraUsageDescription</key>
<string>App needs camera for...</string>
```

### "The app is not authorized to use push notifications"

**Cause:** Missing Push Notifications capability or entitlements.

**Fix:**
- Add Push Notifications capability in Xcode Signing & Capabilities
- Ensure `aps-environment` in App.entitlements (usually auto-added)

### "Failed to mount... Error: EPERM: operation not permitted"

**Cause:** macOS permissions blocking Xcode build tools.

**Fix:** Run:
```bash
# Grant disk access to Terminal/iTerm
sudo chown -R $(whoami) ~/Library/Developer/Xcode/DerivedData
```

---

## CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/ios.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

jobs:
  build-ios:
    name: Build iOS
    runs-on: macos-14  # macOS 14+ required

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install CocoaPods
        run: |
          sudo gem install cocoapods
          cd ios/App && pod install

      - name: Sync Capacitor
        run: npx cap sync ios

      - name: Build Archive
        run: |
          cd ios/App
          xcodebuild \
            -workspace App.xcworkspace \
            -scheme App \
            -configuration Release \
            -archivePath $PWD/build/App.xcarchive \
            archive \
            CODE_SIGN_IDENTITY="Apple Distribution" \
            PROVISIONING_PROFILE_SPECIFIER="Resurgo_AppStore"

      - name: Export IPA
        run: |
          cd ios/App
          xcodebuild -exportArchive \
            -archivePath $PWD/build/App.xcarchive \
            -exportOptionsPlist ExportOptions.plist \
            -exportPath $PWD/build/output

      - name: Upload IPA
        uses: actions/upload-artifact@v3
        with:
          name: resurgo.ipa
          path: ios/App/build/output/App.ipa
```

**Note:** CI requires Apple Developer account credentials stored as GitHub secrets:
- `APP_STORE_CONNECT_API_KEY_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_PRIVATE_KEY`

### Fastlane Alternative

Automate entire deployment with [Fastlane](https://fastlane.tools/):

```bash
# Install Fastlane
brew install fastlane

# Initialize
cd ios/App
fastlane init

# Create Fastfile with lanes:
# - beta: Build and upload to TestFlight
# - release: Submit to App Store
```

Fastlane handles code signing with `match` (private git repo for certificates).

---

## 📚 Additional Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [TestFlight Guide](https://developer.apple.com/testflight/)

---

**Last Updated:** May 2026  
**App Version:** 2.0.0  
**Maintainer:** Resurgo Dev Team
