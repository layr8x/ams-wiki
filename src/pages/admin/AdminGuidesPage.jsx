// src/pages/admin/AdminGuidesPage.jsx — /admin/guides
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminGuides, updateGuideStatus, deleteGuide, getModuleTree } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { DotsThreeVertical as MoreVertical, PencilSimple as Pencil } from '@phosphor-icons/react'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/store/authStore'

const STATUS_TABS = [
  { value: 'all',       label: '전체' },
  { value: 'published', label: '발행됨' },
  { value: 'draft',     label: '임시저장' },
  { value: 'archived',  label: '보관됨' },
]

const STATUS_VARIANT = {
  published: 'default',
  draft:     'secondary',
  archived:  'outline',
}

const STATUS_LABEL = {
  published: '발행',
  draft:     '임시저장',
  archived:  '보관',
}

export default function AdminGuidesPage() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const moduleTree = getModuleTree()
  const moduleLabelById = useMemo(
    () => new Map(moduleTree.map(m => [m.id, m.label])),
    [moduleTree]
  )

  const [status, setStatus]   = useState('all')
  const [moduleF, setModuleF] = useState('all')
  const [search, setSearch]   = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['admin', 'guides', { status, moduleF, search }],
    queryFn:  () => fetchAdminGuides({
      status,
      module: moduleF === 'all' ? undefined : moduleF,
      search: search.trim() || undefined,
    }),
    staleTime: 30 * 1000,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }) => updateGuideStatus(id, nextStatus),
    onSuccess: (_, { nextStatus }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'guides'] })
      qc.invalidateQueries({ queryKey: ['guides'] })
      toast({ title: `가이드 상태가 "${STATUS_LABEL[nextStatus]}"(으)로 변경되었습니다.` })
    },
    onError: (err) => toast({ variant: 'destructive', title: '상태 변경 실패', description: String(err?.message || err) }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGuide(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'guides'] })
      qc.invalidateQueries({ queryKey: ['guides'] })
      toast({ title: '가이드가 보관 처리되었습니다.' })
      setDeleteTarget(null)
    },
    onError: (err) => toast({ variant: 'destructive', title: '삭제 실패', description: String(err?.message || err) }),
  })

  const canEdit    = hasPermission('edit')
  const canPublish = hasPermission('publish')
  const canDelete  = hasPermission('delete')

  const stats = useMemo(() => {
    const by = { all: guides.length, published: 0, draft: 0, archived: 0 }
    for (const g of guides) by[g.status] = (by[g.status] || 0) + 1
    return by
  }, [guides])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">가이드 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.all.toLocaleString('ko-KR')}개의 가이드가 관리 범위에 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link to="/editor">새 가이드 작성</Link>
        </Button>
      </header>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={status} onValueChange={setStatus}>
              <TabsList>
                {STATUS_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Select value={moduleF} onValueChange={setModuleF}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="모듈 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 모듈</SelectItem>
                {moduleTree.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="제목/TL;DR 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[320px]">제목</TableHead>
                  <TableHead>모듈</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>수정일</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}><Skeleton className="h-5 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : guides.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      조건에 해당하는 가이드가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  guides.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>
                        <Link to={`/guides/${g.id}`} className="font-medium hover:underline">
                          {g.title}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{g.tldr}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {moduleLabelById.get(g.module) || g.module}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{g.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[g.status] || 'secondary'} className="text-xs">
                          {STATUS_LABEL[g.status] || g.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-muted-foreground">
                        {g.updated || g.updated_at?.slice(0, 10) || '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="가이드 액션">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && (
                              <DropdownMenuItem asChild>
                                <Link to={`/editor?id=${g.id}`}>
                                  <Pencil className="size-3.5" /> 편집
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {canPublish && g.status !== 'published' && g.status !== 'archived' && (
                              <DropdownMenuItem
                                onSelect={() => statusMutation.mutate({ id: g.id, nextStatus: 'published' })}
                              >
                                발행하기
                              </DropdownMenuItem>
                            )}
                            {canPublish && g.status === 'published' && (
                              <DropdownMenuItem
                                onSelect={() => statusMutation.mutate({ id: g.id, nextStatus: 'draft' })}
                              >
                                발행 해제
                              </DropdownMenuItem>
                            )}
                            {/* 보관 상태 → 복원 (임시저장으로 되돌림) */}
                            {canEdit && g.status === 'archived' && (
                              <DropdownMenuItem
                                onSelect={() => statusMutation.mutate({ id: g.id, nextStatus: 'draft' })}
                              >
                                복원 (임시저장으로)
                              </DropdownMenuItem>
                            )}
                            {/* 보관 상태 → 바로 재발행 */}
                            {canPublish && g.status === 'archived' && (
                              <DropdownMenuItem
                                onSelect={() => statusMutation.mutate({ id: g.id, nextStatus: 'published' })}
                              >
                                바로 재발행
                              </DropdownMenuItem>
                            )}
                            {canDelete && g.status !== 'archived' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() => setDeleteTarget(g)}
                                >
                                  보관함으로 이동
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>가이드를 보관하시겠습니까?</DialogTitle>
            <DialogDescription>
              "{deleteTarget?.title}" 가이드는 보관함으로 이동하며, 사용자 사이트에서는 더 이상 노출되지 않습니다.
              이 작업은 언제든 되돌릴 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? '처리 중…' : '보관'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
