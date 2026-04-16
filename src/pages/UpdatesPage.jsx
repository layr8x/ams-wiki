// src/pages/UpdatesPage.jsx
import { Bell, Sparkles, FileCog } from 'lucide-react'

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
    <div style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '0 auto', padding: '60px 40px 120px' }}>
      
      {/* 헤더 영역 */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fef2f2', marginBottom: '16px' }}>
          <Bell size={24} color="#dc2626" />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>업데이트 이력</h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>AMS 기능 개선 및 주요 정책 변경 사항을 확인하세요.</p>
      </div>

      {/* 타임라인 영역 */}
      <div style={{ position: 'relative' }}>
        {/* 세로 선 */}
        <div style={{ position: 'absolute', top: '0', bottom: '0', left: '23px', width: '2px', backgroundColor: '#e5e7eb' }}></div>

        {UPDATES_DATA.map((item, idx) => {
          const isFeature = item.type === 'feature'
          return (
            <div key={idx} style={{ position: 'relative', display: 'flex', gap: '32px', marginBottom: '48px' }}>
              
              {/* 타임라인 아이콘 노드 */}
              <div style={{ position: 'relative', zIndex: 10, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isFeature ? <Sparkles size={20} color="#2563eb" /> : <FileCog size={20} color="#059669" />}
              </div>

              {/* 콘텐츠 카드 */}
              <div style={{ flex: 1, marginTop: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#6b7280' }}>{item.date}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', backgroundColor: isFeature ? '#eff6ff' : '#ecfdf5', color: isFeature ? '#1d4ed8' : '#047857' }}>
                    {isFeature ? '기능 개선' : '정책 변경'}
                  </span>
                </div>
                
                <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '15px', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}