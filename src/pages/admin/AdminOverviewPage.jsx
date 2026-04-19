// src/pages/admin/AdminOverviewPage.jsx — /admin 대시보드
import { Link } from 'react-router-dom'
import { useDashboardStats, useModuleStats, useRecentGuides } from '@/hooks/useGuides'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { MODULE_TREE } from '@/data/mockData'
import {
  FileText,
  Eye,
  ThumbsUp,
  MagnifyingGlass as Search,
  PencilSimple as PencilLine,
} from '@phosphor-icons/react'

const KPI_ITEMS = [
  { key: 'totalGuides', label: '총 가이드', icon: FileText, suffix: '개' },
  { key: 'totalViews',  label: '누적 조회', icon: Eye,      suffix: '회' },
  { key: 'helpfulRate', label: '도움됨률', icon: ThumbsUp,  suffix: '%' },
  { key: 'searchCount', label: '검색 수',   icon: Search,   suffix: '회' },
]

function formatNumber(n) {
  if (typeof n !== 'number') return '—'
  return n.toLocaleString('ko-KR')
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: moduleStats = {}, isLoading: modsLoading } = useModuleStats()
  const { data: recents = [], isLoading: recentsLoading } = useRecentGuides(8)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AMS Wiki 전체 현황을 한눈에 확인합니다.
          </p>
        </div>
        <Button asChild>
          <Link to="/editor">
            <PencilLine className="mr-1.5 size-4" />
            새 가이드 작성
          </Link>
        </Button>
      </header>

      {/* KPI 카드 */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {KPI_ITEMS.map((item) => {
          const Icon = item.icon
          const value = stats?.[item.key]
          return (
            <Card key={item.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-semibold tabular-nums">
                    {formatNumber(value)}<span className="ml-1 text-sm font-normal text-muted-foreground">{item.suffix}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 모듈별 가이드 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">모듈별 가이드 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {modsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              MODULE_TREE.map((mod) => {
                const count = moduleStats[mod.id] || 0
                const max = Math.max(...Object.values(moduleStats), 1)
                const pct = Math.round((count / max) * 100)
                return (
                  <div key={mod.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{mod.label}</span>
                      <span className="tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* 최근 업데이트 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">최근 업데이트</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/guides">전체 보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recents.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                최근 업데이트된 가이드가 없습니다.
              </p>
            ) : (
              <ul className="divide-y">
                {recents.slice(0, 6).map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-2 py-2">
                    <Link
                      to={`/editor?id=${g.id}`}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {g.title}
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{g.type}</Badge>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {g.updated || g.updated_at?.slice(0, 10) || '—'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
