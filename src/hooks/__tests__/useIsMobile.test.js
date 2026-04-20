// src/hooks/__tests__/useIsMobile.test.js
// useIsMobile — window.innerWidth 기반 boolean + mql change 이벤트 구독 해제
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

function setInnerWidth(px) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: px })
}

describe('useIsMobile', () => {
  let listener
  let matchMediaSpy

  beforeEach(() => {
    listener = null
    matchMediaSpy = vi.fn((query) => ({
      matches: false,
      media: query,
      addEventListener: (type, cb) => { if (type === 'change') listener = cb },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    window.matchMedia = matchMediaSpy
  })

  afterEach(() => {
    delete window.matchMedia
  })

  it('innerWidth < 768 이면 true', () => {
    setInnerWidth(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('innerWidth >= 768 이면 false', () => {
    setInnerWidth(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('media query change 이벤트가 발생하면 값이 갱신된다', () => {
    setInnerWidth(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // 모바일 폭으로 축소 후 mql change 이벤트 발송
    setInnerWidth(500)
    act(() => listener?.())
    expect(result.current).toBe(true)
  })

  it('매칭 미디어 쿼리에 max-width: 767px 이 걸린다', () => {
    setInnerWidth(1024)
    renderHook(() => useIsMobile())
    expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 767px)')
  })
})
