import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upsertGuide } from '@/lib/db'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/store/authStore'
import {
  ArrowLeft,
  FloppyDisk as Save,
  ListChecks,
  GitFork,
  BookOpen,
  Wrench,
  ChatCircle,
  Megaphone,
  Plus,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const TEMPLATES = [
  { type: 'SOP', fullName: '절차형', desc: '단계별 작업 절차 정리', icon: ListChecks },
  { type: 'DECISION', fullName: '판단분기', desc: '조건/상황별 판단 기준', icon: GitFork },
  { type: 'REFERENCE', fullName: '참조형', desc: '정의/규정/가이드라인', icon: BookOpen },
  { type: 'TROUBLESHOOT', fullName: '문제해결', desc: '이슈 트러블슈팅', icon: Wrench },
  { type: 'FAQ', fullName: 'FAQ형', desc: '자주 묻는 질문 모음', icon: ChatCircle },
  { type: 'ANNOUNCEMENT', fullName: '공지형', desc: '중요 소식 및 알림', icon: Megaphone },
]

const MODULES = [
  { id: 'SOP', name: '운영 절차' },
  { id: 'SALES', name: '영업' },
  { id: 'CS', name: '고객 지원' },
  { id: 'MARKETING', name: '마케팅' },
  { id: 'PRODUCT', name: '상품 기획' },
  { id: 'TECH', name: '기술' },
  { id: 'HR', name: '인사' },
]

export default function CreateGuidePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [step, setStep] = useState('template') // template | details | edit
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    module: '',
    description: '',
  })

  const createMutation = useMutation({
    mutationFn: (newGuide) => upsertGuide(newGuide),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['guides'] })
      toast({ title: '가이드 생성됨', description: '새 가이드가 생성되었습니다' })
      navigate(`/editor?id=${result.id}`)
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: '오류', description: error.message })
    },
  })

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setStep('details')
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.module) {
      toast({ variant: 'destructive', title: '필수 항목 입력', description: '제목과 모듈을 선택해주세요' })
      return
    }

    const newGuide = {
      title: formData.title,
      type: selectedTemplate.type,
      module: formData.module,
      description: formData.description,
      content: { sections: [] },
      status: 'draft',
      created_by: user?.id,
    }

    createMutation.mutate(newGuide)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          뒤로
        </button>

        {step === 'template' && (
          <>
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-slate-900">새 가이드 작성</h1>
              <p className="mt-2 text-slate-600">가이드 유형을 선택하세요</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((template) => {
                const IconComponent = template.icon
                return (
                  <button
                    key={template.type}
                    onClick={() => handleSelectTemplate(template)}
                    className="group rounded-lg border-2 border-slate-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-900">{template.fullName}</h3>
                    <p className="mt-1 text-sm text-slate-600">{template.desc}</p>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <div className="mb-8">
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => setStep('template')}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">기본 정보</h1>
                  <p className="mt-1 text-slate-600">
                    선택: <Badge>{selectedTemplate.fullName}</Badge>
                  </p>
                </div>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>가이드 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="가이드 제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="module">모듈 *</Label>
                  <Select value={formData.module} onValueChange={(module) => setFormData({ ...formData, module })}>
                    <SelectTrigger>
                      <SelectValue placeholder="모듈 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODULES.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          {mod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="가이드 개요를 입력하세요 (선택사항)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-24"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('template')}>
                뒤로
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="gap-2">
                <Plus size={16} />
                {createMutation.isPending ? '생성 중...' : '가이드 작성 시작'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
