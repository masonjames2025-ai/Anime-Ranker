import React from 'react';
import { AnimeEntry, AnimeTier } from '../types/anime.ts';
import { CATEGORIES, TIER_CONFIG } from '../utils/scoring.ts';
import { Flame, ShieldCheck, Sparkles, Plus } from 'lucide-react';

interface TierMatrixViewProps {
  entries: AnimeEntry[];
  onSelectDetails: (anime: AnimeEntry) => void;
  onEdit: (anime: AnimeEntry) => void;
  onOpenAddModal: () => void;
}

export const TierMatrixView: React.FC<TierMatrixViewProps> = ({
  entries,
  onSelectDetails,
  onEdit,
  onOpenAddModal,
}) => {
  const tiers: AnimeTier[] = ['S', 'A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      {/* Intro info bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            <strong className="text-slate-200">Auto-Balancing Tier Matrix:</strong> Each anime is dynamically placed into tiers strictly calculated from the arithmetic mean of its 5 scoring categories.
          </span>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Matrix</span>
        </button>
      </div>

      {/* Tier Lanes */}
      <div className="space-y-4">
        {tiers.map((tierKey) => {
          const config = TIER_CONFIG[tierKey];
          const tierEntries = entries.filter((e) => e.tier === tierKey);
          const isekaiInTier = tierEntries.filter((e) =>
            e.tags.some((t) => t.toLowerCase() === 'isekai')
          ).length;
          const fanServiceInTier = tierEntries.filter((e) => e.hasFanService).length;

          return (
            <div
              key={tierKey}
              className="flex flex-col lg:flex-row items-stretch bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-md"
            >
              {/* Left Column: Tier Brand Badge */}
              <div
                className="w-full lg:w-44 p-4 flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800"
                style={{
                  backgroundColor: `${config.bg}`,
                  borderLeft: `4px solid ${config.color}`,
                }}
              >
                <div>
                  <div className="flex items-center justify-between lg:justify-start gap-2">
                    <span
                      className="text-3xl font-mono font-black tracking-tight"
                      style={{ color: config.color }}
                    >
                      {tierKey}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      {config.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                    {config.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold tabular-nums">
                    {tierEntries.length} {tierEntries.length === 1 ? 'anime' : 'animes'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px]">
                    {isekaiInTier > 0 && (
                      <span className="text-amber-400 font-semibold" title="Isekai count in this tier">
                        {isekaiInTier} Isekai
                      </span>
                    )}
                    {fanServiceInTier > 0 && (
                      <span className="text-orange-400 font-semibold" title="Fan service count in this tier">
                        {fanServiceInTier} FS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Cards in this Tier */}
              <div className="flex-1 p-3 sm:p-4 bg-slate-950/40">
                {tierEntries.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 italic">
                    No anime currently in Tier {tierKey}. Adjust scores or add a new entry.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {tierEntries.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectDetails(item)}
                        className="group relative p-3 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                              <span>{item.year}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.studio || item.type}</span>
                              {item.tags.some((t) => t.toLowerCase() === 'isekai') && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-amber-300 font-semibold">Isekai</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-base font-mono font-bold text-white tabular-nums">
                              {item.overallScore.toFixed(1)}
                            </span>
                            {item.hasFanService ? (
                              <span
                                className="flex items-center gap-0.5 text-[10px] text-amber-400 font-medium"
                                title={`Fan service: ${item.fanServiceLevel}`}
                              >
                                <Flame className="w-2.5 h-2.5" />
                                <span>FS</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400/80 font-medium">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Clean</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mini 5-bar radar / breakdown strip */}
                        <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-center">
                          {CATEGORIES.map((cat) => (
                            <div key={cat.key} className="bg-slate-950/70 p-1 rounded">
                              <div className="text-slate-400 text-[9px] uppercase truncate">
                                {cat.shortLabel}
                              </div>
                              <div className="font-semibold text-slate-200 tabular-nums">
                                {item.scores[cat.key].toFixed(1)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
