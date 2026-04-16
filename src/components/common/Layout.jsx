// src/components/common/Layout.jsx — Geist Design System 100% 적용
import { Outlet, useNavigate } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import { useSearchStore } from '@/store/searchStore.jsx'

const S = {
  // 헤더
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '56px', padding: '0 24px',
    backgroundColor: 'rgba(255,255,255,0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',  /* --ds-gray-a200 */
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    cursor: 'pointer', flexShrink: 0, userSelect: 'none',
  },
  logoMark: {
    width: '26px', height: '26px', borderRadius: '6px',
    backgroundColor: '#000000', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '11px', letterSpacing: '0.02em',
    fontFamily: "'Pretendard', sans-serif",
  },
  logoText: {
    fontWeight: 700, fontSize: '15px', letterSpacing: '-0.025em', color: '#1a1a1a',
    fontFamily: "'Pretendard', sans-serif",
  },
  searchBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', maxWidth: '480px', height: '32px',
    padding: '0 12px', borderRadius: '8px',
    backgroundColor: '#f2f2f2', border: '1px solid rgba(0,0,0,0.12)',
    cursor: 'pointer',
    transition: 'border-color 120ms ease, background-color 120ms ease',
    fontFamily: "'Pretendard', sans-serif",
  },
  searchText: { flex: 1, textAlign: 'left', fontSize: '13px', color: '#8f8f8f', fontWeight: 400 },
  kbd: {
    fontSize: '11px', fontWeight: 600, padding: '2px 6px',
    backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: '4px', color: '#8f8f8f', fontFamily: 'monospace',
    lineHeight: 1.4,
  },
  rightActions: { display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 },
  bell: { position: 'relative', cursor: 'pointer', display: 'flex' },
  bellDot: {
    position: 'absolute', top: '-2px', right: '-2px',
    width: '7px', height: '7px', borderRadius: '50%',
    backgroundColor: '#e5484d', border: '1.5px solid #fff',
  },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    backgroundColor: '#f2f2f2', border: '1px solid rgba(0,0,0,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  body: { display: 'flex', flex: 1, width: '100%', overflow: 'hidden' },
  main: { flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
}

export default function Layout() {
  const { open } = useSearchStore()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#ffffff', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>

      {/* ── 전역 헤더 ── */}
      <header style={S.header}>
        {/* 로고 */}
        <div style={S.logo} onClick={() => navigate('/')}>
          <img src="/logo.svg" alt="AMS 운영 위키" style={{ height: '22px', width: 'auto', display: 'block' }} />
        </div>

        {/* 검색 — 단일 정보 소스 */}
        <button
          onClick={open}
          style={S.searchBtn}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ebebeb'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f2f2f2'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
        >
          <Search size={13} color="#8f8f8f" style={{ flexShrink: 0 }} />
          <span style={S.searchText}>가이드 검색...</span>
          <kbd style={S.kbd}>/</kbd>
        </button>

        {/* 오른쪽 작업 */}
        <div style={S.rightActions}>
          <LanguageSelector />
          <ThemeToggle />
          <div style={S.bell}>
            <Bell size={18} color="#666666" />
            <span style={S.bellDot} />
          </div>
          <div style={S.avatar}>
            <User size={15} color="#666666" />
          </div>
        </div>
      </header>

      {/* ── 본문 ── */}
      <div style={S.body}>
        <Sidebar />
        <main style={S.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
