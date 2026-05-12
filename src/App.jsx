// src/App.jsx — shadcn/ui 표준 + React Query + Toast + 모든 Provider
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy } from 'react'
import Layout from './components/common/Layout'
import SearchOverlay from './components/search/SearchOverlay'
import { SearchProvider } from './store/searchStore'
import { I18nProvider } from './store/i18nStore'
import { AuthProvider } from './store/authStore'
import { ToastProvider } from './components/ui/toast'
import { TooltipProvider } from './components/ui/tooltip'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { RouteBoundary } from './components/common/RouteBoundary'
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

export default function App() {
  return (
    <ErrorBoundary variant="global">
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
                        <RouteBoundary><EditorPage /></RouteBoundary>
                      } />
                    </Route>

                    {/* 어드민 — 관리자 권한 필요 */}
                    <Route element={<RequireRole permission="manage_users" />}>
                      <Route path="/admin" element={
                        <RouteBoundary><AdminLayout /></RouteBoundary>
                      }>
                        <Route index element={
                          <RouteBoundary><AdminOverviewPage /></RouteBoundary>
                        } />
                        <Route path="guides" element={
                          <RouteBoundary><AdminGuidesPage /></RouteBoundary>
                        } />
                        <Route path="feedback" element={
                          <RouteBoundary><AdminFeedbackPage /></RouteBoundary>
                        } />
                        <Route path="integration" element={
                          <Suspense fallback={<PageSkeleton />}><AdminIntegrationPage /></Suspense>
                        } />
                      </Route>
                    </Route>

                    {/* 기본 레이아웃 */}
                    <Route element={<Layout />}>
                      <Route path="/" element={
                        <RouteBoundary><HomePage /></RouteBoundary>
                      } />
                      <Route path="/guides" element={
                        <RouteBoundary><GuideListPage /></RouteBoundary>
                      } />
                      <Route path="/guides/:id" element={
                        <RouteBoundary><GuidePage /></RouteBoundary>
                      } />
                      <Route path="/modules/:moduleId" element={
                        <RouteBoundary><GuideListPage /></RouteBoundary>
                      } />
                      <Route path="/faq" element={
                        <RouteBoundary><FaqPage /></RouteBoundary>
                      } />
                      <Route path="/updates" element={
                        <RouteBoundary><UpdatesPage /></RouteBoundary>
                      } />
                      <Route path="/feedback" element={
                        <RouteBoundary><FeedbackPage /></RouteBoundary>
                      } />
                      <Route path="/404" element={
                        <RouteBoundary>
                          <ErrorPage statusCode={404} message="찾을 수 없는 페이지입니다." />
                        </RouteBoundary>
                      } />
                      <Route path="*" element={
                        <RouteBoundary>
                          <ErrorPage statusCode={404} message="찾을 수 없는 페이지입니다." />
                        </RouteBoundary>
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
