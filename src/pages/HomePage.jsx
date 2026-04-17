// src/pages/HomePage.jsx — shadcn/ui new-york 스타일 전면 재구성
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Settings, HelpCircle, Bell, ArrowRight,
  ChevronRight, TrendingUp, Clock, FileText, Shield, Sparkles,
  ArrowUpRight, Command
} from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { MODULE_TREE, RECENT_GUIDES, GUIDES } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    <div className="relative">

      {/* ── 히어로 섹션 ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 hero-grid" aria-hidden />
        <div className="absolute inset-0 hero-glow" aria-hidden />

        <div className="relative mx-auto w-full max-w-5xl px-6 pt-20 pb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles size={12} className="text-amber-500" />
            AMS 운영 위키 · 최신 업데이트 2026.04
            <ChevronRight size={12} className="text-muted-foreground/60" />
          </div>

          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            어떤 가이드를
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400"> 찾으시나요?</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg">
            AMS 기능 사용법, 운영 케이스, 정책 기준을
            <br className="hidden sm:block" />
            한 곳에서 빠르게 검색하세요.
          </p>

          {/* 검색 버튼 */}
          <button
            onClick={open}
            className={cn(
              'mx-auto inline-flex w-full max-w-xl items-center gap-3 rounded-xl border border-input bg-background/80 px-5 py-3.5 shadow-sm backdrop-blur transition-all',
              'hover:border-ring hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-muted-foreground">가이드 검색 (⌘K 또는 /)</span>
            <div className="flex items-center gap-1">
              <kbd className="flex h-6 items-center rounded-md border border-border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground">⌘</kbd>
              <kbd className="flex h-6 items-center rounded-md border border-border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground">K</kbd>
            </div>
          </button>

          {/* 인기 검색어 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">인기 검색어</span>
            {['계정이관', '환불 처리', 'QR 출석', '전반', '청구생성'].map(q => (
              <button
                key={q}
                onClick={open}
                className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur transition-all hover:border-ring/50 hover:shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 메인 콘텐츠 ──────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-6 py-14">

        {/* ── 통계 카드 ─────────────────────────────────────────────────────── */}
        <section className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(stat => {
            const StatIcon = stat.icon
            return (
              <Card key={stat.label} className="group relative gap-3 overflow-hidden !py-0 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className="rounded-md bg-muted p-1.5 transition-colors group-hover:bg-accent">
                    <StatIcon size={14} className={stat.accent} />
                  </div>
                </div>
                <p className="text-3xl font-bold tracking-tight">
                  {stat.getValue()}
                  {stat.unit && <span className="ml-1 text-xl font-semibold text-muted-foreground">{stat.unit}</span>}
                </p>
              </Card>
            )
          })}
        </section>

        {/* ── 카테고리 그리드 ───────────────────────────────────────────────── */}
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">카테고리 탐색</h2>
              <p className="mt-1 text-sm text-muted-foreground">업무 영역별로 분류된 운영 가이드를 확인하세요.</p>
            </div>
            <Link to="/guides" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              전체 보기 <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

        {/* ── 하단 2 컬럼: 최근 업데이트 + 빠른 링크 ──────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* 최근 업데이트 (2/3) */}
          <section className="lg:col-span-2">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">최근 업데이트</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">새로 추가되거나 수정된 가이드입니다.</p>
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
                        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/50"
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

          {/* 빠른 링크 (1/3) */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight">빠른 링크</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">자주 찾는 페이지 바로가기.</p>
            </div>

            <div className="flex flex-col gap-3">
              {QUICK_LINKS.map(link => {
                const LinkIcon = link.icon
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-ring/40 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-accent">
                      <LinkIcon size={16} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{link.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{link.desc}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              })}

              {/* 모듈 현황 */}
              <Card className="p-4 !py-4 gap-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  모듈 현황
                </p>
                <div className="space-y-2.5">
                  {mods.slice(0, 4).map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <span className="w-20 truncate text-xs font-medium text-foreground">{m.label.split('/')[0]}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground/70 transition-all"
                          style={{ width: `${Math.min(100, (m.guide_count / 8) * 100)}%` }}
                        />
                      </div>
                      <span className="w-4 text-right font-mono text-xs font-semibold">{m.guide_count}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
