// src/pages/HomePage.jsx — shadcn/ui new-york 스타일 전면 재구성
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Settings, HelpCircle, Bell, ArrowRight,
  ChevronRight, TrendingUp, Clock, FileText, Shield,
  ArrowUpRight
} from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { MODULE_TREE, RECENT_GUIDES, GUIDES } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const ICON_MAP = {
  ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Settings,
}

/* 다크/라이트 모두에서 자연스러운 틴티드 팔레트 */
const MODULE_PALETTE = {
  recruit:   { tint: 'bg-blue-500/10 dark:bg-blue-400/10',       ring: 'ring-blue-500/20',       icon: 'text-blue-600 dark:text-blue-400' },
  course:    { tint: 'bg-emerald-500/10 dark:bg-emerald-400/10', ring: 'ring-emerald-500/20',    icon: 'text-emerald-600 dark:text-emerald-400' },
  operation: { tint: 'bg-violet-500/10 dark:bg-violet-400/10',   ring: 'ring-violet-500/20',     icon: 'text-violet-600 dark:text-violet-400' },
  billing:   { tint: 'bg-amber-500/10 dark:bg-amber-400/10',     ring: 'ring-amber-500/20',      icon: 'text-amber-600 dark:text-amber-400' },
  customer:  { tint: 'bg-pink-500/10 dark:bg-pink-400/10',       ring: 'ring-pink-500/20',       icon: 'text-pink-600 dark:text-pink-400' },
  message:   { tint: 'bg-cyan-500/10 dark:bg-cyan-400/10',       ring: 'ring-cyan-500/20',       icon: 'text-cyan-600 dark:text-cyan-400' },
  system:    { tint: 'bg-slate-500/10 dark:bg-slate-400/10',     ring: 'ring-slate-500/20',      icon: 'text-slate-600 dark:text-slate-400' },
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
  { label: '총 가이드',       getValue: () => `${Object.keys(GUIDES).length}`,  unit: '개', icon: FileText,   accent: 'text-blue-600 dark:text-blue-400' },
  { label: '월 조회수',       getValue: () => '12,487',                         unit: '',   icon: TrendingUp, accent: 'text-emerald-600 dark:text-emerald-400' },
  { label: '만족도',          getValue: () => '92',                             unit: '%',  icon: Shield,     accent: 'text-violet-600 dark:text-violet-400' },
  { label: '최근 업데이트',    getValue: () => '오늘',                            unit: '',   icon: Clock,      accent: 'text-amber-600 dark:text-amber-400' },
]

const QUICK_LINKS = [
  { to: '/faq',      icon: HelpCircle,    label: 'FAQ',          desc: '반복 문의 해결'   },
  { to: '/updates',  icon: Bell,          label: '업데이트 이력',  desc: '정책 및 기능 변경' },
  { to: '/feedback', icon: MessageSquare, label: '오류 제보',      desc: '개선 요청 제출'   },
]

export default function HomePage() {
  const { open } = useSearchStore()

  const mods = MODULE_TREE.map(m => ({
    ...m,
    description: MODULE_DESC[m.id] || '',
    guide_count: m.guides.length,
    palette: MODULE_PALETTE[m.id] || MODULE_PALETTE.system,
  }))

  const recents = RECENT_GUIDES.slice(0, 6)
  const sevenDaysAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.getTime()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">

      {/* ── 페이지 타이틀 ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">대시보드</h1>
          <p className="text-sm text-muted-foreground">AMS 운영 가이드 · 최신 업데이트 2026.04</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['계정이관', '환불 처리', 'QR 출석', '전반', '청구생성'].map(q => (
            <button
              key={q}
              onClick={open}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-ring/50 hover:bg-accent"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── 통계 카드 (dashboard-01 스타일 그라디언트) ──────────────────────── */}
      <section className="grid grid-cols-2 gap-4 @xl/main:grid-cols-4">
        {STATS.map(stat => {
          const StatIcon = stat.icon
          return (
            <Card key={stat.label} className="group relative gap-2 overflow-hidden bg-gradient-to-t from-primary/5 to-card p-5 !py-5 shadow-xs transition-all hover:shadow-md dark:from-card dark:to-card">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <StatIcon size={16} className={stat.accent} />
              </div>
              <p className="text-3xl font-bold tracking-tight tabular-nums">
                {stat.getValue()}
                {stat.unit && <span className="ml-1 text-xl font-semibold text-muted-foreground">{stat.unit}</span>}
              </p>
            </Card>
          )
        })}
      </section>

      {/* ── 카테고리 그리드 ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">카테고리 탐색</h2>
            <p className="text-xs text-muted-foreground">업무 영역별로 분류된 운영 가이드.</p>
          </div>
          <Link to="/guides" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            전체 보기 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {mods.map(m => {
              const Icon = ICON_MAP[m.icon] || BookOpen
              const p = m.palette
              return (
                <Link
                  key={m.id}
                  to={`/modules/${m.id}`}
                  className={cn(
                    'group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all',
                    'hover:-translate-y-0.5 hover:border-ring/40 hover:shadow-lg'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg ring-1', p.tint, p.ring)}>
                      <Icon size={20} className={p.icon} />
                    </div>
                    <Badge variant="secondary" size="sm" className="font-mono">{m.guide_count}</Badge>
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-tight">{m.label}</p>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    자세히 보기
                    <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

      {/* ── 하단 3 컬럼: 최근 업데이트(2) + 빠른 링크 + 모듈 현황 ────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">

        {/* 최근 업데이트 */}
        <section className="lg:col-span-2 xl:col-span-3">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">최근 업데이트</h2>
              <p className="text-xs text-muted-foreground">새로 추가되거나 수정된 가이드.</p>
            </div>
            <Link to="/updates" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              전체 보기 <ArrowRight size={14} />
            </Link>
          </div>

          <Card className="overflow-hidden !py-0 gap-0">
            <ul className="divide-y divide-border">
              {recents.map((g) => {
                const isNew = g.updated_at && new Date(g.updated_at).getTime() > sevenDaysAgo
                return (
                  <li key={g.id}>
                    <Link
                      to={`/guides/${g.id}`}
                      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-accent/50"
                    >
                      <Badge variant="outline" size="sm" className="shrink-0 font-medium">
                        {g.module?.split('/')[0]}
                      </Badge>
                      <span className="flex-1 truncate text-sm font-medium">{g.title}</span>
                      {isNew && <Badge variant="new" size="sm">NEW</Badge>}
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {g.updated_at?.slice(0, 10)}
                      </span>
                      <ArrowUpRight size={15} className="shrink-0 text-muted-foreground/40" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Card>
        </section>

        {/* 빠른 링크 + 모듈 현황 */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">빠른 링크</h2>
            <div className="flex flex-col gap-2">
              {QUICK_LINKS.map(link => {
                const LinkIcon = link.icon
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-ring/40 hover:bg-accent/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <LinkIcon size={15} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{link.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{link.desc}</p>
                    </div>
                    <ChevronRight size={14} className="shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              })}
            </div>
          </div>

          <Card className="p-4 !py-4 gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              모듈 현황
            </p>
            <div className="space-y-2.5">
              {mods.slice(0, 5).map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="w-16 truncate text-xs font-medium text-foreground">{m.label.split('/')[0]}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (m.guide_count / 8) * 100)}%` }}
                    />
                  </div>
                  <span className="w-4 text-right font-mono text-xs font-semibold tabular-nums">{m.guide_count}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

      </div>
    </div>
  )
}
