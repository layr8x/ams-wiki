// src/components/common/Sidebar.jsx — Tailwind CSS + shadcn/ui
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, HelpCircle, Bell, PlusCircle,
  ChevronDown, Clock, LayoutGrid, FileText, Search
} from 'lucide-react';
import { useSearchStore } from '@/store/searchStore.jsx';
import { MODULE_TREE, RECENT_GUIDES } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';

const ICON_MAP = {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings, Layers: Settings,
};

export default function Sidebar() {
  const { open } = useSearchStore();
  const [expanded, setExpanded] = useState({ operation: true, customer: true });
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <aside className="w-[260px] shrink-0 h-[calc(100dvh-56px)] bg-white border-r border-black/8 sticky top-14 flex flex-col font-[Pretendard,-apple-system,sans-serif] overflow-hidden">

      {/* ── 상단 고정: 검색 + 최근 조회 ── */}
      <div className="px-2.5 pt-3 shrink-0">
        {/* 검색 진입점 */}
        <button onClick={open} className="flex items-center gap-2 w-full h-9 px-2.5 mb-2.5 rounded-lg border border-zinc-200 bg-white cursor-pointer text-[13px] text-zinc-400 font-[Pretendard,-apple-system,sans-serif] transition-[border-color] duration-[120ms] ease-in-out hover:border-zinc-300">
          <Search size={13} className="text-zinc-400 shrink-0" />
          <span className="flex-1 text-left">가이드 검색</span>
          <kbd className="text-[11px] font-semibold px-[5px] py-px bg-zinc-100 border border-zinc-200 rounded text-zinc-400 font-mono">/</kbd>
        </button>

        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.08em] px-1.5 mb-1">최근 조회</p>
        {RECENT_GUIDES.slice(0,5).map(r => (
          <NavLink key={r.id} to={`/guides/${r.id}`}
            className={({ isActive }) =>
              `flex items-center gap-[7px] py-1.5 px-2 rounded-md no-underline mb-px transition-colors duration-100 ${
                isActive ? 'bg-blue-100' : 'hover:bg-zinc-100'
              }`
            }
          >
            <Clock size={11} className="text-zinc-400 shrink-0" />
            <span className="flex-1 text-xs text-zinc-900 overflow-hidden text-ellipsis whitespace-nowrap font-normal">{r.title}</span>
            <span className="text-[10px] text-zinc-400 whitespace-nowrap shrink-0">{r.module.split('/')[0]}</span>
          </NavLink>
        ))}

        <Separator className="my-2.5 mx-0.5" />

        {/* 대시보드 */}
        <NavLink to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 py-[7px] px-2 rounded-md no-underline text-[13px] mb-0.5 transition-all duration-100 font-[Pretendard,-apple-system,sans-serif] ${
              isActive
                ? 'font-semibold text-blue-500 bg-blue-100'
                : 'font-normal text-zinc-900 hover:bg-zinc-100'
            }`
          }
        >
          <LayoutGrid size={14} className="shrink-0" /> 대시보드
        </NavLink>

        <Separator className="mt-2 mb-1.5 mx-0.5" />
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.08em] px-1.5 mb-1 mt-1">운영 가이드</p>
      </div>

      {/* ── 스크롤 가능한 모듈 트리 ── */}
      <nav className="flex-1 overflow-y-auto px-2.5">
        {MODULE_TREE.map(mod => {
          const isOpen = !!expanded[mod.id];
          const Icon = ICON_MAP[mod.icon] || Settings;
          const hasGuides = mod.guides && mod.guides.length > 0;
          return (
            <div key={mod.id} className="mb-px">
              <button
                onClick={() => hasGuides && toggle(mod.id)}
                className={`flex items-center gap-[7px] w-full py-[7px] px-2 rounded-md border-none bg-transparent text-left text-[13px] font-medium text-zinc-900 font-[Pretendard,-apple-system,sans-serif] transition-colors duration-100 ${
                  hasGuides ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-default'
                }`}
              >
                <Icon size={13} className="text-zinc-400 shrink-0" />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{mod.label}</span>
                {hasGuides && (
                  <ChevronDown size={11} className={`text-zinc-400 shrink-0 transition-transform duration-[180ms] ease-in-out ${isOpen ? '' : '-rotate-90'}`} />
                )}
              </button>

              {isOpen && hasGuides && (
                <div className="pl-5 mb-0.5">
                  {mod.guides.map(g => (
                    <NavLink key={g.id} to={`/guides/${g.id}`}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 py-[5px] px-2 rounded-md no-underline text-xs mb-px transition-all duration-100 font-[Pretendard,-apple-system,sans-serif] ${
                          isActive
                            ? 'font-semibold text-blue-500 bg-blue-100'
                            : 'font-normal text-zinc-500 hover:bg-zinc-100'
                        }`
                      }
                    >
                      <FileText size={10} className="shrink-0 opacity-45" />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{g.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <Separator className="my-2.5 mx-0.5" />

        {/* 하단 링크 */}
        {[{ to:'/faq', label:'운영 FAQ', Icon:HelpCircle }, { to:'/updates', label:'업데이트 이력', Icon:Bell }].map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 py-[7px] px-2 rounded-md no-underline text-[13px] mb-px transition-all duration-100 font-[Pretendard,-apple-system,sans-serif] ${
                isActive
                  ? 'font-semibold text-blue-500 bg-blue-100'
                  : 'font-normal text-zinc-900 hover:bg-zinc-100'
              }`
            }
          >
            <item.Icon size={13} className="shrink-0" /> {item.label}
          </NavLink>
        ))}
        <div className="h-2" />
      </nav>

      {/* ── 새 가이드 작성 버튼 (하단 고정) ── */}
      <div className="p-2.5 border-t border-black/8 shrink-0 bg-white">
        <NavLink to="/editor"
          className="flex items-center justify-center gap-1.5 h-8 rounded-lg bg-black text-white no-underline text-[13px] font-semibold transition-colors duration-[120ms] ease-in-out font-[Pretendard,-apple-system,sans-serif] hover:bg-zinc-800"
        >
          <PlusCircle size={13} /> 새 가이드 작성
        </NavLink>
      </div>
    </aside>
  );
}
