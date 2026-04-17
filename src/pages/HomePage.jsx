// src/pages/HomePage.jsx
// 구조: PageHeader → StatCards(4) → 카테고리 그리드 → 최근 업데이트 + 빠른 링크 2열
// 모든 카드 구조는 shadcn/ui 공식 Card primitive 준수 (!important 사용 금지)
import { Link } from 'react-router-dom'
import {
  ClipboardText as ClipboardList,
  BookOpen,
  Calendar,
  CreditCard,
  Users,
  ChatText as MessageSquare,
  Gear as Settings,
  ArrowRight,
  TrendUp as TrendingUp,
  Clock,
  FileText,
  Shield,
  CaretRight as ChevronRight,
  Sparkle as Sparkles,
  Bell,
  ChatCircle as MessageCircle,
  PencilSimple as PencilLine
} from '@phosphor-icons/react'
import { MODULE_TREE, RECENT_GUIDES, GUIDES } from '@/data/mockData'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  PageShell, PageHeader, SectionTitle, StatCard,
} from '@/components/common/page-primitives'
import { cn } from '@/lib/utils'

const ICON_MAP = { ClipboardList, BookOpen, Calendar, CreditCard, Users, MessageSquare, Settings }

// 모듈별 틴트 — 과장 없이 은은하게
const MODULE_TINT = {
  recruit:   'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  course:    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  operation: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  billing:   'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  customer:  'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  message:   'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  system:    'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

export default function HomePage() {
  const totalGuides = Object.keys(GUIDES).length
  const recent5 = RECENT_GUIDES.slice(0, 5)

  return (
    <PageShell>
      <PageHeader
        title="대시보드"
        description={`AMS 운영 가이드 · 최신 업데이트 ${recent5[0]?.updated_at ?? ''}`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/editor">
                <PencilLine size={14} />
                새 가이드 작성
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/guides">
                전체 가이드 <ArrowRight size={14} />
              </Link>
            </Button>
          </>
        }
      />

      {/* ─── Stat Cards ──────────────────────────────────────────── */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="총 가이드"
          value={`${totalGuides}개`}
          delta={{ value: '+3', trend: 'up' }}
          footerTitle="이번 달 3건 신규 추가"
          footerDesc="지난 30일 기준"
        />
        <StatCard
          label="월 조회수"
          value="12,487"
          delta={{ value: '+12.3%', trend: 'up' }}
          footerTitle="전월 대비 증가"
          footerDesc="실장/상담실 합산"
        />
        <StatCard
          label="가이드 만족도"
          value="92%"
          delta={{ value: '+2.1%', trend: 'up' }}
          footerTitle="유용함 투표 비율"
          footerDesc="최근 100건 기준"
        />
        <StatCard
          label="최근 업데이트"
          value="오늘"
          footerTitle={recent5[0]?.title ?? '—'}
          footerDesc={`${recent5[0]?.module ?? ''} · ${recent5[0]?.version ?? ''}`}
        />
      </section>

      {/* ─── 카테고리 ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <SectionTitle
          title="카테고리"
          description="AMS 메뉴 구조 기준 모듈별 가이드"
          link="/guides"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULE_TREE.map(mod => {
            const Icon = ICON_MAP[mod.icon] ?? FileText
            const tint = MODULE_TINT[mod.id] ?? 'bg-muted text-muted-foreground'
            return (
              <Link
                key={mod.id}
                to={`/modules/${mod.id}`}
                className="group"
              >
                <Card className="h-full gap-0 py-5 transition-all hover:shadow-md hover:-translate-y-px">
                  <CardHeader className="px-5">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', tint)}>
                        <Icon size={16} />
                      </div>
                      <CardTitle className="flex-1 text-sm">{mod.label}</CardTitle>
                      <Badge variant="outline" size="sm">{mod.guides.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pt-3">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {mod.guides.slice(0, 3).map(g => g.label).join(' · ')}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      가이드 열기 <ChevronRight size={12} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ─── 최근 업데이트 + 빠른 링크 2-col ─────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 최근 업데이트 — 2col */}
        <Card className="lg:col-span-2 gap-0 py-0">
          <CardHeader className="px-6 pt-5 pb-4 border-b">
            <div className="flex items-end justify-between gap-2">
              <div>
                <CardTitle>최근 업데이트</CardTitle>
                <CardDescription className="mt-1">새로 추가되거나 수정된 가이드</CardDescription>
              </div>
              <CardAction>
                <Link
                  to="/updates"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  전체 보기 <ArrowRight size={12} />
                </Link>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <ul className="divide-y">
              {recent5.map((g, idx) => {
                const isNew = idx < 3 // 최근순 정렬 기준 상위 3개만 NEW
                return (
                  <li key={g.id}>
                    <Link
                      to={`/guides/${g.id}`}
                      className="group flex items-center gap-3 px-6 py-3 transition-colors hover:bg-accent/50"
                    >
                      <Badge variant="outline" size="sm" className="shrink-0 font-normal">
                        {g.module}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground group-hover:underline">
                          {g.title}
                        </p>
                      </div>
                      {isNew && <Badge variant="new" size="sm">NEW</Badge>}
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {g.updated_at}
                      </span>
                      <ChevronRight size={14} className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        {/* 빠른 링크 + 모듈 현황 */}
        <div className="space-y-6">
          {/* 빠른 링크 */}
          <Card className="gap-0 py-0">
            <CardHeader className="px-6 pt-5 pb-4 border-b">
              <CardTitle className="text-base">빠른 링크</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {[
                { to: '/faq',      Icon: MessageCircle, label: 'FAQ',          desc: '반복 문의 해결' },
                { to: '/updates',  Icon: Bell,          label: '업데이트 이력',  desc: '정책 및 기능 변경' },
                { to: '/feedback', Icon: MessageSquare, label: '오류 제보',     desc: '개선 요청 제출' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
                >
                  <item.Icon size={16} className="shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* 모듈 현황 — 공식 bar chart 대신 가독성 좋은 리스트 */}
          <Card className="gap-0 py-0">
            <CardHeader className="px-6 pt-5 pb-4 border-b">
              <CardTitle className="text-base">모듈별 가이드 수</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4 space-y-3">
              {MODULE_TREE.slice(0, 5).map(mod => {
                const pct = (mod.guides.length / 6) * 100
                return (
                  <div key={mod.id}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate text-muted-foreground">{mod.label}</span>
                      <span className="tabular-nums font-medium text-foreground">{mod.guides.length}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground/70 transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  )
}
