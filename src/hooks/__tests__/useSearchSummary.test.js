// src/hooks/__tests__/useSearchSummary.test.js
// useSearchSummary — 디바운스, 상태 전이, abort, 503 비활성화 검증
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearchSummary } from '../useSearchSummary'

// fake timers 환경에서 Promise 체인을 소진하기 위한 헬퍼
async function flushAll() {
  await act(async () => {
    // 여러 번 advance 해서 setTimeout(0)/microtask chain 을 드레인
    for (let i = 0; i < 5; i++) {
      await vi.advanceTimersByTimeAsync(1)
    }
  })
}

const sampleResults = [
  { id: 'g1', title: 'Guide 1', tldr: 't1', module: 'm1', type: 'faq' },
  { id: 'g2', title: 'Guide 2', tldr: 't2', module: 'm2', type: 'faq' },
]

describe('useSearchSummary', () => {
  let fetchSpy

  beforeEach(() => {
    vi.useFakeTimers()
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ summary: 'AI 요약', sources: ['g1'] }), { status: 200 })
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    fetchSpy.mockRestore()
  })

  it('초기 상태는 idle 이다', () => {
    const { result } = renderHook(() => useSearchSummary('', []))
    expect(result.current.status).toBe('idle')
  })

  it('쿼리 길이가 2 미만이면 요청하지 않는다', async () => {
    renderHook(() => useSearchSummary('a', sampleResults))
    await act(async () => { await vi.advanceTimersByTimeAsync(500) })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('결과가 2개 미만이면 요청하지 않는다', async () => {
    renderHook(() => useSearchSummary('hello', [sampleResults[0]]))
    await act(async () => { await vi.advanceTimersByTimeAsync(500) })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('충분한 쿼리/결과가 있으면 400ms 디바운스 후 fetch 호출', async () => {
    renderHook(() => useSearchSummary('hello', sampleResults))
    // 디바운스 이내 — 아직 호출 안 됨
    await act(async () => { await vi.advanceTimersByTimeAsync(399) })
    expect(fetchSpy).not.toHaveBeenCalled()
    // 디바운스 경과 — 호출됨
    await act(async () => { await vi.advanceTimersByTimeAsync(2) })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [, init] = fetchSpy.mock.calls[0]
    expect(JSON.parse(init.body)).toMatchObject({ query: 'hello' })
  })

  it('정상 응답 시 ready 상태와 summary/sources 를 담는다', async () => {
    const { result } = renderHook(() => useSearchSummary('hello', sampleResults))
    await act(async () => { await vi.advanceTimersByTimeAsync(450) })
    await flushAll()
    expect(result.current.status).toBe('ready')
    expect(result.current.summary).toBe('AI 요약')
    expect(result.current.sources).toEqual(['g1'])
  })

  it('503 응답 시 disabled 로 전환되고 이후 요청을 차단한다', async () => {
    fetchSpy.mockResolvedValueOnce(new Response('', { status: 503 }))
    const { result, rerender } = renderHook(
      ({ q }) => useSearchSummary(q, sampleResults),
      { initialProps: { q: 'hello' } }
    )
    await act(async () => { await vi.advanceTimersByTimeAsync(450) })
    await flushAll()
    expect(result.current.status).toBe('disabled')

    // 이후 다른 쿼리 — 더 이상 요청 안 함
    fetchSpy.mockClear()
    rerender({ q: 'another query' })
    await act(async () => { await vi.advanceTimersByTimeAsync(500) })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('summary 가 없는 응답은 empty 상태', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }))
    const { result } = renderHook(() => useSearchSummary('hello', sampleResults))
    await act(async () => { await vi.advanceTimersByTimeAsync(450) })
    await flushAll()
    expect(result.current.status).toBe('empty')
  })

  it('non-ok HTTP 응답은 error 상태 (HTTP N 메시지)', async () => {
    fetchSpy.mockResolvedValueOnce(new Response('', { status: 500 }))
    const { result } = renderHook(() => useSearchSummary('hello', sampleResults))
    await act(async () => { await vi.advanceTimersByTimeAsync(450) })
    await flushAll()
    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('HTTP 500')
  })

  it('쿼리가 빠르게 바뀌면 이전 요청은 abort 되고 마지막 쿼리만 살아남는다', async () => {
    const { rerender } = renderHook(
      ({ q }) => useSearchSummary(q, sampleResults),
      { initialProps: { q: 'query1' } }
    )

    // 디바운스 도중 쿼리 교체
    await act(async () => { await vi.advanceTimersByTimeAsync(200) })
    rerender({ q: 'query2' })
    await act(async () => { await vi.advanceTimersByTimeAsync(500) })

    // 이전 타이머는 clearTimeout 으로 소멸 → 최종적으로 1회만 호출
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toMatchObject({ query: 'query2' })
  })

  it('쿼리가 너무 짧아지면 idle 로 리셋된다', async () => {
    const { result, rerender } = renderHook(
      ({ q }) => useSearchSummary(q, sampleResults),
      { initialProps: { q: 'hello' } }
    )
    await act(async () => { await vi.advanceTimersByTimeAsync(450) })
    await flushAll()
    expect(result.current.status).toBe('ready')

    rerender({ q: 'a' })
    await act(async () => { await vi.advanceTimersByTimeAsync(10) })
    await flushAll()
    expect(result.current.status).toBe('idle')
  })
})
