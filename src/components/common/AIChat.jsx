// src/components/common/AIChat.jsx — AI 챗봇 컴포넌트
import { useState, useRef, useEffect } from 'react';
import {
  PaperPlaneTilt as Send,
  X,
  CircleNotch as Loader,
  ChatCircle as MessageCircle
} from '@phosphor-icons/react'

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! AMS 위키 AI입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI 응답 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `"${input}"에 대한 답변을 찾고 있습니다...\n\n관련 가이드:\n- 회원 병합 가이드\n- 환불 정책\n- QR 출석 트러블슈팅\n\n더 자세한 정보가 필요하신가요?`
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#0070f3',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,112,243,0.3)',
          zIndex: 999,
          transition: 'all 120ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#0052b2';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#0070f3';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '384px',
      maxHeight: '600px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      fontFamily: "'Pretendard', sans-serif",
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e2e2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafb',
        borderRadius: '12px 12px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle size={18} color="#0070f3" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
            AMS AI 어시스턴트
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} color="#666666" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: msg.type === 'user' ? '#0070f3' : '#f2f2f2',
                color: msg.type === 'user' ? '#ffffff' : '#1a1a1a',
                fontSize: '13px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', padding: '12px' }}>
            <Loader size={16} color="#0070f3" style={{ animation: 'spin 2s linear infinite' }} />
            <span style={{ fontSize: '12px', color: '#666666' }}>입력 중...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #e2e2e2',
        display: 'flex',
        gap: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="메시지 입력..."
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #e2e2e2',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
            fontFamily: "'Pretendard', sans-serif",
            transition: 'border-color 120ms ease',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#0070f3'}
          onBlur={e => e.currentTarget.style.borderColor = '#e2e2e2'}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            padding: '10px 12px',
            backgroundColor: '#0070f3',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading ? 0.5 : 1,
            transition: 'background-color 120ms ease',
          }}
          onMouseEnter={e => !isLoading && (e.currentTarget.style.backgroundColor = '#0052b2')}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0070f3'}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
