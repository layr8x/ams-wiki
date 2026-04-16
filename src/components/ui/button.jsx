import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const button = cva(
  'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary:  'bg-zinc-900 text-white hover:bg-zinc-700 active:bg-zinc-800 shadow-xs',
        secondary:'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 shadow-xs',
        ghost:    'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        danger:   'bg-red-600 text-white hover:bg-red-700',
        blue:     'bg-blue-600 text-white hover:bg-blue-700 shadow-xs',
        outline:  'border border-zinc-200 text-zinc-700 bg-transparent hover:bg-zinc-50',
      },
      size: {
        xs: 'text-xs px-2.5 py-1.5 gap-1',
        sm: 'text-xs px-3 py-2',
        md: 'text-sm px-4 py-2',
        lg: 'text-sm px-5 py-2.5',
        icon:'w-8 h-8 p-0',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  }
)

export function Button({ variant, size, className, children, ...props }) {
  return <button className={cn(button({ variant, size }), className)} {...props}>{children}</button>
}
