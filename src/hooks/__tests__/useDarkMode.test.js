// src/hooks/__tests__/useDarkMode.test.js
// useDarkMode — 초기값(저장값/시스템), 토글, setDark/setLight, localStorage/document.documentElement 반영
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { useDarkMode } from '../useDarkMode'

function mockMatchMedia(matches) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    delete window.matchMedia
  })

  it('저장값이 "dark" 이면 초기값은 true (시스템 설정 무시)', () => {
    localStorage.setItem(STORAGE_KEYS.theme, 'dark')
    mockMatchMedia(false)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('저장값이 "light" 이면 초기값은 false', () => {
    localStorage.setItem(STORAGE_KEYS.theme, 'light')
    mockMatchMedia(true) // 시스템은 다크지만 저장값 우선
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('저장값이 없으면 시스템 prefers-color-scheme 을 따른다', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(true)
  })

  it('toggle 은 isDark 를 뒤집고 localStorage/html 클래스에 반영한다', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(false)

    act(() => result.current.toggle())
    expect(result.current.isDark).toBe(true)
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.isDark).toBe(false)
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('setDark / setLight 는 멱등적이다', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useDarkMode())

    act(() => result.current.setDark())
    act(() => result.current.setDark())
    expect(result.current.isDark).toBe(true)

    act(() => result.current.setLight())
    act(() => result.current.setLight())
    expect(result.current.isDark).toBe(false)
  })
})
