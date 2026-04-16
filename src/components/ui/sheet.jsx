// src/components/ui/sheet.jsx — shadcn/ui 표준 Sheet (슬라이드 드로어)
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet         = Dialog.Root
export const SheetTrigger  = Dialog.Trigger
export const SheetClose    = Dialog.Close
export const SheetPortal   = Dialog.Portal

export function SheetOverlay({ className, ...props }) {
  return (
    <Dialog.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  )
}

const SIDE_STYLES = {
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
  left:  'inset-y-0 left-0  h-full w-3/4 border-r sm:max-w-sm data-[state=open]:slide-in-from-left  data-[state=closed]:slide-out-to-left',
  top:   'inset-x-0 top-0   h-auto border-b data-[state=open]:slide-in-from-top  data-[state=closed]:slide-out-to-top',
  bottom:'inset-x-0 bottom-0 h-auto border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
}

export function SheetContent({ side = 'right', className, children, ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        className={cn(
          'fixed z-50 bg-background p-6 shadow-lg transition ease-in-out',
          'data-[state=open]:duration-300 data-[state=closed]:duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          SIDE_STYLES[side],
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X size={16} />
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  )
}

export function SheetHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
}

export function SheetFooter({ className, ...props }) {
  return <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-6', className)} {...props} />
}

export function SheetTitle({ className, ...props }) {
  return <Dialog.Title className={cn('text-base font-semibold text-foreground', className)} {...props} />
}

export function SheetDescription({ className, ...props }) {
  return <Dialog.Description className={cn('text-sm text-muted-foreground', className)} {...props} />
}
