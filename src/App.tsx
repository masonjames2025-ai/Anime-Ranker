import React, { useState, useEffect, useMemo } from 'react';
import { AnimeEntry, AnimeScores, AnimeTier, FilterState, SortField } from './types/anime.ts';
import { INITIAL_ANIME_DATA, SAMPLE_ANIME_DATA } from './data/initialAnime.ts';
import {
  CATEGORIES,
  PRESET_TAGS,
  TIER_CONFIG,
  calculateLibraryStats,
  calculateOverallScore,
  calculateTier,
  filterAndSortAnime,
} from './utils/scoring.ts';
import { Navbar } from './components/Navbar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { AnimeCard } from './components/AnimeCard.tsx';
import { TierMatrixView } from './components/TierMatrixView.tsx';
import { TableView } from './components/TableView.tsx';
import { CategoryLeadersView } from './components/CategoryLeadersView.tsx';
import { AnimeFormModal } from './components/AnimeFormModal.tsx';
import { AnimeDetailsModal } from './components/AnimeDetailsModal.tsx';
import { AnimeCompareModal } from './components/AnimeCompareModal.tsx';
import { Sparkles, Flame, Trophy, Plus, RefreshCw, Download, Upload, Layers, Trash2, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'anirank_user_library_v2';

export default function App() {
  // 1. Anime Library State - Starts EMPTY by default
  const [entries, setEntries] = useState<AnimeEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  // 2. Active Tab View
  const [currentTab, setCurrentTab] = useState<'grid' | 'tierlist' | 'table' | 'leaders'>('grid');

  // 3. Filter and Sort State
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    tier: 'all',
    selectedTags: [],
    fanServiceFilter: 'all',
    minOverallScore: 0,
    minCategoryScore: {
      category: 'none',
      minScore: 0,
    },
    sortBy: 'overallScore',
    sortOrder: 'desc',
    status: 'all',
  });

  // 4. Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<AnimeEntry | null>(null);

  const [detailsAnime, setDetailsAnime] = useState<AnimeEntry | null>(null);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareA, setCompareA] = useState<AnimeEntry | null>(null);
  const [compareB, setCompareB] = useState<AnimeEntry | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Available unique tags (with Isekai first)
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    set.add('Isekai');
    PRESET_TAGS.forEach((t) => set.add(t));
    entries.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [entries]);

  // Filtered and sorted anime
  const filteredEntries = useMemo(() => {
    return filterAndSortAnime(entries, filter);
  }, [entries, filter]);

  // Library summary statistics
  const stats = useMemo(() => {
    return calculateLibraryStats(entries);
  }, [entries]);

  // Handlers for Add/Edit/Delete
  const handleOpenAddModal = () => {
    setEditingAnime(null);
    setIsFormModalOpen(true);
  };

  const handleEditAnime = (anime: AnimeEntry) => {
    setEditingAnime(anime);
    setIsFormModalOpen(true);
  };

  const handleSaveAnime = (savedItem: AnimeEntry) => {
    setEntries((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === savedItem.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedItem;
        showToast(`Updated "${savedItem.title}" (Score: ${savedItem.overallScore.toFixed(1)} · Tier ${savedItem.tier})`);
        return next;
      } else {
        showToast(`Added "${savedItem.title}" to Tier ${savedItem.tier} (${savedItem.overallScore.toFixed(1)})`);
        return [savedItem, ...prev];
      }
    });
  };

  const handleDeleteAnime = (id: string) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to remove "${target.title}" from your rankings?`)) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast(`Removed "${target.title}"`);
    }
  };

  const handleCompareToggle = (anime: AnimeEntry) => {
    if (!compareA) {
      setCompareA(anime);
      showToast(`Selected "${anime.title}" for comparison. Pick a 2nd anime.`);
    } else if (compareA.id === anime.id) {
      setCompareA(null);
    } else {
      setCompareB(anime);
      setIsCompareModalOpen(true);
    }
  };

  const handleClearAll = () => {
    if (entries.length === 0) return;
    if (window.confirm('Clear all anime from your rankings? This will remove all entries from your browser.')) {
      setEntries([]);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Cleared all anime from rankings.');
    }
  };

  const handleLoadSamples = () => {
    setEntries(SAMPLE_ANIME_DATA);
    showToast('Loaded 14 sample anime.');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `anirank_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported anime rankings backup JSON.');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        totalCount={entries.length}
      />

      {/* Hero Strip / Stats KPI Row */}
      <section className="bg-slate-950/60 border-b border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Headline and 5 Categories intro */}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                5-Category Index
              </span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-xs text-slate-400">
                Art Style · Story · Character Dev · Soundtrack · Animation
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Personal Anime Ranking & Tier Matrix
            </h1>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {entries.length > 0 ? (
              <>
                {/* Average Overall */}
                <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 text-[11px] block">Mean Score</span>
                  <span className="font-mono font-bold text-white text-sm tabular-nums">
                    {stats.avgOverall.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">/ 10</span>
                  </span>
                </div>

                {/* S-Tier Count */}
                <div className="px-3 py-1.5 bg-amber-950/40 border border-amber-800/60 rounded-lg">
                  <span className="text-amber-400 text-[11px] block font-semibold">Tier S (9.0+)</span>
                  <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                    {stats.tierCounts.S} shows
                  </span>
                </div>

                {/* Isekai Count */}
                <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 text-[11px] block">✨ Isekai</span>
                  <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                    {stats.isekaiCount}
                  </span>
                </div>

                {/* Fan Service Count */}
                <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    Fan Service
                  </span>
                  <span className="font-mono font-bold text-orange-400 text-sm tabular-nums">
                    {stats.fanServiceCount}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Empty library · Add your watched anime to begin ranking</span>
              </div>
            )}

            {/* Backup & Clear actions */}
            <div className="flex items-center gap-1">
              {entries.length > 0 && (
                <>
                  <button
                    onClick={handleExportData}
                    className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Export rankings JSON backup"
                    aria-label="Export rankings JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-rose-950/40 transition-colors"
                    title="Clear all anime from rankings"
                    aria-label="Clear all anime"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Viewport Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* Active Comparison Indicator if anime A is staged */}
        {compareA && !isCompareModalOpen && (
          <div className="mb-4 p-3 bg-indigo-950/80 border border-indigo-700/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Comparing <strong>{compareA.title}</strong> ({compareA.overallScore.toFixed(1)}). Click "Compare" on another anime card, or compare now:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors"
              >
                Open Showdown
              </button>
              <button
                onClick={() => setCompareA(null)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Global Filter Bar (Available on all tabs for instant auto-filtering) */}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          availableTags={availableTags}
          totalMatches={filteredEntries.length}
          totalCount={entries.length}
        />

        {/* Dynamic Tab Views */}
        {currentTab === 'grid' && (
          <div>
            {entries.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-4 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <span className="font-mono text-2xl font-bold">亞</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Your Anime Library is Clean & Ready</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rate and rank every anime you've watched across the 5 core categories: <strong>Art Style, Story, Character Development, Soundtrack, and Animation</strong>. Tag fan service and categorical markers like Isekai.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Score Your First Anime</span>
                  </button>
                  <button
                    onClick={handleLoadSamples}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Load 14 sample shows (optional)</span>
                  </button>
                </div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 space-y-3">
                <p className="text-sm text-slate-400">
                  No anime matches your current score, fan service, or categorical marker filters.
                </p>
                <button
                  onClick={() =>
                    setFilter({
                      search: '',
                      tier: 'all',
                      selectedTags: [],
                      fanServiceFilter: 'all',
                      minOverallScore: 0,
                      minCategoryScore: { category: 'none', minScore: 0 },
                      sortBy: 'overallScore',
                      sortOrder: 'desc',
                      status: 'all',
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEntries.map((anime, idx) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    rank={idx + 1}
                    onEdit={handleEditAnime}
                    onDelete={handleDeleteAnime}
                    onCompareToggle={handleCompareToggle}
                    isComparing={compareA?.id === anime.id}
                    onSelectDetails={setDetailsAnime}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'tierlist' && (
          <TierMatrixView
            entries={filteredEntries}
            onSelectDetails={setDetailsAnime}
            onEdit={handleEditAnime}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {currentTab === 'table' && (
          <TableView
            entries={filteredEntries}
            sortBy={filter.sortBy}
            sortOrder={filter.sortOrder}
            onSortChange={(field) => {
              setFilter((prev) => ({
                ...prev,
                sortBy: field,
                sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
              }));
            }}
            onSelectDetails={setDetailsAnime}
            onEdit={handleEditAnime}
            onDelete={handleDeleteAnime}
          />
        )}

        {currentTab === 'leaders' && (
          <CategoryLeadersView
            entries={entries}
            onSelectDetails={setDetailsAnime}
            onEdit={handleEditAnime}
          />
        )}
      </main>

      {/* Modals */}
      <AnimeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingAnime(null);
        }}
        onSave={handleSaveAnime}
        initialAnime={editingAnime}
      />

      <AnimeDetailsModal
        anime={detailsAnime}
        onClose={() => setDetailsAnime(null)}
        onEdit={handleEditAnime}
        onDelete={handleDeleteAnime}
      />

      <AnimeCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => {
          setIsCompareModalOpen(false);
          setCompareA(null);
          setCompareB(null);
        }}
        entries={entries}
        initialAnimeA={compareA}
        initialAnimeB={compareB}
      />

      {/* Clean quiet footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            AniRank Studio · 5 Core Categories: Art Style, Story, Characters, Soundtrack & Animation
          </span>
          <span>
            Auto-filtered and indexed locally in browser
          </span>
        </div>
      </footer>
    </div>
  );
}
