import React, { useState } from 'react';
import { Search, X, Sliders, ArrowUpDown, Flame, ShieldCheck, Tag, Filter } from 'lucide-react';
import { AnimeScores, AnimeTier, FanServiceFilter, FilterState, SortField } from '../types/anime.ts';
import { CATEGORIES } from '../utils/scoring.ts';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  availableTags: string[];
  totalMatches: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  availableTags,
  totalMatches,
  totalCount,
}) => {
  const [showAdvancedScores, setShowAdvancedScores] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onFilterChange((prev) => ({ ...prev, search: val }));
  };

  const handleTierToggle = (tier: 'all' | AnimeTier) => {
    onFilterChange((prev) => ({ ...prev, tier }));
  };

  const handleFanServiceToggle = (fs: FanServiceFilter) => {
    onFilterChange((prev) => ({ ...prev, fanServiceFilter: fs }));
  };

  const handleTagToggle = (tag: string) => {
    onFilterChange((prev) => {
      const isSelected = prev.selectedTags.includes(tag);
      const nextTags = isSelected
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag];
      return { ...prev, selectedTags: nextTags };
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange((prev) => ({ ...prev, sortBy: e.target.value as SortField }));
  };

  const handleSortOrderToggle = () => {
    onFilterChange((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleResetFilters = () => {
    onFilterChange((prev) => ({
      ...prev,
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
    }));
  };

  const hasActiveFilters =
    filter.search !== '' ||
    filter.tier !== 'all' ||
    filter.selectedTags.length > 0 ||
    filter.fanServiceFilter !== 'all' ||
    filter.minOverallScore > 0 ||
    filter.minCategoryScore.category !== 'none' ||
    filter.status !== 'all';

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 sm:p-5 mb-6 space-y-4 shadow-xl">
      {/* Top Row: Search + Sort controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filter.search}
            onChange={handleSearchChange}
            placeholder="Search anime title, Japanese name, studio, or genre..."
            className="w-full pl-10 pr-10 py-2 text-sm bg-slate-950/70 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            aria-label="Search anime by title, studio, or genre"
          />
          {filter.search && (
            <button
              onClick={() => onFilterChange((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort and Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500">Sort:</span>
            <select
              value={filter.sortBy}
              onChange={handleSortChange}
              className="bg-transparent text-slate-200 focus:outline-none font-medium cursor-pointer"
              aria-label="Sort anime by field"
            >
              <option value="overallScore" className="bg-slate-900">Overall Score</option>
              <option value="artStyle" className="bg-slate-900">Art Style</option>
              <option value="story" className="bg-slate-900">Story</option>
              <option value="characterDevelopment" className="bg-slate-900">Character Dev</option>
              <option value="soundtrack" className="bg-slate-900">Soundtrack (OST)</option>
              <option value="animation" className="bg-slate-900">Animation</option>
              <option value="title" className="bg-slate-900">Title (A-Z)</option>
              <option value="year" className="bg-slate-900">Release Year</option>
            </select>

            <button
              onClick={handleSortOrderToggle}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={filter.sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'}
              title={filter.sortOrder === 'desc' ? 'Descending (High to Low)' : 'Ascending (Low to High)'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowAdvancedScores(!showAdvancedScores)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              showAdvancedScores || filter.minCategoryScore.category !== 'none' || filter.minOverallScore > 0
                ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300'
                : 'bg-slate-950/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
            }`}
            aria-label="Toggle Category Score Threshold Filters"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Score Sliders</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 rounded-lg transition-colors"
              aria-label="Reset all active filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Fan Service Toggle & Tier Segmented Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
        {/* Fan Service Segmented Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Fan Service:
          </span>
          <div className="flex items-center p-0.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <button
              onClick={() => handleFanServiceToggle('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter.fanServiceFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFanServiceToggle('no_fan_service')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter.fanServiceFilter === 'no_fan_service'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              Clean Only
            </button>
            <button
              onClick={() => handleFanServiceToggle('fan_service_only')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter.fanServiceFilter === 'fan_service_only'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-200" />
              Fan Service Only
            </button>
            <button
              onClick={() => handleFanServiceToggle('heavy_only')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter.fanServiceFilter === 'heavy_only'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Heavy (18+)
            </button>
          </div>
        </div>

        {/* Tier Auto-filter Segment */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Tier Rank:</span>
          <div className="flex items-center p-0.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            {(['all', 'S', 'A', 'B', 'C', 'D'] as const).map((tierKey) => {
              const isActive = filter.tier === tierKey;
              return (
                <button
                  key={tierKey}
                  onClick={() => handleTierToggle(tierKey)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors ${
                    isActive
                      ? tierKey === 'S'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : tierKey === 'A'
                        ? 'bg-blue-500 text-white shadow'
                        : tierKey === 'B'
                        ? 'bg-emerald-500 text-white shadow'
                        : tierKey === 'C'
                        ? 'bg-purple-500 text-white shadow'
                        : tierKey === 'D'
                        ? 'bg-rose-500 text-white shadow'
                        : 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label={`Filter by ${tierKey} tier`}
                >
                  {tierKey === 'all' ? 'All' : tierKey}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Categorical Markers (Tags) - with prominent Isekai indicator */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Categorical Markers (Auto-Filter):</span>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            Showing {totalMatches} of {totalCount} anime
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Prominent Isekai Marker Button */}
          {availableTags.map((tag) => {
            const isIsekai = tag.toLowerCase() === 'isekai';
            const isSelected = filter.selectedTags.includes(tag);

            if (isIsekai) {
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-md shadow-orange-500/30 ring-2 ring-amber-400/50'
                      : 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-700/60'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Toggle Isekai filter`}
                >
                  <span>✨ Isekai</span>
                  {isSelected && <X className="w-3 h-3 ml-0.5" />}
                </button>
              );
            }

            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                aria-pressed={isSelected}
                aria-label={`Filter by marker ${tag}`}
              >
                {tag}
                {isSelected && <span className="ml-1 text-[10px]">✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Advanced Score Thresholds */}
      {showAdvancedScores && (
        <div className="pt-3 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>Minimum Overall Score:</span>
              <span className="font-mono text-indigo-400 tabular-nums">
                {filter.minOverallScore > 0 ? `${filter.minOverallScore.toFixed(1)}+` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filter.minOverallScore}
              onChange={(e) =>
                onFilterChange((prev) => ({
                  ...prev,
                  minOverallScore: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <div className="flex items-center gap-1.5">
                <span>Filter Specific Category:</span>
                <select
                  value={filter.minCategoryScore.category}
                  onChange={(e) =>
                    onFilterChange((prev) => ({
                      ...prev,
                      minCategoryScore: {
                        ...prev.minCategoryScore,
                        category: e.target.value as keyof AnimeScores | 'none',
                      },
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-1.5 py-0.5 focus:outline-none"
                >
                  <option value="none">None (All Categories)</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              {filter.minCategoryScore.category !== 'none' && (
                <span className="font-mono text-amber-400 tabular-nums">
                  {filter.minCategoryScore.minScore.toFixed(1)}+
                </span>
              )}
            </div>
            {filter.minCategoryScore.category !== 'none' ? (
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={filter.minCategoryScore.minScore}
                onChange={(e) =>
                  onFilterChange((prev) => ({
                    ...prev,
                    minCategoryScore: {
                      ...prev.minCategoryScore,
                      minScore: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            ) : (
              <div className="text-[11px] text-slate-500 italic py-1">
                Select a category above to enforce minimum high-tier standards (e.g. Masterpiece Story &ge; 9.0)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
