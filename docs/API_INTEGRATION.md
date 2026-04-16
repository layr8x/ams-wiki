# 🔌 AMS Wiki API 통합 가이드

## 개요

AMS Wiki는 세 가지 데이터 소스를 지원합니다:

1. **모의 데이터** (기본): `src/api/mockData.js` - 개발/데모용
2. **REST API**: `/api/v1/wiki/*` - 백엔드 연동
3. **Supabase**: PostgreSQL + Real-time 데이터베이스 - 프로덕션 데이터 저장소

---

## 1. 환경 설정

### .env.local 파일

```bash
# Confluence API (옵션)
VITE_CONFLUENCE_EMAIL=your-email@example.com
VITE_CONFLUENCE_TOKEN=your-api-token

# Supabase (권장)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# API 설정
VITE_API_BASE_URL=http://localhost:5173
VITE_API_TIMEOUT=10000
```

---

## 2. 모의 데이터 (mockData)

### 사용 시나리오
- ✅ 로컬 개발 (백엔드 없이)
- ✅ UI/UX 작업
- ✅ 데모

### 데이터 구조
```javascript
// src/api/mockData.js
export const MODULES = [
  { id: 'operation', label: '수업운영 관리', guide_count: 5 },
  // ...
]

export const GUIDES = [
  {
    id: 'enroll-transfer',
    module: '수업운영 관리',
    title: '전반 가이드',
    // ...
  },
]
```

### API 함수 (자동 Fallback)
```javascript
// src/api/guides.js
// API 실패 시 자동으로 mockData 사용
export const getGuides = (params) =>
  withFallback(
    () => client.get('/guides', { params }).then(r => r.data),
    () => Promise.resolve(mockDataGuides)
  )
```

---

## 3. REST API 엔드포인트

### 기본 설정
- **Base URL**: `/api/v1/wiki`
- **Auth**: Bearer token (JWT) 헤더에 자동 첨부
- **Content-Type**: `application/json`
- **Timeout**: 10초

### 모듈
```
GET /api/v1/wiki/modules
응답: { data: Module[] }

Module:
  - id: string (모듈 ID)
  - label: string (모듈명)
  - guide_count: number (가이드 수)
  - description: string
  - icon: string (Lucide 아이콘 명)
```

### 가이드
```
GET /api/v1/wiki/guides?module=operation&q=전반&page=1&per_page=20
응답: { data: Guide[], pagination: { page, per_page, total, total_pages } }

POST /api/v1/wiki/guides
본문: { title, summary, content, module_id, guide_type, target_roles, tags }
응답: { data: Guide }

GET /api/v1/wiki/guides/:id
응답: { data: Guide }

PUT /api/v1/wiki/guides/:id
본문: { title, summary, content, ... }
응답: { data: Guide }

POST /api/v1/wiki/guides/:id/publish
응답: { data: Guide }
```

### 검색
```
GET /api/v1/wiki/search?q=전반&module=operation&limit=8
응답: { data: [{ id, title, module, snippet }] }
```

### 피드백
```
POST /api/v1/wiki/guides/:id/feedback
본문: { useful: boolean, comment: string }
응답: { ok: true }
```

---

## 4. Supabase 통합

### 설치
```bash
npm install @supabase/supabase-js
```

### 사용법
```javascript
import { db } from '@/api/supabase'

// 가이드 조회
const { data, total } = await db.getGuides({ module_id: 'operation' })

// 검색
const results = await db.search('전반', 20)

// 피드백 제출
await db.submitFeedback(guideId, true, '매우 도움이 됩니다!')
```

### 테이블 스키마

#### guides
| 열 | 타입 | 설명 |
|---|------|------|
| id | uuid | 기본키 |
| module_id | varchar | 모듈 ID |
| title | varchar | 가이드 제목 |
| summary | text | 요약 |
| content | text | 마크다운 본문 |
| guide_type | varchar | sop / trouble / reference / decision |
| author | varchar | 작성자명 |
| target_roles | varchar[] | ['운영자', '실장'] |
| tags | varchar[] | ['전반', '입반'] |
| status | varchar | draft / published |
| view_count | integer | 조회수 |
| created_at | timestamp | 생성일 |
| updated_at | timestamp | 수정일 |
| published_at | timestamp | 발행일 |

#### guide_feedback
| 열 | 타입 | 설명 |
|---|------|------|
| id | uuid | 기본키 |
| guide_id | uuid | 가이드 ID (FK) |
| user_id | varchar | 사용자 |
| useful | boolean | 유용 여부 |
| comment | text | 피드백 의견 |
| created_at | timestamp | 생성일 |

---

## 5. 데이터 동기화 전략

### 개발 환경
```
mockData → 로컬 테스트
     ↓
REST API → 백엔드 개발 중 (선택)
     ↓
Supabase → 실시간 동기화
```

### 프로덕션
```
Confluence ─→ 가이드 작성
     ↓
REST API ─→ 동기화
     ↓
Supabase ─→ 데이터베이스 저장
     ↓
Frontend ─→ 표시
```

---

## 6. 에러 처리

### 자동 Fallback
```javascript
// API 실패 시 자동으로 mockData 사용
export const getGuides = (params) =>
  withFallback(
    () => api.call(),
    () => fallbackData
  )
```

### 401 Unauthorized
```javascript
// API 클라이언트는 자동으로 로그인 페이지로 리다이렉트
client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
```

---

## 7. 성능 최적화

### React Query 캐싱
```javascript
const { data } = useQuery(['guides'], getGuides, {
  staleTime: 5 * 60 * 1000,      // 5분
  cacheTime: 10 * 60 * 1000,     // 10분
})
```

### Supabase Real-time 구독
```javascript
supabase
  .from('guides')
  .on('*', payload => {
    console.log('가이드 업데이트:', payload)
  })
  .subscribe()
```

---

## 8. 데이터 마이그레이션

### mockData → Supabase
```bash
# 1. Supabase 테이블 생성
# 2. 마이그레이션 스크립트 실행
npm run db:seed

# 3. 환경변수 업데이트
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## 9. 타입 정의 (TypeScript)

```typescript
interface Guide {
  id: string
  module_id: string
  title: string
  summary: string
  content: string
  guide_type: 'sop' | 'trouble' | 'reference' | 'decision'
  author: string
  target_roles: string[]
  tags: string[]
  status: 'draft' | 'published'
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

interface Module {
  id: string
  label: string
  guide_count: number
  description: string
  icon: string
}
```

---

## 10. 문제 해결

### Q: mockData가 로드되지 않음
**A**: `src/api/mockData.js`가 존재하는지 확인하고, 구조가 맞는지 검증하세요.

### Q: Supabase에 연결되지 않음
**A**: `.env.local`에서 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를 확인하세요.

### Q: 401 에러가 반복됨
**A**: localStorage의 `ams_token`이 유효한지 확인하고, 만료되었다면 재인증하세요.

---

## 📚 참고 자료
- [Supabase 문서](https://supabase.com/docs)
- [Axios 인터셉터](https://axios-http.com/kr/docs/interceptors)
- [React Query 캐싱](https://tanstack.com/query/latest/docs/react/caching)
