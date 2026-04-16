// src/data/mockData.js
// AMS 실제 운영 가이드 데이터 — Confluence 원본 기반
// Source: https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1378910256

const CONFLUENCE = 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages';
const AMS = 'https://ams.sdij.com';
// Confluence 첨부 이미지 — 개발: /confluence-img 프록시 경유, 프로덕션: 직접 URL
const IMG = (pageId, file) =>
  `/confluence-img/wiki/download/attachments/${pageId}/${file}?version=1&api=v2`;

export const GUIDES = {

  // ── 회원관리 ─────────────────────────────────────────────────────────────
  'member-merge': {
    type: 'SOP', module: '고객(원생) 관리', title: 'AMS 회원 병합 가이드',
    updated: '2026-01-30', confluenceId: '1815216142',
    author: '김명준', version: 'v2.1', views: 342, helpful: 28, helpfulRate: 92,
    targets: ['운영자', '실장'],
    tldr: "학생이 마이클래스에서 직접 수강정보 연동을 하지 못하는 경우 관리자가 AMS 데이터를 옮겨줄 수 있는 기능입니다.\n병합은 '동일 회원의 계정'임을 확인한 계정끼리만 가능합니다. 이름 등 개인정보가 다른 경우 확인 후 작업 필요합니다.",
    path: 'AMS 어드민 > 고객(원생) 관리 > 회원조회',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: `${CONFLUENCE}/1815216142`,
    steps: [
      {
        title: 'FROM·TO 회원 정보 입력',
        desc: 'FROM 회원(이관할 계정), TO 회원(받을 계정)의 회원명과 회원번호를 입력합니다.',
        image: { url: IMG('1815216142','image-20260407-083236.png'), name: 'FROM·TO 입력 화면' },
      },
      {
        title: '[회원 병합하기] 버튼 클릭',
        desc: 'FROM/TO 회원 정보 검토 후 [확인] 버튼을 클릭합니다. FROM이 로컬계정인 경우 병합 시 자동 탈퇴 처리됩니다.',
        image: { url: IMG('1815216142','image-20260407-083240.png'), name: '병합 확인 팝업' },
      },
      {
        title: '병합 결과 확인',
        desc: '입반, 접수, 결제, 환불, 대기번호, 상담이력이 모두 이관됩니다. 대기번호는 빠른 대기번호로 이관됩니다.',
        image: { url: IMG('1815216142','image-20260407-083247.png'), name: '병합 완료 결과' },
      },
    ],
    mainItemsTable: [
      { field: 'FROM 회원', desc: '정보를 이관하고자 하는 회원 (이관 원본)', required: true },
      { field: 'TO 회원', desc: '정보를 받고자 하는 회원 (이관 대상)', required: true },
    ],
    cases: [
      { label: '로컬 2개, 1개만 AMS 데이터 있음', action: '데이터 있는 쪽을 유지하고, 없애는 계정은 핸드폰 번호 010-0000-0000 변경 + "미사용" 태그 처리', note: '미사용 태그 계정은 회원 검색 결과에서 제외됨' },
      { label: '둘 다 AMS 데이터 있음 — 한 쪽에 결제 있는 경우', action: '없애는 계정에서 결제취소 후 사용할 계정에서 재결제 안내. 재결제 확인 후 핸드폰 번호 010-0000-0000 변경 + 미사용 태그 처리', note: '재결제 확인 전 절대 계정 삭제 불가' },
      { label: '둘 다 AMS 데이터 있음 — 한 쪽에 입반/접수 있는 경우', action: '없애는 계정에서 퇴반/접수취소 후 사용할 계정에서 입반/접수 완료 후, 없애는 계정은 핸드폰 번호 010-0000-0000 변경 + 미사용 태그 처리', note: '' },
      { label: '통합 1개 + 로컬 1개 — 통합에 AMS 데이터 없음', action: '수동 처리사항 없음. 회원이 직접 통합회원 로그인 후 계정 연동 → 통합회원으로 회원 데이터 병합됨', note: '마이클래스 > 학원 등록 정보 연동 메뉴 안내' },
    ],
    cautions: [
      '병합은 동일 회원임이 확인된 계정끼리만 진행 — 이름/개인정보가 다르면 반드시 확인 후 작업',
      '대기번호는 이관 전/후 모두 데이터 있으면 빠른 대기번호로 이관 (순번 변경 주의)',
      '동일 강좌에 양쪽 모두 입반 상태인 경우 결제/수강 내역 없는 1개 계정 퇴반 처리 후 재시도',
    ],
    troubleTable: [
      { issue: '"동일한 회원은 병합할 수 없습니다"', cause: 'FROM과 TO 회원을 동일하게 입력', solution: 'FROM/TO 회원 정보를 정확하게 구분하여 재입력', severity: 'medium' },
      { issue: '"병합이력이 존재합니다"', cause: 'FROM 회원에 이미 병합 이력 있음', solution: '이미 병합된 회원이므로 플랫폼서비스실 문의', severity: 'high' },
      { issue: '"중복 접수내역이 존재합니다"', cause: '동일 전형에 양쪽 모두 접수 내역 있음', solution: '2개 중 1개 계정 접수 내역 취소 후 재시도', severity: 'high' },
      { issue: '"중복 입반이 불가능합니다"', cause: '두 계정이 동일 강좌에 모두 입반 상태', solution: '결제/수강 내역 없는 1개 계정 퇴반 처리 후 재시도', severity: 'high' },
    ],
    responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'duplicate-account': {
    type: 'DECISION', module: '고객(원생) 관리', title: '중복 계정 통합 프로세스',
    updated: '2026-01-20', confluenceId: '1614381124',
    targets: ['운영자', '실장'],
    tldr: "로컬/통합회원 간 중복 계정 발생 시 상황별 처리 기준입니다. AMS 데이터 유무에 따라 처리 방법이 달라집니다.",
    path: 'AMS 어드민 > 고객(원생) 관리 > 회원조회',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: `${CONFLUENCE}/1614381124`,
    decisionTable: [
      { cond: '로컬 2개 — 1개만 AMS 데이터 있음', action: '데이터 있는 계정 유지, 나머지 미사용 처리', note: '010-0000-0000 변경 + 미사용 태그', status: 'safe' },
      { cond: '로컬 2개 — 둘 다 AMS 데이터 있음 (결제)', action: '결제취소 후 재결제 → 미사용 처리', note: '재결제 확인 필수', status: 'warn' },
      { cond: '통합 1개 + 로컬 1개 — 통합 데이터 없음', action: '마이클래스에서 직접 연동 안내', note: '수동 처리 불필요', status: 'safe' },
      { cond: '통합 1개 + 로컬 1개 — 통합에 AMS 데이터 있음', action: '개발팀 요청 필요 (수동 이관 불가)', note: 'SERP-5958 참고', status: 'danger' },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: null, troubleTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── 청구/수납/결제/환불 ───────────────────────────────────────────────────
  'billing-guide': {
    type: 'SOP', module: '청구/수납/결제/환불', title: '청구 생성 가이드 (입반 회원 대상)',
    updated: '2026-03-04', confluenceId: '1892712732',
    targets: ['운영자'],
    tldr: "입반 완료된 회원을 대상으로 수강료 및 연결교재를 청구하는 방법을 안내합니다.\n청구는 '일괄 청구'와 '개별 청구' 두 가지 방식으로 나뉩니다.",
    path: 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세',
    amsUrl: `${AMS}/operation/class/manage`,
    confluenceUrl: `${CONFLUENCE}/1892712732`,
    steps: [
      { title: '수강예정회차 확인', desc: '수업상세/수업통계 화면에서 수강예정회차 컬럼(+버튼 클릭)을 확인합니다. 청구 대상자 선정 기준이므로 반드시 먼저 확인합니다.', image: { url: IMG('1892712732','image-20260305-035353.png'), name: '수강예정회차 컬럼' } },
      { title: '청구 대상자 선택', desc: '일괄 청구는 대상자 선택 없이 또는 N명 선택 후 진입. 개별 청구는 특정 회원 선택 후 [청구생성] 버튼 클릭.', image: null },
      { title: '청구 생성 팝업에서 상품 선택', desc: '수강료 또는 연결교재(교재단품/회차패키지/선택패키지)를 선택합니다. 수강료 청구 시 연결교재를 함께 선택하면 해당 회차 기준으로 자동 청구됩니다.', image: { url: IMG('1892712732','image-20260306-031117.png'), name: '청구 생성 팝업' } },
      { title: '대상자 확인 후 저장', desc: '"총 N명"을 클릭하여 청구 대상자 목록을 확인 후 [저장] 버튼을 클릭합니다.', image: null },
      { title: '출석부에서 박스 생성 확인', desc: '청구 완료 후 수업상세 출석부에서 출결박스 및 배부박스가 정상 생성되었는지 확인합니다.', image: { url: IMG('1892712732','image-20260306-032658.png'), name: '출결박스·배부박스 확인' } },
    ],
    mainItemsTable: [
      { field: '수강료', desc: '수업 회차별로 청구되는 수강 비용', required: true },
      { field: '교재단품', desc: '1회성으로 청구되는 실물 교재', required: false },
      { field: '회차패키지', desc: '수강료 회차와 1:1 매칭되어 출석+배부 함께 처리', required: false },
      { field: '선택패키지', desc: '회원이 선택적으로 구매하는 특정 시점 일괄 청구 교재', required: false },
    ],
    cases: [
      { label: '수강료 + 회차패키지 동시 청구 (일반)', action: '청구생성 팝업 > 연결교재 청구 선택 영역에서 교재그룹(회차패키지) 체크 후 [저장]', note: '출결박스와 배부박스가 함께 생성됩니다' },
      { label: '수강료는 기청구, 교재만 추가 청구', action: '해당 회원만 선택 후 [청구생성] > 연결교재 탭에서 교재 선택 > [저장]', note: '중도입반 또는 교재 청구 누락 케이스' },
      { label: '온라인 카드 분할 청구', action: '개별 청구로 청구를 쪼개서 생성 — 특정 회원 선택 후 분할 금액으로 복수 청구 생성', note: '청구관리 경로는 권장하지 않음' },
    ],
    cautions: [
      '청구 생성 전 반드시 수강예정회차 컬럼 확인 필수 — 잘못된 회차 기준으로 청구 시 수정 복잡',
      '청구관리 경로 직접 진입은 권장 안 함 — 수업상세 또는 수업통계 경로 사용',
    ],
    troubleTable: null, responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'payment-switch': {
    type: 'SOP', module: '청구/수납/결제/환불', title: '전환결제 처리 가이드',
    updated: '2026-02-04', confluenceId: '1798897665',
    targets: ['운영자', '실장'],
    tldr: "기존 결제수단을 변경해야 할 때 사용하는 처리 방식입니다.\n전환결제는 기존 결제를 수정하는 게 아니라 새 결제를 먼저 생성하고 기존 결제를 취소하는 구조입니다.",
    path: 'AMS 어드민 > 고객(원생) 관리 > 회원조회 > 회원상세 > 결제내역(TAB)',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: `${CONFLUENCE}/1798897665`,
    steps: [
      { title: '전환할 결제내역 선택', desc: '회원상세 > 결제내역 탭에서 전환결제 할 결제 데이터를 체크하고 [전환결제] 버튼을 클릭합니다.', image: { url: IMG('1798897665','image-20260204-012452.png'), name: '결제내역 탭' } },
      { title: '전환결제 수단 선택', desc: '팝업에서 카드단말기/현금/가상계좌/온라인(PG) 중 신규 결제수단을 선택합니다. 온라인 전환 시 결제요청 URL을 회원에게 발송할 수 있습니다.', image: { url: IMG('1798897665','image-20260204-012431.png'), name: '전환결제 팝업' } },
      { title: '신규 결제 완료 확인', desc: '회원이 신규 결제수단으로 결제를 완료합니다.', image: null },
      { title: '기존 결제 환불 처리', desc: 'PG카드는 자동 환불완료. VAN단말기/현금/가상계좌는 환불상세에서 직접 환불 처리 필요합니다.', image: null },
    ],
    cases: [
      { label: '기존 PG카드 → 다른 수단으로 전환', action: '신규 결제 완료 시 기존 PG카드는 자동 환불완료 처리. AMS 추가 작업 불필요', note: '자동 처리 확인 필수' },
      { label: '기존 VAN카드/현금 → 다른 수단으로 전환', action: '신규 결제 완료 후 기존 결제는 환불대기 상태. 환불요청처리 메뉴에서 [승인취소] 또는 [이체완료] 처리 필수', note: '미처리 시 정산 오류 발생' },
      { label: '가상계좌 전환 — 입금 전 상태', action: '신규 결제데이터가 입금대기 상태로 유지됨. 입금완료 처리 후 기존 결제 환불 처리 진행', note: '입금 전 기존 결제 취소 불가' },
    ],
    cautions: [
      '전환결제 건은 환불취소 불가 — 처리 전 반드시 회원 확인',
      '입금대기 건, 500원 미만 결제건, 이미 취소된 결제건은 전환결제 불가',
      'VAN/현금/가상계좌 기존 결제는 신규 결제 완료 후 직접 환불 처리 필수',
    ],
    troubleTable: [
      { issue: '"입금대기 상태의 결제건은 전환결제가 불가합니다"', cause: '가상계좌 입금 대기 중인 결제 선택', solution: '입금완료 처리 후 전환결제 진행', severity: 'medium' },
      { issue: '"500원 미만 결제건은 전환결제가 불가합니다"', cause: '500원 미만 소액 결제 선택', solution: '해당 건은 전환결제 불가, 직접 취소 후 재결제 안내', severity: 'medium' },
      { issue: '"환불 가능한 금액이 없는 결제건은 전환결제가 불가합니다"', cause: '이미 취소/환불된 결제건 선택', solution: '결제건 상태 확인 후 정상 결제건으로 재시도', severity: 'medium' },
    ],
    mainItemsTable: null, responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'refund-policy': {
    type: 'DECISION', module: '청구/수납/결제/환불', title: '환불 승인 기준 판단 가이드',
    updated: '2026-04-10', confluenceId: '1867350030',
    targets: ['운영자', '실장'],
    tldr: "학원법 기준 및 사내 정책에 따른 수강료 환불 산정표입니다. 규정 외 환불은 반드시 실장 전결이 필요합니다.",
    path: 'AMS 어드민 > 청구/수납 관리 > 결제 관리 > 환불 승인',
    amsUrl: `${AMS}/billing/payment/refund`,
    confluenceUrl: `${CONFLUENCE}/1867350030`,
    decisionTable: [
      { cond: '개강 전 취소', action: '전액 환불', note: '교재비 별도 반환 절차 필요', status: 'safe' },
      { cond: '총 교습시간 1/3 경과 전', action: '수강료 2/3 환불', note: '시스템 자동 산출 가능', status: 'safe' },
      { cond: '총 교습시간 1/2 경과 전', action: '수강료 1/2 환불', note: '증빙 서류(질병 등) 확인 필수', status: 'warn' },
      { cond: '총 교습시간 1/2 경과 후', action: '환불 불가', note: '★실장 특이사항 승인 시에만 처리 가능', status: 'danger' },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: null, troubleTable: null, responses: null, referenceData: null, policyDiff: null,
  },

  // ── 수업운영관리 ──────────────────────────────────────────────────────────
  'class-manage': {
    type: 'REFERENCE', module: '수업운영관리', title: '수업관리 화면 가이드',
    updated: '2025-12-28', confluenceId: '1693811041',
    targets: ['운영자'],
    tldr: "수업관리 시스템은 수업 일정, 출결 관리, 입퇴반, 보강 지급 등 수업 관련 전반적인 업무를 처리하는 통합 관리 시스템입니다.",
    path: 'AMS 어드민 > 수업운영관리 > 수업관리',
    amsUrl: `${AMS}/operation/class/manage`,
    confluenceUrl: `${CONFLUENCE}/1693811041`,
    referenceData: [
      { term: '수강예정회차', def: '조회일(당일 포함) 이후 색깔있는 출결박스의 개수(결석 or 출석예정 or 출석). 청구 대상자 선정 기준.' },
      { term: '이용가능회차', def: '이용가능금액으로 출결처리 가능한 미래 수업일자의 회차 개수. 클릭 시 금액현황 화면 호출.' },
      { term: '이용가능금액', def: '받은금액 + 결제완료금액 - 강좌이용금액 - 환불대기금액 - 환불완료금액 - 보낸금액' },
      { term: '납부상태 — 납부완료', def: '해당 회차금액이 결제완료된 상태' },
      { term: '납부상태 — 납부대기', def: '해당 회차금액이 결제되지 않은 상태' },
      { term: '납부상태 — 미납', def: '납부대기 상태에서 출석 발생해 해당 회차금액이 마이너스 차감된 상태' },
      { term: '현장출석', def: '해당 반 수강생이면서 해당 수업일·강의실에서 출석처리한 회원 수' },
      { term: '타반보강', def: '해당 반 수강생이면서 동일 보강코드인 반에서 출석처리한 회원 수' },
      { term: 'VOD 보강', def: '입반 상태인 해당 반 수강생이면서 마이클래스+연구실 동영상보강으로 출석처리한 회원 수' },
      { term: '정산가능인원', def: '출석부 영역을 기준으로 박스있는 회원 수 (해당 회차금액 포함 청구가 생성된 회원)' },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: null, troubleTable: null, responses: null, decisionTable: null, policyDiff: null,
  },

  'class-transfer': {
    type: 'SOP', module: '수업운영관리', title: '전반 처리 가이드',
    updated: '2026-03-14', confluenceId: '1934295041',
    targets: ['운영자', '실장'],
    tldr: "전반은 수강생이 현재 강좌에서 다른 강좌로 이동하는 처리입니다.\n전반 전 강좌의 퇴반일 설정 이후 청구된 수강료의 출석예정 출결박스 및 연결교재의 수령예정 배부박스는 동일한 상태로 전반 후 강좌로 이동합니다.",
    path: 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세 > 입반생 > 전반처리',
    amsUrl: `${AMS}/operation/class/manage`,
    confluenceUrl: `${CONFLUENCE}/1934295041`,
    steps: [
      { title: '전반 전 강좌에서 퇴반 회차 선택', desc: '몇 회차 수업 후 퇴반할 것인지 선택합니다. 전반 후 강좌의 입반 회차가 자동으로 설정됩니다.', image: { url: IMG('1934295041','image-20260314-155151.png'), name: '퇴반 회차 선택' } },
      { title: '전반 후 출결/배부박스 미리 확인', desc: '전반 후 강좌에 만들어질 수강료 출결박스와 교재 배부박스를 시각적으로 확인합니다.', image: { url: IMG('1934295041','image-20260314-155322.png'), name: '이관 박스 미리보기' } },
      { title: '이관 대상 수강료·교재 정보 확인', desc: '전반 전 강좌의 실 결제금액 - 이용금액 - 이용예정금액이 전반 후 강좌로 이관됩니다.', image: { url: IMG('1934295041','image-20260314-155837.png'), name: '이관 수강료 확인' } },
      { title: '전반 처리 완료', desc: '전반 처리 후 전반 후 강좌에서 청구생성을 진행합니다.', image: { url: IMG('1934295041','image-20260314-160942.png'), name: '전반 완료 화면' } },
    ],
    cases: [
      { label: '한 회차도 수강하지 않고 전반하려는 경우', action: '"수강하지 않음"을 선택하여 입/퇴반일을 동일하게 설정하여 전반 가능', note: '수강이력 없으면 퇴반 후 입반 처리가 권장됨' },
      { label: '전반 후 강좌에 이전 입반기간과 중복되는 경우', action: '[주의!! 재등록 강좌] 이전 입반기간의 청구/환불 내역 정리 여부를 먼저 확인', note: '미정리 시 전반 불가' },
    ],
    cautions: [
      '전반 전 강좌에서 선택한 회차부터 이후에 이미 출석상태가 있으면 전반 불가',
      '전반 전 강좌의 회차 중 수업일이 지난 출석예정 회차가 있으면 출결처리 후 재시도',
      '배부회차가 종료되는 교재에 수령예정 교재가 있으면 수령처리 후 재시도',
      '혜택(쿠폰) 변경이 필요한 경우 전반처리 불가 — 퇴반 후 입반 처리로 진행',
    ],
    troubleTable: [
      { issue: '"혜택(쿠폰) 변경이 필요해 전반처리가 불가능합니다"', cause: '전반 전/후 강좌에 동일한 혜택 적용이 불가한 경우', solution: '퇴반처리 후 입반처리로 진행', severity: 'medium' },
      { issue: '"마지막 출석일 이후로 설정할 수 있습니다"', cause: '전반 전 강좌에서 선택한 회차 이후에 출석상태 존재', solution: '해당 회차 이후 출결 확인 후 올바른 퇴반 회차 선택', severity: 'medium' },
    ],
    responses: null, mainItemsTable: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'unpaid-withdraw': {
    type: 'SOP', module: '수업운영관리', title: '미납자 퇴반처리 방법',
    updated: '2025-11-24', confluenceId: '1555169309',
    targets: ['운영자'],
    tldr: "미납자(이용가능회차=0) 대상 퇴반처리 방법입니다.",
    path: 'AMS 어드민 > 수업운영관리 > 수업관리',
    amsUrl: `${AMS}/operation/class/manage`,
    confluenceUrl: `${CONFLUENCE}/1555169309`,
    steps: [
      { title: '수업운영관리 > 수업관리 진입', desc: '해당 강좌명을 선택하여 수업관리 상세 화면에 진입합니다.', image: null },
      { title: '입반생 목록 조회', desc: '[검색] 버튼을 눌러 입반생 목록을 불러옵니다.', image: { url: IMG('1555169309','image-20251124-100700.png'), name: '수업관리 입반생 목록' } },
      { title: '미납자 확인', desc: '납부잔여회차(이용가능회차)가 0인 학생을 확인합니다.', image: null },
      { title: '퇴반 처리', desc: '퇴반처리할 학생들을 체크 선택 후, 좌측 상단 퇴반일을 선택한 뒤 [퇴반처리] 버튼을 클릭합니다.', image: { url: IMG('1555169309','image-20251124-100722.png'), name: '퇴반 처리 버튼' } },
    ],
    cases: null, cautions: null, troubleTable: null, responses: null, mainItemsTable: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  // ── 기존 유지 ─────────────────────────────────────────────────────────────
  'qr-trouble': {
    type: 'TROUBLE', module: '수업운영관리', title: 'QR 출석 인식 실패 트러블슈팅',
    updated: '2026-04-05', confluenceId: '1608876067',
    targets: ['운영자'],
    tldr: "학생 QR 리더기 인식 오류 시 현장에서 즉시 조치할 수 있는 체크리스트입니다. 해결 불가 시 수동 출석으로 대체하세요.",
    path: 'AMS 어드민 > 수업운영관리 > 출결 관리 > 수동 출석',
    amsUrl: `${AMS}/operation/attendance`,
    confluenceUrl: `${CONFLUENCE}/1608876067`,
    troubleTable: [
      { issue: '카메라 로딩 무한 반복', cause: '브라우저 보안 권한 미허용', solution: "주소창 좌측 자물쇠 아이콘 클릭 → 카메라 '허용' 선택", severity: 'high' },
      { issue: '특정 기기 인식 불가', cause: '반사 방지 필름에 의한 왜곡', solution: '기기 각도 조절 또는 번호 입력 폴백(Fallback) 사용', severity: 'medium' },
      { issue: '전체 기기 동시 불가', cause: 'AMS 서버 장애 또는 네트워크 단절', solution: '수동 출석 모드 전환 후 플랫폼서비스실 긴급 연락', severity: 'critical' },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: null, responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'ams-glossary': {
    type: 'REFERENCE', module: '공통/시스템', title: 'AMS 주요 용어 사전',
    updated: '2026-04-01', confluenceId: null,
    targets: ['운영자', '실장', '관리자'],
    tldr: "AMS 서비스 운영 및 개발 시 사용하는 표준 용어 모음입니다. 상담 응대 전 필수 숙지 권장.",
    path: '시스템 전체',
    amsUrl: AMS,
    confluenceUrl: `${CONFLUENCE}/1378910256`,
    referenceData: [
      { term: 'Primary Account', def: '병합 시 데이터의 주체가 되어 모든 이력이 흡수되는 계정.' },
      { term: 'FROM 회원', def: '회원 병합 시 정보를 이관하고자 하는 회원 (이관 원본).' },
      { term: 'TO 회원', def: '회원 병합 시 정보를 받고자 하는 회원 (이관 대상).' },
      { term: '미사용 태그', def: '불필요한 로컬계정에 부여하는 태그. 미사용 태그 계정은 회원 검색 결과에서 자동 제외.' },
      { term: 'Proration (일할 계산)', def: '중도 입반/퇴반 시 수업 일수에 비례하여 청구 금액을 안분하는 로직.' },
      { term: '전환결제', def: '기존 결제수단을 다른 카드/방법으로 변경하는 절차. 새 결제 선행 후 기존 결제 취소 순서 필수.' },
      { term: '수강예정회차', def: '조회일(당일 포함) 이후 색깔있는 출결박스의 개수. 청구 대상자 선정 기준.' },
      { term: '이용가능회차', def: '이용가능금액으로 출결처리 가능한 미래 수업일자의 회차 개수.' },
      { term: 'PG (Payment Gateway)', def: '온라인 결제 처리 시스템. MID를 기준으로 결제 식별. 현재 스마트로 운영.' },
      { term: 'VAN (Value Added Network)', def: '오프라인 단말기/키오스크 결제 시스템. TID를 기준으로 결제 식별.' },
      { term: 'MID', def: 'PG 온라인 결제 식별값. 업무구분 단위로 생성. 단과/재종/기숙 등 현재 총 9개 운영.' },
      { term: 'TID', def: 'VAN 단말기 식별값. 사업자번호 단위로 운영. 대치/목동/분당/반포/용인/출판 등.' },
      { term: '전반', def: '현재 강좌에서 다른 강좌로 이동하는 처리. 수강료 잔액이 전반 후 강좌로 이관됨.' },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: null, troubleTable: null, responses: null, decisionTable: null, policyDiff: null,
  },

  'response-manual': {
    type: 'RESPONSE', module: '공통/시스템', title: '상황별 CS 대응 매뉴얼',
    updated: '2026-03-25', confluenceId: null,
    targets: ['운영자', '실장'],
    tldr: "민감한 고객 문의에 대한 표준화된 응대 스크립트입니다.",
    path: '상담 지원',
    amsUrl: AMS,
    confluenceUrl: `${CONFLUENCE}/1378910256`,
    responses: [
      { case: '전환결제 후 취소 요청', script: "전환결제 건은 환불취소가 불가능합니다. '전환결제 건은 취소가 불가합니다'고 안내하고, 필요 시 실장에게 에스컬레이션합니다.", tag: '결제', severity: 'high' },
      { case: '결제 취소 누락 항의', script: '전환결제는 승인과 취소가 비동기로 일어남을 설명하고 PG사 승인 번호를 안내합니다. VAN/현금의 경우 환불대기 상태에서 직접 처리가 필요함을 안내합니다.', tag: '결제', severity: 'high' },
      { case: '성적표/동영상 미수신 항의', script: '마이클래스 앱 푸시 알림 설정 및 가입된 학부모 연락처 오기입 여부를 먼저 체크합니다.', tag: '학습관리', severity: 'medium' },
      { case: '환불 거절 항의 (1/2 이후)', script: '학원법 제18조 및 사내 정책 기준을 안내하고, 예외 적용이 필요한 경우 실장에게 에스컬레이션합니다.', tag: '환불', severity: 'high' },
      { case: '계정 중복 문의', script: '로컬/통합회원 계정 중복 여부 확인 후, 상황별 통합 프로세스 안내. AMS 데이터 유무에 따라 처리 방법이 달라짐을 설명합니다.', tag: '회원관리', severity: 'medium' },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: null, troubleTable: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'policy-2026': {
    type: 'POLICY', module: '공통/시스템', title: '2026 수강료 정책 변경 공지',
    updated: '2026-03-20', confluenceId: null,
    targets: ['운영자', '실장', '관리자'],
    tldr: "2026년도 물가 인상분 반영 및 인건비 최적화에 따른 신규 청구 기준입니다.",
    path: '운영 정책',
    amsUrl: AMS,
    confluenceUrl: `${CONFLUENCE}/1378910256`,
    policyDiff: {
      before: '월 55만원 (교재비 포함 일괄 청구)',
      after: '월 62만원 (교재비 실비 정산 및 별도 청구 체계)',
      effectiveDate: '2026-03-01',
      scope: '재종 전 캠퍼스 공통 적용',
    },
    steps: null, mainItemsTable: null, cases: null, cautions: null, troubleTable: null, responses: null, decisionTable: null, referenceData: null,
  },

  // ── 추가 가이드 ─────────────────────────────────────────────────────────────
  'payment-method': {
    type: 'SOP', module: '청구/수납/결제/환불', title: '결제 수단 등록 가이드',
    updated: '2026-04-05', confluenceId: '1920234567', targets: ['운영자'],
    tldr: "학부모가 AMS에 신용카드, 체크카드, 계좌이체 등을 등록하는 방법을 안내합니다.",
    path: 'AMS 모바일앱 > 결제 관리',
    amsUrl: `${AMS}/payment/method`,
    confluenceUrl: `${CONFLUENCE}/1920234567`,
    steps: [
      { title: "앱에서 [결제 관리] 메뉴 진입", desc: "AMS 모바일앱 메인 > 결제 관리 탭 클릭" },
      { title: "[결제 수단 추가] 클릭", desc: "카드 또는 계좌이체 선택" },
      { title: "결제 수단 정보 입력", desc: "카드번호, 유효기간, CVC 또는 계좌정보 입력" },
    ],
    mainItemsTable: null, cases: null, cautions: ["결제 수단은 최대 3개까지 등록 가능"],
    troubleTable: null, responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'class-schedule': {
    type: 'REFERENCE', module: '강좌/교재 관리', title: '강좌 스케줄 관리 가이드',
    updated: '2026-03-30', confluenceId: '1920345678', targets: ['운영자', '실장', '관리자'],
    tldr: "AMS에서 강좌의 개강일, 종강일, 수업요일, 시간을 관리하는 방법입니다.",
    path: 'AMS 어드민 > 강좌/교재 관리 > 강좌관리',
    amsUrl: `${AMS}/course/manage`,
    confluenceUrl: `${CONFLUENCE}/1920345678`,
    referenceData: [
      { term: "개강일", def: "강좌의 첫 수업일. 이 날짜부터 청구가 시작됩니다." },
      { term: "종강일", def: "강좌의 마지막 수업일. 이후 자동으로 강좌 상태가 종료됨." },
      { term: "수업요일", def: "주중 반복되는 수업 요일 (예: 월, 수, 금)" },
      { term: "수업 시간", def: "하루에 구성된 시간 (예: 2시간, 3시간)" },
    ],
    steps: null, mainItemsTable: null, cases: null, cautions: ["개강일 변경 시 기존 청구 이력이 영향받을 수 있음"],
    troubleTable: null, responses: null, decisionTable: null, policyDiff: null,
  },

  // ── 모집/접수 관리 ────────────────────────────────────────────────────────
  'recruit-application': {
    type: 'SOP', module: '모집/접수 관리', title: '모집 신청 접수 처리 가이드',
    updated: '2026-04-10', confluenceId: '1920567890',
    author: '박소연', version: 'v1.3', views: 198, helpful: 16, helpfulRate: 88,
    targets: ['운영자'],
    tldr: "모집 공고에 따른 수강 신청을 접수하고 대기 순번을 배정하는 절차입니다.\n접수 마감 전 중복 신청 여부와 배정 가능 인원을 반드시 확인하세요.",
    path: 'AMS 어드민 > 모집/접수 관리 > 접수현황',
    amsUrl: `${AMS}/recruit`,
    confluenceUrl: `${CONFLUENCE}/1920567890`,
    steps: [
      { title: '모집 공고 상태 확인', desc: '모집/접수 관리 > 접수현황 메뉴에서 해당 강좌의 모집상태가 "접수중"인지 확인합니다.', image: null },
      { title: '신청 회원 검색', desc: '접수하려는 회원의 이름 또는 연락처로 검색합니다. 동일 회원의 중복 신청 여부를 반드시 확인합니다.', image: null },
      { title: '접수 정보 입력', desc: '강좌, 강의 시간대, 교재 선택 여부를 확인 후 [접수 등록] 버튼을 클릭합니다.', image: null },
      { title: '대기번호 확인', desc: '정원 초과 시 자동으로 대기번호가 부여됩니다. 대기 순번을 회원에게 안내합니다.', image: null },
    ],
    mainItemsTable: [
      { field: '접수 강좌', desc: '신청할 강좌명 및 시간대', required: true },
      { field: '회원 정보', desc: '신청 회원의 이름, 연락처, 생년월일', required: true },
      { field: '교재 신청 여부', desc: '해당 강좌의 교재 수령 여부 선택', required: false },
    ],
    cases: [
      { label: '정원 초과 시', action: '자동으로 대기번호 부여. 대기 순번과 예상 입반 시기를 회원에게 안내', note: '대기 접수도 동일한 절차로 진행' },
      { label: '타 캠퍼스 접수 문의', action: '해당 캠퍼스 운영팀에 직접 안내 — 캠퍼스 간 접수 공유 불가', note: '' },
    ],
    cautions: [
      '동일 회원의 동일 강좌 중복 접수 불가 — 검색 후 기존 접수 여부 반드시 확인',
      '접수 취소 후 재접수 시 기존 대기 순번은 초기화됨',
    ],
    troubleTable: [
      { issue: '"이미 접수된 회원입니다"', cause: '동일 강좌에 이미 접수 이력 존재', solution: '접수현황에서 기존 접수 내역 확인 후 처리', severity: 'medium' },
      { issue: '"모집이 마감된 강좌입니다"', cause: '해당 강좌 모집 상태가 마감으로 변경됨', solution: '모집상태 재확인 후 대기접수 또는 타 강좌 안내', severity: 'medium' },
    ],
    responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'waitlist-manage': {
    type: 'SOP', module: '모집/접수 관리', title: '대기번호 관리 및 입반 전환 가이드',
    updated: '2026-03-28', confluenceId: '1920678901',
    author: '이준호', version: 'v1.2', views: 134, helpful: 11, helpfulRate: 85,
    targets: ['운영자'],
    tldr: "대기 접수된 회원의 대기 순번 확인 및 입반 전환 처리 방법입니다.\n빠른 대기번호와 일반 대기번호의 처리 순서가 다르므로 주의가 필요합니다.",
    path: 'AMS 어드민 > 모집/접수 관리 > 대기번호 관리',
    amsUrl: `${AMS}/recruit`,
    confluenceUrl: `${CONFLUENCE}/1920678901`,
    steps: [
      { title: '대기번호 현황 확인', desc: '모집/접수 관리 > 대기번호 관리에서 강좌별 대기자 목록을 조회합니다.', image: null },
      { title: '입반 가능 인원 확인', desc: '수업관리에서 해당 강좌의 현재 입반 인원과 정원을 확인합니다.', image: null },
      { title: '대기자에게 입반 의사 확인', desc: '대기 순번에 따라 회원에게 연락하여 입반 의사를 확인합니다.', image: null },
      { title: '입반 전환 처리', desc: '입반 의사 확인 후 [입반 전환] 버튼을 클릭하여 수강 접수에서 입반 상태로 변경합니다.', image: null },
    ],
    cases: [
      { label: '빠른 대기번호 우선 처리', action: '빠른 대기번호(회원 병합 시 이관된 대기번호)는 일반 대기번호보다 우선 입반 전환', note: '빠른 대기번호는 목록 상단에 표시' },
      { label: '입반 의사 없음', action: '대기 취소 처리 후 다음 순번의 대기자에게 연락', note: '취소된 대기번호는 복구 불가' },
    ],
    cautions: [
      '대기 취소 후 재접수 시 순번이 후순위로 변경됨',
      '입반 전환 전 반드시 회원의 의사를 확인 — 무단 전환 금지',
    ],
    troubleTable: null,
    responses: null, mainItemsTable: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  // ── 강좌/교재 관리 ────────────────────────────────────────────────────────
  'course-create': {
    type: 'SOP', module: '강좌/교재 관리', title: '강좌 생성 가이드',
    updated: '2026-04-12', confluenceId: '1920789012',
    author: '박소연', version: 'v2.0', views: 267, helpful: 22, helpfulRate: 90,
    targets: ['운영자', '실장'],
    tldr: "AMS에서 신규 강좌를 생성하고 수업 일정을 설정하는 방법입니다.\n강좌 생성 후 청구 설정 및 교재 연결까지 완료해야 운영 준비가 됩니다.",
    path: 'AMS 어드민 > 강좌/교재 관리 > 강좌관리 > 강좌 생성',
    amsUrl: `${AMS}/course/manage`,
    confluenceUrl: `${CONFLUENCE}/1920789012`,
    steps: [
      { title: '강좌 기본 정보 입력', desc: '강좌명, 강사, 강의실, 과목, 대상 학년을 입력합니다.', image: null },
      { title: '수업 일정 설정', desc: '개강일, 종강일, 수업 요일 및 시간을 설정합니다. 수업 일수에 따라 자동으로 회차가 생성됩니다.', image: null },
      { title: '정원 및 모집 설정', desc: '최대 정원, 모집 시작일/마감일을 설정합니다. 대기 접수 허용 여부도 설정 가능합니다.', image: null },
      { title: '수강료 설정', desc: '회차별 수강료, 월별 수강료 등 청구 방식을 설정합니다.', image: null },
      { title: '교재 연결 (선택)', desc: '연결할 교재가 있는 경우 [교재 연결] 탭에서 교재를 검색하여 연결합니다.', image: null },
      { title: '저장 및 모집 시작', desc: '[저장] 후 모집 상태를 "접수중"으로 변경하면 학부모 앱에서 신청 가능 상태가 됩니다.', image: null },
    ],
    mainItemsTable: [
      { field: '강좌명', desc: '학부모/학생 앱에 표시되는 강좌 이름', required: true },
      { field: '강사', desc: '담당 강사 선택 (사전 등록 필요)', required: true },
      { field: '개강일', desc: '첫 수업일 — 청구의 기준이 되는 날짜', required: true },
      { field: '수업 요일/시간', desc: '반복 수업 요일 및 시작·종료 시간', required: true },
      { field: '정원', desc: '최대 입반 가능 인원', required: true },
    ],
    cases: [
      { label: '연간반 (1년 기준) 강좌', action: '개강일은 3월 1일, 종강일은 익년 2월 말로 설정. 수강료는 월별 정액으로 설정 권장', note: '방학기간 수업 없는 주는 공휴일 설정으로 회차 제외' },
      { label: '단기 특강 강좌', action: '개강일~종강일을 단기로 설정. 수강료는 전체 회차 일괄 청구로 설정', note: '전체 청구 방식이므로 중도 입반 시 일할 계산 필수' },
    ],
    cautions: [
      '강좌 저장 후 개강일, 수업요일 변경 시 기존 청구 이력에 영향을 줄 수 있음',
      '강사 미등록 상태에서는 강좌 생성 불가 — 사전에 강사 등록 필수',
      '정원 설정 후 축소 시 기존 입반생이 있으면 경고 발생',
    ],
    troubleTable: [
      { issue: '"강사가 등록되지 않았습니다"', cause: '선택한 강사가 AMS에 미등록 상태', solution: '강사 관리 메뉴에서 강사 등록 후 재시도', severity: 'medium' },
      { issue: '"중복된 강의실/시간대입니다"', cause: '동일 강의실에 동일 시간대 강좌가 이미 존재', solution: '강의실 또는 시간대 변경', severity: 'medium' },
    ],
    responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'textbook-register': {
    type: 'SOP', module: '강좌/교재 관리', title: '교재 등록 및 강좌 연결 가이드',
    updated: '2026-04-08', confluenceId: '1920890123',
    author: '이준호', version: 'v1.5', views: 143, helpful: 12, helpfulRate: 87,
    targets: ['운영자', '실장'],
    tldr: "교재를 AMS에 등록하고 강좌와 연결하는 방법입니다.\n교재 유형(교재단품/회차패키지/선택패키지)에 따라 청구 방식이 달라집니다.",
    path: 'AMS 어드민 > 강좌/교재 관리 > 교재관리',
    amsUrl: `${AMS}/course/textbook`,
    confluenceUrl: `${CONFLUENCE}/1920890123`,
    steps: [
      { title: '교재 기본 정보 입력', desc: '교재명, 출판사, 단가, 교재 유형(단품/패키지)을 입력합니다.', image: null },
      { title: '교재 유형 선택', desc: '교재단품: 1회성 청구. 회차패키지: 수강료와 1:1 매칭 청구. 선택패키지: 회원이 선택적으로 구매.', image: null },
      { title: '강좌에 교재 연결', desc: '강좌 관리에서 해당 강좌를 선택 후 [교재 연결] 탭에서 등록한 교재를 연결합니다.', image: null },
      { title: '연결 설정 확인', desc: '연결 후 청구 생성 팝업에서 교재 청구 옵션이 정상 표시되는지 확인합니다.', image: null },
    ],
    mainItemsTable: [
      { field: '교재단품', desc: '강좌와 무관하게 1회성으로 청구하는 교재', required: false },
      { field: '회차패키지', desc: '수강료 회차와 1:1 매칭되어 출석 + 배부 함께 처리되는 교재', required: false },
      { field: '선택패키지', desc: '회원이 특정 시점에 선택하여 일괄 청구하는 교재', required: false },
    ],
    cases: [
      { label: '교재를 수강료와 함께 일괄 청구', action: '회차패키지로 등록 후 강좌에 연결 → 청구생성 시 연결교재 청구 옵션 선택', note: '출결박스와 배부박스가 함께 생성됨' },
      { label: '교재 추가 또는 변경 필요', action: '기존 연결된 교재를 해제 후 새 교재 연결. 기청구된 회원은 별도 처리 필요', note: '기청구 교재 변경은 환불 후 재청구' },
    ],
    cautions: [
      '교재 단가 변경 시 기존 청구된 금액에는 소급 적용되지 않음',
      '회차패키지 교재는 강좌 종강 이후 수정 불가',
    ],
    troubleTable: [
      { issue: '교재 연결 후 청구 팝업에 표시 안됨', cause: '강좌와 교재의 연결 설정 미완료', solution: '교재 연결 탭에서 활성화 여부 재확인', severity: 'medium' },
    ],
    responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  // ── 메시지발송 관리 ────────────────────────────────────────────────────────
  'sms-send': {
    type: 'SOP', module: '메시지발송 관리', title: '문자 발송 가이드',
    updated: '2026-04-06', confluenceId: '1920901234',
    author: '김명준', version: 'v1.4', views: 178, helpful: 15, helpfulRate: 89,
    targets: ['운영자', '실장'],
    tldr: "AMS에서 수강생 및 학부모에게 문자(SMS/LMS)를 일괄 또는 개별 발송하는 방법입니다.",
    path: 'AMS 어드민 > 메시지발송 관리 > 문자발송',
    amsUrl: `${AMS}/message`,
    confluenceUrl: `${CONFLUENCE}/1920901234`,
    steps: [
      { title: '문자 발송 메뉴 진입', desc: '메시지발송 관리 > 문자발송 메뉴로 이동합니다.', image: null },
      { title: '수신 대상 선택', desc: '강좌별, 반별, 개별 회원 등 수신 대상을 선택합니다. 다중 선택 가능합니다.', image: null },
      { title: '발송 유형 선택', desc: 'SMS(90byte 이하) 또는 LMS(90byte 초과)를 선택합니다. 글자수에 따라 자동 전환됩니다.', image: null },
      { title: '메시지 내용 작성', desc: '발송할 내용을 작성합니다. #{학생명}, #{강좌명} 등 변수 삽입이 가능합니다.', image: null },
      { title: '즉시 발송 또는 예약 발송', desc: '[즉시 발송] 또는 원하는 일시로 [예약 발송]을 선택합니다.', image: null },
    ],
    mainItemsTable: [
      { field: 'SMS', desc: '90byte 이하 단문. 1건당 요금 적용', required: false },
      { field: 'LMS', desc: '90byte 초과 장문. SMS 대비 요금 높음', required: false },
      { field: '변수', desc: '#{학생명}, #{강좌명} 등 개인화 변수 사용 가능', required: false },
    ],
    cases: [
      { label: '수업 결석 안내 문자', action: '해당 강좌 입반생 중 특정일 결석 처리된 회원만 필터링하여 발송', note: '출결 관리 연동으로 자동 필터 가능' },
      { label: '청구 안내 문자', action: '청구 생성 후 해당 강좌 청구 대상자에게 납부 안내 문자 일괄 발송', note: '가상계좌 발급 문자는 별도 메뉴 사용' },
    ],
    cautions: [
      '발송 전 수신 거부 여부 확인 — 수신 거부 회원에게 발송 시 민원 발생 가능',
      '예약 발송 후 내용 수정이 필요하면 발송 30분 전까지 취소 가능',
      '대량 발송(500건 이상)은 발송 전 실장 승인 필요',
    ],
    troubleTable: [
      { issue: '발송 실패 메시지 표시', cause: '수신 번호 형식 오류 또는 통신사 오류', solution: '수신 번호 형식 확인(010-XXXX-XXXX) 후 재발송', severity: 'medium' },
      { issue: '예약 발송이 발송되지 않음', cause: '예약 시간 설정 오류 또는 시스템 오류', solution: '발송 이력에서 예약 상태 확인 후 수동 즉시 발송', severity: 'high' },
    ],
    responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'virtual-account-guide': {
    type: 'SOP', module: '메시지발송 관리', title: '가상계좌 안내 문자 발송 가이드',
    updated: '2026-03-25', confluenceId: '1920012345',
    author: '이준호', version: 'v1.1', views: 112, helpful: 9, helpfulRate: 83,
    targets: ['운영자'],
    tldr: "가상계좌 결제를 선택한 회원에게 입금 안내 문자를 발송하는 방법입니다.\n가상계좌는 회원별로 고유하게 발급되며, 입금 기한이 있으므로 신속한 안내가 필요합니다.",
    path: 'AMS 어드민 > 메시지발송 관리 > 가상계좌 안내',
    amsUrl: `${AMS}/message`,
    confluenceUrl: `${CONFLUENCE}/1920012345`,
    steps: [
      { title: '가상계좌 발급 대상 조회', desc: '메시지발송 관리 > 가상계좌 안내에서 발급된 가상계좌 목록을 조회합니다.', image: null },
      { title: '미안내 대상 필터링', desc: '발급 후 문자 미발송 상태인 회원을 필터링합니다.', image: null },
      { title: '안내 문자 발송', desc: '[문자 발송] 버튼을 클릭하면 회원별 가상계좌 번호와 입금 기한이 포함된 안내 문자가 자동 발송됩니다.', image: null },
      { title: '입금 확인', desc: '발송 후 가상계좌 입금 현황에서 입금 완료 여부를 확인합니다. 입금 기한 내 미입금 시 결제 취소 처리가 필요합니다.', image: null },
    ],
    cautions: [
      '가상계좌 안내 문자는 가상계좌 발급 즉시 발송 권장 (발급 후 24시간 이내)',
      '입금 기한 경과 후 입금된 건은 자동 취소 — 재발급 후 안내 필요',
      '동일 회원에게 중복 발송되지 않도록 발송 이력 확인',
    ],
    troubleTable: [
      { issue: '가상계좌 번호가 안내 문자에 포함되지 않음', cause: '가상계좌 발급 완료 전 문자 발송 시도', solution: '가상계좌 발급 상태 확인 후 재발송', severity: 'medium' },
    ],
    responses: null, mainItemsTable: null, decisionTable: null, referenceData: null, policyDiff: null,
  },

  'student-suspension': {
    type: 'SOP', module: '고객(원생) 관리', title: '휴강 처리 절차',
    updated: '2026-03-15', confluenceId: '1920456789',
    targets: ['운영자', '실장'],
    tldr: "학생이 일시적으로 수강을 중단하고자 할 때 휴강 처리하는 방법입니다.\n휴강 기간 동안 수강료는 청구되지 않으며, 복강 시 원래 강좌로 복귀합니다.",
    path: 'AMS 어드민 > 고객(원생) 관리 > 회원조회 > 회원상세',
    amsUrl: `${AMS}/customer/member/detail`,
    confluenceUrl: `${CONFLUENCE}/1920456789`,
    steps: [
      { title: '회원 상세 페이지 진입', desc: '고객(원생) 관리 > 회원조회에서 휴강할 회원을 검색하여 선택합니다.', image: null },
      { title: '입반 정보 탭 선택', desc: '회원상세 화면의 [입반정보] 탭을 클릭합니다.', image: null },
      { title: '휴강 버튼 클릭', desc: '[휴강처리] 버튼을 클릭하고 휴강 시작일과 예상 복강일을 입력합니다.', image: null },
      { title: '휴강 승인 및 저장', desc: '입력한 정보를 검토 후 [저장] 버튼을 클릭하여 휴강을 완료합니다.', image: null },
    ],
    cases: [
      { label: '질병으로 인한 단기 휴강', action: '진단서 또는 확인서 첨부 후 [의료사유 휴강] 선택', note: '보험 처리 시 필수 문서' },
      { label: '군입대 또는 타 지역 이동', action: '[정상 휴강]으로 처리 후 복강일 미정 설정', note: '복강 시 실장 승인 필요 가능' },
      { label: '월 중간 휴강', action: '휴강 시작일을 일자 단위로 입력 (예: 2026-03-15)', note: '해당 월 청구에서 청구제외 처리됨' },
    ],
    cautions: [
      '휴강 중 해당 강좌에 청구 불가 — 자동으로 청구 대상에서 제외',
      '휴강 후 복강 시 새로운 입반일로 재입반 처리됨',
      '장기 휴강(3개월 이상)은 실장에게 사전 보고 권장',
    ],
    troubleTable: [
      { issue: '"해당 회원은 이미 휴강 상태입니다"', cause: '동일 강좌에 이미 활성 휴강 존재', solution: '기존 휴강을 복강하거나 일시중단 상태 확인', severity: 'medium' },
      { issue: '"복강일이 휴강일보다 앞설 수 없습니다"', cause: '예상 복강일을 휴강 시작일 이전으로 설정', solution: '복강일을 휴강 시작일 이후로 수정', severity: 'low' },
    ],
    mainItemsTable: null, responses: null, decisionTable: null, referenceData: null, policyDiff: null,
  },
};

// AMS 실제 메뉴 구조 (https://ams.sdij.com 기준)
export const MODULE_TREE = [
  {
    id: 'recruit', label: '모집/접수 관리', icon: 'ClipboardList',
    amsPath: '/recruit',
    guides: [
      { id: 'recruit-application', label: '모집 신청 접수 처리 가이드' },
      { id: 'waitlist-manage',     label: '대기번호 관리 및 입반 전환 가이드' },
    ],
  },
  {
    id: 'course', label: '강좌/교재 관리', icon: 'BookOpen',
    amsPath: '/course',
    guides: [
      { id: 'course-create',      label: '강좌 생성 가이드' },
      { id: 'textbook-register',  label: '교재 등록 및 강좌 연결 가이드' },
      { id: 'class-schedule',     label: '강좌 스케줄 관리 가이드' },
    ],
  },
  {
    id: 'operation', label: '수업운영관리', icon: 'Calendar',
    amsPath: '/operation/class/manage',
    guides: [
      { id: 'class-manage',    label: '수업관리 화면 가이드' },
      { id: 'class-transfer',  label: '전반 처리 가이드' },
      { id: 'unpaid-withdraw', label: '미납자 퇴반처리' },
      { id: 'qr-trouble',      label: 'QR 출석 인식 실패 트러블슈팅' },
    ],
  },
  {
    id: 'billing', label: '청구/수납/결제/환불', icon: 'CreditCard',
    amsPath: '/billing',
    guides: [
      { id: 'billing-guide',   label: '청구 생성 가이드' },
      { id: 'payment-switch',  label: '전환결제 처리 가이드' },
      { id: 'refund-policy',   label: '환불 승인 기준 판단 가이드' },
      { id: 'payment-method',  label: '결제 수단 등록 가이드' },
    ],
  },
  {
    id: 'customer', label: '고객(원생) 관리', icon: 'Users',
    amsPath: '/customer/member/detail',
    guides: [
      { id: 'member-merge',        label: 'AMS 회원 병합 가이드' },
      { id: 'duplicate-account',   label: '중복 계정 통합 프로세스' },
      { id: 'student-suspension',  label: '휴강 처리 절차' },
    ],
  },
  {
    id: 'message', label: '메시지발송 관리', icon: 'MessageSquare',
    amsPath: '/message',
    guides: [
      { id: 'sms-send',              label: '문자 발송 가이드' },
      { id: 'virtual-account-guide', label: '가상계좌 안내 문자 발송 가이드' },
    ],
  },
  {
    id: 'system', label: '공통/시스템', icon: 'Settings',
    amsPath: AMS,
    guides: [
      { id: 'ams-glossary',    label: 'AMS 주요 용어 사전' },
      { id: 'response-manual', label: '상황별 CS 대응 매뉴얼' },
      { id: 'policy-2026',     label: '2026 수강료 정책 변경 공지' },
    ],
  },
];

export const RECENT_GUIDES = [
  { id:'course-create',         module:'강좌/교재 관리',       title:'강좌 생성 가이드',                     updated_at:'2026-04-12', views: 267, helpful: 22, version: 'v2.0', author: '박소연', tags: ['강좌', '필수'] },
  { id:'recruit-application',   module:'모집/접수 관리',       title:'모집 신청 접수 처리 가이드',           updated_at:'2026-04-10', views: 198, helpful: 16, version: 'v1.3', author: '박소연', tags: ['접수', '필수'] },
  { id:'member-merge',          module:'고객(원생) 관리',      title:'AMS 회원 병합 가이드',                 updated_at:'2026-04-08', views: 342, helpful: 28, version: 'v2.1', author: '김명준', tags: ['회원관리', '필수'] },
  { id:'textbook-register',     module:'강좌/교재 관리',       title:'교재 등록 및 강좌 연결 가이드',        updated_at:'2026-04-08', views: 143, helpful: 12, version: 'v1.5', author: '이준호', tags: ['교재', '청구'] },
  { id:'sms-send',              module:'메시지발송 관리',      title:'문자 발송 가이드',                     updated_at:'2026-04-06', views: 178, helpful: 15, version: 'v1.4', author: '김명준', tags: ['문자', '필수'] },
  { id:'qr-trouble',            module:'수업운영관리',         title:'QR 출석 인식 실패 트러블슈팅',         updated_at:'2026-04-03', views: 423, helpful: 35, version: 'v3.2', author: '이준호', tags: ['출석', '트러블슈팅'] },
  { id:'billing-guide',         module:'청구/수납/결제/환불',  title:'청구 생성 가이드',                     updated_at:'2026-04-01', views: 215, helpful: 18, version: 'v1.8', author: '이준호', tags: ['청구', '필수'] },
  { id:'refund-policy',         module:'청구/수납/결제/환불',  title:'환불 승인 기준 판단 가이드',           updated_at:'2026-03-28', views: 567, helpful: 45, version: 'v2.5', author: '이준호', tags: ['환불', '필수', '실장'] },
  { id:'payment-switch',        module:'청구/수납/결제/환불',  title:'전환결제 처리 가이드',                 updated_at:'2026-03-25', views: 187, helpful: 14, version: 'v2.0', author: '김명준', tags: ['결제', '자주묻는질문'] },
  { id:'waitlist-manage',       module:'모집/접수 관리',       title:'대기번호 관리 및 입반 전환 가이드',    updated_at:'2026-03-28', views: 134, helpful: 11, version: 'v1.2', author: '이준호', tags: ['대기', '입반'] },
  { id:'class-transfer',        module:'수업운영관리',         title:'전반 처리 가이드',                     updated_at:'2026-03-14', views: 156, helpful: 11, version: 'v1.5', author: '박소연', tags: ['입반', '필수'] },
  { id:'virtual-account-guide', module:'메시지발송 관리',      title:'가상계좌 안내 문자 발송 가이드',       updated_at:'2026-03-25', views: 112, helpful: 9,  version: 'v1.1', author: '이준호', tags: ['결제', '문자'] },
  { id:'duplicate-account',     module:'고객(원생) 관리',      title:'중복 계정 통합 프로세스',              updated_at:'2026-04-01', views: 98,  helpful: 7,  version: 'v1.2', author: '박소연', tags: ['회원관리', '실장'] },
  { id:'ams-glossary',          module:'공통/시스템',           title:'AMS 주요 용어 사전',                   updated_at:'2026-03-25', views: 234, helpful: 18, version: 'v1.9', author: '김명준', tags: ['용어', '공통'] },
  { id:'unpaid-withdraw',       module:'수업운영관리',         title:'미납자 퇴반처리 가이드',               updated_at:'2026-03-20', views: 145, helpful: 12, version: 'v1.4', author: '박소연', tags: ['퇴반', '청구'] },
  { id:'student-suspension',    module:'고객(원생) 관리',      title:'휴강 처리 절차',                       updated_at:'2026-03-15', views: 89,  helpful: 6,  version: 'v1.1', author: '김명준', tags: ['휴강', 'SOP'] },
];

// 인기 가이드 (조회수 기준)
export const POPULAR_GUIDES = RECENT_GUIDES
  .sort((a, b) => (b.views || 0) - (a.views || 0))
  .slice(0, 5);

// 검색 동의어 사전 — 사용자 자연어 검색을 AMS 용어로 매핑
export const SEARCH_SYNONYMS = {
  '환불': ['돈 돌려받기', '수강료 반환', '환불 신청', '환불 거절'],
  '회원 병합': ['계정 통합', '중복 계정', '계정 합치기', '회원 통합'],
  '청구': ['수강료 청구', '결제', '청구서', '결제 생성'],
  '출석': ['출석 처리', 'QR', '출결', '출석 인식'],
  '수업 관리': ['수업 운영', '강좌 관리', '수강', '수업'],
  '결제': ['카드 결제', '결제 수단', '결제 변경', '전환 결제'],
};
