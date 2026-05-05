# Resurgo Desktop App — Multi-Platform Setup Guide

Built with **Tauri v2** — the fastest, smallest, most secure desktop shell available for web apps.  
Tauri v2 apps use the OS webview (WebKit on macOS, WebView2 on Windows) instead of bundling Chromium, resulting in:

- **Installer size:** ~8–15 MB (vs 100–200 MB for Electron)
- **RAM usage:** ~50–100 MB at idle
- **Startup time:** <1 second
- **Security:** Rust backend, OS-native keychain, strict capability model

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Tauri Desktop Shell (Rust)                              │
│  ┌─────────────────────────────────────────────────────┐│
│  │  Next.js Frontend (TypeScript / React)               ││
│  │  ┌───────────────────────────────────────────────── ││
│  │  │  CLOUD mode  →  /api/coach, /api/* (Convex+Clerk)││
│  │  │  LOCAL mode  →  Ollama / LM Studio (localhost)    ││
│  │  │  BYOK mode   →  User keys → Provider APIs         ││
│  │  │  HYBRID mode →  Local → BYOK → Cloud              ││
│  │  └───────────────────────────────────────────────────││
│  └─────────────────────────────────────────────────────┘│
│  Rust Commands: store_secret / get_secret / probe_ollama │
│  OS Keychain: macOS Keychain / Windows Credential Mgr    │
│  System Tray: Quick access + show/hide window            │
│  Auto-updater: Tauri updater plugin (GitHub Releases)    │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| Rust | 1.77+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Tauri CLI | 2.x | `cargo install tauri-cli` |
| **macOS only** | Xcode CLI Tools | `xcode-select --install` |
| **Windows only** | Microsoft C++ Build Tools + WebView2 | [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) |
| **Linux only** | WebKit2GTK + GTK3 | See below |

### Linux dependencies

```bash
# Ubuntu / Debian
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev \
  librsvg2-dev libssl-dev curl wget

# Arch Linux
sudo pacman -S webkit2gtk-4.1 gtk3 libayatana-appindicator librsvg openssl
```

---

## Development

### 1. Clone & install

```bash
git clone https://github.com/shaykhedeee/resurgo.git
cd resurgo
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# (These are only needed for cloud sync. Local AI mode works without them.)
```

### 3. Start desktop dev server

```bash
npm run dev:desktop
# Equivalent to: tauri dev
# This starts:
#   - Next.js dev server on localhost:3000
#   - Tauri window pointing at localhost:3000
#   - Hot reload on both Rust and Next.js changes
```

---

## Building Installers

### All platforms

```bash
npm run desktop
# Equivalent to: tauri build
# Output: src-tauri/target/release/bundle/
```

### Platform-specific outputs

| Platform | Output |
|----------|--------|
| macOS | `Resurgo.app`, `resurgo.dmg`, `resurgo.tar.gz` |
| Windows | `resurgo_setup.exe` (NSIS), `resurgo.msi` (WiX) |
| Linux | `resurgo.deb`, `resurgo.rpm`, `resurgo.AppImage` |

### Debug build (includes devtools)

```bash
npm run desktop:debug
```

---

## Local AI Setup (Offline Mode)

Users can configure the AI brain to run 100% locally — no internet or account needed for AI inference.

### Option A: Ollama (recommended)

1. Install Ollama: [https://ollama.ai](https://ollama.ai)
2. Pull a model: `ollama pull dolphin3` (or `mistral`, `llama3.2`, `qwen2.5`, etc.)
3. Start Ollama: `ollama serve` (or it auto-starts on install)
4. In Resurgo: Settings → AI → Policy: **Local Only** or **Hybrid**
5. The Ollama agent will be detected automatically at `http://localhost:11434`

### Option B: LM Studio

1. Install LM Studio: [https://lmstudio.ai](https://lmstudio.ai)
2. Download a model from the Discover tab
3. Start the local server (Local Server tab → Start Server)
4. In Resurgo: Settings → AI → Local Agents → LM Studio URL: `http://localhost:1234`

### Option C: Custom OpenAI-compatible server

Supports llama.cpp, vLLM, Jan.ai, Kobold.cpp, text-generation-webui, etc.

1. Start your server
2. In Resurgo: Settings → AI → Local Agents → Custom URL: `http://localhost:YOUR_PORT`

---

## BYOK (Bring Your Own Keys)

For cloud AI without going through Resurgo's servers:

1. Open Resurgo desktop app
2. Settings → AI → BYOK section
3. Enter your API key for any provider (Groq, Gemini, OpenRouter, Cerebras, etc.)
4. Key is saved to your **OS keychain** — never sent to Resurgo servers
5. Set Policy to **BYOK** or **Hybrid**

### Free tier keys

All of these have generous free tiers:
- **Groq**: 14,400 req/day free — [console.groq.com](https://console.groq.com/keys)
- **Gemini**: 1,500 req/day free — [aistudio.google.com](https://aistudio.google.com/app/apikey)
- **Cerebras**: Free — [cloud.cerebras.ai](https://cloud.cerebras.ai)
- **OpenRouter**: Free models available — [openrouter.ai](https://openrouter.ai/keys)
- **Together**: Free models available — [api.together.xyz](https://api.together.xyz/settings/api-keys)

---

## Auto-Updates

Resurgo uses the Tauri updater plugin to check for updates automatically.

Update endpoint: `https://resurgo.life/api/desktop/update/{{target}}/{{arch}}/{{current_version}}`

When a new release is published to GitHub Releases with the correct assets and signature, users get a native update dialog with one-click install.

### Signing releases

```bash
# Generate signing key pair (do once, save private key securely)
tauri signer generate -w ~/.tauri/resurgo.key

# Build and sign
TAURI_SIGNING_PRIVATE_KEY=$(cat ~/.tauri/resurgo.key) npm run desktop
```

Add the public key to `src-tauri/tauri.conf.json` → `plugins.updater.pubkey`.

---

## CI/CD — GitHub Actions

Create `.github/workflows/desktop.yml`:

```yaml
name: Desktop Build
on:
  push:
    tags: ['v*']

jobs:
  build-tauri:
    strategy:
      matrix:
        include:
          - platform: macos-latest
            args: '--target universal-apple-darwin'
          - platform: windows-latest
            args: ''
          - platform: ubuntu-22.04
            args: ''
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.platform == 'macos-latest' && 'aarch64-apple-darwin,x86_64-apple-darwin' || '' }}
      - name: Install Linux deps
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
      - run: npm install
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
          TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: 'Resurgo ${{ github.ref_name }}'
          releaseBody: 'Desktop release. See CHANGELOG for details.'
          releaseDraft: true
          args: ${{ matrix.args }}
```

---

## Key files

| File | Purpose |
|------|---------|
| `src-tauri/src/lib.rs` | Rust backend — keychain commands, Ollama probe, tray |
| `src-tauri/src/main.rs` | Entry point |
| `src-tauri/tauri.conf.json` | App config, bundle settings, updater |
| `src-tauri/capabilities/default.json` | Permission declarations |
| `src/lib/desktop/detect.ts` | Tauri environment detection |
| `src/lib/desktop/credentials.ts` | BYOK keychain store abstraction |
| `src/lib/desktop/local-agent.ts` | Ollama/LM Studio/custom connector |
| `src/lib/desktop/brain-router.ts` | Cloud/Local/BYOK/Hybrid routing policy |
| `src/hooks/useDesktopRuntime.ts` | React hook for desktop state |
| `src/components/desktop/DesktopAISettings.tsx` | Settings UI panel |

---

## Security model

- **API keys** are stored in the OS keychain (macOS Keychain, Windows Credential Manager, libsecret on Linux) — never in files or memory beyond the active session.
- **Tauri capabilities** are declared explicitly — no wildcard permissions.
- **Keychain access** is through the Tauri `store_secret` / `get_secret` commands, which are only callable from the app's own webview.
- **Local AI traffic** goes directly browser → localhost — never leaves the machine.
- **BYOK traffic** goes directly browser → provider API — never through Resurgo servers.
