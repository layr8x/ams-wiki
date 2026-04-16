// src/pages/HomePage.jsx — shadcn/ui 표준 전면 재작성
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Settings, HelpCircle, Bell, ArrowRight,
  ChevronRight, TrendingUp, Clock, FileText, Shield
} from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { MODULE_TREE, RECENT_GUIDES, GUIDES } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const ICON_MAP = {
  ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Settings,
}

const MODULE_COLORS = {
  recruit:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'hover:border-blue-200' },
  course:    { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'hover:border-emerald-200' },
  operation: { bg: 'bg-violet-50', icon: 'text-violet-600',  border: 'hover:border-violet-200' },
  billing:   { bg: 'bg-amber-50',  icon: 'text-amber-600',   border: 'hover:border-amber-200' },
  customer:  { bg: 'bg-pink-50',   icon: 'text-pink-600',    border: 'hover:border-pink-200' },
  message:   { bg: 'bg-cyan-50',   icon: 'text-cyan-600',    border: 'hover:border-cyan-200' },
  system:    { bg: 'bg-slate-50',  icon: 'text-slate-600',   border: 'hover:border-slate-200' },
}

const MODULE_DESC = {
  recruit:   '모집 신청, 접수 관리, 대기번호 처리',
  course:    '강좌 생성, 교재 등록, 회차 관리',
  operation: '입/퇴반, 전반, 출결 처리',
  billing:   '청구 생성, 결제 처리, 환불 관리',
  customer:  '회원 조회, 계정 통합, 휴강 처리',
  message:   '문자 발송, 가상계좌 안내',
  system:    '공통 용어, CS 대응, 정책 공지',
}

const STATS = [
  { label: '총 가이드', value: `${Object.keys(GUIDES).length}개`, icon: FileText, color: 'text-blue-600' },
  { label: '월 조회수', value: '12,487', icon: TrendingUp, color: 'text-emerald-600' },
  { label: '만족도', value: '92%', icon: Shield, color: 'text-violet-600' },
  { label: '최근 업데이트', value: '오늘', icon: Clock, color: 'text-amber-600' },
]

const QUICK_LINKS = [
  { to: '/faq',      icon: HelpCircle, label: 'FAQ',          desc: '반복 문의 해결' },
  { to: '/updates',  icon: Bell,       label: '업데이트 이력', desc: '정책 및 기능 변경' },
  { to: '/feedback', icon: MessageSquare, label: '오류 제보', desc: '개선 요청 제출' },
]

export default function HomePage() {
  const { open } = useSearchStore()

  const mods = MODULE_TREE.map(m => ({
    ...m,
    description: MODULE_DESC[m.id] || '',
    guide_count: m.guides.length,
    colors: MODULE_COLORS[m.id] || MODULE_COLORS.system,
  }))

  const recents = RECENT_GUIDES.slice(0, 6)
  const sevenDaysAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.getTime()
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">

      {/* ── 히어로 ─────────────────────────────────────────────────────────── */}
      <section className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          AMS 운영 위키
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
          어떤 가이드를 찾으시나요?
        </h1>
        <p className="mb-8 text-base text-muted-foreground">
          AMS 기능 사용법, 운영 케이스, 정책 기준을 한 곳에서 검색하세요.
        </p>

        {/* 검색 버튼 */}
        <button
          onClick={open}
          className={cn(
            'inline-flex w-full max-w-lg items-center gap-3 rounded-lg border border-input bg-background px-4 py-3',
            'text-sm text-muted-foreground shadow-sm transition-all',
            'hover:border-ring/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          )}
        >
          <Search size={16} className="shrink-0" />
          <span className="flex-1 text-left">가이드 검색 (⌘K 또는 /)</span>
          <div className="flex items-center gap-1">
            <kbd className="flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">⌘</kbd>
            <kbd className="flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">K</kbd>
          </div>
        </button>

        {/* 인기 검색어 */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">인기 검색어:</span>
          {['계정이관', '환불 처리', 'QR 출석', '전반', '청구생성'].map(q => (
            <button
              key={q}
              onClick={open}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* ── 통계 카드 ─────────────────────────────────────────────────────── */}
      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── 모듈 카테고리 그리드 ──────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">카테고리 탐색</h2>
          <Link to="/guides" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            전체 보기 <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {mods.map(m => {
            const Icon = ICON_MAP[m.icon] || BookOpen
            const c    = m.colors
            return (
              <Link
                key={m.id}
                to={`/modules/${m.id}`}
                className={cn(
                  'group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all',
                  'hover:shadow-md', c.border
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-md', c.bg)}>
                    <Icon size={17} className={cn(c.icon)} />
                  </div>
                  <Badge variant="secondary" size="sm">{m.guide_count}개</Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{m.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{m.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 하단: 최근 업데이트 + 빠른 링크 ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* 최근 업데이트 (2/3) */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">최근 업데이트</h2>
            <Link to="/updates" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              전체 보기 <ChevronRight size={12} />
            </Link>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {recents.map((g) => {
                const isNew = g.updated_at && new Date(g.updated_at).getTime() > sevenDaysAgo
                return (
                  <Link
                    key={g.id}
                    to={`/guides/${g.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {g.module?.split('/')[0]}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium text-foreground">{g.title}</span>
                    {isNew && (
                      <Badge variant="sop" size="sm">NEW</Badge>
                    )}
                    <span className="shrink-0 text-xs font-mono text-muted-foreground">
                      {g.updated_at?.slice(0, 10)}
                    </span>
                    <ArrowRight size={13} className="shrink-0 text-muted-foreground/40" />
                  </Link>
                )
              })}
            </div>
          </Card>
        </section>

        {/* 빠른 링크 (1/3) */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">빠른 링크</h2>
          <div className="flex flex-col gap-2">
            {QUICK_LINKS.map(({ to, icon: Icon, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-ring/30"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                  <Icon size={15} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ChevronRight size={14} className="ml-auto shrink-0 text-muted-foreground/40" />
              </Link>
            ))}

            {/* 모듈 현황 미니 카드 */}
            <div className="mt-2 rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">모듈 현황</p>
              <div className="space-y-2">
                {mods.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${Math.min(100, (m.guide_count / 8) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 truncate">{m.label.split('/')[0]}</span>
                    <span className="text-xs font-medium text-foreground w-4 text-right">{m.guide_count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
