// src/components/common/__tests__/Pagination.test.jsx
// Pagination — 페이지 번호 생성, aria-current, 이전/다음 disabled, ellipsis 표기
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '../Pagination'

function buildPagination(overrides = {}) {
  return {
    currentPage: 1,
    totalPages:  5,
    totalItems:  50,
    startIndex:  1,
    endIndex:    10,
    hasPrevPage: false,
    hasNextPage: true,
    goToPage:    vi.fn(),
    ...overrides,
  }
}

describe('Pagination', () => {
  it('totalPages 가 1 이하이면 렌더하지 않는다', () => {
    const { container } = render(
      <Pagination pagination={buildPagination({ totalPages: 1 })} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('nav 래퍼에 aria-label 이 있다', () => {
    render(<Pagination pagination={buildPagination()} />)
    expect(screen.getByRole('navigation', { name: '페이지 네비게이션' })).toBeTruthy()
  })

  it('현재 페이지 버튼에 aria-current="page" 가 붙는다', () => {
    render(<Pagination pagination={buildPagination({ currentPage: 3 })} />)
    const current = screen.getByRole('button', { name: /3페이지로 이동/ })
    expect(current.getAttribute('aria-current')).toBe('page')
  })

  it('현재가 아닌 페이지 버튼은 aria-current 가 없다', () => {
    render(<Pagination pagination={buildPagination({ currentPage: 3 })} />)
    const other = screen.getByRole('button', { name: /2페이지로 이동/ })
    expect(other.hasAttribute('aria-current')).toBe(false)
  })

  it('페이지 번호 클릭은 goToPage 를 호출한다', () => {
    const goToPage = vi.fn()
    render(<Pagination pagination={buildPagination({ goToPage })} />)
    fireEvent.click(screen.getByRole('button', { name: /2페이지로 이동/ }))
    expect(goToPage).toHaveBeenCalledWith(2)
  })

  it('이전 버튼 비활성 상태와 다음 버튼 활성 상태 (첫 페이지)', () => {
    render(<Pagination pagination={buildPagination()} />)
    expect(screen.getByTitle('이전 페이지').disabled).toBe(true)
    expect(screen.getByTitle('다음 페이지').disabled).toBe(false)
  })

  it('이전/다음 버튼은 goToPage(±1) 를 호출한다', () => {
    const goToPage = vi.fn()
    render(
      <Pagination
        pagination={buildPagination({ currentPage: 3, hasPrevPage: true, hasNextPage: true, goToPage })}
      />
    )
    fireEvent.click(screen.getByTitle('이전 페이지'))
    expect(goToPage).toHaveBeenLastCalledWith(2)
    fireEvent.click(screen.getByTitle('다음 페이지'))
    expect(goToPage).toHaveBeenLastCalledWith(4)
  })

  it('totalPages 가 많으면 ellipsis + 경계 페이지 노출', () => {
    render(
      <Pagination
        pagination={buildPagination({ currentPage: 6, totalPages: 12 })}
      />
    )
    // 양쪽에 ellipsis 표시 (... 기호)
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBe(2)
    // 첫/끝 페이지 버튼 존재
    expect(screen.getByRole('button', { name: /1페이지로 이동/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /12페이지로 이동/ })).toBeTruthy()
    // 현재 페이지 좌우 2개 포함 (4,5,6,7,8)
    for (const p of [4, 5, 6, 7, 8]) {
      expect(screen.getByRole('button', { name: new RegExp(`${p}페이지로 이동`) })).toBeTruthy()
    }
  })

  it('ellipsis 는 aria-hidden 이다 (AT 에 노출되지 않음)', () => {
    render(
      <Pagination pagination={buildPagination({ currentPage: 6, totalPages: 12 })} />
    )
    for (const el of screen.getAllByText('...')) {
      expect(el.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('정보 텍스트 "start ~ end / 총 N개" 노출', () => {
    render(
      <Pagination
        pagination={buildPagination({ startIndex: 11, endIndex: 20, totalItems: 47 })}
      />
    )
    expect(screen.getByText('11 ~ 20 / 총 47개')).toBeTruthy()
  })
})
