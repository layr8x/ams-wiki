// src/pages/__tests__/UpdatesPage.test.jsx
// UpdatesPage 스모크 — 타입 필터 + 월 그룹 타임라인
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import UpdatesPage from '../UpdatesPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <UpdatesPage />
    </MemoryRouter>
  )
}

describe('UpdatesPage', () => {
  it('타이틀과 기본 "전체" 필터 버튼 노출', () => {
    renderPage()
    expect(screen.getByText('업데이트 이력')).toBeTruthy()
    expect(screen.getByRole('button', { name: /전체/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /기능 개선/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /정책 변경/ })).toBeTruthy()
  })

  it('월 그룹 헤더 노출 (2026년 04월 존재)', () => {
    renderPage()
    expect(screen.getByText(/2026년 04월/)).toBeTruthy()
  })

  it('기본 전체 필터에서 업데이트 항목 다수 노출', () => {
    renderPage()
    // 업데이트 데이터의 "타이틀" 문자열 중 하나 확인
    expect(screen.getByText(/AMS 운영 위키 베타 오픈/)).toBeTruthy()
  })

  it('"정책 변경" 필터 클릭 시 policy 타입만 노출', () => {
    renderPage()
    const policyBtn = screen.getByRole('button', { name: /정책 변경/ })
    fireEvent.click(policyBtn)
    // 활성 스타일 적용
    expect(policyBtn.className).toMatch(/bg-foreground/)
    // policy 타입 항목만 존재 — 환불 정책 관련 글은 남고, 기능 개선 글은 숨어야 함
    expect(screen.getAllByText(/환불 정책/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/AMS 운영 위키 베타 오픈/)).toBeNull()
  })

  it('"전체" 버튼을 다시 눌러 필터 해제하면 모든 업데이트 복원', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /정책 변경/ }))
    expect(screen.queryByText(/AMS 운영 위키 베타 오픈/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /전체/ }))
    expect(screen.getByText(/AMS 운영 위키 베타 오픈/)).toBeTruthy()
  })
})
