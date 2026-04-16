// src/store/authConstants.js — 권한 관리 상수
export const ROLES = {
  ADMIN: 'admin',       // 관리자 (모든 기능 접근)
  MANAGER: 'manager',   // 실장 (편집, 발행 권한)
  OPERATOR: 'operator', // 운영자 (조회만 가능)
  GUEST: 'guest',       // 비로그인
};

export const PERMISSIONS = {
  VIEW: 'view',         // 조회
  EDIT: 'edit',         // 편집
  PUBLISH: 'publish',   // 발행
  DELETE: 'delete',     // 삭제
  MANAGE_USERS: 'manage_users',
};

// 역할별 권한 매핑
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.PUBLISH, PERMISSIONS.DELETE, PERMISSIONS.MANAGE_USERS],
  [ROLES.MANAGER]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.PUBLISH],
  [ROLES.OPERATOR]: [PERMISSIONS.VIEW],
  [ROLES.GUEST]: [PERMISSIONS.VIEW],
};
