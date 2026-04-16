// src/pages/ErrorPage.jsx — shadcn/ui 표준
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({ statusCode = 404, message = '찾을 수 없는 페이지입니다.' }) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-6 p-10">
      <AlertCircle size={56} className="text-destructive" />
      <h1 className="text-4xl font-bold text-foreground">{statusCode}</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">{message}</p>
      <div className="flex gap-3">
        <Button variant="default" onClick={() => navigate('/')}>
          <Home size={14} /> 홈으로 이동
        </Button>
        <Button variant="outline" onClick={() => navigate('/guides')}>
          <Search size={14} /> 가이드 검색
        </Button>
      </div>
    </div>
  )
}
