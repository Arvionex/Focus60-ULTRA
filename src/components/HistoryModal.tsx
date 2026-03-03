import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, Trash2, Download } from 'lucide-react';
import { Session } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: Session[];
  onClear: () => void;
  onExport: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onClear,
  onExport 
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
            className="w-full max-w-md glass rounded-3xl p-8 flex flex-col gap-6 relative max-h-[80vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 opacity-50" />
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-500">
                  <History className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-bold">History</h2>
              </div>
              <div className="flex items-center gap-2 mr-10">
                <button 
                  onClick={onExport}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4 opacity-50" />
                </button>
                <button 
                  onClick={onClear}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  title="Clear History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
              {history.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-white/5">
                    <History className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm opacity-40 font-medium">No sessions recorded yet.</p>
                </div>
              ) : (
                history.map((session) => (
                  <div key={session.id} className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold">{session.focusName}</span>
                      <span className="text-[10px] opacity-40 uppercase tracking-wider">
                        {new Date(session.timestamp).toLocaleDateString()} • {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-blue-400">
                        {Math.floor(session.duration / 60)}m {session.duration % 60}s
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all active:scale-95"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
