# 06. 다크모드 구현

shadcn/ui는 CSS 변수(`:root` / `.dark`)로 테마를 전환합니다. 프레임워크마다 "root 요소에 `.dark` 클래스를 어떻게 붙일 것인가"만 다릅니다.

## Vite (본 프로젝트 대응)

### 1) ThemeProvider

`src/components/theme-provider.tsx`:

```tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
```

### 2) 루트 래핑

`src/main.tsx`:
```tsx
<ThemeProvider defaultTheme="system" storageKey="ams-wiki-theme">
  <App />
</ThemeProvider>
```

### 3) ModeToggle

```tsx
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Next.js (App Router)

공식 권장: **next-themes**.

```bash
pnpm add next-themes
```

`components/theme-provider.tsx`:
```tsx
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

`app/layout.tsx`:
```tsx
<html lang="ko" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  </body>
</html>
```

`ModeToggle` 는 Vite 예제와 동일(useTheme을 `next-themes` 에서 import 만 변경).

## Astro
Astro는 인라인 스크립트로 `html` 에 클래스를 주입합니다.

```astro
---
// Layout.astro
---
<script is:inline>
  const theme = localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
</script>
```

## Remix / React Router v7

- 쿠키 기반 SSR 감지 + client 클래스 토글 패턴.
- 공식 Remix 다크모드 가이드가 shadcn 문서에 포함.

## 핵심 원리 정리

1. **`.dark` 클래스**가 `<html>` 이나 `<body>` 에 있을 때 CSS 변수가 덮어써진다.
2. ThemeProvider는 클래스 토글 + `localStorage` 저장 + `prefers-color-scheme` 감지만 담당.
3. 개별 컴포넌트는 **변수만 사용**하면 되고, 다크 전용 코드를 쓸 필요가 없다.
4. Tailwind v4 에서는 `@custom-variant dark (&:is(.dark *))` 를 선언해 `dark:` 프리픽스가 동작.

## FOUC(깜빡임) 방지

SSR 프레임워크에서 첫 렌더 순간 라이트 → 다크로 깜빡이는 것을 방지하려면:
- Next.js: `next-themes` 가 자동 처리.
- Vite: `index.html` 에 인라인 스크립트 삽입해 **React 로드 이전에** 클래스 설정.
```html
<script>
  const t = localStorage.getItem("ams-wiki-theme");
  if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
</script>
```
