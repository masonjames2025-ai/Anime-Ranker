import React, { useState } from 'react';
import { AnimeEntry, AnimeScores } from '../types/anime.ts';
import { CATEGORIES, TIER_CONFIG } from '../utils/scoring.ts';
import { Trophy, Sparkles, Flame, Award, ChevronRight } from 'lucide-react';

interface CategoryLeadersViewProps {
  entries: AnimeEntry[];
  onSelectDetails: (anime: AnimeEntry) => void;
  onEdit: (anime: AnimeEntry) => void;
}

export const CategoryLeadersView: React.FC<CategoryLeadersViewProps> = ({
  entries,
  onSelectDetails,
  onEdit,
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400">
          <Trophy className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">No Category Leaders Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start scoring the anime you've watched! Once you score a few anime across the 5 categories (Art Style, Story, Characters, Soundtrack, and Animation), their champions and 5-axis radars will show up here.
        </p>
      </div>
    );
  }

  const [selectedRadarId, setSelectedRadarId] = useState<string>(
    entries[0]?.id || ''
  );

  const selectedAnime = entries.find((e) => e.id === selectedRadarId) || entries[0];

  // Find leader for each category
  const leaders = CATEGORIES.map((cat) => {
    let topAnime = entries[0];
    let topScore = -1;

    for (const item of entries) {
      if (item.scores[cat.key] > topScore) {
        topScore = item.scores[cat.key];
        topAnime = item;
      }
    }

    return {
      category: cat,
      anime: topAnime,
      score: topScore,
    };
  });

  // Top Isekai
  const isekaiEntries = entries.filter((e) =>
    e.tags.some((t) => t.toLowerCase() === 'isekai')
  );
  const topIsekai = isekaiEntries.sort((a, b) => b.overallScore - a.overallScore).slice(0, 3);

  // SVG Radar Polygon calculations
  const radarRadius = 80;
  const radarCenter = 100;
  const numAxes = CATEGORIES.length; // 5

  const getCoordinates = (index: number, score: number) => {
    // 0 is top (-pi/2)
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const distance = (score / 10) * radarRadius;
    const x = radarCenter + distance * Math.cos(angle);
    const y = radarCenter + distance * Math.sin(angle);
    return { x, y };
  };

  const radarPoints = selectedAnime
    ? CATEGORIES.map((cat, idx) => {
        const { x, y } = getCoordinates(idx, selectedAnime.scores[cat.key]);
        return `${x},${y}`;
      }).join(' ')
    : '';

  return (
    <div className="space-y-8">
      {/* 5 Category Champions Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-slate-100">
            Hall of Fame: 5 Core Category Champions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {leaders.map(({ category, anime, score }) => {
            if (!anime) return null;
            const tierInfo = TIER_CONFIG[anime.tier];

            return (
              <div
                key={category.key}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-indigo-400 mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{category.label}</span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-mono font-bold text-white tabular-nums">
                      {score.toFixed(1)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">/ 10.0</span>
                  </div>

                  <h3
                    onClick={() => onSelectDetails(anime)}
                    className="text-sm font-bold text-slate-100 hover:text-indigo-300 cursor-pointer line-clamp-1 mb-1"
                    title={anime.title}
                  >
                    {anime.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Overall: <span className="font-mono font-semibold text-slate-300">{anime.overallScore.toFixed(1)}</span></span>
                  <button
                    onClick={() => setSelectedRadarId(anime.id)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium text-[11px] flex items-center"
                  >
                    Inspect Radar &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Interactive 5-Axis Radar Visualizer + Top Isekai Podium */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5-Axis Pentagonal Radar Analyzer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>5-Axis Category Radar Visualizer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect score distribution and relative category weight
              </p>
            </div>

            <select
              value={selectedRadarId}
              onChange={(e) => setSelectedRadarId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              aria-label="Select anime for radar visualization"
            >
              {entries.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.overallScore.toFixed(1)})
                </option>
              ))}
            </select>
          </div>

          {selectedAnime && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Pentagonal Radar SVG */}
              <div className="relative w-[210px] h-[210px] shrink-0">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full overflow-visible"
                >
                  {/* Concentric grid rings (2, 4, 6, 8, 10) */}
                  {[2, 4, 6, 8, 10].map((ringLevel) => {
                    const points = CATEGORIES.map((_, idx) => {
                      const { x, y } = getCoordinates(idx, ringLevel);
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <polygon
                        key={ringLevel}
                        points={points}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="1"
                        strokeDasharray={ringLevel === 10 ? 'none' : '2,2'}
                      />
                    );
                  })}

                  {/* 5 Axis Spokes */}
                  {CATEGORIES.map((_, idx) => {
                    const { x, y } = getCoordinates(idx, 10);
                    return (
                      <line
                        key={idx}
                        x1={radarCenter}
                        y1={radarCenter}
                        x2={x}
                        y2={y}
                        stroke="#334155"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Filled Radar Area */}
                  <polygon
                    points={radarPoints}
                    fill="rgba(99, 102, 241, 0.35)"
                    stroke="#818cf8"
                    strokeWidth="2"
                  />

                  {/* Data Points */}
                  {CATEGORIES.map((cat, idx) => {
                    const { x, y } = getCoordinates(idx, selectedAnime.scores[cat.key]);
                    return (
                      <circle
                        key={cat.key}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#c7d2fe"
                        stroke="#4f46e5"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Category Breakdown Table */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {selectedAnime.title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      Tier {selectedAnime.tier} · {selectedAnime.year}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                      {selectedAnime.overallScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono"> / 10</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.key} className="flex items-center justify-between py-1 px-2 rounded bg-slate-950/50">
                      <span className="text-slate-300 font-medium">{cat.label}</span>
                      <span className="font-mono font-bold text-slate-100 tabular-nums">
                        {selectedAnime.scores[cat.key].toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Isekai Rankings & Fan Service Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="text-amber-400">✨</span>
              <span>Top Isekai Rankings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standouts categorized under the Isekai marker
            </p>
          </div>

          <div className="space-y-2">
            {topIsekai.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectDetails(item)}
                className="flex items-center justify-between p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>Tier {item.tier}</span>
                      <span aria-hidden="true">·</span>
                      {item.hasFanService ? (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" />
                          <span>FS: {item.fanServiceLevel}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400">Clean</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {item.overallScore.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400">
              Total Isekai entries: <strong className="text-slate-200">{isekaiEntries.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
