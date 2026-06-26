import * as React from "react"
import { cn } from "@/shared/lib/utils"

type Variant = "running" | "done" | "failed" | "queued" | 'userFailed'

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: Variant
  children?: React.ReactNode
}

const labels: Record<Variant, string> = {
  running: "Идет",
  done: "Готово",
  failed: "Ошибка",
  queued: "В Очереди",
  userFailed: 'Отменено'
}

const styles: Record<Variant, string> = {
  running: "text-[#ff7a3d] bg-[var(--bg-status-running)]",
  done:  "text-[var(--bg-pill-status-done)] bg-[rgba(16,185,129,0.13)]",
  failed: "text-[var(--bg-pill-status-failed)] bg-[rgba(255,90,90,0.12)]",
  queued: "text-[var(--bg-pill-status-queued)] bg-[var(--bg-status-queue)]",
  userFailed: "text-[var(--text-muted)] bg-[var(--bg-status-userFailed)]"
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ variant, children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "rounded-sm text-[12px] py-1.5 px-2.5",
        styles[variant],
        className
      )}
      {...props}
    >
      {children ?? labels[variant]}
    </span>
  )
)
StatusBadge.displayName = "StatusBadge"
