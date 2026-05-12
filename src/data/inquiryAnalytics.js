// src/data/inquiryAnalytics.js
// 실장 카톡 문의 분석 데이터셋 — 단톡방 6개월(2025.11.03~2026.05.11) 통계.
// 14,897라인 / 약 182일 / 224명 입장 이력 기반.
// 대시보드·관리자 페이지·운영팀 회의 자료로 사용 가능한 구조화 데이터.

export const INQUIRY_DATASET_META = {
  source: '시대인재 단과 오플관련 소통 카카오톡 (KaoTalk export)',
  periodStart: '2025-11-03',
  periodEnd: '2026-05-11',
  totalLines: 14897,
  totalDays: 182,
  totalParticipantsEvents: 224,
  generatedAt: '2026-05-12',
  generatedBy: 'AMS Wiki 분석팀',
};

// ───────────────────────────────────────────────────────────────────────────
// 1. 지점별 발신량 (메시지 prefix 기준)
// ───────────────────────────────────────────────────────────────────────────
export const INQUIRY_BY_BRANCH = [
  { branch: '대치', subBranches: ['고3', '고12', '수학스쿨', '중등', '특목', '교재', '라이브'], messages: 1750, share: 60.0,
    persona: '운영 편의기능 요청 多 · 분파별 다양' },
  { branch: '목동', subBranches: ['단과', '정산', '고3'], messages: 1040, share: 30.0,
    persona: '실질 베타테스터(윤연진 1인 813건) · 풀 결제 사이클' },
  { branch: '반포', subBranches: ['센터', '고1·2', '고12', '고3'], messages: 220, share: 7.0,
    persona: '신규 오픈 · 예비고3 모집 · OKTA/네트워크 이슈' },
  { branch: '분당', subBranches: ['단과', '수학스쿨', '고1·2', '고3'], messages: 125, share: 4.0,
    persona: '수학스쿨 정산 약정 · 키오스크 결제' },
  { branch: '라이브/특목', subBranches: ['라이브', '특목'], messages: 40, share: 1.0,
    persona: 'sdijon 데이터 격리 · 통합회원 이메일 변경' },
];

// ───────────────────────────────────────────────────────────────────────────
// 2. 문의 유형 (카테고리)별 빈도
//    keywords: 카톡 본문 키워드 그레핑 빈도 합
// ───────────────────────────────────────────────────────────────────────────
export const INQUIRY_BY_CATEGORY = [
  {
    id: 'member-account',
    label: '회원/계정 (병합·이관·연동)',
    keywords: ['통합회원', '이관', '연동', '로컬회원', '병합'],
    occurrences: 1402,
    avgResolveHours: 4,
    topQuestion: '로컬 1개 + 통합 1개 → 통합으로 병합 부탁드립니다',
    standardAnswer: 'TO=통합회원으로 병합 진행 (FROM 자동 미사용 처리). 양쪽 모두 입반/결제 이력 있는 경우 사전 정리 필요.',
    relatedGuides: ['member-merge', 'duplicate-account', 'parent-phone-change'],
  },
  {
    id: 'billing-refund',
    label: '결제/환불/청구',
    keywords: ['결제', '청구', '수강료', '납부', '환불대기', '환불코드'],
    occurrences: 1926,
    avgResolveHours: 12,
    topQuestion: '환불코드 ##### 환불대기 취소 부탁드립니다',
    standardAnswer: 'PG는 본인 [승인취소 취소], VAN/신캠/현금은 플서실 수작업 요청 (작업 큐 대기 평균 12시간).',
    relatedGuides: ['refund-pending-cancel', 'payment-switch', 'shinhan-campus-payment', 'cti-duplicate-payment'],
  },
  {
    id: 'attendance-class',
    label: '출결/수업운영',
    keywords: ['입반', '회차', '퇴반', '출석', '출결', '전반', '결석', '티켓', '보강'],
    occurrences: 2667,
    avgResolveHours: 6,
    topQuestion: '전반 시 티켓이 안 옮겨집니다 / 퇴반일 변경이 안 됩니다',
    standardAnswer: '퇴반/전반 정책상 출결 처리된 회차 잔존 시 잠금. 출결 정리 후 재시도 또는 플서실에 데이터 수정 요청.',
    relatedGuides: ['enrollment-process', 'attendance-process', 'class-transfer', 'unpaid-withdraw'],
  },
  {
    id: 'materials',
    label: '교재/물류 (시즌2 도입 3/9~)',
    keywords: ['교재', '배부', '컨텐츠', '회차패키지'],
    occurrences: 186,
    avgResolveHours: 6,
    topQuestion: '교재비 티켓 생성이 안됩니다 / 회차패키지 청구 자동조정',
    standardAnswer: '청구생성 화면에서 연결교재 옵션 선택. 출석 시 청구 1회분 자동추가 오류는 청구목록 일괄 취소로 대응.',
    relatedGuides: ['billing-guide', 'textbook-register'],
  },
  {
    id: 'auth-permission',
    label: '인증/권한 (OKTA·로그인)',
    keywords: ['로그인', '권한', 'OKTA', '옥타', '기기변경'],
    occurrences: 247,
    avgResolveHours: 2,
    topQuestion: '기기 변경으로 OKTA 인증 재설정 부탁드립니다',
    standardAnswer: 'yeojin@hiconsy.com 으로 소속·성함·그룹웨어계정 메일 발송. 신규 권한 부여는 플서실 임채원/박미혜.',
    relatedGuides: ['okta-device-reset'],
  },
  {
    id: 'payment-method',
    label: '결제수단별 정책 (신캠·VAN·PG)',
    keywords: ['신한캠퍼스', '현금영수증', 'VAN', '가상계좌', 'PG', '키오스크'],
    occurrences: 186,
    avgResolveHours: 24,
    topQuestion: '신한캠퍼스 부분환불 가능 여부 / 키오스크 중복결제',
    standardAnswer: '신캠은 부분환불 불가 — 전체 강제취소 후 잔액 별도 청구. 키오스크 CTI 콜 중복결제는 PG사 강제취소 3~5일.',
    relatedGuides: ['shinhan-campus-payment', 'cti-duplicate-payment', 'payment-switch'],
  },
  {
    id: 'ui-improvement',
    label: 'UI/편의기능 개선 요청',
    keywords: ['오류', '확인부탁', '개선', '불편', '문제', '에러'],
    occurrences: 683,
    avgResolveHours: 72,
    topQuestion: '엔터키로 검색 / 탭 이동 / 결석 색깔 강조 / 신규생 명단 다운로드',
    standardAnswer: '운영팀 검토 후 우선순위 결정. 단순 UI 개선은 다음 배포 사이클에 반영.',
    relatedGuides: [],
  },
];

// ───────────────────────────────────────────────────────────────────────────
// 3. 월별 메시지 발생 추이
// ───────────────────────────────────────────────────────────────────────────
export const INQUIRY_TIMELINE = [
  { month: '2025-11', days: 21, label: 'AMS 런칭 직후', mainEvents: ['내부망 IP 등록', 'OKTA 도입', '통합회원 가입 안내', '26학년도 수강신청 오픈'] },
  { month: '2025-12', days: 31, label: '26시즌1 개강', mainEvents: ['출결 시스템 본격 가동', '중복결제 (CTI 콜 인입) 빈발', '강좌/반/전형 정원 분리 혼란'] },
  { month: '2026-01', days: 29, label: '운영 안정화', mainEvents: ['로컬↔통합 회원 병합 요청 폭증', '신한캠퍼스 부분환불 불가 정책 정리', '출석부 학교명 약칭 요청'] },
  { month: '2026-02', days: 28, label: '권한/정산 강화', mainEvents: ['회원 병합 정책 가이드 배포', '권한 그룹 세분화', '환불영수증 출력 개선'] },
  { month: '2026-03', days: 29, label: '시즌2 / 교재 도입', mainEvents: ['교재·물류 모듈 도입(3/9)', 'QR 출결앱 v1.1.10', '출석 시 청구 1회분 자동추가 버그'] },
  { month: '2026-04', days: 30, label: '대형 장애', mainEvents: ['4/27~28: 오류 청구 5,912건 발생', '청구취소 일괄 처리 (당일 90% / 익일 10%)', '조호영 공식 사과 공지'] },
  { month: '2026-05', days: 12, label: '운영 고도화', mainEvents: ['환불영수증 재출력', '가상계좌 UI 개선', '키오스크 중복결제 개선 진행'] },
];

// ───────────────────────────────────────────────────────────────────────────
// 4. 최다 발신자 Top 10
// ───────────────────────────────────────────────────────────────────────────
export const TOP_INQUIRERS = [
  { rank: 1, name: '목동 윤연진', messages: 813, role: '단과 실장', note: '1차 베타테스터 / 신기능 최초 검증' },
  { rank: 2, name: '대치 고3 이지호', messages: 114, role: '고3 단과 실장', note: '운영편의 요청 다수' },
  { rank: 3, name: '목동정산 김완진', messages: 95, role: '정산팀', note: '결제·정산·납입증명서 집중' },
  { rank: 4, name: '대치고3 최명희', messages: 86, role: '고3 단과 실장', note: '회원 병합·이관 다수' },
  { rank: 5, name: '대치고3 차희라', messages: 74, role: '고3 단과 실장', note: '회원 병합·이관 다수' },
  { rank: 6, name: '대치고3 김희수', messages: 60, role: '고3 단과 실장', note: '환불·교재' },
  { rank: 7, name: '대치 고3 양지연', messages: 52, role: '고3 단과 실장', note: '회원/대기/결제' },
  { rank: 8, name: '대치 고3_장선숙', messages: 49, role: '고3 단과 실장', note: 'UI 개선 요청' },
  { rank: 9, name: '대치 고1/2 박미선', messages: 47, role: '고1·2 단과 실장', note: '회원 병합/통합' },
  { rank: 10, name: '대치 고3 이지연', messages: 43, role: '고3 단과 실장', note: '출결/UI' },
];

// ───────────────────────────────────────────────────────────────────────────
// 5. 자주 묻는 질문 Top 25 (Q&A 형식)
// ───────────────────────────────────────────────────────────────────────────
export const TOP_FAQ = [
  {
    rank: 1,
    question: '환불코드 ##### 환불대기 취소 부탁드립니다',
    answerSummary: 'PG는 [승인취소 취소] 직접 가능. VAN/신한캠퍼스/현금은 플서실 수작업 요청 (평균 12시간 소요).',
    category: '결제/환불',
    occurrences: 280,
    relatedGuide: 'refund-pending-cancel',
  },
  {
    rank: 2,
    question: '로컬회원과 통합회원 둘 다 있어 통합 부탁드립니다',
    answerSummary: 'TO=통합회원으로 병합. 양쪽 입반/결제 이력 있으면 사전 정리 필요. 라이브 데이터는 이관 불가.',
    category: '회원관리',
    occurrences: 200,
    relatedGuide: 'member-merge',
  },
  {
    rank: 3,
    question: '학생 학부모 번호 변경 (부 → 모) 부탁드립니다',
    answerSummary: '로컬은 회원상세 [수정] 직접 가능. 통합은 본인이 마이클래스에서 변경. 중복 발생 시 중복 정리 후 재시도.',
    category: '회원관리',
    occurrences: 50,
    relatedGuide: 'parent-phone-change',
  },
  {
    rank: 4,
    question: '기기 변경으로 OKTA 인증 재설정 부탁드립니다',
    answerSummary: 'yeojin@hiconsy.com 으로 소속·성함·그룹웨어계정 메일 발송. 평균 30분~2시간 내 회신.',
    category: '인증',
    occurrences: 42,
    relatedGuide: 'okta-device-reset',
  },
  {
    rank: 5,
    question: '신한캠퍼스 결제건 환불/취소 어떻게 하나요',
    answerSummary: '부분환불 불가. 전체금액 강제취소 접수 후 정산팀이 완료처리. 잔여 수강 시 잔액분 별도 청구.',
    category: '결제',
    occurrences: 58,
    relatedGuide: 'shinhan-campus-payment',
  },
  {
    rank: 6,
    question: '키오스크/단말기에서 중복결제가 되었습니다',
    answerSummary: 'CTI 콜 인입으로 인한 결제 화면 분기 — 누락 승인번호 추적 후 AMS 강제생성 + 강제취소 접수.',
    category: '결제',
    occurrences: 18,
    relatedGuide: 'cti-duplicate-payment',
  },
  {
    rank: 7,
    question: '결제 URL이 열리지 않습니다 / 만료되었습니다',
    answerSummary: 'URL 유효기간 4일. 재발송 또는 학부모 단말 차단·광고성 수신동의 N 확인.',
    category: '결제',
    occurrences: 35,
    relatedGuide: 'payment-url-expired',
  },
  {
    rank: 8,
    question: '전반 시 티켓이 안 옮겨집니다 / 퇴반일 변경 안됨',
    answerSummary: '출결 처리된 회차 잔존 시 잠금. 출결 정리 후 재시도 또는 데이터 수정 요청.',
    category: '출결',
    occurrences: 35,
    relatedGuide: 'class-transfer',
  },
  {
    rank: 9,
    question: '동영상 보강 체크가 안됩니다 (강좌 옵션)',
    answerSummary: '강좌관리에서 동영상보강 옵션 활성화 필요. 회차별 개별 설정 불가 (강좌 단위만).',
    category: '출결',
    occurrences: 22,
    relatedGuide: 'attendance-process',
  },
  {
    rank: 10,
    question: '폐강/종강 처리한 강좌 진행중으로 되돌릴 수 있나요',
    answerSummary: '입반/접수 없으면 데이터 처리 가능. 출결 이력 있으면 어려움 — 플서실 요청.',
    category: '강좌',
    occurrences: 12,
    relatedGuide: null,
  },
  {
    rank: 11,
    question: '광고성 수신동의 거부 학부모에게 결제 안내가 안 갑니다',
    answerSummary: '학생번호로 발송 전환 또는 광고성 수신동의 Y 변경 안내.',
    category: '메시지',
    occurrences: 18,
    relatedGuide: 'payment-url-expired',
  },
  {
    rank: 12,
    question: '학생/학부모 동일 번호 등록 불가합니다 (R40004)',
    answerSummary: '학생 휴대폰 없음 체크박스 또는 다른 번호 사용. 동일 번호 등록 불가 정책.',
    category: '회원관리',
    occurrences: 25,
    relatedGuide: 'parent-phone-change',
  },
  {
    rank: 13,
    question: '강좌 정원을 수정했는데 입반/대기처리에서 반영 안됨',
    answerSummary: '입반/대기는 [전형] 정원 기준 — 전형관리 > 전형명 클릭하여 수정. 강좌/반 정원과 분리됨.',
    category: '강좌',
    occurrences: 10,
    relatedGuide: 'class-manage',
  },
  {
    rank: 14,
    question: '미사용 처리된 계정 복구 부탁드립니다',
    answerSummary: '전체이름+전화번호 필요. 출석부 정보로도 추적 가능 (탈퇴 후 *처리되어 있을 수 있음).',
    category: '회원관리',
    occurrences: 15,
    relatedGuide: 'member-merge',
  },
  {
    rank: 15,
    question: '환불 후 다른 강좌로 금액 이관 (재입반) 가능한가요',
    answerSummary: '미납청구결제 기능으로 가능. 환불 산정 후 신규 청구건과 매칭. VAN은 부분 이관 안됨.',
    category: '결제',
    occurrences: 18,
    relatedGuide: 'payment-switch',
  },
  {
    rank: 16,
    question: 'AMS 권한 부여 부탁드립니다 (신규 입사)',
    answerSummary: '플서실 임채원/박미혜 또는 신정현에게 그룹웨어 계정 전달. 권한 그룹 단위로 부여.',
    category: '인증',
    occurrences: 30,
    relatedGuide: 'okta-device-reset',
  },
  {
    rank: 17,
    question: '강제취소 잘못 클릭했어요 — 원복 가능한가요',
    answerSummary: '플서실 요청. 강제취소 취소 기능 개발 예정 (현재 수작업).',
    category: '결제',
    occurrences: 12,
    relatedGuide: 'refund-pending-cancel',
  },
  {
    rank: 18,
    question: '회원 통합회원 계정이 2개입니다 — 하나로 합쳐주세요',
    answerSummary: '데이터 있는 쪽 유지. 나머지는 본인이 마이클래스에서 탈퇴. 이메일 해킹 시 이메일만 변경.',
    category: '회원관리',
    occurrences: 50,
    relatedGuide: 'live-data-isolation',
  },
  {
    rank: 19,
    question: '출석부 엑셀 다운로드에 타반보강생/신규생 명단도 나오게',
    answerSummary: '엑셀 sheet 분리로 구분되어 다운. 입반일 필터로 신규생 별도 추출 가능 (개선 진행).',
    category: '출결',
    occurrences: 14,
    relatedGuide: 'attendance-process',
  },
  {
    rank: 20,
    question: '학교명을 약칭으로 보여주세요 (이화금란 → 이대부고)',
    answerSummary: '운영팀 검토 — 학교 마스터에 약칭 컬럼 추가 검토 중.',
    category: 'UI/편의',
    occurrences: 5,
    relatedGuide: null,
  },
  {
    rank: 21,
    question: 'AMS와 콜이 연동되지 않습니다 (CTI)',
    answerSummary: 'CTI는 CS팀(안수아) 관할. 다중 브라우저 미지원 가능성 확인.',
    category: '인증',
    occurrences: 8,
    relatedGuide: null,
  },
  {
    rank: 22,
    question: '청구생성에서 다른 지점 강좌까지 노출됩니다',
    answerSummary: '상품조회 팝업은 전지점 공통 SPEC — 지점별 분리 검토 중.',
    category: '강좌',
    occurrences: 6,
    relatedGuide: 'billing-guide',
  },
  {
    rank: 23,
    question: '입반/대기처리에서 퇴원생이 포함된 인원으로 보입니다',
    answerSummary: '11/25 수정 완료. 퇴원 이력 카운트에서 제외하도록 변경됨.',
    category: '출결',
    occurrences: 8,
    relatedGuide: 'enrollment-process',
  },
  {
    rank: 24,
    question: '연결교재 환불 처리 가이드',
    answerSummary: '회차패키지 환불은 배부 상태에 따라 ALERT. 미배부 회차분만 환불 가능.',
    category: '교재',
    occurrences: 8,
    relatedGuide: 'textbook-register',
  },
  {
    rank: 25,
    question: '연말정산용 납입증명서 다운로드',
    answerSummary: '회원조회 > 결제내역 > [납입증명서 다운로드] 기능 추가 완료(1/2).',
    category: '결제',
    occurrences: 6,
    relatedGuide: null,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// 6. 미해결 반복 이슈 (제품 백로그 후보)
// ───────────────────────────────────────────────────────────────────────────
export const RECURRING_UNRESOLVED = [
  {
    issue: '환불대기 취소를 실장 직접 처리 불가',
    impact: '실장 → 플서실 카톡 요청 → 평균 12시간 대기',
    occurrencesPerMonth: 46,
    proposedSolution: '환불대기 [본인 취소] 권한을 실장 그룹에 부여 (PG 외 결제수단까지 확대)',
    estROI: '플서실 응대 부하 25% 감소',
    priority: 'P0',
  },
  {
    issue: '회원 병합을 실장 직접 처리 불가 (4/30 일부 확대)',
    impact: '카톡으로 매일 5~10건 인입',
    occurrencesPerMonth: 200,
    proposedSolution: '4/30 가이드 배포 후 셀프 병합 확대 진행 중 — UI 사용성 검증 필요',
    estROI: '플서실 부하 40% 감소 (예상)',
    priority: 'P0',
  },
  {
    issue: 'CTI 콜 인입 중 키오스크/단말기 중복결제',
    impact: '학부모 컴플레인 + PG사 강제취소 3~5일',
    occurrencesPerMonth: 3,
    proposedSolution: '결제 화면 진행 중 CTI 호출을 새 탭 분기 차단 (모달 큐잉)',
    estROI: '컴플 80% 감소, 정산팀 작업시간 절감',
    priority: 'P0',
  },
  {
    issue: '신한캠퍼스 부분환불 시도 가능 (실제로는 불가)',
    impact: '시도 후 환불대기 잔존, 정산 오류 가능',
    occurrencesPerMonth: 8,
    proposedSolution: '신캠 결제건 부분환불 시도 시 UI 차단 + 경고 모달',
    estROI: '정산 오류 75% 감소',
    priority: 'P1',
  },
  {
    issue: '동영상 보강(타원/타사) 명칭 혼용',
    impact: '실장 혼선, 잘못된 출결 처리 가능',
    occurrencesPerMonth: 2,
    proposedSolution: '명칭 통일(타원/타반/타사 → 1개 용어로) + 마이그레이션',
    estROI: '문의 50% 감소',
    priority: 'P2',
  },
  {
    issue: 'OKTA 인증 매번 메일 요청 (자동화 X)',
    impact: '월 5~8건 메일 처리',
    occurrencesPerMonth: 7,
    proposedSolution: 'AMS 내 [기기 초기화 요청] 셀프 버튼 + 슬랙/메일 자동 발송',
    estROI: '플서실 박여진 부하 80% 감소',
    priority: 'P2',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// 7. 검색 동의어 확장 (사용자 자연어 → AMS 표준 용어)
//    mockData.js의 SEARCH_SYNONYMS와 병합하여 사용
// ───────────────────────────────────────────────────────────────────────────
export const INQUIRY_SEARCH_SYNONYMS = {
  '환불대기': ['환불 취소', '환불 풀어주세요', '환불 원복', '환불코드', '환불 잘못 눌렀어요'],
  '회원 병합': ['통합 부탁드립니다', '계정 합쳐주세요', '로컬과 통합', '이관 부탁드립니다'],
  'OKTA': ['옥타', '기기변경', '앱 삭제', '인증 재설정', '로그인 안됨'],
  '신한캠퍼스': ['신캠', '강제취소', '신한 결제', '부분환불 불가'],
  '학부모 번호 변경': ['부 → 모', '대표번호 변경', 'R40004', '학부모 정보 수정'],
  '결제 URL 만료': ['결제링크 안 열림', 'URL 만료', '결제 점검중', '결제 문자 미수신'],
  '중복결제': ['카드 2회 결제', '승인번호 누락', 'CTI 콜', '키오스크 오류'],
  '전반': ['반 이동', '강좌 변경', '티켓 이관'],
  '강좌 폐강/종강': ['폐강 복구', '종강 취소', '진행중으로 변경'],
  '라이브 데이터': ['sdijon', '라이브 수강', '이메일 변경'],
};
