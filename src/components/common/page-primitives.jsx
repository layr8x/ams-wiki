/**
 * src/components/common/page-primitives.jsx
 * 페이지 전역 공통 레이아웃 프리미티브
 *   - PageShell:     콘텐츠 컨테이너 (max-width + padding)
 *   - PageHeader:    브레드크럼 + H1 + 설명 + 우측 액션 슬롯
 *   - SectionTitle:  섹션 구분자 (h2 + 설명 + 우측 링크)
 *   - StatCard:      dashboard-01 스타일 — 헤더/수치/델타/풋터
 *   - EmptyState:    아이콘 + 문구 + 액션
 */
import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CaretRight as ChevronRight
} from '@phosphor-icons/react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/* ─── PageShell ─── max-width 7xl, 좌우 패딩, 상하 여백 ──────────────── */
export function PageShell({ className, children, maxWidth = '7xl' }) {
  return (
    <div className={cn(
      'mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
      {
        '7xl': 'max-w-7xl',
        '5xl': 'max-w-5xl',
        '3xl': 'max-w-3xl',
      }[maxWidth],
      className,
    )}>
      {children}
    </div>
  )
}

/* ─── PageHeader ─── 페이지 상단 타이틀 블록 ────────────────────────── */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className,
}) {
  return (
    <header className={cn('mb-8 space-y-3', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} className="text-muted-foreground/50" />}
              {b.to ? (
                <Link to={b.to} className="transition-colors hover:text-foreground">
                  {b.label}
                </Link>
              ) : (
                <span className="text-foreground">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  )
}

/* ─── SectionTitle ─── h2 + 우측 "전체 보기" 링크 ─────────────────────── */
export function SectionTitle({
  title,
  description,
  link,
  linkLabel = '전체 보기',
  actions,
  className,
}) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div className="space-y-0.5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {link && (
          <Link
            to={link}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {linkLabel}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  )
}

/* ─── StatCard ─── shadcn dashboard-01 section-card 스타일 재현 ──────── */
/**
 * Props
 *   label:        "월 조회수"
 *   value:        "12,487"  (큰 수치)
 *   delta:        { value: '+12.3%', trend: 'up' | 'down' | 'flat' }
 *   footerTitle:  "이번 달 조회수"
 *   footerDesc:   "전월 대비 증가세"
 */
export function StatCard({ label, value, delta, footerTitle, footerDesc, className }) {
  const trendVariant =
    delta?.trend === 'up'   ? 'success'
  : delta?.trend === 'down' ? 'destructive'
  :                           'outline'

  return (
    <Card className={cn('@container/card', className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {delta && (
          <CardAction>
            <Badge variant={trendVariant} size="sm">
              {delta.value}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {(footerTitle || footerDesc) && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          {footerTitle && (
            <div className="line-clamp-1 font-medium text-foreground">{footerTitle}</div>
          )}
          {footerDesc && (
            <div className="text-muted-foreground">{footerDesc}</div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

/* ─── EmptyState ─── 빈 상태 프레이스홀더 ─────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center',
      className,
    )}>
      {Icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon size={18} className="text-muted-foreground" />
        </div>
      )}
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
