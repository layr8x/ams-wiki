// src/components/common/GlobalHeaderActions.jsx
// Layout 상단 헤더의 검색 + 액션 영역 (로고/제목은 AppSidebar 헤더로 이동)
import { useEffect } from 'react'
import {
  MagnifyingGlass as Search,
  Bell
} from '@phosphor-icons/react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function GlobalHeaderActions() {
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
    <div className="flex flex-1 items-center gap-2">
      <button
        onClick={open}
        className={cn(
          'inline-flex h-8 w-full max-w-sm items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground shadow-xs transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-label="가이드 검색"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">가이드 검색...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        <Separator />
        <UserMenu />
      </div>
    </div>
  )
}

function Separator() {
  return <div className="mx-1 h-5 w-px bg-border" />
}

function NotificationBell() {
  return (
    <Button variant="ghost" size="icon" className="relative size-8" aria-label="알림">
      <Bell className="size-4" />
      <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
    </Button>
  )
}
