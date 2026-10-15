import type { AnimeEntry, AnimeScores, AnimeTier, FilterState, SortField } from '../types/anime.ts';

export const CATEGORIES: Array<{ key: keyof AnimeScores; label: string; description: string; shortLabel: string }> = [
  {
    key: 'artStyle',
    label: 'Art Style',
    shortLabel: 'Art',
    description: 'Visual aesthetics, character design, color palette, background design, and line work.',
  },
  {
    key: 'story',
    label: 'Story',
    shortLabel: 'Story',
    description: 'Plot pacing, narrative cohesion, themes, world-building, climax, and emotional payoff.',
  },
  {
    key: 'characterDevelopment',
    label: 'Character Development',
    shortLabel: 'Characters',
    description: 'Protagonist growth, complex motives, interpersonal dynamics, supporting cast depth.',
  },
  {
    key: 'soundtrack',
    label: 'Soundtrack',
    shortLabel: 'OST',
    description: 'Original score, OP/ED songs, ambient sound design, voice acting impact.',
  },
  {
    key: 'animation',
    label: 'Animation',
    shortLabel: 'Animation',
    description: 'Fluidity, combat choreography, sakuga cuts, cinematography, and camera direction.',
  },
];

export const TIER_CONFIG: Record<AnimeTier, { label: string; description: string; color: string; bg: string; border: string }> = {
  S: {
    label: 'Masterpiece',
    description: 'Near-flawless execution across multiple categories (9.0 - 10.0)',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: '#f59e0b',
  },
  A: {
    label: 'Great',
    description: 'Exceptional anime with strong highlights (8.0 - 8.9)',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: '#3b82f6',
  },
  B: {
    label: 'Good',
    description: 'Solid, enjoyable watch with distinct merits (7.0 - 7.9)',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: '#10b981',
  },
  C: {
    label: 'Mediocre',
    description: 'Average or inconsistent execution (5.5 - 6.9)',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: '#a855f7',
  },
  D: {
    label: 'Flawed',
    description: 'Significant weaknesses or unengaging narrative (< 5.5)',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: '#ef4444',
  },
};

export const PRESET_TAGS = [
  'Isekai',
  'Shonen',
  'Seinen',
  'Psychological',
  'Dark Fantasy',
  'Action',
  'Sci-Fi',
  'Cyberpunk',
  'Romance',
  'Mecha',
  'Slice of Life',
  'Supernatural',
  'Comedy',
  'Mystery',
  'Thriller',
  'Historical',
];

/**
 * Calculates the arithmetic mean across all 5 categories, rounded to 1 decimal place.
 */
export function calculateOverallScore(scores: AnimeScores): number {
  const sum =
    Number(scores.artStyle) +
    Number(scores.story) +
    Number(scores.characterDevelopment) +
    Number(scores.soundtrack) +
    Number(scores.animation);
  const avg = sum / 5;
  return Math.round(avg * 10) / 10;
}

/**
 * Maps an overall score to a tier.
 */
export function calculateTier(overallScore: number): AnimeTier {
  if (overallScore >= 9.0) return 'S';
  if (overallScore >= 8.0) return 'A';
  if (overallScore >= 7.0) return 'B';
  if (overallScore >= 5.5) return 'C';
  return 'D';
}

/**
 * Determines which category is the highest score for an anime.
 */
export function getFavoriteAspect(scores: AnimeScores): keyof AnimeScores {
  let highestKey: keyof AnimeScores = 'story';
  let highestVal = -1;

  for (const cat of CATEGORIES) {
    const val = scores[cat.key];
    if (val > highestVal) {
      highestVal = val;
      highestKey = cat.key;
    }
  }

  return highestKey;
}

/**
 * Filters anime entries based on the current filter state.
 */
export function filterAnime(entries: AnimeEntry[], filter: FilterState): AnimeEntry[] {
  return entries.filter((item) => {
    // 1. Text Search (title, japanese title, studio, tags)
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchJap = item.japaneseTitle?.toLowerCase().includes(q) ?? false;
      const matchStudio = item.studio?.toLowerCase().includes(q) ?? false;
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchJap && !matchStudio && !matchTag) {
        return false;
      }
    }

    // 2. Tier Filter
    if (filter.tier !== 'all' && item.tier !== filter.tier) {
      return false;
    }

    // 3. Status Filter
    if (filter.status !== 'all' && item.status !== filter.status) {
      return false;
    }

    // 4. Fan Service Filter
    if (filter.fanServiceFilter === 'fan_service_only') {
      if (!item.hasFanService) return false;
    } else if (filter.fanServiceFilter === 'no_fan_service') {
      if (item.hasFanService) return false;
    } else if (filter.fanServiceFilter === 'heavy_only') {
      if (item.fanServiceLevel !== 'heavy') return false;
    }

    // 5. Selected Tags (e.g. Isekai, etc.)
    if (filter.selectedTags.length > 0) {
      const hasAllTags = filter.selectedTags.every((reqTag) =>
        item.tags.some((t) => t.toLowerCase() === reqTag.toLowerCase())
      );
      if (!hasAllTags) return false;
    }

    // 6. Minimum Overall Score
    if (filter.minOverallScore > 0 && item.overallScore < filter.minOverallScore) {
      return false;
    }

    // 7. Minimum Specific Category Score
    if (filter.minCategoryScore.category !== 'none') {
      const catKey = filter.minCategoryScore.category;
      if (item.scores[catKey] < filter.minCategoryScore.minScore) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts anime entries based on sort field and order.
 */
export function sortAnime(entries: AnimeEntry[], field: SortField, order: 'desc' | 'asc'): AnimeEntry[] {
  return [...entries].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'overallScore':
        comparison = a.overallScore - b.overallScore;
        break;
      case 'artStyle':
        comparison = a.scores.artStyle - b.scores.artStyle;
        break;
      case 'story':
        comparison = a.scores.story - b.scores.story;
        break;
      case 'characterDevelopment':
        comparison = a.scores.characterDevelopment - b.scores.characterDevelopment;
        break;
      case 'soundtrack':
        comparison = a.scores.soundtrack - b.scores.soundtrack;
        break;
      case 'animation':
        comparison = a.scores.animation - b.scores.animation;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'year':
        comparison = a.year - b.year;
        break;
    }

    return order === 'desc' ? -comparison : comparison;
  });
}

/**
 * Combines filtering and sorting in one deterministic pipeline.
 */
export function filterAndSortAnime(entries: AnimeEntry[], filter: FilterState): AnimeEntry[] {
  const filtered = filterAnime(entries, filter);
  return sortAnime(filtered, filter.sortBy, filter.sortOrder);
}

/**
 * Calculates summary metrics across library.
 */
export function calculateLibraryStats(entries: AnimeEntry[]) {
  if (entries.length === 0) {
    return {
      total: 0,
      avgOverall: 0,
      avgArtStyle: 0,
      avgStory: 0,
      avgCharacters: 0,
      avgSoundtrack: 0,
      avgAnimation: 0,
      isekaiCount: 0,
      fanServiceCount: 0,
      tierCounts: { S: 0, A: 0, B: 0, C: 0, D: 0 } as Record<AnimeTier, number>,
      topRated: null as AnimeEntry | null,
    };
  }

  let totalOverall = 0;
  let totalArt = 0;
  let totalStory = 0;
  let totalChars = 0;
  let totalOST = 0;
  let totalAnim = 0;
  let isekaiCount = 0;
  let fanServiceCount = 0;
  const tierCounts: Record<AnimeTier, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };

  let topRated: AnimeEntry = entries[0];

  for (const item of entries) {
    totalOverall += item.overallScore;
    totalArt += item.scores.artStyle;
    totalStory += item.scores.story;
    totalChars += item.scores.characterDevelopment;
    totalOST += item.scores.soundtrack;
    totalAnim += item.scores.animation;

    if (item.tags.some((t) => t.toLowerCase() === 'isekai')) {
      isekaiCount++;
    }
    if (item.hasFanService) {
      fanServiceCount++;
    }

    tierCounts[item.tier] = (tierCounts[item.tier] || 0) + 1;

    if (item.overallScore > topRated.overallScore) {
      topRated = item;
    }
  }

  const count = entries.length;
  return {
    total: count,
    avgOverall: Math.round((totalOverall / count) * 10) / 10,
    avgArtStyle: Math.round((totalArt / count) * 10) / 10,
    avgStory: Math.round((totalStory / count) * 10) / 10,
    avgCharacters: Math.round((totalChars / count) * 10) / 10,
    avgSoundtrack: Math.round((totalOST / count) * 10) / 10,
    avgAnimation: Math.round((totalAnim / count) * 10) / 10,
    isekaiCount,
    fanServiceCount,
    tierCounts,
    topRated,
  };
}
