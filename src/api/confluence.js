/**
 * Confluence API 클라이언트
 *
 * Atlassian Confluence에서 가이드 데이터를 동기화하는 모듈
 * 참고: https://developer.atlassian.com/cloud/confluence/rest/v2/
 */

import axios from 'axios'

const confluenceEmail = import.meta.env.VITE_CONFLUENCE_EMAIL
const confluenceToken = import.meta.env.VITE_CONFLUENCE_TOKEN
const confluenceDomain = import.meta.env.VITE_CONFLUENCE_DOMAIN || 'hiconsy.atlassian.net'

/**
 * Confluence API 클라이언트
 */
const confluenceClient = confluenceEmail && confluenceToken
  ? axios.create({
      baseURL: `https://${confluenceDomain}/wiki/api/v2`,
      auth: {
        username: confluenceEmail,
        password: confluenceToken,
      },
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
  : null

/**
 * Confluence 페이지 정보
 * @typedef {Object} ConfluencePage
 * @property {string} id - 페이지 ID
 * @property {string} title - 제목
 * @property {string} status - 상태 (current, draft 등)
 * @property {string} body - 페이지 본문 (HTML)
 * @property {Object} version - 버전 정보
 * @property {string} created_by - 작성자
 * @property {string} created_at - 생성일
 * @property {string} updated_by - 수정자
 * @property {string} updated_at - 수정일
 */

/**
 * Confluence 페이지 검색
 *
 * @param {string} query - CQL 쿼리 문자열
 * @param {Object} options - 검색 옵션
 * @returns {Promise<ConfluencePage[]>}
 *
 * @example
 * // FVSOL 스페이스에서 "전반" 키워드로 검색
 * const pages = await searchConfluencePages(
 *   'space = "FVSOL" AND title ~ "전반"',
 *   { limit: 50 }
 * )
 */
export async function searchConfluencePages(query, options = {}) {
  if (!confluenceClient) {
    console.warn('⚠️ Confluence API가 설정되지 않았습니다')
    return []
  }

  try {
    const { data } = await confluenceClient.get('/pages/search', {
      params: {
        cql: query,
        limit: options.limit || 25,
        sort: options.sort || '-updated',
      },
    })

    return data.results || []
  } catch (error) {
    console.error('❌ Confluence 검색 실패:', error.message)
    return []
  }
}

/**
 * Confluence 페이지 조회
 *
 * @param {string} pageId - 페이지 ID
 * @returns {Promise<ConfluencePage|null>}
 */
export async function getConfluencePage(pageId) {
  if (!confluenceClient) {
    console.warn('⚠️ Confluence API가 설정되지 않았습니다')
    return null
  }

  try {
    const { data } = await confluenceClient.get(`/pages/${pageId}`, {
      params: {
        'body-format': 'storage',
        expand: 'body.storage,version',
      },
    })

    return data
  } catch (error) {
    console.error(`❌ Confluence 페이지 조회 실패 (${pageId}):`, error.message)
    return null
  }
}

/**
 * Confluence 페이지를 가이드로 변환
 *
 * @param {ConfluencePage} page - Confluence 페이지
 * @param {string} moduleId - 모듈 ID
 * @returns {Object} 변환된 가이드
 */
export function convertPageToGuide(page, moduleId) {
  return {
    id: `confluence-${page.id}`,
    module_id: moduleId,
    title: page.title,
    summary: extractSummary(page.body?.storage?.value || ''),
    content: page.body?.storage?.value || '',
    guide_type: 'reference', // 기본값
    author: page.created_by?.username || 'unknown',
    target_roles: [],
    tags: page.labels?.results?.map(l => l.name) || [],
    status: 'published',
    view_count: 0,
    created_at: page.created_at,
    updated_at: page.updated_at,
    published_at: page.created_at,
    deeplink: page._links?.self || '',
  }
}

/**
 * HTML에서 요약 텍스트 추출
 *
 * @param {string} html - HTML 문자열
 * @returns {string} 추출된 텍스트
 */
function extractSummary(html) {
  // <p> 태그의 첫 번째 텍스트 추출
  const match = html.match(/<p>([^<]{1,200})<\/p>/)
  if (match) {
    return match[1].trim()
  }

  // 또는 평문으로 변환 후 200자까지
  const text = html
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&[a-z]+;/g, '') // HTML 엔티티 제거
    .trim()

  return text.substring(0, 200)
}

/**
 * FVSOL 스페이스에서 모든 페이지 동기화
 *
 * @returns {Promise<Object>} { success: number, failed: number, guides: Guide[] }
 */
export async function syncConfluenceGuides() {
  if (!confluenceClient) {
    console.error('❌ Confluence API가 설정되지 않았습니다')
    return { success: 0, failed: 0, guides: [] }
  }

  console.log('🔄 Confluence 동기화 시작...')

  try {
    // FVSOL 스페이스의 모든 페이지 검색
    const pages = await searchConfluencePages(
      'space = "FVSOL" AND type = "page" AND status = "current"',
      { limit: 100 }
    )

    console.log(`📄 찾은 페이지: ${pages.length}개`)

    const guides = []
    let success = 0
    let failed = 0

    for (const page of pages) {
      try {
        const fullPage = await getConfluencePage(page.id)
        if (fullPage) {
          const guide = convertPageToGuide(fullPage, 'reference')
          guides.push(guide)
          success++
        } else {
          failed++
        }
      } catch (error) {
        console.warn(`⚠️ 페이지 처리 실패 (${page.title}):`, error.message)
        failed++
      }
    }

    console.log(`✅ 동기화 완료: ${success}개 성공, ${failed}개 실패`)
    return { success, failed, guides }

  } catch (error) {
    console.error('❌ Confluence 동기화 실패:', error.message)
    return { success: 0, failed: 0, guides: [] }
  }
}

/**
 * 특정 모듈의 가이드만 동기화
 *
 * @param {string} moduleId - 모듈 ID
 * @param {string} moduleKeyword - 모듈 키워드 (검색용)
 * @returns {Promise<Guide[]>}
 *
 * @example
 * const operationGuides = await syncModuleGuides(
 *   'operation',
 *   '수업운영관리'
 * )
 */
export async function syncModuleGuides(moduleId, moduleKeyword) {
  if (!confluenceClient) {
    return []
  }

  try {
    const pages = await searchConfluencePages(
      `space = "FVSOL" AND (title ~ "${moduleKeyword}" OR text ~ "${moduleKeyword}")`,
      { limit: 50 }
    )

    const guides = []

    for (const page of pages) {
      const fullPage = await getConfluencePage(page.id)
      if (fullPage) {
        const guide = convertPageToGuide(fullPage, moduleId)
        guides.push(guide)
      }
    }

    return guides
  } catch (error) {
    console.error(`❌ ${moduleId} 동기화 실패:`, error.message)
    return []
  }
}

export default confluenceClient
