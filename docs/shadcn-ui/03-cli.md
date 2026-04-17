# 03. CLI 완전 레퍼런스

`shadcn` CLI는 shadcn/ui 생태계의 유일한 공식 npm 패키지입니다. 모든 명령은 `pnpm dlx shadcn@latest <command>` 형태로 실행합니다.

> `shadcn/ui` 라는 패키지는 과거 이름이며 **현재 공식 패키지는 `shadcn`** 입니다.

## 전체 명령 요약

| 명령 | 용도 |
|------|------|
| `init` | 프로젝트 초기화 (`create`와 동일) |
| `add` | 레지스트리 아이템(컴포넌트·블록·훅·테마) 설치 |
| `apply` | 기존 프로젝트에 프리셋/스타일 재적용 |
| `view` | 레지스트리 아이템 조회 (설치 전 확인) |
| `search` | 레지스트리 검색 |
| `build` | 자체 레지스트리 JSON 생성 (배포용) |
| `info` | 현재 프로젝트 설정 출력 |
| `migrate` | 자동 마이그레이션 (`icons`, `radix`, `rtl`) |
| `docs` | 컴포넌트 문서 및 API 레퍼런스 조회 |
| `mcp` | MCP 서버 실행 (AI 통합) |

## `init` — 프로젝트 초기화

```bash
pnpm dlx shadcn@latest init [options] [components...]
```

**주요 옵션**:
| 옵션 | 설명 |
|------|------|
| `-t, --template <template>` | `next` / `vite` / `start` / `react-router` / `laravel` / `astro` |
| `-b, --base <base>` | `radix` (기본) 또는 `base` (Radix 미사용) |
| `-p, --preset [name]` | 프리셋 적용 (e.g. `nova`) |
| `-d, --defaults` | 기본값 자동 적용 (`next` + `nova`) |
| `--css-variables` | CSS 변수 기반 테마 활성화 |
| `--monorepo` | 모노레포 구조로 스캐폴드 |
| `--rtl` | RTL(우→좌) 지원 초기화 |
| `-n, --name <name>` | 새 프로젝트 이름 지정 |
| `--cwd <path>` | 작업 디렉토리 지정 |
| `-y, --yes` | 모든 확인 자동 승인 |
| `-f, --force` | 기존 설정 덮어쓰기 |
| `-s, --silent` | 로그 최소화 |

**예시**:
```bash
# Next.js 기본 프리셋
pnpm dlx shadcn@latest init -d

# Vite + 모노레포
pnpm dlx shadcn@latest init -t vite --monorepo

# 초기화하면서 컴포넌트도 함께 추가
pnpm dlx shadcn@latest init button card dialog
```

별칭: `create`.

## `add` — 컴포넌트 / 블록 / 훅 설치

```bash
pnpm dlx shadcn@latest add [items...]
```

**옵션**:
| 옵션 | 설명 |
|------|------|
| `-y, --yes` | 프롬프트 스킵 |
| `-o, --overwrite` | 기존 파일 덮어쓰기 |
| `-a, --all` | 모든 컴포넌트 설치 (주의: 수십 개) |
| `-p, --path <path>` | 설치 경로 지정 |
| `-c, --cwd <path>` | 프로젝트 루트 지정 (모노레포 유용) |
| `--dry-run` | 실제 쓰기 없이 미리보기 |
| `--diff [path]` | 로컬과 레지스트리 버전 diff |

**설치 단위**:
```bash
# 기본 컴포넌트
pnpm dlx shadcn@latest add button

# 여러 개 동시
pnpm dlx shadcn@latest add button card dialog sheet

# 블록 (페이지 + 컴포넌트 세트)
pnpm dlx shadcn@latest add dashboard-01

# 네임스페이스 레지스트리
pnpm dlx shadcn@latest add @acme/auth-form
pnpm dlx shadcn@latest add @v0/dashboard

# URL 직접 지정
pnpm dlx shadcn@latest add https://example.com/my-component.json
```

## `apply` — 기존 프로젝트에 프리셋 재적용

새 스타일(Sera, Luma 등)을 기존 프로젝트에 일괄 적용할 때 사용:

```bash
pnpm dlx shadcn@latest apply --preset nova
pnpm dlx shadcn@latest apply --preset a2r6bw   # shadcn/create 에서 생성한 커스텀 코드
```

- 현재 `base` / `rtl` 설정은 유지
- 테마 / 컬러 / CSS 변수 / 폰트 / 아이콘을 업데이트
- 수정한 컴포넌트를 덮어쓰기 전에 **diff로 확인**을 권장

## `view` — 아이템 미리보기

```bash
pnpm dlx shadcn@latest view button
pnpm dlx shadcn@latest view button card dialog
pnpm dlx shadcn@latest view @acme/auth @v0/dashboard
```
설치 없이 파일 구조·의존성·코드를 미리 볼 수 있습니다.

## `search` — 레지스트리 검색

```bash
pnpm dlx shadcn@latest search <registry> [options]
```
| 옵션 | 설명 |
|------|------|
| `-q, --query <str>` | 검색어 |
| `-l, --limit <n>` | 최대 결과 수 (기본 100) |
| `-o, --offset <n>` | 스킵 개수 |

**예시**:
```bash
pnpm dlx shadcn@latest search @shadcn -q "dialog"
pnpm dlx shadcn@latest list @acme   # 별칭: list
```

## `build` — 커스텀 레지스트리 빌드

자체 컴포넌트 레지스트리를 배포하고 싶을 때 사용. `registry.json` 을 기반으로 `public/r/*.json`을 생성합니다.

```bash
pnpm dlx shadcn@latest build
pnpm dlx shadcn@latest build -o ./public/registry
```

`package.json`:
```json
{ "scripts": { "registry:build": "shadcn build" } }
```

자세한 내용은 [11-registry.md](./11-registry.md).

## `info` — 현재 프로젝트 설정

```bash
pnpm dlx shadcn@latest info
```
출력:
- `components.json` 유효성
- Tailwind / React / TypeScript / Node 버전
- 별칭 해석 결과
- 사용 중인 레지스트리 목록

트러블슈팅 1순위로 추천.

## `migrate` — 자동 마이그레이션

현재 지원하는 서브커맨드:

| 서브커맨드 | 동작 |
|------------|------|
| `migrate icons` | 아이콘 라이브러리 교체 (예: lucide ↔ tabler) |
| `migrate radix` | 개별 `@radix-ui/react-*` 패키지 → 통합 `radix-ui` 패키지 import 변환 |
| `migrate rtl` | 물리 속성(ml-4, text-left)을 논리 속성(ms-4, text-start)으로 변환 |

```bash
pnpm dlx shadcn@latest migrate rtl ./src
pnpm dlx shadcn@latest migrate radix
pnpm dlx shadcn@latest migrate icons
```

## `docs` — 문서 / API 조회

```bash
pnpm dlx shadcn@latest docs button
pnpm dlx shadcn@latest docs button --base base
pnpm dlx shadcn@latest docs button --json
```
MCP 서버가 이 명령을 활용해 AI에게 실시간 API 참조를 제공합니다.

## `mcp` — MCP 서버 실행

```bash
pnpm dlx shadcn@latest mcp
```
`.mcp.json` / Cursor / VS Code 설정에 등록하면 AI가 컴포넌트를 직접 탐색·추가할 수 있습니다. 상세는 [13-mcp.md](./13-mcp.md).

## 공통 플래그 팁

- `-c, --cwd <path>` 는 **모든 명령**에 적용 가능. 모노레포에서 `apps/web` 에만 추가할 때 유용.
- 프라이빗 레지스트리 사용 시 `.env.local` 에 `REGISTRY_TOKEN=xxx` 지정 후 `components.json` 에서 `${REGISTRY_TOKEN}` 참조.
- 문제가 생기면 항상 `pnpm dlx shadcn@latest@next` 대신 **정해진 버전**을 고정하는 것이 재현성에 좋음 (`shadcn@3.0.0`).

## CI/CD에서의 활용

```yaml
# GitHub Actions 예시: PR마다 컴포넌트 diff 체크
- name: Check shadcn components drift
  run: pnpm dlx shadcn@latest add --all --dry-run --diff
```
