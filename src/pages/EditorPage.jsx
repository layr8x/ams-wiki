// src/pages/EditorPage.jsx
// 구조: 좌측 사이드바(가이드 리스트) + 우측 편집 영역
// 발행된 가이드 페이지(GuidePage)의 모든 섹션을 type별로 노출하여 편집할 수 있도록 구성
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAutosave } from '@/hooks/useAutosave'
import {
  ArrowLeft,
  FloppyDisk as Save,
  PaperPlaneTilt as Send,
  Plus,
  Trash as Trash2,
  Eye,
  EyeSlash as EyeOff,
  User,
  ClockCounterClockwise as History,
  Hash,
  ListChecks,
  GitFork,
  BookOpen,
  Wrench,
  ChatCircle,
  Megaphone,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// 좌측 사이드바 — 새 가이드 작성 시작점.
// 발행된 가이드 목록이 아니라 "어떤 타입으로 만들 것인가" 템플릿 picker.
// 선택 시 우측 본문 탭이 해당 type의 빈 섹션 구조로 자동 구성됩니다.
const TEMPLATES = [
  { type: 'SOP',       fullName: '절차형',     desc: '단계별 작업 절차 정리',         icon: ListChecks },
  { type: 'DECISION',  fullName: '판단분기',   desc: '조건/상황별 판단 기준 매트릭스', icon: GitFork    },
  { type: 'REFERENCE', fullName: '참조형',     desc: '용어 사전, 코드값, 표준 데이터',  icon: BookOpen   },
  { type: 'TROUBLE',   fullName: '트러블슈팅', desc: '오류·증상별 해결 방법 정리',     icon: Wrench     },
  { type: 'RESPONSE',  fullName: '대응매뉴얼', desc: '시나리오별 고객 응대 스크립트',   icon: ChatCircle },
  { type: 'POLICY',    fullName: '정책공지',   desc: '정책 변경, 전/후 비교, 영향 범위', icon: Megaphone  },
]

const MODULES = ['고객(원생) 관리','상품 관리','강좌 관리','수업운영 관리','입반/퇴반 관리','청구/수납/결제/환불','메시지 관리','공통/시스템','전략/운영']
const GUIDE_TYPES = [
  { value: 'SOP',       label: 'SOP · 절차형'    },
  { value: 'DECISION',  label: 'DECISION · 판단분기' },
  { value: 'REFERENCE', label: 'REFERENCE · 참조형' },
  { value: 'TROUBLE',   label: 'TROUBLE · 트러블슈팅' },
  { value: 'RESPONSE',  label: 'RESPONSE · 대응매뉴얼' },
  { value: 'POLICY',    label: 'POLICY · 정책공지' },
]
const STATUS_OPTIONS = ['작성중','검수중','배포완료']

const STATUS_OPTIONS_FOR_DECISION = [
  { value: 'safe',   label: '허용' },
  { value: 'warn',   label: '주의' },
  { value: 'danger', label: '불가' },
]
const SEVERITY_OPTIONS = [
  { value: 'critical', label: '긴급' },
  { value: 'high',     label: '높음' },
  { value: 'medium',   label: '보통' },
  { value: 'low',      label: '낮음' },
]

// type별로 노출할 섹션 — 발행 가이드(GuidePage) 구조와 1:1 매핑
const SECTIONS_BY_TYPE = {
  SOP:       ['cautions', 'steps', 'mainItemsTable', 'cases'],
  DECISION:  ['cautions', 'decisionTable', 'cases'],
  REFERENCE: ['cautions', 'mainItemsTable', 'referenceData'],
  TROUBLE:   ['cautions', 'troubleTable', 'cases'],
  RESPONSE:  ['cautions', 'decisionTable', 'responses'],
  POLICY:    ['cautions', 'policyDiff', 'mainItemsTable', 'decisionTable', 'steps'],
}

const SECTION_META = {
  cautions:       { label: '주의사항',          desc: '반드시 확인해야 할 항목' },
  steps:          { label: '처리 절차',         desc: '단계별 작업 절차' },
  mainItemsTable: { label: '주요 항목',         desc: '필드/설명/필수 여부' },
  cases:          { label: '케이스별 처리',     desc: '상황별 대응 방법' },
  decisionTable:  { label: '판단 기준',         desc: '조건/처리/상태 매트릭스' },
  troubleTable:   { label: '자주 발생하는 오류', desc: '오류/원인/해결/심각도' },
  responses:      { label: '응답 스크립트',     desc: '시나리오별 응대문' },
  referenceData:  { label: '참조 데이터',       desc: '용어 사전 / 코드값' },
  policyDiff:     { label: '정책 비교 (전/후)',  desc: '변경 전후 비교' },
}

const VERSION_HISTORY = [
  { version: 'v1.2', date: '2026-04-14', author: '김명준', summary: '환불 기준 문구 보완, 스크린샷 업데이트' },
  { version: 'v1.1', date: '2026-04-02', author: '이지원', summary: '운영 케이스 2개 추가' },
  { version: 'v1.0', date: '2026-03-25', author: '김명준', summary: '최초 발행' },
  { version: 'v0.2', date: '2026-03-18', author: '김명준', summary: '검수 반영 수정' },
  { version: 'v0.1', date: '2026-03-10', author: '김명준', summary: '초안 작성' },
]

const EMPTY_CONTENT = {
  cautions:       [''],
  steps:          [{ title: '', desc: '' }],
  mainItemsTable: [{ field: '', desc: '', required: false }],
  cases:          [{ label: '', action: '', note: '' }],
  decisionTable:  [{ cond: '', action: '', note: '', status: 'safe' }],
  troubleTable:   [{ issue: '', cause: '', solution: '', severity: 'medium' }],
  responses:      [{ scenario: '', script: '' }],
  referenceData:  [{ term: '', definition: '' }],
  policyDiff:     { before: '', after: '' },
}

const DRAFT_KEY = 'ams-wiki:editor:draft:v1'
const DEFAULT_META = {
  title:   '',
  module:  '고객(원생) 관리',
  type:    'SOP',
  status:  '작성중',
  targets: '운영자, 실장',
  tldr:    '',
  version: 'v0.1',
  confluenceId: '',
}

function formatRelative(ts) {
  if (!ts) return ''
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (diff < 5)   return '방금'
  if (diff < 60)  return `${diff}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  return `${Math.floor(diff / 3600)}시간 전`
}

// 마운트 이전 1회 동기 복원 — Vite CSR이므로 window 안전.
// useState lazy-init으로 처리해 이펙트 내 setState 규칙을 준수하고 첫 렌더부터 복원된 값 사용.
function loadInitialDraft() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.data?.meta && parsed?.data?.content) {
      return {
        meta: { ...DEFAULT_META, ...parsed.data.meta },
        content: parsed.data.content,
        savedAt: parsed.savedAt ?? null,
      }
    }
  } catch { /* ignore */ }
  return null
}

export default function EditorPage() {
  const navigate = useNavigate()

  // 초기 상태를 draft 스냅샷 하나로 묶어 관리 → lazy initializer 한 번만 호출.
  const [draftInit] = useState(loadInitialDraft)
  const [selectedType, setSelectedType] = useState(() => draftInit?.meta?.type ?? 'SOP')
  const [meta, setMeta] = useState(() => draftInit?.meta ?? DEFAULT_META)
  const [content, setContent] = useState(() => draftInit?.content ?? EMPTY_CONTENT)
  const [restoredAt, setRestoredAt] = useState(() => draftInit?.savedAt ?? null)
  const [preview, setPreview] = useState(false)

  const sections = useMemo(
    () => SECTIONS_BY_TYPE[meta.type] ?? SECTIONS_BY_TYPE.SOP,
    [meta.type],
  )

  // 자동 저장: 5초 디바운스 + localStorage fallback
  const autosave = useAutosave({
    key: DRAFT_KEY,
    data: { meta, content },
    delay: 5000,
  })

  // 템플릿 변경 = 본문 sections 구조가 달라지므로 content를 초기화.
  // title/module/tldr/targets 등 메타 입력값은 보존(사용자가 이미 입력했을 수 있음).
  const handleSelectTemplate = (type) => {
    setSelectedType(type)
    setMeta(m => ({ ...m, type }))
    setContent(EMPTY_CONTENT)
  }

  const updateContent = (key, value) => {
    setContent(c => ({ ...c, [key]: value }))
  }

  const handleSave = () => autosave.saveNow()

  const handleDiscardDraft = () => {
    autosave.clearDraft()
    setMeta(DEFAULT_META)
    setContent(EMPTY_CONTENT)
    setSelectedType('SOP')
    setRestoredAt(null)
  }

  // Ctrl/⌘+S — 전역 저장 단축키 (폼 포커스 중에도 동작)
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        autosave.saveNow()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [autosave])

  return (
    <div className="flex h-dvh bg-background">
      {/* ─── 좌측 사이드바: 가이드 타입 템플릿 picker ─── */}
      <aside className="hidden w-72 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> 나가기
          </Button>
        </header>
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">가이드 타입 선택</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            선택한 타입에 맞는 섹션이<br />본문에 자동 구성됩니다
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {TEMPLATES.map(t => {
            const Icon = t.icon
            const isSelected = selectedType === t.type
            return (
              <button
                key={t.type}
                onClick={() => handleSelectTemplate(t.type)}
                className={cn(
                  'mb-1 w-full rounded-md border p-3 text-left transition-colors',
                  isSelected
                    ? 'border-foreground bg-accent text-accent-foreground'
                    : 'border-transparent hover:bg-accent/50',
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={16}
                    weight={isSelected ? 'fill' : 'regular'}
                    className={cn(
                      'shrink-0',
                      isSelected ? 'text-accent-foreground' : 'text-muted-foreground',
                    )}
                  />
                  <Badge
                    variant="outline"
                    size="sm"
                    className={cn(
                      'font-mono text-[10px]',
                      isSelected && 'border-accent-foreground/30 bg-accent-foreground/10 text-accent-foreground',
                    )}
                  >
                    {t.type}
                  </Badge>
                  <span className="text-sm font-medium">{t.fullName}</span>
                </div>
                <p className={cn(
                  'mt-1.5 text-[11px] leading-relaxed',
                  isSelected ? 'text-accent-foreground/80' : 'text-muted-foreground',
                )}>
                  {t.desc}
                </p>
              </button>
            )
          })}
        </div>
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
            <span className={cn(
              'truncate text-sm font-medium',
              !meta.title && 'text-muted-foreground italic',
            )}>{meta.title || '제목 없음 (새 가이드)'}</span>
            <Badge variant="outline" size="sm" className="ml-1">{meta.status}</Badge>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">{meta.type}</Badge>
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
                <div className="mt-6 space-y-3 px-4">
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
            <AutosaveIndicator status={autosave.status} savedAt={autosave.savedAt} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={autosave.status === 'saving'}
              title="임시저장 (Ctrl/⌘+S)"
            >
              <Save size={14} />
              {autosave.status === 'saving' ? '저장 중' : '임시저장'}
              <kbd className="ml-1 hidden rounded border bg-muted px-1 font-mono text-[10px] text-muted-foreground sm:inline-flex">⌘S</kbd>
            </Button>
            <Button size="sm">
              <Send size={14} /> 발행
            </Button>
          </div>
        </header>

        {restoredAt && (
          <div className="flex shrink-0 items-center gap-3 border-b bg-amber-500/10 px-4 py-2 text-xs">
            <Badge variant="outline" size="sm" className="border-amber-500/40 text-amber-700 dark:text-amber-300">
              임시저장본 복원됨
            </Badge>
            <span className="text-muted-foreground">
              마지막 자동 저장: {new Date(restoredAt).toLocaleString()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 text-xs"
              onClick={handleDiscardDraft}
            >
              새로 시작 (임시저장본 삭제)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setRestoredAt(null)}
            >
              확인
            </Button>
          </div>
        )}

        {/* 본문 */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-4xl px-6 py-8">
              <Tabs defaultValue="content" className="w-full">
                <TabsList>
                  <TabsTrigger value="content">본문</TabsTrigger>
                  <TabsTrigger value="meta">메타 정보</TabsTrigger>
                </TabsList>

                {/* 본문 탭 */}
                <TabsContent value="content" className="mt-6 space-y-8">
                  {preview ? (
                    <PreviewPane meta={meta} content={content} sections={sections} />
                  ) : (
                    <>
                      {/* 제목 */}
                      <div className="space-y-2">
                        <Label htmlFor="editor-title">제목</Label>
                        <Input
                          id="editor-title"
                          value={meta.title}
                          onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
                          className="text-lg font-semibold h-11"
                        />
                      </div>

                      {/* 핵심 요약 (모든 type 공통) */}
                      <SectionFrame title="핵심 요약" desc="이 가이드가 어떤 문제를 해결하는지 한 문단으로 요약">
                        <Textarea
                          placeholder="예: 학생이 마이클래스에서 직접 수강정보 연동을 하지 못하는 경우..."
                          value={meta.tldr}
                          onChange={e => setMeta(m => ({ ...m, tldr: e.target.value }))}
                          rows={3}
                        />
                      </SectionFrame>

                      {/* type별 섹션 */}
                      {sections.map(sec => (
                        <SectionFrame
                          key={sec}
                          title={SECTION_META[sec].label}
                          desc={SECTION_META[sec].desc}
                        >
                          {sec === 'cautions'       && <CautionsEditor       items={content.cautions}       onChange={v => updateContent('cautions', v)} />}
                          {sec === 'steps'          && <StepsEditor          items={content.steps}          onChange={v => updateContent('steps', v)} />}
                          {sec === 'mainItemsTable' && <MainItemsEditor      items={content.mainItemsTable} onChange={v => updateContent('mainItemsTable', v)} />}
                          {sec === 'cases'          && <CasesEditor          items={content.cases}          onChange={v => updateContent('cases', v)} />}
                          {sec === 'decisionTable'  && <DecisionTableEditor  items={content.decisionTable}  onChange={v => updateContent('decisionTable', v)} />}
                          {sec === 'troubleTable'   && <TroubleTableEditor   items={content.troubleTable}   onChange={v => updateContent('troubleTable', v)} />}
                          {sec === 'responses'      && <ResponsesEditor      items={content.responses}      onChange={v => updateContent('responses', v)} />}
                          {sec === 'referenceData'  && <ReferenceDataEditor  items={content.referenceData}  onChange={v => updateContent('referenceData', v)} />}
                          {sec === 'policyDiff'     && <PolicyDiffEditor     value={content.policyDiff}     onChange={v => updateContent('policyDiff', v)} />}
                        </SectionFrame>
                      ))}
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
                      <p className="text-[11px] text-muted-foreground">
                        유형 변경 시 본문 탭에 노출되는 섹션이 자동 변경됩니다.
                      </p>
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
                    <div className="space-y-2">
                      <Label htmlFor="editor-version">버전</Label>
                      <Input
                        id="editor-version"
                        placeholder="예: v1.0"
                        value={meta.version}
                        onChange={e => setMeta(m => ({ ...m, version: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editor-confluence">Confluence Page ID</Label>
                      <Input
                        id="editor-confluence"
                        placeholder="예: 1815216142"
                        value={meta.confluenceId}
                        onChange={e => setMeta(m => ({ ...m, confluenceId: e.target.value }))}
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

// ─── 자동 저장 상태 인디케이터 ──────────────────────────────
function AutosaveIndicator({ status, savedAt }) {
  const [, force] = useState(0)
  // savedAt 기준 '~초 전' 표시를 위해 10초마다 리렌더
  useEffect(() => {
    if (!savedAt) return
    const id = setInterval(() => force(x => x + 1), 10_000)
    return () => clearInterval(id)
  }, [savedAt])

  const label = (() => {
    if (status === 'saving') return '자동 저장 중…'
    if (status === 'error')  return '자동 저장 실패'
    if (savedAt)             return `자동 저장 · ${formatRelative(savedAt)}`
    return '자동 저장 대기'
  })()

  const tone = status === 'error'
    ? 'text-destructive'
    : 'text-muted-foreground'

  return (
    <span className={cn('hidden px-1.5 text-[11px] tabular-nums md:inline-block', tone)}>
      {label}
    </span>
  )
}

// ─── 섹션 프레임 ─────────────────────────────────────────────
function SectionFrame({ title, desc, children }) {
  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between gap-2 border-b pb-2">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </header>
      {children}
    </section>
  )
}

// ─── 리스트 행 추가/삭제 공통 헬퍼 ──────────────────────────
function ListRow({ onRemove, children }) {
  return (
    <div className="flex items-start gap-2 rounded-md border p-3">
      <div className="flex-1 space-y-2">{children}</div>
      <Button
        variant="ghost" size="icon"
        onClick={onRemove}
        aria-label="행 삭제"
        className="shrink-0"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  )
}

function AddRowButton({ onAdd, label = '행 추가' }) {
  return (
    <Button variant="outline" size="sm" onClick={onAdd}>
      <Plus size={12} /> {label}
    </Button>
  )
}

// ─── 주의사항 ────────────────────────────────────────────────
function CautionsEditor({ items, onChange }) {
  const update = (i, v) => onChange(items.map((x, idx) => idx === i ? v : x))
  const add    = () => onChange([...items, ''])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((c, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <Textarea
            value={c}
            onChange={e => update(i, e.target.value)}
            rows={2}
            placeholder="예: 병합 작업 전 FROM/TO 회원을 반드시 재확인하세요."
          />
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="주의사항 추가" />
    </div>
  )
}

// ─── 처리 절차 ───────────────────────────────────────────────
function StepsEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { title: '', desc: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="shrink-0">단계 {i + 1}</Badge>
            <Input
              value={s.title}
              onChange={e => update(i, 'title', e.target.value)}
              placeholder="단계 제목"
              className="font-medium"
            />
          </div>
          <Textarea
            value={s.desc}
            onChange={e => update(i, 'desc', e.target.value)}
            rows={2}
            placeholder="단계별 상세 설명"
          />
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="단계 추가" />
    </div>
  )
}

// ─── 주요 항목 (mainItemsTable) ──────────────────────────────
function MainItemsEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { field: '', desc: '', required: false }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-3"
              value={it.field}
              onChange={e => update(i, 'field', e.target.value)}
              placeholder="항목명"
            />
            <Textarea
              className="col-span-7"
              rows={1}
              value={it.desc}
              onChange={e => update(i, 'desc', e.target.value)}
              placeholder="설명"
            />
            <label className="col-span-2 flex items-center gap-2 text-xs">
              <Checkbox
                checked={it.required}
                onCheckedChange={v => update(i, 'required', !!v)}
              />
              필수
            </label>
          </div>
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="항목 추가" />
    </div>
  )
}

// ─── 케이스 ──────────────────────────────────────────────────
function CasesEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { label: '', action: '', note: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((c, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="shrink-0">Case {i + 1}</Badge>
            <Input
              value={c.label}
              onChange={e => update(i, 'label', e.target.value)}
              placeholder="케이스 라벨"
              className="font-medium"
            />
          </div>
          <Textarea
            value={c.action}
            onChange={e => update(i, 'action', e.target.value)}
            rows={2}
            placeholder="대응 방법"
          />
          <Input
            value={c.note}
            onChange={e => update(i, 'note', e.target.value)}
            placeholder="Note (선택)"
            className="text-xs"
          />
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="케이스 추가" />
    </div>
  )
}

// ─── 판단 기준 (decisionTable) ──────────────────────────────
function DecisionTableEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { cond: '', action: '', note: '', status: 'safe' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-4"
              value={r.cond}
              onChange={e => update(i, 'cond', e.target.value)}
              placeholder="조건"
            />
            <Input
              className="col-span-4"
              value={r.action}
              onChange={e => update(i, 'action', e.target.value)}
              placeholder="처리"
            />
            <Input
              className="col-span-2"
              value={r.note}
              onChange={e => update(i, 'note', e.target.value)}
              placeholder="비고"
            />
            <Select value={r.status} onValueChange={v => update(i, 'status', v)}>
              <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS_FOR_DECISION.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="판단 행 추가" />
    </div>
  )
}

// ─── 트러블슈팅 (troubleTable) ──────────────────────────────
function TroubleTableEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { issue: '', cause: '', solution: '', severity: 'medium' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-3"
              value={r.issue}
              onChange={e => update(i, 'issue', e.target.value)}
              placeholder="오류"
            />
            <Input
              className="col-span-3"
              value={r.cause}
              onChange={e => update(i, 'cause', e.target.value)}
              placeholder="원인"
            />
            <Input
              className="col-span-4"
              value={r.solution}
              onChange={e => update(i, 'solution', e.target.value)}
              placeholder="해결"
            />
            <Select value={r.severity} onValueChange={v => update(i, 'severity', v)}>
              <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="오류 행 추가" />
    </div>
  )
}

// ─── 응답 스크립트 ──────────────────────────────────────────
function ResponsesEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { scenario: '', script: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="shrink-0">시나리오 {i + 1}</Badge>
            <Input
              value={r.scenario}
              onChange={e => update(i, 'scenario', e.target.value)}
              placeholder="시나리오 (예: 환불 거절 항의)"
              className="font-medium"
            />
          </div>
          <Textarea
            value={r.script}
            onChange={e => update(i, 'script', e.target.value)}
            rows={3}
            placeholder='응답 스크립트 (예: "학원법 제18조에 따라...")'
          />
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="시나리오 추가" />
    </div>
  )
}

// ─── 참조 데이터 (referenceData) ────────────────────────────
function ReferenceDataEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [key]: v } : x))
  const add    = () => onChange([...items, { term: '', definition: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <ListRow key={i} onRemove={() => remove(i)}>
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-3 font-mono"
              value={r.term}
              onChange={e => update(i, 'term', e.target.value)}
              placeholder="용어"
            />
            <Textarea
              className="col-span-9"
              rows={1}
              value={r.definition}
              onChange={e => update(i, 'definition', e.target.value)}
              placeholder="정의"
            />
          </div>
        </ListRow>
      ))}
      <AddRowButton onAdd={add} label="용어 추가" />
    </div>
  )
}

// ─── 정책 비교 (policyDiff) ────────────────────────────────
function PolicyDiffEditor({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">변경 전</Label>
        <Textarea
          rows={4}
          value={value.before}
          onChange={e => onChange({ ...value, before: e.target.value })}
          placeholder="변경 전 정책 내용"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-primary">변경 후</Label>
        <Textarea
          rows={4}
          value={value.after}
          onChange={e => onChange({ ...value, after: e.target.value })}
          placeholder="변경 후 정책 내용"
          className="border-primary/30"
        />
      </div>
    </div>
  )
}

// ─── 미리보기 ──────────────────────────────────────────────
function PreviewPane({ meta, content, sections }) {
  return (
    <article className="prose-ams">
      <h1 className="mb-3 text-2xl font-bold tracking-tight">{meta.title || '(제목 없음)'}</h1>
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" size="sm">{meta.type}</Badge>
        <span>{meta.module}</span>
        <span>·</span>
        <span>{meta.status}</span>
        {meta.version && <><span>·</span><span className="font-mono">{meta.version}</span></>}
      </div>
      {meta.tldr && (
        <Card className="mb-6 border-l-4 border-l-primary gap-0 py-0">
          <CardContent className="px-5 py-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">{meta.tldr}</p>
          </CardContent>
        </Card>
      )}
      {sections.includes('cautions') && content.cautions.some(Boolean) && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5 gap-0 py-0">
          <CardHeader className="px-5 pt-4 pb-2">
            <CardTitle className="text-sm text-amber-700 dark:text-amber-300">반드시 확인하세요</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ul className="space-y-2 text-sm">
              {content.cautions.filter(Boolean).map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-600 dark:text-amber-400">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      <p className="text-xs text-muted-foreground italic">
        ※ 본문 미리보기는 발행 시 GuidePage 구조로 렌더링됩니다.
      </p>
    </article>
  )
}
