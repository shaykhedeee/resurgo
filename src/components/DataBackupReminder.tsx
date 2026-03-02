// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Data Backup Reminder Component
// Prompts users to export their data periodically
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { Download, X, Shield, Calendar, Clock, CheckCircle } from 'lucide-react';

const BACKUP_REMINDER_KEY = 'ascend-last-backup-reminder';
const BACKUP_INTERVAL_DAYS = 14; // Remind every 2 weeks

interface DataBackupReminderProps {
  onExport: () => void;
  totalHabits: number;
  totalGoals: number;
  daysActive: number;
}

export function DataBackupReminder({
  onExport,
  totalHabits,
  totalGoals,
  daysActive,
}: DataBackupReminderProps) {
  const [show, setShow] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    // Check if we should show the reminder
    const checkReminder = () => {
      const lastReminderStr = localStorage.getItem(BACKUP_REMINDER_KEY);
      const lastReminder = lastReminderStr ? new Date(lastReminderStr) : null;
      
      // Only show if user has been active for at least 7 days
      if (daysActive < 7) return;

      // Show if never reminded or more than BACKUP_INTERVAL_DAYS since last reminder
      if (!lastReminder) {
        setShow(true);
        return;
      }

      const daysSinceReminder = Math.floor(
        (Date.now() - lastReminder.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceReminder >= BACKUP_INTERVAL_DAYS) {
        setShow(true);
      }

      setLastBackup(lastReminder);
    };

    // Delay check to not interrupt initial load
    const timer = setTimeout(checkReminder, 3000);
    return () => clearTimeout(timer);
  }, [daysActive]);

  const handleDismiss = () => {
    localStorage.setItem(BACKUP_REMINDER_KEY, new Date().toISOString());
    setShow(false);
  };

  const handleExport = () => {
    onExport();
    setExported(true);
    localStorage.setItem(BACKUP_REMINDER_KEY, new Date().toISOString());
    
    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
        {exported ? (
          // Success state
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-themed mb-2">Backup Created! 🎉</h3>
            <p className="text-themed-muted">Your data is now safely exported.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ascend-500 to-gold-400 
                              flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-themed">Protect Your Data</h3>
                  <p className="text-sm text-themed-muted">Regular backups keep your progress safe</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
                title="Dismiss"
                aria-label="Dismiss backup reminder"
              >
                <X className="w-5 h-5 text-themed-muted" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-[var(--border)]">
              <div className="text-center">
                <p className="text-2xl font-bold text-ascend-500">{totalHabits}</p>
                <p className="text-xs text-themed-muted">Habits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">{totalGoals}</p>
                <p className="text-xs text-themed-muted">Goals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{daysActive}</p>
                <p className="text-xs text-themed-muted">Days Active</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-themed-muted">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ascend-400" />
                <span>Your data is stored locally in this browser</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>
                  {lastBackup 
                    ? `Last backup: ${lastBackup.toLocaleDateString()}`
                    : "You haven't created a backup yet"
                  }
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 btn-secondary"
              >
                Remind Later
              </button>
              <button
                onClick={handleExport}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Now
              </button>
            </div>

            {/* Warning */}
            <p className="text-xs text-themed-muted text-center">
              💡 Clearing browser data will delete your habits. Export regularly!
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DataBackupReminder;
