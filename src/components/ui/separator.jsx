import { cn } from '@/lib/utils'

export const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => (
  <div
    role={decorative ? 'none' : 'separator'}
    aria-orientation={orientation}
    className={cn(
      'shrink-0 bg-zinc-200',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
)

Separator.displayName = 'Separator'
