// src/components/common/Sidebar.jsx — AMS 실제 메뉴 구조 + Geist 디자인
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, HelpCircle, Bell, PlusCircle,
  ChevronDown, Clock, LayoutGrid, FileText
} from 'lucide-react';
import { MODULE_TREE, RECENT_GUIDES } from '@/data/mockData';

const G = {
  bg: '#ffffff', bg2: '#fafafa',
  g100: '#f2f2f2', g200: '#ebebeb', g300: '#e2e2e2',
  g400: '#8f8f8f', g600: '#666666', g900: '#1a1a1a', g1000: '#000000',
  border: 'rgba(0,0,0,0.08)',
  b100: '#d3e5ff', b400: '#0070f3', b600: '#0052b2',
  font: "'Pretendard', -apple-system, sans-serif",
};

const ICON_MAP = {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, Layers: Settings,
};

export default function Sidebar() {
  const [expanded, setExpanded] = useState({ operation: true, customer: true });
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const hoverOn  = e => { e.currentTarget.style.backgroundColor = G.g100; };
  const hoverOff = e => { e.currentTarget.style.backgroundColor = 'transparent'; };

  return (
    <aside style={{
      width: '240px', flexShrink: 0,
      height: 'calc(100dvh - 56px)',
      backgroundColor: G.bg,
      borderRight: `1px solid ${G.border}`,
      position: 'sticky', top: '56px',
      display: 'flex', flexDirection: 'column',
      fontFamily: G.font,
      overflow: 'hidden',
    }}>

      {/* ── 상단 고정: 최근 조회 ── */}
      <div style={{ padding: '12px 10px 0', flexShrink: 0 }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: G.g400, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 6px', marginBottom: '4px' }}>최근 조회</p>
        {RECENT_GUIDES.slice(0,3).map(r => (
          <NavLink key={r.id} to={`/guides/${r.id}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px',
              borderRadius: '6px', textDecoration: 'none', marginBottom: '1px',
              backgroundColor: isActive ? G.b100 : 'transparent', transition: 'background 100ms ease',
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.backgroundColor.includes('d3e5ff')) e.currentTarget.style.backgroundColor = G.g100; }}
            onMouseLeave={e => { if (!e.currentTarget.style.backgroundColor.includes('d3e5ff')) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Clock size={11} color={G.g400} style={{ flexShrink:0 }} />
            <span style={{ flex:1, fontSize:'12px', color: G.g900, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:400 }}>{r.title}</span>
            <span style={{ fontSize:'10px', color: G.g400, whiteSpace:'nowrap', flexShrink:0 }}>{r.module.split('/')[0]}</span>
          </NavLink>
        ))}

        <div style={{ height:'1px', backgroundColor: G.border, margin:'10px 2px' }} />

        {/* 대시보드 */}
        <NavLink to="/"
          style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'8px', padding:'7px 8px',
            borderRadius:'6px', textDecoration:'none', fontSize:'13px',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? G.b400 : G.g900,
            backgroundColor: isActive ? G.b100 : 'transparent',
            marginBottom:'2px', transition:'all 100ms ease', fontFamily: G.font,
          })}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}
        >
          <LayoutGrid size={14} style={{ flexShrink:0 }} /> 대시보드
        </NavLink>

        <div style={{ height:'1px', backgroundColor: G.border, margin:'8px 2px 6px' }} />
        <p style={{ fontSize:'10px', fontWeight:700, color: G.g400, textTransform:'uppercase', letterSpacing:'0.08em', padding:'0 6px', marginBottom:'4px', marginTop:'4px' }}>운영 가이드</p>
      </div>

      {/* ── 스크롤 가능한 모듈 트리 ── */}
      <nav style={{ flex:1, overflowY:'auto', padding:'0 10px' }}>
        {MODULE_TREE.map(mod => {
          const isOpen = !!expanded[mod.id];
          const Icon = ICON_MAP[mod.icon] || Settings;
          const hasGuides = mod.guides && mod.guides.length > 0;
          return (
            <div key={mod.id} style={{ marginBottom:'1px' }}>
              <button
                onClick={() => hasGuides && toggle(mod.id)}
                style={{
                  display:'flex', alignItems:'center', gap:'7px', width:'100%',
                  padding:'7px 8px', borderRadius:'6px', border:'none',
                  backgroundColor:'transparent', cursor: hasGuides ? 'pointer' : 'default',
                  textAlign:'left', fontSize:'13px', fontWeight:500,
                  color: G.g900, fontFamily: G.font, transition:'background 100ms ease',
                }}
                onMouseEnter={e => hasGuides && hoverOn(e)}
                onMouseLeave={e => hasGuides && hoverOff(e)}
              >
                <Icon size={13} color={G.g400} style={{ flexShrink:0 }} />
                <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{mod.label}</span>
                {hasGuides && (
                  <ChevronDown size={11} color={G.g400} style={{ transform: isOpen ? 'none' : 'rotate(-90deg)', transition:'transform 180ms ease', flexShrink:0 }} />
                )}
              </button>

              {isOpen && hasGuides && (
                <div style={{ paddingLeft:'20px', marginBottom:'2px' }}>
                  {mod.guides.map(g => (
                    <NavLink key={g.id} to={`/guides/${g.id}`}
                      style={({ isActive }) => ({
                        display:'flex', alignItems:'center', gap:'6px', padding:'5px 8px',
                        borderRadius:'6px', textDecoration:'none', fontSize:'12px',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? G.b400 : G.g600,
                        backgroundColor: isActive ? G.b100 : 'transparent',
                        marginBottom:'1px', transition:'all 100ms ease', fontFamily: G.font,
                      })}
                      onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                    >
                      <FileText size={10} style={{ flexShrink:0, opacity:0.45 }} />
                      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ height:'1px', backgroundColor: G.border, margin:'10px 2px' }} />

        {/* 하단 링크 */}
        {[{ to:'/faq', label:'운영 FAQ', Icon:HelpCircle }, { to:'/updates', label:'업데이트 이력', Icon:Bell }].map(item => (
          <NavLink key={item.to} to={item.to}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'8px', padding:'7px 8px',
              borderRadius:'6px', textDecoration:'none', fontSize:'13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? G.b400 : G.g900,
              backgroundColor: isActive ? G.b100 : 'transparent',
              marginBottom:'1px', transition:'all 100ms ease', fontFamily: G.font,
            })}
            onMouseEnter={hoverOn} onMouseLeave={hoverOff}
          >
            <item.Icon size={13} style={{ flexShrink:0 }} /> {item.label}
          </NavLink>
        ))}
        <div style={{ height:'8px' }} />
      </nav>

      {/* ── 새 가이드 작성 버튼 (하단 고정) ── */}
      <div style={{ padding:'10px', borderTop:`1px solid ${G.border}`, flexShrink:0, backgroundColor: G.bg }}>
        <NavLink to="/editor"
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
            height:'32px', borderRadius:'8px',
            backgroundColor: G.g1000, color:'#ffffff',
            textDecoration:'none', fontSize:'13px', fontWeight:600,
            transition:'background 120ms ease', fontFamily: G.font,
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333333'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = G.g1000}
        >
          <PlusCircle size={13} /> 새 가이드 작성
        </NavLink>
      </div>
    </aside>
  );
}
