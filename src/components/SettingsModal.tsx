// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Settings Modal Component
// App settings, data export, and profile management
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAscendStore } from '@/lib/store';
import { exportToJSON, exportToPDF, importFromJSON, clearAllData } from '@/lib/export';
import { cn } from '@/lib/utils';
import { 
  X, 
  Download, 
  Upload, 
  FileJson, 
  FileText, 
  Trash2, 
  User,
  AlertTriangle,
  Loader2,
  LogOut,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NotificationSettings } from './NotificationSettings';
import { areSoundsEnabled, toggleSounds, playSound, initializeSounds } from '@/lib/sounds';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, habits, habitEntries, goals, addToast, logout, updateNotificationSettings } = useAscendStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'data' | 'danger'>('profile');
  const [isExporting, setIsExporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;
  
  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      exportToJSON({
        user,
        habits,
        habitEntries,
        goals,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      });
      addToast({
        type: 'success',
        title: 'Export Complete!',
        message: 'Your data has been downloaded as JSON',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'There was an error exporting your data',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(user, habits, goals, habitEntries);
      addToast({
        type: 'success',
        title: 'PDF Generated!',
        message: 'Your progress report has been downloaded',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'There was an error generating the PDF',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const data = await importFromJSON(file);
      if (data) {
        // For now, just show success - full restore would require store methods
        addToast({
          type: 'success',
          title: 'Import Validated',
          message: 'Backup file is valid. Please restart the app to apply changes.',
        });
        // Store in localStorage directly
        localStorage.setItem('ascend-store-backup', JSON.stringify(data));
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Import Failed',
        message: error instanceof Error ? error.message : 'Invalid backup file',
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleReset = async () => {
    // Show toast first
    addToast({
      type: 'warning',
      title: 'Clearing All Data',
      message: 'Please wait...',
    });
    
    try {
      // Clear all data and wait for it to complete
      await clearAllData();
      
      // Force a hard reload to reset all in-memory state
      window.location.href = window.location.origin + window.location.pathname;
    } catch {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: 'Could not clear data. Please try again.',
      });
    }
  };

  const handleLogout = () => {
    // Call store logout to clear all data
    logout();
    
    addToast({
      type: 'success',
      title: 'Logged Out',
      message: 'Redirecting to landing page...',
    });
    
    // Force reload to reset app state completely
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-lg max-h-[90vh] glass-card p-0 overflow-hidden animate-scale-in flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 id="settings-title" className="text-xl font-bold text-themed">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            title="Close settings"
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors
                     min-w-[44px] min-h-[44px] flex items-center justify-center
                     focus-visible:ring-2 focus-visible:ring-ascend-500"
          >
            <X className="w-5 h-5 text-themed-muted" aria-hidden="true" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]" role="tablist" aria-label="Settings sections">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'data', label: 'Data', icon: Download },
            { id: 'danger', label: 'Danger', icon: AlertTriangle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors min-h-[48px]",
                "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ascend-500",
                activeTab === tab.id
                  ? "text-ascend-500 border-b-2 border-ascend-500"
                  : "text-themed-muted hover:text-themed"
              )}
            >
              <tab.icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[60vh]">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 
                              flex items-center justify-center text-2xl font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-themed">{user.name || 'Riser'}</h3>
                  <p className="text-themed-muted text-sm">Level {user.gamification?.level || 1}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--surface)]">
                  <p className="text-xs text-themed-muted mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-ascend-500">{user.gamification?.totalXP || 0}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--surface)]">
                    <p className="text-xs text-themed-muted mb-1">Current Streak</p>
                    <p className="text-xl font-bold text-themed">{user.stats?.currentStreak || 0} days</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface)]">
                    <p className="text-xs text-themed-muted mb-1">Best Streak</p>
                    <p className="text-xl font-bold text-themed">{user.stats?.longestStreak || 0} days</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--surface)]">
                    <p className="text-xs text-themed-muted mb-1">Active Habits</p>
                    <p className="text-xl font-bold text-themed">{habits.filter(h => h.isActive).length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface)]">
                    <p className="text-xs text-themed-muted mb-1">Active Goals</p>
                    <p className="text-xl font-bold text-themed">{goals.filter(g => g.status === 'in_progress').length}</p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-xl 
                           border border-[var(--border)] hover:bg-[var(--surface-hover)] 
                           transition-colors text-themed-secondary hover:text-themed"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Sound Effects Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide">Sound Effects</h3>
                <SoundToggle addToast={addToast} />
              </div>

              <div className="h-px bg-[var(--border)]" />

              {/* Push Notifications Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-themed uppercase tracking-wide">Push Notifications</h3>
                <p className="text-themed-secondary text-sm">
                  Configure reminders to stay on track.
                </p>
                <NotificationSettings
                  morningTime={user.preferences?.notifications?.morningReminder || '07:00'}
                  eveningTime={user.preferences?.notifications?.eveningReminder || '21:00'}
                  streakWarning={user.preferences?.notifications?.streakAtRisk ?? true}
                  quietHoursEnabled={user.preferences?.notifications?.quietHoursEnabled ?? true}
                  quietHoursStart={user.preferences?.notifications?.quietHoursStart || '22:00'}
                  quietHoursEnd={user.preferences?.notifications?.quietHoursEnd || '06:00'}
                  intelligenceLevel={user.preferences?.notifications?.intelligenceLevel || 'balanced'}
                  personalizationMode={user.preferences?.notifications?.personalizationMode || 'auto'}
                  scheduleProfile={user.profile?.workSchedule}
                  onMorningTimeChange={(time) => {
                    updateNotificationSettings({ morningReminder: time });
                    addToast({ type: 'success', title: 'Updated', message: `Morning reminder set to ${time}` });
                  }}
                  onEveningTimeChange={(time) => {
                    updateNotificationSettings({ eveningReminder: time });
                    addToast({ type: 'success', title: 'Updated', message: `Evening reminder set to ${time}` });
                  }}
                  onStreakWarningChange={(enabled) => {
                    updateNotificationSettings({ streakAtRisk: enabled });
                    addToast({ type: 'success', title: 'Updated', message: `Streak warning ${enabled ? 'enabled' : 'disabled'}` });
                  }}
                  onQuietHoursEnabledChange={(enabled) => {
                    updateNotificationSettings({ quietHoursEnabled: enabled });
                    addToast({ type: 'success', title: 'Updated', message: `Quiet hours ${enabled ? 'enabled' : 'disabled'}` });
                  }}
                  onQuietHoursChange={(start, end) => {
                    updateNotificationSettings({ quietHoursStart: start, quietHoursEnd: end });
                    addToast({ type: 'success', title: 'Updated', message: `Quiet hours set to ${start} - ${end}` });
                  }}
                  onIntelligenceLevelChange={(level) => {
                    updateNotificationSettings({ intelligenceLevel: level });
                    addToast({ type: 'success', title: 'Updated', message: `Notification intelligence set to ${level}` });
                  }}
                  onPersonalizationModeChange={(mode) => {
                    updateNotificationSettings({ personalizationMode: mode });
                    addToast({ type: 'success', title: 'Updated', message: `Personalization mode set to ${mode}` });
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <p className="text-themed-secondary text-sm mb-4">
                Export your data as a backup or generate a progress report.
              </p>
              
              <button
                onClick={handleExportJSON}
                disabled={isExporting}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] 
                         hover:bg-[var(--surface-hover)] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileJson className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-themed">Export as JSON</p>
                  <p className="text-xs text-themed-muted">Full backup of all your data</p>
                </div>
                {isExporting ? (
                  <Loader2 className="w-5 h-5 text-themed-muted animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-themed-muted" />
                )}
              </button>
              
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] 
                         hover:bg-[var(--surface-hover)] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-themed">Export as PDF</p>
                  <p className="text-xs text-themed-muted">Generate a progress report</p>
                </div>
                {isExporting ? (
                  <Loader2 className="w-5 h-5 text-themed-muted animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-themed-muted" />
                )}
              </button>
              
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  aria-label="Import backup file"
                  title="Import backup file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-full flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] 
                             hover:bg-[var(--surface-hover)] transition-colors text-left cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-themed">Import Backup</p>
                    <p className="text-xs text-themed-muted">Restore from a JSON backup</p>
                  </div>
                  <Upload className="w-5 h-5 text-themed-muted" />
                </div>
              </div>
            </div>
          )}
          
          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-500">Warning</p>
                    <p className="text-sm text-themed-secondary mt-1">
                      These actions are irreversible. Make sure to export your data before proceeding.
                    </p>
                  </div>
                </div>
              </div>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] 
                           border border-red-500/30 hover:bg-red-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-red-500">Reset All Data</p>
                    <p className="text-xs text-themed-muted">Delete all habits, goals, and progress</p>
                  </div>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-red-500 font-medium mb-3">Are you absolutely sure?</p>
                  <p className="text-themed-secondary text-sm mb-4">
                    This will permanently delete all your data including habits, goals, progress, and achievements.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 rounded-lg bg-[var(--surface)] text-themed font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium"
                    >
                      Yes, Delete Everything
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SOUND TOGGLE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface SoundToggleProps {
  addToast: (toast: { type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string }) => void;
}

function SoundToggle({ addToast }: SoundToggleProps) {
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // Initialize sounds and get current state on mount
  useEffect(() => {
    initializeSounds();
    setSoundsEnabled(areSoundsEnabled());
  }, []);

  const handleToggle = () => {
    const newState = toggleSounds();
    setSoundsEnabled(newState);
    
    // Play a sample sound when turning on
    if (newState) {
      setTimeout(() => playSound('success'), 100);
    }
    
    addToast({
      type: 'success',
      title: newState ? 'Sounds Enabled' : 'Sounds Disabled',
      message: newState ? 'You\'ll hear audio feedback for actions' : 'Sound effects are now muted',
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] 
               hover:bg-[var(--surface-hover)] transition-colors text-left"
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
        soundsEnabled ? "bg-ascend-500/20" : "bg-[var(--border)]"
      )}>
        {soundsEnabled ? (
          <Volume2 className="w-5 h-5 text-ascend-500" />
        ) : (
          <VolumeX className="w-5 h-5 text-themed-muted" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-themed">Sound Effects</p>
        <p className="text-xs text-themed-muted">
          {soundsEnabled ? 'Celebration sounds are on' : 'Sound effects are muted'}
        </p>
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full p-1 transition-colors",
        soundsEnabled ? "bg-ascend-500" : "bg-[var(--border)]"
      )}>
        <div className={cn(
          "w-5 h-5 rounded-full bg-white shadow-md transition-transform",
          soundsEnabled ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </button>
  );
}
