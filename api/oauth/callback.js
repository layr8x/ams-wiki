// api/oauth/callback.js
// Atlassian OAuth 콜백 핸들러
// 인증코드를 액세스토큰으로 교환 및 사용자 정보 저장

import { createClient } from '@supabase/supabase-js'

const ATLASSIAN_TOKEN_URL = 'https://auth.atlassian.com/oauth/token'
const ATLASSIAN_API_URL = 'https://api.atlassian.com'
const CLIENT_ID = process.env.ATLASSIAN_OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.ATLASSIAN_OAUTH_CLIENT_SECRET
const REDIRECT_URI = process.env.ATLASSIAN_OAUTH_REDIRECT_URI

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getAccessToken(code, codeVerifier) {
  const response = await fetch(ATLASSIAN_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Token exchange failed: ${error.error_description || error.error}`)
  }

  return response.json()
}

// Atlassian 사용자 정보 조회
async function getUserInfo(accessToken) {
  const response = await fetch(`${ATLASSIAN_API_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  return response.json()
}

// 사용자의 모든 클라우드 사이트 조회
async function getAccessibleResources(accessToken) {
  const response = await fetch(`${ATLASSIAN_API_URL}/oauth/token/accessible-resources`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch accessible resources')
  }

  return response.json()
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, state } = req.query
  const { oauth_state: savedState = '', oauth_verifier: codeVerifier = '' } = req.cookies

  // 1) CSRF 검증 (state)
  if (!state || state !== savedState) {
    return res.status(400).json({ error: 'Invalid state token' })
  }

  // 2) PKCE code_verifier 검증
  if (!codeVerifier) {
    return res.status(400).json({ error: 'Missing code verifier' })
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' })
  }

  try {
    // 3) 토큰 교환
    const tokenData = await getAccessToken(code, codeVerifier)
    const { access_token, refresh_token, expires_in } = tokenData

    // 4) 사용자 정보 조회
    const userInfo = await getUserInfo(access_token)
    const resources = await getAccessibleResources(access_token)

    if (!Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({ error: 'No accessible Atlassian resources' })
    }

    // 5) 현재 세션 사용자 ID 추출 (JWT에서)
    // Vercel의 요청에는 보통 Authorization 헤더가 없으므로 쿠키 기반 인증 필요
    // 여기서는 간소화를 위해 사용자가 이미 로그인되었다고 가정
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // JWT 토큰에서 사용자 ID 추출 (Supabase JWT)
    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: jwtError } = await supabase.auth.getUser(token)

    if (jwtError || !userData?.user?.id) {
      return res.status(401).json({ error: 'Invalid authentication' })
    }

    const userId = userData.user.id

    // 6) OAuth 통합 저장
    // 각 클라우드 사이트마다 레코드 생성
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString()

    for (const resource of resources) {
      const { cloud_id, url, name } = resource

      // Jira와 Confluence 둘 다 지원 (provider는 나중에 필터링)
      const providers = ['jira', 'confluence']

      for (const provider of providers) {
        const { error } = await supabase.from('oauth_integrations').upsert({
          user_id: userId,
          provider,
          access_token,
          refresh_token: refresh_token || null,
          token_type: 'Bearer',
          expires_at: expiresAt,
          atlassian_user_id: userInfo.account_id,
          atlassian_email: userInfo.email,
          atlassian_display_name: userInfo.name,
          cloud_id,
          site_url: url,
          scope: [
            'read:jira-work',
            'read:confluence-content.summary',
            'write:confluence-content',
            'manage:confluence-attachment',
          ].join(' '),
        }, {
          onConflict: 'user_id,provider,cloud_id',
        })

        if (error) {
          console.error(`Failed to save ${provider} integration:`, error)
        }
      }
    }

    // 7) 쿠키 정리 및 클라이언트로 리다이렉트
    res.setHeader('Set-Cookie', [
      'oauth_state=; Max-Age=0',
      'oauth_verifier=; Max-Age=0',
    ])

    // 프론트엔드의 설정 페이지로 리다이렉트
    res.redirect(302, '/settings?oauth=success')
  } catch (err) {
    console.error('OAuth callback error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}
