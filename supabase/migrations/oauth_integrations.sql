-- OAuth Integration for Jira/Confluence
-- 사용자별 OAuth 토큰 및 통합 설정 저장

CREATE TABLE IF NOT EXISTS oauth_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('jira', 'confluence')),

  -- OAuth 2.0 토큰
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,

  -- Atlassian 사용자 정보
  atlassian_user_id TEXT NOT NULL,
  atlassian_email TEXT NOT NULL,
  atlassian_display_name TEXT,

  -- 인스턴스 정보
  cloud_id TEXT NOT NULL, -- Atlassian Cloud ID
  site_url TEXT, -- Jira/Confluence 인스턴스 URL (옵션)

  -- 메타데이터
  scope TEXT, -- 허용된 권한 범위
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,

  -- 중복 방지 (사용자 + 제공자 + 클라우드 ID)
  UNIQUE(user_id, provider, cloud_id)
);

-- 인덱스
CREATE INDEX idx_oauth_integrations_user_id ON oauth_integrations(user_id);
CREATE INDEX idx_oauth_integrations_provider ON oauth_integrations(provider);
CREATE INDEX idx_oauth_integrations_atlassian_user ON oauth_integrations(atlassian_user_id);

-- OAuth 상태/PKCE 저장소 (단기용)
CREATE TABLE IF NOT EXISTS oauth_state (
  state TEXT PRIMARY KEY,
  code_challenge TEXT NOT NULL, -- PKCE code_challenge
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 minutes',
  user_id UUID, -- 선택적: 로그인한 사용자 ID
  provider TEXT NOT NULL CHECK (provider IN ('jira', 'confluence'))
);

CREATE INDEX idx_oauth_state_expires ON oauth_state(expires_at);

-- RLS (Row Level Security)
ALTER TABLE oauth_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_state ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 통합만 조회/수정 가능
CREATE POLICY "Users can view their own integrations"
  ON oauth_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations"
  ON oauth_integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations"
  ON oauth_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- 상태 토큰은 서버에서만 조회/삽입
CREATE POLICY "OAuth state is service-only"
  ON oauth_state FOR SELECT
  USING (FALSE);
