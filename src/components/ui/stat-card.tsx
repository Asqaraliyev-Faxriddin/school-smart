import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

export function StatCard({ title, value, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div
      className={cn(
        "animate-fade-in rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-lg",
        variant === "default" && "bg-card",
        variant === "primary" && "gradient-primary text-primary-foreground",
        variant === "success" && "gradient-success text-success-foreground",
        variant === "warning" && "bg-warning text-warning-foreground"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive",
                variant !== "default" && "opacity-90"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            variant === "default"
              ? "bg-primary/10 text-primary"
              : "bg-white/20"
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
