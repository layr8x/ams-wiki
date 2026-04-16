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
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

// ─── Tailwind class mappings ──────────────────────────────────────────────
const TYPE_TW = {
  SOP:      { label:'절차형',    cls:'bg-blue-100 text-blue-700 border-blue-200' },
  DECISION: { label:'판단분기',  cls:'bg-amber-100 text-amber-800 border-amber-200' },
  REFERENCE:{ label:'참조형',    cls:'bg-green-100 text-green-700 border-green-200' },
  TROUBLE:  { label:'트러블슈팅',cls:'bg-orange-100 text-orange-800 border-orange-200' },
  RESPONSE: { label:'대응매뉴얼',cls:'bg-purple-100 text-purple-800 border-purple-200' },
  POLICY:   { label:'정책공지',  cls:'bg-red-100 text-red-700 border-red-200' },
};

const STATUS_TW = {
  safe:   'bg-green-100 text-green-700',
  warn:   'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
};

const SEV_TW = {
  critical:{ cls:'bg-red-100 text-red-700', label:'긴급' },
  high:    { cls:'bg-amber-100 text-amber-700', label:'높음' },
  medium:  { cls:'bg-zinc-100 text-zinc-600', label:'보통' },
};

// ─── 유의사항 ────────────────────────────────────────────────────────────────
function CautionBlock({ items }) {
  return (
    <Alert variant="warning" className="rounded-xl p-0 overflow-hidden shadow-sm">
      <div className="py-2.5 px-4.5 bg-amber-100 border-b border-amber-100 flex items-center gap-2">
        <AlertTriangle size={13} className="text-amber-500" />
        <AlertTitle className="text-xs font-extrabold text-amber-700 tracking-wide mb-0">반드시 확인하세요</AlertTitle>
      </div>
      <AlertDescription className="p-0">
        {items.map((c,i)=>(
          <div key={i} className={`flex gap-3 py-3 px-4.5 bg-white ${i<items.length-1 ? 'border-b border-amber-100' : ''}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <p className="m-0 text-sm text-muted-foreground leading-relaxed">{c}</p>
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
}

// ─── 운영 케이스 아코디언 ────────────────────────────────────────────────────
function CaseItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl mb-2 transition-all duration-150 overflow-hidden ${open ? 'border-blue-200 bg-muted' : 'border-border bg-white'}`}>
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3.5 py-3.5 px-5 bg-transparent border-none cursor-pointer text-left">
        <div className={`w-6.5 h-6.5 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 transition-all duration-150 ${open ? 'bg-blue-500 text-white' : 'bg-zinc-200 text-muted-foreground'}`}>{index+1}</div>
        <span className="flex-1 text-[15px] font-bold text-foreground">{item.label}</span>
        <ChevronDown size={14} className={`text-muted-foreground shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pr-5 pb-4.5 pl-15">
          <p className="text-sm leading-7 text-muted-foreground mb-2.5 whitespace-pre-wrap">{item.action}</p>
          {item.note && (
            <Alert variant="warning" className="py-2 px-3.5 rounded-lg text-[13px] flex gap-2 leading-relaxed">
              <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <AlertDescription className="p-0">{item.note}</AlertDescription>
            </Alert>
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
    <div className="flex flex-col items-center justify-center py-8 px-6 gap-2.5">
      <div className="w-11 h-11 rounded-full bg-green-100 border border-green-100 flex items-center justify-center">
        <CheckCircle2 size={22} className="text-green-500" />
      </div>
      <p className="m-0 text-sm font-bold text-green-700">의견이 반영되었습니다. 감사합니다.</p>
    </div>
  );
  return (
    <div className="text-center">
      <p className="text-[15px] font-bold text-foreground mb-4.5">이 가이드가 업무에 도움이 되었나요?</p>
      <div className={`flex gap-2.5 justify-center ${voted===false ? 'mb-4' : ''}`}>
        <Button variant={voted===true ? 'secondary' : 'outline'} size="sm" onClick={()=>setVoted(true)} className={`rounded-full px-5.5 ${voted===true ? 'border-green-500 bg-green-100 text-green-700' : ''}`}>
          <ThumbsUp size={14} /> 도움됨
        </Button>
        <Button variant={voted===false ? 'secondary' : 'outline'} size="sm" onClick={()=>setVoted(false)} className={`rounded-full px-5.5 ${voted===false ? 'border-red-500 bg-red-100 text-red-500' : ''}`}>
          <ThumbsDown size={14} /> 보완 필요
        </Button>
      </div>
      {voted===false && (
        <div className="mt-3.5 text-left max-w-[480px] mx-auto">
          <Textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="어떤 점이 부족했나요? (선택 · 200자 이내)" maxLength={200} rows={3}
            className="py-2.5 px-3 text-[13px] min-h-0 leading-relaxed"
          />
          <Button variant="default" size="sm" onClick={()=>setDone(true)} className="mt-2">제출하기</Button>
        </div>
      )}
    </div>
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
      <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest mb-5">On this page</p>
      <ul className="list-none p-0 mb-14 border-l-2 border-border">
        {sections.map(s => {
          const isActive = active === s.id;
          return (
            <li key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`pl-4.5 -ml-0.5 text-[13px] mb-4 cursor-pointer transition-all duration-150 leading-snug border-l-2 ${isActive ? 'border-blue-500 font-bold text-blue-500' : 'border-transparent font-medium text-muted-foreground hover:text-foreground'}`}
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
    <h2 id={id} className="text-[22px] font-extrabold text-foreground mb-7 -tracking-wide leading-tight scroll-mt-20">
      {children}
    </h2>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const { id } = useParams();
  const guide = ALL_GUIDES[id] || ALL_GUIDES['member-merge'];
  const [searchTerm, setSearchTerm] = useState('');
  const tm = TYPE_TW[guide.type] || TYPE_TW.SOP;

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
    { id:'sec-related', label:'관련 가이드' },
    { id:'sec-feedback', label:'피드백' },
  ].filter(Boolean);

  return (
    <div className="flex w-full max-w-[1440px] mx-auto px-10 pt-14 pb-30 gap-18 items-start">

      {/* ── 본문 ────────────────────────────────────────────────────────── */}
      <article className="flex-1 min-w-0">

        {/* 01 메타 헤더 */}
        <div id="sec-overview" className="mb-13 scroll-mt-20">
          <div className="flex items-center justify-between mb-5.5 flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-extrabold py-1 px-3 bg-muted text-blue-700 rounded-full border border-blue-200 tracking-wide">{guide.module}</span>
              <span className={`text-[11px] font-bold py-1 px-3 rounded-full border ${tm.cls}`}>{tm.label}</span>
              {guide.targets?.map(t=>(
                <span key={t} className="text-[11px] font-semibold py-0.5 px-2.5 bg-muted text-muted-foreground rounded-full">{t}</span>
              ))}
            </div>
            <Link to="/editor" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground no-underline py-1.5 px-3 border border-border rounded-lg transition-all duration-150 hover:text-foreground hover:border-zinc-300"
            ><Clock size={12}/> 버전 이력</Link>
          </div>

          <h1 className="text-[clamp(32px,4vw,46px)] font-[850] text-foreground mb-5 -tracking-[0.04em] leading-[1.12]">{guide.title}</h1>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[13px] text-muted-foreground flex items-center gap-1.5"><Calendar size={12}/> {guide.updated}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-zinc-300" />
            <span className="text-[13px] text-muted-foreground flex items-center gap-1.5"><User size={12}/> 플랫폼서비스실</span>
          </div>
        </div>

        {/* 02 TL;DR */}
        <div className="py-5 px-6 bg-muted rounded-xl border border-blue-200 mb-10">
          <p className="m-0 mb-1.5 text-[11px] font-bold text-blue-500 uppercase tracking-widest">TL;DR</p>
          <p className="m-0 text-sm leading-7 text-zinc-700 whitespace-pre-wrap">{guide.tldr}</p>
        </div>

        {/* 03 메뉴 경로 */}
        <div className="flex items-center justify-between py-3 px-5 mb-16 rounded-xl border border-border bg-muted">
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-mono flex-wrap">
            {guide.path.split('>').map((p,i,arr)=>(
              <span key={i} className="flex items-center gap-1.5">
                <span className={i===arr.length-1 ? 'text-foreground font-bold' : 'text-muted-foreground'}>{p.trim()}</span>
                {i!==arr.length-1 && <ChevronRight size={11} className="text-zinc-300" />}
              </span>
            ))}
          </div>
          <a href="#" className="flex items-center gap-1.5 text-[13px] font-bold text-blue-500 no-underline">
            AMS 바로가기 <ArrowUpRight size={13}/>
          </a>
        </div>

        {/* ── SOP 절차형 ── */}
        {guide.type==='SOP' && guide.steps && (
          <section className="mb-18">
            <SecHeading id="sec-steps">단계별 가이드</SecHeading>
            <div className="relative pl-6">
              {/* 세로 연결선 */}
              <div className="absolute top-3.5 bottom-3.5 left-[35px] w-0.5 bg-gradient-to-b from-blue-200 to-border" />
              {guide.steps.map((s,i)=>(
                <div key={i} className="relative flex gap-9 mb-15">
                  <div className="relative z-10 w-6.5 h-6.5 rounded-full bg-white border-2 border-blue-500 text-blue-500 text-xs font-black flex items-center justify-center mt-1 shrink-0 shadow-[0_0_0_5px_#fff] ring-1 ring-black/8">{i+1}</div>
                  <div className="flex-1">
                    <h3 className="text-[19px] font-extrabold text-foreground mb-4.5 -tracking-tight">{s.title}</h3>
                    <div className="bg-muted rounded-xl border border-border overflow-hidden w-full">
                      {s.image ? (
                        <div>
                          <img
                            src={s.image.url}
                            alt={s.image.name || s.title}
                            className="w-full block rounded-none"
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden p-10 justify-center items-center text-muted-foreground text-[13px]">
                            [ {s.image.name || 'AMS 화면 캡처'} ]
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 flex flex-col items-center justify-center gap-2 min-h-[120px]">
                          <div className="py-2.5 px-5 bg-white border border-border rounded-lg text-muted-foreground text-[13px]">[ AMS 화면 캡처 ]</div>
                        </div>
                      )}
                      <div className="py-4 px-5 border-t border-border bg-white">
                        <p className="text-muted-foreground text-sm leading-7 m-0">{s.desc}</p>
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
          <section className="mb-18">
            <SecHeading id="sec-decision">판단 기준</SecHeading>
            <div className="rounded-xl border border-border overflow-hidden ring-1 ring-black/8">
              <table className="w-full border-collapse text-left">
                <thead className="bg-muted">
                  <tr>
                    {['상황 (Condition)','처리 방법 (Action)','비고'].map(h=>(
                      <th key={h} className="py-4.5 px-5.5 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wide border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.decisionTable.map((row,i)=>{
                    const sc = STATUS_TW[row.status] || STATUS_TW.safe;
                    return (
                      <tr key={i} className={`transition-colors duration-150 hover:bg-muted ${i<guide.decisionTable.length-1 ? 'border-b border-border' : ''}`}>
                        <td className="py-5 px-5.5 font-bold text-foreground text-[15px]">{row.cond}</td>
                        <td className="py-5 px-5.5">
                          <span className={`py-1.5 px-3.5 rounded-lg text-[13px] font-bold ${sc}`}>{row.action}</span>
                        </td>
                        <td className="py-5 px-5.5 text-zinc-400 text-sm leading-relaxed">{row.note}</td>
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
          <section className="mb-18">
            <SecHeading id="sec-reference">용어 참조</SecHeading>
            <div className="relative mb-7">
              <SearchIcon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-300" />
              <Input type="text" placeholder="용어 검색…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="py-3 pr-4 pl-[42px] rounded-xl"
              />
            </div>
            <div className="border border-zinc-200 rounded-xl overflow-hidden ring-1 ring-black/8">
              {guide.referenceData
                .filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()) || d.def.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((d,i,arr)=>(
                  <div key={i} className={`py-8 px-9 ${i<arr.length-1 ? 'border-b border-zinc-100' : ''}`}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-[7px] h-[7px] rounded-full bg-blue-500 shrink-0" />
                      <strong className="text-zinc-900 text-[17px] font-extrabold">{d.term}</strong>
                    </div>
                    <p className="m-0 text-zinc-500 leading-7 text-sm pl-4">{d.def}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── TROUBLE 트러블슈팅 ── */}
        {guide.type==='TROUBLE' && guide.troubleTable && (
          <section className="mb-18">
            <SecHeading id="sec-trouble">문제 → 원인 → 해결</SecHeading>
            <div className="rounded-xl border border-zinc-200 overflow-hidden ring-1 ring-black/8">
              <table className="w-full border-collapse text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    {['심각도','문제 현상','원인','해결 방법'].map(h=>(
                      <th key={h} className="py-4 px-5 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wide border-b border-zinc-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.troubleTable.map((row,i)=>{
                    const sc = SEV_TW[row.severity] || SEV_TW.medium;
                    return (
                      <tr key={i} className={`transition-colors duration-150 hover:bg-zinc-50 ${i<guide.troubleTable.length-1 ? 'border-b border-zinc-100' : ''}`}>
                        <td className="py-4 px-5"><span className={`py-0.5 px-2.5 rounded-full text-[11px] font-extrabold ${sc.cls}`}>{sc.label}</span></td>
                        <td className="py-4 px-5 font-bold text-zinc-900 text-sm">{row.issue}</td>
                        <td className="py-4 px-5 text-zinc-400 text-[13px]">{row.cause}</td>
                        <td className="py-4 px-5 text-zinc-600 text-[13px] leading-relaxed">{row.solution}</td>
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
          <section className="mb-18">
            <SecHeading id="sec-response">상황별 응대 스크립트</SecHeading>
            {guide.responses.map((r,i)=>{
              const sc = SEV_TW[r.severity] || SEV_TW.medium;
              return (
                <div key={i} className="border border-zinc-100 rounded-xl mb-3.5 overflow-hidden ring-1 ring-black/8">
                  <div className="py-3.5 px-5 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[11px] font-extrabold py-0.5 px-2.5 rounded-full ${sc.cls}`}>{sc.label}</span>
                    <span className="text-[15px] font-extrabold text-zinc-900 flex-1">{r.case}</span>
                    <span className="text-[11px] font-semibold py-0.5 px-2.5 bg-zinc-50 text-blue-700 rounded-full border border-blue-200">{r.tag}</span>
                  </div>
                  <div className="py-4.5 px-5 flex gap-3">
                    <MessageCircle size={15} className="text-zinc-300 shrink-0 mt-0.5" />
                    <p className="m-0 text-sm leading-7 text-zinc-600">{r.script}</p>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── POLICY 정책변경 ── */}
        {guide.type==='POLICY' && guide.policyDiff && (
          <section className="mb-18">
            <SecHeading id="sec-policy">정책 변경 내용</SecHeading>
            {guide.policyDiff.effectiveDate && (
              <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-zinc-50 border border-blue-200 rounded-full text-[13px] font-bold text-blue-700 mb-6">
                <Calendar size={12}/> 적용일: {guide.policyDiff.effectiveDate}
                {guide.policyDiff.scope && <span className="text-blue-500">· {guide.policyDiff.scope}</span>}
              </div>
            )}
            <div className="grid grid-cols-2 gap-5">
              <div className="p-8 bg-red-100 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 text-red-700 font-extrabold mb-4.5 text-[13px]">
                  <AlertTriangle size={16}/> 변경 전 (Legacy)
                </div>
                <p className="m-0 text-rose-800 leading-7 text-[15px] font-medium">{guide.policyDiff.before}</p>
              </div>
              <div className="p-8 bg-green-100 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-green-700 font-extrabold mb-4.5 text-[13px]">
                  <CheckCircle2 size={16}/> 변경 후 (Current)
                </div>
                <p className="m-0 text-green-700 leading-7 text-[15px] font-semibold">{guide.policyDiff.after}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 주요 항목 설명 테이블 ── */}
        {guide.mainItemsTable && (
          <section className="mb-15">
            <SecHeading id="sec-items">주요 항목 설명</SecHeading>
            <div className="border border-zinc-200 rounded-xl overflow-hidden ring-1 ring-black/8">
              <table className="w-full border-collapse text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    {['항목명','설명','필수'].map(h=>(
                      <th key={h} className="py-3 px-4.5 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wide border-b border-zinc-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.mainItemsTable.map((row,i)=>(
                    <tr key={i} className={`hover:bg-zinc-50 transition-colors duration-150 ${i<guide.mainItemsTable.length-1 ? 'border-b border-zinc-100' : ''}`}>
                      <td className="py-3 px-4.5 font-bold text-zinc-900 text-[13px] font-mono">{row.field}</td>
                      <td className="py-3 px-4.5 text-zinc-500 text-[13px] leading-relaxed">{row.desc}</td>
                      <td className="py-3 px-4.5">
                        <span className={`text-[11px] font-bold py-0.5 px-2 rounded-full ${row.required ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-400'}`}>{row.required ? '필수' : '선택'}</span>
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
          <section className="mb-15">
            <SecHeading id="sec-cases">운영 케이스</SecHeading>
            {guide.cases.map((c,i)=><CaseItem key={i} item={c} index={i} />)}
          </section>
        )}

        {/* ── 유의사항 ── */}
        {guide.cautions?.length > 0 && (
          <section className="mb-15">
            <SecHeading id="sec-cautions">유의사항</SecHeading>
            <CautionBlock items={guide.cautions} />
          </section>
        )}

        {/* ── 관련 가이드 ── */}
        {(() => {
          // Get related guides from same module, excluding current
          const related = Object.entries(ALL_GUIDES)
            .filter(([gid, g]) => gid !== id && g.module === guide.module)
            .slice(0, 3);
          if (related.length === 0) return null;
          return (
            <section className="mb-15">
              <SecHeading id="sec-related">관련 가이드</SecHeading>
              <div className="flex flex-col gap-2">
                {related.map(([gid, g]) => (
                  <Link key={gid} to={`/guides/${gid}`} className="flex items-center gap-3 py-3.5 px-4.5 rounded-xl border border-zinc-100 bg-white no-underline transition-all duration-150 hover:bg-zinc-50 hover:border-zinc-200">
                    <BookOpen size={14} className="text-zinc-400 shrink-0" />
                    <div className="flex-1">
                      <p className="m-0 text-sm font-semibold text-zinc-900">{g.title}</p>
                      <p className="mt-0.5 mb-0 text-xs text-zinc-400">{g.module}</p>
                    </div>
                    <ChevronRight size={14} className="text-zinc-300" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* ── 피드백 ── */}
        <div id="sec-feedback" className="mt-24 py-12 px-10 border-t border-zinc-100 scroll-mt-20">
          <FeedbackWidget />
        </div>
      </article>

      {/* ── 우측 미니맵 ─────────────────────────────────────────────────── */}
      <aside className="sticky top-[88px] w-[220px] shrink-0">
        <OnThisPage sections={sections} />

        {/* 슬랙 지원 카드 */}
        <div className="p-5.5 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm">
          <MessageCircle size={18} className="text-blue-500 mb-2.5" />
          <p className="text-[13px] font-extrabold text-zinc-900 mb-1.5 mt-0">실시간 지원</p>
          <p className="text-xs text-zinc-400 mb-3.5 mt-0 leading-relaxed">가이드로 해결되지 않는 문제는 플랫폼서비스실 슬랙 채널에 문의해 주세요.</p>
          <Button variant="default" size="sm" className="w-full rounded-[9px]">슬랙 문의하기</Button>
        </div>
      </aside>
    </div>
  );
}
