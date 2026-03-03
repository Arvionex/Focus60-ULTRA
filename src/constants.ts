import { FocusTask } from './types';

export const XP_PER_SECOND = 1;
export const LEVEL_UP_BASE = 1000;

export const MOTIVATIONAL_QUOTES = [
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

export const AMBIENT_SOUNDS = {
  rain: 'https://www.soundjay.com/nature/rain-01.mp3',
  whiteNoise: 'https://www.soundjay.com/misc/sounds/white-noise-01.mp3',
  cafe: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3',
  bell: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  tick: 'https://www.soundjay.com/clock/sounds/clock-ticking-2.mp3'
};

export const INITIAL_FOCUS_TASKS: FocusTask[] = [
  // Trading (10)
  { id: 't1', name: 'Market Analysis', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't2', name: 'Backtesting Strategy', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't3', name: 'Risk Management Review', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't4', name: 'Trade Journaling', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't5', name: 'Psychology Check-in', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't6', name: 'Economic Calendar Review', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't7', name: 'Position Sizing Prep', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't8', name: 'Chart Pattern Study', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't9', name: 'Order Flow Analysis', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 't10', name: 'Pre-Market Routine', category: 'Trading', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },

  // Skill Development (10)
  { id: 's1', name: 'Coding Practice', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's2', name: 'Language Learning', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's3', name: 'Design Principles', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's4', name: 'Public Speaking Prep', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's5', name: 'Writing/Blogging', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's6', name: 'Data Analysis Skills', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's7', name: 'Musical Instrument', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's8', name: 'Video Editing', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's9', name: 'Marketing Strategy', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 's10', name: 'Financial Literacy', category: 'Skill Development', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },

  // Study (10)
  { id: 'st1', name: 'Deep Reading', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st2', name: 'Note Taking', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st3', name: 'Exam Preparation', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st4', name: 'Research Paper', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st5', name: 'Online Course', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st6', name: 'Flashcard Review', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st7', name: 'Group Study Session', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st8', name: 'Concept Mapping', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st9', name: 'Problem Solving', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'st10', name: 'Summary Writing', category: 'Study', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },

  // Mind & Discipline (10)
  { id: 'm1', name: 'Meditation', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm2', name: 'Breathwork', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm3', name: 'Gratitude Journaling', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm4', name: 'Digital Detox', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm5', name: 'Planning/Review', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm6', name: 'Stoic Reflection', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm7', name: 'Affirmations', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm8', name: 'Visualization', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm9', name: 'Self-Reflection', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'm10', name: 'Discipline Drill', category: 'Mind & Discipline', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },

  // Health & Fitness (10)
  { id: 'h1', name: 'Strength Training', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h2', name: 'Cardio Session', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h3', name: 'Yoga/Stretching', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h4', name: 'Meal Prep', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h5', name: 'Water Intake Goal', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h6', name: 'Sleep Hygiene Prep', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h7', name: 'Mobility Work', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h8', name: 'Outdoor Walk', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h9', name: 'HIIT Workout', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
  { id: 'h10', name: 'Posture Correction', category: 'Health & Fitness', sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false },
];
