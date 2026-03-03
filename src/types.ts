export interface Session {
  id: string;
  timestamp: number;
  duration: number; // in seconds
  focusName: string;
  timerMode: string;
}

export interface FocusTask {
  id: string;
  name: string;
  isFavorite: boolean;
  isCustom?: boolean;
}

export interface TimerMode {
  id: string;
  name: string;
  duration: number; // in minutes
  isCustom?: boolean;
  color?: string;
  soundType?: string;
}

export interface UserSettings {
  defaultTimerDuration: number;
  defaultBreakDuration: number;
  soundVolume: number;
  isSoundEnabled: boolean;
  isConfettiEnabled: boolean;
  isAutoStartEnabled: boolean;
  isTickEnabled: boolean;
  isDarkMode: boolean;
}

export interface UserStats {
  totalSessionsToday: number;
  totalMinutesToday: number;
  currentStreak: number;
  bestStreak: number;
  lastSessionDate: string | null;
  history: Session[];
  focusTasks: FocusTask[];
  customTimers: TimerMode[];
  settings: UserSettings;
}
