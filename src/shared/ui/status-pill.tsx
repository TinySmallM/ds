import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const statusCircleVariants = cva(
  "w-2 h-2 rounded-full shrink-0 animate-pulse",
  {
    variants: {
      variant: {
        queued: "bg-[var(--bg-pill-status-queued)]",
        running: "bg-[var(--bg-pill-status-progress)]", 
        completed: "bg-[var(--bg-pill-status-done)]",
        failed: "bg-[var(--bg-pill-status-failed)]",
        userFailed: ""
      },
    },
    defaultVariants: {
      variant: "queued",
    },
  }
)

const STATUS_LABELS: Record<string, string> = {
  queued: "В очереди",
  running: "Идет",
  completed: "Готово",
  failed: "Ошибка",
}

export type StatusPillProps = React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof statusCircleVariants> & {
    status: 'queued' | 'running' | 'completed' | 'failed' | 'userFailed';
    count?: number;
    children?: React.ReactNode;
  };

const StatusPill = React.forwardRef<HTMLDivElement, StatusPillProps>(
  ({ status, count, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2 font-medium text-sm", className)}
        {...props}
      >
        <span 
          className={cn(
            statusCircleVariants({ variant: status }),
            // Если count передан и равен 0, то гасим анимацию. В остальных случаях всё пульсирует
            count === 0 && "animate-none"
          )} 
        />
        
        <span className="text-[13px] text-muted-foreground font-normal">
          {children ?? STATUS_LABELS[status]}
        </span>
      </div>
    )
  }
)

StatusPill.displayName = "StatusPill"

export { StatusPill }
