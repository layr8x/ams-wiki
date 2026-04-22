# Vercel Cron Jobs: Jira/Confluence 자동 동기화

**React Query 캐싱 + Vercel Cron Jobs** 조합으로 항상 신선한 데이터를 유지합니다.

## 개요

| 방식 | 언제 | 역할 |
|------|------|------|
| **React Query** (즉시) | 페이지 로드, 5분 staleTime | 사용자 화면 갱신 |
| **Vercel Cron** (백그라운드) | 6시간마다 | 모든 사용자 데이터 캐시 갱신 |

### 흐름도

```
사용자 페이지 로드
    ↓
React Query: 캐시된 데이터 있나? (staleTime 5분)
    ├─ YES (신선함) → 즉시 표시
    └─ NO (만료됨) → API 호출
         ↓
    /api/jira/search, /api/confluence/search
         ↓
    JiraClient / ConfluenceClient
         ↓
    Atlassian API (토큰 자동 갱신)

병렬로 진행:
    ↓
매 6시간마다:
    Vercel Cron Job 트리거
         ↓
    /api/sync/jira
    /api/sync/confluence
         ↓
    모든 활성 사용자의 데이터 조회
         ↓
    React Query 캐시 간접 갱신
         ↓
    다음 사용자 방문 시 신선한 데이터 제공
```

## 설정 단계

### 1단계: 환경 변수 설정

```bash
# .env.local (개발)
CRON_SECRET=your_random_secret_here

# Vercel (프로덕션)
# Settings → Environment Variables → 추가
CRON_SECRET=your_random_secret_here
```

**CRON_SECRET 생성:**
```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToHexString([System.Random]::new().GetBytes(16))
```

### 2단계: Supabase 마이그레이션 적용

```bash
npm run migrate
```

또는 Supabase Dashboard → SQL Editor:
```sql
-- supabase/migrations/sync_logs.sql 실행
```

이 마이그레이션은:
- `sync_logs` 테이블 생성 (Cron 실행 기록)
- 자동 정리 함수 (30일 이상 된 로그 삭제)

### 3단계: vercel.json 확인

`vercel.json`에 이미 Cron 설정이 포함됨:

```json
{
  "crons": [
    {
      "path": "/api/sync/jira",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**스케줄 설명:**

| 플랜 | 지원 | 설정 |
|------|------|------|
| **Hobby (무료)** ✅ 현재 | 1회/일 | `0 0 * * *` (매일 자정 UTC) |
| **Pro** ($20/월) | 무제한 | `0 */6 * * *` (6시간마다) |

**Hobby 플랜 제한:**
- 하루에 **1개의 Cron Job만** 실행 가능
- 현재 설정: 매일 자정(UTC) 동기화
- 한국 시간: 매일 오전 9시 동기화 (UTC+9)

**Pro 플랜으로 업그레이드 시 변경:**
```json
{
  "crons": [
    {
      "path": "/api/sync/jira",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/sync/confluence",
      "schedule": "0 1,7,13,19 * * *"
    }
  ]
}
```
- Jira: 6시간마다
- Confluence: 6시간마다 (1시간 후)

### 4단계: 배포 및 활성화

```bash
git push origin your-branch
# PR 병합 → Vercel 자동 배포
# Vercel Dashboard → Settings → Cron Jobs 확인
```

**플랜별 동작:**

| 플랜 | 동기화 빈도 | 비용 | 설정 |
|------|-----------|------|------|
| **Hobby** ✅ 현재 | 1회/일 (자정 UTC) | 무료 | 변경 불필요 |
| **Pro** 권장 | 6시간마다 | $20/월 | vercel.json 수정 필요 |

**더 자주 동기화 원하면:**
1. [Vercel 대시보드](https://vercel.com) → Settings → Billing
2. Plan 변경 → Pro ($20/월)
3. vercel.json에서 Cron 스케줄 변경
4. 재배포

## 사용 방법

### 자동으로 동작

배포 후 매 6시간마다 자동 실행. 추가 설정 필요 없음.

### 모니터링 대시보드 추가 (선택사항)

```jsx
import { SyncMonitor } from '@/components/admin/SyncMonitor'

export function AdminPage() {
  return <SyncMonitor />
}
```

**표시 내용:**
- 최근 20개 동기화 기록
- 성공/실패 상태
- 동기화된 이슈/페이지 개수
- 다음 실행 시간

### 수동 테스트

로컬 환경에서:
```bash
# CRON_SECRET 설정 필수
curl -H "Authorization: Bearer your_random_secret_here" \
  http://localhost:5173/api/sync/jira

curl -H "Authorization: Bearer your_random_secret_here" \
  http://localhost:5173/api/sync/confluence
```

Vercel 프로덕션:
```bash
curl -H "Authorization: Bearer your_cron_secret" \
  https://your-domain.vercel.app/api/sync/jira
```

## 응답 예제

### 성공 응답

```json
{
  "message": "Jira sync completed",
  "synced": 3,
  "totalIssues": 47,
  "results": [
    {
      "userId": "user-123",
      "cloudId": "abc123",
      "issueCount": 15,
      "status": "success"
    }
  ],
  "timestamp": "2026-04-22T10:46:00Z"
}
```

### 실패 응답

```json
{
  "error": "Sync failed",
  "message": "Token refresh failed",
  "timestamp": "2026-04-22T10:46:00Z"
}
```

## 문제 해결

### "CRON_SECRET not configured" 오류

**해결:**
```bash
# Vercel 환경 변수 확인
vercel env list

# 또는 Vercel Dashboard:
# Settings → Environment Variables → CRON_SECRET 존재 확인
```

### 동기화가 실행되지 않음

**원인 1: Vercel Pro 미가입**
- Cron Jobs는 Pro 플랜 이상 필요
- [Vercel 플랜 업그레이드](https://vercel.com/pricing)

**원인 2: vercel.json 문법 오류**
```bash
npm run build  # 로컬에서 빌드 테스트
git push       # 빌드 성공하면 배포
```

**원인 3: Supabase 마이그레이션 미적용**
```bash
npm run migrate
# 또는 Supabase Dashboard → SQL Editor에서 직접 실행
```

### 토큰 갱신 실패

**원인: Refresh Token 만료 (일반적으로 6개월)**

**해결:**
1. 사용자가 설정 페이지에서 "연결 해제"
2. "Atlassian 계정으로 연결" 다시 클릭
3. 새로운 토큰 발급

## 성능 고려사항

### API 호출 비용

**Atlassian API (무료):**
- Jira: 월 300,000회 호출 (Pro 기준)
- Confluence: 월 300,000회 호출

**우리 사용량:**

| 방식 | 계산 | 월 API 호출 | 여유 |
|------|------|-----------|------|
| **Hobby** (현재) | 사용자 3명 × 1회/일 × 30일 | 90회 | ✅ 충분 |
| **Pro** (권장) | 사용자 3명 × 6회/일 × 30일 | 540회 | ✅ 충분 |
| **엔터프라이즈** | 사용자 50명 × 6회/일 × 30일 | 9,000회 | ✅ 충분 |

모든 플랜에서 **여유 있게 무료** ✅

### 스케줄 최적화

**Hobby 플랜** (현재):
- 제약: 하루 1회만 가능
- 현재 설정: `0 0 * * *` (자정 UTC)

**Pro 플랜** (권장):
```json
{
  "path": "/api/sync/jira",
  "schedule": "0 */6 * * *"  // 6시간마다
}
```

**더 자주 동기화 원하면 (Pro 필수):**
```json
{
  "path": "/api/sync/jira",
  "schedule": "0 * * * *"  // 매시간
}
```

⚠️ 주의:
- Hobby: 1회/일만 가능 (변경 불가)
- Pro: 무제한 가능
- 매시간 × 200 사용자 = API 비용 증가 (하지만 여전히 무료)

## 고급 설정

### 선택적 동기화 범위 제한

`api/sync/jira.js` 수정:

```javascript
// 특정 프로젝트만 동기화
const jql = 'project = PROJ AND updated >= -7d ORDER BY updated DESC'

// 또는 특정 상태의 이슈만
const jql = 'status IN ("In Progress", "To Do") AND updated >= -1d'
```

### Slack 알림 추가

동기화 실패 시 Slack 알림:

```javascript
// api/sync/jira.js에 추가
if (results.some(r => r.status === 'error')) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `❌ Jira sync failed: ${results.length} errors`,
    }),
  })
}
```

### 데이터베이스에 동기화 결과 저장

현재는 `sync_logs` 테이블에만 기록. 실제 이슈/페이지를 DB에 저장하려면:

```javascript
// api/sync/jira.js 에 추가
for (const issue of result.issues) {
  await supabase
    .from('synced_jira_issues')
    .upsert({
      issue_key: issue.key,
      title: issue.fields.summary,
      status: issue.fields.status.name,
      user_id: integration.user_id,
      synced_at: new Date().toISOString(),
    })
}
```

## 디버깅

### 로그 확인

```bash
# Vercel 대시보드
# Deployments → Functions → /api/sync/jira → Logs

# 또는 CLI
vercel logs api/sync/jira --tail
```

### Supabase 로그 확인

```sql
SELECT * FROM sync_logs 
ORDER BY synced_at DESC 
LIMIT 10;
```

## 다음 단계

1. **실시간 웹훅**: Jira/Confluence 이벤트 실시간 구독 (더 신선한 데이터)
2. **증분 동기화**: 변경된 항목만 조회 (API 비용 절감)
3. **UI 캐시**: 클라이언트 로컬 스토리지 활용 (오프라인 지원)
4. **검색 최적화**: Elasticsearch로 고급 검색

## 참고 문서

- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Vercel 환경 변수](https://vercel.com/docs/projects/environment-variables)
- [React Query 스테일타임](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Jira API Rate Limits](https://developer.atlassian.com/cloud/jira/platform/rate-limiting/)

---

**마지막 업데이트**: 2026년 4월 22일
