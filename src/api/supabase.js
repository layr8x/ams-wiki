/**
 * Supabase 클라이언트 설정
 *
 * 가이드 데이터 저장소:
 * - guides: 가이드 메인 테이블
 * - guide_versions: 버전 관리
 * - guide_feedback: 유용성 피드백
 * - guide_attachments: 첨부파일
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not configured. Using mock data only.')
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      db: { schema: 'public' },
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 10 } },
    })
  : null

/**
 * Supabase 테이블 스키마 (참고용)
 *
 * guides:
 *   - id: uuid (PK)
 *   - module_id: varchar (모듈 ID)
 *   - title: varchar (제목)
 *   - summary: text (요약)
 *   - content: text (마크다운 본문)
 *   - guide_type: varchar (sop, trouble, reference, decision)
 *   - author: varchar (작성자)
 *   - target_roles: varchar[] (대상 역할)
 *   - tags: varchar[] (태그)
 *   - status: varchar (draft, published)
 *   - view_count: integer (조회수)
 *   - created_at: timestamp
 *   - updated_at: timestamp
 *   - published_at: timestamp
 *
 * guide_feedback:
 *   - id: uuid (PK)
 *   - guide_id: uuid (FK → guides)
 *   - user_id: varchar (사용자)
 *   - useful: boolean (유용 여부)
 *   - comment: text (피드백 의견)
 *   - created_at: timestamp
 *
 * guide_versions:
 *   - id: uuid (PK)
 *   - guide_id: uuid (FK → guides)
 *   - version: varchar (v1, v2, ...)
 *   - content: text (해당 버전 내용)
 *   - author: varchar
 *   - created_at: timestamp
 */

export const db = {
  /**
   * 가이드 목록 조회
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>}
   */
  async getGuides(options = {}) {
    if (!supabase) return []

    let query = supabase
      .from('guides')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })

    if (options.module_id) {
      query = query.eq('module_id', options.module_id)
    }
    if (options.status) {
      query = query.eq('status', options.status)
    }
    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data, error, count } = await query
    if (error) console.error('❌ getGuides:', error)

    return { data: data || [], total: count || 0 }
  },

  /**
   * 가이드 단건 조회
   * @param {string} id - 가이드 ID
   * @returns {Promise<Object>}
   */
  async getGuide(id) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('id', id)
      .single()

    if (error) console.error('❌ getGuide:', error)
    return data || null
  },

  /**
   * 가이드 생성
   * @param {Object} guide - 가이드 데이터
   * @returns {Promise<Object>}
   */
  async createGuide(guide) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('guides')
      .insert([{
        ...guide,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) console.error('❌ createGuide:', error)
    return data || null
  },

  /**
   * 가이드 수정
   * @param {string} id - 가이드 ID
   * @param {Object} updates - 수정 사항
   * @returns {Promise<Object>}
   */
  async updateGuide(id, updates) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('guides')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) console.error('❌ updateGuide:', error)
    return data || null
  },

  /**
   * 가이드 발행
   * @param {string} id - 가이드 ID
   * @returns {Promise<Object>}
   */
  async publishGuide(id) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('guides')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) console.error('❌ publishGuide:', error)
    return data || null
  },

  /**
   * 검색
   * @param {string} q - 검색어
   * @returns {Promise<Array>}
   */
  async search(q, limit = 20) {
    if (!supabase || !q) return []

    const { data, error } = await supabase
      .from('guides')
      .select('id, title, module_id, summary')
      .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
      .eq('status', 'published')
      .limit(limit)

    if (error) console.error('❌ search:', error)
    return data || []
  },

  /**
   * 피드백 제출
   * @param {string} guideId - 가이드 ID
   * @param {boolean} useful - 유용 여부
   * @param {string} comment - 피드백 의견
   * @returns {Promise<Object>}
   */
  async submitFeedback(guideId, useful, comment) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('guide_feedback')
      .insert([{
        guide_id: guideId,
        useful,
        comment,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) console.error('❌ submitFeedback:', error)
    return data || null
  },
}

export default supabase
