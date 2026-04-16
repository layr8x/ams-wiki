/**
 * AMS Wiki Mock 데이터
 * AMS 좌측 메뉴 순서: 모집/접수 → 강좌/교재관리 → 수업운영관리 → 청구/수납 → 장학혜택 → 메시지발송 → 고객(원생) → 학원관리 → 선생님 → Admin → 매출/정산
 * Confluence FVSOL 스페이스 원본 데이터 기반
 */

/* ── AMS 메뉴 순서 기반 모듈 ── */
export const MODULES = [
  { id: 'recruit',   label: '모집/접수 관리',      icon: 'ClipboardList', guide_count: 2,  description: '모집 신청, 접수 관리, 대기번호 처리' },
  { id: 'course',    label: '강좌/교재관리',        icon: 'BookOpen',      guide_count: 3,  description: '강좌 생성, 교재 등록, 회차 관리' },
  { id: 'operation', label: '수업운영 관리',        icon: 'Calendar',      guide_count: 5,  description: '입/퇴반, 전반, 출결 처리, 동보/복습영상' },
  { id: 'billing',   label: '청구/수납/결제/환불',  icon: 'CreditCard',    guide_count: 8,  description: '청구 생성, 결제 처리, 전환결제, 환불 관리' },
  { id: 'benefit',   label: '장학혜택 관리',        icon: 'Gift',          guide_count: 1,  description: '장학혜택(쿠폰) 등록, 적용, 관리' },
  { id: 'message',   label: '메시지발송 관리',      icon: 'MessageSquare', guide_count: 2,  description: '문자 발송, 가상계좌 안내, 결제 문자' },
  { id: 'member',    label: '고객(원생) 관리',      icon: 'Users',         guide_count: 5,  description: '회원 등록, 계정 통합/병합, 회원 정보 수정' },
  { id: 'academy',   label: '학원관리',             icon: 'Building',      guide_count: 1,  description: '학원 정보, 캠퍼스 설정' },
  { id: 'teacher',   label: '선생님(파트너) 관리',  icon: 'GraduationCap', guide_count: 1,  description: '강사 등록, 권한 설정' },
  { id: 'admin',     label: 'Admin 관리',           icon: 'Shield',        guide_count: 2,  description: '시스템 설정, 권한 관리, 계정/권한' },
  { id: 'revenue',   label: '매출/정산관리',        icon: 'BarChart3',     guide_count: 1,  description: '매출 집계, 정산 처리, 리포트' },
]

/* ── 사이드바용 모듈 그룹 ── */
export const MODULE_GROUPS = {
  recruit:   [{ id: 'recruit-reg', label: '접수/모집 가이드' }],
  course:    [{ id: 'course-guide', label: '강좌 관리 가이드' }, { id: 'material-guide', label: '교재 관리' }],
  operation: [{ id: 'enroll-guide', label: '입/퇴반·전반' }, { id: 'attend-guide', label: '출결 관리' }, { id: 'video-guide', label: '동보/복습영상' }],
  billing:   [{ id: 'charge-guide', label: '청구 가이드' }, { id: 'pay-guide', label: '결제 가이드' }, { id: 'refund-guide', label: '환불 가이드' }],
  benefit:   [{ id: 'benefit-guide', label: '장학혜택 가이드' }],
  message:   [{ id: 'msg-guide', label: '메시지 발송 가이드' }],
  member:    [{ id: 'member-guide', label: '회원 관리 가이드' }, { id: 'merge-guide', label: '계정 통합/병합' }],
  academy:   [{ id: 'academy-guide', label: '학원 설정' }],
  teacher:   [{ id: 'teacher-guide', label: '강사 관리' }],
  admin:     [{ id: 'admin-guide', label: '시스템 설정' }, { id: 'auth-guide', label: '권한 관리' }],
  revenue:   [{ id: 'revenue-guide', label: '정산 관리' }],
}

/* ── 전체 가이드 (AMS 메뉴 순서) ── */
export const GUIDES = [

  /* ━━━ 수업운영 관리 ━━━ */
  {
    id: 'enroll-transfer',
    module: '수업운영 관리', module_id: 'operation', guide_type: 'sop',
    title: '전반 가이드',
    version: 'v3', author: '박혜선', updated_at: '2026-03-15',
    target_roles: ['운영자', '실장'],
    tags: ['전반', '입반', '퇴반', '수강료이관'],
    summary: '전반 전 강좌의 퇴반일 설정 이후, 청구된 수강료의 출석예정 출결박스 및 연결교재의 수령예정 배부박스가 전반 후 강좌로 이동하는 절차입니다.',
    menu_path: 'AMS > 수업운영관리 > 수업관리 > 입반생 조회',
    deeplink: 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1934295041',
    steps: [
      { title: '전반 전 강좌에서 퇴반 회차 선택', description: '전반 전 강좌에서 몇 회차 수업 후 퇴반할지 선택합니다. 전반 후 강좌의 입반 회차는 자동 설정됩니다.', warning: null, screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=전반+회차+선택+화면' },
      { title: '전반 후 강좌 출결·배부박스 미리보기', description: '전반 후 강좌에 만들어질 수강료 출결박스와 교재 배부박스를 시각적으로 확인합니다.', warning: null, screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=출결·배부+미리보기' },
      { title: '이관 대상 수강료 정보 확인', description: '전반 전 강좌 (실결제금액 - 이용금액 - 이용예정금액)이 전반 후 강좌로 이관됩니다.', warning: null },
      { title: '이관 대상 연결교재 확인', description: '배부회차가 끝나지 않은 수령예정 상태 교재가 이관됩니다.', warning: '수령예정 교재 중 배부회차가 종료된 교재는 수동 처리(수령완료/취소/반납)가 필요합니다.' },
      { title: '전반 처리 실행', description: '[전반처리] 버튼을 클릭합니다. 완료 후 필요 시 전반 후 강좌에서 청구를 추가 생성하세요.', warning: null },
    ],
    fields: [
      { name: '퇴반 회차', description: '전반 전 강좌에서 마지막으로 수강할 회차', example: '5회차', required: '필수' },
      { name: '입반 회차', description: '전반 후 강좌에서 처음 수강할 회차 (자동)', example: '6회차', required: '자동' },
    ],
    cases: [
      { label: '쿠폰(혜택) 변경 필요로 전반 불가한 경우', steps: ['전반 처리 불가 안내문구 확인', '퇴반 처리 후 입반 처리로 진행'], note: '"혜택(쿠폰) 변경이 필요해 전반처리가 불가능합니다" 안내' },
      { label: '이전 출석상태가 남아 있는 경우', steps: ['전반 전 강좌에서 선택 회차 이후 출석상태 확인', '수업일이 지난 출석예정 회차 출결 처리 후 재시도'], note: null },
      { label: '전반 후 강좌에 기존 입반기간과 중복되는 경우', steps: ['[주의!! 재등록 강좌] 안내문구 확인', '이전 입반기간의 청구/환불 내역 정리 후 재시도'], note: null },
      { label: '한 회차도 수강하지 않고 전반하는 경우', steps: ['"수강하지 않음" 선택 → 입/퇴반일 동일 설정'], note: '수강 회차 없으면 퇴반 후 입반 처리를 권장합니다.' },
    ],
    cautions: [
      '수령예정 교재 중 배부회차 종료된 건은 수동 수령완료/취소/반납 처리 필요.',
      '전반 후 강좌에 출결·배부박스가 없을 수 있음. 처리 후 청구를 새로 생성하세요.',
    ],
    issues: [
      { problem: '전반 처리 버튼 비활성화', cause: '전반 불가 조건 해당 (쿠폰/출결/중복입반 등)', solution: '화면 안내 문구 확인 후 해당 조건 해소', severity: '보통' },
      { problem: '이관 금액 0원 표시', cause: '모든 회차 수강 + 교재 배부 완료', solution: '전반 후 강좌에서 청구를 새로 생성', severity: '보통' },
    ],
    related_guides: [
      { id: 'enroll-unpaid-exit', title: '미납자 퇴반처리 방법', module: '수업운영 관리' },
      { id: 'billing-refund', title: '환불·금액 변경 가이드', module: '청구/수납/결제/환불' },
    ],
  },

  {
    id: 'enroll-unpaid-exit',
    module: '수업운영 관리', module_id: 'operation', guide_type: 'sop',
    title: '미납자 퇴반처리 방법',
    version: 'v1', author: '박미혜', updated_at: '2026-02-04',
    target_roles: ['운영자'],
    tags: ['퇴반', '미납', '수업관리'],
    summary: '납부 잔여회차(이용가능회차)가 0인 미납 학생을 일괄 퇴반 처리하는 방법입니다.',
    menu_path: 'AMS > 수업운영관리 > 수업관리',
    deeplink: 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1555169309',
    steps: [
      { title: 'AMS > 수업운영관리 > 수업관리 진입', description: '상단 메뉴에서 수업운영관리 > 수업관리를 선택합니다.', warning: null, screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=수업관리+메뉴+진입' },
      { title: '강좌명 선택 후 수업관리 상세 진입', description: '퇴반 처리할 강좌를 선택합니다.', warning: null },
      { title: '입반생 조회 및 미납자 확인', description: '[입반생 조회 검색] 클릭 후 "납부잔여회차(이용가능회차) = 0"인 학생 확인.', warning: null, screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=입반생+목록+화면' },
      { title: '퇴반 처리할 학생 선택', description: '체크박스로 퇴반 대상 학생을 선택합니다.', warning: null },
      { title: '퇴반일 설정 및 퇴반처리', description: '좌측 상단 퇴반일을 선택 후 [퇴반처리] 클릭.', warning: '퇴반일은 이용금액 산정 기준이 되므로 정확히 입력하세요.' },
    ],
    fields: [],
    cases: [],
    cautions: ['퇴반 처리 전 학생·학부모 사전 안내 필요.', '퇴반일은 이용금액 산정 기준이므로 정확히 입력.'],
    issues: [],
    related_guides: [{ id: 'enroll-transfer', title: '전반 가이드', module: '수업운영 관리' }],
  },

  /* ━━━ 청구/수납/결제/환불 ━━━ */
  {
    id: 'billing-conversion',
    module: '청구/수납/결제/환불', module_id: 'billing', guide_type: 'sop',
    title: '전환결제 기능 가이드',
    version: 'v2', author: '김수민', updated_at: '2026-02-18',
    target_roles: ['운영자', '실장'],
    tags: ['전환결제', 'PG', 'VAN', '결제수단변경'],
    summary: '기존 결제 내역의 결제수단을 변경하는 처리 방식입니다. 새 결제를 먼저 생성한 뒤 기존 결제를 취소하는 구조로 진행됩니다.',
    menu_path: 'AMS > 고객(원생)관리 > 회원상세 > 결제내역(TAB)',
    deeplink: 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1798897665',
    steps: [
      { title: '회원 상세 > 결제내역 탭 진입', description: '회원 조회 후 결제내역 탭으로 이동합니다.', warning: null, screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=결제내역+TAB+화면' },
      { title: '전환결제 할 결제 내역 선택', description: '전환할 결제 건 체크 후 [전환결제] 버튼 클릭.', warning: null },
      { title: '전환결제 팝업에서 결제수단 선택', description: '온라인 URL 발송 또는 현장 처리를 선택합니다.', warning: '전환결제 완료 후 환불 취소가 불가합니다.' },
      { title: '기존 결제 건 환불 처리', description: 'PG 카드는 자동 완료. VAN/가상계좌/현금은 수동 처리 필요.', warning: 'VAN/가상계좌/현금은 환불상세에서 이체완료 처리 필수.' },
    ],
    fields: [
      { name: '납부코드', description: '전환결제 기준 결제 식별 코드', example: 'PAY-20260101-001', required: '필수' },
      { name: '전환 결제수단', description: '변경할 새 결제수단', example: 'PG카드, 가상계좌, VAN카드, 현금', required: '필수' },
    ],
    cases: [
      { label: '기존 결제수단이 VAN 신용카드인 경우', steps: ['신규 결제 완료', '[승인취소] 또는 [강제취소] 진행'], note: null },
      { label: '기존 결제수단이 가상계좌/현금인 경우', steps: ['신규 결제 완료', '기존 데이터 "환불대기" 확인', '환불요청처리 > [이체완료 처리]'], note: null },
      { label: '기존 결제수단이 PG 신용카드인 경우', steps: ['신규 결제 완료', '기존 데이터 자동 환불완료 확인', 'AMS 추가 작업 불필요'], note: null },
    ],
    cautions: ['전환결제 건은 환불 취소 불가.', '입금대기/500원 미만 결제 건은 전환결제 불가.', 'VAN·가상계좌·현금은 수동 환불 처리 필수.'],
    issues: [
      { problem: '"입금대기 상태 결제건 전환 불가"', cause: '입금대기 결제 건 선택', solution: '입금 완료 후 재시도', severity: '보통' },
      { problem: '전환 후 기존 결제 환불대기 상태', cause: 'VAN/가상계좌/현금 자동 환불 미지원', solution: '환불요청처리 > 이체완료 수동 처리', severity: '높음' },
    ],
    related_guides: [{ id: 'billing-refund', title: '환불·금액 변경 가이드', module: '청구/수납/결제/환불' }],
  },

  {
    id: 'billing-refund',
    module: '청구/수납/결제/환불', module_id: 'billing', guide_type: 'sop',
    title: '환불·금액 변경 가이드',
    version: 'v2', author: '김수민', updated_at: '2026-02-18',
    target_roles: ['운영자', '실장'],
    tags: ['환불', '금액변경', '청구취소', '환불추가결제'],
    summary: '수강 취소 또는 금액 변경 시 환불 처리 및 추가결제 관리 방법을 안내합니다.',
    menu_path: 'AMS > 청구/수납관리 > 환불요청처리',
    deeplink: 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1867350030',
    steps: [
      { title: '환불 대상 확인', description: '환불 사유와 환불 금액(이용금액 차감 후 잔액)을 확인합니다.', warning: null },
      { title: '환불 처리 유형 선택', description: '환불수단 변경, 환불취소, 일괄 청구취소 중 선택.', warning: null },
      { title: '환불 실행', description: '해당 메뉴에서 환불을 실행합니다.', warning: '실장 승인이 필요한 환불 건은 승인 후 처리하세요.' },
      { title: '환불 완료 확인', description: '환불 상태가 "환불완료"로 변경 확인.', warning: null },
    ],
    fields: [],
    cases: [
      { label: '환불수단 변경이 필요한 경우', steps: ['환불요청처리 진입', '해당 건 선택 > [환불수단 변경]', '새 환불수단 선택 후 처리'], note: null },
      { label: '환불취소가 필요한 경우', steps: ['환불완료 건 > [환불취소]', '실장 승인 후 처리'], note: '전환결제 건은 환불취소 불가.' },
      { label: '일괄 청구취소 (2024-12-23 신규 기능)', steps: ['AMS > 청구관리 > 일괄 청구취소 진입', '취소 대상 선택', '[일괄 청구취소] 실행'], note: null },
    ],
    cautions: ['환불 금액은 이용금액 차감 후 산정.', '전환결제 건 환불취소 불가.', '실장 승인 필요 건은 반드시 승인 절차 진행.'],
    issues: [{ problem: '환불완료 처리 안 됨', cause: 'VAN/현금 수동 이체 누락', solution: '환불요청처리 > [이체완료 처리]', severity: '높음' }],
    related_guides: [{ id: 'billing-conversion', title: '전환결제 기능 가이드', module: '청구/수납/결제/환불' }],
  },

  {
    id: 'billing-decision',
    module: '청구/수납/결제/환불', module_id: 'billing', guide_type: 'decision_tree',
    title: '환불 승인 기준 판단 가이드',
    version: 'v2', author: '김수민', updated_at: '2026-04-10',
    target_roles: ['실장', '관리자'],
    tags: ['환불', '승인기준', '판단분기'],
    summary: '환불 요청 시 승인 여부를 판단하는 의사결정 기준입니다. 실장 승인이 필요한 케이스를 명확히 구분합니다.',
    menu_path: 'AMS > 청구/수납관리 > 환불요청처리',
    deeplink: '#',
    steps: [
      { title: '환불 요청 접수', description: '학부모/학생의 환불 요청 사유, 입반일, 퇴반일, 결제 금액 확인.', warning: null },
      { title: '이용금액 산정', description: '퇴반일까지의 수업 회차 × 회차당 수강료로 이용금액 산정.', warning: '산정 기준은 강좌 유형(재종/단과)에 따라 다름.' },
      { title: '아래 판단 기준표에서 해당 케이스 확인', description: '상황을 매칭하여 처리 방법과 승인 필요 여부를 확인합니다.', warning: null },
    ],
    decision_rows: [
      { condition: '입반 후 7일 이내, 수강 0회차', action: '전액 환불 처리', note: '자동 승인', requires_manager: false },
      { condition: '입반 후 7일 초과, 수강 1회차 이상', action: '이용금액 차감 후 잔액 환불', note: '실장 승인', requires_manager: true },
      { condition: '교재 수령 완료', action: '교재비 별도 공제 후 환불', note: '실장 승인', requires_manager: true },
      { condition: '중복결제 발생', action: '중복결제 금액 전액 환불', note: '자동 승인', requires_manager: false },
      { condition: '수강 50% 이상 완료', action: '잔여 수강료의 50% 환불', note: '실장 + 본사 확인', requires_manager: true },
      { condition: '무단 장기 미납 퇴반', action: '이용금액 차감 후 잔액만 환불', note: '실장 승인', requires_manager: true },
    ],
    fields: [],
    cases: [],
    cautions: ['카드 환불은 3-5 영업일 소요.', '2026-04-01부터 환불 가능 기간 14→7일로 단축.'],
    issues: [{ problem: '환불 버튼 비활성화', cause: '이미 환불 처리 또는 전환결제 중', solution: '환불 상태 확인 후 담당자 문의', severity: '보통' }],
    related_guides: [
      { id: 'billing-refund', title: '환불·금액 변경 가이드', module: '청구/수납/결제/환불' },
      { id: 'policy-refund-2026', title: '2026년 환불 정책 변경', module: '청구/수납/결제/환불' },
    ],
  },

  {
    id: 'policy-refund-2026',
    module: '청구/수납/결제/환불', module_id: 'billing', guide_type: 'policy',
    title: '2026년 환불 정책 변경 안내',
    version: 'v1', author: '김수민', updated_at: '2026-04-01',
    target_roles: ['운영자', '실장', '관리자'],
    tags: ['정책변경', '환불기준', '2026'],
    summary: '2026년 4월 1일부로 적용되는 환불 정책 변경 사항입니다.',
    menu_path: 'AMS > 청구/수납관리 > 환불요청처리',
    deeplink: '#',
    apply_date: '2026-04-01',
    apply_scope: '단과 전 캠퍼스 공통 적용',
    steps: [],
    policy_rows: [
      { item: '입반 후 환불 가능 기간', before: '14일 이내', after: '7일 이내', changed: true },
      { item: '수강 50% 이후 환불', before: '잔여 수강료 100%', after: '잔여 수강료 50%', changed: true },
      { item: '교재 환불 기준', before: '개봉 전 100%', after: '개봉 전 100%', changed: false },
      { item: '환불 처리 소요', before: '5-7 영업일', after: '3-5 영업일', changed: true },
      { item: '중복결제 환불', before: '자동 환불', after: '자동 환불', changed: false },
      { item: '실장 승인 기준', before: '수강 1회차 이상', after: '입반 7일 초과 또는 수강 1회차 이상', changed: true },
    ],
    fields: [], cases: [],
    cautions: ['2026-04-01 이전 신청 건은 기존 정책 적용.', '전 캠퍼스 공통.'],
    issues: [],
    related_guides: [
      { id: 'billing-refund', title: '환불·금액 변경 가이드', module: '청구/수납/결제/환불' },
      { id: 'billing-decision', title: '환불 승인 기준 판단', module: '청구/수납/결제/환불' },
    ],
  },

  /* ━━━ 고객(원생) 관리 ━━━ */
  {
    id: 'member-merge',
    module: '고객(원생) 관리', module_id: 'member', guide_type: 'sop',
    title: 'AMS 회원 병합 가이드',
    version: 'v13', author: '신정현', updated_at: '2026-04-13',
    target_roles: ['운영자', '실장'],
    tags: ['병합', '계정이관', '통합회원'],
    summary: '학생이 마이클래스에서 직접 수강정보 연동을 못하는 경우, 관리자가 AMS에서 수동으로 계정을 병합하는 절차입니다.',
    menu_path: 'AMS > 고객(원생)관리 > 회원 병합',
    deeplink: 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1815216142',
    steps: [
      { title: '병합 필요 여부 확인', description: '마이클래스 "학원 등록 정보 연동" 조건 미충족 시에만 수동 병합. 가능하면 회원 직접 연동 안내.', warning: '동일 회원 확인된 계정끼리만 병합 가능. 이름 등 개인정보 다르면 확인 후 작업.', screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=회원+병합+메뉴+진입' },
      { title: 'FROM / TO 회원 정보 입력', description: 'AMS > 회원 병합 화면에서 FROM(이관) 회원과 TO(받을) 회원의 회원명·회원번호 입력.', warning: null, screenshot: 'https://placehold.co/720x360/E3F2FD/2E75B6?text=FROM·TO+입력+화면' },
      { title: '정보 검토 후 확인', description: 'FROM·TO 회원 정보 검토 → [확인] 클릭.', warning: 'FROM이 로컬계정이면 병합 시 자동 탈퇴 처리.' },
      { title: '병합 완료 확인', description: 'TO 회원 상세에서 이관된 입반·접수·결제·환불 이력 검증.', warning: null },
    ],
    fields: [
      { name: 'FROM 회원', description: '정보를 이관할(없앨) 회원', example: '홍길동 / 123456', required: '필수' },
      { name: 'TO 회원', description: '정보를 받을(유지할) 회원', example: '홍길동 / 789012', required: '필수' },
    ],
    cases: [
      { label: '로컬 2개 중 1개만 AMS 데이터 있음', steps: ['데이터 있는 계정 TO로 설정', '병합 후 FROM 계정 미사용 태그 처리', '번호 010-0000-0000 변경'], note: null },
      { label: '로컬 2개 모두 AMS 데이터 있음', steps: ['FROM 결제 취소 → TO에서 재결제', 'FROM 퇴반/접수 취소 → TO에서 입반/접수', 'FROM 번호 변경 + 미사용 태그'], note: '대기 순번: 유지 중요→기존 계정 유지, 이관 중요→취소 후 신규 접수(후순위).' },
      { label: '통합+로컬, 통합에 AMS 데이터 없음', steps: ['수동 처리 불필요', '회원 직접 통합회원 로그인 후 계정 연동'], note: null },
    ],
    cautions: [
      '병합은 되돌릴 수 없음. 동일 회원 여부 반드시 확인.',
      'FROM 로컬 계정은 병합 후 자동 탈퇴 → 검색 제외.',
      '대기번호 이관 시 양쪽 모두 데이터 있으면 빠른 순번으로.',
    ],
    issues: [
      { problem: '"동일 회원 병합 불가"', cause: 'FROM·TO 동일 입력', solution: '정보 구분 후 재입력', severity: '보통' },
      { problem: '"회원 정보 불일치"', cause: '이름-번호 불일치 또는 탈퇴 계정', solution: '정보 확인 후 재입력', severity: '보통' },
      { problem: '"중복 접수내역 존재"', cause: '동일 전형 양쪽 접수', solution: '1개 계정 접수 취소 후 재시도', severity: '높음' },
      { problem: '"중복 입반 불가"', cause: '양쪽 동일 강좌 입반', solution: '결제·수강 없는 계정 퇴반 후 재시도', severity: '높음' },
      { problem: '"중복 물류 청구 건"', cause: '동일 물류 양쪽 청구', solution: '1개 청구취소 + 교재 취소 후 재시도', severity: '높음' },
    ],
    related_guides: [
      { id: 'member-duplicate', title: '중복 계정 통합 프로세스', module: '고객(원생) 관리' },
      { id: 'enroll-transfer', title: '전반 가이드', module: '수업운영 관리' },
    ],
  },

  {
    id: 'member-duplicate',
    module: '고객(원생) 관리', module_id: 'member', guide_type: 'case_based',
    title: '중복 계정 통합 프로세스',
    version: 'v4', author: '조호영', updated_at: '2025-12-13',
    target_roles: ['운영자', '실장'],
    tags: ['중복계정', '로컬회원', '통합회원', '미사용태그'],
    summary: '동일 학생의 계정이 2개 이상 생성된 경우, 계정 유형과 데이터 보유 여부에 따른 처리 방법입니다.',
    menu_path: 'AMS > 고객(원생)관리 > 회원 조회',
    deeplink: 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1614381124',
    steps: [
      { title: '계정 유형 확인', description: '로컬 2개인지, 통합+로컬인지 파악.', warning: null },
      { title: 'AMS 데이터 보유 여부 확인', description: '각 계정의 상담, 접수, 입반, 결제 이력 확인.', warning: null },
      { title: '케이스별 처리 진행', description: '아래 운영 케이스에 따라 처리.', warning: null },
      { title: '미사용 계정 처리', description: '없앨 계정 번호 010-0000-0000 변경 + "미사용" 태그.', warning: '미사용 태그 후 회원 검색 제외.' },
    ],
    fields: [],
    cases: [
      { label: '로컬 2개 · 1개만 AMS 데이터', steps: ['데이터 있는 계정 유지', '없는 계정: 번호 변경 + 미사용 태그'], note: null },
      { label: '로컬 2개 · 둘 다 데이터 · 결제 있음', steps: ['FROM 결제 취소', 'TO 재결제', 'FROM 번호 변경 + 미사용 태그'], note: null },
      { label: '통합+로컬 · 통합에 데이터 없음', steps: ['수동 처리 불필요', '회원 직접 마이클래스 > 계정 연동'], note: null },
      { label: '통합+로컬 · 통합에 데이터 있음', steps: ['기능 해소 불가 → 개발팀 SERP 이슈 등록'], note: '수작업 이관. 완료 일정 안내 어려움.' },
    ],
    cautions: ['대기 순번은 시스템 이관 불가. 학생 의사 확인 후 처리.', '미사용 태그 전 결제·입반 이력 반드시 정리.'],
    issues: [],
    related_guides: [{ id: 'member-merge', title: 'AMS 회원 병합 가이드', module: '고객(원생) 관리' }],
  },

  /* ━━━ 용어 참조형 (Reference) 예시 ━━━ */
  {
    id: 'billing-status-ref',
    module: '청구/수납/결제/환불', module_id: 'billing', guide_type: 'reference',
    title: 'AMS 결제 상태값 정의',
    version: 'v1', author: '김수민', updated_at: '2026-03-01',
    target_roles: ['운영자', '실장', '관리자'],
    tags: ['결제상태', '상태값', '참조'],
    summary: 'AMS 결제 관련 화면에서 사용되는 상태값의 의미와 전환 조건을 정의합니다.',
    menu_path: 'AMS > 청구/수납관리 > 결제내역',
    deeplink: '#',
    steps: [],
    reference_fields: [
      { name: '입금대기', description: '가상계좌 발급 완료, 입금 미완료 상태', example: '가상계좌 결제 시 자동 부여', required: '자동', category: '결제' },
      { name: '결제완료', description: '결제가 정상 완료된 상태', example: 'PG카드/VAN카드/현금/가상계좌 입금 완료', required: '자동', category: '결제' },
      { name: '결제취소', description: '결제가 취소 처리된 상태', example: '관리자 또는 전환결제 시 자동 처리', required: '자동', category: '결제' },
      { name: '환불대기', description: '환불 요청이 접수되었으나 이체 미완료', example: 'VAN/가상계좌/현금 전환결제 후 발생', required: '자동', category: '환불' },
      { name: '환불완료', description: '환불 이체가 완료된 상태', example: 'PG카드 자동 또는 수동 이체완료', required: '자동', category: '환불' },
      { name: '부분납', description: '청구 금액 중 일부만 결제된 상태', example: '100만원 청구 중 50만원만 결제', required: '자동', category: '청구' },
      { name: '완납', description: '청구 금액 전액이 결제된 상태', example: '100만원 청구 100만원 결제', required: '자동', category: '청구' },
      { name: '미납', description: '청구 생성 후 결제가 0원인 상태', example: '청구 생성 직후 기본 상태', required: '자동', category: '청구' },
    ],
    fields: [],
    cases: [],
    cautions: ['상태값은 시스템에서 자동 부여됨. 수동 변경 불가.', '"환불대기" 상태는 반드시 수동 이체완료 처리 필요.'],
    issues: [],
    related_guides: [
      { id: 'billing-conversion', title: '전환결제 기능 가이드', module: '청구/수납/결제/환불' },
      { id: 'billing-refund', title: '환불·금액 변경 가이드', module: '청구/수납/결제/환불' },
    ],
  },
]

export const RECENT_GUIDES = GUIDES
  .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  .slice(0, 5)
  .map(({ id, module, title, updated_at }) => ({ id, module, title, updated_at }))
