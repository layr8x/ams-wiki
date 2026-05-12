# Jira & Confluence OAuth 2.0 통합 가이드

API 키 또는 토큰 노출 없이 **OAuth 2.0**을 통해 안전한 Jira/Confluence 연동을 제공합니다.

## 개요

이 가이드는 Atlassian OAuth 2.0 (3LO)을 사용하여 다음 기능을 활성화합니다:

- ✅ **Jira 이슈 검색 및 생성** — JQL 쿼리로 검색, 프로그래매틱하게 이슈 생성/수정
- ✅ **Confluence 페이지 검색 및 관리** — CQL 쿼리, 페이지 생성/수정/삭제
- ✅ **자동 토큰 갱신** — Refresh Token으로 항상 유효한 액세스토큰 유지
- ✅ **안전한 토큰 저장** — Supabase의 RLS(Row Level Security)로 사용자별 격리
- ✅ **사용자 연결 해제** — 언제든지 통합 제거 가능

## 아키텍처

```
사용자 (브라우저)
    ↓
React 컴포넌트 (JiraConfluenceSettings)
    ↓
OAuth 요청 (/api/oauth/authorize)
    ↓
Atlassian OAuth 서버
    ↓
OAuth 콜백 (/api/oauth/callback) ← Code 수신
    ↓
토큰 교환 ← Access Token + Refresh Token
    ↓
Supabase oauth_integrations 테이블 저장
    ↓
이후 API 요청 시 DB에서 토큰 조회 → 리프레시 → 사용

React Query (useJiraConfluence)
    ↓
/api/jira/search, /api/confluence/search 등
    ↓
JiraClient / ConfluenceClient (토큰 자동 갱신)
    ↓
Atlassian API v3 / v2
```

## 설정 단계

### 1단계: Atlassian에서 OAuth 앱 등록

#### 1-1. [Atlassian Developer Console](https://developer.atlassian.com/console/my-apps/) 접속

#### 1-2. "Create an app" → "OAuth 2.0 (3LO)"

#### 1-3. App Details 설정
- **App name**: AMS Wiki
- **Description**: 학원 운영 시스템 위키

#### 1-4. Authorization 설정

**Redirect URLs**:
```
# 로컬 개발
http://localhost:5173/api/oauth/callback

# 프로덕션 (Vercel)
https://your-domain.vercel.app/api/oauth/callback
```

#### 1-5. Permissions 설정

다음 스코프를 추가합니다:

**Jira API**:
- `read:jira-work` — Jira 이슈 조회
- `write:jira-work` (선택) — 이슈 생성/수정

**Confluence API**:
- `read:confluence-content.summary` — 페이지 목록/검색
- `write:confluence-content` — 페이지 생성/수정
- `manage:confluence-attachment` (선택) — 첨부파일 관리

#### 1-6. Credentials 복사

앱 설정 페이지에서 아래를 복사:
- **Client ID**
- **Client Secret** (⚠️ 절대 노출 금지)

### 2단계: 환경 변수 설정

`.env.local` (또는 `.env`) 파일에 추가:

```bash
# Atlassian OAuth
ATLASSIAN_OAUTH_CLIENT_ID=your_client_id_here
ATLASSIAN_OAUTH_CLIENT_SECRET=your_client_secret_here
ATLASSIAN_OAUTH_REDIRECT_URI=http://localhost:5173/api/oauth/callback
```

**프로덕션 (Vercel)**:
[Vercel Dashboard](https://vercel.com) → Project Settings → Environment Variables
```
ATLASSIAN_OAUTH_CLIENT_ID=...
ATLASSIAN_OAUTH_CLIENT_SECRET=...
ATLASSIAN_OAUTH_REDIRECT_URI=https://your-domain.vercel.app/api/oauth/callback
```

### 3단계: Supabase 마이그레이션 적용

```bash
npm run migrate
# 또는 Supabase 대시보드 → SQL Editor → supabase/migrations/oauth_integrations.sql 실행
```

이 마이그레이션은 다음을 생성합니다:
- `oauth_integrations` 테이블 — OAuth 토큰 저장
- `oauth_state` 테이블 — CSRF 방어용 상태 토큰
- RLS 정책 — 사용자 데이터 격리

### 4단계: 앱에서 사용

#### 설정 페이지에 컴포넌트 추가

```jsx
import { JiraConfluenceSettings } from '@/components/integrations/JiraConfluenceSettings'

export function SettingsPage() {
  return (
    <div>
      <JiraConfluenceSettings />
    </div>
  )
}
```

#### React Query 훅 사용

```jsx
import { useSearchJiraIssues, useSearchConfluencePages } from '@/hooks/useJiraConfluence'

export function DashboardWidget() {
  // Jira 이슈 검색
  const { data: issues } = useSearchJiraIssues('project = PROJ AND status != Done')

  // Confluence 페이지 검색
  const { data: pages } = useSearchConfluencePages('title ~ "가이드"')

  return (
    <div>
      <h2>최근 이슈: {issues?.issues?.length}</h2>
      <h2>가이드: {pages?.results?.length}</h2>
    </div>
  )
}
```

## API 사용 예제

### Jira 이슈 검색

```typescript
// 프론트엔드
const { data } = useSearchJiraIssues('status = "In Progress"', {
  maxResults: 10,
})
```

### Jira 이슈 생성

```typescript
const { mutate: createIssue } = useCreateJiraIssue()

createIssue({
  projectKey: 'PROJ',
  issueName: '테스트 이슈',
  issueDescription: '설명...',
  issueType: 'Task',
}, {
  onSuccess: () => console.log('생성됨'),
})
```

### Confluence 페이지 검색

```typescript
const { data } = useSearchConfluencePages('title ~ "운영"', {
  limit: 20,
})
```

### Confluence 페이지 생성

```typescript
const { mutate: createPage } = useCreateConfluencePage()

createPage({
  spaceId: 'FVSOL',
  title: '새 가이드',
  body: '<h1>제목</h1><p>내용...</p>',
}, {
  onSuccess: () => console.log('페이지 생성됨'),
})
```

## 보안

### 토큰 저장소

- **위치**: Supabase `oauth_integrations` 테이블
- **암호화**: Supabase는 저장 시 자동 암호화
- **접근 제어**: RLS 정책으로 사용자 본인만 조회 가능
- **갱신**: Refresh Token으로 자동 갱신

### PKCE (Proof Key for Code Exchange)

OAuth 요청 시 PKCE를 사용하여 인증 코드 탈취 공격(authorization code interception attack) 방지:

```
1. 클라이언트 → code_challenge 생성
2. 로컬에 code_verifier 저장 (쿠키, HttpOnly)
3. Atlassian에서 인증 코드 수신
4. 콜백 시 code_verifier + code로 토큰 교환
```

### 환경 변수 (클라이언트 vs 서버)

⚠️ **절대 클라이언트 번들에 노출되지 않아야 할 것**:
```bash
# ✅ OK (서버 사이드만)
ATLASSIAN_OAUTH_CLIENT_SECRET=...

# ❌ NO (VITE_ 접두사 금지)
VITE_CONFLUENCE_TOKEN=...
```

## 트러블슈팅

### "OAuth not configured" 오류

**원인**: 환경 변수 미설정

```bash
# .env 파일 확인
cat .env | grep ATLASSIAN_OAUTH

# 또는 Vercel → Settings → Environment Variables 확인
```

### "No OAuth integration found" 오류

**원인**: 사용자가 아직 Jira/Confluence를 연동하지 않음

```typescript
const { data: integrations } = useOAuthIntegrations()

if (!integrations?.length) {
  return <p>Jira/Confluence를 먼저 연결해주세요</p>
}
```

### 토큰 갱신 실패

**원인**: Refresh Token 만료 (일반적으로 6개월)

→ 사용자가 다시 "Atlassian 계정으로 연결" 클릭

### CORS 오류

OAuth 콜백이 Vercel에서 실행되므로 CORS 문제 없음.
(클라이언트는 직접 Atlassian API를 호출하지 않음)

## 마이그레이션

기존 Basic Auth (email + API token)에서 OAuth로 전환:

```javascript
// api/confluence-img/[...path].js 코드는 유지
// (레거시 환경변수 CONFLUENCE_EMAIL/TOKEN은 선택사항)

// 새로운 코드는 oauth_integrations 테이블 사용
// JiraClient / ConfluenceClient 에서 자동 갱신
```

## 참고 문서

- [Atlassian OAuth 2.0 문서](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/)
- [Jira API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Confluence API v2](https://developer.atlassian.com/cloud/confluence/apis/rest/v2/)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)

## 파일 구조

```
api/
├── oauth/
│   ├── authorize.js       # OAuth 요청 시작
│   ├── callback.js        # OAuth 콜백 (토큰 교환)
│   └── disconnect.js      # 통합 해제
├── jira/
│   ├── search.js          # 이슈 검색
│   ├── issues.js          # 이슈 CRUD
│   └── projects.js        # 프로젝트 조회
├── confluence/
│   ├── search.js          # 페이지 검색
│   ├── pages.js           # 페이지 CRUD
│   └── spaces.js          # 스페이스 조회
└── lib/
    ├── jira-client.js     # Jira API 클라이언트
    └── confluence-client.js # Confluence API 클라이언트

src/
├── components/integrations/
│   └── JiraConfluenceSettings.jsx # 설정 UI
├── hooks/
│   └── useJiraConfluence.js       # React Query 훅
└── ...

supabase/migrations/
└── oauth_integrations.sql  # DB 스키마
```

## FAQ

### Q: Basic Auth와 OAuth를 함께 사용할 수 있나요?

**A**: 네. 두 방식을 병행 가능:
- Basic Auth: 레거시 지원, 서버-투-서버 통신 (`api/confluence-img`)
- OAuth: 사용자 인증, 대시보드 기능

### Q: 토큰 만료 시간은?

**A**: Atlassian OAuth 토큰은 보통 **1시간** 유효. Refresh Token 유효기간은 **6개월**.
자동 갱신되므로 사용자는 신경 쓸 필요 없음.

### Q: 여러 Jira/Confluence 인스턴스를 연동할 수 있나요?

**A**: 네. 사용자당 여러 Cloud ID로 여러 인스턴스 저장 가능:
```typescript
const integrations = await useOAuthIntegrations()
// [
//   { provider: 'jira', cloud_id: 'abc123', ... },
//   { provider: 'confluence', cloud_id: 'xyz789', ... }
// ]
```

### Q: 권한이 없는 이슈/페이지 접근 시?

**A**: Atlassian이 403 Forbidden 반환.
클라이언트 에러 처리 필요:
```typescript
const { data, error } = useSearchJiraIssues(jql)
if (error?.message?.includes('403')) {
  return <p>접근 권한이 없습니다</p>
}
```

## 다음 단계

1. **웹훅**: Jira/Confluence 이벤트 실시간 구독
2. **동기화**: 정기적인 배치 작업으로 콘텐츠 동기화
3. **검색 강화**: Elasticsearch로 고급 검색
4. **감사 로그**: 모든 API 호출 기록

---

**마지막 업데이트**: 2026년 4월 22일
