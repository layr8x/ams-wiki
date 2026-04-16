#!/usr/bin/env node
// supabase/generate-seed.mjs
// mockData.js의 GUIDES 객체를 읽어 PostgreSQL INSERT 문을 생성합니다.
// 실행: node supabase/generate-seed.mjs > supabase/seed.sql

import { GUIDES, RECENT_GUIDES } from '../src/data/mockData.js'
import fs from 'node:fs'

// ─── SQL 안전 이스케이프 ─────────────────────────────────────────────────────
const esc = (v) => {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return `'${String(v).replace(/'/g, "''")}'`
}

const escArr = (arr) => {
  if (!arr || !arr.length) return 'NULL'
  const items = arr.map(a => `"${String(a).replace(/"/g, '\\"').replace(/'/g, "''")}"`).join(',')
  return `'{${items}}'`
}

const escJson = (obj) => {
  if (!obj) return 'NULL'
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`
}

// ─── RECENT_GUIDES에서 views/helpful 매핑 ───────────────────────────────────
const recentMap = Object.fromEntries(
  RECENT_GUIDES.map(r => [r.id, { views: r.views, helpful: r.helpful, version: r.version, author: r.author, tags: r.tags }])
)

// ─── 헤더 ────────────────────────────────────────────────────────────────────
const out = []
out.push(`-- AMS Wiki 시드 데이터 (mockData.js 기반 자동 생성)`)
out.push(`-- 생성일: ${new Date().toISOString()}`)
out.push(`-- 실행: Supabase SQL Editor에서 schema.sql 실행 후 이 파일 실행\n`)

out.push(`-- 기존 데이터 제거 (선택)`)
out.push(`-- DELETE FROM guides;\n`)

// ─── 각 가이드 INSERT ────────────────────────────────────────────────────────
for (const [id, g] of Object.entries(GUIDES)) {
  const meta = recentMap[id] || {}
  const updated = g.updated ? new Date(g.updated).toISOString() : new Date().toISOString()

  const fields = [
    ['id',              esc(id)],
    ['type',            esc(g.type)],
    ['module',          esc(g.module)],
    ['title',           esc(g.title)],
    ['tldr',            esc(g.tldr)],
    ['path',            esc(g.path)],
    ['ams_url',         esc(g.amsUrl)],
    ['confluence_id',   esc(g.confluenceId)],
    ['confluence_url',  esc(g.confluenceUrl)],
    ['targets',         escArr(g.targets)],
    ['tags',            escArr(meta.tags || g.tags)],
    ['author',          esc(g.author || meta.author || '플랫폼서비스실')],
    ['version',         esc(g.version || meta.version || 'v1.0')],
    ['status',          esc('published')],
    ['views',           esc(g.views || meta.views || 0)],
    ['helpful',         esc(g.helpful || meta.helpful || 0)],
    ['helpful_rate',    esc(g.helpfulRate || 0)],
    ['steps',           escJson(g.steps)],
    ['main_items_table',escJson(g.mainItemsTable)],
    ['cases',           escJson(g.cases)],
    ['cautions',        escArr(g.cautions)],
    ['trouble_table',   escJson(g.troubleTable)],
    ['responses',       escJson(g.responses)],
    ['decision_table',  escJson(g.decisionTable)],
    ['reference_data',  escJson(g.referenceData)],
    ['policy_diff',     escJson(g.policyDiff)],
    ['updated_at',      esc(updated)],
  ]

  const cols = fields.map(([k]) => k).join(', ')
  const vals = fields.map(([, v]) => v).join(', ')

  out.push(`-- ${g.title}`)
  out.push(`INSERT INTO guides (${cols}) VALUES (${vals})`)
  out.push(`ON CONFLICT (id) DO UPDATE SET`)
  out.push(`  type=EXCLUDED.type, module=EXCLUDED.module, title=EXCLUDED.title,`)
  out.push(`  tldr=EXCLUDED.tldr, path=EXCLUDED.path, ams_url=EXCLUDED.ams_url,`)
  out.push(`  confluence_id=EXCLUDED.confluence_id, confluence_url=EXCLUDED.confluence_url,`)
  out.push(`  targets=EXCLUDED.targets, tags=EXCLUDED.tags, author=EXCLUDED.author,`)
  out.push(`  version=EXCLUDED.version, status=EXCLUDED.status,`)
  out.push(`  views=EXCLUDED.views, helpful=EXCLUDED.helpful, helpful_rate=EXCLUDED.helpful_rate,`)
  out.push(`  steps=EXCLUDED.steps, main_items_table=EXCLUDED.main_items_table,`)
  out.push(`  cases=EXCLUDED.cases, cautions=EXCLUDED.cautions,`)
  out.push(`  trouble_table=EXCLUDED.trouble_table, responses=EXCLUDED.responses,`)
  out.push(`  decision_table=EXCLUDED.decision_table, reference_data=EXCLUDED.reference_data,`)
  out.push(`  policy_diff=EXCLUDED.policy_diff, updated_at=EXCLUDED.updated_at;\n`)
}

out.push(`-- 완료: ${Object.keys(GUIDES).length}개 가이드 적재`)

// ─── 파일 기록 ────────────────────────────────────────────────────────────────
const content = out.join('\n')
const target = new URL('./seed.sql', import.meta.url).pathname
fs.writeFileSync(target, content)
console.error(`✓ ${target} 생성 완료 (${Object.keys(GUIDES).length}개 가이드)`)
