// src/components/common/GlobalHeaderActions.jsx
// Layout 상단 헤더의 검색 + 액션 영역 (로고/제목은 AppSidebar 헤더로 이동)
import { useEffect } from 'react'
import {
  MagnifyingGlass as Search,
} from '@phosphor-icons/react'
import { useSearchStore } from '@/store/searchStore.jsx'
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
        <span className="flex-1 truncate text-left">가이드 검색<span className="hidden sm:inline">...</span></span>
        <span className="pointer-events-none hidden items-center gap-1 sm:inline-flex">
          <kbd className="h-5 min-w-[20px] select-none rounded border bg-muted px-1.5 font-mono text-[11px] font-semibold">/</kbd>
          <span className="text-[10px] text-muted-foreground">또는</span>
          <kbd className="h-5 min-w-[20px] select-none rounded border bg-muted px-1.5 font-mono text-[11px] font-semibold">⌘K</kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Separator />
        <UserMenu />
      </div>
    </div>
  )
}

function Separator() {
  return <div className="mx-1 h-5 w-px bg-border" />
}
