// src/hooks/useDarkMode.js — 다크 모드 훅
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // localStorage에서 저장된 설정 확인
    const saved = localStorage.getItem('theme-mode');
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

    // localStorage에 저장
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);
  const setDark = () => setIsDark(true);
  const setLight = () => setIsDark(false);

  return { isDark, toggle, setDark, setLight };
}
