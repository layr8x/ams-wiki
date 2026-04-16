// src/pages/GuidePage.jsx — shadcn/ui 표준 전면 재작성
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ExternalLink, Clock, Search as SearchIcon,
  AlertTriangle, CheckCircle2, ChevronRight,
  ShieldCheck, ThumbsUp, ThumbsDown, ChevronDown,
  User, Calendar, ArrowUpRight, BookOpen, GitBranch,
  FileText, MessageSquare, FileCheck
} from 'lucide-react'
import { GUIDES } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useSubmitFeedback } from '@/hooks/useGuides'

// ─── 유형 메타데이터 ──────────────────────────────────────────────────────────
const TYPE_META = {
  SOP:      { label:'절차형',    variant:'sop',      icon: BookOpen },
  DECISION: { label:'판단분기',  variant:'decision', icon: GitBranch },
  REFERENCE:{ label:'참조형',    variant:'reference',icon: FileText },
  TROUBLE:  { label:'트러블슈팅',variant:'trouble',  icon: AlertTriangle },
  RESPONSE: { label:'대응매뉴얼',variant:'response', icon: MessageSquare },
  POLICY:   { label:'정책공지',  variant:'policy',   icon: FileCheck },
}

const SEV_META = {
  critical: { label:'긴급', variant:'critical' },
  high:     { label:'높음', variant:'high' },
  medium:   { label:'보통', variant:'medium' },
  low:      { label:'낮음', variant:'low' },
}

const STATUS_META = {
  safe:   { label:'허용', variant:'safe' },
  warn:   { label:'주의', variant:'warn' },
  danger: { label:'불가', variant:'danger' },
}

// ─── 유의사항 블록 ────────────────────────────────────────────────────────────
function CautionBlock({ items }) {
  return (
    <div className="overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
      <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-100 px-4 py-2.5">
        <AlertTriangle size={13} className="text-amber-600" />
        <span className="text-xs font-bold uppercase tracking-wide text-amber-700">반드시 확인하세요</span>
      </div>
      <ul className="divide-y divide-amber-100">
        {items.map((c, i) => (
          <li key={i} className="flex gap-3 px-4 py-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <p className="text-sm leading-relaxed text-foreground">{c}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── 운영 케이스 아코디언 ─────────────────────────────────────────────────────
function CaseItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn('overflow-hidden rounded-lg border transition-all', open ? 'border-blue-200 bg-blue-50/30' : 'border-border bg-card')}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
          open ? 'bg-blue-600 text-white' : 'bg-secondary text-muted-foreground'
        )}>
          {index + 1}
        </div>
        <span className="flex-1 text-sm font-semibold text-foreground">{item.label}</span>
        <ChevronDown size={14} className={cn('shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-14">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap mb-2">{item.action}</p>
          {item.note && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
              <AlertTriangle size={12} className="mt-0.5 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-700">{item.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 피드백 위젯 ─────────────────────────────────────────────────────────────
function FeedbackWidget({ guideId }) {
  const [voted, setVoted]     = useState(null)
  const [comment, setComment] = useState('')
  const [done, setDone]       = useState(false)
  const mutation = useSubmitFeedback(guideId)

  const handleSubmit = async () => {
    await mutation.mutateAsync({ vote: voted, comment })
    setDone(true)
  }

  if (done) return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 size={22} className="text-emerald-600" />
      </div>
      <p className="text-sm font-semibold text-foreground">의견이 반영되었습니다. 감사합니다.</p>
    </div>
  )

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-foreground">이 가이드가 업무에 도움이 되었나요?</p>
      <div className="flex justify-center gap-3 mb-3">
        <button
          onClick={() => setVoted('helpful')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-all',
            voted === 'helpful'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-border bg-background text-muted-foreground hover:border-emerald-200 hover:text-emerald-600'
          )}
        >
          <ThumbsUp size={14} /> 도움됨
        </button>
        <button
          onClick={() => setVoted('needs_improvement')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-all',
            voted === 'needs_improvement'
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-border bg-background text-muted-foreground hover:border-red-200 hover:text-red-500'
          )}
        >
          <ThumbsDown size={14} /> 보완 필요
        </button>
      </div>
      {voted === 'needs_improvement' && (
        <div className="mx-auto max-w-md space-y-2 text-left">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="어떤 점이 부족했나요? (선택 · 200자 이내)"
            maxLength={200}
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {mutation.isPending ? '제출 중...' : '제출하기'}
          </button>
        </div>
      )}
      {voted === 'helpful' && (
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {mutation.isPending ? '제출 중...' : '감사합니다 ✓'}
        </button>
      )}
    </div>
  )
}

// ─── 관련 가이드 ──────────────────────────────────────────────────────────────
function RelatedGuides({ currentId, mod }) {
  const related = Object.entries(GUIDES)
    .filter(([id, g]) => id !== currentId && g.module === mod)
    .slice(0, 3)
  if (!related.length) return null
  return (
    <section className="mt-16">
      <h2 className="mb-4 text-base font-semibold text-foreground">같은 카테고리 가이드</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map(([id, g]) => {
          const tm = TYPE_META[g.type] || TYPE_META.SOP
          return (
            <Link key={id} to={`/guides/${id}`} className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-ring/30 hover:shadow-md">
              <Badge variant={tm.variant} size="sm" className="mb-2">{tm.label}</Badge>
              <p className="text-sm font-semibold text-foreground leading-tight">{g.title}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{g.tldr?.split('\n')[0]}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// ─── On This Page 미니맵 ──────────────────────────────────────────────────────
function OnThisPage({ sections }) {
  const [active, setActive] = useState(sections[0]?.id || '')

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    )
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [sections])

  return (
    <nav aria-label="페이지 내 목차">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">On this page</p>
      <ul className="space-y-0 border-l-2 border-border">
        {sections.map(s => (
          <li
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className={cn(
              'cursor-pointer border-l-2 py-1 pl-4 text-xs transition-all -ml-0.5 leading-relaxed',
              active === s.id
                ? 'border-blue-600 font-semibold text-blue-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {s.label}
          </li>
        ))}
      </ul>
    </nav>
  )
}

function SecHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="mb-6 scroll-mt-20 text-xl font-bold tracking-tight text-foreground"
    >
      {children}
    </h2>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const { id } = useParams()
  const guide   = GUIDES[id] || GUIDES['member-merge']
  const [searchTerm, setSearchTerm] = useState('')
  const tm = TYPE_META[guide.type] || TYPE_META.SOP

  const sections = [
    { id: 'sec-overview',  label: '문서 개요' },
    guide.type === 'SOP'       && guide.steps        && { id: 'sec-steps',    label: '단계별 가이드' },
    guide.type === 'DECISION'  && guide.decisionTable && { id: 'sec-decision', label: '판단 기준' },
    guide.type === 'REFERENCE' && guide.referenceData && { id: 'sec-reference',label: '용어 참조' },
    guide.troubleTable?.length > 0                   && { id: 'sec-trouble',  label: '트러블슈팅' },
    guide.type === 'RESPONSE'  && guide.responses     && { id: 'sec-response', label: '응대 스크립트' },
    guide.type === 'POLICY'    && guide.policyDiff    && { id: 'sec-policy',   label: '정책 변경' },
    guide.mainItemsTable                              && { id: 'sec-items',    label: '주요 항목 설명' },
    guide.cases?.length                               && { id: 'sec-cases',    label: '운영 케이스' },
    guide.cautions?.length                            && { id: 'sec-cautions', label: '유의사항' },
    { id: 'sec-feedback', label: '피드백' },
  ].filter(Boolean)

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-16 px-6 py-14 items-start">

      {/* ── 본문 ─────────────────────────────────────────────────────────── */}
      <article className="flex-1 min-w-0">

        {/* 브레드크럼 */}
        <nav className="mb-7 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">홈</Link>
          <ChevronRight size={12} />
          <Link to="/guides" className="hover:text-foreground transition-colors">가이드 목록</Link>
          <ChevronRight size={12} />
          <span className="font-medium text-foreground">{guide.module}</span>
        </nav>

        {/* 01 메타 헤더 */}
        <div id="sec-overview" className="mb-12 scroll-mt-20">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{guide.module}</Badge>
            <Badge variant={tm.variant}>{tm.label}</Badge>
            {guide.targets?.map(t => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
            <div className="ml-auto">
              <Link
                to="/editor"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-ring/30 hover:text-foreground"
              >
                <Clock size={11} /> 버전 이력
              </Link>
            </div>
          </div>

          <h1 className="mb-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {guide.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar size={12} /> {guide.updated}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5"><User size={12} /> {guide.author || '플랫폼서비스실'}</span>
            {guide.version && (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <Badge variant="outline" size="sm">{guide.version}</Badge>
              </>
            )}
            {guide.views && (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{guide.views.toLocaleString()} 조회</span>
              </>
            )}
          </div>
        </div>

        {/* 02 TL;DR */}
        <div className="mb-10 rounded-lg border border-blue-200 bg-blue-50 px-5 py-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-600">TL;DR</p>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{guide.tldr}</p>
        </div>

        {/* 03 메뉴 경로 */}
        <div className="mb-14 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
            {guide.path?.split('>').map((p, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={i === arr.length - 1 ? 'font-semibold text-foreground' : ''}>{p.trim()}</span>
                {i !== arr.length - 1 && <ChevronRight size={10} />}
              </span>
            ))}
          </div>
          {guide.amsUrl && (
            <a href={guide.amsUrl} target="_blank" rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              AMS 바로가기 <ArrowUpRight size={12} />
            </a>
          )}
        </div>

        {/* ── SOP 절차형 ──────────────────────────────────────────────────── */}
        {guide.type === 'SOP' && guide.steps && (
          <section className="mb-16">
            <SecHeading id="sec-steps">단계별 가이드</SecHeading>
            <ol className="relative space-y-10 pl-6 before:absolute before:left-[13px] before:top-4 before:h-[calc(100%-32px)] before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-border">
              {guide.steps.map((s, i) => (
                <li key={i} className="relative flex gap-6">
                  <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-background text-xs font-bold text-blue-600">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="mb-4 text-base font-bold text-foreground">{s.title}</h3>
                    <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                      {s.image ? (
                        <div>
                          <img
                            src={s.image.url}
                            alt={s.image.name || s.title}
                            className="w-full block"
                            onError={e => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="hidden items-center justify-center p-10 text-xs text-muted-foreground">
                            [ {s.image.name || 'AMS 화면 캡처'} ]
                          </div>
                        </div>
                      ) : null}
                      <div className="px-5 py-4">
                        <p className="text-sm leading-relaxed text-foreground">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── DECISION 판단분기 ─────────────────────────────────────────── */}
        {guide.type === 'DECISION' && guide.decisionTable && (
          <section className="mb-16">
            <SecHeading id="sec-decision">판단 기준표</SecHeading>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-5/12">조건</TableHead>
                    <TableHead className="w-5/12">처리 방법</TableHead>
                    <TableHead className="w-2/12 text-center">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guide.decisionTable.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-foreground">{row.cond}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <p>{row.action}</p>
                        {row.note && <p className="mt-1 text-xs text-amber-600">※ {row.note}</p>}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={STATUS_META[row.status]?.variant || 'secondary'} size="sm">
                          {STATUS_META[row.status]?.label || row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* ── REFERENCE 참조형 ──────────────────────────────────────────── */}
        {guide.type === 'REFERENCE' && guide.referenceData && (
          <section className="mb-16">
            <SecHeading id="sec-reference">용어 참조</SecHeading>
            {/* 검색 */}
            <div className="relative mb-4">
              <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="용어 검색..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-border divide-y divide-border">
              {guide.referenceData
                .filter(r => !searchTerm || r.term.toLowerCase().includes(searchTerm.toLowerCase()) || r.def.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((r, i) => (
                  <div key={i} className="flex gap-4 px-4 py-3.5">
                    <span className="w-44 shrink-0 text-sm font-semibold text-foreground">{r.term}</span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{r.def}</span>
                  </div>
                ))
              }
            </div>
          </section>
        )}

        {/* ── TROUBLE 트러블슈팅 ────────────────────────────────────────── */}
        {guide.troubleTable?.length > 0 && (
          <section className="mb-16">
            <SecHeading id="sec-trouble">트러블슈팅</SecHeading>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>오류/증상</TableHead>
                    <TableHead>원인</TableHead>
                    <TableHead>해결 방법</TableHead>
                    <TableHead className="text-center w-20">심각도</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guide.troubleTable.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs font-medium text-foreground">{row.issue}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.cause}</TableCell>
                      <TableCell className="text-sm text-foreground">{row.solution}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={SEV_META[row.severity]?.variant || 'medium'} size="sm">
                          {SEV_META[row.severity]?.label || row.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* ── RESPONSE 대응매뉴얼 ───────────────────────────────────────── */}
        {guide.type === 'RESPONSE' && guide.responses && (
          <section className="mb-16">
            <SecHeading id="sec-response">응대 스크립트</SecHeading>
            <div className="space-y-4">
              {guide.responses.map((r, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.case}</span>
                    <Badge variant="outline" size="sm">{r.tag}</Badge>
                    {r.severity && (
                      <Badge variant={SEV_META[r.severity]?.variant || 'medium'} size="sm">
                        {SEV_META[r.severity]?.label}
                      </Badge>
                    )}
                  </div>
                  <div className="rounded-md bg-muted/40 px-4 py-3">
                    <p className="text-sm leading-relaxed text-foreground">
                      <span className="mr-2 text-xs font-bold text-muted-foreground">스크립트</span>
                      {r.script}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── POLICY 정책공지 ───────────────────────────────────────────── */}
        {guide.type === 'POLICY' && guide.policyDiff && (
          <section className="mb-16">
            <SecHeading id="sec-policy">정책 변경 내용</SecHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">변경 전</p>
                <p className="text-sm font-medium text-foreground">{guide.policyDiff.before}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-600">변경 후</p>
                <p className="text-sm font-medium text-foreground">{guide.policyDiff.after}</p>
              </div>
            </div>
            {(guide.policyDiff.effectiveDate || guide.policyDiff.scope) && (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                {guide.policyDiff.effectiveDate && <span className="mr-4">시행일: <strong className="text-foreground">{guide.policyDiff.effectiveDate}</strong></span>}
                {guide.policyDiff.scope && <span>적용 범위: <strong className="text-foreground">{guide.policyDiff.scope}</strong></span>}
              </div>
            )}
          </section>
        )}

        {/* ── 주요 항목 설명 ──────────────────────────────────────────────── */}
        {guide.mainItemsTable && (
          <section className="mb-16">
            <SecHeading id="sec-items">주요 항목 설명</SecHeading>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-1/3">항목</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead className="w-20 text-center">필수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guide.mainItemsTable.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold text-foreground">{row.field}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.desc}</TableCell>
                      <TableCell className="text-center">
                        {row.required
                          ? <CheckCircle2 size={14} className="mx-auto text-emerald-500" />
                          : <span className="text-xs text-muted-foreground/50">—</span>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* ── 운영 케이스 ──────────────────────────────────────────────────── */}
        {guide.cases?.length > 0 && (
          <section className="mb-16">
            <SecHeading id="sec-cases">운영 케이스</SecHeading>
            <div className="space-y-2">
              {guide.cases.map((c, i) => <CaseItem key={i} item={c} index={i} />)}
            </div>
          </section>
        )}

        {/* ── 유의사항 ──────────────────────────────────────────────────────── */}
        {guide.cautions?.length > 0 && (
          <section className="mb-16">
            <SecHeading id="sec-cautions">유의사항</SecHeading>
            <CautionBlock items={guide.cautions} />
          </section>
        )}

        {/* ── 관련 가이드 ──────────────────────────────────────────────────── */}
        <RelatedGuides currentId={id} mod={guide.module} />

        {/* ── 피드백 ───────────────────────────────────────────────────────── */}
        <section id="sec-feedback" className="mt-16 scroll-mt-20">
          <Separator className="mb-10" />
          <Card>
            <CardContent className="py-8">
              <FeedbackWidget guideId={id} />
            </CardContent>
          </Card>
        </section>

      </article>

      {/* ── 우측 사이드바 ────────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-52 shrink-0 sticky top-20">
        <OnThisPage sections={sections} />

        {/* Confluence 링크 */}
        {guide.confluenceUrl && (
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 text-xs font-semibold text-foreground">원본 문서</p>
              <a
                href={guide.confluenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink size={11} /> Confluence에서 보기
              </a>
            </CardContent>
          </Card>
        )}

        {/* 실시간 지원 */}
        <Card className="mt-3">
          <CardContent className="p-4">
            <p className="mb-1 text-xs font-semibold text-foreground">실시간 지원</p>
            <p className="mb-3 text-xs text-muted-foreground">더 궁금한 내용은 플랫폼서비스실로 문의하세요.</p>
            <a
              href="https://slack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
            >
              Slack 문의 <ArrowUpRight size={11} />
            </a>
          </CardContent>
        </Card>
      </aside>

    </div>
  )
}
