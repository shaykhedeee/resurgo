# Resurgo — Multi-Platform Build Guide

## Android (READY)

Everything is configured. Capacitor + Android platform already set up.

### Debug APK
```bash
npm run android:build
```

### Release APK (signed)
```bash
# First, generate a keystore (one-time):
keytool -genkey -v -keystore resurgo-release.keystore -alias resurgo -keyalg RSA -keysize 2048 -validity 10000

# Then build:
npm run android:build:release
```

### Open in Android Studio
```bash
npm run android:open
```

### APK Distribution Options
1. **Direct APK** — Share `public/downloads/resurgo-latest.apk` via website download link
2. **Firebase App Distribution** — Upload APK to Firebase for beta testing
3. **Google Play Store** — Generate AAB instead of APK for Play Store submission:
   ```bash
   cd android && gradlew.bat bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## iOS (SETUP NEEDED — requires Mac)

### Prerequisites
- macOS with Xcode 15+
- Apple Developer account ($99/year)
- CocoaPods installed (`sudo gem install cocoapods`)

### Setup Steps
```bash
# 1. Add iOS platform
npx cap add ios

# 2. Sync
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

### Build & Distribute
- Archive in Xcode → Upload to App Store Connect
- Or use Fastlane for automation

### Add to package.json scripts:
```json
"ios:sync": "npx cap sync ios",
"ios:open": "npx cap open ios"
```

---

## Desktop (SETUP NEEDED)

### Option A: Electron (easier, larger bundle ~150MB)
```bash
npm install --save-dev electron electron-builder

# Create electron/main.js pointing to https://resurgo.life
# Package with electron-builder
```

### Option B: Tauri (recommended — smaller, ~10MB)
```bash
# Install Rust first: https://rustup.rs
npm install --save-dev @tauri-apps/cli
npx tauri init
npx tauri build
```

### Recommended: Tauri v2
- Outputs ~10MB installer for Windows/Mac/Linux
- Uses system WebView (Edge on Windows, WebKit on Mac)
- Matches existing Capacitor pattern (WebView wrapping hosted site)

### Quick Tauri Setup
```bash
# Install
npm install --save-dev @tauri-apps/cli @tauri-apps/api

# Initialize (creates src-tauri/ folder)
npx tauri init
# App name: Resurgo
# Window title: Resurgo
# Dev server URL: http://localhost:3000
# Production URL: https://resurgo.life

# Build
npx tauri build
```

Output locations:
- Windows: `src-tauri/target/release/bundle/msi/Resurgo_*.msi`
- macOS: `src-tauri/target/release/bundle/dmg/Resurgo_*.dmg`
- Linux: `src-tauri/target/release/bundle/appimage/Resurgo_*.AppImage`
