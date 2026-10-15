import React from 'react';
import { AnimeEntry, SortField, SortOrder } from '../types/anime.ts';
import { CATEGORIES, TIER_CONFIG } from '../utils/scoring.ts';
import { ArrowUpDown, Flame, ShieldCheck, Edit3, Trash2 } from 'lucide-react';

interface TableViewProps {
  entries: AnimeEntry[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onSelectDetails: (anime: AnimeEntry) => void;
  onEdit: (anime: AnimeEntry) => void;
  onDelete: (id: string) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  entries,
  sortBy,
  sortOrder,
  onSortChange,
  onSelectDetails,
  onEdit,
  onDelete,
}) => {
  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600 inline ml-1 opacity-0 group-hover:opacity-100" />;
    }
    return (
      <span className="inline ml-1 font-mono text-indigo-400">
        {sortOrder === 'desc' ? '↓' : '↑'}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold select-none">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th
                onClick={() => onSortChange('title')}
                className="py-3 px-3 cursor-pointer hover:text-slate-200 group"
              >
                <span>Anime Title</span>
                {renderSortIndicator('title')}
              </th>
              <th
                onClick={() => onSortChange('year')}
                className="py-3 px-2 cursor-pointer hover:text-slate-200 text-center group"
              >
                <span>Year</span>
                {renderSortIndicator('year')}
              </th>
              <th className="py-3 px-2 text-center">Tier</th>
              <th
                onClick={() => onSortChange('overallScore')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 group font-bold text-slate-200"
              >
                <span>Overall</span>
                {renderSortIndicator('overallScore')}
              </th>
              <th
                onClick={() => onSortChange('artStyle')}
                className="py-3 px-2 text-right cursor-pointer hover:text-slate-200 group"
              >
                <span>Art</span>
                {renderSortIndicator('artStyle')}
              </th>
              <th
                onClick={() => onSortChange('story')}
                className="py-3 px-2 text-right cursor-pointer hover:text-slate-200 group"
              >
                <span>Story</span>
                {renderSortIndicator('story')}
              </th>
              <th
                onClick={() => onSortChange('characterDevelopment')}
                className="py-3 px-2 text-right cursor-pointer hover:text-slate-200 group"
              >
                <span>Characters</span>
                {renderSortIndicator('characterDevelopment')}
              </th>
              <th
                onClick={() => onSortChange('soundtrack')}
                className="py-3 px-2 text-right cursor-pointer hover:text-slate-200 group"
              >
                <span>OST</span>
                {renderSortIndicator('soundtrack')}
              </th>
              <th
                onClick={() => onSortChange('animation')}
                className="py-3 px-2 text-right cursor-pointer hover:text-slate-200 group"
              >
                <span>Animation</span>
                {renderSortIndicator('animation')}
              </th>
              <th className="py-3 px-3 text-center">Fan Service</th>
              <th className="py-3 px-3">Markers & Tags</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-500 italic">
                  No anime match the current filter criteria.
                </td>
              </tr>
            ) : (
              entries.map((anime, index) => {
                const tierInfo = TIER_CONFIG[anime.tier];
                return (
                  <tr
                    key={anime.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-2.5 px-3 font-mono text-center text-slate-500 tabular-nums">
                      {index + 1}
                    </td>

                    {/* Title */}
                    <td className="py-2.5 px-3">
                      <div
                        onClick={() => onSelectDetails(anime)}
                        className="font-bold text-slate-100 hover:text-indigo-400 cursor-pointer line-clamp-1"
                        title={anime.title}
                      >
                        {anime.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        {anime.studio || anime.japaneseTitle || anime.type}
                      </div>
                    </td>

                    {/* Year */}
                    <td className="py-2.5 px-2 font-mono text-center text-slate-400 tabular-nums">
                      {anime.year}
                    </td>

                    {/* Tier */}
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: tierInfo.bg,
                          color: tierInfo.color,
                        }}
                      >
                        {anime.tier}
                      </span>
                    </td>

                    {/* Overall Score */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-sm text-white tabular-nums">
                      {anime.overallScore.toFixed(1)}
                    </td>

                    {/* 5 Categories */}
                    <td className="py-2.5 px-2 text-right font-mono text-slate-300 tabular-nums">
                      {anime.scores.artStyle.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-300 tabular-nums">
                      {anime.scores.story.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-300 tabular-nums">
                      {anime.scores.characterDevelopment.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-300 tabular-nums">
                      {anime.scores.soundtrack.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-300 tabular-nums">
                      {anime.scores.animation.toFixed(1)}
                    </td>

                    {/* Fan Service */}
                    <td className="py-2.5 px-3 text-center">
                      {anime.hasFanService ? (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/60"
                          title={anime.fanServiceNotes || anime.fanServiceLevel}
                        >
                          <Flame className="w-2.5 h-2.5 text-amber-400" />
                          <span>{anime.fanServiceLevel.toUpperCase()}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400/80">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Clean</span>
                        </span>
                      )}
                    </td>

                    {/* Markers & Tags */}
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {anime.tags.map((t) => {
                          const isIsekai = t.toLowerCase() === 'isekai';
                          return (
                            <span
                              key={t}
                              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                isIsekai
                                  ? 'bg-amber-950 text-amber-300 border border-amber-600/70 font-bold'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isIsekai ? '✨ Isekai' : t}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(anime)}
                          className="p-1 hover:bg-slate-700 text-slate-400 hover:text-indigo-300 rounded transition-colors"
                          title="Edit anime scores"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(anime.id)}
                          className="p-1 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded transition-colors"
                          title="Delete anime"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
