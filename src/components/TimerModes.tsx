import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Check, X, Palette, Music } from 'lucide-react';
import { TimerMode } from '../types';
import { PRESET_TIMER_MODES, SOUND_OPTIONS } from '../constants';

interface TimerModesProps {
  activeModeId: string;
  customTimers: TimerMode[];
  onSelectMode: (mode: TimerMode) => void;
  onAddCustom: (mode: TimerMode) => void;
  onDeleteCustom: (id: string) => void;
  onUpdateCustom: (mode: TimerMode) => void;
}

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 
  'bg-orange-500', 'bg-pink-500', 'bg-indigo-500',
  'bg-red-500', 'bg-yellow-500'
];

export const TimerModes: React.FC<TimerModesProps> = ({
  activeModeId,
  customTimers,
  onSelectMode,
  onAddCustom,
  onDeleteCustom,
  onUpdateCustom
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<TimerMode>>({
    name: '',
    duration: 25,
    color: COLORS[0],
    soundType: SOUND_OPTIONS[0].id
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.duration) return;

    const mode: TimerMode = {
      id: editingId || `custom-${Date.now()}`,
      name: formData.name,
      duration: formData.duration,
      color: formData.color,
      soundType: formData.soundType,
      isCustom: true
    };

    if (editingId) {
      onUpdateCustom(mode);
      setEditingId(null);
    } else {
      onAddCustom(mode);
      setIsAdding(false);
    }

    setFormData({
      name: '',
      duration: 25,
      color: COLORS[0],
      soundType: SOUND_OPTIONS[0].id
    });
  };

  const startEdit = (mode: TimerMode) => {
    setEditingId(mode.id);
    setFormData({
      name: mode.name,
      duration: mode.duration,
      color: mode.color || COLORS[0],
      soundType: mode.soundType || SOUND_OPTIONS[0].id
    });
    setIsAdding(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 glass rounded-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold">Timer Modes</h3>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all active:scale-95"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase opacity-40">Timer Name</label>
              <input 
                type="text" 
                placeholder="e.g. Deep Study"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase opacity-40">Duration (Min)</label>
              <input 
                type="number" 
                min="1"
                max="1440"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase opacity-40 flex items-center gap-2">
              <Palette className="w-3 h-3" /> Theme Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button 
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full ${color} transition-all ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase opacity-40 flex items-center gap-2">
              <Music className="w-3 h-3" /> Completion Sound
            </label>
            <select 
              value={formData.soundType}
              onChange={(e) => setFormData({ ...formData, soundType: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-blue-500/50"
            >
              {SOUND_OPTIONS.map(sound => (
                <option key={sound.id} value={sound.id} className="bg-slate-900">{sound.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> {editingId ? 'Update Timer' : 'Save Custom Timer'}
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-full">
          <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Presets</span>
        </div>
        {PRESET_TIMER_MODES.map(mode => (
          <button 
            key={mode.id}
            onClick={() => onSelectMode(mode)}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
              activeModeId === mode.id 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-white/5 border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className={`text-sm font-bold ${activeModeId === mode.id ? 'text-blue-400' : ''}`}>{mode.name}</span>
              <span className="text-[10px] opacity-40">{mode.duration}m</span>
            </div>
            {activeModeId === mode.id && <Check className="w-4 h-4 text-blue-400" />}
          </button>
        ))}

        {customTimers.length > 0 && (
          <>
            <div className="col-span-full mt-4">
              <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Custom</span>
            </div>
            {customTimers.map(mode => (
              <div 
                key={mode.id}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  activeModeId === mode.id 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <button 
                  onClick={() => onSelectMode(mode)}
                  className="flex-1 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${mode.color || 'bg-blue-500'}`} />
                    <span className={`text-sm font-bold ${activeModeId === mode.id ? 'text-blue-400' : ''}`}>{mode.name}</span>
                  </div>
                  <span className="text-[10px] opacity-40">{mode.duration}m</span>
                </button>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(mode)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-blue-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onDeleteCustom(mode.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
