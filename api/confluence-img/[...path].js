// api/confluence-img/[...path].js
// Vercel Serverless Function — Confluence 첨부 이미지 proxy.
// 브라우저에서 직접 Atlassian REST에 Basic auth를 노출할 수 없으므로
// 서버 사이드 프록시를 두어 prod 환경에서도 이미지를 안전하게 스트리밍한다.
//
// 사용법 (프론트엔드):
//   /api/confluence-img/wiki/download/attachments/<pageId>/<file>?version=1&api=v2
//
// 필수 환경 변수 (Vercel Project Settings → Environment Variables):
//   CONFLUENCE_EMAIL, CONFLUENCE_TOKEN
// 선택:
//   CONFLUENCE_DOMAIN (기본 hiconsy.atlassian.net)
//
// 로컬 개발은 vite.config.js 의 /api/confluence-img dev proxy 경유.

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { path, ...restQuery } = req.query
  const pathStr = Array.isArray(path) ? path.join('/') : (path || '')
  if (!pathStr) {
    res.status(400).json({ error: 'Missing path' })
    return
  }

  // 보안: Atlassian 외부로 벗어나는 경로 차단 (e.g. `/../`, scheme 주입)
  if (pathStr.includes('..') || pathStr.startsWith('/')) {
    res.status(400).json({ error: 'Invalid path' })
    return
  }

  const email  = process.env.CONFLUENCE_EMAIL  || process.env.VITE_CONFLUENCE_EMAIL
  const token  = process.env.CONFLUENCE_TOKEN  || process.env.VITE_CONFLUENCE_TOKEN
  const domain = process.env.CONFLUENCE_DOMAIN || process.env.VITE_CONFLUENCE_DOMAIN || 'hiconsy.atlassian.net'

  if (!email || !token) {
    res.status(503).json({ error: 'Confluence credentials not configured' })
    return
  }

  const qs = new URLSearchParams(restQuery).toString()
  const upstreamUrl = `https://${domain}/${pathStr}${qs ? '?' + qs : ''}`
  const auth = Buffer.from(`${email}:${token}`).toString('base64')

  let upstream
  try {
    upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: { Authorization: `Basic ${auth}`, Accept: 'image/*' },
    })
  } catch {
    res.status(502).json({ error: 'Upstream fetch failed' })
    return
  }

  if (!upstream.ok) {
    res.status(upstream.status).json({ error: `Upstream ${upstream.status}` })
    return
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
  if (!/^image\//i.test(contentType)) {
    // Atlassian 로그인 페이지(HTML) 응답 등을 이미지로 오인하지 않도록 방어
    res.status(415).json({ error: `Unexpected content-type: ${contentType}` })
    return
  }

  res.setHeader('Content-Type', contentType)
  // 첨부 이미지는 version 파라미터로 영속적 — 공격적 CDN 캐시
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  if (req.method === 'HEAD') { res.status(200).end(); return }

  const buf = Buffer.from(await upstream.arrayBuffer())
  res.status(200).send(buf)
}
