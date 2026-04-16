// src/lib/confluence.js — Confluence REST API v2 완전 연동
// 환경변수: VITE_CONFLUENCE_EMAIL, VITE_CONFLUENCE_TOKEN, VITE_CONFLUENCE_DOMAIN
// API 문서: https://developer.atlassian.com/cloud/confluence/rest/v2/intro/

const DOMAIN   = import.meta.env.VITE_CONFLUENCE_DOMAIN || 'hiconsy.atlassian.net'
const EMAIL    = import.meta.env.VITE_CONFLUENCE_EMAIL
const TOKEN    = import.meta.env.VITE_CONFLUENCE_TOKEN
const BASE_URL = `https://${DOMAIN}/wiki/api/v2`
const SPACE_KEY = import.meta.env.VITE_CONFLUENCE_SPACE_KEY || 'FVSOL'

// Confluence 연동 가능 여부
export const isConfluenceEnabled = Boolean(EMAIL && TOKEN)

// ─── 인증 헤더 ────────────────────────────────────────────────────────────────
function authHeaders() {
  if (!isConfluenceEnabled) return {}
  const creds = btoa(`${EMAIL}:${TOKEN}`)
  return {
    'Authorization': `Basic ${creds}`,
    'Content-Type':  'application/json',
    'Accept':        'application/json',
  }
}

// ─── 공통 fetch 래퍼 ────────────────────────────────────────────────────────
async function cfetch(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const res = await fetch(url, {
    headers: { ...authHeaders(), ...opts.headers },
    signal: opts.signal,
    ...opts,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Confluence API 오류: ${res.status}`)
  }
  return res.json()
}

// ─── 페이지 조회 ─────────────────────────────────────────────────────────────

/** 페이지 ID로 Confluence 페이지 가져오기 */
export async function getPage(pageId) {
  if (!isConfluenceEnabled) return null
  return cfetch(`/pages/${pageId}?body-format=storage&version=true`)
}

/** 페이지 ID로 body (HTML/storage) 가져오기 */
export async function getPageBody(pageId) {
  if (!isConfluenceEnabled) return null
  const page = await getPage(pageId)
  return page?.body?.storage?.value || null
}

/** 페이지의 첨부 파일 목록 */
export async function getPageAttachments(pageId) {
  if (!isConfluenceEnabled) return []
  const data = await cfetch(`/pages/${pageId}/attachments?limit=50`)
  return (data?.results || []).map(a => ({
    id:       a.id,
    title:    a.title,
    mediaType:a.mediaType,
    fileSize: a.extensions?.fileSize,
    downloadUrl: getAttachmentUrl(pageId, a.title),
  }))
}

/** 첨부 이미지 URL 생성 (프록시 or 직접) */
export function getAttachmentUrl(pageId, filename) {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // 개발: Vite 프록시 경유
    return `/confluence-img/wiki/download/attachments/${pageId}/${encodeURIComponent(filename)}?version=1&api=v2`
  }
  // 프로덕션: 직접 Confluence URL (CORS 허용 환경에서만 동작)
  return `https://${DOMAIN}/wiki/download/attachments/${pageId}/${encodeURIComponent(filename)}?version=1&api=v2`
}

// ─── 전문 검색 ───────────────────────────────────────────────────────────────

/** Confluence CQL 전문 검색 */
export async function searchConfluence(query, limit = 20) {
  if (!isConfluenceEnabled) return []
  const cql = `space.key = "${SPACE_KEY}" AND type = "page" AND text ~ "${query}" ORDER BY lastModified DESC`
  const data = await cfetch(`/search?cql=${encodeURIComponent(cql)}&limit=${limit}&expand=body.excerpt`)
  return (data?.results || []).map(r => ({
    id:       r.content?.id,
    title:    r.title,
    excerpt:  r.excerpt,
    url:      `https://${DOMAIN}/wiki${r.url}`,
    space:    r.resultParentContainer?.title,
    lastModified: r.lastModified,
  }))
}

// ─── 스페이스 페이지 트리 ────────────────────────────────────────────────────

/** 스페이스 루트 페이지 목록 */
export async function getSpacePages(limit = 50) {
  if (!isConfluenceEnabled) return []
  const data = await cfetch(`/spaces/${SPACE_KEY}/pages?limit=${limit}&status=current`)
  return data?.results || []
}

/** 특정 페이지의 자식 페이지 목록 */
export async function getChildPages(pageId, limit = 50) {
  if (!isConfluenceEnabled) return []
  const data = await cfetch(`/pages/${pageId}/children/page?limit=${limit}&status=current`)
  return (data?.results || []).map(p => ({
    id:    p.id,
    title: p.title,
    url:   `https://${DOMAIN}/wiki/spaces/${SPACE_KEY}/pages/${p.id}`,
  }))
}

// ─── 페이지 생성/수정 (관리자 전용) ─────────────────────────────────────────

/** 새 페이지 생성 */
export async function createPage({ spaceKey = SPACE_KEY, title, body, parentId }) {
  if (!isConfluenceEnabled) throw new Error('Confluence 연동이 설정되지 않았습니다')
  const payload = {
    type: 'page',
    title,
    space: { key: spaceKey },
    body: { storage: { value: body, representation: 'storage' } },
    ...(parentId && { ancestors: [{ id: parentId }] }),
  }
  return cfetch('/pages', { method: 'POST', body: JSON.stringify(payload) })
}

/** 기존 페이지 업데이트 */
export async function updatePage(pageId, { title, body, version }) {
  if (!isConfluenceEnabled) throw new Error('Confluence 연동이 설정되지 않았습니다')
  const payload = {
    type: 'page',
    title,
    version: { number: version + 1 },
    body: { storage: { value: body, representation: 'storage' } },
  }
  return cfetch(`/pages/${pageId}`, { method: 'PUT', body: JSON.stringify(payload) })
}

// ─── 이미지 업로드 ───────────────────────────────────────────────────────────

/** 페이지에 이미지 첨부 */
export async function uploadAttachment(pageId, file) {
  if (!isConfluenceEnabled) throw new Error('Confluence 연동이 설정되지 않았습니다')
  const form = new FormData()
  form.append('file', file)
  form.append('comment', `AMS Wiki 업로드: ${file.name}`)

  const url = `https://${DOMAIN}/wiki/rest/api/content/${pageId}/child/attachment`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${EMAIL}:${TOKEN}`)}`,
      'X-Atlassian-Token': 'no-check',
    },
    body: form,
  })
  if (!res.ok) throw new Error(`이미지 업로드 실패: ${res.status}`)
  const data = await res.json()
  const att = data?.results?.[0]
  return att ? getAttachmentUrl(pageId, att.title) : null
}

// ─── 유틸 ────────────────────────────────────────────────────────────────────

/** Confluence 페이지 직접 링크 */
export function getPageUrl(pageId) {
  return `https://${DOMAIN}/wiki/spaces/${SPACE_KEY}/pages/${pageId}`
}

/** storage XML → 순수 텍스트 (검색 스니펫용) */
export function storageToText(xml) {
  if (!xml) return ''
  return xml
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500)
}
