// src/pages/FeedbackPage.jsx
import { useState } from 'react'
import { MessageCircle, CheckCircle2, AlertTriangle, BookOpen, Lightbulb } from 'lucide-react'

const TYPES = [
  { id: 'error', Icon: AlertTriangle, label: '오류 제보', desc: '가이드 내용이 실제와 다릅니다', color: '#dc2626', bg: '#fef2f2' },
  { id: 'missing', Icon: BookOpen, label: '내용 추가 요청', desc: '필요한 가이드가 없습니다', color: '#2563eb', bg: '#eff6ff' },
  { id: 'improvement', Icon: Lightbulb, label: '개선 제안', desc: '더 나은 방법이 있습니다', color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'other', Icon: MessageCircle, label: '기타 문의', desc: '위 항목에 해당되지 않습니다', color: '#059669', bg: '#ecfdf5' },
]

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = selectedType && title.trim().length > 0 && body.trim().length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    // 실제 제출 로직은 백엔드 연동 후 구현 예정
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ flex: 1, width: '100%', maxWidth: '640px', margin: '0 auto', padding: '120px 40px', fontFamily: "'Pretendard', sans-serif", textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#ecfdf5', marginBottom: '24px' }}>
          <CheckCircle2 size={32} color="#059669" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>제출 완료</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 32px 0' }}>
          피드백을 보내주셔서 감사합니다.<br />
          내용을 검토한 후 가이드에 반영하겠습니다.
        </p>
        <button
          onClick={() => { setSubmitted(false); setSelectedType(null); setTitle(''); setBody(''); }}
          style={{ padding: '12px 28px', borderRadius: '10px', backgroundColor: '#111827', color: '#ffffff', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}
        >
          다시 제출하기
        </button>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '640px', margin: '0 auto', padding: '60px 40px 120px', fontFamily: "'Pretendard', sans-serif" }}>

      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f0fdf4', marginBottom: '16px' }}>
          <MessageCircle size={24} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>오류 제보 / 개선 제안</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>가이드 오류나 개선 사항을 알려주시면 빠르게 반영하겠습니다.</p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* 유형 선택 */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>
            문의 유형 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {TYPES.map(t => {
              const isSelected = selectedType === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                    borderRadius: '12px', border: `2px solid ${isSelected ? t.color : '#e5e7eb'}`,
                    backgroundColor: isSelected ? t.bg : '#ffffff',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    fontFamily: "'Pretendard', sans-serif",
                  }}
                >
                  <t.Icon size={18} color={isSelected ? t.color : '#9ca3af'} style={{ marginTop: '1px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? t.color : '#111827', margin: '0 0 2px 0' }}>{t.label}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{t.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 제목 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
            제목 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 전반 처리 가이드 Step 3 내용이 다릅니다"
            maxLength={100}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '1px solid #e5e7eb', fontSize: '14px', color: '#111827',
              fontFamily: "'Pretendard', sans-serif", boxSizing: 'border-box',
              outline: 'none', backgroundColor: '#ffffff',
            }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* 내용 */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
            상세 내용 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="오류 내용, 개선이 필요한 부분, 추가가 필요한 내용 등을 자세히 적어주세요."
            rows={6}
            maxLength={1000}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '1px solid #e5e7eb', fontSize: '14px', color: '#111827',
              fontFamily: "'Pretendard', sans-serif", boxSizing: 'border-box',
              outline: 'none', resize: 'vertical', lineHeight: 1.6,
              backgroundColor: '#ffffff',
            }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '6px 0 0 0', textAlign: 'right' }}>{body.length} / 1000</p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            backgroundColor: canSubmit ? '#111827' : '#e5e7eb',
            color: canSubmit ? '#ffffff' : '#9ca3af',
            border: 'none', fontSize: '15px', fontWeight: 700, cursor: canSubmit ? 'pointer' : 'default',
            fontFamily: "'Pretendard', sans-serif", transition: 'all 0.15s',
          }}
        >
          제출하기
        </button>

      </form>
    </div>
  )
}
