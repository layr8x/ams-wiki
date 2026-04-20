// src/components/common/__tests__/ErrorBoundary.test.jsx
// ErrorBoundary — class lifecycle, reset behavior 검증
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

function Boom({ message = 'boom' }) {
  throw new Error(message)
}

function Safe() {
  return <div>정상 자식</div>
}

describe('ErrorBoundary', () => {
  let errorSpy
  beforeEach(() => {
    // React + 브라우저 둘 다 console.error 로 로그하므로 테스트 중에는 조용히
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('에러가 없을 때는 자식을 그대로 렌더한다', () => {
    render(
      <ErrorBoundary variant="page">
        <Safe />
      </ErrorBoundary>
    )
    expect(screen.getByText('정상 자식')).toBeTruthy()
  })

  it('자식이 throw 하면 page variant 에러 UI를 보여준다', () => {
    render(
      <ErrorBoundary variant="page">
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText('이 페이지를 표시할 수 없습니다')).toBeTruthy()
  })

  it('global variant 는 전체화면 메시지를 보여준다', () => {
    render(
      <ErrorBoundary variant="global">
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText('문제가 발생했습니다')).toBeTruthy()
  })

  it('resetKey 가 바뀌면 에러가 자동 해제된다', () => {
    const { rerender } = render(
      <ErrorBoundary variant="page" resetKey="/a">
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText('이 페이지를 표시할 수 없습니다')).toBeTruthy()

    // resetKey 변경 → 같은 pathname 시뮬레이션; 자식도 정상 컴포넌트로 교체
    act(() => {
      rerender(
        <ErrorBoundary variant="page" resetKey="/b">
          <Safe />
        </ErrorBoundary>
      )
    })

    expect(screen.queryByText('이 페이지를 표시할 수 없습니다')).toBeNull()
    expect(screen.getByText('정상 자식')).toBeTruthy()
  })

  it('resetKey 가 같으면 에러 상태가 유지된다', () => {
    const { rerender } = render(
      <ErrorBoundary variant="page" resetKey="/same">
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText('이 페이지를 표시할 수 없습니다')).toBeTruthy()

    // 동일 resetKey — 재렌더에도 에러 유지
    act(() => {
      rerender(
        <ErrorBoundary variant="page" resetKey="/same">
          <Safe />
        </ErrorBoundary>
      )
    })

    expect(screen.getByText('이 페이지를 표시할 수 없습니다')).toBeTruthy()
  })
})
