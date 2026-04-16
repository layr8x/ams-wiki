// src/components/common/UserMenu.jsx — shadcn/ui 스타일 유저 메뉴 + 로그인 다이얼로그
import { useState } from 'react'
import { User, LogOut, Settings, LogIn, ChevronDown } from 'lucide-react'
import { useAuth } from '@/store/authStore'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

export default function UserMenu() {
  const { user, isAuthenticated, loginWithEmail, loginWithGoogle, logout } = useAuth()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      setLoginOpen(false)
      toast({ title: '로그인 성공', description: '환영합니다!', variant: 'success' })
    } catch (err) {
      toast({ title: '로그인 실패', description: err.message || '이메일/비밀번호를 확인하세요', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      toast({ title: '구글 로그인 실패', description: err.message, variant: 'error' })
    }
  }

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    toast({ title: '로그아웃 완료', variant: 'info' })
  }

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : 'AMS'

  return (
    <>
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {initials}
              </span>
            )}
            <span className="hidden sm:block text-xs">{user?.name}</span>
            <ChevronDown size={12} className="text-muted-foreground" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-50" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-border bg-popover p-1 shadow-md">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                </div>
                <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-foreground hover:bg-accent transition-colors">
                  <Settings size={13} /> 설정
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={13} /> 로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setLoginOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogIn size={15} />
          <span className="sr-only">로그인</span>
        </button>
      )}

      {/* 로그인 다이얼로그 */}
      {loginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setLoginOpen(false)} />
          <div className="relative w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-xl">
            <h2 className="text-base font-semibold mb-1">AMS Wiki 로그인</h2>
            <p className="text-xs text-muted-foreground mb-4">계속하려면 로그인하세요.</p>

            {/* 구글 로그인 */}
            <button
              onClick={handleGoogleLogin}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-md border border-border',
                'px-3 py-2 text-sm font-medium transition-colors hover:bg-accent mb-3'
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 로그인
            </button>

            <div className="relative flex items-center mb-3">
              <div className="flex-1 border-t border-border" />
              <span className="px-3 text-[11px] text-muted-foreground">또는</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* 이메일/비밀번호 로그인 */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <button
              onClick={() => setLoginOpen(false)}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground w-full text-center transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  )
}
