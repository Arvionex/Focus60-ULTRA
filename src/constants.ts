import { FocusTask, TimerMode } from './types';

export const INITIAL_FOCUS_TASKS: FocusTask[] = [
  "Deep Work", "Trading Analysis", "Crypto Study", "Reading", "Workout", "Meditation", "Coding",
  "YouTube Learning", "Language Practice", "Writing", "Business Planning", "Prayer", "Journaling",
  "Design Practice", "UI Study", "Market Research", "IPO Study", "Backtesting", "Chart Review",
  "Scalp Practice", "EMA Strategy", "RSI Practice", "Strategy Building", "App Development",
  "Website Design", "AI Learning", "Gym Focus", "Home Cleaning", "Exam Preparation", "Revision",
  "Memory Training", "Typing Practice", "Public Speaking", "Skill Building", "Freelancing Work",
  "Client Work", "Creative Thinking", "Problem Solving", "Planning", "Morning Routine",
  "Night Review", "Gratitude Practice", "Visualization", "Self Discipline", "Financial Planning",
  "Budget Tracking", "Goal Setting", "Self Improvement", "Health Focus", "Study Sprint"
].map((name, index) => ({
  id: `task-${index}`,
  name,
  isFavorite: false
}));

export const PRESET_TIMER_MODES: TimerMode[] = [
  { id: 'mode-60s', name: '60 Second Focus', duration: 1 },
  { id: 'mode-5m', name: '5 Minute Quick Focus', duration: 5 },
  { id: 'mode-15m', name: '15 Minute Deep Focus', duration: 15 },
  { id: 'mode-25m', name: '25 Minute Pomodoro', duration: 25 },
  { id: 'mode-45m', name: '45 Minute Study Mode', duration: 45 },
  { id: 'mode-60m', name: '60 Minute Power Mode', duration: 60 },
  { id: 'mode-trader', name: 'Trader Mode', duration: 1, color: 'bg-emerald-500', soundType: 'success' },
];

export const SOUND_OPTIONS = [
  { id: 'bell', name: 'Classic Bell', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'digital', name: 'Digital Beep', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
  { id: 'success', name: 'Success Chime', url: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3' },
];

export const TICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

export const MOTIVATIONAL_QUOTES = [
  "1 Minute Discipline = Long Term Profit 📈",
  "Focus is the new IQ.",
  "Deep work is a superpower.",
  "One minute of discipline, a lifetime of freedom.",
  "Small wins lead to big victories.",
  "Your future self will thank you.",
  "Stay focused, stay humble.",
  "Discipline is choosing between what you want now and what you want most.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal.",
  "Don't stop when you're tired. Stop when you're done."
];

export const BELL_SOUND = SOUND_OPTIONS[0].url;
