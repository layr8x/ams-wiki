// src/pages/admin/AdminFeedbackPage.jsx — /admin/feedback
// 로컬 큐(NoResultFallback 등) + Supabase guide_feedback 머지 뷰
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAdminFeedback } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Trash } from '@phosphor-icons/react'
import { useToast } from '@/components/ui/toast'

const FEEDBACK_QUEUE_KEY = 'ams-wiki:feedback:queue:v1'

const KIND_LABEL = {
  'missing-guide': '가이드 요청',
  'helpful':       '도움됨',
  'not-helpful':   '개선 필요',
  'praise':        '칭찬',
  'bug':           '오류 제보',
}

const VOTE_VARIANT = {
  helpful:       'default',
  'not-helpful': 'destructive',
  'missing-guide': 'secondary',
}

function readLocalQueue() {
  try {
    const raw = localStorage.getItem(FEEDBACK_QUEUE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    if (!Array.isArray(arr)) return []
    return arr.map((entry, i) => ({
      id:        `local-${i}-${entry.createdAt || ''}`,
      source:    'local',
      kind:      entry.kind,
      query:     entry.query,
      note:      entry.note,
      guideId:   entry.guideId,
      createdAt: entry.createdAt,
    }))
  } catch {
    return []
  }
}

export default function AdminFeedbackPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState('all')
  const [localItems, setLocalItems] = useState(() => readLocalQueue())

  const { data: remote = [], isLoading } = useQuery({
    queryKey: ['admin', 'feedback'],
    queryFn:  () => fetchAdminFeedback({ limit: 200 }),
    staleTime: 60 * 1000,
  })

  // 다른 탭/창에서 로컬 큐가 변경되면 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === FEEDBACK_QUEUE_KEY) setLocalItems(readLocalQueue())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const clearLocal = () => {
    localStorage.removeItem(FEEDBACK_QUEUE_KEY)
    setLocalItems([])
    toast({ title: '로컬 큐를 비웠습니다.', description: '서버에 저장된 피드백은 영향을 받지 않습니다.' })
  }

  // 통합 뷰: 로컬 → 원격 순
  const merged = [
    ...localItems.map(l => ({ ...l, kind: l.kind || 'missing-guide' })),
    ...remote.map(r => ({
      id:        r.id,
      source:    'supabase',
      kind:      r.vote,
      note:      r.comment,
      guideId:   r.guideId,
      createdAt: r.createdAt,
    })),
  ].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

  const filtered = tab === 'all'
    ? merged
    : merged.filter(item => {
        if (tab === 'requests') return item.kind === 'missing-guide' || !item.guideId
        if (tab === 'issues')   return item.kind === 'not-helpful' || item.kind === 'bug'
        if (tab === 'praise')   return item.kind === 'helpful' || item.kind === 'praise'
        return true
      })

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">피드백 수신함</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            로컬 큐 {localItems.length}건 · 서버 {remote.length}건
          </p>
        </div>
        {localItems.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearLocal}>
            <Trash className="mr-1.5 size-3.5" />
            로컬 큐 비우기
          </Button>
        )}
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="requests">가이드 요청</TabsTrigger>
          <TabsTrigger value="issues">오류/개선</TabsTrigger>
          <TabsTrigger value="praise">칭찬</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">유형</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>가이드</TableHead>
                  <TableHead className="w-[100px]">출처</TableHead>
                  <TableHead className="w-[140px]">일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && remote.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton className="h-5 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      접수된 피드백이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant={VOTE_VARIANT[item.kind] || 'outline'} className="text-xs">
                          {KIND_LABEL[item.kind] || item.kind || '기타'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {item.query && (
                          <p className="text-xs text-muted-foreground">검색어: &ldquo;{item.query}&rdquo;</p>
                        )}
                        <p className="line-clamp-2 text-sm">{item.note || '내용 없음'}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.guideId ? (
                          <Link to={`/guides/${item.guideId}`} className="text-primary hover:underline">
                            {item.guideId}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.source === 'local' ? '로컬' : '서버'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-muted-foreground">
                        {item.createdAt?.slice(0, 16).replace('T', ' ') || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
