// src/lib/supabase.js — Supabase 클라이언트 (Vercel 통합 환경변수 기반)
// Vercel 프로젝트: layr8xs-projects / store_BE2CoXO5hUhEkxhK
// 환경변수가 없으면 mockData fallback 사용

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null

// ── 가이드 테이블 조회 ──────────────────────────────────────────────────────
export async function fetchGuides({ module: mod, q, limit = 100 } = {}) {
  if (!supabase) return null

  let query = supabase
    .from('guides')
    .select('id, title, module, type, tldr, updated, views, helpful, targets, version, author')
    .eq('published', true)
    .order('updated', { ascending: false })
    .limit(limit)

  if (mod) query = query.eq('module', mod)
  if (q)   query = query.or(`title.ilike.%${q}%,tldr.ilike.%${q}%`)

  const { data, error } = await query
  if (error) { console.warn('[Supabase] fetchGuides 오류:', error.message); return null }
  return data
}

// ── 단건 조회 ─────────────────────────────────────────────────────────────
export async function fetchGuide(id) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .single()

  if (error) { console.warn('[Supabase] fetchGuide 오류:', error.message); return null }
  return data
}

// ── 조회수 업데이트 ───────────────────────────────────────────────────────
export async function incrementViews(id) {
  if (!supabase) return
  await supabase.rpc('increment_guide_views', { guide_id: id }).catch(() => {})
}

// ── helpful 투표 ──────────────────────────────────────────────────────────
export async function voteHelpful(id, isHelpful) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('guide_feedback')
    .insert({ guide_id: id, helpful: isHelpful })
    .select()
    .single()
  if (error) return null
  return data
}
