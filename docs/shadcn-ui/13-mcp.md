# 13. shadcn MCP 서버 (AI 통합)

## MCP 란?

**Model Context Protocol (MCP)** 는 Anthropic이 공개한 개방형 프로토콜로, LLM과 외부 도구/데이터 소스 간의 **표준 인터페이스** 입니다. shadcn/ui 는 MCP 서버를 공식 제공해 AI 어시스턴트(Claude Code / Cursor / VS Code / Codex)가 **레지스트리 컴포넌트를 직접 조회·설치**할 수 있게 합니다.

## 기능

MCP 서버는 AI에게 3가지 주요 동작을 노출합니다.

1. **컴포넌트 탐색** — 레지스트리에 어떤 아이템들이 있는지 목록 조회.
2. **검색** — 이름/설명/카테고리로 아이템 검색.
3. **설치** — 자연어 요청으로 컴포넌트 / 블록 / 훅 추가 (`shadcn add`).
4. **문서 조회** — `shadcn docs` 를 통해 컴포넌트 API 참조 반환.

## 설치 예시 (Claude Code)

프로젝트 루트 `.mcp.json`:
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```
Claude Code가 뜰 때 자동으로 서버를 기동하고 tools 로 등록.

## Cursor

`~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```

## VS Code + Continue / Codex
- `.vscode/settings.json` 또는 Continue 설정에 동일 패턴으로 추가.

## 자연어 사용 예

- "Show me all available components in the shadcn registry."
- "Add the button, dialog and card components to my project."
- "Create a contact form using components from the shadcn registry."
- "Find me a sidebar block with team switcher and install it."
- "Show me the props of the Button component."

## 프라이빗 레지스트리와 함께

`components.json` 에 네임스페이스를 등록하면 MCP 도 그대로 인식:
```json
{
  "registries": {
    "@acme": {
      "url": "https://registry.acme.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${REGISTRY_TOKEN}" }
    }
  }
}
```
`.env.local` 에 `REGISTRY_TOKEN=xxx` 을 두고 LLM 세션에서 로드되도록 하면, AI가 "add @acme/login-form" 같은 요청을 자연스럽게 수행 가능.

## 보안 고려사항

- MCP는 **프로젝트 파일 시스템에 쓰기 권한**을 가집니다. 초대받지 않은 레지스트리 URL을 AI 요청에 따라 실행하지 않도록 **허용 목록** 을 둘 것.
- 인증 토큰은 로컬 `.env` 로만 관리하고 레지스트리 URL에 포함하지 말 것.
- CI 환경에서는 MCP 서버가 실행되지 않도록 주의 (개발 워크플로우 전용).

## 디버깅

- `pnpm dlx shadcn@latest mcp --verbose` 로 상세 로그.
- `shadcn info` 로 현재 감지된 레지스트리 확인.
- MCP 서버가 최신 데이터를 보지 못하면 `shadcn@latest` 처럼 latest 태그로 재실행.

## 활용 아이디어

1. **디자인 시스템 가이드 봇** — 사내 레지스트리 + `docs` URL 로 AI가 컴포넌트 사용법을 즉답.
2. **코드리뷰 자동화** — AI가 PR 리뷰 중 shadcn 컴포넌트를 추천/삽입.
3. **프로토타입 부스터** — "대시보드 레이아웃 만들어줘" → 블록 설치 + 배치 + 데이터 더미.
