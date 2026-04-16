// src/components/common/ThemeToggle.jsx — 다크 모드 토글
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function ThemeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        transition: 'background-color 120ms ease',
        color: isDark ? '#fbbf24' : '#666666',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(251, 191, 36, 0.1)' : '#f2f2f2';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={isDark ? '라이트 모드' : '다크 모드'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
