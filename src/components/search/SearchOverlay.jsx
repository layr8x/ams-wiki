// src/components/search/SearchOverlay.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, FileText, CornerDownLeft } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore.jsx';
import { useNavigate } from 'react-router-dom';
import { SEARCH_SYNONYMS } from '@/data/mockData.js';

const GUIDES_LIST = [
  { id: 'member-merge', title: 'AMS 회원 병합 가이드', module: '고객 관리', snippet: '중복 계정 통합 절차 및 유의사항' },
  { id: 'billing-decision', title: '환불 승인 기준 판단 가이드', module: '결제/환불', snippet: '위약금 및 환불 가능 여부 판단 기준' },
  { id: 'qr-trouble', title: 'QR 출석 인식 실패 대응', module: '수업 운영', snippet: '인식 실패 시 원인 파악 및 수동 처리' },
];

// 동의어 사전을 통한 검색어 변환
const expandSearchQuery = (query) => {
  let expanded = [query];
  for (const [term, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (synonyms.some(syn => query.includes(syn))) {
      expanded.push(term);
    }
  }
  return expanded;
};

export default function SearchOverlay() {
  const { isOpen, close, open } = useSearchStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0); // 💡 현재 선택된 인덱스 기억
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 동의어 포함 검색
  const expandedQueries = expandSearchQuery(query);
  const results = GUIDES_LIST.filter(g =>
    expandedQueries.some(q =>
      g.title.includes(q) || g.snippet.includes(q) || g.module.includes(q)
    )
  );

  // 검색어가 바뀔 때마다 선택 인덱스를 다시 첫 번째(0)로 초기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  // 🚀 키보드 네비게이션 제어
  const handleKeyDown = (e) => {
    // 1. 방향키 아래 (↓)
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    }
    // 2. 방향키 위 (↑)
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
    // 3. 엔터 (Enter) - 선택한 항목으로 이동
    else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      navigate(`/guides/${results[selectedIndex].id}`);
      close();
    }
    // 4. 창 닫기 (ESC)
    else if (e.key === 'Escape') {
      close();
    }
  };

  // 슬래시(/) 단축키로 검색창 열기 (바탕화면 감지용)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/' && !isOpen && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, open]);

  // 창 열릴 때 입력창 포커스
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
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '10vh' }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        
        {/* 입력창 */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #eee' }}>
          <Search size={20} color="#9ca3af" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} // 💡 입력창에서 키보드 이벤트 감지
            placeholder="찾으시는 가이드 이름을 입력하세요..."
            style={{ flex: 1, height: '60px', border: 'none', outline: 'none', padding: '0 15px', fontSize: '16px' }}
          />
          <button onClick={close} style={{ border: 'none', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>ESC</button>
        </div>

        {/* 결과창 */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
          {results.length > 0 ? results.map((item, idx) => {
            const isSelected = selectedIndex === idx; // 현재 방향키가 위치한 곳인지 확인
            return (
              <div 
                key={item.id}
                onClick={() => { navigate(`/guides/${item.id}`); close(); }}
                onMouseEnter={() => setSelectedIndex(idx)} // 💡 마우스가 올라가도 선택된 것처럼 동기화
                style={{ 
                  padding: '12px 15px', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  transition: '0.1s',
                  backgroundColor: isSelected ? '#eff6ff' : 'transparent', // 💡 선택되면 파란색 배경
                  borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent' // 💡 선택되면 왼쪽 강조 바
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color={isSelected ? "#2563eb" : "#9ca3af"} />
                  <span style={{ fontWeight: 600, fontSize: '14px', color: isSelected ? '#1d4ed8' : '#111827' }}>{item.title}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: 'auto' }}>{item.module}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 26px' }}>{item.snippet}</p>
              </div>
            )
          }) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>검색 결과가 없습니다.</div>
          )}
        </div>

        {/* 푸터 */}
        <div style={{ padding: '12px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #eee', display: 'flex', fontSize: '12px', color: '#9ca3af' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>↑↓</span> 이동
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CornerDownLeft size={12}/> 선택
          </span>
        </div>
      </div>
    </div>
  );
}