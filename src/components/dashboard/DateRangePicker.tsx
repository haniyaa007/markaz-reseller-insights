import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const dateRanges = [
  { id: "7days", label: "Last 7 Days" },
  { id: "30days", label: "Last 30 Days" },
  { id: "3months", label: "Last 3 Months" },
  { id: "6months", label: "Last 6 Months" },
  { id: "1year", label: "Last Year" },
  { id: "lifetime", label: "Lifetime" },
];

interface DateRangePickerProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export function DateRangePicker({ selectedRange, onRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = dateRanges.find(r => r.id === selectedRange)?.label || "Last 30 Days";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
          isOpen 
            ? "bg-primary text-primary-foreground border-primary" 
            : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
        )}
      >
        <Calendar className="w-4 h-4" />
        <span>{selectedLabel}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
          <div className="py-2">
            {dateRanges.map((range) => (
              <button
                key={range.id}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  selectedRange === range.id 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-foreground hover:bg-muted"
                )}
                onClick={() => {
                  onRangeChange(range.id);
                  setIsOpen(false);
                }}
              >
                {range.label}
                {selectedRange === range.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
