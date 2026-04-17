import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "border-transparent [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "border-transparent text-primary underline-offset-4 [a&]:hover:underline",
        /* ─── 가이드 유형별 컬러 뱃지 ─── */
        sop:       "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        decision:  "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        reference: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
        trouble:   "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
        response:  "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        policy:    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
        warning:   "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        success:   "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        new:       "border-transparent bg-blue-600 text-white dark:bg-blue-500",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm:      "px-1.5 py-0 text-[10px]",
        lg:      "px-2.5 py-1 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
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
  );
}

export { Badge, badgeVariants }
