// src/components/ui/avatar.jsx — shadcn/ui 표준
import { cn } from '@/lib/utils'

export function Avatar({ className, ...props }) {
  return (
    <span
      className={cn('relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

export function AvatarImage({ src, alt = '', className, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
}

export function AvatarFallback({ className, ...props }) {
  return (
    <span
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}
