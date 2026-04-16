import { cn } from '@/lib/utils'
import * as TabsPrimitive from '@radix-ui/react-tabs'

export const Tabs = TabsPrimitive.Root

export const TabsList = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-600',
      className
    )}
    {...props}
  />
)

TabsList.displayName = TabsPrimitive.List.displayName

export const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
)

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content
    className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2', className)}
    {...props}
  />
)

TabsContent.displayName = TabsPrimitive.Content.displayName
