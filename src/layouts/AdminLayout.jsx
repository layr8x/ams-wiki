// src/layouts/AdminLayout.jsx — 어드민 전용 레이아웃
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

const BREADCRUMB_LABEL = {
  admin: '관리자',
  guides: '가이드 관리',
  feedback: '피드백 수신함',
  users: '사용자 관리',
  sync: 'Confluence 동기화',
  audit: '감사 로그',
}

function buildBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = []
  let cumulative = ''
  segments.forEach((seg, idx) => {
    cumulative += `/${seg}`
    crumbs.push({
      href: cumulative,
      label: BREADCRUMB_LABEL[seg] || seg,
      isLast: idx === segments.length - 1,
    })
  })
  return crumbs
}

export default function AdminLayout() {
  const location = useLocation()
  const crumbs = buildBreadcrumbs(location.pathname)

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((c, i) => (
                <span key={c.href} className="contents">
                  <BreadcrumbItem>
                    {c.isLast ? (
                      <BreadcrumbPage>{c.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={c.href}>{c.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {i < crumbs.length - 1 && <BreadcrumbSeparator />}
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
