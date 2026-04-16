// src/store/authStore.jsx — Supabase Auth 실제 연동
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { ROLES, ROLE_PERMISSIONS } from './authConstants'
export { ROLES, PERMISSIONS } from './authConstants'

const AuthContext = createContext(null)

// Supabase User → 앱 User 변환
function mapSupabaseUser(u) {
  const meta = u.user_metadata || {}
  return {
    id:        u.id,
    email:     u.email,
    name:      meta.full_name || meta.name || u.email?.split('@')[0] || '사용자',
    avatar:    meta.avatar_url || meta.picture || null,
    role:      meta.role || ROLES.OPERATOR,
    provider:  u.app_metadata?.provider || 'email',
    loginTime: new Date().toISOString(),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // ─── Supabase Auth 세션 동기화 ───────────────────────────────────────────
  useEffect(() => {
    if (isSupabaseEnabled) {
      // 현재 세션 가져오기
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session ? mapSupabaseUser(session.user) : null)
        setIsLoading(false)
      })

      // 인증 상태 변경 구독
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session ? mapSupabaseUser(session.user) : null)
      })
      return () => subscription.unsubscribe()
    } else {
      // Supabase 미설정 — localStorage 폴백
      try {
        const stored = localStorage.getItem('ams_wiki_user')
        if (stored) setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('ams_wiki_user')
      }
      setIsLoading(false)
    }
  }, [])

  // ─── mockData 폴백 로그인 ────────────────────────────────────────────────
  function fallbackLogin(email) {
    const mockUser = {
      id:        'demo-' + Math.random().toString(36).slice(2),
      email,
      name:      email.split('@')[0],
      avatar:    null,
      role:      ROLES.OPERATOR,
      provider:  'demo',
      loginTime: new Date().toISOString(),
    }
    setUser(mockUser)
    localStorage.setItem('ams_wiki_user', JSON.stringify(mockUser))
    return mockUser
  }

  // ─── 구글 OAuth 로그인 ───────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseEnabled) return fallbackLogin('google@demo.com')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  // ─── 이메일/비밀번호 로그인 ──────────────────────────────────────────────
  const loginWithEmail = useCallback(async (email, password) => {
    if (!isSupabaseEnabled) return fallbackLogin(email)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }, [])

  // ─── 이메일/비밀번호 회원가입 ────────────────────────────────────────────
  const signUp = useCallback(async (email, password, name) => {
    if (!isSupabaseEnabled) return fallbackLogin(email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) throw error
    return data.user
  }, [])

  // ─── 로그아웃 ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (isSupabaseEnabled) {
      await supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem('ams_wiki_user')
  }, [])

  // ─── 권한 확인 ───────────────────────────────────────────────────────────
  const hasPermission = useCallback((perm) => {
    const role = user?.role || ROLES.GUEST
    return ROLE_PERMISSIONS[role]?.includes(perm) ?? false
  }, [user])

  const hasRole = useCallback((role) => user?.role === role, [user])

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      loginWithGoogle, loginWithEmail, signUp, logout,
      hasPermission, hasRole,
      isAuthenticated: Boolean(user),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용 가능합니다')
  return ctx
}
