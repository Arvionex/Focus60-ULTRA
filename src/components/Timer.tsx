import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Bell, BellOff, Sparkles, Coffee, Trophy } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
  isBreak: boolean;
  onToggle: () => void;
  onReset: () => void;
  activeTaskName: string;
  isSoundEnabled: boolean;
  isConfettiEnabled: boolean;
  onToggleSound: () => void;
  onToggleConfetti: () => void;
  timerColor?: string;
  isTraderMode?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  initialTime,
  isActive,
  isBreak,
  onToggle,
  onReset,
  activeTaskName,
  isSoundEnabled,
  isConfettiEnabled,
  onToggleSound,
  onToggleConfetti,
  timerColor = 'text-blue-500',
  isTraderMode = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const activeColor = isBreak ? 'text-emerald-500' : timerColor;
  const glowColor = isBreak ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)';

  return (
    <div className={`flex flex-col items-center gap-8 py-10 transition-all ${isFullscreen ? 'fixed inset-0 z-[200] bg-black flex items-center justify-center' : ''}`}>
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {isBreak && <Coffee className="w-4 h-4 text-emerald-500" />}
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isBreak ? 'text-emerald-500' : 'opacity-40'}`}>
            {isBreak ? 'Break Time' : 'Focusing On'}
          </span>
        </div>
        <h2 className={`text-2xl font-display font-bold mt-1 ${isBreak ? 'text-emerald-500' : activeColor.replace('bg-', 'text-')}`}>
          {isBreak ? 'Take a Rest' : activeTaskName}
        </h2>
        {isTraderMode && !isBreak && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <Trophy className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Profit Discipline Badge</span>
          </motion.div>
        )}
      </div>

      <div className="relative flex items-center justify-center">
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
            className={activeColor.replace('bg-', 'text-')}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          />
        </svg>

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
            {isActive ? 'Active' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onReset}
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/10"
          >
            <RotateCcw className="w-6 h-6 opacity-60" />
          </button>
          
          <button 
            onClick={onToggle}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${isBreak ? 'bg-emerald-500' : activeColor.replace('text-', 'bg-')} text-white`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={toggleFullscreen}
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-6 h-6 opacity-60" /> : <Maximize2 className="w-6 h-6 opacity-60" />}
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
          <button 
            onClick={onToggleSound}
            className={`p-2 rounded-xl transition-all ${isSoundEnabled ? 'text-blue-400 bg-blue-400/10' : 'opacity-40'}`}
            title={isSoundEnabled ? 'Disable Sound' : 'Enable Sound'}
          >
            {isSoundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button 
            onClick={onToggleConfetti}
            className={`p-2 rounded-xl transition-all ${isConfettiEnabled ? 'text-purple-400 bg-purple-400/10' : 'opacity-40'}`}
            title={isConfettiEnabled ? 'Disable Confetti' : 'Enable Confetti'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
