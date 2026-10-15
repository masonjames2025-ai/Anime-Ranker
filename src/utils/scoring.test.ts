import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOverallScore,
  calculateTier,
  filterAnime,
  sortAnime,
  filterAndSortAnime,
  getFavoriteAspect,
  calculateLibraryStats,
} from './scoring.ts';
import type { AnimeEntry, FilterState } from '../types/anime.ts';

const mockSampleAnime: AnimeEntry[] = [
  {
    id: '1',
    title: 'Frieren: Beyond Journey\'s End',
    year: 2023,
    type: 'TV',
    scores: {
      artStyle: 9.8,
      story: 9.7,
      characterDevelopment: 9.5,
      soundtrack: 9.6,
      animation: 9.6,
    },
    overallScore: 9.6,
    tier: 'S',
    hasFanService: false,
    fanServiceLevel: 'none',
    tags: ['Fantasy', 'Adventure', 'Slice of Life'],
    status: 'Completed',
    themeColor: '#3b82f6',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Mushoku Tensei: Jobless Reincarnation',
    year: 2021,
    type: 'TV',
    scores: {
      artStyle: 9.4,
      story: 8.6,
      characterDevelopment: 8.7,
      soundtrack: 8.8,
      animation: 9.5,
    },
    overallScore: 9.0,
    tier: 'S',
    hasFanService: true,
    fanServiceLevel: 'heavy',
    tags: ['Isekai', 'Dark Fantasy', 'Magic'],
    status: 'Completed',
    themeColor: '#f59e0b',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'KonoSuba: God\'s Blessing on this Wonderful World!',
    year: 2016,
    type: 'TV',
    scores: {
      artStyle: 7.9,
      story: 7.8,
      characterDevelopment: 8.8,
      soundtrack: 7.6,
      animation: 8.3,
    },
    overallScore: 8.1,
    tier: 'A',
    hasFanService: true,
    fanServiceLevel: 'moderate',
    tags: ['Isekai', 'Comedy', 'Fantasy'],
    status: 'Completed',
    themeColor: '#10b981',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Random Flawed Show',
    year: 2020,
    type: 'TV',
    scores: {
      artStyle: 5.0,
      story: 4.5,
      characterDevelopment: 5.0,
      soundtrack: 5.5,
      animation: 5.0,
    },
    overallScore: 5.0,
    tier: 'D',
    hasFanService: false,
    fanServiceLevel: 'none',
    tags: ['Action'],
    status: 'Dropped',
    themeColor: '#ef4444',
    updatedAt: new Date().toISOString(),
  },
];

const defaultFilter: FilterState = {
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
};

test('calculateOverallScore computes arithmetic mean rounded to 1 decimal place', () => {
  const scores = {
    artStyle: 9.5,
    story: 9.0,
    characterDevelopment: 8.5,
    soundtrack: 9.0,
    animation: 9.5,
  };
  // sum = 45.5, avg = 9.1
  assert.equal(calculateOverallScore(scores), 9.1);

  const perfect = {
    artStyle: 10,
    story: 10,
    characterDevelopment: 10,
    soundtrack: 10,
    animation: 10,
  };
  assert.equal(calculateOverallScore(perfect), 10.0);
});

test('calculateTier maps scores correctly to S, A, B, C, D tiers', () => {
  assert.equal(calculateTier(9.0), 'S');
  assert.equal(calculateTier(9.8), 'S');
  assert.equal(calculateTier(8.9), 'A');
  assert.equal(calculateTier(8.0), 'A');
  assert.equal(calculateTier(7.9), 'B');
  assert.equal(calculateTier(7.0), 'B');
  assert.equal(calculateTier(6.9), 'C');
  assert.equal(calculateTier(5.5), 'C');
  assert.equal(calculateTier(5.4), 'D');
  assert.equal(calculateTier(2.0), 'D');
});

test('getFavoriteAspect finds the highest category score', () => {
  const scores = {
    artStyle: 8.0,
    story: 9.5,
    characterDevelopment: 9.0,
    soundtrack: 7.0,
    animation: 8.5,
  };
  assert.equal(getFavoriteAspect(scores), 'story');
});

test('filterAnime handles fan service filtering accurately', () => {
  const fanServiceOnly = filterAnime(mockSampleAnime, {
    ...defaultFilter,
    fanServiceFilter: 'fan_service_only',
  });
  assert.equal(fanServiceOnly.length, 2);
  assert.ok(fanServiceOnly.every((a) => a.hasFanService));

  const noFanService = filterAnime(mockSampleAnime, {
    ...defaultFilter,
    fanServiceFilter: 'no_fan_service',
  });
  assert.equal(noFanService.length, 2);
  assert.ok(noFanService.every((a) => !a.hasFanService));

  const heavyOnly = filterAnime(mockSampleAnime, {
    ...defaultFilter,
    fanServiceFilter: 'heavy_only',
  });
  assert.equal(heavyOnly.length, 1);
  assert.equal(heavyOnly[0].title, 'Mushoku Tensei: Jobless Reincarnation');
});

test('filterAnime handles categorical markers such as Isekai tag filter', () => {
  const isekaiOnly = filterAnime(mockSampleAnime, {
    ...defaultFilter,
    selectedTags: ['Isekai'],
  });
  assert.equal(isekaiOnly.length, 2);
  assert.ok(isekaiOnly.every((a) => a.tags.includes('Isekai')));
});

test('filterAnime handles tier filtering', () => {
  const sTierOnly = filterAnime(mockSampleAnime, {
    ...defaultFilter,
    tier: 'S',
  });
  assert.equal(sTierOnly.length, 2);
  assert.ok(sTierOnly.every((a) => a.tier === 'S'));
});

test('sortAnime sorts by overallScore and individual categories', () => {
  const sortedByOverall = sortAnime(mockSampleAnime, 'overallScore', 'desc');
  assert.equal(sortedByOverall[0].title, 'Frieren: Beyond Journey\'s End');
  assert.equal(sortedByOverall[sortedByOverall.length - 1].title, 'Random Flawed Show');

  const sortedByAnimation = sortAnime(mockSampleAnime, 'animation', 'desc');
  assert.equal(sortedByAnimation[0].title, 'Frieren: Beyond Journey\'s End');
});

test('filterAndSortAnime cascades filter and sorting together', () => {
  const result = filterAndSortAnime(mockSampleAnime, {
    ...defaultFilter,
    selectedTags: ['Isekai'],
    sortBy: 'overallScore',
    sortOrder: 'desc',
  });
  assert.equal(result.length, 2);
  assert.equal(result[0].title, 'Mushoku Tensei: Jobless Reincarnation');
  assert.equal(result[1].title, 'KonoSuba: God\'s Blessing on this Wonderful World!');
});

test('calculateLibraryStats computes correct aggregate counts', () => {
  const stats = calculateLibraryStats(mockSampleAnime);
  assert.equal(stats.total, 4);
  assert.equal(stats.isekaiCount, 2);
  assert.equal(stats.fanServiceCount, 2);
  assert.equal(stats.tierCounts.S, 2);
  assert.equal(stats.tierCounts.A, 1);
  assert.equal(stats.tierCounts.D, 1);
  assert.equal(stats.topRated?.title, 'Frieren: Beyond Journey\'s End');
});
