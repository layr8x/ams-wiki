# 11. Registry 시스템 (컴포넌트 배포)

**Registry** 는 shadcn 이 제공하는 **프레임워크 중립적 코드 배포 시스템**입니다. 컴포넌트·훅·페이지·테마·설정 파일을 JSON 스키마로 기술해 **URL만 알면 설치**할 수 있습니다. 공식 `@shadcn` 레지스트리 뿐 아니라 누구나 자체 레지스트리를 운영할 수 있습니다.

## 왜 필요한가?

- 사내 공통 컴포넌트(로고 헤더, 권한 가드, 디자인 시스템)를 여러 서비스에서 재사용
- 고객별 커스텀 테마 배포
- AI 도구(v0, 클로드)가 구조화된 메타데이터로 컴포넌트를 학습·주입

## 핵심 파일 두 가지

### 1) `registry.json` (레지스트리 엔트리)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://registry.acme.com",
  "items": [
    { "name": "auth-form", "type": "registry:block", "files": [...] }
  ]
}
```

### 2) `registry-item.json` (개별 아이템)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "auth-form",
  "type": "registry:block",
  "title": "Auth Form",
  "description": "이메일·비밀번호 + OAuth 로그인 폼",
  "dependencies": ["zod@^3.23", "react-hook-form@^7.51"],
  "devDependencies": [],
  "registryDependencies": ["button", "input", "label", "card"],
  "files": [
    { "path": "blocks/auth-form/page.tsx", "type": "registry:page",
      "target": "app/login/page.tsx" },
    { "path": "blocks/auth-form/components/form.tsx", "type": "registry:component" }
  ],
  "cssVars": {
    "light": { "brand": "oklch(0.72 0.17 260)" },
    "dark":  { "brand": "oklch(0.62 0.17 260)" }
  },
  "tailwind": { "config": {} },
  "docs": "https://registry.acme.com/docs/auth-form",
  "categories": ["auth"]
}
```

## 지원 타입

| `type` | 용도 |
|--------|------|
| `registry:style` | 새로운 스타일 (폰트·라운드·컬러 팔레트 통합) |
| `registry:theme` | 컬러 팔레트 / CSS 변수 묶음 |
| `registry:block` | 페이지 + 컴포넌트 세트 (완성형 기능) |
| `registry:component` | 일반 컴포넌트 |
| `registry:ui` | shadcn UI 기본 컴포넌트 (표준 패키지) |
| `registry:hook` | 재사용 React 훅 |
| `registry:lib` | 라이브러리 모듈 (`lib/utils.ts` 등) |
| `registry:page` | 단일 페이지 파일 |
| `registry:file` | 임의 설정/문서 파일 |

## 필드 요약

- `name` (필수): kebab-case 권장
- `type` (필수): 위 타입 중 하나
- `files` (필수): 파일 배열. 각 `{path, type, target?}`
- `title`, `description`: AI·검색에서 유용
- `dependencies` / `devDependencies`: npm 패키지 (`pkg@version` 형태)
- `registryDependencies`: 사전 설치가 필요한 다른 레지스트리 아이템 (이름 또는 URL)
- `cssVars`: `theme` / `light` / `dark` 별 CSS 변수 맵
- `tailwind`: 플러그인이나 config 조각
- `css`: 추가 CSS 스니펫
- `docs`: 문서 URL (MCP 에서 활용)
- `categories`: 카테고리 태그

## 디렉토리 배치 규칙

```
registry/
└── [STYLE]/            # new-york, luma 등
    └── [NAME]/
        ├── page.tsx    # or components/*.tsx
        └── ...
```
- 파일 간 import 는 **상대경로가 아닌 `@/registry/...`** 를 사용 (CLI가 경로 재작성).

## 빌드

`package.json`:
```json
{ "scripts": { "registry:build": "shadcn build" } }
```
실행:
```bash
pnpm registry:build
# → public/r/auth-form.json, public/r/index.json 생성
```
배포: 정적 호스팅(Vercel, Cloudflare Pages, S3)에 업로드.

## 설치 (소비자 측)

### URL 직접
```bash
pnpm dlx shadcn@latest add https://registry.acme.com/r/auth-form.json
```

### Namespace 등록 (권장)
`components.json` 에 레지스트리 등록:
```json
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json"
  }
}
```
그 후:
```bash
pnpm dlx shadcn@latest add @acme/auth-form
pnpm dlx shadcn@latest view @acme/auth-form
pnpm dlx shadcn@latest search @acme -q "form"
```

## 인증(Private) 레지스트리

```json
{
  "registries": {
    "@acme": {
      "url": "https://registry.acme.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${REGISTRY_TOKEN}" },
      "params": { "team": "core" }
    }
  }
}
```
- `.env.local` 에 `REGISTRY_TOKEN=xxx`
- `${ENV}` 는 CLI가 자동 치환
- 서버 측 Auth 는 자유롭게 구현 (JWT, mTLS, HMAC 등)

## 예제 아이템들

### Style
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "acme-style",
  "type": "registry:style",
  "dependencies": ["@tabler/icons-react"],
  "registryDependencies": ["login-01", "calendar"],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "brand": "oklch(0.7 0.2 260)" },
    "dark":  { "brand": "oklch(0.6 0.2 260)" }
  }
}
```

### Theme
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "royal",
  "type": "registry:theme",
  "cssVars": {
    "light": { "background": "oklch(1 0 0)", "foreground": "oklch(0.141 0.005 285)" },
    "dark":  { "background": "oklch(0.141 0.005 285)", "foreground": "oklch(0.985 0 0)" }
  }
}
```

### Hook
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "use-debounce",
  "type": "registry:hook",
  "dependencies": ["react"],
  "files": [{ "path": "hooks/use-debounce.ts", "type": "registry:hook" }]
}
```

## 네임스페이스 명명 규칙

- 패턴: `@[a-zA-Z0-9_-]+`
- 공식: `@shadcn`, `@v0`
- 조직: `@acme`, `@acme-design-system`
- 공개/비공개 무관

## LLM 친화 가이드

AI가 잘 읽게 하려면:
1. `description` 을 **무엇을 해결하는지** 명확히 기술
2. `categories` 로 용도 태깅 (`auth`, `dashboard`, `form` ...)
3. `docs` URL 제공 → MCP가 컨텍스트 포함
4. `dependencies` 를 빠짐없이 기재 (미기재 시 AI가 추측 → 실패 확률↑)

## CI 자동화 예시

```yaml
# .github/workflows/registry.yml
name: Publish Registry
on:
  push: { branches: [main] }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install
      - run: pnpm registry:build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: acme-registry
          directory: public/r
```
