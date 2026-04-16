# Confluence 동기화 가이드

## 개요

AMS Wiki는 Atlassian Confluence의 FVSOL 스페이스에서 가이드 데이터를 자동 동기화할 수 있습니다.

- **동기화 방향**: Confluence → Supabase → AMS Wiki
- **동기화 주기**: 수동 (필요 시) 또는 정기 (GitHub Actions)
- **데이터 변환**: Confluence HTML → 마크다운/JSON

---

## 1. 환경 설정

### 1.1 Atlassian API 토큰 생성

1. [Atlassian 계정](https://id.atlassian.com/manage-profile/security/api-tokens)에 접속
2. **API 토큰 생성** 클릭
3. 토큰명: `AMS Wiki Sync` (예시)
4. 토큰 복사

### 1.2 환경변수 설정

```bash
# .env.local
VITE_CONFLUENCE_EMAIL=your-email@example.com
VITE_CONFLUENCE_TOKEN=your-api-token-here
VITE_CONFLUENCE_DOMAIN=hiconsy.atlassian.net  # 선택사항
```

---

## 2. API 사용법

### 검색

```javascript
import { searchConfluencePages } from '@/api/confluence'

// FVSOL 스페이스에서 "전반" 키워드 검색
const pages = await searchConfluencePages(
  'space = "FVSOL" AND title ~ "전반"',
  { limit: 50 }
)

pages.forEach(page => {
  console.log(`${page.title} (${page.id})`)
})
```

### 페이지 조회

```javascript
import { getConfluencePage } from '@/api/confluence'

const page = await getConfluencePage('1234567890')
console.log(page.body.storage.value) // HTML 본문
```

### 페이지를 가이드로 변환

```javascript
import { convertPageToGuide } from '@/api/confluence'

const guide = convertPageToGuide(page, 'operation')
// {
//   id: 'confluence-1234567890',
//   module_id: 'operation',
//   title: '전반 가이드',
//   summary: '...',
//   content: '<p>...</p>',
//   ...
// }
```

### 전체 동기화

```javascript
import { syncConfluenceGuides } from '@/api/confluence'

const result = await syncConfluenceGuides()
// {
//   success: 16,
//   failed: 0,
//   guides: [...]
// }
```

### 모듈별 동기화

```javascript
import { syncModuleGuides } from '@/api/confluence'

// 수업운영 모듈 가이드만 동기화
const guides = await syncModuleGuides('operation', '수업운영관리')
```

---

## 3. CQL (Confluence Query Language) 쿼리

### 자주 사용하는 쿼리

```
# FVSOL 스페이스의 모든 페이지
space = "FVSOL"

# "전반" 제목이 포함된 페이지
space = "FVSOL" AND title ~ "전반"

# 최근 30일 업데이트된 페이지
space = "FVSOL" AND updated >= -30d

# 특정 사용자가 작성한 페이지
space = "FVSOL" AND creator = "user@example.com"

# 라벨이 있는 페이지
space = "FVSOL" AND label in ("가이드", "운영")

# 페이지 타입 필터
space = "FVSOL" AND type = "page"
```

### 참고
- [Confluence Query Language (CQL)](https://developer.atlassian.com/server/confluence/confluence-query-language-cql/)

---

## 4. 스크립트 실행

### Node.js 스크립트 (로컬)

```bash
# 아직 구현되지 않음 (향후 추가)
# npm run confluence:sync
```

### GitHub Actions (자동 동기화)

```yaml
# .github/workflows/sync-confluence.yml (예시)
name: Confluence Sync

on:
  schedule:
    - cron: '0 0 * * 1'  # 매주 월요일 00:00 UTC

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run confluence:sync
        env:
          VITE_CONFLUENCE_EMAIL: ${{ secrets.CONFLUENCE_EMAIL }}
          VITE_CONFLUENCE_TOKEN: ${{ secrets.CONFLUENCE_TOKEN }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## 5. 데이터 정합성 검증

### mockData vs Confluence

```javascript
import { compareGuides } from '@/types/guide'
import { GUIDES } from '@/api/mockData'
import { syncConfluenceGuides } from '@/api/confluence'

const { guides: confluenceGuides } = await syncConfluenceGuides()

confluenceGuides.forEach(confluenceGuide => {
  const mockGuide = GUIDES.find(g => g.id === confluenceGuide.id)
  if (mockGuide) {
    const diff = compareGuides(mockGuide, confluenceGuide)
    if (diff.length > 0) {
      console.warn(`불일치: ${confluenceGuide.title}`, diff)
    }
  }
})
```

---

## 6. 문제 해결

### Q: 401 Unauthorized 에러
**A**: Confluence 토큰이 만료되거나 올바르지 않습니다.
- 새로운 API 토큰 생성
- 환경변수 다시 설정
- 이메일이 정확한지 확인

### Q: 페이지를 찾을 수 없음
**A**: FVSOL 스페이스 이름이나 페이지 제목을 확인하세요.
- Confluence에서 직접 검색해서 정확한 이름 확인
- CQL 쿼리 테스트: Confluence 고급 검색에서 CQL 입력

### Q: HTML 본문이 손상됨
**A**: 일부 Confluence 매크로는 HTML로 변환되지 않을 수 있습니다.
- `body-format=storage` 옵션으로 조회해서 원본 HTML 확인
- 필요시 수동으로 마크다운 변환

---

## 7. API 비용

- Atlassian Cloud: **무료** (모든 엔드포인트 포함)
- 요청 제한: IP당 분당 1000 요청
- 대용량 데이터: 배치 처리 권장

---

## 8. 다음 단계

- [ ] 정기 동기화 GitHub Actions 설정
- [ ] 증분 동기화 (변경된 페이지만)
- [ ] Confluence 매크로 마크다운 변환
- [ ] 실패한 페이지 재시도 로직

---

**참고 자료**
- [Confluence REST API v2](https://developer.atlassian.com/cloud/confluence/rest/v2/)
- [Confluence Query Language](https://developer.atlassian.com/server/confluence/confluence-query-language-cql/)
