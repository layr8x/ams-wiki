// src/pages/GuideListPage.jsx
// 구조: PageHeader → 검색/필터 툴바 → 결과 카운트 → 카드 그리드
import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  MagnifyingGlass as Search,
  Eye,
  ThumbsUp,
  Clock,
  FileX,
  CaretRight as ChevronRight
} from '@phosphor-icons/react'
import { getModuleTree } from '@/lib/db'
import { useGuideList } from '@/hooks/useGuides'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  PageShell, PageHeader, EmptyState,
} from '@/components/common/page-primitives'
import { getGuideType, GUIDE_TYPE_FILTER } from '@/lib/guideTypes'
import { cn } from '@/lib/utils'
const SORT_OPTIONS = [
  { value: 'updated', label: '최신순' },
  { value: 'views',   label: '인기순' },
  { value: 'title',   label: '제목순' },
]

export default function GuideListPage() {
  const { moduleId } = useParams()
  const [search, setSearch]   = useState('')
  const [typeFilter, setType] = useState('ALL')
  const [sort, setSort]       = useState('updated')

  const moduleTree = getModuleTree()
  const currentModule = useMemo(
    () => moduleId ? moduleTree.find(m => m.id === moduleId) : null,
    [moduleId, moduleTree]
  )

  const { data: fetchedGuides, isLoading } = useGuideList({
    module: currentModule?.label,
  })
  const allGuides = useMemo(() => fetchedGuides ?? [], [fetchedGuides])

  const filtered = useMemo(() => {
    let list = allGuides
    if (typeFilter !== 'ALL') list = list.filter(g => g.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.tldr?.toLowerCase().includes(q) ||
        g.module?.toLowerCase().includes(q)
      )
    }
    list = [...list].sort((a, b) => {
      if (sort === 'views')   return (b.views ?? 0) - (a.views ?? 0)
      if (sort === 'title')   return a.title.localeCompare(b.title, 'ko')
      return (b.updated ?? '').localeCompare(a.updated ?? '')
    })
    return list
  }, [allGuides, typeFilter, search, sort])

  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[
          { label: '홈', to: '/' },
          { label: '가이드', to: '/guides' },
          ...(currentModule ? [{ label: currentModule.label }] : []),
        ]}
        title={currentModule ? currentModule.label : '전체 가이드'}
        description={
          currentModule
            ? `${currentModule.label} 관련 ${filtered.length}개 가이드`
            : `AMS 운영 가이드 전체 ${allGuides.length}개`
        }
      />

      {/* 툴바: 검색 + 필터 + 정렬 */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="가이드 제목, 요약, 모듈로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 self-start rounded-md border bg-card p-1 sm:self-auto sm:flex-nowrap">
            {SORT_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setSort(o.value)}
                className={cn(
                  'rounded px-2.5 py-1 text-xs font-medium transition-colors sm:px-3',
                  sort === o.value
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {GUIDE_TYPE_FILTER.map(f => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                typeFilter === f.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* 결과 */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`g-sk-${i}`} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileX}
          title="검색 결과가 없습니다"
          description="다른 키워드로 검색하거나 필터를 초기화해 보세요."
          action={
            <Button variant="outline" size="sm" onClick={() => { setSearch(''); setType('ALL') }}>
              필터 초기화
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(g => {
            const typeMeta = getGuideType(g.type)
            return (
              <Link key={g.id} to={`/guides/${g.id}`} className="group">
                <Card className="h-full gap-0 py-0 transition-all hover:shadow-md hover:-translate-y-px">
                  <CardHeader className="px-5 pt-5 pb-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge variant={typeMeta.variant} size="sm">{typeMeta.shortLabel}</Badge>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {g.module}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-base leading-snug group-hover:underline">
                      {g.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-5 pb-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {g.tldr}
                    </p>
                  </CardContent>
                  <CardFooter className="justify-between border-t px-5 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {g.views != null && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Eye size={11} />{g.views}
                        </span>
                      )}
                      {g.helpful != null && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <ThumbsUp size={11} />{g.helpful}
                        </span>
                      )}
                    </div>
                    {g.updated && (
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Clock size={11} />{g.updated}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
