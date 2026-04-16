// src/pages/GuideListPage.jsx — shadcn/ui 표준
import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GUIDES, MODULE_TREE } from '@/data/mockData'
import { Search, ChevronRight, Eye, ThumbsUp, Clock, Filter, SortAsc } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const TYPE_META = {
  SOP:      { label:'절차 가이드', variant:'sop' },
  DECISION: { label:'판단 기준',   variant:'decision' },
  REFERENCE:{ label:'참조 자료',   variant:'reference' },
  TROUBLE:  { label:'트러블슈팅',  variant:'trouble' },
  RESPONSE: { label:'대응 매뉴얼', variant:'response' },
  POLICY:   { label:'정책 공지',   variant:'policy' },
}

const SORT_OPTIONS = [
  { value: 'updated', label: '최신순' },
  { value: 'views',   label: '인기순' },
  { value: 'title',   label: '제목순' },
]

export default function GuideListPage() {
  const { moduleId }   = useParams()
  const [search, setSearch]   = useState('')
  const [typeFilter, setType] = useState('ALL')
  const [modFilter,  setMod]  = useState(moduleId || 'ALL')
  const [sort, setSort]       = useState('updated')

  const moduleLabel = useMemo(() => {
    if (!moduleId) return null
    return MODULE_TREE.find(m => m.id === moduleId)?.label || null
  }, [moduleId])

  const allGuides = useMemo(() =>
    Object.entries(GUIDES).map(([id, g]) => ({ id, ...g })),
  [])

  const filtered = useMemo(() => {
    let list = allGuides
    if (modFilter !== 'ALL') list = list.filter(g => g.module === modFilter)
    if (typeFilter !== 'ALL') list = list.filter(g => g.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.tldr?.toLowerCase().includes(q) ||
        g.module?.toLowerCase().includes(q)
      )
    }
    if (sort === 'updated') list = [...list].sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
    if (sort === 'views')   list = [...list].sort((a, b) => (b.views || 0) - (a.views || 0))
    if (sort === 'title')   list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'ko'))
    return list
  }, [allGuides, modFilter, typeFilter, search, sort])

  const modules   = useMemo(() => [...new Set(allGuides.map(g => g.module))].sort(), [allGuides])
  const typeCount = useMemo(() => {
    const c = {}
    allGuides.forEach(g => { c[g.type] = (c[g.type] || 0) + 1 })
    return c
  }, [allGuides])

  // 렌더 시점 기준 — 7일 이내 업데이트 판단용
  const sevenDaysAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.getTime()
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">

      {/* 헤더 */}
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">홈</Link>
          <ChevronRight size={12} />
          <span className="font-medium text-foreground">
            {moduleLabel ? moduleLabel : '전체 가이드'}
          </span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {moduleLabel ? moduleLabel : '전체 가이드'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          총 {allGuides.length}개 가이드 · {filtered.length}개 표시 중
        </p>
      </div>

      {/* 필터 바 */}
      <div className="mb-6 space-y-3">
        {/* 검색 */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="가이드 검색..."
            className="pl-9"
          />
        </div>

        {/* 필터 칩 그룹 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Filter size={12} />
            <span>유형:</span>
          </div>
          <button
            onClick={() => setType('ALL')}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', typeFilter === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}
          >
            전체 ({allGuides.length})
          </button>
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => setType(type)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', typeFilter === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}
            >
              {meta.label} ({typeCount[type] || 0})
            </button>
          ))}
        </div>

        {/* 모듈 필터 + 정렬 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Filter size={12} />
            <span>카테고리:</span>
          </div>
          <button
            onClick={() => setMod('ALL')}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', modFilter === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}
          >전체</button>
          {modules.map(m => (
            <button key={m} onClick={() => setMod(m)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors truncate max-w-32',
                modFilter === m ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >{m.split('/')[0]}</button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <SortAsc size={12} className="text-muted-foreground" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="h-7 rounded border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 가이드 목록 */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Search size={36} className="text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">검색 결과가 없습니다</p>
          <p className="text-xs text-muted-foreground">필터를 변경하거나 다른 키워드로 검색해보세요</p>
          <button onClick={() => { setSearch(''); setType('ALL'); setMod('ALL') }} className="mt-2 text-xs text-blue-600 hover:underline">
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(g => {
            const tm = TYPE_META[g.type] || TYPE_META.SOP
            const isNew = g.updated && new Date(g.updated).getTime() > sevenDaysAgo
            return (
              <Link
                key={g.id}
                to={`/guides/${g.id}`}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-ring/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={tm.variant} size="sm">{tm.label}</Badge>
                    {isNew && <Badge variant="new" size="sm">NEW</Badge>}
                  </div>
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground leading-tight">{g.title}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {g.tldr?.split('\n')[0]}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border pt-3">
                  <span className="truncate">{g.module?.split('/')[0]}</span>
                  {g.views && (
                    <span className="flex items-center gap-1 shrink-0">
                      <Eye size={10} /> {g.views}
                    </span>
                  )}
                  {g.helpful && (
                    <span className="flex items-center gap-1 shrink-0">
                      <ThumbsUp size={10} /> {g.helpful}
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-1 shrink-0">
                    <Clock size={10} /> {g.updated?.slice(0, 10)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
