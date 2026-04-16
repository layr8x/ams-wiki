// src/pages/FaqPage.jsx
import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const FAQ_DATA = [
  { category: '결제/환불', q: '카드 전환결제는 어떻게 진행하나요?', a: '기존 결제를 취소하기 전, 반드시 새로운 카드로 먼저 결제를 승인받아야 합니다. 이후 [결제 관리] > [전환결제] 탭에서 기존 결제 내역을 취소 처리하시면 됩니다.' },
  { category: '고객 관리', q: '두 개의 계정을 하나로 합칠 수 있나요?', a: '네, [회원 관리] > [회원 상세] 우측 상단의 [회원 병합] 버튼을 통해 가능합니다. 단, 병합 후에는 복구가 불가능하므로 반드시 학부모 동의를 먼저 얻어야 합니다.' },
  { category: '출결 관리', q: '학생이 QR 코드를 안 가져왔을 때는 어떻게 출석 처리하나요?', a: '수동 출석 처리가 가능합니다. [출결 관리] 모듈에서 해당 학생의 이름을 검색한 후, 상태를 [출석]으로 수동 변경해 주시면 됩니다.' },
  { category: '수업 운영', q: '중도 입반 학생의 수강료는 어떻게 계산되나요?', a: '시스템에서 남은 수업 일수를 기준으로 자동으로 일할 계산(Pr상oration)을 수행합니다. 청구서 생성 시 [자동 계산] 옵션이 체크되어 있는지 확인하세요.' },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState('전체')

  const categories = ['전체', ...new Set(FAQ_DATA.map(f => f.category))]
  const filteredFaqs = activeCategory === '전체' ? FAQ_DATA : FAQ_DATA.filter(f => f.category === activeCategory)

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <div className="flex-1 w-full max-w-[900px] mx-auto px-10 pt-[60px] pb-[120px]">

      {/* 헤더 영역 */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-blue-50 mb-4">
          <HelpCircle size={24} className="text-blue-600" />
        </div>
        <h1 className="text-[32px] font-extrabold text-zinc-900 mb-3 tracking-tight">운영 FAQ</h1>
        <p className="text-base text-zinc-500">상담실장님들이 가장 자주 묻는 반복 문의들을 모았습니다.</p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-8 justify-center">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            className="rounded-full px-5"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div className="border-t border-zinc-200">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="border-b border-zinc-200 transition-colors duration-200 hover:bg-zinc-50">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between px-4 py-6 bg-transparent border-none cursor-pointer text-left"
              >
                <div className="flex items-center gap-4">
                  <Badge variant="default" size="default" className="font-bold">{faq.category}</Badge>
                  <span className={`text-base transition-colors duration-200 ${isOpen ? 'font-bold text-blue-600' : 'font-medium text-zinc-900'}`}>{faq.q}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-400" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-6 pl-20">
                  <Card className="flex gap-3 p-5 bg-zinc-50 border-zinc-200">
                    <MessageSquare size={18} className="text-zinc-500 mt-0.5 shrink-0" />
                    <p className="text-[15px] text-zinc-600 m-0 leading-relaxed">{faq.a}</p>
                  </Card>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
