// src/pages/UpdatesPage.jsx
import { Bell, Sparkles, FileCog, AlertTriangle, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const UPDATES_DATA = [
  {
    date: '2026-04-15',
    type: 'feature',
    title: 'AMS 운영 위키 베타 오픈',
    desc: '흩어져 있던 운영 가이드를 한 곳에 모은 통합 위키 시스템이 오픈되었습니다. 모집/접수부터 청구/환불까지 21개 가이드를 검색 한 번으로 찾아보세요.',
    guideId: null,
  },
  {
    date: '2026-04-12',
    type: 'guide',
    title: '강좌 생성 가이드 v2.0 업데이트',
    desc: '단기 특강, 연간반 설정 케이스와 강사 미등록 오류 해결 방법이 추가되었습니다. 강좌 생성 절차가 6단계로 세분화되어 신규 운영자도 쉽게 따라할 수 있습니다.',
    guideId: 'course-create',
  },
  {
    date: '2026-04-10',
    type: 'policy',
    title: '환불 정책 개정 — 교재비 별도 정산 기준 명확화',
    desc: '개강 전 취소 시 교재비 반환 절차가 별도로 명시되었습니다. 기존에 불명확했던 교재비 일할 계산 기준이 이번 개정으로 정리되었으니 반드시 확인하세요.',
    guideId: 'refund-policy',
  },
  {
    date: '2026-04-06',
    type: 'guide',
    title: '문자 발송 가이드 신규 추가',
    desc: '메시지발송 관리 모듈 가이드가 새롭게 추가되었습니다. SMS/LMS 발송 방법, 변수 사용법, 대량 발송 승인 절차, 예약 발송 취소 방법을 포함합니다.',
    guideId: 'sms-send',
  },
  {
    date: '2026-04-01',
    type: 'policy',
    title: '2026년 환불 정책 변경 적용',
    desc: '수강료 및 교재비 환불 산정 기준이 새롭게 개정되었습니다. 반드시 새로운 가이드의 "환불 승인 기준"을 확인 후 업무를 진행해 주세요.',
    guideId: 'refund-policy',
  },
  {
    date: '2026-03-25',
    type: 'feature',
    title: 'QR 출석 트러블슈팅 가이드 v3.2 업데이트',
    desc: '현장 기기별 인식 실패 원인이 추가되었습니다. 브라우저 권한 설정, 반사 필름 문제, 서버 장애 시 수동 전환 절차가 상세히 기술되어 있습니다.',
    guideId: 'qr-trouble',
  },
  {
    date: '2026-03-20',
    type: 'feature',
    title: '회원 병합 시 녹취록 첨부 기능 추가',
    desc: '계정 통합으로 인한 데이터 유실을 방지하기 위해 회원 병합 메뉴에 학부모 동의 녹취록 파일을 직접 첨부할 수 있는 기능이 추가되었습니다.',
    guideId: 'member-merge',
  },
  {
    date: '2026-03-14',
    type: 'guide',
    title: '전반 처리 가이드 업데이트 — 혜택(쿠폰) 관련 케이스 추가',
    desc: '전반 처리 불가 케이스에 "혜택(쿠폰) 변경이 필요한 경우" 항목이 추가되었습니다. 이 경우 퇴반 후 입반으로 우회 처리해야 합니다.',
    guideId: 'class-transfer',
  },
  {
    date: '2026-03-04',
    type: 'guide',
    title: '청구 생성 가이드 v1.8 업데이트',
    desc: '수강예정회차 컬럼 확인 절차가 Step 1으로 강조되었습니다. 연결교재 청구 케이스(수강료 기청구 후 교재만 추가 청구)가 신규 추가되었습니다.',
    guideId: 'billing-guide',
  },
  {
    date: '2026-02-04',
    type: 'guide',
    title: '전환결제 처리 가이드 v2.0 릴리즈',
    desc: '온라인 전환 시 결제요청 URL을 회원에게 발송하는 기능이 추가되었습니다. VAN/현금/가상계좌 기존 결제의 직접 환불 처리 절차가 명확하게 업데이트되었습니다.',
    guideId: 'payment-switch',
  },
]

const TYPE_CONFIG = {
  feature: { Icon: Sparkles, color: '#2563eb', bg: '#eff6ff', label: '기능 개선' },
  policy:  { Icon: FileCog,  color: '#047857', bg: '#ecfdf5', label: '정책 변경' },
  guide:   { Icon: BookOpen, color: '#7c3aed', bg: '#f5f3ff', label: '가이드 업데이트' },
  alert:   { Icon: AlertTriangle, color: '#b45309', bg: '#fffbeb', label: '긴급 공지' },
}

export default function UpdatesPage() {
  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '0 auto', padding: '60px 40px 120px', fontFamily: "'Pretendard', sans-serif" }}>

      {/* 헤더 */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fef2f2', marginBottom: '16px' }}>
          <Bell size={24} color="#dc2626" />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>업데이트 이력</h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>AMS 기능 개선 및 주요 정책 변경 사항을 확인하세요.</p>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '8px 0 0 0' }}>{UPDATES_DATA.length}건의 업데이트</p>
      </div>

      {/* 타임라인 */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '0', bottom: '0', left: '23px', width: '2px', backgroundColor: '#e5e7eb' }} />

        {UPDATES_DATA.map((item, idx) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.feature
          const { Icon } = cfg
          return (
            <div key={idx} style={{ position: 'relative', display: 'flex', gap: '32px', marginBottom: '40px' }}>

              {/* 아이콘 노드 */}
              <div style={{
                position: 'relative', zIndex: 10, width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: '#ffffff', border: '2px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} color={cfg.color} />
              </div>

              {/* 콘텐츠 카드 */}
              <div style={{ flex: 1, marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#6b7280' }}>{item.date}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>

                <div
                  style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
                  {item.guideId && (
                    <Link
                      to={`/guides/${item.guideId}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px', fontSize: '13px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <BookOpen size={13} /> 관련 가이드 보기
                    </Link>
                  )}
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
