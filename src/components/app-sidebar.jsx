import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BookOpen, ClipboardList, Calendar, CreditCard, Users,
  MessageSquare, Settings, HelpCircle, Bell, MessageCircle,
  LayoutGrid, FileText, Clock, ChevronRight,
} from "lucide-react"

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

import { MODULE_TREE, RECENT_GUIDES } from "@/data/mockData"

const MODULE_ICONS = {
  ClipboardList, BookOpen, Calendar, CreditCard, Users,
  MessageSquare, Settings,
}

export function AppSidebar(props) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AMS Wiki</span>
                  <span className="truncate text-xs text-muted-foreground">운영 가이드 센터</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* ─── 메인 네비 ─── */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="대시보드">
                <NavLink to="/" end>
                  <LayoutGrid />
                  <span>대시보드</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/guides"} tooltip="전체 가이드">
                <NavLink to="/guides">
                  <FileText />
                  <span>전체 가이드</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ─── 최근 조회 ─── */}
        {RECENT_GUIDES.length > 0 && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>최근 조회</SidebarGroupLabel>
            <SidebarMenu>
              {RECENT_GUIDES.slice(0, 3).map((r) => (
                <SidebarMenuItem key={r.id}>
                  <SidebarMenuButton asChild size="sm" isActive={pathname === `/guides/${r.id}`}>
                    <NavLink to={`/guides/${r.id}`}>
                      <Clock className="opacity-60" />
                      <span>{r.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* ─── 카테고리 트리 ─── */}
        <SidebarGroup>
          <SidebarGroupLabel>카테고리</SidebarGroupLabel>
          <SidebarMenu>
            {MODULE_TREE.map((m) => {
              const Icon = MODULE_ICONS[m.icon] || BookOpen
              const hasActive = m.guides.some((g) => pathname === `/guides/${g.id}`)
              return (
                <Collapsible
                  key={m.id}
                  asChild
                  defaultOpen={hasActive || m.guides.length > 0}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={m.label}>
                        <Icon />
                        <span>{m.label}</span>
                        <span className="ml-auto mr-1 font-mono text-[11px] text-muted-foreground tabular-nums">
                          {m.guides.length}
                        </span>
                        <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {m.guides.map((g) => (
                          <SidebarMenuSubItem key={g.id}>
                            <SidebarMenuSubButton asChild isActive={pathname === `/guides/${g.id}`}>
                              <NavLink to={`/guides/${g.id}`}>
                                <span>{g.label}</span>
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
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/faq"} tooltip="FAQ">
              <NavLink to="/faq">
                <HelpCircle />
                <span>FAQ</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/updates"} tooltip="업데이트 이력">
              <NavLink to="/updates">
                <Bell />
                <span>업데이트 이력</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/feedback"} tooltip="오류 제보">
              <NavLink to="/feedback">
                <MessageCircle />
                <span>오류 제보</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
