import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Volume2, Moon, Sun, RotateCcw, Bell, Sparkles, Play } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdate,
  onResetData 
}) => {
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
            className="w-full max-w-md glass rounded-3xl p-8 flex flex-col gap-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 opacity-50" />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-500/20 text-slate-400">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold">Settings</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Appearance */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Appearance</span>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    {settings.isDarkMode ? <Moon className="w-5 h-5 opacity-60" /> : <Sun className="w-5 h-5 opacity-60" />}
                    <span className="text-sm font-medium">Dark Mode</span>
                  </div>
                  <button 
                    onClick={() => onUpdate({ isDarkMode: !settings.isDarkMode })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.isDarkMode ? 'bg-blue-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.isDarkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {/* Sound & Effects */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Sound & Effects</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 opacity-60" />
                      <span className="text-sm font-medium">Completion Sound</span>
                    </div>
                    <button 
                      onClick={() => onUpdate({ isSoundEnabled: !settings.isSoundEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.isSoundEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.isSoundEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 opacity-60" />
                        <span className="text-sm font-medium">Volume</span>
                      </div>
                      <span className="text-xs font-mono opacity-40">{Math.round(settings.soundVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={settings.soundVolume}
                      onChange={(e) => onUpdate({ soundVolume: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 opacity-60" />
                      <span className="text-sm font-medium">Confetti Celebration</span>
                    </div>
                    <button 
                      onClick={() => onUpdate({ isConfettiEnabled: !settings.isConfettiEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.isConfettiEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.isConfettiEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timer Behavior */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Timer Behavior</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 opacity-60" />
                      <span className="text-sm font-medium">Auto-start Next Session</span>
                    </div>
                    <button 
                      onClick={() => onUpdate({ isAutoStartEnabled: !settings.isAutoStartEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.isAutoStartEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.isAutoStartEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-[10px] font-bold uppercase opacity-40">Default Break (Min)</label>
                      <input 
                        type="number" 
                        value={settings.defaultBreakDuration}
                        onChange={(e) => onUpdate({ defaultBreakDuration: parseInt(e.target.value) || 5 })}
                        className="bg-transparent border-none p-0 text-lg font-display font-bold focus:ring-0"
                      />
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-[10px] font-bold uppercase opacity-40">Default Focus (Min)</label>
                      <input 
                        type="number" 
                        value={settings.defaultTimerDuration}
                        onChange={(e) => onUpdate({ defaultTimerDuration: parseInt(e.target.value) || 25 })}
                        className="bg-transparent border-none p-0 text-lg font-display font-bold focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="flex flex-col gap-3 mt-4">
                <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider text-red-500">Danger Zone</span>
                <button 
                  onClick={() => {
                    if (window.confirm('This will erase ALL your sessions, custom timers, and settings. Are you absolutely sure?')) {
                      onResetData();
                    }
                  }}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all active:scale-95 font-bold"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Data
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
