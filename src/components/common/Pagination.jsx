// src/components/common/Pagination.jsx — 페이지네이션 컴포넌트
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination }) {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    goToPage,
    hasPrevPage,
    hasNextPage,
  } = pagination;

  // 페이지 번호 배열 생성 (최대 5개 표시)
  const getPageNumbers = () => {
    const pages = [];
    const range = 2; // 현재 페이지 좌우로 2개씩
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '24px',
        alignItems: 'center',
      }}
    >
      {/* 정보 텍스트 */}
      <div
        style={{
          fontSize: '14px',
          color: 'var(--color-muted-foreground)',
          textAlign: 'center',
        }}
      >
        {startIndex} ~ {endIndex} / 총 {totalItems}개
      </div>

      {/* 페이지 네비게이션 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* 이전 버튼 */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrevPage}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: hasPrevPage ? 'pointer' : 'not-allowed',
            opacity: hasPrevPage ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: 'var(--color-foreground)',
          }}
          title="이전 페이지"
        >
          <ChevronLeft size={16} />
          <span>이전</span>
        </button>

        {/* 페이지 번호 */}
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 4px' }}>
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => goToPage(page)}
              style={{
                background:
                  page === currentPage
                    ? 'var(--color-primary)'
                    : 'var(--color-card)',
                border:
                  page === currentPage
                    ? 'none'
                    : '1px solid var(--color-border)',
                color:
                  page === currentPage
                    ? 'var(--color-primary-foreground)'
                    : 'var(--color-foreground)',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: page === currentPage ? '600' : 'normal',
              }}
            >
              {page}
            </button>
          )
        )}

        {/* 다음 버튼 */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNextPage}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: hasNextPage ? 'pointer' : 'not-allowed',
            opacity: hasNextPage ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: 'var(--color-foreground)',
          }}
          title="다음 페이지"
        >
          <span>다음</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
