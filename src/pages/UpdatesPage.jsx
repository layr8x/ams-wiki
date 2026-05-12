// src/pages/UpdatesPage.jsx
// 구조: PageHeader → 타입 필터 → 월 그룹별 타임라인
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkle as Sparkles,
  Gear as FileCog,
  BookOpen,
  Warning as AlertTriangle,
  CaretRight as ChevronRight
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageShell, PageHeader } from '@/components/common/page-primitives'
import { cn } from '@/lib/utils'

const UPDATES_DATA = [
  { date:'2026-04-15', type:'feature', title:'AMS 운영 위키 베타 오픈', desc:'흩어져 있던 운영 가이드를 한 곳에 모은 통합 위키 시스템이 오픈되었습니다. 모집/접수부터 청구/환불까지 21개 가이드를 검색 한 번으로 찾아보세요.', guideId:null },
  { date:'2026-04-12', type:'guide',   title:'강좌 생성 가이드 v2.0 업데이트', desc:'단기 특강, 연간반 설정 케이스와 강사 미등록 오류 해결 방법이 추가되었습니다.', guideId:'course-create' },
  { date:'2026-04-10', type:'policy',  title:'환불 정책 개정 — 교재비 별도 정산 기준 명확화', desc:'개강 전 취소 시 교재비 반환 절차가 별도로 명시되었습니다.', guideId:'refund-policy' },
  { date:'2026-04-06', type:'guide',   title:'문자 발송 가이드 신규 추가', desc:'SMS/LMS 발송 방법, 변수 사용법, 대량 발송 승인 절차를 포함합니다.', guideId:'sms-send' },
  { date:'2026-04-01', type:'policy',  title:'2026년 환불 정책 변경 적용', desc:'수강료 및 교재비 환불 산정 기준이 새롭게 개정되었습니다.', guideId:'refund-policy' },
  { date:'2026-03-25', type:'feature', title:'QR 출석 트러블슈팅 가이드 v3.2 업데이트', desc:'현장 기기별 인식 실패 원인이 추가되었습니다.', guideId:'qr-trouble' },
  { date:'2026-03-20', type:'feature', title:'회원 병합 시 녹취록 첨부 기능 추가', desc:'학부모 동의 녹취록 파일을 직접 첨부할 수 있는 기능이 추가되었습니다.', guideId:'member-merge' },
  { date:'2026-03-14', type:'guide',   title:'전반 처리 가이드 업데이트', desc:'전반 처리 불가 케이스에 "혜택(쿠폰) 변경" 항목이 추가되었습니다.', guideId:'class-transfer' },
  { date:'2026-03-04', type:'guide',   title:'청구 생성 가이드 v1.8 업데이트', desc:'수강예정회차 확인 절차 강조 및 연결교재 추가 청구 케이스가 신규 추가되었습니다.', guideId:'billing-guide' },
  { date:'2026-02-04', type:'guide',   title:'전환결제 처리 가이드 v2.0 릴리즈', desc:'온라인 전환 시 결제요청 URL 발송 기능이 추가되었습니다.', guideId:'payment-switch' },
]

const TYPE_CFG = {
  feature: { icon: Sparkles,      variant: 'sop',       label: '기능 개선' },
  policy:  { icon: FileCog,       variant: 'policy',    label: '정책 변경' },
  guide:   { icon: BookOpen,      variant: 'response',  label: '가이드 업데이트' },
  alert:   { icon: AlertTriangle, variant: 'trouble',   label: '긴급 공지' },
}

const TYPE_FILTERS = [
  { value: 'all',     label: '전체' },
  { value: 'feature', label: '기능 개선' },
  { value: 'policy',  label: '정책 변경' },
  { value: 'guide',   label: '가이드' },
]

export default function UpdatesPage() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(
    () => filter === 'all' ? UPDATES_DATA : UPDATES_DATA.filter(u => u.type === filter),
    [filter]
  )

  // 월별 그룹
  const grouped = useMemo(() => {
    const map = new Map()
    for (const item of filtered) {
      const key = item.date.slice(0, 7) // "2026-04"
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(item)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <PageShell maxWidth="3xl">
      <PageHeader
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '업데이트' }]}
        title="업데이트 이력"
        description={`AMS 기능 개선 및 주요 정책 변경 사항 · ${UPDATES_DATA.length}건`}
      />

      {/* 타입 필터 */}
      <div className="mb-8 flex flex-wrap gap-1.5" role="group" aria-label="업데이트 타입 필터">
        {TYPE_FILTERS.map(f => {
          const count = f.value === 'all'
            ? UPDATES_DATA.length
            : UPDATES_DATA.filter(u => u.type === f.value).length
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filter === f.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              {f.label}
              <span className={cn(
                'tabular-nums',
                filter === f.value ? 'text-background/70' : 'text-muted-foreground/70'
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 타임라인 */}
      <div className="space-y-10">
        {grouped.map(([month, items]) => (
          <section key={month}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
              {month.replace('-', '년 ')}월
            </h3>
            <div className="relative pl-7 before:absolute before:left-[11px] before:top-1.5 before:h-[calc(100%-0.375rem)] before:w-px before:bg-border">
              {items.map((item, idx) => {
                const cfg = TYPE_CFG[item.type] ?? TYPE_CFG.feature
                const Icon = cfg.icon
                return (
                  <div key={idx} className="relative mb-5 last:mb-0">
                    {/* 아이콘 노드 */}
                    <div className="absolute -left-7 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-background">
                      <Icon size={11} className="text-muted-foreground" />
                    </div>

                    {/* 카드 */}
                    <Card className="gap-0 py-0 transition-colors hover:bg-accent/30">
                      <CardContent className="px-5 py-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {item.date}
                          </span>
                        </div>
                        <h4 className="mb-1 text-sm font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="prose-ams text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                        {item.guideId && (
                          <Link
                            to={`/guides/${item.guideId}`}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground transition-colors hover:underline"
                          >
                            관련 가이드 보기 <ChevronRight size={12} />
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
