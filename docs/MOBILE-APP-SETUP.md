# Mobile App Setup — Android & iOS

Complete configuration and build instructions for both Android APK and iOS (PWA + App Store) for the Resurgo app.

---

## 📱 Platform Summary

| Feature | Android | iOS |
|---------|---------|-----|
| Distribution | Direct APK (`/downloads/resurgo-latest.apk`) | Safari PWA **and** App Store (future) |
| Minimum version | Android 8.0 (Oreo, API 26) | iOS 16.4+ (for push) / iOS 16.0+ for PWA |
| Push notifications | ✅ FCM (requires Firebase) | ✅ APNs (requires Firebase + Apple credentials) |
| Home screen widget | ✅ Daily Wins widget | ⏳ Coming in App Store release |
| Deep linking | ✅ Android App Links (`https://resurgo.life`) | ⏳ Universal Links (configured, pending App Store) |
| Offline mode | ✅ (`offline.html`) | ✅ (`offline.html`) |
| Signing | ✅ Keystore (`resurgo-release.keystore`) | ⏳ Apple Developer certificates |
| Build system | Gradle (Windows/Linux/macOS) | Xcode (macOS only) |
| Current status | **Production-ready** | **PWA installable now; App Store in development** |

---

## 🤖 Android

### Quick Build (Windows / Linux / macOS)

```bash
# Install dependencies
npm ci

# One-command release build
npm run android:build:release
```

**Output:**
- `android/app/build/outputs/apk/release/app-release.apk` (signed)
- `public/downloads/resurgo-latest.apk` (served by website)

### Distributed via
- `https://resurgo.life/downloads/resurgo-latest.apk`
- `/app` and `/download` pages feature prominent download buttons

### Full Android Guide
See **[docs/ANDROID-APP-BUILD-GUIDE.md](./ANDROID-APP-BUILD-GUIDE.md)** — prerequisites, signing, troubleshooting, Play Store publishing.

---

## 🍎 iOS

### For End Users (Right Now)

No IPA download needed. Install Resurgo on iPhone/iPad in 4 steps:

1. Open **Safari** and go to `https://resurgo.life`
2. Tap the **Share button** (□↑)
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add** → open from home screen

**Result:** Full-screen PWA that works offline, syncs with cloud, and can receive push notifications (iOS 16.4+).

**Note:** Chrome/Firefox on iOS cannot install PWAs — Safari is required.

### For Developers (Building the IPA)

iOS builds **require macOS** with Xcode 15+.

#### Initial Setup (macOS only)

```bash
# 1. Install Xcode from Mac App Store
# 2. Install CocoaPods
sudo gem install cocoapods
pod setup

# 3. Add iOS platform (generates ios/ directory)
npx cap add ios

# 4. Sync assets and open Xcode
npm run ios:sync
npm run ios:open
```

#### Code Signing (Xcode)

1. In Xcode, select the **App** target → **Signing & Capabilities**
2. Choose your **Team** (Apple Developer account)
3. Enable **Automatically manage signing** (recommended)
4. Xcode creates provisioning profiles & certificates

OR — manual signing:

- Create App ID `life.resurgo.app` in Apple Developer Portal
- Generate Distribution Certificate
- Create Ad Hoc / App Store provisioning profile
- Download and double-click to install
- Set `CODE_SIGN_IDENTITY` and `PROVISIONING_PROFILE_SPECIFIER` in Xcode or via `ExportOptions.plist`

See **[docs/IOS-DEPLOYMENT.md](./IOS-DEPLOYMENT.md)** for detailed signing walkthrough.

#### Build for TestFlight / App Store

```bash
# Build App Store-signed IPA
npm run ios:build

# Output
public/downloads/resurgo-latest.ipa
```

Then:
- Open **Xcode Organizer** (launches automatically) OR use **Transporter** app
- Upload `.ipa` to App Store Connect
- Fill testers (TestFlight) or submit for review (App Store)

#### Firebase & Push Notifications on iOS

1. In [Firebase Console](https://console.firebase.google.com):
   - Add iOS app to your project (bundle ID: `life.resurgo.app`)
   - Upload APNs authentication key (`.p8` from Apple Developer)
2. Download `GoogleService-Info.plist`
3. Place at `ios/App/App/GoogleService-Info.plist` (NOT `android/app/`)
4. Re-sync: `npm run ios:sync`

Without this, push notifications are silently disabled (plugin catches the error).

---

## 🔄 When to Rebuild Native Apps

Because Resurgo uses **hosted WebView**, most changes only require a web deploy.

**No rebuild needed:**
- UI/UX changes (Next.js pages, styles)
- Business logic (Convex functions)
- Content updates (blog posts, marketing pages)
- Backend API modifications

**Rebuild required:**
- Capacitor config changes (`capacitor.config.ts`)
- AndroidManifest/Info.plist modifications
- Native plugin additions/removals
- Icons/splash screens / branding assets
- Firebase configuration updates
- Version bump for release
- Deep linking / URL scheme changes

### Recommended Workflow

```bash
# After any native-relevant change:
npm run android:build:release   # Build signed APK
# On macOS: npm run ios:build    # Build IPA (when ready for App Store)
# Commit both artifacts
git add public/downloads/resurgo-latest.apk
# git add public/downloads/resurgo-latest.ipa   (when available)
git commit -m "chore(mobile): release v2.0.0 — update native assets"
git push
# Vercel auto-deploys, serving updated APK at /downloads/
```

---

## 📂 Project Structure

```
resurgo/
├── android/                    # Generated by `npx cap add android`
│   ├── app/
│   │   ├── build/             # Build outputs (APKs, AABs)
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/life/resurgo/app/    # Native Java/Kotlin code
│   │   │   └── res/                      # Icons, splash, layouts
│   │   └── build.gradle
│   ├── gradle/                 # Wrapper + config
│   └── local.properties        # Android SDK path (auto-generated)
├── ios/                       # Generated by `npx cap add ios` (macOS only)
│   ├── App/
│   │   ├── App/               # Xcode project source
│   │   │   ├── AppDelegate.swift
│   │   │   ├── Info.plist
│   │   │   ├── App.entitlements
│   │   │   └── Assets.xcassets/
│   │   │       ├── AppIcon.appiconset/
│   │   │       └── LaunchScreen.launchimage/
│   │   └── GoogleService-Info.plist  # Firebase (iOS)
│   └── App.xcworkspace
├── public/
│   ├── downloads/
│   │   ├── resurgo-latest.apk   # Android APK (served)
│   │   └── resurgo-latest.apk.sha256
│   └── offline.html            # Offline fallback (bundled in both apps)
├── scripts/
│   ├── build-android.js        # Android build pipeline
│   └── build-ios.js            # iOS build pipeline (macOS)
├── capacitor.config.ts         # Shared Capacitor configuration
└── resurgo-release.keystore    # Android keystore (gitignored)
```

**Important:** `ios/` and `android/` are **gitignored** by default (see `.gitignore`). This means:
- Native projects are **re-generated** from `capacitor.config.ts` when needed
- Manual Xcode edits may be overwritten on `npx cap sync`
- Use plugins or `capacitor.config.ts` for persistent config changes

If you want to commit native projects to version control (recommended for team iOS development), remove `ios/` and `android/` from `.gitignore` and commit the generated folders.

---

## 🔗 Deep Linking & Universal Links

Both platforms support deep links to `https://resurgo.life/*` opening directly in the app.

| Platform | Mechanism | Status |
|----------|-----------|--------|
| Android | **Android App Links** (verified) | ✅ Configured — `assetlinks.json` deployed |
| iOS | **Universal Links** (apple-app-site-association) | ⏳ Configured in Xcode; AASA file ready (see below) |

### Android App Links
- `AndroidManifest.xml` has `<intent-filter android:autoVerify="true">`
- `public/.well-known/assetlinks.json` includes SHA-256 fingerprint of release keystore
- When user clicks a `resurgo.life` link → opens directly in app (no chooser)

### iOS Universal Links
- **Xcode:** Associated Domains capability enabled with `applinks:resurgo.life`
- **AASA file:** Host at `https://resurgo.life/.well-known/apple-app-site-association`
- File contents (auto-served by Next.js route if you implement one, or static file):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["<TEAM_ID>.life.resurgo.app"],
        "paths": ["/*"]
      }
    ]
  }
}
```

You'll need to replace `<TEAM_ID>` with your Apple Developer Team ID and serve the file as `application/json` with no extension.

---

## 🔐 Security & Signing

### Android
- **Keystore:** `resurgo-release.keystore` (at project root, gitignored)
- **Alias:** `resurgo-key`
- **Password:** Stored in `android/app/build.gradle` (consider env var for production)
- **Verification:** SHA-256: `31b299b6...` (current build), published alongside APK

### iOS
- **Certificates:** Distribution certificate (`.p12`) or Apple-managed (automatic signing)
- **Provisioning profile:** App Store / Ad Hoc
- **Entitlements:** `ios/App/App/App.entitlements` includes:
  - `aps-environment` = `development` or `production` (for push)
  - `associated-domains` for Universal Links
  - `com.apple.security.application-groups` if sharing data between extensions

---

## 📱 Feature Parity Matrix

| Feature | Android APK | iOS PWA | iOS App Store (future) |
|---------|------------|---------|----------------------|
| Core WebView | ✅ | ✅ | ✅ |
| Offline fallback | ✅ | ✅ | ✅ |
| Push notifications | ✅ FCM | ✅ Limited (Web Push) | ✅ Full APNs |
| Home screen widget | ✅ Daily Wins | ❌ PWA no widget | ✅ Planned |
| Deep linking | ✅ App Links | ✅ Universal Links | ✅ Universal Links |
| In-app purchases | ✅ | ✅ Stripe PWA | ✅ Native IAP |
| Camera/File access | ✅ Capacitor Camera | ✅ Web API / Capacitor | ✅ Full native |
| Background sync | ✅ | ⚠️ Limited | ✅ Full |
| Version updates | Manual download | Automatic (web) | App Store auto |

**iOS PWA limitations:** Push notifications require iOS 16.4+ and user permission; no home screen widgets; limited background processing.

---

## 🏃 Quick Start Checklist

### Android
- [x] Android SDK installed (Platform 36, Build-Tools 35+)
- [x] Java 21 configured (Android Studio JBR)
- [x] Release keystore generated (`resurgo-release.keystore`)
- [x] APK built & signed (v2.0.0, 1.3 MB)
- [x] Direct download working (`/downloads/resurgo-latest.apk`)
- [x] SHA-256 checksum published
- [ ] Firebase `google-services.json` placed (for push)
- [ ] Play Store AAB build (`bundleRelease`)

### iOS
- [ ] Xcode 15+ installed on macOS
- [ ] Apple Developer account enrolled
- [ ] `npx cap add ios` executed (creates `ios/` folder)
- [ ] Firebase APNs key uploaded + `GoogleService-Info.plist` placed
- [ ] App signing configured in Xcode (Team selected)
- [ ] Build TestFlight IPA (`npm run ios:build`)
- [ ] Upload to App Store Connect (TestFlight testing)
- [ ] App Store metadata filled (screenshots, description, keywords)
- [ ] AASA file deployed (`/.well-known/apple-app-site-association`)
- [ ] Submit for review

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| `docs/ANDROID-APP-BUILD-GUIDE.md` | Full Android build, signing, troubleshooting |
| `docs/IOS-DEPLOYMENT.md` | Complete iOS setup, signing, App Store submission |
| `docs/MOBILE-APP-SETUP.md` (this file) | Platform comparison, when-to-rebuild, unified structure |
| `scripts/build-android.js` | Android build automation script |
| `scripts/build-ios.js` | iOS build automation (macOS + Xcode required) |
| `capacitor.config.ts` | Shared Capacitor configuration for both platforms |

---

## 🆘 Troubleshooting

### Android: "Unsupported class file major version 69"
**Cause:** Using Java 25 (class file version 69) with AGP 8.x (only supports up to Java 22).  
**Fix:** Set `JAVA_HOME` to Java 21 (Android Studio JBR) or add `org.gradle.java.home` to `~/.gradle/gradle.properties`.

### Android: "windowSplashScreenBrandingImage not found"
**Cause:** Missing `android:` prefix on splash attrs in `styles.xml`.  
**Fix:** All window splash attrs require `android:` prefix. Already fixed in repo.

### iOS: "Command PhaseScriptExecution failed with a non-zero exit code"
**Cause:** CocoaPods not installed, or `GoogleService-Info.plist` missing.  
**Fix:** `sudo gem install cocoapods`, then `pod install` in `ios/` folder. Ensure Firebase plist exists.

### iOS: Build fails on "No profiles for 'com.apple...' were found"
**Cause:** Provisioning profile not generated or team not selected.  
**Fix:** In Xcode → target → Signing & Capabilities → select Team → enable automatic signing OR manually create profiles in Apple Developer portal.

### Both: Push notifications not working
**Checklist:**
- [ ] Android: `google-services.json` present in `android/app/`
- [ ] iOS: `GoogleService-Info.plist` present in `ios/App/App/`
- [ ] Firebase project has FCM enabled and APNs key uploaded (iOS)
- [ ] App requests notification permission at runtime (`PushNotifications.requestPermissions()`)
- [ ] Device token registered with your server (Convex)

---

## 📈 Roadmap

- [ ] **App Store launch** — complete iOS build, TestFlight testing, submit to Apple
- [ ] **Play Store listing** — migrate from direct APK to Google Play distribution (optional, alongside direct)
- [ ] **iOS Widget** — Daily Wins widget for iOS 14+ (requires native extension)
- [ ] **In-App Updates** — Android in-app update API for smoother updates
- [ ] **Beta distributions** — Firebase App Distribution (Android) + TestFlight (iOS)

---

**Last updated:** 2026-05-13  
**Resurgo version:** 2.0.0  
**Platform status:** Android ✅ Production | iOS 🔄 PWA Ready → App Store in progress
