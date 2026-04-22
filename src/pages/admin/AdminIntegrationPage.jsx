// src/pages/admin/AdminIntegrationPage.jsx
// 관리자 페이지: Jira/Confluence OAuth 설정

import { JiraConfluenceSettings } from '@/components/integrations/JiraConfluenceSettings'
import { SyncMonitor } from '@/components/admin/SyncMonitor'

export default function AdminIntegrationPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">🔗 외부 연동</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Jira, Confluence 등 외부 서비스와 안전하게 연동합니다.
        </p>
      </header>

      {/* Jira/Confluence 설정 */}
      <section>
        <JiraConfluenceSettings />
      </section>

      {/* Cron 동기화 모니터 */}
      <section>
        <SyncMonitor />
      </section>
    </div>
  )
}
