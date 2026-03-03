import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Zap, Clock, BarChart3 } from 'lucide-react';
import { UserStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md glass rounded-3xl p-8 flex flex-col gap-8 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 opacity-50" />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold">Your Stats</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                <span className="text-[10px] font-bold uppercase opacity-40">Today Sessions</span>
                <p className="text-3xl font-display font-bold mt-1">{stats.totalSessionsToday}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                <span className="text-[10px] font-bold uppercase opacity-40">Focus Time</span>
                <p className="text-3xl font-display font-bold mt-1">{Math.round(stats.totalMinutesToday)}m</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase opacity-40">Current Streak</span>
                  <p className="text-xl font-display font-bold">{stats.currentStreak} Days</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase opacity-40">Best Streak</span>
                <p className="text-xl font-display font-bold">{stats.bestStreak} Days</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Weekly Activity</span>
                <span className="text-xs opacity-50">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between h-24 gap-2">
                {[40, 70, 30, 90, 60, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-full rounded-t-md bg-blue-500/40" 
                    />
                    <span className="text-[8px] font-bold opacity-30">{"MTWTFSS"[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Keep Focusing
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
