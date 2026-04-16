import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Send, Image as ImageIcon, Search, Clock,
  FileText, X, Check, ChevronDown, ChevronRight, Plus, Trash2,
  GripVertical, AlertTriangle, RotateCcw, Eye, EyeOff, Upload,
  User, Calendar, Hash, Layers, Tag, ShieldCheck, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';

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

const TYPE_BADGE_TW = {
  SOP:       { chip:'bg-blue-50 text-blue-700 border-blue-200', dot:'bg-blue-50 text-blue-700 border-blue-200' },
  DECISION:  { chip:'bg-yellow-50 text-yellow-700 border-yellow-200', dot:'bg-yellow-50 text-yellow-700 border-yellow-200' },
  REFERENCE: { chip:'bg-green-50 text-green-700 border-green-200', dot:'bg-green-50 text-green-700 border-green-200' },
  TROUBLE:   { chip:'bg-orange-50 text-orange-700 border-orange-200', dot:'bg-orange-50 text-orange-700 border-orange-200' },
  RESPONSE:  { chip:'bg-purple-50 text-purple-700 border-purple-200', dot:'bg-purple-50 text-purple-700 border-purple-200' },
  POLICY:    { chip:'bg-rose-50 text-rose-700 border-rose-200', dot:'bg-rose-50 text-rose-700 border-rose-200' },
};

// ─── Input base style (Catalyst-exact) ─────────────────────────────────────
// Tailwind equivalent: "w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white outline-none transition-[border-color,box-shadow] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15"
// Kept as reference; inline-style usages have been migrated to Tailwind classes.

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
    <div
      className="fixed z-[9999] bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden animate-[ddFadeIn_0.12s_ease]"
      style={{
        top:    openUpward ? undefined : top,
        bottom: openUpward ? window.innerHeight - top : undefined,
        left:   rect.left,
        width:  rect.width,
        maxHeight: `${maxH}px`,
      }}
    >
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
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {selected.map(g => {
            const tw = TYPE_BADGE_TW[g.type] || TYPE_BADGE_TW.SOP;
            return (
              <span key={g.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[13px] font-semibold ${tw.chip}`}>
                <FileText size={11} />
                {g.title}
                <button
                  onMouseDown={e => { e.preventDefault(); onRemove(g.id); }}
                  className="border-none bg-transparent cursor-pointer pl-0.5 flex items-center opacity-70"
                ><X size={11} /></button>
              </span>
            );
          })}
        </div>
      )}

      {/* Input anchor */}
      <div ref={anchorRef} className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="가이드 제목, 모듈, 유형으로 검색…"
          className="w-full px-3 py-2 pl-[34px] border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white outline-none transition-colors focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15"
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Portal Dropdown — never clipped by parents */}
      <PortalDropdown anchorRef={anchorRef} isOpen={isOpen}>
        <div data-combobox-portal className="overflow-y-auto max-h-[320px]" ref={listRef}>
          {filtered.length > 0 ? (
            <>
              <div className="px-3 pt-2 pb-1.5 border-b border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                  {filtered.length}개 가이드
                </span>
              </div>
              {filtered.map((g, idx) => {
                const isFocused = focusedIdx === idx;
                const tw = TYPE_BADGE_TW[g.type] || TYPE_BADGE_TW.SOP;
                return (
                  <div
                    key={g.id}
                    data-idx={idx}
                    onMouseDown={e => { e.preventDefault(); commit(g); }}
                    onMouseEnter={() => setFocusedIdx(idx)}
                    className={`px-3.5 py-2.5 cursor-pointer border-l-[3px] ${isFocused ? 'bg-zinc-50 border-l-blue-500' : 'bg-transparent border-l-transparent hover:bg-zinc-50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={13} className={isFocused ? 'text-blue-500' : 'text-zinc-400'} />
                      <span className={`flex-1 text-sm font-semibold ${isFocused ? 'text-zinc-900' : 'text-zinc-800'}`}>{g.title}</span>
                      <span className={`text-[11px] font-bold px-[7px] py-0.5 rounded-full border ${tw.chip}`}>{g.type}</span>
                    </div>
                    <p className="mt-0.5 ml-[21px] text-xs text-zinc-400">{g.module}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="py-8 px-4 text-center">
              <Search size={18} className="text-zinc-300 mb-2 mx-auto" />
              <p className="m-0 text-[13px] text-zinc-400">'{query}'에 해당하는 가이드 없음</p>
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
    <div className="rounded-xl overflow-hidden border border-zinc-200">
      <img src={image.url} alt="" className="w-full block max-h-[260px] object-cover" />
      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-50 border-t border-zinc-100">
        <span className="text-xs text-zinc-400">{image.name} · {image.size ? `${(image.size/1024).toFixed(1)} KB` : ''}</span>
        <div className="flex gap-1.5">
          <Button variant="secondary" size="xs" onClick={() => fileRef.current?.click()}>교체</Button>
          <Button variant="danger" size="xs" onClick={onRemove}>삭제</Button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );

  return (
    <>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-[1.5px] border-dashed rounded-xl px-5 py-7 cursor-pointer text-center transition-all duration-150 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 bg-zinc-50'}`}
      >
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-3 shadow-xs ${isDragging ? 'bg-blue-100 border-blue-200' : 'bg-white border-zinc-200'}`}>
          <Upload size={18} className={isDragging ? 'text-blue-600' : 'text-zinc-400'} />
        </div>
        <p className={`m-0 mb-1 text-[13px] font-bold ${isDragging ? 'text-blue-700' : 'text-zinc-700'}`}>이미지 드래그 또는 클릭하여 업로드</p>
        <p className="m-0 text-xs text-zinc-400">PNG · JPG · GIF · 최대 10MB</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </>
  );
}

// ─── Version Drawer ───────────────────────────────────────────────────────
function VersionDrawer({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/25 backdrop-blur-sm z-[400] transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[460px] bg-white z-[401] shadow-xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Clock size={15} className="text-zinc-600" />
            </div>
            <div>
              <h3 className="m-0 text-[15px] font-bold text-zinc-900">버전 이력</h3>
              <p className="m-0 text-xs text-zinc-400">{VERSION_HISTORY.length}개 버전 관리 중</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X size={14} className="text-zinc-500" />
          </Button>
        </div>

        {/* Current version banner */}
        <div className="mx-5 mt-4 mb-2 px-[18px] py-3.5 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-extrabold text-zinc-900 font-mono">{VERSION_HISTORY[0].version}</span>
              <span className="text-xs font-semibold px-2 py-px bg-green-100 text-green-700 rounded-full">현재 배포</span>
            </div>
            <p className="mt-0.5 mb-0 text-xs text-zinc-400">{VERSION_HISTORY[0].date} · {VERSION_HISTORY[0].author}</p>
          </div>
        </div>

        {/* Version list */}
        <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-4 mb-2.5">전체 이력</p>
          {VERSION_HISTORY.map((v, i) => {
            const isCurrent = i === 0;
            const isExp = expanded === v.version;
            return (
              <div key={v.version} className={`border rounded-xl mb-2 overflow-hidden transition-all duration-150 ${isExp ? 'border-blue-200 bg-blue-50' : 'border-zinc-100 bg-white hover:bg-zinc-50'}`}>
                <div onClick={() => setExpanded(isExp ? null : v.version)} className="px-4 py-3 cursor-pointer flex items-center gap-3">
                  <span className="text-sm font-extrabold text-zinc-900 font-mono min-w-[40px]">{v.version}</span>
                  <div className="flex-1">
                    <p className="m-0 text-[13px] text-zinc-700 font-medium">{v.summary}</p>
                    <p className="mt-0.5 mb-0 text-[11px] text-zinc-400">{v.date} · {v.author}</p>
                  </div>
                  {isCurrent && <span className="text-[11px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full shrink-0">현재</span>}
                  <ChevronDown size={13} className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isExp ? 'rotate-180' : ''}`} />
                </div>
                {isExp && (
                  <div className="px-4 pb-3.5 pt-3 border-t border-blue-200 flex gap-2">
                    {!isCurrent && (
                      <Button variant="secondary" size="sm" className="flex-1">
                        <RotateCcw size={12} /> 이 버전으로 복원
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Eye size={12} /> 미리보기
                    </Button>
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
  const bcTw = badgeColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200'
             : badgeColor === 'red'  ? 'bg-red-50 text-red-700 border-red-100'
             : 'bg-zinc-100 text-zinc-600 border-zinc-200';
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl mb-4 shadow-sm overflow-visible">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-6 py-[18px] bg-transparent border-none cursor-pointer text-left hover:bg-zinc-50 ${open ? 'border-b border-zinc-100 rounded-t-2xl' : 'rounded-2xl'}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Icon size={14} className="text-blue-600" />
          </div>
          <span className="text-sm font-bold text-zinc-900">{title}</span>
          {badge && <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${bcTw}`}>{badge}</span>}
        </div>
        <ChevronDown size={14} className={`text-zinc-400 shrink-0 transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="p-6 overflow-visible">{children}</div>}
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div>
      <div className="mb-1.5">
        <span className="text-[13px] font-semibold text-zinc-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {hint && <span className="text-xs text-zinc-400 ml-2">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Step Card ──────────────────────────────────────────────────────────────
function StepCard({ step, index, onUpdate, onRemove }) {
  return (
    <div className="border border-zinc-200 rounded-2xl bg-white mb-3 shadow-xs">
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 border-b border-zinc-100 rounded-t-2xl">
        <GripVertical size={14} className="text-zinc-300 cursor-grab shrink-0" />
        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0">{index + 1}</div>
        <input
          type="text" value={step.title}
          onChange={e => onUpdate({ ...step, title: e.target.value })}
          placeholder={`Step ${index + 1} 제목`}
          className="flex-1 border-none outline-none text-sm font-bold text-zinc-900 bg-transparent font-[inherit]"
        />
        <Button variant="ghost" size="icon" onClick={onRemove} className="w-6 h-6 text-zinc-400 hover:text-red-500">
          <Trash2 size={13} />
        </Button>
      </div>
      <div className="p-4">
        <Textarea
          value={step.desc}
          onChange={e => onUpdate({ ...step, desc: e.target.value })}
          placeholder="이 단계에서 수행할 내용을 구체적으로 작성하세요 (실제 버튼/메뉴 기준)"
          rows={3}
          className="px-3 py-2 min-h-0 resize-y leading-relaxed mb-3"
        />
        <p className="text-xs font-semibold text-zinc-500 mt-0 mb-2">스크린샷</p>
        <ImageUploadSlot image={step.image} onUpload={img => onUpdate({ ...step, image: img })} onRemove={() => onUpdate({ ...step, image: null })} />
      </div>
    </div>
  );
}

// ─── Case Card ──────────────────────────────────────────────────────────────
function CaseCard({ item, index, onUpdate, onRemove }) {
  return (
    <div className="border border-zinc-200 rounded-2xl bg-white mb-2.5 shadow-xs">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100 rounded-t-2xl">
        <GripVertical size={13} className="text-zinc-300 cursor-grab shrink-0" />
        <span className="text-[11px] font-bold text-zinc-400 tracking-wide shrink-0">CASE {index + 1}</span>
        <input type="text" value={item.label} onChange={e => onUpdate({ ...item, label: e.target.value })} placeholder="상황 라벨 (예: 중도 입반 시, 중복결제 발생 시)" className="flex-1 border-none outline-none text-[13px] font-bold text-zinc-900 bg-transparent font-[inherit]" />
        <Button variant="ghost" size="icon" onClick={onRemove} className="w-6 h-6 text-zinc-400 hover:text-red-500"><Trash2 size={13} /></Button>
      </div>
      <div className="px-4 py-3.5 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-zinc-500 m-0 mb-1.5">처리 방법</p>
          <Textarea value={item.action} onChange={e => onUpdate({ ...item, action: e.target.value })} placeholder="처리 절차" rows={3} className="px-3 py-2.5 min-h-0 leading-relaxed" />
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 m-0 mb-1.5">참고사항 <span className="text-zinc-300 font-normal">선택</span></p>
          <Textarea value={item.note} onChange={e => onUpdate({ ...item, note: e.target.value })} placeholder="예외 케이스, 주의사항" rows={3} className="px-3 py-2.5 min-h-0 leading-relaxed" />
        </div>
      </div>
    </div>
  );
}

// ─── Icon Button (wraps shadcn/ui Button) ──────────────────────────────────
function Btn({ children, onClick, variant = 'default', icon: Icon, active }) {
  const variantMap = { default: 'secondary', primary: 'primary', ghost: 'ghost' };
  return (
    <Button
      variant={variantMap[variant] || 'secondary'}
      size="sm"
      onClick={onClick}
      className={active ? 'bg-zinc-100 text-zinc-900' : ''}
    >
      {Icon && <Icon size={13} />}{children}
    </Button>
  );
}

// ─── 검수 요청 모달 ──────────────────────────────────────────────────────────
function ReviewModal({ isOpen, onClose, onConfirm }) {
  const [reviewer, setReviewer] = useState('');
  const [note, setNote] = useState('');
  const REVIEWERS = ['이지원 (콘텐츠팀)', '박수진 (운영팀)', '김도현 (플랫폼서비스실)'];
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[480px] p-0 gap-0 rounded-[20px]">
        <div className="px-7 pt-6 pb-0">
          <DialogHeader className="flex-row items-center gap-2.5 mb-5 space-y-0">
            <div className="w-9 h-9 rounded-[10px] bg-yellow-100 flex items-center justify-center shrink-0">
              <Send size={16} className="text-yellow-700" />
            </div>
            <div>
              <DialogTitle className="text-[15px] font-extrabold text-zinc-900">검수 요청</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0">리뷰어를 지정하고 요청 메모를 남겨주세요</DialogDescription>
            </div>
          </DialogHeader>
          <div className="mb-4">
            <label className="text-xs font-bold text-zinc-600 block mb-1.5">리뷰어 선택 *</label>
            <div className="relative">
              <select value={reviewer} onChange={e=>setReviewer(e.target.value)} className="w-full py-2.5 pl-3 pr-8 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white appearance-none outline-none font-[inherit] cursor-pointer focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15">
                <option value=''>리뷰어를 선택하세요</option>
                {REVIEWERS.map(r=><option key={r}>{r}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-xs font-bold text-zinc-600 block mb-1.5">요청 메모 (선택)</label>
            <Textarea value={note} onChange={e=>setNote(e.target.value)} placeholder='리뷰어에게 전달할 내용을 입력하세요' rows={3} className="px-3 py-2.5 text-[13px] min-h-0 font-[inherit] leading-relaxed" />
          </div>
        </div>
        <DialogFooter className="px-7 pt-4 pb-6 border-t border-zinc-100 flex-row justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onClose}>취소</Button>
          <Button variant="primary" size="md" onClick={() => { if(reviewer) { onConfirm(reviewer, note); } }} disabled={!reviewer}>검수 요청 보내기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 발행 확인 모달 ──────────────────────────────────────────────────────────
function PublishModal({ isOpen, title, version, onClose, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[460px] p-7 gap-0 rounded-[20px]">
        <DialogHeader className="space-y-0 mb-0">
          <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center mb-4">
            <Check size={22} className="text-green-600" />
          </div>
          <DialogTitle className="text-[17px] font-extrabold text-zinc-900 mb-2">가이드를 발행할까요?</DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 leading-relaxed mb-5">
            <strong className="text-zinc-800">"{title || '제목 없음'}"</strong> ({version})이 배포완료 상태로 전환되며, 모든 운영자에게 즉시 노출됩니다.
          </DialogDescription>
        </DialogHeader>
        <label className="flex items-center gap-2.5 px-4 py-3 bg-zinc-50 rounded-[10px] border border-zinc-200 cursor-pointer mb-5">
          <div onClick={()=>setConfirmed(p=>!p)} className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150 ${confirmed ? 'border-green-600 bg-green-600' : 'border-zinc-300 bg-white'}`}>
            {confirmed && <Check size={11} color='#fff' strokeWidth={3} />}
          </div>
          <span className="text-[13px] text-zinc-700 font-medium">내용을 최종 검토했으며 발행에 동의합니다.</span>
        </label>
        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onClose}>취소</Button>
          <Button variant="primary" size="md" onClick={() => confirmed && onConfirm()} disabled={!confirmed}>발행하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 발행 완료 토스트 ─────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return createPortal(
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white px-[22px] py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] animate-[toastIn_0.2s_ease] whitespace-nowrap">
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      <Check size={16} className="text-green-400" /> {message}
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
    <div className="min-h-screen bg-zinc-50 font-[-apple-system,BlinkMacSystemFont,'Inter','Segoe_UI',sans-serif]">

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-[100] h-14 bg-white/90 border-b border-zinc-100 backdrop-blur-[16px] flex items-center justify-between px-7">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Btn icon={ArrowLeft} onClick={() => navigate(-1)}>가이드 목록</Btn>
          <div className="w-px h-5 bg-zinc-200" />
          <span className="text-sm font-semibold text-zinc-900 max-w-[320px] overflow-hidden text-ellipsis whitespace-nowrap">
            {form.title || '새 가이드 작성'}
          </span>
          {form.status && (
            <span className={`text-[11px] font-bold py-0.5 px-2.5 rounded-full ${
              form.status==='배포완료' ? 'bg-green-100 text-green-700' : form.status==='검수중' ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-600'
            }`}>{form.status}</span>
          )}
        </div>
        {/* Right */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-400 mr-1.5">
            {isSaving ? '저장 중…' : lastSaved ? `${lastSaved} 자동 저장` : ''}
          </span>
          <Btn icon={Save} onClick={save}>임시 저장</Btn>
          <Btn icon={Clock} onClick={() => setVersionDrawer(true)}>버전 이력</Btn>
          <Btn icon={showPreview ? EyeOff : Eye} onClick={() => setShowPreview(p=>!p)} active={showPreview}>{showPreview ? '편집 전용' : '미리보기'}</Btn>
          <div className="w-px h-5 bg-zinc-200" />
          <Btn icon={Send} onClick={() => setShowReview(true)}>검수 요청</Btn>
          <Btn variant="primary" onClick={() => setShowPublish(true)}>발행하기</Btn>
        </div>
      </header>

      {/* ── 검수요청 모달 ── */}
      <ReviewModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        onConfirm={(reviewer) => {
          set('status', '검수중');
          setShowReview(false);
          setToast(`${reviewer}에게 검수 요청을 보냈습니다.`);
        }}
      />

      {/* ── 발행 모달 ── */}
      <PublishModal
        isOpen={showPublish}
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

      {/* ── 토스트 ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex max-w-[1440px] mx-auto gap-5 px-7 pt-7 pb-[100px]">

        {/* ── Editor Panel ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* ① 기본 정보 */}
          <Section icon={Hash} title="기본 정보" badge="필수">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="모듈" required>
                <div className="relative">
                  <select value={form.module} onChange={e=>set('module',e.target.value)} className="w-full px-3 py-2.5 pr-8 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white outline-none transition-[border-color,box-shadow] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 appearance-none cursor-pointer">
                    <option value="">선택</option>
                    {MODULES.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                </div>
              </Field>
              <Field label="가이드 유형" required>
                <div className="flex gap-1.5 flex-wrap">
                  {GUIDE_TYPES.map(t => {
                    const active = form.guideType === t;
                    const tw = TYPE_BADGE_TW[t] || TYPE_BADGE_TW.SOP;
                    return (
                      <Button key={t} variant="outline" size="xs" onClick={() => set('guideType', t)} className={`rounded-full ${active ? tw.chip : ''}`}>{t}</Button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-4 mb-4">
              <Field label="가이드 그룹" required>
                <Input type="text" value={form.guideGroup} onChange={e=>set('guideGroup',e.target.value)} placeholder="예: 환불 가이드" className="px-3 py-2.5" />
              </Field>
              <Field label="가이드명" required>
                <Input type="text" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="예: 환불 승인 기준 판단 가이드" className="px-3 py-2.5 text-[15px] font-semibold" />
              </Field>
            </div>

            <div className="mb-4">
              <Field label="메뉴 경로" required hint="실제 AMS 화면 경로, > 구분">
                <div className="relative">
                  <Layers size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                  <Input type="text" value={form.menuPath} onChange={e=>set('menuPath',e.target.value)} placeholder="AMS 어드민 > 고객 관리 > 회원 상세 정보" className="px-3 py-2.5 pl-[30px] text-[13px] font-mono" />
                </div>
                {form.menuPath && (
                  <div className="mt-1.5 py-[7px] px-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center gap-1.5 flex-wrap">
                    {form.menuPath.split('>').map((p,i,arr)=>(
                      <span key={i} className="flex items-center gap-[5px]">
                        <span className={`text-xs ${i===arr.length-1 ? 'font-bold text-zinc-900' : 'font-normal text-zinc-400'}`}>{p.trim()}</span>
                        {i!==arr.length-1 && <ChevronRight size={10} className="text-zinc-300" />}
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="사용 대상" required>
                <div className="flex gap-2">
                  {['운영자','실장','관리자'].map(t => {
                    const on = form.targets.includes(t);
                    return (
                      <label key={t} onClick={() => toggleTarget(t)} className={`flex items-center gap-[7px] py-[7px] px-3.5 border rounded-lg cursor-pointer transition-all duration-100 select-none ${on ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 bg-white'}`}>
                        <div className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 ${on ? 'border-blue-500 bg-blue-500' : 'border-zinc-300 bg-white'}`}>
                          {on && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <span className={`text-[13px] font-semibold ${on ? 'text-blue-700' : 'text-zinc-700'}`}>{t}</span>
                      </label>
                    );
                  })}
                </div>
              </Field>
              <Field label="태그" hint="Enter 또는 , 로 추가">
                <div className="border border-zinc-200 rounded-lg py-[7px] px-2.5 flex flex-wrap gap-[5px] items-center bg-white min-h-[38px]">
                  {form.tags.map((tag,i)=>(
                    <span key={i} className="inline-flex items-center gap-1 py-0.5 px-2 bg-zinc-100 rounded-full text-xs text-zinc-700 font-semibold">
                      <Tag size={9} />{tag}
                      <button onMouseDown={e=>{e.preventDefault(); set('tags', form.tags.filter((_,idx)=>idx!==i));}} className="border-none bg-transparent cursor-pointer p-0 text-zinc-400 flex"><X size={10} /></button>
                    </span>
                  ))}
                  <input type="text" value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={handleTag} placeholder={form.tags.length===0?'예: 환불, 결제':''} className="border-none outline-none text-[13px] text-zinc-900 min-w-[80px] flex-1 bg-transparent font-[inherit]" />
                </div>
              </Field>
            </div>
          </Section>

          {/* ② 본문 작성 */}
          <Section icon={FileText} title="본문 작성" badge="필수">

            {/* TL;DR */}
            <div className="mb-7">
              <Field label="핵심 요약 (TL;DR)" required hint="2~3줄, 30초 내 읽기">
                <Textarea value={form.summary} onChange={e=>set('summary',e.target.value)} placeholder="이 가이드의 핵심 내용을 요약하세요. CS 응대 중 30초 내에 읽을 수 있어야 합니다." rows={3} maxLength={300} className="px-3 py-2.5 min-h-0 resize-y leading-[1.7]" />
                <div className="text-right text-[11px] text-zinc-400 mt-1">{form.summary.length}/300</div>
              </Field>
            </div>

            {/* Steps */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <Field label="사용 방법 (Steps)" required><span /></Field>
                <Btn icon={Plus} onClick={addStep}>스텝 추가</Btn>
              </div>
              {form.steps.map((s,i) => <StepCard key={i} step={s} index={i} onUpdate={v=>updStep(i,v)} onRemove={()=>delStep(i)} />)}
            </div>

            {/* Cases */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-1.5">
                <Field label="운영 케이스" required><span /></Field>
                <Btn icon={Plus} onClick={addCase}>케이스 추가</Btn>
              </div>
              <p className="m-0 mb-3 text-xs text-zinc-400">상황 라벨은 구체적 키워드로: '중도 입반 시', '중복결제 발생 시'</p>
              {form.cases.map((c,i) => <CaseCard key={i} item={c} index={i} onUpdate={v=>updCase(i,v)} onRemove={()=>delCase(i)} />)}
            </div>

            {/* Cautions */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <Field label="유의사항" required><span /></Field>
                <Btn icon={Plus} onClick={addCaut}>항목 추가</Btn>
              </div>
              <Alert variant="warning" className="rounded-xl p-0 overflow-hidden">
                <div className="py-2.5 px-3.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                  <AlertTriangle size={13} className="text-amber-600" />
                  <AlertTitle className="text-xs font-bold text-amber-900 mb-0">실수 방지를 위한 주의사항만 작성하세요</AlertTitle>
                </div>
                {form.cautions.map((c,i)=>(
                  <div key={i} className={`flex items-center gap-2.5 py-2.5 px-3.5 ${i<form.cautions.length-1 ? 'border-b border-zinc-100' : ''}`}>
                    <div className="w-[5px] h-[5px] rounded-full bg-amber-600 shrink-0" />
                    <input type="text" value={c} onChange={e=>updCaut(i,e.target.value)} placeholder="유의사항을 입력하세요" className="flex-1 border-none outline-none text-[13px] text-zinc-900 font-[inherit]" />
                    <Button variant="ghost" size="icon" onClick={()=>delCaut(i)} className="w-6 h-6 text-zinc-300 hover:text-red-500"><Trash2 size={12} /></Button>
                  </div>
                ))}
              </Alert>
            </div>

            {/* Related Guides — overflow:visible 보장 */}
            <div className="overflow-visible">
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
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="작성자">
                <div className="relative">
                  <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                  <Input type="text" value={form.author} readOnly className="px-3 py-2.5 pl-[30px] bg-zinc-50 text-zinc-400 cursor-not-allowed" />
                </div>
              </Field>
              <Field label="버전" required>
                <Input type="text" value={form.version} onChange={e=>set('version',e.target.value)} className="px-3 py-2.5" />
              </Field>
              <Field label="상태" required>
                <div className="relative">
                  <select value={form.status} onChange={e=>set('status',e.target.value)} className="w-full px-3 py-2.5 pr-8 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white outline-none transition-[border-color,box-shadow] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 appearance-none cursor-pointer">
                    {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                </div>
              </Field>
            </div>
            <Field label="업데이트 구분" hint="선택">
              <div className="flex gap-1.5">
                {['신규','수정','정책 변경'].map(t => {
                  const active = form.updateType===t;
                  return <Button key={t} variant="outline" size="xs" onClick={()=>set('updateType', active?'':t)} className={`rounded-full ${active ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>{t}</Button>;
                })}
              </div>
            </Field>
          </Section>
        </div>

        {/* ── Preview Panel ──────────────────────────────────────────────── */}
        {showPreview && (
          <div className="w-[480px] shrink-0 sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto">
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-md">
              <div className="py-3 px-5 border-b border-zinc-100 flex items-center gap-2">
                <Eye size={13} className="text-blue-500" />
                <span className="text-xs font-bold text-zinc-500">실시간 미리보기</span>
                <span className="text-[11px] text-zinc-300 ml-auto">GuidePage 기준</span>
              </div>
              <div className="py-7 px-6">
                {/* Meta */}
                <div className="flex gap-1.5 mb-4">
                  {form.module    && <span className="text-[11px] font-bold py-[3px] px-2.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">{form.module}</span>}
                  {form.guideType && (() => { const tw = TYPE_BADGE_TW[form.guideType] || TYPE_BADGE_TW.SOP; return <span className={`text-[11px] font-bold py-[3px] px-2.5 rounded-full border ${tw.chip}`}>{form.guideType}</span>; })()}
                </div>
                <h1 className="text-[26px] font-extrabold text-zinc-900 m-0 mb-2 tracking-tight leading-[1.2]">{form.title||'가이드 제목'}</h1>
                <p className="text-xs text-zinc-400 m-0 mb-5">{form.author} · {form.version}</p>
                {form.summary && (
                  <div className="py-4 px-5 bg-white rounded-xl border border-zinc-200 mb-5 relative overflow-hidden shadow-xs">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />
                    <div className="flex gap-3 pl-1">
                      <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-px" />
                      <p className="m-0 text-[13px] leading-[1.7] text-zinc-700 font-medium">{form.summary}</p>
                    </div>
                  </div>
                )}
                {form.menuPath && (
                  <div className="py-2 px-3 bg-zinc-50 rounded-lg border border-zinc-100 mb-5 flex items-center gap-[5px] flex-wrap">
                    {form.menuPath.split('>').map((p,i,arr)=>(
                      <span key={i} className="flex items-center gap-[5px]">
                        <span className={`text-xs font-mono ${i===arr.length-1 ? 'font-bold text-zinc-900' : 'font-normal text-zinc-400'}`}>{p.trim()}</span>
                        {i!==arr.length-1 && <ChevronRight size={9} className="text-zinc-300" />}
                      </span>
                    ))}
                  </div>
                )}
                {/* Steps preview */}
                {form.steps.filter(s=>s.title).length > 0 && (
                  <div className="relative pl-3.5 mb-5">
                    <div className="absolute top-2 bottom-2 left-[23px] w-[1.5px] bg-zinc-100" />
                    {form.steps.filter(s=>s.title).map((s,i)=>(
                      <div key={i} className="flex gap-4 mb-5 relative">
                        <div className="w-[18px] h-[18px] rounded-full bg-white border-[1.5px] border-blue-500 text-blue-500 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 z-[1] shadow-[0_0_0_3px_#fff]">{i+1}</div>
                        <div className="flex-1">
                          <h4 className="m-0 mb-1 text-[13px] font-bold text-zinc-900">{s.title}</h4>
                          {s.desc && <p className="m-0 text-xs text-zinc-500 leading-relaxed">{s.desc}</p>}
                          {s.image && <img src={s.image.url} alt="" className="mt-2 w-full rounded-lg border border-zinc-200" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Related guides preview */}
                {form.relatedGuides.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.07em] m-0 mb-2">관련 가이드</p>
                    {form.relatedGuides.map(g => {
                      const tw = TYPE_BADGE_TW[g.type] || TYPE_BADGE_TW.SOP;
                      return (
                        <div key={g.id} className="flex items-center gap-2 py-2 px-3 border border-zinc-100 rounded-lg mb-1.5 bg-zinc-50">
                          <FileText size={12} className="text-zinc-400" />
                          <span className="flex-1 text-xs font-semibold text-zinc-800">{g.title}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-px rounded-full border ${tw.chip}`}>{g.type}</span>
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
