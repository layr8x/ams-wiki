// src/pages/FeedbackPage.jsx
// 구조: PageHeader → 타입 선택 카드 4개 → 제목/내용 입력 → 제출
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ChatCircle as MessageCircle,
  CheckCircle as CheckCircle2,
  Warning as AlertTriangle,
  BookOpen,
  Lightbulb,
  PaperPlaneTilt as Send,
  ArrowLeft
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PageShell, PageHeader } from '@/components/common/page-primitives'
import { cn } from '@/lib/utils'
import { submitFeedback } from '@/lib/db'

const TYPES = [
  { id: 'error',       Icon: AlertTriangle, label: '오류 제보',       desc: '가이드 내용이 실제와 다릅니다',         tint: 'text-red-600 dark:text-red-400 bg-red-500/10' },
  { id: 'missing',     Icon: BookOpen,      label: '내용 추가 요청',   desc: '필요한 가이드가 없습니다',             tint: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
  { id: 'improvement', Icon: Lightbulb,     label: '개선 제안',        desc: '더 나은 방법이 있습니다',              tint: 'text-violet-600 dark:text-violet-400 bg-violet-500/10' },
  { id: 'other',       Icon: MessageCircle, label: '기타 문의',        desc: '위 항목에 해당되지 않습니다',          tint: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
]

export default function FeedbackPage() {
  const [searchParams] = useSearchParams()
  const prefillTopic = searchParams.get('topic')?.slice(0, 200) ?? ''
  const [selectedType, setSelectedType] = useState(prefillTopic ? 'missing' : null)
  const [title, setTitle]   = useState(prefillTopic ? `"${prefillTopic}" 관련 가이드 추가 요청` : '')
  const [body, setBody]     = useState(prefillTopic ? `검색어 "${prefillTopic}" 에 대한 가이드가 필요합니다.\n\n어떤 상황/업무에서 필요한지 적어주세요:\n` : '')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const canSubmit = selectedType && title.trim().length > 0 && body.trim().length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      await submitFeedback({
        guideId: null,
        vote: selectedType,
        comment: `[${selectedType}] ${title}\n\n${body}`,
      })
      setSubmitted(true)
    } catch (err) {
      // 저장 실패는 반드시 사용자에게 노출 — 과거엔 성공으로 처리해 피드백이 조용히 증발했음
      if (import.meta.env.DEV) console.error('[FeedbackPage] submitFeedback failed', err)
      setError(err?.message || '제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <PageShell maxWidth="3xl">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">피드백이 접수되었습니다</h2>
            <p className="text-sm text-muted-foreground">
              빠른 시일 내 검토 후 가이드에 반영됩니다.<br/>
              소중한 의견 감사합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">홈으로</Link>
            </Button>
            <Button size="sm" onClick={() => {
              setSubmitted(false); setSelectedType(null); setTitle(''); setBody('')
            }}>
              다른 제보 보내기
            </Button>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell maxWidth="3xl">
      <PageHeader
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '피드백' }]}
        title="피드백 제출"
        description="가이드 내용이 다르거나, 추가가 필요한 가이드가 있으면 알려주세요."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. 타입 선택 */}
        <section>
          <Label className="mb-3 block text-sm font-semibold">
            1. 제보 유형 <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TYPES.map(t => {
              const active = selectedType === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={cn(
                    'group flex items-start gap-3 rounded-lg border p-4 text-left transition-all',
                    active
                      ? 'border-foreground bg-accent/30 shadow-sm'
                      : 'border-border bg-card hover:border-foreground/40',
                  )}
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md', t.tint)}>
                    <t.Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{t.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  {active && (
                    <CheckCircle2 size={16} className="shrink-0 text-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* 2. 제목 */}
        <section className="space-y-2">
          <Label htmlFor="fb-title" className="text-sm font-semibold">
            2. 제목 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fb-title"
            placeholder="예: 회원 병합 가이드 3단계 스크린샷이 구버전"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={80}
          />
          <div className="text-right text-xs tabular-nums text-muted-foreground">
            {title.length} / 80
          </div>
        </section>

        {/* 3. 내용 */}
        <section className="space-y-2">
          <Label htmlFor="fb-body" className="text-sm font-semibold">
            3. 상세 내용 <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="fb-body"
            placeholder="구체적인 상황, 현재 가이드와 실제의 차이, 개선 제안 등을 자세히 적어주세요."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={8}
            maxLength={1000}
          />
          <div className="text-right text-xs tabular-nums text-muted-foreground">
            {body.length} / 1,000
          </div>
        </section>

        {/* 오류 배너 */}
        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {/* 제출 */}
        <div className="flex items-center justify-between gap-3 border-t pt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft size={14} /> 취소
            </Link>
          </Button>
          <Button type="submit" disabled={!canSubmit || loading}>
            {loading ? '제출 중...' : (
              <>
                제출하기 <Send size={14} />
              </>
            )}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
