// src/components/common/__tests__/RouteBoundary.test.jsx
// RouteBoundary — pathname 변경 시 에러 자동 해제 검증
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { RouteBoundary } from '../RouteBoundary'

function Boom() {
  throw new Error('route boom')
}

function GoHome() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate('/home')}>
      GO_HOME
    </button>
  )
}

describe('RouteBoundary', () => {
  let errorSpy
  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('자식이 throw 하면 페이지 에러 UI를 보여준다', () => {
    render(
      <MemoryRouter initialEntries={['/broken']}>
        <Routes>
          <Route path="/broken" element={
            <RouteBoundary><Boom /></RouteBoundary>
          } />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('이 페이지를 표시할 수 없습니다')).toBeTruthy()
  })

  it('다른 경로로 이동하면 에러가 자동 복구된다', async () => {
    function Layout() {
      return (
        <div>
          <GoHome />
          <Routes>
            <Route path="/broken" element={
              <RouteBoundary><Boom /></RouteBoundary>
            } />
            <Route path="/home" element={
              <RouteBoundary><div>홈 화면</div></RouteBoundary>
            } />
          </Routes>
        </div>
      )
    }

    render(
      <MemoryRouter initialEntries={['/broken']}>
        <Layout />
      </MemoryRouter>
    )
    expect(screen.getByText('이 페이지를 표시할 수 없습니다')).toBeTruthy()

    // 다른 라우트로 네비게이션 — 각 RouteBoundary 가 독립적이라 홈은 정상 렌더
    await act(async () => {
      screen.getByText('GO_HOME').click()
    })

    expect(screen.queryByText('이 페이지를 표시할 수 없습니다')).toBeNull()
    expect(screen.getByText('홈 화면')).toBeTruthy()
  })
})
