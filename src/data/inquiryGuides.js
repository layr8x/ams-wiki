// src/data/inquiryGuides.js
// 단과 오플 실장 카톡 문의 데이터(2025.11.03~2026.05.11, 14,897건) 분석 기반 신규 가이드.
// 분석 결과 기존 위키에 누락된 고빈도 문의 케이스를 표준 답변/절차로 구조화.
// Source: 실장님과의 카카오톡 대화 (시대인재 단과 오플관련 소통)

const CONFLUENCE = 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages';
const AMS = 'https://ams.sdij.com';

// 카톡 문의 빈도와 플서실 표준 응대를 그대로 옮긴 가이드들.
// 각 가이드의 `inquirySource`는 카톡 발생 빈도/대표 케이스를 추적하기 위한 메타데이터.
export const INQUIRY_GUIDES = {

  // ── 결제·환불 ─────────────────────────────────────────────────────────────
  'refund-pending-cancel': {
    type: 'TROUBLE', module: '청구/수납/결제/환불', title: '환불대기 취소 처리 (수작업 요청 절차)',
    updated: '2026-05-11', confluenceId: null,
    author: '플랫폼서비스실', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자', '정산팀'],
    tags: ['환불', '결제', '자주묻는질문'],
    tldr: "환불대기 상태로 잘못 진입한 환불 건을 취소(원복)하는 절차입니다.\n현재 일부 케이스는 권한 부재로 플서실 수작업 처리가 필요하며, 6개월간 카톡 단톡방에 가장 많이 인입된 1순위 요청 유형(환불대기 키워드 136회·환불코드 109회·환불취소 35회)입니다.\n실장 직접 처리 가능 케이스 / 플서실 수작업 케이스를 구분해 정리했습니다.",
    path: 'AMS 어드민 > 청구/수납 관리 > 환불 요청 처리',
    amsUrl: `${AMS}/sell/refund-requests/list`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      kakaoOccurrences: 280,
      topBranches: ['목동(윤연진)', '대치 고3 전반', '분당'],
      sampleRequests: [
        '환불코드 25410 환불대기 취소 부탁드립니다',
        '환불대기 취소가 안되고 있습니다, 확인 부탁드립니다',
        '환불처리에서 수강취소버튼 체크 안했는데 수강료 환불 되었나요?',
      ],
    },
    troubleTable: [
      {
        issue: '실수로 [환불산정] 후 환불대기 상태가 됨',
        cause: '환불 화면에서 [승인취소]·[저장] 클릭 → 환불 요청 큐로 진입',
        solution: 'PG 결제건은 환불상세 팝업에서 [승인취소 취소] 가능. VAN/신한캠퍼스 건은 플서실 카톡방에 [환불코드 #####, 취소 부탁드립니다]로 요청 (작업 대기 평균 12시간)',
        severity: 'medium',
      },
      {
        issue: '신한캠퍼스 부분환불 클릭 후 환불대기 잔존',
        cause: '신한캠퍼스는 부분환불 불가이나 AMS에서 부분환불 실행이 진행됨',
        solution: '전체금액 환불 후 잔액분 별도 청구 생성 → 플서실에 강제취소 접수 요청',
        severity: 'high',
      },
      {
        issue: '환불대기 취소 후에도 화면 잔존',
        cause: '데이터 동기화 지연 또는 회원 병합 이력이 있는 경우 데이터 꼬임',
        solution: '브라우저 강력 새로고침(Ctrl+F5) 후 재확인, 미해소 시 회원번호 + 환불코드로 플서실 재요청',
        severity: 'medium',
      },
    ],
    steps: [
      { title: '환불대기 상태 확인', desc: '회원조회 > 회원상세 > 결제내역(TAB) 또는 환불요청처리 메뉴에서 환불코드와 결제수단 확인.', image: null },
      { title: '결제수단 판별', desc: 'PG카드(온라인) / VAN(단말기) / 신한캠퍼스 / 가상계좌 / 현금 중 어떤 수단인지 확인. 처리 방식이 다름.', image: null },
      { title: 'PG카드 — 직접 취소', desc: '환불코드 클릭 > 환불상세 팝업 > [승인취소 취소] 버튼 클릭 (현재 일부 권한자에게만 노출).', image: null },
      { title: 'VAN/신한캠퍼스/현금 — 플서실 요청', desc: '카톡방에 [환불코드 #####, 취소 부탁드립니다] 메시지. 가능하면 회원명·강좌명 함께 기재.', image: null },
      { title: '처리 완료 확인', desc: '플서실 완료 회신 후 환불요청 목록에서 제거 여부 확인.', image: null },
    ],
    cases: [
      { label: '실장님이 환불처리 잘못 클릭 (실수 케이스)', action: 'PG는 즉시 본인 취소. VAN/신캠/현금은 플서실 카톡 요청.', note: '가장 빈번. 환불취소 시 산정금액 0원 여부 먼저 확인' },
      { label: '학부모 환불 의사 철회', action: '동일하게 환불대기 취소 요청. 결제 그대로 유지됨.', note: '학부모에게는 환불 진행 안됨 안내' },
      { label: '강제취소로 잘못 접수됨', action: '플서실에 [강제취소 취소처리 요청]으로 별도 요청 — 일반 환불취소와 다른 절차', note: '강제취소 취소 기능 개발 예정 (현재 수작업)' },
    ],
    cautions: [
      '환불취소 시 결제는 그대로 유지됨 — 학부모 환불 의사 재확인 후 진행',
      '신한캠퍼스 결제 건은 절대 부분환불 시도 금지 — 전체환불 후 차액 별도 청구 원칙',
      '플서실 작업 평균 12시간 소요 → 긴급 시 멘션(@플랫폼서비스실 황인규 QA 등)으로 우선순위 조정 요청',
    ],
    decisionTable: [
      { cond: '결제수단 = PG카드', action: '본인 직접 취소 가능', note: '환불상세 팝업 [승인취소 취소]', status: 'safe' },
      { cond: '결제수단 = VAN 단말기', action: '플서실 카톡 요청 (수작업)', note: '단말기 환불 영수증 재출력 가능', status: 'warn' },
      { cond: '결제수단 = 신한캠퍼스', action: '플서실 카톡 요청 (수작업)', note: '부분환불 절대 불가', status: 'danger' },
      { cond: '결제수단 = 가상계좌/현금', action: '플서실 카톡 요청 (수작업)', note: '현금영수증 동반 취소 처리', status: 'warn' },
      { cond: '회원 병합 이력 있음', action: '회원번호+환불코드+병합이력 모두 기재하여 요청', note: '데이터 꼬임 가능', status: 'warn' },
    ],
    mainItemsTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── 인증·계정 ─────────────────────────────────────────────────────────────
  'okta-device-reset': {
    type: 'SOP', module: '공통/시스템', title: 'OKTA 인증 기기변경 / 재설정 절차',
    updated: '2026-05-09', confluenceId: null,
    author: '플랫폼서비스실 박여진', version: 'v1.2',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자', '관리자'],
    tags: ['OKTA', '인증', '신규입사자'],
    tldr: "OKTA 앱 삭제/휴대폰 교체/장기 미사용 등으로 인증이 풀린 경우, 플서실 박여진님께 메일로 요청해 기기 정보를 리셋받는 절차입니다.\n6개월간 월 평균 5건 이상 반복 인입된 운영 업무로, 본인 인증 키(Key)가 기기에 고정되어 있어 재설치만으로는 복구되지 않습니다.",
    path: '플랫폼서비스실 메일 요청 (외부 절차)',
    amsUrl: AMS,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      kakaoOccurrences: 42,
      topBranches: ['대치 고3', '목동', '반포'],
      sampleRequests: [
        '핸드폰 변경으로 다시 앱을 깔고 계정추가하려고하니 QR이 있는지 뜨는데요',
        '기기변경으로 인해 okta 앱 인증을 새로 해야 합니다',
        'okta앱이 지워져서 다시 로그인할 수 있는 qr부탁드립니다',
      ],
    },
    steps: [
      {
        title: '요청 메일 작성',
        desc: '아래 양식대로 본인 메일 또는 그룹웨어 메일에서 yeojin@hiconsy.com 으로 발송.',
        image: null,
      },
      {
        title: '필수 기재 사항',
        desc: '소속 / 성함 / 그룹웨어 계정(이메일) / 변경 사유(앱 삭제·기기변경·신규 등록). 사진이나 오류 화면 첨부 시 처리 더 빠름.',
        image: null,
      },
      {
        title: '리셋 완료 회신 대기',
        desc: '평균 30분 ~ 2시간 내 회신. 회신 메일에 재등록 가이드 포함.',
        image: null,
      },
      {
        title: '앱 재설치 및 QR 등록',
        desc: 'OKTA Verify 앱을 새로 설치 → 로그인 시 화면에 표시되는 QR 코드를 카메라로 스캔 → 푸시 알림 인증 설정.',
        image: null,
      },
      {
        title: '로그인 테스트',
        desc: 'ams.sdij.com 접속 후 OKTA 푸시 인증으로 로그인 정상 동작 확인.',
        image: null,
      },
    ],
    mainItemsTable: [
      { field: '수신 메일', desc: 'yeojin@hiconsy.com (플랫폼서비스실 박여진)', required: true },
      { field: '소속', desc: '예) 대치 고3 단과, 목동 정산팀 등', required: true },
      { field: '성함', desc: '실명', required: true },
      { field: '그룹웨어 계정', desc: '예) name@hiconsy.com', required: true },
      { field: '사유', desc: '기기변경 / 앱 삭제 / 장기 미사용 / 신규 입사', required: false },
    ],
    cases: [
      { label: '휴대폰 기기 변경', action: '메일 발송 → 리셋 완료 후 새 기기에서 앱 설치 → QR 등록', note: '구 기기는 자동 해제됨' },
      { label: 'OKTA 앱 실수로 삭제', action: '동일하게 리셋 요청 (재설치만으로는 복구 불가)', note: '인증 Key가 기기에 고정되어 있음' },
      { label: '장기 미사용으로 인증 실패', action: '리셋 + 기존 그룹웨어 비밀번호 재설정 동시 진행 권장', note: '비밀번호는 ID/PW 화면 [암호를 잊으셨나요?] 사용' },
      { label: '반포센터 OKTA 2회 인증 발생', action: '반포 IP에서만 발생한 이력이 있음 — 인프라팀 협의 중', note: '실장 개별 리셋과는 무관' },
    ],
    cautions: [
      'OKTA 앱은 설치+최초인증에 고유 Key를 사용 — 삭제 시 처음부터 재설정 필요',
      '긴급 사용 시 카카오톡 단톡방에 OKTA 케이스로 우선 요청 가능 (단, 메일 발송이 원칙)',
      '신규 입사자 OKTA 계정 발급도 동일 절차로 메일 요청',
    ],
    troubleTable: [
      {
        issue: 'OKTA Verify 앱에서 QR 인식 안됨',
        cause: '카메라 권한 미허용 또는 화면 밝기 부족',
        solution: '앱 권한 재허용 + 화면 밝기 최대로 설정 후 재시도',
        severity: 'low',
      },
      {
        issue: '리셋 후에도 동일 오류 반복',
        cause: '브라우저 캐시·쿠키 잔존 또는 다른 그룹웨어 계정 로그인 상태',
        solution: '시크릿창에서 로그인 시도 또는 인터넷 사용기록(쿠키) 삭제 후 재시도',
        severity: 'medium',
      },
    ],
    responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  // ── 결제 정책 ─────────────────────────────────────────────────────────────
  'shinhan-campus-payment': {
    type: 'DECISION', module: '청구/수납/결제/환불', title: '신한캠퍼스 결제·환불 처리 결정 가이드',
    updated: '2026-05-10', confluenceId: null,
    author: '정산팀 강선아', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '정산팀'],
    tags: ['신한캠퍼스', '결제', '환불', '정책'],
    tldr: "신한캠퍼스(신캠) 결제는 일반 PG/VAN과 달리 **부분환불 불가** · **분할결제 불가** · **AMS 직접 취소 불가** 등 고유 제약이 있습니다.\n잘못 처리 시 학부모 컴플레인과 정산 오류로 이어지므로, 본 결정 가이드의 케이스별 처리 순서를 반드시 따라야 합니다.\n카톡 단톡방 6개월간 신한캠퍼스 키워드 58회 등장 — 가장 많은 정책 혼선 영역.",
    path: 'AMS 어드민 > 청구/수납 관리 > 신한캠퍼스 처리',
    amsUrl: `${AMS}/sell/shinhan-campus`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      kakaoOccurrences: 58,
      topBranches: ['목동(윤연진·김완진)', '대치 고12·고3', '반포'],
      sampleRequests: [
        '신한캠퍼스로 결제를 받았는데 분할결제도 입력이 가능할지',
        '신한캠퍼스 업로드 후 잘못 업로드 된것 삭제할수 있는 기능이 있었으면',
        '재결제를 신한캠퍼스로 처리해야 할때는 어찌해야하나요',
      ],
    },
    decisionTable: [
      {
        cond: '신캠 결제 후 전체 환불 필요 (수강 0회)',
        action: '환불산정 화면에서 신한캠퍼스 전체금액으로 [강제취소 접수] → 정산팀이 강제취소 완료처리',
        note: '직접 PG 취소처럼 처리하면 안 됨',
        status: 'safe',
      },
      {
        cond: '신캠 결제 후 부분 환불 필요 (1회 이상 수강)',
        action: '잔여 수강료 별도 청구 생성 → 학부모 신규 결제 → 신캠 전체 강제취소 접수',
        note: '신캠은 부분환불 절대 불가 (정산팀 공지)',
        status: 'danger',
      },
      {
        cond: '신캠 결제 후 다른 카드로 전환 결제',
        action: '신규 PG/VAN 결제 우선 받기 → 신캠 전체 강제취소 → 정산팀이 강제취소 완료',
        note: '새 결제가 확실히 완료된 것만 확인',
        status: 'warn',
      },
      {
        cond: '한 학생에 신캠 + 현금 분할 결제',
        action: '신캠 먼저 매칭 → 잔액을 현금 수납 (역순 불가)',
        note: '이미 부분수납된 청구는 신캠 매칭 불가',
        status: 'warn',
      },
      {
        cond: '신캠 결제건을 잘못 매칭 (대상 청구 오류)',
        action: '매칭금액 0원인 경우 환불처리 → 신캠 처리화면에서 재매칭',
        note: '실수 잦은 케이스',
        status: 'warn',
      },
      {
        cond: '신캠 매칭된 청구 중 1건만 취소 필요',
        action: '청구를 따로 쪼개 발행한 경우만 가능. 통합 매칭된 경우 전체 강제취소 후 재청구',
        note: '청구 구조 사전 분리가 핵심',
        status: 'danger',
      },
    ],
    mainItemsTable: [
      { field: '신한캠퍼스(신캠)', desc: '신한금융지주가 제공하는 학원 학습비 후불 결제 서비스 (AMS는 매칭 방식 사용)', required: true },
      { field: '강제취소 접수', desc: '신캠 환불 시 사용하는 AMS 절차 — 일반 환불과 다름', required: true },
      { field: '강제취소 완료', desc: '정산팀만 처리 가능한 후속 절차 — 실장은 [접수]까지만', required: true },
    ],
    cases: [
      {
        label: '복합결제 (신캠 + 다른 수단)',
        action: '청구를 분리 생성 후 각각 매칭. 통합 청구 후 분할결제는 불가.',
        note: '실수 시 데이터 꼬임으로 정산팀 수작업 필요',
      },
      {
        label: '이관/전반 시 신캠 결제 처리',
        action: '신캠 결제건은 자동 이관 불가 — 환불 후 재결제 안내',
        note: '학부모에게 사전 양해 필수',
      },
      {
        label: '신캠 결제 후 청구 금액 변동',
        action: '청구 금액 추가 발생 시 추가 청구 생성 후 별도 매칭 (기존 신캠 금액 그대로 유지)',
        note: '변동 금액이 작아도 별도 처리',
      },
    ],
    cautions: [
      '신캠 결제는 AMS에서 직접 카드사 취소가 불가하며 정산팀 강제취소 완료를 거쳐야 함',
      '신캠 결제건 1회라도 수강 발생 시 부분환불 절대 불가 (정산팀 공지)',
      '청구를 미리 분리 생성하면 후속 처리가 훨씬 간단해짐 — 청구 설계 단계에서 고려',
      '신캠 결제 정보가 AMS에 안 뜨는 경우 정산팀에 승인번호로 업로드 요청',
    ],
    steps: null, troubleTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── 결제 트러블 ───────────────────────────────────────────────────────────
  'cti-duplicate-payment': {
    type: 'TROUBLE', module: '청구/수납/결제/환불', title: 'CTI 콜 인입 중 중복결제 처리',
    updated: '2026-05-05', confluenceId: null,
    author: '플랫폼서비스실 조호영', version: 'v1.1',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '정산팀'],
    tags: ['중복결제', '키오스크', 'CTI', '결제'],
    tldr: "키오스크/단말기 결제 중에 CTI(전화 자동 매칭) 콜이 들어오면 결제 화면이 새 탭으로 분기되어 동일 결제가 2회 발생하는 사고입니다.\nAMS에 1건만 잡히고 나머지 1건은 카드사에 승인만 되는 케이스가 빈발 — 학부모는 통장 출금으로 확인됩니다.\n2025.12 이후 단톡방 단골 트러블이며 시스템 개선 진행 중 (5월 기준 미완료).",
    path: 'AMS 어드민 > 청구/수납 관리 > 결제내역',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-12-01 ~ 2026-05-11',
      kakaoOccurrences: 18,
      topBranches: ['목동(키오스크)', '분당', '대치 고3'],
      sampleRequests: [
        '어머님이 결제를 3번했다고 주장하고있어서요! 보내주신 결제내역 확인 후 어머니께서 승인번호 알려주면서 주장',
        '카드 2회 중복 결재건 확인 부탁드립니다 (45434582만 결제 확인되는데 어머님 콜백)',
        '단말기 기계 오류는 아닌 것이 3 기계 접속하였으나 모두 같은 메세지',
      ],
    },
    troubleTable: [
      {
        issue: '카드사 통장에는 2회 출금 / AMS에는 1건만',
        cause: '결제 진행 중 CTI 콜 인입 → 결제 화면 중복 호출 → AMS 측 데이터 연동 누락',
        solution: '학부모에게 누락 승인번호 받기 → AMS에 결제 강제생성 → 강제취소 접수 (정산팀이 완료처리, PG사 취소 3~5일 소요)',
        severity: 'high',
      },
      {
        issue: '키오스크 결제 후 단말기 오류 메시지',
        cause: '결제는 카드사에서 승인 완료되었으나 AMS 응답 누락',
        solution: '카드사 승인번호 확인 → AMS에 강제업로드 후 정상 청구 매칭',
        severity: 'high',
      },
      {
        issue: '동일 학생에 동일 강좌 결제 2건',
        cause: '결제 화면 중복 호출 또는 새로고침 후 재제출',
        solution: '둘 중 1건 강제취소 접수 → 정산팀 완료처리',
        severity: 'high',
      },
    ],
    steps: [
      { title: '학부모 통장/카드사 앱 확인 요청', desc: '학부모 측에 카드사 앱에서 승인번호 2개 확인 요청. 키오스크 영수증도 가능.', image: null },
      { title: 'AMS 결제내역 비교', desc: '회원조회 > 결제내역에서 동일 시점에 잡힌 결제건만 확인. 누락된 승인번호를 식별.', image: null },
      { title: '플서실 카톡방 요청', desc: '실장님 정보로 정리: 학생명/번호, 강좌명, 누락된 승인번호, 결제금액, 학부모 신고시점. 정산팀 또는 플서실 멘션.', image: null },
      { title: '강제취소 접수', desc: '플서실/정산팀이 누락 승인번호를 AMS에 강제 생성 → 강제취소 접수 처리.', image: null },
      { title: '강제취소 완료 확인', desc: 'PG사 측 실 환불 완료까지 3~5영업일 소요. 학부모에게 사전 안내.', image: null },
    ],
    cases: [
      {
        label: '학부모는 2회 결제 주장 / AMS 1건',
        action: '카드사 앱/통장 캡처 받기 → 누락 승인번호 추적 → 강제취소',
        note: '가장 흔한 케이스',
      },
      {
        label: '동일 강좌 다른 학생에 결제됨',
        action: '한쪽 학생 환불처리 + 다른 학생 결제 인정',
        note: 'CTI 호출 시 학생 매칭이 잘못된 경우 발생',
      },
      {
        label: '문자 발송 이력 불일치 (취소 문자 안 옴 등)',
        action: '문자 발송 로그 분석을 플서실에 요청. 실 환불은 카드사 기준으로 진행',
        note: '문자 미수신은 학부모 차단 설정도 의심',
      },
    ],
    cautions: [
      'PG사 강제취소는 3~5영업일 소요 — 학부모에게 사전 안내 필수',
      '학부모 통장 캡처/영수증 사진 확보 후 요청 — 승인번호 없이 추적 어려움',
      '동일한 현상 재발 방지 위해 결제팀에 케이스 누적 보고 (조호영 멘션)',
      'CTI 콜 인입 시 화면 분기 개선이 진행 중 — 현재는 매뉴얼로 대응',
    ],
    responses: null, mainItemsTable: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  // ── 회원 관리 — 학부모 번호 변경 ────────────────────────────────────────
  'parent-phone-change': {
    type: 'SOP', module: '고객(원생) 관리', title: '학부모 대표번호 변경 (부 ↔ 모)',
    updated: '2026-05-08', confluenceId: null,
    author: '플랫폼서비스실 황인규 QA', version: 'v1.3',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자'],
    tags: ['회원관리', '학부모번호', '자주묻는질문'],
    tldr: "학생 계정의 대표 학부모 번호를 변경(예: 아버님→어머님)하는 절차입니다.\n계정 유형(로컬/통합)·중복 여부에 따라 처리 경로가 다르며, 통합회원은 본인이 직접 마이클래스에서 변경해야 합니다.\n6개월 단톡방에서 가장 잦은 회원관리 요청 유형 중 하나(약 50건+).",
    path: 'AMS 어드민 > 고객(원생) 관리 > 회원조회 > 회원상세 > [수정]',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      kakaoOccurrences: 50,
      topBranches: ['대치 고3 전반', '목동', '반포'],
      sampleRequests: [
        '학생 학부모 번호 010-xxxx-xxxx → 010-yyyy-yyyy 변경 부탁드립니다',
        '아버님 번호로 통합회원 가입되어있는경우 어머님 번호로 변경하시길 원하면',
        '이미 어머님 번호로 등록되어 있는 정보가 있다보니 변경이 안됩니다',
      ],
    },
    decisionTable: [
      {
        cond: '로컬회원 — 변경 후 번호가 미사용',
        action: '회원상세 > [수정] 버튼으로 실장 직접 변경 가능',
        note: 'R40004 등 에러 없으면 단순 수정',
        status: 'safe',
      },
      {
        cond: '로컬회원 — 변경 후 번호가 다른 계정과 중복',
        action: '중복 계정을 미사용 처리(010-0000-0000) 후 변경 시도',
        note: '중복 계정 확인 필수',
        status: 'warn',
      },
      {
        cond: '통합회원 — 본인이 직접 변경 가능',
        action: '학부모/학생이 마이클래스 > 회원정보 관리에서 직접 수정 안내',
        note: '관리자 수정 불가 (본인인증 필수)',
        status: 'safe',
      },
      {
        cond: '통합회원 — 본인 변경 거부/불가 (컴플)',
        action: '플서실 카톡 요청 → DB 직접 수정 (강성 컴플 케이스만)',
        note: '학원에 강하게 거부 표명 시',
        status: 'warn',
      },
      {
        cond: '부/모 구분값(라벨) 변경 필요',
        action: '현재 라디오 라벨은 화면 표기용이며 실제 데이터는 모두 "학부모"로 관리 → 기능적으로는 영향 없음',
        note: '본질적 차이 없음 안내',
        status: 'safe',
      },
    ],
    steps: [
      { title: '회원 검색', desc: '회원조회에서 학생명 또는 학생번호로 검색.', image: null },
      { title: '계정 유형 확인', desc: '회원상세 헤더에서 [로컬] / [통합] 라벨 확인.', image: null },
      { title: '로컬회원이면 [수정] 클릭', desc: '회원상세 > 회원명 옆 [수정] 버튼 클릭하여 직접 학부모 번호 변경.', image: null },
      { title: '통합회원이면 본인 변경 안내', desc: '학부모에게 마이클래스 앱 > 전체메뉴 > 회원정보 관리에서 본인 휴대폰 본인인증 후 변경 안내.', image: null },
      { title: '저장 후 SMS 발송 확인', desc: '변경된 번호로 테스트 문자 발송하여 정상 수신 확인.', image: null },
    ],
    cases: [
      {
        label: '아버님 → 어머님 번호로 변경',
        action: '라디오 버튼 라벨 변경은 화면 표시일 뿐 — 실 동작 변화 없음. 번호만 변경하면 OK',
        note: '학부모에게 라디오 라벨 차이 안내 가능',
      },
      {
        label: '학생 번호로 학부모 번호 통일 (R40004 에러)',
        action: '학생 번호 = 학부모 번호 동일 저장 불가 (시스템 제약). 학부모 번호 삭제 후 학생번호로만 운영 필요 시 플서실 DB 수정',
        note: '학생이 본인 번호만 사용하려는 케이스',
      },
      {
        label: '광고성 정보수신 거부로 수강료 문자 안 옴',
        action: '학부모 광고성 수신동의 Y 처리 또는 학생 번호로 결제 안내 발송',
        note: '광고성 거부 시 결제 안내도 차단됨 (시즌 정책)',
      },
    ],
    cautions: [
      '통합회원은 관리자 임의 수정 불가 — 본인인증 절차가 정책상 필수',
      '학생-학부모 동일 번호 저장 불가 → 학생 휴대폰 없음 체크박스 또는 다른 번호 사용',
      '변경 후 광고성 수신동의 / 마케팅 수신동의 상태도 함께 확인 (문자 수신 영향)',
      '같은 번호로 등록된 다른 학생이 있으면 R40004 발생 — 중복 정리 후 재시도',
    ],
    troubleTable: [
      {
        issue: '"동일한 정보로 등록된 회원이 있습니다 (R40004)"',
        cause: '동일 번호로 등록된 다른 회원(미사용 계정 포함) 존재',
        solution: '중복 계정을 010-0000-0000 임시 변경 + 미사용 태그 → 본 작업 재시도',
        severity: 'medium',
      },
      {
        issue: '변경 후 문자 수신 불가',
        cause: '광고성 정보수신 거부 또는 단말 차단',
        solution: '광고성 수신동의 Y 처리 또는 학생번호로 발송 전환',
        severity: 'medium',
      },
    ],
    mainItemsTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── 결제 운영 ─────────────────────────────────────────────────────────────
  'payment-url-expired': {
    type: 'TROUBLE', module: '메시지발송 관리', title: '결제 URL 만료 / 미수신 트러블슈팅',
    updated: '2026-05-10', confluenceId: null,
    author: '플랫폼서비스실 차주희 QA', version: 'v1.1',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '운영자'],
    tags: ['결제URL', 'SMS', '자주묻는질문'],
    tldr: "결제 요청 URL은 발송 후 **4일** 유효이며, 만료/미수신/문자 발송 차단 등 다양한 원인으로 결제 실패가 발생합니다.\n광고성 수신동의 N · 발신번호 차단 · '기타' 번호 발송 등 6가지 대표 원인을 진단할 수 있는 체크리스트입니다.",
    path: 'AMS 어드민 > 메시지발송 관리 / 회원상세 > 결제 요청 URL',
    amsUrl: `${AMS}/message`,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      kakaoOccurrences: 35,
      topBranches: ['목동', '반포', '대치 라이브'],
      sampleRequests: [
        '11/24에 발송된 결제링크인데 열리지 않습니다',
        '결제 url 보면 34만원만 보여서 그것만 결재하셨다 합니다',
        '결제요청URL 발송 클릭하면 점검중이란 메세지가 뜹니다',
      ],
    },
    troubleTable: [
      {
        issue: 'URL 클릭 시 "만료된 결제 링크" 메시지',
        cause: '결제 URL 유효기간 4일 경과',
        solution: '회원상세 또는 청구관리에서 [결제 URL 재발송] 클릭',
        severity: 'low',
      },
      {
        issue: '학부모가 문자를 못 받았다고 함',
        cause: '광고성 수신동의 거부 / 발신번호 차단 / 학생번호 입력 누락',
        solution: '회원상세에서 광고성동의 Y 확인 + 학부모 번호 정확성 확인 + 학생번호로 재발송',
        severity: 'medium',
      },
      {
        issue: 'URL 진입 후 일부 금액만 표시',
        cause: '동일 청구를 두 번 열면서 한쪽 금액만 결제됨 (잔액만 남아 있는 상태)',
        solution: '결제 완료 부분 제외하고 잔액 청구 재발송 또는 새 청구로 발송',
        severity: 'medium',
      },
      {
        issue: '[기타] 번호로만 발송됨',
        cause: '학부모앱 배포 후 기타 번호가 자동 추가됨 (의미 없음)',
        solution: '발송 시 [대표학부모] 체크박스 선택하여 발송',
        severity: 'medium',
      },
      {
        issue: '"점검중" 메시지로 발송 불가',
        cause: '플서실 긴급 작업/롤백 중 — 시스템 일시 차단',
        solution: '플서실 공지 확인 후 대기, 또는 가상계좌/현장결제로 우회',
        severity: 'high',
      },
      {
        issue: '"수신대상이 0명" 오류 (2025.12.01)',
        cause: '결제URL 발송 기능 오류 (이미 수정 완료된 케이스)',
        solution: '동일 증상 재발 시 플서실 즉시 보고',
        severity: 'high',
      },
    ],
    steps: [
      { title: 'URL 만료 여부 확인', desc: '발송일 + 4일 경과 여부 우선 확인.', image: null },
      { title: '수신 동의 상태 확인', desc: '회원상세 > 수신동의 항목에서 학부모 광고성 수신동의 Y 여부 확인.', image: null },
      { title: '발신 번호 차단 여부 안내', desc: '학부모 단말에서 02·1577 등 발신번호 스팸 차단 설정 안내 (개인 단말 차단)', image: null },
      { title: '대체 발송 경로', desc: '학생 번호로 재발송 / 가상계좌 발급 + 안내 문자 / 현장 결제 안내', image: null },
      { title: '문자 발송 이력 조회', desc: '발송 이력 확인 후 발송 성공/실패 코드 체크', image: null },
    ],
    decisionTable: [
      { cond: '학부모 광고성 수신동의 N', action: '학생번호로 발송 또는 동의 변경 안내', note: '학원 정책상 마케팅 수신동의 필수', status: 'warn' },
      { cond: '발송 후 4일 경과', action: 'URL 재발송', note: 'AMS 정책 유효기간', status: 'safe' },
      { cond: '"기타" 번호로만 발송됨', action: '대표학부모 체크 후 재발송', note: '학부모앱 배포 영향', status: 'warn' },
      { cond: '결제 일부만 완료된 상태', action: '잔액 청구 별도 발송', note: '동일 URL 재진입 시 다른 금액 노출', status: 'warn' },
      { cond: '시스템 점검 알림', action: '플서실 공지 확인 후 우회', note: '긴급 시 가상계좌', status: 'danger' },
    ],
    cautions: [
      '결제 URL은 회원별 고유값 — 학부모가 타인에게 공유하지 않도록 안내',
      '광고성 수신동의 N 상태에서는 결제 안내도 자동 차단 — 사전 동의 받아야 함',
      '4일 만료 정책은 보안상 변경 불가 — 만료 안내를 발송 시 함께 포함',
    ],
    responses: null, mainItemsTable: null, cases: null, referenceData: null, policyDiff: null,
  },

  // ── 라이브 데이터 격리 ────────────────────────────────────────────────
  'live-data-isolation': {
    type: 'RESPONSE', module: '공통/시스템', title: '라이브(sdijon) 수강 데이터 이관 불가 안내',
    updated: '2026-05-06', confluenceId: null,
    author: '플랫폼서비스실 황인규 QA', version: 'v1.0',
    views: 0, helpful: 0, helpfulRate: 0,
    targets: ['실장', '대치 라이브', 'CS 담당'],
    tags: ['라이브', '계정', '응대'],
    tldr: "라이브 수강 이력(sdijon)은 AMS와 분리된 시스템에 저장되어 있어 관리자가 임의로 이관/병합할 수 없습니다.\n학생이 통합회원 계정을 잘못 만들었거나 이메일 해킹 등의 사유로 계정 변경을 원할 때 표준 응대 스크립트입니다.",
    path: '계정 통합 시 — 마이클래스 + 라이브 양쪽 확인 필수',
    amsUrl: AMS,
    confluenceUrl: null,
    inquirySource: {
      period: '2025-11-03 ~ 2026-05-11',
      kakaoOccurrences: 22,
      topBranches: ['대치 라이브', '대치 고3'],
      sampleRequests: [
        '학생이 이메일 해킹당했다고 주장 — hermionekim08@naver.com → hermionekim_08로 통합 부탁',
        '계정이 무려 4개입니다. 라이브 수업 강은양/강기원T 수강중',
        '라이브 데이터는 저희가 이관할수가 없습니다',
      ],
    },
    responses: [
      {
        scenario: '학생이 계정을 합치고 싶어함 (라이브 + AMS 양쪽 수강)',
        script: "라이브 수강 데이터는 시스템상 이관이 어렵습니다. 두 가지 방법을 안내드립니다: (1) AMS 데이터를 라이브 계정 쪽으로 이관 → 한쪽 계정만 사용. (2) 라이브를 직접 환불 후 본인이 원하는 계정에서 재결제. 두 방법 중 학부모와 협의 후 선택해 주세요.",
      },
      {
        scenario: '이메일 해킹/유출로 통합회원 이메일 변경 요청',
        script: "계정을 새로 만드시는 것은 권장드리지 않습니다. 기존 계정의 이메일만 새로운 주소로 변경해 드릴 수 있어 라이브와 AMS 양쪽 데이터를 그대로 유지할 수 있습니다. 변경할 새 이메일 주소(통합회원으로 가입되지 않은 신규 주소)를 전달해 주세요.",
      },
      {
        scenario: '통합회원 2~4개 다중 생성 케이스',
        script: "각 계정의 실제 사용 이력(라이브 수강 / AMS 수강)을 먼저 정리해 드린 후, 가장 중요한 계정 1개만 남기고 나머지는 본인이 직접 마이클래스에서 탈퇴 처리하도록 안내드립니다. AMS 측 데이터는 저희가 통합해 드릴 수 있습니다.",
      },
      {
        scenario: '학생이 직접 비밀번호를 모름 (오래된 계정)',
        script: "마이클래스 앱 > 비밀번호 재설정 또는 이메일 찾기로 복구 가능합니다. 복구가 불가하시면, 사용하실 계정 한 개만 명확히 정해 주시면 나머지 계정은 정리만 도와드릴 수 있습니다.",
      },
    ],
    decisionTable: [
      { cond: '라이브 + AMS 모두 수강 이력 있음', action: '라이브 쪽으로 AMS 데이터 통합 or 라이브 환불 후 재결제', note: '학부모 협의 필수', status: 'warn' },
      { cond: 'AMS만 수강 / 라이브 미사용', action: 'AMS 정상 병합 절차', note: '일반 케이스', status: 'safe' },
      { cond: '이메일 해킹/유출 (이메일만 변경)', action: '플서실에 신규 이메일 주소 전달 → 이메일 정보만 변경', note: '데이터 유지', status: 'safe' },
      { cond: '학생이 통합회원 모두 탈퇴 원함', action: '마이클래스 채널톡으로 본인 안내', note: '본인 탈퇴만 가능', status: 'safe' },
    ],
    cautions: [
      '라이브 데이터는 AMS와 분리되어 있어 관리자가 옮길 수 없음 — 학부모 양해 필수',
      '복잡한 케이스는 마이클래스 카카오톡 채널 (pf.kakao.com/_VGAQn)로 직접 인입 안내',
      '한 번 환불 후 재결제 안내 시 회차 진행도/잔여 가치 명확히 산정해 안내',
    ],
    steps: null, mainItemsTable: null, cases: null, troubleTable: null, referenceData: null, policyDiff: null,
  },
};

// 이 가이드들의 빠른 색인 (RECENT_GUIDES 형식과 호환).
export const INQUIRY_RECENT = [
  { id: 'refund-pending-cancel', module: '청구/수납/결제/환불', title: '환불대기 취소 처리 (수작업 요청 절차)', updated_at: '2026-05-11', views: 0, helpful: 0, version: 'v1.0', author: '플랫폼서비스실', tags: ['환불', '자주묻는질문', '실장'] },
  { id: 'okta-device-reset', module: '공통/시스템', title: 'OKTA 인증 기기변경 / 재설정 절차', updated_at: '2026-05-09', views: 0, helpful: 0, version: 'v1.2', author: '플랫폼서비스실 박여진', tags: ['OKTA', '인증', '신규입사자'] },
  { id: 'shinhan-campus-payment', module: '청구/수납/결제/환불', title: '신한캠퍼스 결제·환불 처리 결정 가이드', updated_at: '2026-05-10', views: 0, helpful: 0, version: 'v1.0', author: '정산팀 강선아', tags: ['신한캠퍼스', '결제', '정책'] },
  { id: 'cti-duplicate-payment', module: '청구/수납/결제/환불', title: 'CTI 콜 인입 중 중복결제 처리', updated_at: '2026-05-05', views: 0, helpful: 0, version: 'v1.1', author: '플랫폼서비스실 조호영', tags: ['중복결제', '키오스크', '결제'] },
  { id: 'parent-phone-change', module: '고객(원생) 관리', title: '학부모 대표번호 변경 (부 ↔ 모)', updated_at: '2026-05-08', views: 0, helpful: 0, version: 'v1.3', author: '플랫폼서비스실 황인규 QA', tags: ['회원관리', '학부모번호', '자주묻는질문'] },
  { id: 'payment-url-expired', module: '메시지발송 관리', title: '결제 URL 만료 / 미수신 트러블슈팅', updated_at: '2026-05-10', views: 0, helpful: 0, version: 'v1.1', author: '플랫폼서비스실 차주희 QA', tags: ['결제URL', 'SMS', '자주묻는질문'] },
  { id: 'live-data-isolation', module: '공통/시스템', title: '라이브(sdijon) 수강 데이터 이관 불가 안내', updated_at: '2026-05-06', views: 0, helpful: 0, version: 'v1.0', author: '플랫폼서비스실 황인규 QA', tags: ['라이브', '계정', '응대'] },
];
