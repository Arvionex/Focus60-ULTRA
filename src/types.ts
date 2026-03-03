export interface Session {
  id: string;
  timestamp: number;
  duration: number; // in seconds
  mode: string;
  xpEarned: number;
  isTraderMode: boolean;
  focusId?: string;
  focusName?: string;
}

export interface FocusTask {
  id: string;
  name: string;
  category: 'Trading' | 'Skill Development' | 'Study' | 'Mind & Discipline' | 'Health & Fitness' | 'Custom';
  sessions: number;
  totalMinutes: number;
  xp: number;
  isFavorite: boolean;
  isCompleted: boolean;
}

export interface UserStats {
  totalSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  bestStreak: number;
  xp: number;
  level: number;
  lastSessionDate: string | null;
  history: Session[];
  focusTasks: FocusTask[];
  lifetimeSessions: number;
}

export type TimerMode = '1m' | '5m' | '15m' | 'custom';
export type Category = FocusTask['category'] | 'All';
