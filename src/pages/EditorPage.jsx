// src/pages/EditorPage.jsx
// 재작성 사유: 이전 1029라인 수제 코드 대부분이 hand-rolled div/inline-style 이었음.
// 구조: 좌측 사이드바(가이드 리스트) + 우측 편집 영역 (메타 / 블록 에디터 / 버전 이력 Sheet)
// shadcn primitives 사용: Sheet, Tabs, Card, Button, Input, Textarea, Badge, Separator, Select
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FloppyDisk as Save,
  PaperPlaneTilt as Send,
  Plus,
  Trash as Trash2,
  DotsSixVertical as GripVertical,
  Eye,
  EyeSlash as EyeOff,
  FileText,
  Clock,
  User,
  ClockCounterClockwise as History,
  Hash,
  MagnifyingGlass as Search,
  CaretRight as ChevronRight,
  Image as ImageIcon
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const GUIDES_LIST = [
  { id: 'member-merge',    title: 'AMS 회원 병합 가이드',          module: '고객(원생) 관리',       type: 'SOP'      },
  { id: 'refund-policy',   title: '환불 승인 기준 판단 가이드',     module: '청구/수납/결제/환불',    type: 'DECISION' },
  { id: 'ams-glossary',    title: 'AMS 주요 용어 사전',             module: '공통/시스템',            type: 'REFERENCE'},
  { id: 'qr-trouble',      title: 'QR 출석 인식 실패 트러블슈팅',   module: '수업운영 관리',          type: 'TROUBLE'  },
  { id: 'response-manual', title: '상황별 대응 매뉴얼 (CS)',         module: '전략/운영',              type: 'RESPONSE' },
  { id: 'policy-2026',     title: '2026 수강료 정책 변경 공지',      module: '전략/운영',              type: 'POLICY'   },
  { id: 'billing-calc',    title: '수강료 일할 계산 처리 가이드',    module: '청구/수납/결제/환불',    type: 'SOP'      },
  { id: 'enrollment-sop',  title: '중도 입반 처리 SOP',              module: '입반/퇴반 관리',         type: 'SOP'      },
]

const MODULES = ['고객(원생) 관리','상품 관리','강좌 관리','수업운영 관리','입반/퇴반 관리','청구/수납/결제/환불','메시지 관리','공통/시스템','전략/운영']
const GUIDE_TYPES = [
  { value: 'SOP',       label: '절차' },
  { value: 'DECISION',  label: '판단' },
  { value: 'REFERENCE', label: '참조' },
  { value: 'TROUBLE',   label: '트러블' },
  { value: 'RESPONSE',  label: '대응' },
  { value: 'POLICY',    label: '정책' },
]
const STATUS_OPTIONS = ['작성중','검수중','배포완료']

const VERSION_HISTORY = [
  { version: 'v1.2', date: '2026-04-14', author: '김명준', summary: '환불 기준 문구 보완, 스크린샷 업데이트' },
  { version: 'v1.1', date: '2026-04-02', author: '이지원', summary: '운영 케이스 2개 추가' },
  { version: 'v1.0', date: '2026-03-25', author: '김명준', summary: '최초 발행' },
  { version: 'v0.2', date: '2026-03-18', author: '김명준', summary: '검수 반영 수정' },
  { version: 'v0.1', date: '2026-03-10', author: '김명준', summary: '초안 작성' },
]

const DEFAULT_BLOCKS = [
  { id: 1, type: 'heading', content: '개요' },
  { id: 2, type: 'text',    content: '이 가이드는 ...' },
  { id: 3, type: 'step',    content: '1단계 설명' },
]

const BLOCK_TYPE_LABEL = {
  heading: '제목',
  text:    '본문',
  step:    '단계',
  caution: '주의',
  image:   '이미지',
}

export default function EditorPage() {
  const navigate = useNavigate()

  const [selectedId, setSelectedId] = useState(GUIDES_LIST[0].id)
  const [search, setSearch]         = useState('')
  const [meta, setMeta] = useState({
    title: GUIDES_LIST[0].title,
    module: GUIDES_LIST[0].module,
    type: GUIDES_LIST[0].type,
    status: '작성중',
    targets: '',
    tldr: '',
  })
  const [blocks, setBlocks]     = useState(DEFAULT_BLOCKS)
  const [preview, setPreview]   = useState(false)
  const [saving, setSaving]     = useState(false)

  const filteredList = GUIDES_LIST.filter(g =>
    !search.trim() || g.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (id) => {
    const g = GUIDES_LIST.find(x => x.id === id)
    if (!g) return
    setSelectedId(id)
    setMeta(m => ({ ...m, title: g.title, module: g.module, type: g.type }))
  }

  const addBlock = useCallback((type) => {
    setBlocks(bs => [...bs, {
      id: Date.now(),
      type,
      content: '',
    }])
  }, [])

  const updateBlock = (id, content) => {
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, content } : b))
  }

  const removeBlock = (id) => {
    setBlocks(bs => bs.filter(b => b.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
  }

  return (
    <div className="flex h-dvh bg-background">
      {/* ─── 좌측 사이드바: 가이드 리스트 ─── */}
      <aside className="hidden w-72 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> 나가기
          </Button>
        </header>
        <div className="border-b p-3">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="가이드 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredList.map(g => (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className={cn(
                'mb-1 w-full rounded-md border p-3 text-left transition-colors',
                selectedId === g.id
                  ? 'border-foreground bg-accent'
                  : 'border-transparent hover:bg-accent/50',
              )}
            >
              <p className="mb-1 line-clamp-2 text-sm font-medium">{g.title}</p>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" size="sm">{g.type}</Badge>
                <span className="text-[11px] text-muted-foreground truncate">{g.module}</span>
              </div>
            </button>
          ))}
        </div>
        <footer className="border-t p-3">
          <Button size="sm" variant="outline" className="w-full">
            <Plus size={14} /> 새 가이드
          </Button>
        </footer>
      </aside>

      {/* ─── 우측 편집 영역 ─── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => navigate('/')}>
              <ArrowLeft size={14} />
            </Button>
            <Hash size={14} className="text-muted-foreground" />
            <span className="truncate text-sm font-medium">{meta.title}</span>
            <Badge variant="outline" size="sm" className="ml-1">{meta.status}</Badge>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <History size={14} /> 이력
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>버전 이력</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-3">
                  {VERSION_HISTORY.map(v => (
                    <Card key={v.version} className="gap-0 py-0">
                      <CardContent className="p-4">
                        <div className="mb-1 flex items-center justify-between">
                          <Badge variant="outline" size="sm" className="font-mono">{v.version}</Badge>
                          <span className="text-xs tabular-nums text-muted-foreground">{v.date}</span>
                        </div>
                        <p className="text-sm text-foreground">{v.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <User size={10} className="inline" /> {v.author}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="sm" onClick={() => setPreview(p => !p)}>
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? '편집' : '미리보기'}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? '저장 중' : '임시저장'}
            </Button>
            <Button size="sm">
              <Send size={14} /> 발행
            </Button>
          </div>
        </header>

        {/* 본문 */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-6 py-8">
              <Tabs defaultValue="content" className="w-full">
                <TabsList>
                  <TabsTrigger value="content">본문</TabsTrigger>
                  <TabsTrigger value="meta">메타 정보</TabsTrigger>
                </TabsList>

                {/* 본문 탭 */}
                <TabsContent value="content" className="mt-6 space-y-4">
                  {preview ? (
                    <PreviewPane meta={meta} blocks={blocks} />
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="editor-title">제목</Label>
                        <Input
                          id="editor-title"
                          value={meta.title}
                          onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
                          className="text-lg font-semibold h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="editor-tldr">핵심 요약</Label>
                        <Textarea
                          id="editor-tldr"
                          placeholder="한 문단 요약 — 이 가이드가 어떤 문제를 해결하는지"
                          value={meta.tldr}
                          onChange={e => setMeta(m => ({ ...m, tldr: e.target.value }))}
                          rows={3}
                        />
                      </div>

                      <Separator className="my-6" />

                      {/* 블록 에디터 */}
                      <div className="space-y-2">
                        {blocks.map((b) => (
                          <Card key={b.id} className="group gap-0 py-0">
                            <CardContent className="flex items-start gap-2 p-3">
                              <button
                                type="button"
                                className="mt-2 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="블록 이동"
                              >
                                <GripVertical size={14} />
                              </button>
                              <Badge variant="outline" size="sm" className="mt-1.5 shrink-0 w-14 justify-center">
                                {BLOCK_TYPE_LABEL[b.type] ?? b.type}
                              </Badge>
                              <Textarea
                                value={b.content}
                                onChange={e => updateBlock(b.id, e.target.value)}
                                rows={b.type === 'heading' ? 1 : 3}
                                className={cn(
                                  'flex-1 resize-none border-none bg-transparent px-2 py-1 shadow-none focus-visible:ring-0',
                                  b.type === 'heading' && 'text-lg font-semibold',
                                )}
                                placeholder={`${BLOCK_TYPE_LABEL[b.type] ?? ''} 내용...`}
                              />
                              <Button
                                variant="ghost" size="icon"
                                className="mt-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeBlock(b.id)}
                                aria-label="블록 삭제"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* 블록 추가 툴바 */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="mr-1 text-xs text-muted-foreground">블록 추가:</span>
                        {Object.keys(BLOCK_TYPE_LABEL).map(t => (
                          <Button
                            key={t} size="sm" variant="outline"
                            onClick={() => addBlock(t)}
                          >
                            <Plus size={12} /> {BLOCK_TYPE_LABEL[t]}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* 메타 정보 탭 */}
                <TabsContent value="meta" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>모듈</Label>
                      <Select value={meta.module} onValueChange={v => setMeta(m => ({ ...m, module: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {MODULES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>유형</Label>
                      <Select value={meta.type} onValueChange={v => setMeta(m => ({ ...m, type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GUIDE_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select value={meta.status} onValueChange={v => setMeta(m => ({ ...m, status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editor-targets">대상 (쉼표 구분)</Label>
                      <Input
                        id="editor-targets"
                        placeholder="예: 운영자, 실장"
                        value={meta.targets}
                        onChange={e => setMeta(m => ({ ...m, targets: e.target.value }))}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

// ─── 미리보기 ──────────────────────────────────────────────
function PreviewPane({ meta, blocks }) {
  return (
    <article className="prose-ams">
      <h1 className="mb-3 text-2xl font-bold tracking-tight">{meta.title}</h1>
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" size="sm">{meta.type}</Badge>
        <span>{meta.module}</span>
        <span>·</span>
        <span>{meta.status}</span>
      </div>
      {meta.tldr && (
        <Card className="mb-6 border-l-4 border-l-primary gap-0 py-0">
          <CardContent className="px-5 py-4">
            <p className="text-sm leading-relaxed">{meta.tldr}</p>
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        {blocks.map(b => {
          if (b.type === 'heading') return <h2 key={b.id} className="text-lg font-semibold">{b.content}</h2>
          if (b.type === 'step')    return <div key={b.id} className="rounded-md border bg-muted/30 p-4 text-sm">{b.content}</div>
          if (b.type === 'caution') return <div key={b.id} className="rounded-md border border-amber-500/30 bg-amber-500/5 p-4 text-sm">{b.content}</div>
          return <p key={b.id} className="text-sm leading-relaxed">{b.content}</p>
        })}
      </div>
    </article>
  )
}
