-- Sync Logs Table
-- Cron Job 실행 기록 추적

CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('jira', 'confluence')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  message TEXT,
  issue_count INTEGER DEFAULT 0,
  page_count INTEGER DEFAULT 0,
  error_message TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_sync_logs_provider ON sync_logs(provider);
CREATE INDEX idx_sync_logs_synced_at ON sync_logs(synced_at DESC);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);

-- 최근 30일 데이터만 유지 (자동 정리)
CREATE OR REPLACE FUNCTION cleanup_old_sync_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM sync_logs
  WHERE synced_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- 트리거: 매일 자정에 정리
-- (실제로는 pg_cron 확장 필요 - Supabase Free는 미지원이므로 수동 실행 권장)
