// src/lib/supabase.js
// Supabase 클라이언트 초기화
// 환경변수: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase 미설정 시 경고 (graceful degradation — mockData로 폴백)
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.info('[AMS Wiki] Supabase 환경변수 미설정 → 로컬 mockData 사용')
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
        global: { headers: { 'x-app-name': 'ams-wiki' } },
      })
    : null

export const isSupabaseEnabled = Boolean(supabase)
