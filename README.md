# AMS Wiki

Vite와 shadcn/ui 컴포넌트로 구축된 최신 React 애플리케이션으로, Vercel에 자동 배포 기능이 포함되어 있습니다.

## 기술 스택

- **프레임워크**: React 19 + Vite
- **스타일링**: Tailwind CSS 4 + shadcn/ui
- **컴포넌트**: Radix UI primitives
- **라우팅**: React Router v7
- **상태 관리**: React Query
- **배포**: GitHub Actions CI/CD를 포함한 Vercel

## 빠른 시작

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local을 Confluence 자격증명으로 수정

# 개발 서버 시작
npm run dev
```

[http://localhost:5173](http://localhost:5173)을 브라우저에서 열어 애플리케이션을 확인합니다.

### 사용 가능한 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 실행
- `npm run preview` - 프로덕션 빌드 미리보기

## 기능

- ✅ 완벽한 shadcn/ui 컴포넌트 라이브러리 (15개 이상)
- ✅ Tailwind CSS를 이용한 반응형 디자인
- ✅ Vercel로의 자동 배포
- ✅ GitHub Actions CI/CD 파이프라인
- ✅ 환경 변수 관리
- ✅ ESLint 설정

## 배포

### 자동 배포

- **프리뷰**: `claude/*` 브랜치로 푸시 시 배포
- **프로덕션**: main 브랜치로의 수동 배포

자세한 배포 지침은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

### 환경 설정

필수 환경 변수:
- `VITE_CONFLUENCE_EMAIL` - Atlassian 이메일
- `VITE_CONFLUENCE_TOKEN` - [Atlassian](https://id.atlassian.com/manage-profile/security/api-tokens)에서 발급받은 API 토큰

## 컴포넌트 라이브러리

포함된 완벽한 shadcn/ui 컴포넌트 라이브러리:
- Button, Badge, Card
- Input, Textarea, Select, Checkbox, Radio
- Dialog, Tabs, Tooltip, Alert
- ScrollArea, Separator, Label

`@/components/ui`에서 임포트:

```jsx
import { Button, Input, Card } from '@/components/ui'
```

## 프로젝트 링크

- [라이브 데모](https://ams-wiki.vercel.app)
- [Vercel 대시보드](https://vercel.com/layr8xs-projects/ams-wiki)
- [shadcn/ui 문서](https://ui.shadcn.com)

## 도움말

- 배포 문제는 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조
- 린팅 규칙은 [ESLint 문서](https://eslint.org) 참조
- 빌드 설정은 [Vite 문서](https://vitejs.dev) 참조
