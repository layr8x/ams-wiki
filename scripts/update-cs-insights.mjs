#!/usr/bin/env node
/**
 * scripts/update-cs-insights.mjs
 *
 * classify-kakao-csv.mjs 가 생성한 summary.json 을 기반으로
 * src/data/csInsights.js 의 CUSTOMER_CATEGORIES 통계를 갱신.
 *
 * ─── 사용 ───────────────────────────────────────────────────────────────
 *   node scripts/update-cs-insights.mjs <summary.json> [--dry-run]
 *
 * ─── 안전 장치 ───────────────────────────────────────────────────────────
 *   - --dry-run 로 변경 사항만 출력, 파일 미수정
 *   - 기존 메타데이터(label, wikiMapping, actionableType 등)는 보존
 *   - 통계 필드(count, share, negativeRate)만 갱신
 *   - 카테고리 ID 매칭 실패 시 경고만 출력
 */

import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TARGET = resolve(ROOT, 'src/data/csInsights.js')

// ─── CLI ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const summaryPath = args.find(a => !a.startsWith('--'))

if (!summaryPath) {
  console.error('사용: node scripts/update-cs-insights.mjs <summary.json> [--dry-run]')
  process.exit(1)
}

// ─── 로딩 ───────────────────────────────────────────────────────────────
const summaryRaw = await readFile(resolve(summaryPath), 'utf8')
const summary = JSON.parse(summaryRaw)
const targetRaw = await readFile(TARGET, 'utf8')

console.log(`[update-insights] summary:  ${summaryPath}`)
console.log(`[update-insights] target:   ${TARGET}`)
console.log(`[update-insights] mode:     ${dryRun ? 'dry-run (변경 없음)' : 'write'}`)
console.log()

// ─── 통계 갱신 ──────────────────────────────────────────────────────────
let updated = targetRaw
const changes = []

for (const cat of summary.categoriesSorted || []) {
  // 정규식: { ... id: 'category-id' ... count: <num>, share: <num>, negativeRate: <num> ... }
  // 한 객체가 여러 줄에 걸쳐 있으므로 멀티라인 + non-greedy
  const blockRe = new RegExp(
    `(\\{\\s*[\\s\\S]*?id:\\s*['"]${cat.id}['"][\\s\\S]*?\\})`,
    'm'
  )
  const m = updated.match(blockRe)
  if (!m) {
    console.warn(`  ⚠️  ID '${cat.id}' 카테고리 객체를 찾지 못했습니다 — skip`)
    continue
  }

  let block = m[0]
  const before = block

  // 각 필드 개별 치환 (값만 갱신, 구조 유지)
  block = block.replace(/(count:\s*)\d+/, `$1${cat.count}`)
  block = block.replace(/(share:\s*)[\d.]+/, `$1${cat.share}`)
  block = block.replace(/(negativeRate:\s*)[\d.]+/, `$1${cat.negativeRate}`)

  if (before === block) {
    console.log(`  − ${cat.label.padEnd(15)} 변경 없음`)
  } else {
    updated = updated.replace(before, block)
    changes.push({ id: cat.id, label: cat.label, count: cat.count, share: cat.share, negativeRate: cat.negativeRate })
    console.log(`  ✓ ${cat.label.padEnd(15)} count=${cat.count}, share=${cat.share}%, neg=${cat.negativeRate}%`)
  }
}

console.log()
console.log(`[update-insights] 변경 카테고리: ${changes.length}건`)

if (!dryRun && changes.length > 0) {
  await writeFile(TARGET, updated, 'utf8')
  console.log(`[update-insights] ✅ ${TARGET} 갱신 완료`)
  console.log(`   → 다음: npm run db:seed (선택, supabase 시드 재생성)`)
} else if (dryRun) {
  console.log('[update-insights] dry-run 모드 — 파일 미변경')
}
