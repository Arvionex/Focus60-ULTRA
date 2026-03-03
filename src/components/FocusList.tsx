import React, { useState } from 'react';
import { Search, Star, CheckCircle2, Plus, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FocusTask, Category } from '../types';

interface FocusListProps {
  tasks: FocusTask[];
  activeTaskId: string | null;
  onSelect: (taskId: string) => void;
  onToggleFavorite: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onAdd: (name: string, category: FocusTask['category']) => void;
  isTraderMode: boolean;
}

export const FocusList: React.FC<FocusListProps> = ({
  tasks,
  activeTaskId,
  onSelect,
  onToggleFavorite,
  onToggleComplete,
  onDelete,
  onAdd,
  isTraderMode
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Category>('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<FocusTask['category']>('Custom');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || t.category === filter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const categories: Category[] = ['All', 'Trading', 'Skill Development', 'Study', 'Mind & Discipline', 'Health & Fitness', 'Custom'];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between glass-dark rounded-2xl p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isTraderMode ? 'bg-trader-green/20 text-trader-green' : 'bg-neon-blue/20 text-neon-blue'}`}>
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">Focus List</h3>
            <p className="text-[10px] opacity-50 uppercase tracking-wider">
              {activeTaskId ? `Active: ${tasks.find(t => t.id === activeTaskId)?.name}` : 'Select a focus task'}
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 opacity-50" /> : <ChevronDown className="w-5 h-5 opacity-50" />}
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-4 glass-dark rounded-2xl p-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20"
              />
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className={`p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors ${showAddForm ? 'bg-white/10' : ''}`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                  filter === c 
                    ? (isTraderMode ? 'bg-trader-green text-black' : 'bg-neon-blue text-white') 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          {showAddForm && (
            <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <input 
                type="text" 
                placeholder="Task name..." 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none"
              />
              <div className="flex justify-between items-center">
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-transparent text-xs opacity-60 focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} className="bg-black">{c}</option>
                  ))}
                </select>
                <button 
                  onClick={() => {
                    if (newName) {
                      onAdd(newName, newCategory);
                      setNewName('');
                      setShowAddForm(false);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${isTraderMode ? 'bg-trader-green text-black' : 'bg-white text-black'}`}
                >
                  ADD
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {filteredTasks.map(task => (
              <div 
                key={task.id}
                className={`group flex items-center justify-between p-3 rounded-xl transition-all border ${
                  activeTaskId === task.id 
                    ? (isTraderMode ? 'bg-trader-green/10 border-trader-green/30' : 'bg-neon-blue/10 border-neon-blue/30') 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onSelect(task.id)}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
                    className={`transition-colors ${task.isCompleted ? 'text-trader-green' : 'opacity-20 hover:opacity-100'}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${task.isCompleted ? 'line-through opacity-40' : ''}`}>{task.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] uppercase font-bold opacity-30">{task.category}</span>
                      <span className="text-[8px] font-mono opacity-30">• {task.sessions} sessions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onToggleFavorite(task.id)}
                    className={`transition-colors ${task.isFavorite ? 'text-yellow-400' : 'opacity-20 hover:opacity-100'}`}
                  >
                    <Star className={`w-4 h-4 ${task.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
