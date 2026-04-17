import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Badge — preset 'bddBV8Q4' base (rounded-none, h-5) + AMS 커스텀 variants
 *   커스텀 variants 는 preset 미학 (각진, flat) 에 맞춰 tinted 배경만 사용
 */
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",

        // AMS 가이드 타입 — flat tinted (preset 미학)
        sop:       "bg-blue-500/10    text-blue-700    dark:text-blue-300    border-blue-500/20",
        decision:  "bg-violet-500/10  text-violet-700  dark:text-violet-300  border-violet-500/20",
        reference: "bg-slate-500/10   text-slate-700   dark:text-slate-300   border-slate-500/20",
        trouble:   "bg-red-500/10     text-red-700     dark:text-red-300     border-red-500/20",
        response:  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        policy:    "bg-amber-500/10   text-amber-700   dark:text-amber-300   border-amber-500/20",

        // 상태
        warning: "bg-amber-500/10   text-amber-700   dark:text-amber-300   border-amber-500/20",
        success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        new:     "bg-primary/10 text-primary border-primary/20",

        // 심각도
        critical: "bg-red-600 text-white border-red-700",
        high:     "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
        medium:   "bg-amber-500/10  text-amber-700  dark:text-amber-300  border-amber-500/20",
        low:      "bg-slate-500/10  text-slate-600  dark:text-slate-300  border-slate-500/20",

        // 판단 결과
        safe:   "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        warn:   "bg-amber-500/10   text-amber-700   dark:text-amber-300   border-amber-500/20",
        danger: "bg-red-500/10     text-red-700     dark:text-red-300     border-red-500/20",
      },
      size: {
        sm: "h-4 px-1.5 text-[10px] [&>svg]:size-2.5!",
        md: "h-5 px-2 text-xs [&>svg]:size-3!",
        lg: "h-6 px-2.5 text-sm [&>svg]:size-3.5!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props} />
  )
}

export { Badge, badgeVariants }
