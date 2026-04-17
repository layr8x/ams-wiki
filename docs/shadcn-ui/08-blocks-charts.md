# 08. Blocks & Charts

## Blocks — 완성형 UI 조합

Blocks 는 **여러 컴포넌트가 조립된 완성된 페이지/섹션** 단위입니다. 로그인·회원가입·대시보드·사이드바·캘린더 등 바로 복사해서 쓸 수 있는 템플릿들이 제공됩니다.

### 카테고리

| 카테고리 | 내용 |
|----------|------|
| **Sidebar** | 수십 종의 사이드바 레이아웃 (collapsible, submenu, team switcher, tree view 등) |
| **Dashboard** | 대시보드 (카드·차트·데이터 테이블 포함 완성형) |
| **Login** | 로그인 화면 (email, OAuth, social, side image 등) |
| **Signup** | 회원가입 + 검증 플로우 |
| **Authentication** | 2FA, 비밀번호 재설정, OTP 등 |
| **Calendar** | 주간·월간 캘린더 레이아웃 |
| **Charts** | 여러 차트 유형을 조합한 섹션 |

각 블록은 고유 ID(`dashboard-01`, `sidebar-07`, `login-04` ...)를 가집니다.

### 설치 방법

```bash
pnpm dlx shadcn@latest add dashboard-01
pnpm dlx shadcn@latest add sidebar-07
pnpm dlx shadcn@latest add login-03
```

CLI는 **페이지(`app/.../page.tsx`) + 관련 컴포넌트 파일** 을 동시에 생성하고, 누락된 의존성 컴포넌트(button, card 등)도 함께 설치합니다.

### 설치 전 미리보기

```bash
pnpm dlx shadcn@latest view dashboard-01
```
공식 사이트에서도 각 블록마다 라이브 프리뷰·코드 뷰어·v0.dev 에서 수정 버튼을 제공합니다.

### 본 프로젝트 적용 아이디어

- `sidebar-*` 블록을 참고해 AMS Wiki의 좌측 트리 네비게이션을 모듈화
- `dashboard-*` 블록을 관리자 통계 페이지에 적용
- `login-*` 블록을 Supabase Auth + Google OAuth 와 결합

---

## Charts — Recharts 래퍼

shadcn/ui 의 차트 시스템은 **Recharts 를 얇게 감싸서 테마·툴팁·범례를 일관화**한 레시피 모음입니다. 즉, 차트 자체는 Recharts API를 그대로 쓰고, 시각적 일관성(컬러·폰트·보더)만 공통화합니다.

### 핵심 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `ChartContainer` | 차트를 감싸는 래퍼. `config` 받아 컬러 CSS 변수 주입. `min-h-*` 또는 `aspect-*` 클래스로 반응형. |
| `ChartTooltip` + `ChartTooltipContent` | 테마 친화적 툴팁. `indicator="dot"|"line"|"dashed"`, `hideLabel`, `hideIndicator`, `labelKey`, `nameKey` |
| `ChartLegend` + `ChartLegendContent` | 범례. 자동 컬러 매칭, `nameKey` 로 라벨 커스텀 |
| `ChartStyle` | 컨피그 기반 동적 CSS 주입 (내부 유틸) |

### 설치
```bash
pnpm dlx shadcn@latest add chart
pnpm add recharts
```

### ChartConfig 패턴

```tsx
import { type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
    icon: Monitor, // 선택: 범례에 아이콘
  },
} satisfies ChartConfig
```

### Bar Chart 예시

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} />
    <YAxis tickLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile"  fill="var(--color-mobile)"  radius={4} />
  </BarChart>
</ChartContainer>
```
`var(--color-desktop)` 처럼 **config key + color-** 로 참조 → 다크모드 전환 시 자동 반영.

### Area / Line / Pie

```tsx
// Area
<AreaChart data={data}>
  <Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" stroke="var(--color-revenue)" />
</AreaChart>

// Line
<LineChart data={data}>
  <Line dataKey="visitors" type="monotone" stroke="var(--color-visitors)" strokeWidth={2} />
</LineChart>

// Pie
<PieChart>
  <Pie data={slices} dataKey="value" nameKey="browser" innerRadius={60} />
</PieChart>
```

### 컬러 지정 3가지 방식

1. **CSS 변수 (권장)**: `color: "var(--chart-1)"` — 테마 전환 자동.
2. **직접 값**: `color: "#2563eb"` 또는 `hsl(222 89% 55%)`.
3. **인라인 var**: 컴포넌트에서 `fill="var(--color-KEY)"` 로 config 키를 참조.

### Tips

- 다크모드에서 차트 컬러가 어둡다면 `--chart-1` ~ `--chart-5` 를 `.dark` 블록에 별도 정의.
- `tickLine={false}` / `axisLine={false}` 로 노이즈 제거 → shadcn 특유의 미니멀 룩.
- 툴팁에서 숫자 포맷은 `formatter`(Recharts) 에서 `Intl.NumberFormat` 으로 처리.
- 차트 자체도 결국 Recharts 이므로 Recharts 문서가 최종 소스 오브 트루스.
