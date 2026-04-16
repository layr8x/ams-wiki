import { cn } from '@/lib/utils'

export const Textarea = ({
  className,
  ...props
}) => (
  <textarea
    className={cn(
      'flex min-h-[100px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
      className
    )}
    {...props}
  />
)

Textarea.displayName = 'Textarea'
