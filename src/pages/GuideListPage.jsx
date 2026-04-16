// src/pages/GuideListPage.jsx — 가이드 목록 페이지
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GUIDES, MODULE_TREE } from '../data/mockData';
import { Search, Filter, ChevronRight, Eye, ThumbsUp, Clock } from 'lucide-react';

export default function GuideListPage() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, title
  const [searchQuery, setSearchQuery] = useState('');

  // 필터링 및 정렬
  let filteredGuides = Object.entries(GUIDES).map(([id, guide]) => ({ id, ...guide }));

  // 모듈 필터
  if (selectedModule) {
    filteredGuides = filteredGuides.filter(g => g.module === selectedModule);
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px', fontFamily: "'Pretendard', sans-serif" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>
          가이드 목록
        </h1>
        <p style={{ fontSize: '16px', color: '#666666' }}>
          총 {filteredGuides.length}개의 가이드 • {GUIDES && Object.keys(GUIDES).length}개 전체
        </p>
      </div>

      {/* 검색 & 필터 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {/* 검색 */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#f2f2f2', borderRadius: '8px', border: '1px solid #e2e2e2' }}>
          <Search size={16} color="#8f8f8f" />
          <input
            type="text"
            placeholder="가이드 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', fontFamily: "'Pretendard', sans-serif" }}
          />
        </div>

        {/* 정렬 */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e2e2',
            backgroundColor: '#ffffff', fontSize: '14px', fontFamily: "'Pretendard', sans-serif", cursor: 'pointer'
          }}
        >
          <option value="recent">최신 순</option>
          <option value="popular">인기 순</option>
          <option value="title">제목 순</option>
        </select>
      </div>

      {/* 모듈 필터 칩 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedModule(null)}
          style={{
            padding: '8px 16px', borderRadius: '99px',
            backgroundColor: selectedModule === null ? '#0070f3' : '#f2f2f2',
            color: selectedModule === null ? '#ffffff' : '#1a1a1a',
            border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            fontFamily: "'Pretendard', sans-serif", transition: 'all 120ms ease'
          }}
          onMouseEnter={e => {
            if (selectedModule === null) return;
            e.currentTarget.style.backgroundColor = '#ebebeb';
          }}
          onMouseLeave={e => {
            if (selectedModule === null) return;
            e.currentTarget.style.backgroundColor = '#f2f2f2';
          }}
        >
          전체
        </button>
        {modules.map(module => (
          <button
            key={module}
            onClick={() => setSelectedModule(module)}
            style={{
              padding: '8px 16px', borderRadius: '99px',
              backgroundColor: selectedModule === module ? '#0070f3' : '#f2f2f2',
              color: selectedModule === module ? '#ffffff' : '#1a1a1a',
              border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              fontFamily: "'Pretendard', sans-serif", transition: 'all 120ms ease'
            }}
            onMouseEnter={e => {
              if (selectedModule === module) return;
              e.currentTarget.style.backgroundColor = '#ebebeb';
            }}
            onMouseLeave={e => {
              if (selectedModule === module) return;
              e.currentTarget.style.backgroundColor = '#f2f2f2';
            }}
          >
            {module}
          </button>
        ))}
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
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '4px 10px',
                    backgroundColor: guide.type === 'SOP' ? '#eff6ff' : guide.type === 'DECISION' ? '#fef2f2' : '#f0fdf4',
                    color: guide.type === 'SOP' ? '#1d4ed8' : guide.type === 'DECISION' ? '#be123c' : '#15803d',
                    borderRadius: '99px'
                  }}>
                    {guide.type}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '4px 10px',
                    backgroundColor: '#f2f2f2', color: '#666666', borderRadius: '99px'
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
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#8f8f8f' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
