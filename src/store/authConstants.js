// src/store/authConstants.js — AMS 계정 역할 · 권한 상수
//
// 역할 체계는 AMS 조직 구조를 반영한다.
//  - ADMIN: 시스템 관리자. 전 모듈 + 사용자 관리.
//  - DIRECTOR: 실장. 담당 지점 가이드 편집·발행.
//  - COUNSELOR: 상담실. 상담·수납·고객 관련 가이드 조회 중심. 일부 편집.
//  - OPERATOR: 일반 운영자(강사·조교 등). 조회만.
//  - GUEST: 비로그인. 조회만.
//
// 모듈 단위 접근권한(MODULE_ACCESS) 은 추후 백엔드 연동 전 UI 라우팅·네비 노출에만 사용.
// 실제 데이터 접근은 서버 정책(RLS 등)으로 반드시 이중 차단한다.

export const ROLES = {
  ADMIN:     'admin',
  DIRECTOR:  'director',
  COUNSELOR: 'counselor',
  OPERATOR:  'operator',
  GUEST:     'guest',
}

// UI 표시용 한글 라벨 (UserMenu, 사용자 관리 등)
export const ROLE_LABELS = {
  [ROLES.ADMIN]:     '관리자',
  [ROLES.DIRECTOR]:  '실장',
  [ROLES.COUNSELOR]: '상담실',
  [ROLES.OPERATOR]:  '운영자',
  [ROLES.GUEST]:     '비회원',
}

export const PERMISSIONS = {
  VIEW:         'view',
  EDIT:         'edit',
  PUBLISH:      'publish',
  DELETE:       'delete',
  MANAGE_USERS: 'manage_users',
}

// 역할별 권한 — 계층 구조 (ADMIN ⊃ DIRECTOR ⊃ COUNSELOR ⊃ OPERATOR ⊃ GUEST)
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]:     [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.PUBLISH, PERMISSIONS.DELETE, PERMISSIONS.MANAGE_USERS],
  [ROLES.DIRECTOR]:  [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.PUBLISH],
  [ROLES.COUNSELOR]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT],
  [ROLES.OPERATOR]:  [PERMISSIONS.VIEW],
  [ROLES.GUEST]:     [PERMISSIONS.VIEW],
}

// 역할별 기본 접근 가능한 모듈(mockData MODULE_TREE.id 와 일치).
// 'ALL' 은 전 모듈 접근을 의미한다.
export const MODULE_ACCESS = {
  [ROLES.ADMIN]:     'ALL',
  [ROLES.DIRECTOR]:  'ALL',
  [ROLES.COUNSELOR]: ['customer', 'billing', 'message', 'operation'],
  [ROLES.OPERATOR]:  ['course', 'operation', 'message'],
  [ROLES.GUEST]:     'ALL', // 데모 환경: 비로그인도 전 모듈 조회
}

export function canAccessModule(role, moduleId) {
  const allowed = MODULE_ACCESS[role] ?? 'ALL'
  if (allowed === 'ALL') return true
  return Array.isArray(allowed) && allowed.includes(moduleId)
}
