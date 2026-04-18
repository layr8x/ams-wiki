// src/hooks/useAutosave.js
// 로컬 임시저장 + 5초 디바운스 자동 저장 훅.
// 백엔드 미연동 상태이므로 localStorage를 store로 사용. API 연결 시 writer만 교체하면 됨.
import { useCallback, useEffect, useRef, useState } from 'react'

const isBrowser = typeof window !== 'undefined'

function readDraft(key) {
  if (!isBrowser) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeDraft(key, payload) {
  if (!isBrowser) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

function clearDraft(key) {
  if (!isBrowser) return
  try { window.localStorage.removeItem(key) } catch { /* noop */ }
}

/**
 * @param {object}   opts
 * @param {string}   opts.key       localStorage 키
 * @param {any}      opts.data      감시할 데이터(직렬화 가능해야 함)
 * @param {number}   opts.delay     디바운스 ms (기본 5000)
 * @param {boolean}  opts.enabled   활성화 여부 (기본 true)
 * @returns {{
 *   status: 'idle'|'saving'|'saved'|'error',
 *   savedAt: number|null,
 *   saveNow: () => Promise<void>,
 *   loadDraft: () => any|null,
 *   clearDraft: () => void,
 * }}
 */
export function useAutosave({ key, data, delay = 5000, enabled = true }) {
  const [status, setStatus]   = useState('idle')
  const [savedAt, setSavedAt] = useState(null)
  const timerRef = useRef(null)
  const firstRun = useRef(true)

  const persist = useCallback(() => {
    setStatus('saving')
    const ok = writeDraft(key, { data, savedAt: Date.now() })
    if (ok) {
      const now = Date.now()
      setSavedAt(now)
      setStatus('saved')
    } else {
      setStatus('error')
    }
  }, [key, data])

  useEffect(() => {
    if (!enabled) return
    // Skip initial mount — 복원한 데이터로 즉시 재저장하는 불필요한 I/O 방지
    if (firstRun.current) { firstRun.current = false; return }

    if (timerRef.current) clearTimeout(timerRef.current)
    // 상태는 타이머 콜백 안에서만 갱신(이펙트 본문에서 setState 금지 규칙 준수).
    // 'saving' → 'saved'/'error' 로 전이되므로 중간 'idle' 리셋은 생략해도 UX상 문제 없음.
    timerRef.current = setTimeout(persist, delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enabled, delay, persist])

  const saveNow = useCallback(async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    persist()
  }, [persist])

  const loadDraft = useCallback(() => {
    const raw = readDraft(key)
    if (raw && typeof raw.savedAt === 'number') setSavedAt(raw.savedAt)
    return raw?.data ?? null
  }, [key])

  const clear = useCallback(() => {
    clearDraft(key)
    setSavedAt(null)
    setStatus('idle')
  }, [key])

  return { status, savedAt, saveNow, loadDraft, clearDraft: clear }
}
