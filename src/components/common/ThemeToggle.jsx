// src/components/common/ThemeToggle.jsx — shadcn/ui 표준
import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function ThemeToggle() {
  const { isDark, toggle } = useDarkMode()

  return (
    <button
      onClick={toggle}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      title={isDark ? '라이트 모드' : '다크 모드'}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      <span className="sr-only">{isDark ? '라이트 모드' : '다크 모드'} 전환</span>
    </button>
  )
}
