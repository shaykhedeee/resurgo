'use client';

import { useState } from 'react';
import { QuickStartStep2 } from './QuickStartStep2';
import { QuickStartPlannerStep } from './QuickStartPlannerStep';
import { QuickStartFormAndAnalysisStep } from './QuickStartFormAndAnalysisStep';

export type Archetype = 'adhd' | 'ambitious' | 'student' | 'athlete' | 'other';

export interface QuickStartFlowState {
  step: 1 | 2 | 3;
  brainDump: string;
  parsedData: {
    goals: string[];
    blockers: string[];
    energy: number;
    timeAvailable: string;
    suggestedGoals: string[];
    suggestedHabits: Array<{ title: string; frequency: string; domain: string }>;
    suggestedTasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
    archetype: string;
  } | null;
  plannerSelections: {
    goals: string[];
    habits: Array<{ title: string; frequency: string; domain: string }>;
    tasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
  } | null;
}

export function QuickStartFlow() {
  const [state, setState] = useState<QuickStartFlowState>({
    step: 1,
    brainDump: '',
    parsedData: null,
    plannerSelections: null,
  });

  const handleStep1Complete = (
    brainDump: string,
    parsedData: QuickStartFlowState['parsedData']
  ) => {
    setState((prev) => ({
      ...prev,
      brainDump,
      parsedData,
      step: 2,
    }));
  };

  const handleStep2Complete = (selected: {
    goals: string[];
    habits: Array<{ title: string; frequency: string; domain: string }>;
    tasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
  }) => {
    setState((prev) => ({
      ...prev,
      plannerSelections: selected,
      step: 3,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {state.step === 1 && (
          <QuickStartStep2
            onComplete={handleStep1Complete}
          />
        )}
        {state.step === 2 && state.parsedData && (
          <QuickStartPlannerStep
            parsedData={state.parsedData}
            onComplete={handleStep2Complete}
          />
        )}
        {state.step === 3 && state.plannerSelections && (
          <QuickStartFormAndAnalysisStep
            brainDump={state.brainDump}
            parsedData={state.parsedData}
            plannerSelections={state.plannerSelections}
            detectedArchetypeRaw={state.parsedData?.archetype}
          />
        )}
      </div>
    </div>
  );
}
