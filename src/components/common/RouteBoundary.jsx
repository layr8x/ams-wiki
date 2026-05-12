// src/components/common/RouteBoundary.jsx
// 라우트 단위 ErrorBoundary + Suspense 조합 헬퍼.
// pathname 변경 시 자동 리셋 → 에러 페이지에서 다른 메뉴로 이동 가능.
import React, { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { Skeleton } from '@/components/ui/skeleton'

function DefaultSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="mt-8 grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`sk-${i}`} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function RouteBoundary({ children, fallback }) {
  const { pathname } = useLocation()
  return (
    <ErrorBoundary variant="page" resetKey={pathname}>
      <Suspense fallback={fallback ?? <DefaultSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
