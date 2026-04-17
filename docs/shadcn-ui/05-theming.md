# 05. 테마·컬러 시스템

## 철학: 시맨틱 토큰 → CSS 변수 → Tailwind 유틸리티

shadcn/ui는 컴포넌트가 **"primary" / "muted" / "destructive"** 같은 의미 단위를 사용하도록 설계되어 있습니다. 실제 색상은 **CSS 변수로 간접 참조**되고, 이 변수는 Tailwind v4 의 `@theme inline` 에 매핑됩니다.

```
컴포넌트 JSX          Tailwind 클래스            CSS 변수                실제 색
<Button>           → bg-primary          → var(--primary)      → oklch(0.205 0 0)
```

이 간접화 덕분에 다크모드·테마 스위칭·브랜딩 커스텀이 **한 곳만 수정하면** 전파됩니다.

## CSS 변수 전체 목록 (new-york / Tailwind v4 / OKLCH)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  /* chart / sidebar... */
}
```

## `@theme inline` 매핑 (Tailwind v4)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

이 덕분에 `bg-primary`, `text-muted-foreground`, `rounded-lg` 등이 **변수만 바꾸면** 전체 UI에 반영됩니다.

## 토큰 의미 요약

| 그룹 | 토큰 | 언제 쓰는가 |
|------|------|-------------|
| 기본 | `background` / `foreground` | 페이지 전체 |
| 서피스 | `card`, `popover` + `-foreground` | 카드·팝오버 배경 |
| 액션 | `primary`, `secondary`, `accent`, `destructive` + `-foreground` | 버튼·배지 |
| 중립 | `muted` + `-foreground` | placeholder·도움말 |
| 인터랙션 | `border`, `input`, `ring` | 보더·폼·포커스 |
| 시각화 | `chart-1`~`chart-5` | 차트 시리즈 |
| 사이드바 | `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring` | Sidebar 전용 |

## Base Color

`init` 시 고르는 한 번의 선택. 설치될 시맨틱 값의 채도·온도가 달라집니다.
- `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist`, `taupe`

변경하려면 `shadcn apply --preset` 로 새 베이스를 적용해야 합니다.

## Radius

`--radius` 하나가 여러 스케일을 자동 생성합니다.
- `--radius-sm = calc(var(--radius) - 4px)`
- `--radius-md = calc(var(--radius) - 2px)`
- `--radius-lg = var(--radius)`
- `--radius-xl = calc(var(--radius) + 4px)`

Tailwind 유틸: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`.

## 브랜드 컬러 추가하기

예: "brand" 토큰을 추가해 회사 컬러 연동.

```css
:root {
  --brand: oklch(0.72 0.17 260);
  --brand-foreground: oklch(0.985 0 0);
}
.dark {
  --brand: oklch(0.62 0.17 260);
  --brand-foreground: oklch(0.985 0 0);
}
@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}
```

이제 `<Button className="bg-brand text-brand-foreground">` 처럼 사용할 수 있습니다.

## 왜 HSL에서 OKLCH로 바뀌었나?

- **OKLCH**: 밝기(L)·채도(C)·색상(H) — 지각적으로 균일한 색 공간. 밝기만 변경해도 채도가 유지됨.
- 다크모드에서 **접근성 명도 대비**를 계산·검증하기 용이.
- Tailwind v4 / CSS Color Level 4 에서 1급 시민.
- 구 프로젝트는 HSL 그대로 둬도 호환. 신규는 OKLCH 권장.

## 공식 프리셋 / 스타일

- `new-york` (기본, 모던 / 촘촘)
- `luma` (2026-03 추가, 밝은 스타일)
- `sera` (2026-04 추가, 세리프 제목·언더라인 컨트롤)
- `default` (deprecated)

`shadcn/create` 의 비주얼 빌더에서 프리셋 코드를 얻어 `init --preset <CODE>` 또는 `apply --preset <CODE>` 로 적용.

## 참고: 컴포넌트 내부에서의 사용 패턴

- 배경: `bg-background`, `bg-card`, `bg-popover`
- 텍스트: `text-foreground`, `text-muted-foreground`
- 보더: `border-border`
- 포커스 링: `focus-visible:ring-ring/40`
- 상태: `data-[state=open]:bg-accent`

이 패턴을 지키면 **다크모드·테마 교체·브랜드 적용 모두 0줄 수정**으로 작동합니다.
