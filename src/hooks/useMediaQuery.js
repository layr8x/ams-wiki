// src/hooks/useMediaQuery.js — 반응형 미디어 쿼리 훅
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// 편의용 훅들
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)');
}
