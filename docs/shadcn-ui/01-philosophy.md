# 01. 철학과 설계 원칙

## "This is not a component library. It is how you build your component library."

shadcn/ui는 전통적인 컴포넌트 라이브러리(예: MUI, Chakra)와 근본적으로 다릅니다. npm install로 의존성을 추가하는 대신, **CLI가 컴포넌트 소스 코드를 내 프로젝트로 직접 복사**합니다. 복사된 코드는 전적으로 사용자의 것이 되어 자유롭게 수정·삭제·확장할 수 있습니다.

## 5대 핵심 원칙

### 1. Open Code (열린 코드)
- 블랙박스 패키지가 아닌 **수정 가능한 소스 코드**를 제공한다.
- `node_modules` 에 숨지 않고 `src/components/ui/` 에 투명하게 놓인다.
- 문제가 생기면 라이브러리 PR을 기다리지 않고 직접 수정하면 된다.

### 2. Composition (합성성)
- 모든 컴포넌트가 **예측 가능한 합성 인터페이스**를 공유한다.
- 예: `Dialog` / `DialogTrigger` / `DialogContent` / `DialogHeader` / `DialogTitle` / `DialogFooter` 처럼 동일한 네이밍 패턴.
- Radix UI primitives 기반 → 상태·포커스·ARIA 이슈를 이미 해결해 준다.

### 3. Distribution (배포)
- **Schema + CLI** 조합으로 컴포넌트를 다른 프로젝트에 쉽게 배포한다.
- 사내 디자인 시스템을 `registry.json` 한 파일로 공유 가능 (→ [11-registry.md](./11-registry.md)).
- URL만 알면 설치: `pnpm dlx shadcn@latest add @acme/button`.

### 4. Beautiful Defaults (아름다운 기본값)
- 별도 커스터마이즈 없이도 **폴리시된 결과**를 낸다.
- 일관된 스페이싱·타이포그래피·포커스 링·애니메이션이 디폴트로 적용.
- 기본 제공 스타일: `new-york` (현재 표준). `default`는 deprecated.

### 5. AI-Ready (AI 친화적)
- 코드가 열려 있어 LLM이 **읽고, 수정하고, 제안**할 수 있다.
- 공식 MCP 서버 제공 → Claude Code / Cursor / VS Code 에서 "Add a login form with shadcn" 같은 자연어 요청이 동작.

## 아키텍처 구성요소

| 레이어 | 기술 | 역할 |
|--------|------|------|
| 기반 프리미티브 | **Radix UI** | 접근성·포커스·키보드 제어 |
| 스타일링 | **Tailwind CSS v4** | 유틸리티 클래스 |
| 테마 | **CSS Variables (OKLCH)** | 시맨틱 토큰 / 라이트·다크 전환 |
| Variant 관리 | **class-variance-authority (CVA)** | `variant` / `size` 프롭 표현 |
| 클래스 병합 | **clsx + tailwind-merge** (`cn` 헬퍼) | 조건부 클래스 + 충돌 해결 |
| 아이콘 | **lucide-react** (기본) 또는 `@tabler/icons-react` | SVG 아이콘 세트 |
| 애니메이션 | **tw-animate-css** | v3의 tailwindcss-animate 후속 |
| 차트 | **Recharts** | 데이터 시각화 |
| 토스트 | **Sonner** | `toast` 컴포넌트 대체 |
| 커맨드 팔레트 | **cmdk** | ⌘K 인터페이스 |

## 전통 라이브러리와의 비교

| 항목 | 전통 라이브러리 | shadcn/ui |
|------|------------------|------------|
| 배포 방식 | `npm install @mui/material` | `pnpm dlx shadcn add button` → 파일 복사 |
| 번들 영향 | 전체 라이브러리가 번들 | 사용한 컴포넌트만 포함 |
| 커스터마이즈 | theme override, styled API | 파일 직접 수정 |
| 마이너 업데이트 | 버전 업으로 깨질 수 있음 | 내 코드라 영향 없음 |
| 메이저 디자인 변경 | 라이브러리 의존 | 수동 적용 필요 (apply 커맨드로 보조) |
| 접근성 | 라이브러리 품질에 의존 | Radix primitives 사용 → 표준 준수 |

## 언제 쓰고, 언제 쓰지 말 것인가?

**추천:**
- 디자인 시스템을 장기적으로 소유·관리하고 싶을 때
- Tailwind를 이미 쓰고 있을 때
- 접근성은 지키되, 룩앤필을 완전 제어하고 싶을 때
- 사내 디자인 시스템을 레지스트리로 배포하려 할 때

**비추천:**
- 팀에 Tailwind 경험이 거의 없는데 학습 시간이 없을 때
- "설치하면 즉시 동작"이 최우선인 MVP (이 경우 MUI 등이 더 빠름)
- 프로젝트에서 Radix와 접근성을 신경 쓰지 않을 때

## 배울 때 흔한 오해

- ❌ "shadcn/ui도 npm 패키지 아닌가?" → CLI(`shadcn`)만 패키지, UI 컴포넌트는 코드 복사.
- ❌ "업데이트가 오면 자동 적용되나?" → 자동 업데이트 없음. `shadcn apply` / `shadcn diff` 로 수동 비교·적용.
- ❌ "Radix를 꼭 써야 하나?" → 최근 `base` 프리셋이 추가되어 Radix 없이도 사용 가능 (`init --base base`).
