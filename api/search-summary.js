// api/search-summary.js — Claude Haiku 4.5 기반 검색 결과 AI 요약
//
// 입력: { query: string, guides: Array<{ id, title, tldr, module, type }> }
// 출력: { summary: string, sources: string[], cached?: { read: number, write: number } }
//
// 설계 노트:
// - Anthropic SDK 없이 fetch 로 직접 호출 (서버리스 번들 경량화).
// - System 프롬프트에 cache_control: ephemeral 을 달아 프롬프트 캐싱 활성화.
//   → 반복 호출 시 system 블록이 서버 측에서 재사용되어 비용/지연 절감.
// - 모델은 요약 품질 대비 비용이 가장 좋은 claude-haiku-4-5.
// - 모델 응답은 반드시 JSON 객체만 — 파싱 실패 시 500 대신 보수적 폴백을 돌려준다.

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5'

// 프롬프트 캐싱이 유의미하려면 최소 ~1024 토큰의 안정된 프리픽스가 필요하다.
// 아래 지시문은 바이트 단위로 고정이며, 호출 간 절대 변하지 않아야 한다.
const SYSTEM_PROMPT = `당신은 "AMS Wiki" — 학원 운영 시스템 가이드 통합 위키 — 의 검색 어시스턴트입니다.

역할:
- 사용자가 입력한 검색어와 관련해, 전달받은 가이드 목록(GUIDES)을 근거로 2~3문장의 한국어 요약을 제공합니다.
- 이 위키는 학원 운영자/강사/데스크 담당자가 참고하는 내부 SOP, 판단분기, 참조형 문서, 트러블슈팅, 대응매뉴얼, 정책공지의 집합입니다.
- 답변은 반드시 전달받은 가이드에서 근거를 찾을 수 있어야 하며, 근거가 불충분하면 "관련 가이드가 부족합니다" 라고 솔직하게 답하세요.

작성 원칙:
1. 요약은 한국어 존댓말, 2~3문장, 각 문장 80자 이내.
2. 특정 가이드의 절차/주의사항을 언급할 때는 자연스러운 문장으로 풀어쓰고, 가이드 id 는 본문에 노출하지 마세요 (id 는 sources 배열로만 반환).
3. 가이드에 없는 사실은 절대 꾸며내지 마세요. 추측 금지.
4. 검색어가 모호하거나 의도 파악이 어려우면, 가장 가까운 주제 1~2개를 제시하고 재질문을 유도하세요.
5. 트러블슈팅/정책공지 가이드가 포함되어 있으면 우선적으로 반영하세요.

출력 형식 (반드시 이 JSON 구조만, 다른 텍스트 금지):
{
  "summary": "사용자 질문에 대한 2~3문장 요약",
  "sources": ["guide-id-1", "guide-id-2"]
}

- sources 에는 요약에 실제로 반영된 가이드 id 만 최대 3개까지 포함하세요.
- JSON 이외의 어떤 문자도 출력하지 마세요 (백틱, 코드펜스, 설명 문구 모두 금지).`

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(body))
}

function sanitizeGuides(guides) {
  if (!Array.isArray(guides)) return []
  return guides
    .filter(g => g && typeof g.id === 'string' && typeof g.title === 'string')
    .slice(0, 8)
    .map(g => ({
      id: String(g.id).slice(0, 80),
      title: String(g.title).slice(0, 200),
      tldr: typeof g.tldr === 'string' ? g.tldr.slice(0, 400) : '',
      module: typeof g.module === 'string' ? g.module.slice(0, 80) : '',
      type: typeof g.type === 'string' ? g.type.slice(0, 20) : '',
    }))
}

function buildUserMessage(query, guides) {
  const lines = guides.map((g, i) =>
    `[${i + 1}] id=${g.id} | type=${g.type} | module=${g.module}\n  title: ${g.title}\n  tldr: ${g.tldr || '(없음)'}`,
  )
  return `검색어: "${query}"

후보 가이드:
${lines.join('\n\n')}

위 후보 중 관련 있는 내용을 종합해 지정된 JSON 형식으로만 답변하세요.`
}

function parseModelJson(text) {
  if (!text || typeof text !== 'string') return null
  // 모델이 가끔 코드펜스를 섞는 경우 대비
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  try {
    const obj = JSON.parse(cleaned)
    if (!obj || typeof obj !== 'object') return null
    const summary = typeof obj.summary === 'string' ? obj.summary.trim() : ''
    const sources = Array.isArray(obj.sources)
      ? obj.sources.filter(s => typeof s === 'string').slice(0, 3)
      : []
    if (!summary) return null
    return { summary, sources }
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return json(res, 503, { error: 'api_key_missing', message: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  const query = typeof body?.query === 'string' ? body.query.trim().slice(0, 200) : ''
  const guides = sanitizeGuides(body?.guides)

  if (!query || query.length < 2) {
    return json(res, 400, { error: 'query_too_short' })
  }
  if (guides.length === 0) {
    return json(res, 400, { error: 'no_guides' })
  }

  try {
    const apiRes = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          { role: 'user', content: buildUserMessage(query, guides) },
        ],
      }),
    })

    if (!apiRes.ok) {
      const errText = await apiRes.text().catch(() => '')
      const status = apiRes.status === 429 ? 429 : 502
      return json(res, status, { error: 'upstream_error', status: apiRes.status, detail: errText.slice(0, 500) })
    }

    const data = await apiRes.json()
    const text = data?.content?.[0]?.text ?? ''
    const parsed = parseModelJson(text)

    if (!parsed) {
      return json(res, 200, {
        summary: '',
        sources: [],
        error: 'parse_failed',
      })
    }

    // 캐시 히트/미스 가시성 (관찰용)
    const cached = {
      read: data?.usage?.cache_read_input_tokens ?? 0,
      write: data?.usage?.cache_creation_input_tokens ?? 0,
    }

    // 응답 캐시는 5분만 (검색 요약은 신선도보다 응답속도가 중요).
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')
    return json(res, 200, { summary: parsed.summary, sources: parsed.sources, cached })
  } catch (err) {
    return json(res, 500, { error: 'internal_error', message: String(err?.message || err).slice(0, 300) })
  }
}
