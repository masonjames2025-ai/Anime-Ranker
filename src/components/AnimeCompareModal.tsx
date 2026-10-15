import React, { useState } from 'react';
import { X, GitCompare, Flame, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { AnimeEntry } from '../types/anime.ts';
import { CATEGORIES, TIER_CONFIG } from '../utils/scoring.ts';

interface AnimeCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AnimeEntry[];
  initialAnimeA?: AnimeEntry | null;
  initialAnimeB?: AnimeEntry | null;
}

export const AnimeCompareModal: React.FC<AnimeCompareModalProps> = ({
  isOpen,
  onClose,
  entries,
  initialAnimeA,
  initialAnimeB,
}) => {
  if (!isOpen) return null;

  const [idA, setIdA] = useState<string>(
    initialAnimeA?.id || entries[0]?.id || ''
  );
  const [idB, setIdB] = useState<string>(
    initialAnimeB?.id || entries[1]?.id || entries[0]?.id || ''
  );

  const animeA = entries.find((e) => e.id === idA) || entries[0];
  const animeB = entries.find((e) => e.id === idB) || entries[1] || entries[0];

  if (!animeA || !animeB) return null;

  const tierA = TIER_CONFIG[animeA.tier];
  const tierB = TIER_CONFIG[animeB.tier];

  const overallDiff = animeA.overallScore - animeB.overallScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Head-to-Head 5-Category Showdown
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Anime Selection Header */}
          <div className="grid grid-cols-2 gap-4">
            {/* Anime A Picker */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Anime A
              </label>
              <select
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 font-bold"
              >
                {entries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.overallScore.toFixed(1)})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span
                  className="px-2 py-0.5 rounded font-mono font-bold"
                  style={{ backgroundColor: tierA.bg, color: tierA.color }}
                >
                  Tier {animeA.tier}
                </span>
                <span className="font-mono font-black text-xl text-white tabular-nums">
                  {animeA.overallScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Anime B Picker */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Anime B
              </label>
              <select
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 font-bold"
              >
                {entries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.overallScore.toFixed(1)})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span
                  className="px-2 py-0.5 rounded font-mono font-bold"
                  style={{ backgroundColor: tierB.bg, color: tierB.color }}
                >
                  Tier {animeB.tier}
                </span>
                <span className="font-mono font-black text-xl text-white tabular-nums">
                  {animeB.overallScore.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Score Delta Callout */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            {overallDiff === 0 ? (
              <span className="text-xs font-bold text-slate-300">
                Identical Overall Score ({animeA.overallScore.toFixed(1)})
              </span>
            ) : overallDiff > 0 ? (
              <span className="text-xs font-bold text-indigo-400">
                🏆 {animeA.title} leads overall by +{overallDiff.toFixed(1)} points
              </span>
            ) : (
              <span className="text-xs font-bold text-purple-400">
                🏆 {animeB.title} leads overall by +{Math.abs(overallDiff).toFixed(1)} points
              </span>
            )}
          </div>

          {/* 5 Categories Head-to-Head */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              5 Categories Category-by-Category Delta
            </h3>

            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const scoreA = animeA.scores[cat.key];
                const scoreB = animeB.scores[cat.key];
                const delta = scoreA - scoreB;

                return (
                  <div
                    key={cat.key}
                    className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-indigo-400 text-sm tabular-nums">
                        {scoreA.toFixed(1)}
                      </span>
                      <span className="font-bold text-slate-200">
                        {cat.label}
                      </span>
                      <span className="font-mono font-bold text-purple-400 text-sm tabular-nums">
                        {scoreB.toFixed(1)}
                      </span>
                    </div>

                    {/* Dual comparison bar */}
                    <div className="flex items-center gap-2">
                      {/* Bar A */}
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex justify-end">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(scoreA / 10) * 100}%` }}
                        />
                      </div>
                      {/* Delta center badge */}
                      <div className="w-14 text-center shrink-0">
                        <span
                          className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            delta > 0
                              ? 'text-indigo-300 bg-indigo-950/60'
                              : delta < 0
                              ? 'text-purple-300 bg-purple-950/60'
                              : 'text-slate-400 bg-slate-800'
                          }`}
                        >
                          {delta > 0 ? `+${delta.toFixed(1)}` : delta < 0 ? delta.toFixed(1) : '='}
                        </span>
                      </div>
                      {/* Bar B */}
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(scoreB / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fan Service & Markers comparison */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            {/* A details */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-slate-300 block">{animeA.title}</span>
              <div>
                <span className="text-[11px] text-slate-500 block">Fan Service:</span>
                {animeA.hasFanService ? (
                  <span className="text-amber-400 flex items-center gap-1 font-semibold">
                    <Flame className="w-3 h-3" />
                    <span>{animeA.fanServiceLevel.toUpperCase()}</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Clean</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {animeA.tags.map((t) => (
                  <span
                    key={t}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      t.toLowerCase() === 'isekai'
                        ? 'bg-amber-950 text-amber-300 font-bold border border-amber-600/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* B details */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-slate-300 block">{animeB.title}</span>
              <div>
                <span className="text-[11px] text-slate-500 block">Fan Service:</span>
                {animeB.hasFanService ? (
                  <span className="text-amber-400 flex items-center gap-1 font-semibold">
                    <Flame className="w-3 h-3" />
                    <span>{animeB.fanServiceLevel.toUpperCase()}</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Clean</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {animeB.tags.map((t) => (
                  <span
                    key={t}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      t.toLowerCase() === 'isekai'
                        ? 'bg-amber-950 text-amber-300 font-bold border border-amber-600/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
