// src/pages/FaqPage.jsx
import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

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
    <div style={{ flex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', padding: '60px 40px 120px' }}>
      
      {/* 헤더 영역 */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#eff6ff', marginBottom: '16px' }}>
          <HelpCircle size={24} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>운영 FAQ</h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>상담실장님들이 가장 자주 묻는 반복 문의들을 모았습니다.</p>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            style={{
              padding: '8px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              backgroundColor: activeCategory === cat ? '#111827' : '#f3f4f6',
              color: activeCategory === cat ? '#ffffff' : '#4b5563',
              border: 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div style={{ borderTop: '1px solid #e5e7eb' }}>
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div key={idx} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <button 
                onClick={() => toggle(idx)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>{faq.category}</span>
                  <span style={{ fontSize: '16px', fontWeight: isOpen ? 700 : 500, color: isOpen ? '#2563eb' : '#111827', transition: 'color 0.2s' }}>{faq.q}</span>
                </div>
                {isOpen ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
              </button>
              
              {isOpen && (
                <div style={{ padding: '0 16px 24px 80px' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <MessageSquare size={18} color="#6b7280" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '15px', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
    </div>
  )
}