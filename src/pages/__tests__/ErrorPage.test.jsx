// src/pages/__tests__/ErrorPage.test.jsx
// ErrorPage 스모크 테스트 — statusCode/message prop, 복구 액션 3종 렌더 + 네비게이션
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ErrorPage from '../ErrorPage'

const navigateMock = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigateMock }
})

function renderError(props = {}) {
  return render(
    <MemoryRouter>
      <ErrorPage {...props} />
    </MemoryRouter>
  )
}

describe('ErrorPage', () => {
  it('기본 404 상태코드와 메시지를 렌더한다', () => {
    renderError()
    expect(screen.getByText('404')).toBeTruthy()
    expect(screen.getByText('찾을 수 없는 페이지입니다.')).toBeTruthy()
  })

  it('statusCode/message prop 을 주면 덮어쓴다', () => {
    renderError({ statusCode: 500, message: '서버 오류가 발생했습니다.' })
    expect(screen.getByText('500')).toBeTruthy()
    expect(screen.getByText('서버 오류가 발생했습니다.')).toBeTruthy()
  })

  it('3개의 복구 액션 버튼이 노출된다 (이전/홈/검색)', () => {
    renderError()
    expect(screen.getByRole('button', { name: /이전으로/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /홈으로/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /가이드 검색/ })).toBeTruthy()
  })

  it('"이전으로" 클릭은 navigate(-1) 호출', () => {
    navigateMock.mockClear()
    renderError()
    fireEvent.click(screen.getByRole('button', { name: /이전으로/ }))
    expect(navigateMock).toHaveBeenCalledWith(-1)
  })

  it('"홈으로" 클릭은 navigate("/") 호출', () => {
    navigateMock.mockClear()
    renderError()
    fireEvent.click(screen.getByRole('button', { name: /홈으로/ }))
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('"가이드 검색" 클릭은 navigate("/guides") 호출', () => {
    navigateMock.mockClear()
    renderError()
    fireEvent.click(screen.getByRole('button', { name: /가이드 검색/ }))
    expect(navigateMock).toHaveBeenCalledWith('/guides')
  })
})
