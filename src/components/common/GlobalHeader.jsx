// src/components/common/GlobalHeader.jsx — shadcn/ui new-york 스타일
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, BookOpen, LogIn } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import ThemeToggle from './ThemeToggle'
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
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* 로고 */}
        <Link to="/" className="group flex items-center gap-2.5 shrink-0" aria-label="AMS Wiki 홈">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <BookOpen size={15} strokeWidth={2.5} />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">AMS Wiki</span>
            <span className="text-[10px] font-medium text-muted-foreground mt-0.5">운영 가이드 센터</span>
          </div>
        </Link>

        {/* 검색 버튼 */}
        <button
          onClick={open}
          className={cn(
            'ml-4 inline-flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-input bg-muted/40 px-3',
            'text-sm text-muted-foreground shadow-sm transition-all',
            'hover:border-ring/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label="가이드 검색"
        >
          <Search size={14} className="shrink-0" />
          <span className="flex-1 text-left text-sm">가이드 검색...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>

        {/* 오른쪽 액션 */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <ThemeToggle />
          <NotificationBell />
          <div className="mx-1 h-6 w-px bg-border" />
          <UserMenu />
        </div>

      </div>
    </header>
  )
}

function NotificationBell() {
  return (
    <button
      type="button"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="알림"
    >
      <Bell size={16} />
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
    </button>
  )
}
