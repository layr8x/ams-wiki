// src/components/common/Sidebar.jsx — shadcn/ui new-york 스타일
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, HelpCircle, Bell, PlusCircle,
  ChevronDown, ChevronRight, Clock, LayoutGrid, FileText,
  MessageCircle,
} from 'lucide-react'
import { MODULE_TREE, RECENT_GUIDES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { useAuth } from '@/store/authStore'

const ICON_MAP = {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, Layers: Settings,
}

function SectionLabel({ children }) {
  return (
    <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
      {children}
    </p>
  )
}

function NavItem({ to, icon: Icon, label, end, size = 'md' }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cn(
        'flex items-center gap-2.5 rounded-md px-2.5 transition-colors',
        size === 'md' ? 'h-9 text-sm font-medium' : 'h-8 text-[13px]',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      {Icon && <Icon size={size === 'md' ? 15 : 13} className="shrink-0" />}
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { isAuthenticated } = useAuth()
  const [expanded, setExpanded] = useState(
    () => Object.fromEntries(MODULE_TREE.filter(m => m.guides.length > 0).map(m => [m.id, true]))
  )
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col sticky top-16 h-[calc(100dvh-4rem)] border-r border-sidebar-border bg-sidebar">
      <nav className="flex flex-col gap-0.5 overflow-y-auto p-3 flex-1">

        {/* 메인 네비게이션 */}
        <NavItem to="/" end icon={LayoutGrid} label="대시보드" />
        <NavItem to="/guides" icon={FileText} label="전체 가이드" />

        <div className="my-2 h-px bg-sidebar-border/60 mx-2" />

        {/* 최근 조회 */}
        <SectionLabel>최근 조회</SectionLabel>
        <div className="flex flex-col gap-0.5 mb-1">
          {RECENT_GUIDES.slice(0, 3).map(r => (
            <NavLink
              key={r.id}
              to={`/guides/${r.id}`}
              className={({ isActive }) => cn(
                'flex items-center gap-2 rounded-md px-2.5 h-7 text-[12px] transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Clock size={11} className="shrink-0 opacity-60" />
              <span className="truncate flex-1">{r.title}</span>
            </NavLink>
          ))}
        </div>

        <div className="my-2 h-px bg-sidebar-border/60 mx-2" />

        {/* 카테고리 트리 */}
        <SectionLabel>카테고리</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {MODULE_TREE.map(m => {
            const Icon = ICON_MAP[m.icon] || BookOpen
            const isExpanded = expanded[m.id]
            return (
              <div key={m.id}>
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 h-9 text-sm font-medium text-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <Icon size={15} className="shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left truncate">{m.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{m.guides.length}</span>
                  {isExpanded
                    ? <ChevronDown size={13} className="shrink-0 text-muted-foreground" />
                    : <ChevronRight size={13} className="shrink-0 text-muted-foreground" />
                  }
                </button>

                {isExpanded && m.guides.length > 0 && (
                  <div className="ml-5 border-l border-sidebar-border pl-2 my-0.5 flex flex-col gap-0.5">
                    {m.guides.map(g => (
                      <NavLink
                        key={g.id}
                        to={`/guides/${g.id}`}
                        className={({ isActive }) => cn(
                          'flex items-center rounded-md px-2.5 h-7 text-[12px] transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <span className="truncate">{g.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="my-2 h-px bg-sidebar-border/60 mx-2" />

        {/* 하단 링크 */}
        <div className="flex flex-col gap-0.5">
          <NavItem to="/faq"      icon={HelpCircle}    label="FAQ" />
          <NavItem to="/updates"  icon={Bell}          label="업데이트 이력" />
          <NavItem to="/feedback" icon={MessageCircle} label="오류 제보" />
        </div>

        {isAuthenticated && (
          <NavLink
            to="/editor"
            className="mt-2 flex items-center gap-2 rounded-md px-2.5 h-9 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            <PlusCircle size={14} className="shrink-0" />
            새 가이드 작성
          </NavLink>
        )}
      </nav>

      {/* 하단 푸터 */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-[10px] text-muted-foreground">
          <span className="font-semibold text-foreground">AMS Wiki</span> v1.0
          <span className="mx-1.5">·</span>
          © 2026 Layr8x
        </p>
      </div>
    </aside>
  )
}
