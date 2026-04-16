// src/components/common/Layout.jsx — Tailwind CSS + shadcn/ui
import { Outlet, useNavigate } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import Sidebar from './Sidebar'
import { useSearchStore } from '@/store/searchStore.jsx'

export default function Layout() {
  const { open } = useSearchStore()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-dvh bg-white font-[Pretendard,-apple-system,sans-serif]">

      {/* ── Global Header ── */}
      <header className="sticky top-0 z-100 flex items-center justify-between h-14 px-6 bg-white/95 backdrop-blur-[16px] border-b border-black/8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none" onClick={() => navigate('/')}>
          <img src="/logo.svg" alt="AMS 운영 위키" className="h-[22px] w-auto block" />
        </div>

        {/* Search — single source of truth */}
        <button
          onClick={open}
          className="flex items-center gap-2 w-full max-w-[480px] h-8 px-3 rounded-lg bg-zinc-100 border border-black/12 cursor-pointer transition-[border-color,background-color] duration-[120ms] ease-in-out font-[Pretendard,sans-serif] hover:bg-zinc-200 hover:border-black/20"
        >
          <Search size={13} className="text-zinc-400 shrink-0" />
          <span className="flex-1 text-left text-[13px] text-zinc-400 font-normal">가이드 검색...</span>
          <kbd className="text-[11px] font-semibold px-1.5 py-0.5 bg-white border border-black/12 rounded text-zinc-400 font-mono leading-[1.4]">/</kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative cursor-pointer flex">
            <Bell size={18} className="text-zinc-500" />
            <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white" />
          </div>
          <div className="w-[30px] h-[30px] rounded-full bg-zinc-100 border border-black/12 flex items-center justify-center cursor-pointer">
            <User size={15} className="text-zinc-500" />
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
