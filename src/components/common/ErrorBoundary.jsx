// src/components/common/ErrorBoundary.jsx
// 런타임 에러 fallback — React 19 에서도 여전히 class 기반이어야 한다 (componentDidCatch 필수).
//
// variant="global": 전체 화면 (App.jsx 최상단)
// variant="page":   페이지 영역만 차지 (라우트 단위). 다른 라우트로 이동하면 자동 복구.
import React from 'react'
import { Button } from '@/components/ui/button'

export class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  // resetKey(예: 라우트 pathname) 가 바뀌면 에러 상태를 자동으로 해제.
  // → 에러가 난 페이지에서 다른 페이지로 이동하면 자연스럽게 복구된다.
  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  handleReset = () => {
    this.setState({ error: null })
    // variant=page 인 경우 새로고침 대신 단순 상태 리셋 → 다른 페이지로 이동 가능
    if (this.props.variant !== 'page' && typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    const isPage = this.props.variant === 'page'
    return (
      <div className={
        isPage
          ? 'mx-auto flex min-h-[60dvh] w-full max-w-lg items-center justify-center px-6 py-10'
          : 'flex min-h-screen items-center justify-center bg-background px-6'
      }>
        <div className="w-full space-y-6 text-center">
          <div className="space-y-2">
            <p className={isPage ? 'text-2xl font-semibold' : 'text-4xl font-semibold text-foreground'}>
              {isPage ? '이 페이지를 표시할 수 없습니다' : '문제가 발생했습니다'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPage
                ? '다른 메뉴는 정상 동작합니다. 다시 시도하거나 홈으로 이동해 주세요.'
                : '예상치 못한 오류로 화면을 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.'}
            </p>
          </div>
          {import.meta.env.DEV && (
            <pre className="max-h-40 overflow-auto rounded-md border bg-muted p-3 text-left text-xs text-muted-foreground">
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </pre>
          )}
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => { window.location.href = '/' }}>홈으로</Button>
            <Button onClick={this.handleReset}>{isPage ? '다시 시도' : '새로고침'}</Button>
          </div>
        </div>
      </div>
    )
  }
}
