import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer as TimerIcon, 
  BarChart3, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  LayoutGrid,
  Sun,
  Moon,
  Share2, 
  Zap, 
  CheckCircle2, 
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Timer } from './components/Timer';
import { FocusList } from './components/FocusList';
import { TimerModes } from './components/TimerModes';
import { Session, UserStats, FocusTask, TimerMode, UserSettings } from './types';
import { 
  INITIAL_FOCUS_TASKS, 
  MOTIVATIONAL_QUOTES, 
  PRESET_TIMER_MODES, 
  SOUND_OPTIONS,
  TICK_SOUND
} from './constants';

type Tab = 'timer' | 'modes' | 'stats' | 'history' | 'settings';

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [timeLeft, setTimeLeft] = useState(60);
  const [initialTime, setInitialTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  const [activeModeId, setActiveModeId] = useState<string>(PRESET_TIMER_MODES[0].id);
  const [activeTaskId, setActiveTaskId] = useState<string>(INITIAL_FOCUS_TASKS[0].id);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('focus60_ultra_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      const lastDate = parsed.lastSessionDate;
      
      if (lastDate && lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate !== yesterday.toDateString()) {
          parsed.currentStreak = 0;
        }
        parsed.totalSessionsToday = 0;
        parsed.totalMinutesToday = 0;
      }

      // Ensure new fields exist
      if (!parsed.customTimers) parsed.customTimers = [];
      if (!parsed.settings) {
        parsed.settings = {
          defaultTimerDuration: 25,
          defaultBreakDuration: 5,
          soundVolume: 0.5,
          isSoundEnabled: true,
          isConfettiEnabled: true,
          isAutoStartEnabled: false,
          isTickEnabled: true,
          isDarkMode: true
        };
      }
      if (parsed.settings.isTickEnabled === undefined) parsed.settings.isTickEnabled = true;
      return parsed;
    }
    return {
      totalSessionsToday: 0,
      totalMinutesToday: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastSessionDate: null,
      history: [],
      focusTasks: INITIAL_FOCUS_TASKS,
      customTimers: [],
      settings: {
        defaultTimerDuration: 25,
        defaultBreakDuration: 5,
        soundVolume: 0.5,
        isSoundEnabled: true,
        isConfettiEnabled: true,
        isAutoStartEnabled: false,
        isTickEnabled: true,
        isDarkMode: true
      }
    };
  });

  // --- Refs ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('focus60_ultra_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (stats.settings.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [stats.settings.isDarkMode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        // Tick Sound
        if (stats.settings.isTickEnabled && !isBreak) {
          if (!tickAudioRef.current) {
            tickAudioRef.current = new Audio(TICK_SOUND);
          }
          tickAudioRef.current.volume = stats.settings.soundVolume * 0.3; // Softer tick
          tickAudioRef.current.play().catch(() => {});
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, stats.settings.isTickEnabled, stats.settings.soundVolume, isBreak]);

  // Update timer when mode changes
  useEffect(() => {
    const allModes = [...PRESET_TIMER_MODES, ...stats.customTimers];
    const mode = allModes.find(m => m.id === activeModeId);
    if (mode && !isActive && !isBreak) {
      const seconds = mode.duration * 60;
      setInitialTime(seconds);
      setTimeLeft(seconds);
    }
  }, [activeModeId, stats.customTimers, isActive, isBreak]);

  // --- Handlers ---
  const handleComplete = useCallback(() => {
    setIsActive(false);
    
    const allModes = [...PRESET_TIMER_MODES, ...stats.customTimers];
    const currentMode = allModes.find(m => m.id === activeModeId);

    // Sound
    if (stats.settings.isSoundEnabled) {
      const soundId = currentMode?.soundType || 'bell';
      const soundUrl = SOUND_OPTIONS.find(s => s.id === soundId)?.url || SOUND_OPTIONS[0].url;
      
      if (!audioRef.current) {
        audioRef.current = new Audio(soundUrl);
      } else {
        audioRef.current.src = soundUrl;
      }
      audioRef.current.volume = stats.settings.soundVolume;
      audioRef.current.play().catch(() => {});
    }

    // Confetti
    if (stats.settings.isConfettiEnabled && !isBreak) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [currentMode?.color?.replace('bg-', '#') || '#3b82f6', '#8b5cf6', '#ffffff']
      });
    }

    // Vibration
    if (window.navigator.vibrate) {
      window.navigator.vibrate([200, 100, 200]);
    }

    if (!isBreak) {
      // Update Stats
      const today = new Date().toDateString();
      const activeTask = stats.focusTasks.find(t => t.id === activeTaskId);
      const duration = initialTime;
      
      const newSession: Session = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        duration,
        focusName: activeTask?.name || 'Unknown Task',
        timerMode: currentMode?.name || 'Manual'
      };

      setStats(prev => {
        let newStreak = prev.currentStreak;
        if (prev.lastSessionDate !== today) {
          newStreak += 1;
        }

        return {
          ...prev,
          totalSessionsToday: prev.totalSessionsToday + 1,
          totalMinutesToday: prev.totalMinutesToday + (duration / 60),
          currentStreak: newStreak,
          bestStreak: Math.max(newStreak, prev.bestStreak),
          lastSessionDate: today,
          history: [newSession, ...prev.history].slice(0, 100)
        };
      });

      // Message
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setCompletionMessage(randomQuote);
      setTimeout(() => setCompletionMessage(null), 6000);

      // Transition to Break
      setIsBreak(true);
      const breakSeconds = stats.settings.defaultBreakDuration * 60;
      setInitialTime(breakSeconds);
      setTimeLeft(breakSeconds);
      
      if (stats.settings.isAutoStartEnabled) {
        setTimeout(() => setIsActive(true), 1000);
      }
    } else {
      // End of Break
      setIsBreak(false);
      const modeSeconds = (currentMode?.duration || 25) * 60;
      setInitialTime(modeSeconds);
      setTimeLeft(modeSeconds);

      if (stats.settings.isAutoStartEnabled) {
        setTimeout(() => setIsActive(true), 1000);
      }
    }
  }, [activeTaskId, stats.focusTasks, stats.settings, activeModeId, stats.customTimers, isBreak, initialTime]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    const allModes = [...PRESET_TIMER_MODES, ...stats.customTimers];
    const mode = allModes.find(m => m.id === activeModeId);
    const seconds = isBreak ? stats.settings.defaultBreakDuration * 60 : (mode?.duration || 25) * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
  };

  const handleSelectTask = (id: string) => {
    if (!isActive) {
      setActiveTaskId(id);
      setActiveTab('timer');
    }
  };

  const toggleFavorite = (id: string) => {
    setStats(prev => ({
      ...prev,
      focusTasks: prev.focusTasks.map(t => 
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      )
    }));
  };

  const addCustomTask = (name: string) => {
    const newTask: FocusTask = {
      id: `custom-${Date.now()}`,
      name,
      isFavorite: false,
      isCustom: true
    };
    setStats(prev => ({
      ...prev,
      focusTasks: [newTask, ...prev.focusTasks]
    }));
    setActiveTaskId(newTask.id);
  };

  const deleteCustomTask = (id: string) => {
    setStats(prev => ({
      ...prev,
      focusTasks: prev.focusTasks.filter(t => t.id !== id)
    }));
    if (activeTaskId === id) {
      setActiveTaskId(INITIAL_FOCUS_TASKS[0].id);
    }
  };

  const handleAddCustomTimer = (mode: TimerMode) => {
    setStats(prev => ({
      ...prev,
      customTimers: [...prev.customTimers, mode]
    }));
    setActiveModeId(mode.id);
    setActiveTab('timer');
  };

  const handleDeleteCustomTimer = (id: string) => {
    setStats(prev => ({
      ...prev,
      customTimers: prev.customTimers.filter(t => t.id !== id)
    }));
    if (activeModeId === id) {
      setActiveModeId(PRESET_TIMER_MODES[0].id);
    }
  };

  const handleUpdateCustomTimer = (mode: TimerMode) => {
    setStats(prev => ({
      ...prev,
      customTimers: prev.customTimers.map(t => t.id === mode.id ? mode : t)
    }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setStats(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem('focus60_ultra_stats');
    window.location.reload();
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your history?')) {
      setStats(prev => ({ ...prev, history: [] }));
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Task', 'Mode', 'Duration (s)'];
    const rows = stats.history.map(s => [
      new Date(s.timestamp).toLocaleDateString(),
      new Date(s.timestamp).toLocaleTimeString(),
      s.focusName,
      s.timerMode,
      s.duration
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "focus60_ultra_history.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareStats = async () => {
    const text = `I've completed ${stats.totalSessionsToday} focus sessions today on Focus60 Ultra! My current streak is ${stats.currentStreak} days. Join me!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Focus60 Ultra',
          text,
          url: window.location.href
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Stats copied to clipboard!');
    }
  };

  const activeTask = stats.focusTasks.find(t => t.id === activeTaskId);
  const allModes = [...PRESET_TIMER_MODES, ...stats.customTimers];
  const activeMode = allModes.find(m => m.id === activeModeId);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-500/30 ${stats.settings.isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-20 ${stats.settings.isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-[100px] opacity-10 ${stats.settings.isDarkMode ? 'bg-purple-600' : 'bg-purple-400'}`} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TimerIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-display font-bold tracking-tight">Focus60 <span className="text-blue-500">Ultra</span></h1>
        </div>
        
        {/* Top Tab Navigation */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {[
            { id: 'timer', icon: TimerIcon, label: 'Timer' },
            { id: 'modes', icon: LayoutGrid, label: 'Modes' },
            { id: 'stats', icon: BarChart3, label: 'Stats' },
            { id: 'history', icon: HistoryIcon, label: 'History' },
            { id: 'settings', icon: SettingsIcon, label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'opacity-40 hover:opacity-100'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={shareStats}
            className="p-2.5 rounded-xl glass border border-white/10 hover:bg-white/5 transition-all active:scale-95"
          >
            <Share2 className="w-5 h-5 opacity-60" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto flex flex-col gap-8">
        
        <AnimatePresence mode="wait">
          {activeTab === 'timer' && (
            <motion.div 
              key="timer-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-8"
            >
              {/* Timer Section */}
              <section className="glass rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
                <Timer 
                  timeLeft={timeLeft}
                  initialTime={initialTime}
                  isActive={isActive}
                  isBreak={isBreak}
                  onToggle={toggleTimer}
                  onReset={resetTimer}
                  activeTaskName={activeTask?.name || 'Select a Task'}
                  isSoundEnabled={stats.settings.isSoundEnabled}
                  isConfettiEnabled={stats.settings.isConfettiEnabled}
                  onToggleSound={() => updateSettings({ isSoundEnabled: !stats.settings.isSoundEnabled })}
                  onToggleConfetti={() => updateSettings({ isConfettiEnabled: !stats.settings.isConfettiEnabled })}
                  timerColor={activeMode?.color ? activeMode.color.replace('bg-', 'text-') : 'text-blue-500'}
                  isTraderMode={activeModeId === 'mode-trader'}
                />
                
                <AnimatePresence>
                  {completionMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-x-0 bottom-10 flex justify-center px-8"
                    >
                      <div className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl px-6 py-3 rounded-2xl text-center">
                        <p className="text-sm font-medium text-blue-400 italic">"{completionMessage}"</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-3xl p-5 flex flex-col items-center gap-2 border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-display font-bold">{stats.totalSessionsToday}</span>
                  <span className="text-[10px] uppercase font-bold opacity-40">Today</span>
                </div>
                <div className="glass rounded-3xl p-5 flex flex-col items-center gap-2 border border-white/5 relative">
                  <Zap className={`w-5 h-5 ${stats.currentStreak > 0 ? 'text-orange-500 fill-current' : 'text-slate-400'}`} />
                  <span className="text-2xl font-display font-bold">{stats.currentStreak}</span>
                  <span className="text-[10px] uppercase font-bold opacity-40">Streak</span>
                  {stats.currentStreak > 0 && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full blur-sm"
                    />
                  )}
                </div>
                <div className="glass rounded-3xl p-5 flex flex-col items-center gap-2 border border-white/5">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-display font-bold">{stats.bestStreak}</span>
                  <span className="text-[10px] uppercase font-bold opacity-40">Best</span>
                </div>
              </div>

              {/* Focus List */}
              <FocusList 
                tasks={stats.focusTasks}
                activeTaskId={activeTaskId}
                onSelect={handleSelectTask}
                onToggleFavorite={toggleFavorite}
                onAddCustom={addCustomTask}
                onDeleteCustom={deleteCustomTask}
              />
            </motion.div>
          )}

          {activeTab === 'modes' && (
            <motion.div 
              key="modes-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TimerModes 
                activeModeId={activeModeId}
                customTimers={stats.customTimers}
                onSelectMode={(mode) => { setActiveModeId(mode.id); setActiveTab('timer'); }}
                onAddCustom={handleAddCustomTimer}
                onDeleteCustom={handleDeleteCustomTimer}
                onUpdateCustom={handleUpdateCustomTimer}
              />
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div 
              key="stats-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6"
            >
              <div className="glass rounded-3xl p-8 border border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Analytics</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                    <span className="text-[10px] font-bold uppercase opacity-40">Today Sessions</span>
                    <p className="text-3xl font-display font-bold mt-1">{stats.totalSessionsToday}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                    <span className="text-[10px] font-bold uppercase opacity-40">Focus Time</span>
                    <p className="text-3xl font-display font-bold mt-1">{Math.round(stats.totalMinutesToday)}m</p>
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
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-500">
                      <HistoryIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-display font-bold">History</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={exportCSV} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"><Share2 className="w-4 h-4 opacity-50" /></button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {stats.history.length === 0 ? (
                    <p className="text-center py-10 opacity-40">No history yet.</p>
                  ) : (
                    stats.history.map(session => (
                      <div key={session.id} className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold">{session.focusName}</span>
                          <span className="text-[10px] opacity-40 uppercase tracking-wider">
                            {new Date(session.timestamp).toLocaleDateString()} • {session.timerMode}
                          </span>
                        </div>
                        <span className="text-sm font-mono font-bold text-blue-400">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-500/20 text-slate-400">
                    <SettingsIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Settings</h2>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Appearance */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Appearance</span>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        {stats.settings.isDarkMode ? <Moon className="w-5 h-5 opacity-60" /> : <Sun className="w-5 h-5 opacity-60" />}
                        <span className="text-sm font-medium">Dark Mode</span>
                      </div>
                      <button 
                        onClick={() => updateSettings({ isDarkMode: !stats.settings.isDarkMode })}
                        className={`w-12 h-6 rounded-full transition-all relative ${stats.settings.isDarkMode ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${stats.settings.isDarkMode ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Timer Behavior */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Timer Behavior</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 opacity-60" />
                          <span className="text-sm font-medium">Auto-start Next Session</span>
                        </div>
                        <button 
                          onClick={() => updateSettings({ isAutoStartEnabled: !stats.settings.isAutoStartEnabled })}
                          className={`w-12 h-6 rounded-full transition-all relative ${stats.settings.isAutoStartEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${stats.settings.isAutoStartEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 opacity-60" />
                          <span className="text-sm font-medium">Ticking Sound</span>
                        </div>
                        <button 
                          onClick={() => updateSettings({ isTickEnabled: !stats.settings.isTickEnabled })}
                          className={`w-12 h-6 rounded-full transition-all relative ${stats.settings.isTickEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${stats.settings.isTickEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <label className="text-[10px] font-bold uppercase opacity-40">Default Break (Min)</label>
                          <input 
                            type="number" 
                            value={stats.settings.defaultBreakDuration}
                            onChange={(e) => updateSettings({ defaultBreakDuration: parseInt(e.target.value) || 5 })}
                            className="bg-transparent border-none p-0 text-lg font-display font-bold focus:ring-0"
                          />
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <label className="text-[10px] font-bold uppercase opacity-40">Default Focus (Min)</label>
                          <input 
                            type="number" 
                            value={stats.settings.defaultTimerDuration}
                            onChange={(e) => updateSettings({ defaultTimerDuration: parseInt(e.target.value) || 25 })}
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
                      onClick={resetAllData}
                      className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all active:scale-95 font-bold"
                    >
                      Reset All Data
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-4 glass border-t border-white/5 flex justify-around items-center">
        {[
          { id: 'timer', icon: TimerIcon, label: 'Timer' },
          { id: 'modes', icon: LayoutGrid, label: 'Modes' },
          { id: 'stats', icon: BarChart3, label: 'Stats' },
          { id: 'history', icon: HistoryIcon, label: 'History' },
          { id: 'settings', icon: SettingsIcon, label: 'Settings' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-blue-500 scale-110' : 'opacity-40 hover:opacity-100'}`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Global CSS for custom scrollbar */}
      <style>{`
        .glass {
          background: ${stats.settings.isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)'};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default App;
