// src/pages/ErrorPage.jsx — 에러 페이지
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, Search } from 'lucide-react';

export default function ErrorPage({ statusCode = 404, message = '찾을 수 없는 페이지입니다.' }) {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100dvh - 56px)', padding: '40px 20px',
      backgroundColor: '#ffffff', fontFamily: "'Pretendard', sans-serif",
    }}>
      <AlertCircle size={64} color="#e5484d" style={{ marginBottom: '20px' }} />

      <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>
        {statusCode}
      </h1>

      <p style={{ fontSize: '16px', color: '#666666', marginBottom: '40px', textAlign: 'center', maxWidth: '500px' }}>
        {message}
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px',
            backgroundColor: '#0070f3', color: '#ffffff',
            border: 'none', cursor: 'pointer', fontWeight: 600,
            fontSize: '14px', fontFamily: "'Pretendard', sans-serif",
            transition: 'background-color 120ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0052b2'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0070f3'}
        >
          <Home size={16} /> 홈으로 이동
        </button>

        <button
          onClick={() => navigate('/guides')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px',
            backgroundColor: '#f2f2f2', color: '#1a1a1a',
            border: '1px solid #e2e2e2', cursor: 'pointer', fontWeight: 600,
            fontSize: '14px', fontFamily: "'Pretendard', sans-serif",
            transition: 'background-color 120ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ebebeb'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f2f2f2'}
        >
          <Search size={16} /> 가이드 검색
        </button>
      </div>
    </div>
  );
}
