// src/components/common/ThemeToggle.jsx — shadcn/ui 표준
import {
  Moon,
  Sun
} from '@phosphor-icons/react'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function ThemeToggle() {
  const { isDark, toggle } = useDarkMode()

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      title={isDark ? '라이트 모드' : '다크 모드'}
      aria-label={isDark ? '라이트 모드 전환' : '다크 모드 전환'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
