// src/store/__tests__/searchStore.test.jsx
// SearchProvider + useSearchStore — open/close/toggle 상태 전이, Provider 가드
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SearchProvider, useSearchStore } from '../searchStore'

function Probe() {
  const { isOpen, open, close, toggle } = useSearchStore()
  return (
    <div>
      <div data-testid="state">{isOpen ? 'open' : 'closed'}</div>
      <button onClick={open}>OPEN</button>
      <button onClick={close}>CLOSE</button>
      <button onClick={toggle}>TOGGLE</button>
    </div>
  )
}

describe('SearchProvider', () => {
  it('초기 isOpen 은 false', () => {
    render(<SearchProvider><Probe /></SearchProvider>)
    expect(screen.getByTestId('state').textContent).toBe('closed')
  })

  it('open() → isOpen=true, close() → false', () => {
    render(<SearchProvider><Probe /></SearchProvider>)
    act(() => screen.getByText('OPEN').click())
    expect(screen.getByTestId('state').textContent).toBe('open')

    act(() => screen.getByText('CLOSE').click())
    expect(screen.getByTestId('state').textContent).toBe('closed')
  })

  it('toggle() 은 현재 값을 뒤집는다', () => {
    render(<SearchProvider><Probe /></SearchProvider>)
    act(() => screen.getByText('TOGGLE').click())
    expect(screen.getByTestId('state').textContent).toBe('open')
    act(() => screen.getByText('TOGGLE').click())
    expect(screen.getByTestId('state').textContent).toBe('closed')
  })

  it('open() 는 멱등적이다 (이미 열려있으면 변화 없음)', () => {
    render(<SearchProvider><Probe /></SearchProvider>)
    act(() => screen.getByText('OPEN').click())
    act(() => screen.getByText('OPEN').click())
    expect(screen.getByTestId('state').textContent).toBe('open')
  })

  it('Provider 밖에서 useSearchStore 호출 시 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/SearchProvider/)
    spy.mockRestore()
  })
})
