import React, { useState } from 'react';
import { X, Flame, ShieldCheck, Tag, Plus, Check, Sparkles } from 'lucide-react';
import { AnimeEntry, AnimeScores, AnimeType, FanServiceLevel, WatchStatus } from '../types/anime.ts';
import {
  CATEGORIES,
  PRESET_TAGS,
  TIER_CONFIG,
  calculateOverallScore,
  calculateTier,
  getFavoriteAspect,
} from '../utils/scoring.ts';

interface AnimeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (anime: AnimeEntry) => void;
  initialAnime?: AnimeEntry | null;
}

export const AnimeFormModal: React.FC<AnimeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAnime,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialAnime?.title || '');
  const [japaneseTitle, setJapaneseTitle] = useState(initialAnime?.japaneseTitle || '');
  const [year, setYear] = useState<number>(initialAnime?.year || 2024);
  const [type, setType] = useState<AnimeType>(initialAnime?.type || 'TV');
  const [episodes, setEpisodes] = useState<string>(
    initialAnime?.episodes ? String(initialAnime.episodes) : '12'
  );
  const [studio, setStudio] = useState(initialAnime?.studio || '');
  const [status, setStatus] = useState<WatchStatus>(initialAnime?.status || 'Completed');
  const [notes, setNotes] = useState(initialAnime?.notes || '');

  // 5 Categories Scores
  const [scores, setScores] = useState<AnimeScores>({
    artStyle: initialAnime?.scores.artStyle ?? 8.5,
    story: initialAnime?.scores.story ?? 8.5,
    characterDevelopment: initialAnime?.scores.characterDevelopment ?? 8.5,
    soundtrack: initialAnime?.scores.soundtrack ?? 8.5,
    animation: initialAnime?.scores.animation ?? 8.5,
  });

  // Fan Service
  const [hasFanService, setHasFanService] = useState<boolean>(
    initialAnime?.hasFanService ?? false
  );
  const [fanServiceLevel, setFanServiceLevel] = useState<FanServiceLevel>(
    initialAnime?.fanServiceLevel ?? 'mild'
  );
  const [fanServiceNotes, setFanServiceNotes] = useState(
    initialAnime?.fanServiceNotes ?? ''
  );

  // Categorical Markers / Tags
  const [tags, setTags] = useState<string[]>(
    initialAnime?.tags || ['Isekai', 'Fantasy']
  );
  const [customTagInput, setCustomTagInput] = useState('');

  // Live Overall Score and Tier Preview
  const liveOverallScore = calculateOverallScore(scores);
  const liveTier = calculateTier(liveOverallScore);
  const tierConfig = TIER_CONFIG[liveTier];

  const handleScoreChange = (catKey: keyof AnimeScores, val: number) => {
    const clamped = Math.min(10, Math.max(0, Math.round(val * 10) / 10));
    setScores((prev) => ({
      ...prev,
      [catKey]: clamped,
    }));
  };

  const handleToggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const overallScore = calculateOverallScore(scores);
    const tier = calculateTier(overallScore);
    const favoriteAspect = getFavoriteAspect(scores);

    const savedEntry: AnimeEntry = {
      id: initialAnime?.id || `anime-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      japaneseTitle: japaneseTitle.trim() || undefined,
      year: Number(year) || 2024,
      type,
      episodes: episodes ? Number(episodes) : undefined,
      studio: studio.trim() || undefined,
      themeColor: initialAnime?.themeColor || (tags.includes('Isekai') ? '#f59e0b' : '#6366f1'),
      scores,
      overallScore,
      tier,
      hasFanService,
      fanServiceLevel: hasFanService ? fanServiceLevel : 'none',
      fanServiceNotes: hasFanService ? fanServiceNotes.trim() : undefined,
      tags: tags.length > 0 ? tags : ['Anime'],
      status,
      notes: notes.trim() || undefined,
      favoriteAspect,
      updatedAt: new Date().toISOString(),
    };

    onSave(savedEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h2 className="text-base font-bold text-white">
              {initialAnime ? 'Edit Anime & Category Scores' : 'Score & Rank New Anime'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Input category ratings to auto-calculate overall score and tier placement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Basic Anime Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Anime Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frieren: Beyond Journey's End"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Japanese Title (Romaji or Kanji)
              </label>
              <input
                type="text"
                value={japaneseTitle}
                onChange={(e) => setJapaneseTitle(e.target.value)}
                placeholder="e.g. Sousou no Frieren"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Studio
              </label>
              <input
                type="text"
                value={studio}
                onChange={(e) => setStudio(e.target.value)}
                placeholder="e.g. Madhouse, ufotable, MAPPA"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
                <input
                  type="number"
                  min="1960"
                  max="2030"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-2 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AnimeType)}
                  className="w-full px-2 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="TV">TV</option>
                  <option value="Movie">Movie</option>
                  <option value="OVA">OVA</option>
                  <option value="ONA">ONA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Episodes</label>
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={episodes}
                  onChange={(e) => setEpisodes(e.target.value)}
                  placeholder="12"
                  className="w-full px-2 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-center font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WatchStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Completed">Completed</option>
                <option value="Watching">Watching</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>

          {/* 5 Core Scoring Categories */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  5 Core Scoring Categories
                </h3>
                <p className="text-xs text-slate-400">
                  Rate from 0.0 to 10.0 in 0.1 increments
                </p>
              </div>

              {/* Dynamic Overall Score & Tier Preview */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Calculated Score
                  </span>
                  <span className="text-xl font-mono font-bold text-white tabular-nums">
                    {liveOverallScore.toFixed(1)}
                  </span>
                </div>
                <div
                  className="px-2.5 py-1 text-xs font-mono font-bold rounded"
                  style={{
                    backgroundColor: tierConfig.bg,
                    color: tierConfig.color,
                    border: `1px solid ${tierConfig.border}`,
                  }}
                >
                  Tier {liveTier}
                </div>
              </div>
            </div>

            {/* The 5 sliders */}
            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const currentScore = scores[cat.key];
                return (
                  <div key={cat.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{cat.label}</span>
                        <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
                          ({cat.description})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-indigo-400 text-sm tabular-nums">
                        {currentScore.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={currentScore}
                        onChange={(e) =>
                          handleScoreChange(cat.key, parseFloat(e.target.value))
                        }
                        className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                        aria-label={`Score for ${cat.label}`}
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={currentScore}
                        onChange={(e) =>
                          handleScoreChange(cat.key, parseFloat(e.target.value) || 0)
                        }
                        className="w-14 px-1.5 py-1 text-xs font-mono text-center bg-slate-900 border border-slate-700 rounded text-slate-100"
                        aria-label={`Direct number input for ${cat.label}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fan Service Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${hasFanService ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">Fan Service Marking</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFanService}
                  onChange={(e) => setHasFanService(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                <span className="ml-2 text-xs font-medium text-slate-300">
                  {hasFanService ? 'Contains Fan Service' : 'Clean (No Fan Service)'}
                </span>
              </label>
            </div>

            {hasFanService && (
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Fan Service Intensity Level:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['mild', 'moderate', 'heavy'] as FanServiceLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFanServiceLevel(lvl)}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-lg border capitalize transition-colors ${
                          fanServiceLevel === lvl
                            ? 'bg-amber-600 border-amber-500 text-white shadow-sm'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lvl} {lvl === 'heavy' ? '(18+)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Fan Service Context / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={fanServiceNotes}
                    onChange={(e) => setFanServiceNotes(e.target.value)}
                    placeholder="e.g. Bathhouse scenes, ecchi humor, bouncing physics"
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Categorical Markers (Tags, including Isekai) */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">
                  Categorical Markers (e.g. Isekai, Shonen, etc.)
                </span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((ptag) => {
                const isSelected = tags.includes(ptag);
                const isIsekai = ptag.toLowerCase() === 'isekai';

                return (
                  <button
                    key={ptag}
                    type="button"
                    onClick={() => handleToggleTag(ptag)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                      isSelected
                        ? isIsekai
                          ? 'bg-amber-600 border-amber-400 text-white font-bold ring-2 ring-amber-400/30'
                          : 'bg-indigo-600 border-indigo-500 text-white'
                        : isIsekai
                        ? 'bg-amber-950/40 border-amber-800/80 text-amber-300 hover:bg-amber-900/40'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isIsekai ? '✨ Isekai' : ptag}
                    {isSelected && <Check className="w-3 h-3 ml-1 inline" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Marker Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="Add custom categorical marker (e.g. Reverse Isekai, Otome, Cyberpunk)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors shrink-0"
              >
                + Add Marker
              </button>
            </div>
          </div>

          {/* Personal Review Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Personal Review Notes / Why this score?
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What made this anime stand out or fall short in story, art, or soundtrack?"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
            >
              {initialAnime ? 'Save Score Updates' : 'Add to Anime Rankings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
