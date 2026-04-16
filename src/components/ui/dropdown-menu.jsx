// src/components/ui/dropdown-menu.jsx — shadcn/ui 표준 (간략 구현)
import { cn } from '@/lib/utils'

export function DropdownMenu({ children }) {
  return <div className="relative">{children}</div>
}

export function DropdownMenuTrigger({ children, ...props }) {
  return <button {...props}>{children}</button>
}

export function DropdownMenuContent({ className, align = 'end', children, ...props }) {
  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
        align === 'end' ? 'right-0' : 'left-0',
        'top-full mt-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className, ...props }) {
  return (
    <div
      role="menuitem"
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
}

export function DropdownMenuLabel({ className, ...props }) {
  return <div className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
}
