// src/components/ui/collapsible.jsx — shadcn/ui 표준
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Collapsible({ open: controlledOpen, onOpenChange, defaultOpen = false, className, children, ...props }) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <div className={className} data-state={isOpen ? 'open' : 'closed'} {...props}>
      {typeof children === 'function' ? children({ isOpen, setOpen }) : children}
    </div>
  )
}

export function CollapsibleTrigger({ onClick, children, ...props }) {
  return (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export function CollapsibleContent({ className, children, ...props }) {
  return (
    <div className={cn('overflow-hidden', className)} {...props}>
      {children}
    </div>
  )
}
