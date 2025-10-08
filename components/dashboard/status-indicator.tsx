import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
}

export function StatusIndicator({ status, size = "md" }: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        "status-indicator",
        {
          "w-2 h-2": size === "sm",
          "w-3 h-3": size === "md",
          "w-4 h-4": size === "lg",
        },
        {
          "status-success": status === "success",
          "status-warning": status === "warning",
          "status-danger": status === "danger",
        },
      )}
    />
  )
}
