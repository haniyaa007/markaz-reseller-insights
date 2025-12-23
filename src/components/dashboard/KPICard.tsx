import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function KPICard({ title, value, change, icon: Icon, iconColor = "text-primary", delay = 0 }: KPICardProps) {
  return (
    <div 
      className="bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  change.type === "positive" && "bg-success/10 text-success",
                  change.type === "negative" && "bg-destructive/10 text-destructive",
                  change.type === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                {change.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl bg-secondary", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
