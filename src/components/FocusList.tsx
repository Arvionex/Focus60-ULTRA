import React, { useState } from 'react';
import { Search, Star, Plus, Trash2 } from 'lucide-react';
import { FocusTask } from '../types';

interface FocusListProps {
  tasks: FocusTask[];
  activeTaskId: string;
  onSelect: (taskId: string) => void;
  onToggleFavorite: (taskId: string) => void;
  onAddCustom: (name: string) => void;
  onDeleteCustom: (taskId: string) => void;
}

export const FocusList: React.FC<FocusListProps> = ({
  tasks,
  activeTaskId,
  onSelect,
  onToggleFavorite,
  onAddCustom,
  onDeleteCustom
}) => {
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <div className="w-full flex flex-col gap-6 p-6 glass rounded-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold">Focus Modes</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Add custom focus..." 
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        <button 
          onClick={() => {
            if (customName.trim()) {
              onAddCustom(customName.trim());
              setCustomName('');
            }
          }}
          className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTasks.map(task => (
          <div 
            key={task.id}
            onClick={() => onSelect(task.id)}
            className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
              activeTaskId === task.id 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-white/5 border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className={`text-sm font-medium truncate ${activeTaskId === task.id ? 'text-blue-400' : ''}`}>
                {task.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(task.id);
                }}
                className={`transition-colors ${task.isFavorite ? 'text-yellow-400' : 'opacity-20 hover:opacity-100'}`}
              >
                <Star className={`w-4 h-4 ${task.isFavorite ? 'fill-current' : ''}`} />
              </button>
              {task.isCustom && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustom(task.id);
                  }}
                  className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
