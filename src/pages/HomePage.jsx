// src/pages/HomePage.jsx
// 독자 유용성 중심 대시보드.
//   - 상단 통계 3종 (가이드 만족도는 독자에게 무의미하므로 제거)
//   - 최근 본 가이드 (localStorage) — 재방문 중심 사용 패턴 지원
//   - 카테고리 그리드
//   - 하단 2열: 최근 업데이트 / 자주 찾는 가이드 Top (조회수 기반)
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
  Clock,
  FileText,
  CaretRight as ChevronRight,
  Bell,
  ChatCircle as MessageCircle,
  PencilSimple as PencilLine,
  Eye,
} from '@phosphor-icons/react'
import { MODULE_TREE, RECENT_GUIDES, GUIDES } from '@/data/mockData'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PageShell, PageHeader, SectionTitle, StatCard, EmptyState,
} from '@/components/common/page-primitives'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { getGuideType } from '@/lib/guideTypes'
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
  const { entries: recentlyViewed } = useRecentlyViewed()

  const recentlyViewedGuides = recentlyViewed
    .map(e => (GUIDES[e.id] ? { id: e.id, ...GUIDES[e.id], viewedAt: e.viewedAt } : null))
    .filter(Boolean)
    .slice(0, 4)

  const popularGuides = Object.entries(GUIDES)
    .map(([id, g]) => ({ id, ...g }))
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5)

  return (
    <PageShell>
      <PageHeader
        title="대시보드"
        description="AMS 운영 가이드 통합 위키"
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

      {/* ─── Stat Cards (3) ─────────────────────────────────────── */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          footerDesc="실장·상담실 합산"
        />
        <StatCard
          label="최근 업데이트"
          value={recent5[0]?.updated_at ?? '—'}
          footerTitle={recent5[0]?.title ?? '—'}
          footerDesc={`${recent5[0]?.module ?? ''}${recent5[0]?.version ? ' · ' + recent5[0].version : ''}`}
        />
      </section>

      {/* ─── 최근 본 가이드 (localStorage) ──────────────────────── */}
      <section className="mb-10">
        <SectionTitle
          title="최근 본 가이드"
          description="이어서 보거나 관련 가이드로 빠르게 이동하세요"
        />
        {recentlyViewedGuides.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="아직 열람한 가이드가 없습니다"
            description="아래 카테고리에서 관심 있는 가이드를 열어보세요. 여기에 최근 본 항목이 쌓입니다."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewedGuides.map(g => {
              const tm = getGuideType(g.type)
              return (
                <Link key={g.id} to={`/guides/${g.id}`} className="group">
                  <Card className="h-full gap-0 py-0 transition-all hover:shadow-md hover:-translate-y-px">
                    <CardHeader className="px-4 pt-4 pb-2">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge variant={tm.variant} size="sm">{tm.shortLabel}</Badge>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {g.module}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 text-sm leading-snug group-hover:underline">
                        {g.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-1">
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {g.tldr}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
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

      {/* ─── 최근 업데이트 + 자주 찾는 가이드 2-col ─────────────── */}
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
                const isNew = idx < 3
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

        {/* 사이드: 자주 찾는 가이드 + 빠른 링크 */}
        <div className="space-y-6">
          {/* 자주 찾는 가이드 (조회수 기준 Top 5) */}
          <Card className="gap-0 py-0">
            <CardHeader className="px-6 pt-5 pb-4 border-b">
              <CardTitle className="text-base">자주 찾는 가이드</CardTitle>
              <CardDescription className="mt-1">조회수 Top 5</CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <ol className="divide-y">
                {popularGuides.map((g, idx) => (
                  <li key={g.id}>
                    <Link
                      to={`/guides/${g.id}`}
                      className="group flex items-center gap-3 px-6 py-2.5 transition-colors hover:bg-accent/50"
                    >
                      <span className="w-4 shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
                        {idx + 1}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-sm text-foreground group-hover:underline">
                        {g.title}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                        <Eye size={11} />{g.views ?? 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

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
        </div>
      </section>
    </PageShell>
  )
}
