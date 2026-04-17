// src/pages/EditorPage.jsx
// 구조: 좌측 사이드바(가이드 리스트) + 우측 편집 영역
// 발행된 가이드 페이지(GuidePage)의 모든 섹션을 type별로 노출하여 편집할 수 있도록 구성
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
  MagnifyingGlass as Search,
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

const GUIDES_LIST = [
  { id: 'member-merge',    title: 'AMS 회원 병합 가이드',          module: '고객(원생) 관리',       type: 'SOP'      },
  { id: 'refund-policy',   title: '환불 승인 기준 판단 가이드',     module: '청구/수납/결제/환불',    type: 'DECISION' },
  { id: 'ams-glossary',    title: 'AMS 주요 용어 사전',             module: '공통/시스템',            type: 'REFERENCE'},
  { id: 'qr-trouble',      title: 'QR 출석 인식 실패 트러블슈팅',   module: '수업운영 관리',          type: 'TROUBLE'  },
  { id: 'response-manual', title: '상황별 대응 매뉴얼 (CS)',         module: '공통/시스템',            type: 'RESPONSE' },
  { id: 'policy-2026',     title: '2026 수강료 정책 변경 공지',      module: '공통/시스템',            type: 'POLICY'   },
  { id: 'billing-calc',    title: '수강료 일할 계산 처리 가이드',    module: '청구/수납/결제/환불',    type: 'SOP'      },
  { id: 'enrollment-sop',  title: '중도 입반 처리 SOP',              module: '입반/퇴반 관리',         type: 'SOP'      },
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

export default function EditorPage() {
  const navigate = useNavigate()

  const [selectedId, setSelectedId] = useState(GUIDES_LIST[0].id)
  const [search, setSearch]         = useState('')
  const [meta, setMeta] = useState({
    title:   GUIDES_LIST[0].title,
    module:  GUIDES_LIST[0].module,
    type:    GUIDES_LIST[0].type,
    status:  '작성중',
    targets: '운영자, 실장',
    tldr:    '',
    version: 'v0.1',
    confluenceId: '',
  })
  const [content, setContent] = useState(EMPTY_CONTENT)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving]   = useState(false)

  const filteredList = GUIDES_LIST.filter(g =>
    !search.trim() || g.title.toLowerCase().includes(search.toLowerCase())
  )

  const sections = useMemo(
    () => SECTIONS_BY_TYPE[meta.type] ?? SECTIONS_BY_TYPE.SOP,
    [meta.type],
  )

  const handleSelect = (id) => {
    const g = GUIDES_LIST.find(x => x.id === id)
    if (!g) return
    setSelectedId(id)
    setMeta(m => ({ ...m, title: g.title, module: g.module, type: g.type }))
  }

  const updateContent = (key, value) => {
    setContent(c => ({ ...c, [key]: value }))
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
                  ? 'border-foreground bg-accent text-accent-foreground'
                  : 'border-transparent hover:bg-accent/50',
              )}
            >
              <p className="mb-1 line-clamp-2 text-sm font-medium">{g.title}</p>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" size="sm">{g.type}</Badge>
                <span className={cn(
                  'text-[11px] truncate',
                  selectedId === g.id ? 'text-accent-foreground/70' : 'text-muted-foreground',
                )}>{g.module}</span>
              </div>
            </button>
          ))}
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
            <span className="truncate text-sm font-medium">{meta.title}</span>
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
