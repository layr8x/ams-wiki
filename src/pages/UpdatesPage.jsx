// src/pages/UpdatesPage.jsx — shadcn/ui 표준
import { Bell, Sparkles, FileCog, AlertTriangle, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

const UPDATES_DATA = [
  { date:'2026-04-15', type:'feature', title:'AMS 운영 위키 베타 오픈', desc:'흩어져 있던 운영 가이드를 한 곳에 모은 통합 위키 시스템이 오픈되었습니다. 모집/접수부터 청구/환불까지 21개 가이드를 검색 한 번으로 찾아보세요.', guideId:null },
  { date:'2026-04-12', type:'guide', title:'강좌 생성 가이드 v2.0 업데이트', desc:'단기 특강, 연간반 설정 케이스와 강사 미등록 오류 해결 방법이 추가되었습니다.', guideId:'course-create' },
  { date:'2026-04-10', type:'policy', title:'환불 정책 개정 — 교재비 별도 정산 기준 명확화', desc:'개강 전 취소 시 교재비 반환 절차가 별도로 명시되었습니다.', guideId:'refund-policy' },
  { date:'2026-04-06', type:'guide', title:'문자 발송 가이드 신규 추가', desc:'SMS/LMS 발송 방법, 변수 사용법, 대량 발송 승인 절차를 포함합니다.', guideId:'sms-send' },
  { date:'2026-04-01', type:'policy', title:'2026년 환불 정책 변경 적용', desc:'수강료 및 교재비 환불 산정 기준이 새롭게 개정되었습니다.', guideId:'refund-policy' },
  { date:'2026-03-25', type:'feature', title:'QR 출석 트러블슈팅 가이드 v3.2 업데이트', desc:'현장 기기별 인식 실패 원인이 추가되었습니다.', guideId:'qr-trouble' },
  { date:'2026-03-20', type:'feature', title:'회원 병합 시 녹취록 첨부 기능 추가', desc:'학부모 동의 녹취록 파일을 직접 첨부할 수 있는 기능이 추가되었습니다.', guideId:'member-merge' },
  { date:'2026-03-14', type:'guide', title:'전반 처리 가이드 업데이트', desc:'전반 처리 불가 케이스에 "혜택(쿠폰) 변경" 항목이 추가되었습니다.', guideId:'class-transfer' },
  { date:'2026-03-04', type:'guide', title:'청구 생성 가이드 v1.8 업데이트', desc:'수강예정회차 확인 절차 강조 및 연결교재 추가 청구 케이스가 신규 추가되었습니다.', guideId:'billing-guide' },
  { date:'2026-02-04', type:'guide', title:'전환결제 처리 가이드 v2.0 릴리즈', desc:'온라인 전환 시 결제요청 URL 발송 기능이 추가되었습니다.', guideId:'payment-switch' },
]

const TYPE_CFG = {
  feature: { icon: Sparkles,      variant: 'sop',       label: '기능 개선' },
  policy:  { icon: FileCog,       variant: 'reference',  label: '정책 변경' },
  guide:   { icon: BookOpen,      variant: 'response',   label: '가이드 업데이트' },
  alert:   { icon: AlertTriangle, variant: 'trouble',    label: '긴급 공지' },
}

export default function UpdatesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">

      <div className="mb-10">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
          <Bell size={20} className="text-red-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">업데이트 이력</h1>
        <p className="text-sm text-muted-foreground">
          AMS 기능 개선 및 주요 정책 변경 사항 · {UPDATES_DATA.length}건
        </p>
      </div>

      {/* 타임라인 */}
      <div className="relative pl-8 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-border">
        {UPDATES_DATA.map((item, idx) => {
          const cfg = TYPE_CFG[item.type] || TYPE_CFG.feature
          const Icon = cfg.icon
          return (
            <div key={idx} className="relative mb-8 last:mb-0">
              {/* 아이콘 노드 */}
              <div className="absolute -left-8 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
                <Icon size={14} className="text-muted-foreground" />
              </div>

              {/* 콘텐츠 */}
              <div className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{item.date}</span>
                  <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                </div>
                <h3 className="mb-2 text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                {item.guideId && (
                  <Link
                    to={`/guides/${item.guideId}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <BookOpen size={12} /> 관련 가이드 보기
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
