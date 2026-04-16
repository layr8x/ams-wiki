// src/components/common/Sidebar.jsx — shadcn/ui 표준
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, HelpCircle, Bell, PlusCircle,
  ChevronDown, ChevronRight, Clock, LayoutGrid, FileText,
  MessageCircle, ExternalLink
} from 'lucide-react'
import { MODULE_TREE, RECENT_GUIDES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { useAuth } from '@/store/authStore'

const ICON_MAP = {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, Layers: Settings,
}

export default function Sidebar() {
  const { isAuthenticated } = useAuth()
  const [expanded, setExpanded] = useState(
    () => Object.fromEntries(MODULE_TREE.filter(m => m.guides.length > 0).map(m => [m.id, true]))
  )
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col sticky top-14 h-[calc(100dvh-3.5rem)] border-r border-border bg-background overflow-hidden">
      <div className="flex flex-col gap-0 overflow-y-auto p-2 flex-1 scrollbar-thin">

        {/* 최근 조회 */}
        <div className="mb-1">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            최근 조회
          </p>
          {RECENT_GUIDES.slice(0, 3).map(r => (
            <NavLink
              key={r.id}
              to={`/guides/${r.id}`}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Clock size={10} className="shrink-0 opacity-60" />
              <span className="truncate flex-1">{r.title}</span>
              <span className="shrink-0 text-[10px] opacity-50">{r.module?.split('/')[0]}</span>
            </NavLink>
          ))}
        </div>

        {/* 구분선 */}
        <div className="my-1 h-px bg-border mx-2" />

        {/* 메인 네비게이션 */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <LayoutGrid size={14} className="shrink-0" />
          대시보드
        </NavLink>

        <NavLink
          to="/guides"
          className={({ isActive }) => cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <FileText size={14} className="shrink-0" />
          전체 가이드
        </NavLink>

        {/* 구분선 */}
        <div className="my-1 h-px bg-border mx-2" />

        {/* 모듈 트리 */}
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          카테고리
        </p>

        {MODULE_TREE.map(m => {
          const Icon = ICON_MAP[m.icon] || BookOpen
          const isExpanded = expanded[m.id]
          return (
            <div key={m.id}>
              <button
                onClick={() => toggle(m.id)}
                className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon size={14} className="shrink-0 text-muted-foreground" />
                <span className="flex-1 text-left truncate">{m.label}</span>
                <span className="text-[10px] font-normal text-muted-foreground mr-1">{m.guides.length}</span>
                {isExpanded
                  ? <ChevronDown size={12} className="shrink-0 text-muted-foreground" />
                  : <ChevronRight size={12} className="shrink-0 text-muted-foreground" />
                }
              </button>

              {isExpanded && (
                <div className="ml-4 border-l border-border pl-2 my-0.5">
                  {m.guides.map(g => (
                    <NavLink
                      key={g.id}
                      to={`/guides/${g.id}`}
                      className={({ isActive }) => cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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

        {/* 구분선 */}
        <div className="my-1 h-px bg-border mx-2" />

        {/* 하단 링크 */}
        {[
          { to: '/faq',      Icon: HelpCircle,    label: 'FAQ' },
          { to: '/updates',  Icon: Bell,          label: '업데이트 이력' },
          { to: '/feedback', Icon: MessageCircle, label: '오류 제보' },
        ].map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon size={14} className="shrink-0" />
            {label}
          </NavLink>
        ))}

        {isAuthenticated && (
          <NavLink
            to="/editor"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors mt-1"
          >
            <PlusCircle size={14} className="shrink-0" />
            새 가이드 작성
          </NavLink>
        )}
      </div>
    </aside>
  )
}
