import { cn } from '@/lib/utils'

export const Radio = ({
  className,
  ...props
}) => (
  <input
    type="radio"
    className={cn(
      'h-4 w-4 border border-zinc-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
)

Radio.displayName = 'Radio'
