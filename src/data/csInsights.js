// src/data/csInsights.js
// 마이클래스 CS 상담 채널 + 단과 오픈채팅 + GA4 행동 데이터 교차 분석 결과.
// AMS 나무 위키 로드맵 1단계(CS 데이터 수집/지식 구조 설계) 시드.
//
// 데이터 출처:
// - 마이클래스 카카오톡 상담 채널 (myclass_kakao_chats_251222-260310.csv, 1,119건 분류 / 79일)
// - 단과 상담실장 오픈채팅 (단과_kakao_chats_-260310.csv, 126건 / 7일)
// - GA4 행동 데이터 (157,662명, 1.24M 세션)
// - 분석 리포트: report.html, ux_analysis_report.html
//
// 작성: 2026-05-12 (AMS 나무 위키 프로젝트 1단계)

// ───────────────────────────────────────────────────────────────────────────
// 1. 메타데이터
// ───────────────────────────────────────────────────────────────────────────
export const CS_DATASET_META = {
  customer: {
    source: '마이클래스 카카오톡 상담 채널 (고객 대면)',
    periodStart: '2025-12-22',
    periodEnd: '2026-03-10',
    totalDays: 79,
    totalMessages: 10121,
    classifiedConversations: 1119,
    categories: 12,
    files: {
      raw: 'myclass_kakao_chats_20251222_20260310.csv (3.0MB)',
      classified: 'classified_chats.csv (344KB)',
      report: 'report.html (43KB)',
    },
  },
  staff: {
    source: '단과 상담실장 오픈채팅 (내부 운영)',
    periodStart: '2026-03-04',
    periodEnd: '2026-03-10',
    totalDays: 7,
    totalMessages: 152,
    classifiedIssues: 126,
    categories: 8,
    files: {
      raw: 'KakaoTalk_Chat_단과_2026-03-10-17-17-03.csv (33KB)',
    },
    sampleSizeWarning: '7일치(126건) 표본은 분포 대표성 부족 — 지속 수집 필요',
  },
  ga4: {
    source: 'Google Analytics 4 행동 데이터',
    totalUsers: 157662,
    totalSessions: 1240000,
    crossAnalyzedReport: 'ux_analysis_report.html (46KB)',
  },
  generatedAt: '2026-05-12',
  generatedBy: 'AMS 나무 위키 프로젝트 1단계 (플랫폼서비스실)',
};

// ───────────────────────────────────────────────────────────────────────────
// 2. 고객 상담 카테고리 Top 12 (전체 1,119건 분류 결과)
// ───────────────────────────────────────────────────────────────────────────
export const CUSTOMER_CATEGORIES = [
  {
    rank: 1,
    id: 'video-content',
    label: '영상재생/콘텐츠',
    count: 258,
    share: 23.1,
    negativeRate: 17.4,        // 최고 부정감정 비율
    responseMedianMinutes: 2.8,
    wikiMapping: '영상/VOD 관리',
    subPatterns: {
      '복습영상 접근 제한': 144,
      '재생 오류 (스트리밍)': 98,
      '기타': 16,
    },
    actionableType: 'product', // 시스템/인프라 문제 우세
    actionNote: '스트리밍 인프라 안정화가 근본 해법. 위키는 임시 대응만 가능.',
  },
  {
    rank: 2,
    id: 'school-link',
    label: '학원등록연동',
    count: 170,
    share: 15.2,
    negativeRate: 9.4,
    responseMedianMinutes: 3.0,
    wikiMapping: '회원관리 > 연동',
    actionableType: 'wiki',
    actionNote: '연동 SOP 위키화 + 학부모 셀프 가이드 배포로 자체 해결 가능.',
  },
  {
    rank: 3,
    id: 'qr-attendance',
    label: 'QR/출석',
    count: 140,
    share: 12.5,
    negativeRate: 13.6,
    responseMedianMinutes: 3.9,
    wikiMapping: '출결관리',
    actionableType: 'both',
    actionNote: '인식 실패 폴백 가이드(위키) + 네이티브 카메라 최적화(프로덕트) 병행.',
  },
  {
    rank: 4,
    id: 'parent-account',
    label: '학부모/계정통합',
    count: 139,
    share: 12.4,
    negativeRate: 8.6,
    responseMedianMinutes: 3.2,
    wikiMapping: '회원관리 > 통합회원',
    actionableType: 'wiki',
    actionNote: '계정 병합 SOP는 이미 위키화 완료(member-merge, duplicate-account, parent-phone-change).',
  },
  {
    rank: 5,
    id: 'refund-payment',
    label: '환불/결제',
    count: 113,
    share: 10.1,
    negativeRate: 11.5,
    responseMedianMinutes: 416,   // 7시간 - 극단치
    wikiMapping: '청구/수납/결제/환불',
    actionableType: 'wiki',
    actionNote: '응답시간 416분의 근본 원인은 절차 복잡성. 결정 트리 위키화로 단축 가능.',
  },
  {
    rank: 6,
    id: 'enrollment',
    label: '수강신청/대기',
    count: 42,
    share: 3.8,
    negativeRate: 2.4,            // 최저 부정감정
    responseMedianMinutes: 4.1,
    wikiMapping: '모집/접수 관리',
    actionableType: 'wiki',
    actionNote: '정형화된 안내로 자동화 가능. P2 우선순위.',
  },
  {
    rank: 7,
    id: 'app-access',
    label: '앱 접근/실행',
    count: 38,
    share: 3.4,
    negativeRate: 15.2,
    responseMedianMinutes: 5.6,
    wikiMapping: '공통/시스템',
    actionableType: 'product',
    actionNote: 'GA4: /app 이탈률 68.1% (27,604명) — 앱 랜딩 UX 재설계 필요.',
  },
  {
    rank: 8,
    id: 'login-auth',
    label: '로그인/인증',
    count: 36,
    share: 3.2,
    negativeRate: 11.2,
    responseMedianMinutes: 4.8,
    wikiMapping: '공통/시스템 > 로그인',
    actionableType: 'both',
  },
  {
    rank: 9,
    id: 'app-bug',
    label: '앱 버그/오류',
    count: 34,
    share: 3.0,
    negativeRate: 18.5,
    responseMedianMinutes: 8.2,
    wikiMapping: '트러블슈팅',
    actionableType: 'product',
  },
  {
    rank: 10,
    id: 'textbook-delivery',
    label: '교재/배송',
    count: 19,
    share: 1.7,
    negativeRate: 5.3,
    responseMedianMinutes: 19.6,   // 중위수 최장
    wikiMapping: '강좌/교재 관리',
    actionableType: 'wiki',
    actionNote: '배송 추적 연동 가이드 위키화.',
  },
  {
    rank: 11,
    id: 'class-info',
    label: '강좌/수업 정보',
    count: 18,
    share: 1.6,
    negativeRate: 5.6,
    responseMedianMinutes: 5.1,
    wikiMapping: '강좌/교재 관리',
    actionableType: 'wiki',
  },
  {
    rank: 12,
    id: 'misc',
    label: '기타',
    count: 112,
    share: 10.0,
    negativeRate: 8.0,
    responseMedianMinutes: 6.3,
    wikiMapping: '공통/시스템',
    actionableType: 'both',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// 3. 단과 상담실장 내부 채팅 카테고리 Top 8 (126건)
// ───────────────────────────────────────────────────────────────────────────
export const STAFF_CATEGORIES = [
  { rank: 1, id: 'attendance-system', label: '출결 시스템',      count: 25, share: 19.8, wikiMapping: '수업운영관리 > 출결' },
  { rank: 2, id: 'account-merge',     label: '계정이관/통합',     count: 24, share: 19.0, wikiMapping: '고객(원생) 관리' },
  { rank: 3, id: 'payment-refund',    label: '결제/환불 오류',     count: 10, share: 7.9,  wikiMapping: '청구/수납/결제/환불' },
  { rank: 4, id: 'fee-billing',       label: '수강료/청구 오류',   count: 10, share: 7.9,  wikiMapping: '청구/수납/결제/환불' },
  { rank: 5, id: 'video-staff',       label: '영상/콘텐츠',        count: 5,  share: 4.0,  wikiMapping: '영상/VOD 관리' },
  { rank: 6, id: 'auth-permission',   label: '인증/권한 (OKTA)',   count: 4,  share: 3.2,  wikiMapping: '공통/시스템' },
  { rank: 7, id: 'kiosk',             label: '키오스크',           count: 4,  share: 3.2,  wikiMapping: '청구/수납/결제/환불' },
  { rank: 8, id: 'staff-misc',        label: '기타 운영문의',      count: 44, share: 34.9, wikiMapping: '공통/시스템' },
];

// ───────────────────────────────────────────────────────────────────────────
// 4. 교차 분석: 고객 vs 직원 채널 비교 (양면성 분석)
// ───────────────────────────────────────────────────────────────────────────
export const CROSS_CHANNEL_INSIGHT = {
  description: '고객이 묻는 것 = 운영자가 답해야 하는 것 = 위키 핵심 항목',
  matchedHotspots: [
    {
      topic: '계정이관/통합',
      customerShare: 27.6,  // 학원등록연동 15.2 + 학부모/계정통합 12.4
      staffShare: 19.0,
      both: '교차점 — 위키 문서화 + 프로덕트 개선 동시 필요',
      priority: 'P0',
    },
    {
      topic: '출결/QR',
      customerShare: 12.5,
      staffShare: 19.8,
      both: '교차점 — 위키 SOP + 카메라 폴백 UX',
      priority: 'P1',
    },
    {
      topic: '결제/환불',
      customerShare: 10.1,
      staffShare: 15.8,    // 결제/환불 7.9 + 수강료/청구 7.9
      both: '교차점 — 응답시간 416분, 결정 트리 위키 필요',
      priority: 'P1',
    },
  ],
  mismatchedHotspots: [
    {
      topic: '영상재생/콘텐츠',
      customerShare: 23.1,  // 1위
      staffShare: 4.0,
      gap: '고객 핵심 이슈이나 운영자가 직접 해결 불가 → 시스템 문제',
      priority: 'P0 (프로덕트)',
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// 5. GA4 행동 데이터 — 숨겨진 병목
// ───────────────────────────────────────────────────────────────────────────
export const GA4_HIDDEN_BOTTLENECKS = [
  {
    page: '/app',
    label: '앱 진입 페이지',
    bounceRate: 68.1,
    affectedUsers: 27604,
    csInquiries: 34,
    csShare: 3.0,
    insight: '상담은 3%에 불과하나 실제 이탈자는 압도적. 사용자가 문의조차 못 하고 이탈.',
    iceScore: 576,
    recommendedAction: '앱 랜딩 UX 재설계 + 1단계 가이드 강화',
  },
  {
    page: '/inbound/privacy-consent',
    label: '개인정보 동의',
    bounceRate: 41.7,
    affectedUsers: 6126,
    csInquiries: 'minimal',
    csShare: 0,
    insight: '상담 언급 거의 없음. 등록 퍼널 숨겨진 병목.',
    iceScore: 432,
    recommendedAction: '동의 UI 간소화 (한 화면, 필수만 최소)',
  },
  {
    funnel: '결제 퍼널',
    entered: 254000,
    completed: 125000,
    conversionRate: 49.2,
    dropped: 129000,
    iceScore: 384,
    recommendedAction: 'PG 연동 안정화 + 결제 UI 간소화',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// 6. ICE 우선순위 가설 7개 (프로덕트 백로그)
//   Impact × Confidence × Ease, 각 10점 만점 → 최대 1000
// ───────────────────────────────────────────────────────────────────────────
export const ICE_HYPOTHESES = [
  {
    rank: 1,
    id: 'app-landing-redesign',
    title: '앱 랜딩(/app) UX 재설계',
    hypothesis: '앱 진입 시 첫 화면이 기능 안내 없이 곧바로 컨텐츠 리스트라 학부모 이탈',
    impact: 9, confidence: 8, ease: 8, iceScore: 576,
    baseline: 'GA4 /app 이탈률 68.1%, 27,604명 이탈',
    target: '이탈률 40% 이하',
    expectedROI: '월 이탈 약 13,000명 → 활성 사용자 전환',
    owner: '프로덕트',
    timeline: 'Q3 (3개월)',
  },
  {
    rank: 2,
    id: 'privacy-consent-simplify',
    title: '개인정보 동의 화면 간소화',
    hypothesis: '필수/선택 항목 분리 미흡 + 스크롤 과다로 이탈',
    impact: 8, confidence: 9, ease: 6, iceScore: 432,
    baseline: 'GA4 이탈률 41.7%, 6,126명',
    target: '이탈률 20% 이하',
    expectedROI: '등록 전환 +2,500/월',
    owner: '프로덕트',
    timeline: 'Q2 (2개월)',
  },
  {
    rank: 3,
    id: 'payment-funnel-stabilize',
    title: '결제 퍼널 안정화 (PG + UI)',
    hypothesis: 'PG 연동 오류 + 결제 UI 복잡성으로 절반 이탈',
    impact: 8, confidence: 8, ease: 6, iceScore: 384,
    baseline: '진입 254K → 성공 125K (49.2%)',
    target: '전환율 65% 이상',
    expectedROI: '월 결제 성공 +40,000건',
    owner: '프로덕트 + 결제팀',
    timeline: 'Q2~Q3 (3개월)',
  },
  {
    rank: 4,
    id: 'streaming-infra',
    title: '영상 스트리밍 인프라 안정화',
    hypothesis: '복습영상 재생 오류 빈발, 고객 부정 감정 1위',
    impact: 9, confidence: 7, ease: 5, iceScore: 315,
    baseline: 'CS 258건 (23.1%), 부정 17.4%',
    target: 'CS 100건 이하, 부정 10% 이하',
    expectedROI: 'CS 건수 -60%, 상담 비용 절감',
    owner: '인프라',
    timeline: 'Q3 (지속)',
  },
  {
    rank: 5,
    id: 'qr-fallback',
    title: 'QR 인식 실패 폴백 UX',
    hypothesis: '카메라 인식 실패 시 수동 출석 진입 동선이 길어 학생 혼란',
    impact: 7, confidence: 7, ease: 8, iceScore: 392,
    baseline: 'CS 140건 (12.5%), 부정 13.6%',
    target: 'CS 70건 이하',
    expectedROI: '출결 처리 시간 단축, CS -50%',
    owner: '프로덕트',
    timeline: 'Q2 (1개월)',
  },
  {
    rank: 6,
    id: 'self-merge',
    title: '회원 셀프 병합 기능',
    hypothesis: '현재 플서실 수작업, 일 5~10건 인입',
    impact: 7, confidence: 9, ease: 7, iceScore: 441,
    baseline: '단과 채팅 19.0%, 200건/월',
    target: '실장 90% 셀프 처리',
    expectedROI: '플서실 부하 40% 감소',
    owner: '프로덕트 + 플서실',
    timeline: 'Q2 (진행 중)',
  },
  {
    rank: 7,
    id: 'cti-call-dedup',
    title: 'CTI 콜 인입 중복결제 방지',
    hypothesis: '결제 진행 중 CTI 호출이 화면 분기를 유발',
    impact: 9, confidence: 8, ease: 5, iceScore: 360,
    baseline: '카톡 18건/6개월, 컴플레인 多',
    target: '0건',
    expectedROI: '컴플 80%↓, 정산팀 부하↓',
    owner: '프로덕트',
    timeline: 'Q3',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// 7. 위키 vs 프로덕트 결정 매트릭스
// ───────────────────────────────────────────────────────────────────────────
export const WIKI_VS_PRODUCT_MATRIX = {
  wikiSolvable: [
    { issue: '계정이관/통합 처리 절차',  rationale: '권한 위임 + SOP 위키화로 자체 해결 가능',  status: '진행 중 (member-merge 등 4건 가이드 완료)' },
    { issue: '환불/결제 처리 SOP',        rationale: '응답시간 416분 원인이 절차 복잡성 → 결정 트리로 단축', status: '진행 중 (refund-pending-cancel, shinhan-campus-payment 등)' },
    { issue: '출석부 인쇄/다운로드 가이드', rationale: '기능 사용법 문의 반복',                  status: 'attendance-process 가이드에서 일부 커버' },
    { issue: '수강신청/대기 안내',         rationale: '정형화된 안내, 부정 2.4%로 낮음',         status: 'recruit-application 등 커버' },
  ],
  productOnly: [
    { issue: '영상 재생 오류 (스트리밍)', rationale: '인프라 안정화가 근본 해법',                iceScore: 315 },
    { issue: '/app 페이지 이탈률 68.1%',  rationale: '랜딩 UX 재설계 필요',                       iceScore: 576 },
    { issue: '결제 퍼널 49.2% 이탈',       rationale: 'PG 연동 + UI 간소화 필요',                  iceScore: 384 },
    { issue: '개인정보동의 이탈 41.7%',    rationale: '동의 UI 간소화 필요',                       iceScore: 432 },
    { issue: 'QR 인식 실패',               rationale: '네이티브 카메라 최적화 + 폴백 UX',         iceScore: 392 },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// 8. KPI 측정 기준 (6개월 목표)
// ───────────────────────────────────────────────────────────────────────────
export const KPI_TARGETS = [
  {
    id: 'kpi-repeat-rate',
    metric: '반복 CS 문의 비율',
    baseline: '추정 60%+',
    target6m: '40% 이하',
    measurement: '동일 카테고리 재문의율 (classified_chats 추적)',
  },
  {
    id: 'kpi-response-time',
    metric: '상담 평균 응답시간',
    baseline: '카테고리별 상이 (환불 416분)',
    target6m: '전 카테고리 60분 이하',
    measurement: 'classified_chats 응답시간 분석',
  },
  {
    id: 'kpi-onboarding',
    metric: '신규 인력 온보딩 기간',
    baseline: '측정 필요',
    target6m: '50% 단축',
    measurement: '위키 도입 전후 비교 (인터뷰 + 활성도)',
  },
  {
    id: 'kpi-self-resolve',
    metric: '위키 자체 해결율',
    baseline: '0% (위키 미존재 수준)',
    target6m: '30% 이상',
    measurement: '위키 조회 후 상담 미발생 건 비율',
  },
];
