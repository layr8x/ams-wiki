-- AMS Wiki 시드 데이터 (mockData.js 기반 자동 생성)
-- 생성일: 2026-05-12T07:03:09.828Z
-- 실행: Supabase SQL Editor에서 schema.sql 실행 후 이 파일 실행

-- 기존 데이터 제거 (선택)
-- DELETE FROM guides;

-- AMS 회원 병합 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('member-merge', 'SOP', '고객(원생) 관리', 'AMS 회원 병합 가이드', '학생이 마이클래스에서 직접 수강정보 연동을 하지 못하는 경우 관리자가 AMS 데이터를 옮겨줄 수 있는 기능입니다.
병합은 ''동일 회원의 계정''임을 확인한 계정끼리만 가능합니다. 이름 등 개인정보가 다른 경우 확인 후 작업 필요합니다.', 'AMS 어드민 > 고객(원생) 관리 > 회원조회', 'https://ams.sdij.com/customer/member/detail', '1815216142', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1815216142', '{"운영자","실장"}', '{"회원관리","필수"}', '김명준', 'v2.1', 'published', 342, 28, 92, '[{"title":"FROM·TO 회원 정보 입력","desc":"FROM 회원(이관할 계정), TO 회원(받을 계정)의 회원명과 회원번호를 입력합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1815216142/image-20260407-083236.png?version=1&api=v2","name":"FROM·TO 입력 화면"}},{"title":"[회원 병합하기] 버튼 클릭","desc":"FROM/TO 회원 정보 검토 후 [확인] 버튼을 클릭합니다. FROM이 로컬계정인 경우 병합 시 자동 탈퇴 처리됩니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1815216142/image-20260407-083240.png?version=1&api=v2","name":"병합 확인 팝업"}},{"title":"병합 결과 확인","desc":"입반, 접수, 결제, 환불, 대기번호, 상담이력이 모두 이관됩니다. 대기번호는 빠른 대기번호로 이관됩니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1815216142/image-20260407-083247.png?version=1&api=v2","name":"병합 완료 결과"}}]'::jsonb, '[{"field":"FROM 회원","desc":"정보를 이관하고자 하는 회원 (이관 원본)","required":true},{"field":"TO 회원","desc":"정보를 받고자 하는 회원 (이관 대상)","required":true}]'::jsonb, '[{"label":"로컬 2개, 1개만 AMS 데이터 있음","action":"데이터 있는 쪽을 유지하고, 없애는 계정은 핸드폰 번호 010-0000-0000 변경 + \"미사용\" 태그 처리","note":"미사용 태그 계정은 회원 검색 결과에서 제외됨","image":{"url":"/api/confluence-img/wiki/download/attachments/1815216142/image-20260407-083236.png?version=1&api=v2","name":"계정 정리 화면"}},{"label":"둘 다 AMS 데이터 있음 — 한 쪽에 결제 있는 경우","action":"없애는 계정에서 결제취소 후 사용할 계정에서 재결제 안내. 재결제 확인 후 핸드폰 번호 010-0000-0000 변경 + 미사용 태그 처리","note":"재결제 확인 전 절대 계정 삭제 불가","images":[{"url":"/api/confluence-img/wiki/download/attachments/1815216142/image-20260407-083240.png?version=1&api=v2","name":"결제 취소 전"},{"url":"/api/confluence-img/wiki/download/attachments/1815216142/image-20260407-083247.png?version=1&api=v2","name":"재결제 완료 후"}]},{"label":"둘 다 AMS 데이터 있음 — 한 쪽에 입반/접수 있는 경우","action":"없애는 계정에서 퇴반/접수취소 후 사용할 계정에서 입반/접수 완료 후, 없애는 계정은 핸드폰 번호 010-0000-0000 변경 + 미사용 태그 처리","note":""},{"label":"통합 1개 + 로컬 1개 — 통합에 AMS 데이터 없음","action":"수동 처리사항 없음. 회원이 직접 통합회원 로그인 후 계정 연동 → 통합회원으로 회원 데이터 병합됨","note":"마이클래스 > 학원 등록 정보 연동 메뉴 안내"}]'::jsonb, '{"병합은 동일 회원임이 확인된 계정끼리만 진행 — 이름/개인정보가 다르면 반드시 확인 후 작업","대기번호는 이관 전/후 모두 데이터 있으면 빠른 대기번호로 이관 (순번 변경 주의)","동일 강좌에 양쪽 모두 입반 상태인 경우 결제/수강 내역 없는 1개 계정 퇴반 처리 후 재시도"}', '[{"issue":"\"동일한 회원은 병합할 수 없습니다\"","cause":"FROM과 TO 회원을 동일하게 입력","solution":"FROM/TO 회원 정보를 정확하게 구분하여 재입력","severity":"medium"},{"issue":"\"병합이력이 존재합니다\"","cause":"FROM 회원에 이미 병합 이력 있음","solution":"이미 병합된 회원이므로 플랫폼서비스실 문의","severity":"high"},{"issue":"\"중복 접수내역이 존재합니다\"","cause":"동일 전형에 양쪽 모두 접수 내역 있음","solution":"2개 중 1개 계정 접수 내역 취소 후 재시도","severity":"high"},{"issue":"\"중복 입반이 불가능합니다\"","cause":"두 계정이 동일 강좌에 모두 입반 상태","solution":"결제/수강 내역 없는 1개 계정 퇴반 처리 후 재시도","severity":"high"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-01-30T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 중복 계정 통합 프로세스
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('duplicate-account', 'DECISION', '고객(원생) 관리', '중복 계정 통합 프로세스', '로컬/통합회원 간 중복 계정 발생 시 상황별 처리 기준입니다. AMS 데이터 유무에 따라 처리 방법이 달라집니다.', 'AMS 어드민 > 고객(원생) 관리 > 회원조회', 'https://ams.sdij.com/customer/member/detail', '1614381124', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1614381124', '{"운영자","실장"}', NULL, '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '[{"cond":"로컬 2개 — 1개만 AMS 데이터 있음","action":"데이터 있는 계정 유지, 나머지 미사용 처리","note":"010-0000-0000 변경 + 미사용 태그","status":"safe"},{"cond":"로컬 2개 — 둘 다 AMS 데이터 있음 (결제)","action":"결제취소 후 재결제 → 미사용 처리","note":"재결제 확인 필수","status":"warn"},{"cond":"통합 1개 + 로컬 1개 — 통합 데이터 없음","action":"마이클래스에서 직접 연동 안내","note":"수동 처리 불필요","status":"safe"},{"cond":"통합 1개 + 로컬 1개 — 통합에 AMS 데이터 있음","action":"개발팀 요청 필요 (수동 이관 불가)","note":"SERP-5958 참고","status":"danger"}]'::jsonb, NULL, NULL, '2026-01-20T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 청구 생성 가이드 (입반 회원 대상)
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('billing-guide', 'SOP', '청구/수납/결제/환불', '청구 생성 가이드 (입반 회원 대상)', '입반 완료된 회원을 대상으로 수강료 및 연결교재를 청구하는 방법을 안내합니다.
청구는 ''일괄 청구''와 ''개별 청구'' 두 가지 방식으로 나뉩니다.', 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세', 'https://ams.sdij.com/operation/class/manage', '1892712732', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1892712732', '{"운영자"}', '{"청구","필수"}', '이준호', 'v1.8', 'published', 215, 18, 0, '[{"title":"수강예정회차 확인","desc":"수업상세/수업통계 화면에서 수강예정회차 컬럼(+버튼 클릭)을 확인합니다. 청구 대상자 선정 기준이므로 반드시 먼저 확인합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1892712732/image-20260305-035353.png?version=1&api=v2","name":"수강예정회차 컬럼"}},{"title":"청구 대상자 선택","desc":"일괄 청구는 대상자 선택 없이 또는 N명 선택 후 진입. 개별 청구는 특정 회원 선택 후 [청구생성] 버튼 클릭.","image":null},{"title":"청구 생성 팝업에서 상품 선택","desc":"수강료 또는 연결교재(교재단품/회차패키지/선택패키지)를 선택합니다. 수강료 청구 시 연결교재를 함께 선택하면 해당 회차 기준으로 자동 청구됩니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1892712732/image-20260306-031117.png?version=1&api=v2","name":"청구 생성 팝업"}},{"title":"대상자 확인 후 저장","desc":"\"총 N명\"을 클릭하여 청구 대상자 목록을 확인 후 [저장] 버튼을 클릭합니다.","image":null},{"title":"출석부에서 박스 생성 확인","desc":"청구 완료 후 수업상세 출석부에서 출결박스 및 배부박스가 정상 생성되었는지 확인합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1892712732/image-20260306-032658.png?version=1&api=v2","name":"출결박스·배부박스 확인"}}]'::jsonb, '[{"field":"수강료","desc":"수업 회차별로 청구되는 수강 비용","required":true},{"field":"교재단품","desc":"1회성으로 청구되는 실물 교재","required":false},{"field":"회차패키지","desc":"수강료 회차와 1:1 매칭되어 출석+배부 함께 처리","required":false},{"field":"선택패키지","desc":"회원이 선택적으로 구매하는 특정 시점 일괄 청구 교재","required":false}]'::jsonb, '[{"label":"수강료 + 회차패키지 동시 청구 (일반)","action":"청구생성 팝업 > 연결교재 청구 선택 영역에서 교재그룹(회차패키지) 체크 후 [저장]","note":"출결박스와 배부박스가 함께 생성됩니다"},{"label":"수강료는 기청구, 교재만 추가 청구","action":"해당 회원만 선택 후 [청구생성] > 연결교재 탭에서 교재 선택 > [저장]","note":"중도입반 또는 교재 청구 누락 케이스"},{"label":"온라인 카드 분할 청구","action":"개별 청구로 청구를 쪼개서 생성 — 특정 회원 선택 후 분할 금액으로 복수 청구 생성","note":"청구관리 경로는 권장하지 않음"}]'::jsonb, '{"청구 생성 전 반드시 수강예정회차 컬럼 확인 필수 — 잘못된 회차 기준으로 청구 시 수정 복잡","청구관리 경로 직접 진입은 권장 안 함 — 수업상세 또는 수업통계 경로 사용"}', NULL, NULL, NULL, NULL, NULL, '2026-03-04T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 전환결제 처리 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('payment-switch', 'SOP', '청구/수납/결제/환불', '전환결제 처리 가이드', '기존 결제수단을 변경해야 할 때 사용하는 처리 방식입니다.
전환결제는 기존 결제를 수정하는 게 아니라 새 결제를 먼저 생성하고 기존 결제를 취소하는 구조입니다.', 'AMS 어드민 > 고객(원생) 관리 > 회원조회 > 회원상세 > 결제내역(TAB)', 'https://ams.sdij.com/customer/member/detail', '1798897665', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1798897665', '{"운영자","실장"}', '{"결제","자주묻는질문"}', '김명준', 'v2.0', 'published', 187, 14, 0, '[{"title":"전환할 결제내역 선택","desc":"회원상세 > 결제내역 탭에서 전환결제 할 결제 데이터를 체크하고 [전환결제] 버튼을 클릭합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1798897665/image-20260204-012452.png?version=1&api=v2","name":"결제내역 탭"}},{"title":"전환결제 수단 선택","desc":"팝업에서 카드단말기/현금/가상계좌/온라인(PG) 중 신규 결제수단을 선택합니다. 온라인 전환 시 결제요청 URL을 회원에게 발송할 수 있습니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1798897665/image-20260204-012431.png?version=1&api=v2","name":"전환결제 팝업"}},{"title":"신규 결제 완료 확인","desc":"회원이 신규 결제수단으로 결제를 완료합니다.","image":null},{"title":"기존 결제 환불 처리","desc":"PG카드는 자동 환불완료. VAN단말기/현금/가상계좌는 환불상세에서 직접 환불 처리 필요합니다.","image":null}]'::jsonb, NULL, '[{"label":"기존 PG카드 → 다른 수단으로 전환","action":"신규 결제 완료 시 기존 PG카드는 자동 환불완료 처리. AMS 추가 작업 불필요","note":"자동 처리 확인 필수"},{"label":"기존 VAN카드/현금 → 다른 수단으로 전환","action":"신규 결제 완료 후 기존 결제는 환불대기 상태. 환불요청처리 메뉴에서 [승인취소] 또는 [이체완료] 처리 필수","note":"미처리 시 정산 오류 발생"},{"label":"가상계좌 전환 — 입금 전 상태","action":"신규 결제데이터가 입금대기 상태로 유지됨. 입금완료 처리 후 기존 결제 환불 처리 진행","note":"입금 전 기존 결제 취소 불가"}]'::jsonb, '{"전환결제 건은 환불취소 불가 — 처리 전 반드시 회원 확인","입금대기 건, 500원 미만 결제건, 이미 취소된 결제건은 전환결제 불가","VAN/현금/가상계좌 기존 결제는 신규 결제 완료 후 직접 환불 처리 필수"}', '[{"issue":"\"입금대기 상태의 결제건은 전환결제가 불가합니다\"","cause":"가상계좌 입금 대기 중인 결제 선택","solution":"입금완료 처리 후 전환결제 진행","severity":"medium"},{"issue":"\"500원 미만 결제건은 전환결제가 불가합니다\"","cause":"500원 미만 소액 결제 선택","solution":"해당 건은 전환결제 불가, 직접 취소 후 재결제 안내","severity":"medium"},{"issue":"\"환불 가능한 금액이 없는 결제건은 전환결제가 불가합니다\"","cause":"이미 취소/환불된 결제건 선택","solution":"결제건 상태 확인 후 정상 결제건으로 재시도","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-02-04T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 환불 승인 기준 판단 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('refund-policy', 'DECISION', '청구/수납/결제/환불', '환불 승인 기준 판단 가이드', '학원법 기준 및 사내 정책에 따른 수강료 환불 산정표입니다. 규정 외 환불은 반드시 실장 전결이 필요합니다.', 'AMS 어드민 > 청구/수납 관리 > 결제 관리 > 환불 승인', 'https://ams.sdij.com/billing/payment/refund', '1867350030', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1867350030', '{"운영자","실장"}', '{"환불","필수","실장"}', '이준호', 'v2.5', 'published', 567, 45, 0, NULL, NULL, NULL, NULL, NULL, NULL, '[{"cond":"개강 전 취소","action":"전액 환불","note":"교재비 별도 반환 절차 필요","status":"safe"},{"cond":"총 교습시간 1/3 경과 전","action":"수강료 2/3 환불","note":"시스템 자동 산출 가능","status":"safe"},{"cond":"총 교습시간 1/2 경과 전","action":"수강료 1/2 환불","note":"증빙 서류(질병 등) 확인 필수","status":"warn"},{"cond":"총 교습시간 1/2 경과 후","action":"환불 불가","note":"★실장 특이사항 승인 시에만 처리 가능","status":"danger"}]'::jsonb, NULL, NULL, '2026-04-10T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 수업관리 화면 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('class-manage', 'REFERENCE', '수업운영관리', '수업관리 화면 가이드', '수업관리 시스템은 수업 일정, 출결 관리, 입퇴반, 보강 지급 등 수업 관련 전반적인 업무를 처리하는 통합 관리 시스템입니다.', 'AMS 어드민 > 수업운영관리 > 수업관리', 'https://ams.sdij.com/operation/class/manage', '1693811041', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1693811041', '{"운영자"}', NULL, '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{"term":"수강예정회차","def":"조회일(당일 포함) 이후 색깔있는 출결박스의 개수(결석 or 출석예정 or 출석). 청구 대상자 선정 기준."},{"term":"이용가능회차","def":"이용가능금액으로 출결처리 가능한 미래 수업일자의 회차 개수. 클릭 시 금액현황 화면 호출."},{"term":"이용가능금액","def":"받은금액 + 결제완료금액 - 강좌이용금액 - 환불대기금액 - 환불완료금액 - 보낸금액"},{"term":"납부상태 — 납부완료","def":"해당 회차금액이 결제완료된 상태"},{"term":"납부상태 — 납부대기","def":"해당 회차금액이 결제되지 않은 상태"},{"term":"납부상태 — 미납","def":"납부대기 상태에서 출석 발생해 해당 회차금액이 마이너스 차감된 상태"},{"term":"현장출석","def":"해당 반 수강생이면서 해당 수업일·강의실에서 출석처리한 회원 수"},{"term":"타반보강","def":"해당 반 수강생이면서 동일 보강코드인 반에서 출석처리한 회원 수"},{"term":"VOD 보강","def":"입반 상태인 해당 반 수강생이면서 마이클래스+연구실 동영상보강으로 출석처리한 회원 수"},{"term":"정산가능인원","def":"출석부 영역을 기준으로 박스있는 회원 수 (해당 회차금액 포함 청구가 생성된 회원)"}]'::jsonb, NULL, '2025-12-28T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 전반 처리 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('class-transfer', 'SOP', '수업운영관리', '전반 처리 가이드', '전반은 수강생이 현재 강좌에서 다른 강좌로 이동하는 처리입니다.
전반 전 강좌의 퇴반일 설정 이후 청구된 수강료의 출석예정 출결박스 및 연결교재의 수령예정 배부박스는 동일한 상태로 전반 후 강좌로 이동합니다.', 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세 > 입반생 > 전반처리', 'https://ams.sdij.com/operation/class/manage', '1934295041', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1934295041', '{"운영자","실장"}', '{"입반","필수"}', '박소연', 'v1.5', 'published', 156, 11, 0, '[{"title":"전반 전 강좌에서 퇴반 회차 선택","desc":"몇 회차 수업 후 퇴반할 것인지 선택합니다. 전반 후 강좌의 입반 회차가 자동으로 설정됩니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1934295041/image-20260314-155151.png?version=1&api=v2","name":"퇴반 회차 선택"}},{"title":"전반 후 출결/배부박스 미리 확인","desc":"전반 후 강좌에 만들어질 수강료 출결박스와 교재 배부박스를 시각적으로 확인합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1934295041/image-20260314-155322.png?version=1&api=v2","name":"이관 박스 미리보기"}},{"title":"이관 대상 수강료·교재 정보 확인","desc":"전반 전 강좌의 실 결제금액 - 이용금액 - 이용예정금액이 전반 후 강좌로 이관됩니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1934295041/image-20260314-155837.png?version=1&api=v2","name":"이관 수강료 확인"}},{"title":"전반 처리 완료","desc":"전반 처리 후 전반 후 강좌에서 청구생성을 진행합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1934295041/image-20260314-160942.png?version=1&api=v2","name":"전반 완료 화면"}}]'::jsonb, NULL, '[{"label":"한 회차도 수강하지 않고 전반하려는 경우","action":"\"수강하지 않음\"을 선택하여 입/퇴반일을 동일하게 설정하여 전반 가능","note":"수강이력 없으면 퇴반 후 입반 처리가 권장됨"},{"label":"전반 후 강좌에 이전 입반기간과 중복되는 경우","action":"[주의!! 재등록 강좌] 이전 입반기간의 청구/환불 내역 정리 여부를 먼저 확인","note":"미정리 시 전반 불가"}]'::jsonb, '{"전반 전 강좌에서 선택한 회차부터 이후에 이미 출석상태가 있으면 전반 불가","전반 전 강좌의 회차 중 수업일이 지난 출석예정 회차가 있으면 출결처리 후 재시도","배부회차가 종료되는 교재에 수령예정 교재가 있으면 수령처리 후 재시도","혜택(쿠폰) 변경이 필요한 경우 전반처리 불가 — 퇴반 후 입반 처리로 진행"}', '[{"issue":"\"혜택(쿠폰) 변경이 필요해 전반처리가 불가능합니다\"","cause":"전반 전/후 강좌에 동일한 혜택 적용이 불가한 경우","solution":"퇴반처리 후 입반처리로 진행","severity":"medium"},{"issue":"\"마지막 출석일 이후로 설정할 수 있습니다\"","cause":"전반 전 강좌에서 선택한 회차 이후에 출석상태 존재","solution":"해당 회차 이후 출결 확인 후 올바른 퇴반 회차 선택","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-03-14T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 미납자 퇴반처리 방법
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('unpaid-withdraw', 'SOP', '수업운영관리', '미납자 퇴반처리 방법', '미납자(이용가능회차=0) 대상 퇴반처리 방법입니다.', 'AMS 어드민 > 수업운영관리 > 수업관리', 'https://ams.sdij.com/operation/class/manage', '1555169309', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1555169309', '{"운영자"}', '{"퇴반","청구"}', '박소연', 'v1.4', 'published', 145, 12, 0, '[{"title":"수업운영관리 > 수업관리 진입","desc":"해당 강좌명을 선택하여 수업관리 상세 화면에 진입합니다.","image":null},{"title":"입반생 목록 조회","desc":"[검색] 버튼을 눌러 입반생 목록을 불러옵니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1555169309/image-20251124-100700.png?version=1&api=v2","name":"수업관리 입반생 목록"}},{"title":"미납자 확인","desc":"납부잔여회차(이용가능회차)가 0인 학생을 확인합니다.","image":null},{"title":"퇴반 처리","desc":"퇴반처리할 학생들을 체크 선택 후, 좌측 상단 퇴반일을 선택한 뒤 [퇴반처리] 버튼을 클릭합니다.","image":{"url":"/api/confluence-img/wiki/download/attachments/1555169309/image-20251124-100722.png?version=1&api=v2","name":"퇴반 처리 버튼"}}]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-24T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- QR 출석 인식 실패 트러블슈팅
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('qr-trouble', 'TROUBLE', '수업운영관리', 'QR 출석 인식 실패 트러블슈팅', '학생 QR 리더기 인식 오류 시 현장에서 즉시 조치할 수 있는 체크리스트입니다. 해결 불가 시 수동 출석으로 대체하세요.', 'AMS 어드민 > 수업운영관리 > 출결 관리 > 수동 출석', 'https://ams.sdij.com/operation/attendance', '1608876067', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1608876067', '{"운영자"}', '{"출석","트러블슈팅"}', '이준호', 'v3.2', 'published', 423, 35, 0, NULL, NULL, NULL, NULL, '[{"issue":"카메라 로딩 무한 반복","cause":"브라우저 보안 권한 미허용","solution":"주소창 좌측 자물쇠 아이콘 클릭 → 카메라 ''허용'' 선택","severity":"high"},{"issue":"특정 기기 인식 불가","cause":"반사 방지 필름에 의한 왜곡","solution":"기기 각도 조절 또는 번호 입력 폴백(Fallback) 사용","severity":"medium"},{"issue":"전체 기기 동시 불가","cause":"AMS 서버 장애 또는 네트워크 단절","solution":"수동 출석 모드 전환 후 플랫폼서비스실 긴급 연락","severity":"critical"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-05T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- AMS 주요 용어 사전
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('ams-glossary', 'REFERENCE', '공통/시스템', 'AMS 주요 용어 사전', 'AMS 운영·개발·CS 응대 시 반드시 알아야 할 표준 용어 모음입니다. 동일 용어가 부서마다 다르게 통용되어 발생하는 의사소통 사고를 예방하기 위해 작성되었습니다. 신규 입사자 온보딩 1주 차 필수 숙지 자료.', '시스템 전체 · 운영 공통', 'https://ams.sdij.com', '1378910301', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1378910301', '{"운영자","실장","관리자","신규 입사자"}', '{"용어","공통"}', '김명준', 'v1.9', 'published', 234, 18, 95, NULL, '[{"field":"계정/회원","desc":"Primary Account, FROM/TO 회원, 통합회원, 로컬회원 등 회원 식별 관련 용어","required":true},{"field":"결제/청구","desc":"PG/VAN, MID/TID, 전환결제, 환불대기, 미수금 등 결제 흐름 관련 용어","required":true},{"field":"수업/수강","desc":"수강예정회차, 이용가능회차, 전반, Proration 등 수업·청구 연계 용어","required":true},{"field":"시스템/태그","desc":"미사용 태그, 정상회원 태그, 1:1 매칭 등 시스템 분류 용어","required":false},{"field":"CS/응대","desc":"에스컬레이션 기준, SLA, 1차 응대/2차 응대 구분 용어","required":false}]'::jsonb, NULL, '{"용어가 명확하지 않은 채 작업하지 마세요. 잘못된 용어 해석은 환불 처리·수강료 청구·결제 취소 사고로 이어질 수 있습니다.","특히 ''전환결제 / 환불대기 / 미수금'' 세 용어는 부서마다 다르게 통용되므로 이 사전의 정의를 우선합니다.","FROM·TO 회원 개념을 혼동하면 데이터 이관 방향이 거꾸로 진행됩니다. 병합 작업 전 반드시 재확인하세요."}', NULL, NULL, NULL, '[{"term":"Primary Account","definition":"병합 시 데이터의 주체가 되어 모든 이력이 흡수되는 계정. 병합 후 결제·수강·출결 이력은 이 계정으로 통일됨. (= TO 회원)"},{"term":"FROM 회원","definition":"회원 병합 시 정보를 이관하고자 하는 회원. 병합 후 미사용 태그가 자동 부여되어 검색에서 제외됨. (이관 원본 / Source)"},{"term":"TO 회원","definition":"회원 병합 시 정보를 받는 회원. Primary Account와 동일 개념. (이관 대상 / Target)"},{"term":"통합회원","definition":"마이클래스 앱과 연동되어 학부모/학생이 직접 로그인 가능한 회원. 통합 ID 기준으로 결제·열람 권한이 부여됨."},{"term":"로컬회원","definition":"캠퍼스에서 수기로 등록한 회원으로 마이클래스 연동 전 상태. 추후 통합회원으로 병합 가능."},{"term":"미사용 태그","definition":"불필요·중복 로컬계정에 부여하는 태그. 미사용 태그 계정은 회원 검색·청구 대상 자동 산출에서 제외됨."},{"term":"정상회원 태그","definition":"활성 상태로 검색·청구·메시지 발송의 기본 모집단이 되는 태그. 미사용/탈퇴 태그와 상호 배타적."},{"term":"1:1 매칭","definition":"학부모 1명에 학생 1명이 1:1로 매칭된 상태. 형제·자매가 같은 학원에 다닐 경우 매칭이 다대다로 변형됨."},{"term":"PG (Payment Gateway)","definition":"온라인 결제 처리 시스템. MID를 기준으로 결제를 식별. 현재 스마트로(Smartro) 사용. 카드·계좌이체·간편결제 처리."},{"term":"VAN (Value Added Network)","definition":"오프라인 단말기/키오스크 결제 시스템. TID를 기준으로 결제 식별. 카드 단말 결제·현금영수증 처리."},{"term":"MID (Merchant ID)","definition":"PG 온라인 결제 식별값. 업무구분 단위로 생성. 단과/재종/기숙 등 현재 총 9개 MID 운영."},{"term":"TID (Terminal ID)","definition":"VAN 단말기 식별값. 사업자번호 단위로 운영. 대치/목동/분당/반포/용인/출판 등 캠퍼스별 부여."},{"term":"전환결제","definition":"기존 결제수단을 다른 카드/방법으로 변경하는 절차. 새 결제 승인 후 기존 결제 취소 순서가 반드시 선행되어야 함. 비동기로 처리되어 학부모 화면에서 잠시 두 건이 동시 노출될 수 있음."},{"term":"환불대기","definition":"VAN/현금 결제분 중 환불 승인은 났으나 실제 환불 처리(현금 출납·계좌이체)가 완료되지 않은 상태. 직접 처리 필요."},{"term":"미수금","definition":"청구가 발생했으나 수납이 완료되지 않은 잔액. AMS는 회원별 미수금 합계와 청구 단위 미수금을 별도 표시."},{"term":"청구","definition":"학부모에게 발송되는 수강료·교재비·기타 비용의 청구서 단위. 강좌 기준으로 자동 생성됨."},{"term":"수납","definition":"청구된 금액이 실제 결제·입금 완료된 상태. 수납 완료 시 출결 처리 가능."},{"term":"Proration (일할 계산)","definition":"중도 입반/퇴반 시 수업 일수에 비례하여 청구 금액을 안분하는 로직. 강좌 시작일·종료일·수강예정회차 기준으로 산정."},{"term":"수강예정회차","definition":"조회일(당일 포함) 이후 색깔있는 출결박스의 개수. 청구 대상자 자동 산출의 기준값."},{"term":"이용가능회차","definition":"이용가능금액으로 출결처리 가능한 미래 수업일자의 회차 개수. 잔액÷회차당 단가로 계산."},{"term":"전반","definition":"현재 강좌에서 다른 강좌로 이동하는 처리. 수강료 잔액이 전반 후 강좌로 이관되며, 청구·결제 이력은 양쪽에서 모두 조회 가능."},{"term":"입반/퇴반","definition":"특정 강좌에 학생을 등록(입반)하거나 빼는(퇴반) 처리. 입반은 청구 자동 생성 트리거, 퇴반은 환불 검토 트리거가 됨."},{"term":"출결박스","definition":"AMS 어드민에서 학생의 출석 상태를 시각화하는 사각형 단위. 색상별로 출석/결석/지각/사유결석 등 구분."},{"term":"마이클래스","definition":"학부모·학생용 모바일 앱. 결제·수강 정보·출결·성적 조회 채널. 통합회원만 접근 가능."},{"term":"에스컬레이션","definition":"1차 응대로 해결 불가한 문의를 실장 또는 전담 부서로 이관하는 절차. 환불 거절·결제 분쟁 등 민감 케이스 적용."},{"term":"SLA (응대 SLA)","definition":"문의 접수 후 1차 응답까지의 최대 목표 시간. 일반 문의 4시간, 긴급(결제·환불) 1시간."},{"term":"폴백 (Fallback)","definition":"QR 출석 인식 실패 등 1차 처리가 불가한 경우의 보조 처리 절차. 수기 번호 입력·수동 출석 모드 등."}]'::jsonb, NULL, '2026-04-01T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 상황별 CS 대응 매뉴얼
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('response-manual', 'RESPONSE', '공통/시스템', '상황별 CS 대응 매뉴얼', '민감한 고객 문의에 대한 표준 응대 스크립트입니다. 환불/결제/학습관리/계정 관련 9개 주요 시나리오와 에스컬레이션 기준을 포함합니다. 1차 응대 SLA 4시간, 긴급 시나리오 1시간 준수.', '상담 지원 · 운영 공통', 'https://ams.sdij.com', '1378910312', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1378910312', '{"운영자","실장","CS 담당자"}', NULL, '이지원', 'v2.4', 'published', 489, 41, 94, NULL, NULL, NULL, '{"스크립트는 ''기본 문구''이며, 상황·고객 감정 상태에 따라 표현을 다듬어 사용합니다. 단, 금액·정책·제도 관련 문구는 절대 임의로 수정하지 마세요.","''죄송합니다'' 같은 과도한 사과는 회사 과실 인정으로 해석될 수 있으므로 제도적·정책적 결정에는 사용을 지양합니다.","에스컬레이션은 반드시 실장 승인 후 진행합니다. 고객에게 ''실장에게 전달해 드리겠다''는 언급은 확정 후에만 합니다."}', NULL, '[{"scenario":"전환결제 후 취소 요청 (결제 / 긴급)","script":"전환결제 건은 신규 결제 승인과 기존 결제 취소가 비동기로 처리되어 환불취소가 불가합니다. ''전환결제 건은 원복(취소)이 불가하며, 필요 시 신규 결제 후 재조정이 가능합니다''라고 안내드립니다. 고객 불만이 지속될 경우 실장에게 에스컬레이션."},{"scenario":"결제 취소 누락 항의 (결제 / 긴급)","script":"전환결제는 승인·취소가 비동기로 일어남을 설명드리고, PG사 승인 번호를 안내합니다. VAN/현금의 경우 환불대기 상태에서 직접 처리(현금 출납·계좌이체)가 필요함을 안내드립니다. 평균 처리 소요 2영업일 고지."},{"scenario":"성적표/동영상 미수신 항의 (학습관리 / 보통)","script":"먼저 마이클래스 앱의 푸시 알림 설정 상태와, 가입 시 기재된 학부모 연락처 오기입 여부를 함께 확인드립니다. 연락처가 올바른 경우 강사·담임에게 발송 이력을 확인 요청드리며, 재발송 가능합니다."},{"scenario":"환불 거절 항의 — 1/2 경과 (환불 / 긴급)","script":"학원법 제18조 및 사내 환불 정책에 따라 전체 수강 기간의 1/2 경과 시점부터는 환불이 제한됨을 안내드립니다. 다만 의료·전학 등 예외 사유에 해당할 경우 증빙 제출 시 실장 검토 후 부분 환불이 가능합니다."},{"scenario":"계정 중복 문의 (회원관리 / 보통)","script":"로컬회원/통합회원 중복 여부를 확인드린 후, AMS 데이터 유무에 따라 병합 절차를 안내드립니다. 병합 시 FROM 계정의 결제·출결 이력은 TO 계정으로 모두 이관되며 FROM 계정은 검색에서 자동 제외됩니다."},{"scenario":"QR 출석 인식 실패 (출결 / 보통)","script":"기기 인식 문제가 발생한 것으로 확인됩니다. 담임이 수기 번호 입력으로 즉시 출석 처리해 드렸고, 당일 지각 여부에는 영향이 없음을 안내드립니다. 동일 문제 재발 시 단말기 교체 요청 가능."},{"scenario":"마이클래스 로그인 실패 (계정 / 보통)","script":"휴대폰 번호 기준으로 통합회원 계정이 존재하는지 확인드립니다. 미가입이거나 인증번호 수신 문제가 있을 경우, 임시 비밀번호 발급 또는 수동 연동 처리를 도와드립니다. 캠퍼스 방문 시 즉시 해결 가능."},{"scenario":"강좌 중도 퇴반 요청 (입반퇴반 / 보통)","script":"현재 수강예정회차 기준으로 잔여 수강료를 계산해 드리고, 환불 가능 금액을 명확히 안내드립니다. 퇴반 신청서 접수 후 영업일 3일 이내 환불 절차가 진행됩니다."},{"scenario":"개인정보 열람·삭제 요청 (법적 / 위험)","script":"개인정보 보호법 제35조에 따라 열람 요청은 10일 이내, 삭제 요청은 지체 없이 처리됨을 안내드립니다. 본인 확인을 위해 신분증 사본과 요청서 제출이 필요하며, 접수 즉시 법무 담당 및 대표 실장 공유됩니다."}]'::jsonb, '[{"cond":"1차 응대로 해결 가능","action":"표준 스크립트로 응대 후 종결 처리","note":"응대 이력 CRM 기록","status":"safe"},{"cond":"금액 조정·정책 예외 검토 필요","action":"실장 에스컬레이션 (SLA 1시간)","note":"결제·환불 민감도 高","status":"warn"},{"cond":"법적 이슈·외부 문의 포함","action":"즉시 대표 실장 및 법무 담당 공유","note":"고객 녹취 동의 확보","status":"danger"},{"cond":"반복·악성 컴플레인 (동일 건 3회 초과)","action":"전담 실장 지정 후 일원화 응대","note":"응대 이력 타임라인 정리","status":"warn"}]'::jsonb, NULL, NULL, '2026-03-25T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 2026 수강료 정책 변경 공지
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('policy-2026', 'POLICY', '공통/시스템', '2026 수강료 정책 변경 공지', '2026년도 물가 인상분 반영 및 교재 단가 별도 정산 체계로의 전환에 따라 재종(재수종합) 수강료 청구 기준이 변경됩니다. 적용 시점 2026-03-01, 전 캠퍼스 공통. 변경 전후 차액과 학부모 안내 문구는 본 가이드 기준을 준수해주세요.', '운영 정책 · 청구 기준', 'https://ams.sdij.com/policy/2026', '1378910323', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1378910323', '{"운영자","실장","관리자","학부모 응대 부서"}', NULL, '관리자', 'v1.0', 'published', 612, 24, 88, '[{"title":"AMS 어드민에서 강좌 단가 일괄 갱신","desc":"강좌관리 > 단가 관리 메뉴에서 2026-03-01 이후 강좌의 단가를 62만원으로 일괄 변경. 교재비 항목은 분리 체크박스 활성화."},{"title":"청구 템플릿 변경","desc":"청구관리 > 템플릿 > \"재종 표준 청구서\"의 라인 구성을 [수강료 / 교재비] 2개 라인으로 변경. 변경 전 미리보기 검수 필수."},{"title":"학부모 사전 고지 발송","desc":"메시지관리 > 일괄 발송에서 \"2026 정책 변경\" 템플릿으로 전 학부모 발송. 발송 이력 캡처 후 정책서에 첨부."},{"title":"CS 응대 스크립트 배포","desc":"캠퍼스별 CS 담당에게 본 정책서 + 표준 응대 스크립트(상황별 CS 대응 매뉴얼 참조) 공유. 도입 1주 차 일일 모니터링."}]'::jsonb, '[{"field":"신규 단가","desc":"재종 기준 월 62만원 (기존 55만원 → +7만원, 12.7% 인상)","required":true},{"field":"교재비 분리","desc":"학기당 평균 10만원 별도 청구. 교재 변경·추가 시 차액만 추가 청구","required":true},{"field":"적용 시점","desc":"2026-03-01 이후 신규 등록부터. 기존 등록자는 2026-08 갱신 시점 일괄 전환","required":true},{"field":"적용 범위","desc":"재종 전 캠퍼스 공통 (대치/목동/분당/반포/용인/출판). 단과·기숙은 별도 정책","required":true},{"field":"사전 고지","desc":"2026-01-15 마이클래스 푸시 + 학부모 SMS 일괄 발송 (이력 보관)","required":false},{"field":"CS 응대 문구","desc":"\"물가 상승분 반영 및 교재 단가 분리 정산 체계 도입\" 표준 응대문 사용","required":false}]'::jsonb, NULL, '{"신규 등록(2026-03-01 이후) 학생부터 신규 단가 적용. 기존 등록 학생은 2026년 8월 갱신 시점부터 일괄 전환됩니다.","교재비는 실비 정산으로 변경되어 강좌 단가에서 분리되었습니다. 청구서에서 ''교재비'' 항목이 별도 라인으로 표시되니 학부모 문의 발생 시 본 정책서를 안내해주세요.","변경 전후 차액(월 7만원)은 학원법상 정상적 인상 범위 내이며, 1개월 이상 사전 고지 의무는 충족되었습니다(2026-01-15 사전공지 발송 완료)."}', NULL, NULL, '[{"cond":"신규 등록 학생 (2026-03-01 이후)","action":"신규 단가 + 분리 청구 즉시 적용","note":"안내 문구 첨부 의무","status":"safe"},{"cond":"기존 등록 학생 (2026-02-28 이전 등록)","action":"2026-08 갱신 시점까지 기존 단가 유지","note":"갱신 1개월 전 사전 고지 발송","status":"safe"},{"cond":"학부모가 인상 거부 의사 표명","action":"실장 응대 후 전월 수준 차액 환급 협의 가능","note":"실장 승인 필수","status":"warn"},{"cond":"학원법 사전 고지 미충족 주장","action":"2026-01-15 사전공지 이력(SMS·푸시)으로 응대","note":"이력 캡처 즉시 제공 가능","status":"safe"},{"cond":"집단 환불 요구 (3건 이상 동시 접수)","action":"대표 실장 공유 후 일원화 응대","note":"법무 검토 동시 진행","status":"danger"}]'::jsonb, NULL, '{"before":"월 55만원 일괄 청구 (수강료 + 교재비 통합) · 교재 변경 시 별도 청구 없음 · 청구서 1개 라인으로 표시","after":"월 62만원 + 교재비 실비 별도 청구 (학기당 8~12만원) · 교재 변경 시 차액 정산 · 청구서 2개 라인으로 분리 표시"}'::jsonb, '2026-03-20T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 결제 수단 등록 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('payment-method', 'SOP', '청구/수납/결제/환불', '결제 수단 등록 가이드', '학부모가 AMS에 신용카드, 체크카드, 계좌이체 등을 등록하는 방법을 안내합니다.', 'AMS 모바일앱 > 결제 관리', 'https://ams.sdij.com/payment/method', '1920234567', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920234567', '{"운영자"}', NULL, '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, '[{"title":"앱에서 [결제 관리] 메뉴 진입","desc":"AMS 모바일앱 메인 > 결제 관리 탭 클릭"},{"title":"[결제 수단 추가] 클릭","desc":"카드 또는 계좌이체 선택"},{"title":"결제 수단 정보 입력","desc":"카드번호, 유효기간, CVC 또는 계좌정보 입력"}]'::jsonb, NULL, NULL, '{"결제 수단은 최대 3개까지 등록 가능"}', NULL, NULL, NULL, NULL, NULL, '2026-04-05T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 강좌 스케줄 관리 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('class-schedule', 'REFERENCE', '강좌/교재 관리', '강좌 스케줄 관리 가이드', 'AMS에서 강좌의 개강일, 종강일, 수업요일, 시간을 관리하는 방법입니다.', 'AMS 어드민 > 강좌/교재 관리 > 강좌관리', 'https://ams.sdij.com/course/manage', '1920345678', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920345678', '{"운영자","실장","관리자"}', NULL, '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, NULL, NULL, NULL, '{"개강일 변경 시 기존 청구 이력이 영향받을 수 있음"}', NULL, NULL, NULL, '[{"term":"개강일","def":"강좌의 첫 수업일. 이 날짜부터 청구가 시작됩니다."},{"term":"종강일","def":"강좌의 마지막 수업일. 이후 자동으로 강좌 상태가 종료됨."},{"term":"수업요일","def":"주중 반복되는 수업 요일 (예: 월, 수, 금)"},{"term":"수업 시간","def":"하루에 구성된 시간 (예: 2시간, 3시간)"}]'::jsonb, NULL, '2026-03-30T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 모집 신청 접수 처리 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('recruit-application', 'SOP', '모집/접수 관리', '모집 신청 접수 처리 가이드', '모집 공고에 따른 수강 신청을 접수하고 대기 순번을 배정하는 절차입니다.
접수 마감 전 중복 신청 여부와 배정 가능 인원을 반드시 확인하세요.', 'AMS 어드민 > 모집/접수 관리 > 접수현황', 'https://ams.sdij.com/recruit', '1920567890', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920567890', '{"운영자"}', '{"접수","필수"}', '박소연', 'v1.3', 'published', 198, 16, 88, '[{"title":"모집 공고 상태 확인","desc":"모집/접수 관리 > 접수현황 메뉴에서 해당 강좌의 모집상태가 \"접수중\"인지 확인합니다.","image":null},{"title":"신청 회원 검색","desc":"접수하려는 회원의 이름 또는 연락처로 검색합니다. 동일 회원의 중복 신청 여부를 반드시 확인합니다.","image":null},{"title":"접수 정보 입력","desc":"강좌, 강의 시간대, 교재 선택 여부를 확인 후 [접수 등록] 버튼을 클릭합니다.","image":null},{"title":"대기번호 확인","desc":"정원 초과 시 자동으로 대기번호가 부여됩니다. 대기 순번을 회원에게 안내합니다.","image":null}]'::jsonb, '[{"field":"접수 강좌","desc":"신청할 강좌명 및 시간대","required":true},{"field":"회원 정보","desc":"신청 회원의 이름, 연락처, 생년월일","required":true},{"field":"교재 신청 여부","desc":"해당 강좌의 교재 수령 여부 선택","required":false}]'::jsonb, '[{"label":"정원 초과 시","action":"자동으로 대기번호 부여. 대기 순번과 예상 입반 시기를 회원에게 안내","note":"대기 접수도 동일한 절차로 진행"},{"label":"타 캠퍼스 접수 문의","action":"해당 캠퍼스 운영팀에 직접 안내 — 캠퍼스 간 접수 공유 불가","note":""}]'::jsonb, '{"동일 회원의 동일 강좌 중복 접수 불가 — 검색 후 기존 접수 여부 반드시 확인","접수 취소 후 재접수 시 기존 대기 순번은 초기화됨"}', '[{"issue":"\"이미 접수된 회원입니다\"","cause":"동일 강좌에 이미 접수 이력 존재","solution":"접수현황에서 기존 접수 내역 확인 후 처리","severity":"medium"},{"issue":"\"모집이 마감된 강좌입니다\"","cause":"해당 강좌 모집 상태가 마감으로 변경됨","solution":"모집상태 재확인 후 대기접수 또는 타 강좌 안내","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-10T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 대기번호 관리 및 입반 전환 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('waitlist-manage', 'SOP', '모집/접수 관리', '대기번호 관리 및 입반 전환 가이드', '대기 접수된 회원의 대기 순번 확인 및 입반 전환 처리 방법입니다.
빠른 대기번호와 일반 대기번호의 처리 순서가 다르므로 주의가 필요합니다.', 'AMS 어드민 > 모집/접수 관리 > 대기번호 관리', 'https://ams.sdij.com/recruit', '1920678901', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920678901', '{"운영자"}', NULL, '이준호', 'v1.2', 'published', 134, 11, 85, '[{"title":"대기번호 현황 확인","desc":"모집/접수 관리 > 대기번호 관리에서 강좌별 대기자 목록을 조회합니다.","image":null},{"title":"입반 가능 인원 확인","desc":"수업관리에서 해당 강좌의 현재 입반 인원과 정원을 확인합니다.","image":null},{"title":"대기자에게 입반 의사 확인","desc":"대기 순번에 따라 회원에게 연락하여 입반 의사를 확인합니다.","image":null},{"title":"입반 전환 처리","desc":"입반 의사 확인 후 [입반 전환] 버튼을 클릭하여 수강 접수에서 입반 상태로 변경합니다.","image":null}]'::jsonb, NULL, '[{"label":"빠른 대기번호 우선 처리","action":"빠른 대기번호(회원 병합 시 이관된 대기번호)는 일반 대기번호보다 우선 입반 전환","note":"빠른 대기번호는 목록 상단에 표시"},{"label":"입반 의사 없음","action":"대기 취소 처리 후 다음 순번의 대기자에게 연락","note":"취소된 대기번호는 복구 불가"}]'::jsonb, '{"대기 취소 후 재접수 시 순번이 후순위로 변경됨","입반 전환 전 반드시 회원의 의사를 확인 — 무단 전환 금지"}', NULL, NULL, NULL, NULL, NULL, '2026-03-28T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 강좌 생성 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('course-create', 'SOP', '강좌/교재 관리', '강좌 생성 가이드', 'AMS에서 신규 강좌를 생성하고 수업 일정을 설정하는 방법입니다.
강좌 생성 후 청구 설정 및 교재 연결까지 완료해야 운영 준비가 됩니다.', 'AMS 어드민 > 강좌/교재 관리 > 강좌관리 > 강좌 생성', 'https://ams.sdij.com/course/manage', '1920789012', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920789012', '{"운영자","실장"}', '{"강좌","필수"}', '박소연', 'v2.0', 'published', 267, 22, 90, '[{"title":"강좌 기본 정보 입력","desc":"강좌명, 강사, 강의실, 과목, 대상 학년을 입력합니다.","image":null},{"title":"수업 일정 설정","desc":"개강일, 종강일, 수업 요일 및 시간을 설정합니다. 수업 일수에 따라 자동으로 회차가 생성됩니다.","image":null},{"title":"정원 및 모집 설정","desc":"최대 정원, 모집 시작일/마감일을 설정합니다. 대기 접수 허용 여부도 설정 가능합니다.","image":null},{"title":"수강료 설정","desc":"회차별 수강료, 월별 수강료 등 청구 방식을 설정합니다.","image":null},{"title":"교재 연결 (선택)","desc":"연결할 교재가 있는 경우 [교재 연결] 탭에서 교재를 검색하여 연결합니다.","image":null},{"title":"저장 및 모집 시작","desc":"[저장] 후 모집 상태를 \"접수중\"으로 변경하면 학부모 앱에서 신청 가능 상태가 됩니다.","image":null}]'::jsonb, '[{"field":"강좌명","desc":"학부모/학생 앱에 표시되는 강좌 이름","required":true},{"field":"강사","desc":"담당 강사 선택 (사전 등록 필요)","required":true},{"field":"개강일","desc":"첫 수업일 — 청구의 기준이 되는 날짜","required":true},{"field":"수업 요일/시간","desc":"반복 수업 요일 및 시작·종료 시간","required":true},{"field":"정원","desc":"최대 입반 가능 인원","required":true}]'::jsonb, '[{"label":"연간반 (1년 기준) 강좌","action":"개강일은 3월 1일, 종강일은 익년 2월 말로 설정. 수강료는 월별 정액으로 설정 권장","note":"방학기간 수업 없는 주는 공휴일 설정으로 회차 제외"},{"label":"단기 특강 강좌","action":"개강일~종강일을 단기로 설정. 수강료는 전체 회차 일괄 청구로 설정","note":"전체 청구 방식이므로 중도 입반 시 일할 계산 필수"}]'::jsonb, '{"강좌 저장 후 개강일, 수업요일 변경 시 기존 청구 이력에 영향을 줄 수 있음","강사 미등록 상태에서는 강좌 생성 불가 — 사전에 강사 등록 필수","정원 설정 후 축소 시 기존 입반생이 있으면 경고 발생"}', '[{"issue":"\"강사가 등록되지 않았습니다\"","cause":"선택한 강사가 AMS에 미등록 상태","solution":"강사 관리 메뉴에서 강사 등록 후 재시도","severity":"medium"},{"issue":"\"중복된 강의실/시간대입니다\"","cause":"동일 강의실에 동일 시간대 강좌가 이미 존재","solution":"강의실 또는 시간대 변경","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-12T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 교재 등록 및 강좌 연결 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('textbook-register', 'SOP', '강좌/교재 관리', '교재 등록 및 강좌 연결 가이드', '교재를 AMS에 등록하고 강좌와 연결하는 방법입니다.
교재 유형(교재단품/회차패키지/선택패키지)에 따라 청구 방식이 달라집니다.', 'AMS 어드민 > 강좌/교재 관리 > 교재관리', 'https://ams.sdij.com/course/textbook', '1920890123', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920890123', '{"운영자","실장"}', '{"교재","청구"}', '이준호', 'v1.5', 'published', 143, 12, 87, '[{"title":"교재 기본 정보 입력","desc":"교재명, 출판사, 단가, 교재 유형(단품/패키지)을 입력합니다.","image":null},{"title":"교재 유형 선택","desc":"교재단품: 1회성 청구. 회차패키지: 수강료와 1:1 매칭 청구. 선택패키지: 회원이 선택적으로 구매.","image":null},{"title":"강좌에 교재 연결","desc":"강좌 관리에서 해당 강좌를 선택 후 [교재 연결] 탭에서 등록한 교재를 연결합니다.","image":null},{"title":"연결 설정 확인","desc":"연결 후 청구 생성 팝업에서 교재 청구 옵션이 정상 표시되는지 확인합니다.","image":null}]'::jsonb, '[{"field":"교재단품","desc":"강좌와 무관하게 1회성으로 청구하는 교재","required":false},{"field":"회차패키지","desc":"수강료 회차와 1:1 매칭되어 출석 + 배부 함께 처리되는 교재","required":false},{"field":"선택패키지","desc":"회원이 특정 시점에 선택하여 일괄 청구하는 교재","required":false}]'::jsonb, '[{"label":"교재를 수강료와 함께 일괄 청구","action":"회차패키지로 등록 후 강좌에 연결 → 청구생성 시 연결교재 청구 옵션 선택","note":"출결박스와 배부박스가 함께 생성됨"},{"label":"교재 추가 또는 변경 필요","action":"기존 연결된 교재를 해제 후 새 교재 연결. 기청구된 회원은 별도 처리 필요","note":"기청구 교재 변경은 환불 후 재청구"}]'::jsonb, '{"교재 단가 변경 시 기존 청구된 금액에는 소급 적용되지 않음","회차패키지 교재는 강좌 종강 이후 수정 불가"}', '[{"issue":"교재 연결 후 청구 팝업에 표시 안됨","cause":"강좌와 교재의 연결 설정 미완료","solution":"교재 연결 탭에서 활성화 여부 재확인","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-08T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 문자 발송 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('sms-send', 'SOP', '메시지발송 관리', '문자 발송 가이드', 'AMS에서 수강생 및 학부모에게 문자(SMS/LMS)를 일괄 또는 개별 발송하는 방법입니다.', 'AMS 어드민 > 메시지발송 관리 > 문자발송', 'https://ams.sdij.com/message', '1920901234', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920901234', '{"운영자","실장"}', '{"문자","필수"}', '김명준', 'v1.4', 'published', 178, 15, 89, '[{"title":"문자 발송 메뉴 진입","desc":"메시지발송 관리 > 문자발송 메뉴로 이동합니다.","image":null},{"title":"수신 대상 선택","desc":"강좌별, 반별, 개별 회원 등 수신 대상을 선택합니다. 다중 선택 가능합니다.","image":null},{"title":"발송 유형 선택","desc":"SMS(90byte 이하) 또는 LMS(90byte 초과)를 선택합니다. 글자수에 따라 자동 전환됩니다.","image":null},{"title":"메시지 내용 작성","desc":"발송할 내용을 작성합니다. #{학생명}, #{강좌명} 등 변수 삽입이 가능합니다.","image":null},{"title":"즉시 발송 또는 예약 발송","desc":"[즉시 발송] 또는 원하는 일시로 [예약 발송]을 선택합니다.","image":null}]'::jsonb, '[{"field":"SMS","desc":"90byte 이하 단문. 1건당 요금 적용","required":false},{"field":"LMS","desc":"90byte 초과 장문. SMS 대비 요금 높음","required":false},{"field":"변수","desc":"#{학생명}, #{강좌명} 등 개인화 변수 사용 가능","required":false}]'::jsonb, '[{"label":"수업 결석 안내 문자","action":"해당 강좌 입반생 중 특정일 결석 처리된 회원만 필터링하여 발송","note":"출결 관리 연동으로 자동 필터 가능"},{"label":"청구 안내 문자","action":"청구 생성 후 해당 강좌 청구 대상자에게 납부 안내 문자 일괄 발송","note":"가상계좌 발급 문자는 별도 메뉴 사용"}]'::jsonb, '{"발송 전 수신 거부 여부 확인 — 수신 거부 회원에게 발송 시 민원 발생 가능","예약 발송 후 내용 수정이 필요하면 발송 30분 전까지 취소 가능","대량 발송(500건 이상)은 발송 전 실장 승인 필요"}', '[{"issue":"발송 실패 메시지 표시","cause":"수신 번호 형식 오류 또는 통신사 오류","solution":"수신 번호 형식 확인(010-XXXX-XXXX) 후 재발송","severity":"medium"},{"issue":"예약 발송이 발송되지 않음","cause":"예약 시간 설정 오류 또는 시스템 오류","solution":"발송 이력에서 예약 상태 확인 후 수동 즉시 발송","severity":"high"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-06T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 가상계좌 안내 문자 발송 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('virtual-account-guide', 'SOP', '메시지발송 관리', '가상계좌 안내 문자 발송 가이드', '가상계좌 결제를 선택한 회원에게 입금 안내 문자를 발송하는 방법입니다.
가상계좌는 회원별로 고유하게 발급되며, 입금 기한이 있으므로 신속한 안내가 필요합니다.', 'AMS 어드민 > 메시지발송 관리 > 가상계좌 안내', 'https://ams.sdij.com/message', '1920012345', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920012345', '{"운영자"}', NULL, '이준호', 'v1.1', 'published', 112, 9, 83, '[{"title":"가상계좌 발급 대상 조회","desc":"메시지발송 관리 > 가상계좌 안내에서 발급된 가상계좌 목록을 조회합니다.","image":null},{"title":"미안내 대상 필터링","desc":"발급 후 문자 미발송 상태인 회원을 필터링합니다.","image":null},{"title":"안내 문자 발송","desc":"[문자 발송] 버튼을 클릭하면 회원별 가상계좌 번호와 입금 기한이 포함된 안내 문자가 자동 발송됩니다.","image":null},{"title":"입금 확인","desc":"발송 후 가상계좌 입금 현황에서 입금 완료 여부를 확인합니다. 입금 기한 내 미입금 시 결제 취소 처리가 필요합니다.","image":null}]'::jsonb, NULL, NULL, '{"가상계좌 안내 문자는 가상계좌 발급 즉시 발송 권장 (발급 후 24시간 이내)","입금 기한 경과 후 입금된 건은 자동 취소 — 재발급 후 안내 필요","동일 회원에게 중복 발송되지 않도록 발송 이력 확인"}', '[{"issue":"가상계좌 번호가 안내 문자에 포함되지 않음","cause":"가상계좌 발급 완료 전 문자 발송 시도","solution":"가상계좌 발급 상태 확인 후 재발송","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-03-25T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 휴강 처리 절차
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('student-suspension', 'SOP', '고객(원생) 관리', '휴강 처리 절차', '학생이 일시적으로 수강을 중단하고자 할 때 휴강 처리하는 방법입니다.
휴강 기간 동안 수강료는 청구되지 않으며, 복강 시 원래 강좌로 복귀합니다.', 'AMS 어드민 > 고객(원생) 관리 > 회원조회 > 회원상세', 'https://ams.sdij.com/customer/member/detail', '1920456789', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1920456789', '{"운영자","실장"}', '{"휴강","SOP"}', '김명준', 'v1.1', 'published', 89, 6, 0, '[{"title":"회원 상세 페이지 진입","desc":"고객(원생) 관리 > 회원조회에서 휴강할 회원을 검색하여 선택합니다.","image":null},{"title":"입반 정보 탭 선택","desc":"회원상세 화면의 [입반정보] 탭을 클릭합니다.","image":null},{"title":"휴강 버튼 클릭","desc":"[휴강처리] 버튼을 클릭하고 휴강 시작일과 예상 복강일을 입력합니다.","image":null},{"title":"휴강 승인 및 저장","desc":"입력한 정보를 검토 후 [저장] 버튼을 클릭하여 휴강을 완료합니다.","image":null}]'::jsonb, NULL, '[{"label":"질병으로 인한 단기 휴강","action":"진단서 또는 확인서 첨부 후 [의료사유 휴강] 선택","note":"보험 처리 시 필수 문서"},{"label":"군입대 또는 타 지역 이동","action":"[정상 휴강]으로 처리 후 복강일 미정 설정","note":"복강 시 실장 승인 필요 가능"},{"label":"월 중간 휴강","action":"휴강 시작일을 일자 단위로 입력 (예: 2026-03-15)","note":"해당 월 청구에서 청구제외 처리됨"}]'::jsonb, '{"휴강 중 해당 강좌에 청구 불가 — 자동으로 청구 대상에서 제외","휴강 후 복강 시 새로운 입반일로 재입반 처리됨","장기 휴강(3개월 이상)은 실장에게 사전 보고 권장"}', '[{"issue":"\"해당 회원은 이미 휴강 상태입니다\"","cause":"동일 강좌에 이미 활성 휴강 존재","solution":"기존 휴강을 복강하거나 일시중단 상태 확인","severity":"medium"},{"issue":"\"복강일이 휴강일보다 앞설 수 없습니다\"","cause":"예상 복강일을 휴강 시작일 이전으로 설정","solution":"복강일을 휴강 시작일 이후로 수정","severity":"low"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-03-15T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 입반 처리 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('enrollment-process', 'SOP', '수업운영관리', '입반 처리 가이드', '수강 접수가 완료된 회원을 강좌에 입반시키는 절차입니다.
입반 처리 후 반드시 청구 생성을 진행해야 수강료가 청구됩니다.', 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세 > 접수생 목록', 'https://ams.sdij.com/operation/class/manage', '1921234567', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1921234567', '{"운영자"}', '{"입반","필수"}', '박소연', 'v1.6', 'published', 389, 31, 91, '[{"title":"수업상세 화면 진입","desc":"수업운영관리 > 수업관리에서 입반할 강좌를 선택하여 수업상세 화면으로 이동합니다.","image":null},{"title":"접수생 목록 조회","desc":"[접수생] 탭을 클릭하여 접수 완료된 회원 목록을 불러옵니다.","image":null},{"title":"입반 대상 선택","desc":"입반시킬 회원을 체크박스로 선택합니다. 전체 선택도 가능합니다.","image":null},{"title":"입반일 선택 및 입반 처리","desc":"화면 상단에서 입반일을 선택한 후 [입반처리] 버튼을 클릭합니다.","image":null},{"title":"청구 생성","desc":"입반 처리 완료 후 [청구생성] 버튼을 클릭하여 수강료 청구를 생성합니다. 이 단계를 빠뜨리면 수강료가 청구되지 않습니다.","image":null}]'::jsonb, '[{"field":"입반일","desc":"강좌 수강을 시작하는 날짜. 청구 기산점이 됨.","required":true},{"field":"입반 대상","desc":"접수생 목록에서 선택한 회원. 복수 선택 가능.","required":true}]'::jsonb, '[{"label":"월 중도 입반 (일할 계산 필요)","action":"입반일을 수업 시작일이 아닌 실제 수강 시작일로 설정. 시스템이 자동으로 일할 계산하여 첫 달 수강료를 산출","note":"Proration 자동 계산 옵션 체크 필수"},{"label":"형제/자매 동시 입반","action":"각 회원별로 개별 입반 처리 후 각각 청구 생성. 일괄 처리 불가.","note":"한 명씩 순차적으로 처리"},{"label":"대기자 우선 입반","action":"접수생 탭이 아닌 대기번호 관리에서 입반 전환으로 처리. 대기 순번 순서 준수.","note":"빠른 대기번호 우선"}]'::jsonb, '{"입반 처리 후 반드시 청구 생성까지 완료 — 미완료 시 회원에게 수강료 청구 불가","입반일은 수정이 어려우므로 신중하게 설정","동일 강좌에 이미 입반된 회원은 중복 입반 불가"}', '[{"issue":"\"이미 입반된 회원입니다\"","cause":"동일 강좌에 이미 활성 입반 상태","solution":"입반생 목록에서 현황 확인 후 필요시 퇴반 후 재입반","severity":"medium"},{"issue":"입반 처리 후 출석부에 회원이 표시 안됨","cause":"청구 생성 미완료로 출결박스 미생성","solution":"청구 생성 절차 진행 후 새로고침","severity":"high"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-14T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 출결 처리 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('attendance-process', 'SOP', '수업운영관리', '출결 처리 가이드', 'AMS에서 수업 출결을 처리하는 방법입니다.
QR 출석, 수동 출석, 보강 처리 등 상황별 출결 처리를 안내합니다.', 'AMS 어드민 > 수업운영관리 > 출결 관리', 'https://ams.sdij.com/operation/attendance', '1921345678', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1921345678', '{"운영자"}', '{"출결","필수"}', '이준호', 'v2.3', 'published', 512, 42, 93, '[{"title":"출결 관리 메뉴 진입","desc":"수업운영관리 > 출결 관리에서 해당 수업일의 강좌를 선택합니다.","image":null},{"title":"출결 현황 확인","desc":"수업상세 출석부에서 해당 회차의 출결박스 현황을 확인합니다. 출석예정/출석/결석/보강 상태를 확인할 수 있습니다.","image":null},{"title":"출결 상태 변경","desc":"출결박스를 클릭하여 출석/결석/보강 상태로 변경합니다. QR 출석의 경우 자동 처리됩니다.","image":null},{"title":"보강 처리 (선택)","desc":"결석한 회원에게 보강이 필요한 경우 [보강 부여] 버튼으로 보강 회차를 생성합니다.","image":null}]'::jsonb, '[{"field":"출석예정","desc":"출결박스가 생성되었으나 아직 출석처리가 되지 않은 상태","required":false},{"field":"출석","desc":"해당 회차에 출석 처리된 상태 (현장출석/QR/타반보강/VOD 포함)","required":false},{"field":"결석","desc":"출석 처리 없이 해당 수업일이 경과한 상태","required":false},{"field":"보강","desc":"결석 회원에게 별도로 수업 기회를 제공하는 추가 회차","required":false}]'::jsonb, '[{"label":"QR 인식 실패 시","action":"수동 출석 모드로 전환하여 직접 출석 처리. QR 인식 실패 원인은 별도 트러블슈팅 가이드 참고","note":"전체 기기 불가 시 플랫폼서비스실 긴급 연락"},{"label":"타반에서 보강 수업을 받은 경우","action":"타반보강으로 자동 집계됨. 보강 코드가 동일한 반에서 출석처리된 경우만 인정","note":"보강 코드 확인 필수"},{"label":"VOD 보강 처리","action":"마이클래스 앱에서 동영상보강으로 출석한 경우 VOD 보강으로 자동 반영. AMS 별도 처리 불필요","note":""}]'::jsonb, '{"출석/결석 상태 변경 후 해당 회차의 이용가능금액이 즉시 반영됨","이미 확정된 과거 출결 수정은 실장 승인이 필요할 수 있음","보강 회차 부여 시 만료일을 반드시 설정 — 미설정 시 영구 보강으로 처리될 수 있음"}', '[{"issue":"출결박스가 생성되지 않음","cause":"해당 회차에 청구 미생성 또는 입반 상태 아님","solution":"입반 및 청구생성 상태 확인 후 청구 생성 진행","severity":"high"},{"issue":"QR 출석이 반영되지 않음","cause":"AMS 서버 지연 또는 오프라인 상태","solution":"새로고침 후 확인. 미반영 시 수동 출석으로 보완 처리","severity":"medium"},{"issue":"결석 처리된 회원의 이용가능금액이 줄지 않음","cause":"납부대기 상태에서 결석 발생 → 미납 상태로 변경됨","solution":"청구 상태 확인 후 미납 처리가 맞는지 검토","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-13T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 결제 요청 문자 발송 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('payment-request-sms', 'SOP', '메시지발송 관리', '결제 요청 문자 발송 가이드', '온라인 결제를 유도하기 위해 결제 요청 URL을 포함한 문자를 발송하는 방법입니다.
전환결제 시 온라인 결제수단 선택 후 학부모에게 결제 URL을 발송할 수 있습니다.', 'AMS 어드민 > 메시지발송 관리 > 결제 요청', 'https://ams.sdij.com/message', '1921456789', 'https://hiconsy.atlassian.net/wiki/spaces/FVSOL/pages/1921456789', '{"운영자"}', NULL, '박소연', 'v1.0', 'published', 95, 8, 81, '[{"title":"결제 요청 메뉴 진입","desc":"메시지발송 관리 > 결제 요청 메뉴로 이동합니다.","image":null},{"title":"결제 요청 대상 선택","desc":"청구는 생성되었으나 미결제 상태인 회원을 필터링합니다.","image":null},{"title":"결제 수단 선택","desc":"온라인 카드(PG) 결제를 선택합니다. 발송되는 URL에 결제 정보가 포함됩니다.","image":null},{"title":"문자 발송","desc":"[결제 요청 문자 발송] 버튼을 클릭하면 학부모에게 고유 결제 URL이 포함된 문자가 발송됩니다.","image":null},{"title":"결제 완료 확인","desc":"발송 후 결제 현황에서 결제 완료 여부를 확인합니다. 미결제 시 재발송 가능합니다.","image":null}]'::jsonb, '[{"field":"결제 요청 URL","desc":"회원별 고유 URL. 클릭 시 바로 결제 화면으로 연결","required":true},{"field":"결제 기한","desc":"결제 요청 유효 기간. 기한 내 미결제 시 URL 만료","required":false}]'::jsonb, '[{"label":"전환결제 시 온라인 URL 발송","action":"전환결제 팝업에서 온라인(PG) 선택 후 [결제요청 URL 발송] 선택 → 자동으로 문자 발송","note":"전환결제 완료 후 기존 결제 환불 절차 필수"},{"label":"URL 만료 후 재발송","action":"결제 요청 메뉴에서 해당 회원을 다시 선택하여 새 URL 발송","note":"이전 URL은 자동 무효화됨"}]'::jsonb, '{"결제 요청 URL은 회원별 고유값 — 타인과 공유 금지","결제 기한(보통 7일) 경과 시 URL 만료 — 재발송 필요"}', '[{"issue":"결제 완료 후에도 미결제 상태로 표시","cause":"PG사 결제 승인 지연","solution":"5분 후 재조회. 미반영 시 PG사 승인 번호로 수동 확인","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-04-03T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 환불대기 취소 처리 (수작업 요청 절차)
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('refund-pending-cancel', 'TROUBLE', '청구/수납/결제/환불', '환불대기 취소 처리 (수작업 요청 절차)', '환불대기 상태로 잘못 진입한 환불 건을 취소(원복)하는 절차입니다.
현재 일부 케이스는 권한 부재로 플서실 수작업 처리가 필요하며, 6개월간 카톡 단톡방에 가장 많이 인입된 1순위 요청 유형(환불대기 키워드 136회·환불코드 109회·환불취소 35회)입니다.
실장 직접 처리 가능 케이스 / 플서실 수작업 케이스를 구분해 정리했습니다.', 'AMS 어드민 > 청구/수납 관리 > 환불 요청 처리', 'https://ams.sdij.com/sell/refund-requests/list', NULL, NULL, '{"실장","운영자","정산팀"}', '{"환불","자주묻는질문","실장"}', '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, '[{"title":"환불대기 상태 확인","desc":"회원조회 > 회원상세 > 결제내역(TAB) 또는 환불요청처리 메뉴에서 환불코드와 결제수단 확인.","image":null},{"title":"결제수단 판별","desc":"PG카드(온라인) / VAN(단말기) / 신한캠퍼스 / 가상계좌 / 현금 중 어떤 수단인지 확인. 처리 방식이 다름.","image":null},{"title":"PG카드 — 직접 취소","desc":"환불코드 클릭 > 환불상세 팝업 > [승인취소 취소] 버튼 클릭 (현재 일부 권한자에게만 노출).","image":null},{"title":"VAN/신한캠퍼스/현금 — 플서실 요청","desc":"카톡방에 [환불코드 #####, 취소 부탁드립니다] 메시지. 가능하면 회원명·강좌명 함께 기재.","image":null},{"title":"처리 완료 확인","desc":"플서실 완료 회신 후 환불요청 목록에서 제거 여부 확인.","image":null}]'::jsonb, NULL, '[{"label":"실장님이 환불처리 잘못 클릭 (실수 케이스)","action":"PG는 즉시 본인 취소. VAN/신캠/현금은 플서실 카톡 요청.","note":"가장 빈번. 환불취소 시 산정금액 0원 여부 먼저 확인"},{"label":"학부모 환불 의사 철회","action":"동일하게 환불대기 취소 요청. 결제 그대로 유지됨.","note":"학부모에게는 환불 진행 안됨 안내"},{"label":"강제취소로 잘못 접수됨","action":"플서실에 [강제취소 취소처리 요청]으로 별도 요청 — 일반 환불취소와 다른 절차","note":"강제취소 취소 기능 개발 예정 (현재 수작업)"}]'::jsonb, '{"환불취소 시 결제는 그대로 유지됨 — 학부모 환불 의사 재확인 후 진행","신한캠퍼스 결제 건은 절대 부분환불 시도 금지 — 전체환불 후 차액 별도 청구 원칙","플서실 작업 평균 12시간 소요 → 긴급 시 멘션(@플랫폼서비스실 황인규 QA 등)으로 우선순위 조정 요청"}', '[{"issue":"실수로 [환불산정] 후 환불대기 상태가 됨","cause":"환불 화면에서 [승인취소]·[저장] 클릭 → 환불 요청 큐로 진입","solution":"PG 결제건은 환불상세 팝업에서 [승인취소 취소] 가능. VAN/신한캠퍼스 건은 플서실 카톡방에 [환불코드 #####, 취소 부탁드립니다]로 요청 (작업 대기 평균 12시간)","severity":"medium"},{"issue":"신한캠퍼스 부분환불 클릭 후 환불대기 잔존","cause":"신한캠퍼스는 부분환불 불가이나 AMS에서 부분환불 실행이 진행됨","solution":"전체금액 환불 후 잔액분 별도 청구 생성 → 플서실에 강제취소 접수 요청","severity":"high"},{"issue":"환불대기 취소 후에도 화면 잔존","cause":"데이터 동기화 지연 또는 회원 병합 이력이 있는 경우 데이터 꼬임","solution":"브라우저 강력 새로고침(Ctrl+F5) 후 재확인, 미해소 시 회원번호 + 환불코드로 플서실 재요청","severity":"medium"}]'::jsonb, NULL, '[{"cond":"결제수단 = PG카드","action":"본인 직접 취소 가능","note":"환불상세 팝업 [승인취소 취소]","status":"safe"},{"cond":"결제수단 = VAN 단말기","action":"플서실 카톡 요청 (수작업)","note":"단말기 환불 영수증 재출력 가능","status":"warn"},{"cond":"결제수단 = 신한캠퍼스","action":"플서실 카톡 요청 (수작업)","note":"부분환불 절대 불가","status":"danger"},{"cond":"결제수단 = 가상계좌/현금","action":"플서실 카톡 요청 (수작업)","note":"현금영수증 동반 취소 처리","status":"warn"},{"cond":"회원 병합 이력 있음","action":"회원번호+환불코드+병합이력 모두 기재하여 요청","note":"데이터 꼬임 가능","status":"warn"}]'::jsonb, NULL, NULL, '2026-05-11T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- OKTA 인증 기기변경 / 재설정 절차
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('okta-device-reset', 'SOP', '공통/시스템', 'OKTA 인증 기기변경 / 재설정 절차', 'OKTA 앱 삭제/휴대폰 교체/장기 미사용 등으로 인증이 풀린 경우, 플서실 박여진님께 메일로 요청해 기기 정보를 리셋받는 절차입니다.
6개월간 월 평균 5건 이상 반복 인입된 운영 업무로, 본인 인증 키(Key)가 기기에 고정되어 있어 재설치만으로는 복구되지 않습니다.', '플랫폼서비스실 메일 요청 (외부 절차)', 'https://ams.sdij.com', NULL, NULL, '{"실장","운영자","관리자"}', '{"OKTA","인증","신규입사자"}', '플랫폼서비스실 박여진', 'v1.2', 'published', 0, 0, 0, '[{"title":"요청 메일 작성","desc":"아래 양식대로 본인 메일 또는 그룹웨어 메일에서 yeojin@hiconsy.com 으로 발송.","image":null},{"title":"필수 기재 사항","desc":"소속 / 성함 / 그룹웨어 계정(이메일) / 변경 사유(앱 삭제·기기변경·신규 등록). 사진이나 오류 화면 첨부 시 처리 더 빠름.","image":null},{"title":"리셋 완료 회신 대기","desc":"평균 30분 ~ 2시간 내 회신. 회신 메일에 재등록 가이드 포함.","image":null},{"title":"앱 재설치 및 QR 등록","desc":"OKTA Verify 앱을 새로 설치 → 로그인 시 화면에 표시되는 QR 코드를 카메라로 스캔 → 푸시 알림 인증 설정.","image":null},{"title":"로그인 테스트","desc":"ams.sdij.com 접속 후 OKTA 푸시 인증으로 로그인 정상 동작 확인.","image":null}]'::jsonb, '[{"field":"수신 메일","desc":"yeojin@hiconsy.com (플랫폼서비스실 박여진)","required":true},{"field":"소속","desc":"예) 대치 고3 단과, 목동 정산팀 등","required":true},{"field":"성함","desc":"실명","required":true},{"field":"그룹웨어 계정","desc":"예) name@hiconsy.com","required":true},{"field":"사유","desc":"기기변경 / 앱 삭제 / 장기 미사용 / 신규 입사","required":false}]'::jsonb, '[{"label":"휴대폰 기기 변경","action":"메일 발송 → 리셋 완료 후 새 기기에서 앱 설치 → QR 등록","note":"구 기기는 자동 해제됨"},{"label":"OKTA 앱 실수로 삭제","action":"동일하게 리셋 요청 (재설치만으로는 복구 불가)","note":"인증 Key가 기기에 고정되어 있음"},{"label":"장기 미사용으로 인증 실패","action":"리셋 + 기존 그룹웨어 비밀번호 재설정 동시 진행 권장","note":"비밀번호는 ID/PW 화면 [암호를 잊으셨나요?] 사용"},{"label":"반포센터 OKTA 2회 인증 발생","action":"반포 IP에서만 발생한 이력이 있음 — 인프라팀 협의 중","note":"실장 개별 리셋과는 무관"}]'::jsonb, '{"OKTA 앱은 설치+최초인증에 고유 Key를 사용 — 삭제 시 처음부터 재설정 필요","긴급 사용 시 카카오톡 단톡방에 OKTA 케이스로 우선 요청 가능 (단, 메일 발송이 원칙)","신규 입사자 OKTA 계정 발급도 동일 절차로 메일 요청"}', '[{"issue":"OKTA Verify 앱에서 QR 인식 안됨","cause":"카메라 권한 미허용 또는 화면 밝기 부족","solution":"앱 권한 재허용 + 화면 밝기 최대로 설정 후 재시도","severity":"low"},{"issue":"리셋 후에도 동일 오류 반복","cause":"브라우저 캐시·쿠키 잔존 또는 다른 그룹웨어 계정 로그인 상태","solution":"시크릿창에서 로그인 시도 또는 인터넷 사용기록(쿠키) 삭제 후 재시도","severity":"medium"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-05-09T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 신한캠퍼스 결제·환불 처리 결정 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('shinhan-campus-payment', 'DECISION', '청구/수납/결제/환불', '신한캠퍼스 결제·환불 처리 결정 가이드', '신한캠퍼스(신캠) 결제는 일반 PG/VAN과 달리 **부분환불 불가** · **분할결제 불가** · **AMS 직접 취소 불가** 등 고유 제약이 있습니다.
잘못 처리 시 학부모 컴플레인과 정산 오류로 이어지므로, 본 결정 가이드의 케이스별 처리 순서를 반드시 따라야 합니다.
카톡 단톡방 6개월간 신한캠퍼스 키워드 58회 등장 — 가장 많은 정책 혼선 영역.', 'AMS 어드민 > 청구/수납 관리 > 신한캠퍼스 처리', 'https://ams.sdij.com/sell/shinhan-campus', NULL, NULL, '{"실장","정산팀"}', '{"신한캠퍼스","결제","정책"}', '정산팀 강선아', 'v1.0', 'published', 0, 0, 0, NULL, '[{"field":"신한캠퍼스(신캠)","desc":"신한금융지주가 제공하는 학원 학습비 후불 결제 서비스 (AMS는 매칭 방식 사용)","required":true},{"field":"강제취소 접수","desc":"신캠 환불 시 사용하는 AMS 절차 — 일반 환불과 다름","required":true},{"field":"강제취소 완료","desc":"정산팀만 처리 가능한 후속 절차 — 실장은 [접수]까지만","required":true}]'::jsonb, '[{"label":"복합결제 (신캠 + 다른 수단)","action":"청구를 분리 생성 후 각각 매칭. 통합 청구 후 분할결제는 불가.","note":"실수 시 데이터 꼬임으로 정산팀 수작업 필요"},{"label":"이관/전반 시 신캠 결제 처리","action":"신캠 결제건은 자동 이관 불가 — 환불 후 재결제 안내","note":"학부모에게 사전 양해 필수"},{"label":"신캠 결제 후 청구 금액 변동","action":"청구 금액 추가 발생 시 추가 청구 생성 후 별도 매칭 (기존 신캠 금액 그대로 유지)","note":"변동 금액이 작아도 별도 처리"}]'::jsonb, '{"신캠 결제는 AMS에서 직접 카드사 취소가 불가하며 정산팀 강제취소 완료를 거쳐야 함","신캠 결제건 1회라도 수강 발생 시 부분환불 절대 불가 (정산팀 공지)","청구를 미리 분리 생성하면 후속 처리가 훨씬 간단해짐 — 청구 설계 단계에서 고려","신캠 결제 정보가 AMS에 안 뜨는 경우 정산팀에 승인번호로 업로드 요청"}', NULL, NULL, '[{"cond":"신캠 결제 후 전체 환불 필요 (수강 0회)","action":"환불산정 화면에서 신한캠퍼스 전체금액으로 [강제취소 접수] → 정산팀이 강제취소 완료처리","note":"직접 PG 취소처럼 처리하면 안 됨","status":"safe"},{"cond":"신캠 결제 후 부분 환불 필요 (1회 이상 수강)","action":"잔여 수강료 별도 청구 생성 → 학부모 신규 결제 → 신캠 전체 강제취소 접수","note":"신캠은 부분환불 절대 불가 (정산팀 공지)","status":"danger"},{"cond":"신캠 결제 후 다른 카드로 전환 결제","action":"신규 PG/VAN 결제 우선 받기 → 신캠 전체 강제취소 → 정산팀이 강제취소 완료","note":"새 결제가 확실히 완료된 것만 확인","status":"warn"},{"cond":"한 학생에 신캠 + 현금 분할 결제","action":"신캠 먼저 매칭 → 잔액을 현금 수납 (역순 불가)","note":"이미 부분수납된 청구는 신캠 매칭 불가","status":"warn"},{"cond":"신캠 결제건을 잘못 매칭 (대상 청구 오류)","action":"매칭금액 0원인 경우 환불처리 → 신캠 처리화면에서 재매칭","note":"실수 잦은 케이스","status":"warn"},{"cond":"신캠 매칭된 청구 중 1건만 취소 필요","action":"청구를 따로 쪼개 발행한 경우만 가능. 통합 매칭된 경우 전체 강제취소 후 재청구","note":"청구 구조 사전 분리가 핵심","status":"danger"}]'::jsonb, NULL, NULL, '2026-05-10T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- CTI 콜 인입 중 중복결제 처리
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('cti-duplicate-payment', 'TROUBLE', '청구/수납/결제/환불', 'CTI 콜 인입 중 중복결제 처리', '키오스크/단말기 결제 중에 CTI(전화 자동 매칭) 콜이 들어오면 결제 화면이 새 탭으로 분기되어 동일 결제가 2회 발생하는 사고입니다.
AMS에 1건만 잡히고 나머지 1건은 카드사에 승인만 되는 케이스가 빈발 — 학부모는 통장 출금으로 확인됩니다.
2025.12 이후 단톡방 단골 트러블이며 시스템 개선 진행 중 (5월 기준 미완료).', 'AMS 어드민 > 청구/수납 관리 > 결제내역', 'https://ams.sdij.com/customer/member/detail', NULL, NULL, '{"실장","정산팀"}', '{"중복결제","키오스크","결제"}', '플랫폼서비스실 조호영', 'v1.1', 'published', 0, 0, 0, '[{"title":"학부모 통장/카드사 앱 확인 요청","desc":"학부모 측에 카드사 앱에서 승인번호 2개 확인 요청. 키오스크 영수증도 가능.","image":null},{"title":"AMS 결제내역 비교","desc":"회원조회 > 결제내역에서 동일 시점에 잡힌 결제건만 확인. 누락된 승인번호를 식별.","image":null},{"title":"플서실 카톡방 요청","desc":"실장님 정보로 정리: 학생명/번호, 강좌명, 누락된 승인번호, 결제금액, 학부모 신고시점. 정산팀 또는 플서실 멘션.","image":null},{"title":"강제취소 접수","desc":"플서실/정산팀이 누락 승인번호를 AMS에 강제 생성 → 강제취소 접수 처리.","image":null},{"title":"강제취소 완료 확인","desc":"PG사 측 실 환불 완료까지 3~5영업일 소요. 학부모에게 사전 안내.","image":null}]'::jsonb, NULL, '[{"label":"학부모는 2회 결제 주장 / AMS 1건","action":"카드사 앱/통장 캡처 받기 → 누락 승인번호 추적 → 강제취소","note":"가장 흔한 케이스"},{"label":"동일 강좌 다른 학생에 결제됨","action":"한쪽 학생 환불처리 + 다른 학생 결제 인정","note":"CTI 호출 시 학생 매칭이 잘못된 경우 발생"},{"label":"문자 발송 이력 불일치 (취소 문자 안 옴 등)","action":"문자 발송 로그 분석을 플서실에 요청. 실 환불은 카드사 기준으로 진행","note":"문자 미수신은 학부모 차단 설정도 의심"}]'::jsonb, '{"PG사 강제취소는 3~5영업일 소요 — 학부모에게 사전 안내 필수","학부모 통장 캡처/영수증 사진 확보 후 요청 — 승인번호 없이 추적 어려움","동일한 현상 재발 방지 위해 결제팀에 케이스 누적 보고 (조호영 멘션)","CTI 콜 인입 시 화면 분기 개선이 진행 중 — 현재는 매뉴얼로 대응"}', '[{"issue":"카드사 통장에는 2회 출금 / AMS에는 1건만","cause":"결제 진행 중 CTI 콜 인입 → 결제 화면 중복 호출 → AMS 측 데이터 연동 누락","solution":"학부모에게 누락 승인번호 받기 → AMS에 결제 강제생성 → 강제취소 접수 (정산팀이 완료처리, PG사 취소 3~5일 소요)","severity":"high"},{"issue":"키오스크 결제 후 단말기 오류 메시지","cause":"결제는 카드사에서 승인 완료되었으나 AMS 응답 누락","solution":"카드사 승인번호 확인 → AMS에 강제업로드 후 정상 청구 매칭","severity":"high"},{"issue":"동일 학생에 동일 강좌 결제 2건","cause":"결제 화면 중복 호출 또는 새로고침 후 재제출","solution":"둘 중 1건 강제취소 접수 → 정산팀 완료처리","severity":"high"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-05-05T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 학부모 대표번호 변경 (부 ↔ 모)
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('parent-phone-change', 'SOP', '고객(원생) 관리', '학부모 대표번호 변경 (부 ↔ 모)', '학생 계정의 대표 학부모 번호를 변경(예: 아버님→어머님)하는 절차입니다.
계정 유형(로컬/통합)·중복 여부에 따라 처리 경로가 다르며, 통합회원은 본인이 직접 마이클래스에서 변경해야 합니다.
6개월 단톡방에서 가장 잦은 회원관리 요청 유형 중 하나(약 50건+).', 'AMS 어드민 > 고객(원생) 관리 > 회원조회 > 회원상세 > [수정]', 'https://ams.sdij.com/customer/member/detail', NULL, NULL, '{"실장","운영자"}', '{"회원관리","학부모번호","자주묻는질문"}', '플랫폼서비스실 황인규 QA', 'v1.3', 'published', 0, 0, 0, '[{"title":"회원 검색","desc":"회원조회에서 학생명 또는 학생번호로 검색.","image":null},{"title":"계정 유형 확인","desc":"회원상세 헤더에서 [로컬] / [통합] 라벨 확인.","image":null},{"title":"로컬회원이면 [수정] 클릭","desc":"회원상세 > 회원명 옆 [수정] 버튼 클릭하여 직접 학부모 번호 변경.","image":null},{"title":"통합회원이면 본인 변경 안내","desc":"학부모에게 마이클래스 앱 > 전체메뉴 > 회원정보 관리에서 본인 휴대폰 본인인증 후 변경 안내.","image":null},{"title":"저장 후 SMS 발송 확인","desc":"변경된 번호로 테스트 문자 발송하여 정상 수신 확인.","image":null}]'::jsonb, NULL, '[{"label":"아버님 → 어머님 번호로 변경","action":"라디오 버튼 라벨 변경은 화면 표시일 뿐 — 실 동작 변화 없음. 번호만 변경하면 OK","note":"학부모에게 라디오 라벨 차이 안내 가능"},{"label":"학생 번호로 학부모 번호 통일 (R40004 에러)","action":"학생 번호 = 학부모 번호 동일 저장 불가 (시스템 제약). 학부모 번호 삭제 후 학생번호로만 운영 필요 시 플서실 DB 수정","note":"학생이 본인 번호만 사용하려는 케이스"},{"label":"광고성 정보수신 거부로 수강료 문자 안 옴","action":"학부모 광고성 수신동의 Y 처리 또는 학생 번호로 결제 안내 발송","note":"광고성 거부 시 결제 안내도 차단됨 (시즌 정책)"}]'::jsonb, '{"통합회원은 관리자 임의 수정 불가 — 본인인증 절차가 정책상 필수","학생-학부모 동일 번호 저장 불가 → 학생 휴대폰 없음 체크박스 또는 다른 번호 사용","변경 후 광고성 수신동의 / 마케팅 수신동의 상태도 함께 확인 (문자 수신 영향)","같은 번호로 등록된 다른 학생이 있으면 R40004 발생 — 중복 정리 후 재시도"}', '[{"issue":"\"동일한 정보로 등록된 회원이 있습니다 (R40004)\"","cause":"동일 번호로 등록된 다른 회원(미사용 계정 포함) 존재","solution":"중복 계정을 010-0000-0000 임시 변경 + 미사용 태그 → 본 작업 재시도","severity":"medium"},{"issue":"변경 후 문자 수신 불가","cause":"광고성 정보수신 거부 또는 단말 차단","solution":"광고성 수신동의 Y 처리 또는 학생번호로 발송 전환","severity":"medium"}]'::jsonb, NULL, '[{"cond":"로컬회원 — 변경 후 번호가 미사용","action":"회원상세 > [수정] 버튼으로 실장 직접 변경 가능","note":"R40004 등 에러 없으면 단순 수정","status":"safe"},{"cond":"로컬회원 — 변경 후 번호가 다른 계정과 중복","action":"중복 계정을 미사용 처리(010-0000-0000) 후 변경 시도","note":"중복 계정 확인 필수","status":"warn"},{"cond":"통합회원 — 본인이 직접 변경 가능","action":"학부모/학생이 마이클래스 > 회원정보 관리에서 직접 수정 안내","note":"관리자 수정 불가 (본인인증 필수)","status":"safe"},{"cond":"통합회원 — 본인 변경 거부/불가 (컴플)","action":"플서실 카톡 요청 → DB 직접 수정 (강성 컴플 케이스만)","note":"학원에 강하게 거부 표명 시","status":"warn"},{"cond":"부/모 구분값(라벨) 변경 필요","action":"현재 라디오 라벨은 화면 표기용이며 실제 데이터는 모두 \"학부모\"로 관리 → 기능적으로는 영향 없음","note":"본질적 차이 없음 안내","status":"safe"}]'::jsonb, NULL, NULL, '2026-05-08T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 결제 URL 만료 / 미수신 트러블슈팅
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('payment-url-expired', 'TROUBLE', '메시지발송 관리', '결제 URL 만료 / 미수신 트러블슈팅', '결제 요청 URL은 발송 후 **4일** 유효이며, 만료/미수신/문자 발송 차단 등 다양한 원인으로 결제 실패가 발생합니다.
광고성 수신동의 N · 발신번호 차단 · ''기타'' 번호 발송 등 6가지 대표 원인을 진단할 수 있는 체크리스트입니다.', 'AMS 어드민 > 메시지발송 관리 / 회원상세 > 결제 요청 URL', 'https://ams.sdij.com/message', NULL, NULL, '{"실장","운영자"}', '{"결제URL","SMS","자주묻는질문"}', '플랫폼서비스실 차주희 QA', 'v1.1', 'published', 0, 0, 0, '[{"title":"URL 만료 여부 확인","desc":"발송일 + 4일 경과 여부 우선 확인.","image":null},{"title":"수신 동의 상태 확인","desc":"회원상세 > 수신동의 항목에서 학부모 광고성 수신동의 Y 여부 확인.","image":null},{"title":"발신 번호 차단 여부 안내","desc":"학부모 단말에서 02·1577 등 발신번호 스팸 차단 설정 안내 (개인 단말 차단)","image":null},{"title":"대체 발송 경로","desc":"학생 번호로 재발송 / 가상계좌 발급 + 안내 문자 / 현장 결제 안내","image":null},{"title":"문자 발송 이력 조회","desc":"발송 이력 확인 후 발송 성공/실패 코드 체크","image":null}]'::jsonb, NULL, NULL, '{"결제 URL은 회원별 고유값 — 학부모가 타인에게 공유하지 않도록 안내","광고성 수신동의 N 상태에서는 결제 안내도 자동 차단 — 사전 동의 받아야 함","4일 만료 정책은 보안상 변경 불가 — 만료 안내를 발송 시 함께 포함"}', '[{"issue":"URL 클릭 시 \"만료된 결제 링크\" 메시지","cause":"결제 URL 유효기간 4일 경과","solution":"회원상세 또는 청구관리에서 [결제 URL 재발송] 클릭","severity":"low"},{"issue":"학부모가 문자를 못 받았다고 함","cause":"광고성 수신동의 거부 / 발신번호 차단 / 학생번호 입력 누락","solution":"회원상세에서 광고성동의 Y 확인 + 학부모 번호 정확성 확인 + 학생번호로 재발송","severity":"medium"},{"issue":"URL 진입 후 일부 금액만 표시","cause":"동일 청구를 두 번 열면서 한쪽 금액만 결제됨 (잔액만 남아 있는 상태)","solution":"결제 완료 부분 제외하고 잔액 청구 재발송 또는 새 청구로 발송","severity":"medium"},{"issue":"[기타] 번호로만 발송됨","cause":"학부모앱 배포 후 기타 번호가 자동 추가됨 (의미 없음)","solution":"발송 시 [대표학부모] 체크박스 선택하여 발송","severity":"medium"},{"issue":"\"점검중\" 메시지로 발송 불가","cause":"플서실 긴급 작업/롤백 중 — 시스템 일시 차단","solution":"플서실 공지 확인 후 대기, 또는 가상계좌/현장결제로 우회","severity":"high"},{"issue":"\"수신대상이 0명\" 오류 (2025.12.01)","cause":"결제URL 발송 기능 오류 (이미 수정 완료된 케이스)","solution":"동일 증상 재발 시 플서실 즉시 보고","severity":"high"}]'::jsonb, NULL, '[{"cond":"학부모 광고성 수신동의 N","action":"학생번호로 발송 또는 동의 변경 안내","note":"학원 정책상 마케팅 수신동의 필수","status":"warn"},{"cond":"발송 후 4일 경과","action":"URL 재발송","note":"AMS 정책 유효기간","status":"safe"},{"cond":"\"기타\" 번호로만 발송됨","action":"대표학부모 체크 후 재발송","note":"학부모앱 배포 영향","status":"warn"},{"cond":"결제 일부만 완료된 상태","action":"잔액 청구 별도 발송","note":"동일 URL 재진입 시 다른 금액 노출","status":"warn"},{"cond":"시스템 점검 알림","action":"플서실 공지 확인 후 우회","note":"긴급 시 가상계좌","status":"danger"}]'::jsonb, NULL, NULL, '2026-05-10T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 라이브(sdijon) 수강 데이터 이관 불가 안내
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('live-data-isolation', 'RESPONSE', '공통/시스템', '라이브(sdijon) 수강 데이터 이관 불가 안내', '라이브 수강 이력(sdijon)은 AMS와 분리된 시스템에 저장되어 있어 관리자가 임의로 이관/병합할 수 없습니다.
학생이 통합회원 계정을 잘못 만들었거나 이메일 해킹 등의 사유로 계정 변경을 원할 때 표준 응대 스크립트입니다.', '계정 통합 시 — 마이클래스 + 라이브 양쪽 확인 필수', 'https://ams.sdij.com', NULL, NULL, '{"실장","대치 라이브","CS 담당"}', '{"라이브","계정","응대"}', '플랫폼서비스실 황인규 QA', 'v1.0', 'published', 0, 0, 0, NULL, NULL, NULL, '{"라이브 데이터는 AMS와 분리되어 있어 관리자가 옮길 수 없음 — 학부모 양해 필수","복잡한 케이스는 마이클래스 카카오톡 채널 (pf.kakao.com/_VGAQn)로 직접 인입 안내","한 번 환불 후 재결제 안내 시 회차 진행도/잔여 가치 명확히 산정해 안내"}', NULL, '[{"scenario":"학생이 계정을 합치고 싶어함 (라이브 + AMS 양쪽 수강)","script":"라이브 수강 데이터는 시스템상 이관이 어렵습니다. 두 가지 방법을 안내드립니다: (1) AMS 데이터를 라이브 계정 쪽으로 이관 → 한쪽 계정만 사용. (2) 라이브를 직접 환불 후 본인이 원하는 계정에서 재결제. 두 방법 중 학부모와 협의 후 선택해 주세요."},{"scenario":"이메일 해킹/유출로 통합회원 이메일 변경 요청","script":"계정을 새로 만드시는 것은 권장드리지 않습니다. 기존 계정의 이메일만 새로운 주소로 변경해 드릴 수 있어 라이브와 AMS 양쪽 데이터를 그대로 유지할 수 있습니다. 변경할 새 이메일 주소(통합회원으로 가입되지 않은 신규 주소)를 전달해 주세요."},{"scenario":"통합회원 2~4개 다중 생성 케이스","script":"각 계정의 실제 사용 이력(라이브 수강 / AMS 수강)을 먼저 정리해 드린 후, 가장 중요한 계정 1개만 남기고 나머지는 본인이 직접 마이클래스에서 탈퇴 처리하도록 안내드립니다. AMS 측 데이터는 저희가 통합해 드릴 수 있습니다."},{"scenario":"학생이 직접 비밀번호를 모름 (오래된 계정)","script":"마이클래스 앱 > 비밀번호 재설정 또는 이메일 찾기로 복구 가능합니다. 복구가 불가하시면, 사용하실 계정 한 개만 명확히 정해 주시면 나머지 계정은 정리만 도와드릴 수 있습니다."}]'::jsonb, '[{"cond":"라이브 + AMS 모두 수강 이력 있음","action":"라이브 쪽으로 AMS 데이터 통합 or 라이브 환불 후 재결제","note":"학부모 협의 필수","status":"warn"},{"cond":"AMS만 수강 / 라이브 미사용","action":"AMS 정상 병합 절차","note":"일반 케이스","status":"safe"},{"cond":"이메일 해킹/유출 (이메일만 변경)","action":"플서실에 신규 이메일 주소 전달 → 이메일 정보만 변경","note":"데이터 유지","status":"safe"},{"cond":"학생이 통합회원 모두 탈퇴 원함","action":"마이클래스 채널톡으로 본인 안내","note":"본인 탈퇴만 가능","status":"safe"}]'::jsonb, NULL, NULL, '2026-05-06T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 복습영상·VOD 재생 오류 트러블슈팅
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('video-playback-trouble', 'TROUBLE', '영상/VOD 관리', '복습영상·VOD 재생 오류 트러블슈팅', '마이클래스 복습영상·동영상보강 재생 오류는 6개월 평균 CS 상담 1위(258건, 23.1%) 영역입니다.
부정감정 비율 17.4%로 전 카테고리 중 최고이며, 위키로 100% 해결되지 않는 시스템·인프라 영역이 포함되어 있어 1차 대응 가이드 + 에스컬레이션 기준이 분리되어 있습니다.
주요 패턴: 복습영상 접근 제한 144건, 재생 오류(스트리밍) 98건, 기타 16건.', 'MyClass > 수업관리 > 내 강의실 > 영상', 'https://myclass.sdij.com', NULL, NULL, '{"실장","운영자","CS 담당자"}', '{"영상","VOD","필수","자주묻는질문"}', '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, '[{"title":"학생 단말 환경 확인","desc":"Wi-Fi vs 데이터 / iOS·Android / 브라우저(앱·Safari·Chrome) 확인.","image":null},{"title":"학원 측 데이터 확인","desc":"AMS 회원조회 > 입반 상태 + 결제 완료 + 보강 만료일 + 강좌 동영상보강 옵션 확인.","image":null},{"title":"재현 시도","desc":"동일 환경에서 재현 가능한지 확인. 1명만 발생 vs 다수 동시 발생 구분.","image":null},{"title":"1명 케이스","desc":"데이터 수정(보강 연장, 입반일 변경) 또는 화질 480p 권장.","image":null},{"title":"다수 동시 케이스","desc":"인프라 장애 가능성 → 즉시 보고 후 학원 공지로 대량 응대 차단.","image":null}]'::jsonb, NULL, '[{"label":"결제 미완료 + 영상 접근 시도","action":"결제 완료 안내 후 재시도","note":"권한 검증 정상 동작"},{"label":"보강 만료 후 영상 접근 시도","action":"강사 승인 받아 보강 연장 처리 후 재시도","note":"연장 권한은 강사/실장"},{"label":"동일 시각 다수 발생","action":"인프라팀 보고 + 학원 공지 (재시도 권장)","note":"위키 1차 대응만으로 해결 불가"}]'::jsonb, '{"단순 새로고침 권유는 한 번까지만 — 반복 권유는 부정 감정 악화","다수 동시 발생 시 위키 가이드만으로 응대 시도 금지 → 즉시 보고","복습영상 권한은 입반 상태 + 결제 + 강좌 옵션 3가지가 모두 충족되어야 함"}', '[{"issue":"영상 클릭 시 \"재생 권한이 없습니다\" 또는 화면 무반응","cause":"입반 상태 비활성 / 보강 회차 만료 / 결제 미완료","solution":"AMS에서 회원의 해당 강좌 입반 상태와 결제 완료 여부 확인 → 보강 만료라면 강사 승인 후 보강 연장","severity":"medium"},{"issue":"영상 로딩 중 멈춤 / 스트리밍 끊김","cause":"네트워크 대역폭 부족 또는 CDN 장애","solution":"학생 단말 Wi-Fi 환경 확인 → 화질 자동→480p로 낮춰 재시도 → 동일 시간대 다수 발생 시 인프라팀 즉시 보고","severity":"high"},{"issue":"복습영상 목록에 영상이 없음","cause":"강좌 옵션 [동영상보강 제공] 비활성 / 회차 미배포","solution":"AMS 강좌관리 > 해당 강좌 > 동영상보강 옵션 ON 확인. 회차별 배포 완료 여부 확인.","severity":"high"},{"issue":"동영상 보강 신청했는데 영상이 안 보임 (체크는 됨)","cause":"입반일 또는 회차 데이터 꼬임 (입반일 미래 설정 등)","solution":"회원 상세에서 입반일/퇴반일 확인 후 정상 범위로 수정. 데이터 꼬임 시 플서실 요청.","severity":"medium"},{"issue":"여러 학생이 동일 시간대에 영상 재생 불가","cause":"인프라 장애 또는 스트리밍 서버 다운","solution":"즉시 위키 안내 중단. 인프라팀 슬랙 채널 보고 + 학원 공지 발송 (재시도 안내)","severity":"critical"},{"issue":"특정 단말(iPad/iPhone)에서만 재생 불가","cause":"iOS Safari 정책 / 사용자 설정 (저전력 모드 / 데이터 절약)","solution":"저전력 모드 OFF + 데이터 절약 OFF + Safari 자동 재생 허용 확인","severity":"low"}]'::jsonb, NULL, '[{"cond":"1명 / 데이터 문제","action":"AMS 데이터 수정 후 재시도","note":"입반·결제·보강 만료 점검","status":"safe"},{"cond":"1명 / 단말 환경 문제","action":"단말 설정 변경 안내 (저전력·데이터 절약·자동재생)","note":"iOS 빈번","status":"safe"},{"cond":"다수 동시 발생","action":"인프라팀 즉시 보고 + 공지 발송","note":"위키 응대 중단","status":"danger"},{"cond":"복습영상 목록 자체가 비어있음","action":"강좌 동영상보강 옵션 + 회차 배포 확인","note":"강사·운영팀 협의 필요","status":"warn"}]'::jsonb, NULL, NULL, '2026-05-12T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 학원 등록정보 연동 가이드 (학부모 셀프)
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('school-registration-link', 'SOP', '고객(원생) 관리', '학원 등록정보 연동 가이드 (학부모 셀프)', '통합회원이 마이클래스에서 학원 수강 정보를 직접 연결하는 절차입니다.
고객 상담 2위(170건, 15.2%)로 빈도가 높지만 부정감정은 9.4%로 낮아 정형 안내로 해결 가능합니다.
셀프 처리가 안되는 경우의 대응 분기를 함께 정리했습니다.', 'MyClass > 전체메뉴 > 수업관리 > 학원 등록정보 연동', 'https://myclass.sdij.com/inbound', NULL, NULL, '{"실장","운영자","CS 담당자","학부모 안내용"}', '{"연동","회원관리","필수"}', '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, '[{"title":"MyClass 통합회원 로그인","desc":"https://myclass.sdij.com 에 회원 본인 명의 휴대폰으로 가입된 통합회원으로 로그인.","image":null},{"title":"[학원 등록정보 연동] 메뉴 진입","desc":"전체메뉴 > 수업관리 > 학원 등록정보 연동 클릭.","image":null},{"title":"연동 코드 입력 또는 본인인증","desc":"학원에서 발송한 연동 코드를 입력하거나, 본인 휴대폰 본인인증으로 자동 매칭.","image":null},{"title":"연동 결과 확인","desc":"연결된 수강 정보가 [내 수강 강좌] 탭에 표시되는지 확인.","image":null}]'::jsonb, '[{"field":"연동 코드","desc":"학원이 발급하는 6~8자리 코드 (실장이 SMS 또는 카톡 발송)","required":false},{"field":"본인인증","desc":"학생/학부모 본인 명의 휴대폰 PASS 인증","required":true}]'::jsonb, '[{"label":"학부모 셀프 처리 정상 케이스","action":"본인인증 → 자동 매칭 → 완료","note":"79일 데이터 기준 약 80% 정상 진행"},{"label":"학부모 번호 변경 후 연동","action":"먼저 마이클래스에서 회원정보 수정으로 학부모 번호 변경 후 연동 재시도","note":"`parent-phone-change` 가이드 참조"},{"label":"학원이 학부모를 잘못 등록 (부/모 번호 뒤바뀜)","action":"AMS에서 학원이 학부모 정보 수정 후 학부모 재시도","note":"실장 권한으로 회원상세 [수정]"}]'::jsonb, '{"본인인증 실패 = 학원 측 등록 번호와 학부모 인증 번호 불일치 → 먼저 학원이 데이터 수정","한 학부모가 통합회원 계정을 여러 개 만들지 않도록 안내 — 합치기 어려움","연동은 학생이 직접 (실장이 대신 진행 불가)"}', '[{"issue":"\"등록된 학원 정보가 없습니다\"","cause":"학원이 로컬회원 등록 시 입력한 학부모 번호와 인증 번호 불일치","solution":"학원이 회원상세에서 번호 수정 후 재시도","severity":"medium"},{"issue":"\"이미 다른 계정과 연동되어 있습니다\"","cause":"학부모가 통합회원 계정을 여러 개 가입","solution":"사용할 계정만 남기고 나머지 본인 탈퇴 안내","severity":"medium"}]'::jsonb, NULL, '[{"cond":"본인인증으로 연동 시도 → 일치하는 정보 없음","action":"학원에서 로컬회원 등록 시 입력한 번호와 일치하는지 AMS 확인 → 다르면 학원이 번호 수정 후 재시도","note":"회원조회에서 학부모 번호 확인","status":"warn"},{"cond":"연동 코드 미수신","action":"학원에서 [연동 코드 발송] 재실행. SMS 차단 확인.","note":"광고성 수신동의 N이면 발송 안됨","status":"safe"},{"cond":"연동 완료 후 수강 정보 미노출","action":"재로그인 + 새로고침. 미해소 시 플서실 병합 요청","note":"계정 2개 분리되었을 가능성","status":"warn"},{"cond":"본인인증은 됐으나 \"이미 연동된 계정\"","action":"학부모가 다른 통합회원 계정으로 이미 연동 — 본인이 사용할 계정만 남기고 다른 계정 탈퇴","note":"`live-data-isolation` 가이드 참조","status":"warn"}]'::jsonb, NULL, NULL, '2026-05-12T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 개인정보 동의 처리 — 이탈 방지 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('privacy-consent-flow', 'TROUBLE', '메시지발송 관리', '개인정보 동의 처리 — 이탈 방지 가이드', '/inbound/privacy-consent 페이지의 GA4 이탈률 41.7% (6,126명) — 상담 인입은 거의 없지만 등록 퍼널의 숨겨진 병목입니다.
동의 문자 발송 후 학부모가 동의 화면에서 이탈하는 패턴을 분석하고 운영팀이 1차 대응할 수 있는 가이드입니다.', '학부모 동의 화면 (외부) + AMS 회원상세 동의 상태', 'https://ams.sdij.com/customer/member/detail', NULL, NULL, '{"실장","운영자"}', '{"개인정보","동의","GA4"}', '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, '[{"title":"동의 문자 발송 전 점검","desc":"AMS 회원상세에서 학부모 번호 정확성 + 광고성 수신동의 Y 확인.","image":null},{"title":"문자 발송","desc":"회원상세 > [개인정보 동의 문자 발송] 1회만 클릭 (중복 발송 시 이전 링크 만료).","image":null},{"title":"학부모 동의 진행 안내 (필요 시 전화)","desc":"\"받은 문자의 링크 → 필수만 체크 → 동의 버튼\" 3단계 안내. 선택 항목은 거부 가능.","image":null},{"title":"동의 완료 확인","desc":"5분 이내 AMS 회원상세에서 동의 상태 Y로 변경 확인.","image":null},{"title":"이탈 케이스 대응","desc":"15분 이상 미반영 시 전화로 진행 단계 확인 + 필요 시 학원 방문 동의","image":null}]'::jsonb, NULL, '[{"label":"학부모 단말이 구형 / 동의 UI 미숙","action":"학원 방문 동의 또는 학원 PC에서 학부모 본인 동의","note":"미성년자 가족 케이스 多"},{"label":"학부모 거부 — 동의 자체 안 함","action":"학생 번호로 동의 + 학원 운영 가능 범위 확인","note":"광고성 외 필수만 가능"}]'::jsonb, '{"동의 문자 중복 발송 금지 — 최신 1건만 유효","동의 화면은 외부 PG/MyClass 도메인 — 학원에서 UI 변경 불가","GA4 이탈률 41.7%는 학부모가 상담조차 하지 않고 이탈 → 능동적 추적 필요"}', '[{"issue":"동의 문자가 학부모에게 도착하지 않음","cause":"광고성 정보수신 동의 N / 발신번호 차단 / 잘못된 번호","solution":"광고성 수신동의 상태 확인. 동의 N이면 학생 번호로 발송 또는 학부모 직접 동의 받기","severity":"medium"},{"issue":"학부모가 링크 클릭 후 이탈 (동의 미완료)","cause":"동의 화면 스크롤 과다 / 필수·선택 항목 혼동 / 모바일 UX 부족","solution":"학부모에게 [필수만] 체크 후 [동의] 안내 — 선택 항목은 거부해도 진행 가능","severity":"high"},{"issue":"여러 번 동의 문자 발송 후 최신 링크만 유효","cause":"최신 문자만 유효, 이전 링크 만료","solution":"학부모에게 가장 최근 받은 문자의 링크 사용 안내","severity":"medium"},{"issue":"동의 완료 직후 AMS에 반영 안됨","cause":"서버 비동기 처리 지연 (1~5분)","solution":"5분 후 새로고침 재확인. 미해소 시 플서실 요청","severity":"low"}]'::jsonb, NULL, '[{"cond":"문자 미수신","action":"광고성 수신동의 확인 / 학생 번호로 재발송","note":"단말 차단도 확인","status":"warn"},{"cond":"링크 클릭 → 이탈","action":"전화로 3단계 안내 또는 학원 방문 동의","note":"모바일 UX 한계","status":"warn"},{"cond":"동의 완료 → AMS 미반영","action":"5분 대기 → 미해소 시 플서실","note":"비동기 처리","status":"safe"},{"cond":"본인인증 통합회원 학부모","action":"마이클래스 회원정보 관리에서 직접 동의 가능","note":"별도 문자 불필요","status":"safe"}]'::jsonb, NULL, NULL, '2026-05-12T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 출석부 인쇄·엑셀 다운로드 가이드
INSERT INTO guides (id, type, module, title, tldr, path, ams_url, confluence_id, confluence_url, targets, tags, author, version, status, views, helpful, helpful_rate, steps, main_items_table, cases, cautions, trouble_table, responses, decision_table, reference_data, policy_diff, updated_at) VALUES ('attendance-print-export', 'SOP', '수업운영관리', '출석부 인쇄·엑셀 다운로드 가이드', '출석부 인쇄·엑셀 다운로드 기능 사용 가이드입니다.
실장 단톡방에 ''값이 있는 셀만 표로 출력이 가능할까요?'' 같은 기능 사용 문의가 반복되어 표준화했습니다.', 'AMS 어드민 > 수업운영관리 > 수업관리 > 수업상세 > 출석부', 'https://ams.sdij.com/operation/class/manage', NULL, NULL, '{"실장","운영자"}', '{"출결","출석부","엑셀"}', '플랫폼서비스실', 'v1.0', 'published', 0, 0, 0, '[{"title":"수업상세 화면 진입","desc":"수업운영관리 > 수업관리 > 강좌 클릭 > 수업상세.","image":null},{"title":"회차 필터링 (선택)","desc":"특정 회차만 보고 싶을 경우 회차 드롭다운으로 선택.","image":null},{"title":"엑셀 다운로드","desc":"출석부 우측 상단 [엑셀 다운로드] 클릭. sheet가 [출석부] / [타반보강생] 으로 분리됨.","image":null},{"title":"인쇄 (하드카피)","desc":"[인쇄] 버튼 클릭 → 브라우저 인쇄 미리보기에서 페이지 설정 후 출력.","image":null}]'::jsonb, NULL, '[{"label":"신규 입반생만 다운로드","action":"출석부에서 [입반일] 컬럼으로 필터 → 해당 회차 첫 입반인 학생만 추출","note":"입반일 기준 정렬"},{"label":"타반보강생만 다운로드","action":"엑셀 다운로드 시 [타반보강생] sheet 별도 제공","note":"같은 보강코드 반에서 출석한 회원"},{"label":"학생번호 마스킹 제거","action":"로컬회원 마스킹은 보안 정책상 유지 — 통합회원과 구분 표시","note":"재무 보고는 별도 ID 사용"},{"label":"결석생만 다운로드","action":"출석부 상단 출결상태 필터 [결석] 선택 후 다운로드","note":"필터 적용 후 다운로드"}]'::jsonb, '{"로컬회원은 보안상 마스킹(*) 적용 — 재무팀에 전달 시 별도 학원 ID 부여","엑셀 sheet 구조: [출석부] = 입반생 / [타반보강생] = 다른 반에서 보강 출석","실시간 출결 후 즉시 다운로드 시 일부 데이터 미반영 가능 → 30초 대기 후 시도"}', '[{"issue":"엑셀 다운로드 안됨 (회전 무한 로딩)","cause":"백그라운드 데이터 처리 지연 또는 브라우저 차단","solution":"브라우저 팝업 차단 해제 + 새로고침 후 재시도","severity":"medium"},{"issue":"출석부 인쇄 시 페이지가 잘림","cause":"학생 수가 많아 한 페이지 초과","solution":"인쇄 미리보기에서 [가로 방향] + [페이지에 맞게 축소] 설정","severity":"low"}]'::jsonb, NULL, NULL, NULL, NULL, '2026-05-12T00:00:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,
  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,
  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,
  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,
  version=EXCLUDED.version, status=EXCLUDED.status,
  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,
  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,
  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,
  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,
  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,
  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;

-- 완료: 35개 가이드 적재