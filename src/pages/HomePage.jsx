// src/pages/HomePage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ClipboardList, BookOpen, Calendar, CreditCard, Gift,
  MessageSquare, Users, Building, GraduationCap, Shield, BarChart3,
  HelpCircle, Bell, ExternalLink, ArrowRight, ChevronRight
} from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'
import { MODULES } from '@/api/mockData'
import { RECENT_GUIDES } from '@/data/mockData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const ICON_MAP = { ClipboardList, BookOpen, Calendar, CreditCard, Gift, MessageSquare, Users, Building, GraduationCap, Shield, BarChart3 }
const POPULAR = ['계정이관', '환불 처리', 'QR 출석', '중복결제', '전반']

function ModuleCard({ m }) {
  const Icon = ICON_MAP[m.icon] || BookOpen
  return (
    <Link to={`/modules/${m.id}`} className="group no-underline">
      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-zinc-50 flex items-center justify-center transition-all group-hover:bg-blue-50">
            <Icon size={18} strokeWidth={2.5} className="text-zinc-500 transition-colors group-hover:text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 m-0 truncate">{m.label}</p>
            <p className="text-xs font-medium text-zinc-400 mt-0.5 mb-0">{m.guide_count}개 가이드</p>
          </div>
          <ChevronRight size={16} className="text-zinc-300" />
        </div>
        <p className="text-[13px] text-zinc-500 m-0 leading-relaxed line-clamp-2">
          {m.description}
        </p>
      </Card>
    </Link>
  )
}

function RecentItem({ g, isLast }) {
  const [isNew] = useState(() => g.updated_at && Date.now() - new Date(g.updated_at).getTime() < 7*24*60*60*1000)
  return (
    <Link
      to={`/guides/${g.id}`}
      className={`flex items-center gap-4 px-5 py-3.5 no-underline transition-colors hover:bg-zinc-50 ${isLast ? '' : 'border-b border-zinc-100'}`}
    >
      <Badge variant="default" size="sm" className="whitespace-nowrap font-semibold">
        {g.module}
      </Badge>
      <span className="flex-1 text-sm font-medium text-zinc-900 truncate">
        {g.title}
      </span>
      {isNew && (
        <Badge variant="default" size="sm" className="whitespace-nowrap font-bold">
          업데이트됨
        </Badge>
      )}
      <span className="text-xs font-medium text-zinc-400 font-mono">
        {g.updated_at?.slice(0,10)}
      </span>
      <ArrowRight size={14} className="text-zinc-300" />
    </Link>
  )
}

export default function HomePage() {
  const { open } = useSearchStore()
  const mods = MODULES
  const recents = RECENT_GUIDES

  return (
    <div className="flex-1 w-full max-w-[1100px] mx-auto px-10 py-16 box-border">

      {/* ── 히어로 영역 ── */}
      <section className="flex flex-col items-center text-center gap-5 mb-20">
        <Badge variant="default" size="default" className="gap-2 px-3.5 py-1.5 border border-blue-100 font-bold tracking-wide text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          AMS 운영 위키
        </Badge>

        <h1 className="text-[40px] font-extrabold tracking-tight text-zinc-900 m-0 leading-tight">
          어떤 가이드를 찾으시나요?
        </h1>
        <p className="text-base text-zinc-500 font-medium m-0">
          AMS 기능 사용법, 운영 케이스, 정책 기준을 한 곳에서 검색하세요.
        </p>

        {/* 검색바 */}
        <button
          onClick={open}
          className="group mt-4 flex items-center gap-3 w-full max-w-[560px] h-[52px] px-5 rounded-2xl border border-zinc-200 bg-white shadow-sm cursor-pointer transition-all hover:border-zinc-300 hover:shadow-md box-border"
        >
          <Search size={18} className="text-zinc-400 transition-colors group-hover:text-blue-500" />
          <span className="flex-1 text-left text-[15px] text-zinc-400 font-medium">가이드 검색 (단축키 '/')</span>
          <div className="flex items-center gap-1">
            <kbd className="font-mono text-[11px] font-semibold text-zinc-400 bg-zinc-50 border border-zinc-200 rounded px-2 py-0.5">⌘</kbd>
            <kbd className="font-mono text-[11px] font-semibold text-zinc-400 bg-zinc-50 border border-zinc-200 rounded px-2 py-0.5">K</kbd>
          </div>
        </button>

        {/* 인기 검색어 칩 */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[13px] font-medium text-zinc-400 mr-1">인기 검색어:</span>
          {POPULAR.map(q => (
            <Button
              key={q}
              variant="outline"
              size="xs"
              onClick={open}
              className="rounded-full"
            >
              {q}
            </Button>
          ))}
        </div>
      </section>

      {/* ── 모듈 그리드 ── */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-zinc-900 m-0 tracking-tight">카테고리 탐색</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {mods.map(m => <ModuleCard key={m.id} m={m} />)}
        </div>
      </section>

      {/* ── 하단 영역 (최근 업데이트 & 빠른 링크) ── */}
      <div className="grid grid-cols-[2fr_1fr] gap-8">
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-5 m-0 tracking-tight">최근 업데이트</h2>
          <Card className="overflow-hidden shadow-sm">
            {recents.map((g, i) => <RecentItem key={g.id} g={g} isLast={i === recents.length - 1} />)}
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-zinc-900 mb-2 m-0 tracking-tight">빠른 링크</h2>
          {[
            { to:'/faq', Icon:HelpCircle, label:'운영 FAQ', desc:'반복 문의 해결' },
            { to:'/updates', Icon:Bell, label:'업데이트 이력', desc:'정책 및 기능 변경' },
            { to:'/feedback', Icon:ExternalLink, label:'오류 제보', desc:'시스템 개선 요청' },
          ].map((link, i) => (
            <Link key={i} to={link.to} className="group no-underline">
              <Card className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center">
                  <link.Icon size={18} strokeWidth={2.5} className="text-zinc-500 transition-colors group-hover:text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 m-0">{link.label}</p>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5 mb-0">{link.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </section>
      </div>

    </div>
  )
}
