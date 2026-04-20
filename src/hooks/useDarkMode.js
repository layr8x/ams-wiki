// src/hooks/useDarkMode.js — 다크 모드 훅
import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/storageKeys';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved) return saved === 'dark';

    // 시스템 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);
  const setDark = () => setIsDark(true);
  const setLight = () => setIsDark(false);

  return { isDark, toggle, setDark, setLight };
}
