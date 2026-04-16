// src/pages/GuidePage.jsx — 기획서 v2.0 완전 구현
// • IntersectionObserver 기반 On this page 미니맵 (실제 섹션 연동)
// • 6유형 전체 렌더링: SOP / DECISION / REFERENCE / TROUBLE / RESPONSE / POLICY
// • Pretendard 폰트 · Geist/Catalyst 디자인 토큰
// • 주요항목테이블, 운영케이스 아코디언, 유의사항, 피드백위젯 완비

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ExternalLink, Clock, Search as SearchIcon,
  AlertTriangle, CheckCircle2, ChevronRight, MessageCircle,
  ShieldCheck, ThumbsUp, ThumbsDown, ChevronDown,
  User, Calendar, ArrowUpRight, BookOpen
} from 'lucide-react';
import { GUIDES } from '../data/mockData';

// ─── 인라인 데이터 제거됨 — src/data/mockData.js 참조 ─────────────────────
// 하위 호환 폴백 (mockData에 없는 id 대비)
const _GUIDES_FALLBACK = {
  'member-merge': {
    type:'SOP', module:'고객(원생) 관리', title:'AMS 회원 병합 가이드', updated:'2026-04-13',
    tldr:"중복 계정 통합 시 복구 불가능하므로 반드시 학부모 동의 녹취를 남기세요.\n수강 중인 강좌가 있는 계정을 '살릴 계정(Primary)'으로 선택해야 데이터 유실을 방지할 수 있습니다.",
    path:"AMS 어드민 > 고객 관리 > 회원 상세 정보",
    targets:['운영자','실장'],
    steps:[
      { title:"통합 대상 회원 검색", desc:"이름과 연락처가 동일한 중복 계정을 모두 선택 리스트에서 체크합니다." },
      { title:"병합 버튼 클릭 및 승인", desc:"목록 상단의 [회원 병합] 버튼을 누르고, 팝업창에서 통합 사유를 선택합니다." },
      { title:"기준(Primary) 계정 지정", desc:"이력이 남아야 할 주 계정을 최종 선택한 뒤 '병합 완료'를 누릅니다." },
    ],
    mainItemsTable:[
      { field:"병합 대상", desc:"이름·연락처·생년월일이 동일한 계정", required:true },
      { field:"Primary 계정", desc:"수강 이력·결제 이력을 보존할 메인 계정", required:true },
      { field:"동의 녹취", desc:"학부모 구두 동의 녹음 파일 또는 서면 동의서", required:true },
    ],
    cases:[
      { label:"수강 중인 강좌가 있을 때", action:"반드시 수강 중 강좌 계정을 Primary로 지정합니다. 결제 이력도 함께 이관됩니다.", note:"퇴반 처리된 강좌는 이관 제외" },
      { label:"양쪽 계정 모두 수강 중일 때", action:"실장 승인 후 처리합니다. 금액이 큰 계정을 Primary로 선택하는 것이 원칙입니다.", note:"예외는 실장 서명 필수" },
    ],
    cautions:["병합 완료 후 되돌리기 불가 — 반드시 학부모 구두+서면 동의 선수행","Secondary 계정의 마일리지/장학혜택은 병합 시 소멸"],
    troubleTable:null, responses:null, decisionTable:null, referenceData:null, policyDiff:null,
  },
  'refund-policy': {
    type:'DECISION', module:'청구/수납/결제/환불', title:'환불 승인 기준 판단 가이드', updated:'2026-04-10',
    tldr:"학원법 기준 및 사내 정책에 따른 수강료 환불 산정표입니다. 규정 외 환불은 반드시 실장 전결이 필요합니다.",
    path:"AMS 어드민 > 결제 관리 > 환불 승인", targets:['운영자','실장'],
    decisionTable:[
      { cond:"개강 전 취소", action:"전액 환불", note:"교재비 별도 반환 절차 필요", status:'safe' },
      { cond:"총 교습시간 1/3 경과 전", action:"수강료 2/3 환불", note:"시스템 자동 산출 가능", status:'safe' },
      { cond:"총 교습시간 1/2 경과 전", action:"수강료 1/2 환불", note:"증빙 서류(질병 등) 확인 필수", status:'warn' },
      { cond:"총 교습시간 1/2 경과 후", action:"환불 불가", note:"★실장 특이사항 승인 시에만 처리 가능", status:'danger' },
    ],
    steps:null, mainItemsTable:null, cases:null, cautions:null, troubleTable:null, responses:null, referenceData:null, policyDiff:null,
  },
  'ams-glossary': {
    type:'REFERENCE', module:'공통/시스템', title:'AMS 주요 용어 사전', updated:'2026-04-01',
    tldr:"AMS 서비스 운영 및 개발 시 사용하는 표준 용어 모음입니다. 상담 응대 전 필수 숙지 권장.",
    path:"시스템 전체", targets:['운영자','실장','관리자'],
    referenceData:[
      { term:"Primary Account", def:"병합 시 데이터의 주체가 되어 모든 이력이 흡수되는 계정입니다." },
      { term:"Proration (일할 계산)", def:"중도 입반/퇴반 시 수업 일수에 비례하여 청구 금액을 안분하는 로직입니다." },
      { term:"Adjustment", def:"할인 코드나 바우처 외에 운영팀에서 수동으로 금액을 조정하는 기능입니다." },
      { term:"전환결제", def:"기존 결제 수단을 다른 카드로 변경하는 절차. 새 카드 승인 선행 후 구 카드 취소 순서 필수." },
      { term:"Fallback (폴백)", def:"QR 인식 실패 시 번호 직접 입력으로 출석 처리하는 대체 수단입니다." },
    ],
    steps:null, mainItemsTable:null, cases:null, cautions:null, troubleTable:null, responses:null, decisionTable:null, policyDiff:null,
  },
  'qr-trouble': {
    type:'TROUBLE', module:'수업운영 관리', title:'QR 출석 인식 실패 트러블슈팅', updated:'2026-04-05',
    tldr:"학생 QR 리더기 인식 오류 시 현장에서 즉시 조치할 수 있는 체크리스트입니다. 해결 불가 시 수동 출석으로 대체하세요.",
    path:"AMS 어드민 > 출결 관리 > 수동 출석", targets:['운영자'],
    troubleTable:[
      { issue:"카메라 로딩 무한 반복", cause:"브라우저 보안 권한 미허용", solution:"주소창 좌측 자물쇠 아이콘 클릭 → 카메라 '허용' 선택", severity:'high' },
      { issue:"특정 기기 인식 불가", cause:"반사 방지 필름에 의한 왜곡", solution:"기기 각도 조절 또는 번호 입력 폴백(Fallback) 사용", severity:'medium' },
      { issue:"전체 기기 동시 불가", cause:"AMS 서버 장애 또는 네트워크 단절", solution:"수동 출석 모드 전환 후 플랫폼서비스실 긴급 연락", severity:'critical' },
    ],
    steps:null, mainItemsTable:null, cases:null, cautions:null, responses:null, decisionTable:null, referenceData:null, policyDiff:null,
  },
  'response-manual': {
    type:'RESPONSE', module:'전략/운영', title:'상황별 대응 매뉴얼 (CS)', updated:'2026-03-25',
    tldr:"민감한 고객 문의에 대한 표준화된 응대 프로세스와 스크립트입니다.",
    path:"상담 지원", targets:['운영자','실장'],
    responses:[
      { case:"결제 취소 누락 항의", script:"전환결제는 승인과 취소가 비동기로 일어남을 설명하고 PG사 승인 번호를 안내합니다.", tag:"결제", severity:'high' },
      { case:"성적표 미수신 항의", script:"마이클래스 앱 푸시 알림 설정 및 가입된 학부모 연락처 오기입 여부를 먼저 체크합니다.", tag:"학습관리", severity:'medium' },
      { case:"환불 거절 항의 (1/2 이후)", script:"학원법 제18조 및 2026 정책 기준을 안내하고, 예외 적용이 필요한 경우 실장에게 에스컬레이션합니다.", tag:"환불", severity:'high' },
    ],
    steps:null, mainItemsTable:null, cases:null, cautions:null, troubleTable:null, decisionTable:null, referenceData:null, policyDiff:null,
  },
  'policy-2026': {
    type:'POLICY', module:'전략/운영', title:'2026 수강료 정책 변경 공지', updated:'2026-03-20',
    tldr:"2026년도 물가 인상분 반영 및 인건비 최적화에 따른 신규 청구 기준입니다.",
    path:"운영 정책", targets:['운영자','실장','관리자'],
    policyDiff:{ before:"월 55만원 (교재비 포함 일괄 청구)", after:"월 62만원 (교재비 실비 정산 및 별도 청구 체계)", effectiveDate:"2026-03-01", scope:"재종 전 캠퍼스 공통" },
    steps:null, mainItemsTable:null, cases:null, cautions:null, troubleTable:null, responses:null, decisionTable:null, referenceData:null,
  },
};
const ALL_GUIDES = { ..._GUIDES_FALLBACK, ...GUIDES };

// ─── Geist Design Tokens (vercel.com 실측값) ──────────────────────────────
const G = {
  font: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif",
  // Gray
  bg:    '#ffffff',
  bg2:   '#fafafa',
  g100:  '#f2f2f2',
  g200:  '#ebebeb',
  g300:  '#e2e2e2',
  g400:  '#8f8f8f',
  g600:  '#666666',
  g700:  '#4d4d4d',
  g800:  '#333333',
  g900:  '#1a1a1a',
  g1000: '#000000',
  // Alpha borders
  border:  'rgba(0,0,0,0.08)',
  border2: 'rgba(0,0,0,0.12)',
  // Blue
  b100: '#d3e5ff',
  b200: '#c0d8ff',
  b400: '#0070f3',
  b600: '#0052b2',
  // Green
  gr100: '#cef5d8',
  gr200: '#b5f1c4',
  gr400: '#1a9e5c',
  gr700: '#107a3a',
  // Red
  r100: '#ffdce0',
  r200: '#ffced3',
  r400: '#e5484d',
  r700: '#c30b17',
  // Amber
  a100: '#fff8bb',
  a200: '#fff3a0',
  a400: '#f5a623',
  a700: '#b36200',
  // Radius (Geist: 8px for components, 12px for cards)
  rx:  '4px',
  rs:  '6px',
  rm:  '8px',   // buttons, badges, inputs
  rl:  '12px',  // cards, tables
  rf:  '9999px',
  // Shadows (Geist: border-only, no dramatic drop-shadows)
  sx:  '0 0 0 1px rgba(0,0,0,0.06)',           // subtle border
  sm:  '0 0 0 1px rgba(0,0,0,0.08)',           // standard border
  sl:  '0 0 0 1px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)',
};

const TYPE_META = {
  SOP:      { label:'절차형',    bg:G.b100,  color:G.b600,  border:G.b200  },
  DECISION: { label:'판단분기',  bg:'#fff8bb',color:'#7a4400',border:'#f0d080'},
  REFERENCE:{ label:'참조형',    bg:G.gr100, color:G.gr700, border:G.gr200 },
  TROUBLE:  { label:'트러블슈팅',bg:'#fff0e8',color:'#8b3000',border:'#fcc9a0'},
  RESPONSE: { label:'대응매뉴얼',bg:'#f5eeff',color:'#5c0099',border:'#d4b0ff'},
  POLICY:   { label:'정책공지',  bg:G.r100,  color:G.r700,  border:G.r200  },
};

const STATUS_C = {
  safe:   { bg:G.gr100, color:G.gr700 },
  warn:   { bg:G.a100,  color:G.a700  },
  danger: { bg:G.r100,  color:G.r700  },
};

const SEV_C = {
  critical:{ bg:G.r100, color:G.r700, label:'긴급' },
  high:    { bg:G.a100, color:G.a700, label:'높음' },
  medium:  { bg:G.g100, color:G.g700, label:'보통' },
};

// ─── 유의사항 ────────────────────────────────────────────────────────────────
function CautionBlock({ items }) {
  return (
    <div style={{ border:`1px solid ${G.a100}`, borderRadius:'12px', overflow:'hidden', boxShadow:G.sx }}>
      <div style={{ padding:'11px 18px', backgroundColor:G.a100, borderBottom:`1px solid ${G.a100}`, display:'flex', alignItems:'center', gap:'8px' }}>
        <AlertTriangle size={13} color={G.a400} />
        <span style={{ fontSize:'12px', fontWeight:800, color:G.a700, letterSpacing:'0.02em' }}>반드시 확인하세요</span>
      </div>
      {items.map((c,i)=>(
        <div key={i} style={{ display:'flex', gap:'12px', padding:'13px 18px', borderBottom: i<items.length-1 ? `1px solid ${G.a100}` : 'none', backgroundColor:'#fff' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:G.a400, flexShrink:0, marginTop:'7px' }} />
          <p style={{ margin:0, fontSize:'14px', color:G.g700, lineHeight:1.7, fontFamily:G.font }}>{c}</p>
        </div>
      ))}
    </div>
  );
}

// ─── 운영 케이스 아코디언 ────────────────────────────────────────────────────
function CaseItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:`1px solid ${open ? G.b200 : G.g100}`, borderRadius:'12px', marginBottom:'8px', backgroundColor: open ? G.bg2 : '#fff', transition:'all 0.18s', overflow:'hidden' }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:'100%', display:'flex', alignItems:'center', gap:'14px', padding:'14px 20px', background:'none', border:'none', cursor:'pointer', textAlign:'left', fontFamily:G.font }}>
        <div style={{ width:'26px', height:'26px', borderRadius:'50%', backgroundColor: open ? G.b400 : G.g200, color: open ? '#fff' : G.g600, fontSize:'12px', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.18s' }}>{index+1}</div>
        <span style={{ flex:1, fontSize:'15px', fontWeight:700, color:G.g900 }}>{item.label}</span>
        <ChevronDown size={14} color={G.g400} style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', flexShrink:0 }} />
      </button>
      {open && (
        <div style={{ padding:'0 20px 18px', paddingLeft:'60px' }}>
          <p style={{ fontSize:'14px', lineHeight:1.75, color:G.g700, margin:'0 0 10px', whiteSpace:'pre-wrap', fontFamily:G.font }}>{item.action}</p>
          {item.note && (
            <div style={{ padding:'9px 14px', backgroundColor:G.a100, border:`1px solid ${G.a100}`, borderRadius:'8px', fontSize:'13px', color:G.a700, display:'flex', gap:'8px', lineHeight:1.55 }}>
              <AlertTriangle size={12} color={G.a400} style={{ flexShrink:0, marginTop:'2px' }} />
              {item.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 피드백 위젯 ─────────────────────────────────────────────────────────────
function FeedbackWidget() {
  const [voted, setVoted] = useState(null);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);
  if (done) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', gap:'10px' }}>
      <div style={{ width:'44px', height:'44px', borderRadius:'50%', backgroundColor:G.gr100, border:`1px solid ${G.gr100}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <CheckCircle2 size={22} color={G.gr400} />
      </div>
      <p style={{ margin:0, fontSize:'14px', fontWeight:700, color:G.gr700, fontFamily:G.font }}>의견이 반영되었습니다. 감사합니다.</p>
    </div>
  );
  return (
    <div style={{ textAlign:'center' }}>
      <p style={{ fontSize:'15px', fontWeight:700, color:G.g800, margin:'0 0 18px', fontFamily:G.font }}>이 가이드가 업무에 도움이 되었나요?</p>
      <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginBottom: voted===false ? '16px' : 0 }}>
        <button onClick={()=>setVoted(true)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 22px', borderRadius:'99px', border:`1px solid ${voted===true ? G.gr400 : G.g200}`, backgroundColor: voted===true ? G.gr100 : '#fff', color: voted===true ? G.gr700 : G.g600, fontWeight:700, fontSize:'13px', cursor:'pointer', transition:'all 0.15s', fontFamily:G.font }}>
          <ThumbsUp size={14} /> 도움됨
        </button>
        <button onClick={()=>setVoted(false)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 22px', borderRadius:'99px', border:`1px solid ${voted===false ? G.r400 : G.g200}`, backgroundColor: voted===false ? G.r100 : '#fff', color: voted===false ? G.r400 : G.g600, fontWeight:700, fontSize:'13px', cursor:'pointer', transition:'all 0.15s', fontFamily:G.font }}>
          <ThumbsDown size={14} /> 보완 필요
        </button>
      </div>
      {voted===false && (
        <div style={{ marginTop:'14px', textAlign:'left', maxWidth:'480px', margin:'14px auto 0' }}>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="어떤 점이 부족했나요? (선택 · 200자 이내)" maxLength={200} rows={3}
            style={{ width:'100%', padding:'10px 13px', border:`1px solid ${G.g200}`, borderRadius:'8px', fontSize:'13px', resize:'none', outline:'none', fontFamily:G.font, lineHeight:1.6, boxSizing:'border-box' }}
          />
          <button onClick={()=>setDone(true)} style={{ marginTop:'8px', padding:'8px 22px', backgroundColor:G.g900, color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:G.font }}>제출하기</button>
        </div>
      )}
    </div>
  );
}

// ─── 관련 가이드 ──────────────────────────────────────────────────────────────
const TYPE_LABELS_MINI = { SOP:'절차', DECISION:'판단기준', REFERENCE:'참조', TROUBLE:'트러블슈팅', RESPONSE:'대응', POLICY:'정책' };
const TYPE_BG = { SOP:'#eff6ff', DECISION:'#fef2f2', REFERENCE:'#f0fdf4', TROUBLE:'#fff7ed', RESPONSE:'#fdf4ff', POLICY:'#f0f9ff' };
const TYPE_CLR = { SOP:'#1d4ed8', DECISION:'#be123c', REFERENCE:'#15803d', TROUBLE:'#c2410c', RESPONSE:'#7e22ce', POLICY:'#0369a1' };

function RelatedGuides({ currentId, module: mod }) {
  const related = Object.entries(GUIDES)
    .filter(([id, g]) => id !== currentId && g.module === mod)
    .slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section style={{ marginTop:'72px', marginBottom:'8px' }}>
      <h2 style={{ fontSize:'17px', fontWeight:800, color:G.g900, margin:'0 0 16px', fontFamily:G.font }}>같은 카테고리 가이드</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'12px' }}>
        {related.map(([id, g]) => (
          <Link key={id} to={`/guides/${id}`} style={{ textDecoration:'none' }}>
            <div
              style={{ padding:'18px 20px', borderRadius:'12px', border:`1px solid ${G.g200}`, backgroundColor:'#ffffff', transition:'all 0.15s', cursor:'pointer', height:'100%', boxSizing:'border-box' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=G.b400; e.currentTarget.style.boxShadow=`0 4px 12px rgba(0,112,243,0.1)`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=G.g200; e.currentTarget.style.boxShadow='none'; }}
            >
              <span style={{ display:'inline-block', fontSize:'10px', fontWeight:700, padding:'3px 8px', borderRadius:'99px', backgroundColor: TYPE_BG[g.type]||'#f3f4f6', color: TYPE_CLR[g.type]||'#666', marginBottom:'10px', fontFamily:G.font }}>
                {TYPE_LABELS_MINI[g.type]||g.type}
              </span>
              <p style={{ fontSize:'14px', fontWeight:700, color:G.g900, margin:'0 0 6px', lineHeight:1.4, fontFamily:G.font }}>{g.title}</p>
              <p style={{ fontSize:'12px', color:G.g400, margin:0, lineHeight:1.5, fontFamily:G.font, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {g.tldr.split('\n')[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── On This Page 미니맵 (IntersectionObserver) ──────────────────────────────
function OnThisPage({ sections }) {
  const [active, setActive] = useState(sections[0]?.id || '');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav aria-label="페이지 내 목차">
      <p style={{ fontSize:'11px', fontWeight:800, color:G.g400, textTransform:'uppercase', letterSpacing:'0.13em', marginBottom:'20px', fontFamily:G.font }}>On this page</p>
      <ul style={{ listStyle:'none', padding:0, margin:'0 0 56px', borderLeft:`2px solid ${G.g100}` }}>
        {sections.map(s => {
          const isActive = active === s.id;
          return (
            <li key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{ paddingLeft:'18px', borderLeft: isActive ? `2px solid ${G.b400}` : '2px solid transparent', marginLeft:'-2px', fontSize:'13px', fontWeight: isActive ? 700 : 500, color: isActive ? G.b400 : G.g400, marginBottom:'16px', cursor:'pointer', transition:'all 0.15s', lineHeight:1.4, fontFamily:G.font }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.color=G.g900; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.color=G.g400; }}
            >{s.label}</li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── 섹션 ID 기반 헤딩 래퍼 ─────────────────────────────────────────────────
function SecHeading({ id, children }) {
  return (
    <h2 id={id} style={{ fontSize:'22px', fontWeight:800, color:G.g900, marginBottom:'28px', letterSpacing:'-0.025em', lineHeight:1.25, fontFamily:G.font, scrollMarginTop:'80px' }}>
      {children}
    </h2>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const { id } = useParams();
  const guide = ALL_GUIDES[id] || ALL_GUIDES['member-merge'];
  const [searchTerm, setSearchTerm] = useState('');
  const tm = TYPE_META[guide.type] || TYPE_META.SOP;

  // 유형별 미니맵 섹션 동적 생성
  const sections = [
    { id:'sec-overview', label:'문서 개요' },
    guide.type==='SOP'      && guide.steps       && { id:'sec-steps',    label:'단계별 가이드' },
    guide.type==='DECISION' && guide.decisionTable && { id:'sec-decision', label:'판단 기준' },
    guide.type==='REFERENCE'&& guide.referenceData && { id:'sec-reference',label:'용어 참조' },
    guide.type==='TROUBLE'  && guide.troubleTable  && { id:'sec-trouble',  label:'트러블슈팅' },
    guide.type==='RESPONSE' && guide.responses     && { id:'sec-response', label:'응대 스크립트' },
    guide.type==='POLICY'   && guide.policyDiff    && { id:'sec-policy',   label:'정책 변경' },
    guide.mainItemsTable    && { id:'sec-items',    label:'주요 항목 설명' },
    guide.cases?.length     && { id:'sec-cases',    label:'운영 케이스' },
    guide.cautions?.length  && { id:'sec-cautions', label:'유의사항' },
    { id:'sec-feedback', label:'피드백' },
  ].filter(Boolean);

  return (
    <div style={{ display:'flex', width:'100%', maxWidth:'1440px', margin:'0 auto', padding:'56px 40px 120px', gap:'72px', alignItems:'flex-start', fontFamily:G.font }}>

      {/* ── 본문 ────────────────────────────────────────────────────────── */}
      <article style={{ flex:1, minWidth:0 }}>

        {/* 01 메타 헤더 */}
        <div id="sec-overview" style={{ marginBottom:'52px', scrollMarginTop:'80px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'22px', flexWrap:'wrap', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'7px', flexWrap:'wrap' }}>
              <span style={{ fontSize:'11px', fontWeight:800, padding:'4px 12px', backgroundColor:G.bg2, color:G.b600, borderRadius:'99px', border:`1px solid ${G.b200}`, letterSpacing:'0.05em' }}>{guide.module}</span>
              <span style={{ fontSize:'11px', fontWeight:700, padding:'4px 12px', backgroundColor:tm.bg, color:tm.color, borderRadius:'99px', border:`1px solid ${tm.border}` }}>{tm.label}</span>
              {guide.targets?.map(t=>(
                <span key={t} style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', backgroundColor:G.g100, color:G.g600, borderRadius:'99px' }}>{t}</span>
              ))}
            </div>
            <Link to="/editor" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:600, color:G.g400, textDecoration:'none', padding:'6px 12px', border:`1px solid ${G.g200}`, borderRadius:'8px', transition:'all 0.15s' }}
              onMouseEnter={e=>{ e.currentTarget.style.color=G.g700; e.currentTarget.style.borderColor=G.g300; }}
              onMouseLeave={e=>{ e.currentTarget.style.color=G.g400; e.currentTarget.style.borderColor=G.g200; }}
            ><Clock size={12}/> 버전 이력</Link>
          </div>

          <h1 style={{ fontSize:'clamp(32px, 4vw, 46px)', fontWeight:850, color:G.g900, margin:'0 0 20px', letterSpacing:'-0.04em', lineHeight:1.12, fontFamily:G.font }}>{guide.title}</h1>

          <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'13px', color:G.g400, display:'flex', alignItems:'center', gap:'5px' }}><Calendar size={12}/> {guide.updated}</span>
            <span style={{ width:'3px', height:'3px', borderRadius:'50%', backgroundColor:G.g300 }} />
            <span style={{ fontSize:'13px', color:G.g400, display:'flex', alignItems:'center', gap:'5px' }}><User size={12}/> 플랫폼서비스실</span>
          </div>
        </div>

        {/* 02 TL;DR — Geist Note 스타일 (액센트 바 없음) */}
        <div style={{ padding:'20px 24px', backgroundColor:G.bg2, borderRadius:'12px', border:`1px solid ${G.b200}`, marginBottom:'40px' }}>
          <p style={{ margin:'0 0 6px', fontSize:'11px', fontWeight:700, color:G.b400, textTransform:'uppercase', letterSpacing:'0.07em' }}>TL;DR</p>
          <p style={{ margin:0, fontSize:'14px', lineHeight:1.75, color:G.g800, whiteSpace:'pre-wrap', fontFamily:G.font }}>{guide.tldr}</p>
        </div>

        {/* 03 메뉴 경로 */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 20px', marginBottom:'64px', borderRadius:'12px', border:`1px solid ${G.g100}`, backgroundColor:G.bg2 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:G.g400, fontFamily:'monospace', flexWrap:'wrap' }}>
            {guide.path.split('>').map((p,i,arr)=>(
              <span key={i} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ color: i===arr.length-1 ? G.g900 : G.g400, fontWeight: i===arr.length-1 ? 700 : 400 }}>{p.trim()}</span>
                {i!==arr.length-1 && <ChevronRight size={11} color={G.g300} />}
              </span>
            ))}
          </div>
          <a href="#" style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:700, color:G.b400, textDecoration:'none' }}>
            AMS 바로가기 <ArrowUpRight size={13}/>
          </a>
        </div>

        {/* ── SOP 절차형 ── */}
        {guide.type==='SOP' && guide.steps && (
          <section style={{ marginBottom:'72px' }}>
            <SecHeading id="sec-steps">단계별 가이드</SecHeading>
            <div style={{ position:'relative', paddingLeft:'24px' }}>
              {/* 세로 연결선 */}
              <div style={{ position:'absolute', top:'14px', bottom:'14px', left:'35px', width:'2px', background:`linear-gradient(to bottom, ${G.b200} 0%, ${G.g100} 100%)` }} />
              {guide.steps.map((s,i)=>(
                <div key={i} style={{ position:'relative', display:'flex', gap:'36px', marginBottom:'60px' }}>
                  <div style={{ position:'relative', zIndex:10, width:'26px', height:'26px', borderRadius:'50%', backgroundColor:'#fff', border:`2px solid ${G.b400}`, color:G.b400, fontSize:'12px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', marginTop:'4px', flexShrink:0, boxShadow:`0 0 0 5px #fff, ${G.sm}` }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontSize:'19px', fontWeight:800, color:G.g900, marginBottom:'18px', letterSpacing:'-0.02em', fontFamily:G.font }}>{s.title}</h3>
                    <div style={{ backgroundColor:G.bg2, borderRadius:'12px', border:`1px solid ${G.g100}`, overflow:'hidden', width:'100%' }}>
                      {s.image ? (
                        <div>
                          <img
                            src={s.image.url}
                            alt={s.image.name || s.title}
                            style={{ width:'100%', display:'block', borderRadius:'0' }}
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div style={{ display:'none', padding:'40px', justifyContent:'center', alignItems:'center', color:G.g400, fontSize:'13px' }}>
                            [ {s.image.name || 'AMS 화면 캡처'} ]
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding:'48px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px', minHeight:'120px' }}>
                          <div style={{ padding:'10px 20px', backgroundColor:'#fff', border:`1px solid ${G.g200}`, borderRadius:'8px', color:G.g400, fontSize:'13px' }}>[ AMS 화면 캡처 ]</div>
                        </div>
                      )}
                      <div style={{ padding:'16px 20px', borderTop:`1px solid ${G.g100}`, backgroundColor:'#fff' }}>
                        <p style={{ color:G.g700, fontSize:'14px', lineHeight:1.7, margin:0, fontFamily:G.font }}>{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── DECISION 판단분기 ── */}
        {guide.type==='DECISION' && guide.decisionTable && (
          <section style={{ marginBottom:'72px' }}>
            <SecHeading id="sec-decision">판단 기준</SecHeading>
            <div style={{ borderRadius:'12px', border:`1px solid ${G.g200}`, overflow:'hidden', boxShadow:G.sm }}>
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead style={{ backgroundColor:G.bg2 }}>
                  <tr>
                    {['상황 (Condition)','처리 방법 (Action)','비고'].map(h=>(
                      <th key={h} style={{ padding:'18px 22px', fontSize:'11px', fontWeight:800, color:G.g400, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:`1px solid ${G.g100}`, fontFamily:G.font }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.decisionTable.map((row,i)=>{
                    const sc = STATUS_C[row.status] || STATUS_C.safe;
                    return (
                      <tr key={i} style={{ borderBottom: i<guide.decisionTable.length-1 ? `1px solid ${G.g100}` : 'none', transition:'background 0.12s' }}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor=G.bg2}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}
                      >
                        <td style={{ padding:'20px 22px', fontWeight:700, color:G.g900, fontSize:'15px', fontFamily:G.font }}>{row.cond}</td>
                        <td style={{ padding:'20px 22px' }}>
                          <span style={{ padding:'6px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700, backgroundColor:sc.bg, color:sc.color, fontFamily:G.font }}>{row.action}</span>
                        </td>
                        <td style={{ padding:'20px 22px', color:G.g400, fontSize:'14px', lineHeight:1.6, fontFamily:G.font }}>{row.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── REFERENCE 용어사전 ── */}
        {guide.type==='REFERENCE' && guide.referenceData && (
          <section style={{ marginBottom:'72px' }}>
            <SecHeading id="sec-reference">용어 참조</SecHeading>
            <div style={{ position:'relative', marginBottom:'28px' }}>
              <SearchIcon size={17} color={G.g300} style={{ position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
              <input type="text" placeholder="용어 검색…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                style={{ width:'100%', padding:'12px 15px 12px 42px', borderRadius:'12px', border:`1px solid ${G.g200}`, fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:G.font, color:G.g900 }}
                onFocus={e=>{ e.target.style.borderColor=G.b400; e.target.style.boxShadow=`0 0 0 3px rgba(59,130,246,0.12)`; }}
                onBlur={e=>{ e.target.style.borderColor=G.g200; e.target.style.boxShadow='none'; }}
              />
            </div>
            <div style={{ border:`1px solid ${G.g200}`, borderRadius:'12px', overflow:'hidden', boxShadow:G.sm }}>
              {guide.referenceData
                .filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()) || d.def.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((d,i,arr)=>(
                  <div key={i} style={{ padding:'32px 36px', borderBottom: i<arr.length-1 ? `1px solid ${G.g100}` : 'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                      <div style={{ width:'7px', height:'7px', borderRadius:'50%', backgroundColor:G.b400, flexShrink:0 }} />
                      <strong style={{ color:G.g900, fontSize:'17px', fontWeight:800, fontFamily:G.font }}>{d.term}</strong>
                    </div>
                    <p style={{ margin:0, color:G.g600, lineHeight:1.8, fontSize:'14px', paddingLeft:'17px', fontFamily:G.font }}>{d.def}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── TROUBLE 트러블슈팅 ── */}
        {guide.type==='TROUBLE' && guide.troubleTable && (
          <section style={{ marginBottom:'72px' }}>
            <SecHeading id="sec-trouble">문제 → 원인 → 해결</SecHeading>
            <div style={{ borderRadius:'12px', border:`1px solid ${G.g200}`, overflow:'hidden', boxShadow:G.sm }}>
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead style={{ backgroundColor:G.bg2 }}>
                  <tr>
                    {['심각도','문제 현상','원인','해결 방법'].map(h=>(
                      <th key={h} style={{ padding:'15px 20px', fontSize:'11px', fontWeight:800, color:G.g400, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:`1px solid ${G.g100}`, fontFamily:G.font }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.troubleTable.map((row,i)=>{
                    const sc = SEV_C[row.severity] || SEV_C.medium;
                    return (
                      <tr key={i} style={{ borderBottom: i<guide.troubleTable.length-1 ? `1px solid ${G.g100}` : 'none', transition:'background 0.12s' }}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor=G.bg2}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}
                      >
                        <td style={{ padding:'16px 20px' }}><span style={{ padding:'3px 10px', borderRadius:'99px', fontSize:'11px', fontWeight:800, backgroundColor:sc.bg, color:sc.color, fontFamily:G.font }}>{sc.label}</span></td>
                        <td style={{ padding:'16px 20px', fontWeight:700, color:G.g900, fontSize:'14px', fontFamily:G.font }}>{row.issue}</td>
                        <td style={{ padding:'16px 20px', color:G.g400, fontSize:'13px', fontFamily:G.font }}>{row.cause}</td>
                        <td style={{ padding:'16px 20px', color:G.g700, fontSize:'13px', lineHeight:1.6, fontFamily:G.font }}>{row.solution}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── RESPONSE 대응매뉴얼 ── */}
        {guide.type==='RESPONSE' && guide.responses && (
          <section style={{ marginBottom:'72px' }}>
            <SecHeading id="sec-response">상황별 응대 스크립트</SecHeading>
            {guide.responses.map((r,i)=>{
              const sc = SEV_C[r.severity] || SEV_C.medium;
              return (
                <div key={i} style={{ border:`1px solid ${G.g100}`, borderRadius:'12px', marginBottom:'14px', overflow:'hidden', boxShadow:G.sm }}>
                  <div style={{ padding:'14px 20px', backgroundColor:G.bg2, borderBottom:`1px solid ${G.g100}`, display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'11px', fontWeight:800, padding:'3px 10px', borderRadius:'99px', backgroundColor:sc.bg, color:sc.color, fontFamily:G.font }}>{sc.label}</span>
                    <span style={{ fontSize:'15px', fontWeight:800, color:G.g900, flex:1, fontFamily:G.font }}>{r.case}</span>
                    <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', backgroundColor:G.bg2, color:G.b600, borderRadius:'99px', border:`1px solid ${G.b200}`, fontFamily:G.font }}>{r.tag}</span>
                  </div>
                  <div style={{ padding:'18px 20px', display:'flex', gap:'12px' }}>
                    <MessageCircle size={15} color={G.g300} style={{ flexShrink:0, marginTop:'2px' }} />
                    <p style={{ margin:0, fontSize:'14px', lineHeight:1.8, color:G.g700, fontFamily:G.font }}>{r.script}</p>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── POLICY 정책변경 ── */}
        {guide.type==='POLICY' && guide.policyDiff && (
          <section style={{ marginBottom:'72px' }}>
            <SecHeading id="sec-policy">정책 변경 내용</SecHeading>
            {guide.policyDiff.effectiveDate && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'6px 14px', backgroundColor:G.bg2, border:`1px solid ${G.b200}`, borderRadius:'99px', fontSize:'13px', fontWeight:700, color:G.b600, marginBottom:'24px', fontFamily:G.font }}>
                <Calendar size={12}/> 적용일: {guide.policyDiff.effectiveDate}
                {guide.policyDiff.scope && <span style={{ color:G.b400 }}>· {guide.policyDiff.scope}</span>}
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
              <div style={{ padding:'32px', backgroundColor:G.r100, borderRadius:'12px', border:`1px solid ${G.r100}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', color:G.r700, fontWeight:800, marginBottom:'18px', fontSize:'13px', fontFamily:G.font }}>
                  <AlertTriangle size={16}/> 변경 전 (Legacy)
                </div>
                <p style={{ margin:0, color:'#9f1239', lineHeight:1.8, fontSize:'15px', fontWeight:500, fontFamily:G.font }}>{guide.policyDiff.before}</p>
              </div>
              <div style={{ padding:'32px', backgroundColor:G.gr100, borderRadius:'12px', border:`1px solid ${G.gr100}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', color:G.gr700, fontWeight:800, marginBottom:'18px', fontSize:'13px', fontFamily:G.font }}>
                  <CheckCircle2 size={16}/> 변경 후 (Current)
                </div>
                <p style={{ margin:0, color:G.gr700, lineHeight:1.8, fontSize:'15px', fontWeight:600, fontFamily:G.font }}>{guide.policyDiff.after}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 주요 항목 설명 테이블 ── */}
        {guide.mainItemsTable && (
          <section style={{ marginBottom:'60px' }}>
            <SecHeading id="sec-items">주요 항목 설명</SecHeading>
            <div style={{ border:`1px solid ${G.g200}`, borderRadius:'12px', overflow:'hidden', boxShadow:G.sm }}>
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead style={{ backgroundColor:G.bg2 }}>
                  <tr>
                    {['항목명','설명','필수'].map(h=>(
                      <th key={h} style={{ padding:'13px 18px', fontSize:'11px', fontWeight:800, color:G.g400, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:`1px solid ${G.g100}`, fontFamily:G.font }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.mainItemsTable.map((row,i)=>(
                    <tr key={i} style={{ borderBottom: i<guide.mainItemsTable.length-1 ? `1px solid ${G.g100}` : 'none' }}
                      onMouseEnter={e=>e.currentTarget.style.backgroundColor=G.bg2}
                      onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}
                    >
                      <td style={{ padding:'13px 18px', fontWeight:700, color:G.g900, fontSize:'13px', fontFamily:'monospace' }}>{row.field}</td>
                      <td style={{ padding:'13px 18px', color:G.g600, fontSize:'13px', lineHeight:1.6, fontFamily:G.font }}>{row.desc}</td>
                      <td style={{ padding:'13px 18px' }}>
                        <span style={{ fontSize:'11px', fontWeight:700, padding:'2px 9px', borderRadius:'99px', backgroundColor: row.required ? G.r100 : G.g100, color: row.required ? G.r700 : G.g400, fontFamily:G.font }}>{row.required ? '필수' : '선택'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── 운영 케이스 아코디언 ── */}
        {guide.cases?.length > 0 && (
          <section style={{ marginBottom:'60px' }}>
            <SecHeading id="sec-cases">운영 케이스</SecHeading>
            {guide.cases.map((c,i)=><CaseItem key={i} item={c} index={i} />)}
          </section>
        )}

        {/* ── 유의사항 ── */}
        {guide.cautions?.length > 0 && (
          <section style={{ marginBottom:'60px' }}>
            <SecHeading id="sec-cautions">유의사항</SecHeading>
            <CautionBlock items={guide.cautions} />
          </section>
        )}

        {/* ── 관련 가이드 ── */}
        <RelatedGuides currentId={id} module={guide.module} />

        {/* ── 피드백 ── */}
        <div id="sec-feedback" style={{ marginTop:'64px', padding:'48px 40px', borderTop:`1px solid ${G.g100}`, scrollMarginTop:'80px' }}>
          <FeedbackWidget />
        </div>
      </article>

      {/* ── 우측 미니맵 ─────────────────────────────────────────────────── */}
      <aside style={{ position:'sticky', top:'88px', width:'220px', flexShrink:0 }}>
        <OnThisPage sections={sections} />

        {/* 슬랙 지원 카드 */}
        <div style={{ padding:'22px', backgroundColor:G.bg2, borderRadius:'12px', border:`1px solid ${G.g100}`, boxShadow:G.sx }}>
          <MessageCircle size={18} color={G.b400} style={{ marginBottom:'10px' }} />
          <p style={{ fontSize:'13px', fontWeight:800, color:G.g900, margin:'0 0 6px', fontFamily:G.font }}>실시간 지원</p>
          <p style={{ fontSize:'12px', color:G.g400, margin:'0 0 14px', lineHeight:1.6, fontFamily:G.font }}>가이드로 해결되지 않는 문제는 플랫폼서비스실 슬랙 채널에 문의해 주세요.</p>
          <button style={{ width:'100%', padding:'10px', borderRadius:'9px', border:'none', backgroundColor:G.g900, fontSize:'12px', fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:G.font }}
            onMouseEnter={e=>e.currentTarget.style.backgroundColor=G.g800}
            onMouseLeave={e=>e.currentTarget.style.backgroundColor=G.g900}
          >슬랙 문의하기</button>
        </div>
      </aside>
    </div>
  );
}
