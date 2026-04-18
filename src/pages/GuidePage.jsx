// src/pages/GuidePage.jsx
// 구조: PageHeader → Meta bar → TL;DR → Cautions → 본문 섹션(type별) → Feedback
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ArrowSquareOut as ExternalLink,
  Clock,
  Warning as AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  User,
  FileText,
  GitBranch,
  ShieldCheck,
  CheckCircle as CheckCircle2
} from '@phosphor-icons/react'
import { GUIDES } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { PageShell, PageHeader, EmptyState } from '@/components/common/page-primitives'
import { useSubmitFeedback } from '@/hooks/useGuides'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { getGuideType, SEVERITY, DECISION_STATUS } from '@/lib/guideTypes'

export default function GuidePage() {
  const { id } = useParams()
  // id가 바뀌면 내부 컴포넌트가 재마운트되어 voted state가 자동 초기화됨
  // (effect + setState 를 피하는 공식 패턴: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)
  return <GuidePageInner key={id} id={id} />
}

function GuidePageInner({ id }) {
  const guide = GUIDES[id]
  const { submit, isSubmitting } = useSubmitFeedback()
  const [voted, setVoted] = useState(null)
  const { track } = useRecentlyViewed()

  useEffect(() => {
    if (guide) track(id)
  }, [id, guide, track])

  if (!guide) {
    return (
      <PageShell maxWidth="5xl">
        <EmptyState
          icon={FileText}
          title="가이드를 찾을 수 없습니다"
          description={`id: ${id}`}
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/guides">가이드 목록으로</Link>
            </Button>
          }
        />
      </PageShell>
    )
  }

  const tm = getGuideType(guide.type)
  const TypeIcon = tm.icon

  const handleVote = async (vote) => {
    if (voted) return
    setVoted(vote)
    try { await submit({ guideId: id, vote }) } catch { /* no-op */ }
  }

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        breadcrumbs={[
          { label: '홈', to: '/' },
          { label: '가이드', to: '/guides' },
          { label: guide.module },
        ]}
        title={guide.title}
        description={guide.path}
      >
        {/* 메타바 — 유형 / 버전 / 작성자 / 수정일 / 대상 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Badge variant={tm.variant}>
            <TypeIcon size={12} /> {tm.label}
          </Badge>
          {guide.version && (
            <span className="inline-flex items-center gap-1">
              <GitBranch size={12} /> {guide.version}
            </span>
          )}
          {guide.author && (
            <span className="inline-flex items-center gap-1">
              <User size={12} /> {guide.author}
            </span>
          )}
          {guide.updated && (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {guide.updated}
            </span>
          )}
          {guide.targets?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} /> {guide.targets.join(', ')}
            </span>
          )}
          {guide.confluenceUrl && (
            <a
              href={`${guide.confluenceUrl}/${encodeURIComponent(guide.title.replace(/\s+/g, '+'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:underline"
            >
              <ExternalLink size={12} /> Confluence 원본
            </a>
          )}
        </div>
      </PageHeader>

      {/* 핵심 요약 */}
      {guide.tldr && (
        <Card className="mb-6 border-l-4 border-l-primary gap-0 py-0">
          <CardContent className="px-6 py-5">
            <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">
              핵심 요약
            </p>
            <p className="whitespace-pre-line text-base leading-relaxed text-foreground">
              {guide.tldr}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 주의사항 */}
      {guide.cautions?.length > 0 && (
        <Card className="mb-8 border-amber-500/30 bg-amber-500/5 gap-0 py-0">
          <CardHeader className="px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-sm text-amber-700 dark:text-amber-300">
                반드시 확인하세요
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <ul className="space-y-2 text-sm text-foreground">
              {guide.cautions.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-600 dark:text-amber-400">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ─── SOP: 단계 ──────────────────────────────────────────── */}
      {guide.steps && (
        <section className="mb-10 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">처리 절차</h2>
          <ol className="space-y-4">
            {guide.steps.map((s, i) => (
              <li key={i}>
                <Card className="gap-0 py-0">
                  <CardHeader className="px-6 pt-5 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold tabular-nums">
                        {i + 1}
                      </div>
                      <CardTitle className="mt-0.5 text-base">{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-5">
                    {s.desc && <p className="prose-ams text-sm">{s.desc}</p>}
                    {s.image?.url && (
                      <figure className="mt-3 overflow-hidden rounded-md border bg-muted/30">
                        <img
                          src={s.image.url}
                          alt={s.image.name}
                          className="w-full"
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.dataset.fallback = '1'
                              e.currentTarget.src = '/placeholder-screenshot.svg'
                            }
                          }}
                        />
                        {s.image.name && (
                          <figcaption className="border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                            {s.image.name}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ─── 주요 항목 테이블 ─────────────────────────────────── */}
      {guide.mainItemsTable && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">주요 항목</h2>
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[520px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32 sm:w-40">항목</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="w-16 sm:w-20 text-center">필수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guide.mainItemsTable.map((it, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{it.field}</TableCell>
                    <TableCell className="text-muted-foreground">{it.desc}</TableCell>
                    <TableCell className="text-center">
                      {it.required ? (
                        <Badge variant="critical" size="sm">필수</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">선택</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* ─── 케이스별 처리 ────────────────────────────────────── */}
      {guide.cases && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">케이스별 처리</h2>
          <div className="space-y-3">
            {guide.cases.map((c, i) => {
              const images = c.images?.length ? c.images : (c.image ? [c.image] : [])
              return (
                <Card key={i} className="gap-0 py-0">
                  <CardContent className="px-6 py-4">
                    <p className="mb-2 text-sm font-semibold text-foreground">
                      Case {i + 1}. {c.label}
                    </p>
                    <p className="prose-ams mb-2 text-sm">{c.action}</p>
                    {images.length > 0 && (
                      <div
                        className={
                          images.length > 1
                            ? "mt-3 mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
                            : "mt-3 mb-2"
                        }
                      >
                        {images.map((img, j) => (
                          <figure
                            key={j}
                            className="overflow-hidden rounded-md border bg-muted/30"
                          >
                            <img
                              src={img.url}
                              alt={img.name || `Case ${i + 1} image ${j + 1}`}
                              className="w-full"
                              loading="lazy"
                              onError={(e) => {
                                if (!e.currentTarget.dataset.fallback) {
                                  e.currentTarget.dataset.fallback = '1'
                                  e.currentTarget.src = '/placeholder-screenshot.svg'
                                }
                              }}
                            />
                            {img.name && (
                              <figcaption className="border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                                {img.name}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                    {c.note && (
                      <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Note.</span> {c.note}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── 판단 테이블 ──────────────────────────────────────── */}
      {guide.decisionTable && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">판단 기준</h2>
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>조건</TableHead>
                  <TableHead>처리</TableHead>
                  <TableHead className="w-32 sm:w-40">비고</TableHead>
                  <TableHead className="w-16 sm:w-20 text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guide.decisionTable.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.cond}</TableCell>
                    <TableCell className="text-sm">{r.action}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.note}</TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const st = DECISION_STATUS[r.status]
                        return (
                          <Badge variant={st?.variant ?? 'outline'} size="sm">
                            {st?.label ?? r.status}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* ─── 트러블 테이블 ─────────────────────────────────────── */}
      {guide.troubleTable && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">자주 발생하는 오류</h2>
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">오류</TableHead>
                  <TableHead className="w-1/4">원인</TableHead>
                  <TableHead>해결</TableHead>
                  <TableHead className="w-20 sm:w-24 text-center">심각도</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guide.troubleTable.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.issue}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.cause}</TableCell>
                    <TableCell className="text-sm">{r.solution}</TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const sv = SEVERITY[r.severity]
                        return (
                          <Badge variant={sv?.variant ?? 'outline'} size="sm">
                            {sv?.label ?? r.severity}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* ─── CS 응답 매뉴얼 ────────────────────────────────────── */}
      {guide.responses && (
        <section className="mb-10 space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">응답 스크립트</h2>
          {guide.responses.map((r, i) => (
            <Card key={i} className="gap-0 py-0">
              <CardContent className="px-6 py-4 space-y-2">
                <Badge variant="response" size="sm">시나리오 {i + 1}</Badge>
                <p className="text-sm font-semibold">{r.scenario}</p>
                <p className="rounded-md bg-muted px-3 py-2 text-sm italic text-foreground">
                  &ldquo;{r.script}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* ─── 참조 데이터 ───────────────────────────────────────── */}
      {guide.referenceData && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">참조 데이터</h2>
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[480px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32 sm:w-40">용어</TableHead>
                  <TableHead>정의</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guide.referenceData.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium font-mono text-sm">{r.term}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.definition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* ─── 정책 비교 ─────────────────────────────────────────── */}
      {guide.policyDiff && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">정책 비교 (전/후)</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="gap-0 py-0">
              <CardHeader className="px-6 pt-5 pb-3 border-b bg-muted/40">
                <CardTitle className="text-sm text-muted-foreground">변경 전</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 text-sm text-muted-foreground">
                {guide.policyDiff.before}
              </CardContent>
            </Card>
            <Card className="gap-0 py-0 border-primary/30">
              <CardHeader className="px-6 pt-5 pb-3 border-b bg-primary/5">
                <CardTitle className="text-sm text-primary">변경 후</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 text-sm text-foreground">
                {guide.policyDiff.after}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Separator className="my-10" />

      {/* ─── 유용성 피드백 ─────────────────────────────────────── */}
      <section>
        <Card className="gap-0 py-0">
          <CardContent className="flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
            <div>
              <p className="text-sm font-medium text-foreground">이 가이드가 도움이 되셨나요?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                피드백은 가이드 개선에 사용됩니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {voted === 'helpful' ? (
                <Badge variant="success" size="lg">
                  <CheckCircle2 size={12} /> 소중한 피드백 감사합니다
                </Badge>
              ) : voted === 'needs_improvement' ? (
                <Badge variant="warning" size="lg">
                  <CheckCircle2 size={12} /> 피드백이 기록되었습니다
                </Badge>
              ) : (
                <>
                  <Button
                    variant="outline" size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleVote('helpful')}
                  >
                    <ThumbsUp size={14} /> 유용합니다
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleVote('needs_improvement')}
                  >
                    <ThumbsDown size={14} /> 개선이 필요합니다
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  )
}
