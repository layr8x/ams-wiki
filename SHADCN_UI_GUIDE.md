# shadcn/ui 핵심 개념 및 구현 가이드

## 1. shadcn/ui의 정의와 특징

### 1.1 shadcn/ui란?
shadcn/ui는 **컴포넌트 라이브러리가 아닌 컴포넌트 수집 도구**입니다. 공식 NPM 패키지가 아니라, CLI를 통해 컴포넌트 소스 코드를 프로젝트에 직접 복사하는 방식으로 작동합니다.

**핵심 특징:**
- 컴포넌트는 프로젝트에 직접 포함됨 (의존성 없음)
- 완전한 커스터마이제이션 가능
- Radix UI 기반의 접근성 좋은 기본 컴포넌트 제공
- Tailwind CSS 기반의 스타일링
- Class Variance Authority(CVA)를 이용한 variant 관리

---

## 2. 기본 구조 및 아키텍처

### 2.1 프로젝트 설정 구조

```
project-root/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui 컴포넌트 저장소
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       └── ...
│   ├── lib/
│   │   └── utils.js         # cn() 유틸리티 함수
│   └── index.css            # Tailwind + CSS 변수 선언
├── tailwind.config.js       # Tailwind 설정 (CSS 변수 매핑)
├── components.json          # shadcn/ui 프로젝트 설정
└── vite.config.js          # 번들러 설정
```

### 2.2 components.json 역할

`components.json`은 shadcn/ui CLI의 설정 파일입니다:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "aliasPrefix": "@",
  "baseColor": "slate",
  "baseFont": "'Pretendard', sans-serif",
  "components": {
    "button": { "path": "src/components/ui/button.jsx" },
    "card": { "path": "src/components/ui/card.jsx" }
  }
}
```

**주요 속성:**
- `aliasPrefix`: import 경로의 별칭 (@는 /src를 의미)
- `baseColor`: 기본 색상 팔레트 (slate, stone, gray 등)
- `baseFont`: 기본 폰트 (components.json에서만 설정하고, 실제 로드는 CSS에서)
- `style`: 컴포넌트 스타일 형식 (default, new-york)

---

## 3. CSS 변수 시스템 (매우 중요)

### 3.1 CSS 변수명 규칙

shadcn/ui는 **HSL 기반의 CSS 변수**를 사용합니다. Tailwind v4의 `@theme`을 이용하여 변수를 선언합니다.

#### 변수명 규칙 (필수):
```css
/* 형식: --[그룹명]-[컬러명] */
/* 예: --color-primary, --color-card-foreground */

@theme {
  /* 기본 UI 색상 */
  --color-background:          #ffffff;     /* 배경 */
  --color-foreground:          #09090b;     /* 텍스트 */
  --color-border:              #e4e4e7;     /* 보더 */
  --color-input:               #e4e4e7;     /* 입력 필드 */
  --color-ring:                #18181b;     /* 포커스 링 */
  
  /* 상태별 색상 (Semantic Colors) */
  --color-primary:             #18181b;
  --color-primary-foreground:  #fafafa;
  
  --color-secondary:           #f4f4f5;
  --color-secondary-foreground: #18181b;
  
  --color-destructive:         #ef4444;
  --color-destructive-foreground: #fafafa;
  
  --color-muted:               #f4f4f5;
  --color-muted-foreground:    #71717a;
  
  --color-accent:              #f4f4f5;
  --color-accent-foreground:   #18181b;
  
  --color-card:                #ffffff;
  --color-card-foreground:     #09090b;
  
  --color-popover:             #ffffff;
  --color-popover-foreground:  #09090b;
  
  /* 디자인 시스템 변수 */
  --radius:                    0.5rem;      /* border-radius */
}
```

### 3.2 색상값 형식 (중요!)

shadcn/ui는 **HSL 형식을 공백으로 분리하여 저장**합니다:

```css
/* 틀린 방식 (완전한 HSL 값) */
--color-primary: hsl(0, 0%, 10%);

/* 올바른 방식 (HSL 요소만 분리) */
--color-primary: 0 0% 10%;
```

**Tailwind 설정에서의 참조:**
```javascript
// tailwind.config.js
colors: {
  primary: "hsl(var(--color-primary))",  /* hsl() 함수 필요 */
  foreground: "hsl(var(--color-foreground))",
}
```

**왜 이렇게 하는가?**
- 동적 색상 수정 가능 (CSS 변수만 변경)
- 다크모드 전환 시 모든 색상 일괄 변경
- 런타임에 색상 조정 가능

### 3.3 다크모드 구현

다크모드는 `html.dark` 선택자로 별도 변수 세트를 정의합니다:

```css
/* Light mode (기본값) */
@theme {
  --color-background: #ffffff;
  --color-foreground: #09090b;
  --color-primary: #18181b;
  --color-primary-foreground: #fafafa;
}

/* Dark mode */
html.dark {
  --color-background: #09090b;
  --color-foreground: #fafafa;
  --color-primary: #fafafa;
  --color-primary-foreground: #18181b;
  --color-card: #09090b;
  --color-card-foreground: #fafafa;
}
```

**Tailwind 다크모드 설정:**
```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],  /* 클래스 기반 다크모드 */
  // ...
}
```

**다크모드 사용 방법:**
```javascript
// HTML에 dark 클래스 추가
<html className="dark">

// JavaScript에서 토글
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('dark');
```

---

## 4. Tailwind CSS와의 통합

### 4.1 Tailwind 설정의 역할

Tailwind 설정이 CSS 변수를 Tailwind 클래스로 변환합니다:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        /* CSS 변수를 Tailwind 색상으로 매핑 */
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        
        /* 복합 색상 (색상 + 전경색) */
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))",
          foreground: "hsl(var(--color-secondary-foreground))",
        },
        
        /* 기타 의미있는 색상 */
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },
      },
      
      /* Border radius 매핑 */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      /* 애니메이션 */
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}
```

### 4.2 CSS에서 Tailwind 설정까지의 흐름

```
CSS (index.css)
  ↓
  @theme { --color-primary: 0 0% 10%; }
  ↓
Tailwind 설정 (tailwind.config.js)
  ↓
  colors: { primary: "hsl(var(--color-primary))" }
  ↓
컴포넌트에서 사용
  ↓
  className="bg-primary text-primary-foreground"
  ↓
생성되는 CSS
  ↓
  background-color: hsl(0 0% 10%);
  color: hsl(240 10% 98%);
```

---

## 5. 컴포넌트 아키텍처

### 5.1 shadcn/ui 컴포넌트의 구조

shadcn/ui 컴포넌트는 다음 요소로 구성됩니다:

1. **Radix UI** - 접근성 기반 기본 컴포넌트
2. **Class Variance Authority (CVA)** - Variant 관리
3. **cn() 유틸리티** - 클래스명 병합 및 충돌 해결
4. **Tailwind CSS** - 스타일링

### 5.2 실제 컴포넌트 예제: Button

```javascript
// src/components/ui/button.jsx
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* Step 1: CVA로 variant 정의 */
export const buttonVariants = cva(
  /* 기본 스타일 (모든 variant에 적용) */
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:     'border border-input bg-background hover:bg-accent',
        secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:       'hover:bg-accent hover:text-accent-foreground',
        link:        'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 rounded-md px-3 text-xs',
        lg:      'h-10 rounded-md px-6',
        icon:    'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

/* Step 2: React 컴포넌트 작성 */
export function Button({ variant, size, className, children, ...props }) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }), className)} 
      {...props}
    >
      {children}
    </button>
  )
}
```

**CVA의 역할:**
- `buttonVariants()` 함수로 variant와 size 조합에 따른 클래스명 생성
- 타입 안정성 제공 (TypeScript 지원)
- 동적으로 클래스명 수정 가능

### 5.3 Card 컴포넌트 예제 (구성 패턴)

```javascript
// src/components/ui/card.jsx
import { cn } from '@/lib/utils'

/* Card는 CVA 대신 고정된 구조로 만들어짐 */
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
}

/* 조합 컴포넌트들 */
export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn('text-base font-semibold leading-none tracking-tight', className)} {...props} />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
```

**사용 예:**
```javascript
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

### 5.4 cn() 유틸리티 함수의 중요성

```javascript
// src/lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))
```

**역할:**
1. `clsx` - 조건부 클래스명 병합
2. `twMerge` - Tailwind 클래스 충돌 해결 (후자가 우선)

**예:**
```javascript
/* 충돌하는 클래스를 처리 */
cn(
  'px-4 py-2 bg-blue-500',  /* 원본 */
  'px-8 bg-red-500'         /* 오버라이드 */
)
// 결과: 'px-8 py-2 bg-red-500' (겹치는 부분은 마지막 값 사용)
```

---

## 6. 한국 프로젝트에서의 올바른 사용법

### 6.1 폰트 설정

```css
/* index.css */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}
```

**components.json에서도 참조:**
```json
{
  "baseFont": "'Pretendard', sans-serif"
}
```

### 6.2 커스텀 Variant 추가

Badge 컴포넌트의 가이드 타입별 variant 예:

```javascript
// src/components/ui/badge.jsx
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border font-semibold',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-primary text-primary-foreground',
        secondary:   'border-transparent bg-secondary text-secondary-foreground',
        
        /* 가이드 타입 */
        sop:         'border-blue-200 bg-blue-50 text-blue-700',
        decision:    'border-amber-200 bg-amber-50 text-amber-700',
        reference:   'border-emerald-200 bg-emerald-50 text-emerald-700',
        trouble:     'border-orange-200 bg-orange-50 text-orange-700',
        response:    'border-purple-200 bg-purple-50 text-purple-700',
        policy:      'border-red-200 bg-red-50 text-red-700',
        
        /* 심각도 */
        critical:    'border-red-300 bg-red-100 text-red-800',
        high:        'border-amber-300 bg-amber-100 text-amber-800',
        medium:      'border-gray-200 bg-gray-100 text-gray-700',
        low:         'border-green-200 bg-green-100 text-green-700',
      },
      size: {
        sm: 'px-1.5 py-0 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  }
)
```

### 6.3 전역 스타일 설정

```css
/* index.css - 기본 리셋 및 전역 스타일 */

/* 기본 리셋 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 다크모드 지원 */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  transition: background-color 0.2s, color 0.2s;
}

/* 포커스 상태 */
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

/* 스크롤바 커스터마이징 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
```

### 6.4 프로젝트별 커스터마이제이션 체크리스트

#### CSS 변수 설정 (필수):
- [ ] 모든 색상을 CSS 변수로 정의
- [ ] 변수명이 일관성 있게 `--color-*` 형식
- [ ] HSL 형식으로 공백 분리 (예: `0 0% 10%`)
- [ ] Light mode와 dark mode 변수 모두 정의
- [ ] 다크모드 변수를 `html.dark` 선택자에 포함

#### Tailwind 설정:
- [ ] CSS 변수를 색상으로 매핑
- [ ] `darkMode: ["class"]` 설정
- [ ] border-radius 변수 매핑
- [ ] 커스텀 애니메이션 정의

#### 컴포넌트 작성:
- [ ] CVA 사용 (복잡한 variant가 있을 때)
- [ ] cn() 함수로 클래스명 병합
- [ ] 스프레드 연산자로 props 전달
- [ ] defaultVariants 명시

#### 다크모드:
- [ ] `html.dark` 클래스로 토글 구현
- [ ] CSS 변수만 변경되도록 설정 (컴포넌트 코드 변경 없음)
- [ ] 모든 색상이 다크모드에서도 작동하는지 테스트

---

## 7. 파일 구조 정리

### 7.1 현재 프로젝트 구조 (AMS Wiki)

```
/home/user/ams-wiki/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui 컴포넌트
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── badge.jsx
│   │       ├── alert.jsx
│   │       ├── dialog.jsx
│   │       └── ... (13개 컴포넌트)
│   ├── lib/
│   │   └── utils.js         # cn() 유틸리티 함수
│   ├── index.css            # Tailwind @import + CSS 변수 + 전역 스타일
│   └── App.css
├── tailwind.config.js       # Tailwind 설정 (CSS 변수 매핑)
├── components.json          # shadcn/ui 설정
├── vite.config.js
└── package.json
```

### 7.2 의존성 분석

```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",  /* CVA - variant 관리 */
    "clsx": "^2.1.1",                       /* 조건부 클래스 병합 */
    "tailwind-merge": "^3.5.0",             /* Tailwind 클래스 충돌 해결 */
    "@radix-ui/react-dialog": "^1.1.15",   /* 컴포넌트 기반 라이브러리 */
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-tooltip": "^1.2.8",
    "lucide-react": "^1.8.0"                /* 아이콘 라이브러리 */
  },
  "devDependencies": {
    "tailwindcss": "^4.2.2",                /* Tailwind v4 with @theme */
    "@tailwindcss/vite": "^4.2.2"           /* Vite 플러그인 */
  }
}
```

---

## 8. 실제 구현 예시

### 8.1 복잡한 컴포넌트 만들기

```javascript
// src/components/ui/alert-card.jsx
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertCardVariants = cva(
  'rounded-lg border p-4 flex gap-3',
  {
    variants: {
      severity: {
        critical: 'border-red-300 bg-red-50',
        high:     'border-amber-300 bg-amber-50',
        medium:   'border-gray-300 bg-gray-50',
        low:      'border-green-300 bg-green-50',
      },
    },
    defaultVariants: { severity: 'medium' },
  }
)

export function AlertCard({ severity, title, children, className, icon: Icon }) {
  return (
    <div className={cn(alertCardVariants({ severity }), className)}>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <div>
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        {children}
      </div>
    </div>
  )
}
```

**사용:**
```javascript
<AlertCard severity="critical" title="중요">
  이것은 매우 중요한 메시지입니다.
</AlertCard>
```

### 8.2 다크모드 완벽 지원하기

```javascript
// src/hooks/useDarkMode.js
import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // 시스템 설정 읽기
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    // 또는 localStorage에서 읽기
    const saved = localStorage.getItem('theme')
    const shouldBeDark = saved ? saved === 'dark' : isDarkMode

    setIsDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    const newState = !isDark
    setIsDark(newState)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', newState ? 'dark' : 'light')
  }

  return { isDark, toggle }
}
```

---

## 9. 일반적인 실수와 해결책

### 9.1 CSS 변수 형식 오류

❌ **틀림:**
```css
--color-primary: hsl(200, 50%, 50%);  /* 완전한 HSL 값 */
```

✓ **맞음:**
```css
--color-primary: 200 50% 50%;  /* 공백으로 분리 */
```

### 9.2 Tailwind 설정에서 변수 참조 누락

❌ **틀림:**
```javascript
colors: {
  primary: "var(--color-primary)",  /* hsl() 함수 없음 */
}
```

✓ **맞음:**
```javascript
colors: {
  primary: "hsl(var(--color-primary))",  /* hsl() 함수로 감싸기 */
}
```

### 9.3 다크모드 클래스 토글 실패

❌ **틀림:**
```javascript
// body에 dark 클래스 추가
document.body.classList.add('dark')
```

✓ **맞음:**
```javascript
// html 요소에 dark 클래스 추가
document.documentElement.classList.add('dark')
```

### 9.4 클래스 충돌 해결 미흡

❌ **틀림:**
```javascript
// 단순 문자열 연결
const className = baseClass + ' ' + customClass
```

✓ **맞음:**
```javascript
// cn() 함수로 충돌 해결
import { cn } from '@/lib/utils'
const className = cn(baseClass, customClass)
```

---

## 10. 성능 최적화

### 10.1 CVA Memoization

```javascript
import { useMemo } from 'react'

// 큰 컴포넌트의 경우
export function ComplexButton({ variant, size, ...props }) {
  const className = useMemo(
    () => buttonVariants({ variant, size }),
    [variant, size]
  )
  
  return <button className={className} {...props} />
}
```

### 10.2 CSS 변수 최소화

```css
/* 불필요한 변수는 제거 */
/* 대신 Tailwind의 내장 색상 사용 */
@theme {
  --color-primary: 0 0% 10%;
  --color-secondary: 0 0% 20%;
  /* --color-tertiary는 필요없으면 제거 */
}
```

---

## 11. 체크리스트: 정확한 shadcn/ui 구현

### 초기 설정 시:
- [ ] `components.json` 생성 및 `baseColor`, `aliasPrefix` 설정
- [ ] `src/lib/utils.js`에 `cn()` 함수 구현
- [ ] `src/index.css`에 `@import "tailwindcss"` 추가
- [ ] CSS 변수를 `@theme` 블록에 HSL 형식으로 정의
- [ ] `tailwind.config.js`에서 CSS 변수를 Tailwind 색상으로 매핑
- [ ] Dark mode를 `html.dark` 선택자로 구현

### 컴포넌트 생성 시:
- [ ] CVA로 variant 정의 (필요시)
- [ ] `cn()` 함수로 클래스명 병합
- [ ] 모든 색상은 CSS 변수 기반 (직접 색상값 지정 금지)
- [ ] defaultVariants 명시
- [ ] PropTypes 또는 TypeScript 타입 추가

### 다크모드 구현 시:
- [ ] 모든 색상의 다크모드 버전 정의
- [ ] `html` 요소에 `dark` 클래스 토글
- [ ] CSS 변수만 변경 (컴포넌트 코드 수정 없음)
- [ ] 모든 상태(hover, focus, active) 다크모드 테스트

---

## 12. 결론 및 요약

**shadcn/ui의 핵심 이해:**
1. **컴포넌트 라이브러리가 아닌 수집 도구** - 직접 복사하여 커스터마이징
2. **CSS 변수 기반 테마 시스템** - 런타임에 색상 변경 가능
3. **Tailwind CSS 통합** - CVA + cn() + Tailwind로 안정적 구축
4. **완전한 커스터마이제이션** - 프로젝트별로 자유롭게 수정 가능

**한국 프로젝트 특화 사항:**
- Pretendard 폰트 설정
- 한글 가독성 고려 (line-height, letter-spacing)
- 다크모드 완벽 지원
- 브랜드 색상 CSS 변수화

이 가이드를 따르면 shadcn/ui를 올바르게 구현하고 유지보수하기 쉬운 디자인 시스템을 구축할 수 있습니다.
