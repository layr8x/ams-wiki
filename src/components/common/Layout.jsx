// src/components/common/Layout.jsx — shadcn/ui 표준
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import GlobalHeader from './GlobalHeader'

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <GlobalHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
