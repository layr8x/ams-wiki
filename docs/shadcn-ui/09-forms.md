# 09. 폼 구축 (React Hook Form + Zod · TanStack Form)

shadcn/ui 는 폼 라이브러리 본체가 아닌 **폼 레시피**를 제공합니다. 핵심은 3가지:

1. **React Hook Form** — 입력 상태·검증 관리
2. **Zod** — 스키마 기반 런타임 검증
3. **shadcn Field / Form 프리미티브** — 접근성 있는 라벨·설명·에러 메시지 배치

> 2026년 기준 **TanStack Form** 레시피도 공식. 미래 대비로 알아둘 것.

## 설치

```bash
pnpm dlx shadcn@latest add form
pnpm add react-hook-form zod @hookform/resolvers
```

## Zod 스키마 정의

```ts
import * as z from "zod"

export const bugSchema = z.object({
  title: z.string().min(5, "5자 이상 입력하세요").max(32, "32자 이하"),
  description: z.string().min(20).max(500),
  severity: z.enum(["low", "medium", "high"]),
  agree: z.boolean().refine(v => v, "동의해야 합니다"),
})

export type BugForm = z.infer<typeof bugSchema>
```

## useForm + zodResolver

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bugSchema, type BugForm } from "./schema"

export function BugReportForm() {
  const form = useForm<BugForm>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "medium",
      agree: false,
    },
    mode: "onBlur",    // onChange | onBlur | onSubmit | onTouched
  })

  function onSubmit(data: BugForm) {
    // 서버 제출
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 필드들 */}
      </form>
    </Form>
  )
}
```

## 새로운 Field API (권장)

2025년 이후 shadcn/ui 는 **Controller + Field/FieldLabel/FieldError** 조합을 권장합니다. 기존 `FormField / FormItem / FormLabel / FormControl / FormDescription / FormMessage` 도 그대로 동작.

```tsx
import { Controller } from "react-hook-form"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Controller
  name="title"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>버그 제목</FieldLabel>
      <Input
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="로그인 버튼이 모바일에서 동작 안 함"
        autoComplete="off"
      />
      <FieldDescription>검색 결과에 노출되는 간단한 요약입니다.</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## 구형 FormField 패턴 (기존 프로젝트 호환)

```tsx
<FormField
  control={form.control}
  name="severity"
  render={({ field }) => (
    <FormItem>
      <FormLabel>심각도</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="low">낮음</SelectItem>
          <SelectItem value="medium">중간</SelectItem>
          <SelectItem value="high">높음</SelectItem>
        </SelectContent>
      </Select>
      <FormDescription>배포 차단 여부를 결정합니다.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Checkbox 바인딩

```tsx
<Controller
  control={form.control}
  name="agree"
  render={({ field, fieldState }) => (
    <Field>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          id={field.name}
          aria-invalid={fieldState.invalid}
        />
        <FieldLabel htmlFor={field.name}>개인정보 처리방침 동의</FieldLabel>
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## 동적 필드 (useFieldArray)

```tsx
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "emails",
})
// fields.map((f, i) => <Input {...form.register(`emails.${i}.address`)} />)
```

## 서버 에러 주입

서버 검증 실패 시 필드별 에러 표시:
```ts
form.setError("title", { type: "server", message: "이미 존재하는 제목입니다" })
// 전역
form.setError("root.serverError", { type: "server", message: "서버 오류" })
```

## 검증 모드 매트릭스

| mode | 실행 시점 |
|------|-----------|
| `onSubmit` (기본) | 제출 시 |
| `onBlur` | 포커스 아웃 |
| `onChange` | 매 입력 |
| `onTouched` | 첫 blur 이후 onChange 로 전환 |

UX가 중요한 긴 폼은 `onTouched`, 간단한 로그인은 `onSubmit` 권장.

## TanStack Form 레시피 (간단 소개)

- `useForm` API는 다르지만 shadcn Field/FieldLabel/FieldError 재사용 가능.
- `pnpm add @tanstack/react-form` 후 공식 문서 `/docs/forms/tanstack-form` 패턴 사용.
- React 19 의 `useActionState` 기반 서버 액션도 곧 정식 레시피 추가 예정 ("Coming Soon").

## 접근성 체크리스트

- [ ] `<FieldLabel htmlFor={field.name}>` 로 라벨 연결
- [ ] `aria-invalid` 를 입력 요소에 부착
- [ ] 에러 메시지는 시각 + 스크린리더 양쪽 가능하게 `<FieldError>` 사용
- [ ] 키보드만으로 전체 폼 탐색 가능 (Tab 순서 확인)
- [ ] 제출 버튼의 `disabled` 는 로딩 상태에만 사용, 검증 실패만으로 막지 말 것
