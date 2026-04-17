// src/components/ui/badge.jsx — shadcn/ui new-york (다크모드 대응)
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:   'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:     'text-foreground border-border bg-transparent',
        /* 가이드 유형 — 틴티드 팔레트 (라이트/다크 대응) */
        sop:         'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
        decision:    'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        reference:   'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        trouble:     'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300',
        response:    'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
        policy:      'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300',
        /* 심각도 */
        critical:    'border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300',
        high:        'border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300',
        medium:      'border-border bg-muted text-muted-foreground',
        low:         'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        /* 상태 */
        safe:        'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        warn:        'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        danger:      'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300',
        /* NEW 배지 */
        new:         'border-transparent bg-blue-600 text-white dark:bg-blue-500',
      },
      size: {
        sm: 'px-1.5 py-0 text-[10px] leading-4',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  }
)

export function Badge({ variant, size, className, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}
