#!/usr/bin/env node
// scripts/sync-confluence.mjs
//
// Confluence 루트 페이지(env.CONFLUENCE_ROOT_PAGE_ID) 하위 트리를 수집해
// src/data/confluence.generated.json 으로 떨어뜨린다.
// 앱은 이 JSON 을 런타임에 읽어 mockData 와 병합 · 덮어쓴다.
//
// 환경변수 (.env.local):
//   CONFLUENCE_EMAIL
//   CONFLUENCE_TOKEN
//   CONFLUENCE_DOMAIN       (기본 hiconsy.atlassian.net)
//   CONFLUENCE_SPACE_KEY    (기본 FVSOL)
//   CONFLUENCE_ROOT_PAGE_ID (기본 1378910256)
//
// 사용:
//   pnpm run sync:confluence
//
// 주의: 토큰은 .env.local 에만 두고 절대 커밋하지 말 것.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ─── .env.local 파싱 (dotenv 의존성 없이 간단 파싱) ──────────────────────
async function loadEnv() {
  try {
    const raw = await readFile(resolve(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!m) continue
      const [, k, v] = m
      if (!process.env[k]) process.env[k] = v.replace(/^["']|["']$/g, '')
    }
  } catch { /* .env.local 없음 — 환경변수로만 구동 */ }
}

await loadEnv()

const EMAIL    = process.env.CONFLUENCE_EMAIL
const TOKEN    = process.env.CONFLUENCE_TOKEN
const DOMAIN   = process.env.CONFLUENCE_DOMAIN       || 'hiconsy.atlassian.net'
const SPACE    = process.env.CONFLUENCE_SPACE_KEY    || 'FVSOL'
const ROOT_ID  = process.env.CONFLUENCE_ROOT_PAGE_ID || '1378910256'
const OUT_PATH = resolve(ROOT, 'src/data/confluence.generated.json')

if (!EMAIL || !TOKEN) {
  console.error('[sync-confluence] CONFLUENCE_EMAIL / CONFLUENCE_TOKEN 미설정. .env.local 확인.')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64')
const BASE = `https://${DOMAIN}/wiki/api/v2`

async function cfetch(path) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json' },
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Confluence ${res.status} ${res.statusText} @ ${url}\n${txt.slice(0, 300)}`)
  }
  return res.json()
}

// ─── 페이지 트리 재귀 수집 ──────────────────────────────────────────────
async function collectTree(pageId, depth = 0, max = 4) {
  const page = await cfetch(`/pages/${pageId}?body-format=atlas_doc_format`)
  const node = {
    id:        page.id,
    parentId:  page.parentId ?? null,
    title:     page.title,
    status:    page.status,
    version:   page.version?.number,
    updatedAt: page.version?.createdAt,
    authorId:  page.authorId,
    // ADF(JSON) — 앱에서 구조 기반 렌더 가능
    body:      page.body?.atlas_doc_format?.value ?? null,
    children:  [],
  }
  if (depth < max) {
    const { results = [] } = await cfetch(
      `/pages/${pageId}/children/page?limit=100&status=current`
    ).catch(() => ({ results: [] }))
    for (const c of results) {
      node.children.push(await collectTree(c.id, depth + 1, max))
    }
  }
  return node
}

async function main() {
  console.log(`[sync-confluence] root=${ROOT_ID} space=${SPACE} domain=${DOMAIN}`)
  const tree = await collectTree(ROOT_ID)
  await mkdir(dirname(OUT_PATH), { recursive: true })
  const payload = {
    generatedAt: new Date().toISOString(),
    domain:  DOMAIN,
    space:   SPACE,
    rootId:  ROOT_ID,
    tree,
  }
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2), 'utf8')
  const count = countNodes(tree)
  console.log(`[sync-confluence] OK — ${count} page(s) → ${OUT_PATH}`)
}

function countNodes(node) {
  return 1 + (node.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0)
}

main().catch(err => {
  console.error('[sync-confluence] 실패:', err.message)
  process.exit(1)
})
