// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Team Collaboration & Shared Workspaces
// Real-time collaboration, team analytics, shared goals, accountability partners
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// TEAM MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export type TeamRole = 'admin' | 'manager' | 'coach' | 'member';
export type CollaborationType = 'shared-goal' | 'accountability-pair' | 'team-project' | 'mastermind-group';

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: TeamRole;
  joinedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  avatar: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  settings: {
    isPublic: boolean;
    allowInvites: boolean;
    requireApproval: boolean;
    defaultRole: TeamRole;
    maxMembers: number;
  };
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  invitedBy: string;
  invitedEmail: string;
  role: TeamRole;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED GOALS & ACCOUNTABILITY
// ─────────────────────────────────────────────────────────────────────────────

export interface SharedGoal {
  id: string;
  teamId: string;
  title: string;
  description: string;
  type: 'team-goal' | 'collaborative' | 'sequential';
  owner: string;
  members: string[]; // User IDs
  milestones: Milestone[];
  startDate: Date;
  dueDate: Date;
  status: 'planning' | 'active' | 'completed' | 'paused';
  visibility: 'private' | 'team' | 'public';
  progress: number; // 0-100
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completedBy: string[];
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  completedAt?: Date;
  owner: string;
}

export interface AccountabilityPair {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'ended';
  checkInFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextCheckIn: Date;
  checkIns: CheckIn[];
  rules: {
    shareGoals: boolean;
    shareMilestones: boolean;
    shareProgress: boolean;
    shareStruggle: boolean; // Can share difficulties
  };
}

export interface CheckIn {
  id: string;
  pairId: string;
  userId: string;
  partnerUserId: string;
  timestamp: Date;
  progressUpdate: string;
  challenges: string[];
  wins: string[];
  supportNeeded: string;
  feedback: string;
  sentimentScore: number; // 1-5
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM ANALYTICS & INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamAnalytics {
  teamId: string;
  period: 'day' | 'week' | 'month';
  metrics: {
    totalMembers: number;
    activeMembers: number;
    completionRate: number; // Team goal completion %
    averageProductivity: number; // 0-100
    engagementScore: number; // 0-100
    teamMorale: number; // 1-10 sentiment score
  };
  memberMetrics: Array<{
    userId: string;
    tasksCompleted: number;
    goalsProgress: number;
    contributionScore: number;
    engagementLevel: 'high' | 'medium' | 'low';
  }>;
  trends: {
    productivity: number[]; // Daily trend
    engagement: number[]; // Daily trend
    completionRate: number[]; // Daily trend
  };
  insights: string[];
}

export interface MastermindGroup {
  id: string;
  name: string;
  description: string;
  facilitatorId: string;
  members: TeamMember[];
  maxMembers: number;
  cadence: 'weekly' | 'biweekly' | 'monthly';
  meetings: MastermindMeeting[];
  createdAt: Date;
  focusAreas: string[]; // e.g., "product-launch", "team-scaling", "marketing"
}

export interface MastermindMeeting {
  id: string;
  groupId: string;
  scheduledAt: Date;
  duration: number; // minutes
  facilitator: string;
  agenda: string;
  notes: string;
  recordings: Array<{
    url: string;
    type: 'video' | 'audio';
    transcription?: string;
  }>;
  attendees: Array<{
    userId: string;
    attended: boolean;
    contributionScore: number;
  }>;
  actionItems: Array<{
    owner: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'completed';
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL-TIME COLLABORATION
// ─────────────────────────────────────────────────────────────────────────────

export interface CollaborativeDocument {
  id: string;
  teamId: string;
  title: string;
  type: 'braindump' | 'strategy' | 'notes' | 'planning';
  owner: string;
  editors: string[];
  viewers: string[];
  content: string;
  version: number;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  createdAt: Date;
}

export interface CollaborativeEdit {
  id: string;
  documentId: string;
  userId: string;
  timestamp: Date;
  operation: 'insert' | 'delete' | 'replace';
  position: number;
  content: string;
  version: number;
}

export interface RealtimePresence {
  userId: string;
  documentId: string;
  cursorPosition: number;
  selectionStart?: number;
  selectionEnd?: number;
  isActive: boolean;
  lastUpdate: Date;
  color: string; // For cursor color
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM COMMUNICATION
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamChannel {
  id: string;
  teamId: string;
  name: string;
  description: string;
  type: 'general' | 'wins' | 'struggles' | 'announcements' | 'feedback' | 'random';
  isPrivate: boolean;
  members: string[]; // User IDs
  createdAt: Date;
  settings: {
    allowThreads: boolean;
    allowEmojis: boolean;
    allowGifs: boolean;
  };
}

export interface TeamMessage {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  timestamp: Date;
  editedAt?: Date;
  reactions: Map<string, string[]>; // emoji -> [userIds]
  replies: TeamMessage[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  mentions: string[]; // User IDs mentioned
}

export interface DirectMessage {
  id: string;
  participantIds: [string, string];
  messages: Array<{
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
    readAt?: Date;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM PERMISSIONS & ROLES
// ─────────────────────────────────────────────────────────────────────────────

export const TEAM_ROLE_PERMISSIONS: Record<TeamRole, string[]> = {
  admin: [
    'manage-members',
    'manage-roles',
    'create-goals',
    'edit-all-goals',
    'delete-goals',
    'manage-channels',
    'manage-settings',
    'view-analytics',
    'export-data',
    'dissolve-team',
  ],
  manager: [
    'manage-members',
    'create-goals',
    'edit-team-goals',
    'manage-channels',
    'view-analytics',
    'export-data',
  ],
  coach: [
    'create-goals',
    'edit-own-goals',
    'view-analytics',
    'provide-feedback',
  ],
  member: [
    'create-goals',
    'edit-own-goals',
    'join-shared-goals',
    'provide-feedback',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEAM NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export type TeamNotificationType =
  | 'member-joined'
  | 'goal-shared'
  | 'milestone-completed'
  | 'checkpoint-reminder'
  | 'team-achievement'
  | 'message'
  | 'mention'
  | 'feedback-received'
  | 'accountability-due';

export interface TeamNotification {
  id: string;
  recipientId: string;
  type: TeamNotificationType;
  teamId?: string;
  relatedUserId?: string;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM GAMIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'members-milestone' | 'goals-completed' | 'engagement-streak' | 'collective-impact';
    threshold: number;
  };
  pointsReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const TEAM_ACHIEVEMENTS: TeamAchievement[] = [
  {
    id: 'founding-team',
    name: 'Founding Team',
    description: 'Be one of the first 5 members',
    icon: '🏗️',
    requirement: { type: 'members-milestone', threshold: 5 },
    pointsReward: 500,
    rarity: 'epic',
  },
  {
    id: 'goal-sync',
    name: 'Perfect Sync',
    description: 'Complete a shared goal with 100% team participation',
    icon: '🎯',
    requirement: { type: 'goals-completed', threshold: 1 },
    pointsReward: 250,
    rarity: 'rare',
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Complete 10 team goals in a month',
    icon: '🚀',
    requirement: { type: 'goals-completed', threshold: 10 },
    pointsReward: 1000,
    rarity: 'epic',
  },
  {
    id: 'together-strong',
    name: 'Together We Rise',
    description: 'Team reaches 100 combined milestones',
    icon: '🌟',
    requirement: { type: 'collective-impact', threshold: 100 },
    pointsReward: 2000,
    rarity: 'legendary',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEAM PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamPreferences {
  teamId: string;
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    slackIntegration: boolean;
    discordIntegration: boolean;
  };
  privacySettings: {
    shareProgressPublicly: boolean;
    allowMemberDiscovery: boolean;
    showInLeaderboards: boolean;
  };
  workspaceSettings: {
    timezone: string;
    language: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    weekStartsOn: 'monday' | 'sunday';
  };
}
