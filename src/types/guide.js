/**
 * 가이드 데이터 타입 정의 (JSDoc)
 *
 * @typedef {Object} Guide
 * @property {string} id - 가이드 고유 ID (UUID)
 * @property {string} module_id - 모듈 ID (operation, billing, member 등)
 * @property {string} module - 모듈명 (한글)
 * @property {string} title - 가이드 제목
 * @property {string} summary - 요약 (한 문장)
 * @property {string} content - 마크다운 본문 (선택)
 * @property {'sop' | 'trouble' | 'reference' | 'decision' | 'response'} guide_type - 가이드 유형
 * @property {string} version - 버전 (v1, v2, ...)
 * @property {string} author - 작성자명
 * @property {string} updated_at - 수정 일시 (ISO 8601)
 * @property {string} [published_at] - 발행 일시
 * @property {string[]} target_roles - 대상 역할 (['운영자', '실장'])
 * @property {string[]} tags - 태그
 * @property {number} view_count - 조회수
 * @property {number} helpful_count - 유용함 투표 수
 * @property {'draft' | 'published'} status - 상태
 * @property {Step[]} [steps] - 단계별 가이드
 * @property {Field[]} [fields] - 필드 정보
 * @property {Case[]} [cases] - 사례
 * @property {string[]} [cautions] - 주의사항
 * @property {Issue[]} [issues] - 문제 해결
 * @property {RelatedGuide[]} [related_guides] - 관련 가이드
 * @property {string} [menu_path] - AMS 메뉴 경로
 * @property {string} [deeplink] - Confluence 링크
 */

/**
 * @typedef {Object} Step
 * @property {string} title - 단계 제목
 * @property {string} description - 설명
 * @property {string} [warning] - 경고 메시지
 * @property {string} [screenshot] - 스크린샷 URL
 */

/**
 * @typedef {Object} Field
 * @property {string} name - 필드명
 * @property {string} description - 설명
 * @property {string} example - 예시
 * @property {'필수' | '선택' | '자동'} required - 필수 여부
 */

/**
 * @typedef {Object} Case
 * @property {string} label - 사례 제목
 * @property {string[]} steps - 처리 단계
 * @property {string} [note] - 비고
 */

/**
 * @typedef {Object} Issue
 * @property {string} problem - 문제
 * @property {string} cause - 원인
 * @property {string} solution - 해결 방법
 * @property {'낮음' | '보통' | '높음'} severity - 심각도
 */

/**
 * @typedef {Object} RelatedGuide
 * @property {string} id - 관련 가이드 ID
 * @property {string} title - 관련 가이드 제목
 * @property {string} module - 관련 가이드 모듈
 */

/**
 * @typedef {Object} Module
 * @property {string} id - 모듈 ID
 * @property {string} label - 모듈명 (한글)
 * @property {string} description - 설명
 * @property {number} guide_count - 가이드 수
 * @property {string} icon - Lucide 아이콘명
 */

/**
 * @typedef {Object} GuideFeedback
 * @property {string} id - 피드백 ID
 * @property {string} guide_id - 가이드 ID
 * @property {string} user_id - 사용자 ID (선택)
 * @property {boolean} useful - 유용 여부
 * @property {string} [comment] - 피드백 의견
 * @property {string} created_at - 생성 일시
 */

/**
 * @typedef {Object} GuideListResponse
 * @property {Guide[]} data - 가이드 목록
 * @property {Pagination} pagination - 페이지네이션
 */

/**
 * @typedef {Object} Pagination
 * @property {number} page - 현재 페이지
 * @property {number} per_page - 페이지당 항목 수
 * @property {number} total - 전체 항목 수
 * @property {number} total_pages - 전체 페이지 수
 */

// 가이드 타입 상수
export const GUIDE_TYPES = {
  SOP: 'sop',           // 절차서
  TROUBLE: 'trouble',   // 문제해결
  REFERENCE: 'reference', // 참고
  DECISION: 'decision',  // 의사결정
  RESPONSE: 'response',  // 대응
}

export const GUIDE_TYPE_LABELS = {
  [GUIDE_TYPES.SOP]: '절차서',
  [GUIDE_TYPES.TROUBLE]: '문제해결',
  [GUIDE_TYPES.REFERENCE]: '참고',
  [GUIDE_TYPES.DECISION]: '의사결정',
  [GUIDE_TYPES.RESPONSE]: '대응',
}

export const GUIDE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

export const GUIDE_STATUS_LABELS = {
  [GUIDE_STATUS.DRAFT]: '작성중',
  [GUIDE_STATUS.PUBLISHED]: '발행됨',
}

// 역할 상수
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  GUEST: 'guest',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: '관리자',
  [ROLES.MANAGER]: '매니저',
  [ROLES.OPERATOR]: '운영자',
  [ROLES.GUEST]: '손님',
}

/**
 * 가이드 데이터 검증
 * @param {Guide} guide - 검증할 가이드
 * @returns {string[]} 에러 메시지 배열
 */
export function validateGuide(guide) {
  const errors = []

  if (!guide.id) errors.push('ID는 필수입니다')
  if (!guide.title || guide.title.trim() === '') errors.push('제목은 필수입니다')
  if (!guide.module_id) errors.push('모듈은 필수입니다')
  if (!Object.values(GUIDE_TYPES).includes(guide.guide_type)) {
    errors.push(`가이드 타입은 다음 중 하나여야 합니다: ${Object.values(GUIDE_TYPES).join(', ')}`)
  }
  if (guide.summary && guide.summary.length > 200) {
    errors.push('요약은 200자 이하여야 합니다')
  }

  return errors
}

/**
 * 가이드 정합성 검증 (mockData vs Supabase)
 * @param {Guide} mockGuide - 모의 데이터 가이드
 * @param {Guide} dbGuide - 데이터베이스 가이드
 * @returns {string[]} 불일치 항목
 */
export function compareGuides(mockGuide, dbGuide) {
  const differences = []

  if (mockGuide.title !== dbGuide.title) {
    differences.push(`제목 불일치: "${mockGuide.title}" vs "${dbGuide.title}"`)
  }
  if (mockGuide.module_id !== dbGuide.module_id) {
    differences.push(`모듈 불일치: "${mockGuide.module_id}" vs "${dbGuide.module_id}"`)
  }
  if (mockGuide.guide_type !== dbGuide.guide_type) {
    differences.push(`타입 불일치: "${mockGuide.guide_type}" vs "${dbGuide.guide_type}"`)
  }

  return differences
}
