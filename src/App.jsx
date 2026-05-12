// src/App.jsx — shadcn/ui 표준 + React Query + Toast + 모든 Provider
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import Layout from './components/common/Layout'
import SearchOverlay from './components/search/SearchOverlay'
import { SearchProvider } from './store/searchStore'
import { I18nProvider } from './store/i18nStore'
import { AuthProvider } from './store/authStore'
import { ToastProvider } from './components/ui/toast'
import { TooltipProvider } from './components/ui/tooltip'
import { Skeleton } from './components/ui/skeleton'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { RequireRole } from './components/common/RequireRole'

// 코드 스플리팅 (lazy loading)
const HomePage             = lazy(() => import('./pages/HomePage'))
const GuideListPage        = lazy(() => import('./pages/GuideListPage'))
const GuidePage            = lazy(() => import('./pages/GuidePage'))
const FaqPage              = lazy(() => import('./pages/FaqPage'))
const UpdatesPage          = lazy(() => import('./pages/UpdatesPage'))
const CreateGuidePage      = lazy(() => import('./pages/CreateGuidePage'))
const EditorPage           = lazy(() => import('./pages/EditorPage'))
const FeedbackPage         = lazy(() => import('./pages/FeedbackPage'))
const ErrorPage            = lazy(() => import('./pages/ErrorPage'))
const AdminLayout          = lazy(() => import('./layouts/AdminLayout'))
const AdminOverviewPage    = lazy(() => import('./pages/admin/AdminOverviewPage'))
const AdminGuidesPage      = lazy(() => import('./pages/admin/AdminGuidesPage'))
const AdminFeedbackPage    = lazy(() => import('./pages/admin/AdminFeedbackPage'))
const AdminIntegrationPage = lazy(() => import('./pages/admin/AdminIntegrationPage'))

// React Query 클라이언트
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

// 로딩 폴백
function PageSkeleton() {
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

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          <I18nProvider>
            <AuthProvider>
              <ToastProvider>
                <SearchProvider>
                  <BrowserRouter>
                  <Routes>
                    {/* 새 가이드 작성 — 편집 권한 필요, 레이아웃 없이 전체 화면 */}
                    <Route element={<RequireRole permission="edit" />}>
                      <Route path="/create" element={
                        <Suspense fallback={<PageSkeleton />}>
                          <CreateGuidePage />
                        </Suspense>
                      } />
                    </Route>

                    {/* 에디터 — 편집 권한 필요, 레이아웃 없이 전체 화면 */}
                    <Route element={<RequireRole permission="edit" />}>
                      <Route path="/editor" element={
                        <Suspense fallback={<PageSkeleton />}>
                          <EditorPage />
                        </Suspense>
                      } />
                    </Route>

                    {/* 어드민 — 관리자 권한 필요 */}
                    <Route element={<RequireRole permission="manage_users" />}>
                      <Route path="/admin" element={
                        <Suspense fallback={<PageSkeleton />}><AdminLayout /></Suspense>
                      }>
                        <Route index element={
                          <Suspense fallback={<PageSkeleton />}><AdminOverviewPage /></Suspense>
                        } />
                        <Route path="guides" element={
                          <Suspense fallback={<PageSkeleton />}><AdminGuidesPage /></Suspense>
                        } />
                        <Route path="feedback" element={
                          <Suspense fallback={<PageSkeleton />}><AdminFeedbackPage /></Suspense>
                        } />
                        <Route path="integration" element={
                          <Suspense fallback={<PageSkeleton />}><AdminIntegrationPage /></Suspense>
                        } />
                      </Route>
                    </Route>

                    {/* 기본 레이아웃 */}
                    <Route element={<Layout />}>
                      <Route path="/" element={
                        <Suspense fallback={<PageSkeleton />}><HomePage /></Suspense>
                      } />
                      <Route path="/guides" element={
                        <Suspense fallback={<PageSkeleton />}><GuideListPage /></Suspense>
                      } />
                      <Route path="/guides/:id" element={
                        <Suspense fallback={<PageSkeleton />}><GuidePage /></Suspense>
                      } />
                      <Route path="/modules/:moduleId" element={
                        <Suspense fallback={<PageSkeleton />}><GuideListPage /></Suspense>
                      } />
                      <Route path="/faq" element={
                        <Suspense fallback={<PageSkeleton />}><FaqPage /></Suspense>
                      } />
                      <Route path="/updates" element={
                        <Suspense fallback={<PageSkeleton />}><UpdatesPage /></Suspense>
                      } />
                      <Route path="/feedback" element={
                        <Suspense fallback={<PageSkeleton />}><FeedbackPage /></Suspense>
                      } />
                      <Route path="/404" element={
                        <Suspense fallback={<PageSkeleton />}>
                          <ErrorPage statusCode={404} message="찾을 수 없는 페이지입니다." />
                        </Suspense>
                      } />
                      <Route path="*" element={
                        <Suspense fallback={<PageSkeleton />}>
                          <ErrorPage statusCode={404} message="찾을 수 없는 페이지입니다." />
                        </Suspense>
                      } />
                    </Route>
                  </Routes>
                  <SearchOverlay />
                  </BrowserRouter>
                </SearchProvider>
              </ToastProvider>
            </AuthProvider>
          </I18nProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
