# 15. shadcn-ui/ui GitHub 저장소 구조 & 기여

원본 저장소: https://github.com/shadcn-ui/ui (MIT License).

## 최상위 구조

```
shadcn-ui/ui
├── apps
│   └── v4              # 공식 웹사이트 & 컴포넌트 소스 (Next.js App Router)
│       ├── app
│       ├── content    # MDX 문서
│       └── registry
│           └── new-york-v4
│               ├── ui        # 컴포넌트(Button, Card, Dialog ...)
│               ├── blocks    # 블록(dashboard-01 ...)
│               ├── hooks
│               ├── lib
│               └── examples
├── packages
│   ├── shadcn          # 공식 CLI (npm: `shadcn`)
│   └── tests           # 공유 테스트 유틸
├── templates           # `shadcn create` 가 사용하는 템플릿
├── scripts             # 빌드·배포 스크립트
├── skills/shadcn       # AI/에이전트 학습 자료
├── turbo.json
├── pnpm-workspace.yaml
└── CONTRIBUTING.md
```

## 기술 스택

- **언어**: TypeScript (≈90%) + MDX (≈6%)
- **패키지 매니저**: `pnpm` (pnpm-workspace.yaml)
- **빌드 오케스트레이션**: Turborepo (`turbo.json`)
- **테스트**: Vitest
- **코드 품질**: ESLint + Prettier + commitlint

## 주요 패키지

### `packages/shadcn` (CLI)
- 엔트리: `src/index.ts`
- 명령: `init`, `create`, `add`, `apply`, `view`, `search`, `build`, `info`, `docs`, `migrate`, `mcp`
- 번들러: `tsup` (`tsup.config.ts`)
- 테스트: `vitest.config.ts`

### `apps/v4`
- Next.js 15 + App Router.
- 각 컴포넌트 페이지는 `apps/v4/content/docs/components/*.mdx`.
- 레지스트리 소스는 `apps/v4/registry/new-york-v4/` 아래 — **실제 컴포넌트 원본**.

## 개발 워크플로우

```bash
git clone https://github.com/<you>/ui.git
cd ui
pnpm install
pnpm --filter=v4 dev          # 웹사이트 개발 서버
# 다른 터미널:
pnpm shadcn <command> -c ~/my-test-app   # 로컬 CLI 테스트
```

## 컴포넌트 추가 기여 순서

1. 이슈/디스커션으로 제안 (신규 컴포넌트는 디스커션 선호).
2. 브랜치 생성: `feat/add-heatmap`.
3. `apps/v4/registry/new-york-v4/ui/<name>.tsx` 구현.
4. 다른 스타일(luma, sera 등)에도 구현(또는 상속).
5. MDX 문서 작성: `apps/v4/content/docs/components/<name>.mdx`.
6. `pnpm registry:build` 로 레지스트리 JSON 재생성.
7. `pnpm test` 로 유닛 테스트.
8. 커밋: `feat(components): add heatmap component`.
9. PR 생성 → 리뷰 → 머지.

## 커밋 컨벤션 (commitlint)

형식: `type(scope): message`

유효 `type`: `feat`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, `chore`.

예시:
- `feat(components): add kbd component`
- `fix(cli): resolve alias for monorepo apps`
- `docs(theming): add oklch explanation`

## 브랜치 전략

- `main`: 안정 릴리스
- `canary`/`next`: 선행 배포
- PR은 `main` 대상. 승인 후 스쿼시 머지.

## 테스트

- `pnpm test` 전에 `pnpm build` 를 선호.
- 신규 컴포넌트/CLI 동작은 Vitest 테스트 필수.
- Snapshot 은 공식 deprecated → 동작 검증 위주로 작성.

## 이슈/PR 라벨 (참고)

- `bug`, `enhancement`, `docs`, `question`, `good first issue`
- 컴포넌트별 라벨: `component: button`, `component: dialog` 등

## 라이선스 & 법적 고지

- MIT.
- 복사한 컴포넌트는 내 프로젝트 코드로 인정되지만, `shadcn` 패키지 자체를 재배포할 때는 라이선스 고지 필요.

## 학습 리소스 (저장소 포함)

- `apps/v4/content/docs/` — 모든 공식 문서의 원본 (MDX)
- `skills/shadcn/` — AI 에이전트가 참조하는 스킬 매뉴얼
- `CONTRIBUTING.md` — 공식 기여 절차
- `CHANGELOG.md` 는 별도로 두지 않고 웹 `/docs/changelog` 에서 관리
