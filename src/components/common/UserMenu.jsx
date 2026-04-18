// src/components/common/UserMenu.jsx — shadcn DropdownMenu + Dialog 기반 유저 메뉴
import { useState } from 'react'
import {
  SignOut as LogOut,
  Gear as Settings,
  SignIn as LogIn,
  CaretDown as ChevronDown,
} from '@phosphor-icons/react'
import { useAuth, ROLE_LABELS } from '@/store/authStore'
import { useToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function UserMenu() {
  const { user, isAuthenticated, loginWithEmail, logout } = useAuth()
  const { toast } = useToast()
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
    toast({ title: '로그아웃 완료', variant: 'info' })
  }

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'AMS'
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : null

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 px-2">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {initials}
                </span>
              )}
              <span className="hidden sm:block">{user?.name}</span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2.5">
              <span className="text-xs font-medium text-foreground truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              {roleLabel && (
                <span className="mt-1 inline-flex w-fit rounded-none border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                  {roleLabel}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings size={13} /> 설정
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut size={13} /> 로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)} className="gap-1.5">
          <LogIn size={14} />
          <span className="hidden sm:inline">로그인</span>
        </Button>
      )}

      {/* 로그인 다이얼로그 */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="rounded-lg p-6 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">AMS Wiki 로그인</DialogTitle>
            <DialogDescription>계속하려면 로그인하세요.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailLogin} className="mt-2 flex flex-col gap-3">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일"
              required
              autoComplete="email"
              className="h-9 text-sm"
            />
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              autoComplete="current-password"
              className="h-9 text-sm"
            />
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
