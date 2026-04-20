// src/lib/storageKeys.js — localStorage 키 단일 출처
// 네이밍 규약: 'ams-wiki:<도메인>:<용도>[:v버전]'
// 과거 버전 키는 LEGACY_KEYS 아래에 남겨 읽기 폴백 후 이관한다.

export const STORAGE_KEYS = {
  // Auth
  authToken:   'ams-wiki:auth:token',
  authUser:    'ams-wiki:auth:user',

  // UI 프리퍼런스
  theme:       'ams-wiki:theme',
  language:    'ams-wiki:language',

  // Editor
  editorDraft: 'ams-wiki:editor:draft:v1',

  // 최근 본 가이드
  recentlyViewed: 'ams-wiki:recently-viewed:v1',

  // 피드백
  feedbackQueue:     'ams-wiki:feedback:queue:v1',
  feedbackSessionId: 'ams-wiki:feedback-session-id',
  feedbackMockPrefix: 'ams-wiki:feedback:mock:',   // + guideId
}

// 구 키 → 새 키 매핑. 앱 부팅 시 1회 migrateLegacyKeys() 호출.
const LEGACY_KEYS = {
  'ams_token':     STORAGE_KEYS.authToken,
  'ams_wiki_user': STORAGE_KEYS.authUser,
  'theme-mode':    STORAGE_KEYS.theme,
  'language':      STORAGE_KEYS.language,
}

export function migrateLegacyKeys() {
  if (typeof window === 'undefined') return
  try {
    for (const [oldKey, newKey] of Object.entries(LEGACY_KEYS)) {
      const val = localStorage.getItem(oldKey)
      if (val !== null && localStorage.getItem(newKey) === null) {
        localStorage.setItem(newKey, val)
      }
      // 구 키는 제거 — 중복 유지 시 다음 로그인에서 stale 값 덮어쓰기 발생 가능
      if (val !== null) localStorage.removeItem(oldKey)
    }
  } catch { /* noop — private mode 등 */ }
}
