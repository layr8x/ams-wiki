import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badge = cva(
  'inline-flex items-center gap-1 font-medium rounded-full transition-colors',
  {
    variants: {
      variant: {
        default:  'bg-zinc-100 text-zinc-700',
        blue:     'bg-blue-50 text-blue-700',
        green:    'bg-green-50 text-green-700',
        orange:   'bg-orange-50 text-orange-700',
        red:      'bg-red-50 text-red-700',
        purple:   'bg-purple-50 text-purple-700',
        solid:    'bg-blue-600 text-white',
        outline:  'border border-zinc-200 text-zinc-600 bg-white',
        new:      'bg-blue-600 text-white animate-pulse',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export function Badge({ variant, size, className, children, ...props }) {
  return <span className={cn(badge({ variant, size }), className)} {...props}>{children}</span>
}
