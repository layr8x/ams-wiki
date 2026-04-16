// src/components/search/SearchOverlay.jsx — Tailwind CSS
import { useState, useEffect, useRef } from 'react';
import { Search, FileText, CornerDownLeft } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore.jsx';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { GUIDES, RECENT_GUIDES } from '@/data/mockData';

const GUIDES_LIST = Object.entries(GUIDES).map(([id, guide]) => ({
  id,
  title: guide.title,
  module: guide.module,
  snippet: guide.tldr?.split('\n')[0] || '',
}));

export default function SearchOverlay() {
  const { isOpen, close, open } = useSearchStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = GUIDES_LIST.filter(g =>
    g.title.includes(query) || g.snippet.includes(query) || g.module.includes(query)
  );

  // 검색어가 바뀔 때마다 선택 인덱스를 다시 첫 번째(0)로 초기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  // 현재 표시 중인 목록 (빈 쿼리면 최근 조회, 아니면 검색 결과)
  const activeList = query.trim() === '' ? RECENT_GUIDES.slice(0, 5) : results;

  // 키보드 네비게이션 제어
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < activeList.length - 1 ? prev + 1 : prev));
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
    else if (e.key === 'Enter' && activeList.length > 0) {
      e.preventDefault();
      navigate(`/guides/${activeList[selectedIndex].id}`);
      close();
    }
    else if (e.key === 'Escape') {
      close();
    }
  };

  // 슬래시(/) 단축키로 검색창 열기
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

  const renderItem = (item, idx) => {
    const isSelected = selectedIndex === idx;
    return (
      <div
        key={item.id}
        onClick={() => { navigate(`/guides/${item.id}`); close(); }}
        onMouseEnter={() => setSelectedIndex(idx)}
        className={`py-3 px-[15px] rounded-[10px] cursor-pointer transition-all duration-100 border-l-[3px] ${
          isSelected
            ? 'bg-blue-50 border-l-blue-500'
            : 'bg-transparent border-l-transparent hover:bg-blue-50'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <FileText size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
          <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>{item.title}</span>
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full whitespace-nowrap">{item.module}</span>
        </div>
        {item.snippet && (
          <p className="text-[13px] text-gray-500 mt-1 ml-[26px]">{item.snippet}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[9999] flex justify-center pt-[10vh]"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden h-fit">

        {/* 입력창 */}
        <div className="flex items-center px-5 border-b border-zinc-200">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="찾으시는 가이드 이름을 입력하세요..."
            className="flex-1 h-[60px] border-none outline-none px-[15px] text-base bg-transparent"
          />
          <Button variant="ghost" size="xs" onClick={close} className="bg-gray-100 hover:bg-gray-200 text-gray-500">ESC</Button>
        </div>

        {/* 결과창 */}
        <div className="max-h-[400px] overflow-y-auto p-2.5">
          {query.trim() === '' ? (
            <>
              <div className="py-2 px-[15px] text-xs font-semibold text-gray-400 uppercase">최근 조회</div>
              {RECENT_GUIDES.slice(0, 5).map((item, idx) => renderItem(item, idx))}
            </>
          ) : results.length > 0 ? (
            results.map((item, idx) => renderItem(item, idx))
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">
              <p>검색 결과가 없습니다.</p>
              <Link to="/feedback" onClick={close} className="text-blue-500 underline text-[13px] mt-2 inline-block">개선/불편사항 접수</Link>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="py-3 px-5 bg-gray-50 border-t border-zinc-200 flex text-xs text-gray-400">
          <span className="flex items-center gap-1 mr-4">
            <span className="font-mono font-bold">↑↓</span> 이동
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft size={12}/> 선택
          </span>
        </div>
      </div>
    </div>
  );
}
