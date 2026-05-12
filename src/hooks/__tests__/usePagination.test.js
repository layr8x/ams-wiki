// src/hooks/__tests__/usePagination.test.js
// usePagination — 페이지 경계, 슬라이스, goToPage 클램핑, reset 검증
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../usePagination'

const items = (n) => Array.from({ length: n }, (_, i) => i + 1)

describe('usePagination', () => {
  it('빈 배열 — totalPages 0, currentItems 빈 배열', () => {
    const { result } = renderHook(() => usePagination([], 10))
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPages).toBe(0)
    expect(result.current.currentItems).toEqual([])
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.hasPrevPage).toBe(false)
  })

  it('정확히 나눠지는 페이지 수', () => {
    const { result } = renderHook(() => usePagination(items(50), 10))
    expect(result.current.totalPages).toBe(5)
    expect(result.current.currentItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('나머지가 있는 경우 마지막 페이지에 남은 항목', () => {
    const { result } = renderHook(() => usePagination(items(27), 10))
    expect(result.current.totalPages).toBe(3)
    act(() => result.current.goToPage(3))
    expect(result.current.currentItems).toEqual([21, 22, 23, 24, 25, 26, 27])
  })

  it('nextPage / prevPage 이동', () => {
    const { result } = renderHook(() => usePagination(items(30), 10))
    act(() => result.current.nextPage())
    expect(result.current.currentPage).toBe(2)
    expect(result.current.currentItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])

    act(() => result.current.prevPage())
    expect(result.current.currentPage).toBe(1)
  })

  it('범위 밖 goToPage 는 클램핑된다', () => {
    const { result } = renderHook(() => usePagination(items(30), 10))
    act(() => result.current.goToPage(99))
    expect(result.current.currentPage).toBe(3)

    act(() => result.current.goToPage(-5))
    expect(result.current.currentPage).toBe(1)
  })

  it('hasNextPage / hasPrevPage 경계 플래그', () => {
    const { result } = renderHook(() => usePagination(items(30), 10))
    expect(result.current.hasPrevPage).toBe(false)
    expect(result.current.hasNextPage).toBe(true)

    act(() => result.current.goToPage(3))
    expect(result.current.hasPrevPage).toBe(true)
    expect(result.current.hasNextPage).toBe(false)
  })

  it('startIndex / endIndex 가 1-based 로 올바르게 계산된다', () => {
    const { result } = renderHook(() => usePagination(items(27), 10))
    expect(result.current.startIndex).toBe(1)
    expect(result.current.endIndex).toBe(10)

    act(() => result.current.goToPage(3))
    expect(result.current.startIndex).toBe(21)
    expect(result.current.endIndex).toBe(27) // 총 27개까지만
  })

  it('reset 은 1페이지로 되돌린다', () => {
    const { result } = renderHook(() => usePagination(items(30), 10))
    act(() => result.current.goToPage(3))
    expect(result.current.currentPage).toBe(3)

    act(() => result.current.reset())
    expect(result.current.currentPage).toBe(1)
  })

  it('items 가 줄어도 currentPage 가 자동으로 클램핑되지는 않지만 currentItems 는 빈 배열', () => {
    // 현재 구현: currentPage state 는 그대로 두고 slice 만 계산 → 빈 배열.
    // 필터 변경 시 page reset 을 호출하는 것은 사용자 측 책임 (pagination.reset()).
    const { result, rerender } = renderHook(
      ({ list }) => usePagination(list, 10),
      { initialProps: { list: items(30) } }
    )
    act(() => result.current.goToPage(3))
    expect(result.current.currentItems.length).toBe(10)

    rerender({ list: items(5) })
    expect(result.current.currentPage).toBe(3)     // 상태는 유지
    expect(result.current.currentItems).toEqual([]) // slice 결과는 빈 배열
  })
})
