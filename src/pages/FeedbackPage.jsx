// src/pages/FeedbackPage.jsx — shadcn/ui 표준
import { useState } from 'react'
import { MessageCircle, CheckCircle2, AlertTriangle, BookOpen, Lightbulb, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { submitFeedback } from '@/lib/db'

const TYPES = [
  { id: 'error',       Icon: AlertTriangle, label: '오류 제보',      desc: '가이드 내용이 실제와 다릅니다', color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  { id: 'missing',     Icon: BookOpen,      label: '내용 추가 요청', desc: '필요한 가이드가 없습니다',       color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { id: 'improvement', Icon: Lightbulb,     label: '개선 제안',      desc: '더 나은 방법이 있습니다',       color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'other',       Icon: MessageCircle, label: '기타 문의',      desc: '위 항목에 해당되지 않습니다',   color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200' },
]

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState(null)
  const [title, setTitle]     = useState('')
  const [body, setBody]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const canSubmit = selectedType && title.trim().length > 0 && body.trim().length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      await submitFeedback({
        guideId: null,
        vote: selectedType,
        comment: `[${selectedType}] ${title}\n\n${body}`,
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">제출 완료</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          소중한 의견 감사합니다. 검토 후 가이드에 반영하겠습니다.
        </p>
        <Button
          variant="outline"
          onClick={() => { setSubmitted(false); setSelectedType(null); setTitle(''); setBody('') }}
          className="mt-2"
        >
          새 의견 제출하기
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">

      <div className="mb-8">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
          <MessageCircle size={20} className="text-violet-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">오류 제보 / 개선 제안</h1>
        <p className="text-sm text-muted-foreground">
          가이드에서 잘못된 내용을 발견했거나 추가할 내용이 있으면 알려주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 유형 선택 */}
        <div>
          <p className="mb-3 text-sm font-medium text-foreground">피드백 유형</p>
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-4 text-left transition-all',
                  selectedType === t.id
                    ? `${t.border} ${t.bg} shadow-sm`
                    : 'border-border bg-card hover:border-ring/30'
                )}
              >
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', t.bg)}>
                  <t.Icon size={16} className={t.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">제목</label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="간략하게 요약해주세요"
            maxLength={100}
          />
        </div>

        {/* 상세 내용 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">상세 내용</label>
          <Textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="구체적인 내용을 작성해주세요. 해당 가이드 링크, 스크린샷이 있으면 함께 기재해주세요."
            rows={5}
            maxLength={2000}
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">{body.length} / 2,000</p>
        </div>

        {/* 제출 */}
        <Button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full"
        >
          <Send size={14} />
          {loading ? '제출 중...' : '제출하기'}
        </Button>

      </form>
    </div>
  )
}
