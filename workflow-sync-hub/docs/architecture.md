# Architecture - Workflow Sync Hub

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      Workflow Sync Hub                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼────┐  ┌────▼──────┐  ┌───▼────────┐
        │ Confluence │  │   Jira    │  │ Obsidian   │
        │   REST API │  │  REST API │  │ Local REST │
        └───────┬────┘  └────┬──────┘  └───────┬────┘
                │             │               │
                └─────────────┼───────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Sync Manager      │
                    │ (sync-manager.js)  │
                    └─────────┬──────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         ┌────▼─────┐   ┌─────▼────┐   ┌────▼───────┐
         │ Transform │   │ Validate │   │  Schedule  │
         │   Data    │   │   Data   │   │  (cron)    │
         └────┬─────┘   └─────┬────┘   └────┬───────┘
              │               │             │
              └───────────────┼─────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Obsidian Sync     │
                    │  (obsidian.js)     │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Local Vault       │
                    │  (Markdown Files)  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Claude Analysis   │
                    │  (analyzer.js)     │
                    └────────────────────┘
```

---

## 📦 주요 컴포넌트

### 1. **Integrations Layer** (`src/integrations/`)

#### Confluence (`confluence.js`)
- `getMyPages()` - 현재 사용자의 페이지 조회
- `getPageById(pageId)` - 특정 페이지 상세 조회
- `syncToObsidian(pages)` - Obsidian에 동기화

#### Jira (`jira.js`)
- `getMyIssues()` - 할당된 이슈 조회
- `getCompletedIssues()` - 완료된 이슈 조회 (포트폴리오용)
- `syncToObsidian(issues)` - Obsidian에 동기화

#### Obsidian (`obsidian.js`)
- `writeFile(path, content, frontmatter)` - 파일 생성/업데이트
- `initializeVault()` - 폴더 구조 생성

### 2. **Sync Layer** (`src/sync/`)

#### Sync Manager (`sync-manager.js`)
- `syncAll()` - 전체 동기화
- `syncConfluence()` - Confluence만 동기화
- `syncJira()` - Jira만 동기화

#### Scheduler (`scheduler.js`)
- `start()` - 주기적 동기화 시작
- `runNow()` - 수동 동기화

### 3. **Claude Layer** (`src/claude/`)

#### Analyzer (`analyzer.js`)
- `analyzeWorkflow()` - 업무 데이터 분석
- `summarizePerformance()` - 성과 요약
- `extractInsights()` - 핵심 인사이트 추출
- `analyzeSkills()` - 스킬셋 분석

#### Portfolio Generator (`portfolio-generator.js`)
- `generatePortfolio()` - 포트폴리오 마크다운 생성
- `generateLinkedInContent()` - LinkedIn 콘텐츠 제안
- `generateCareerReport()` - 경력 개발 리포트

---

## 🔄 데이터 흐름

### Confluence → Obsidian

1. Confluence API 호출
   - `GET /rest/api/3/me/pages`
   - 모든 페이지 메타데이터 조회

2. 데이터 변환
   - Frontmatter 생성
   - Markdown 형식 변환

3. Obsidian 저장
   - 경로: `Work/Confluence/{title}.md`
   - 자동 인덱싱

### Jira → Obsidian

1. Jira API 호출
   - `GET /rest/api/3/issues?assignee=currentUser()`
   - 할당된 모든 이슈 조회

2. 데이터 변환
   - Frontmatter 생성
   - 체크리스트로 변환

3. Obsidian 저장
   - 경로: `Work/Jira/{key}.md`
   - 상태 변경 시 자동 업데이트

---

## 📊 메타데이터 스키마

### Confluence 페이지

```yaml
---
type: confluence_page
date: 2026-04-23
source: confluence
id: 12345678
title: Page Title
status: published
tags: [documentation, process]
---
```

### Jira 이슈

```yaml
---
type: jira_issue
date: 2026-04-23
source: jira
key: ABC-123
title: Issue Summary
status: In Progress
story_points: 5
sprint: Sprint 25
---
```

---

## ⚙️ 설정 항목

### 필수
- `CONFLUENCE_DOMAIN`
- `CONFLUENCE_EMAIL`
- `CONFLUENCE_API_TOKEN`
- `JIRA_DOMAIN`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `OBSIDIAN_VAULT_PATH`
- `OBSIDIAN_API_KEY`

### 선택
- `SYNC_INTERVAL` (기본: 3600000ms = 1시간)
- `SYNC_ON_STARTUP` (기본: true)
- `ENABLE_CONFLUENCE_SYNC` (기본: true)
- `ENABLE_JIRA_SYNC` (기본: true)
- `ENABLE_CLAUDE_ANALYSIS` (기본: true)