// src/pages/GuideListPage.jsx — 가이드 목록 페이지
import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GUIDES, MODULE_TREE } from '../data/mockData';
import { Search, ChevronRight, Eye, ThumbsUp, Clock } from 'lucide-react';

const TYPE_LABELS = {
  SOP: '절차 가이드', DECISION: '판단 기준', REFERENCE: '참조 자료',
  TROUBLE: '트러블슈팅', RESPONSE: '대응 매뉴얼', POLICY: '정책 공지',
};

const TYPE_COLORS = {
  SOP:      { bg: '#eff6ff', color: '#1d4ed8' },
  DECISION: { bg: '#fef2f2', color: '#be123c' },
  REFERENCE:{ bg: '#f0fdf4', color: '#15803d' },
  TROUBLE:  { bg: '#fff7ed', color: '#c2410c' },
  RESPONSE: { bg: '#fdf4ff', color: '#7e22ce' },
  POLICY:   { bg: '#f0f9ff', color: '#0369a1' },
};

function Chip({ label, active, onClick, colorActive = '#0070f3' }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px', borderRadius: '99px',
        backgroundColor: active ? colorActive : '#f2f2f2',
        color: active ? '#ffffff' : '#1a1a1a',
        border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        fontFamily: "'Pretendard', sans-serif", transition: 'all 120ms ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#ebebeb'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = active ? colorActive : '#f2f2f2'; }}
    >
      {label}
    </button>
  );
}

export default function GuideListPage() {
  const { moduleId } = useParams();

  // moduleId로 모듈 이름 조회
  const moduleFromParam = useMemo(() => {
    if (!moduleId) return null;
    const found = MODULE_TREE.find(m => m.id === moduleId);
    return found ? found.label : null;
  }, [moduleId]);

  const [selectedModule, setSelectedModule] = useState(moduleFromParam);
  const [selectedType, setSelectedType] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // 필터링 및 정렬
  let filteredGuides = Object.entries(GUIDES).map(([id, guide]) => ({ id, ...guide }));

  // 모듈 필터
  if (selectedModule) {
    filteredGuides = filteredGuides.filter(g => g.module === selectedModule);
  }

  // 타입 필터
  if (selectedType) {
    filteredGuides = filteredGuides.filter(g => g.type === selectedType);
  }

  // 검색어 필터
  if (searchQuery) {
    filteredGuides = filteredGuides.filter(g =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tldr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 정렬
  if (sortBy === 'popular') {
    filteredGuides.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sortBy === 'title') {
    filteredGuides.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  } else {
    filteredGuides.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  }

  const modules = [...new Set(Object.values(GUIDES).map(g => g.module))];
  const types = [...new Set(Object.values(GUIDES).map(g => g.type))];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px', fontFamily: "'Pretendard', sans-serif" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
          가이드 목록
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          {filteredGuides.length}개 표시 중 (전체 {Object.keys(GUIDES).length}개)
        </p>
      </div>

      {/* 검색 & 정렬 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="가이드 제목, 내용 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', fontFamily: "'Pretendard', sans-serif", color: '#111827' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', fontSize: '14px', fontFamily: "'Pretendard', sans-serif", cursor: 'pointer', color: '#374151' }}
        >
          <option value="recent">최신 순</option>
          <option value="popular">인기 순</option>
          <option value="title">제목 순</option>
        </select>
      </div>

      {/* 모듈 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginRight: '4px' }}>카테고리</span>
        <Chip
          label={`전체 ${Object.keys(GUIDES).length}`}
          active={selectedModule === null}
          onClick={() => setSelectedModule(null)}
        />
        {modules.map(m => {
          const cnt = Object.values(GUIDES).filter(g => g.module === m).length;
          return (
            <Chip key={m} label={`${m} ${cnt}`} active={selectedModule === m} onClick={() => setSelectedModule(selectedModule === m ? null : m)} />
          );
        })}
      </div>

      {/* 타입 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginRight: '4px' }}>유형</span>
        <Chip label="전체" active={selectedType === null} onClick={() => setSelectedType(null)} />
        {types.map(t => {
          const cnt = Object.values(GUIDES).filter(g => g.type === t && (!selectedModule || g.module === selectedModule)).length;
          return (
            <Chip key={t} label={`${TYPE_LABELS[t] || t} ${cnt}`} active={selectedType === t} onClick={() => setSelectedType(selectedType === t ? null : t)} colorActive={TYPE_COLORS[t]?.color || '#0070f3'} />
          );
        })}
      </div>

      {/* 가이드 목록 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredGuides.length > 0 ? (
          filteredGuides.map(guide => (
            <Link
              key={guide.id}
              to={`/guides/${guide.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '20px', borderRadius: '12px', border: '1px solid #e2e2e2',
                  backgroundColor: '#ffffff', cursor: 'pointer',
                  transition: 'all 120ms ease', height: '100%', display: 'flex', flexDirection: 'column'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0070f3';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,112,243,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e2e2';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 타입 배지 */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '3px 9px',
                    backgroundColor: TYPE_COLORS[guide.type]?.bg || '#f2f2f2',
                    color: TYPE_COLORS[guide.type]?.color || '#666',
                    borderRadius: '99px',
                  }}>
                    {TYPE_LABELS[guide.type] || guide.type}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '3px 9px',
                    backgroundColor: '#f3f4f6', color: '#6b7280', borderRadius: '99px'
                  }}>
                    {guide.module}
                  </span>
                </div>

                {/* 제목 */}
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px', flex: 1 }}>
                  {guide.title}
                </h3>

                {/* TL;DR */}
                <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px', lineHeight: 1.5 }}>
                  {guide.tldr.split('\n')[0]}
                </p>

                {/* 메타데이터 */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#8f8f8f', borderTop: '1px solid #e2e2e2', paddingTop: '12px' }}>
                  {guide.views && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> {guide.views}
                    </div>
                  )}
                  {guide.helpful && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ThumbsUp size={12} /> {guide.helpful}
                    </div>
                  )}
                  {guide.updated && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {guide.updated}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: '#8f8f8f' }}>
            <p style={{ fontSize: '32px', margin: '0 0 16px' }}>🔍</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#374151', margin: '0 0 8px' }}>검색 결과가 없습니다.</p>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 20px' }}>다른 검색어나 필터를 사용해보세요.</p>
            <button
              onClick={() => { setSelectedModule(null); setSelectedType(null); setSearchQuery(''); }}
              style={{ padding: '10px 24px', borderRadius: '99px', backgroundColor: '#111827', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
