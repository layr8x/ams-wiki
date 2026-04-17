// src/components/app-sidebar.jsx
// AMS Wiki 사이드바 — shadcn sidebar-07 + dashboard-01 패턴 기반
import * as React from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import {
  BookOpen,
  Calendar,
  ChevronRight,
  ClipboardList,
  Command,
  CreditCard,
  FileText,
  Home,
  LifeBuoy,
  MessageSquare,
  Send,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"

import { MODULE_TREE, RECENT_GUIDES } from "@/data/mockData"
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
]

const SECONDARY_NAV = [
  { title: "피드백", to: "/feedback", icon: Send },
  { title: "설정", to: "/settings", icon: Settings },
]

const USER = {
  name: "AMS 운영팀",
  email: "ops@sdij.com",
  avatar: "",
}

export function AppSidebar({ ...props }) {
  const location = useLocation()
  const currentPath = location.pathname

  const recents = RECENT_GUIDES.slice(0, 5)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AMS Wiki</span>
                  <span className="truncate text-xs text-muted-foreground">
                    운영 가이드
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
              {MODULE_TREE.map((mod) => {
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
        <NavUser user={USER} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
