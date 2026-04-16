// src/pages/UpdatesPage.jsx
import { Bell, Sparkles, FileCog } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const UPDATES_DATA = [
  {
    date: '2026-04-15',
    type: 'feature',
    title: 'AMS 운영 위키 베타 오픈',
    desc: '흩어져 있던 운영 가이드를 한 곳에 모은 통합 위키 시스템이 오픈되었습니다. 이제 30초 안에 원하는 가이드를 검색해 보세요.',
  },
  {
    date: '2026-04-01',
    type: 'policy',
    title: '2026년 환불 정책 변경 적용',
    desc: '수강료 및 교재비 환불 산정 기준이 새롭게 개정되었습니다. 반드시 새로운 가이드의 "환불 승인 기준"을 확인 후 업무를 진행해 주세요.',
  },
  {
    date: '2026-03-20',
    type: 'feature',
    title: '회원 병합 시 녹취록 첨부 기능 추가',
    desc: '계정 통합으로 인한 데이터 유실을 방지하기 위해, 회원 병합 메뉴에 학부모 동의 녹취록 파일을 직접 첨부할 수 있는 기능이 추가되었습니다.',
  },
]

export default function UpdatesPage() {
  return (
    <div className="flex-1 w-full max-w-[800px] mx-auto px-10 pt-[60px] pb-[120px]">

      {/* 헤더 영역 */}
      <div className="mb-14">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-red-50 mb-4">
          <Bell size={24} className="text-red-600" />
        </div>
        <h1 className="text-[32px] font-extrabold text-foreground mb-3 tracking-tight">업데이트 이력</h1>
        <p className="text-base text-muted-foreground">AMS 기능 개선 및 주요 정책 변경 사항을 확인하세요.</p>
      </div>

      {/* 타임라인 영역 */}
      <div className="relative">
        {/* 세로 선 */}
        <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-border"></div>

        {UPDATES_DATA.map((item, idx) => {
          const isFeature = item.type === 'feature'
          return (
            <div key={idx} className="relative flex gap-8 mb-12">

              {/* 타임라인 아이콘 노드 */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center shrink-0">
                {isFeature ? <Sparkles size={20} className="text-primary" /> : <FileCog size={20} className="text-emerald-600" />}
              </div>

              {/* 콘텐츠 카드 */}
              <div className="flex-1 mt-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[13px] font-bold font-mono text-muted-foreground">{item.date}</span>
                  <Badge variant={isFeature ? 'blue' : 'green'} size="sm" className="font-bold">
                    {isFeature ? '기능 개선' : '정책 변경'}
                  </Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
