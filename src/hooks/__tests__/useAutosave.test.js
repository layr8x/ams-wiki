// src/hooks/__tests__/useAutosave.test.js
// jsdom 환경에서 localStorage + 타이머 기반 자동저장 동작 검증.
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutosave } from '../useAutosave'

const KEY = 'ams-wiki:test:autosave:v1'

describe('useAutosave', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('초기 상태는 idle + savedAt null', () => {
    const { result } = renderHook(() => useAutosave({ key: KEY, data: { a: 1 } }))
    expect(result.current.status).toBe('idle')
    expect(result.current.savedAt).toBeNull()
  })

  it('첫 렌더는 저장을 일으키지 않는다 (firstRun 가드)', () => {
    renderHook(() => useAutosave({ key: KEY, data: { a: 1 } }))
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('data 변경 + delay 경과 후에만 저장된다', () => {
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ key: KEY, data, delay: 5000 }),
      { initialProps: { data: { a: 1 } } },
    )
    rerender({ data: { a: 2 } })
    expect(localStorage.getItem(KEY)).toBeNull()

    act(() => { vi.advanceTimersByTime(4999) })
    expect(localStorage.getItem(KEY)).toBeNull()

    act(() => { vi.advanceTimersByTime(1) })
    const stored = JSON.parse(localStorage.getItem(KEY))
    expect(stored.data).toEqual({ a: 2 })
    expect(typeof stored.savedAt).toBe('number')
  })

  it('saveNow 는 딜레이를 건너뛰고 즉시 기록한다', () => {
    const { result } = renderHook(() => useAutosave({ key: KEY, data: { a: 1 } }))
    act(() => { result.current.saveNow() })
    expect(localStorage.getItem(KEY)).not.toBeNull()
    expect(result.current.status).toBe('saved')
    expect(result.current.savedAt).toBeTypeOf('number')
  })

  it('enabled=false 일 때는 저장하지 않는다', () => {
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ key: KEY, data, delay: 1000, enabled: false }),
      { initialProps: { data: { a: 1 } } },
    )
    rerender({ data: { a: 2 } })
    act(() => { vi.advanceTimersByTime(5000) })
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('clearDraft 는 저장본 삭제 + 상태 리셋', () => {
    const { result } = renderHook(() => useAutosave({ key: KEY, data: { a: 1 } }))
    act(() => { result.current.saveNow() })
    expect(localStorage.getItem(KEY)).not.toBeNull()

    act(() => { result.current.clearDraft() })
    expect(localStorage.getItem(KEY)).toBeNull()
    expect(result.current.status).toBe('idle')
    expect(result.current.savedAt).toBeNull()
  })

  it('loadDraft 는 저장된 data 만 반환 (savedAt 은 상태로만 반영)', () => {
    localStorage.setItem(KEY, JSON.stringify({ data: { x: 9 }, savedAt: 42 }))
    const { result } = renderHook(() => useAutosave({ key: KEY, data: {} }))
    let loaded
    act(() => { loaded = result.current.loadDraft() })
    expect(loaded).toEqual({ x: 9 })
    expect(result.current.savedAt).toBe(42)
  })

  it('loadDraft 는 유효하지 않은 JSON 에 대해 null 반환', () => {
    localStorage.setItem(KEY, '{not-json')
    const { result } = renderHook(() => useAutosave({ key: KEY, data: {} }))
    let loaded
    act(() => { loaded = result.current.loadDraft() })
    expect(loaded).toBeNull()
  })
})
