// src/components/ui/badge.jsx — shadcn/ui 표준
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:   'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline:     'text-foreground border-border',
        // 가이드 유형 전용
        sop:         'border-blue-200 bg-blue-50 text-blue-700',
        decision:    'border-amber-200 bg-amber-50 text-amber-700',
        reference:   'border-emerald-200 bg-emerald-50 text-emerald-700',
        trouble:     'border-orange-200 bg-orange-50 text-orange-700',
        response:    'border-purple-200 bg-purple-50 text-purple-700',
        policy:      'border-red-200 bg-red-50 text-red-700',
        // 심각도
        critical:    'border-red-300 bg-red-100 text-red-800',
        high:        'border-amber-300 bg-amber-100 text-amber-800',
        medium:      'border-gray-200 bg-gray-100 text-gray-700',
        low:         'border-green-200 bg-green-100 text-green-700',
        // 상태
        safe:        'border-emerald-200 bg-emerald-50 text-emerald-700',
        warn:        'border-amber-200 bg-amber-50 text-amber-700',
        danger:      'border-red-200 bg-red-50 text-red-700',
        // 새 배지
        new:         'border-blue-300 bg-blue-600 text-white',
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

export function Badge({ variant, size, className, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}
