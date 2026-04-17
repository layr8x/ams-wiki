# 04. `components.json` 완전 해부

`components.json` 은 shadcn CLI가 프로젝트를 이해하기 위한 설정 파일입니다. 초기화 시 생성되며, 대부분의 필드는 `init` 이후 **변경할 수 없거나 주의가 필요**합니다.

## 전체 스키마

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide",
  "registries": {
    "@shadcn": "https://ui.shadcn.com/r/{name}.json",
    "@acme": {
      "url": "https://registry.acme.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

## 필드별 설명

### `$schema`
`https://ui.shadcn.com/schema.json` 참조. IDE에서 자동완성·검증을 받기 위해 반드시 기재.

### `style`
| 값 | 설명 |
|----|------|
| `new-york` | 현 표준. 더 촘촘한 간격과 square 코너. |
| `default` | **deprecated** — 신규 프로젝트는 사용 금지. |
| `luma`, `sera` 등 | 2026년 이후 추가된 새 스타일 |
> **init 이후 변경 불가**. 변경하려면 `shadcn apply --preset` 사용.

### `rsc`
`true` 면 React Server Component 모드 — 필요한 컴포넌트 상단에 `"use client"` 를 자동 주입.  
Next.js App Router → `true`, Vite/Remix v2 미만 → `false`.

### `tsx`
`true` = `.tsx` 생성, `false` = `.jsx` 생성 (TypeScript 미사용 프로젝트).  
본 AMS Wiki 는 `false`.

### `tailwind`
| 하위 필드 | 설명 |
|-----------|------|
| `config` | `tailwind.config.*` 경로. **Tailwind v4 에서는 공란** 권장. |
| `css` | Tailwind import 가 있는 CSS 엔트리 파일 경로 (예: `src/index.css`). |
| `baseColor` | `neutral` / `stone` / `zinc` / `mauve` / `olive` / `mist` / `taupe`. **init 이후 변경 불가**. |
| `cssVariables` | `true` = 시맨틱 토큰(`background`, `foreground`...) / `false` = 인라인 Tailwind 컬러. |
| `prefix` | Tailwind 유틸 프리픽스 (예: `tw-`). 충돌 방지용. |

### `aliases`
| 키 | 표준 값 | 의미 |
|----|---------|------|
| `components` | `@/components` | 범용 컴포넌트 루트 |
| `utils` | `@/lib/utils` | `cn()` 위치 |
| `ui` | `@/components/ui` | shadcn UI 컴포넌트 디렉토리 |
| `lib` | `@/lib` | 라이브러리 모듈 |
| `hooks` | `@/hooks` | 커스텀 훅 |

> `tsconfig.json` 의 `paths` 와 **정확히 일치**해야 CLI가 경로를 해석할 수 있습니다.

### `iconLibrary`
`lucide` (기본) 또는 `tabler` 등. `migrate icons` 로 전환 가능.

### `registries`
여러 레지스트리를 등록할 수 있습니다. 값은 두 형태:

**(a) 간단 형태**: URL 템플릿
```json
"@v0": "https://v0.dev/chat/b/{name}"
```

**(b) 고급 형태**: 객체 (헤더/쿼리/인증)
```json
"@private": {
  "url": "https://reg.company.com/{name}.json",
  "headers": { "Authorization": "Bearer ${REGISTRY_TOKEN}" },
  "params": { "team": "core" }
}
```

`${ENV}` 문법으로 환경변수를 헤더/파라미터에 주입할 수 있어 **프라이빗 레지스트리 인증**이 가능합니다.

## 흔한 실수

- ❌ `"style": "default"` 로 새 프로젝트 시작 → 최신 컴포넌트와 호환 X.
- ❌ `aliases` 와 `tsconfig.paths` 불일치 → CLI는 파일 생성하지만 런타임 import 에러.
- ❌ Tailwind v4에서 `"config": "tailwind.config.ts"` 를 그대로 두면 CLI가 v3 경로로 동작.
- ❌ 모노레포에서 워크스페이스마다 `components.json` 이 없으면 CLI가 파일을 엉뚱한 곳에 설치.

## 본 프로젝트(AMS Wiki) 현재 설정

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "aliasPrefix": "@",
  "baseColor": "slate",
  "baseFont": "'Pretendard', sans-serif"
}
```
`style: default` 는 deprecated 이므로, 향후 스타일 변경 시 `shadcn apply --preset new-york-nova` 등으로 마이그레이션을 검토해야 합니다. 자세한 설명은 [16-ams-wiki-integration.md](./16-ams-wiki-integration.md).
