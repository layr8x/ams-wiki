// src/components/admin/SyncMonitor.jsx
// Cron Job 동기화 상태 모니터링 대시보드

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

export function SyncMonitor() {
  const [syncLogs, setSyncLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState(null)

  useEffect(() => {
    loadSyncLogs()
    // 5분마다 새로고침
    const interval = setInterval(loadSyncLogs, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function loadSyncLogs() {
    try {
      const { data, error } = await supabase
        .from('sync_logs')
        .select('*')
        .order('synced_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setSyncLogs(data || [])
      setLastSync(new Date())
    } catch (err) {
      console.error('Failed to load sync logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950'
      case 'error':
        return 'bg-red-50 dark:bg-red-950'
      default:
        return 'bg-yellow-50 dark:bg-yellow-950'
    }
  }

  const groupedLogs = {
    jira: syncLogs.filter(log => log.provider === 'jira'),
    confluence: syncLogs.filter(log => log.provider === 'confluence'),
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>🔄 Cron Job 동기화 모니터</CardTitle>
            <CardDescription>
              Jira/Confluence 자동 동기화 상태
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSyncLogs}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 마지막 갱신 시간 */}
        {lastSync && (
          <p className="text-xs text-gray-500">
            마지막 갱신: {lastSync.toLocaleTimeString('ko-KR')}
          </p>
        )}

        {/* Jira 로그 */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge variant="outline">Jira</Badge>
            <span className="text-sm">{groupedLogs.jira.length}개 기록</span>
          </h3>
          <div className="space-y-2">
            {groupedLogs.jira.slice(0, 5).map(log => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {log.status === 'success' ? '✅ 성공' : '❌ 실패'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {log.message}
                    </p>
                    {log.issue_count > 0 && (
                      <p className="text-xs mt-1 font-semibold">
                        이슈: {log.issue_count}개
                      </p>
                    )}
                  </div>
                  <span className="text-xs whitespace-nowrap text-gray-500">
                    {new Date(log.synced_at).toLocaleTimeString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
            {groupedLogs.jira.length === 0 && (
              <p className="text-sm text-gray-500 p-3">아직 실행된 동기화가 없습니다</p>
            )}
          </div>
        </div>

        {/* Confluence 로그 */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge variant="outline">Confluence</Badge>
            <span className="text-sm">{groupedLogs.confluence.length}개 기록</span>
          </h3>
          <div className="space-y-2">
            {groupedLogs.confluence.slice(0, 5).map(log => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {log.status === 'success' ? '✅ 성공' : '❌ 실패'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {log.message}
                    </p>
                    {log.page_count > 0 && (
                      <p className="text-xs mt-1 font-semibold">
                        페이지: {log.page_count}개
                      </p>
                    )}
                  </div>
                  <span className="text-xs whitespace-nowrap text-gray-500">
                    {new Date(log.synced_at).toLocaleTimeString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
            {groupedLogs.confluence.length === 0 && (
              <p className="text-sm text-gray-500 p-3">아직 실행된 동기화가 없습니다</p>
            )}
          </div>
        </div>

        {/* 스케줄 정보 */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">📅 동기화 스케줄</p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
            <li>🔵 Jira: 6시간마다 (00:00, 06:00, 12:00, 18:00)</li>
            <li>🟣 Confluence: 6시간마다 (01:00, 07:00, 13:00, 19:00)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
