# 12. 모노레포 구성

shadcn/ui CLI는 **Turborepo + pnpm workspaces** 기반 모노레포를 지원합니다. 여러 앱이 공통 UI 라이브러리를 공유하는 구조에 최적.

## 초기화

```bash
pnpm dlx shadcn@latest init --monorepo
```
프레임워크 템플릿(Next.js / Vite / React Router / TanStack Start / Astro) 중 선택 → 두 워크스페이스가 자동 생성됩니다.

## 기본 폴더 구조

```
.
├── apps
│   └── web                # 애플리케이션 워크스페이스
│       ├── app/page.tsx
│       ├── components/
│       ├── components.json
│       └── package.json
├── packages
│   └── ui                 # 공유 UI 라이브러리
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/utils.ts
│       │   └── styles/globals.css
│       ├── components.json
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 워크스페이스별 `components.json`

### `apps/web/components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "app/globals.css", "baseColor": "zinc", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components",
    "hooks": "@/hooks",
    "lib": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

### `packages/ui/components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "src/styles/globals.css", "baseColor": "zinc", "cssVariables": true },
  "aliases": {
    "components": "@workspace/ui/components",
    "utils":      "@workspace/ui/lib/utils",
    "ui":         "@workspace/ui/components",
    "hooks":      "@workspace/ui/hooks",
    "lib":        "@workspace/ui/lib"
  },
  "iconLibrary": "lucide"
}
```

> `style`, `iconLibrary`, `baseColor` 는 **모든 워크스페이스에서 동일**해야 합니다.

## 컴포넌트 추가

```bash
cd apps/web
pnpm dlx shadcn@latest add button card dialog
```
CLI가 자동으로:
1. 재사용 가능한 원자 컴포넌트 → `packages/ui/src/components/`
2. 앱 전용 컴포넌트(페이지, 섹션) → `apps/web/components/`
에 배치하고 공통 의존성은 `packages/ui` 에 설치합니다.

## 컴포넌트 사용

```tsx
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { useTheme } from "@workspace/ui/hooks/use-theme"
import { cn } from "@workspace/ui/lib/utils"
```

## pnpm-workspace.yaml

```yaml
packages:
  - apps/*
  - packages/*
```

## `packages/ui/package.json` 주요 필드

```json
{
  "name": "@workspace/ui",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./hooks/*":      "./src/hooks/*.ts",
    "./lib/*":        "./src/lib/*.ts",
    "./styles/*":     "./src/styles/*.css"
  }
}
```
Next.js 에서는 `transpilePackages: ["@workspace/ui"]` 를 `next.config.js` 에 추가.

## Tailwind v4 팁

- `components.json` 의 `tailwind.config` 는 **공란**으로 둡니다 (v4는 config 파일 불필요).
- `@workspace/ui/styles/globals.css` 를 앱의 엔트리 CSS 에서 `@import` 합니다.
- 앱마다 팔레트를 다르게 하려면 앱쪽 CSS 에서 `:root` 변수만 오버라이드.

## Turbo 파이프라인 예시

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build":   { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "lint":    { "dependsOn": ["^lint"] },
    "dev":     { "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^typecheck"] }
  }
}
```

## 장점

1. **중복 제거** — UI 로직과 패키지 하나로 다수 앱에 공유.
2. **점진적 개편** — 한 앱만 새 스타일로 먼저 전환 가능.
3. **빌드 캐싱** — Turbo가 UI 변경 없는 빌드 스킵.
4. **버저닝 없음** — 워크스페이스 프로토콜 덕에 내부 배포 단순.

## 흔한 함정

- ❌ 워크스페이스별 `components.json` 누락 → `shadcn add` 가 엉뚱한 곳에 설치.
- ❌ 앱과 UI 패키지에서 Tailwind `baseColor` 불일치 → 다크모드에서 색 꼬임.
- ❌ `exports` 필드 누락으로 `@workspace/ui/components/button` 해석 실패.
- ❌ Next.js 에서 `transpilePackages` 빠뜨려 ESM/CJS 이슈.
