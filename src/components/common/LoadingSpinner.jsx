// src/components/common/LoadingSpinner.jsx — 로딩 스피너 컴포넌트
import { Loader } from 'lucide-react';

export default function LoadingSpinner({ message = '로딩 중...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100dvh - 56px)', padding: '40px 20px',
      backgroundColor: '#ffffff', fontFamily: "'Pretendard', sans-serif",
    }}>
      <Loader
        size={48}
        color="#0070f3"
        style={{
          animation: 'spin 2s linear infinite',
          marginBottom: '20px'
        }}
      />
      <p style={{ fontSize: '16px', color: '#666666', margin: 0 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
