// src/data/csGuides.js
// 마이클래스 CS 상담 1,119건 + 단과 채팅 126건 분석 기반 신규 가이드.
// 빈도·부정감정·응답시간 복합 지표로 우선순위 결정.
// AMS 나무 위키 로드맵 2단계(운영 Wiki 구축) 산출물.
//
// 작성: 2026-05-12

const CONFLUENCE = 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages';
const AMS = 'https://ams.sdij.com';
const MYCLASS = 'https://myclass.sdij.com';

// P0 · P1 영역 신규 가이드 4건 (영상/VOD, 학원등록 연동, 출결 인쇄, 개인정보 동의)
export const CS_GUIDES = {

  // ── P0: 영상/VOD ─ 고객 상담 1위 (258건, 23.1%, 부정 17.4%) ──────────────
  'video-playback-trouble': {
    type: 'TROUBLE', module: '영상/VOD 관리', title: '복습영상·VOD 재생 오류 트러블슈팅',
    updated: '2026-05-12', confluenceId: null,
    author: '플랫폼서비스실', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자', 'CS 담당자'],
    tags: ['영상', 'VOD', '필수', '자주묻는질문'],
    tldr: "마이클래스 복습영상·동영상보강 재생 오류는 6개월 평균 CS 상담 1위(258건, 23.1%) 영역입니다.\n부정감정 비율 17.4%로 전 카테고리 중 최고이며, 위키로 100% 해결되지 않는 시스템·인프라 영역이 포함되어 있어 1차 대응 가이드 + 에스컬레이션 기준이 분리되어 있습니다.\n주요 패턴: 복습영상 접근 제한 144건, 재생 오류(스트리밍) 98건, 기타 16건.",
    path: 'MyClass > 수업관리 > 내 강의실 > 영상',
    amsUrl: `${MYCLASS}`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-12-22 ~ 2026-03-10 (79일)',
      customerOccurrences: 258,
      staffOccurrences: 5,
      negativeRate: 17.4,
      responseMedianMinutes: 2.8,
      topPatterns: ['복습영상 접근 제한 (144건)', '재생 오류 / 스트리밍 끊김 (98건)'],
    },
    troubleTable: [
      {
        issue: '영상 클릭 시 "재생 권한이 없습니다" 또는 화면 무반응',
        cause: '입반 상태 비활성 / 보강 회차 만료 / 결제 미완료',
        solution: 'AMS에서 회원의 해당 강좌 입반 상태와 결제 완료 여부 확인 → 보강 만료라면 강사 승인 후 보강 연장',
        severity: 'medium',
      },
      {
        issue: '영상 로딩 중 멈춤 / 스트리밍 끊김',
        cause: '네트워크 대역폭 부족 또는 CDN 장애',
        solution: '학생 단말 Wi-Fi 환경 확인 → 화질 자동→480p로 낮춰 재시도 → 동일 시간대 다수 발생 시 인프라팀 즉시 보고',
        severity: 'high',
      },
      {
        issue: '복습영상 목록에 영상이 없음',
        cause: '강좌 옵션 [동영상보강 제공] 비활성 / 회차 미배포',
        solution: 'AMS 강좌관리 > 해당 강좌 > 동영상보강 옵션 ON 확인. 회차별 배포 완료 여부 확인.',
        severity: 'high',
      },
      {
        issue: '동영상 보강 신청했는데 영상이 안 보임 (체크는 됨)',
        cause: '입반일 또는 회차 데이터 꼬임 (입반일 미래 설정 등)',
        solution: '회원 상세에서 입반일/퇴반일 확인 후 정상 범위로 수정. 데이터 꼬임 시 플서실 요청.',
        severity: 'medium',
      },
      {
        issue: '여러 학생이 동일 시간대에 영상 재생 불가',
        cause: '인프라 장애 또는 스트리밍 서버 다운',
        solution: '즉시 위키 안내 중단. 인프라팀 슬랙 채널 보고 + 학원 공지 발송 (재시도 안내)',
        severity: 'critical',
      },
      {
        issue: '특정 단말(iPad/iPhone)에서만 재생 불가',
        cause: 'iOS Safari 정책 / 사용자 설정 (저전력 모드 / 데이터 절약)',
        solution: '저전력 모드 OFF + 데이터 절약 OFF + Safari 자동 재생 허용 확인',
        severity: 'low',
      },
    ],
    steps: [
      { title: '학생 단말 환경 확인', desc: 'Wi-Fi vs 데이터 / iOS·Android / 브라우저(앱·Safari·Chrome) 확인.', image: null },
      { title: '학원 측 데이터 확인', desc: 'AMS 회원조회 > 입반 상태 + 결제 완료 + 보강 만료일 + 강좌 동영상보강 옵션 확인.', image: null },
      { title: '재현 시도', desc: '동일 환경에서 재현 가능한지 확인. 1명만 발생 vs 다수 동시 발생 구분.', image: null },
      { title: '1명 케이스', desc: '데이터 수정(보강 연장, 입반일 변경) 또는 화질 480p 권장.', image: null },
      { title: '다수 동시 케이스', desc: '인프라 장애 가능성 → 즉시 보고 후 학원 공지로 대량 응대 차단.', image: null },
    ],
    cases: [
      { label: '결제 미완료 + 영상 접근 시도', action: '결제 완료 안내 후 재시도', note: '권한 검증 정상 동작' },
      { label: '보강 만료 후 영상 접근 시도', action: '강사 승인 받아 보강 연장 처리 후 재시도', note: '연장 권한은 강사/실장' },
      { label: '동일 시각 다수 발생', action: '인프라팀 보고 + 학원 공지 (재시도 권장)', note: '위키 1차 대응만으로 해결 불가' },
    ],
    cautions: [
      '단순 새로고침 권유는 한 번까지만 — 반복 권유는 부정 감정 악화',
      '다수 동시 발생 시 위키 가이드만으로 응대 시도 금지 → 즉시 보고',
      '복습영상 권한은 입반 상태 + 결제 + 강좌 옵션 3가지가 모두 충족되어야 함',
    ],
    decisionTable: [
      { cond: '1명 / 데이터 문제', action: 'AMS 데이터 수정 후 재시도', note: '입반·결제·보강 만료 점검', status: 'safe' },
      { cond: '1명 / 단말 환경 문제', action: '단말 설정 변경 안내 (저전력·데이터 절약·자동재생)', note: 'iOS 빈번', status: 'safe' },
      { cond: '다수 동시 발생', action: '인프라팀 즉시 보고 + 공지 발송', note: '위키 응대 중단', status: 'danger' },
      { cond: '복습영상 목록 자체가 비어있음', action: '강좌 동영상보강 옵션 + 회차 배포 확인', note: '강사·운영팀 협의 필요', status: 'warn' },
    ],
    mainItemsTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── P0: 학원등록 연동 ─ 고객 상담 2위 (170건, 15.2%) ─────────────────────
  'school-registration-link': {
    type: 'SOP', module: '고객(원생) 관리', title: '학원 등록정보 연동 가이드 (학부모 셀프)',
    updated: '2026-05-12', confluenceId: null,
    author: '플랫폼서비스실', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자', 'CS 담당자', '학부모 안내용'],
    tags: ['연동', '회원관리', '필수', '자주묻는질문'],
    tldr: "통합회원이 마이클래스에서 학원 수강 정보를 직접 연결하는 절차입니다.\n고객 상담 2위(170건, 15.2%)로 빈도가 높지만 부정감정은 9.4%로 낮아 정형 안내로 해결 가능합니다.\n셀프 처리가 안되는 경우의 대응 분기를 함께 정리했습니다.",
    path: 'MyClass > 전체메뉴 > 수업관리 > 학원 등록정보 연동',
    amsUrl: `${MYCLASS}/inbound`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-12-22 ~ 2026-03-10',
      customerOccurrences: 170,
      staffOccurrences: 24,
      negativeRate: 9.4,
      responseMedianMinutes: 3.0,
      topPatterns: ['연동 코드 미수신', '연동 후 수강 정보 미노출', '본인인증 실패'],
    },
    steps: [
      { title: 'MyClass 통합회원 로그인', desc: `${MYCLASS} 에 회원 본인 명의 휴대폰으로 가입된 통합회원으로 로그인.`, image: null },
      { title: '[학원 등록정보 연동] 메뉴 진입', desc: '전체메뉴 > 수업관리 > 학원 등록정보 연동 클릭.', image: null },
      { title: '연동 코드 입력 또는 본인인증', desc: '학원에서 발송한 연동 코드를 입력하거나, 본인 휴대폰 본인인증으로 자동 매칭.', image: null },
      { title: '연동 결과 확인', desc: '연결된 수강 정보가 [내 수강 강좌] 탭에 표시되는지 확인.', image: null },
    ],
    mainItemsTable: [
      { field: '연동 코드', desc: '학원이 발급하는 6~8자리 코드 (실장이 SMS 또는 카톡 발송)', required: false },
      { field: '본인인증', desc: '학생/학부모 본인 명의 휴대폰 PASS 인증', required: true },
    ],
    decisionTable: [
      { cond: '본인인증으로 연동 시도 → 일치하는 정보 없음', action: '학원에서 로컬회원 등록 시 입력한 번호와 일치하는지 AMS 확인 → 다르면 학원이 번호 수정 후 재시도', note: '회원조회에서 학부모 번호 확인', status: 'warn' },
      { cond: '연동 코드 미수신', action: '학원에서 [연동 코드 발송] 재실행. SMS 차단 확인.', note: '광고성 수신동의 N이면 발송 안됨', status: 'safe' },
      { cond: '연동 완료 후 수강 정보 미노출', action: '재로그인 + 새로고침. 미해소 시 플서실 병합 요청', note: '계정 2개 분리되었을 가능성', status: 'warn' },
      { cond: '본인인증은 됐으나 "이미 연동된 계정"', action: '학부모가 다른 통합회원 계정으로 이미 연동 — 본인이 사용할 계정만 남기고 다른 계정 탈퇴', note: '`live-data-isolation` 가이드 참조', status: 'warn' },
    ],
    cases: [
      { label: '학부모 셀프 처리 정상 케이스', action: '본인인증 → 자동 매칭 → 완료', note: '79일 데이터 기준 약 80% 정상 진행' },
      { label: '학부모 번호 변경 후 연동', action: '먼저 마이클래스에서 회원정보 수정으로 학부모 번호 변경 후 연동 재시도', note: '`parent-phone-change` 가이드 참조' },
      { label: '학원이 학부모를 잘못 등록 (부/모 번호 뒤바뀜)', action: 'AMS에서 학원이 학부모 정보 수정 후 학부모 재시도', note: '실장 권한으로 회원상세 [수정]' },
    ],
    cautions: [
      '본인인증 실패 = 학원 측 등록 번호와 학부모 인증 번호 불일치 → 먼저 학원이 데이터 수정',
      '한 학부모가 통합회원 계정을 여러 개 만들지 않도록 안내 — 합치기 어려움',
      '연동은 학생이 직접 (실장이 대신 진행 불가)',
    ],
    troubleTable: [
      { issue: '"등록된 학원 정보가 없습니다"', cause: '학원이 로컬회원 등록 시 입력한 학부모 번호와 인증 번호 불일치', solution: '학원이 회원상세에서 번호 수정 후 재시도', severity: 'medium' },
      { issue: '"이미 다른 계정과 연동되어 있습니다"', cause: '학부모가 통합회원 계정을 여러 개 가입', solution: '사용할 계정만 남기고 나머지 본인 탈퇴 안내', severity: 'medium' },
    ],
    responses: null, referenceData: null, policyDiff: null,
  },

  // ── P1: 개인정보 동의 ─ GA4 이탈 41.7% 숨겨진 병목 ───────────────────────
  'privacy-consent-flow': {
    type: 'TROUBLE', module: '메시지발송 관리', title: '개인정보 동의 처리 — 이탈 방지 가이드',
    updated: '2026-05-12', confluenceId: null,
    author: '플랫폼서비스실', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자'],
    tags: ['개인정보', '동의', 'GA4'],
    tldr: "/inbound/privacy-consent 페이지의 GA4 이탈률 41.7% (6,126명) — 상담 인입은 거의 없지만 등록 퍼널의 숨겨진 병목입니다.\n동의 문자 발송 후 학부모가 동의 화면에서 이탈하는 패턴을 분석하고 운영팀이 1차 대응할 수 있는 가이드입니다.",
    path: '학부모 동의 화면 (외부) + AMS 회원상세 동의 상태',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-12-22 ~ 2026-03-10',
      ga4Bounce: 41.7,
      ga4AffectedUsers: 6126,
      customerOccurrences: 'minimal (CS 침묵 영역)',
      insight: '상담조차 못 하고 이탈 → GA4로만 포착 가능한 병목',
    },
    troubleTable: [
      {
        issue: '동의 문자가 학부모에게 도착하지 않음',
        cause: '광고성 정보수신 동의 N / 발신번호 차단 / 잘못된 번호',
        solution: '광고성 수신동의 상태 확인. 동의 N이면 학생 번호로 발송 또는 학부모 직접 동의 받기',
        severity: 'medium',
      },
      {
        issue: '학부모가 링크 클릭 후 이탈 (동의 미완료)',
        cause: '동의 화면 스크롤 과다 / 필수·선택 항목 혼동 / 모바일 UX 부족',
        solution: '학부모에게 [필수만] 체크 후 [동의] 안내 — 선택 항목은 거부해도 진행 가능',
        severity: 'high',
      },
      {
        issue: '여러 번 동의 문자 발송 후 최신 링크만 유효',
        cause: '최신 문자만 유효, 이전 링크 만료',
        solution: '학부모에게 가장 최근 받은 문자의 링크 사용 안내',
        severity: 'medium',
      },
      {
        issue: '동의 완료 직후 AMS에 반영 안됨',
        cause: '서버 비동기 처리 지연 (1~5분)',
        solution: '5분 후 새로고침 재확인. 미해소 시 플서실 요청',
        severity: 'low',
      },
    ],
    steps: [
      { title: '동의 문자 발송 전 점검', desc: 'AMS 회원상세에서 학부모 번호 정확성 + 광고성 수신동의 Y 확인.', image: null },
      { title: '문자 발송', desc: '회원상세 > [개인정보 동의 문자 발송] 1회만 클릭 (중복 발송 시 이전 링크 만료).', image: null },
      { title: '학부모 동의 진행 안내 (필요 시 전화)', desc: '"받은 문자의 링크 → 필수만 체크 → 동의 버튼" 3단계 안내. 선택 항목은 거부 가능.', image: null },
      { title: '동의 완료 확인', desc: '5분 이내 AMS 회원상세에서 동의 상태 Y로 변경 확인.', image: null },
      { title: '이탈 케이스 대응', desc: '15분 이상 미반영 시 전화로 진행 단계 확인 + 필요 시 학원 방문 동의', image: null },
    ],
    decisionTable: [
      { cond: '문자 미수신', action: '광고성 수신동의 확인 / 학생 번호로 재발송', note: '단말 차단도 확인', status: 'warn' },
      { cond: '링크 클릭 → 이탈', action: '전화로 3단계 안내 또는 학원 방문 동의', note: '모바일 UX 한계', status: 'warn' },
      { cond: '동의 완료 → AMS 미반영', action: '5분 대기 → 미해소 시 플서실', note: '비동기 처리', status: 'safe' },
      { cond: '본인인증 통합회원 학부모', action: '마이클래스 회원정보 관리에서 직접 동의 가능', note: '별도 문자 불필요', status: 'safe' },
    ],
    cases: [
      { label: '학부모 단말이 구형 / 동의 UI 미숙', action: '학원 방문 동의 또는 학원 PC에서 학부모 본인 동의', note: '미성년자 가족 케이스 多' },
      { label: '학부모 거부 — 동의 자체 안 함', action: '학생 번호로 동의 + 학원 운영 가능 범위 확인', note: '광고성 외 필수만 가능' },
    ],
    cautions: [
      '동의 문자 중복 발송 금지 — 최신 1건만 유효',
      '동의 화면은 외부 PG/MyClass 도메인 — 학원에서 UI 변경 불가',
      'GA4 이탈률 41.7%는 학부모가 상담조차 하지 않고 이탈 → 능동적 추적 필요',
    ],
    mainItemsTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── P1: 출석부 인쇄/다운로드 ─ 실장 운영문의 ─────────────────────────────
  'attendance-print-export': {
    type: 'SOP', module: '수업운영관리', title: '출석부 인쇄·엑셀 다운로드 가이드',
    updated: '2026-05-12', confluenceId: null,
    author: '플랫폼서비스실', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자'],
    tags: ['출결', '출석부', '엑셀'],
    tldr: "출석부 인쇄·엑셀 다운로드 기능 사용 가이드입니다.\n실장 단톡방에 '값이 있는 셀만 표로 출력이 가능할까요?' 같은 기능 사용 문의가 반복되어 표준화했습니다.",
    path: 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세 > 출석부',
    amsUrl: `${AMS}/operation/class/manage`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      staffOccurrences: 14,
      patterns: ['신규생 명단만 추출', '타반보강생 포함 다운로드', '엑셀 마스킹 제거 요청'],
    },
    steps: [
      { title: '수업상세 화면 진입', desc: '수업운영관리 > 수업관리 > 강좌 클릭 > 수업상세.', image: null },
      { title: '회차 필터링 (선택)', desc: '특정 회차만 보고 싶을 경우 회차 드롭다운으로 선택.', image: null },
      { title: '엑셀 다운로드', desc: '출석부 우측 상단 [엑셀 다운로드] 클릭. sheet가 [출석부] / [타반보강생] 으로 분리됨.', image: null },
      { title: '인쇄 (하드카피)', desc: '[인쇄] 버튼 클릭 → 브라우저 인쇄 미리보기에서 페이지 설정 후 출력.', image: null },
    ],
    cases: [
      { label: '신규 입반생만 다운로드', action: '출석부에서 [입반일] 컬럼으로 필터 → 해당 회차 첫 입반인 학생만 추출', note: '입반일 기준 정렬' },
      { label: '타반보강생만 다운로드', action: '엑셀 다운로드 시 [타반보강생] sheet 별도 제공', note: '같은 보강코드 반에서 출석한 회원' },
      { label: '학생번호 마스킹 제거', action: '로컬회원 마스킹은 보안 정책상 유지 — 통합회원과 구분 표시', note: '재무 보고는 별도 ID 사용' },
      { label: '결석생만 다운로드', action: '출석부 상단 출결상태 필터 [결석] 선택 후 다운로드', note: '필터 적용 후 다운로드' },
    ],
    cautions: [
      '로컬회원은 보안상 마스킹(*) 적용 — 재무팀에 전달 시 별도 학원 ID 부여',
      '엑셀 sheet 구조: [출석부] = 입반생 / [타반보강생] = 다른 반에서 보강 출석',
      '실시간 출결 후 즉시 다운로드 시 일부 데이터 미반영 가능 → 30초 대기 후 시도',
    ],
    troubleTable: [
      { issue: '엑셀 다운로드 안됨 (회전 무한 로딩)', cause: '백그라운드 데이터 처리 지연 또는 브라우저 차단', solution: '브라우저 팝업 차단 해제 + 새로고침 후 재시도', severity: 'medium' },
      { issue: '출석부 인쇄 시 페이지가 잘림', cause: '학생 수가 많아 한 페이지 초과', solution: '인쇄 미리보기에서 [가로 방향] + [페이지에 맞게 축소] 설정', severity: 'low' },
    ],
    mainItemsTable: null, responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },
};

// 빠른 색인 (RECENT_GUIDES 형식)
export const CS_RECENT = [
  { id: 'video-playback-trouble',  module: '영상/VOD 관리',     title: '복습영상·VOD 재생 오류 트러블슈팅',       updated_at: '2026-05-12', views: 0, helpful: 0, version: 'v1.0', author: '플랫폼서비스실', tags: ['영상', 'VOD', '필수', '자주묻는질문'] },
  { id: 'school-registration-link',module: '고객(원생) 관리',   title: '학원 등록정보 연동 가이드 (학부모 셀프)',  updated_at: '2026-05-12', views: 0, helpful: 0, version: 'v1.0', author: '플랫폼서비스실', tags: ['연동', '회원관리', '필수'] },
  { id: 'privacy-consent-flow',    module: '메시지발송 관리',   title: '개인정보 동의 처리 — 이탈 방지 가이드',     updated_at: '2026-05-12', views: 0, helpful: 0, version: 'v1.0', author: '플랫폼서비스실', tags: ['개인정보', '동의', 'GA4'] },
  { id: 'attendance-print-export', module: '수업운영관리',       title: '출석부 인쇄·엑셀 다운로드 가이드',          updated_at: '2026-05-12', views: 0, helpful: 0, version: 'v1.0', author: '플랫폼서비스실', tags: ['출결', '출석부', '엑셀'] },
];
