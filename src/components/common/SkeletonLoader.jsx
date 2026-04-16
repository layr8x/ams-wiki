// src/components/common/SkeletonLoader.jsx — 스켈레톤 로더 컴포넌트
export function SkeletonCard() {
  return (
    <div style={{
      padding: '20px', borderRadius: '12px', border: '1px solid #e2e2e2',
      backgroundColor: '#f9fafb', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}>
      <div style={{ height: '20px', backgroundColor: '#e2e2e2', borderRadius: '4px', marginBottom: '12px' }} />
      <div style={{ height: '16px', backgroundColor: '#e2e2e2', borderRadius: '4px', marginBottom: '12px', width: '80%' }} />
      <div style={{ height: '16px', backgroundColor: '#e2e2e2', borderRadius: '4px', width: '60%' }} />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '16px', backgroundColor: '#e2e2e2', borderRadius: '4px',
            marginBottom: '8px', width: i === lines - 1 ? '80%' : '100%'
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
