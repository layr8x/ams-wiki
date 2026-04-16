import { cn } from '@/lib/utils'

export const Textarea = ({
  className,
  ...props
}) => (
  <textarea
    className={cn(
      'flex min-h-[100px] w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 resize-none',
      className
    )}
    {...props}
  />
)

Textarea.displayName = 'Textarea'
