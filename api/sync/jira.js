// api/sync/jira.js
// Vercel Cron Job: 정기적으로 Jira 이슈 동기화
// 모든 사용자의 연결된 Jira에서 이슈 조회 및 캐시 갱신

import { createClient } from '@supabase/supabase-js'
import JiraClient from '../lib/jira-client.js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// 동기화 로그 저장 (선택사항)
async function logSync(provider, status, message, count = 0) {
  const { error } = await supabase
    .from('sync_logs')
    .insert({
      provider,
      status,
      message,
      issue_count: count,
      synced_at: new Date().toISOString(),
    })
    .catchError(() => null) // 테이블이 없으면 무시

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to log sync:', error)
  }
}

export default async function handler(req, res) {
  // Vercel Cron은 GET 요청
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 보안: Vercel Cron 토큰 검증
  const cronSecret = req.headers['authorization']?.replace('Bearer ', '')
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('[SYNC] Jira 동기화 시작')

    // 1. 모든 활성 Jira 통합 조회
    const { data: integrations, error: intError } = await supabase
      .from('oauth_integrations')
      .select('id, user_id, cloud_id, expires_at, is_active')
      .eq('provider', 'jira')
      .eq('is_active', true)

    if (intError) throw intError

    if (!integrations?.length) {
      console.log('[SYNC] 활성 Jira 통합 없음')
      await logSync('jira', 'success', 'No active integrations', 0)
      return res.status(200).json({
        message: 'No active integrations',
        synced: 0,
      })
    }

    console.log(`[SYNC] ${integrations.length}개 Jira 통합 발견`)

    let totalIssues = 0
    const results = []

    // 2. 각 사용자의 Jira에서 최근 이슈 조회
    for (const integration of integrations) {
      try {
        const jiraClient = new JiraClient(
          integration.user_id,
          'jira',
          integration.cloud_id
        )

        // 최근 7일 변경된 이슈만 조회 (비용 절감)
        const jql = 'updated >= -7d ORDER BY updated DESC'
        const result = await jiraClient.searchIssues(jql, { maxResults: 50 })

        const issueCount = result.issues?.length || 0
        totalIssues += issueCount

        results.push({
          userId: integration.user_id,
          cloudId: integration.cloud_id,
          issueCount,
          status: 'success',
        })

        console.log(`[SYNC] User ${integration.user_id}: ${issueCount}개 이슈`)
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
      'jira',
      'success',
      `Synced ${successCount}/${integrations.length} users, ${totalIssues} issues`,
      totalIssues
    )

    console.log(`[SYNC] Jira 동기화 완료: ${totalIssues}개 이슈`)

    res.status(200).json({
      message: 'Jira sync completed',
      synced: integrations.length,
      totalIssues,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[SYNC] Jira 동기화 실패:', err)
    await logSync('jira', 'error', err.message)

    res.status(500).json({
      error: 'Sync failed',
      message: err.message,
      timestamp: new Date().toISOString(),
    })
  }
}
