// src/pages/HomePage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Building, GraduationCap, Shield, BarChart3,
  HelpCircle, Bell, ExternalLink, ArrowRight, ChevronRight
} from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { MODULES } from '@/api/mockData'
import { RECENT_GUIDES } from '@/data/mockData'

const ICON_MAP = { ClipboardList, BookOpen, Calendar, CreditCard, Gift, MessageSquare, Users, Building, GraduationCap, Shield, BarChart3 }
const POPULAR = ['계정이관', '환불 처리', 'QR 출석', '중복결제', '전반']

// 인라인 스타일로 완벽하게 제어되는 모듈 카드
function ModuleCard({ m }) {
  const Icon = ICON_MAP[m.icon] || BookOpen
  return (
    <Link 
      to={`/modules/${m.id}`} 
      style={{
        display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px',
        borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff',
        textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#d1d5db';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        e.currentTarget.querySelector('.icon-wrap').style.backgroundColor = '#eff6ff';
        e.currentTarget.querySelector('.icon-svg').style.color = '#2563eb';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.querySelector('.icon-wrap').style.backgroundColor = '#f9fafb';
        e.currentTarget.querySelector('.icon-svg').style.color = '#6b7280';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          className="icon-wrap"
          style={{
            width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f9fafb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease'
          }}
        >
          <Icon className="icon-svg" size={18} strokeWidth={2.5} color="#6b7280" style={{ transition: 'color 0.2s ease' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {m.label}
          </p>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '2px 0 0 0' }}>{m.guide_count}개 가이드</p>
        </div>
        <ChevronRight size={16} color="#d1d5db" />
      </div>
      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {m.description}
      </p>
    </Link>
  )
}

function RecentItem({ g, isLast }) {
  const [isNew] = useState(() => g.updated_at && Date.now() - new Date(g.updated_at).getTime() < 7*24*60*60*1000)
  return (
    <Link 
      to={`/guides/${g.id}`} 
      style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px',
        borderBottom: isLast ? 'none' : '1px solid #f3f4f6', textDecoration: 'none', transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '99px', whiteSpace: 'nowrap' }}>
        {g.module}
      </span>
      <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {g.title}
      </span>
      {isNew && (
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '99px', whiteSpace: 'nowrap' }}>
          업데이트됨
        </span>
      )}
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', fontFamily: 'monospace' }}>
        {g.updated_at?.slice(0,10)}
      </span>
      <ArrowRight size={14} color="#d1d5db" />
    </Link>
  )
}

export default function HomePage() {
  const { open } = useSearchStore()
  const mods = MODULES
  const recents = RECENT_GUIDES

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '64px 40px', boxSizing: 'border-box' }}>
      
      {/* ── 히어로 영역 ── */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', marginBottom: '80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', color: '#1d4ed8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
          AMS 운영 위키
        </div>

        <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827', margin: 0, lineHeight: 1.2 }}>
          어떤 가이드를 찾으시나요?
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500, margin: 0 }}>
          AMS 기능 사용법, 운영 케이스, 정책 기준을 한 곳에서 검색하세요.
        </p>

        {/* 검색바 */}
        <button 
          onClick={open} 
          style={{
            marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '560px', height: '52px', padding: '0 20px',
            borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            cursor: 'pointer', transition: 'all 0.2s ease', boxSizing: 'border-box'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            e.currentTarget.querySelector('.search-icon').style.color = '#3b82f6';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            e.currentTarget.querySelector('.search-icon').style.color = '#9ca3af';
          }}
        >
          <Search className="search-icon" size={18} color="#9ca3af" style={{ transition: 'color 0.2s ease' }} />
          <span style={{ flex: 1, textAlign: 'left', fontSize: '15px', color: '#9ca3af', fontWeight: 500 }}>가이드 검색 (단축키 '/')</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <kbd style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 600, color: '#9ca3af', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px 8px' }}>⌘</kbd>
            <kbd style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 600, color: '#9ca3af', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px 8px' }}>K</kbd>
          </div>
        </button>

        {/* 인기 검색어 칩 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginRight: '4px' }}>인기 검색어:</span>
          {POPULAR.map(q => (
            <button 
              key={q} 
              onClick={open} 
              style={{
                fontSize: '13px', fontWeight: 500, padding: '4px 12px', borderRadius: '99px',
                backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#4b5563',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* ── 모듈 그리드 ── */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>카테고리 탐색</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {mods.map(m => <ModuleCard key={m.id} m={m} />)}
        </div>
      </section>

      {/* ── 하단 영역 (최근 업데이트 & 빠른 링크) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <section>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 20px 0', letterSpacing: '-0.01em' }}>최근 업데이트</h2>
          <div style={{ borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {recents.map((g, i) => <RecentItem key={g.id} g={g} isLast={i === recents.length - 1} />)}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>빠른 링크</h2>
          {[
            { to:'/faq', Icon:HelpCircle, label:'운영 FAQ', desc:'반복 문의 해결' },
            { to:'/updates', Icon:Bell, label:'업데이트 이력', desc:'정책 및 기능 변경' },
            { to:'/feedback', Icon:ExternalLink, label:'오류 제보', desc:'시스템 개선 요청' },
          ].map((link, i) => (
            <Link 
              key={i} 
              to={link.to} 
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff',
                textDecoration: 'none', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.querySelector('.link-icon').style.color = '#2563eb';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.link-icon').style.color = '#6b7280';
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <link.Icon className="link-icon" size={18} strokeWidth={2.5} color="#6b7280" style={{ transition: 'color 0.2s ease' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{link.label}</p>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '2px 0 0 0' }}>{link.desc}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>

    </div>
  )
}