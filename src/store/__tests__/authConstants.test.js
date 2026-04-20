// src/store/__tests__/authConstants.test.js
// RBAC 매트릭스 회귀 방지 — 역할/권한/모듈 접근 조합이 바뀔 때마다 실패해야 한다.
import { describe, it, expect } from 'vitest'
import {
  ROLES, ROLE_LABELS, PERMISSIONS, ROLE_PERMISSIONS, MODULE_ACCESS, canAccessModule,
} from '../authConstants'

describe('ROLES', () => {
  it('5개 역할이 정의되어 있다', () => {
    expect(Object.values(ROLES).sort()).toEqual(
      ['admin', 'counselor', 'director', 'guest', 'operator'].sort(),
    )
  })

  it('모든 역할이 한글 라벨을 가진다', () => {
    for (const role of Object.values(ROLES)) {
      expect(ROLE_LABELS[role]).toBeTruthy()
    }
  })
})

describe('ROLE_PERMISSIONS 매트릭스', () => {
  it('ADMIN 은 모든 권한을 가진다', () => {
    const admin = ROLE_PERMISSIONS[ROLES.ADMIN]
    for (const perm of Object.values(PERMISSIONS)) {
      expect(admin).toContain(perm)
    }
  })

  it('GUEST 는 view 만 가진다', () => {
    expect(ROLE_PERMISSIONS[ROLES.GUEST]).toEqual([PERMISSIONS.VIEW])
  })

  it('OPERATOR 는 view 만 가진다 (편집 불가)', () => {
    expect(ROLE_PERMISSIONS[ROLES.OPERATOR]).toEqual([PERMISSIONS.VIEW])
    expect(ROLE_PERMISSIONS[ROLES.OPERATOR]).not.toContain(PERMISSIONS.EDIT)
  })

  it('COUNSELOR 는 edit 가능, publish 불가', () => {
    const c = ROLE_PERMISSIONS[ROLES.COUNSELOR]
    expect(c).toContain(PERMISSIONS.EDIT)
    expect(c).not.toContain(PERMISSIONS.PUBLISH)
    expect(c).not.toContain(PERMISSIONS.MANAGE_USERS)
  })

  it('DIRECTOR 는 publish 가능, manage_users 불가', () => {
    const d = ROLE_PERMISSIONS[ROLES.DIRECTOR]
    expect(d).toContain(PERMISSIONS.PUBLISH)
    expect(d).not.toContain(PERMISSIONS.MANAGE_USERS)
  })

  it('manage_users 는 ADMIN 전용', () => {
    for (const role of Object.values(ROLES)) {
      const perms = ROLE_PERMISSIONS[role] ?? []
      if (role === ROLES.ADMIN) {
        expect(perms).toContain(PERMISSIONS.MANAGE_USERS)
      } else {
        expect(perms).not.toContain(PERMISSIONS.MANAGE_USERS)
      }
    }
  })
})

describe('canAccessModule', () => {
  it('ADMIN/DIRECTOR 는 모든 모듈에 접근 가능', () => {
    expect(canAccessModule(ROLES.ADMIN, 'billing')).toBe(true)
    expect(canAccessModule(ROLES.ADMIN, 'customer')).toBe(true)
    expect(canAccessModule(ROLES.DIRECTOR, 'system')).toBe(true)
  })

  it('COUNSELOR 는 허용 모듈만 접근', () => {
    for (const m of MODULE_ACCESS[ROLES.COUNSELOR]) {
      expect(canAccessModule(ROLES.COUNSELOR, m)).toBe(true)
    }
    expect(canAccessModule(ROLES.COUNSELOR, 'system')).toBe(false)
  })

  it('OPERATOR 는 course/operation/message 만 접근', () => {
    expect(canAccessModule(ROLES.OPERATOR, 'course')).toBe(true)
    expect(canAccessModule(ROLES.OPERATOR, 'operation')).toBe(true)
    expect(canAccessModule(ROLES.OPERATOR, 'message')).toBe(true)
    expect(canAccessModule(ROLES.OPERATOR, 'billing')).toBe(false)
    expect(canAccessModule(ROLES.OPERATOR, 'customer')).toBe(false)
  })

  it('알 수 없는 역할은 기본 ALL 허용 (안전한 폴백 아님 — 서버 RLS 로 반드시 이중 차단)', () => {
    // 이 동작을 의도적으로 테스트해 두면, 향후 "deny by default" 로 정책이 바뀔 때 이 테스트가 실패 → 재검토 계기
    expect(canAccessModule('unknown', 'anything')).toBe(true)
  })
})
