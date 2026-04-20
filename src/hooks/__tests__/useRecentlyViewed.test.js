// src/hooks/__tests__/useRecentlyViewed.test.js
// "최근 본 가이드" 큐 — 맨앞 삽입, 중복 제거, 최대 20개, localStorage 동기화 검증.
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecentlyViewed } from '../useRecentlyViewed'

const STORAGE_KEY = 'ams-wiki:recently-viewed:v1'

describe('useRecentlyViewed', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('초기 상태는 빈 배열', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    expect(result.current.entries).toEqual([])
  })

  it('track 은 큐 맨앞에 넣는다', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    act(() => { result.current.track('g-1') })
    act(() => { result.current.track('g-2') })
    expect(result.current.entries[0].id).toBe('g-2')
    expect(result.current.entries[1].id).toBe('g-1')
  })

  it('이미 본 항목은 맨앞으로 이동 (중복 없음)', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    act(() => { result.current.track('a') })
    act(() => { result.current.track('b') })
    act(() => { result.current.track('a') })
    expect(result.current.entries.map(e => e.id)).toEqual(['a', 'b'])
  })

  it('최대 20개까지만 유지 (FIFO 아님 — 오래된 것 절삭)', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    act(() => {
      for (let i = 0; i < 25; i++) result.current.track(`g-${i}`)
    })
    expect(result.current.entries).toHaveLength(20)
    // 가장 최근이 맨앞
    expect(result.current.entries[0].id).toBe('g-24')
    // 가장 오래된 5개는 절삭됨
    expect(result.current.entries.map(e => e.id)).not.toContain('g-0')
    expect(result.current.entries.map(e => e.id)).not.toContain('g-4')
  })

  it('빈 id 는 무시한다', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    act(() => { result.current.track('') })
    act(() => { result.current.track(null) })
    act(() => { result.current.track(undefined) })
    expect(result.current.entries).toEqual([])
  })

  it('track 후 localStorage 에 반영된다', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    act(() => { result.current.track('guide-99') })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('guide-99')
    expect(typeof stored[0].viewedAt).toBe('string')
  })

  it('초기 렌더에서 localStorage 값을 복원한다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { id: 'x', viewedAt: '2026-04-18T00:00:00.000Z' },
    ]))
    const { result } = renderHook(() => useRecentlyViewed())
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].id).toBe('x')
  })

  it('잘못된 JSON 은 빈 배열로 복원', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    const { result } = renderHook(() => useRecentlyViewed())
    expect(result.current.entries).toEqual([])
  })

  it('clear 는 큐 비움 + localStorage 비움', () => {
    const { result } = renderHook(() => useRecentlyViewed())
    act(() => { result.current.track('z') })
    expect(result.current.entries).toHaveLength(1)
    act(() => { result.current.clear() })
    expect(result.current.entries).toEqual([])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([])
  })
})
