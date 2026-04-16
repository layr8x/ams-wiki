// src/hooks/useGuideFilter.js — 가이드 필터링 훅
import { useState, useMemo, useCallback } from 'react';

export function useGuideFilter(guides) {
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedModules: [],
    selectedTypes: [],
    selectedTags: [],
    minViews: 0,
    sortBy: 'recent', // 'recent', 'popular', 'helpful', 'title'
  });

  // 필터링 및 정렬
  const filteredGuides = useMemo(() => {
    let result = [...guides];

    // 검색어 필터
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((guide) => {
        const matchesTitle = guide.title?.toLowerCase().includes(query);
        const matchesModule = guide.module?.toLowerCase().includes(query);
        const matchesTags = guide.tags?.some((tag) =>
          tag?.toLowerCase().includes(query)
        );
        return matchesTitle || matchesModule || matchesTags;
      });
    }

    // 모듈 필터
    if (filters.selectedModules.length > 0) {
      result = result.filter((guide) =>
        filters.selectedModules.includes(guide.module)
      );
    }

    // 유형 필터
    if (filters.selectedTypes.length > 0) {
      result = result.filter((guide) =>
        filters.selectedTypes.includes(guide.type)
      );
    }

    // 태그 필터
    if (filters.selectedTags.length > 0) {
      result = result.filter((guide) =>
        filters.selectedTags.some((tag) => guide.tags?.includes(tag))
      );
    }

    // 최소 조회수 필터
    if (filters.minViews > 0) {
      result = result.filter((guide) => (guide.views || 0) >= filters.minViews);
    }

    // 정렬
    switch (filters.sortBy) {
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'helpful':
        result.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      case 'title':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'recent':
      default:
        result.sort(
          (a, b) =>
            new Date(b.updated_at || b.updated || 0) -
            new Date(a.updated_at || a.updated || 0)
        );
    }

    return result;
  }, [guides, filters]);

  // 필터 업데이트 함수들
  const setSearchQuery = useCallback(
    (query) => setFilters((prev) => ({ ...prev, searchQuery: query })),
    []
  );

  const toggleModule = useCallback((module) => {
    setFilters((prev) => {
      const selected = prev.selectedModules.includes(module)
        ? prev.selectedModules.filter((m) => m !== module)
        : [...prev.selectedModules, module];
      return { ...prev, selectedModules: selected };
    });
  }, []);

  const toggleType = useCallback((type) => {
    setFilters((prev) => {
      const selected = prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter((t) => t !== type)
        : [...prev.selectedTypes, type];
      return { ...prev, selectedTypes: selected };
    });
  }, []);

  const toggleTag = useCallback((tag) => {
    setFilters((prev) => {
      const selected = prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag];
      return { ...prev, selectedTags: selected };
    });
  }, []);

  const setSortBy = useCallback((sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setMinViews = useCallback((minViews) => {
    setFilters((prev) => ({ ...prev, minViews }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedModules: [],
      selectedTypes: [],
      selectedTags: [],
      minViews: 0,
      sortBy: 'recent',
    });
  }, []);

  return {
    filteredGuides,
    filters,
    setSearchQuery,
    toggleModule,
    toggleType,
    toggleTag,
    setSortBy,
    setMinViews,
    clearFilters,
    isFiltered:
      filters.searchQuery !== '' ||
      filters.selectedModules.length > 0 ||
      filters.selectedTypes.length > 0 ||
      filters.selectedTags.length > 0 ||
      filters.minViews > 0,
  };
}
