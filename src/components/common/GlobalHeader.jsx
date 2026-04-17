// src/components/common/GlobalHeader.jsx — shadcn/ui 표준
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, BookOpen } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import UserMenu from './UserMenu'
import { cn } from '@/lib/utils'

export default function GlobalHeader() {
  const { open } = useSearchStore()

  useEffect(() => {
    const h = (e) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">

        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-2" aria-label="AMS Wiki 홈">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <BookOpen size={13} className="text-primary-foreground" />
          </div>
          <span className="hidden sm:block font-semibold text-sm tracking-tight">AMS Wiki</span>
        </Link>

        {/* 검색 버튼 */}
        <button
          onClick={open}
          className={cn(
            'inline-flex items-center gap-2 w-full max-w-sm h-8 rounded-md border border-input bg-muted/50 px-3',
            'text-sm text-muted-foreground shadow-none transition-colors',
            'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          )}
          aria-label="가이드 검색"
        >
          <Search size={13} className="shrink-0" />
          <span className="flex-1 text-left text-xs">가이드 검색...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* 오른쪽 액션 */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <LanguageSelector />
          <ThemeToggle />
          <NotificationBell />
          <UserMenu />
        </div>

      </div>
    </header>
  )
}

function NotificationBell() {
  return (
    <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      <Bell size={15} />
      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
      <span className="sr-only">알림</span>
    </button>
  )
}
