import { cn } from "@/lib/utils";

interface OrderFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

const filters = [
  { id: "all", label: "All Orders" },
  { id: "in-progress", label: "In-progress" },
  { id: "shippers-advice", label: "Shipper's Advice" },
  { id: "delivered", label: "Delivered" },
  { id: "returned", label: "Returned" },
  { id: "cancelled", label: "Cancelled" },
];

export function OrderFilters({ activeFilter, onFilterChange, counts }: OrderFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
            activeFilter === filter.id
              ? "bg-foreground text-background shadow-md"
              : "bg-card text-foreground border border-border hover:border-primary/40 hover:bg-muted"
          )}
        >
          {filter.label}
          <span className={cn(
            "ml-2 text-xs",
            activeFilter === filter.id ? "text-background/70" : "text-muted-foreground"
          )}>
            ({counts[filter.id] || 0})
          </span>
        </button>
      ))}
    </div>
  );
}
