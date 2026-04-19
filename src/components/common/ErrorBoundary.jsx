// src/components/common/ErrorBoundary.jsx
// 런타임 에러 fallback — React 19 에서도 여전히 class 기반이어야 한다 (componentDidCatch 필수).
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

  handleReset = () => {
    this.setState({ error: null })
    if (typeof window !== 'undefined') window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-semibold text-foreground">문제가 발생했습니다</p>
            <p className="text-sm text-muted-foreground">
              예상치 못한 오류로 화면을 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
          {import.meta.env.DEV && (
            <pre className="max-h-40 overflow-auto rounded-md border bg-muted p-3 text-left text-xs text-muted-foreground">
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </pre>
          )}
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => { window.location.href = '/' }}>홈으로</Button>
            <Button onClick={this.handleReset}>새로고침</Button>
          </div>
        </div>
      </div>
    )
  }
}
