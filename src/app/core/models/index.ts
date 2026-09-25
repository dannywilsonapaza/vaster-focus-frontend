export interface Goal {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SessionType = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';
export type SessionStatus = 'COMPLETED' | 'ABANDONED' | 'CANCELLED';

export interface SessionGoal {
  id: string;
  sessionId: string;
  goalId: string;
  goal?: Goal;
}

export interface Session {
  id: string;
  userId: string;
  type: SessionType;
  status: SessionStatus;
  targetSeconds: number;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
  goals?: SessionGoal[];
  createdAt: string;
}

export interface CreateSessionDto {
  type: SessionType;
  status: SessionStatus;
  targetSeconds: number;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
  goalIds?: string[];
}

export interface DailyStat {
  studyDay: string;
  totalSeconds: number;
  breakSeconds: number;
  sessionCount: number;
}

export interface StatsSummary {
  totalWorkSeconds: number;
  totalBreakSeconds: number;
  totalSessions: number;
  currentStreak: number;
  bestStreak: number;
  studiedToday: boolean;
}

export * from './background.model';
