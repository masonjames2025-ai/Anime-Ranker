import React from 'react';
import { X, Flame, ShieldCheck, Edit3, Trash2, Tag, Calendar, Film, Sparkles, Building2 } from 'lucide-react';
import { AnimeEntry } from '../types/anime.ts';
import { CATEGORIES, TIER_CONFIG } from '../utils/scoring.ts';

interface AnimeDetailsModalProps {
  anime: AnimeEntry | null;
  onClose: () => void;
  onEdit: (anime: AnimeEntry) => void;
  onDelete: (id: string) => void;
}

export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({
  anime,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!anime) return null;

  const tierInfo = TIER_CONFIG[anime.tier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Banner with Japanese title watermark */}
        <div
          className="relative h-36 px-6 py-4 flex flex-col justify-between overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${anime.themeColor}33 0%, #0b0f19 100%)`,
            borderBottom: `2px solid ${tierInfo.color}`,
          }}
        >
          {anime.japaneseTitle && (
            <div
              className="absolute right-3 -bottom-2 text-5xl font-bold text-slate-800/40 select-none pointer-events-none truncate max-w-[80%]"
              aria-hidden="true"
            >
              {anime.japaneseTitle}
            </div>
          )}

          <div className="relative z-10 flex items-center justify-between">
            <span
              className="px-2.5 py-1 text-xs font-mono font-bold rounded"
              style={{
                backgroundColor: tierInfo.bg,
                color: tierInfo.color,
                border: `1px solid ${tierInfo.border}`,
              }}
            >
              Tier {anime.tier} · {tierInfo.label}
            </span>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close anime details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-extrabold text-white line-clamp-1">
              {anime.title}
            </h2>
            {anime.japaneseTitle && (
              <p className="text-xs text-slate-400 font-medium">
                {anime.japaneseTitle}
              </p>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-slate-500 block mb-0.5">Year & Type</span>
              <span className="font-semibold text-slate-200">
                {anime.year} · {anime.type}
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-slate-500 block mb-0.5">Studio</span>
              <span className="font-semibold text-slate-200 truncate block">
                {anime.studio || 'N/A'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-slate-500 block mb-0.5">Episodes</span>
              <span className="font-semibold text-slate-200 font-mono">
                {anime.episodes ? `${anime.episodes} eps` : 'N/A'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-slate-500 block mb-0.5">Watch Status</span>
              <span className="font-semibold text-slate-200">{anime.status}</span>
            </div>
          </div>

          {/* Overall Score Banner */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Arithmetic Mean Overall Score
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated from 5 equal category weights
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-black text-white tabular-nums">
                {anime.overallScore.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-slate-500">/10</span>
            </div>
          </div>

          {/* 5 Core Scoring Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              5 Core Category Scores
            </h3>

            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const score = anime.scores[cat.key];
                const pct = (score / 10) * 100;
                const isFavorite = anime.favoriteAspect === cat.key;

                return (
                  <div
                    key={cat.key}
                    className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{cat.label}</span>
                        {isFavorite && (
                          <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Highest Highlight
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-sm text-indigo-400 tabular-nums">
                        {score.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 10</span>
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">
                      {cat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fan Service Breakdown */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Fan Service Assessment
            </span>
            {anime.hasFanService ? (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Flame className="w-4 h-4" />
                  <span>Flagged for Fan Service ({anime.fanServiceLevel.toUpperCase()})</span>
                </div>
                {anime.fanServiceNotes && (
                  <p className="text-xs text-slate-300 mt-1 italic">
                    "{anime.fanServiceNotes}"
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Clean presentation · No notable fan service content</span>
              </div>
            )}
          </div>

          {/* Categorical Markers (Tags) */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categorical Markers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {anime.tags.map((t) => {
                const isIsekai = t.toLowerCase() === 'isekai';
                return (
                  <span
                    key={t}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium ${
                      isIsekai
                        ? 'bg-amber-600/30 text-amber-300 border border-amber-500 font-bold'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isIsekai ? '✨ Isekai' : t}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Review Notes */}
          {anime.notes && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal Review Notes
              </span>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {anime.notes}
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onDelete(anime.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Entry</span>
            </button>

            <button
              onClick={() => {
                onEdit(anime);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/20"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Scores & Markers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
