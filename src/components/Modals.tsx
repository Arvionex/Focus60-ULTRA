import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, BarChart3, History, Clock, TrendingUp, Trophy, Zap, Download } from 'lucide-react';
import { UserStats, Session } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTraderMode: boolean;
}

interface StatsModalProps extends ModalProps {
  stats: UserStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, isTraderMode, stats }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
        >
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="w-full max-w-md glass-dark rounded-3xl p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Your Progress</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5">
                <RotateCcw className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase opacity-40">Today Sessions</span>
                <p className="text-3xl font-display font-bold mt-1">{stats.totalSessions}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase opacity-40">Lifetime</span>
                <p className="text-3xl font-display font-bold mt-1">{stats.lifetimeSessions || stats.totalSessions}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase opacity-40">Total Focus Time</span>
                <p className="text-2xl font-display font-bold mt-1">{Math.round(stats.totalFocusMinutes)}m</p>
              </div>
              <Clock className={`w-8 h-8 opacity-20 ${isTraderMode ? 'text-trader-green' : 'text-neon-blue'}`} />
            </div>

            <div className="bg-white/5 rounded-2xl p-6 flex flex-col gap-4">
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
                      className={`w-full rounded-t-md ${isTraderMode ? 'bg-trader-green/40' : 'bg-neon-blue/40'}`} 
                    />
                    <span className="text-[8px] font-bold opacity-30">MTWTFSS"[i]</span>
                  </div>
                ))}
              </div>
            </div>

            {stats.focusTasks.some(t => t.sessions > 0) && (
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase opacity-40">Top Focus of the Week</span>
                {stats.focusTasks
                  .filter(t => t.sessions > 0)
                  .sort((a, b) => b.sessions - a.sessions)
                  .slice(0, 1)
                  .map(t => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{t.name}</span>
                        <span className="text-[10px] opacity-50">{t.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold">{t.sessions} sessions</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold opacity-50 uppercase tracking-wider">Achievements</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: '10s', label: '10 Sessions', icon: Zap, unlocked: stats.lifetimeSessions >= 10 },
                  { id: '50s', label: '50 Sessions', icon: Trophy, unlocked: stats.lifetimeSessions >= 50 },
                  { id: '100s', label: '100 Sessions', icon: TrendingUp, unlocked: stats.lifetimeSessions >= 100 },
                  { id: '7d', label: '7 Day Streak', icon: Clock, unlocked: stats.bestStreak >= 7 }
                ].map(badge => (
                  <div key={badge.id} className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${badge.unlocked ? 'bg-white/10' : 'bg-white/5 opacity-20 grayscale'}`}>
                    <badge.icon className={`w-5 h-5 ${badge.unlocked ? (isTraderMode ? 'text-trader-green' : 'text-neon-purple') : ''}`} />
                    <span className="text-[7px] text-center font-bold uppercase leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${isTraderMode ? 'bg-trader-green text-black' : 'bg-white text-black'}`}
            >
              Close Stats
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface HistoryModalProps extends ModalProps {
  history: Session[];
  onExport: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, isTraderMode, history, onExport }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
        >
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="w-full max-w-md glass-dark rounded-3xl p-8 flex flex-col gap-6 max-h-[80vh]"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-bold">History</h2>
                <button onClick={onExport} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Download className="w-4 h-4 opacity-50" />
                </button>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5">
                <RotateCcw className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="py-12 text-center opacity-40">No sessions yet. Start focusing!</div>
              ) : (
                history.map((session) => (
                  <div key={session.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${session.isTraderMode ? 'bg-trader-green/20 text-trader-green' : 'bg-neon-blue/20 text-neon-blue'}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">{session.focusName || session.mode.toUpperCase()}</p>
                        <p className="text-[10px] opacity-40">{new Date(session.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold">+{session.xpEarned} XP</p>
                      {session.isTraderMode && <span className="text-[8px] text-trader-green font-bold">TRADER</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${isTraderMode ? 'bg-trader-green text-black' : 'bg-white text-black'}`}
            >
              Close History
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
