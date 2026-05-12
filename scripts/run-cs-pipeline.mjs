#!/usr/bin/env node
/**
 * scripts/run-cs-pipeline.mjs
 *
 * end-to-end CS 분석 파이프라인:
 *   1) data/kakao-chats-{TODAY}.csv 의 가장 최신 파일 탐지
 *   2) classify-kakao-csv.mjs 로 12 카테고리 분류
 *   3) update-cs-insights.mjs 로 src/data/csInsights.js 자동 갱신
 *   4) npm run db:seed 로 supabase seed 재생성 (선택)
 *
 * sync-kakao-chats.mjs 가 먼저 실행되어 CSV 가 존재해야 함.
 *
 * ─── 사용 ───────────────────────────────────────────────────────────────
 *   npm run cs-pipeline       (sync 후 자동 실행)
 *   node scripts/run-cs-pipeline.mjs           (수집 후 분류만)
 *   node scripts/run-cs-pipeline.mjs --csv data/kakao-chats-2026-05-12.csv
 *   node scripts/run-cs-pipeline.mjs --skip-seed     (seed 재생성 생략)
 *   node scripts/run-cs-pipeline.mjs --dry-run        (변경 없이 dry-run)
 */

import { readdir, stat } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DATA_DIR = resolve(ROOT, 'data')

// ─── CLI ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const csvIdx = args.indexOf('--csv')
const customCsv = csvIdx >= 0 ? args[csvIdx + 1] : null
const skipSeed = args.includes('--skip-seed')
const dryRun = args.includes('--dry-run')

// ─── 가장 최신 CSV 탐지 ──────────────────────────────────────────────────
async function findLatestCSV() {
  if (customCsv) return resolve(customCsv)
  let entries = []
  try { entries = await readdir(DATA_DIR) } catch {
    console.error(`❌ ${DATA_DIR} 디렉토리가 없습니다. 먼저 npm run sync:kakao-chats 를 실행하세요.`)
    process.exit(1)
  }
  const candidates = entries.filter(f => /^kakao-chats-.*\.csv$/.test(f) && !f.includes('classified'))
  if (candidates.length === 0) {
    console.error(`❌ ${DATA_DIR} 에 kakao-chats-*.csv 파일이 없습니다.`)
    process.exit(1)
  }
  const withTime = await Promise.all(candidates.map(async f => {
    const full = join(DATA_DIR, f)
    const s = await stat(full)
    return { full, mtime: s.mtimeMs }
  }))
  withTime.sort((a, b) => b.mtime - a.mtime)
  return withTime[0].full
}

// ─── 단계 실행 헬퍼 ──────────────────────────────────────────────────────
function step(label, cmd, args) {
  console.log()
  console.log(`▶ ${label}`)
  console.log(`  $ ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: ROOT })
  if (r.status !== 0) {
    console.error(`✖ ${label} 실패 (exit ${r.status})`)
    process.exit(r.status || 1)
  }
}

// ─── 메인 ───────────────────────────────────────────────────────────────
const csv = await findLatestCSV()
const summary = csv.replace(/\.csv$/, '-summary.json')
const classified = csv.replace(/\.csv$/, '-classified.csv')

console.log('=== CS 분석 파이프라인 ===')
console.log(`입력 CSV:   ${csv}`)
console.log(`분류 결과:  ${classified}`)
console.log(`요약 통계:  ${summary}`)
console.log(`모드:       ${dryRun ? 'dry-run' : 'write'}`)

step('1/3  카테고리 분류 (classify-kakao-csv.mjs)',
  'node', ['scripts/classify-kakao-csv.mjs', csv, '--output', classified, '--summary', summary])

step('2/3  csInsights.js 자동 갱신 (update-cs-insights.mjs)',
  'node', ['scripts/update-cs-insights.mjs', summary, ...(dryRun ? ['--dry-run'] : [])])

if (skipSeed || dryRun) {
  console.log('\n3/3  Supabase seed 재생성 — skipped')
} else {
  step('3/3  Supabase seed 재생성 (npm run db:seed)', 'npm', ['run', 'db:seed'])
}

console.log()
console.log('✅ CS 파이프라인 완료')
console.log(`   - 분류 CSV:    ${classified}`)
console.log(`   - 요약 JSON:   ${summary}`)
if (!dryRun) console.log('   - 위키 데이터: src/data/csInsights.js 갱신됨')
