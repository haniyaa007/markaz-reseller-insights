import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All Orders", count: 370 },
  { id: "in-progress", label: "In-progress", count: 68 },
  { id: "shippers-advice", label: "Shipper's Advice", count: 25 },
  { id: "delivered", label: "Delivered", count: 245 },
  { id: "returned", label: "Returned", count: 17 },
  { id: "cancelled", label: "Cancelled", count: 15 },
];

export function OrderFilters() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
            activeFilter === filter.id
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-foreground border-border hover:border-foreground/30 hover:bg-muted"
          )}
        >
          {filter.label}
          {filter.count > 0 && (
            <span className={cn(
              "ml-2 text-xs",
              activeFilter === filter.id ? "opacity-80" : "text-muted-foreground"
            )}>
              ({filter.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
