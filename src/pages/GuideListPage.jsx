// src/pages/GuidePage.jsx
import { useParams } from 'react-router-dom';
import { GUIDES } from '../data/mockData';
import { Info, ChevronRight, ExternalLink } from 'lucide-react';

export default function GuidePage() {
  const { id } = useParams();
  const guide = GUIDES[id] || GUIDES['member-merge']; // 데이터 없으면 기본값

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '40px 32px' }}>
      <article style={{ flex: 1, maxWidth: '840px' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '99px' }}>{guide.module}</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '12px 0' }}>{guide.title}</h1>
          <p style={{ color: '#6b7280' }}>마지막 업데이트: {guide.updated}</p>
        </div>

        {/* TL;DR */}
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Info size={20} color="#2563eb" />
            <p style={{ fontSize: '14px', margin: 0 }}>{guide.tldr}</p>
          </div>
        </div>

        {/* 유형별 본문 렌더링 */}
        {guide.type === 'SOP' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>처리 절차</h2>
            {guide.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', lineHeight: '24px' }}>{i+1}</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: '#4b5563' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {guide.type === 'DECISION' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>판단 기준</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
                  <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>상황</th>
                  <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>처리 방법</th>
                  <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>비고</th>
                </tr>
              </thead>
              <tbody>
                {guide.decisionTable.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{row.cond}</td>
                    <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{row.action}</td>
                    <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}