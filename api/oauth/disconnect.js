// api/oauth/disconnect.js
// OAuth 통합 연결 해제

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { provider, cloudId } = req.body

  // 인증 확인
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: jwtError } = await supabase.auth.getUser(token)

    if (jwtError || !userData?.user?.id) {
      return res.status(401).json({ error: 'Invalid authentication' })
    }

    const userId = userData.user.id

    // OAuth 통합 삭제
    const { error } = await supabase
      .from('oauth_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider)
      .eq('cloud_id', cloudId)

    if (error) {
      throw error
    }

    res.status(200).json({ success: true, message: 'Integration disconnected' })
  } catch (err) {
    console.error('Disconnect error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}
