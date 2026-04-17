# shadcn/ui 완전 학습 가이드

이 디렉토리는 [ui.shadcn.com](https://ui.shadcn.com) 공식 문서와 [shadcn-ui/ui](https://github.com/shadcn-ui/ui) GitHub 저장소를 종합적으로 학습·정리한 한국어 레퍼런스입니다. 본 프로젝트(AMS Wiki)가 shadcn/ui를 채택하고 있으므로, 기여자가 빠르게 원리·사용법·확장법을 습득할 수 있도록 설계되었습니다.

> 학습 기준일: 2026-04. shadcn CLI 3.x / Tailwind v4 / React 19 / `new-york` 스타일 기준.

## 문서 구성

| 번호 | 파일 | 내용 요약 |
|------|------|-----------|
| 01 | [philosophy.md](./01-philosophy.md) | shadcn/ui 철학 · 5대 원칙 · "라이브러리가 아니라 빌딩 방식" |
| 02 | [installation.md](./02-installation.md) | Next.js / Vite / Remix / Astro / TanStack Start / Laravel / 수동 설치 |
| 03 | [cli.md](./03-cli.md) | `init`, `add`, `apply`, `build`, `search`, `view`, `info`, `migrate`, `docs`, `mcp` 전체 옵션 |
| 04 | [components-json.md](./04-components-json.md) | `components.json` 필드별 상세·예제·주의사항 |
| 05 | [theming.md](./05-theming.md) | CSS 변수 · OKLCH · base color · 토큰 · radius · 커스텀 테마 |
| 06 | [dark-mode.md](./06-dark-mode.md) | Next.js / Vite / Astro / Remix용 다크모드 구현 |
| 07 | [components.md](./07-components.md) | 70+ 컴포넌트 목록 · 구성 · 예제 (Button/Card/Dialog/Sidebar/Command 등) |
| 08 | [blocks-charts.md](./08-blocks-charts.md) | Blocks(대시보드/로그인/사이드바) · Charts(Recharts 통합) |
| 09 | [forms.md](./09-forms.md) | React Hook Form + Zod · TanStack Form · Field API |
| 10 | [data-table.md](./10-data-table.md) | TanStack Table 기반 데이터 테이블 (정렬/필터/페이지네이션/선택) |
| 11 | [registry.md](./11-registry.md) | Registry 시스템 · Namespace · 인증 레지스트리 · 커스텀 배포 |
| 12 | [monorepo.md](./12-monorepo.md) | Turborepo + pnpm workspaces 모노레포 구성 |
| 13 | [mcp.md](./13-mcp.md) | shadcn MCP 서버로 AI 어시스턴트와 통합 |
| 14 | [tailwind-v4-migration.md](./14-tailwind-v4-migration.md) | v3 → v4 마이그레이션 · `@theme inline` · OKLCH 전환 |
| 15 | [repository-structure.md](./15-repository-structure.md) | shadcn-ui/ui 모노레포 구조 · 기여 워크플로우 · commitlint 규칙 |
| 16 | [ams-wiki-integration.md](./16-ams-wiki-integration.md) | 본 프로젝트에서의 실제 적용 패턴과 유지보수 가이드 |

## 빠른 인덱스

- **왜 shadcn/ui인가?** → [01-philosophy.md](./01-philosophy.md)
- **새 프로젝트 시작** → [02-installation.md](./02-installation.md) + [03-cli.md](./03-cli.md)
- **컬러·다크모드 커스텀** → [05-theming.md](./05-theming.md) + [06-dark-mode.md](./06-dark-mode.md)
- **사내 전용 컴포넌트 배포** → [11-registry.md](./11-registry.md)
- **AI 통합** → [13-mcp.md](./13-mcp.md)

## 권장 학습 순서

1. 철학(01) → 설치(02) → CLI(03) 으로 전체 흐름을 잡는다.
2. `components.json`(04) 과 테마(05)를 실제 프로젝트에 맞게 튜닝한다.
3. 다크모드(06)와 자주 쓰는 컴포넌트(07) 예제를 따라해본다.
4. 폼(09) / 데이터 테이블(10) / 블록(08) 으로 실전 레이아웃을 구현한다.
5. 레지스트리(11) / 모노레포(12) / MCP(13) 로 규모 확장 기법을 익힌다.
6. 최종적으로 v4 마이그레이션(14)과 기여 규약(15)을 숙지한다.

## 출처

- [shadcn/ui 공식 문서](https://ui.shadcn.com/docs)
- [shadcn-ui/ui GitHub 저장소](https://github.com/shadcn-ui/ui) (MIT License)
