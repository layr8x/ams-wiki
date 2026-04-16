/**
 * 가이드 API
 * API 없을 때 mockData로 자동 fallback
 *
 * REST 엔드포인트 스펙 (백엔드 계약):
 * GET    /api/v1/wiki/guides              — 목록 (module, q, page, per_page)
 * GET    /api/v1/wiki/guides/:id          — 단건
 * POST   /api/v1/wiki/guides              — 생성
 * PUT    /api/v1/wiki/guides/:id          — 수정
 * POST   /api/v1/wiki/guides/:id/publish  — 발행
 * POST   /api/v1/wiki/guides/:id/rollback — 롤백
 * GET    /api/v1/wiki/guides/:id/versions — 버전 이력
 * POST   /api/v1/wiki/guides/:id/feedback — 유용성 투표
 * GET    /api/v1/wiki/guides/recent       — 최근 5개
 * GET    /api/v1/wiki/search?q=           — 검색
 * GET    /api/v1/wiki/modules             — 모듈 목록
 */
import client from './client'
import { GUIDES, MODULES, RECENT_GUIDES } from './mockData'

const withFallback = (apiFn, fallbackFn) =>
  apiFn().catch(() => fallbackFn())

/* ─── 모듈 목록 ─── */
export const getModules = () =>
  withFallback(
    () => client.get('/modules').then(r => r.data.data),
    () => Promise.resolve(MODULES)
  )

/* ─── 최근 업데이트 ─── */
export const getRecentGuides = () =>
  withFallback(
    () => client.get('/guides/recent').then(r => r.data.data),
    () => Promise.resolve(RECENT_GUIDES)
  )

/* ─── 가이드 목록 ─── */
export const getGuides = (params = {}) =>
  withFallback(
    () => client.get('/guides', { params }).then(r => r.data),
    () => {
      let list = [...GUIDES]
      if (params.module) list = list.filter(g => g.module_id === params.module)
      if (params.q) {
        const q = params.q.toLowerCase()
        list = list.filter(g =>
          g.title.toLowerCase().includes(q) ||
          g.summary.toLowerCase().includes(q) ||
          g.tags?.some(t => t.includes(q))
        )
      }
      return Promise.resolve({ data: list, pagination: { page: 1, per_page: 20, total: list.length, total_pages: 1 } })
    }
  )

/* ─── 가이드 단건 ─── */
export const getGuide = (id) =>
  withFallback(
    () => client.get(`/guides/${id}`).then(r => r.data.data),
    () => {
      const guide = GUIDES.find(g => g.id === id)
      return guide ? Promise.resolve(guide) : Promise.reject(new Error('Not found'))
    }
  )

/* ─── 검색 ─── */
export const searchGuides = (q, module = '', limit = 8) =>
  withFallback(
    () => client.get('/search', { params: { q, module, limit } }).then(r => r.data.data),
    () => {
      const lower = q.toLowerCase()
      const results = GUIDES.filter(g =>
        g.title.toLowerCase().includes(lower) ||
        g.summary.toLowerCase().includes(lower) ||
        g.tags?.some(t => t.toLowerCase().includes(lower)) ||
        g.module.toLowerCase().includes(lower)
      ).slice(0, limit).map(({ id, title, module, summary }) => ({ id, title, module, snippet: summary }))
      return Promise.resolve(results)
    }
  )

/* ─── 버전 이력 ─── */
export const getGuideVersions = (id) =>
  client.get(`/guides/${id}/versions`).then(r => r.data.data).catch(() => [])

/* ─── 생성 / 수정 / 발행 / 롤백 ─── */
export const createGuide = (body) =>
  client.post('/guides', body).then(r => r.data.data)

export const updateGuide = (id, body) =>
  client.put(`/guides/${id}`, body).then(r => r.data.data)

export const publishGuide = (id) =>
  client.post(`/guides/${id}/publish`).then(r => r.data.data)

export const rollbackGuide = (id, versionId, reason) =>
  client.post(`/guides/${id}/rollback`, { version_id: versionId, reason }).then(r => r.data.data)

/* ─── 피드백 ─── */
export const submitFeedback = (id, useful, comment) =>
  client.post(`/guides/${id}/feedback`, { useful, comment })
    .then(r => r.data)
    .catch(() => ({ ok: true })) // 피드백은 실패해도 UI 영향 없음
