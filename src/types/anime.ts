export interface AnimeScores {
  artStyle: number;
  story: number;
  characterDevelopment: number;
  soundtrack: number;
  animation: number;
}

export type FanServiceLevel = 'none' | 'mild' | 'moderate' | 'heavy';

export type AnimeTier = 'S' | 'A' | 'B' | 'C' | 'D';

export type AnimeType = 'TV' | 'Movie' | 'OVA' | 'ONA';

export type WatchStatus = 'Completed' | 'Watching' | 'Plan to Watch' | 'Dropped';

export interface AnimeEntry {
  id: string;
  title: string;
  japaneseTitle?: string;
  year: number;
  type: AnimeType;
  episodes?: number;
  studio?: string;
  themeColor: string;
  scores: AnimeScores;
  overallScore: number;
  tier: AnimeTier;
  hasFanService: boolean;
  fanServiceLevel: FanServiceLevel;
  fanServiceNotes?: string;
  tags: string[];
  status: WatchStatus;
  notes?: string;
  favoriteAspect?: keyof AnimeScores;
  updatedAt: string;
}

export type SortField =
  | 'overallScore'
  | 'artStyle'
  | 'story'
  | 'characterDevelopment'
  | 'soundtrack'
  | 'animation'
  | 'title'
  | 'year';

export type SortOrder = 'desc' | 'asc';

export type FanServiceFilter = 'all' | 'fan_service_only' | 'no_fan_service' | 'heavy_only';

export interface FilterState {
  search: string;
  tier: 'all' | AnimeTier;
  selectedTags: string[];
  fanServiceFilter: FanServiceFilter;
  minOverallScore: number;
  minCategoryScore: {
    category: keyof AnimeScores | 'none';
    minScore: number;
  };
  sortBy: SortField;
  sortOrder: SortOrder;
  status: 'all' | WatchStatus;
}
