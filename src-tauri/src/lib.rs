// ═══════════════════════════════════════════════════════════════════════════
// RESURGO Desktop — Tauri v2 Application Core
// ═══════════════════════════════════════════════════════════════════════════
//
// Architecture:
//   - Main window: wraps the Next.js frontend (cloud URL or localhost)
//   - System tray: quick access without opening the full window
//   - Keychain commands: securely store / retrieve BYOK AI provider keys
//   - Ollama health commands: check if a local agent endpoint is reachable
//   - Deep-link handler: resurgo:// scheme for auth callbacks etc.
//
// Custom Tauri commands exposed to the JS frontend:
//   store_secret(key, value)   → OS keychain / tauri-plugin-store encrypted
//   get_secret(key)            → retrieve secret by key
//   delete_secret(key)         → remove secret by key
//   list_secret_keys()         → list stored key names (no values)
//   probe_ollama(base_url)     → GET /api/tags, return reachable + model list
//   app_version()              → semver string from Cargo.toml
//   open_devtools()            → only in debug builds

use tauri::{
    AppHandle, Manager, Runtime, State,
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
    menu::{Menu, MenuItem},
};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

// ── State ─────────────────────────────────────────────────────────────────────

/// Persisted in tauri-plugin-store; this struct is only for runtime checks.
pub struct AppState {
    pub ollama_last_check: Mutex<Option<std::time::Instant>>,
}

// ── Keychain commands ─────────────────────────────────────────────────────────

/// Store a secret in the OS keychain.
/// key format: "resurgo/<provider>" e.g. "resurgo/groq"
#[tauri::command]
fn store_secret(key: String, value: String) -> Result<(), String> {
    let entry = keyring::Entry::new("resurgo", &key)
        .map_err(|e| format!("keyring create error: {e}"))?;
    entry.set_password(&value)
        .map_err(|e| format!("keyring set error: {e}"))
}

#[tauri::command]
fn get_secret(key: String) -> Result<Option<String>, String> {
    let entry = keyring::Entry::new("resurgo", &key)
        .map_err(|e| format!("keyring create error: {e}"))?;
    match entry.get_password() {
        Ok(val) => Ok(Some(val)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(format!("keyring get error: {e}")),
    }
}

#[tauri::command]
fn delete_secret(key: String) -> Result<(), String> {
    let entry = keyring::Entry::new("resurgo", &key)
        .map_err(|e| format!("keyring create error: {e}"))?;
    match entry.delete_credential() {
        Ok(_) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(format!("keyring delete error: {e}")),
    }
}

/// Returns only key names — never values — so the frontend can show which
/// providers are configured without exposing raw secrets.
#[tauri::command]
fn list_secret_keys() -> Vec<String> {
    let providers = vec![
        "groq", "gemini", "openrouter", "cerebras", "together", "aiml", "openai",
        "ollama_url", "lmstudio_url", "custom_url",
    ];
    providers
        .into_iter()
        .filter(|k| {
            keyring::Entry::new("resurgo", k)
                .ok()
                .and_then(|e| e.get_password().ok())
                .is_some()
        })
        .map(|k| k.to_string())
        .collect()
}

// ── Local agent health probe ───────────────────────────────────────────────────

#[derive(Serialize)]
pub struct ProbeResult {
    reachable: bool,
    models: Vec<String>,
    error: Option<String>,
}

/// Probe an Ollama-compatible endpoint (GET /api/tags).
/// Used by the frontend to verify a local agent is running before routing AI
/// calls to it.
#[tauri::command]
async fn probe_ollama(base_url: String) -> ProbeResult {
    let url = format!("{}/api/tags", base_url.trim_end_matches('/'));
    match reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(3))
        .build()
    {
        Err(e) => ProbeResult {
            reachable: false,
            models: vec![],
            error: Some(format!("client build error: {e}")),
        },
        Ok(client) => match client.get(&url).send().await {
            Err(e) => ProbeResult {
                reachable: false,
                models: vec![],
                error: Some(e.to_string()),
            },
            Ok(resp) => {
                if resp.status().is_success() {
                    let models: Vec<String> = resp
                        .json::<serde_json::Value>()
                        .await
                        .ok()
                        .and_then(|v| v["models"].as_array().cloned())
                        .map(|arr| {
                            arr.iter()
                                .filter_map(|m| m["name"].as_str().map(|s| s.to_string()))
                                .collect()
                        })
                        .unwrap_or_default();
                    ProbeResult { reachable: true, models, error: None }
                } else {
                    ProbeResult {
                        reachable: false,
                        models: vec![],
                        error: Some(format!("HTTP {}", resp.status())),
                    }
                }
            }
        },
    }
}

// ── Misc commands ──────────────────────────────────────────────────────────────

#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
#[cfg(debug_assertions)]
fn open_devtools<R: Runtime>(app: AppHandle<R>) {
    if let Some(win) = app.get_webview_window("main") {
        win.open_devtools();
    }
}

// ── System tray ───────────────────────────────────────────────────────────────

fn setup_tray<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
    let quit = MenuItem::with_id(app, "quit", "Quit Resurgo", true, None::<&str>)?;
    let show = MenuItem::with_id(app, "show", "Open Resurgo", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => app.exit(0),
            "show" => {
                if let Some(win) = app.get_webview_window("main") {
                    let _ = win.show();
                    let _ = win.set_focus();
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                let app = tray.app_handle();
                if let Some(win) = app.get_webview_window("main") {
                    if win.is_visible().unwrap_or(false) {
                        let _ = win.hide();
                    } else {
                        let _ = win.show();
                        let _ = win.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

// ── Application entry point ────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, Some(vec![])))
        .manage(AppState {
            ollama_last_check: Mutex::new(None),
        })
        .setup(|app| {
            setup_tray(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            store_secret,
            get_secret,
            delete_secret,
            list_secret_keys,
            probe_ollama,
            app_version,
            #[cfg(debug_assertions)]
            open_devtools,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Resurgo desktop app");
}
