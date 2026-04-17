# 07. 컴포넌트 레퍼런스 (70+)

shadcn/ui 의 모든 컴포넌트는 `pnpm dlx shadcn@latest add <name>` 으로 설치하고 `@/components/ui/<name>` 에서 import 합니다. 본 문서는 **대표 컴포넌트의 구조·API·예제**를 정리합니다. 전체 목록과 사용법은 [공식 문서](https://ui.shadcn.com/docs/components) 를 함께 참조하세요.

## 전체 컴포넌트 목록

### 폼 / 입력
`Button`, `Button Group`, `Checkbox`, `Combobox`, `Date Picker`, `Field`, `Form`, `Input`, `Input Group`, `Input OTP`, `Label`, `Native Select`, `Radio Group`, `Select`, `Slider`, `Switch`, `Textarea`, `Toggle`, `Toggle Group`.

### 표시 / 레이아웃
`Accordion`, `Alert`, `Aspect Ratio`, `Avatar`, `Badge`, `Calendar`, `Card`, `Carousel`, `Collapsible`, `Empty`, `Hover Card`, `Item`, `Kbd`, `Progress`, `Resizable`, `Scroll Area`, `Separator`, `Skeleton`, `Spinner`, `Typography`.

### 네비게이션
`Breadcrumb`, `Menubar`, `Navigation Menu`, `Pagination`, `Sidebar`, `Tabs`.

### 오버레이 / 메뉴
`Alert Dialog`, `Command`, `Context Menu`, `Dialog`, `Drawer`, `Dropdown Menu`, `Popover`, `Sheet`, `Sonner` (토스트), `Toast` (deprecated), `Tooltip`.

### 데이터
`Chart`, `Data Table`, `Table`.

### 기타
`Direction` (RTL), `Theme`, `Use Mobile` (훅).

---

## Button

```bash
pnpm dlx shadcn@latest add button
```

**props**
- `variant`: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
- `size`: `xs` | `sm` | `default` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`
- `asChild`: 래핑된 자식을 버튼처럼 스타일 (Slot 패턴)

```tsx
<Button variant="default">확인</Button>
<Button variant="destructive" size="sm">삭제</Button>
<Button variant="outline"><PlusIcon /> 새로 만들기</Button>
<Button variant="ghost" size="icon"><MoreHorizontal /></Button>

// Link as Button
<Button asChild>
  <Link to="/dashboard">대시보드</Link>
</Button>

// 로딩
<Button disabled>
  <Spinner /> 저장 중…
</Button>
```

**아이콘 스페이싱**: `data-icon="inline-start"` / `data-icon="inline-end"` 로 아이콘 여백을 조정.

## Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>프로젝트 A</CardTitle>
    <CardDescription>최근 업데이트 3일 전</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
    </CardAction>
  </CardHeader>
  <CardContent>본문 내용…</CardContent>
  <CardFooter className="justify-end">
    <Button>열기</Button>
  </CardFooter>
</Card>
```

## Dialog

```tsx
<Dialog>
  <DialogTrigger asChild><Button>열기</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>회원 삭제</DialogTitle>
      <DialogDescription>복구할 수 없습니다.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">취소</Button></DialogClose>
      <Button variant="destructive">삭제</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```
`showCloseButton={false}` 로 닫기 X 버튼 숨김. 컨트롤드: `<Dialog open={...} onOpenChange={...}>`.

## Sheet (사이드 드로어)

```tsx
<Sheet>
  <SheetTrigger asChild><Button>열기</Button></SheetTrigger>
  <SheetContent side="right">  {/* top | right | bottom | left */}
    <SheetHeader>
      <SheetTitle>필터</SheetTitle>
      <SheetDescription>조건을 선택하세요.</SheetDescription>
    </SheetHeader>
    {/* body */}
    <SheetFooter>
      <Button>적용</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Drawer (vaul 기반 모바일 바텀시트)

모바일 전용. 데스크톱에서는 보통 `Sheet` 로 대체.

## Dropdown Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">메뉴</Button></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>내 계정</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>프로필</DropdownMenuItem>
    <DropdownMenuItem>설정 <DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>팀</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>초대</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuCheckboxItem checked>알림</DropdownMenuCheckboxItem>
    <DropdownMenuRadioGroup value="light">
      <DropdownMenuRadioItem value="light">라이트</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">다크</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

## Accordion

```tsx
<Accordion type="single" collapsible defaultValue="q1">
  <AccordionItem value="q1">
    <AccordionTrigger>환불 정책이 궁금합니다.</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>
```
`type="multiple"` 로 여러 항목 동시 오픈 가능.

## Select

```tsx
<Select defaultValue="ko">
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="언어 선택" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Asia</SelectLabel>
      <SelectItem value="ko">한국어</SelectItem>
      <SelectItem value="ja">日本語</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="de">Deutsch</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## Tabs

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">계정</TabsTrigger>
    <TabsTrigger value="password">비밀번호</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
</Tabs>
```

## Tooltip

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="ghost" size="icon"><Info /></Button></TooltipTrigger>
    <TooltipContent>도움말</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Command (⌘K 팔레트)

```tsx
<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="명령 검색…" />
  <CommandList>
    <CommandEmpty>결과 없음.</CommandEmpty>
    <CommandGroup heading="제안">
      <CommandItem>캘린더</CommandItem>
      <CommandItem>계산기</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="설정">
      <CommandItem>
        프로필 <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
      <CommandItem>
        결제 <CommandShortcut>⌘B</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

전역 ⌘K 오픈은 `CommandDialog`:
```tsx
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(v => !v) }
  }
  document.addEventListener("keydown", down)
  return () => document.removeEventListener("keydown", down)
}, [])
```

## Sidebar

```bash
pnpm dlx shadcn@latest add sidebar
```
핵심 합성:
- `SidebarProvider` (루트 · `<SidebarTrigger />`/`<Sidebar />` 와 동일 레벨에 배치)
- `Sidebar` (`side="left"|"right"`, `variant="sidebar"|"floating"|"inset"`, `collapsible="offcanvas"|"icon"|"none"`)
- `SidebarHeader`, `SidebarFooter`, `SidebarContent`
- `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`
- `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuBadge`, `SidebarMenuSub`
- `SidebarTrigger`, `SidebarRail`, `SidebarInset` (메인 영역)

`useSidebar()` 훅: `{ state, open, setOpen, isMobile, toggleSidebar }`. 기본 키보드 단축키는 `⌘B` / `Ctrl+B`.

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>Logo</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>주요</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton><Home /> 홈</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>User</SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

## Toast → Sonner (권장)

`toast` 는 deprecated. 신규는 **sonner**:

```tsx
// app 루트
import { Toaster } from "@/components/ui/sonner"
<Toaster richColors position="top-right" />

// 호출
import { toast } from "sonner"
toast.success("저장되었습니다")
toast.error("실패했습니다")
toast.info("안내")
toast.promise(save(), { loading: "저장 중…", success: "완료", error: "오류" })
toast("이벤트 생성", { action: { label: "되돌리기", onClick: undo } })
```

## Alert / Alert Dialog
- `Alert`: 인라인 배너 (info/warning/destructive 변형)
- `AlertDialog`: 파괴적 액션 확인용 모달. `<AlertDialogAction>` / `<AlertDialogCancel>` 사용.

## Calendar / Date Picker
- `Calendar` 는 `react-day-picker` 기반.
- `Date Picker` 는 `Calendar + Popover + Button` 조합 레시피.

## Avatar

```tsx
<Avatar>
  <AvatarImage src="/me.png" alt="Me" />
  <AvatarFallback>UR</AvatarFallback>
</Avatar>
```

## Input / Input OTP / Input Group / Textarea / Label
- `Input`: 표준 text input.
- `Input OTP`: 인증코드용 6자리 slot.
- `Input Group`: prefix/suffix 요소와 결합.
- `Label` + `htmlFor` 로 접근성 유지.

## Progress / Skeleton / Spinner
로딩 상태용. `Skeleton className="h-4 w-40"` 로 길이를 직접 지정.

## Scroll Area
커스텀 스크롤바 UI. Radix `ScrollArea` 래퍼.

## Table (정적 테이블)
```tsx
<Table>
  <TableHeader>
    <TableRow><TableHead>이름</TableHead><TableHead>역할</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>홍길동</TableCell><TableCell>ADMIN</TableCell></TableRow>
  </TableBody>
  <TableFooter>...</TableFooter>
</Table>
```
동적 · 정렬 · 필터 등은 [10-data-table.md](./10-data-table.md) 참조.

## 컴포넌트 소스 탐색 팁
- CLI: `pnpm dlx shadcn@latest view button` → 코드 일부 확인
- GitHub: `apps/v4/registry/new-york-v4/ui/<component>.tsx` 에 최신 원본
- 로컬 오버라이드 후에는 `shadcn@latest add button --diff` 로 상류와 비교
