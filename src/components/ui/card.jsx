import { cn } from '@/lib/utils'

export function Card({ className, hover = true, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white',
        hover && 'hover:border-zinc-300 hover:shadow-md transition-all duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
