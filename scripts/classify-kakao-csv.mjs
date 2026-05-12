#!/usr/bin/env node
/**
 * scripts/classify-kakao-csv.mjs
 *
 * sync-kakao-chats.mjs 가 생성한 CSV 를 12개 카테고리로 분류.
 * analyze.py 의 CATEGORY_RULES 를 JS 로 포팅하여 Python 의존성 제거.
 *
 * ─── 사용 ───────────────────────────────────────────────────────────────
 *   node scripts/classify-kakao-csv.mjs <input.csv> [--output <out.csv>] [--summary <summary.json>]
 *
 *   기본 출력:
 *     - <input>-classified.csv   (각 메시지에 카테고리·감정 컬럼 추가)
 *     - <input>-summary.json     (카테고리별 통계)
 *
 * ─── 환경변수 ───────────────────────────────────────────────────────────
 *   (없음 — CLI 인자만 사용)
 */

import { readFile, writeFile } from 'node:fs/promises'
import { resolve, basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

// ─── 분류 룰셋 (analyze.py 의 CATEGORY_RULES 포팅) ──────────────────────
// 우선순위 = 배열 순서 (앞의 카테고리가 먼저 매칭)
export const CATEGORY_RULES = [
  { id: 'video-content',   label: '영상재생/콘텐츠',
    keywords: ['영상', '재생', 'VOD', '동영상', '복습', '버퍼링', '스트리밍', '플레이', '안 나와', '안나와', '끊김', '로딩'] },
  { id: 'school-link',     label: '학원등록연동',
    keywords: ['연동', '학원 등록', '학원등록', '연결', '인증코드', '학원 정보', '연결이 안'] },
  { id: 'qr-attendance',   label: 'QR/출석',
    keywords: ['QR', '큐알', '출석', '출결', '체크', '인식', '카메라', '출석부'] },
  { id: 'parent-account',  label: '학부모/계정통합',
    keywords: ['학부모', '계정', '통합', '병합', '아이디', '로그인', '회원가입', '본인인증', 'PASS', '인증번호'] },
  { id: 'refund-payment',  label: '환불/결제',
    keywords: ['환불', '결제', '카드', '취소', '청구', '수강료', '납부', '가상계좌', '신한', '중복결제', '승인'] },
  { id: 'enrollment',      label: '수강신청/대기',
    keywords: ['수강신청', '신청', '대기', '예약', '접수', '등록'] },
  { id: 'app-access',      label: '앱 접근/실행',
    keywords: ['앱', '실행', '진입', '접속', '안 들어가', '안들어가'] },
  { id: 'login-auth',      label: '로그인/인증',
    keywords: ['비밀번호', '비번', '아이디 찾기', 'OTP', '로그아웃'] },
  { id: 'app-bug',         label: '앱 버그/오류',
    keywords: ['오류', '에러', '버그', '먹통', '튕김', '튕겨', '안됨', '작동 안'] },
  { id: 'textbook-delivery', label: '교재/배송',
    keywords: ['교재', '배송', '배부', '책', '도착', '받지 못', '미수령'] },
  { id: 'class-info',      label: '강좌/수업 정보',
    keywords: ['강좌', '수업', '시간표', '강사', '강의실', '커리큘럼'] },
  // misc 는 마지막 폴백
]

// ─── 감정 키워드 사전 ──────────────────────────────────────────────────
export const NEGATIVE_KEYWORDS = [
  '화나', '짜증', '답답', '실망', '불만', '컴플', '컴플레인', '항의',
  '안돼', '안 돼', '안됨', '왜 안', '도대체', '제발', '망',
  'ㅠ', 'ㅜ', '아니', '진짜', '도저히',
]
export const POSITIVE_KEYWORDS = [
  '감사', '고맙', '좋아요', '확인', '해결', '잘 됐', '잘됐', '👍', 'ㅎㅎ',
]

// ─── 분류 함수 ──────────────────────────────────────────────────────────
export function classifyMessage(text) {
  if (!text || typeof text !== 'string') {
    return { category: 'misc', categoryLabel: '기타', sentiment: 'neutral', sentimentScore: 0 }
  }
  const lower = text.toLowerCase()

  // 카테고리: 첫 번째 매칭
  let category = 'misc'
  let categoryLabel = '기타'
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => lower.includes(k.toLowerCase()))) {
      category = rule.id
      categoryLabel = rule.label
      break
    }
  }

  // 감정: NEG-POS 합산
  let neg = 0, pos = 0
  for (const k of NEGATIVE_KEYWORDS) if (lower.includes(k)) neg++
  for (const k of POSITIVE_KEYWORDS) if (lower.includes(k)) pos++
  const score = pos - neg
  const sentiment = score >= 1 ? 'positive' : score <= -1 ? 'negative' : 'neutral'

  return { category, categoryLabel, sentiment, sentimentScore: score }
}

// ─── CSV 파싱 ───────────────────────────────────────────────────────────
function parseCSV(raw) {
  const lines = raw.split(/\r?\n/).filter(l => l.length > 0)
  if (lines.length === 0) return { header: [], rows: [] }
  const header = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(line => {
    const cells = parseCSVLine(line)
    const obj = {}
    header.forEach((h, i) => { obj[h] = cells[i] ?? '' })
    return obj
  })
  return { header, rows }
}

function parseCSVLine(line) {
  const out = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') { inQ = false }
      else { cur += c }
    } else {
      if (c === '"') inQ = true
      else if (c === ',') { out.push(cur); cur = '' }
      else cur += c
    }
  }
  out.push(cur)
  return out
}

function toCSV(header, rows) {
  const lines = [header.join(',')]
  for (const r of rows) lines.push(header.map(h => csvEscape(r[h])).join(','))
  return lines.join('\n')
}

function csvEscape(v) {
  if (v == null) return ''
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// ─── CLI 파싱 ───────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { input: null, output: null, summary: null }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--output' || a === '-o') args.output = argv[++i]
    else if (a === '--summary' || a === '-s') args.summary = argv[++i]
    else if (!args.input) args.input = a
  }
  return args
}

// ─── 메인 ───────────────────────────────────────────────────────────────
async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = resolve(__dirname, '..')

  const args = parseArgs(process.argv)
  if (!args.input) {
    console.error('사용: node scripts/classify-kakao-csv.mjs <input.csv> [--output <out.csv>] [--summary <s.json>]')
    process.exit(1)
  }

  const inputPath = resolve(args.input)
  const baseName  = basename(inputPath, extname(inputPath))
  const outPath   = args.output  || join(dirname(inputPath), `${baseName}-classified.csv`)
  const sumPath   = args.summary || join(dirname(inputPath), `${baseName}-summary.json`)

  console.log(`[classify] input:  ${inputPath}`)
  const raw = await readFile(inputPath, 'utf8')
  const { header, rows } = parseCSV(raw)
  console.log(`[classify] rows:   ${rows.length}`)

  // 'message' 컬럼 자동 탐지 (sync-kakao-chats.mjs 와 동일하게 'message')
  const msgCol = header.find(h => h.toLowerCase() === 'message') || 'message'

  // 분류
  const enriched = rows.map(r => {
    const c = classifyMessage(r[msgCol])
    return {
      ...r,
      category: c.category,
      category_label: c.categoryLabel,
      sentiment: c.sentiment,
      sentiment_score: c.sentimentScore,
    }
  })

  const newHeader = [...header, 'category', 'category_label', 'sentiment', 'sentiment_score']
  await writeFile(outPath, toCSV(newHeader, enriched), 'utf8')
  console.log(`[classify] output: ${outPath}`)

  // 요약 통계
  const summary = {
    generatedAt: new Date().toISOString(),
    inputFile: inputPath,
    totalRows: rows.length,
    categories: {},
    sentiments: { positive: 0, neutral: 0, negative: 0 },
  }
  for (const r of enriched) {
    const cat = r.category
    summary.categories[cat] = (summary.categories[cat] || 0) + 1
    summary.sentiments[r.sentiment]++
  }

  // 카테고리 정렬 (빈도 내림차순)
  const sortedCats = Object.entries(summary.categories)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => {
      const rule = CATEGORY_RULES.find(r => r.id === id)
      const negCount = enriched.filter(r => r.category === id && r.sentiment === 'negative').length
      return {
        id,
        label: rule ? rule.label : '기타',
        count,
        share: +(100 * count / rows.length).toFixed(1),
        negativeRate: +(100 * negCount / count).toFixed(1),
      }
    })
  summary.categoriesSorted = sortedCats

  await writeFile(sumPath, JSON.stringify(summary, null, 2), 'utf8')
  console.log(`[classify] summary:`)
  for (const c of sortedCats) {
    console.log(`  ${c.label.padEnd(15)} ${String(c.count).padStart(5)}건 (${String(c.share).padStart(4)}%) · 부정 ${c.negativeRate}%`)
  }
  console.log(`[classify] saved → ${sumPath}`)
}

main().catch(err => {
  console.error('[classify] 실패:', err)
  process.exit(1)
})
