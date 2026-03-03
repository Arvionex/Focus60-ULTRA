import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Volume2, VolumeX, Moon, Sun, Share2, Download, 
  History, BarChart3, Zap, Clock, TrendingUp,
  Wind, CloudRain, Coffee, CheckCircle2, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

import { Session, UserStats, FocusTask, TimerMode } from './types';
import { XP_PER_SECOND, LEVEL_UP_BASE, MOTIVATIONAL_QUOTES, AMBIENT_SOUNDS, INITIAL_FOCUS_TASKS } from './constants';
import { FocusList } from './components/FocusList';
import { Timer } from './components/Timer';
import { StatsModal, HistoryModal } from './components/Modals';

export default function App() {
  // --- State ---
  const [timeLeft, setTimeLeft] = useState(60);
  const [initialTime, setInitialTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('1m');
  const [isTraderMode, setIsTraderMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState<keyof typeof AMBIENT_SOUNDS | null>(null);
  const [autoStart, setAutoStart] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('focus60_ultra_stats');
    if (saved) return JSON.parse(saved);
    return {
      totalSessions: 0,
      totalFocusMinutes: 0,
      currentStreak: 0,
      bestStreak: 0,
      xp: 0,
      level: 1,
      lastSessionDate: null,
      history: [],
      focusTasks: INITIAL_FOCUS_TASKS,
      lifetimeSessions: 0
    };
  });

  // --- Refs ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('focus60_ultra_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (soundEnabled) playTick();
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft, soundEnabled]);

  useEffect(() => {
    if (ambientSound && soundEnabled && isActive) {
      if (audioRef.current) {
        audioRef.current.src = AMBIENT_SOUNDS[ambientSound];
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
      }
    } else {
      audioRef.current?.pause();
    }
  }, [ambientSound, soundEnabled, isActive]);

  // --- Helpers ---
  const playTick = () => {
    if (!tickAudioRef.current) {
      tickAudioRef.current = new Audio(AMBIENT_SOUNDS.tick);
      tickAudioRef.current.volume = 0.2;
    }
    tickAudioRef.current.currentTime = 0;
    tickAudioRef.current.play().catch(() => {});
  };

  const playBell = () => {
    if (!bellAudioRef.current) bellAudioRef.current = new Audio(AMBIENT_SOUNDS.bell);
    bellAudioRef.current.play().catch(() => {});
  };

  const handleComplete = useCallback(() => {
    setIsActive(false);
    playBell();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: isTraderMode ? ['#00ff88', '#ffffff'] : ['#00d2ff', '#9d50bb']
    });

    const xpEarned = initialTime * XP_PER_SECOND;
    const today = new Date().toDateString();
    const activeTask = stats.focusTasks.find(t => t.id === activeTaskId);
    
    setStats(prev => {
      const newXp = prev.xp + xpEarned;
      const newLevel = Math.floor(newXp / LEVEL_UP_BASE) + 1;
      const isNewDay = prev.lastSessionDate !== today;
      
      let newStreak = prev.currentStreak;
      if (isNewDay) {
        const lastDate = prev.lastSessionDate ? new Date(prev.lastSessionDate) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        newStreak = (lastDate && lastDate.toDateString() === yesterday.toDateString()) ? newStreak + 1 : 1;
      }

      const newSession: Session = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        duration: initialTime,
        mode,
        xpEarned,
        isTraderMode,
        focusId: activeTaskId || undefined,
        focusName: activeTask?.name
      };

      const updatedTasks = prev.focusTasks.map(t => {
        if (t.id === activeTaskId) {
          return { ...t, sessions: t.sessions + 1, totalMinutes: t.totalMinutes + (initialTime / 60), xp: t.xp + xpEarned };
        }
        return t;
      });

      return {
        ...prev,
        totalSessions: prev.totalSessions + 1,
        lifetimeSessions: (prev.lifetimeSessions || 0) + 1,
        totalFocusMinutes: prev.totalFocusMinutes + (initialTime / 60),
        xp: newXp,
        level: newLevel,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, prev.bestStreak),
        lastSessionDate: today,
        history: [newSession, ...prev.history].slice(0, 100),
        focusTasks: updatedTasks
      };
    });

    if (autoStart) {
      setTimeout(() => { setTimeLeft(initialTime); setIsActive(true); }, 3000);
    } else {
      setTimeLeft(initialTime);
    }

    if (activeTask) {
      setCompletionMessage(`Great job! You focused on "${activeTask.name}" for ${Math.floor(initialTime/60)}m.`);
      setTimeout(() => setCompletionMessage(null), 5000);
    }

    if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
  }, [initialTime, mode, isTraderMode, autoStart, activeTaskId, stats.focusTasks]);

  const exportCSV = () => {
    const headers = ['Date', 'Task', 'Mode', 'Duration(s)', 'XP', 'TraderMode'];
    const rows = stats.history.map(s => [new Date(s.timestamp).toLocaleString(), s.focusName || 'None', s.mode, s.duration, s.xpEarned, s.isTraderMode]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "focus60_ultra_history.csv";
    link.click();
  };

  const shareResult = async () => {
    const text = `I just completed a ${Math.floor(initialTime/60)}m focus session on Focus60 Ultra! Level ${stats.level} reached. 🚀`;
    if (navigator.share) await navigator.share({ title: 'Focus60 Ultra', text, url: window.location.href });
    else { navigator.clipboard.writeText(text); alert('Copied to clipboard!'); }
  };

  const activeTask = useMemo(() => stats.focusTasks.find(t => t.id === activeTaskId), [stats.focusTasks, activeTaskId]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0c]' : 'bg-slate-50 text-slate-900'}`}>
      <audio ref={audioRef} />
      
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isTraderMode ? 'bg-trader-green/20' : 'bg-neon-blue/20'}`}>
            <Clock className={`w-6 h-6 ${isTraderMode ? 'text-trader-green' : 'text-neon-blue'}`} />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight">Focus60 <span className="text-xs font-mono opacity-50">ULTRA</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsTraderMode(!isTraderMode)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isTraderMode ? 'bg-trader-green text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            {isTraderMode ? 'TRADER ON' : 'TRADER MODE'}
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto flex flex-col items-center gap-8">
        <div className="w-full glass-dark rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Level {stats.level}</span>
              <span className="text-sm font-display font-bold">{stats.xp % LEVEL_UP_BASE} / {LEVEL_UP_BASE} XP</span>
            </div>
            <Trophy className={`w-5 h-5 ${isTraderMode ? 'text-trader-green' : 'text-neon-purple'}`} />
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div className={`h-full ${isTraderMode ? 'bg-trader-green' : 'bg-gradient-to-right from-neon-blue to-neon-purple'}`} initial={{ width: 0 }} animate={{ width: `${(stats.xp % LEVEL_UP_BASE) / LEVEL_UP_BASE * 100}%` }} />
          </div>
        </div>

        <FocusList 
          tasks={stats.focusTasks} 
          activeTaskId={activeTaskId} 
          isTraderMode={isTraderMode}
          onSelect={setActiveTaskId}
          onToggleFavorite={(id) => setStats(s => ({ ...s, focusTasks: s.focusTasks.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t) }))}
          onToggleComplete={(id) => setStats(s => ({ ...s, focusTasks: s.focusTasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t) }))}
          onDelete={(id) => setStats(s => ({ ...s, focusTasks: s.focusTasks.filter(t => t.id !== id) }))}
          onAdd={(name, category) => setStats(s => ({ ...s, focusTasks: [{ id: Math.random().toString(36).substr(2, 9), name, category, sessions: 0, totalMinutes: 0, xp: 0, isFavorite: false, isCompleted: false }, ...s.focusTasks] }))}
        />

        <Timer 
          timeLeft={timeLeft} 
          initialTime={initialTime} 
          isActive={isActive} 
          isTraderMode={isTraderMode}
          activeTaskName={activeTask?.name}
          onToggle={() => setIsActive(!isActive)}
          onReset={() => { setIsActive(false); setTimeLeft(initialTime); }}
          onShowStats={() => setShowStats(true)}
        />

        <div className="flex flex-wrap justify-center gap-2">
          {[{ l: '1m', v: 60, id: '1m' }, { l: '5m', v: 300, id: '5m' }, { l: '15m', v: 900, id: '15m' }, { l: 'Custom', v: 0, id: 'custom' }].map((m) => (
            <button key={m.id} onClick={() => { if (m.id === 'custom') { const s = prompt("Seconds:"); if (s) { setInitialTime(parseInt(s)); setTimeLeft(parseInt(s)); setMode('custom'); setIsActive(false); } } else { setInitialTime(m.v); setTimeLeft(m.v); setMode(m.id as any); setIsActive(false); } }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m.id ? (isTraderMode ? 'bg-trader-green text-black' : 'bg-neon-blue text-white') : 'glass hover:bg-white/10'}`}>
              {m.l}
            </button>
          ))}
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="glass-dark rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase opacity-50">Ambient</span>
              <button onClick={() => setSoundEnabled(!soundEnabled)}>{soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}</button>
            </div>
            <div className="flex gap-2">
              {[{ id: 'rain', icon: CloudRain }, { id: 'whiteNoise', icon: Wind }, { id: 'cafe', icon: Coffee }].map((s) => (
                <button key={s.id} onClick={() => setAmbientSound(ambientSound === s.id ? null : s.id as any)} className={`p-2.5 rounded-lg transition-all ${ambientSound === s.id ? (isTraderMode ? 'bg-trader-green text-black' : 'bg-neon-purple text-white') : 'bg-white/5 hover:bg-white/10'}`}><s.icon className="w-4 h-4" /></button>
              ))}
            </div>
          </div>
          <div className="glass-dark rounded-2xl p-4 flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase opacity-50">Auto-Start</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium opacity-70">Next</span>
              <button onClick={() => setAutoStart(!autoStart)} className={`w-10 h-5 rounded-full transition-all relative ${autoStart ? (isTraderMode ? 'bg-trader-green' : 'bg-neon-blue') : 'bg-white/10'}`}><div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoStart ? 'right-1' : 'left-1'}`} /></button>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-3 gap-3">
          {[{ label: 'Today', val: stats.totalSessions, icon: CheckCircle2 }, { label: 'Streak', val: `${stats.currentStreak}d`, icon: Zap }, { label: 'Best', val: `${stats.bestStreak}d`, icon: Trophy }].map((item, i) => (
            <div key={i} className="glass-dark rounded-2xl p-3 flex flex-col items-center gap-1">
              <item.icon className={`w-4 h-4 mb-1 ${isTraderMode ? 'text-trader-green' : 'text-neon-blue'}`} />
              <span className="text-lg font-display font-bold">{item.val}</span>
              <span className="text-[9px] uppercase font-bold opacity-40">{item.label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {completionMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`w-full p-4 rounded-xl text-center text-sm font-medium border ${isTraderMode ? 'bg-trader-green/10 border-trader-green/20 text-trader-green' : 'bg-neon-blue/10 border-neon-blue/20 text-neon-blue'}`}
            >
              {completionMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 glass border-t border-white/5 flex justify-around items-center">
        <button onClick={() => setShowStats(true)} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"><BarChart3 className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Stats</span></button>
        <button onClick={() => setShowHistory(true)} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"><History className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">History</span></button>
        <button onClick={shareResult} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"><Share2 className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Share</span></button>
        <button onClick={exportCSV} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"><Download className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Export</span></button>
      </nav>

      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} isTraderMode={isTraderMode} stats={stats} />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} isTraderMode={isTraderMode} history={stats.history} onExport={exportCSV} />
    </div>
  );
}
