import { cn } from '@/lib/utils'

export const Select = ({ className, children, ...props }) => (
  <select
    className={cn(
      'flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23333" d="M6 9L1 4h10z"/></svg>\')] bg-right bg-no-repeat pr-8',
      className
    )}
    {...props}
  />
)

Select.displayName = 'Select'
