// api/sync/confluence.js
// Vercel Cron Job: 정기적으로 Confluence 페이지 동기화
// 모든 사용자의 연결된 Confluence에서 페이지 조회 및 캐시 갱신

import { createClient } from '@supabase/supabase-js'
import ConfluenceClient from '../lib/confluence-client.js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function logSync(provider, status, message, count = 0) {
  const { error } = await supabase
    .from('sync_logs')
    .insert({
      provider,
      status,
      message,
      page_count: count,
      synced_at: new Date().toISOString(),
    })
    .catchError(() => null)

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to log sync:', error)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cronSecret = req.headers['authorization']?.replace('Bearer ', '')
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('[SYNC] Confluence 동기화 시작')

    // 1. 모든 활성 Confluence 통합 조회
    const { data: integrations, error: intError } = await supabase
      .from('oauth_integrations')
      .select('id, user_id, cloud_id, expires_at, is_active')
      .eq('provider', 'confluence')
      .eq('is_active', true)

    if (intError) throw intError

    if (!integrations?.length) {
      console.log('[SYNC] 활성 Confluence 통합 없음')
      await logSync('confluence', 'success', 'No active integrations', 0)
      return res.status(200).json({
        message: 'No active integrations',
        synced: 0,
      })
    }

    console.log(`[SYNC] ${integrations.length}개 Confluence 통합 발견`)

    let totalPages = 0
    const results = []

    // 2. 각 사용자의 Confluence에서 최근 페이지 조회
    for (const integration of integrations) {
      try {
        const confluenceClient = new ConfluenceClient(
          integration.user_id,
          integration.cloud_id
        )

        // 최근 수정된 페이지 조회 (최대 50개)
        const cql = 'type = page ORDER BY lastModified DESC'
        const result = await confluenceClient.searchPages(cql, {
          limit: 50,
        })

        const pageCount = result.results?.length || 0
        totalPages += pageCount

        results.push({
          userId: integration.user_id,
          cloudId: integration.cloud_id,
          pageCount,
          status: 'success',
        })

        console.log(`[SYNC] User ${integration.user_id}: ${pageCount}개 페이지`)
      } catch (err) {
        console.error(`[SYNC] User ${integration.user_id} 오류:`, err.message)
        results.push({
          userId: integration.user_id,
          cloudId: integration.cloud_id,
          status: 'error',
          error: err.message,
        })
      }
    }

    // 3. 동기화 로그 저장
    const successCount = results.filter(r => r.status === 'success').length
    await logSync(
      'confluence',
      'success',
      `Synced ${successCount}/${integrations.length} users, ${totalPages} pages`,
      totalPages
    )

    console.log(`[SYNC] Confluence 동기화 완료: ${totalPages}개 페이지`)

    res.status(200).json({
      message: 'Confluence sync completed',
      synced: integrations.length,
      totalPages,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[SYNC] Confluence 동기화 실패:', err)
    await logSync('confluence', 'error', err.message)

    res.status(500).json({
      error: 'Sync failed',
      message: err.message,
      timestamp: new Date().toISOString(),
    })
  }
}
