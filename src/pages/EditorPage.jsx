import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Send, Image as ImageIcon, Search, Clock,
  FileText, X, Check, ChevronDown, ChevronRight, Plus, Trash2,
  GripVertical, AlertTriangle, RotateCcw, Eye, EyeOff, Upload,
  User, Calendar, Hash, Layers, Tag, ShieldCheck, MessageCircle
} from 'lucide-react';

// ─── Mock Data ─────────────────────────────────────────────────────────────
const GUIDES_LIST = [
  { id: 'member-merge',    title: 'AMS 회원 병합 가이드',          module: '고객(원생) 관리',       type: 'SOP'      },
  { id: 'refund-policy',   title: '환불 승인 기준 판단 가이드',     module: '청구/수납/결제/환불',    type: 'DECISION' },
  { id: 'ams-glossary',    title: 'AMS 주요 용어 사전',             module: '공통/시스템',            type: 'REFERENCE'},
  { id: 'qr-trouble',      title: 'QR 출석 인식 실패 트러블슈팅',   module: '수업운영 관리',          type: 'TROUBLE'  },
  { id: 'response-manual', title: '상황별 대응 매뉴얼 (CS)',         module: '전략/운영',              type: 'RESPONSE' },
  { id: 'policy-2026',     title: '2026 수강료 정책 변경 공지',      module: '전략/운영',              type: 'POLICY'   },
  { id: 'billing-calc',    title: '수강료 일할 계산 처리 가이드',    module: '청구/수납/결제/환불',    type: 'SOP'      },
  { id: 'enrollment-sop',  title: '중도 입반 처리 SOP',              module: '입반/퇴반 관리',         type: 'SOP'      },
];
const MODULES = ['고객(원생) 관리','상품 관리','강좌 관리','수업운영 관리','입반/퇴반 관리','청구/수납/결제/환불','메시지 관리','공통/시스템','전략/운영'];
const GUIDE_TYPES = ['SOP','DECISION','REFERENCE','TROUBLE','RESPONSE','POLICY'];
const STATUS_OPTIONS = ['작성중','검수중','배포완료'];
const VERSION_HISTORY = [
  { version:'v1.2', date:'2026-04-14', author:'김명준', summary:'환불 기준 문구 보완, 스크린샷 업데이트' },
  { version:'v1.1', date:'2026-04-02', author:'이지원', summary:'운영 케이스 2개 추가' },
  { version:'v1.0', date:'2026-03-25', author:'김명준', summary:'최초 발행' },
  { version:'v0.2', date:'2026-03-18', author:'김명준', summary:'검수 반영 수정' },
  { version:'v0.1', date:'2026-03-10', author:'김명준', summary:'초안 작성' },
];

// ─── Geist / Catalyst Design Tokens ────────────────────────────────────────
const C = {
  // Geist-style neutral scale
  gray50:  '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e4e4e7',
  gray300: '#d4d4d8',
  gray400: '#a1a1aa',
  gray500: '#71717a',
  gray600: '#52525b',
  gray700: '#3f3f46',
  gray800: '#27272a',
  gray900: '#18181b',
  gray950: '#09090b',
  // Blue accent (Geist blue)
  blue50:  '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  // Semantic
  green50:  '#f0fdf4',
  green100: '#dcfce7',
  green600: '#16a34a',
  green700: '#15803d',
  amber50:  '#fffbeb',
  amber100: '#fef3c7',
  amber600: '#d97706',
  amber900: '#78350f',
  red50:    '#fef2f2',
  red100:   '#fee2e2',
  red500:   '#ef4444',
  red700:   '#b91c1c',
};

// Catalyst-exact shadows
const SHADOW = {
  xs:  '0 1px 2px 0 rgba(0,0,0,0.05)',
  sm:  '0 0 0 1px rgba(9,9,11,0.07), 0 2px 2px 0 rgba(9,9,11,0.05)',
  md:  '0 0 0 1px rgba(9,9,11,0.07), 0 4px 8px -2px rgba(9,9,11,0.08)',
  lg:  '0 0 0 1px rgba(9,9,11,0.07), 0 8px 24px -4px rgba(9,9,11,0.12)',
  xl:  '0 0 0 1px rgba(9,9,11,0.07), 0 24px 48px -8px rgba(9,9,11,0.18)',
  // Dropdown specific — sharp & elevated
  dropdown: '0 0 0 1px rgba(9,9,11,0.08), 0 8px 32px -4px rgba(9,9,11,0.16), 0 2px 8px 0 rgba(9,9,11,0.06)',
};

const R = { sm:'6px', md:'8px', lg:'12px', xl:'16px', '2xl':'20px', full:'9999px' };

const TYPE_BADGE = {
  SOP:       { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  DECISION:  { bg:'#fefce8', color:'#a16207', border:'#fde68a' },
  REFERENCE: { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  TROUBLE:   { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  RESPONSE:  { bg:'#faf5ff', color:'#7c3aed', border:'#e9d5ff' },
  POLICY:    { bg:'#fff1f2', color:'#be123c', border:'#fecdd3' },
};

// ─── Input base style (Catalyst-exact) ─────────────────────────────────────
const inputBase = {
  width: '100%', padding: '9px 12px',
  border: `1px solid ${C.gray200}`,
  borderRadius: R.md,
  fontSize: '14px', lineHeight: '1.5', color: C.gray900,
  backgroundColor: '#ffffff', outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'inherit', boxSizing: 'border-box',
};
const onFocus = e => {
  e.target.style.borderColor = C.blue500;
  e.target.style.boxShadow   = `0 0 0 3px rgba(59,130,246,0.15)`;
};
const onBlur  = e => {
  e.target.style.borderColor = C.gray200;
  e.target.style.boxShadow   = 'none';
};

// ─── Portal Dropdown ─────────────────────────────────────────────────────────
// Renders children into document.body so overflow:hidden parents can't clip it
function PortalDropdown({ anchorRef, isOpen, children }) {
  const [rect, setRect] = useState(null);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const update = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (r) setRect(r);
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, anchorRef]);

  if (!isOpen || !rect) return null;

  // Decide: open below or above
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const maxH = 320;
  const openUpward = spaceBelow < maxH + 8 && spaceAbove > spaceBelow;
  const top = openUpward ? rect.top - 8 : rect.bottom + 4;

  return createPortal(
    <div style={{
      position:   'fixed',
      top:        openUpward ? undefined : top,
      bottom:     openUpward ? window.innerHeight - top : undefined,
      left:       rect.left,
      width:      rect.width,
      zIndex:     9999,
      backgroundColor: '#ffffff',
      border:     `1px solid ${C.gray200}`,
      borderRadius: R.lg,
      boxShadow:  SHADOW.dropdown,
      overflow:   'hidden',
      maxHeight:  `${maxH}px`,
      animation:  'ddFadeIn 0.12s ease',
    }}>
      <style>{`
        @keyframes ddFadeIn {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
      {children}
    </div>,
    document.body
  );
}

// ─── Related Guide Combobox ───────────────────────────────────────────────
function RelatedGuideCombobox({ selected, onSelect, onRemove }) {
  const [query,      setQuery]      = useState('');
  const [isOpen,     setIsOpen]     = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const anchorRef = useRef(null);  // anchor = input wrapper div
  const inputRef  = useRef(null);
  const listRef   = useRef(null);

  const filtered = GUIDES_LIST.filter(g =>
    !selected.find(s => s.id === g.id) &&
    (g.title.includes(query) || g.module.includes(query) || g.type.includes(query))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusedIdx(0);
  }, [query]);

  // Auto-scroll focused item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${focusedIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [focusedIdx]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (anchorRef.current?.contains(e.target)) return;
      // Also allow clicks inside the portal dropdown
      const portal = document.querySelector('[data-combobox-portal]');
      if (portal?.contains(e.target)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const commit = (guide) => {
    onSelect(guide);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { setIsOpen(true); return; }
    if (!isOpen) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setFocusedIdx(p => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); setFocusedIdx(p => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter')      { e.preventDefault(); if (filtered[focusedIdx]) commit(filtered[focusedIdx]); }
    else if (e.key === 'Escape')     { setIsOpen(false); }
  };

  return (
    <div>
      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'10px' }}>
          {selected.map(g => {
            const tc = TYPE_BADGE[g.type] || TYPE_BADGE.SOP;
            return (
              <span key={g.id} style={{
                display:'inline-flex', alignItems:'center', gap:'6px',
                padding:'4px 10px', borderRadius: R.full,
                backgroundColor: tc.bg, border:`1px solid ${tc.border}`,
                fontSize:'13px', fontWeight:600, color: tc.color,
              }}>
                <FileText size={11} />
                {g.title}
                <button
                  onMouseDown={e => { e.preventDefault(); onRemove(g.id); }}
                  style={{ border:'none', background:'none', cursor:'pointer', padding:'0 0 0 2px', display:'flex', alignItems:'center', color: tc.color, opacity:0.7 }}
                ><X size={11} /></button>
              </span>
            );
          })}
        </div>
      )}

      {/* Input anchor */}
      <div ref={anchorRef} style={{ position:'relative' }}>
        <Search size={14} color={C.gray400} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="가이드 제목, 모듈, 유형으로 검색…"
          style={{ ...inputBase, paddingLeft:'34px' }}
          onFocus={e => { setIsOpen(true); onFocus(e); }}
          onBlur={onBlur}
          autoComplete="off"
        />
        <ChevronDown size={14} color={C.gray400} style={{ position:'absolute', right:'10px', top:'50%', transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)', transition:'transform 0.15s', pointerEvents:'none' }} />
      </div>

      {/* Portal Dropdown — never clipped by parents */}
      <PortalDropdown anchorRef={anchorRef} isOpen={isOpen}>
        <div data-combobox-portal style={{ overflowY:'auto', maxHeight:'320px' }} ref={listRef}>
          {filtered.length > 0 ? (
            <>
              <div style={{ padding:'8px 12px 6px', borderBottom:`1px solid ${C.gray100}` }}>
                <span style={{ fontSize:'11px', fontWeight:700, color:C.gray400, textTransform:'uppercase', letterSpacing:'0.07em' }}>
                  {filtered.length}개 가이드
                </span>
              </div>
              {filtered.map((g, idx) => {
                const isFocused = focusedIdx === idx;
                const tc = TYPE_BADGE[g.type] || TYPE_BADGE.SOP;
                return (
                  <div
                    key={g.id}
                    data-idx={idx}
                    onMouseDown={e => { e.preventDefault(); commit(g); }}
                    onMouseEnter={() => setFocusedIdx(idx)}
                    style={{
                      padding:'10px 14px', cursor:'pointer',
                      backgroundColor: isFocused ? C.gray50 : 'transparent',
                      borderLeft: `3px solid ${isFocused ? C.blue500 : 'transparent'}`,
                    }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <FileText size={13} color={isFocused ? C.blue500 : C.gray400} />
                      <span style={{ flex:1, fontSize:'14px', fontWeight:600, color: isFocused ? C.gray900 : C.gray800 }}>{g.title}</span>
                      <span style={{ fontSize:'11px', fontWeight:700, padding:'2px 7px', borderRadius: R.full, backgroundColor: tc.bg, color: tc.color, border:`1px solid ${tc.border}` }}>{g.type}</span>
                    </div>
                    <p style={{ margin:'3px 0 0 21px', fontSize:'12px', color:C.gray400 }}>{g.module}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <div style={{ padding:'32px 16px', textAlign:'center' }}>
              <Search size={18} color={C.gray300} style={{ marginBottom:'8px' }} />
              <p style={{ margin:0, fontSize:'13px', color:C.gray400 }}>'{query}'에 해당하는 가이드 없음</p>
            </div>
          )}
        </div>
      </PortalDropdown>
    </div>
  );
}

// ─── Image Upload Slot ────────────────────────────────────────────────────
function ImageUploadSlot({ image, onUpload, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = useCallback(e => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      onUpload({ url: URL.createObjectURL(file), name: file.name, size: file.size });
    }
  }, [onUpload]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) onUpload({ url: URL.createObjectURL(file), name: file.name, size: file.size });
    e.target.value = '';
  };

  if (image) return (
    <div style={{ borderRadius: R.lg, overflow:'hidden', border:`1px solid ${C.gray200}` }}>
      <img src={image.url} alt="" style={{ width:'100%', display:'block', maxHeight:'260px', objectFit:'cover' }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px', backgroundColor: C.gray50, borderTop:`1px solid ${C.gray100}` }}>
        <span style={{ fontSize:'12px', color: C.gray400 }}>{image.name} · {image.size ? `${(image.size/1024).toFixed(1)} KB` : ''}</span>
        <div style={{ display:'flex', gap:'6px' }}>
          <button onClick={() => fileRef.current?.click()} style={{ fontSize:'12px', fontWeight:600, padding:'4px 10px', border:`1px solid ${C.gray200}`, borderRadius: R.md, backgroundColor:'#fff', cursor:'pointer', color: C.gray600 }}>교체</button>
          <button onClick={onRemove} style={{ fontSize:'12px', fontWeight:600, padding:'4px 10px', border:`1px solid ${C.red100}`, borderRadius: R.md, backgroundColor: C.red50, cursor:'pointer', color: C.red700 }}>삭제</button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
    </div>
  );

  return (
    <>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `1.5px dashed ${isDragging ? C.blue500 : C.gray200}`,
          borderRadius: R.lg, padding:'28px 20px',
          backgroundColor: isDragging ? C.blue50 : C.gray50,
          cursor:'pointer', textAlign:'center', transition:'all 0.15s',
        }}
      >
        <div style={{ width:'40px', height:'40px', borderRadius: R.lg, backgroundColor: isDragging ? C.blue100 : '#fff', border:`1px solid ${isDragging ? C.blue200 : C.gray200}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', boxShadow: SHADOW.xs }}>
          <Upload size={18} color={isDragging ? C.blue600 : C.gray400} />
        </div>
        <p style={{ margin:'0 0 4px', fontSize:'13px', fontWeight:700, color: isDragging ? C.blue700 : C.gray700 }}>이미지 드래그 또는 클릭하여 업로드</p>
        <p style={{ margin:0, fontSize:'12px', color: C.gray400 }}>PNG · JPG · GIF · 최대 10MB</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
    </>
  );
}

// ─── Version Drawer ───────────────────────────────────────────────────────
function VersionDrawer({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.25)', backdropFilter:'blur(2px)', zIndex:400, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition:'opacity 0.2s' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'460px', backgroundColor:'#fff', zIndex:401, boxShadow:'-1px 0 0 0 ' + C.gray100 + ', -20px 0 60px rgba(0,0,0,0.1)', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.28s cubic-bezier(0.4,0,0.2,1)', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.gray100}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius: R.md, backgroundColor: C.gray100, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Clock size={15} color={C.gray600} />
            </div>
            <div>
              <h3 style={{ margin:0, fontSize:'15px', fontWeight:700, color: C.gray900 }}>버전 이력</h3>
              <p style={{ margin:0, fontSize:'12px', color: C.gray400 }}>{VERSION_HISTORY.length}개 버전 관리 중</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:'32px', height:'32px', border:`1px solid ${C.gray200}`, borderRadius: R.md, backgroundColor:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.1s' }} onMouseEnter={e=>e.currentTarget.style.backgroundColor=C.gray50} onMouseLeave={e=>e.currentTarget.style.backgroundColor='#fff'}>
            <X size={14} color={C.gray500} />
          </button>
        </div>

        {/* Current version banner */}
        <div style={{ margin:'16px 20px 8px', padding:'14px 18px', backgroundColor: C.green50, borderRadius: R.lg, border:`1px solid ${C.green100}`, display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#22c55e', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
              <span style={{ fontSize:'15px', fontWeight:800, color: C.gray900, fontFamily:'monospace' }}>{VERSION_HISTORY[0].version}</span>
              <span style={{ fontSize:'12px', fontWeight:600, padding:'1px 8px', backgroundColor: C.green100, color: C.green700, borderRadius: R.full }}>현재 배포</span>
            </div>
            <p style={{ margin:'2px 0 0', fontSize:'12px', color: C.gray400 }}>{VERSION_HISTORY[0].date} · {VERSION_HISTORY[0].author}</p>
          </div>
        </div>

        {/* Version list */}
        <div style={{ flex:1, overflowY:'auto', padding:'4px 20px 24px' }}>
          <p style={{ fontSize:'11px', fontWeight:700, color: C.gray400, textTransform:'uppercase', letterSpacing:'0.08em', margin:'16px 0 10px' }}>전체 이력</p>
          {VERSION_HISTORY.map((v, i) => {
            const isCurrent = i === 0;
            const isExp = expanded === v.version;
            return (
              <div key={v.version} style={{ border:`1px solid ${isExp ? C.blue200 : C.gray100}`, borderRadius: R.lg, marginBottom:'8px', overflow:'hidden', backgroundColor: isExp ? C.blue50 : '#fff', transition:'all 0.15s' }}>
                <div onClick={() => setExpanded(isExp ? null : v.version)} style={{ padding:'12px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px' }} onMouseEnter={e=>{if(!isExp)e.currentTarget.parentElement.style.backgroundColor=C.gray50}} onMouseLeave={e=>{if(!isExp)e.currentTarget.parentElement.style.backgroundColor='#fff'}}>
                  <span style={{ fontSize:'14px', fontWeight:800, color: C.gray900, fontFamily:'monospace', minWidth:'40px' }}>{v.version}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:'13px', color: C.gray700, fontWeight:500 }}>{v.summary}</p>
                    <p style={{ margin:'2px 0 0', fontSize:'11px', color: C.gray400 }}>{v.date} · {v.author}</p>
                  </div>
                  {isCurrent && <span style={{ fontSize:'11px', fontWeight:700, padding:'2px 8px', backgroundColor: C.green100, color: C.green700, borderRadius: R.full, flexShrink:0 }}>현재</span>}
                  <ChevronDown size={13} color={C.gray400} style={{ flexShrink:0, transform: isExp ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
                </div>
                {isExp && (
                  <div style={{ padding:'0 16px 14px', borderTop:`1px solid ${C.blue200}`, display:'flex', gap:'8px', paddingTop:'12px' }}>
                    {!isCurrent && (
                      <button style={{ flex:1, padding:'8px', border:`1px solid ${C.gray200}`, borderRadius: R.md, backgroundColor:'#fff', fontSize:'12px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', color: C.gray600 }}>
                        <RotateCcw size={12} /> 이 버전으로 복원
                      </button>
                    )}
                    <button style={{ flex:1, padding:'8px', border:`1px solid ${C.gray200}`, borderRadius: R.md, backgroundColor:'#fff', fontSize:'12px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', color: C.gray600 }}>
                      <Eye size={12} /> 미리보기
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Section Block ─────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function Section({ icon: Icon, title, badge, badgeColor = 'blue', children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const bc = badgeColor === 'blue' ? { bg: C.blue50, color: C.blue700, border: C.blue200 }
           : badgeColor === 'red'  ? { bg: C.red50,  color: C.red700,  border: C.red100  }
           : { bg: C.gray100, color: C.gray600, border: C.gray200 };
  return (
    <div style={{ backgroundColor:'#fff', border:`1px solid ${C.gray200}`, borderRadius: R.xl, marginBottom:'16px', boxShadow: SHADOW.sm, overflow:'visible' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', background:'none', border:'none', cursor:'pointer', borderBottom: open ? `1px solid ${C.gray100}` : 'none', borderRadius: open ? `${R.xl} ${R.xl} 0 0` : R.xl, textAlign:'left' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = C.gray50}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'30px', height:'30px', borderRadius: R.md, backgroundColor: C.blue50, border:`1px solid ${C.blue100}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon size={14} color={C.blue600} />
          </div>
          <span style={{ fontSize:'14px', fontWeight:700, color: C.gray900 }}>{title}</span>
          {badge && <span style={{ fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius: R.full, backgroundColor: bc.bg, color: bc.color, border:`1px solid ${bc.border}` }}>{badge}</span>}
        </div>
        <ChevronDown size={14} color={C.gray400} style={{ transform: open ? 'none' : 'rotate(-90deg)', transition:'transform 0.2s', flexShrink:0 }} />
      </button>
      {open && <div style={{ padding:'24px', overflow:'visible' }}>{children}</div>}
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div>
      <div style={{ marginBottom:'6px' }}>
        <span style={{ fontSize:'13px', fontWeight:600, color: C.gray700 }}>
          {label}{required && <span style={{ color: C.red500, marginLeft:'2px' }}>*</span>}
        </span>
        {hint && <span style={{ fontSize:'12px', color: C.gray400, marginLeft:'8px' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Step Card ──────────────────────────────────────────────────────────────
function StepCard({ step, index, onUpdate, onRemove }) {
  return (
    <div style={{ border:`1px solid ${C.gray200}`, borderRadius: R.xl, backgroundColor:'#fff', marginBottom:'12px', boxShadow: SHADOW.xs }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', backgroundColor: C.gray50, borderBottom:`1px solid ${C.gray100}`, borderRadius:`${R.xl} ${R.xl} 0 0` }}>
        <GripVertical size={14} color={C.gray300} style={{ cursor:'grab', flexShrink:0 }} />
        <div style={{ width:'24px', height:'24px', borderRadius:'50%', backgroundColor: C.blue500, color:'#fff', fontSize:'12px', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{index + 1}</div>
        <input
          type="text" value={step.title}
          onChange={e => onUpdate({ ...step, title: e.target.value })}
          placeholder={`Step ${index + 1} 제목`}
          style={{ flex:1, border:'none', outline:'none', fontSize:'14px', fontWeight:700, color: C.gray900, backgroundColor:'transparent', fontFamily:'inherit' }}
        />
        <button onClick={onRemove} style={{ border:'none', background:'none', cursor:'pointer', padding:'4px', color: C.gray400, display:'flex', alignItems:'center' }} onMouseEnter={e=>e.currentTarget.style.color=C.red500} onMouseLeave={e=>e.currentTarget.style.color=C.gray400}>
          <Trash2 size={13} />
        </button>
      </div>
      <div style={{ padding:'16px' }}>
        <textarea
          value={step.desc}
          onChange={e => onUpdate({ ...step, desc: e.target.value })}
          placeholder="이 단계에서 수행할 내용을 구체적으로 작성하세요 (실제 버튼/메뉴 기준)"
          rows={3}
          style={{ ...inputBase, resize:'vertical', lineHeight:1.6, marginBottom:'12px' }}
          onFocus={onFocus} onBlur={onBlur}
        />
        <p style={{ fontSize:'12px', fontWeight:600, color: C.gray500, margin:'0 0 8px' }}>스크린샷</p>
        <ImageUploadSlot image={step.image} onUpload={img => onUpdate({ ...step, image: img })} onRemove={() => onUpdate({ ...step, image: null })} />
      </div>
    </div>
  );
}

// ─── Case Card ──────────────────────────────────────────────────────────────
function CaseCard({ item, index, onUpdate, onRemove }) {
  return (
    <div style={{ border:`1px solid ${C.gray200}`, borderRadius: R.xl, backgroundColor:'#fff', marginBottom:'10px', boxShadow: SHADOW.xs }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', backgroundColor: C.gray50, borderBottom:`1px solid ${C.gray100}`, borderRadius:`${R.xl} ${R.xl} 0 0` }}>
        <GripVertical size={13} color={C.gray300} style={{ cursor:'grab', flexShrink:0 }} />
        <span style={{ fontSize:'11px', fontWeight:700, color: C.gray400, letterSpacing:'0.06em', flexShrink:0 }}>CASE {index + 1}</span>
        <input type="text" value={item.label} onChange={e => onUpdate({ ...item, label: e.target.value })} placeholder="상황 라벨 (예: 중도 입반 시, 중복결제 발생 시)" style={{ flex:1, border:'none', outline:'none', fontSize:'13px', fontWeight:700, color: C.gray900, backgroundColor:'transparent', fontFamily:'inherit' }} />
        <button onClick={onRemove} style={{ border:'none', background:'none', cursor:'pointer', color: C.gray400, display:'flex', alignItems:'center' }} onMouseEnter={e=>e.currentTarget.style.color=C.red500} onMouseLeave={e=>e.currentTarget.style.color=C.gray400}><Trash2 size={13} /></button>
      </div>
      <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <div>
          <p style={{ fontSize:'12px', fontWeight:600, color: C.gray500, margin:'0 0 6px' }}>처리 방법</p>
          <textarea value={item.action} onChange={e => onUpdate({ ...item, action: e.target.value })} placeholder="처리 절차" rows={3} style={{ ...inputBase, resize:'none', lineHeight:1.6 }} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div>
          <p style={{ fontSize:'12px', fontWeight:600, color: C.gray500, margin:'0 0 6px' }}>참고사항 <span style={{ color: C.gray300, fontWeight:400 }}>선택</span></p>
          <textarea value={item.note} onChange={e => onUpdate({ ...item, note: e.target.value })} placeholder="예외 케이스, 주의사항" rows={3} style={{ ...inputBase, resize:'none', lineHeight:1.6 }} onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>
    </div>
  );
}

// ─── Icon Button ────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'default', icon: Icon, active }) {
  const styles = {
    default: { padding:'7px 14px', border:`1px solid ${C.gray200}`, borderRadius: R.md, backgroundColor: active ? C.gray100 : '#fff', color: active ? C.gray900 : C.gray700, fontWeight:600, fontSize:'13px' },
    primary: { padding:'7px 16px', border:'none', borderRadius: R.md, backgroundColor: C.gray900, color:'#fff', fontWeight:700, fontSize:'13px' },
    ghost:   { padding:'7px 14px', border:'none', borderRadius: R.md, backgroundColor:'transparent', color: C.gray600, fontWeight:600, fontSize:'13px' },
  };
  const s = styles[variant] || styles.default;
  return (
    <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:'6px', cursor:'pointer', transition:'all 0.1s', ...s }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {Icon && <Icon size={13} />}{children}
    </button>
  );
}

// ─── 검수 요청 모달 ──────────────────────────────────────────────────────────
function ReviewModal({ onClose, onConfirm }) {
  const [reviewer, setReviewer] = useState('');
  const [note, setNote] = useState('');
  const REVIEWERS = ['이지원 (콘텐츠팀)', '박수진 (운영팀)', '김도현 (플랫폼서비스실)'];
  return createPortal(
    <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:'480px', backgroundColor:'#fff', borderRadius:'20px', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', overflow:'hidden', animation:'modalIn 0.18s ease' }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px)}to{opacity:1;transform:none}}`}</style>
        <div style={{ padding:'24px 28px 0' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', backgroundColor:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Send size={16} color='#a16207' />
              </div>
              <div>
                <h3 style={{ margin:0, fontSize:'15px', fontWeight:800, color: C.gray900 }}>검수 요청</h3>
                <p style={{ margin:0, fontSize:'12px', color: C.gray400 }}>리뷰어를 지정하고 요청 메모를 남겨주세요</p>
              </div>
            </div>
            <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', padding:'4px', color: C.gray400 }}><X size={18} /></button>
          </div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'12px', fontWeight:700, color: C.gray600, display:'block', marginBottom:'6px' }}>리뷰어 선택 *</label>
            <div style={{ position:'relative' }}>
              <select value={reviewer} onChange={e=>setReviewer(e.target.value)} style={{ width:'100%', padding:'9px 32px 9px 12px', border:`1px solid ${C.gray200}`, borderRadius:'8px', fontSize:'14px', color: C.gray900, backgroundColor:'#fff', appearance:'none', outline:'none', fontFamily:'inherit', cursor:'pointer' }}>
                <option value=''>리뷰어를 선택하세요</option>
                {REVIEWERS.map(r=><option key={r}>{r}</option>)}
              </select>
              <ChevronDown size={13} color={C.gray400} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            </div>
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ fontSize:'12px', fontWeight:700, color: C.gray600, display:'block', marginBottom:'6px' }}>요청 메모 (선택)</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder='리뷰어에게 전달할 내용을 입력하세요' rows={3} style={{ width:'100%', padding:'10px 12px', border:`1px solid ${C.gray200}`, borderRadius:'8px', fontSize:'13px', resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.6, boxSizing:'border-box' }} />
          </div>
        </div>
        <div style={{ padding:'16px 28px 24px', display:'flex', gap:'8px', justifyContent:'flex-end', borderTop:`1px solid ${C.gray100}` }}>
          <button onClick={onClose} style={{ padding:'9px 18px', border:`1px solid ${C.gray200}`, borderRadius:'8px', backgroundColor:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', color: C.gray700 }}>취소</button>
          <button onClick={() => { if(reviewer) { onConfirm(reviewer, note); } }} disabled={!reviewer} style={{ padding:'9px 20px', border:'none', borderRadius:'8px', backgroundColor: reviewer ? C.gray900 : C.gray300, color:'#fff', fontSize:'13px', fontWeight:700, cursor: reviewer ? 'pointer':'not-allowed', transition:'background 0.15s' }}>검수 요청 보내기</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── 발행 확인 모달 ──────────────────────────────────────────────────────────
function PublishModal({ title, version, onClose, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  return createPortal(
    <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:'460px', backgroundColor:'#fff', borderRadius:'20px', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', overflow:'hidden', animation:'modalIn 0.18s ease' }}>
        <div style={{ padding:'28px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'12px', backgroundColor:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
            <Check size={22} color='#16a34a' />
          </div>
          <h3 style={{ margin:'0 0 8px', fontSize:'17px', fontWeight:800, color: C.gray900 }}>가이드를 발행할까요?</h3>
          <p style={{ margin:'0 0 20px', fontSize:'14px', color: C.gray500, lineHeight:1.6 }}>
            <strong style={{ color: C.gray800 }}>"{title || '제목 없음'}"</strong> ({version})이 배포완료 상태로 전환되며, 모든 운영자에게 즉시 노출됩니다.
          </p>
          <label style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', backgroundColor: C.gray50, borderRadius:'10px', border:`1px solid ${C.gray200}`, cursor:'pointer', marginBottom:'20px' }}>
            <div onClick={()=>setConfirmed(p=>!p)} style={{ width:'18px', height:'18px', borderRadius:'5px', border:`1.5px solid ${confirmed ? '#16a34a' : C.gray300}`, backgroundColor: confirmed ? '#16a34a' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}>
              {confirmed && <Check size={11} color='#fff' strokeWidth={3} />}
            </div>
            <span style={{ fontSize:'13px', color: C.gray700, fontWeight:500 }}>내용을 최종 검토했으며 발행에 동의합니다.</span>
          </label>
          <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{ padding:'9px 18px', border:`1px solid ${C.gray200}`, borderRadius:'8px', backgroundColor:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', color: C.gray700 }}>취소</button>
            <button onClick={() => confirmed && onConfirm()} disabled={!confirmed} style={{ padding:'9px 22px', border:'none', borderRadius:'8px', backgroundColor: confirmed ? '#111827' : C.gray300, color:'#fff', fontSize:'13px', fontWeight:700, cursor: confirmed ? 'pointer':'not-allowed', transition:'background 0.15s' }}>발행하기</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── 발행 완료 토스트 ─────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return createPortal(
    <div style={{ position:'fixed', bottom:'32px', left:'50%', transform:'translateX(-50%)', zIndex:9999, backgroundColor:'#111827', color:'#fff', padding:'12px 22px', borderRadius:'12px', fontSize:'14px', fontWeight:600, display:'flex', alignItems:'center', gap:'10px', boxShadow:'0 8px 32px rgba(0,0,0,0.2)', animation:'toastIn 0.2s ease', whiteSpace:'nowrap' }}>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      <Check size={16} color='#4ade80' /> {message}
    </div>,
    document.body
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export default function EditorPage() {
  const navigate = useNavigate();
  const [versionDrawer,  setVersionDrawer]  = useState(false);
  const [showPreview,    setShowPreview]    = useState(false);
  const [lastSaved,      setLastSaved]      = useState(null);
  const [isSaving,       setIsSaving]       = useState(false);
  const [tagInput,       setTagInput]       = useState('');
  const [showReview,     setShowReview]     = useState(false);   // 검수요청 모달
  const [showPublish,    setShowPublish]    = useState(false);   // 발행 모달
  const [toast,          setToast]          = useState(null);    // 토스트 메시지

  const [form, setForm] = useState({
    module:'', guideType:'SOP', guideGroup:'', title:'', menuPath:'',
    targets:[], tags:[],
    summary:'',
    steps:  [{ title:'', desc:'', image:null }],
    cases:  [{ label:'', action:'', note:'' }],
    cautions: [''],
    relatedGuides: [],
    author:'김명준', version:'v1.0', status:'작성중', updateType:'',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setLastSaved(new Date().toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit' })); }, 600);
  }, []);

  // Ctrl+S 저장
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  // Auto-save simulation (3s debounce)
  useEffect(() => {
    if (!form.title) return;
    const t = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date().toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit' }));
      }, 500);
    }, 3000);
    return () => clearTimeout(t);
  }, [form]);

  // Steps
  const addStep   = () => set('steps', [...form.steps, { title:'', desc:'', image:null }]);
  const updStep   = (i, v) => { const s=[...form.steps]; s[i]=v; set('steps', s); };
  const delStep   = i => set('steps', form.steps.filter((_,idx)=>idx!==i));
  // Cases
  const addCase   = () => set('cases', [...form.cases, { label:'', action:'', note:'' }]);
  const updCase   = (i, v) => { const c=[...form.cases]; c[i]=v; set('cases', c); };
  const delCase   = i => set('cases', form.cases.filter((_,idx)=>idx!==i));
  // Cautions
  const addCaut   = () => set('cautions', [...form.cautions, '']);
  const updCaut   = (i, v) => { const c=[...form.cautions]; c[i]=v; set('cautions', c); };
  const delCaut   = i => set('cautions', form.cautions.filter((_,idx)=>idx!==i));
  // Tags
  const handleTag = e => {
    if ((e.key==='Enter'||e.key===',') && tagInput.trim()) {
      e.preventDefault();
      set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const toggleTarget = t => set('targets', form.targets.includes(t) ? form.targets.filter(x=>x!==t) : [...form.targets, t]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', backgroundColor: C.gray50, fontFamily:'-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif' }}>

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header style={{ position:'sticky', top:0, zIndex:100, height:'56px', backgroundColor:'rgba(255,255,255,0.9)', borderBottom:`1px solid ${C.gray100}`, backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px' }}>
        {/* Left */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <Btn icon={ArrowLeft} onClick={() => navigate(-1)}>가이드 목록</Btn>
          <div style={{ width:'1px', height:'20px', backgroundColor: C.gray200 }} />
          <span style={{ fontSize:'14px', fontWeight:600, color: C.gray900, maxWidth:'320px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {form.title || '새 가이드 작성'}
          </span>
          {form.status && (
            <span style={{
              fontSize:'11px', fontWeight:700, padding:'2px 9px', borderRadius: R.full,
              backgroundColor: form.status==='배포완료' ? C.green100 : form.status==='검수중' ? C.amber100 : C.gray100,
              color: form.status==='배포완료' ? C.green700 : form.status==='검수중' ? C.amber600 : C.gray600,
            }}>{form.status}</span>
          )}
        </div>
        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ fontSize:'12px', color: C.gray400, marginRight:'6px' }}>
            {isSaving ? '저장 중…' : lastSaved ? `${lastSaved} 자동 저장` : ''}
          </span>
          <Btn icon={Save} onClick={save}>임시 저장</Btn>
          <Btn icon={Clock} onClick={() => setVersionDrawer(true)}>버전 이력</Btn>
          <Btn icon={showPreview ? EyeOff : Eye} onClick={() => setShowPreview(p=>!p)} active={showPreview}>{showPreview ? '편집 전용' : '미리보기'}</Btn>
          <div style={{ width:'1px', height:'20px', backgroundColor: C.gray200 }} />
          <Btn icon={Send} onClick={() => setShowReview(true)}>검수 요청</Btn>
          <Btn variant="primary" onClick={() => setShowPublish(true)}>발행하기</Btn>
        </div>
      </header>

      {/* ── 검수요청 모달 ── */}
      {showReview && (
        <ReviewModal
          onClose={() => setShowReview(false)}
          onConfirm={(reviewer) => {
            set('status', '검수중');
            setShowReview(false);
            setToast(`${reviewer}에게 검수 요청을 보냈습니다.`);
          }}
        />
      )}

      {/* ── 발행 모달 ── */}
      {showPublish && (
        <PublishModal
          title={form.title}
          version={form.version}
          onClose={() => setShowPublish(false)}
          onConfirm={() => {
            set('status', '배포완료');
            setShowPublish(false);
            setToast('가이드가 성공적으로 발행되었습니다!');
            save();
          }}
        />
      )}

      {/* ── 토스트 ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ display:'flex', maxWidth:'1440px', margin:'0 auto', gap:'20px', padding:'28px 28px 100px' }}>

        {/* ── Editor Panel ──────────────────────────────────────────────── */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* ① 기본 정보 */}
          <Section icon={Hash} title="기본 정보" badge="필수">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
              <Field label="모듈" required>
                <div style={{ position:'relative' }}>
                  <select value={form.module} onChange={e=>set('module',e.target.value)} style={{ ...inputBase, appearance:'none', paddingRight:'32px', cursor:'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                    <option value="">선택</option>
                    {MODULES.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={13} color={C.gray400} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                </div>
              </Field>
              <Field label="가이드 유형" required>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {GUIDE_TYPES.map(t => {
                    const active = form.guideType === t;
                    const tc = TYPE_BADGE[t];
                    return (
                      <button key={t} onClick={() => set('guideType', t)} style={{ padding:'5px 12px', borderRadius: R.full, fontSize:'12px', fontWeight:700, cursor:'pointer', border:`1px solid ${active ? tc.border : C.gray200}`, backgroundColor: active ? tc.bg : '#fff', color: active ? tc.color : C.gray600, transition:'all 0.1s' }}>{t}</button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'16px', marginBottom:'16px' }}>
              <Field label="가이드 그룹" required>
                <input type="text" value={form.guideGroup} onChange={e=>set('guideGroup',e.target.value)} placeholder="예: 환불 가이드" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </Field>
              <Field label="가이드명" required>
                <input type="text" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="예: 환불 승인 기준 판단 가이드" style={{ ...inputBase, fontSize:'15px', fontWeight:600 }} onFocus={onFocus} onBlur={onBlur} />
              </Field>
            </div>

            <div style={{ marginBottom:'16px' }}>
              <Field label="메뉴 경로" required hint="실제 AMS 화면 경로, > 구분">
                <div style={{ position:'relative' }}>
                  <Layers size={13} color={C.gray400} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input type="text" value={form.menuPath} onChange={e=>set('menuPath',e.target.value)} placeholder="AMS 어드민 > 고객 관리 > 회원 상세 정보" style={{ ...inputBase, paddingLeft:'30px', fontFamily:'monospace', fontSize:'13px' }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                {form.menuPath && (
                  <div style={{ marginTop:'6px', padding:'7px 12px', backgroundColor: C.gray50, border:`1px solid ${C.gray100}`, borderRadius: R.md, display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                    {form.menuPath.split('>').map((p,i,arr)=>(
                      <span key={i} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <span style={{ fontSize:'12px', fontWeight: i===arr.length-1 ? 700 : 400, color: i===arr.length-1 ? C.gray900 : C.gray400 }}>{p.trim()}</span>
                        {i!==arr.length-1 && <ChevronRight size={10} color={C.gray300} />}
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <Field label="사용 대상" required>
                <div style={{ display:'flex', gap:'8px' }}>
                  {['운영자','실장','관리자'].map(t => {
                    const on = form.targets.includes(t);
                    return (
                      <label key={t} onClick={() => toggleTarget(t)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'7px 14px', border:`1px solid ${on ? C.blue500 : C.gray200}`, borderRadius: R.md, backgroundColor: on ? C.blue50 : '#fff', cursor:'pointer', transition:'all 0.1s', userSelect:'none' }}>
                        <div style={{ width:'16px', height:'16px', borderRadius:'4px', border:`1.5px solid ${on ? C.blue500 : C.gray300}`, backgroundColor: on ? C.blue500 : '#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {on && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize:'13px', fontWeight:600, color: on ? C.blue700 : C.gray700 }}>{t}</span>
                      </label>
                    );
                  })}
                </div>
              </Field>
              <Field label="태그" hint="Enter 또는 , 로 추가">
                <div style={{ border:`1px solid ${C.gray200}`, borderRadius: R.md, padding:'7px 10px', display:'flex', flexWrap:'wrap', gap:'5px', alignItems:'center', backgroundColor:'#fff', minHeight:'38px' }}>
                  {form.tags.map((tag,i)=>(
                    <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'2px 8px', backgroundColor: C.gray100, borderRadius: R.full, fontSize:'12px', color: C.gray700, fontWeight:600 }}>
                      <Tag size={9} />{tag}
                      <button onMouseDown={e=>{e.preventDefault(); set('tags', form.tags.filter((_,idx)=>idx!==i));}} style={{ border:'none', background:'none', cursor:'pointer', padding:0, color: C.gray400, display:'flex' }}><X size={10} /></button>
                    </span>
                  ))}
                  <input type="text" value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={handleTag} placeholder={form.tags.length===0?'예: 환불, 결제':''} style={{ border:'none', outline:'none', fontSize:'13px', color: C.gray900, minWidth:'80px', flex:1, backgroundColor:'transparent', fontFamily:'inherit' }} />
                </div>
              </Field>
            </div>
          </Section>

          {/* ② 본문 작성 */}
          <Section icon={FileText} title="본문 작성" badge="필수">

            {/* TL;DR */}
            <div style={{ marginBottom:'28px' }}>
              <Field label="핵심 요약 (TL;DR)" required hint="2~3줄, 30초 내 읽기">
                <textarea value={form.summary} onChange={e=>set('summary',e.target.value)} placeholder="이 가이드의 핵심 내용을 요약하세요. CS 응대 중 30초 내에 읽을 수 있어야 합니다." rows={3} maxLength={300} style={{ ...inputBase, resize:'vertical', lineHeight:1.7 }} onFocus={onFocus} onBlur={onBlur} />
                <div style={{ textAlign:'right', fontSize:'11px', color: C.gray400, marginTop:'4px' }}>{form.summary.length}/300</div>
              </Field>
            </div>

            {/* Steps */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <Field label="사용 방법 (Steps)" required><span /></Field>
                <Btn icon={Plus} onClick={addStep}>스텝 추가</Btn>
              </div>
              {form.steps.map((s,i) => <StepCard key={i} step={s} index={i} onUpdate={v=>updStep(i,v)} onRemove={()=>delStep(i)} />)}
            </div>

            {/* Cases */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                <Field label="운영 케이스" required><span /></Field>
                <Btn icon={Plus} onClick={addCase}>케이스 추가</Btn>
              </div>
              <p style={{ margin:'0 0 12px', fontSize:'12px', color: C.gray400 }}>상황 라벨은 구체적 키워드로: '중도 입반 시', '중복결제 발생 시'</p>
              {form.cases.map((c,i) => <CaseCard key={i} item={c} index={i} onUpdate={v=>updCase(i,v)} onRemove={()=>delCase(i)} />)}
            </div>

            {/* Cautions */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <Field label="유의사항" required><span /></Field>
                <Btn icon={Plus} onClick={addCaut}>항목 추가</Btn>
              </div>
              <div style={{ border:`1px solid ${C.amber100}`, borderRadius: R.lg, overflow:'hidden' }}>
                <div style={{ padding:'10px 14px', backgroundColor: C.amber50, borderBottom:`1px solid ${C.amber100}`, display:'flex', alignItems:'center', gap:'8px' }}>
                  <AlertTriangle size={13} color={C.amber600} />
                  <span style={{ fontSize:'12px', fontWeight:700, color: C.amber900 }}>실수 방지를 위한 주의사항만 작성하세요</span>
                </div>
                {form.cautions.map((c,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderBottom: i<form.cautions.length-1 ? `1px solid ${C.gray100}` : 'none' }}>
                    <div style={{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor: C.amber600, flexShrink:0 }} />
                    <input type="text" value={c} onChange={e=>updCaut(i,e.target.value)} placeholder="유의사항을 입력하세요" style={{ flex:1, border:'none', outline:'none', fontSize:'13px', color: C.gray900, fontFamily:'inherit' }} />
                    <button onClick={()=>delCaut(i)} style={{ border:'none', background:'none', cursor:'pointer', color: C.gray300, display:'flex' }} onMouseEnter={e=>e.currentTarget.style.color=C.red500} onMouseLeave={e=>e.currentTarget.style.color=C.gray300}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Guides — overflow:visible 보장 */}
            <div style={{ overflow:'visible' }}>
              <Field label="관련 가이드" hint="선택 · 최대 5개">
                <RelatedGuideCombobox
                  selected={form.relatedGuides}
                  onSelect={g => set('relatedGuides', [...form.relatedGuides, g])}
                  onRemove={id => set('relatedGuides', form.relatedGuides.filter(g=>g.id!==id))}
                />
              </Field>
            </div>
          </Section>

          {/* ③ 발행 정보 */}
          <Section icon={Send} title="발행 정보" defaultOpen={false}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'16px' }}>
              <Field label="작성자">
                <div style={{ position:'relative' }}>
                  <User size={13} color={C.gray400} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input type="text" value={form.author} readOnly style={{ ...inputBase, paddingLeft:'30px', backgroundColor: C.gray50, color: C.gray400, cursor:'not-allowed' }} />
                </div>
              </Field>
              <Field label="버전" required>
                <input type="text" value={form.version} onChange={e=>set('version',e.target.value)} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </Field>
              <Field label="상태" required>
                <div style={{ position:'relative' }}>
                  <select value={form.status} onChange={e=>set('status',e.target.value)} style={{ ...inputBase, appearance:'none', paddingRight:'32px', cursor:'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                    {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={13} color={C.gray400} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                </div>
              </Field>
            </div>
            <Field label="업데이트 구분" hint="선택">
              <div style={{ display:'flex', gap:'6px' }}>
                {['신규','수정','정책 변경'].map(t => {
                  const active = form.updateType===t;
                  return <button key={t} onClick={()=>set('updateType', active?'':t)} style={{ padding:'6px 14px', borderRadius: R.full, fontSize:'12px', fontWeight:700, cursor:'pointer', border:`1px solid ${active ? C.blue500 : C.gray200}`, backgroundColor: active ? C.blue50 : '#fff', color: active ? C.blue700 : C.gray600, transition:'all 0.1s' }}>{t}</button>;
                })}
              </div>
            </Field>
          </Section>
        </div>

        {/* ── Preview Panel ──────────────────────────────────────────────── */}
        {showPreview && (
          <div style={{ width:'480px', flexShrink:0, position:'sticky', top:'72px', maxHeight:'calc(100vh - 88px)', overflowY:'auto' }}>
            <div style={{ backgroundColor:'#fff', border:`1px solid ${C.gray200}`, borderRadius: R.xl, overflow:'hidden', boxShadow: SHADOW.md }}>
              <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.gray100}`, display:'flex', alignItems:'center', gap:'8px' }}>
                <Eye size={13} color={C.blue500} />
                <span style={{ fontSize:'12px', fontWeight:700, color: C.gray500 }}>실시간 미리보기</span>
                <span style={{ fontSize:'11px', color: C.gray300, marginLeft:'auto' }}>GuidePage 기준</span>
              </div>
              <div style={{ padding:'28px 24px' }}>
                {/* Meta */}
                <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
                  {form.module    && <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 9px', backgroundColor: C.blue50, color: C.blue700, borderRadius: R.full, border:`1px solid ${C.blue200}` }}>{form.module}</span>}
                  {form.guideType && <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 9px', ...(() => { const tc=TYPE_BADGE[form.guideType]; return { backgroundColor:tc.bg, color:tc.color, border:`1px solid ${tc.border}` }; })(), borderRadius: R.full }}>{form.guideType}</span>}
                </div>
                <h1 style={{ fontSize:'26px', fontWeight:800, color: C.gray900, margin:'0 0 8px', letterSpacing:'-0.03em', lineHeight:1.2 }}>{form.title||'가이드 제목'}</h1>
                <p style={{ fontSize:'12px', color: C.gray400, margin:'0 0 20px' }}>{form.author} · {form.version}</p>
                {form.summary && (
                  <div style={{ padding:'16px 20px', backgroundColor:'#fff', borderRadius: R.lg, border:`1px solid ${C.gray200}`, marginBottom:'20px', position:'relative', overflow:'hidden', boxShadow: SHADOW.xs }}>
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'3px', backgroundColor: C.blue500 }} />
                    <div style={{ display:'flex', gap:'12px', paddingLeft:'4px' }}>
                      <ShieldCheck size={18} color={C.blue500} style={{ flexShrink:0, marginTop:'1px' }} />
                      <p style={{ margin:0, fontSize:'13px', lineHeight:1.7, color: C.gray700, fontWeight:500 }}>{form.summary}</p>
                    </div>
                  </div>
                )}
                {form.menuPath && (
                  <div style={{ padding:'8px 12px', backgroundColor: C.gray50, borderRadius: R.md, border:`1px solid ${C.gray100}`, marginBottom:'20px', display:'flex', alignItems:'center', gap:'5px', flexWrap:'wrap' }}>
                    {form.menuPath.split('>').map((p,i,arr)=>(
                      <span key={i} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <span style={{ fontSize:'12px', fontFamily:'monospace', fontWeight: i===arr.length-1?700:400, color: i===arr.length-1?C.gray900:C.gray400 }}>{p.trim()}</span>
                        {i!==arr.length-1 && <ChevronRight size={9} color={C.gray300} />}
                      </span>
                    ))}
                  </div>
                )}
                {/* Steps preview */}
                {form.steps.filter(s=>s.title).length > 0 && (
                  <div style={{ position:'relative', paddingLeft:'14px', marginBottom:'20px' }}>
                    <div style={{ position:'absolute', top:'8px', bottom:'8px', left:'23px', width:'1.5px', backgroundColor: C.gray100 }} />
                    {form.steps.filter(s=>s.title).map((s,i)=>(
                      <div key={i} style={{ display:'flex', gap:'16px', marginBottom:'20px', position:'relative' }}>
                        <div style={{ width:'18px', height:'18px', borderRadius:'50%', backgroundColor:'#fff', border:`1.5px solid ${C.blue500}`, color: C.blue500, fontSize:'11px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px', zIndex:1, boxShadow:`0 0 0 3px #fff` }}>{i+1}</div>
                        <div style={{ flex:1 }}>
                          <h4 style={{ margin:'0 0 4px', fontSize:'13px', fontWeight:700, color: C.gray900 }}>{s.title}</h4>
                          {s.desc && <p style={{ margin:0, fontSize:'12px', color: C.gray500, lineHeight:1.6 }}>{s.desc}</p>}
                          {s.image && <img src={s.image.url} alt="" style={{ marginTop:'8px', width:'100%', borderRadius: R.md, border:`1px solid ${C.gray200}` }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Related guides preview */}
                {form.relatedGuides.length > 0 && (
                  <div>
                    <p style={{ fontSize:'11px', fontWeight:700, color: C.gray400, textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 8px' }}>관련 가이드</p>
                    {form.relatedGuides.map(g => {
                      const tc = TYPE_BADGE[g.type];
                      return (
                        <div key={g.id} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', border:`1px solid ${C.gray100}`, borderRadius: R.md, marginBottom:'6px', backgroundColor: C.gray50 }}>
                          <FileText size={12} color={C.gray400} />
                          <span style={{ flex:1, fontSize:'12px', fontWeight:600, color: C.gray800 }}>{g.title}</span>
                          <span style={{ fontSize:'10px', fontWeight:700, padding:'1px 6px', borderRadius: R.full, backgroundColor: tc.bg, color: tc.color, border:`1px solid ${tc.border}` }}>{g.type}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version Drawer */}
      <VersionDrawer isOpen={versionDrawer} onClose={() => setVersionDrawer(false)} />
    </div>
  );
}
