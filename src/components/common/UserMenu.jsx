// src/components/common/UserMenu.jsx — shadcn/ui Radix Dialog 기반 유저 메뉴 + 로그인
import { useState } from 'react'
import {
  SignOut as LogOut,
  Gear as Settings,
  SignIn as LogIn,
  CaretDown as ChevronDown,
} from '@phosphor-icons/react'
import { useAuth } from '@/store/authStore'
import { useToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function UserMenu() {
  const { user, isAuthenticated, loginWithEmail, logout } = useAuth()
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
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
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
                  <p className="text-[12px] text-muted-foreground truncate">{user?.email}</p>
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
          type="button"
          onClick={() => setLoginOpen(true)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <LogIn size={14} />
          <span className="hidden sm:inline">로그인</span>
        </button>
      )}

      {/* 로그인 다이얼로그 — Radix Portal 기반 */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="rounded-lg p-6 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">AMS Wiki 로그인</DialogTitle>
            <DialogDescription>계속하려면 로그인하세요.</DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-3">
            {/* 이메일/비밀번호 로그인 */}
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일"
                required
                autoComplete="email"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                autoComplete="current-password"
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
