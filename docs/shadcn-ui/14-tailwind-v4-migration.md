# 14. Tailwind v4 마이그레이션 & 변경점

shadcn/ui 는 2025-02 에 Tailwind v4 정식 지원을 시작했습니다. 핵심 철학은 **"컨피그 파일 최소화 + CSS 변수 중심"**.

## v3 → v4 주요 변경

| 영역 | v3 | v4 |
|------|----|----|
| 설정 | `tailwind.config.{js,ts}` 필수 | **CSS 파일에서 `@theme` 로 대체**. config 파일은 선택 |
| 컬러 | HSL (`hsl(var(--primary))`) | **OKLCH** (`oklch(...)` 직접) |
| 다크모드 | `darkMode: "class"` 설정 | `@custom-variant dark (&:is(.dark *))` 로 선언 |
| 애니메이션 | `tailwindcss-animate` | **`tw-animate-css`** (후속) |
| 커서 기본 | 버튼 `cursor-pointer` | **`cursor-default`** → 필요 시 수동 지정 |
| 클래스 네이밍 | `w-4 h-4` | **`size-4`** (단일 유틸) 선호 |
| forwardRef | 컴포넌트에 필수 | **제거**. 함수 컴포넌트 + `data-slot` 사용 |
| 토스트 | `Toast` + `useToast` | **Sonner** (권장) — 기존 `Toast` deprecated |
| 기본 스타일 | `default` | **`new-york`** — `default` deprecated |

## 새 엔트리 CSS 템플릿

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... 섹션별 변수 ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... color-* 들 ... */
}
```

## 마이그레이션 절차 (기존 v3 프로젝트)

1. **Tailwind v4 설치**
   ```bash
   pnpm remove tailwindcss postcss autoprefixer tailwindcss-animate
   pnpm add tailwindcss@latest @tailwindcss/vite tw-animate-css
   ```
2. **CSS 변수 재작성** — 색상은 OKLCH 로. HSL 래핑(`hsl(var(--primary))`) 제거.
3. **`@theme inline`** 블록 추가 — `--color-*` 매핑.
4. **`@custom-variant dark (&:is(.dark *))`** 선언.
5. **`data-slot` 속성** — 각 shadcn 컴포넌트 루트에 `data-slot` 부여. 스타일을 `[data-slot=title]` 등으로 건다.
6. **chart config** 업데이트 — `color: "hsl(var(--chart-1))"` → `color: "var(--chart-1)"`.
7. **deprecated 제거** — `Toast` → `Sonner`, `tailwindcss-animate` → `tw-animate-css`.
8. **`shadcn apply --preset` 사용** — 한 번에 최신 테마/스타일 재적용.

## 새 기능 활용

### `@theme inline`
CSS 변수를 Tailwind 유틸에 연결. 별도 config 파일 없이 테마 토큰 확장 가능.

### `@custom-variant`
임의 CSS 조건을 Tailwind variant 로 승격. 예: `hocus:` = hover + focus:
```css
@custom-variant hocus (&:hover, &:focus-visible);
```

### `data-slot`
컴포넌트 합성의 각 "부품"에 안정적인 선택자를 제공:
```css
[data-slot="card-header"] { padding-bottom: 0.5rem; }
```
라이브러리 사용자가 CVA 없이도 특정 영역에 스타일을 붙일 수 있음.

### 새 유틸
- `size-4` (= `w-4 h-4`)
- 그리드 컨테이너 `grid-cols-subgrid`
- 3D 변환 `rotate-x-*`, `rotate-y-*`
- 컨테이너 쿼리 기본 내장

## 자주 하는 실수

- ❌ `@import "tailwindcss/base";` 식 v3 레이어 import 를 남겨둠 → v4는 단일 `@import "tailwindcss";` 만.
- ❌ `components.json.tailwind.config` 를 `tailwind.config.ts` 로 지정 → v4 프로젝트는 **빈 문자열** 또는 필드 제거.
- ❌ `hsl(var(--...))` 를 지우지 않아 컬러가 잘못 렌더링.
- ❌ `darkMode: "class"` 옵션을 config 에서 찾다가 못 찾음 → `@custom-variant dark (&:is(.dark *));` 로 대체.

## 호환성 매트릭스 (2026-04 기준)

- Next.js 15+, React 19+
- Vite 5+ / 6+
- Node.js 20+
- 브라우저: ES2024 타깃 (IE/엣지 레거시 미지원)

## 학습 체크

- [ ] `@import "tailwindcss"` 한 줄로 Tailwind 로드 가능 설명 가능
- [ ] OKLCH 색상을 편집해 UI 변화 확인 가능
- [ ] `shadcn apply --preset` 으로 기존 프로젝트 스타일 일괄 업데이트
- [ ] `Toast → Sonner` 마이그레이션 수행
