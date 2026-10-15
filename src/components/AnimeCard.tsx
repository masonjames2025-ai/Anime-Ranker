import React from 'react';
import { Flame, ShieldCheck, Edit3, Trash2, GitCompare, Star, Film, Sparkles } from 'lucide-react';
import { AnimeEntry } from '../types/anime.ts';
import { CATEGORIES, TIER_CONFIG } from '../utils/scoring.ts';

interface AnimeCardProps {
  anime: AnimeEntry;
  rank: number;
  onEdit: (anime: AnimeEntry) => void;
  onDelete: (id: string) => void;
  onCompareToggle: (anime: AnimeEntry) => void;
  isComparing: boolean;
  onSelectDetails: (anime: AnimeEntry) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  rank,
  onEdit,
  onDelete,
  onCompareToggle,
  isComparing,
  onSelectDetails,
}) => {
  const tierInfo = TIER_CONFIG[anime.tier];

  // Helper for category color
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-amber-400';
    if (score >= 8.0) return 'text-blue-400';
    if (score >= 7.0) return 'text-emerald-400';
    if (score >= 5.5) return 'text-purple-400';
    return 'text-rose-400';
  };

  const getScoreBarBg = (score: number) => {
    if (score >= 9.0) return 'bg-amber-400';
    if (score >= 8.0) return 'bg-blue-400';
    if (score >= 7.0) return 'bg-emerald-400';
    if (score >= 5.5) return 'bg-purple-400';
    return 'bg-rose-400';
  };

  return (
    <div
      className="group relative flex flex-col bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-200"
      style={{
        borderTop: `3px solid ${tierInfo.color}`,
      }}
    >
      {/* Top Banner / Visual Header */}
      <div
        className="relative h-28 px-4 py-3 flex flex-col justify-between overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${anime.themeColor}22 0%, #0f172a 100%)`,
        }}
      >
        {/* Japanese Title Background Watermark / Accent */}
        {anime.japaneseTitle && (
          <div
            className="absolute right-2 -bottom-2 text-4xl sm:text-5xl font-bold text-slate-800/40 select-none pointer-events-none truncate max-w-[80%]"
            aria-hidden="true"
          >
            {anime.japaneseTitle.split(' ')[0]}
          </div>
        )}

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Rank + Tier Badge */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums">
              #{rank}
            </span>
            <span
              className="px-2 py-0.5 text-xs font-mono font-bold rounded"
              style={{
                backgroundColor: tierInfo.bg,
                color: tierInfo.color,
                border: `1px solid ${tierInfo.border}50`,
              }}
            >
              Tier {anime.tier}
            </span>
          </div>

          {/* Fan Service Indicator */}
          <div>
            {anime.hasFanService ? (
              <span
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/60 rounded"
                title={anime.fanServiceNotes || `Fan Service Level: ${anime.fanServiceLevel}`}
              >
                <Flame className="w-3 h-3 text-amber-400" />
                <span>FS: {anime.fanServiceLevel.toUpperCase()}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium bg-slate-950/70 text-slate-400 border border-slate-800 rounded">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Clean</span>
              </span>
            )}
          </div>
        </div>

        {/* Anime Title & Meta */}
        <div className="relative z-10">
          <h3
            onClick={() => onSelectDetails(anime)}
            className="text-base font-bold text-slate-100 hover:text-indigo-300 cursor-pointer transition-colors line-clamp-1"
            title={anime.title}
          >
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>{anime.year}</span>
            <span aria-hidden="true">·</span>
            <span>{anime.type}</span>
            {anime.studio && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[120px]">{anime.studio}</span>
              </>
            )}
            {anime.episodes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{anime.episodes} eps</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Body: Overall Score + 5 Categories Breakdown */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Overall Score Highlight */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Overall Score
            </div>
            <div className="text-xs text-slate-400">
              {tierInfo.label}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold tracking-tight text-white tabular-nums">
              {anime.overallScore.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">/10</span>
          </div>
        </div>

        {/* 5 Core Categories Grid */}
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const score = anime.scores[cat.key];
            const percent = Math.min(100, Math.max(0, (score / 10) * 100));
            const isHighest = anime.favoriteAspect === cat.key;

            return (
              <div key={cat.key} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`flex items-center gap-1 font-medium ${isHighest ? 'text-indigo-300 font-semibold' : 'text-slate-300'}`}>
                    {cat.label}
                    {isHighest && <Sparkles className="w-2.5 h-2.5 text-indigo-400 inline" />}
                  </span>
                  <span className={`font-mono font-semibold tabular-nums ${getScoreColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                </div>
                {/* Score bar */}
                <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getScoreBarBg(score)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Categorical Markers (Tags) */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            {anime.tags.map((tag) => {
              const isIsekai = tag.toLowerCase() === 'isekai';
              return (
                <span
                  key={tag}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    isIsekai
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-600/70 font-bold'
                      : 'bg-slate-800/70 text-slate-300 border border-slate-700/50'
                  }`}
                >
                  {isIsekai ? '✨ Isekai' : tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => onCompareToggle(anime)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              isComparing
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            aria-label={`Compare ${anime.title}`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(anime)}
              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
              aria-label={`Edit ${anime.title} scores`}
              title="Edit scores and markers"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(anime.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
              aria-label={`Delete ${anime.title}`}
              title="Delete anime"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
