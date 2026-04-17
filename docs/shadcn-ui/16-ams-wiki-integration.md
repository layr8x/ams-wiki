# 16. AMS Wiki 에서의 shadcn/ui 통합 가이드

본 문서는 앞선 이론을 **본 프로젝트(AMS Wiki)의 실제 구성**에 연결합니다. 기여자가 shadcn/ui 관련 코드를 수정할 때 참고하세요.

## 현재 채택 스택 요약

| 항목 | 값 | 비고 |
|------|----|-----|
| 번들러 | Vite 8 | `vite.config.js` |
| 언어 | React 19 / **JSX** (TypeScript 아님) | `tsx: false` |
| 스타일링 | Tailwind CSS **v4** (`@tailwindcss/vite`) | `src/index.css` 에서 `@import "tailwindcss"` |
| shadcn 스타일 | **`default`** (deprecated) | 추후 `new-york` 으로 전환 검토 |
| Base Color | `slate` | |
| 폰트 | Pretendard | `@font-face` 로 자체 로드 |
| 아이콘 | lucide-react | 일부 아이콘은 커스텀 svg |
| 토스트 | 자체 `src/components/ui/toast.jsx` | Sonner 마이그레이션 권장 |

## `components.json` (현행)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "aliasPrefix": "@",
  "baseColor": "slate",
  "baseFont": "'Pretendard', sans-serif",
  "components": { "…" }
}
```

> 주의: 최신 shadcn CLI는 `aliasPrefix` 대신 `aliases` 객체를 사용합니다. 향후 `init --force` 또는 수동 편집으로 표준 형태로 옮기는 것이 좋습니다.

## 설치된 컴포넌트 현황

`src/components/ui/` 에 존재 (기준 `main` 브랜치):

- 폼: `input`, `textarea`, `label`, `select`, `checkbox`, `radio`, `button`
- 표시: `alert`, `badge`, `card`, `skeleton`, `progress`, `avatar`, `separator`
- 오버레이: `dialog`, `sheet`, `tooltip`, `dropdown-menu`, `toast`
- 네비게이션: `tabs`, `scroll-area`, `collapsible`, `command`
- 데이터: `table`

배럴 파일 `src/components/ui/index.js` 로 한 번에 import 가능:
```js
import { Button, Card, Dialog, toast } from "@/components/ui"
```

## CSS 변수 (요약)

`src/index.css` 는 Tailwind v4 `@theme` 블록에 shadcn 표준 토큰을 선언하며, `html.dark` 로 다크 모드를 오버라이드합니다. 커스텀 브랜드 색 `--color-blue-*` 도 같은 위치에서 관리.

## 운영 규칙

### 1) 컴포넌트 수정 가이드
- `src/components/ui/*` 수정 시 **반드시 배럴 `index.js` 업데이트 여부** 확인.
- cn() 유틸(`src/lib/utils.js`)을 사용해 클래스 병합.
- Tailwind 유틸을 무분별 추가하지 말고 **가능한 한 시맨틱 토큰**(`bg-primary`) 사용.

### 2) 새 shadcn 컴포넌트 추가
```bash
pnpm dlx shadcn@latest add <component> --cwd . --path src/components/ui
```
- 설치 후 `index.js` 에 export 추가.
- 필요 시 JSX로 다운그레이드 (`tsx: false` 이므로 CLI가 `.jsx` 생성).
- 한국어 메시지/레이블을 직접 하드코딩하지 말고 `src/locales/ko.json` 에 등록.

### 3) 다크모드
`ThemeProvider` 가 `<html class="dark">` 를 토글합니다.
- 조건부 클래스에 `dark:*` 를 사용 가능.
- 브랜드 색을 쓸 때는 `bg-[--color-blue-600]` 대신 `bg-blue-600` 을 사용해도 동작 (v4에서 `--color-*` 토큰이 그대로 유틸).

### 4) 컴포넌트 목록 수정 시 주의
- 기존 버전과의 diff를 확인: `shadcn add <name> --diff`.
- 맞춤 스타일이 들어간 상태에서 상류 버전을 덮어쓰면 회귀 가능.

## 마이그레이션 로드맵 (권장)

### Phase 1. 설정 현행화
- `components.json` 을 현행 스키마로 업데이트 — `aliases` 객체 도입.
- Tailwind `config` 경로 제거 (v4).
- `style: default` → `new-york` 검토. 전환 시 `shadcn apply --preset new-york-nova` 활용.

### Phase 2. 토스트 마이그레이션
- `Toast` / `useToast` → **Sonner** 로 교체.
- 전역 `<Toaster />` 위치를 `Layout.jsx` 에 고정, API를 단일화.

### Phase 3. 접근성 감사
- 모든 `Button`/`DropdownMenuTrigger` 의 `aria-label` / `sr-only` 점검.
- `Dialog`/`Sheet` 의 `DialogTitle` + `DialogDescription` 필수화.
- 폼 컴포넌트가 `Field`/`FieldError` 구조를 따르는지 확인 (`09-forms.md`).

### Phase 4. 데이터 테이블 도입
- 현재 정적 `Table` 만 있음. 관리자 페이지에 `@tanstack/react-table` 기반 DataTable 적용 ([10-data-table.md](./10-data-table.md)).
- 검색/페이지네이션/CSV 내보내기를 표준화.

### Phase 5. 레지스트리화
- AMS 전용 컴포넌트(예: GuideCard, FAQPage)를 `registry/` 로 옮겨 자체 레지스트리 구성 ([11-registry.md](./11-registry.md)).
- Vercel/Cloudflare Pages 에 `/r/*.json` 배포 → 다른 사내 앱도 `@ams/*` 네임스페이스로 설치.

### Phase 6. AI 통합
- Claude Code 에서 `.mcp.json` 으로 shadcn MCP 활성화 ([13-mcp.md](./13-mcp.md)).
- 사내 레지스트리를 `@ams` 네임스페이스로 등록.

## 체크리스트 (PR 리뷰용)

- [ ] 새 컴포넌트는 `src/components/ui/index.js` 에 export 되었는가?
- [ ] 시맨틱 토큰(`bg-primary`)을 사용했는가? 하드코딩된 색(`#2563eb`) 없는가?
- [ ] 다크모드에서도 정상 렌더되는가?
- [ ] `DialogTitle`, `DialogDescription`, `aria-label` 등 접근성 속성이 있는가?
- [ ] 폼 컴포넌트는 `react-hook-form` + `zod` 패턴을 따르는가?
- [ ] `shadcn add … --diff` 로 상류 변화를 확인했는가?

## 자주 쓰는 스니펫

### 확인 모달
```jsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">삭제</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
      <AlertDialogDescription>복구할 수 없습니다.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 키보드 단축키 + Command
```jsx
useEffect(() => {
  const onKey = (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen((v) => !v)
    }
  }
  window.addEventListener("keydown", onKey)
  return () => window.removeEventListener("keydown", onKey)
}, [])
```

### 토스트 (마이그레이션 후)
```jsx
import { toast } from "sonner"
toast.success("가이드를 저장했습니다")
toast.promise(save(), { loading: "저장 중…", success: "완료", error: "실패" })
```
