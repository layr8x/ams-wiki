// src/components/app-sidebar.jsx
// AMS Wiki 사이드바 — shadcn sidebar-07 + dashboard-01 패턴 기반
import * as React from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import {
  BookOpen,
  Calendar,
  CaretRight as ChevronRight,
  ClipboardText as ClipboardList,
  CreditCard,
  FileText,
  House as Home,
  Lifebuoy as LifeBuoy,
  ChatText as MessageSquare,
  PaperPlaneTilt as Send,
  PencilSimple as PencilLine,
  Gear as Settings,
  Sparkle as Sparkles,
  Users
} from '@phosphor-icons/react'
import { MODULE_TREE, RECENT_GUIDES } from "@/data/mockData"
import { useAuth } from "@/store/authStore"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

function BrandSymbol(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M14.296 16.6066C14.296 15.7057 15.0202 14.9751 15.9129 14.9751C16.8055 14.9751 17.5297 15.7057 17.5297 16.6066C17.5297 17.5075 16.8055 18.2381 15.9129 18.2381C15.0202 18.2381 14.296 17.5075 14.296 16.6066Z" />
      <path d="M2.20001 28H16.0737L20.2752 20.6538L18.9877 18.4025L14.7852 25.7497L6.05964 25.7507L15.9129 8.52292L25.7651 25.7507H19.9362L18.6497 28H29.6247L15.9129 4.02432L2.20001 28Z" />
      <path d="M18.4744 4L19.7619 6.25125H25.9375L22.8492 11.6507L24.1367 13.902L29.8 4H18.4744Z" />
    </svg>
  )
}

function BrandWordmark(props) {
  return (
    <svg viewBox="0 0 101 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AMS Wiki" {...props}>
      <path d="M24.8254 4.31474H22.0796V27.7246H24.8254V4.31474Z" />
      <path d="M4 19.882H7.05895L11.7657 9.95085L16.4724 19.882H19.5313L11.7657 4.03938L4 19.882Z" />
      <path d="M71.7717 4.31474H68.9477V21.3393H71.7717V4.31474Z" />
      <path d="M58.7104 19.8426H55.8472V28H71.2611L72.3591 25.4787H58.7104V19.8426Z" />
      <path d="M31.8455 7.03444H38.2782V4.55248H28.9823V19.8033H38.1608L39.2587 17.241H31.8455V7.03444Z" />
      <path d="M93.6951 4.31474V10.9754H91.3409V4.39343H88.636V27.6459H91.3409V13.6164H93.6951V28H96.4V4.31474H93.6951Z" />
      <path d="M86.0469 6.9951L87.1057 4.55248H76.007V6.9951H79.7707V10.1476L75.3006 19.8033H78.0854L81.1835 13.1426L84.2816 19.8033H87.1057L82.6339 10.1476V6.9951H86.0469Z" />
      <path d="M46.2788 10.9754H43.9247V4.39343H41.2197V27.6459H43.9247V13.6164H46.2788V28H48.9838V4.31474H46.2788V10.9754Z" />
      <path d="M55.1033 10.6606C55.1033 8.05901 56.1621 6.4836 58.6337 6.4836C60.908 6.4836 62.2816 7.94262 62.2816 10.6606C62.2816 13.3787 60.9487 14.8377 58.6337 14.8377C56.3187 14.8377 55.1033 13.3393 55.1033 10.6606ZM65.1432 10.6606C65.0649 6.40492 62.2408 4 58.6321 4C54.7493 4 52.1602 6.75901 52.1602 10.6606C52.1602 15.0738 55.2974 17.3213 58.6321 17.3213C62.2017 17.3213 65.1432 14.7984 65.1432 10.6606Z" />
    </svg>
  )
}

const ICON_MAP = {
  ClipboardList,
  BookOpen,
  Calendar,
  CreditCard,
  Users,
  MessageSquare,
  Settings,
}

const PRIMARY_NAV = [
  { title: "홈", to: "/", icon: Home, end: true },
  { title: "전체 가이드", to: "/guides", icon: FileText },
  { title: "업데이트", to: "/updates", icon: Sparkles },
  { title: "FAQ", to: "/faq", icon: LifeBuoy },
  { title: "새 가이드 작성", to: "/editor", icon: PencilLine },
]

const SECONDARY_NAV = [
  { title: "피드백", to: "/feedback", icon: Send },
  { title: "설정", to: "/settings", icon: Settings },
]

export function AppSidebar({ ...props }) {
  const location = useLocation()
  const currentPath = location.pathname
  const { user, canAccess } = useAuth()

  const recents = RECENT_GUIDES.slice(0, 5)
  const visibleModules = MODULE_TREE.filter(mod => canAccess(mod.id))

  return (
    <Sidebar collapsible="icon" {...props}>
      {/*
        브랜드 헤더는 SidebarMenuButton 래핑을 사용하지 않습니다.
        SidebarMenuButton은 [&_svg]:size-4 로 모든 자손 SVG를 16×16으로 강제하기 때문에
        가로형 워드마크가 아이콘 사이즈로 줄어드는 문제가 발생합니다.
        대신 SidebarHeader 안에 직접 Link를 두어 워드마크 본연 비율을 유지합니다.
      */}
      <SidebarHeader className="px-3 py-3 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2">
        <Link
          to="/"
          aria-label="시대인재 홈"
          className="flex items-center justify-start text-foreground transition-opacity hover:opacity-80 group-data-[collapsible=icon]:justify-center"
        >
          {/* 가로형 워드마크 — viewBox 101×32 원본 비율, 높이 24px */}
          <BrandWordmark className="block h-6 w-auto group-data-[collapsible=icon]:hidden" />
          {/* collapsed: 정사각 심볼 */}
          <BrandSymbol className="hidden size-6 shrink-0 group-data-[collapsible=icon]:block" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={
                    item.end ? currentPath === item.to : currentPath.startsWith(item.to)
                  }>
                    <NavLink to={item.to} end={item.end}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>모듈</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleModules.map((mod) => {
                const Icon = ICON_MAP[mod.icon] ?? FileText
                const isActiveModule = currentPath.startsWith("/guides") &&
                  location.search.includes(`module=${mod.id}`)
                return (
                  <Collapsible
                    key={mod.id}
                    defaultOpen={isActiveModule}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={mod.label}>
                          <Icon />
                          <span>{mod.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {mod.guides.map((g) => (
                            <SidebarMenuSubItem key={g.id}>
                              <SidebarMenuSubButton asChild isActive={currentPath === `/guides/${g.id}`}>
                                <NavLink to={`/guides/${g.id}`}>
                                  <span className="truncate">{g.label}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>최근 업데이트</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recents.map((g) => (
                <SidebarMenuItem key={g.id}>
                  <SidebarMenuButton asChild className="text-sidebar-foreground/80" isActive={currentPath === `/guides/${g.id}`}>
                    <NavLink to={`/guides/${g.id}`}>
                      <span className="truncate">{g.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY_NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <NavLink to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
