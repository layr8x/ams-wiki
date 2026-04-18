// src/components/search/SearchOverlay.jsx — shadcn/ui Command 팔레트
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlass as Search,
  ArrowRight,
  FileText,
  BookOpen,
  Warning as AlertTriangle,
  GitBranch,
  ChatText as MessageSquare,
  SealCheck as FileCheck,
  Clock,
  TrendUp as TrendingUp,
  CircleNotch as Loader2,
  Sparkle
} from '@phosphor-icons/react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { GUIDES, RECENT_GUIDES, SEARCH_SYNONYMS } from '@/data/mockData'
import { useSearchSummary } from '@/hooks/useSearchSummary'
import NoResultFallback from '@/components/search/NoResultFallback'
import { cn } from '@/lib/utils'

const TYPE_META = {
  SOP:      { label: '절차형',    icon: BookOpen,      color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-500/10' },
  DECISION: { label: '판단분기',  icon: GitBranch,     color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10' },
  REFERENCE:{ label: '참조형',    icon: FileText,      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  TROUBLE:  { label: '트러블슈팅',icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400',   bg: 'bg-orange-500/10' },
  RESPONSE: { label: '대응매뉴얼',icon: MessageSquare, color: 'text-purple-600 dark:text-purple-400',   bg: 'bg-purple-500/10' },
  POLICY:   { label: '정책공지',  icon: FileCheck,     color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-500/10' },
}

function searchGuides(query) {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const expandedTerms = [q]
  for (const [canonical, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (synonyms.some(s => s.toLowerCase().includes(q)) || q.includes(canonical.toLowerCase())) {
      expandedTerms.push(canonical.toLowerCase())
    }
  }
  return Object.entries(GUIDES)
    .filter(([, g]) => {
      const text = [g.title, g.tldr, g.module, g.path, ...(g.targets || [])].join(' ').toLowerCase()
      return expandedTerms.some(t => text.includes(t))
    })
    .slice(0, 8)
    .map(([id, g]) => ({ id, ...g }))
}

export default function SearchOverlay() {
  const { isOpen, close } = useSearchStore()
  const navigate  = useNavigate()
  const [query, setQuery]    = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading]  = useState(false)
  const inputRef = useRef(null)

  const prevOpen = useRef(isOpen)
  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      // Reset in microtask to avoid sync setState in effect
      queueMicrotask(() => { setQuery(''); setResults([]); setSelected(0) })
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.classList.add('search-open')
    }
    if (!isOpen && prevOpen.current) {
      document.body.classList.remove('search-open')
    }
    prevOpen.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      const t = setTimeout(() => setResults([]), 0)
      return () => clearTimeout(t)
    }
    const loadTimer = setTimeout(() => setLoading(true), 0)
    const timer = setTimeout(() => {
      setResults(searchGuides(query)); setSelected(0); setLoading(false)
    }, 120)
    return () => { clearTimeout(loadTimer); clearTimeout(timer) }
  }, [query])

  const summary = useSearchSummary(query, results)

  const goTo = useCallback((id) => { navigate('/guides/' + id); close() }, [navigate, close])
  const openFeedback = useCallback((topic) => {
    const qs = topic ? `?topic=${encodeURIComponent(topic)}` : ''
    navigate('/feedback' + qs); close()
  }, [navigate, close])

  useEffect(() => {
    if (!isOpen) return
    const h = (e) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, Math.max(0, results.length - 1))) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(0, s - 1)) }
      if (e.key === 'Enter' && results[selected]) goTo(results[selected].id)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, results, selected, close, goTo])

  if (!isOpen) return null

  const recent  = RECENT_GUIDES.slice(0, 5)
  const popular = [...RECENT_GUIDES].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4)
  const showResults = query.trim().length > 0

  return (
    <div className="fixed inset-0 z-[999]" role="dialog" aria-modal="true" aria-label="가이드 검색">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="relative top-[10vh] mx-auto w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl">

          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            {loading
              ? <Loader2 size={16} className="shrink-0 text-muted-foreground animate-spin" />
              : <Search   size={16} className="shrink-0 text-muted-foreground" />
            }
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="가이드 검색... (예: 병합, 환불, QR 출석)"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">ESC</kbd>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {showResults ? (
              results.length === 0 && !loading ? (
                <NoResultFallback
                  query={query}
                  onGoTo={goTo}
                  onNavigateFeedback={openFeedback}
                />
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Loader2 size={20} className="animate-spin text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">검색 중...</p>
                </div>
              ) : (
                <div className="p-1">
                  <AiSummaryCard summary={summary} onSourceClick={goTo} />
                  <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">검색 결과 {results.length}건</p>
                  {results.map((g, i) => {
                    const meta = TYPE_META[g.type] || TYPE_META.SOP
                    const Icon = meta.icon
                    return (
                      <button key={g.id} onClick={() => goTo(g.id)} onMouseEnter={() => setSelected(i)}
                        className={cn('flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors', selected === i ? 'bg-accent' : 'hover:bg-accent/50')}
                      >
                        <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md', meta.bg)}>
                          <Icon size={13} className={meta.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{g.title}</span>
                            <span className={cn('shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded', meta.bg, meta.color)}>{meta.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{g.module} · {g.tldr?.split('\n')[0]?.slice(0, 60)}</p>
                        </div>
                        <ArrowRight size={13} className="mt-1 shrink-0 text-muted-foreground/50" />
                      </button>
                    )
                  })}
                </div>
              )
            ) : (
              <div className="p-1">
                <div className="px-3 py-1.5 flex items-center gap-1.5">
                  <Clock size={11} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">최근 업데이트</span>
                </div>
                {recent.map(g => {
                  const meta = TYPE_META[GUIDES[g.id]?.type || 'SOP'] || TYPE_META.SOP
                  const Icon = meta.icon
                  return (
                    <button key={g.id} onClick={() => goTo(g.id)}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-accent/50 transition-colors"
                    >
                      <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded', meta.bg)}>
                        <Icon size={11} className={meta.color} />
                      </div>
                      <span className="flex-1 text-sm text-foreground truncate">{g.title}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{g.module?.split('/')[0]}</span>
                    </button>
                  )
                })}
                <div className="my-1 h-px bg-border mx-2" />
                <div className="px-3 py-1.5 flex items-center gap-1.5">
                  <TrendingUp size={11} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">인기 가이드</span>
                </div>
                {popular.map(g => (
                  <button key={g.id} onClick={() => goTo(g.id)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-accent/50 transition-colors"
                  >
                    <span className="flex-1 text-sm text-foreground truncate">{g.title}</span>
                    {g.views && <span className="shrink-0 text-[11px] text-muted-foreground">{g.views.toLocaleString()} 조회</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span><kbd className="rounded border border-border bg-background px-1 font-mono">↑↓</kbd> 이동</span>
              <span><kbd className="rounded border border-border bg-background px-1 font-mono">↵</kbd> 열기</span>
              <span><kbd className="rounded border border-border bg-background px-1 font-mono">ESC</kbd> 닫기</span>
            </div>
            <span className="text-[11px] text-muted-foreground">{Object.keys(GUIDES).length}개 가이드</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AiSummaryCard({ summary, onSourceClick }) {
  if (summary.status === 'idle' || summary.status === 'disabled') return null

  const base = 'mx-2 mb-2 mt-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5'

  if (summary.status === 'loading') {
    return (
      <div className={base} aria-live="polite">
        <div className="flex items-center gap-2 text-[11px] font-medium text-primary">
          <Sparkle size={12} weight="fill" />
          <span>AI 요약</span>
          <Loader2 size={11} className="ml-auto animate-spin text-muted-foreground" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-2.5 w-[90%] rounded bg-muted animate-pulse" />
          <div className="h-2.5 w-[72%] rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (summary.status === 'error' || summary.status === 'empty') {
    return null
  }

  if (summary.status === 'ready') {
    const sources = (summary.sources || []).map(id => ({ id, guide: GUIDES[id] })).filter(s => s.guide)
    return (
      <div className={base} aria-live="polite">
        <div className="flex items-center gap-2 text-[11px] font-medium text-primary">
          <Sparkle size={12} weight="fill" />
          <span>AI 요약</span>
          <span className="ml-auto text-[10px] font-normal text-muted-foreground">Claude Haiku 4.5</span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">{summary.summary}</p>
        {sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sources.map(({ id, guide }) => (
              <button
                key={id}
                onClick={() => onSourceClick(id)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10.5px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <FileText size={9} />
                <span className="max-w-[160px] truncate">{guide.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
  return null
}
