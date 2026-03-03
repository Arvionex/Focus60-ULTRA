import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, BarChart3 } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
  isTraderMode: boolean;
  onToggle: () => void;
  onReset: () => void;
  onShowStats: () => void;
  activeTaskName?: string;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  initialTime,
  isActive,
  isTraderMode,
  onToggle,
  onReset,
  onShowStats,
  activeTaskName
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-8">
      {activeTaskName && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Now Focusing On</span>
          <h2 className={`text-lg font-display font-bold ${isTraderMode ? 'text-trader-green' : 'text-neon-blue'}`}>{activeTaskName}</h2>
        </div>
      )}

      <div className="relative flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="w-72 h-72 transform -rotate-90">
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "linear" }}
            strokeLinecap="round"
            className={isTraderMode ? 'text-trader-green neon-glow-green' : 'text-neon-blue neon-glow-blue'}
          />
        </svg>

        {/* Time Text */}
        <div className="absolute flex flex-col items-center">
          <motion.span 
            key={timeLeft}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-display font-bold tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-xs uppercase tracking-[0.3em] opacity-40 font-bold mt-2">
            {isActive ? 'Focusing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onReset}
          className="p-4 rounded-full glass hover:bg-white/10 transition-all active:scale-95"
        >
          <RotateCcw className="w-6 h-6 opacity-60" />
        </button>
        
        <button 
          onClick={onToggle}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
            isTraderMode 
              ? 'bg-trader-green text-black neon-glow-green' 
              : 'bg-white text-black shadow-white/10'
          }`}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>

        <button 
          onClick={onShowStats}
          className="p-4 rounded-full glass hover:bg-white/10 transition-all active:scale-95"
        >
          <BarChart3 className="w-6 h-6 opacity-60" />
        </button>
      </div>
    </div>
  );
};
