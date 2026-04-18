// src/hooks/useRecentlyViewed.js
// 독자 관점의 "최근 본 가이드" 트래킹 — localStorage 기반.
// 대시보드 진입점, 검색 오버레이 최근 항목, 사이드바 최근 목록에서 재활용한다.
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ams-wiki:recently-viewed:v1'
const MAX_ENTRIES = 20

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function write(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
  } catch {
    // storage quota / private mode — 무시
  }
}

/**
 * 최근 본 가이드 id 목록 (최신순).
 * track(id) 호출 시 큐 맨 앞으로 이동, 중복 제거, 최대 20개 유지.
 * 다른 탭 변경도 storage 이벤트로 반영.
 */
export function useRecentlyViewed() {
  const [entries, setEntries] = useState(read)

  useEffect(() => {
    const sync = (e) => {
      if (e.key === STORAGE_KEY) setEntries(read())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const track = useCallback((guideId) => {
    if (!guideId) return
    setEntries(prev => {
      const now = new Date().toISOString()
      const filtered = prev.filter(e => e.id !== guideId)
      const next = [{ id: guideId, viewedAt: now }, ...filtered].slice(0, MAX_ENTRIES)
      write(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    write([])
    setEntries([])
  }, [])

  return { entries, track, clear }
}
