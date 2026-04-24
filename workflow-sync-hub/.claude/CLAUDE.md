# Workflow Sync Hub - Claude 프로젝트 메모리

## 📋 프로젝트 개요

Confluence + Jira + Obsidian + Claude 실시간 업무 동기화 및 분석 시스템

## 🗂️ 주요 파일 경로

```
src/
├── index.js                  # 메인 엔트리포인트
├── config.js                # 환경 설정 관리
├── integrations/
│   ├── confluence.js        # Confluence API
│   ├── jira.js             # Jira API
│   └── obsidian.js         # Obsidian API
├── sync/
│   ├── sync-manager.js     # 동기화 오케스트레이션
│   └── scheduler.js        # 주기적 실행
└── claude/
    ├── analyzer.js         # 데이터 분석
    └── portfolio-generator.js  # 포트폴리오 생성
```

## 🔑 핵심 기술

- **axios** - HTTP 요청 (API 호출)
- **node-cron** - 주기적 스케줄링
- **dotenv** - 환경 변수 관리
- **@anthropic-ai/sdk** - Claude API

## 📝 설정 항목

### 필수 (.env)
```
CONFLUENCE_DOMAIN
CONFLUENCE_EMAIL
CONFLUENCE_API_TOKEN
JIRA_DOMAIN
JIRA_EMAIL
JIRA_API_TOKEN
JIRA_PROJECT_KEY
OBSIDIAN_VAULT_PATH
OBSIDIAN_API_KEY
ANTHROPIC_API_KEY (선택)
```

## 🚀 사용 방법

```bash
npm install
cp .env.example .env
npm start              # 스케줄러 시작
npm run sync:all      # 수동 동기화
npm run analyze       # Claude 분석
npm run portfolio     # 포트폴리오 생성
```

## 🔄 데이터 흐름

1. **Confluence/Jira API** → 메타데이터 추출
2. **변환** → Markdown + Frontmatter 생성
3. **Obsidian** → 파일 저장 (로컬)
4. **Claude** → 분석 (필요시에만)
5. **생성** → 인사이트, 포트폴리오 저장

## 🔐 보안

- ✅ API 토큰은 `.env`에만 저장 (git 무시)
- ✅ 모든 처리는 로컬에서 수행
- ✅ Claude는 필요한 메타데이터만 전송