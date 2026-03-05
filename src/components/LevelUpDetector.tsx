'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Level-Up Detector
// Watches the Convex gamification profile and triggers celebration on level-up
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { LevelUpModal, ConfettiBurst } from '@/components/Toast';

// ── Level name map (mirrors convex/tasks.ts LEVEL_THRESHOLDS) ──
const LEVEL_NAMES: Record<number, string> = {
  1: 'Seedling', 2: 'Sprout', 3: 'Sapling', 4: 'Explorer',
  5: 'Pathfinder', 6: 'Wayfarer', 7: 'Trailblazer', 8: 'Achiever',
  9: 'Champion', 10: 'Vanguard', 11: 'Titan', 12: 'Legend',
  13: 'Mythic', 14: 'Transcendent', 15: 'Ascendant', 16: 'Eternal',
};

export default function LevelUpDetector() {
  const gamification = useQuery(api.gamification.getProfile);
  const prevLevelRef = useRef<number | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number; levelName: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!gamification || typeof gamification.level !== 'number') return;

    const currentLevel = gamification.level;

    // On first load, just record the level — don't celebrate
    if (prevLevelRef.current === null) {
      prevLevelRef.current = currentLevel;
      return;
    }

    // Detect level-up
    if (currentLevel > prevLevelRef.current) {
      const levelName = gamification.levelName || LEVEL_NAMES[currentLevel] || `Level ${currentLevel}`;
      setLevelUpData({ level: currentLevel, levelName });
      setShowConfetti(true);

      // Hide confetti after 4 seconds
      setTimeout(() => setShowConfetti(false), 4000);
    }

    prevLevelRef.current = currentLevel;
  }, [gamification]);

  const handleClose = useCallback(() => {
    setLevelUpData(null);
  }, []);

  return (
    <>
      {showConfetti && <ConfettiBurst />}
      {levelUpData && (
        <LevelUpModal
          level={levelUpData.level}
          levelName={levelUpData.levelName}
          onClose={handleClose}
        />
      )}
    </>
  );
}
