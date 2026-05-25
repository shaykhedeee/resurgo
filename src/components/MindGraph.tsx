'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Obsidian-style Mind Graph Component
// Interactive retro-cyberpunk personal knowledge graph
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Eye, Network, Link2, Sparkles, Database, Plus, RefreshCw } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'goal' | 'habit' | 'task' | 'reflection';
  x: number;
  y: number;
  status: string;
  details: string;
}

interface Edge {
  source: string;
  target: string;
  label?: string;
}

const INITIAL_NODES: Node[] = [
  { id: '1', label: 'Forge $10k/mo Indie Portfolio', type: 'goal', x: 250, y: 120, status: 'in_progress', details: 'Core professional objective compounding all micro-actions.' },
  { id: '2', label: 'Write 500 Words Copy Daily', type: 'habit', x: 120, y: 220, status: 'active', details: 'Supporting habit stacked with morning coffee.' },
  { id: '3', label: 'Push Commit to Production', type: 'task', x: 220, y: 260, status: 'todo', details: 'Immediate micro-sprint task for product acceleration.' },
  { id: '4', label: 'Optimize Morning Light Intake', type: 'habit', x: 380, y: 210, status: 'active', details: 'Aurora somatic optimization to increase baseline focus.' },
  { id: '5', label: '10-Min Evening Reflection', type: 'reflection', x: 290, y: 340, status: 'done', details: 'Cognitive debrief and identity affirmation.' },
  { id: '6', label: 'Achieve 85+ Daily Synergy Score', type: 'goal', x: 450, y: 320, status: 'completed', details: 'Wellness and performance consistency benchmark.' },
];

const INITIAL_EDGES: Edge[] = [
  { source: '1', target: '2', label: 'habit_stack' },
  { source: '1', target: '3', label: 'sprint_task' },
  { source: '1', target: '4', label: 'neuro_anchor' },
  { source: '2', target: '5', label: 'debrief_connection' },
  { source: '4', target: '5', label: 'somatic_link' },
  { source: '6', target: '4', label: 'wellness_foundation' },
];

export default function MindGraph() {
  const liveGoals = useQuery(api.goals.listActive);
  const liveHabits = useQuery(api.habits.listActive);
  const liveTasks = useQuery(api.tasks.list, { status: 'todo' });

  const [customPositions, setCustomPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [connectingNode, setConnectingNode] = useState<string | null>(null);

  // Dynamic layout generator using live user database logs
  const nodes = useMemo(() => {
    if (liveGoals === undefined && liveHabits === undefined && liveTasks === undefined) {
      return INITIAL_NODES;
    }

    const listGoals = liveGoals || [];
    const listHabits = liveHabits || [];
    const listTasks = liveTasks || [];

    const mappedNodes: Node[] = [];
    const centerWidth = 330;
    const centerHeight = 180;

    // 1. Position Goals in an inner orbit
    listGoals.forEach((goal, i) => {
      const angle = (i * 2 * Math.PI) / Math.max(1, listGoals.length);
      const radius = 90;
      const nodeId = `goal_${goal._id}`;
      const custom = customPositions[nodeId];
      const x = custom ? custom.x : (centerWidth + Math.cos(angle) * radius);
      const y = custom ? custom.y : (centerHeight + Math.sin(angle) * radius);

      mappedNodes.push({
        id: nodeId,
        label: goal.title,
        type: 'goal',
        x,
        y,
        status: goal.status,
        details: goal.description || `Active Goal in category: ${goal.category}. Progress: ${goal.progress}%`,
      });
    });

    // 2. Position Habits clustered near their respective Goal or in their own ring
    listHabits.forEach((habit, i) => {
      const nodeId = `habit_${habit._id}`;
      const custom = customPositions[nodeId];
      let x = custom ? custom.x : 0;
      let y = custom ? custom.y : 0;

      if (!custom) {
        if (habit.goalId) {
          const goalNode = mappedNodes.find(n => n.id === `goal_${habit.goalId}`);
          if (goalNode) {
            const angle = (i * 2 * Math.PI) / Math.max(1, listHabits.length) + 0.5;
            x = goalNode.x + Math.cos(angle) * 55;
            y = goalNode.y + Math.sin(angle) * 55;
          } else {
            x = 80 + (i * 70) % 200;
            y = 70 + (i * 85) % 200;
          }
        } else {
          const angle = (i * 2 * Math.PI) / Math.max(1, listHabits.length);
          x = centerWidth + Math.cos(angle) * 170;
          y = centerHeight + Math.sin(angle) * 170;
        }
      }

      mappedNodes.push({
        id: nodeId,
        label: habit.title,
        type: 'habit',
        x,
        y,
        status: habit.isActive ? 'active' : 'inactive',
        details: habit.description || `Habit tracking in domain: ${habit.category}. Daily streak: ${habit.streakCurrent || 0}d.`,
      });
    });

    // 3. Position Tasks clustered near their respective Goal or in outer ring
    listTasks.forEach((task, i) => {
      const nodeId = `task_${task._id}`;
      const custom = customPositions[nodeId];
      let x = custom ? custom.x : 0;
      let y = custom ? custom.y : 0;

      if (!custom) {
        if (task.goalId) {
          const goalNode = mappedNodes.find(n => n.id === `goal_${task.goalId}`);
          if (goalNode) {
            const angle = (i * 2 * Math.PI) / Math.max(1, listTasks.length) - 0.5;
            x = goalNode.x + Math.cos(angle) * 60;
            y = goalNode.y + Math.sin(angle) * 60;
          } else {
            x = 190 + (i * 80) % 220;
            y = 230 + (i * 65) % 180;
          }
        } else {
          const angle = (i * 2 * Math.PI) / Math.max(1, listTasks.length) + Math.PI / 4;
          x = centerWidth + Math.cos(angle) * 200;
          y = centerHeight + Math.sin(angle) * 200;
        }
      }

      mappedNodes.push({
        id: nodeId,
        label: task.title,
        type: 'task',
        x,
        y,
        status: task.status,
        details: task.description || `Immediate task queue action. Priority: ${task.priority}. XP value: ${task.xpValue ?? 10} XP.`,
      });
    });

    return mappedNodes.length > 0 ? mappedNodes : INITIAL_NODES;
  }, [liveGoals, liveHabits, liveTasks, customPositions]);

  const edges = useMemo(() => {
    if (liveGoals === undefined && liveHabits === undefined && liveTasks === undefined) {
      return INITIAL_EDGES;
    }

    const listGoals = liveGoals || [];
    const listHabits = liveHabits || [];
    const listTasks = liveTasks || [];

    const mappedEdges: Edge[] = [];

    // Connect tasks to goals
    listTasks.forEach((task) => {
      if (task.goalId) {
        mappedEdges.push({
          source: `goal_${task.goalId}`,
          target: `task_${task._id}`,
          label: 'sprint_task',
        });
      }
    });

    // Connect habits to goals
    listHabits.forEach((habit) => {
      if (habit.goalId) {
        mappedEdges.push({
          source: `goal_${habit.goalId}`,
          target: `habit_${habit._id}`,
          label: 'habit_stack',
        });
      }
      if (habit.afterHabitId) {
        mappedEdges.push({
          source: `habit_${habit.afterHabitId}`,
          target: `habit_${habit._id}`,
          label: 'chain_stacked',
        });
      }
    });

    return mappedEdges.length > 0 ? mappedEdges : INITIAL_EDGES;
  }, [liveGoals, liveHabits, liveTasks]);

  const handleNodeClick = (node: Node) => {
    if (connectingNode && connectingNode !== node.id) {
      alert(`Linked Node "${nodes.find(n => n.id === connectingNode)?.label}" to "${node.label}"!`);
      setConnectingNode(null);
    } else {
      setSelectedNode(node);
    }
  };

  const handleDrag = (id: string, clientX: number, clientY: number, container: HTMLDivElement | null) => {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, clientY - rect.top));
    setCustomPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  const filteredNodes = nodes.filter(n => filterType === 'all' || n.type === filterType);

  const colors = {
    goal: '#FF6B35',      // Neon orange
    habit: '#00FF41',     // Success green
    task: '#00D4FF',      // Info cyan
    reflection: '#A855F7', // Deep purple
  };

  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 p-6 rounded-[2px] font-mono shadow-[4px_4px_0px_rgba(0,0,0,0.85)] max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="border-b-2 border-zinc-800 pb-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-orange-500" />
            <h2 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">OBSIDIAN_MIND_GRAPH v1.0</h2>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-1">
            Visualizing linked actions, cognitive stack triggers & goal-habit dependencies.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'goal', 'habit', 'task', 'reflection'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-[9px] border transition-all ${
                filterType === type
                  ? 'border-orange-500 bg-orange-950/20 text-orange-400'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* GRAPH CANVAS & INFO SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTERACTIVE SVG CANVAS */}
        <div className="lg:col-span-2 relative border border-zinc-800 bg-black min-h-[400px]">
          <div className="absolute top-2 left-2 z-10 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400">
              <Database className="h-2.5 w-2.5" />
              NODES: {filteredNodes.length}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400">
              <Link2 className="h-2.5 w-2.5" />
              EDGES: {edges.length}
            </span>
          </div>

          <div 
            className="w-full h-full min-h-[400px] cursor-crosshair overflow-hidden"
            ref={el => {
              if (!el) return;
              el.onmousemove = (e) => {
                const draggedId = el.getAttribute('data-dragged');
                if (draggedId) {
                  handleDrag(draggedId, e.clientX, e.clientY, el);
                }
              };
              el.onmouseup = () => el.removeAttribute('data-dragged');
              el.onmouseleave = () => el.removeAttribute('data-dragged');
            }}
          >
            <svg className="w-full h-full min-h-[400px]">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#27272a" />
                </marker>
              </defs>

              {/* RENDER EDGES */}
              {edges.map((edge, i) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                return (
                  <g key={i}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#27272a"
                      strokeWidth="1.5"
                      strokeDasharray={edge.label === 'habit_stack' ? '4 4' : undefined}
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 4}
                      fill="#52525b"
                      fontSize="7"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {edge.label?.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* RENDER NODES */}
              {filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const nodeColor = colors[node.type];
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-grab active:cursor-grabbing group"
                    onMouseDown={(e) => {
                      const container = e.currentTarget.parentElement?.parentElement;
                      container?.setAttribute('data-dragged', node.id);
                    }}
                    onClick={() => handleNodeClick(node)}
                  >
                    {/* Outer Glow ring */}
                    <circle
                      r="12"
                      fill="transparent"
                      stroke={nodeColor}
                      strokeWidth="2"
                      className="opacity-0 group-hover:opacity-20 transition-opacity"
                    />
                    {/* Node Core */}
                    <circle
                      r={isSelected ? '7' : '5'}
                      fill={isSelected ? nodeColor : '#09090b'}
                      stroke={nodeColor}
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                    {/* Text Label */}
                    <text
                      y="-12"
                      fill={isSelected ? '#fafafa' : '#a1a1aa'}
                      fontSize="8"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                      className="select-none pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* DETAILS SIDEBAR */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between">
          <div>
            <span className="font-pixel text-[8px] tracking-[0.2em] text-zinc-500 uppercase block mb-3">
              :: NODE_INSPECTOR ::
            </span>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <span 
                    className="inline-block px-2 py-0.5 text-[8px] border text-xs tracking-wider font-bold mb-2 uppercase"
                    style={{ borderColor: colors[selectedNode.type], color: colors[selectedNode.type], backgroundColor: `${colors[selectedNode.type]}08` }}
                  >
                    {selectedNode.type}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-100">{selectedNode.label}</h3>
                </div>

                <div className="space-y-2 border-t border-zinc-900 pt-3">
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    {selectedNode.details}
                  </p>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest">
                    Status: <span className="text-zinc-300 font-bold">{selectedNode.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-zinc-900 pt-3">
                  <button
                    onClick={() => setConnectingNode(selectedNode.id)}
                    className="w-full border border-zinc-800 hover:border-zinc-700 bg-black text-[9px] py-1.5 text-zinc-400 hover:text-zinc-200 uppercase"
                  >
                    🔗 Link to another Node
                  </button>
                  <button
                    onClick={() => alert('Editing node info...')}
                    className="w-full border border-zinc-800 hover:border-zinc-700 bg-black text-[9px] py-1.5 text-zinc-400 hover:text-zinc-200 uppercase"
                  >
                    📝 Modify Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-600 space-y-2">
                <Eye className="h-8 w-8 mx-auto opacity-20" />
                <p className="text-[10px] uppercase tracking-wider">
                  No Node Selected
                </p>
                <p className="text-[9px] leading-relaxed text-zinc-700">
                  Select any visual node to inspect its stacked connections and properties.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-900 pt-4 mt-6">
            <button
              onClick={() => alert('New link creator initiated')}
              className="w-full bg-orange-600 hover:bg-orange-500 active:translate-y-px text-black text-[10px] font-bold py-2 px-3 flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#9a3412]"
            >
              <Plus className="h-3 w-3" />
              CREATE_NEW_RELATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
