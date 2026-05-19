#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# RESURGO — iOS Build Script
# Builds the Capacitor iOS project and produces a signed IPA
#
# Usage:
#   ./scripts/build-ios.sh adhoc      # Build for Ad Hoc distribution
#   ./scripts/build-ios.sh appstore   # Build for App Store submission
#   ./scripts/build-ios.sh enterprise # Build for Enterprise distribution
#
# Prerequisites:
#   - macOS 14+
#   - Xcode 15+ with CLI tools installed
#   - CocoaPods installed (gem install cocoapods)
#   - iOS platform added (npx cap add ios)
#   - Code signing configured in Xcode (automatic or manual)
#   - Valid provisioning profile installed
# ═══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

# ─── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
IOS_PROJECT_DIR="$PROJECT_ROOT/ios/App"
WORKSPACE_PATH="$IOS_PROJECT_DIR/App.xcworkspace"
SCHEME="App"
CONFIGURATION="Release"
EXPORT_METHOD="$1"  # adhoc | appstore | enterprise

if [ -z "$EXPORT_METHOD" ]; then
  echo "❌ Please specify a distribution method: adhoc, appstore, or enterprise"
  echo "   Example: ./scripts/build-ios.sh appstore"
  exit 1
fi

# ─── Validate export method ───────────────────────────────────────────────────
case "$EXPORT_METHOD" in
  adhoc|appstore|enterprise)
    echo "🎯 Building for: $EXPORT_METHOD"
    ;;
  *)
    echo "❌ Invalid distribution method: $EXPORT_METHOD"
    echo "   Valid options: adhoc, appstore, enterprise"
    exit 1
    ;;
esac

# ─── Pre-flight checks ────────────────────────────────────────────────────────
if [ ! -d "$WORKSPACE_PATH" ]; then
  echo "⚠️  iOS workspace not found at $WORKSPACE_PATH"
  echo "   Adding iOS platform..."
  cd "$PROJECT_ROOT"
  npx cap add ios
fi

# ─── Sync Capacitor assets ─────────────────────────────────────────────────────
echo ""
echo "🔄 Syncing Capacitor assets to iOS project..."
cd "$PROJECT_ROOT"
npx cap sync ios

# ─── Ensure CocoaPods are installed ───────────────────────────────────────────
if [ -f "$IOS_PROJECT_DIR/Podfile" ]; then
  echo ""
  echo "📦 Installing CocoaPods dependencies..."
  cd "$IOS_PROJECT_DIR"
  pod install --repo-update
  cd "$PROJECT_ROOT"
fi

# ─── Build archive ────────────────────────────────────────────────────────────
ARCHIVE_PATH="$IOS_PROJECT_DIR/build/App.xcarchive"
echo ""
echo "🏗️  Building Xcode archive..."
echo "   Configuration: $CONFIGURATION"
echo "   Archive path: $ARCHIVE_PATH"

xcodebuild -workspace "$WORKSPACE_PATH" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  archive \
  CODE_SIGN_STYLE="Automatic" \
  | xcpretty

if [ $? -ne 0 ]; then
  echo "❌ Archive build failed. Check Xcode build logs above."
  exit 1
fi

echo ""
echo "✅ Archive created successfully at: $ARCHIVE_PATH"

# ─── Export IPA ────────────────────────────────────────────────────────────────
EXPORT_DIR="$IOS_PROJECT_DIR/build/output"
EXPORT_OPTIONS_PLIST="$IOS_PROJECT_DIR/ExportOptions.plist"

# Create ExportOptions.plist if it doesn't exist
if [ ! -f "$EXPORT_OPTIONS_PLIST" ]; then
  echo ""
  echo "📝 Creating ExportOptions.plist for $EXPORT_METHOD..."

  cat > "$EXPORT_OPTIONS_PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>$EXPORT_METHOD</string>
  <key>teamID</key>
  <string>\$(TEAM_ID)</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>compileBitcode</key>
  <false/>
  <key>stripSwiftSymbols</key>
  <false/>
  <key>destination</key>
  <string>export</string>
  <key>uploadSymbols</key>
  <true/>
  <key>manageAppVersionAndBuildNumber</key>
  <true/>
</dict>
</plist>
EOF
fi

echo ""
echo "📦 Exporting IPA..."
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS_PLIST" \
  -exportPath "$EXPORT_DIR" \
  | xcpretty

if [ $? -ne 0 ]; then
  echo "❌ IPA export failed. Check Xcode build logs above."
  exit 1
fi

# ─── Locate IPA ───────────────────────────────────────────────────────────────
IPA_PATH="$EXPORT_DIR/App.ipa"

if [ ! -f "$IPA_PATH" ]; then
  # Fallback: check for .ipa in export dir subfolder
  IPA_PATH=$(find "$EXPORT_DIR" -name "*.ipa" -type f | head -1)
fi

if [ -n "$IPA_PATH" ] && [ -f "$IPA_PATH" ]; then
  echo ""
  echo "✅ IPA built successfully!"
  echo "   📦 $IPA_PATH"

  SIZE_BYTES=$(stat -f%z "$IPA_PATH" 2>/dev/null || stat -c%s "$IPA_PATH" 2>/dev/null)
  SIZE_MB=$(echo "scale=1; $SIZE_BYTES / 1024 / 1024" | bc)
  echo "   📏 ${SIZE_MB} MB"

  # ─── Copy to public/downloads ──────────────────────────────────────────────
  DOWNLOADS_DIR="$PROJECT_ROOT/public/downloads"
  if [ ! -d "$DOWNLOADS_DIR" ]; then
    mkdir -p "$DOWNLOADS_DIR"
  fi

  DEST_PATH="$DOWNLOADS_DIR/resurgo-latest.ipa"
  cp "$IPA_PATH" "$DEST_PATH"

  echo ""
  echo "🚀 IPA copied to: $DEST_PATH"
  echo ""
  echo "Next steps:"
  echo "  1. Upload to App Store Connect using Transporter (Mac App Store)"
  echo "  2. Or upload via Xcode Organizer"
  echo "  3. For TestFlight: App Store Connect → TestFlight tab"
  echo ""
else
  echo ""
  echo "❌ IPA not found in expected location: $IPA_PATH"
  echo "   Check Xcode export logs for errors."
  exit 1
fi
