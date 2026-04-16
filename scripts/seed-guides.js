#!/usr/bin/env node

/**
 * Supabase 시드 데이터 스크립트
 *
 * mockData의 가이드를 Supabase에 적재하는 스크립트
 *
 * 사용법:
 * npm run db:seed
 *
 * 또는 NODE_ENV=production으로 프로덕션 환경에서 실행
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { GUIDES, MODULES } from '../src/api/mockData.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다')
  console.error('VITE_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 설정하세요')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * 가이드를 Supabase에 적재
 */
async function seedGuides() {
  console.log('🌱 가이드 데이터 적재 시작...')

  try {
    // 1. 기존 데이터 삭제 (재시도 시)
    console.log('🗑️  기존 데이터 삭제...')
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .neq('id', 'null')

    if (deleteError) {
      console.warn('⚠️  기존 데이터 삭제 경고:', deleteError.message)
    }

    // 2. 모의 데이터 변환
    const guidesToInsert = GUIDES.map(guide => ({
      id: guide.id,
      module_id: guide.module_id,
      module: guide.module,
      title: guide.title,
      summary: guide.summary,
      content: JSON.stringify(guide), // 전체 구조를 JSON으로 저장
      guide_type: guide.guide_type || 'sop',
      author: guide.author,
      target_roles: guide.target_roles || [],
      tags: guide.tags || [],
      status: 'published',
      view_count: Math.floor(Math.random() * 1000),
      created_at: new Date(guide.updated_at).toISOString(),
      updated_at: new Date(guide.updated_at).toISOString(),
      published_at: new Date(guide.updated_at).toISOString(),
    }))

    // 3. 배치 적재 (1000개씩)
    const batchSize = 1000
    let inserted = 0

    for (let i = 0; i < guidesToInsert.length; i += batchSize) {
      const batch = guidesToInsert.slice(i, i + batchSize)
      const { data, error } = await supabase
        .from('guides')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ 배치 ${Math.floor(i / batchSize) + 1} 적재 실패:`, error)
        continue
      }

      inserted += data?.length || 0
      console.log(`✅ ${Math.min(i + batchSize, guidesToInsert.length)}/${guidesToInsert.length} 적재됨`)
    }

    console.log(`\n✨ 가이드 적재 완료: ${inserted}개`)

    // 4. 통계 출력
    const { data: stats } = await supabase
      .from('guides')
      .select('module_id', { count: 'exact' })

    const groupedByModule = {}
    GUIDES.forEach(g => {
      groupedByModule[g.module] = (groupedByModule[g.module] || 0) + 1
    })

    console.log('\n📊 모듈별 가이드 수:')
    Object.entries(groupedByModule).forEach(([module, count]) => {
      console.log(`  • ${module}: ${count}개`)
    })

  } catch (error) {
    console.error('❌ 시드 작업 중 오류:', error.message)
    process.exit(1)
  }
}

/**
 * 데이터 정합성 검증
 */
async function validateData() {
  console.log('\n📋 데이터 정합성 검증...')

  try {
    const { data: dbGuides, error } = await supabase
      .from('guides')
      .select('id, title, module_id')

    if (error) throw error

    const mockIds = new Set(GUIDES.map(g => g.id))
    const dbIds = new Set(dbGuides.map(g => g.id))

    // 누락된 가이드
    const missing = [...mockIds].filter(id => !dbIds.has(id))
    if (missing.length > 0) {
      console.warn(`⚠️  누락된 가이드: ${missing.join(', ')}`)
    }

    // 초과 가이드
    const extra = [...dbIds].filter(id => !mockIds.has(id))
    if (extra.length > 0) {
      console.warn(`⚠️  초과 가이드: ${extra.join(', ')}`)
    }

    if (missing.length === 0 && extra.length === 0) {
      console.log('✅ 정합성 검증 통과!')
    }

  } catch (error) {
    console.error('❌ 정합성 검증 실패:', error.message)
  }
}

/**
 * 메인 실행
 */
async function main() {
  console.log('🚀 AMS Wiki 시드 데이터 스크립트')
  console.log(`📅 ${new Date().toISOString()}`)
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`)
  console.log('')

  await seedGuides()
  await validateData()

  console.log('\n✨ 완료!')
}

main().catch(error => {
  console.error('❌ 프로세스 오류:', error)
  process.exit(1)
})
