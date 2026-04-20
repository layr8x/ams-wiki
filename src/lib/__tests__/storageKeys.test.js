// src/lib/__tests__/storageKeys.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { STORAGE_KEYS, migrateLegacyKeys } from '../storageKeys'

describe('storageKeys', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('STORAGE_KEYS', () => {
    it('모든 키가 ams-wiki: 프리픽스를 사용한다', () => {
      for (const [name, key] of Object.entries(STORAGE_KEYS)) {
        expect(key.startsWith('ams-wiki'), `${name} → ${key}`).toBe(true)
      }
    })

    it('키 간 충돌이 없다', () => {
      const values = Object.values(STORAGE_KEYS)
      const set = new Set(values)
      expect(set.size).toBe(values.length)
    })
  })

  describe('migrateLegacyKeys', () => {
    it('ams_token → ams-wiki:auth:token 이관', () => {
      localStorage.setItem('ams_token', 'abc.def.ghi')
      migrateLegacyKeys()
      expect(localStorage.getItem(STORAGE_KEYS.authToken)).toBe('abc.def.ghi')
      expect(localStorage.getItem('ams_token')).toBe(null)
    })

    it('ams_wiki_user → ams-wiki:auth:user 이관', () => {
      const payload = JSON.stringify({ name: '홍길동', role: 'viewer' })
      localStorage.setItem('ams_wiki_user', payload)
      migrateLegacyKeys()
      expect(localStorage.getItem(STORAGE_KEYS.authUser)).toBe(payload)
      expect(localStorage.getItem('ams_wiki_user')).toBe(null)
    })

    it('theme-mode → ams-wiki:theme 이관', () => {
      localStorage.setItem('theme-mode', 'dark')
      migrateLegacyKeys()
      expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark')
      expect(localStorage.getItem('theme-mode')).toBe(null)
    })

    it('language → ams-wiki:language 이관', () => {
      localStorage.setItem('language', 'ko')
      migrateLegacyKeys()
      expect(localStorage.getItem(STORAGE_KEYS.language)).toBe('ko')
      expect(localStorage.getItem('language')).toBe(null)
    })

    it('새 키가 이미 있으면 덮어쓰지 않는다 (충돌 안전)', () => {
      localStorage.setItem('ams_token', 'old-token')
      localStorage.setItem(STORAGE_KEYS.authToken, 'new-token')
      migrateLegacyKeys()
      expect(localStorage.getItem(STORAGE_KEYS.authToken)).toBe('new-token')
      // 구 키는 정리되어야 함 (stale 방지)
      expect(localStorage.getItem('ams_token')).toBe(null)
    })

    it('구 키가 없으면 아무 일도 하지 않는다', () => {
      migrateLegacyKeys()
      expect(localStorage.length).toBe(0)
    })

    it('여러 번 호출해도 멱등', () => {
      localStorage.setItem('ams_token', 't1')
      localStorage.setItem('theme-mode', 'light')
      migrateLegacyKeys()
      migrateLegacyKeys()
      migrateLegacyKeys()
      expect(localStorage.getItem(STORAGE_KEYS.authToken)).toBe('t1')
      expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('light')
      expect(localStorage.getItem('ams_token')).toBe(null)
      expect(localStorage.getItem('theme-mode')).toBe(null)
    })
  })
})
