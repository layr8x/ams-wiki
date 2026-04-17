# 02. 설치 가이드 (프레임워크별)

shadcn/ui는 **프레임워크 비종속**이며, 공식적으로 아래 프레임워크의 설치 레시피를 제공합니다.

- Next.js (App Router / Pages Router 공통)
- Vite + React
- React Router (v7, 구 Remix)
- TanStack Start / TanStack Router
- Astro
- Laravel
- Gatsby
- 수동 (Manual)

> 모든 예제는 **pnpm** 기준. `npm` / `yarn` / `bun` 으로 치환해도 동작합니다. `pnpm dlx` ↔ `npx`.

## 0. 사전 점검

- Node.js 20+ 권장
- TypeScript 프로젝트가 기본(옵션으로 JSX 모드 가능 — `tsx: false`)
- Tailwind CSS가 이미 설치되어 있거나, CLI가 설치해 줄 것

## 1. 설치 경로 3가지

shadcn/ui는 보통 3가지 방식으로 시작할 수 있습니다.

### (A) `shadcn/create` 비주얼 프리셋 빌더 (권장)
https://ui.shadcn.com/create 에서 베이스 컬러, 폰트, 아이콘 등을 시각적으로 고른 뒤 출력되는 명령을 실행합니다.

```bash
pnpm dlx shadcn@latest init --preset <CODE> --template next
```

### (B) CLI로 새 프로젝트 스캐폴드
```bash
pnpm dlx shadcn@latest init -t next        # Next.js
pnpm dlx shadcn@latest init -t vite        # Vite
pnpm dlx shadcn@latest init -t react-router # React Router v7
pnpm dlx shadcn@latest init -t start       # TanStack Start
pnpm dlx shadcn@latest init -t astro       # Astro
pnpm dlx shadcn@latest init -t laravel     # Laravel
```
모노레포 부트스트랩은 `--monorepo` 플래그. 기본값만으로 진행은 `-d`.

### (C) 기존 프로젝트에 수동 적용
```bash
pnpm dlx shadcn@latest init
```
대화형 질문에 답하면 `components.json`, `lib/utils`, CSS 변수 등이 생성됩니다.

## 2. Next.js (App Router) 설치

### 2-1. 프로젝트 전제
```bash
pnpm create next-app@latest my-app --ts --tailwind --eslint
cd my-app
```

### 2-2. `tsconfig.json` 경로 별칭 확인
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2-3. shadcn 초기화 + 컴포넌트 추가
```bash
pnpm dlx shadcn@latest init       # 대화형 초기화
pnpm dlx shadcn@latest add button # 컴포넌트 설치
```

### 2-4. 사용
```tsx
// app/page.tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return <Button>Click me</Button>
}
```

## 3. Vite + React 설치

Vite는 현재 본 프로젝트(AMS Wiki)에서 채택한 번들러이므로 특별히 자세히 다룹니다.

### 3-1. Vite 프로젝트 생성
```bash
pnpm create vite@latest my-app -- --template react-ts
cd my-app
```

### 3-2. Tailwind v4 설치
```bash
pnpm add tailwindcss @tailwindcss/vite
```

`src/index.css`:
```css
@import "tailwindcss";
```

### 3-3. 경로 별칭 설정
`tsconfig.json` 과 `tsconfig.app.json` 양쪽에 추가:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`vite.config.ts`:
```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```
`pnpm add -D @types/node` 도 잊지 말 것.

### 3-4. shadcn 초기화
```bash
pnpm dlx shadcn@latest init
```
`components.json`이 생성됩니다.

### 3-5. 컴포넌트 추가 & 사용
```bash
pnpm dlx shadcn@latest add button card dialog
```

```tsx
import { Button } from "@/components/ui/button"

export default function App() {
  return <Button variant="outline">Hello</Button>
}
```

## 4. React Router (v7, 구 Remix)
```bash
pnpm dlx shadcn@latest init -t react-router
```
루트 레이아웃에 `<Toaster />` 등 전역 컴포넌트를 배치하는 점을 제외하면 Next.js와 동일.

## 5. TanStack Start / Router
```bash
pnpm dlx shadcn@latest init -t start
```
Server-Client 경계가 다르므로 `"use client"`가 필요한 컴포넌트는 자동 처리됨(`rsc: true`).

## 6. Astro
```bash
pnpm dlx shadcn@latest init -t astro
```
Astro는 React를 아일랜드로 삽입하므로 `client:*` 디렉티브를 반드시 지정해야 상호작용 컴포넌트가 동작합니다.

## 7. Laravel
```bash
laravel new my-app        # 먼저 라라벨 앱을 만들어야 함
cd my-app
pnpm dlx shadcn@latest init -t laravel
```

## 8. 수동(Manual) 설치

CLI 없이 직접 세팅하고 싶을 때:

```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
pnpm add radix-ui          # v2+: 단일 패키지
```

`lib/utils.ts`:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

그리고 [05-theming.md](./05-theming.md) 의 CSS 변수 블록과 `@theme inline`을 `src/index.css`에 붙여넣으면 됩니다. 이후 https://ui.shadcn.com/docs/components/button 의 소스를 복사하여 `src/components/ui/button.tsx` 로 저장하면 수동 설치 완료.

## 9. 설치 후 검증 체크리스트

- [ ] `components.json` 존재 + `$schema`·`style`·`tailwind`·`aliases` 모두 채워짐
- [ ] `@/` 경로 별칭으로 `import { Button } from "@/components/ui/button"` 이 에러 없이 동작
- [ ] `src/index.css` 상단에 `@import "tailwindcss";` 또는 Tailwind CLI 주입 확인
- [ ] `:root` / `.dark` 에 `--background`, `--foreground` 등 시맨틱 토큰 존재
- [ ] `pnpm dlx shadcn@latest info` 실행 시 프로젝트 정보가 정상 출력
- [ ] 다크모드 토글이 동작 ([06-dark-mode.md](./06-dark-mode.md))

## 10. 본 프로젝트(AMS Wiki)의 현황

본 프로젝트는 **Vite + React 19 + Tailwind v4 + JSX(tsx:false)** 조합을 사용합니다. 자세한 내용은 [16-ams-wiki-integration.md](./16-ams-wiki-integration.md) 참조.
