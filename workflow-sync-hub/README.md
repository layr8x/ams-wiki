# Workflow Sync Hub

**Confluence + Jira + Obsidian + Claude** 실시간 업무 동기화 & 데이터 분석 시스템

## 🎯 개요

나의 업무 데이터(Confluence, Jira)를 Obsidian에 실시간 동기화하고, Claude를 활용하여 자동으로 분석, 인사이트 도출, 포트폴리오 자료 생성.

### 주요 기능

- **🔄 실시간 동기화**
  - Confluence 페이지 → Obsidian 자동 저장
  - Jira 이슈 → Obsidian 태스크 트래킹
  - 메타데이터 + frontmatter 자동 추가

- **🤖 Claude 분석**
  - 업무 진행률 분석
  - 성과 자동 요약
  - 핵심 학습 내용 추출

- **📊 포트폴리오 생성**
  - 프로젝트별 성과 문서화
  - 스킬셋 자동 추출
  - 포트폴리오 마크다운 생성

## 🚀 빠른 시작

```bash
npm install
cp .env.example .env
# .env 파일에 토큰 입력

npm run sync:all
```

## 📚 설정 가이드

docs/setup.md 참조