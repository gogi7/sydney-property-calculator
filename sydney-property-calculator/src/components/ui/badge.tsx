import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
      success: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      destructive: "bg-red-100 text-red-800 hover:bg-red-200",
      outline: "border border-slate-300 text-slate-700",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge"

export { Badge }

