// src/pages/ErrorPage.jsx
// 구조: 큰 상태 코드 + 메시지 + 복구 액션 2개
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  House as Home,
  MagnifyingGlass as Search,
  ArrowLeft
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({ statusCode = 404, message = '찾을 수 없는 페이지입니다.' }) {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center overflow-hidden px-6">
      {/* 배경 그리드 — 은은한 폴리시 */}
      <div
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-[120px] font-bold leading-none tracking-tighter text-foreground/90 sm:text-[180px]">
          {statusCode}
        </p>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {message}
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            요청하신 주소가 변경되었거나 삭제되었을 수 있습니다.<br/>
            가이드 목록에서 다시 찾아보세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> 이전으로
          </Button>
          <Button size="sm" onClick={() => navigate('/')}>
            <Home size={14} /> 홈으로
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/guides')}>
            <Search size={14} /> 가이드 검색
          </Button>
        </div>
      </div>
    </div>
  )
}
