import React from 'react';
import { Plus, SlidersHorizontal, Sparkles, Layers, Table2, Trophy } from 'lucide-react';

interface NavbarProps {
  currentTab: 'grid' | 'tierlist' | 'table' | 'leaders';
  onTabChange: (tab: 'grid' | 'tierlist' | 'table' | 'leaders') => void;
  onOpenAddModal: () => void;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-mono font-bold text-white text-base">亞</span>
          </div>
          <a href="#" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors">
            AniRank <span className="text-xs font-mono font-normal text-slate-400 ml-1">v5.0</span>
          </a>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded tabular-nums">
            {totalCount} Ranked
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-900/90 border border-slate-800/90 rounded-xl" aria-label="Main Navigation">
          <button
            onClick={() => onTabChange('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="View Grid Rankings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Rankings
          </button>

          <button
            onClick={() => onTabChange('tierlist')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'tierlist'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="View Tier Matrix"
          >
            <Layers className="w-3.5 h-3.5" />
            Tier Matrix
          </button>

          <button
            onClick={() => onTabChange('table')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'table'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="View Scoreboard Table"
          >
            <Table2 className="w-3.5 h-3.5" />
            Scoreboard
          </button>

          <button
            onClick={() => onTabChange('leaders')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'leaders'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="View Category Leaders"
          >
            <Trophy className="w-3.5 h-3.5" />
            Category Leaders
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap shrink-0"
            aria-label="Add and score new anime"
          >
            <Plus className="w-4 h-4" />
            <span>Score New Anime</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 border-t border-slate-900 bg-slate-950/95 overflow-x-auto">
        <button
          onClick={() => onTabChange('grid')}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            currentTab === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Rankings
        </button>
        <button
          onClick={() => onTabChange('tierlist')}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            currentTab === 'tierlist' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Tier Matrix
        </button>
        <button
          onClick={() => onTabChange('table')}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            currentTab === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Scoreboard
        </button>
        <button
          onClick={() => onTabChange('leaders')}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            currentTab === 'leaders' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Leaders
        </button>
      </div>
    </header>
  );
};
