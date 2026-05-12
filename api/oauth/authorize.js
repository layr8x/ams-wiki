// api/oauth/authorize.js
// Atlassian OAuth 인증 흐름 시작
// PKCE (RFC 7636) 사용으로 보안 강화

import crypto from 'crypto'

const ATLASSIAN_AUTH_URL = 'https://auth.atlassian.com/authorize'
const CLIENT_ID = process.env.ATLASSIAN_OAUTH_CLIENT_ID
const REDIRECT_URI = process.env.ATLASSIAN_OAUTH_REDIRECT_URI

// 환경변수 검증
if (!CLIENT_ID || !REDIRECT_URI) {
  console.error('Missing ATLASSIAN_OAUTH_CLIENT_ID or ATLASSIAN_OAUTH_REDIRECT_URI')
}

// PKCE: code_challenge 생성
function generateCodeChallenge() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')
  return { codeVerifier, codeChallenge }
}

// 상태 토큰: CSRF 방어
function generateState() {
  return crypto.randomBytes(24).toString('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { provider } = req.body
  if (!['jira', 'confluence'].includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider' })
  }

  if (!CLIENT_ID || !REDIRECT_URI) {
    return res.status(503).json({ error: 'OAuth not configured' })
  }

  const state = generateState()
  const { codeVerifier, codeChallenge } = generateCodeChallenge()

  // 상태 + PKCE verifier를 세션/쿠키에 저장
  // 실제 운영: Redis/Memcache 에 저장 권장
  res.setHeader('Set-Cookie', [
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `oauth_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ])

  // 스코프: Jira와 Confluence 공통
  const scope = [
    'read:jira-work',
    'read:confluence-content.summary',
    'write:confluence-content',
    'manage:confluence-attachment',
  ].join(' ')

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256', // SHA256
    prompt: 'consent', // 항상 동의 화면 표시
  })

  const authUrl = `${ATLASSIAN_AUTH_URL}?${params.toString()}`

  res.status(200).json({ authUrl, state })
}
