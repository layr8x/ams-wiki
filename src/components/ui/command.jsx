// src/components/ui/command.jsx — shadcn/ui 표준 Command 팔레트
import { cn } from '@/lib/utils'

export function Command({ className, ...props }) {
  return (
    <div
      className={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', className)}
      {...props}
    />
  )
}

export function CommandInput({ className, ...props }) {
  return (
    <div className="flex items-center border-b border-border px-3">
      <input
        className={cn(
          'flex h-10 w-full bg-transparent py-3 text-sm outline-none',
          'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
}

export function CommandList({ className, ...props }) {
  return (
    <div
      className={cn('max-h-[320px] overflow-y-auto overflow-x-hidden', className)}
      {...props}
    />
  )
}

export function CommandEmpty({ className, ...props }) {
  return (
    <div className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...props} />
  )
}

export function CommandGroup({ heading, className, children, ...props }) {
  return (
    <div className={cn('overflow-hidden p-1', className)} {...props}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</div>
      )}
      {children}
    </div>
  )
}

export function CommandItem({ className, selected, onSelect, ...props }) {
  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        selected && 'bg-accent text-accent-foreground',
        className
      )}
      {...props}
    />
  )
}

export function CommandSeparator({ className, ...props }) {
  return <div className={cn('-mx-1 h-px bg-border my-1', className)} {...props} />
}
