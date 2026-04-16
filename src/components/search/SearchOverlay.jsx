// src/components/search/SearchOverlay.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, FileText, CornerDownLeft, Clock, TrendingUp } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore.jsx';
import { useNavigate } from 'react-router-dom';
import { GUIDES, RECENT_GUIDES, SEARCH_SYNONYMS } from '@/data/mockData.js';

const TYPE_LABELS = { SOP:'절차', DECISION:'판단기준', REFERENCE:'참조', TROUBLE:'트러블슈팅', RESPONSE:'대응', POLICY:'정책' };
const TYPE_CLR   = { SOP:'#1d4ed8', DECISION:'#be123c', REFERENCE:'#15803d', TROUBLE:'#c2410c', RESPONSE:'#7e22ce', POLICY:'#0369a1' };
const TYPE_BG    = { SOP:'#eff6ff', DECISION:'#fef2f2', REFERENCE:'#f0fdf4', TROUBLE:'#fff7ed', RESPONSE:'#fdf4ff', POLICY:'#f0f9ff' };

// Build search index from GUIDES
const SEARCH_INDEX = Object.entries(GUIDES).map(([id, g]) => ({
  id,
  title: g.title,
  module: g.module,
  type: g.type,
  snippet: g.tldr.split('\n')[0],
  views: g.views || 0,
}));

// Popular: top 5 by views
const POPULAR = [...SEARCH_INDEX].sort((a, b) => b.views - a.views).slice(0, 5);

// Recent: first 5 from RECENT_GUIDES
const RECENT_IDS = RECENT_GUIDES.slice(0, 5).map(r => r.id);
const RECENTS = RECENT_IDS.map(id => SEARCH_INDEX.find(g => g.id === id)).filter(Boolean);

const expandQuery = (query) => {
  const expanded = [query.toLowerCase()];
  for (const [term, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (synonyms.some(syn => query.includes(syn))) expanded.push(term.toLowerCase());
  }
  return expanded;
};

function ResultItem({ item, isSelected, onSelect, onHover }) {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 14px',
        borderRadius: '10px', cursor: 'pointer', transition: 'background 80ms ease',
        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
        borderLeft: `3px solid ${isSelected ? '#3b82f6' : 'transparent'}`,
      }}
    >
      <FileText size={15} color={isSelected ? '#2563eb' : '#9ca3af'} style={{ marginTop: '2px', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? '#1d4ed8' : '#111827' }}>{item.title}</span>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '99px', backgroundColor: TYPE_BG[item.type] || '#f3f4f6', color: TYPE_CLR[item.type] || '#666', flexShrink: 0 }}>
            {TYPE_LABELS[item.type] || item.type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '1px 7px', borderRadius: '4px' }}>{item.module}</span>
          <span style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.snippet}</span>
        </div>
      </div>
    </div>
  );
}

export default function SearchOverlay() {
  const { isOpen, close, open } = useSearchStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const expanded = expandQuery(query);
    return SEARCH_INDEX.filter(g =>
      expanded.some(q =>
        g.title.toLowerCase().includes(q) ||
        g.snippet.toLowerCase().includes(q) ||
        g.module.toLowerCase().includes(q) ||
        g.type.toLowerCase().includes(q)
      )
    );
  }, [query]);

  const showEmpty = !query.trim();
  const listItems = showEmpty ? [] : results;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSelectedIndex(0); }, [query]);

  const goTo = (id) => { navigate(`/guides/${id}`); close(); };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => Math.min(p + 1, listItems.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter' && listItems.length > 0) { e.preventDefault(); goTo(listItems[selectedIndex].id); }
    else if (e.key === 'Escape') { close(); }
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k'))
          && !isOpen
          && document.activeElement.tagName !== 'INPUT'
          && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault(); open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, open]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '10vh' }}
      onClick={e => e.target === e.currentTarget && close()}
    >
      <div style={{ width: '100%', maxWidth: '620px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>

        {/* 입력창 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
          <Search size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="가이드 제목, 모듈, 유형으로 검색..."
            style={{ flex: 1, height: '56px', border: 'none', outline: 'none', fontSize: '15px', fontFamily: "'Pretendard', sans-serif", color: '#111827', backgroundColor: 'transparent' }}
          />
          <button onClick={close} style={{ border: '1px solid #e5e7eb', background: '#f9fafb', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#6b7280', flexShrink: 0, fontFamily: "'Pretendard', sans-serif" }}>ESC</button>
        </div>

        {/* 결과창 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {showEmpty ? (
            <>
              {/* 최근 업데이트 */}
              <div style={{ padding: '6px 8px 4px', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={10} /> 최근 업데이트
                </span>
              </div>
              {RECENTS.map((item) => (
                <ResultItem key={item.id} item={item} isSelected={false} onSelect={() => goTo(item.id)} onHover={() => {}} />
              ))}
              <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '8px 4px' }} />
              {/* 인기 가이드 */}
              <div style={{ padding: '6px 8px 4px', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TrendingUp size={10} /> 인기 가이드
                </span>
              </div>
              {POPULAR.map((item) => (
                <ResultItem key={item.id} item={item} isSelected={false} onSelect={() => goTo(item.id)} onHover={() => {}} />
              ))}
            </>
          ) : listItems.length > 0 ? (
            <>
              <div style={{ padding: '6px 8px 4px', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  검색 결과 {listItems.length}건
                </span>
              </div>
              {listItems.map((item, idx) => (
                <ResultItem key={item.id} item={item} isSelected={selectedIndex === idx} onSelect={() => goTo(item.id)} onHover={() => setSelectedIndex(idx)} />
              ))}
            </>
          ) : (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px', fontFamily: "'Pretendard', sans-serif" }}>
              <p style={{ margin: '0 0 8px', fontWeight: 700 }}>"{query}"에 대한 결과가 없습니다</p>
              <p style={{ margin: 0, fontSize: '13px' }}>다른 검색어나 모듈명으로 시도해보세요</p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div style={{ padding: '10px 16px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#9ca3af', fontFamily: "'Pretendard', sans-serif", flexShrink: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><kbd style={{ fontFamily: 'monospace', fontWeight: 700 }}>↑↓</kbd> 이동</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CornerDownLeft size={11} /> 선택</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><kbd style={{ fontFamily: 'monospace', fontWeight: 700 }}>ESC</kbd> 닫기</span>
          <span style={{ marginLeft: 'auto' }}>전체 {SEARCH_INDEX.length}개 가이드</span>
        </div>
      </div>
    </div>
  );
}
