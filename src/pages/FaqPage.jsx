// src/pages/FaqPage.jsx
import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const FAQ_DATA = [
  // ── 결제/환불 ──────────────────────────────────────────────────────────────
  {
    category: '결제/환불',
    q: '카드 전환결제는 어떻게 진행하나요?',
    a: '전환결제는 기존 결제를 취소하는 게 아니라 새 결제를 먼저 생성하는 구조입니다. 회원상세 > 결제내역 탭에서 전환할 결제를 체크 후 [전환결제] 버튼을 클릭하세요. 신규 결제 완료 후 PG카드는 자동 환불, VAN/현금/가상계좌는 환불대기 상태에서 직접 처리가 필요합니다.',
    guideId: 'payment-switch',
  },
  {
    category: '결제/환불',
    q: '수강료 환불 기준이 어떻게 되나요?',
    a: '학원법 기준입니다: ① 개강 전 취소 → 전액 환불 ② 총 교습시간 1/3 경과 전 → 수강료 2/3 환불 ③ 1/2 경과 전 → 수강료 1/2 환불 ④ 1/2 경과 후 → 환불 불가. 1/2 이후 예외 적용이 필요한 경우 반드시 실장 전결이 필요합니다.',
    guideId: 'refund-policy',
  },
  {
    category: '결제/환불',
    q: '가상계좌 입금 기한이 지났는데 입금이 됐어요.',
    a: '입금 기한 경과 후 입금된 건은 시스템에서 자동 취소 처리됩니다. 재발급이 필요한 경우 청구/수납 관리에서 가상계좌를 재발급한 뒤 안내 문자를 다시 발송해 주세요.',
    guideId: 'virtual-account-guide',
  },
  {
    category: '결제/환불',
    q: '전환결제 후 취소 요청이 들어왔어요.',
    a: '전환결제 건은 환불취소가 불가능합니다. 이 사실을 학부모에게 안내하고, 불가피한 경우 실장에게 에스컬레이션하세요. 처리 전 반드시 회원에게 이 사실을 확인시키고 동의를 받아야 합니다.',
    guideId: 'payment-switch',
  },
  {
    category: '결제/환불',
    q: '입금대기 상태의 가상계좌를 전환결제 할 수 있나요?',
    a: '불가합니다. 가상계좌 입금 대기 중인 결제건은 전환결제 버튼이 비활성화됩니다. 입금완료 처리 후 전환결제를 진행하거나, 입금 전이라면 해당 결제를 취소하고 새로운 결제수단으로 재결제를 안내하세요.',
    guideId: 'payment-switch',
  },

  // ── 고객 관리 ──────────────────────────────────────────────────────────────
  {
    category: '고객 관리',
    q: '두 개의 계정을 하나로 합칠 수 있나요?',
    a: '네, AMS 어드민 > 고객(원생) 관리 > 회원조회에서 [회원 병합] 기능을 사용할 수 있습니다. FROM(이관 원본)과 TO(이관 대상) 회원을 설정하면 입반, 접수, 결제, 환불, 대기번호, 상담이력이 모두 이관됩니다. 단, 동일 회원임이 확인된 계정끼리만 가능합니다.',
    guideId: 'member-merge',
  },
  {
    category: '고객 관리',
    q: '통합회원과 로컬계정이 중복일 때 어떻게 처리하나요?',
    a: 'AMS 데이터 유무에 따라 처리 방법이 다릅니다. 통합계정에 AMS 데이터가 없으면 학부모가 마이클래스에서 직접 연동하도록 안내하면 됩니다 (수동 처리 불필요). 통합계정에 이미 AMS 데이터가 있는 경우는 개발팀(플랫폼서비스실) 요청이 필요합니다.',
    guideId: 'duplicate-account',
  },
  {
    category: '고객 관리',
    q: '학생이 질병으로 수강을 잠시 중단하고 싶어해요.',
    a: '휴강 처리를 진행하세요. 회원상세 > 입반정보 탭 > [휴강처리] 버튼에서 시작일과 예상 복강일을 입력합니다. 질병의 경우 [의료사유 휴강]으로 선택하고 진단서를 첨부받는 것을 권장합니다. 휴강 기간 동안은 청구 대상에서 자동으로 제외됩니다.',
    guideId: 'student-suspension',
  },
  {
    category: '고객 관리',
    q: '병합 후 FROM 회원 계정은 어떻게 처리하나요?',
    a: 'FROM 회원이 로컬계정인 경우 병합 시 자동 탈퇴 처리됩니다. 로컬계정이 아닌 경우 핸드폰 번호를 010-0000-0000으로 변경하고 "미사용" 태그를 부여하면 회원 검색 결과에서 제외됩니다.',
    guideId: 'member-merge',
  },

  // ── 수업 운영 ──────────────────────────────────────────────────────────────
  {
    category: '수업 운영',
    q: 'QR 코드를 안 가져왔을 때 어떻게 출석 처리하나요?',
    a: '수동 출석 처리가 가능합니다. AMS 어드민 > 수업운영관리 > 출결 관리 > 수동 출석에서 해당 학생을 검색하여 출석 상태로 변경하세요. QR 인식 장치 전체가 불가한 경우 수동 출석 모드로 전환 후 플랫폼서비스실에 긴급 연락하세요.',
    guideId: 'qr-trouble',
  },
  {
    category: '수업 운영',
    q: '중도 입반 학생의 수강료는 어떻게 계산되나요?',
    a: '시스템이 남은 수업 일수를 기준으로 자동 일할 계산(Proration)을 수행합니다. 청구 생성 팝업에서 [자동 계산] 옵션이 체크되어 있는지 확인하고, 수강예정회차 컬럼을 통해 청구 대상 회차 수를 미리 확인하세요.',
    guideId: 'billing-guide',
  },
  {
    category: '수업 운영',
    q: '전반을 진행하려는데 오류가 납니다.',
    a: '주요 원인은 세 가지입니다: ① 전반 전 강좌에서 선택한 회차 이후에 출석상태가 있는 경우 → 해당 출결 처리 후 재시도. ② 배부 회차가 종료되는 교재에 수령예정 교재가 있는 경우 → 수령처리 후 재시도. ③ 혜택(쿠폰) 변경이 필요한 경우 → 전반 불가, 퇴반 후 입반으로 진행.',
    guideId: 'class-transfer',
  },
  {
    category: '수업 운영',
    q: '미납 학생 퇴반처리는 어떻게 하나요?',
    a: '수업관리 상세 화면에서 입반생 목록을 불러온 후, 납부잔여회차(이용가능회차)가 0인 학생들을 확인하세요. 퇴반처리할 학생들을 체크 선택 후 좌측 상단에서 퇴반일을 선택하고 [퇴반처리] 버튼을 클릭합니다.',
    guideId: 'unpaid-withdraw',
  },

  // ── 모집/접수 ──────────────────────────────────────────────────────────────
  {
    category: '모집/접수',
    q: '대기번호가 있는 학생이 입반 가능한 자리가 생겼어요. 어떻게 처리하나요?',
    a: '빠른 대기번호를 먼저 확인하세요 (병합 이관된 대기번호가 우선). 해당 회원에게 입반 의사를 확인한 후 [입반 전환] 버튼을 클릭하면 됩니다. 입반 의사가 없으면 대기 취소 후 다음 순번에게 연락하세요.',
    guideId: 'waitlist-manage',
  },
  {
    category: '모집/접수',
    q: '동일 회원이 같은 강좌에 중복 접수되어 있어요.',
    a: '접수현황에서 기존 접수 내역을 확인하세요. 중복 접수 중 하나를 취소해야 합니다. 대기번호가 있는 건을 취소할 때는 기존 순번이 초기화되므로 학부모에게 미리 안내하고 동의를 받으세요.',
    guideId: 'recruit-application',
  },

  // ── 강좌/교재 ──────────────────────────────────────────────────────────────
  {
    category: '강좌/교재',
    q: '청구 생성 팝업에서 교재 옵션이 표시되지 않아요.',
    a: '강좌에 교재가 연결되지 않았거나 연결이 비활성화 상태일 수 있습니다. 강좌/교재 관리 > 강좌관리에서 해당 강좌를 선택 후 [교재 연결] 탭에서 교재 연결 상태와 활성화 여부를 재확인하세요.',
    guideId: 'textbook-register',
  },
  {
    category: '강좌/교재',
    q: '강좌 생성 시 "중복된 강의실/시간대"라는 오류가 나요.',
    a: '동일 강의실에 동일 시간대의 강좌가 이미 존재하는 경우입니다. 강의실 또는 수업 시간대를 변경하거나, 강의실 관리에서 해당 시간대의 기존 강좌를 확인하세요. 강의실이 충분하지 않은 경우 실장에게 보고 후 조정이 필요합니다.',
    guideId: 'course-create',
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState('전체')

  const categories = ['전체', ...new Set(FAQ_DATA.map(f => f.category))]
  const filteredFaqs = activeCategory === '전체' ? FAQ_DATA : FAQ_DATA.filter(f => f.category === activeCategory)

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx)

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', padding: '60px 40px 120px', fontFamily: "'Pretendard', sans-serif" }}>

      {/* 헤더 */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#eff6ff', marginBottom: '16px' }}>
          <HelpCircle size={24} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>운영 FAQ</h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>상담실장님들이 가장 자주 묻는 반복 문의들을 모았습니다.</p>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '8px 0 0 0' }}>{FAQ_DATA.length}개 문항</p>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            style={{
              padding: '8px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              backgroundColor: activeCategory === cat ? '#111827' : '#f3f4f6',
              color: activeCategory === cat ? '#ffffff' : '#4b5563',
              border: 'none',
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            {cat}
            {cat !== '전체' && (
              <span style={{ marginLeft: '6px', fontSize: '12px', opacity: 0.7 }}>
                {FAQ_DATA.filter(f => f.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div style={{ borderTop: '1px solid #e5e7eb' }}>
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <button
                onClick={() => toggle(idx)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>{faq.category}</span>
                  <span style={{ fontSize: '15px', fontWeight: isOpen ? 700 : 500, color: isOpen ? '#1d4ed8' : '#111827', transition: 'color 0.2s', lineHeight: 1.5 }}>{faq.q}</span>
                </div>
                <div style={{ flexShrink: 0, marginLeft: '12px' }}>
                  {isOpen ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 16px 24px 16px' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <MessageSquare size={18} color="#6b7280" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 12px 0', lineHeight: 1.7 }}>{faq.a}</p>
                      {faq.guideId && (
                        <Link
                          to={`/guides/${faq.guideId}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                        >
                          <ExternalLink size={13} />
                          관련 가이드 보기
                        </Link>
                      )}
                    </div>
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
