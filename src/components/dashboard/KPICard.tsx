import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning";
  delay?: number;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  delay = 0 
}: KPICardProps) {
  const isPrimary = variant === "primary";
  
  return (
    <div 
      className={cn(
        "relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 animate-fade-in overflow-hidden group",
        isPrimary 
          ? "gradient-hero text-primary-foreground shadow-glow" 
          : "bg-card border border-border/60 shadow-card hover:shadow-elevated"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Pattern */}
      {isPrimary && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
        </div>
      )}

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className={cn(
            "text-sm font-medium",
            isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl lg:text-3xl font-bold tracking-tight",
            isPrimary ? "text-primary-foreground" : "text-foreground"
          )}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5">
              {change.type === "positive" ? (
                <ArrowUpRight className={cn("w-4 h-4", isPrimary ? "text-primary-foreground" : "text-success")} />
              ) : (
                <ArrowDownRight className={cn("w-4 h-4", isPrimary ? "text-primary-foreground" : "text-destructive")} />
              )}
              <span className={cn(
                "text-sm font-semibold",
                isPrimary 
                  ? "text-primary-foreground" 
                  : change.type === "positive" ? "text-success" : "text-destructive"
              )}>
                {change.value}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-transform group-hover:scale-110",
          isPrimary 
            ? "bg-white/20" 
            : "bg-secondary"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            isPrimary ? "text-primary-foreground" : "text-primary"
          )} />
        </div>
      </div>
    </div>
  );
}
