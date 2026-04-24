# Setup Guide - Workflow Sync Hub

## 📋 전제 조건

- Node.js 18+
- Confluence 계정 + API 토큰
- Jira 계정 + API 토큰
- Obsidian (최신 버전)
- Claude API 키 (선택사항, 분석용)

---

## 🔧 Step 1: Confluence API 토큰 발급

1. https://id.atlassian.com/manage-profile/security/api-tokens 접속
2. "Create API token" 클릭
3. 라벨 입력 (예: "Workflow Sync")
4. 생성된 토큰 복사 → `.env`에 저장

```env
CONFLUENCE_DOMAIN=your-domain.atlassian.net
CONFLUENCE_EMAIL=your-email@example.com
CONFLUENCE_API_TOKEN=your-token-here
```

---

## 🔧 Step 2: Jira API 토큰 발급

동일한 페이지에서 발급:

```env
JIRA_DOMAIN=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-token-here
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
```

---

## 🔧 Step 3: Obsidian Local REST API 설치

1. Obsidian 열기
2. Settings → Community Plugins → Browse
3. "Local REST API" 검색 → Install
4. Enable 클릭
5. Settings → Local REST API → API Key 생성
6. 생성된 키 복사 → `.env`에 저장

```env
OBSIDIAN_VAULT_PATH=/Users/your-user/Documents/My\ Vault
OBSIDIAN_API_KEY=your-api-key-here
```

---

## 🚀 Step 4: 프로젝트 초기화

```bash
# 저장소 클론
cd workflow-sync-hub

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 토큰 입력

# 테스트
npm run sync:all
```

---

## 🚀 스케줄러 시작

```bash
# 매시간 자동 동기화 시작
npm start
```