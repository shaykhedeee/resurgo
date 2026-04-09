'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// WidgetGrid — drag-and-drop sortable grid that wraps all dashboard widgets
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback } from 'react';
import DraggableWidget from './DraggableWidget';
import type { LayoutEntry } from '@/lib/dashboard/widgetRegistry';
import type { ReactElement } from 'react';

// ── Widget component map (lazy-resolved via string id) ──
import FocusTimerWidget from '@/components/widgets/FocusTimerWidget';
import HabitStreakWidget from '@/components/widgets/HabitStreakWidget';
import AICoachWidget from '@/components/widgets/AICoachWidget';
import QuickJournalWidget from '@/components/widgets/QuickJournalWidget';
import GoalProgressWidget from '@/components/widgets/GoalProgressWidget';
import CalorieTrackerWidget from '@/components/widgets/CalorieTrackerWidget';
import DigitalClockWidget from '@/components/widgets/DigitalClockWidget';
import QuickTaskWidget from '@/components/widgets/QuickTaskWidget';
import QuickNoteWidget from '@/components/widgets/QuickNoteWidget';
import SleepWidget from '@/components/widgets/SleepWidget';
import QuickActionsWidget from '@/components/widgets/QuickActionsWidget';
import VisionBoardWidget from '@/components/widgets/VisionBoardWidget';
import WaterTrackingWidget from '@/components/widgets/WaterTrackingWidget';
import XPStatusWidget from '@/components/widgets/XPStatusWidget';
import ActivityFeedWidget from '@/components/widgets/ActivityFeedWidget';
import StreakHeatmapWidget from '@/components/widgets/StreakHeatmapWidget';
import XPLeaderboardWidget from '@/components/widgets/XPLeaderboardWidget';

const WIDGET_COMPONENTS: Record<string, () => ReactElement> = {
  'focus-timer':     () => <FocusTimerWidget />,
  'habit-streak':    () => <HabitStreakWidget />,
  'ai-coach':        () => <AICoachWidget />,
  'quick-journal':   () => <QuickJournalWidget />,
  'goal-progress':   () => <GoalProgressWidget />,
  'calorie-tracker': () => <CalorieTrackerWidget />,
  'digital-clock':   () => <DigitalClockWidget />,
  'quick-task':      () => <QuickTaskWidget />,
  'quick-note':      () => <QuickNoteWidget />,
  'sleep':           () => <SleepWidget />,
  'quick-actions':   () => <QuickActionsWidget />,
  'vision-board':    () => <VisionBoardWidget />,
  'water-tracker':   () => <WaterTrackingWidget />,
  'xp-status':       () => <XPStatusWidget />,
  'activity-feed':   () => <ActivityFeedWidget />,
  'streak-heatmap':  () => <StreakHeatmapWidget />,
  'xp-leaderboard':  () => <XPLeaderboardWidget />,
};

interface WidgetGridProps {
  layout: LayoutEntry[];
  editMode: boolean;
  onReorder: (layout: LayoutEntry[]) => void;
  onHide: (id: string) => void;
}

export default function WidgetGrid({ layout, editMode, onReorder, onHide }: WidgetGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const visibleWidgets = layout.filter((e) => e.visible);
  const ids = visibleWidgets.map((e) => e.id);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = visibleWidgets.findIndex((e) => e.id === active.id);
      const newIndex = visibleWidgets.findIndex((e) => e.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      // Reorder visible items
      const reordered = [...visibleWidgets];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      // Rebuild full layout preserving hidden items at their positions
      const newLayout = reordered.map((entry, i) => ({ ...entry, order: i }));
      // Append hidden entries keeping their original order offset
      const hidden = layout.filter((e) => !e.visible);
      const fullLayout = [...newLayout, ...hidden.map((e, i) => ({ ...e, order: newLayout.length + i }))];

      onReorder(fullLayout);
    },
    [layout, visibleWidgets, onReorder],
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className="grid gap-4 md:grid-cols-3">
          {visibleWidgets.map((entry) => {
            const render = WIDGET_COMPONENTS[entry.id];
            if (!render) return null;
            return (
              <DraggableWidget key={entry.id} id={entry.id} editMode={editMode} onHide={onHide}>
                {render()}
              </DraggableWidget>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
